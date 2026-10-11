'use strict';
(function(root) {
  const KEY='unicourse-functional-demo-v2', LEGACY='unicourse-functional-demo-v1';
  const defaults=()=>({user:null,completed:[...UniCourseData.defaultCompleted],known:true,cart:[],registrations:[]});
  const empty=()=>({version:2,active:null,accounts:{}});
  const safeId=id=>typeof id==='string'&&!!UniCourseEngine.lookup(id);
  function clean(raw) {
    const s=defaults();
    if(!raw||typeof raw!=='object') return s;
    s.user=raw.user&&typeof raw.user.id==='string'&&typeof raw.user.name==='string'?raw.user:null;
    s.completed=Array.isArray(raw.completed)?raw.completed.filter(x=>typeof x==='string'):s.completed;
    s.known=raw.known!==false;
    const seen=new Set();
    s.cart=Array.isArray(raw.cart)?raw.cart.filter(id=>{if(!safeId(id))return false;const c=UniCourseEngine.lookup(id).c.id;if(seen.has(c))return false;seen.add(c);return true;}):[];
    s.registrations=Array.isArray(raw.registrations)?raw.registrations.filter(r=>r&&typeof r.code==='string'&&typeof r.date==='string'&&Array.isArray(r.ids)&&r.ids.every(safeId)):[];
    return s;
  }
  let db=empty();
  try {
    const parsed=JSON.parse(localStorage.getItem(KEY));
    if(parsed?.version===2&&parsed.accounts&&typeof parsed.accounts==='object') db=parsed;
    else {const legacy=clean(JSON.parse(localStorage.getItem(LEGACY)));if(legacy.user){const id=legacy.user.id.trim().toUpperCase();db.accounts[id]=legacy;db.active=id;}}
  } catch {}
  const accountKey=id=>id.trim().toUpperCase();
  function persist(){localStorage.setItem(KEY,JSON.stringify(db));}
  function login(user){const id=accountKey(user.id);const s=clean(Object.hasOwn(db.accounts,id)?db.accounts[id]:null);s.user={id,name:user.name};db.active=id;Object.defineProperty(db.accounts,id,{value:s,writable:true,enumerable:true,configurable:true});persist();return s;}
  function save(s){if(s.user){const id=accountKey(s.user.id);db.accounts[id]=clean(s);db.active=id;}else db.active=null;persist();}
  function current(){return db.active&&Object.hasOwn(db.accounts,db.active)?clean(db.accounts[db.active]):defaults();}
  root.UniCourseStorage={defaults,current,login,save};
})(globalThis);
