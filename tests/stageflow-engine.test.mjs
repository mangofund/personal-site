import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, applyCommand as apply, settle, displayState } from '../docs/public/live/engine.js';
const now = 1700000000000;
const gift = overrides => ({type:'gift', giftId:'rose', quantity:3, user:'Alice', target:0, rule:'direct', ...overrides});
const started = () => apply(initialState(), {type:'start'}, now);

test('gift quantity, score and undo agree without mutating the prior state', () => {
  const before = started(), after = apply(before, gift(), now+10);
  assert.equal(before.players[0].score, 0);
  assert.equal(after.players[0].score, 30);
  assert.equal(after.giftCount, 3);
  const undone = apply(after, {type:'undo'}, now+20);
  assert.equal(undone.players[0].score, 0);
  assert.equal(undone.giftCount, 0);
  assert.equal(undone.events.at(-1).points, -30);
});
test('a viewer stays on their first team, including prototype-like names', () => {
  let s = apply(started(), gift({rule:'team',user:'__proto__',target:1}), now+1);
  s = apply(s, gift({rule:'team',user:'__proto__',target:2}), now+2);
  assert.equal(s.players[1].score,60); assert.equal(s.players[2].score,0);
  assert.equal(Object.keys(s.teams).length,1);
  s = apply(s,{type:'undo'},now+3);
  s = apply(s,{type:'undo'},now+4);
  assert.equal(Object.keys(s.teams).length,0);
});
test('PK gift mapping cycles through participants and excludes other creators', () => {
  let s = apply(initialState(),{type:'mode',mode:'pk'},now);
  s = apply(s,{type:'start'},now);
  s = apply(s,gift({giftId:'castle',quantity:1,rule:'gift'}),now+1);
  assert.equal(s.players[1].score,520);
  assert.throws(()=>apply(s,gift({target:2}),now+2),/participating/);
  assert.throws(()=>apply(s,{type:'adjust',target:2,delta:10},now+2),/participating/);
});
test('deadline, pause and resume use time rather than timer tick counts', () => {
  let s = apply(started(),{type:'pause'},now+20000);
  assert.equal(s.remaining,160);
  assert.throws(()=>apply(s,gift(),now+30000),/Start or resume/);
  s = apply(s,{type:'start'},now+100000);
  assert.equal(s.deadline,now+260000);
  const ended = settle(s,now+300000);
  assert.equal(ended.status,'ended'); assert.equal(ended.remaining,0);
  assert.throws(()=>apply(s,gift(),now+300000),/Start or resume/);
});
test('next round resets scores, teams and undo while retaining the audit log', () => {
  let s = apply(started(),gift({rule:'team'}),now+1);
  assert.throws(()=>apply(s,{type:'next'},now+2),/End this round/);
  s = apply(s,{type:'end'},now+2);
  assert.throws(()=>apply(s,{type:'undo'},now+3),/read-only/);
  s = apply(s,{type:'next'},now+3);
  assert.equal(s.round,2); assert.equal(s.players[0].score,0);
  assert.deepEqual(s.teams,{}); assert.equal(s.history.length,0);
  assert.equal(s.events.filter(e=>e.kind==='gift').length,1);
});
test('configuration and numeric inputs are validated', () => {
  assert.throws(()=>apply(initialState(),{type:'config',title:'x',duration:0,names:['A','B']}),/Duration/);
  for(const quantity of [0,1000,1.5,NaN,'3']) assert.throws(()=>apply(started(),gift({quantity}),now+1),/quantity/);
  let s = apply(initialState(),{type:'config',title:'Eight',duration:10,names:Array.from({length:8},(_,i)=>`Creator ${i}`)},now);
  assert.equal(s.players.length,8);
  s = apply(s,{type:'adjust',target:0,delta:-100},now);
  assert.equal(s.players[0].score,0);
});
test('display payload does not disclose viewer teams, audit history or request IDs', () => {
  const s = apply(started(),gift({rule:'team'}),now+1);
  const view = displayState(s);
  assert.equal(view.players[0].score,30);
  for(const key of ['teams','events','history','requests']) assert.equal(key in view,false);
});
