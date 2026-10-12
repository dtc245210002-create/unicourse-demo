/* Canonical synthetic data for the UniCourse demo and Figma build. */
(function(root,factory){const data=factory();if(typeof module==='object'&&module.exports)module.exports=data;else root.UniCourseData=data;})(typeof globalThis==='object'?globalThis:this,()=>{
const section=(id,day,start,end,seats=20)=>({id,day,start,end,seats,room:'A'+(200+day*10+start),teacher:['Nguyễn Minh Anh','Trần Thu Hà','Lê Quốc Huy'][day%3]});
const courses=[
 {id:'IT3011',name:'Cấu trúc dữ liệu và giải thuật',credits:3,faculty:'CNTT',heavy:true,tags:['Lập trình','Dữ liệu'],pre:['IT1010'],sections:[section('IT3011-01',1,3,5),section('IT3011-04',2,1,3)]},
 {id:'IT3011L',name:'Thực hành cấu trúc dữ liệu',credits:1,faculty:'CNTT',tags:['Lập trình'],pre:['IT1010'],coreq:'IT3011',sections:[section('IT3011L-01',4,1,2),section('IT3011L-02',5,3,4)]},
 {id:'MI2020',name:'Xác suất thống kê',credits:3,faculty:'Toán',heavy:true,tags:['Dữ liệu'],pre:['MI1111'],sections:[section('MI2020-02',1,3,5),section('MI2020-05',3,1,3)]},
 {id:'IT3320',name:'Cơ sở dữ liệu',credits:3,faculty:'CNTT',tags:['Dữ liệu','Lập trình'],pre:['IT1010'],sections:[section('IT3320-01',0,1,3,0),section('IT3320-03',0,6,8)]},
 {id:'IT2021',name:'Lập trình Python',credits:3,faculty:'CNTT',tags:['Lập trình','Dữ liệu'],pre:['IT1010'],sections:[section('IT2021-01',1,7,9),section('IT2021-02',3,7,9)]},
 {id:'IT4010',name:'Trí tuệ nhân tạo',credits:3,faculty:'CNTT',heavy:true,tags:['AI','Dữ liệu'],pre:['IT3011'],sections:[section('IT4010-01',4,6,8)]},
 {id:'EN2020',name:'Tiếng Anh chuyên ngành',credits:3,faculty:'Ngoại ngữ',tags:['Ngoại ngữ'],pre:['EN1010'],sections:[section('EN2020-01',2,6,8)]},
 {id:'SS2010',name:'Kỹ năng giao tiếp',credits:2,faculty:'Đại cương',tags:['Kỹ năng'],pre:[],sections:[section('SS2010-01',0,10,11)]},
 {id:'IT3030',name:'Thiết kế giao diện phần mềm',credits:3,faculty:'CNTT',tags:['Thiết kế','Lập trình'],pre:['IT1010'],sections:[section('IT3030-01',4,6,8)]},
 {id:'IT3040',name:'Mạng máy tính',credits:3,faculty:'CNTT',heavy:true,tags:['Hệ thống'],pre:['IT1010'],sections:[section('IT3040-01',2,7,9)]},
 {id:'SS2020',name:'Pháp luật đại cương',credits:2,faculty:'Đại cương',tags:['Kỹ năng'],pre:[],sections:[section('SS2020-01',3,10,11)]},
 {id:'PE2010',name:'Giáo dục thể chất',credits:1,faculty:'Đại cương',tags:['Kỹ năng'],pre:[],sections:[section('PE2010-01',5,1,2)]},
 {id:'IT3050',name:'Phát triển ứng dụng web',credits:3,faculty:'CNTT',tags:['Lập trình','Thiết kế'],pre:['IT1010'],sections:[section('IT3050-01',0,3,5)]}
];

return {version:2,courses,prerequisiteNames:{IT1010:'Nhập môn lập trình',MI1111:'Giải tích 1',IT2020:'Lập trình hướng đối tượng',EN1010:'Tiếng Anh cơ bản'},days:['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'],term:{label:'Học kỳ I · 2026–2027',start:'2026-10-12',weeks:16,utcOffsetMinutes:420,maxCredits:24,totalCredits:150},defaultCompleted:['IT1010','MI1111','IT2020']};
});
