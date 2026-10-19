
const _d0=new Date(),_p2=n=>String(n).padStart(2,'0');
let TODAY=`${_d0.getFullYear()}-${_p2(_d0.getMonth()+1)}-${_p2(_d0.getDate())}`, MONTH=TODAY.slice(0,7);
const PREV_MONTH=(()=>{const d=new Date(_d0.getFullYear(),_d0.getMonth()-1,1);return `${d.getFullYear()}-${_p2(d.getMonth()+1)}`})();
const LOGO_FULL='logo-full.png';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Number(n||0).toLocaleString('ar-EG',{maximumFractionDigits:2});
const money=n=>fmt(n)+' ج';
const uid=p=>p+Math.random().toString(36).slice(2,8);
const pad=n=>String(n).padStart(2,'0');
const dt=d=>new Date(d+'T12:00:00');
const dow=d=>dt(d).getDay();
const iso=x=>`${x.getFullYear()}-${pad(x.getMonth()+1)}-${pad(x.getDate())}`;
const addDays=(d,n)=>{const x=dt(d);x.setDate(x.getDate()+n);return iso(x)};
const age=d=>Math.round((dt(TODAY)-dt(d))/864e5);
const dFmt=d=>dt(d).toLocaleDateString('ar-EG',{day:'numeric',month:'short'});
const workdays=(a,b)=>{let n=0;for(let d=a;d<=b;d=addDays(d,1))if(dow(d)!==5)n++;return n};
const short=n=>String(n).split(' - ')[0];
const lineTotal=l=>l.qty*l.price*(1-(l.disc||0)/100);
const invTotal=i=>i.lines.reduce((s,l)=>s+lineTotal(l),0);
const retValue=i=>(i.returns||[]).reduce((s,r)=>{const l=i.lines.find(x=>x.prod===r.prod);return s+(l?l.price*(1-(l.disc||0)/100)*r.qty:0)},0);

const ICON={
 visits:'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 customers:'<path d="M4 20V9l8-5 8 5v11"/><path d="M10 20v-5h4v5"/><path d="M12 8v4M10 10h4"/>',
 invoices:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
 stock:'<path d="M3 8l9-5 9 5-9 5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
 collect:'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v.01M18 15v.01"/>',
 me:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 dash:'<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
 reps:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
 tasks:'<rect x="4" y="4" width="16" height="17" rx="2"/><path d="M9 3v3h6V3"/><path d="M8.5 13l2.5 2.5 4.5-5"/>',
 vac:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M9 15.5l2 2 4-4"/>',
 store:'<path d="M3 8l9-5 9 5-9 5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
 rules:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
 companies:'<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 10h1M14 10h1M9 14h1M14 14h1M9 18h1M14 18h1"/>',
 welcome:'<path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/>'
};
const TILE={visits:['#2CC2A9','#0B7F6C'],customers:['#5B9BFF','#2457C5'],invoices:['#FFC75A','#D48A0C'],stock:['#A88BFF','#6544C9'],collect:['#5FDB8E','#1E8F4E'],me:['#4C82D1','#0B2C55'],
 dash:['#2CC2A9','#0B7F6C'],reps:['#5B9BFF','#2457C5'],tasks:['#FFC75A','#D48A0C'],vac:['#A88BFF','#6544C9'],store:['#FF8A7A','#C8432F'],rules:['#8DA0BE','#45577A'],
 companies:['#4C82D1','#0B2C55'],welcome:['#2CC2A9','#0B7F6C'],target:['#FFC75A','#D48A0C'],plan:['#FF8A7A','#C8432F']};
ICON.target='<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 12l7-7M16 5h3v3"/>';
ICON.plan=ICON.target;
ICON.reports='<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 12l4 5M13 12l-4 5"/>';ICON.allinv=ICON.invoices;
TILE.reports=['#4FCB7E','#1D7A45'];TILE.allinv=['#FFC75A','#D48A0C'];
const tile=(k,cls='')=>`<span class="tile ${cls}" style="--c1:${TILE[k][0]};--c2:${TILE[k][1]}" aria-hidden="true"><svg viewBox="0 0 24 24">${ICON[k]}</svg></span>`;
let ringN=0;
function ring(pct,size=170){const sw=size*.09,r=size/2-sw/2-2,C=2*Math.PI*r,shown=Math.min(Math.max(pct,0),100),off=C*(1-shown/100),id='g'+(ringN++),done=pct>=100;
 return `<svg class="ringsvg ${done?'done':''}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${Math.round(pct)}٪ من التارجت">
 <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${done?'#FFD458':'#2CC2A9'}"/><stop offset="1" stop-color="${done?'#E09B22':'#1E4F8C'}"/></linearGradient></defs>
 <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--sunk)" stroke-width="${sw}"/>
 <circle class="arc" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="url(#${id})" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${off}" style="--c:${C}" transform="rotate(-90 ${size/2} ${size/2})"/>
 <text x="50%" y="${size*.5}" text-anchor="middle" dominant-baseline="middle" font-size="${size*.2}" font-weight="700">${fmt(Math.round(pct))}٪</text>
 ${size>110?`<text class="lbl" x="50%" y="${size*.68}" text-anchor="middle" font-size="${size*.075}">${done?'حققت التارجت':'من التارجت'}</text>`:''}</svg>`}
function stars(pct){const n=pct>100?Math.floor((pct-100)/10):0;return `<div class="stars" aria-label="${n} نجمة">${Array.from({length:Math.min(n,30)},(_,i)=>`<span style="animation-delay:${.9+i*.08}s">★</span>`).join('')}</div>`}
function targetCard(rep,mode,editable){const pl=plan(rep);const wk=mode==='week';const [ws,we]=weekRange();const from=wk?ws:MONTH+'-01',to=wk?we:MONTH+'-31';
 const target=wk?pl.targetWeek:pl.targetMonth;const done=sales(rep,from,to);const pct=target?done/target*100:0;const n=pct>100?Math.floor((pct-100)/10):0;
 return `<div class="card"><div class="row between nowrap"><div class="row nowrap">${tile('target')}<h3>تارجت ${wk?'الأسبوع':'الشهر'}</h3></div>
  <div class="seg" style="flex:none"><button class="${wk?'on':''}" onclick="V.planMode='week';render()">أسبوع</button><button class="${wk?'':'on'}" onclick="V.planMode='month';render()">شهر</button></div></div>
  <div class="target">${ring(pct)}${stars(pct)}
  <div class="num" style="font-family:var(--f-display);font-weight:600;font-size:17px">${money(done)} <span class="sub">من ${money(target)}</span></div>
  <div class="sub">${n?`عدّيت التارجت · ${fmt(n)} نجمة (نجمة عن كل ١٠٪ زيادة)`:pct>=100?'حققت التارجت · كل ١٠٪ زيادة = نجمة':`فاضلك ${money(Math.max(0,target-done))} · ${wk?`لحد ${dFmt(we)}`:'لحد آخر الشهر'}`}</div>
  <div class="sub">التارجت محدد من المدير · محسوب من الفواتير بعد المرتجع</div></div></div>`}
const TABS={
 rep:[['visits','الزيارات'],['customers','العملاء'],['invoices','الفواتير'],['stock','المخزن'],['collect','التحصيلات'],['me','حسابي']],
 manager:[['dash','الرئيسية'],['reps','الموظفين'],['reports','التقارير'],['tasks','المهام'],['vac','الأجازات'],['store','المخزن'],['rules','القواعد']],
 acc:[['reports','التقارير'],['allinv','الفواتير']],
 owner:[['companies','الشركات'],['welcome','رسالة الترحيب']]
};
const RULE_T={
 lowVisits:{name:'زيارات اليوم أقل من الحد الأدنى',unit:'عن كل يوم'},
 overdue:{name:'فاتورة متأخرة في التحصيل',unit:'عن كل فاتورة',param:'متأخرة أكتر من كام يوم'},
 coverage:{name:'صيدلية متزارتش العدد المطلوب في الشهر',unit:'عن كل صيدلية · بيتحسب آخر الشهر'},
 noTalk:{name:'زيارة من غير ما يكتب المحادثة',unit:'عن كل زيارة'},
 noPhoto:{name:'فاتورة من غير صورة',unit:'عن كل فاتورة'}
};
const DEDUCT_OPTS=[0.25,0.5,1,1.5,2];
const DLBL=n=>({0.25:'ربع يوم',0.5:'نص يوم',1:'يوم',1.5:'يوم ونص',2:'يومين'})[n]||fmt(n)+' يوم';
const DEFAULT_WELCOME=`يسعدنا انضمام شركتكم لعائلة بيثيل اسمارت.

البرنامج ده معمول مخصوص عشان يدّيك صورة كاملة عن شغل فريق المبيعات بتاعك: كل زيارة بموقعها، كل فاتورة وتحصيلها، والمخزن اللي مع كل مندوب لحظة بلحظة.

من هنا تقدر تعمل حسابات الموظفين، وتحدد قواعد الزيارات والخصومات، وتبعت المهام، وتتابع الأجازات، وانت مطمّن إن كل حاجة متسجلة قدامك.

إحنا معاك خطوة بخطوة، وأي وقت تحتاجنا هتلاقينا.`;

const OWNER_EMAIL='rafatsaeed719@gmail.com';
const DEFAULT_SETTINGS={radius:100,dueDays:25,minVisits:8,maxVisits:15,perMonth:3,gapDays:4};
const DEFAULT_RULES=[{id:'ru1',type:'lowVisits',amount:0.5,active:true},{id:'ru2',type:'overdue',param:35,amount:0.25,active:true},{id:'ru3',type:'coverage',amount:0.25,active:false},{id:'ru4',type:'noTalk',amount:0.25,active:false}];
function emptyState(){return {company:null,products:[],reps:[],accountants:[],customers:[],visits:[],queue:[],invoices:[],plans:{},stock:{},transfers:[],orders:[],
 settings:{...DEFAULT_SETTINGS},custRules:{},rules:DEFAULT_RULES.map(r=>({...r})),tasks:[],vacations:[],welcomeText:DEFAULT_WELCOME,companies:[]}}
let S=emptyState();
const plan=rep=>S.plans[rep]||(S.plans[rep]={today:[],week:[],month:[],targetWeek:0,targetMonth:0,commits:[]});
const stockOf=rep=>S.stock[rep]||(S.stock[rep]={});
let ME=null;
let V={role:null,tab:'visits',invFilter:'all',planMode:'week',calSel:TODAY,custFilter:'all',custQ:'',dashSeg:'overview',dashRep:'',collMonth:MONTH,welcomeSeen:false};

/* ============ SYNC: keeps S mirrored with Firestore ============
   Listeners fill S from the database. After every render, flush() compares each
   document with what the database last said and writes only the ones that changed. */
const stable=o=>Array.isArray(o)?'['+o.map(stable).join(',')+']':(o&&typeof o==='object')?'{'+Object.keys(o).filter(k=>o[k]!==undefined).sort().map(k=>JSON.stringify(k)+':'+stable(o[k])).join(',')+'}':JSON.stringify(o===undefined?null:o);
const noId=({id,...rest})=>rest;
const ERR_AR={'permission-denied':'مفيش صلاحية للعملية دي','unavailable':'مفيش نت دلوقتي، هنحاول تاني'};
const Sync={
 unsubs:[],shadow:new Map(),loaded:new Set(),prevQ:0,
 co(...p){return ['companies',ME.companyId,...p]},
 role(){return ME?ME.role:null},
 specs(){const r=this.role(),mgr=r==='manager',rep=r==='rep',arr=(name,get,opt={})=>({name,items:()=>get().map(o=>[o.id,noId(o)]),path:id=>this.co(name,id),...opt});
  if(r==='owner')return [
   {name:'companies',items:()=>S.companies.map(o=>[o.id,noId(o)]),path:id=>['companies',id],write:true,del:false},
   {name:'config',items:()=>[['app',{welcomeText:S.welcomeText}]],path:id=>['config',id],write:true,del:false}];
  if(!ME.companyId)return [];
  const W=n=>mgr||(rep&&['customers','visits','invoices','orders','stock','plans','vacations'].includes(n));
  return [
   arr('products',()=>S.products,{write:mgr}),
   arr('customers',()=>S.customers,{write:W('customers')}),
   arr('visits',()=>S.visits.concat(S.queue),{write:W('visits')}),
   arr('invoices',()=>S.invoices,{write:W('invoices')}),
   arr('transfers',()=>S.transfers,{write:mgr}),
   arr('orders',()=>S.orders,{write:W('orders')}),
   arr('vacations',()=>S.vacations,{write:W('vacations'),del:mgr}),
   arr('tasks',()=>S.tasks,rep?{write:true,del:false,custom:(id,d)=>FB.updateDoc(FB.doc(...this.co('tasks',id)),{['done.'+ME.uid]:(d.done||{})[ME.uid]||null})}:{write:mgr}),
   {name:'stock',items:()=>Object.entries(S.stock),path:id=>this.co('stock',id),write:W('stock'),del:false},
   {name:'plans',items:()=>Object.entries(S.plans),path:id=>this.co('plans',id),write:W('plans'),del:false},
   {name:'settings',items:()=>[['main',{...S.settings,rules:S.rules,custRules:S.custRules}]],path:id=>this.co('settings',id),write:mgr,del:false},
   {name:'users',items:()=>S.reps.concat(S.accountants).map(o=>[o.id,noId(o)]),path:id=>['users',id],write:mgr||rep,del:false,
    custom:rep?(id,d)=>id===ME.uid?FB.updateDoc(FB.doc('users',id),{photo:d.photo||''}):Promise.resolve():null}
  ]},
 flush(){if(!ME||!window.FB)return;
  for(const sp of this.specs()){if(!sp.write||!this.loaded.has(sp.name))continue;const seen=new Set();
   for(const [id,data] of sp.items()){const key=sp.name+'/'+id;seen.add(key);const j=stable(data);
    if(this.shadow.get(key)!==j){this.shadow.set(key,j);const clean=JSON.parse(j);
     (sp.custom?sp.custom(id,clean):FB.setDoc(FB.doc(...sp.path(id)),clean)).catch(e=>this.fail(e))}}
   if(sp.del===false)continue;
   for(const key of [...this.shadow.keys()])if(key.startsWith(sp.name+'/')&&!seen.has(key)){this.shadow.delete(key);
    FB.deleteDoc(FB.doc(...sp.path(key.slice(sp.name.length+1)))).catch(e=>this.fail(e))}}},
 fail(e){console.warn(e);toast(ERR_AR[e&&e.code]||'حصلت مشكلة في الحفظ')},
 track(name,docs){for(const k of [...this.shadow.keys()])if(k.startsWith(name+'/'))this.shadow.delete(k);docs.forEach(([id,o])=>this.shadow.set(name+'/'+id,stable(o)))},
 on(name,ref,fn){const un=FB.onSnapshot(ref,{includeMetadataChanges:true},snap=>{fn(snap);this.loaded.add(name);scheduleRender()},
   err=>{console.warn(name,err);this.loaded.add(name);if(err.code==='permission-denied'&&name==='company'){logoutWith('الحساب أو اشتراك الشركة موقوف. كلّم المسؤول عنك.')}else scheduleRender()});this.unsubs.push(un)},
 list(name,ref,set){this.on(name,ref,snap=>{const all=snap.docs.map(d=>({id:d.id,...d.data(),_p:d.metadata.hasPendingWrites}));
   this.track(name,all.map(o=>{const {_p,...x}=o;return [o.id,noId(x)]}));set(all.map(o=>{const {_p,...x}=o;x.__p=_p;return x}))})},
 strip(a){return a.map(o=>{const {__p,...x}=o;return x})},
 map(name,ref,target){this.on(name,ref,snap=>{const m={};snap.docs.forEach(d=>m[d.id]=d.data());this.track(name,Object.entries(m));S[target]=m})},
 start(){const F=FB,q=(...a)=>F.query(...a),w=F.where,col=n=>F.col(...this.co(n)),r=this.role();
  this.on('config',F.doc('config','app'),s=>{if(s.exists()&&s.data().welcomeText)S.welcomeText=s.data().welcomeText;this.track('config',[['app',{welcomeText:S.welcomeText}]])});
  if(r==='owner'){this.list('companies',F.col('companies'),a=>S.companies=this.strip(a));return}
  const co=ME.companyId,rep=r==='rep',uidW=f=>q(col(f.c),w(f.k,'==',ME.uid));
  this.on('company',F.doc('companies',co),s=>{S.company=s.exists()?{id:s.id,...s.data()}:null});
  this.on('settings',F.doc(...this.co('settings','main')),s=>{const d=s.exists()?s.data():{};const {rules,custRules,...st}=d;
   S.settings={...DEFAULT_SETTINGS,...st};S.rules=rules||DEFAULT_RULES.map(x=>({...x}));S.custRules=custRules||{};
   this.track('settings',[['main',{...S.settings,rules:S.rules,custRules:S.custRules}]])});
  this.list('products',col('products'),a=>S.products=this.strip(a));
  this.list('tasks',col('tasks'),a=>S.tasks=this.strip(a));
  if(rep){
   this.on('users',F.doc('users',ME.uid),s=>{if(!s.exists()||s.data().active===false)return logoutWith('الحساب ده اتوقف. كلّم المدير.');
    const o={id:s.id,...s.data()};this.track('users',[[o.id,noId(o)]]);S.reps=[o]});
   this.list('customers',uidW({c:'customers',k:'addedBy'}),a=>S.customers=this.strip(a));
   this.list('visits',uidW({c:'visits',k:'rep'}),a=>this.setVisits(a));
   this.list('invoices',uidW({c:'invoices',k:'rep'}),a=>S.invoices=this.strip(a));
   this.list('transfers',uidW({c:'transfers',k:'rep'}),a=>S.transfers=this.strip(a));
   this.list('orders',uidW({c:'orders',k:'rep'}),a=>S.orders=this.strip(a));
   this.list('vacations',uidW({c:'vacations',k:'rep'}),a=>S.vacations=this.strip(a));
   this.on('stock',F.doc(...this.co('stock',ME.uid)),s=>{const d=s.exists()?s.data():{};S.stock={[ME.uid]:d};this.track('stock',s.exists()?[[ME.uid,d]]:[])});
   this.on('plans',F.doc(...this.co('plans',ME.uid)),s=>{if(s.exists()){S.plans={[ME.uid]:s.data()};this.track('plans',[[ME.uid,s.data()]])}else{S.plans={};this.track('plans',[])}});
  }else{
   this.list('users',q(F.col('users'),w('companyId','==',co)),a=>{const all=this.strip(a);S.reps=all.filter(u=>u.role==='rep'&&u.active!==false);S.accountants=all.filter(u=>u.role==='acc'&&u.active!==false);
    if(r==='acc'&&!all.some(u=>u.id===ME.uid&&u.active!==false))logoutWith('الحساب ده اتوقف. كلّم المدير.')});
   this.list('customers',col('customers'),a=>S.customers=this.strip(a));
   this.list('visits',q(col('visits'),w('date','>=',PREV_MONTH+'-01')),a=>this.setVisits(a));
   this.list('invoices',col('invoices'),a=>S.invoices=this.strip(a));
   this.list('transfers',col('transfers'),a=>S.transfers=this.strip(a));
   this.list('orders',col('orders'),a=>S.orders=this.strip(a));
   this.list('vacations',col('vacations'),a=>S.vacations=this.strip(a));
   this.map('stock',col('stock'),'stock');this.map('plans',col('plans'),'plans');
  }},
 setVisits(a){const pend=a.filter(v=>v.__p),done=a.filter(v=>!v.__p);S.visits=this.strip(done);S.queue=this.strip(pend);
  const q=pend.filter(v=>v.rep===ME.uid).length;if(this.prevQ>q&&!V.offline)toast(`اتبعت ${fmt(this.prevQ-q)} زيارة واتسجلت في التقويم`);this.prevQ=q},
 stop(){this.unsubs.forEach(u=>{try{u()}catch(e){}});this.unsubs=[];this.shadow.clear();this.loaded.clear();this.prevQ=0},
 ready(){const r=this.role();if(r==='owner')return this.loaded.has('companies');return this.loaded.has('settings')&&this.loaded.has('users')}
};
function save(){Sync.flush()}
let _rq=false;
function scheduleRender(){if(_rq)return;_rq=true;requestAnimationFrame(()=>{_rq=false;if(!ME)return;const ae=document.activeElement;
 if(ae&&$('#main').contains(ae)&&/INPUT|TEXTAREA|SELECT/.test(ae.tagName)){ae.addEventListener('blur',scheduleRender,{once:true});return}render()})}

