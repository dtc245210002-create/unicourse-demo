'use strict';
(function(root,factory){const node=typeof module==='object'&&module.exports;const api=factory(node?require('../shared/catalog.js'):root.UniCourseData,node?require('./engine.js'):root.UniCourseEngine);if(node)module.exports=api;else root.UniCourseCalendar=api;})(globalThis,(data,engine)=>{
  const stamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const safe=s=>String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  function fold(line){const result=[];let part='',length=0;for(const char of line){const bytes=new TextEncoder().encode(char).length;if(length+bytes>75){result.push(part);part=' ';length=1;}part+=char;length+=bytes;}result.push(part);return result.join('\r\n');}
  function create(receipt,now=new Date()){
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//UniCourse Group2//Demo//VI','CALSCALE:GREGORIAN'];
    for(const id of receipt.ids){const {c,s}=engine.lookup(id);const base=new Date(data.term.start+'T00:00:00Z');const start=new Date(base.getTime()+s.day*86400000+(engine.periodMinutes(s.start)-data.term.utcOffsetMinutes)*60000);const end=new Date(start.getTime()+(s.end-s.start+1)*50*60000);lines.push('BEGIN:VEVENT',`UID:${safe(id+'-'+receipt.code)}@unicourse.demo`,`DTSTAMP:${stamp(now)}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(end)}`,`RRULE:FREQ=WEEKLY;COUNT=${data.term.weeks}`,`SUMMARY:${safe(c.name+' ('+id+')')}`,`LOCATION:${safe(s.room)}`,'DESCRIPTION:Lich hoc du lieu demo UniCourse','END:VEVENT');}
    lines.push('END:VCALENDAR');return lines.map(fold).join('\r\n')+'\r\n';
  }
  return {create};
});
