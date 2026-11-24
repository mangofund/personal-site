const account = 'thsottiaux'
const epoch = 1288834974657n

export const codexProfile = 'https://x.com/' + account

export function codexPost(id, kind) {
  const date = new Date(Number((BigInt(id) >> 22n) + epoch) + 8 * 3600000).toISOString().slice(0, 10)
  return { id, date, kind, url: codexProfile + '/status/' + id }
}

export const initialCodex = {
  checked: null,
  posts: [
    codexPost('2120999993079451919', 'credit'),
    codexPost('2114237083652882932', 'reset'),
    codexPost('2112432076767289678', 'reset'),
    codexPost('2109873287853707513', 'reset')
  ]
}

export function resetKind(text) {
  const sentences = text.toLowerCase().split(/(?<=[.!?])\s+|\n+/)
  for (const sentence of sentences) {
    if (/\bbanked reset (?:has been |was )?(?:activated|issued|credited|added|granted)\b/.test(sentence)) return 'credit'
    if (/\bbanked\b|\b(?:will|can|may|might|should|could|not|yet|tomorrow|soon|if)\b|\?/.test(sentence)) continue
    const subject = /\b(?:codex|(?:rate |usage |weekly |5[- ]hour )?limits?|quota|global reset)\b/
    const completed = /\b(?:we (?:have )?(?:just )?reset\b|(?:limits?|quota|reset) (?:have been|has been|were|was|are now|is now) (?:fully )?(?:reset|processed|propagated|complete|done)\b|reset (?:is |has )?(?:now )?(?:done|complete|all propagated)\b)/
    if (subject.test(sentence) && completed.test(sentence)) return 'reset'
  }
  return null
}

async function direct(token) {
  const query = new URLSearchParams({ query: 'from:thsottiaux reset -is:retweet', max_results: '25', 'tweet.fields': 'note_tweet' })
  const response = await fetch('https://api.x.com/2/tweets/search/recent?' + query, {
    headers: { Authorization: 'Bearer ' + token }, signal: AbortSignal.timeout(4000)
  })
  if (!response.ok) throw new Error('X search unavailable')
  const data = await response.json()
  if (data.errors?.length) throw new Error('X search returned errors')
  return (data.data || []).flatMap(({ id, text, note_tweet }) => {
    const kind = resetKind(note_tweet?.text || text)
    return kind ? [codexPost(id, kind)] : []
  })
}

// Discover original post permalinks through a public index when direct API access is unavailable.
async function indexed(remote) {
  const response = await remote('https://opentherank.com/codex-reset/')
  const stack = [], posts = new Map()
  let links = 0
  await new HTMLRewriter()
    .on('li', {
      element(element) {
        const row = { ids: new Set(), text: '' }
        stack.push(row)
        element.onEndTag(() => {
          stack.pop()
          if (row.ids.size !== 1) return
          const [id] = row.ids
          const kind = resetKind(row.text) ??
            (/@thsottiaux\s*reset\s*(?:mon|tue|wed|thu|fri|sat|sun)\b/i.test(row.text) ? 'reset' : null)
          if (kind) posts.set(id, codexPost(id, kind))
        })
      },
      text(chunk) {
        if (stack.length) stack.at(-1).text += chunk.text
      }
    })
    .on('li a[href]', {
      element(element) {
        const href = element.getAttribute('href')
        const match = /^https:\/\/(?:x|twitter)\.com\/thsottiaux\/status\/(\d{15,20})(?:[?#].*)?$/i.exec(href)
        if (match && stack.length) {
          links++
          stack.at(-1).ids.add(match[1])
        }
      }
    }).transform(response).arrayBuffer()
  if (!links) throw new Error('X post index unavailable')
  return [...posts.values()]
}

export async function refreshCodex(previous, token, remote, today) {
  let posts, via
  if (token) {
    try {
      posts = await direct(token)
      via = 'x'
    } catch {
      // The public index still links to the author's original X posts.
    }
  }
  if (!posts) {
    posts = await indexed(remote)
    via = 'index'
  }
  const byId = new Map([...previous.posts, ...posts].map(post => [post.id, post]))
  return { checked: today(), via, posts: [...byId.values()].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 60) }
}