const P=id=>S.products.find(p=>p.id===id)||{name:'؟',price:0};
const Cu=id=>S.customers.find(c=>c.id===id)||{name:'؟'};
const R=id=>S.reps.find(r=>r.id===id)||{name:'؟',perms:{}};
const isRep=()=>S.reps.some(r=>r.id===V.role);
const isAcc=()=>S.accountants.some(a=>a.id===V.role);
const Acc=id=>S.accountants.find(a=>a.id===id);
const grpOf=()=>isRep()?'rep':isAcc()?'acc':V.role;
const me=()=>R(V.role);
const invState=i=>i.status==='paid'?'paid':(age(i.date)>=S.settings.dueDays?'due':'open');
const STATE_PILL={paid:'<span class="pill ok">تم الدفع</span>',due:'<span class="pill bad">مستحقة</span>',open:'<span class="pill warn">مفتوحة</span>'};
const visitsOn=(rep,date)=>S.visits.filter(v=>v.rep===rep&&v.date===date);
const monthVisits=rep=>S.visits.filter(v=>v.rep===rep&&v.date.startsWith(MONTH));
const sales=(rep,from,to)=>S.invoices.filter(i=>i.rep===rep&&i.date>=from&&i.date<=to).reduce((s,i)=>s+invTotal(i)-retValue(i),0);
const collected=(rep,month)=>S.invoices.filter(i=>i.rep===rep&&i.status==='paid'&&(i.paidDate||'').startsWith(month)).reduce((s,i)=>s+i.collected,0);
const custRule=cid=>S.custRules[cid]||{perMonth:S.settings.perMonth,gap:S.settings.gapDays};
const lastVisitOf=cid=>S.visits.concat(S.queue).filter(v=>v.cust===cid).map(v=>v.date).sort().pop();
const onVac=(rep,date)=>S.vacations.some(v=>v.rep===rep&&v.status==='approved'&&date>=v.from&&date<=v.to);
const vacUsed=rep=>S.vacations.filter(v=>v.rep===rep&&v.status==='approved').reduce((s,v)=>s+workdays(v.from,v.to),0);
const myTasks=rep=>S.tasks.filter(t=>t.to==='all'||t.to.includes(rep));
const openTasks=rep=>myTasks(rep).filter(t=>!t.done[rep]);
function weekRange(){const d=dt(TODAY);const back=(d.getDay()+1)%7;const s=addDays(TODAY,-back);return [s,addDays(s,6)]}
function dues(rep){return S.invoices.filter(i=>i.rep===rep&&invState(i)==='due')}
function avatar(r,cls=''){return r.photo?`<img class="av ${cls}" src="${r.photo}" alt="">`:`<span class="av ${cls}" aria-hidden="true">${esc((r.name||'؟').trim()[0])}</span>`}

/* Deduction engine: absence + every active rule the manager set */
function deductions(rep){const r=R(rep),items=[],st=S.settings;const active=t=>S.rules.find(x=>x.type===t&&x.active);
 const low=active('lowVisits');
 for(let d=1;d<+TODAY.slice(8);d++){const date=`${MONTH}-${pad(d)}`;if(dow(date)===5||onVac(rep,date))continue;const n=visitsOn(rep,date).length;
  if(n===0){items.push({date,amount:r.absenceDeduct,label:'يوم من غير ولا زيارة ومن غير أجازة',kind:'غياب'});continue}
  if(low&&n<st.minVisits)items.push({date,amount:low.amount,label:`${fmt(n)} زيارة بس (الحد الأدنى ${fmt(st.minVisits)})`,kind:'زيارات أقل'})}
 const od=active('overdue');if(od)S.invoices.filter(i=>i.rep===rep&&i.status!=='paid'&&age(i.date)>od.param).forEach(i=>items.push({date:i.date,amount:od.amount,label:`فاتورة #${i.no} - ${Cu(i.cust).name} متأخرة ${fmt(age(i.date))} يوم`,kind:'تحصيل متأخر'}));
 const nt=active('noTalk');if(nt)monthVisits(rep).filter(v=>!v.talk).forEach(v=>items.push({date:v.date,amount:nt.amount,label:`زيارة ${Cu(v.cust).name} من غير محادثة`,kind:'زيارة ناقصة'}));
 const np=active('noPhoto');if(np)S.invoices.filter(i=>i.rep===rep&&i.date.startsWith(MONTH)&&!i.img).forEach(i=>items.push({date:i.date,amount:np.amount,label:`فاتورة #${i.no} من غير صورة`,kind:'فاتورة ناقصة'}));
 const cov=active('coverage');const proj=[];
 if(cov){const cnt={};monthVisits(rep).forEach(v=>cnt[v.cust]=(cnt[v.cust]||0)+1);S.customers.filter(c=>c.addedBy===rep).forEach(c=>{const need=custRule(c.id).perMonth;if((cnt[c.id]||0)<need)proj.push({amount:cov.amount,label:`${c.name}: ${fmt(cnt[c.id]||0)} من ${fmt(need)} زيارات`})})}
 items.sort((a,b)=>a.date.localeCompare(b.date));
 return {items,total:items.reduce((s,i)=>s+i.amount,0),proj,projTotal:proj.reduce((s,i)=>s+i.amount,0)}}

function toast(t){const el=document.createElement('div');el.className='toast';el.textContent=t;document.body.appendChild(el);setTimeout(()=>el.remove(),2300)}
function sheet(html){$('#sheetRoot').innerHTML=`<div class="ov" onclick="if(event.target===this)closeSheet()"><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div></div>`}
function closeSheet(){$('#sheetRoot').innerHTML=''}
function animate(cls){const m=$('#main');m.classList.remove('anim-l','anim-r','anim-u');void m.offsetWidth;m.classList.add(cls);clearTimeout(window._an);window._an=setTimeout(()=>m.classList.remove(cls),700)}
function go(t){const tabs=TABS[grpOf()].map(x=>x[0]);const a=tabs.indexOf(V.tab),b=tabs.indexOf(t);V.tab=t;render();window.scrollTo(0,0);animate(a<0||b<0?'anim-u':b>a?'anim-l':'anim-r')}
function sig(){return `<footer class="sig">بيثيل اسمارت · رأفت سعيد · <a href="https://rafatsaeed.com" target="_blank" rel="noopener">rafatsaeed.com</a></footer>`}

function render(){
 const grp=grpOf();
 if(!ME)return;
 const coName=S.company&&S.company.name||'';
 $('#hsub').textContent=V.role==='owner'?'لوحة صاحب البرنامج':coName+(isRep()?' · '+me().name:isAcc()?' · الحسابات':'');
 if(isRep()&&V.offline)$('#hsub').textContent='● من غير نت · '+me().name;
 $('#tabs').className='in'+(TABS[grp].length>6?' many':'');
 $('#tabs').innerHTML=TABS[grp].map(([k,l])=>`<button class="${V.tab===k?'on':''}" onclick="go('${k}')" aria-current="${V.tab===k?'page':'false'}">${tile(k)}${l}</button>`).join('');
 const b=$('#bell'); if(isRep()){const n=dues(V.role).length+openTasks(V.role).length;b.hidden=false;$('#bellN').textContent=fmt(n);$('#bellN').hidden=!n}
 else if(V.role==='manager'){const n=S.vacations.filter(v=>v.status==='pending').length;b.hidden=false;$('#bellN').textContent=fmt(n);$('#bellN').hidden=!n}else b.hidden=true;
 $('#main').innerHTML=(Sync.ready()?(VIEWS[V.tab]||(()=>''))():loadingHTML())+sig();
 save();
}
const VIEWS={};

/* ============ WELCOME ============ */
function welcomeHTML(){return `<div class="welcome"><div class="plate"><img src="${LOGO_FULL}" alt="بيثيل للتدريب والتطوير"></div>
 <h2>أهلاً بيك في بيثيل اسمارت</h2>
 <div class="body">${esc(S.welcomeText).split(/\n\s*\n/).map(p=>`<p>${p.replace(/\n/g,'<br>')}</p>`).join('')}</div>
 <div class="sign"><span class="sub">مع خالص التحية،</span><span class="who">رأفت سعيد</span><a href="https://rafatsaeed.com" target="_blank" rel="noopener">rafatsaeed.com</a></div></div>`}
function showWelcome(){sheet(welcomeHTML()+`<button class="btn pri big" onclick="closeSheet()">يلا نبدأ</button>`)}

/* ============ REP: VISITS ============ */
function calendar(rep){
 const first=`${MONTH}-01`;const lead=(dow(first)+1)%7;
 let h=['سبت','حد','اتنين','تلات','أربع','خميس','جمعة'].map(x=>`<div class="h">${x}</div>`).join('');
 for(let i=0;i<lead;i++)h+='<div></div>';
 for(let d=1;d<=new Date(+MONTH.slice(0,4),+MONTH.slice(5,7),0).getDate();d++){const date=`${MONTH}-${pad(d)}`;const n=visitsOn(rep,date).length;const vac=onVac(rep,date);let cls,lbl=fmt(n);
  if(dow(date)===5){cls='off';lbl='–'}else if(vac){cls='vac';lbl='أجازة'}else if(date>TODAY){cls='fut';lbl='–'}else if(date===TODAY)cls=n>=S.settings.minVisits?'ok':'';else cls=n>=S.settings.minVisits?'ok':'low';
  if(date===TODAY)cls+=' today'; if(date===V.calSel)cls+=' sel';
  h+=`<button class="${cls}" onclick="V.calSel='${date}';render()" aria-label="${d} ${mName(MONTH)}: ${vac?'أجازة':n+' زيارة'}"><span class="dn">${fmt(d)}</span><span class="c">${lbl}</span></button>`}
 return `<div class="cal">${h}</div>`}
function visitRow(v,showRep){const c=Cu(v.cust);const rc={'طلب أوردر':'ok','مهتم':'acc','متابعة':'warn','غير مهتم':'bad'}[v.result]||'';
 return `<div class="item">${showRep?avatar(R(v.rep)):''}<div class="grow"><div class="row between"><span class="t">${esc(c.name)}</span><span class="pill ${rc}">${esc(v.result)}</span></div>
 <div class="d">${showRep?esc(R(v.rep).name)+' · ':''}${fmt(+v.time.split(':')[0])}:${v.time.split(':')[1]} · ${v.items.map(p=>esc(short(P(p).name))).join('، ')}</div>
 ${v.talk?`<div class="d">${esc(v.talk)}</div>`:'<div class="d" style="color:var(--warn)">من غير محادثة</div>'}${v.order?`<div class="d">أوردر: ${v.order.map(o=>fmt(o.qty)+' '+esc(P(o.prod).name.split(' ')[0])).join('، ')}</div>`:''}</div></div>`}
/* ============ OFFLINE QUEUE ============ */
V.offline=typeof navigator!=='undefined'&&navigator.onLine===false;
function setOffline(off){if(V.offline===off)return;V.offline=off;scheduleRender()}
window.addEventListener('offline',()=>setOffline(true));window.addEventListener('online',()=>setOffline(false));
function myQueue(){return S.queue.filter(v=>v.rep===V.role)}
function netBar(){const q=myQueue().length;
 if(V.offline)return `<div class="netbar off"><span class="dot"></span><div class="grow" style="flex:1"><b>انت من غير نت</b><div style="font-size:12.5px">الموقع شغال من الـ GPS. الزيارات بتتحفظ في قائمة الانتظار وبتتبعت لوحدها أول ما النت يرجع.</div></div></div>`;
 if(q)return `<div class="netbar on"><span class="spin"></span><b>بنبعت ${fmt(q)} زيارة...</b></div>`;
 return ''}
function queueCard(){const q=myQueue();if(!q.length)return '';
 return `<div class="card" style="border-color:var(--warn)"><div class="row between"><div class="row nowrap"><h3>قائمة الانتظار</h3><span class="pill warn">${fmt(q.length)}</span></div>
</div>
  <div class="sub">زيارات اتسجلت من غير نت، وهتتنقل للتقويم أول ما تتبعت.</div>
  <div class="list">${q.map(v=>`<div class="item qitem"><div class="grow"><div class="row between"><span class="t">${esc(Cu(v.cust).name)}</span><span class="pill warn">${V.offline?'مستنية النت':'بتتبعت...'}</span></div><div class="d">${fmt(+v.time.split(':')[0])}:${v.time.split(':')[1]} · ${esc(v.result)} · ${v.items.map(p=>esc(short(P(p).name))).join('، ')} · اتأكد الموقع ✓</div></div></div>`).join('')}</div></div>`}
