'use strict';
(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('../shared/catalog.js'):root.UniCourseData,
 typeof module==='object'&&module.exports?require('./engine.js'):root.UniCourseEngine);
 if(typeof module==='object'&&module.exports)module.exports=api;else root.UniCourseExports=api;
})(typeof globalThis==='object'?globalThis:this,(data,engine)=>{
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 function rows(receipt,user){
  return [['UniCourse — Kết quả đăng ký demo'],['Sinh viên',user?.name||'','Mã sinh viên',user?.id||''],
   ['Học kỳ',data.term.label],['Mã xác nhận',receipt.code],['Ngày xác nhận',receipt.date],
   ['Tổng tín chỉ',engine.credits(receipt.ids)],['Dữ liệu minh họa — không phải xác nhận đăng ký của nhà trường'],[],
   ['Mã môn','Tên môn','Mã lớp','Tín chỉ','Ngày học','Tiết','Giờ học','Phòng','Giảng viên'],
   ...receipt.ids.map(id=>{const {c,s}=engine.lookup(id);return [c.id,c.name,s.id,c.credits,data.days[s.day]||'Chủ nhật',s.start+'–'+s.end,engine.sectionTime(id).split(' · ')[1],s.room,s.teacher];})];
 }
 // XLSX is an Open XML ZIP package. Store entries without compression for offline use.
 function zip(entries){
  const enc=new TextEncoder(),local=[],central=[];let offset=0;
  const u16=(b,p,n)=>new DataView(b.buffer).setUint16(p,n,true),u32=(b,p,n)=>new DataView(b.buffer).setUint32(p,n>>>0,true);
  const crc=bytes=>{let n=0xffffffff;for(const b of bytes){n^=b;for(let i=0;i<8;i++)n=(n>>>1)^((n&1)?0xedb88320:0);}return (n^0xffffffff)>>>0;};
  for(const [path,text]of entries){
   const name=enc.encode(path),body=enc.encode(text),checksum=crc(body),header=new Uint8Array(30+name.length);
   u32(header,0,0x04034b50);u16(header,4,20);u16(header,6,0x800);u32(header,14,checksum);u32(header,18,body.length);u32(header,22,body.length);u16(header,26,name.length);header.set(name,30);
   const c=new Uint8Array(46+name.length);u32(c,0,0x02014b50);u16(c,4,20);u16(c,6,20);u16(c,8,0x800);u32(c,16,checksum);u32(c,20,body.length);u32(c,24,body.length);u16(c,28,name.length);u32(c,42,offset);c.set(name,46);
   local.push(header,body);central.push(c);offset+=header.length+body.length;
  }
  const size=central.reduce((n,b)=>n+b.length,0),end=new Uint8Array(22);u32(end,0,0x06054b50);u16(end,8,entries.length);u16(end,10,entries.length);u32(end,12,size);u32(end,16,offset);
  const chunks=[...local,...central,end],out=new Uint8Array(offset+size+22);let pos=0;for(const c of chunks){out.set(c,pos);pos+=c.length;}return out;
 }
 function workbook(receipt,user){
  const ns='http://schemas.openxmlformats.org/spreadsheetml/2006/main';
  const content=rows(receipt,user).map((r,i)=>'<row r="'+(i+1)+'">'+r.map((v,j)=>{const ref=String.fromCharCode(65+j)+(i+1);return typeof v==='number'?'<c r="'+ref+'"><v>'+v+'</v></c>':'<c r="'+ref+'" t="inlineStr"><is><t xml:space="preserve">'+escape(v)+'</t></is></c>';}).join('')+'</row>').join('');
  return zip([
   ['[Content_Types].xml','<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'],
   ['_rels/.rels','<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
   ['xl/workbook.xml','<workbook xmlns="'+ns+'" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Lịch học đã xác nhận" sheetId="1" r:id="rId1"/></sheets></workbook>'],
   ['xl/_rels/workbook.xml.rels','<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'],
   ['xl/worksheets/sheet1.xml','<worksheet xmlns="'+ns+'"><cols><col min="1" max="1" width="16" customWidth="1"/><col min="2" max="2" width="44" customWidth="1"/><col min="3" max="3" width="22" customWidth="1"/><col min="4" max="6" width="15" customWidth="1"/><col min="7" max="9" width="24" customWidth="1"/></cols><sheetData>'+content+'</sheetData></worksheet>']
  ]);
 }
 function downloadExcel(receipt,user){
  const url=URL.createObjectURL(new Blob([workbook(receipt,user)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
  const a=document.createElement('a');a.href=url;a.download='UniCourse-'+receipt.code+'.xlsx';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function printHTML(receipt,user){
  const all=rows(receipt,user),headers=all[8],body=all.slice(9);
  return '<!doctype html><html lang="vi"><meta charset="utf-8"><title>UniCourse-'+escape(receipt.code)+'</title><style>@page{size:A4 landscape;margin:15mm}body{font:12px Arial,sans-serif;color:#15263d}h1{font-size:22px}table{border-collapse:collapse;width:100%;margin-top:20px}th,td{border:1px solid #ccd5e0;padding:8px;text-align:left}th{background:#eaf0ff}tr{break-inside:avoid}small{color:#57677d}</style><h1>Lịch học đã xác nhận · UniCourse</h1><p>'+escape(user?.name||'')+' · '+escape(user?.id||'')+'</p><p>'+escape(data.term.label)+' · '+engine.credits(receipt.ids)+' tín chỉ</p><p>Mã xác nhận: '+escape(receipt.code)+' · '+escape(receipt.date)+'</p><small>Dữ liệu minh họa — không phải xác nhận đăng ký của nhà trường. Lịch học hàng tuần trong học kỳ.</small><table><thead><tr>'+headers.map(h=>'<th>'+escape(h)+'</th>').join('')+'</tr></thead><tbody>'+body.map(r=>'<tr>'+r.map(v=>'<td>'+escape(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></html>';
 }
 function printPDF(receipt,user){
  const frame=document.createElement('iframe');frame.title='Bản in lịch học';frame.style.cssText='position:fixed;width:1px;height:1px;left:-10000px;border:0';
  frame.onload=()=>{frame.contentWindow.addEventListener('afterprint',()=>frame.remove(),{once:true});frame.contentWindow.focus();frame.contentWindow.print();};
  frame.srcdoc=printHTML(receipt,user);document.body.appendChild(frame);
 }
 return {rows,workbook,printHTML,downloadExcel,printPDF};
});
