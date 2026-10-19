/* ===== بيثيل اسمارت: الحساب الشخصي، الشات، الإشعارات، الاشتراكات، ترحيب الموظفين، ساعات الشغل =====
   Loaded after ui.js. Extends its state, listeners and views. */

TABS.owner=[['companies','الشركات'],['notices','الإشعارات'],['welcome','رسالة الترحيب']];
ICON.notices='<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>';
ICON.chat='<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>';
TILE.notices=['#FF8A7A','#C8432F'];TILE.chat=['#5B9BFF','#2457C5'];

const _emptyState=emptyState;
emptyState=function(){return {..._emptyState(),threads:{},notices:[],staffWelcome:null,profile:null,welcomeImg:'',welcomeAt:0}};

/* ---------- config doc: keep image + date with the welcome text ---------- */
const _specs=Sync.specs;
Sync.specs=function(){const a=_specs.call(this);const c=a.find(x=>x.name==='config');
 if(c)c.items=()=>[['app',{welcomeText:S.welcomeText,welcomeImg:S.welcomeImg||'',welcomeAt:S.welcomeAt||0}]];return a};

/* ---------- extra listeners ---------- */
const _start=Sync.start;
Sync.start=function(){_start.call(this);const F=FB,r=ME.role;
 this.on('config2',F.doc('config','app'),s=>{const d=s.exists()?s.data():{};S.welcomeImg=d.welcomeImg||'';S.welcomeAt=d.welcomeAt||0;
  this.track('config',[['app',{welcomeText:S.welcomeText,welcomeImg:S.welcomeImg,welcomeAt:S.welcomeAt}]])});
 this.on('profile',F.doc('users',ME.uid),s=>{S.profile=s.exists()?s.data():null});
 this.on('notices',F.col('notices'),s=>{S.notices=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.at||0)-(a.at||0))});
 if(r==='owner'){const watched=new Set();
  this.on('co-threads',F.col('companies'),s=>{s.docs.forEach(d=>{if(watched.has(d.id))return;watched.add(d.id);
   this.on('th_'+d.id,F.doc('companies',d.id,'chats','owner'),t=>{S.threads[d.id]=t.exists()?t.data():null})})});
  return}
 const co=ME.companyId;
 this.on('staffWelcome',F.doc('companies',co,'settings','welcome'),s=>{S.staffWelcome=s.exists()?s.data():null});
 if(r==='manager'){
  this.on('th_owner',F.doc('companies',co,'chats','owner'),t=>{S.threads.owner=t.exists()?t.data():null});
  this.on('threads',F.col('companies',co,'chats'),s=>{s.docs.forEach(d=>{if(d.id!=='owner')S.threads[d.id]=d.data()})});
 }else this.on('th_me',F.doc('companies',co,'chats',ME.uid),t=>{S.threads[ME.uid]=t.exists()?t.data():null});
};

/* ---------- helpers ---------- */
const myName=()=>(S.profile&&S.profile.name)||(ME.role==='owner'?'رأفت سعيد':isRep()?me().name:isAcc()?(Acc(V.role)||{}).name:(S.company&&S.company.manager))||'';
const unread=t=>!!(t&&t.lastAt&&t.lastFrom!==ME.uid&&(((t.readAt||{})[ME.uid])||0)<t.lastAt);
function myNotices(){if(!ME)return [];if(ME.role==='owner')return S.notices;
 return S.notices.filter(n=>(n.to==='all'||(n.to||[]).includes(ME.companyId))&&(n.audience==='all'||ME.role==='manager'))}
const seenKey=()=>'bs_seen_n_'+(ME&&ME.uid);
function seenNotices(){try{return JSON.parse(localStorage.getItem(seenKey())||'[]')}catch(e){return []}}
function markNoticesSeen(){try{localStorage.setItem(seenKey(),JSON.stringify(myNotices().map(n=>n.id).slice(0,200)))}catch(e){}}
const unseenNotices=()=>{if(ME.role==='owner')return [];const s=new Set(seenNotices());return myNotices().filter(n=>!s.has(n.id))};
function unreadChats(){if(!ME)return 0;if(ME.role==='owner')return S.companies.filter(c=>unread(S.threads[c.id])).length;
 return Object.entries(S.threads).filter(([k,t])=>unread(t)).length}
const timeAgo=ms=>{const d=new Date(ms);return d.toLocaleDateString('ar-EG',{day:'numeric',month:'short'})+' · '+d.toLocaleTimeString('ar-EG',{hour:'numeric',minute:'2-digit'})};
function brandFoot(){return `<div class="brandfoot"><img src="logo-mark.png" alt=""><span>بيثيل اسمارت</span></div>`}
const paras=t=>esc(t||'').split(/\n\s*\n/).map(p=>`<p>${p.replace(/\n/g,'<br>')}</p>`).join('');

/* ---------- welcome messages (owner → companies, company → staff) ---------- */
welcomeHTML=function(){return `<div class="welcome"><div class="plate"><img src="${LOGO_FULL}" alt="بيثيل للتدريب والتطوير"></div>
 <h2>أهلاً بيك في بيثيل اسمارت</h2>${S.welcomeImg?`<img class="hero" src="${S.welcomeImg}" alt="">`:''}
 <div class="body">${paras(S.welcomeText)}</div>
 <div class="sign"><span class="sub">مع خالص التحية،</span><span class="who">رأفت سعيد</span><a href="https://rafatsaeed.com" target="_blank" rel="noopener">rafatsaeed.com</a></div>${brandFoot()}</div>`};
function staffWelcomeHTML(w){w=w||S.staffWelcome||{};const co=S.company||{};
 return `<div class="welcome">${w.img?`<img class="hero" src="${w.img}" alt="">`:`<div class="plate"><img src="${LOGO_FULL}" alt=""></div>`}
 <h2>أهلاً بيك في ${esc(co.name||'الشركة')}</h2><div class="body">${paras(w.text||'')}</div>
 <div class="sign"><span class="sub">مع خالص التحية،</span><span class="who">${esc(w.by||co.manager||co.name||'')}</span></div>${brandFoot()}</div>`}
maybeWelcome=function(){const k='bs_w_'+ME.uid;let seen=0;try{seen=+localStorage.getItem(k)||0}catch(e){}
 setTimeout(()=>{if(!ME)return;let shown=false;
  if(ME.role==='manager'){const at=S.welcomeAt||1;if(at>seen){showWelcome();shown=true;try{localStorage.setItem(k,String(at))}catch(e){}}
   const c=S.company;if(!shown&&c&&c.warning&&c.warning.text&&c.active!==false){showWarning();shown=true}}
  if((ME.role==='rep'||ME.role==='acc')&&S.staffWelcome&&(S.staffWelcome.text||S.staffWelcome.img)){const at=S.staffWelcome.at||1;
   if(at>seen){sheet(staffWelcomeHTML()+`<button class="btn pri big" onclick="closeSheet()">يلا نبدأ</button>`);shown=true;try{localStorage.setItem(k,String(at))}catch(e){}}}
  if(!shown){const n=unseenNotices()[0];if(n)showNotice(n)}},1500)};
function showWarning(){const w=(S.company||{}).warning||{};
 sheet(`<div class="note bad" style="font-size:15px"><b>تنبيه من إدارة البرنامج</b></div><div class="welcome"><div class="body">${paras(w.text)}</div>${brandFoot()}</div>
 <button class="btn pri big" onclick="openChat('${ME.companyId}','owner')">${tile('chat')}كلّم إدارة البرنامج</button><button class="btn" onclick="closeSheet()">تمام</button>`)}
function showNotice(n){const s=new Set(seenNotices());s.add(n.id);try{localStorage.setItem(seenKey(),JSON.stringify([...s].slice(-200)))}catch(e){}
 sheet(`<div class="row nowrap">${tile('notices')}<div><h3>${esc(n.title||'إشعار')}</h3><div class="sub">${n.from==='owner'?'من إدارة البرنامج':''} · ${timeAgo(n.at)}</div></div></div>
 ${n.type==='warning'?'<div class="note bad">إنذار بخصوص الاشتراك</div>':''}<div class="welcome"><div class="body">${paras(n.body)}</div>${brandFoot()}</div>
 <button class="btn pri big" onclick="closeSheet();scheduleRender()">تمام</button>`)}

/* ---------- my account: name, phone, photo, password ---------- */
let PF={};
function profileForm(){const p=S.profile||{};PF={photo:p.photo||'',name:p.name||myName(),phone:p.phone||''};
 sheet(`<h3>تعديل بياناتي</h3>
 <div class="row nowrap"><span id="pfAv">${avatar({name:PF.name,photo:PF.photo},'lg')}</span>
  <label class="btn sm">${PF.photo?'تغيير الصورة':'+ إضافة صورة'}<input type="file" accept="image/*" hidden onchange="readImg(this,320,u=>{PF.photo=u;$('#pfAv').innerHTML=avatar({name:PF.name,photo:u},'lg')})"></label></div>
 <label class="f">الاسم<input id="pfn" value="${esc(PF.name)}"></label>
 <label class="f">رقم الموبايل<input id="pfp" inputmode="tel" dir="ltr" value="${esc(PF.phone)}" placeholder="01xxxxxxxxx"></label>
 <div class="sub" dir="ltr" style="text-align:right">${esc(ME.email)}</div>
 <button class="btn pri big" onclick="saveProfile()">حفظ</button>
 <button class="btn" onclick="passForm()">تغيير كلمة السر</button>`)}
