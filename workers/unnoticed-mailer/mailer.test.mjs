import assert from 'node:assert/strict'
import { test } from 'node:test'
import { handleMailerRequest } from './src/index.js'

const RECIPIENT = 'jeffreylsp@gmail.com'
const SENDER = 'unnoticed@promangofund.com'

function notice(overrides = {}) {
  return {
    title: 'BraveLife',
    url: 'https://bravelife.app/',
    summary: '东京生活模拟网页游戏',
    reviewUrl: 'https://promangofund.com/unnoticed/review',
    ...overrides
  }
}

function post(body, path = '/notify') {
  return new Request(`https://unnoticed-mailer.internal${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  })
}

test('mailer sends only the pinned recipient and sender, with escaped html', async () => {
  const sent = []
  const response = await handleMailerRequest(post(notice({ title: 'A <script> & "name"' })), {
    EMAIL: {
      send: async (message) => {
        sent.push(message)
        return { messageId: 'local-id' }
      }
    }
  })
  assert.equal(response.status, 200)
  assert.equal(sent.length, 1)
  assert.equal(sent[0].to, RECIPIENT)
  assert.equal(sent[0].from, SENDER)
  assert.equal(sent[0].subject, '无人问津：A <script> & "name"')
  assert.equal(sent[0].html.includes('<script>'), false)
  assert.equal(sent[0].html.includes('&lt;script&gt;'), true)
  assert.equal(sent[0].html.includes('&amp;'), true)
  assert.equal(sent[0].html.includes('&#39;'), false)
  assert.equal(sent[0].html.includes('&quot;name&quot;'), true)
  assert.equal(sent[0].text.includes('https://bravelife.app/'), true)
  assert.equal(sent[0].text.includes('https://promangofund.com/unnoticed/review'), true)
})

test('mailer rejects relay fields and does not send', async () => {
  const sent = []
  const env = { EMAIL: { send: async (message) => sent.push(message) } }
  const relay = await handleMailerRequest(
    post({ ...notice(), to: 'other@example.com', from: 'other@promangofund.com', html: '<img src=x>' }),
    env
  )
  assert.equal(relay.status, 400)
  const wrongReview = await handleMailerRequest(post(notice({ reviewUrl: 'https://evil.example/unnoticed/review' })), env)
  assert.equal(wrongReview.status, 400)
  const get = await handleMailerRequest(new Request('https://unnoticed-mailer.internal/notify'), env)
  assert.equal(get.status, 405)
  assert.equal(sent.length, 0)
})

test('mailer send errors stay inside the worker', async () => {
  const response = await handleMailerRequest(post(notice()), {
    EMAIL: {
      send: async () => {
        const error = new Error('recipient rejected')
        error.code = 'E_RECIPIENT_SUPPRESSED'
        throw error
      }
    }
  })
  assert.equal(response.status, 502)
  assert.deepEqual(await response.json(), { ok: false, error: 'send_failed' })
})
