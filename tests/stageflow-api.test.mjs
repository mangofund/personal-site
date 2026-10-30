import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const base = process.env.LIVE_API_TEST_URL || 'http://localhost:8788';
const origin = new URL(base).origin;
if (!['localhost','127.0.0.1'].includes(new URL(base).hostname) && !/^feat-stageflow-live\.[a-z0-9-]+\.pages\.dev$/.test(new URL(base).hostname)) {
  throw new Error('Run these tests only against a local server or the Stageflow branch preview.');
}
async function call(path, {key, body, method = body ? 'POST' : 'GET', crossOrigin = false} = {}) {
  const res = await fetch(`${base}/api/live/${path}`, {method,headers:{
    ...(key?{authorization:`Bearer ${key}`} : {}),
    ...(body?{'content-type':'application/json',origin:crossOrigin?'https://untrusted.example':origin} : {})
  },...(body?{body:JSON.stringify(body)}:{})});
  return {status:res.status, data:await res.json()};
}
test('cloud rooms enforce authority, concurrency, replay safety and view-link revocation', async () => {
  const created = await call('rooms',{body:{config:{title:'API Test Room',duration:180,names:['A','B','C']}}});
  assert.equal(created.status,201,JSON.stringify(created.data));
  const {id,adminToken,viewToken} = created.data, endpoint=`rooms/${id}`;
  const anon = await call(endpoint); assert.equal(anon.status,401);
  const wrong = await call(endpoint,{key:'0'.repeat(64)}); assert.equal(wrong.status,403);
  const viewer = await call(endpoint,{key:viewToken}); assert.equal(viewer.status,200);
  assert.equal(viewer.data.role,'viewer');
  for(const secret of ['teams','history','requests','events','adminToken'])assert.equal(secret in viewer.data.state,false);
  const cmd = {version:0,requestId:randomUUID(),command:{type:'start'}};
  assert.equal((await call(endpoint+'/commands',{key:viewToken,body:cmd})).status,403);
  assert.equal((await call(endpoint+'/commands',{key:adminToken,body:cmd,crossOrigin:true})).status,403);
  assert.equal((await call(endpoint+'/commands',{key:adminToken,body:cmd})).status,200);
  const replay = await call(endpoint+'/commands',{key:adminToken,body:cmd});
  assert.equal(replay.status,200);assert.equal(replay.data.duplicate,true);assert.equal(replay.data.version,1);
  const stale=await call(endpoint+'/commands',{key:adminToken,body:{version:0,requestId:randomUUID(),command:{type:'pause'}}});
  assert.equal(stale.status,409);
  const gift = {version:1,requestId:randomUUID(),command:{type:'gift',giftId:'rose',quantity:3,user:'Viewer',target:1,rule:'direct'}};
  const counted=await call(endpoint+'/commands',{key:adminToken,body:gift});assert.equal(counted.data.state.players[1].score,30);
  const duplicate=await call(endpoint+'/commands',{key:adminToken,body:gift});assert.equal(duplicate.data.state.players[1].score,30);
  const attempts=await Promise.all([0,1].map(()=>call(endpoint+'/commands',{key:adminToken,body:{version:2,requestId:randomUUID(),command:{type:'adjust',target:1,delta:5}}})));
  assert.deepEqual(attempts.map(x=>x.status).sort(),[200,409]);
  assert.equal((await call(endpoint,{key:viewToken})).data.state.players[1].score,35);
  assert.equal((await call(endpoint+'/rotate',{key:viewToken,body:{}})).status,403);
  const rotated=await call(endpoint+'/rotate',{key:adminToken,body:{}});assert.equal(rotated.status,200);
  assert.equal((await call(endpoint,{key:viewToken})).status,403);
  assert.equal((await call(endpoint,{key:rotated.data.viewToken})).status,200);
  console.log('Verified: read-only access, no raw secrets, same-origin writes, command replay, concurrent updates and display-link revocation.');
});