function saveProfile(){const d={name:$('#pfn').value.trim(),phone:$('#pfp').value.trim(),photo:PF.photo||''};if(!d.name)return toast('اكتب اسمك');
 const p=ME.role==='owner'&&!S.profile?FB.setDoc(FB.doc('users',ME.uid),{...d,role:'owner',email:ME.email,active:true}):FB.updateDoc(FB.doc('users',ME.uid),d);
 S.profile={...(S.profile||{}),...d};if(isRep()){Object.assign(me(),d)}
 p.then(()=>toast('اتحفظت بياناتك')).catch(e=>Sync.fail(e));closeSheet();render()}
function passForm(){sheet(`<h3>تغيير كلمة السر</h3>
 <label class="f">كلمة السر الحالية<input id="pc" type="password" dir="ltr" autocomplete="current-password"></label>
 <label class="f">كلمة السر الجديدة<input id="pn1" type="password" dir="ltr" autocomplete="new-password" minlength="6"></label>
 <label class="f">اكتب الجديدة تاني<input id="pn2" type="password" dir="ltr" autocomplete="new-password"></label>
 <button class="btn pri big" id="pcb" onclick="doPass()">غيّر كلمة السر</button>`)}
async function doPass(){const c=$('#pc').value.trim(),a=$('#pn1').value.trim(),b=$('#pn2').value.trim();if(a.length<6)return toast('كلمة السر لازم ٦ حروف على الأقل');if(a!==b)return toast('الكلمتين مش زي بعض');
 const btn=$('#pcb');btn.disabled=true;try{await FB.changePassword(c,a);if(ME.role!=='owner')FB.setDoc(FB.doc('secrets',ME.uid),{pass:a,email:ME.email,at:Date.now()}).catch(()=>{});closeSheet();toast('اتغيرت كلمة السر')}catch(e){btn.disabled=false;toast(authErr(e))}}
userMenu=function(){if(!ME)return;const q=typeof myQueue==='function'&&ME.role==='rep'?myQueue().length:0;const p=S.profile||{};
 const roleAr={owner:'صاحب البرنامج',manager:'صاحب الشركة',rep:'مندوب',acc:'موظف حسابات'}[ME.role];
 sheet(`<div class="row nowrap">${avatar({name:myName(),photo:p.photo},'lg')}<div style="min-width:0"><h3>${esc(myName())}</h3><div class="sub">${roleAr}${S.company&&ME.role!=='owner'?' · '+esc(S.company.name):''}</div><div class="sub" dir="ltr" style="text-align:right">${esc(ME.email)}</div></div></div>
 ${q?`<div class="note bad">عندك ${fmt(q)} زيارة لسه ما اتبعتتش. استنى لما النت يرجع قبل ما تخرج، علشان متضيعش.</div>`:''}
 <button class="btn" onclick="profileForm()">✏️ تعديل بياناتي وصورتي</button>
 <button class="btn" onclick="passForm()">🔒 تغيير كلمة السر</button>
 ${ME.role==='rep'||ME.role==='acc'?`<button class="btn" onclick="openChat('${ME.companyId}','${ME.uid}')">${tile('chat')}شات مع المدير ${unread(S.threads[ME.uid])?'<span class="dotn">جديد</span>':''}</button>`:''}
 ${(ME.role==='rep'||ME.role==='acc')&&S.staffWelcome&&(S.staffWelcome.text||S.staffWelcome.img)?`<button class="btn" onclick="sheet(staffWelcomeHTML()+'<button class=&quot;btn&quot; onclick=&quot;closeSheet()&quot;>رجوع</button>')">رسالة الترحيب</button>`:''}
 ${ME.role==='manager'?`<button class="btn" onclick="openChat('${ME.companyId}','owner')">${tile('chat')}كلّم إدارة البرنامج ${unread(S.threads.owner)?'<span class="dotn">جديد</span>':''}</button>`:''}
 <button class="btn danger big" onclick="logoutWith('');closeSheet()">تسجيل خروج</button>
 <div class="sub" style="text-align:center">بيثيل اسمارت · نسخة 1.1</div>`)};

/* ---------- chat ---------- */
let CHAT=null;
const _closeSheet=closeSheet;
closeSheet=function(){if(CHAT&&CHAT.unsub){try{CHAT.unsub()}catch(e){}}CHAT=null;_closeSheet()};
function chatTitle(co,t){if(t==='owner')return ME.role==='owner'?((S.companies.find(c=>c.id===co)||{}).name||'الشركة'):'إدارة البرنامج';
 if(ME.role==='manager'){const u=R(t).name!=='؟'?R(t):Acc(t);return u?u.name:'موظف'}return 'المدير'}
function openChat(co,t){closeSheet();const path=['companies',co,'chats',t];CHAT={co,t,path,msgs:[]};
 sheet(`<div class="row nowrap">${tile('chat')}<div><h3>${esc(chatTitle(co,t))}</h3><div class="sub">شات داخل البرنامج</div></div></div>
 <div class="chat" id="chatBox"><div class="empty">بنحمّل الرسايل...</div></div>
 <form class="chatbar" onsubmit="event.preventDefault();sendMsg()"><textarea id="chatIn" rows="1" placeholder="اكتب رسالتك..." oninput="this.style.height='auto';this.style.height=Math.min(120,this.scrollHeight)+'px'"></textarea><button class="btn pri" type="submit">إرسال</button></form>`);
 CHAT.unsub=FB.onSnapshot(FB.query(FB.col(...path,'messages'),FB.orderBy('at'),FB.limitToLast(200)),s=>{if(!CHAT||CHAT.t!==t)return;
  CHAT.msgs=s.docs.map(d=>({id:d.id,...d.data(),p:d.metadata.hasPendingWrites}));drawChat();markRead()},e=>{const b=$('#chatBox');if(b)b.innerHTML='<div class="empty">مقدرناش نفتح الشات دلوقتي</div>'})}
function drawChat(){const b=$('#chatBox');if(!b||!CHAT)return;
 b.innerHTML=CHAT.msgs.length?CHAT.msgs.map(m=>`<div class="msg ${m.from===ME.uid?'me':'them'}">${m.from!==ME.uid&&m.name?`<b class="who">${esc(m.name)}</b>`:''}${esc(m.text).replace(/\n/g,'<br>')}<time>${m.p?'⏳ ':''}${timeAgo(m.at)}</time></div>`).join(''):'<div class="empty">ابدأ المحادثة بأول رسالة</div>';
 b.scrollTop=b.scrollHeight}
function markRead(){if(!CHAT)return;FB.setDoc(FB.doc(...CHAT.path),{readAt:{[ME.uid]:Date.now()}},{merge:true}).catch(()=>{})}
function sendMsg(){const i=$('#chatIn');const text=(i.value||'').trim();if(!text||!CHAT)return;const at=Date.now();const name=myName();
 FB.setDoc(FB.doc(...CHAT.path,'messages',uid('m')),{text,from:ME.uid,name,at}).catch(e=>Sync.fail(e));
 FB.setDoc(FB.doc(...CHAT.path),{lastAt:at,lastFrom:ME.uid,lastText:text.slice(0,120),lastName:name,readAt:{[ME.uid]:at}},{merge:true}).catch(()=>{});
 i.value='';i.style.height='auto';i.focus()}