function netSwitch(){return ''}
VIEWS.visits=()=>{
 const rep=V.role,pl=plan(rep),todayV=visitsOn(rep,TODAY),st=S.settings;
 const visitedToday=new Set(todayV.map(v=>v.cust));const queuedIds=new Set(myQueue().map(v=>v.cust));const sel=visitsOn(rep,V.calSel);const ded=deductions(rep);const ot=openTasks(rep);
 const n=todayV.length;
 return `<div class="row between nowrap"><div class="row nowrap">${avatar(me())}<div><h2>أهلاً ${esc(me().name.split(' ')[0])}</h2><div class="sub">${dt(TODAY).toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long'})} · ${esc(me().area||'')}</div></div></div><span class="pill ${n>=st.minVisits?'ok':'warn'}">${fmt(n)} من ${fmt(st.minVisits)}</span></div>
 ${netBar()}
 ${queueCard()}
 ${ot.length?`<div class="card" style="border-color:var(--accent)"><div class="row between"><h3>مهام من المدير</h3><span class="pill acc">${fmt(ot.length)} جديدة</span></div><div class="list">${ot.map(taskRow).join('')}</div></div>`:''}
 <button class="btn pri big" onclick="pickCustomer()">${tile('visits')}ابدأ زيارة</button>
 <div class="row" style="justify-content:flex-end">${netSwitch()}</div>
 ${targetCard(rep,V.planMode)}
 <div class="card"><div class="row between"><h3>عملاء النهارده</h3><button class="btn sm" onclick="editList('today')">حدد العملاء</button></div>
  <div class="list">${pl.today.length?pl.today.map(id=>{const c=Cu(id);const done=visitedToday.has(id);return `<div class="item"><div class="grow"><div class="t">${esc(c.name)}</div><div class="d">${esc(c.type)} · ${esc(c.phone)}</div></div>${done?'<span class="pill ok">✓ اتزارت</span>':queuedIds.has(id)?'<span class="pill warn">في الانتظار</span>':`<button class="btn sm" onclick="geoCheck('${id}')">زيارة</button>`}</div>`}).join(''):'<div class="empty">لسه ما حددتش عملاء النهارده</div>'}</div></div>
 <div class="card"><div class="row between"><h3>تقويم ${mName(MONTH)}</h3><span class="sub">المطلوب ${fmt(st.minVisits)}–${fmt(st.maxVisits)} زيارة يومياً</span></div>
  ${calendar(rep)}
  <div class="legend"><span style="--c:var(--ok-soft)">وصل للعدد</span><span style="--c:var(--bad-soft)">أقل من المطلوب / غياب</span><span style="--c:var(--vac-soft)">أجازة متوافق عليها</span></div>
  ${ded.total?`<button class="note bad" style="border:0;text-align:right;font:inherit;font-size:12.5px;cursor:pointer" onclick="go('me')">خصومات الشهر لحد دلوقتي: <b>${fmt(ded.total)} يوم</b> · اضغط للتفاصيل</button>`:''}</div>
 <div class="card"><div class="row between"><h3>زيارات ${V.calSel===TODAY?'النهارده':dFmt(V.calSel)}</h3><span class="pill">${fmt(sel.length)}</span></div>
  <div class="list">${sel.length?sel.slice().reverse().map(v=>visitRow(v)).join(''):`<div class="empty">${onVac(rep,V.calSel)?'اليوم ده أجازة':'مفيش زيارات في اليوم ده'}</div>`}</div></div>`};
function pickCustomer(){const mine=S.customers.filter(c=>c.addedBy===V.role);
 sheet(`<h3>اختار العميل</h3><input id="pq" placeholder="ابحث باسم الصيدلية أو العيادة" oninput="document.querySelectorAll('#pl .item').forEach(e=>e.hidden=!e.dataset.n.includes(this.value))">
 <div class="card"><div class="list" id="pl">${mine.map(c=>{const lv=lastVisitOf(c.id);return `<div class="item" data-n="${esc(c.name)}"><div class="grow"><div class="t">${esc(c.name)}</div><div class="d">${esc(c.type)} · ${lv?'آخر زيارة من '+fmt(age(lv))+' يوم':'لسه ما اتزارتش'}</div></div><button class="btn sm pri" onclick="geoCheck('${c.id}')">اختيار</button></div>`}).join('')}</div></div>`)}
let GEO={pos:null,err:''},LASTGEO=null;
function haversine(a,b,c,d){const t=x=>x*Math.PI/180,h=Math.sin(t(c-a)/2)**2+Math.cos(t(a))*Math.cos(t(c))*Math.sin(t(d-b)/2)**2;return 2*6371000*Math.asin(Math.sqrt(h))}
async function locate(){GEO.err='';try{GEO.pos=await FB.getPosition()}catch(e){GEO.pos=null;GEO.err=(e&&e.message)||'مقدرناش نحدد موقعك، اتأكد إن الـ GPS شغال'}}
async function geoCheck(cid){sheet(`<h3>${esc(Cu(cid).name)}</h3><div class="geo"><span class="spin" style="width:44px;height:44px;border-width:4px;color:var(--accent)"></span><div class="msg">بنحدد موقعك...</div><div class="sub">اتأكد إن الـ GPS شغال</div></div>`);
 await locate();drawGeo(cid)}
function drawGeo(cid){const c=Cu(cid);const r=S.settings.radius;const has=c.lat!=null&&c.lng!=null;
 const d=GEO.pos&&has?Math.round(haversine(GEO.pos.lat,GEO.pos.lng,c.lat,c.lng)):null;const ok=d!==null&&d<=r;
 LASTGEO=GEO.pos?{cid,lat:GEO.pos.lat,lng:GEO.pos.lng,acc:Math.round(GEO.pos.acc||0),dist:d}:null;
 const rule=custRule(cid);const lv=lastVisitOf(cid);const since=lv?age(lv):null;const gapBlock=since!==null&&since<rule.gap;
 const mcount=S.visits.concat(S.queue).filter(v=>v.cust===cid&&v.date.startsWith(MONTH)).length;
 const msg=!has?'العميل ده ملوش موقع متسجل. سجّله من صفحة العملاء وانت عنده.':GEO.err?GEO.err:ok?'أنت في موقع العميل':'أنت بعيد عن موقع العميل · مينفعش تبدأ زيارة';
 sheet(`<h3>${esc(c.name)}</h3>
 <div class="geo"><div class="ring ${ok?'ok':'bad'}"><div class="dot">${ok?'✓':'✕'}</div></div>
  <div class="msg" style="color:var(--${ok?'ok':'bad'})">${esc(msg)}</div>
  ${d!==null?`<div class="sub num">المسافة: ${fmt(d)} متر · المسموح: ${fmt(r)} متر</div><div class="sub num">دقة الـ GPS: ± ${fmt(Math.round(GEO.pos.acc||0))} متر</div>`:''}</div>
 ${ok?'':`<button class="btn" onclick="geoCheck('${cid}')">↻ حدّث موقعي</button>`}
 <div class="stats"><div class="stat"><div class="v num">${since===null?'—':fmt(since)+' يوم'}</div><div class="l">من آخر زيارة (أقل حاجة ${fmt(rule.gap)})</div></div><div class="stat"><div class="v num">${fmt(mcount)} / ${fmt(rule.perMonth)}</div><div class="l">زيارات الشهر للعميل ده</div></div></div>
 ${V.offline?`<div class="note" style="background:var(--warn-soft);color:var(--warn)">مفيش نت دلوقتي. الموقع بيتحسب من الـ GPS عادي، والزيارة هتتحفظ في قائمة الانتظار.</div>`:''}
 ${gapBlock?`<div class="note bad">لازم يعدّي ${fmt(rule.gap)} أيام بين كل زيارة والتانية للعميل ده. تقدر تزوره من يوم ${dFmt(addDays(lv,rule.gap))}.</div>`:''}
 <button class="btn pri big" ${ok&&!gapBlock?'':'disabled'} onclick="visitForm('${cid}')">ابدأ الزيارة</button>`)}
let VF={};
function visitForm(cid){VF={cid,items:new Set(),order:{},result:'مهتم',gps:LASTGEO&&LASTGEO.cid===cid?{lat:LASTGEO.lat,lng:LASTGEO.lng,acc:LASTGEO.acc,dist:LASTGEO.dist}:null};drawVisit()}
function drawVisit(){const c=Cu(VF.cid);const talk=$('#vt')?$('#vt').value:'';
 sheet(`<div class="row between"><h3>زيارة: ${esc(c.name)}</h3><span class="pill ${V.offline?'warn':'ok'}">● ${V.offline?'بدأت من غير نت':'بدأت'}</span></div>
 <label class="f">المحادثة<textarea id="vt" placeholder="اتكلمت مع الدكتور في إيه؟">${esc(talk)}</textarea></label>
 <div class="f">النتيجة<div class="chips">${['مهتم','طلب أوردر','متابعة','غير مهتم'].map(x=>`<button class="chip ${VF.result===x?'on':''}" onclick="VF.result='${x}';drawVisit()">${x}</button>`).join('')}</div></div>
 <div class="f">الأصناف اللي اتكلمت فيها (تقدر تختار أكتر من صنف)<div class="chips">${S.products.map(p=>`<button class="chip ${VF.items.has(p.id)?'on':''}" onclick="VF.items.has('${p.id}')?VF.items.delete('${p.id}'):VF.items.add('${p.id}');drawVisit()">${esc(short(p.name))}</button>`).join('')}</div></div>
 ${VF.items.size?`<div class="card"><h3>أوردر من الزيارة (اختياري)</h3>${[...VF.items].map(id=>`<div class="row between nowrap"><span>${esc(short(P(id).name))}</span><input type="number" min="0" style="width:90px" value="${VF.order[id]||''}" placeholder="الكمية" oninput="VF.order['${id}']=+this.value"></div>`).join('')}</div>`:''}
 <button class="btn pri big" onclick="saveVisit()">${V.offline?'حفظ في قائمة الانتظار':'إنهاء وحفظ الزيارة'}</button>`)}
function saveVisit(){if(!VF.items.size){toast('اختار صنف واحد على الأقل');return}
 const now=new Date();const order=Object.entries(VF.order).filter(([k,q])=>q>0&&VF.items.has(k)).map(([prod,qty])=>({prod,qty}));
 const rec={id:uid('v'),rep:V.role,cust:VF.cid,date:TODAY,time:`${pad(now.getHours())}:${pad(now.getMinutes())}`,talk:$('#vt').value.trim(),result:VF.result,items:[...VF.items],order:order.length?order:undefined,gps:VF.gps};
 S.visits.push(rec);
 if(order.length)S.orders.push({id:uid('o'),rep:V.role,cust:VF.cid,date:TODAY,lines:order,done:false});
 closeSheet();V.calSel=TODAY;V.tab='visits';render();toast(V.offline?'مفيش نت · الزيارة في قائمة الانتظار وهتتبعت لوحدها':order.length?'اتحفظت الزيارة والأوردر':'اتحفظت الزيارة')}
function editList(key){const rep=V.role;const pl=plan(rep);const mine=S.customers.filter(c=>c.addedBy===rep);const cur=new Set(pl[key]);
 const title={today:'عملاء النهارده',week:'خطة الأسبوع',month:'خطة الشهر'}[key];
 sheet(`<h3>${title}</h3><div class="card"><div class="list">${mine.map(c=>`<label class="item" style="cursor:pointer"><input type="checkbox" value="${c.id}" ${cur.has(c.id)?'checked':''}><div class="grow"><div class="t">${esc(c.name)}</div><div class="d">${esc(c.type)}</div></div></label>`).join('')}</div></div>
 <button class="btn pri big" onclick="plan('${rep}')['${key}']=[...document.querySelectorAll('.sheet input:checked')].map(x=>x.value);closeSheet();render();toast('اتحفظت')">حفظ</button>`)}

/* ============ REP: CUSTOMERS ============ */
VIEWS.customers=()=>{const rep=V.role,pm=me().perms;let list=S.customers.filter(c=>c.addedBy===rep);const total=list.length;
 if(V.custFilter!=='all')list=list.filter(c=>c.type===V.custFilter); if(V.custQ)list=list.filter(c=>c.name.includes(V.custQ));
 return `<div class="row between"><div><h2>العملاء</h2><div class="sub">${fmt(total)} عميل</div></div>${pm.addCust?'<button class="btn pri" onclick="custForm()">+ عميل جديد</button>':''}</div>
 <input id="custQ" placeholder="ابحث بالاسم" value="${esc(V.custQ)}" oninput="V.custQ=this.value;clearTimeout(window._q);window._q=setTimeout(()=>{render();const i=$('#custQ');i.focus();i.setSelectionRange(99,99)},250)">
 <div class="seg">${[['all','الكل'],['صيدلية','صيدليات'],['عيادة','عيادات']].map(([k,l])=>`<button class="${V.custFilter===k?'on':''}" onclick="V.custFilter='${k}';render()">${l}</button>`).join('')}</div>
 <div class="card"><div class="list">${list.length?list.map(c=>{const lv=lastVisitOf(c.id);return `<div class="item"><div class="grow"><div class="row"><span class="t">${esc(c.name)}</span><span class="pill ${c.type==='عيادة'?'acc':''}">${c.type}</span></div>
  <div class="d num">${esc(c.phone)} · ${lv?'آخر زيارة '+dFmt(lv):'لسه ما اتزارتش'}</div>${c.notes?`<div class="d">${esc(c.notes)}</div>`:''}
  <div class="row" style="margin-top:6px"><button class="btn sm pri" onclick="geoCheck('${c.id}')">ابدأ زيارة</button>${pm.editCust?`<button class="btn sm" onclick="custForm('${c.id}')">تحديث البيانات</button>`:''}</div></div></div>`}).join(''):'<div class="empty">مفيش نتايج</div>'}</div></div>
 ${pm.editCust?'':'<div class="note">تعديل بيانات العملاء مقفول على حسابك من المدير.</div>'}`};
let CF={};
function custForm(id){const c=id?{...Cu(id)}:{type:'صيدلية',name:'',phone:'',notes:'',lat:null,lng:null};CF=c;
 sheet(`<h3>${id?'تحديث بيانات العميل':'تسجيل عميل جديد'}</h3>
 <div class="seg">${['صيدلية','عيادة'].map(t=>`<button class="${CF.type===t?'on':''}" onclick="CF.type='${t}';this.parentNode.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===this))">${t}</button>`).join('')}</div>
 <label class="f">الاسم<input id="cn" value="${esc(c.name)}" placeholder="صيدلية ... / عيادة د. ..."></label>
 <label class="f">رقم التليفون<input id="cp" inputmode="tel" value="${esc(c.phone)}" placeholder="01xxxxxxxxx"></label>
 <label class="f">ملحوظات<textarea id="cno" placeholder="مواعيد الزيارة، اسم الدكتور، طريقة الدفع...">${esc(c.notes)}</textarea></label>
 <div class="card"><div class="row between"><h3>الموقع</h3><span class="pill ${c.lat?'ok':'warn'}" id="locP">${c.lat?'متسجل':'لسه'}</span></div>
  <div class="sub num" id="locT">${c.lat?`${c.lat.toFixed(5)}, ${c.lng.toFixed(5)}`:'لازم تكون واقف عند العميل وانت بتسجل الموقع'}</div>
  <button class="btn" id="locB" onclick="locCust()">📍 سجّل موقعي الحالي</button></div>
 <button class="btn pri big" onclick="saveCust('${id||''}')">حفظ</button>`)}
async function locCust(){const b=$('#locB');b.disabled=true;b.textContent='بنحدد موقعك...';await locate();b.disabled=false;b.textContent='📍 سجّل موقعي الحالي';
 if(!GEO.pos){toast(GEO.err);return}CF.lat=GEO.pos.lat;CF.lng=GEO.pos.lng;const acc=Math.round(GEO.pos.acc||0);
 $('#locT').textContent=`${CF.lat.toFixed(5)}, ${CF.lng.toFixed(5)} · الدقة ± ${fmt(acc)} متر`+(acc>40?' · الدقة ضعيفة، جرّب تاني وانت جنب الباب':'');$('#locP').textContent='متسجل';$('#locP').className='pill '+(acc>40?'warn':'ok')}
function saveCust(id){const name=$('#cn').value.trim();if(!name){toast('اكتب اسم العميل');return}if(!CF.lat){toast('سجّل موقع العميل الأول');return}
 const data={type:CF.type,name,phone:$('#cp').value.trim(),notes:$('#cno').value.trim(),lat:CF.lat,lng:CF.lng};
 if(id){Object.assign(Cu(id),data)}else{const nid=uid('c');S.customers.push({id:nid,addedBy:V.role,added:TODAY,...data})}
 closeSheet();render();toast(id?'اتحدثت البيانات':'اتسجل العميل')}

