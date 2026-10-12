'use strict';
(function(root, factory) {
  const api = factory(typeof module === 'object' && module.exports ? require('../shared/catalog.js') : root.UniCourseData);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.UniCourseEngine = api;
})(typeof globalThis === 'object' ? globalThis : this, data => {
  const bySection = new Map(data.courses.flatMap(c => c.sections.map(s => [s.id, {c, s}])));
  const lookup = id => bySection.get(id);
  const courseLabel = id => id+' · '+(data.courses.find(c=>c.id===id)?.name || data.prerequisiteNames?.[id] || 'Chưa có tên môn');
  const credits = ids => ids.reduce((n, id) => n + (lookup(id)?.c.credits || 0), 0);
  const missing = (c, profile) => c.pre.filter(id => !profile.completed.includes(id));
  function conflicts(ids) {
    const pairs = [];
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
      const a = lookup(ids[i]), b = lookup(ids[j]);
      if (a && b && a.s.day === b.s.day && a.s.start <= b.s.end && b.s.start <= a.s.end) pairs.push([ids[i], ids[j]]);
    }
    return pairs;
  }
  function problems(ids, profile) {
    const errors = [];
    if (!ids.length) errors.push('Bạn chưa chọn lớp học.');
    if (!profile.known) errors.push('Chưa có dữ liệu môn đã hoàn thành. Hãy cập nhật hồ sơ.');
    if (credits(ids) > data.term.maxCredits) errors.push('Vượt giới hạn 24 tín chỉ mỗi học kỳ.');
    if (conflicts(ids).length) errors.push('Có lớp học trùng lịch.');
    const seen = new Set();
    for (const id of ids) {
      const item = lookup(id);
      if (!item) { errors.push('Lớp học không tồn tại: ' + id); continue; }
      const {c,s} = item;
      if (seen.has(c.id)) errors.push(c.id + ': chỉ được chọn một lớp mỗi học phần.');
      seen.add(c.id);
      if (s.seats <= 0) errors.push(s.id + ': lớp đã hết chỗ.');
      if (missing(c, profile).length) errors.push(c.id + ': chưa đạt môn tiên quyết ' + missing(c, profile).map(courseLabel).join(', ') + '.');
      if (c.coreq && !ids.some(x => lookup(x)?.c.id === c.coreq) && !profile.completed.includes(c.coreq)) errors.push(c.id + ': cần đăng ký cùng ' + courseLabel(c.coreq) + '.');
      if (profile.completed.includes(c.id)) errors.push(c.id + ': bạn đã hoàn thành môn này.');
    }
    return [...new Set(errors)];
  }
  // Exhaustive search for this small demo catalog: credits first, then preference score.
  // A parent course is visited before its co-requisite lab; prerequisites require prior completion.
  function recommend(profile, prefs) {
    if (!profile.known) return {ids:[], error:'missing-profile', explored:0};
    if (!Number.isInteger(prefs.target) || prefs.target < 8 || prefs.target > 24) return {ids:[], error:'invalid-target', explored:0};
    const excluded = new Set(prefs.excludedDays || (prefs.noSaturday ? [5] : []));
    const ranked = data.courses.filter(c => !missing(c,profile).length && !profile.completed.includes(c.id))
      .map(c => ({c, score:10+c.tags.filter(t=>prefs.tags.includes(t)).length*8+(c.id==='IT3011'?4:0),
        sections:c.sections.filter(s=>s.seats>0&&!excluded.has(s.day))}))
      .filter(x=>x.sections.length).sort((a,b)=>Number(!!a.c.coreq)-Number(!!b.c.coreq)||b.score-a.score||a.c.id.localeCompare(b.c.id));
    const remaining = Array(ranked.length+1).fill(0);
    for (let i=ranked.length-1;i>=0;i--) remaining[i]=remaining[i+1]+ranked[i].c.credits;
    let best={ids:[],credits:0,score:-1}, explored=0;
    const occupied=Array(7).fill(0), selected=new Set(), memo=new Map();
    function visit(i, ids, count, heavy, score) {
      explored++;
      if (Math.min(prefs.target,count+remaining[i])<best.credits) return;
      const dependency=ranked.filter(x=>x.c.coreq).map(x=>selected.has(x.c.coreq)?1:0).join('');
      const key=[i,count,heavy,...occupied,dependency].join(':');
      if ((memo.get(key)??-Infinity)>=score) return;
      memo.set(key,score);
      if (i===ranked.length) {
        if (count>best.credits||(count===best.credits&&score>best.score)) best={ids:[...ids],credits:count,score};
        return;
      }
      const {c,sections,score:courseScore}=ranked[i];
      if (count+c.credits<=prefs.target&&(!c.heavy||heavy<2)&&(!c.coreq||selected.has(c.coreq)||profile.completed.includes(c.coreq))) {
        for(const s of sections) {
          const mask=((1<<(s.end-s.start+1))-1)<<(s.start-1);
          if(occupied[s.day]&mask) continue;
          occupied[s.day]|=mask;selected.add(c.id);ids.push(s.id);
          visit(i+1,ids,count+c.credits,heavy+Number(!!c.heavy),score+courseScore+(prefs.morning&&s.start<=5?6-s.start:0));
          ids.pop();selected.delete(c.id);occupied[s.day]^=mask;
        }
      }
      visit(i+1,ids,count,heavy,score);
    }
    visit(0,[],0,0,0);
    return {ids:best.ids,credits:best.credits,score:best.score,explored,error:null};
  }
  function periodMinutes(period) { return period<=5?420+(period-1)*50:720+(period-6)*50; }
  function clock(minutes) { return String(Math.floor(minutes/60)).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0'); }
  function sectionTime(id) {
    const {s}=lookup(id);
    return data.days[s.day]+' · '+clock(periodMinutes(s.start))+'–'+clock(periodMinutes(s.start)+(s.end-s.start+1)*50);
  }
  return {courseLabel,lookup,credits,missing,conflicts,problems,recommend,periodMinutes,clock,sectionTime};
});