/* ---------- inbox (bell) ---------- */
openNotifs=function(){if(!ME)return;const ns=myNotices().slice(0,20);const seen=new Set(seenNotices());markNoticesSeen();
 const noticeList=ns.length?ns.map(n=>`<div class="item" style="cursor:pointer" onclick="showNotice(S.notices.find(x=>x.id==='${n.id}'))"><div class="grow"><div class="t">${seen.has(n.id)?'':'<span class="dotn">جديد</span> '}${esc(n.title||'إشعار')}</div><div class="d">${timeAgo(n.at)} · ${esc((n.body||'').slice(0,70))}</div></div></div>`).join(''):'<div class="empty">مفيش إشعارات</div>';
 let top='';
 if(ME.role==='manager'){const th=Object.entries(S.threads).filter(([k])=>k!=='owner').sort((a,b)=>(b[1]&&b[1].lastAt||0)-(a[1]&&a[1].lastAt||0));const pend=S.vacations.filter(v=>v.status==='pending').length;
  top=`<div class="card"><h3>الرسايل</h3><div class="list">
   <div class="item" style="cursor:pointer" onclick="openChat('${ME.companyId}','owner')">${tile('chat')}<div class="grow"><div class="t">إدارة البرنامج ${unread(S.threads.owner)?'<span class="dotn">جديد</span>':''}</div><div class="d">${esc((S.threads.owner&&S.threads.owner.lastText)||'الدعم والاشتراك')}</div></div></div>
   ${th.map(([k,t])=>{const u=R(k).name!=='؟'?R(k):Acc(k);if(!u)return '';return `<div class="item" style="cursor:pointer" onclick="openChat('${ME.companyId}','${k}')">${avatar(u)}<div class="grow"><div class="t">${esc(u.name)} ${unread(t)?'<span class="dotn">جديد</span>':''}</div><div class="d">${esc((t&&t.lastText)||'')}</div></div></div>`}).join('')}
  </div><div class="sub">تقدر تفتح شات مع أي موظف من صفحة الموظفين.</div></div>
  ${pend?`<button class="btn" onclick="closeSheet();go('vac')">${fmt(pend)} طلب أجازة مستني موافقتك ←</button>`:''}`}
 else if(ME.role==='rep'||ME.role==='acc'){const t=S.threads[ME.uid];
  top=`<button class="btn big" onclick="openChat('${ME.companyId}','${ME.uid}')">${tile('chat')}شات مع المدير ${unread(t)?'<span class="dotn">جديد</span>':''}</button>`;
  if(ME.role==='rep'){const d=dues(V.role),tk=openTasks(V.role);
   top+=`${tk.length?`<div class="card"><h3>مهام جديدة</h3><div class="list">${tk.map(taskRow).join('')}</div></div>`:''}
   ${d.length?`<div class="card"><h3>مطالبات</h3><div class="list">${d.map(i=>`<div class="item"><div class="grow"><div class="t">${esc(Cu(i.cust).name)} عليها مطالبة</div><div class="d num">فاتورة #${esc(i.no)} · ${money(invTotal(i))} · من ${fmt(age(i.date))} يوم</div></div><button class="btn sm" onclick="closeInvStep2('${i.id}')">تقفيل</button></div>`).join('')}</div></div>`:''}`}}
 else if(ME.role==='owner'){const th=S.companies.map(c=>[c,S.threads[c.id]]).filter(([c,t])=>t&&t.lastAt).sort((a,b)=>b[1].lastAt-a[1].lastAt);
  top=`<div class="card"><h3>رسايل الشركات</h3><div class="list">${th.length?th.map(([c,t])=>`<div class="item" style="cursor:pointer" onclick="openChat('${c.id}','owner')">${tile('chat')}<div class="grow"><div class="t">${esc(c.name)} ${unread(t)?'<span class="dotn">جديد</span>':''}</div><div class="d">${esc(t.lastText||'')}</div></div></div>`).join(''):'<div class="empty">مفيش رسايل لسه</div>'}</div></div>`}
 sheet(`<h3>الإشعارات والرسايل</h3>${top}${ME.role==='owner'?'':`<div class="card"><h3>إشعارات</h3><div class="list">${noticeList}</div></div>`}`);scheduleRender()};

/* ---------- employee profile with daily work hours ---------- */
let EP={id:null,m:MONTH};
function workDays(rep,month){const by={};S.visits.filter(v=>v.rep===rep&&v.date.startsWith(month)).forEach(v=>(by[v.date]=by[v.date]||[]).push(v.time));
 return Object.entries(by).sort((a,b)=>b[0].localeCompare(a[0])).map(([date,ts])=>{ts.sort();const m=t=>{const [h,mi]=t.split(':').map(Number);return h*60+mi};
  return {date,n:ts.length,first:ts[0],last:ts[ts.length-1],span:m(ts[ts.length-1])-m(ts[0])}})}
