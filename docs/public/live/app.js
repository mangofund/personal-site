import { GIFTS, initialState, applyCommand, participants, seconds, settle } from './engine.js';

const $ = id => document.getElementById(id);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const fmt = n => Number(n).toLocaleString('en-US');
const time = n => `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
const colors = ['#b6f36a','#b29bff','#ffb58a','#80c8f6','#f59fd0','#f3d36b','#68d5c0','#d5b3ff'];
const ROOT = new URL('./', location.href), API = new URL('../api/live/', ROOT);
const params = new URLSearchParams(location.search), fragment = new URLSearchParams(location.hash.slice(1));
const overlay = params.get('overlay') === '1';
let lang = params.get('lang') || read('stageflow-language') || 'en';
let s = initialState(), room = null, version = 0, expiresAt = null, cloudAvailable = false;
let busy = false, loading = true, connected = false, lastSync = 0, syncing = false, auto = null, toastTimer;
let pickedGift = 'rose', qty = 1, viewer = 'Starlight', target = 0, rule = 'direct';
let roomError = '', savedControl = read('stageflow-control');
const dictionary = {
  en: { brand:'STAGEFLOW', tagline:'Every spark deserves a spotlight.', intro:'Group live scoring, made for your stage.', demo:'SIMULATED GIFTS · ALPHA', settings:'Stage settings', share:'Display link', create:'Create cloud room', local:'Local sandbox', cloud:'Cloud room', export:'Export log', preview:'Stage preview', ready:'Ready to go', running:'Counting live', paused:'Paused', ended:'Round complete', clockReady:'READY FOR YOUR SPOTLIGHT', clockRun:'ROUND IN PROGRESS', clockPause:'PAUSED · GIFTS DISABLED', clockEnd:'ROUND COMPLETE', regular:'Group scoring', pk:'Duo PK', start:'Start round', resume:'Resume', pause:'Pause', next:'Next round', end:'End', members:'Creators & scores', edit:'Edit lineup', events:'Activity log', undo:'Undo score', empty:'Your stage is ready. Start a round and send a test gift.', simulator:'Gift simulator', user:'Viewer name', rule:'Scoring rule', target:'Support creator', direct:'Selected creator', team:'Follow team', gift:'Gift mapping', giftLabel:'Choose a gift', demoValues:'DEMO POINTS', quantity:'Quantity', send:'Send test gift', auto:'Auto demo', stop:'Stop demo', interval:'Random gifts every 1.5s', overview:'Round overview', total:'Total points', gifts:'Gifts sent', teams:'Viewers on teams', leader:'Leading creator', noTeam:'Not in this PK', player:'Creator', saved:'Local changes saved in this browser', footer:'A PROMANGOFUND EXPERIMENT', tipTitle:'Your browser. Your control room.', tip:'Create a cloud room to sync with OBS, LIVE Studio or another device. This alpha uses test gifts; TikTok is not connected.', directHint:'This gift goes to the creator you selected.', teamHint:'The first gift assigns this viewer to a team. Later gifts follow that team until the next round.', giftHint:'Heart → creator 1, Rose → 2, Star → 3, Castle → 4. Mapping repeats in duo mode.', host:'by Promangofund', back:'Main site ↗', cloudDesc:'Cloud sync · updates about every 2 seconds', offline:'Cloud offline · controls locked', restore:'Reopen your cloud room', fresh:'Return to local demo', loading:'Opening your stage…', unavailable:'Cloud rooms are not enabled here yet. You can use the local sandbox.', shareTitle:'One stage, two different links.', controlLink:'Private control link', displayLink:'Read-only display link', copy:'Copy', open:'Open display ↗', rotate:'Revoke & replace display link', shareHelp:'Paste the display link into an OBS Browser Source or LIVE Studio Link source. It works across devices. Anyone with it can view the stage; only the control link can change scores.', controlHelp:'Keep the control link private. It grants full control of this room.', ttl:'Alpha rooms expire after 7 days. No account or payment required.', createHelp:'Creates a fresh stage with your current lineup. Existing sandbox scores stay on this browser. Up to 5 rooms per day.', createTitle:'Take your stage to the cloud.', cloudOnly:'Create a cloud room first to get a cross-device display link.', title:'Stage name', count:'Creator count', duration:'Round duration (seconds)', save:'Save settings', configHelp:'Edit in a fresh round. Duo PK uses the first two creators.', close:'Close', error:'Could not complete that action.', copied:'Link copied.', expired:'Room unavailable. Check your access link or create a fresh room.', noKey:'This display needs a valid access link from a control room.', latency:'Cloud polling · ~2s', noConnection:'No TikTok connection', sourceHint:'Demo point values are fictional scoring settings, not TikTok gift prices or creator earnings.', endFirst:'End the active round first.', resetTitle:'Start a new round?', resetHelp:'Scores and teams will reset. Activity history is kept.', confirm:'Start next round', cancel:'Cancel', unsupported:'This host only offers the local demo.', adjust:'Adjust score', delta:'Point change (+ / −)', adjustHelp:'Use a positive number to add points or a negative number to subtract.', retry:'Retry', serverChanged:'Another controller updated this room. It has been refreshed; try your action again.', limited:'Only a valid controller can edit this room.', wait:'Saving…', retained:'Last 300 activity records · 50 score undos', cleared:'Local demo reopened.', viewError:'Display disconnected. Reconnecting…', synced:'Cloud synchronized', connection:'Connection', modeLabel:'DEMO DATA', rotateTitle:'Replace the display link?', rotateHelp:'The previous display link will stop working. Update your OBS / LIVE Studio source with the new one.', replace:'Replace link' },
  zh: { brand:'星场', tagline:'让每一份星光，都被看见。', intro:'团播计票工作台，你的舞台由你掌控。', demo:'模拟礼物 · ALPHA', settings:'舞台设置', share:'展示链接', create:'创建云端舞台', local:'本地沙盒', cloud:'云端舞台', export:'导出记录', preview:'舞台实时预览', ready:'准备就绪', running:'计票进行中', paused:'已暂停', ended:'本局结束', clockReady:'等待开场', clockRun:'正在计票', clockPause:'已暂停 · 停止收票', clockEnd:'本局已结束', regular:'常规计票', pk:'双人 PK', start:'开始计票', resume:'继续', pause:'暂停', next:'下一局', end:'结束', members:'主播与票数', edit:'编辑配置', events:'计票动态', undo:'撤销计分', empty:'舞台已就绪，开始计票后即可模拟送礼。', simulator:'模拟送礼', user:'送礼观众', rule:'计票规则', target:'支持主播', direct:'指定主播', team:'站队跟随', gift:'礼物对应', giftLabel:'选择礼物', demoValues:'演示票值', quantity:'数量', send:'模拟送出礼物', auto:'自动演示', stop:'停止演示', interval:'随机送礼 · 每 1.5 秒', overview:'本局概览', total:'累计票数', gifts:'礼物数量', teams:'已站队观众', leader:'当前领先', noTeam:'本局未参赛', player:'主播', saved:'配置和记录保存在当前浏览器', footer:'PROMANGOFUND 的产品实验', tipTitle:'网页即控制台，链接即舞台。', tip:'创建云端舞台后，可与 OBS、LIVE Studio 或另一台设备同步。本版使用模拟礼物，尚未接入 TikTok。', directHint:'本次礼物计入选中的主播。', teamHint:'观众首次送礼时加入所选主播，后续礼物跟随其站队；下一局重置站队。', giftHint:'爱心→1号、玫瑰→2号、星光→3号、城堡→4号；双人模式循环对应。', host:'由 Promangofund 出品', back:'返回官网 ↗', cloudDesc:'云端同步 · 约每 2 秒更新', offline:'云端连接中断 · 暂停操作', restore:'打开上次的云端舞台', fresh:'返回本地演示', loading:'正在打开舞台…', unavailable:'当前环境未启用云端舞台，仍可体验本地沙盒。', shareTitle:'一个舞台，两种权限。', controlLink:'私密控制链接', displayLink:'只读展示链接', copy:'复制', open:'打开展示页 ↗', rotate:'撤销并更换展示链接', shareHelp:'将展示链接粘贴到 OBS 浏览器来源或 LIVE Studio 链接来源，可跨设备同步。持有展示链接的人能看画面，只有控制链接可以改分。', controlHelp:'请保管好控制链接，持有者可完整控制该舞台。', ttl:'Alpha 舞台有效期 7 天，无需账号或付费。', createHelp:'使用当前主播配置创建全新舞台；本地沙盒的票数仍保留在本浏览器。每日最多创建 5 个。', createTitle:'把舞台连接到云端。', cloudOnly:'先创建云端舞台，即可生成跨设备展示链接。', title:'舞台名称', count:'主播人数', duration:'每局时长（秒）', save:'保存配置', configHelp:'请在新一局编辑；双人 PK 使用前两位主播。', close:'关闭', error:'操作未完成。', copied:'链接已复制。', expired:'舞台不可用，请检查访问链接或新建舞台。', noKey:'请从控制台获取完整的展示访问链接。', latency:'云端轮询 · 约 2 秒', noConnection:'TikTok 未连接', sourceHint:'模拟票值仅用于演示计分，不代表 TikTok 礼物售价或主播收益。', endFirst:'请先结束当前局。', resetTitle:'开始下一局？', resetHelp:'将清空本局票数和站队，保留活动记录。', confirm:'进入下一局', cancel:'取消', unsupported:'该站点仅支持本地演示。', adjust:'手动调整票数', delta:'票数变化（+ / −）', adjustHelp:'正数加票，负数减票。', retry:'重试', serverChanged:'另一位场控更新了舞台，已刷新，请重新操作。', limited:'只有控制链接可以修改舞台。', wait:'正在保存…', retained:'保留最近 300 条动态 · 50 次计分撤销', cleared:'已返回本地演示。', viewError:'展示页连接中断，正在重连…', synced:'云端已同步', connection:'连接方式', modeLabel:'模拟数据', rotateTitle:'更换展示链接？', rotateHelp:'旧链接将立即失效，需要在 OBS / LIVE Studio 中更新链接。', replace:'更换链接' }
};
const t = k => (dictionary[lang] || dictionary.en)[k] || k;
function read(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { notify('Browser storage is unavailable. Keep a copy of your control link.'); } }
function notify(message) { $('toast').textContent = message; $('toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('show'), 3500); }
function stopAuto() { clearInterval(auto); auto = null; }
function rememberFields() {
  if (!$('viewer')) return;
  viewer = $('viewer').value; target = Number($('target').value); rule = $('rule').value;
  qty = Math.max(1, Math.min(999, Math.floor(Number($('quantity').value) || 1)));
}
async function request(path, options = {}) {
  const response = await fetch(new URL(path, API), { ...options, headers: {
    ...(room ? { authorization: `Bearer ${room.adminToken || room.viewToken}` } : {}),
    ...(options.body ? { 'content-type': 'application/json' } : {}), ...options.headers
  }, cache: 'no-store', signal: AbortSignal.timeout(10000) });
  const result = await response.json();
  if (!response.ok) { const error = new Error(result.error || t('error')); error.code = result.code; error.status = response.status; throw error; }
  return result;
}
function eventText(e) {
  const d = e.detail;
  if (lang === 'zh') return ({ start:'主持人开始计票', pause:'主持人暂停计票', next:`第 ${e.round} 局准备就绪`, end:`本局结束${d.winners?' · '+d.winners+' 领先':''}`, undo:'主持人撤销上次计分', adjust:`手动调整 → ${d.player}`, gift:`${d.user} 送出 ${d.gift} ×${d.quantity} → ${d.player}` })[e.kind];
  return ({ start:'Host started the round', pause:'Host paused scoring', next:`Round ${e.round} is ready`, end:`Round complete${d.winners?' · '+d.winners+' leads':''}`, undo:'Host undid the last score change', adjust:`Host adjusted ${d.player}`, gift:`${d.user} sent ${d.gift} ×${d.quantity} → ${d.player}` })[e.kind];
}
function stage() {
  const ps = participants(s), max = Math.max(1, ...ps.map(p => p.score)), total = ps.reduce((n,p)=>n+p.score,0);
  return `<div class="stage ${s.mode==='pk'?'pk':''}"><div class="stage-top"><div class="stage-title">${esc(s.title)}<small>EVERY SPARK COUNTS</small></div><span class="round-tag">ROUND ${String(s.round).padStart(2,'0')} · ${s.mode==='pk'?'DUO PK':'GROUP LIVE'}</span></div><div class="clock-wrap"><div class="clock" id="clock">${time(seconds(s))}</div><div class="clock-label">${t({ready:'clockReady',running:'clockRun',paused:'clockPause',ended:'clockEnd'}[s.status])}</div></div><div class="stage-players">${ps.map((p,i)=>`${s.mode==='pk'&&i===1?'<div class="pk-vs">VS</div>':''}<div class="stage-player" style="--c:${colors[p.id]}">${p.score===max?'<span class="crown">♛</span>':''}<div class="portrait">${esc(p.name.slice(0,1))}</div><div class="stage-name">${esc(p.name)}</div><div class="stage-score">${fmt(p.score)}</div><div class="tiny-bar"><i style="width:${p.score/max*100}%"></i></div></div>`).join('')}</div>${s.mode==='pk'?`<div class="pk-track"><i style="width:${total?ps[0].score/total*100:50}%;background:${colors[0]}"></i><i style="flex:1;background:${colors[1]}"></i></div>`:''}<div class="stage-footer"><span>✦ STAGEFLOW LIVE</span><span>${t('modeLabel')}</span></div></div>`;
}
function render() {
  rememberFields(); document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  if (loading) { $('app').innerHTML = `<div class="loading-screen"><div class="brand-icon">✳</div><p>${t('loading')}</p></div>`; return; }
  if (overlay) {
    document.body.classList.add('overlay-only');
    $('app').innerHTML = roomError ? `<div class="overlay-error">${esc(roomError)}</div>` : stage() + (!connected ? `<div class="overlay-error">${t('viewError')}</div>` : '');
    return;
  }
  const total = s.players.reduce((n,p)=>n+p.score,0), rank = [...s.players].sort((a,b)=>b.score-a.score);
  const disabled = busy || Boolean(room && !connected) || Boolean(roomError);
  const blocked = disabled ? 'disabled' : '';
  const g = GIFTS.find(g=>g.id===pickedGift);
  if (!participants(s).some(p=>p.id===target)) target = 0;
  $('app').innerHTML = `<div class="shell"><aside class="rail"><a class="brand-icon" href="${ROOT.href}" aria-label="Stageflow">✳</a><button class="active" aria-label="Scoring workspace">▦</button><button data-action="settings" aria-label="${t('settings')}">⚙</button><button data-action="share" aria-label="${t('share')}">▣</button><div class="rail-bottom">V 0.2</div></aside><main class="main"><header class="topbar"><div class="wordmark">${t('brand')}<span>${t('host')}</span></div><div class="top-actions"><a class="site-link" href="${new URL('../',ROOT).href}">${t('back')}</a><button data-action="language">${lang==='zh'?'EN':'中文'}</button><span class="demo-badge"><i class="dot"></i>${t('demo')}</span></div></header><section class="intro"><div><span class="eyebrow">THE LIVE WORKSPACE</span><h1>${t('tagline')}</h1><p>${t('intro')}</p></div><div class="intro-actions"><button data-action="export">↓ ${t('export')}</button><button class="${room?'':'primary'}" data-action="${room?'share':'create'}" ${!room&&!cloudAvailable?'disabled':''}>${room?'↗':'✦'} ${t(room?'share':'create')}</button></div></section><div class="connection-bar"><span><i class="dot" style="background:${room?(connected?'#b6f36a':'#f1b572'):'#77899d'}"></i>${room?(connected?t('cloudDesc'):t('offline')):t('local')} ${busy?' · '+t('wait'):''}</span><span>${room?`${room.id.slice(0,8)} · `:''}${t('noConnection')}</span>${!room&&savedControl?`<button class="small-link" data-action="restore">${t('restore')} ↗</button>`:''}${room?`<button class="small-link" data-action="local">${t('fresh')}</button>`:''}</div>${roomError?`<div class="error-banner">${esc(roomError)}</div>`:''}<div class="workspace"><div class="left-column"><section class="panel"><div class="panel-header"><h2>▣ ${t('preview')}</h2><span class="status-pill ${s.status==='running'?'running':''}"><i class="dot" style="background:currentColor"></i>${t(s.status)}</span></div><div class="preview-wrap">${stage()}</div><div class="control-bar"><div class="segments"><button data-mode="regular" class="${s.mode==='regular'?'selected':''}" ${blocked}>${t('regular')}</button><button data-mode="pk" class="${s.mode==='pk'?'selected':''}" ${blocked}>${t('pk')}</button></div><div class="play-controls"><button data-action="next" ${blocked}>↻ ${t('next')}</button><button class="primary" data-action="play" ${disabled||s.status==='ended'?'disabled':''}>${s.status==='running'?'Ⅱ':'▶'} ${t(s.status==='running'?'pause':s.status==='paused'?'resume':'start')}</button><button data-action="end" ${disabled||['ready','ended'].includes(s.status)?'disabled':''}>${t('end')}</button></div></div></section><div class="lower-grid"><section class="panel"><div class="panel-header"><h2>${t('members')} <small>/ ${s.players.length}</small></h2><button class="small-link" data-action="settings">${t('edit')} ↗</button></div><div class="members">${rank.map((p,i)=>`<div class="member"><span class="rank-no">${String(i+1).padStart(2,'0')}</span><div class="avatar" style="--c:${colors[p.id]}">${esc(p.name.slice(0,1))}</div><div class="member-info"><strong>${esc(p.name)}</strong><small>${s.mode==='pk'&&p.id>1?t('noTeam'):t('player')+' '+(p.id+1)}</small></div><span class="member-score">${fmt(p.score)}</span><button data-adjust="${p.id}" aria-label="${t('adjust')} ${esc(p.name)}" ${disabled||s.status==='ended'||!participants(s).some(x=>x.id===p.id)?'disabled':''}>±</button></div>`).join('')}</div></section><section class="panel"><div class="panel-header"><h2>${t('events')}</h2><button class="small-link" data-action="undo" ${disabled||!s.history.length||s.status==='ended'?'disabled':''}>↶ ${t('undo')}</button></div><div class="events">${s.events.length?[...s.events].reverse().slice(0,80).map(e=>`<div class="event"><time>${new Date(e.at).toLocaleTimeString(lang==='zh'?'zh-CN':'en-GB',{hour12:false})}</time><span class="event-text">${esc(eventText(e))}</span><em>${e.points>0?'+':''}${e.points?fmt(e.points):'·'}</em></div>`).join(''):`<div class="empty">✧<br>${t('empty')}</div>`}</div></section></div></div><aside class="sidebar"><section class="panel"><div class="panel-header"><h2>✧ ${t('simulator')}</h2><small>SANDBOX</small></div><div class="sim-body"><div class="field-stack"><label>${t('user')}<input id="viewer" maxlength="40" value="${esc(viewer)}"></label><div class="form-grid" style="margin:0;gap:8px"><label>${t('rule')}<select id="rule">${['direct','team','gift'].map(k=>`<option value="${k}" ${rule===k?'selected':''}>${t(k)}</option>`).join('')}</select></label><label>${t('target')}<select id="target">${participants(s).map(p=>`<option value="${p.id}" ${target===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label></div></div><div class="section-label" style="margin-top:18px">${t('giftLabel')}<span>${t('demoValues')}</span></div><div class="gift-grid">${GIFTS.map(g=>`<button class="gift ${g.id===pickedGift?'selected':''}" data-gift="${g.id}" aria-pressed="${g.id===pickedGift}"><span class="emoji">${g.emoji}</span><strong>${g.name}</strong><small>${g.value} ${lang==='zh'?'票':'pts'}</small></button>`).join('')}</div><div class="quantity"><span class="muted" style="flex-shrink:0">${t('quantity')}</span><button data-qty="-1" aria-label="Decrease quantity">−</button><input id="quantity" type="number" min="1" max="999" value="${qty}" aria-label="${t('quantity')}"><button data-qty="1" aria-label="Increase quantity">+</button></div><button class="primary send-btn" data-action="send" ${disabled||s.status!=='running'?'disabled':''}><span>${t('send')} ↗</span><span id="sendValue">+${fmt(g.value*qty)}</span></button><div class="auto-row"><span><i class="dot" style="background:${auto?'#b6f36a':'#657184'}"></i>${t('interval')}</span><button data-action="auto" ${blocked}>${t(auto?'stop':'auto')}</button></div><p class="muted" id="ruleHint" style="font-size:10px;margin-bottom:0">${t(rule+'Hint')}</p></div></section><section class="panel"><div class="panel-header"><h2>${t('overview')}</h2><small>ROUND ${String(s.round).padStart(2,'0')}</small></div><div class="stats-body">${[[fmt(total),'total'],[fmt(s.giftCount),'gifts'],[Object.keys(s.teams).length,'teams'],[total?rank[0].name:'—','leader']].map(([v,k])=>`<div class="stat"><strong>${esc(v)}</strong><span>${t(k)}</span></div>`).join('')}</div></section><div class="tip"><strong>✦ ${t('tipTitle')}</strong>${t('tip')}<p>${t('sourceHint')}</p></div></aside></div><footer class="bottom-note"><span>● ${room?t('cloud')+' · '+new Date(expiresAt).toLocaleDateString():t('saved')}</span><span>${t('footer')}</span></footer></main></div>`;
}

async function refresh() {
  if (!room || busy || syncing) return;
  syncing = true;
  try {
    const data = await request('rooms/'+room.id);
    if (busy) return;
    if (!overlay && data.role !== 'admin') throw new Error(t('limited'));
    const changed = version !== data.version || s.status !== data.state.status || !connected || roomError;
    s = data.state; version = data.version; expiresAt = data.expiresAt; connected = true; roomError = ''; lastSync = Date.now();
    if (s.status !== 'running') stopAuto();
    if (changed) render();
  } catch (error) {
    connected = false; stopAuto();
    if ([401,403,404].includes(error.status)) roomError = error.message;
    render();
  } finally { syncing = false; }
}
async function command(cmd) {
  if (busy || roomError || (room && !connected)) return false;
  busy = true; render();
  try {
    if (room) {
      const options = { method:'POST', body:JSON.stringify({ requestId:crypto.randomUUID(), version, command:cmd }) };
      let data;
      try { data = await request(`rooms/${room.id}/commands`, options); }
      catch (error) {
        if (error.status) throw error;
        // A lost response may have committed. Reuse this ID so a retry cannot double-count.
        data = await request(`rooms/${room.id}/commands`, options);
      }
      s = data.state; version = data.version; lastSync = Date.now();
    } else { s = applyCommand(s, cmd); write('stageflow-local-v2', s); }
    if (s.status !== 'running') stopAuto();
    return true;
  } catch (error) {
    stopAuto();
    if (error.code === 'conflict') { busy = false; await refresh(); notify(t('serverChanged')); }
    else { notify(error.message || t('error')); if (room && !error.status) connected = false; }
    return false;
  } finally { busy = false; render(); }
}
function modal(content) { $('modal').innerHTML = content; $('modal').showModal(); }
function modalHead(title) { return `<div class="dialog-head"><div><span class="eyebrow">STAGEFLOW / ALPHA</span><h2>${title}</h2></div><button type="button" class="icon" data-action="close" aria-label="${t('close')}">×</button></div>`; }
function showSettings() {
  if (s.status !== 'ready' || s.players.some(p=>p.score)) { notify(t('configHelp')); return; }
  modal(`<form id="settingsForm">${modalHead(t('settings'))}<label>${t('title')}<input name="title" maxlength="40" value="${esc(s.title)}" required></label><div class="form-grid"><label>${t('count')}<select name="count">${[2,3,4,5,6,7,8].map(n=>`<option ${s.players.length===n?'selected':''}>${n}</option>`).join('')}</select></label><label>${t('duration')}<input type="number" name="duration" min="10" max="7200" value="${s.duration}" required></label></div><p class="muted">${t('configHelp')}</p><div id="nameFields"></div><div class="dialog-foot"><button class="primary" type="submit">${t('save')}</button></div></form>`);
  names();
}
function names() {
  const count = Number($('settingsForm').elements.count.value), previous = [...$('nameFields').querySelectorAll('input')].map(e=>e.value);
  $('nameFields').innerHTML = Array.from({length:count},(_,i)=>`<label>${t('player')} ${i+1}<input name="player${i}" maxlength="20" value="${esc(previous[i]??s.players[i]?.name??'Creator '+(i+1))}" required></label>`).join('');
}
function link(type) {
  const url = new URL(ROOT); if (type==='view') url.searchParams.set('overlay','1');
  url.searchParams.set('lang',lang);
  url.hash = new URLSearchParams({room:room.id,key:type==='view'?room.viewToken:room.adminToken}).toString();
  return url.href;
}
function showShare() {
  if (!room) { showCreate(); return; }
  modal(`${modalHead(t('shareTitle'))}<p class="muted">${t('shareHelp')}</p><label>${t('displayLink')}<input id="viewLink" value="${esc(room.viewToken?link('view'):'')}" readonly></label><div class="share-actions"><button data-copy="view">${t('copy')}</button><a class="button-link primary" href="${room.viewToken?esc(link('view')):'#'}" target="_blank" rel="noopener">${t('open')}</a></div><p class="muted">${t('controlHelp')}</p><label>${t('controlLink')}<input id="controlLink" value="${esc(link('control'))}" readonly></label><div class="share-actions"><button data-copy="control">${t('copy')}</button><button data-action="rotate">${t('rotate')}</button></div><p class="muted">${t('ttl')}</p>`);
  if (!room.viewToken) {
    $('viewLink').value = lang==='zh'?'请更换展示链接以获取新链接':'Replace the display link to get a new one.';
    $('modal').querySelector('[data-copy="view"]').disabled = true;
    $('modal').querySelector('a').removeAttribute('href');
  }
}
function showCreate() {
  if (!cloudAvailable) { notify(t('unavailable')); return; }
  modal(`${modalHead(t('createTitle'))}<p class="muted">${t('createHelp')}</p><p class="muted">${t('ttl')}</p><div class="dialog-foot"><button data-action="create-confirm" class="primary">${t('create')}</button></div>`);
}
async function createRoom() {
  if (busy) return; busy = true; $('modal').close(); render();
  try {
    const data = await request('rooms', {method:'POST',body:JSON.stringify({config:{title:s.title,duration:s.duration,names:s.players.map(p=>p.name)}})});
    room = { id:data.id, adminToken:data.adminToken, viewToken:data.viewToken };
    write('stageflow-control',room); savedControl = room; s = data.state; version = data.version; expiresAt = data.expiresAt;
    connected = true; lastSync = Date.now(); stopAuto(); history.replaceState(null,'',link('control')); showShare();
  } catch (error) { notify(error.message||t('error')); }
  finally { busy = false; render(); }
}
function send(random = false) {
  rememberFields(); const ps = participants(s), giftId = random?GIFTS[Math.floor(Math.random()*GIFTS.length)].id:pickedGift;
  return command({type:'gift',giftId,quantity:random?Math.ceil(Math.random()*4):qty,user:random?['Moonbeam','Starlight','Nova','Afterglow'][Math.floor(Math.random()*4)]:viewer,target:random?ps[Math.floor(Math.random()*ps.length)].id:target,rule});
}
function exportLog() {
  const rows = [['Round','Time','Event','Point change'], ...s.events.map(e=>[e.round,new Date(e.at).toISOString(),eventText(e),e.points])];
  const csv = '\ufeff'+rows.map(row=>row.map(v=>'"'+String(v).replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"').join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})), a = document.createElement('a');
  a.href = url; a.download = `stageflow-round-${s.round}.csv`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function copy(type) {
  try { await navigator.clipboard.writeText(link(type)); notify(t('copied')); }
  catch { const field = $(type==='view'?'viewLink':'controlLink'); field.focus(); field.select(); notify(lang==='zh'?'链接已选中，请手动复制。':'Link selected. Copy it manually.'); }
}
document.addEventListener('click',async e=>{
  const b = e.target.closest('button'); if (!b || b.disabled) return; rememberFields();
  if (b.dataset.gift) { pickedGift=b.dataset.gift; render(); return; }
  if (b.dataset.qty) { qty=Math.max(1,Math.min(999,qty+Number(b.dataset.qty))); render(); return; }
  if (b.dataset.mode) { await command({type:'mode',mode:b.dataset.mode}); return; }
  if (b.dataset.copy) { await copy(b.dataset.copy); return; }
  if (b.dataset.adjust!==undefined) {
    modal(`<form id="adjustForm" data-target="${b.dataset.adjust}">${modalHead(t('adjust'))}<p class="muted">${t('adjustHelp')}</p><label>${t('delta')}<input name="delta" type="number" min="-1000000" max="1000000" step="1" value="10" required></label><div class="dialog-foot"><button class="primary" type="submit">${t('save')}</button></div></form>`); return;
  }
  switch(b.dataset.action) {
    case 'language': lang=lang==='en'?'zh':'en'; write('stageflow-language',lang); render(); break;
    case 'settings': showSettings(); break;
    case 'share': showShare(); break;
    case 'close': $('modal').close(); break;
    case 'create': showCreate(); break;
    case 'create-confirm': await createRoom(); break;
    case 'send': await send(); break;
    case 'play': await command({type:s.status==='running'?'pause':'start'}); break;
    case 'end': await command({type:'end'}); break;
    case 'next':
      if (['running','paused'].includes(s.status)) { notify(t('endFirst')); break; }
      if (s.players.some(p=>p.score)) modal(`${modalHead(t('resetTitle'))}<p class="muted">${t('resetHelp')}</p><div class="dialog-foot"><button data-action="next-confirm" class="primary">${t('confirm')}</button></div>`);
      else await command({type:'next'}); break;
    case 'next-confirm': $('modal').close(); await command({type:'next'}); break;
    case 'undo': await command({type:'undo'}); break;
    case 'export': exportLog(); break;
    case 'rotate': modal(`${modalHead(t('rotateTitle'))}<p class="muted">${t('rotateHelp')}</p><div class="dialog-foot"><button class="primary" data-action="rotate-confirm">${t('replace')}</button></div>`); break;
    case 'rotate-confirm':
      try { const data=await request(`rooms/${room.id}/rotate`,{method:'POST'}); room.viewToken=data.viewToken; write('stageflow-control',room); showShare(); } catch(error){notify(error.message);} break;
    case 'auto':
      if (auto) { stopAuto(); render(); break; }
      if (s.status==='ended') { notify(t('endFirst')); break; }
      if (s.status!=='running' && !await command({type:'start'})) break;
      auto=setInterval(()=>{if(!busy&&!syncing&&s.status==='running')void send(true);},1500); render(); break;
    case 'restore': location.href=(()=>{const url=new URL(ROOT);url.hash=new URLSearchParams({room:savedControl.id,key:savedControl.adminToken});return url.href;})(); break;
    case 'local': stopAuto();room=null;roomError='';s=read('stageflow-local-v2')||initialState();history.replaceState(null,'',ROOT.href);render();break;
  }
});
document.addEventListener('input',e=>{if(e.target.id==='quantity'){rememberFields();$('sendValue').textContent='+'+fmt(GIFTS.find(g=>g.id===pickedGift).value*qty);}});
document.addEventListener('change',e=>{if(e.target.name==='count')names();if(e.target.id==='rule'){rule=e.target.value;$('ruleHint').textContent=t(rule+'Hint');}});
document.addEventListener('submit',async e=>{
  e.preventDefault(); const f=e.target;
  if(f.id==='settingsForm') {const count=Number(f.elements.count.value);if(await command({type:'config',title:f.elements.title.value,duration:Number(f.elements.duration.value),names:Array.from({length:count},(_,i)=>f.elements['player'+i].value)}))$('modal').close();}
  if(f.id==='adjustForm') {if(await command({type:'adjust',target:Number(f.dataset.target),delta:Number(f.elements.delta.value)}))$('modal').close();}
});
async function init() {
  if (fragment.has('room')) {
    const id=fragment.get('room'), key=fragment.get('key');
    if(!/^[a-f0-9-]{36}$/.test(id)||!/^[a-f0-9]{64}$/.test(key||''))roomError=t('noKey');
    else { const stored=read('stageflow-control');room=overlay?{id,viewToken:key}:{id,adminToken:key,viewToken:stored?.id===id?stored.viewToken:undefined};await refresh(); }
  } else if(overlay)roomError=t('noKey');
  else {try{s=settle(read('stageflow-local-v2')||initialState());}catch{s=initialState();}}
  if(!overlay)try {const status=await request('status');cloudAvailable=status.cloud===true;}catch{cloudAvailable=false;}
  loading=false;render();
}
setInterval(()=>{
  if(s.status==='running'&&seconds(s)===0){s=overlay?{...s,status:'ended',remaining:0,deadline:null}:settle(s);stopAuto();if(!room)write('stageflow-local-v2',s);render();}
  else if($('clock'))$('clock').textContent=time(seconds(s));
  if(room&&connected&&Date.now()-lastSync>15000){connected=false;stopAuto();render();}
},250);
setInterval(()=>void refresh(),2000);
window.addEventListener('beforeunload',stopAuto);
render();void init();