/* ============ REP: INVOICES ============ */
VIEWS.invoices=()=>{const rep=V.role,pm=me().perms;const all=S.invoices.filter(i=>i.rep===rep).sort((a,b)=>b.date.localeCompare(a.date));
 const list=V.invFilter==='all'?all:all.filter(i=>invState(i)===V.invFilter);const ords=S.orders.filter(o=>o.rep===rep&&!o.done);
 const cnt=k=>all.filter(i=>invState(i)===k).length;
 return `<h2>الفواتير</h2>
 ${pm.invoices?`<div class="grid2"><button class="btn pri" onclick="invForm()">+ فاتورة جديدة</button><button class="btn" onclick="closeInv()">تقفيل فاتورة</button></div>`:'<div class="note">رفع الفواتير مقفول على حسابك.</div>'}
 ${ords.length?`<div class="card"><h3>أوردرات من الزيارات</h3><div class="list">${ords.map(o=>`<div class="item"><div class="grow"><div class="t">${esc(Cu(o.cust).name)}</div><div class="d">${dFmt(o.date)} · ${o.lines.map(l=>fmt(l.qty)+' '+esc(P(l.prod).name.split(' ')[0])).join('، ')}</div></div>${pm.invoices?`<button class="btn sm pri" onclick="invForm('${o.id}')">حوّلها فاتورة</button>`:''}</div>`).join('')}</div></div>`:''}
 <div class="seg">${[['all','الكل'],['due','مستحقة ('+fmt(cnt('due'))+')'],['open','مفتوحة'],['paid','مدفوعة']].map(([k,l])=>`<button class="${V.invFilter===k?'on':''}" onclick="V.invFilter='${k}';render()">${l}</button>`).join('')}</div>
 <div class="card"><div class="list">${list.length?list.map(invRow).join(''):'<div class="empty">مفيش فواتير هنا</div>'}</div></div>
 <div class="note">الفاتورة بتبقى "مستحقة" بعد ${fmt(S.settings.dueDays)} يوم من تاريخها ويوصلك إشعار بيها.</div>`};
function invRow(i){const s=invState(i);return `<div class="item" style="cursor:pointer" onclick="invDetail('${i.id}')"><div class="grow"><div class="row between"><span class="t">#${esc(i.no)} · ${esc(Cu(i.cust).name)}</span>${STATE_PILL[s]}</div>
 <div class="d num">${dFmt(i.date)} · ${s==='paid'?'اتحصّل '+money(i.collected):'من '+fmt(age(i.date))+' يوم'} · الإجمالي ${money(invTotal(i)-retValue(i))}</div></div></div>`}
function invDetail(id){const i=S.invoices.find(x=>x.id===id);const s=invState(i);
 sheet(`<div class="row between"><h3>فاتورة #${esc(i.no)}</h3>${STATE_PILL[s]}</div>
 <div class="kv"><span>العميل</span><span>${esc(Cu(i.cust).name)}</span></div><div class="kv"><span>التاريخ</span><span>${dFmt(i.date)}</span></div>
 <div class="tbl"><table><thead><tr><th>الصنف</th><th>كمية</th><th>سعر</th><th>خصم</th><th>الإجمالي</th></tr></thead><tbody>${i.lines.map(l=>`<tr><td>${esc(short(P(l.prod).name))}</td><td class="num">${fmt(l.qty)}</td><td class="num">${fmt(l.price)}</td><td class="num">${fmt(l.disc)}٪</td><td class="num">${fmt(lineTotal(l))}</td></tr>`).join('')}</tbody></table></div>
 <div class="kv"><span>إجمالي الفاتورة</span><b class="num">${money(invTotal(i))}</b></div>
 ${i.returns.length?`<div class="kv"><span>مرتجع (${i.returns.map(r=>fmt(r.qty)+' '+esc(P(r.prod).name.split(' ')[0])).join('، ')})</span><b class="num" style="color:var(--bad)">− ${money(retValue(i))}</b></div>`:''}
 ${s==='paid'?`<div class="kv"><span>اتحصّل يوم ${dFmt(i.paidDate)}</span><b class="num" style="color:var(--ok)">${money(i.collected)}</b></div>`:''}
 ${i.img?`<img class="thumb" src="${i.img}" alt="صورة الفاتورة">`:'<div class="note">مفيش صورة مرفوعة للفاتورة دي</div>'}
 ${s!=='paid'&&isRep()&&me().perms.invoices?`<button class="btn pri big" onclick="closeInvStep2('${i.id}')">تقفيل الفاتورة</button>`:''}`)}
let IF={};
function invForm(orderId){const o=orderId?S.orders.find(x=>x.id===orderId):null;
 IF={orderId,cust:o?o.cust:'',no:'',date:TODAY,img:'',lines:o?o.lines.map(l=>({prod:l.prod,qty:l.qty,price:P(l.prod).price,disc:0})):[{prod:'p1',qty:1,price:P('p1').price,disc:0}]};drawInv()}
function syncInv(){if($('#ic'))IF.cust=$('#ic').value;if($('#ino'))IF.no=$('#ino').value;if($('#idt'))IF.date=$('#idt').value;
 IF.lines.forEach((l,k)=>{const q=s=>$(`#${s}${k}`);if(!q('lp'))return;l.prod=q('lp').value;l.qty=+q('lq').value||0;l.price=+q('lpr').value||0;l.disc=+q('ld').value||0})}