const hm=t=>{const [h,m]=t.split(':').map(Number);const d=new Date();d.setHours(h,m);return d.toLocaleTimeString('ar-EG',{hour:'numeric',minute:'2-digit'})};
const dur=min=>min<=0?'—':(Math.floor(min/60)?fmt(Math.floor(min/60))+' س ':'')+(min%60?fmt(min%60)+' د':'');
function empProfile(id,m){EP={id,m:m||EP.m||MONTH};const r=R(id);const days=workDays(id,EP.m);const tot=days.reduce((s,d)=>s+d.span,0);
 const avgFirst=days.length?Math.round(days.reduce((s,d)=>{const [h,mi]=d.first.split(':').map(Number);return s+h*60+mi},0)/days.length):0;
 sheet(`<div class="row nowrap">${avatar(r,'lg')}<div style="min-width:0"><h3>${esc(r.name)}</h3><div class="sub">${esc(r.area||'')}</div>
  ${r.phone?`<div class="sub num" dir="ltr" style="text-align:right">${esc(r.phone)}</div>`:''}<div class="sub" dir="ltr" style="text-align:right">${esc(r.email||'')}</div></div></div>
 <div class="grid2"><button class="btn pri" onclick="openChat('${ME.companyId}','${id}')">${tile('chat')}شات</button><button class="btn" onclick="sendReset('${esc(r.email)}')">لينك كلمة السر</button></div>
 <div class="seg">${[MONTH,PREV_MONTH].map(x=>`<button class="${EP.m===x?'on':''}" onclick="empProfile('${id}','${x}')">${mName(x)}</button>`).join('')}</div>
 <div class="stats"><div class="stat"><div class="v num">${fmt(days.length)}</div><div class="l">يوم اشتغل فيه</div></div><div class="stat"><div class="v num">${dur(days.length?Math.round(tot/days.length):0)}</div><div class="l">متوسط وقت الشغل في اليوم</div></div>
  <div class="stat"><div class="v num">${days.length?hm(`${Math.floor(avgFirst/60)}:${avgFirst%60}`):'—'}</div><div class="l">متوسط أول زيارة</div></div><div class="stat"><div class="v num">${fmt(days.reduce((s,d)=>s+d.n,0))}</div><div class="l">زيارة في الشهر</div></div></div>
 <div class="card"><h3>ساعات الشغل يوم بيوم</h3><div class="sub">مدة الشغل = من أول زيارة لآخر زيارة في اليوم</div>
  ${days.length?`<div class="tbl"><table><thead><tr><th>اليوم</th><th>زيارات</th><th>أول زيارة</th><th>آخر زيارة</th><th>المدة</th></tr></thead><tbody>${days.map(d=>`<tr><td>${dt(d.date).toLocaleDateString('ar-EG',{weekday:'short',day:'numeric',month:'short'})}</td><td class="num">${fmt(d.n)}</td><td class="num">${hm(d.first)}</td><td class="num">${hm(d.last)}</td><td class="num"><b>${dur(d.span)}</b></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">مفيش زيارات في الشهر ده</div>'}</div>`)}

/* ---------- staff welcome editor (company owner) ---------- */
let SW={};
function staffWelcomeForm(){const w=S.staffWelcome||{};SW={img:w.img||'',text:w.text||`أهلاً بيك معانا في ${(S.company||{}).name||'الشركة'}.\n\nإحنا مبسوطين إنك جزء من الفريق. البرنامج ده هيساعدك تنظّم زياراتك وفواتيرك وتشوف التارجت بتاعك أول بأول.\n\nبالتوفيق.`};
 sheet(`<h3>رسالة ترحيب للموظفين</h3><div class="sub">بتظهر لكل مندوب وموظف حسابات أول ما يفتح البرنامج، وتظهر تاني كل ما تعدّلها.</div>
 <div id="swImg">${SW.img?`<img class="thumb" src="${SW.img}" alt="">`:''}</div>
 <div class="row"><label class="btn sm">${SW.img?'تغيير الصورة':'+ إضافة صورة'}<input type="file" accept="image/*" hidden onchange="readImg(this,900,u=>{SW.img=u;$('#swImg').innerHTML='<img class=thumb src='+u+' alt>'})"></label>${SW.img?`<button class="btn sm danger" onclick="SW.img='';$('#swImg').innerHTML=''">شيل الصورة</button>`:''}</div>
 <label class="f">نص الرسالة (سيب سطر فاضي بين كل فقرة)<textarea id="swT" style="min-height:180px">${esc(SW.text)}</textarea></label>
 <div class="grid2"><button class="btn" onclick="SW.text=$('#swT').value;sheet(staffWelcomeHTML({...SW,by:myName()})+'<button class=&quot;btn&quot; onclick=&quot;staffWelcomeForm2()&quot;>رجوع للتعديل</button>')">معاينة</button>
 <button class="btn pri" onclick="saveStaffWelcome()">حفظ وإرسال</button></div>`)}
function staffWelcomeForm2(){const keep={...SW};staffWelcomeForm();SW=keep;$('#swT').value=SW.text;$('#swImg').innerHTML=SW.img?`<img class="thumb" src="${SW.img}" alt="">`:''}
function saveStaffWelcome(){const t=$('#swT');if(t)SW.text=t.value.trim();const d={text:SW.text,img:SW.img||'',at:Date.now(),by:myName()};
 FB.setDoc(FB.doc('companies',ME.companyId,'settings','welcome'),d).then(()=>toast('اتحفظت · هتظهر للموظفين')).catch(e=>Sync.fail(e));S.staffWelcome=d;closeSheet()}

/* ---------- owner: companies, subscriptions, warnings, delete ---------- */
const PLAN_AR={monthly:'اشتراك شهري',yearly:'اشتراك سنوي',lifetime:'مدى الحياة'};
function subInfo(c){if(c.plan==='lifetime')return {pill:'<span class="pill ok">∞ مدى الحياة</span>',days:Infinity};
 if(!c.paidUntil)return {pill:`<span class="pill">${PLAN_AR[c.plan||'monthly']}</span>`,days:Infinity};const d=Math.round((dt(c.paidUntil)-dt(TODAY))/864e5);
 return {pill:`<span class="pill ${d<0?'bad':d<=5?'warn':'acc'}">${d<0?'انتهى من '+fmt(-d)+' يوم':'لحد '+dFmt(c.paidUntil)}</span>`,days:d}}
VIEWS.companies=()=>{const list=S.companies.filter(c=>!c.deleted).sort((a,b)=>(b.since||'').localeCompare(a.since||''));
 return `<div class="row between"><div><h2>الشركات المشتركة</h2><div class="sub">انت بتعمل حساب صاحب الشركة، وهو بيعمل حسابات المناديب</div></div><button class="btn pri" onclick="coForm()">+ شركة</button></div>
 <div class="stats"><div class="stat"><div class="v num">${fmt(list.filter(c=>c.active).length)}</div><div class="l">شركة شغالة</div></div><div class="stat"><div class="v num">${fmt(list.filter(c=>!c.active).length)}</div><div class="l">موقوفة</div></div></div>
 ${list.map(c=>{const si=subInfo(c);const t=S.threads[c.id];return `<div class="card"><div class="row between"><h3>${esc(c.name)}</h3><div class="row">${si.pill}<span class="pill ${c.active?'ok':'bad'}">${c.active?'شغالة':'موقوفة'}</span></div></div>
  <div class="kv"><span>صاحب الشركة</span><span>${esc(c.manager||'')}</span></div>
  ${c.phone?`<div class="kv"><span>التليفون</span><span dir="ltr" class="num" style="user-select:all">${esc(c.phone)}</span></div>`:''}
  <div class="kv"><span>الإيميل</span><span dir="ltr" class="num">${esc(c.email)}</span></div><div class="kv"><span>مشتركة من</span><span>${dFmt(c.since)}</span></div>
  ${c.warning&&c.warning.text?`<div class="note bad">إنذار متبعت ${dFmt(c.warning.date)}: ${esc(c.warning.text.slice(0,90))}</div>`:''}
  <div class="grid2"><button class="btn pri" onclick="openChat('${c.id}','owner')">${tile('chat')}شات ${unread(t)?'<span class="dotn">جديد</span>':''}</button><button class="btn" onclick="editCompany('${c.id}')">✏️ تعديل والاشتراك</button></div>
  <div class="row"><button class="btn sm" onclick="warnCompany('${c.id}')">⚠️ إنذار بالدفع</button>
   <button class="btn sm ${c.active?'danger':'okb'}" onclick="toggleCompany('${c.id}')">${c.active?'إيقاف لحين الدفع':'تشغيل تاني'}</button>
   <button class="btn sm" onclick="passAdmin('${c.managerUid||''}','${c.id}')">🔑 كلمة السر</button>
   <button class="btn sm danger" onclick="askDeleteCompany('${c.id}')">حذف</button></div></div>`}).join('')||'<div class="empty">لسه مفيش شركات. دوس "+ شركة" علشان تعمل أول نسخة.</div>'}
 <div class="note">الإيقاف بيقفل البرنامج على الشركة وكل موظفينها، والبيانات بتفضل محفوظة لحد ما تشغّلها تاني.</div>`};
const planFields=c=>`<div class="grid2"><label class="f">نوع الاشتراك<select id="cpl" onchange="$('#cpuW').hidden=this.value==='lifetime'">${Object.entries(PLAN_AR).map(([k,l])=>`<option value="${k}" ${(c.plan||'monthly')===k?'selected':''}>${l}</option>`).join('')}</select></label>
 <label class="f" id="cpuW" ${c.plan==='lifetime'?'hidden':''}>مدفوع لحد<input type="date" id="cpu" value="${c.paidUntil||addDays(TODAY,30)}"></label></div>`;
coForm=function(){const pw=String(Math.floor(100000+Math.random()*900000));
 sheet(`<h3>شركة جديدة</h3><label class="f">اسم الشركة<input id="con"></label><label class="f">اسم صاحب الشركة<input id="com"></label>
 <label class="f">رقم التليفون<input id="cph" inputmode="tel" dir="ltr" placeholder="01xxxxxxxxx"></label>
 <label class="f">الإيميل<input id="coe" dir="ltr" type="email" autocapitalize="off"></label><label class="f">كلمة السر<input id="cop" dir="ltr" autocapitalize="off" autocorrect="off" spellcheck="false" value="${pw}"></label>
 ${planFields({})}<button class="btn pri big" onclick="addCompany()">إنشاء الحساب</button>`)};
addCompany=async function(){const n=$('#con').value.trim(),m=$('#com').value.trim(),e=$('#coe').value.trim().toLowerCase(),p=$('#cop').value.trim(),ph=$('#cph').value.trim(),plan=$('#cpl').value,pu=plan==='lifetime'?'':$('#cpu').value;
 if(!n||!e)return toast('اكتب اسم الشركة والإيميل');if(p.length<6)return toast('كلمة السر لازم ٦ حروف على الأقل');
 const b=document.querySelector('.sheet .btn.big');b.disabled=true;b.textContent='بنعمل النسخة...';
 try{const muid=await FB.createUser(e,p);const cid='co'+Date.now().toString(36);
  await FB.setDoc(FB.doc('companies',cid),{name:n,manager:m,phone:ph,email:e,active:true,since:TODAY,managerUid:muid,plan,paidUntil:pu});
  await FB.setDoc(FB.doc('users',muid),{role:'manager',companyId:cid,name:m||n,phone:ph,email:e,active:true,photo:''});
  await FB.setDoc(FB.doc('secrets',muid),{pass:p,email:e,at:Date.now()}).catch(()=>{});
  await FB.setDoc(FB.doc('companies',cid,'settings','main'),{...DEFAULT_SETTINGS,rules:DEFAULT_RULES,custRules:{}});
  credSheet(m||n,e,p)}catch(err){b.disabled=false;b.textContent='إنشاء الحساب';toast(err&&err.code&&err.code.startsWith('auth/')?authErr(err):(ERR_AR[err&&err.code]||'حصلت مشكلة، جرّب تاني'))}};
function editCompany(id){const c=S.companies.find(x=>x.id===id);
 sheet(`<h3>تعديل ${esc(c.name)}</h3><label class="f">اسم الشركة<input id="ecn" value="${esc(c.name)}"></label><label class="f">اسم صاحب الشركة<input id="ecm" value="${esc(c.manager||'')}"></label>
 <label class="f">رقم التليفون<input id="ecp" inputmode="tel" dir="ltr" value="${esc(c.phone||'')}"></label>${planFields(c)}
 <div class="note">لو اخترت "مدى الحياة" البرنامج هيفضل شغال للشركة دي من غير تاريخ انتهاء.</div>
 <button class="btn pri big" onclick="saveCompany('${id}')">حفظ</button>`)}
function saveCompany(id){const c=S.companies.find(x=>x.id===id);const plan=$('#cpl').value;
 Object.assign(c,{name:$('#ecn').value.trim()||c.name,manager:$('#ecm').value.trim(),phone:$('#ecp').value.trim(),plan,paidUntil:plan==='lifetime'?'':$('#cpu').value});
 closeSheet();render();toast('اتحفظت')}
function toggleCompany(id){const c=S.companies.find(x=>x.id===id);c.active=!c.active;render();toast(c.active?'الشركة اشتغلت تاني':'اتوقفت لحين الدفع · البيانات محفوظة')}
function warnCompany(id){const c=S.companies.find(x=>x.id===id);const due=c.paidUntil&&c.plan!=='lifetime'?dFmt(c.paidUntil):'';
 const def=`السادة ${c.name}،\n\nنحب نفكّركم إن اشتراك بيثيل اسمارت ${due?'انتهى أو هينتهي يوم '+due:'محتاج يتجدد'}.\n\nبرجاء سداد الاشتراك علشان البرنامج يفضل شغال من غير توقف. ولو فيه أي استفسار كلمونا من الشات.`;
 sheet(`<h3>إنذار بالدفع لـ ${esc(c.name)}</h3><div class="sub">هيظهر لصاحب الشركة كإشعار، وكرسالة حمرا كل ما يفتح البرنامج لحد ما تشيله.</div>
 <label class="f">نص الإنذار<textarea id="wtx" style="min-height:170px">${esc((c.warning&&c.warning.text)||def)}</textarea></label>
 <button class="btn pri big" onclick="sendWarning('${id}')">ابعت الإنذار</button>${c.warning&&c.warning.text?`<button class="btn" onclick="clearWarning('${id}')">شيل الإنذار (اتدفع)</button>`:''}`)}
function sendWarning(id){const c=S.companies.find(x=>x.id===id);const text=$('#wtx').value.trim();if(!text)return;c.warning={text,date:TODAY};
 FB.setDoc(FB.doc('notices',uid('n')),{title:'تنبيه بخصوص الاشتراك',body:text,to:[id],audience:'managers',type:'warning',from:'owner',at:Date.now()}).catch(e=>Sync.fail(e));
 closeSheet();render();toast('اتبعت الإنذار')}
function clearWarning(id){const c=S.companies.find(x=>x.id===id);c.warning=null;closeSheet();render();toast('اتشال الإنذار')}
function askDeleteCompany(id){const c=S.companies.find(x=>x.id===id);
 sheet(`<h3>حذف ${esc(c.name)} نهائياً؟</h3><div class="note bad">هيتمسح كل حاجة: العملاء والزيارات والفواتير والمخزن والشات، وكل حسابات الشركة هتتقفل. الخطوة دي مالهاش رجوع.</div>
 <div class="sub">لو عايز توقفها لحين الدفع والبيانات تفضل محفوظة، استخدم "إيقاف لحين الدفع" بدل الحذف.</div>
 <label class="f">اكتب اسم الشركة علشان تأكد: <b>${esc(c.name)}</b><input id="dcn" autocomplete="off"></label>
 <button class="btn danger big" id="dcb" onclick="deleteCompany('${id}')">احذف نهائياً</button><button class="btn" onclick="closeSheet()">رجوع</button>`)}
async function deleteCompany(id){const c=S.companies.find(x=>x.id===id);if($('#dcn').value.trim()!==c.name.trim())return toast('اكتب اسم الشركة بالظبط');
 const b=$('#dcb');b.disabled=true;b.textContent='بنمسح...';
 try{const refs=[];const cols=['products','customers','visits','invoices','transfers','orders','tasks','vacations','stock','plans','settings','chats'];
  for(const n of cols){const s=await FB.getDocs(FB.col('companies',id,n));for(const d of s.docs){refs.push(d.ref);
   if(n==='chats'){const ms=await FB.getDocs(FB.col('companies',id,'chats',d.id,'messages'));ms.docs.forEach(m=>refs.push(m.ref))}}}
  for(let i=0;i<refs.length;i+=400){const bt=FB.batch();refs.slice(i,i+400).forEach(r=>bt.delete(r));await bt.commit()}
  const us=await FB.getDocs(FB.query(FB.col('users'),FB.where('companyId','==',id)));
  for(const u of us.docs)await FB.updateDoc(u.ref,{active:false,companyId:'deleted-'+id});
  await FB.deleteDoc(FB.doc('companies',id));Sync.shadow.delete('companies/'+id);S.companies=S.companies.filter(x=>x.id!==id);
  closeSheet();render();toast('الشركة اتحذفت')}catch(e){b.disabled=false;b.textContent='احذف نهائياً';Sync.fail(e)}}

/* ---------- owner: notices ---------- */
let NT={to:'all',aud:'managers'};
VIEWS.notices=()=>`<div class="row between"><div><h2>الإشعارات</h2><div class="sub">ابعت رسالة لكل المشتركين أو لشركات معينة</div></div><button class="btn pri" onclick="NT={to:'all',aud:'managers'};noticeForm()">+ إشعار</button></div>
 ${S.notices.map(n=>`<div class="card"><div class="row between"><h3>${esc(n.title||'إشعار')}</h3>${n.type==='warning'?'<span class="pill bad">إنذار</span>':''}</div>
  <div class="sub">${timeAgo(n.at)} · لـ ${n.to==='all'?'كل الشركات':(n.to||[]).map(id=>esc((S.companies.find(c=>c.id===id)||{name:'شركة'}).name)).join('، ')} · ${n.audience==='all'?'كل الموظفين':'أصحاب الشركات'}</div>
  <div>${paras(n.body)}</div><button class="btn sm danger" style="justify-self:start" onclick="FB.deleteDoc(FB.doc('notices','${n.id}')).then(()=>toast('اتمسح')).catch(e=>Sync.fail(e))">مسح</button></div>`).join('')||'<div class="empty">لسه مابعتش إشعارات</div>'}
 <div class="note">الإشعار بيظهر جوه البرنامج: في الجرس، وكرسالة أول ما الشخص يفتح البرنامج.</div>`;
function noticeForm(){const sel=NT.to!=='all';const cos=S.companies.filter(c=>!c.deleted);
 sheet(`<h3>إشعار جديد</h3><label class="f">العنوان<input id="ntt" value="${esc(NT.title||'')}" placeholder="مثلاً: تحديث جديد في البرنامج"></label>
 <label class="f">الرسالة<textarea id="ntb" style="min-height:140px">${esc(NT.body||'')}</textarea></label>
 <div class="f">يوصل لمين<div class="seg"><button class="${!sel?'on':''}" onclick="keepNt();NT.to='all';noticeForm()">كل الشركات</button><button class="${sel?'on':''}" onclick="keepNt();NT.to=[];noticeForm()">شركات معينة</button></div></div>
 ${sel?`<div class="chips">${cos.map(c=>`<button class="chip ${NT.to.includes(c.id)?'on':''}" onclick="keepNt();NT.to.includes('${c.id}')?NT.to.splice(NT.to.indexOf('${c.id}'),1):NT.to.push('${c.id}');noticeForm()">${esc(c.name)}</button>`).join('')}</div>`:''}
 <div class="f">جوه كل شركة<div class="seg"><button class="${NT.aud==='managers'?'on':''}" onclick="keepNt();NT.aud='managers';noticeForm()">صاحب الشركة بس</button><button class="${NT.aud==='all'?'on':''}" onclick="keepNt();NT.aud='all';noticeForm()">كل الموظفين</button></div></div>
 <button class="btn pri big" onclick="sendNotice()">ابعت الإشعار</button>`)}
function keepNt(){NT.title=$('#ntt').value;NT.body=$('#ntb').value}
function sendNotice(){keepNt();if(!NT.body.trim())return toast('اكتب الرسالة');if(NT.to!=='all'&&!NT.to.length)return toast('اختار شركة واحدة على الأقل');
 FB.setDoc(FB.doc('notices',uid('n')),{title:NT.title.trim()||'إشعار من إدارة البرنامج',body:NT.body.trim(),to:NT.to,audience:NT.aud,type:'info',from:'owner',at:Date.now()})
  .then(()=>toast('الإشعار اتبعت')).catch(e=>Sync.fail(e));closeSheet()}

/* ---------- owner welcome editor with image ---------- */
VIEWS.welcome=()=>`<div><h2>رسالة الترحيب</h2><div class="sub">بتظهر لكل صاحب شركة أول ما يفتح البرنامج، وتظهر تاني كل ما تعدّلها</div></div>
 <div class="card"><div id="wImg">${S.welcomeImg?`<img class="thumb" src="${S.welcomeImg}" alt="">`:''}</div>
  <div class="row"><label class="btn sm">${S.welcomeImg?'تغيير الصورة':'+ إضافة صورة'}<input type="file" accept="image/*" hidden onchange="readImg(this,900,u=>{S.welcomeImg=u;$('#wImg').innerHTML='<img class=thumb src='+u+' alt>'})"></label>${S.welcomeImg?`<button class="btn sm danger" onclick="S.welcomeImg='';$('#wImg').innerHTML=''">شيل الصورة</button>`:''}</div>
  <label class="f">نص الرسالة (سيب سطر فاضي بين كل فقرة)<textarea id="wt" style="min-height:220px">${esc(S.welcomeText)}</textarea></label>
  <div class="row"><button class="btn pri" onclick="S.welcomeText=$('#wt').value.trim()||DEFAULT_WELCOME;S.welcomeAt=Date.now();render();toast('اتحفظت الرسالة · هتظهر للشركات')">حفظ وإرسال</button><button class="btn" onclick="S.welcomeText=$('#wt').value.trim()||DEFAULT_WELCOME;showWelcome()">معاينة</button></div></div>
 <div class="card">${welcomeHTML()}</div>`;

/* ---------- manager: staff welcome card on the employees page ---------- */
const _reps=VIEWS.reps;
VIEWS.reps=()=>{const sw=S.staffWelcome;
 return `<div class="card"><div class="row between nowrap"><div class="row nowrap">${tile('welcome')}<div><h3>رسالة ترحيب للموظفين</h3><div class="sub">${sw&&(sw.text||sw.img)?'متفعّلة · بتظهر لكل موظف أول ما يفتح':'صورة ورسالة تظهر للموظفين أول ما يدخلوا'}</div></div></div><button class="btn sm" onclick="staffWelcomeForm()">${sw?'تعديل':'إضافة'}</button></div></div>`+_reps()};

/* ---------- manager dashboard: subscription banners ---------- */
const _dash=VIEWS.dash;
VIEWS.dash=()=>{const c=S.company||{};let b='';
 if(c.warning&&c.warning.text)b+=`<button class="note bad" style="border:0;font:inherit;font-size:13.5px;text-align:right;cursor:pointer" onclick="showWarning()"><b>تنبيه من إدارة البرنامج:</b> ${esc(c.warning.text.slice(0,110))}… اضغط للتفاصيل</button>`;
 if(c.plan!=='lifetime'&&c.paidUntil){const d=Math.round((dt(c.paidUntil)-dt(TODAY))/864e5);if(d<=5)b+=`<div class="note ${d<0?'bad':''}" style="${d<0?'':'background:var(--warn-soft);color:var(--warn)'}">${d<0?'الاشتراك انتهى من '+fmt(-d)+' يوم. جدّد علشان البرنامج ميتوقفش.':'الاشتراك بينتهي يوم '+dFmt(c.paidUntil)+' (فاضل '+fmt(d)+' يوم).'} <button class="btn sm" onclick="openChat('${ME.companyId}','owner')">كلّم الإدارة</button></div>`}
 return b+_dash()};

/* ---------- render: suspended screen, inbox bell, header photo ---------- */
const _render=render;
render=function(){if(!ME)return;
 if(ME.role!=='owner'&&S.company&&S.company.active===false){document.querySelector('nav.tabs').hidden=true;$('#bell').hidden=true;
  const w=S.company.warning;
  $('#main').innerHTML=`<div class="card" style="text-align:center;justify-items:center;padding-block:28px"><div class="welcome"><div class="plate"><img src="${LOGO_FULL}" alt=""></div></div>
   <h2>البرنامج موقوف مؤقتاً</h2><div class="sub" style="font-size:15px">اشتراك ${esc(S.company.name||'الشركة')} موقوف لحين الدفع. كل البيانات محفوظة زي ما هي، وأول ما الاشتراك يتجدد كل حاجة هترجع تشتغل.</div>
   ${w&&w.text?`<div class="note bad" style="text-align:right">${paras(w.text)}</div>`:''}
   ${ME.role==='manager'?`<button class="btn pri big" onclick="openChat('${ME.companyId}','owner')">${tile('chat')}كلّم إدارة البرنامج</button>`:'<div class="sub">كلّم صاحب الشركة.</div>'}
   <button class="btn" onclick="userMenu()">حسابي / تسجيل خروج</button>${brandFoot()}</div>`+sig();return}
 document.querySelector('nav.tabs').hidden=false;
 _render();
 const b=$('#bell');let n=unreadChats()+unseenNotices().length;
 if(isRep())n+=dues(V.role).length+openTasks(V.role).length;if(ME.role==='manager')n+=S.vacations.filter(v=>v.status==='pending').length;
 b.hidden=false;$('#bellN').textContent=fmt(n);$('#bellN').hidden=!n;
 const p=S.profile;const ub=$('#userBtn');if(ub&&p&&p.photo&&!ub.querySelector('img'))ub.innerHTML=`<img src="${p.photo}" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
 if(ub&&(!p||!p.photo)&&ub.querySelector('img'))ub.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>';
};

/* ---------- admin sets a password directly (owner → company owner, company owner → staff) ---------- */
let PA={};
async function passAdmin(uidT,coId){let who,email;
 if(coId){const c=S.companies.find(z=>z.id===coId)||{};who=c.manager||c.name;email=c.email}
 else{const u=R(uidT).name!=='؟'?R(uidT):Acc(uidT);who=u&&u.name;email=u&&u.email}
 if(!uidT||!email)return toast('الحساب ده ناقص بيانات');
 sheet(`<h3>كلمة سر ${esc(who||'')}</h3><div class="geo"><span class="spin" style="width:30px;height:30px;color:var(--accent)"></span></div>`);
 let cur='';try{const s=await FB.getDoc(FB.doc('secrets',uidT));if(s.exists())cur=s.data().pass||''}catch(e){}
 PA={uid:uidT,email,who,cur};
 sheet(`<h3>كلمة سر ${esc(who||'')}</h3><div class="sub" dir="ltr" style="text-align:right">${esc(email)}</div>
 ${cur?`<div class="card"><div class="kv"><span>كلمة السر الحالية</span><b dir="ltr" style="user-select:all;font-size:17px">${esc(cur)}</b></div></div>`
  :`<div class="note">الحساب ده اتعمل قبل التحديث ده، فكلمة السر الحالية مش متسجلة عندنا. لو عارفها اكتبها تحت، أو ابعتله لينك تغيير على الإيميل.</div>
   <label class="f">كلمة السر الحالية<input id="paC" dir="ltr" autocapitalize="off" autocorrect="off" spellcheck="false"></label>`}
 <label class="f">كلمة السر الجديدة (٦ حروف أو أرقام على الأقل)<input id="paN" dir="ltr" autocapitalize="off" autocorrect="off" spellcheck="false" value="${String(Math.floor(100000+Math.random()*900000))}"></label>
 <button class="btn pri big" id="paB" onclick="doPassAdmin()">غيّر كلمة السر</button>
 <button class="btn" onclick="sendReset('${esc(email)}')">أو ابعتله لينك على الإيميل</button>`)}
async function doPassAdmin(){const cur=PA.cur||($('#paC')?$('#paC').value.trim():''),nw=$('#paN').value.trim();
 if(!cur)return toast('اكتب كلمة السر الحالية');if(nw.length<6)return toast('كلمة السر لازم ٦ حروف على الأقل');
 const b=$('#paB');b.disabled=true;b.textContent='بنغيّر...';
 try{await FB.adminSetPassword(PA.email,cur,nw);await FB.setDoc(FB.doc('secrets',PA.uid),{pass:nw,email:PA.email,at:Date.now()});credSheet(PA.who||'',PA.email,nw,'كلمة السر اتغيرت ✓')}
 catch(e){b.disabled=false;b.textContent='غيّر كلمة السر';const c=e&&e.code||'';
  toast(/invalid-credential|wrong-password/.test(c)?'كلمة السر الحالية المتسجلة مش صح. ابعتله لينك على الإيميل.':(c.startsWith('auth/')?authErr(e):Sync.fail(e)))}}

/* ===================== فاتورة للطباعة / PDF باسم الشركة ===================== */
const _start2=Sync.start;
Sync.start=function(){_start2.call(this);if(ME.role==='owner')return;
 this.on('brand',FB.doc('companies',ME.companyId,'settings','brand'),s=>{S.brand=s.exists()?s.data():{}})};

function invoiceDocHTML(i){const b=S.brand||{},co=S.company||{},c=Cu(i.cust)||{},rep=R(i.rep)||{};
 const gross=i.lines.reduce((s,l)=>s+l.qty*l.price,0),net=invTotal(i),ret=retValue(i),due=net-ret,st=invState(i);
 const n2=v=>Number(v||0).toLocaleString('ar-EG',{minimumFractionDigits:2,maximumFractionDigits:2});
 return `<div class="invdoc"><style>
 .invdoc{width:760px;background:#fff;color:#14263b;font-family:"IBM Plex Sans Arabic",Tahoma,"Segoe UI",sans-serif;direction:rtl;padding:36px 40px;box-sizing:border-box;font-size:14px;line-height:1.6}
 .invdoc *{box-sizing:border-box}
 .invdoc .hd{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;border-bottom:3px solid #0B2C55;padding-bottom:16px}
 .invdoc .co{display:flex;gap:14px;align-items:center}.invdoc .co img{width:78px;height:78px;object-fit:contain;border-radius:10px}
 .invdoc .co h1{margin:0;font-size:24px;color:#0B2C55;font-weight:700}.invdoc .co div{color:#5b6a7a;font-size:12.5px}
 .invdoc .tag{text-align:left}.invdoc .tag b{display:block;font-size:22px;color:#00907C}.invdoc .tag span{display:block;color:#5b6a7a;font-size:13px}
 .invdoc .meta{display:grid;grid-template-columns:1fr 1fr;gap:10px 28px;margin:18px 0;background:#f2f6f9;border-radius:10px;padding:14px 16px}
 .invdoc .meta div{display:flex;justify-content:space-between;gap:10px}.invdoc .meta span{color:#5b6a7a}
 .invdoc table{width:100%;border-collapse:collapse;margin-top:6px}
 .invdoc th{background:#0B2C55;color:#fff;font-weight:600;padding:9px 8px;text-align:right;font-size:13px}
 .invdoc td{padding:9px 8px;border-bottom:1px solid #dde4ea}.invdoc tr:nth-child(even) td{background:#f8fafb}
 .invdoc .tot{width:330px;margin:16px 0 0 auto;margin-right:auto;margin-left:0}
 .invdoc .tot div{display:flex;justify-content:space-between;padding:6px 4px;border-bottom:1px dashed #dde4ea}
 .invdoc .tot .big{font-size:17px;font-weight:700;color:#0B2C55;border-bottom:0;background:#e6f5f1;border-radius:8px;padding:9px 10px;margin-top:4px}
 .invdoc .st{display:inline-block;padding:3px 12px;border-radius:20px;font-weight:600;font-size:13px}
 .invdoc .sign{display:flex;justify-content:space-between;margin-top:46px;color:#5b6a7a}.invdoc .sign div{width:40%;border-top:1px solid #9aa8b5;padding-top:6px;text-align:center}
 .invdoc .foot{margin-top:26px;text-align:center;color:#5b6a7a;font-size:12.5px}
 .invdoc .mark{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:10px;color:#8796a5;font-size:11px}.invdoc .mark img{width:18px;height:18px}
 </style>
 <div class="hd"><div class="co">${b.logo?`<img src="${b.logo}" alt="">`:''}<div><h1>${esc(b.name||co.name||'')}</h1>
  ${b.address?`<div>${esc(b.address)}</div>`:''}${b.phone||co.phone?`<div dir="ltr" style="text-align:right">${esc(b.phone||co.phone)}</div>`:''}${b.taxNo?`<div>رقم ضريبي: ${esc(b.taxNo)}</div>`:''}${b.crNo?`<div>سجل تجاري: ${esc(b.crNo)}</div>`:''}</div></div>
  <div class="tag"><b>فاتورة مبيعات</b><span>رقم: ${esc(i.no)}</span><span>${dt(i.date).toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'})}</span></div></div>
 <div class="meta"><div><span>العميل</span><b>${esc(c.name||'')}</b></div><div><span>المندوب</span><b>${esc(rep.name||'')}</b></div>
  <div><span>تليفون العميل</span><b dir="ltr">${esc(c.phone||'—')}</b></div><div><span>حالة الفاتورة</span><b class="st" style="background:${st==='paid'?'#ddf2e5;color:#1c8a4c':st==='due'?'#fbe3e0;color:#c2362b':'#fbefd6;color:#a8690a'}">${STATUS_AR[st]}</b></div></div>
 <table><thead><tr><th style="width:36px">#</th><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الخصم</th><th>الإجمالي</th></tr></thead><tbody>
 ${i.lines.map((l,k)=>`<tr><td>${fmt(k+1)}</td><td>${esc(P(l.prod).name)}</td><td>${fmt(l.qty)}</td><td>${n2(l.price)}</td><td>${fmt(l.disc||0)}٪</td><td><b>${n2(lineTotal(l))}</b></td></tr>`).join('')}
 </tbody></table>
 <div class="tot"><div><span>الإجمالي قبل الخصم</span><b>${n2(gross)}</b></div><div><span>الخصم</span><b>− ${n2(gross-net)}</b></div>
  ${ret?`<div><span>مرتجع (${i.returns.map(r=>fmt(r.qty)+' '+esc(short(P(r.prod).name))).join('، ')})</span><b>− ${n2(ret)}</b></div>`:''}
  <div class="big"><span>الصافي المطلوب</span><span>${n2(due)} جنيه</span></div>
  ${st==='paid'?`<div><span>المحصّل (${dFmt(i.paidDate)})</span><b>${n2(i.collected)}</b></div>`:''}</div>
 <div class="sign"><div>توقيع المندوب</div><div>توقيع واستلام العميل</div></div>
 <div class="foot">${esc(b.footer||'شكراً لتعاملكم معنا')}</div>
 <div class="mark"><img src="logo-mark.png" alt=""><span>صدرت من بيثيل اسمارت</span></div></div>`}

async function invoicePdf(id,mode){const i=S.invoices.find(x=>x.id===id);if(!i)return;
 if(mode==='print'&&!FB.native){const a=document.createElement('div');a.id='printArea';a.innerHTML=invoiceDocHTML(i);document.body.appendChild(a);document.body.classList.add('printing');
  const done=()=>{document.body.classList.remove('printing');a.remove();window.removeEventListener('afterprint',done)};window.addEventListener('afterprint',done);
  setTimeout(()=>{window.print();setTimeout(done,1500)},300);return}
 toast('بنجهّز ملف الفاتورة...');
 const box=document.createElement('div');box.style.cssText='position:fixed;left:-10000px;top:0;z-index:-1';box.innerHTML=invoiceDocHTML(i);document.body.appendChild(box);
 try{await Promise.all([...box.querySelectorAll('img')].map(im=>im.complete?0:new Promise(r=>{im.onload=im.onerror=r})));
  if(document.fonts&&document.fonts.ready)await document.fonts.ready;
  const buf=await FB.makePdf(box.firstElementChild);const fn=`فاتورة-${i.no}-${(Cu(i.cust).name||'').replace(/\s+/g,'-')}.pdf`;
  await FB.saveFile(fn,buf);if(mode==='print'&&FB.native)toast('اختار "طباعة" من القايمة، أو افتح الملف واطبعه')}
 catch(e){if(!/cancel/i.test(String(e&&e.message)))toast('مقدرناش نعمل ملف الفاتورة')}finally{box.remove()}}

const _invDetail=invDetail;
invDetail=function(id){_invDetail(id);const sh=document.querySelector('.sheet');if(!sh)return;
 sh.insertAdjacentHTML('beforeend',`<div class="grid2"><button class="btn acc" onclick="invoicePdf('${id}','share')">📤 إرسال PDF</button><button class="btn" onclick="invoicePdf('${id}','print')">🖨️ طباعة</button></div>
 <button class="btn" onclick="sheet('<div style=&quot;overflow-x:auto&quot;><div style=&quot;zoom:.46&quot;>'+invoiceDocHTML(S.invoices.find(x=>x.id==='${id}'))+'</div></div><button class=&quot;btn&quot; onclick=&quot;invDetail(\\'${id}\\')&quot;>رجوع</button>')">👁️ شكل الفاتورة</button>`)};

const _saveInv=saveInv;
saveInv=function(){const before=new Set(S.invoices.map(x=>x.id));_saveInv();const n=S.invoices.find(x=>!before.has(x.id));if(n)setTimeout(()=>invDetail(n.id),250)};

/* company letterhead for invoices (company owner) */
let BR={};
function brandForm(){const b=S.brand||{},co=S.company||{};BR={logo:b.logo||''};
 sheet(`<h3>بيانات الفاتورة</h3><div class="sub">اللي هيظهر فوق كل فاتورة بيطبعها أي مندوب في الشركة.</div>
 <div class="row nowrap"><div id="brL" style="width:72px;height:72px;border-radius:12px;border:1px solid var(--line);display:grid;place-items:center;background:#fff;overflow:hidden">${BR.logo?`<img src="${BR.logo}" alt="" style="max-width:100%;max-height:100%">`:'<span class="sub">لوجو</span>'}</div>
  <div class="row"><label class="btn sm">${BR.logo?'تغيير اللوجو':'+ لوجو الشركة'}<input type="file" accept="image/*" hidden onchange="readImg(this,400,u=>{BR.logo=u;$('#brL').innerHTML='<img src='+u+' style=max-width:100%;max-height:100%>'})"></label>${BR.logo?`<button class="btn sm danger" onclick="BR.logo='';$('#brL').innerHTML='<span class=sub>لوجو</span>'">شيله</button>`:''}</div></div>
 <label class="f">اسم الشركة على الفاتورة<input id="brN" value="${esc(b.name||co.name||'')}"></label>
 <label class="f">العنوان<input id="brA" value="${esc(b.address||'')}"></label>
 <label class="f">التليفون<input id="brP" dir="ltr" inputmode="tel" value="${esc(b.phone||co.phone||'')}"></label>
 <div class="grid2"><label class="f">رقم ضريبي (اختياري)<input id="brT" value="${esc(b.taxNo||'')}"></label><label class="f">سجل تجاري (اختياري)<input id="brC" value="${esc(b.crNo||'')}"></label></div>
 <label class="f">ملحوظة تحت الفاتورة<input id="brF" value="${esc(b.footer||'شكراً لتعاملكم معنا')}"></label>
 <button class="btn pri big" onclick="saveBrand()">حفظ</button>`)}
function saveBrand(){const d={logo:BR.logo||'',name:$('#brN').value.trim(),address:$('#brA').value.trim(),phone:$('#brP').value.trim(),taxNo:$('#brT').value.trim(),crNo:$('#brC').value.trim(),footer:$('#brF').value.trim()};
 S.brand=d;FB.setDoc(FB.doc('companies',ME.companyId,'settings','brand'),d).then(()=>toast('اتحفظت بيانات الفاتورة')).catch(e=>Sync.fail(e));closeSheet()}
const _rules=VIEWS.rules;
VIEWS.rules=()=>`<div class="card"><div class="row between nowrap"><div class="row nowrap">${tile('invoices')}<div><h3>بيانات الفاتورة</h3><div class="sub">${S.brand&&S.brand.name?esc(S.brand.name)+(S.brand.logo?' · فيها لوجو':''):'اسم الشركة واللوجو والعنوان اللي بيطلعوا على الفاتورة المطبوعة'}</div></div></div><button class="btn sm" onclick="brandForm()">${S.brand&&S.brand.name?'تعديل':'إضافة'}</button></div></div>`+_rules();

/* ===================== فاتورة من صاحب الشركة + إرسالها للمندوب ===================== */
TABS.manager.splice(2,0,['allinv','الفواتير']);

const _allinv=VIEWS.allinv;
VIEWS.allinv=()=>(ME.role==='manager'?`<button class="btn pri big" onclick="mgrInvForm()">${tile('invoices')}فاتورة جديدة</button>`:'')+_allinv();

let MI={};
function mgrInvForm(){if(!S.reps.length)return toast('اعمل حساب مندوب الأول من صفحة الموظفين');
 MI={rep:S.reps[0].id,src:'main',cust:'',no:'',date:TODAY,lines:[{prod:(S.products[0]||{}).id,qty:1,price:(S.products[0]||{}).price||0,disc:0}],notify:true};drawMgrInv()}
function syncMI(){const g=id=>$(id);if(g('#mr'))MI.rep=g('#mr').value;if(g('#ms'))MI.src=g('#ms').value;if(g('#mc'))MI.cust=g('#mc').value;if(g('#mno'))MI.no=g('#mno').value;if(g('#mdt'))MI.date=g('#mdt').value;if(g('#mnt'))MI.notify=g('#mnt').checked;
 MI.lines.forEach((l,k)=>{const q=s=>$(`#${s}${k}`);if(!q('mlp'))return;l.prod=q('mlp').value;l.qty=+q('mlq').value||0;l.price=+q('mlpr').value||0;l.disc=+q('mld').value||0})}
const avail=(src,rep,p)=>src==='main'?(P(p).main||0):(stockOf(rep)[p]||0);
function drawMgrInv(){if(!S.products.length)return toast('ضيف أصناف الأول من صفحة المخزن');
 const tot=MI.lines.reduce((s,l)=>s+lineTotal(l),0);
 sheet(`<h3>فاتورة جديدة</h3>
 <div class="grid2"><label class="f">المندوب<select id="mr" onchange="syncMI();drawMgrInv()">${S.reps.map(r=>`<option value="${r.id}" ${MI.rep===r.id?'selected':''}>${esc(r.name)}</option>`).join('')}</select></label>
 <label class="f">البضاعة تتخصم من<select id="ms" onchange="syncMI();drawMgrInv()"><option value="main" ${MI.src==='main'?'selected':''}>المخزن الرئيسي</option><option value="rep" ${MI.src==='rep'?'selected':''}>مخزن المندوب</option></select></label></div>
 <label class="f">العميل<select id="mc"><option value="">اختار الصيدلية / العيادة</option>${S.reps.map(r=>{const cs=S.customers.filter(c=>c.addedBy===r.id);return cs.length?`<optgroup label="عملاء ${esc(r.name)}">${cs.map(c=>`<option value="${c.id}" ${MI.cust===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</optgroup>`:''}).join('')}</select></label>
 <div class="grid2"><label class="f">رقم الفاتورة<input id="mno" inputmode="numeric" value="${esc(MI.no)}" placeholder="مثلاً 2051"></label><label class="f">التاريخ<input type="date" id="mdt" value="${MI.date}"></label></div>
 ${MI.lines.map((l,k)=>`<div class="line-ed"><select id="mlp${k}" onchange="syncMI();MI.lines[${k}].price=P(this.value).price;drawMgrInv()">${S.products.map(p=>`<option value="${p.id}" ${l.prod===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select>
  <button class="btn sm danger" onclick="syncMI();MI.lines.splice(${k},1);drawMgrInv()" ${MI.lines.length<2?'disabled':''}>حذف</button>
  <div class="r3"><label class="f">الكمية<input type="number" min="1" id="mlq${k}" value="${l.qty}" oninput="syncMI();$('#mtot').textContent=money(MI.lines.reduce((s,l)=>s+lineTotal(l),0))"></label><label class="f">السعر<input type="number" id="mlpr${k}" value="${l.price}" oninput="syncMI();$('#mtot').textContent=money(MI.lines.reduce((s,l)=>s+lineTotal(l),0))"></label><label class="f">خصم ٪<input type="number" min="0" max="100" id="mld${k}" value="${l.disc}" oninput="syncMI();$('#mtot').textContent=money(MI.lines.reduce((s,l)=>s+lineTotal(l),0))"></label></div>
  <div class="sub" style="grid-column:1/-1">متاح في ${MI.src==='main'?'المخزن الرئيسي':'مخزن المندوب'}: <b class="num" style="color:var(--${avail(MI.src,MI.rep,l.prod)>=l.qty?'ok':'bad'})">${fmt(avail(MI.src,MI.rep,l.prod))}</b></div></div>`).join('')}
 <button class="btn" onclick="syncMI();const p=S.products[0];MI.lines.push({prod:p.id,qty:1,price:p.price,disc:0});drawMgrInv()">+ إضافة صنف</button>
 <div class="kv" style="font-size:16px"><span>إجمالي الفاتورة</span><b class="num" id="mtot">${money(tot)}</b></div>
 <label class="row nowrap" style="gap:10px;cursor:pointer"><input type="checkbox" id="mnt" ${MI.notify?'checked':''}><span>ابعت الفاتورة للمندوب في الشات</span></label>
 <button class="btn pri big" onclick="saveMgrInv()">حفظ الفاتورة</button>`)}
function saveMgrInv(){syncMI();if(!MI.cust)return toast('اختار العميل');const no=MI.no.trim();if(!no)return toast('اكتب رقم الفاتورة');
 if(S.invoices.some(i=>i.no===no))return toast('رقم الفاتورة ده متسجل قبل كده');
 const need={};MI.lines.forEach(l=>need[l.prod]=(need[l.prod]||0)+l.qty);
 for(const p in need)if(avail(MI.src,MI.rep,p)<need[p])return toast(`الكمية مش كفاية: ${short(P(p).name)}`);
 for(const p in need){if(MI.src==='main')P(p).main-=need[p];else stockOf(MI.rep)[p]-=need[p]}
 const inv={id:uid('i'),no,rep:MI.rep,cust:MI.cust,date:MI.date,lines:MI.lines.map(l=>({...l})),img:'',status:'open',returns:[],collected:0,by:'manager',src:MI.src};
 S.invoices.push(inv);const notify=MI.notify;closeSheet();render();
 if(notify)sendInvToRep(inv.id,true);toast('اتسجلت الفاتورة');setTimeout(()=>invDetail(inv.id),250)}
function sendInvToRep(id,silent){const i=S.invoices.find(x=>x.id===id);if(!i||!i.rep)return;const path=['companies',ME.companyId,'chats',i.rep];const at=Date.now();
 const text=`📄 فاتورة رقم ${i.no} لـ ${Cu(i.cust).name} بقيمة ${money(invTotal(i)-retValue(i))}.\nتلاقيها في الفواتير، وتقدر تطبعها أو تبعتها للعميل.`;
 FB.setDoc(FB.doc(...path,'messages',uid('m')),{text,from:ME.uid,name:myName(),at,inv:i.id}).catch(e=>Sync.fail(e));
 FB.setDoc(FB.doc(...path),{lastAt:at,lastFrom:ME.uid,lastText:text.slice(0,120),lastName:myName(),readAt:{[ME.uid]:at}},{merge:true}).catch(()=>{});
 if(!silent)toast('الفاتورة اتبعتت لـ '+R(i.rep).name)}

/* invoice detail: clear send-to-customer / send-to-rep buttons */
const _invDetail2=invDetail;
invDetail=function(id){_invDetail2(id);const sh=document.querySelector('.sheet');if(!sh)return;const i=S.invoices.find(x=>x.id===id)||{};
 const shareBtn=sh.querySelector('button[onclick*="\'share\'"]');if(shareBtn)shareBtn.textContent='📤 ابعتها للعميل (واتساب / إيميل)';
 const c=Cu(i.cust)||{};
 if(c.phone)sh.insertAdjacentHTML('beforeend',`<div class="sub">رقم العميل: <b dir="ltr" style="user-select:all">${esc(c.phone)}</b> · لما تدوس "ابعتها للعميل" اختار واتساب وابعتها على الرقم ده.</div>`);
 if(ME.role==='manager'&&i.rep)sh.insertAdjacentHTML('beforeend',`<button class="btn" onclick="sendInvToRep('${id}')">📨 ابعتها لـ ${esc(R(i.rep).name)} في الشات</button>`)};

/* chat: messages carrying an invoice get an "open" button */
const _drawChat=drawChat;
drawChat=function(){_drawChat();const b=$('#chatBox');if(!b||!CHAT)return;const nodes=b.querySelectorAll('.msg');
 CHAT.msgs.forEach((m,k)=>{if(m.inv&&nodes[k]&&S.invoices.some(x=>x.id===m.inv))nodes[k].insertAdjacentHTML('beforeend',`<button class="btn sm" style="margin-top:6px" onclick="invDetail('${m.inv}')">📄 افتح الفاتورة</button>`)})};

/* ===================== تنبيه بالنسخة الجديدة ===================== */
const SITE='https://rafatsaeed719-ui.github.io/bethel-smart/';
async function checkUpdate(){if(!window.FB||!FB.native||!window.APP_BUILD)return;
 try{const r=await fetch(SITE+'version.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)return;const v=await r.json();
  if(!(v.build>window.APP_BUILD))return;try{if(sessionStorage.getItem('bs_upd_hide')==String(v.build))return}catch(e){}
  if(document.querySelector('.upd'))return;
  document.body.insertAdjacentHTML('beforeend',`<div class="upd" role="status"><div class="in"><div style="flex:1;min-width:0"><b>فيه نسخة جديدة من بيثيل اسمارت</b><div class="sub" style="font-size:12.5px">نزّلها وثبّتها فوق القديمة، بياناتك هتفضل زي ما هي.</div></div>
   <a class="btn acc sm" href="${SITE}bethel-smart.apk" target="_blank" rel="noopener">تحديث</a><button class="btn sm" aria-label="إخفاء" onclick="try{sessionStorage.setItem('bs_upd_hide','${v.build}')}catch(e){};this.closest('.upd').remove()">✕</button></div></div>`)}catch(e){}}
setTimeout(checkUpdate,4000);setInterval(checkUpdate,6*3600*1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkUpdate()});