function upTot(){syncInv();$('#tot').textContent=money(IF.lines.reduce((s,l)=>s+lineTotal(l),0))}
function drawInv(){const rep=V.role;const st=stockOf(rep);const mine=S.customers.filter(c=>c.addedBy===rep);
 sheet(`<h3>فاتورة جديدة</h3>
 <label class="f">العميل<select id="ic"><option value="">اختار الصيدلية / العيادة</option>${mine.map(c=>`<option value="${c.id}" ${IF.cust===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label>
 <div class="grid2"><label class="f">رقم الفاتورة<input id="ino" inputmode="numeric" value="${esc(IF.no)}" placeholder="مثلاً 1071"></label><label class="f">التاريخ<input type="date" id="idt" value="${IF.date}"></label></div>
 ${IF.lines.map((l,k)=>`<div class="line-ed"><select id="lp${k}" onchange="syncInv();IF.lines[${k}].price=P(this.value).price;drawInv()">${S.products.map(p=>`<option value="${p.id}" ${l.prod===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select>
  <button class="btn sm danger" onclick="syncInv();IF.lines.splice(${k},1);drawInv()" ${IF.lines.length<2?'disabled':''}>حذف</button>
  <div class="r3"><label class="f">الكمية<input type="number" min="1" id="lq${k}" value="${l.qty}" oninput="upTot()"></label><label class="f">السعر<input type="number" id="lpr${k}" value="${l.price}" oninput="upTot()"></label><label class="f">خصم ٪<input type="number" min="0" max="100" id="ld${k}" value="${l.disc}" oninput="upTot()"></label></div>
  <div class="sub" style="grid-column:1/-1">متاح عندك في المخزن: <b class="num" style="color:var(--${(st[l.prod]||0)>=l.qty?'ok':'bad'})">${fmt(st[l.prod]||0)}</b></div></div>`).join('')}
 <button class="btn" onclick="syncInv();IF.lines.push({prod:'p2',qty:1,price:P('p2').price,disc:0});drawInv()">+ إضافة صنف</button>
 <div class="kv" style="font-size:16px"><span>إجمالي الفاتورة</span><b class="num" id="tot">${money(IF.lines.reduce((s,l)=>s+lineTotal(l),0))}</b></div>
 <label class="f">صورة الفاتورة<input type="file" accept="image/*" onchange="readImg(this,700,u=>{IF.img=u;$('#imgPrev').innerHTML='<img class=thumb src='+u+' alt=صورة>'})"></label>
 <div id="imgPrev">${IF.img?`<img class="thumb" src="${IF.img}" alt="صورة الفاتورة">`:''}</div>
 <button class="btn pri big" onclick="saveInv()">حفظ الفاتورة وخصم من المخزن</button>`)}
function readImg(inp,max,cb){const f=inp.files[0];if(!f)return;const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');const sc=Math.min(1,max/Math.max(im.width,im.height));c.width=im.width*sc;c.height=im.height*sc;c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.75))};im.src=fr.result};fr.readAsDataURL(f)}
function saveInv(){syncInv();const rep=V.role,st=stockOf(rep);
 if(!IF.cust)return toast('اختار العميل');if(!IF.no.trim())return toast('اكتب رقم الفاتورة');
 if(S.invoices.some(i=>i.rep===rep&&i.no===IF.no.trim()))return toast('رقم الفاتورة ده متسجل قبل كده');
 const need={};IF.lines.forEach(l=>need[l.prod]=(need[l.prod]||0)+l.qty);
 for(const p in need){if((st[p]||0)<need[p])return toast(`الكمية مش كفاية: ${short(P(p).name)}`)}
 for(const p in need)st[p]-=need[p];
 S.invoices.push({id:uid('i'),no:IF.no.trim(),rep,cust:IF.cust,date:IF.date,lines:IF.lines.map(l=>({...l})),img:IF.img,status:'open',returns:[],collected:0});
 if(IF.orderId){const o=S.orders.find(x=>x.id===IF.orderId);if(o)o.done=true}
 closeSheet();V.invFilter='all';render();toast('اتسجلت الفاتورة واتخصمت من المخزن')}
function closeInv(){const rep=V.role;const openI=S.invoices.filter(i=>i.rep===rep&&i.status!=='paid');const custs=[...new Set(openI.map(i=>i.cust))];
 sheet(`<h3>تقفيل فاتورة</h3><label class="f">اختار العميل<select onchange="const v=this.value;document.querySelectorAll('[data-c]').forEach(e=>e.hidden=e.dataset.c!==v)"><option value="">—</option>${custs.map(c=>`<option value="${c}">${esc(Cu(c).name)}</option>`).join('')}</select></label>
 <div class="card"><div class="list">${openI.map(i=>`<div class="item" data-c="${i.cust}" hidden><div class="grow"><div class="t">فاتورة #${esc(i.no)}</div><div class="d num">${dFmt(i.date)} · ${money(invTotal(i))}</div></div>${STATE_PILL[invState(i)]}<button class="btn sm pri" onclick="closeInvStep2('${i.id}')">اختيار</button></div>`).join('')}<div class="empty" data-c="">اختار العميل عشان تظهر فواتيره المفتوحة</div></div></div>`)}
function closeInvStep2(id){const i=S.invoices.find(x=>x.id===id);const canRet=me().perms.returns;
 sheet(`<h3>تقفيل فاتورة #${esc(i.no)}</h3><div class="sub">${esc(Cu(i.cust).name)} · ${dFmt(i.date)}</div>
 <div class="kv"><span>إجمالي الفاتورة</span><b class="num">${money(invTotal(i))}</b></div>
 ${canRet?`<div class="card"><h3>مرتجع (اختياري)</h3><div class="sub">اكتب الكمية المرتجعة من كل صنف · بترجع للمخزن تلقائي</div>${i.lines.map((l,k)=>`<div class="row between nowrap"><span>${esc(short(P(l.prod).name))} <span class="sub">(${fmt(l.qty)})</span></span><input type="number" min="0" max="${l.qty}" style="width:90px" id="rt${k}" placeholder="0" oninput="calcClose('${id}')"></div>`).join('')}</div>`:'<div class="note">المرتجع مقفول على حسابك من المدير.</div>'}
 <div class="kv"><span>المطلوب تحصيله</span><b class="num" id="need">${money(invTotal(i))}</b></div>
 <label class="f">إجمالي التحصيل<input type="number" id="coll" value="${invTotal(i).toFixed(2)}"></label>
 <button class="btn pri big" onclick="doClose('${id}')">تقفيل الفاتورة</button>`)}
function retLines(i){return i.lines.map((l,k)=>({prod:l.prod,qty:Math.min(l.qty,+($('#rt'+k)?.value)||0)})).filter(r=>r.qty>0)}
function calcClose(id){const i=S.invoices.find(x=>x.id===id);const n=invTotal(i)-retValue({...i,returns:retLines(i)});$('#need').textContent=money(n);$('#coll').value=n.toFixed(2)}
function doClose(id){const i=S.invoices.find(x=>x.id===id);const rets=retLines(i);const st=stockOf(i.rep);
 rets.forEach(r=>st[r.prod]=(st[r.prod]||0)+r.qty);
 i.returns=rets;i.collected=+$('#coll').value||0;i.status='paid';i.paidDate=TODAY;
 closeSheet();render();toast(rets.length?'تم الدفع · المرتجع رجع للمخزن':'تم الدفع')}
function openNotifs(){
 if(V.role==='manager'){go('vac');return}
 const d=dues(V.role),t=openTasks(V.role);
 sheet(`<h3>الإشعارات</h3>
 ${t.length?`<div class="card"><h3>مهام جديدة</h3><div class="list">${t.map(taskRow).join('')}</div></div>`:''}
 <div class="card"><h3>مطالبات</h3><div class="list">${d.length?d.map(i=>`<div class="item"><div class="grow"><div class="t">${esc(Cu(i.cust).name)} عليها مطالبة</div><div class="d num">فاتورة #${esc(i.no)} · ${money(invTotal(i))} · من ${fmt(age(i.date))} يوم</div></div><button class="btn sm" onclick="closeInvStep2('${i.id}')">تقفيل</button></div>`).join(''):'<div class="empty">مفيش مطالبات دلوقتي</div>'}</div></div>`)}

/* ============ REP: STOCK / COLLECT ============ */
VIEWS.stock=()=>{const rep=V.role,st=stockOf(rep);const tr=S.transfers.filter(t=>t.rep===rep).sort((a,b)=>b.date.localeCompare(a.date));
 const total=S.products.reduce((s,p)=>s+(st[p.id]||0)*p.price,0);
 return `<div class="row between"><h2>مخزني</h2><span class="pill acc num">قيمة البضاعة ${money(total)}</span></div>
 <div class="card"><div class="list">${S.products.map(p=>{const q=st[p.id]||0;return `<div class="item"><div class="grow"><div class="t">${esc(p.name)}</div><div class="d num">${money(p.price)} للوحدة</div></div><div style="text-align:left"><div class="big-num num" style="font-size:22px;color:var(--${q<30?'bad':'ink'})">${fmt(q)}</div>${q<30?'<span class="pill bad">قرب يخلص</span>':''}</div></div>`}).join('')}</div></div>
 <div class="card"><h3>التحويلات اللي وصلتلك</h3><div class="list">${tr.length?tr.map(t=>`<div class="item"><span class="pill ok">+${fmt(t.qty)}</span><div class="grow"><div class="t">${esc(P(t.prod).name)}</div><div class="d">${dFmt(t.date)} · من المدير</div></div></div>`).join(''):'<div class="empty">مفيش تحويلات</div>'}</div></div>`};
const MONTHS=[MONTH,PREV_MONTH];
const mName=m=>dt(m+'-01').toLocaleDateString('ar-EG',{month:'long',year:'numeric'});
VIEWS.collect=()=>{const rep=V.role;const m=V.collMonth;
 const paid=S.invoices.filter(i=>i.rep===rep&&i.status==='paid'&&(i.paidDate||'').startsWith(m));const tot=paid.reduce((s,i)=>s+i.collected,0);
 const open=S.invoices.filter(i=>i.rep===rep&&i.status!=='paid');const openTot=open.reduce((s,i)=>s+invTotal(i),0);
 return `<h2>التحصيلات</h2>
 <div class="seg">${MONTHS.map(x=>`<button class="${m===x?'on':''}" onclick="V.collMonth='${x}';render()">${mName(x)}</button>`).join('')}</div>
 <div class="card"><div class="sub">إجمالي التحصيل الشهري</div><div class="big-num num">${money(tot)}</div>
  <div class="stats"><div class="stat"><div class="v num">${fmt(paid.length)}</div><div class="l">فاتورة اتقفلت</div></div><div class="stat"><div class="v num">${money(openTot)}</div><div class="l">لسه بره (${fmt(open.length)} فاتورة)</div></div></div></div>
 <div class="card"><h3>تفاصيل التحصيل</h3><div class="list">${paid.length?paid.map(i=>`<div class="item"><div class="grow"><div class="t">${esc(Cu(i.cust).name)}</div><div class="d">فاتورة #${esc(i.no)} · ${dFmt(i.paidDate)}${i.returns.length?' · فيها مرتجع':''}</div></div><b class="num">${money(i.collected)}</b></div>`).join(''):'<div class="empty">مفيش تحصيل في الشهر ده</div>'}</div></div>`};

/* ============ REP: ME (photo, tasks, vacations, deductions, plan) ============ */
function taskRow(t){const rep=V.role;const done=t.done[rep];const late=!done&&t.due<TODAY;
 return `<div class="item"><div class="grow"><div class="t">${esc(t.title)}</div>${t.body?`<div class="d">${esc(t.body)}</div>`:''}<div class="d">مطلوبة قبل ${dFmt(t.due)}${late?' · <b style="color:var(--bad)">متأخرة</b>':''}</div></div>
 ${done?'<span class="pill ok">✓ اتعملت</span>':`<button class="btn sm okb" onclick="S.tasks.find(x=>x.id==='${t.id}').done['${rep}']=TODAY;closeSheet();render();toast('اتسجلت إن المهمة اتعملت')">تمّت</button>`}</div>`}
const VSTAT={pending:'<span class="pill warn">مستنية الموافقة</span>',approved:'<span class="pill ok">اتوافق عليها</span>',rejected:'<span class="pill bad">اترفضت</span>'};
VIEWS.me=()=>{const r=me();const used=vacUsed(r.id);const ded=deductions(r.id);const mt=myTasks(r.id);const vs=S.vacations.filter(v=>v.rep===r.id).sort((a,b)=>b.from.localeCompare(a.from));
 return `<div class="card"><div class="row nowrap">${avatar(r,'lg')}<div class="grow" style="min-width:0"><h2>${esc(r.name)}</h2><div class="sub">${esc(r.area)}</div><div class="sub" dir="ltr" style="text-align:right">${esc(r.email)}</div></div></div>
  <label class="btn sm" style="justify-self:start">${r.photo?'تغيير الصورة':'+ إضافة صورتك'}<input type="file" accept="image/*" hidden onchange="readImg(this,240,u=>{R('${r.id}').photo=u;render();toast('اتحفظت صورتك')})"></label></div>
 <button class="btn big" onclick="go('plan')">${tile('plan')}الخطة والتارجت</button>
 <div class="card"><div class="row between"><h3>المهام</h3><span class="pill">${fmt(mt.length)}</span></div><div class="list">${mt.length?mt.map(taskRow).join(''):'<div class="empty">مفيش مهام</div>'}</div></div>
 <div class="card"><div class="row between"><h3>الأجازات</h3><button class="btn sm pri" onclick="vacForm()">+ طلب أجازة</button></div>
  <div class="stats"><div class="stat"><div class="v num">${fmt(r.vacBalance-used)}</div><div class="l">يوم فاضلين من ${fmt(r.vacBalance)}</div></div><div class="stat"><div class="v num">${DLBL(r.absenceDeduct)}</div><div class="l">خصم أي يوم غياب من غير أجازة</div></div></div>
  <div class="list">${vs.length?vs.map(v=>`<div class="item"><div class="grow"><div class="t">${v.from===v.to?dFmt(v.from):dFmt(v.from)+' ← '+dFmt(v.to)} · ${fmt(workdays(v.from,v.to))} يوم</div><div class="d">${esc(v.reason)}</div></div>${VSTAT[v.status]}</div>`).join(''):'<div class="empty">مفيش طلبات</div>'}</div></div>
 <div class="card"><div class="row between"><h3>خصوماتي في ${mName(MONTH)}</h3><span class="pill ${ded.total?'bad':'ok'}">${fmt(ded.total)} يوم</span></div>
  <div class="list">${ded.items.length?ded.items.map(dedRow).join(''):'<div class="empty">مفيش خصومات · برافو</div>'}</div>
  ${ded.proj.length?`<div class="note">لو فضلت الزيارات كده لآخر الشهر: ${fmt(ded.proj.length)} عميل لسه ما اتزاروش العدد المطلوب (خصم متوقع ${fmt(ded.projTotal)} يوم).</div>`:''}</div>`};
function dedRow(x){return `<div class="item"><span class="pill bad">${fmt(x.amount)} يوم</span><div class="grow"><div class="t">${esc(x.kind)}</div><div class="d">${dFmt(x.date)} · ${esc(x.label)}</div></div></div>`}
function vacForm(){sheet(`<h3>طلب أجازة</h3><div class="grid2"><label class="f">من<input type="date" id="vf" value="${addDays(TODAY,2)}"></label><label class="f">لـ<input type="date" id="vt2" value="${addDays(TODAY,2)}"></label></div>
 <label class="f">السبب<input id="vr" placeholder="مثلاً: ظرف عائلي"></label><div class="note">الطلب بيروح للمدير، ولو وافق الأيام دي مش هتتحسب خصم.</div>
 <button class="btn pri big" onclick="const f=$('#vf').value,t=$('#vt2').value;if(!f||t<f)return toast('راجع التواريخ');S.vacations.push({id:uid('va'),rep:V.role,from:f,to:t,reason:$('#vr').value.trim()||'—',status:'pending',date:TODAY});closeSheet();render();toast('الطلب اتبعت للمدير')">ابعت الطلب</button>`)}
VIEWS.plan=()=>{const rep=V.role,pl=plan(rep);const wk=V.planMode==='week';const [ws,we]=weekRange();
 const from=wk?ws:MONTH+'-01',to=wk?we:MONTH+'-31';const target=wk?pl.targetWeek:pl.targetMonth;const done=sales(rep,from,to);const pct=Math.min(100,target?done/target*100:0);
 const list=wk?pl.week:pl.month;const vis=new Set(S.visits.filter(v=>v.rep===rep&&v.date>=from&&v.date<=to).map(v=>v.cust));
 return `<div class="row between"><h2>الخطة والتارجت</h2><button class="btn sm" onclick="go('me')">رجوع</button></div>
 ${targetCard(rep,V.planMode)}
 <div class="card"><div class="row between"><h3>خطة ${wk?'الأسبوع':'الشهر'} (${fmt(vis.size&&list.filter(id=>vis.has(id)).length)} من ${fmt(list.length)})</h3><button class="btn sm" onclick="editList('${wk?'week':'month'}')">تعديل العملاء</button></div>
  <div class="list">${list.length?list.map(id=>`<div class="item"><div class="grow"><div class="t">${esc(Cu(id).name)}</div><div class="d">${esc(Cu(id).type)}</div></div>${vis.has(id)?'<span class="pill ok">اتزار</span>':'<span class="pill">لسه</span>'}</div>`).join(''):'<div class="empty">ضيف عملاء للخطة</div>'}</div></div>
 <div class="card"><div class="row between"><h3>اتفاقات العملاء للتارجت</h3><button class="btn sm pri" onclick="commitForm()">+ إضافة</button></div>
  <div class="list">${pl.commits.length?pl.commits.map(k=>`<div class="item"><div class="grow"><div class="t">${esc(Cu(k.cust).name)}</div><div class="d">${k.qty?fmt(k.qty)+' × ':''}${esc(short(P(k.prod).name))}${k.note?' · '+esc(k.note):''}</div></div><button class="btn sm danger" onclick="plan('${rep}').commits=plan('${rep}').commits.filter(x=>x.id!=='${k.id}');render()">حذف</button></div>`).join(''):'<div class="empty">سجّل مثلاً: الصيدلي ده هياخد كذا علبة من صنف معين</div>'}</div></div>`};
function setTarget(){const pl=plan(V.role);const wk=V.planMode==='week';
 sheet(`<h3>تارجت ${wk?'الأسبوع':'الشهر'}</h3><label class="f">المبلغ بالجنيه<input type="number" id="tg" value="${wk?pl.targetWeek:pl.targetMonth}"></label>
 <button class="btn pri big" onclick="plan('${V.role}')['${wk?'targetWeek':'targetMonth'}']=+$('#tg').value||0;closeSheet();render()">حفظ</button>`)}
function commitForm(){const mine=S.customers.filter(c=>c.addedBy===V.role);
 sheet(`<h3>اتفاق مع عميل</h3><label class="f">العميل<select id="kc">${mine.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label>
 <label class="f">الصنف<select id="kp">${S.products.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label>
 <label class="f">الكمية المتوقعة<input type="number" id="kq" placeholder="مثلاً 50"></label><label class="f">ملحوظة<input id="kn" placeholder="هياخد أول الشهر..."></label>
 <button class="btn pri big" onclick="plan('${V.role}').commits.push({id:uid('k'),cust:$('#kc').value,prod:$('#kp').value,qty:+$('#kq').value||0,note:$('#kn').value.trim()});closeSheet();render();toast('اتضاف')">حفظ</button>`)}

/* ============ MANAGER: DASHBOARD ============ */
VIEWS.dash=()=>{const seg=V.dashSeg;
 return `<div class="row between"><div><h2>لوحة التحكم</h2><div class="sub">${esc(S.company&&S.company.name||'')} · ${fmt(S.reps.length)} مندوب</div></div><button class="btn sm" onclick="showWelcome()">رسالة الترحيب</button></div>
 <div class="seg">${[['overview','نظرة عامة'],['collect','التحصيلات'],['visits','الزيارات'],['deduct','الخصومات']].map(([k,l])=>`<button class="${seg===k?'on':''}" onclick="V.dashSeg='${k}';render()">${l}</button>`).join('')}</div>
 ${DASH[seg]()}`};
const DASH={};
DASH.overview=()=>{const st=S.settings;const feed=S.visits.filter(v=>v.date===TODAY).sort((a,b)=>b.time.localeCompare(a.time));const pend=S.vacations.filter(v=>v.status==='pending');
 return `${pend.length?`<button class="note" style="border:0;font:inherit;font-size:13px;text-align:right;cursor:pointer;background:var(--warn-soft);color:var(--warn)" onclick="go('vac')">${fmt(pend.length)} طلب أجازة مستني موافقتك ←</button>`:''}
 ${S.reps.map(r=>{const t=visitsOn(r.id,TODAY).length;const ded=deductions(r.id);const du=dues(r.id).length;
 return `<div class="card"><div class="row between nowrap"><div class="row nowrap">${avatar(r)}<div><h3>${esc(r.name)}</h3><div class="sub">${esc(r.area)}</div></div></div><span class="pill ${t>=st.minVisits?'ok':'warn'}">النهارده ${fmt(t)}</span></div>
  ${(()=>{const [ws,we]=weekRange();const pw=plan(r.id).targetWeek?sales(r.id,ws,we)/plan(r.id).targetWeek*100:0;const pm=plan(r.id).targetMonth?sales(r.id,MONTH+'-01',MONTH+'-31')/plan(r.id).targetMonth*100:0;const st2=p=>p>100?' '+'★'.repeat(Math.min(10,Math.floor((p-100)/10))):'';
   return `<div class="grid2"><div class="mini">${ring(pw,76)}<div><b>تارجت الأسبوع</b><div class="sub" style="color:var(--gold-deep)">${st2(pw)||'&nbsp;'}</div></div></div><div class="mini">${ring(pm,76)}<div><b>تارجت الشهر</b><div class="sub" style="color:var(--gold-deep)">${st2(pm)||'&nbsp;'}</div></div></div></div>`})()}
  <div class="stats"><div class="stat"><div class="v num">${fmt(monthVisits(r.id).length)}</div><div class="l">زيارات الشهر</div></div><div class="stat"><div class="v num">${money(sales(r.id,MONTH+'-01',MONTH+'-31'))}</div><div class="l">مبيعات الشهر</div></div>
  <div class="stat"><div class="v num">${money(collected(r.id,MONTH))}</div><div class="l">تحصيل الشهر</div></div><div class="stat"><div class="v num" style="color:var(--${ded.total?'bad':'ok'})">${fmt(ded.total)} يوم</div><div class="l">خصومات الشهر</div></div></div>
  ${du?`<div class="note bad">عنده ${fmt(du)} فاتورة مستحقة التحصيل</div>`:''}</div>`}).join('')}
 <div class="card"><h3>زاروا مين النهارده</h3><div class="list">${feed.length?feed.map(v=>visitRow(v,true)).join(''):'<div class="empty">لسه مفيش زيارات النهارده</div>'}</div></div>`};
DASH.collect=()=>{const m=V.collMonth;const paid=S.invoices.filter(i=>i.status==='paid'&&(i.paidDate||'').startsWith(m));const tot=paid.reduce((s,i)=>s+i.collected,0);
 const byRep=S.reps.map(r=>({r,v:paid.filter(i=>i.rep===r.id).reduce((s,i)=>s+i.collected,0),n:paid.filter(i=>i.rep===r.id).length}));const mx=Math.max(1,...byRep.map(x=>x.v));
 const byC={};paid.forEach(i=>{const k=i.cust;byC[k]=byC[k]||{v:0,n:0,rep:i.rep};byC[k].v+=i.collected;byC[k].n++});
 const cl=Object.entries(byC).sort((a,b)=>b[1].v-a[1].v);const outT=S.invoices.filter(i=>i.status!=='paid').reduce((s,i)=>s+invTotal(i),0);
 return `<div class="seg">${MONTHS.map(x=>`<button class="${m===x?'on':''}" onclick="V.collMonth='${x}';render()">${mName(x)}</button>`).join('')}</div>
 <div class="card"><div class="sub">إجمالي التحصيل · ${mName(m)}</div><div class="big-num num">${money(tot)}</div><div class="sub num">من ${fmt(paid.length)} فاتورة · لسه بره عند الصيدليات ${money(outT)}</div></div>
 <div class="card"><h3>التحصيل جاي من مين (المناديب)</h3>${byRep.map(x=>`<div class="hbar"><span>${esc(x.r.name)}</span><div class="bar"><i style="width:${x.v/mx*100}%"></i></div><b class="num">${money(x.v)}</b></div>`).join('')}</div>
 <div class="card"><h3>التحصيل جاي منين (العملاء)</h3><div class="list">${cl.length?cl.map(([cid,x])=>`<div class="item"><div class="grow"><div class="t">${esc(Cu(cid).name)}</div><div class="d">${esc(R(x.rep).name)} · ${fmt(x.n)} فاتورة</div></div><b class="num">${money(x.v)}</b></div>`).join(''):'<div class="empty">مفيش تحصيل في الشهر ده</div>'}</div></div>`};
DASH.visits=()=>{const rep=V.dashRep||(S.reps[0]||{}).id;if(!rep)return '<div class="empty">لسه مفيش مناديب</div>';const cs=S.customers.filter(c=>c.addedBy===rep);const mv=monthVisits(rep);const cnt={};mv.forEach(v=>cnt[v.cust]=(cnt[v.cust]||0)+1);
 const covered=cs.filter(c=>cnt[c.id]).length;const met=cs.filter(c=>(cnt[c.id]||0)>=custRule(c.id).perMonth).length;
 const rows=cs.map(c=>({c,n:cnt[c.id]||0,need:custRule(c.id).perMonth,lv:lastVisitOf(c.id)})).sort((a,b)=>(a.n/a.need)-(b.n/b.need));
 return `<div class="card"><h3>إجمالي زيارات ${mName(MONTH)}</h3>${S.reps.map(r=>{const n=monthVisits(r.id).length;const tot=S.customers.filter(c=>c.addedBy===r.id).length;const cov=new Set(monthVisits(r.id).map(v=>v.cust)).size;
  return `<div class="item">${avatar(r)}<div class="grow"><div class="row between"><span class="t">${esc(r.name)}</span><b class="num">${fmt(n)} زيارة</b></div><div class="bar" style="margin:6px 0 2px"><i style="width:${cov/tot*100}%"></i></div><div class="d num">غطّى ${fmt(cov)} عميل من ${fmt(tot)}</div></div></div>`}).join('')}</div>
 <div class="seg">${S.reps.map(r=>`<button class="${rep===r.id?'on':''}" onclick="V.dashRep='${r.id}';render()">${esc(r.name)}</button>`).join('')}</div>
 <div class="stats"><div class="stat"><div class="v num">${fmt(covered)} / ${fmt(cs.length)}</div><div class="l">عملاء اتزاروا ولو مرة</div></div><div class="stat"><div class="v num">${fmt(met)}</div><div class="l">وصلوا للعدد المطلوب</div></div></div>
 <div class="card"><h3>زار مين وكام مرة</h3><div class="list">${rows.map(x=>`<div class="item"><div class="grow"><div class="t">${esc(x.c.name)}</div><div class="d">${x.lv?'آخر زيارة '+dFmt(x.lv):'ما اتزارش خالص'}</div></div><span class="pill ${x.n>=x.need?'ok':x.n?'warn':'bad'} num">${fmt(x.n)} / ${fmt(x.need)}</span></div>`).join('')}</div></div>`};
DASH.deduct=()=>`${S.reps.map(r=>{const d=deductions(r.id);const kinds={};d.items.forEach(x=>kinds[x.kind]=(kinds[x.kind]||0)+x.amount);
 return `<div class="card"><div class="row between nowrap"><div class="row nowrap">${avatar(r)}<h3>${esc(r.name)}</h3></div><span class="pill ${d.total?'bad':'ok'}">${fmt(d.total)} يوم</span></div>
  ${Object.keys(kinds).length?`<div class="chips">${Object.entries(kinds).map(([k,v])=>`<span class="pill">${esc(k)}: ${fmt(v)} يوم</span>`).join('')}</div>`:''}
  <details><summary class="sub" style="cursor:pointer">التفاصيل (${fmt(d.items.length)})</summary><div class="list">${d.items.map(dedRow).join('')||'<div class="empty">مفيش</div>'}</div></details>
  ${d.proj.length?`<div class="note">متوقع آخر الشهر: ${fmt(d.proj.length)} عميل تحت العدد المطلوب (${fmt(d.projTotal)} يوم لو فضل كده)</div>`:''}</div>`}).join('')}
 <div class="note">الخصومات بتتحسب تلقائي من القواعد اللي انت حاططها في صفحة "القواعد"، وأيام الأجازة المتوافق عليها مش بتتحسب.</div>`;

/* ============ MANAGER: REPS ============ */
const PERMS=[['addCust','إضافة عملاء جداد'],['editCust','تحديث بيانات العملاء'],['invoices','رفع وتقفيل الفواتير'],['returns','عمل مرتجع']];
VIEWS.reps=()=>`<div class="row between"><h2>الموظفين</h2><button class="btn pri" onclick="repForm()">+ حساب مندوب</button></div>
 ${S.reps.map(r=>`<div class="card"><div class="row between nowrap"><button class="row nowrap linkish" onclick="empProfile('${r.id}')">${avatar(r)}<h3>${esc(r.name)}</h3></button><span class="pill acc">${esc(r.area)}</span></div>
  <div class="kv"><span>الإيميل</span><span class="num" dir="ltr">${esc(r.email)}</span></div>
  <div class="grid2"><label class="f">تارجت أسبوعي (ج)<input type="number" min="0" id="tw_${r.id}" value="${plan(r.id).targetWeek}" onchange="plan('${r.id}').targetWeek=+this.value||0;render();toast('اتحدد التارجت')"></label><label class="f">تارجت شهري (ج)<input type="number" min="0" id="tm_${r.id}" value="${plan(r.id).targetMonth}" onchange="plan('${r.id}').targetMonth=+this.value||0;render();toast('اتحدد التارجت')"></label></div>
  <div class="sub">الصلاحيات</div><div class="chips">${PERMS.map(([k,l])=>`<button class="chip ${(r.perms||{})[k]?'on':''}" aria-pressed="${!!(r.perms||{})[k]}" onclick="const x=R('${r.id}');x.perms={...(x.perms||{}),'${k}':!(x.perms||{})['${k}']};render()">${(r.perms||{})[k]?'✓ ':''}${l}</button>`).join('')}</div>
  <div class="row"><button class="btn sm pri" onclick="empProfile('${r.id}')">ساعات الشغل</button><button class="btn sm" onclick="openChat('${ME.companyId}','${r.id}')">💬 شات ${typeof unread==='function'&&unread(S.threads&&S.threads[r.id])?'<span class="dotn">جديد</span>':''}</button><button class="btn sm" onclick="passAdmin('${r.id}')">🔑 كلمة السر</button><button class="btn sm danger" onclick="askDeactivate('${r.id}')">إيقاف الحساب</button></div></div>`).join('')||'<div class="empty">لسه مفيش مناديب. دوس "+ حساب مندوب" علشان تعمل أول حساب.</div>'}
 <div class="note">كل مندوب بيدخل بالإيميل وكلمة السر اللي انت بتبعتهاله، وبيشوف عملاءه وفواتيره ومخزنه بس حسب صلاحياته. وكل موظف يقدر يحط صورته من صفحة "حسابي".</div>
 ${accSection()}`;
function repForm(){const pw=String(Math.floor(100000+Math.random()*900000));
 sheet(`<h3>حساب مندوب جديد</h3><label class="f">الاسم<input id="rn"></label><label class="f">المنطقة<input id="ra" placeholder="أسيوط - ..."></label>
 <label class="f">الإيميل<input id="re" dir="ltr" placeholder="name@nilepharma.app"></label><label class="f">كلمة السر<input id="rp" dir="ltr" inputmode="text" autocapitalize="off" autocorrect="off" spellcheck="false" value="${pw}"></label>
 <div class="grid2"><label class="f">رصيد الأجازات (يوم)<input type="number" id="rv" value="21"></label><label class="f">خصم يوم الغياب<select id="rd">${DEDUCT_OPTS.map(x=>`<option value="${x}" ${x===1?'selected':''}>${DLBL(x)}</option>`).join('')}</select></label></div>
 <button class="btn pri big" onclick="addRep()">إنشاء الحساب</button>`)}
async function addRep(){const n=$('#rn').value.trim(),e=$('#re').value.trim().toLowerCase(),p=$('#rp').value.trim();if(!n||!e)return toast('اكتب الاسم والإيميل');if(p.length<6)return toast('كلمة السر لازم ٦ حروف على الأقل');
 const b=document.querySelector('.sheet .btn.big');b.disabled=true;b.textContent='بنعمل الحساب...';
 try{const id=await FB.createUser(e,p);const doc={role:'rep',companyId:ME.companyId,active:true,name:n,area:$('#ra').value.trim()||'—',email:e,photo:'',vacBalance:+$('#rv').value||0,absenceDeduct:+$('#rd').value,perms:{addCust:true,editCust:true,invoices:true,returns:false}};
  await FB.setDoc(FB.doc('users',id),doc);await FB.setDoc(FB.doc('secrets',id),{pass:p,email:e,at:Date.now()}).catch(()=>{});S.reps.push({id,...doc});
  render();credSheet(n,e,p)}catch(err){b.disabled=false;b.textContent='إنشاء الحساب';toast(authErr(err))}}
function credSheet(n,e,p,title){const txt=`أهلاً ${n}\nده حسابك على بيثيل اسمارت:\nالإيميل: ${e}\nكلمة السر: ${p}`;window._cred=txt;
 sheet(`<h3>${title||'الحساب اتعمل ✓'}</h3><div class="sub">ابعت البيانات دي لصاحبها علشان يدخل بيها. وتقدر تشوف كلمة السر أو تغيّرها في أي وقت من زرار 🔑 كلمة السر.</div>
 <div class="card"><div class="kv"><span>الاسم</span><b>${esc(n)}</b></div><div class="kv"><span>الإيميل</span><b dir="ltr">${esc(e)}</b></div><div class="kv"><span>كلمة السر</span><b dir="ltr">${esc(p)}</b></div></div>
 <button class="btn pri big" onclick="copyCred()">نسخ البيانات</button><button class="btn" onclick="closeSheet()">تمام</button>`)}
function copyCred(){const t=window._cred||'';(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('اتنسخت · ابعتها للموظف')).catch(()=>toast('انسخها بإيدك من فوق'))}
function sendReset(email){FB.resetPassword(email).then(()=>toast('اتبعت لينك تغيير كلمة السر على '+email)).catch(e=>toast(authErr(e)))}
function askDeactivate(id){const u=R(id).name!=='؟'?R(id):Acc(id);sheet(`<h3>إيقاف حساب ${esc(u.name)}؟</h3><div class="sub">مش هيقدر يدخل البرنامج تاني. بياناته وزياراته وفواتيره هتفضل محفوظة.</div>
 <button class="btn danger big" onclick="deactivate('${id}')">أيوه، اوقف الحساب</button><button class="btn" onclick="closeSheet()">رجوع</button>`)}
function deactivate(id){FB.updateDoc(FB.doc('users',id),{active:false}).then(()=>{S.reps=S.reps.filter(x=>x.id!==id);S.accountants=S.accountants.filter(x=>x.id!==id);closeSheet();render();toast('الحساب اتوقف')}).catch(e=>Sync.fail(e))}
function authErr(e){const c=(e&&e.code)||'';return {'auth/email-already-in-use':'الإيميل ده متسجل قبل كده','auth/invalid-email':'الإيميل مكتوب غلط','auth/weak-password':'كلمة السر لازم ٦ حروف على الأقل',
 'auth/invalid-credential':'الإيميل أو كلمة السر غلط','auth/wrong-password':'الإيميل أو كلمة السر غلط','auth/user-not-found':'الإيميل ده مش متسجل','auth/network-request-failed':'مفيش نت، اتأكد من الاتصال',
 'auth/too-many-requests':'محاولات كتير، استنى شوية وجرّب تاني','auth/user-disabled':'الحساب ده موقوف'}[c]||'حصلت مشكلة، جرّب تاني'}

/* ============ MANAGER: TASKS ============ */
let TK={to:'all'};
VIEWS.tasks=()=>`<div class="row between"><h2>المهام</h2><button class="btn pri" onclick="TK={to:'all'};taskForm()">+ مهمة جديدة</button></div>
 ${S.tasks.slice().reverse().map(t=>{const rs=t.to==='all'?S.reps:S.reps.filter(r=>t.to.includes(r.id));const dn=rs.filter(r=>t.done[r.id]).length;
 return `<div class="card"><div class="row between"><h3>${esc(t.title)}</h3><span class="pill ${dn===rs.length?'ok':t.due<TODAY?'bad':'warn'}">${fmt(dn)} من ${fmt(rs.length)}</span></div>
  ${t.body?`<div class="sub">${esc(t.body)}</div>`:''}<div class="sub">لـ ${t.to==='all'?'كل الموظفين':'موظفين محددين'} · مطلوبة قبل ${dFmt(t.due)}</div>
  <div class="list">${rs.map(r=>`<div class="item">${avatar(r)}<div class="grow"><div class="t">${esc(r.name)}</div></div>${t.done[r.id]?`<span class="pill ok">✓ ${dFmt(t.done[r.id])}</span>`:'<span class="pill">لسه</span>'}</div>`).join('')}</div>
  <button class="btn sm danger" style="justify-self:start" onclick="S.tasks=S.tasks.filter(x=>x.id!=='${t.id}');render()">حذف المهمة</button></div>`}).join('')||'<div class="empty">مفيش مهام</div>'}`;
function taskForm(){const sel=TK.to==='all'?null:TK.to;
 sheet(`<h3>مهمة جديدة</h3><label class="f">المهمة<input id="tt" value="${esc(TK.title||'')}" placeholder="مثلاً: توزيع عينات على العيادات"></label>
 <label class="f">التفاصيل<textarea id="tb">${esc(TK.body||'')}</textarea></label><label class="f">مطلوبة قبل<input type="date" id="td" value="${TK.due||addDays(TODAY,3)}"></label>
 <div class="f">توصل لمين<div class="seg"><button class="${!sel?'on':''}" onclick="keepTk();TK.to='all';taskForm()">كل الموظفين</button><button class="${sel?'on':''}" onclick="keepTk();TK.to=[];taskForm()">موظفين معينين</button></div></div>
 ${sel?`<div class="chips">${S.reps.map(r=>`<button class="chip ${sel.includes(r.id)?'on':''}" onclick="keepTk();TK.to.includes('${r.id}')?TK.to.splice(TK.to.indexOf('${r.id}'),1):TK.to.push('${r.id}');taskForm()">${esc(r.name)}</button>`).join('')}</div>`:''}
 <button class="btn pri big" onclick="sendTask()">ابعت المهمة</button>`)}
function keepTk(){TK.title=$('#tt').value;TK.body=$('#tb').value;TK.due=$('#td').value}
function sendTask(){keepTk();if(!TK.title.trim())return toast('اكتب المهمة');if(TK.to!=='all'&&!TK.to.length)return toast('اختار موظف واحد على الأقل');
 S.tasks.push({id:uid('tk'),title:TK.title.trim(),body:TK.body.trim(),to:TK.to,due:TK.due,date:TODAY,done:{}});closeSheet();render();toast('المهمة وصلت للموظفين')}

/* ============ MANAGER: VACATIONS ============ */
VIEWS.vac=()=>{const pend=S.vacations.filter(v=>v.status==='pending');
 return `<h2>الأجازات</h2>
 <div class="card"><div class="row between"><h3>طلبات مستنية موافقتك</h3><span class="pill ${pend.length?'warn':''}">${fmt(pend.length)}</span></div>
  <div class="list">${pend.length?pend.map(v=>{const r=R(v.rep);const left=r.vacBalance-vacUsed(r.id);const n=workdays(v.from,v.to);return `<div class="item">${avatar(r)}<div class="grow"><div class="t">${esc(r.name)}</div><div class="d">${v.from===v.to?dFmt(v.from):dFmt(v.from)+' ← '+dFmt(v.to)} · ${fmt(n)} يوم · ${esc(v.reason)}</div><div class="d">فاضله ${fmt(left)} يوم${n>left?' · <b style="color:var(--bad)">الطلب أكتر من رصيده</b>':''}</div>
   <div class="row" style="margin-top:6px"><button class="btn sm okb" onclick="S.vacations.find(x=>x.id==='${v.id}').status='approved';render();toast('اتوافق على الأجازة')">موافقة</button><button class="btn sm danger" onclick="S.vacations.find(x=>x.id==='${v.id}').status='rejected';render();toast('اترفض الطلب')">رفض</button></div></div></div>`}).join(''):'<div class="empty">مفيش طلبات جديدة</div>'}</div></div>
 ${S.reps.map(r=>{const used=vacUsed(r.id);const absent=deductions(r.id).items.filter(x=>x.kind==='غياب');
 return `<div class="card"><div class="row nowrap">${avatar(r)}<h3>${esc(r.name)}</h3></div>
  <div class="grid2"><label class="f">رصيد الأجازات في السنة<input type="number" min="0" value="${r.vacBalance}" onchange="R('${r.id}').vacBalance=+this.value||0;render()"></label>
  <label class="f">خصم يوم الغياب<select onchange="R('${r.id}').absenceDeduct=+this.value;render()">${DEDUCT_OPTS.map(x=>`<option value="${x}" ${x===r.absenceDeduct?'selected':''}>${DLBL(x)}</option>`).join('')}</select></label></div>
  <div class="stats"><div class="stat"><div class="v num">${fmt(used)} / ${fmt(r.vacBalance)}</div><div class="l">أجازات اتاخدت</div></div><div class="stat"><div class="v num" style="color:var(--${absent.length?'bad':'ok'})">${fmt(absent.length)}</div><div class="l">أيام غياب من غير أجازة</div></div></div>
  ${absent.length?`<div class="note bad">أيام من غير ولا زيارة: ${absent.map(x=>dFmt(x.date)).join('، ')} · الخصم ${fmt(absent.reduce((s,x)=>s+x.amount,0))} يوم</div>`:''}</div>`}).join('')}
 <div class="note">أي يوم شغل المندوب ما سجّلش فيه ولا زيارة يتحسب غياب ويتخصم حسب اللي انت محدده لكل موظف، إلا لو الأجازة اتوافق عليها.</div>`};

/* ============ MANAGER: STORE ============ */
VIEWS.store=()=>`<h2>المخزن والتحويلات</h2>
 <div class="card"><h3>تحويل بضاعة لمندوب</h3>
  <label class="f">المندوب<select id="tr">${S.reps.map(r=>`<option value="${r.id}">${esc(r.name)}</option>`).join('')}</select></label>
  <label class="f">الصنف<select id="tp">${S.products.map(p=>`<option value="${p.id}">${esc(short(p.name))} · في الرئيسي ${fmt(p.main)}</option>`).join('')}</select></label>
  <label class="f">الكمية<input type="number" id="tq" min="1" placeholder="مثلاً 50"></label>
  <button class="btn pri big" onclick="doTransfer()">حوّل البضاعة</button></div>
 <div class="card"><h3>مخزن كل مندوب</h3><div class="tbl"><table><thead><tr><th>الصنف</th>${S.reps.map(r=>`<th>${esc(r.name.split(' ')[0])}</th>`).join('')}<th>الرئيسي</th></tr></thead><tbody>${S.products.map(p=>`<tr><td>${esc(short(p.name))}</td>${S.reps.map(r=>`<td class="num">${fmt(stockOf(r.id)[p.id]||0)}</td>`).join('')}<td class="num">${fmt(p.main)}</td></tr>`).join('')}</tbody></table></div></div>
 <div class="card"><div class="row between"><h3>أصناف الشركة</h3><button class="btn sm pri" onclick="prodForm()">+ صنف</button></div><div class="list">${S.products.map(p=>`<div class="item"><div class="grow"><div class="t">${esc(p.name)}</div><div class="d num">${money(p.price)} · الرئيسي ${fmt(p.main)}</div></div><button class="btn sm" onclick="prodForm('${p.id}')">تعديل</button></div>`).join('')}</div></div>
 <div class="card"><h3>سجل التحويلات</h3><div class="list">${S.transfers.slice().reverse().map(t=>`<div class="item"><span class="pill ok">+${fmt(t.qty)}</span><div class="grow"><div class="t">${esc(R(t.rep).name)}</div><div class="d">${esc(P(t.prod).name)} · ${dFmt(t.date)}</div></div></div>`).join('')}</div></div>`;
function doTransfer(){const r=$('#tr').value,p=$('#tp').value,q=+$('#tq').value;if(!q||q<1)return toast('اكتب الكمية');const pr=P(p);if(pr.main<q)return toast('الكمية مش موجودة في المخزن الرئيسي');
 pr.main-=q;stockOf(r)[p]=(stockOf(r)[p]||0)+q;S.transfers.push({id:uid('t'),date:TODAY,rep:r,prod:p,qty:q});render();toast(`اتحول ${fmt(q)} لـ ${R(r).name}`)}
function prodForm(id){const p=id?P(id):{name:'',price:'',main:''};
 sheet(`<h3>${id?'تعديل صنف':'صنف جديد'}</h3><label class="f">اسم الصنف<input id="pn" value="${esc(p.name)}"></label>
 <div class="grid2"><label class="f">السعر<input type="number" id="pp" value="${p.price}"></label><label class="f">المخزن الرئيسي<input type="number" id="pm" value="${p.main}"></label></div>
 <button class="btn pri big" onclick="saveProd('${id||''}')">حفظ</button>`)}
function saveProd(id){const n=$('#pn').value.trim();if(!n)return toast('اكتب اسم الصنف');const d={name:n,price:+$('#pp').value||0,main:+$('#pm').value||0};
 if(id)Object.assign(P(id),d);else S.products.push({id:uid('p'),...d});closeSheet();render();toast('اتحفظ')}

/* ============ MANAGER: RULES ============ */
VIEWS.rules=()=>{const s=S.settings;const ex=Object.entries(S.custRules);
 return `<h2>القواعد والإعدادات</h2>
 <div class="card"><h3>قواعد زيارة الصيدليات</h3>
  <div class="grid2"><label class="f">كل صيدلية تتزار في الشهر<input type="number" min="1" value="${s.perMonth}" onchange="S.settings.perMonth=+this.value||1;render()"></label>
  <label class="f">أقل عدد أيام بين كل زيارة والتانية<input type="number" min="0" value="${s.gapDays}" onchange="S.settings.gapDays=+this.value||0;render()"></label></div>
  <div class="sub">المندوب مش هيقدر يبدأ زيارة لنفس العميل قبل ما المدة دي تعدّي.</div>
  <div class="row between"><b style="font-size:14px">عملاء ليهم قاعدة خاصة</b><button class="btn sm" onclick="exForm()">+ إضافة</button></div>
  <div class="list">${ex.length?ex.map(([cid,x])=>`<div class="item"><div class="grow"><div class="t">${esc(Cu(cid).name)}</div><div class="d">${fmt(x.perMonth)} زيارات في الشهر · كل ${fmt(x.gap)} أيام على الأقل · ${esc(R(Cu(cid).addedBy).name)}</div></div><button class="btn sm danger" onclick="delete S.custRules['${cid}'];render()">حذف</button></div>`).join(''):'<div class="empty">كل العملاء ماشيين على القاعدة العامة</div>'}</div></div>
 <div class="card"><div class="row between"><h3>قواعد الخصم التلقائي</h3><button class="btn sm pri" onclick="ruleForm()">+ قاعدة</button></div>
  <div class="sub">لو المندوب ما التزمش بالقاعدة، الخصم بيتحسب لوحده.</div>
  <div class="list"><div class="item"><span class="pill bad">ثابتة</span><div class="grow"><div class="t">يوم من غير ولا زيارة ومن غير أجازة</div><div class="d">الخصم حسب كل موظف (من صفحة الأجازات)</div></div></div>
  ${S.rules.map(r=>`<div class="item"><input type="checkbox" aria-label="تشغيل القاعدة" ${r.active?'checked':''} onchange="S.rules.find(x=>x.id==='${r.id}').active=this.checked;render()"><div class="grow"><div class="t" style="${r.active?'':'color:var(--muted)'}">${esc(RULE_T[r.type].name)}${r.param?` (أكتر من ${fmt(r.param)} يوم)`:''}</div><div class="d">خصم ${DLBL(r.amount)} ${esc(RULE_T[r.type].unit)}</div></div><button class="btn sm danger" onclick="S.rules=S.rules.filter(x=>x.id!=='${r.id}');render()">حذف</button></div>`).join('')}</div></div>
 <div class="card"><h3>نطاق بدء الزيارة</h3><div class="sub">المندوب مايقدرش يبدأ زيارة إلا لو كان على بُعد المسافة دي أو أقل من موقع العميل</div>
  <div class="row between nowrap"><input type="range" min="20" max="500" step="10" value="${s.radius}" style="flex:1" oninput="S.settings.radius=+this.value;$('#rv').textContent=fmt(this.value)+' متر';save()"><b id="rv" class="num">${fmt(s.radius)} متر</b></div></div>
 <div class="card"><h3>الزيارات اليومية والمطالبات</h3>
  <div class="grid2"><label class="f">أقل عدد زيارات في اليوم<input type="number" min="1" value="${s.minVisits}" onchange="S.settings.minVisits=+this.value;render()"></label><label class="f">أكتر عدد<input type="number" min="1" value="${s.maxVisits}" onchange="S.settings.maxVisits=+this.value;render()"></label></div>
  <label class="f">مدة مطالبة الفواتير (يوم)<input type="number" min="1" value="${s.dueDays}" onchange="S.settings.dueDays=+this.value||25;render()"></label></div>
`};
function ruleForm(){sheet(`<h3>قاعدة خصم جديدة</h3>
 <label class="f">لو المندوب<select id="rt" onchange="$('#rpw').hidden=this.value!=='overdue'">${Object.entries(RULE_T).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('')}</select></label>
 <label class="f" id="rpw" hidden>متأخرة أكتر من كام يوم<input type="number" id="rpar" value="40"></label>
 <label class="f">يتخصم<select id="ram">${DEDUCT_OPTS.map(x=>`<option value="${x}" ${x===0.5?'selected':''}>${DLBL(x)}</option>`).join('')}</select></label>
 <button class="btn pri big" onclick="const t=$('#rt').value;S.rules.push({id:uid('ru'),type:t,param:t==='overdue'?+$('#rpar').value||30:undefined,amount:+$('#ram').value,active:true});closeSheet();render();toast('القاعدة اتثبتت')">ثبّت القاعدة</button>`)}
function exForm(){sheet(`<h3>قاعدة خاصة لعميل</h3><label class="f">العميل<select id="exc">${S.reps.map(r=>`<optgroup label="${esc(r.name)}">${S.customers.filter(c=>c.addedBy===r.id).map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</optgroup>`).join('')}</select></label>
 <div class="grid2"><label class="f">زيارات في الشهر<input type="number" id="exm" value="4"></label><label class="f">أقل أيام بين الزيارات<input type="number" id="exg" value="3"></label></div>
 <button class="btn pri big" onclick="S.custRules[$('#exc').value]={perMonth:+$('#exm').value||1,gap:+$('#exg').value||0};closeSheet();render();toast('اتحفظت')">حفظ</button>`)}

/* ============ OWNER ============ */
VIEWS.companies=()=>`<div class="row between"><div><h2>الشركات المشتركة</h2><div class="sub">انت بتعمل حساب صاحب الشركة، وهو بيعمل حسابات المناديب</div></div><button class="btn pri" onclick="coForm()">+ شركة</button></div>
 <div class="stats"><div class="stat"><div class="v num">${fmt(S.companies.filter(c=>c.active).length)}</div><div class="l">شركة مفعّلة</div></div><div class="stat"><div class="v num">${fmt(S.companies.length)}</div><div class="l">إجمالي الشركات</div></div></div>
 ${S.companies.map(c=>`<div class="card"><div class="row between"><h3>${esc(c.name)}</h3><span class="pill ${c.active?'ok':'bad'}">${c.active?'مفعّلة':'موقوفة'}</span></div>
  <div class="kv"><span>صاحب الشركة</span><span>${esc(c.manager)}</span></div><div class="kv"><span>الإيميل</span><span dir="ltr" class="num">${esc(c.email)}</span></div><div class="kv"><span>من</span><span>${dFmt(c.since)}</span></div>
  <div class="row"><button class="btn sm ${c.active?'danger':''}" onclick="const x=S.companies.find(z=>z.id==='${c.id}');x.active=!x.active;render()">${c.active?'إيقاف النسخة':'تفعيل النسخة'}</button><button class="btn sm" onclick="sendReset('${esc(c.email)}')">لينك تغيير كلمة السر</button></div></div>`).join('')||'<div class="empty">لسه مفيش شركات. دوس "+ شركة" علشان تعمل أول نسخة.</div>'}`;
function coForm(){const pw=Math.random().toString(36).slice(2,10);
 sheet(`<h3>شركة جديدة</h3><label class="f">اسم الشركة<input id="con"></label><label class="f">اسم صاحب الشركة<input id="com"></label>
 <label class="f">الإيميل<input id="coe" dir="ltr" type="email"></label><label class="f">كلمة السر<input id="cop" dir="ltr" value="${pw}"></label>
 <button class="btn pri big" onclick="addCompany()">إنشاء الحساب</button>`)}
async function addCompany(){const n=$('#con').value.trim(),m=$('#com').value.trim(),e=$('#coe').value.trim().toLowerCase(),p=$('#cop').value;
 if(!n||!e)return toast('اكتب اسم الشركة والإيميل');if(p.length<6)return toast('كلمة السر لازم ٦ حروف على الأقل');
 const b=document.querySelector('.sheet .btn.big');b.disabled=true;b.textContent='بنعمل النسخة...';
 try{const muid=await FB.createUser(e,p);const cid='co'+Date.now().toString(36);
  await FB.setDoc(FB.doc('companies',cid),{name:n,manager:m,email:e,active:true,since:TODAY,managerUid:muid});
  await FB.setDoc(FB.doc('users',muid),{role:'manager',companyId:cid,name:m||n,email:e,active:true,photo:''});
  await FB.setDoc(FB.doc('companies',cid,'settings','main'),{...DEFAULT_SETTINGS,rules:DEFAULT_RULES,custRules:{}});
  credSheet(m||n,e,p)}catch(err){b.disabled=false;b.textContent='إنشاء الحساب';toast(err&&err.code&&err.code.startsWith('auth/')?authErr(err):(ERR_AR[err&&err.code]||'حصلت مشكلة، جرّب تاني'))}}
VIEWS.welcome=()=>`<div><h2>رسالة الترحيب</h2><div class="sub">بتظهر لكل صاحب شركة أول ما يفتح البرنامج</div></div>
 <div class="card"><label class="f">نص الرسالة (سيب سطر فاضي بين كل فقرة)<textarea id="wt" style="min-height:220px">${esc(S.welcomeText)}</textarea></label>
  <div class="row"><button class="btn pri" onclick="S.welcomeText=$('#wt').value.trim()||DEFAULT_WELCOME;render();toast('اتحفظت الرسالة')">حفظ</button><button class="btn" onclick="S.welcomeText=$('#wt').value.trim()||DEFAULT_WELCOME;showWelcome()">معاينة</button></div></div>
 <div class="card">${welcomeHTML()}</div>`;

/* ============ REPORTS / EXCEL ============ */
let DL={save:async({filename,data})=>({status:await FB.saveFile(filename,data)})},DL_READY=true;
V.rp={month:MONTH,rep:'all',status:'all'};
const STATUS_AR={paid:'تم الدفع',due:'مستحقة',open:'مفتوحة'};
const r2=n=>Math.round(n*100)/100;
const inMonth=d=>V.rp.month==='all'||(d||'').startsWith(V.rp.month);
const repOk=id=>V.rp.rep==='all'||V.rp.rep===id;
function canExport(k){if(V.role==='manager')return true;const a=Acc(V.role);return !!(a&&a.perms[k])}
function filteredInv(){return S.invoices.filter(i=>inMonth(i.date)&&repOk(i.rep)&&(V.rp.status==='all'||invState(i)===V.rp.status)).sort((a,b)=>a.date.localeCompare(b.date)||a.no.localeCompare(b.no))}
function rowsInvSummary(){return filteredInv().map(i=>{const gross=i.lines.reduce((s,l)=>s+l.qty*l.price,0),net=invTotal(i),ret=retValue(i),due=net-ret;
 return {'رقم الفاتورة':i.no,'تاريخ التنزيل':i.date,'الصيدلية':Cu(i.cust).name,'المندوب':R(i.rep).name,'الأصناف':i.lines.map(l=>`${short(P(l.prod).name)} × ${l.qty}`).join(' | '),
  'الإجمالي قبل الخصم':r2(gross),'قيمة الخصم':r2(gross-net),'الإجمالي بعد الخصم':r2(net),'قيمة المرتجع':r2(ret),'المطلوب':r2(due),'التحصيل':r2(i.collected||0),'الباقي':r2(i.status==='paid'?0:due),'حالة الفاتورة':STATUS_AR[invState(i)],'تاريخ التحصيل':i.paidDate||''}})}
function rowsInvLines(){const out=[];filteredInv().forEach(i=>i.lines.forEach(l=>{const rq=(i.returns.find(r=>r.prod===l.prod)||{}).qty||0;
 out.push({'رقم الفاتورة':i.no,'تاريخ التنزيل':i.date,'الصيدلية':Cu(i.cust).name,'المندوب':R(i.rep).name,'الصنف':P(l.prod).name,'الكمية':l.qty,'السعر':l.price,'الخصم %':l.disc,'الإجمالي بعد الخصم':r2(lineTotal(l)),'كمية المرتجع':rq,'حالة الفاتورة':STATUS_AR[invState(i)]})}));return out}
function rowsVisits(){return S.visits.filter(v=>inMonth(v.date)&&repOk(v.rep)).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)).map(v=>({'التاريخ':v.date,'الوقت':v.time,'المندوب':R(v.rep).name,'العميل':Cu(v.cust).name,'النوع':Cu(v.cust).type,'النتيجة':v.result,'الأصناف':v.items.map(p=>short(P(p).name)).join(' | '),'المحادثة':v.talk||'','الأوردر':(v.order||[]).map(o=>`${short(P(o.prod).name)} × ${o.qty}`).join(' | ')}))}
function rowsStaff(){const [ws,we]=weekRange();return S.reps.filter(r=>repOk(r.id)).map(r=>{let wd=0,worked=0,vac=0;
 for(let d=1;d<=+TODAY.slice(8);d++){const date=`${MONTH}-${pad(d)}`;if(dow(date)===5)continue;wd++;if(onVac(r.id,date)){vac++;continue}if(visitsOn(r.id,date).length)worked++}
 const ded=deductions(r.id);const mv=monthVisits(r.id).length;const sm=sales(r.id,MONTH+'-01',MONTH+'-31');
 return {'الموظف':r.name,'المنطقة':r.area,'أيام الشغل في الشهر لحد النهارده':wd,'الأيام اللي اشتغلها':worked,'أيام الأجازة':vac,'أيام الغياب':ded.items.filter(x=>x.kind==='غياب').length,
  'عدد الزيارات':mv,'متوسط الزيارات في اليوم':worked?r2(mv/worked):0,'عملاء اتزاروا':new Set(monthVisits(r.id).map(v=>v.cust)).size,'إجمالي أيام الخصم':ded.total,
  'المبيعات':r2(sm),'تارجت الشهر':plan(r.id).targetMonth,'نسبة التارجت %':plan(r.id).targetMonth?r2(sm/plan(r.id).targetMonth*100):0,'التحصيل':r2(collected(r.id,MONTH)),'رصيد الأجازات المتبقي':r.vacBalance-vacUsed(r.id)}})}
function rowsDed(){const out=[];S.reps.filter(r=>repOk(r.id)).forEach(r=>deductions(r.id).items.forEach(x=>out.push({'الموظف':r.name,'التاريخ':x.date,'نوع الخصم':x.kind,'التفاصيل':x.label,'أيام الخصم':x.amount})));return out}
const REPORTS=[
 {k:'inv',perm:'inv',title:'الفواتير',desc:'كل فاتورة في سطر، وكل صنف في شيت تاني',sheets:()=>[['ملخص الفواتير',rowsInvSummary()],['أصناف الفواتير',rowsInvLines()]],file:'الفواتير'},
 {k:'visits',perm:'visits',title:'الزيارات',desc:'كل زيارة بالتاريخ والوقت والنتيجة والأصناف',sheets:()=>[['الزيارات',rowsVisits()]],file:'الزيارات'},
 {k:'ded',perm:'ded',title:'الحضور والخصومات',desc:'أيام الشغل والغياب والأجازات والخصم لكل موظف',sheets:()=>[['ملخص الموظفين',rowsStaff()],['تفاصيل الخصومات',rowsDed()]],file:'الحضور-والخصومات'}
];
function makeSheet(rows){const ws=XLSX.utils.json_to_sheet(rows.length?rows:[{'':'مفيش بيانات'}]);const keys=Object.keys(rows[0]||{'':''});
 ws['!cols']=keys.map(k=>({wch:Math.min(48,Math.max(k.length+2,...rows.map(r=>String(r[k]??'').length+1)))}));
 if(rows.length)ws['!autofilter']={ref:XLSX.utils.encode_range({s:{r:0,c:0},e:{r:rows.length,c:keys.length-1}})};return ws}
async function exportReport(keys){
 if(!DL)return toast('التنزيل مش متاح في العرض ده');if(typeof XLSX==='undefined')return toast('مكتبة الإكسيل ما اتحملتش، جرّب تاني');
 const wb=XLSX.utils.book_new();wb.Workbook={Views:[{RTL:true}]};const names=[];
 REPORTS.filter(r=>keys.includes(r.k)&&canExport(r.perm)).forEach(r=>{r.sheets().forEach(([n,rows])=>XLSX.utils.book_append_sheet(wb,makeSheet(rows),n));names.push(r.file)});
 const per=V.rp.month==='all'?'كل-الشهور':V.rp.month;const who=V.rp.rep==='all'?'':'-'+R(V.rp.rep).name.replace(/\s+/g,'-');
 const filename=`بيثيل-اسمارت-${keys.length>1?'تقرير-كامل':names[0]}${who}-${per}.xlsx`;
 const buf=XLSX.write(wb,{bookType:'xlsx',type:'array'});
 try{const r=await DL.save({filename,data:buf});if(r.status==='saved')toast('الملف اتنزل')}
 catch(e){if(!/cancel/i.test(String(e&&e.message)))toast('مقدرناش نحفظ الملف')}}
function pvTable(rows){if(!rows.length)return '<div class="empty">مفيش بيانات بالفلتر ده</div>';const keys=Object.keys(rows[0]).slice(0,5);
 return `<div class="tbl"><table class="pv"><thead><tr>${keys.map(k=>`<th>${esc(k)}</th>`).join('')}</tr></thead><tbody>${rows.slice(0,3).map(r=>`<tr>${keys.map(k=>`<td class="num">${esc(r[k])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
VIEWS.reports=()=>{const avail=REPORTS.filter(r=>canExport(r.perm));const canDl=!!DL;const sel=(id,opts,cur,on)=>`<select id="${id}" onchange="${on}">${opts.map(([v,l])=>`<option value="${v}" ${cur===v?'selected':''}>${l}</option>`).join('')}</select>`;
 return `<div class="row nowrap">${tile('reports','lg')}<div><h2>التقارير</h2><div class="sub">تنزيل البيانات في ملفات Excel منظمة</div></div></div>
 <div class="card"><div class="grid2">
  <label class="f">الفترة${sel('rpm',[[MONTH,mName(MONTH)],[PREV_MONTH,mName(PREV_MONTH)],['all','كل الشهور']],V.rp.month,"V.rp.month=this.value;render()")}</label>
  <label class="f">الموظف${sel('rpr',[['all','كل الموظفين'],...S.reps.map(r=>[r.id,r.name])],V.rp.rep,"V.rp.rep=this.value;render()")}</label></div>
  <label class="f">حالة الفاتورة${sel('rps',[['all','الكل'],['paid','تم الدفع'],['due','مستحقة'],['open','مفتوحة']],V.rp.status,"V.rp.status=this.value;render()")}</label>
  <div class="sub">الحضور والخصومات دايماً للشهر الحالي.</div></div>
 
 ${avail.map(r=>{const sh=r.sheets();return `<div class="card"><div class="row between nowrap"><div class="row nowrap">${tile('reports')}<div><h3>${r.title}</h3><div class="sub">${r.desc}</div></div></div></div>
  ${sh.map(([n,rows])=>`<div class="row between"><b style="font-size:13.5px">شيت: ${esc(n)}</b><span class="pill acc num">${fmt(rows.length)} سطر</span></div><div class="cols">${Object.keys(rows[0]||{}).map(k=>`<span>${esc(k)}</span>`).join('')}</div>`).join('')}
  ${pvTable(sh[0][1])}
  <button class="btn acc" ${canDl?'':'disabled'} onclick="exportReport(['${r.k}'])">تنزيل Excel</button></div>`}).join('')||'<div class="empty">مفيش صلاحية تنزيل على حسابك</div>'}
 ${avail.length>1?`<button class="btn pri big" ${canDl?'':'disabled'} onclick="exportReport(${esc(JSON.stringify(avail.map(r=>r.k)))})">${tile('reports')}تنزيل تقرير كامل (كل الشيتات)</button>`:''}`};
VIEWS.allinv=()=>{const list=filteredInv().reverse();const tot=list.reduce((s,i)=>s+invTotal(i)-retValue(i),0),col=list.reduce((s,i)=>s+(i.collected||0),0);
 return `<h2>كل الفواتير</h2>
 <div class="grid2"><label class="f">الفترة<select onchange="V.rp.month=this.value;render()">${[[MONTH,mName(MONTH)],[PREV_MONTH,mName(PREV_MONTH)],['all','الكل']].map(([v,l])=>`<option value="${v}" ${V.rp.month===v?'selected':''}>${l}</option>`).join('')}</select></label>
 <label class="f">الموظف<select onchange="V.rp.rep=this.value;render()"><option value="all">الكل</option>${S.reps.map(r=>`<option value="${r.id}" ${V.rp.rep===r.id?'selected':''}>${esc(r.name)}</option>`).join('')}</select></label></div>
 <div class="seg">${[['all','الكل'],['due','مستحقة'],['open','مفتوحة'],['paid','مدفوعة']].map(([k,l])=>`<button class="${V.rp.status===k?'on':''}" onclick="V.rp.status='${k}';render()">${l}</button>`).join('')}</div>
 <div class="stats"><div class="stat"><div class="v num">${money(tot)}</div><div class="l">صافي ${fmt(list.length)} فاتورة</div></div><div class="stat"><div class="v num">${money(col)}</div><div class="l">اتحصّل منهم</div></div></div>
 <div class="card"><div class="list">${list.length?list.map(i=>invRow(i).replace('<span class="t">#','<span class="t">'+esc(R(i.rep).name.split(' ')[0])+' · #')).join(''):'<div class="empty">مفيش فواتير</div>'}</div></div>`};

/* ============ MANAGER: ACCOUNTANTS ============ */
const APERMS=[['inv','تنزيل الفواتير'],['visits','تنزيل الزيارات'],['ded','تنزيل الحضور والخصومات']];
function accSection(){return `<div class="row between" style="margin-top:6px"><div class="row nowrap">${tile('reports')}<h2>موظفين الحسابات</h2></div><button class="btn pri" onclick="accForm()">+ موظف حسابات</button></div>
 ${S.accountants.map(a=>`<div class="card"><div class="row nowrap">${avatar(a)}<h3>${esc(a.name)}</h3><span class="pill acc">حسابات</span></div>
  <div class="kv"><span>الإيميل</span><span class="num" dir="ltr">${esc(a.email)}</span></div>
  <div class="sub">يقدر ينزّل</div><div class="chips">${APERMS.map(([k,l])=>`<button class="chip ${(a.perms||{})[k]?'on':''}" aria-pressed="${!!(a.perms||{})[k]}" onclick="const x=Acc('${a.id}');x.perms={...(x.perms||{}),'${k}':!(x.perms||{})['${k}']};render()">${(a.perms||{})[k]?'✓ ':''}${l}</button>`).join('')}</div>
  <div class="row"><button class="btn sm" onclick="openChat('${ME.companyId}','${a.id}')">💬 شات ${typeof unread==='function'&&unread(S.threads&&S.threads[a.id])?'<span class="dotn">جديد</span>':''}</button><button class="btn sm" onclick="passAdmin('${a.id}')">🔑 كلمة السر</button><button class="btn sm danger" onclick="askDeactivate('${a.id}')">إيقاف الحساب</button></div></div>`).join('')||'<div class="empty">مفيش موظفين حسابات</div>'}
 <div class="note">موظف الحسابات بيشوف الفواتير وصفحة التقارير بس، وبينزّل الملفات اللي انت مدّيله صلاحيتها.</div>`}
function accForm(){const pw=String(Math.floor(100000+Math.random()*900000));
 sheet(`<h3>موظف حسابات جديد</h3><label class="f">الاسم<input id="an"></label><label class="f">الإيميل<input id="ae" dir="ltr" placeholder="name@nilepharma.app"></label><label class="f">كلمة السر<input id="ap" dir="ltr" autocapitalize="off" autocorrect="off" spellcheck="false" value="${pw}"></label>
 <div class="f">الصلاحيات<div class="chips">${APERMS.map(([k,l])=>`<label class="chip" style="display:inline-flex;gap:6px;align-items:center"><input type="checkbox" id="ap_${k}" checked style="width:16px;height:16px;margin:0">${l}</label>`).join('')}</div></div>
 <button class="btn pri big" onclick="addAcc()">إنشاء الحساب</button>`)}
async function addAcc(){const n=$('#an').value.trim(),e=$('#ae').value.trim().toLowerCase(),p=$('#ap').value.trim();if(!n||!e)return toast('اكتب الاسم والإيميل');if(p.length<6)return toast('كلمة السر لازم ٦ حروف على الأقل');
 const perms=Object.fromEntries(APERMS.map(([k])=>[k,$('#ap_'+k).checked]));const b=document.querySelector('.sheet .btn.big');b.disabled=true;b.textContent='بنعمل الحساب...';
 try{const id=await FB.createUser(e,p);const doc={role:'acc',companyId:ME.companyId,active:true,name:n,email:e,photo:'',perms};
  await FB.setDoc(FB.doc('users',id),doc);await FB.setDoc(FB.doc('secrets',id),{pass:p,email:e,at:Date.now()}).catch(()=>{});S.accountants.push({id,...doc});render();credSheet(n,e,p)}
 catch(err){b.disabled=false;b.textContent='إنشاء الحساب';toast(authErr(err))}}


/* ============ LOGIN / SESSION ============ */
function loadingHTML(){return `<div class="card" style="justify-items:center;padding-block:40px"><span class="spin" style="width:40px;height:40px;border-width:4px;color:var(--accent)"></span><div class="sub">بنحمّل البيانات...</div></div>`}
let LOGIN={mode:'in',msg:''};
function showLogin(msg){ME=null;document.body.classList.add('auth');closeSheet();if(msg!==undefined)LOGIN.msg=msg;const own=LOGIN.mode==='owner';
 $('#tabs').innerHTML='';
 $('#main').innerHTML=`<div class="login">
  <div class="welcome"><div class="plate"><img src="${LOGO_FULL}" alt="بيثيل للتدريب والتطوير"></div></div>
  <div class="card"><h2 style="text-align:center">${own?'أول مرة: حساب صاحب البرنامج':'تسجيل الدخول'}</h2>
   ${LOGIN.msg?`<div class="note bad">${esc(LOGIN.msg)}</div>`:''}
   <form id="lf" onsubmit="event.preventDefault();doLogin()" style="display:grid;gap:10px">
    <label class="f">الإيميل<input id="le" type="email" dir="ltr" autocomplete="username" autocapitalize="off" autocorrect="off" spellcheck="false" required value="${esc(LOGIN.email||'')}"></label>
    <label class="f">كلمة السر<div class="row nowrap"><input id="lp" type="password" dir="ltr" autocomplete="${own?'new-password':'current-password'}" required minlength="6" autocapitalize="off" autocorrect="off" spellcheck="false"><button type="button" class="btn sm" onclick="const i=$('#lp');i.type=i.type==='password'?'text':'password';this.textContent=i.type==='password'?'إظهار':'إخفاء'">إظهار</button></div></label>
    <button class="btn pri big" id="lb" type="submit">${own?'إنشاء الحساب':'دخول'}</button></form>
   <div class="row between"><button class="btn sm" onclick="forgot()">نسيت كلمة السر</button>
    <button class="btn sm" onclick="LOGIN.mode=LOGIN.mode==='owner'?'in':'owner';LOGIN.msg='';LOGIN.email=$('#le').value;showLogin()">${own?'رجوع للدخول':'صاحب البرنامج؟'}</button></div></div></div>${sig()}`}
async function doLogin(){const e=$('#le').value.trim().toLowerCase(),p=$('#lp').value.trim();LOGIN.email=e;const b=$('#lb');b.disabled=true;b.textContent='لحظة...';
 try{if(LOGIN.mode==='owner'){if(e!==OWNER_EMAIL){b.disabled=false;b.textContent='إنشاء الحساب';return showLogin('الإيميل ده مش إيميل صاحب البرنامج')}await FB.signUp(e,p)}else await FB.signIn(e,p);LOGIN.msg=''}
 catch(err){const c=err&&err.code||'';
  if(LOGIN.mode==='in'&&e===OWNER_EMAIL&&/invalid-credential|wrong-password|user-not-found/.test(c)){LOGIN.mode='owner';return showLogin('لو دي أول مرة تدخل، اكتب كلمة سر جديدة ودوس "إنشاء الحساب". ولو عملت الحساب قبل كده ونسيت كلمة السر، دوس "نسيت كلمة السر".')}
  if(LOGIN.mode==='owner'&&c==='auth/email-already-in-use'){LOGIN.mode='in';return showLogin('حسابك موجود فعلاً. ادخل بكلمة السر بتاعتك، ولو نسيتها دوس "نسيت كلمة السر" وهيوصلك لينك على الإيميل.')}
  showLogin(authErr(err))}}
function forgot(){const e=($('#le')&&$('#le').value.trim())||'';if(!e)return showLogin('اكتب الإيميل الأول، وبعدين دوس "نسيت كلمة السر"');
 FB.resetPassword(e).then(()=>showLogin('اتبعتلك لينك على الإيميل تغيّر منه كلمة السر')).catch(err=>showLogin(authErr(err)))}
function logoutWith(msg){LOGIN.msg=msg;Sync.stop();FB.signOut()}
function userMenu(){if(!ME)return;const q=myQueue?myQueue().length:0;const u=isRep()?me():isAcc()?Acc(V.role):{name:ME.role==='owner'?'رأفت سعيد':(S.company&&S.company.manager)||'صاحب الشركة'};
 const roleAr={owner:'صاحب البرنامج',manager:'صاحب الشركة',rep:'مندوب',acc:'موظف حسابات'}[ME.role];
 sheet(`<div class="row nowrap">${avatar(u||{name:'؟'})}<div><h3>${esc((u&&u.name)||'')}</h3><div class="sub">${roleAr} · <span dir="ltr">${esc(ME.email)}</span></div></div></div>
 ${q?`<div class="note bad">عندك ${fmt(q)} زيارة لسه ما اتبعتتش. استنى لما النت يرجع قبل ما تخرج، علشان متضيعش.</div>`:''}
 <button class="btn" onclick="sendReset(ME.email)">ابعتلي لينك تغيير كلمة السر</button>
 <button class="btn danger big" onclick="logoutWith('');closeSheet()">تسجيل خروج</button>
 <div class="sub" style="text-align:center">بيثيل اسمارت · نسخة 1.0</div>`)}
function maybeWelcome(){if(ME.role!=='manager')return;const k='bs_welcomed_'+ME.uid;try{if(localStorage.getItem(k))return;localStorage.setItem(k,'1')}catch(e){}setTimeout(showWelcome,600)}
async function onUser(user){Sync.stop();S=emptyState();ME=null;V.offline=navigator.onLine===false;
 if(!user)return showLogin();
 document.body.classList.remove('auth');$('#main').innerHTML=loadingHTML();
 try{if((user.email||'').toLowerCase()===OWNER_EMAIL){ME={uid:user.uid,email:user.email,role:'owner'};V.role='owner'}
  else{let snap;try{snap=await FB.getDoc(FB.doc('users',user.uid))}catch(e){return logoutWith(navigator.onLine?'مقدرناش نوصل لحسابك، جرّب تاني':'أول مرة تدخل محتاج نت')}
   if(!snap.exists()||snap.data().active===false)return logoutWith('الحساب ده مش متفعّل. كلّم المسؤول عنك.');
   const d=snap.data();ME={uid:user.uid,email:user.email,role:d.role,companyId:d.companyId};
   if(d.role==='rep'){S.reps=[{id:user.uid,...d}];V.role=user.uid}else if(d.role==='acc'){S.accountants=[{id:user.uid,...d}];V.role=user.uid}else V.role='manager'}
  V.tab=TABS[grpOf()][0][0];V.calSel=TODAY;Sync.start();render();animate('anim-u');maybeWelcome()}
 catch(e){console.error(e);logoutWith('حصلت مشكلة، جرّب تاني')}}
function boot(){FB.onAuth(onUser)}
setInterval(()=>{const n=new Date(),t=`${n.getFullYear()}-${_p2(n.getMonth()+1)}-${_p2(n.getDate())}`;if(t!==TODAY){TODAY=t;MONTH=t.slice(0,7);V.calSel=t;scheduleRender()}},60000);
if(window.FB)boot();else window.addEventListener('fb-ready',boot,{once:true});
