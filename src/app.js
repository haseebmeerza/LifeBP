if(typeof APP_CFG==='undefined')var APP_CFG={sheetUrl:'',token:'',versionCode:0,versionName:'web'};
var K='lpvr_records',CC='971',V='lpvr_view';
var recs=load();
function load(){try{return JSON.parse(localStorage.getItem(K)||'[]')}catch(e){return[]}}
function store(){try{localStorage.setItem(K,JSON.stringify(recs))}catch(e){toast('Storage full or blocked')}}
function $(i){return document.getElementById(i)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function toast(m){var t=$('toast');t.textContent=m;t.className='on';setTimeout(function(){t.className=''},2600)}
function p2(n){return(n<10?'0':'')+n}
function today(){var n=new Date();return n.getFullYear()+'-'+p2(n.getMonth()+1)+'-'+p2(n.getDate())}
function nowT(){var n=new Date();return p2(n.getHours())+':'+p2(n.getMinutes())}
function fd(s){var a=String(s).split('-');return a.length==3?a[2]+'/'+a[1]+'/'+a[0]:s}
function ft(s){var a=String(s).split(':'),h=+a[0],m=a[1]||'00';return(h%12||12)+':'+m+' '+(h>=12?'PM':'AM')}
function tab(n){for(var i=1;i<=4;i++){$('p'+i).className=i==n?'':'hide';$('t'+i).className=i==n?'on':''}
if(n==2){$('vd').className='card hide';$('lc').className='card';list()}if(n==4)info();$('main').scrollTop=0}
function phone(m){var raw=String(m).trim(),d=raw.replace(/\D/g,''),intl=raw.charAt(0)=='+'||d.indexOf('00')==0;
if(d.indexOf('00')==0)d=d.slice(2);if(intl)return d;if(d.indexOf(CC)==0&&d.length>=12)return d;
if(d.charAt(0)=='0')d=d.slice(1);return CC+d}
function newId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}

/* ---- health assessment (AHA/ACC 2025, AAP 2017, ADA 2026, Cleveland Clinic) ---- */
var RF={'Normal':'','Elevated':'wn','Stage 1':'wn','Low':'wn','Refer':'wn','Stage 2':'bd','High':'bd','Urgent':'cr'};
function agev(r){var a=parseInt(r.age,10);return isNaN(a)?18:a}
function bpA(s,d,age){if(!s||!d)return null;
if(age<13)return(s>=140||d>=90)?'High':'Refer';
if(s>=180||d>=120)return'Urgent';if(s>=140||d>=90)return'Stage 2';if(s>=130||d>=80)return'Stage 1';
if(s<90||d<60)return'Low';if(s>=120)return'Elevated';return'Normal'}
function hrA(h,age){if(!h)return null;var q=age<1?[100,180]:age<3?[98,140]:age<5?[80,120]:age<13?[75,118]:[60,100];
return h<q[0]?'Low':h>q[1]?'High':'Normal'}
function suA(v,t){if(!v)return null;if(v<54)return'Urgent';if(v<70)return'Low';
if(t=='Fasting')return v<100?'Normal':v<126?'Elevated':'High';return v<140?'Normal':v<200?'Elevated':'High'}
function tg(s){return s?' <span class="tag '+RF[s]+'">'+s+'</span>':''}
function adv(r){var a=agev(r),o=[],b=bpA(r.sys,r.dia,a),h=hrA(r.hr,a),s=suA(r.sugar,r.stype),f=r.stype=='Fasting',life=false;
if(b=='Urgent')o.push('BP is 180/120 or higher. Sit quietly for 5 minutes and measure again. If still this high, see a doctor now. With chest pain, breathlessness, weakness, speech or vision change, severe headache or confusion, call an ambulance (998 in UAE).');
else if(b=='Stage 2'){life=true;o.push('BP is in the Stage 2 range (140/90 or higher). Repeat on another day and see a doctor soon to confirm and decide treatment.')}
else if(b=='Stage 1'){life=true;o.push('BP is in the Stage 1 range (130-139 / 80-89). Repeat on different days and start lifestyle changes. See a doctor if it stays high, especially with diabetes, kidney or heart disease.')}
else if(b=='Elevated'){life=true;o.push('BP is slightly elevated (120-129 / below 80). Lifestyle changes now can prevent high BP. Re-check regularly.')}
else if(b=='Low')o.push('BP is low (below 90/60 is a commonly used cut-off). If dizzy, faint or unwell, see a doctor. Stand up slowly and drink enough fluids.');
else if(b=='Refer')o.push('Child BP depends on age, sex and height, so adult ranges do not apply. Please have it checked on a child BP chart by a paediatrician.');
else if(b=='High')o.push('This BP (140/90 or higher) is high for a child. See a doctor soon.');
else if(b=='Normal')o.push('BP is normal. Keep up healthy habits.');
if(h=='Low')o.push('Heartbeat is below the usual range for this age. This can be normal in fit athletes. If dizzy, faint, breathless or tired, see a doctor.');
else if(h=='High')o.push('Heartbeat is above the usual range for this age. Rest 5 minutes and re-check (caffeine, stress, fever and dehydration raise it). If it stays high, or with chest pain, fainting or breathlessness, get urgent medical care.');
else if(h=='Normal')o.push('Heartbeat is normal for this age.');
if(s=='Urgent')o.push('Sugar is very low (below 54). If awake and able to swallow, give 15 g fast sugar (half cup juice or 1 tablespoon sugar or honey), re-check in 15 minutes, repeat if below 70, then give a meal. If drowsy or confused, call an ambulance (998).');
else if(s=='Low')o.push('Sugar is low (below 70). Take 15 g fast sugar (half cup juice or 1 tablespoon sugar or honey), re-check in 15 minutes, repeat if still low, then eat. Tell the doctor if lows happen often.');
else if(s=='Elevated'){life=true;o.push(f?'Fasting sugar 100-125 is in the prediabetes range. Confirm with a lab test (HbA1c or fasting glucose). Healthy weight, diet and activity help. Re-test yearly.':'Sugar is above normal for a '+(r.stype=='After meal'?'2-hour after-meal':'random')+' reading (140-199). Do a fasting test or HbA1c to check for prediabetes.')}
else if(s=='High'){life=true;o.push((f?'Fasting sugar 126 or higher':'Sugar 200 or higher')+' is in the diabetes range. A diagnosis needs a lab test repeated on another day, so see a doctor soon. With thirst, frequent urination, blurred vision, vomiting or drowsiness, get care today.')}
else if(s=='Normal')o.push('Sugar is normal for this type of test.');
if(s=='Elevated'||s=='High')o.push('If already diagnosed with diabetes: usual adult targets are 80-130 before meals and below 180 after meals. Follow your doctor\'s own targets.');
if(life)o.push('General: less salt, more fruit and vegetables, about 150 minutes of walking or activity a week, healthy weight, no smoking, limited alcohol, enough sleep.');
return{o:o}}

/* ---- save + result ---- */
var one=null;
function save(){
var ag=$('ag').value.trim();
var r={id:newId(),date:$('d').value||today(),time:$('tm').value||nowT(),name:$('nm').value.trim(),
mobile:phone($('mb').value),age:ag===''?'':Math.floor(+ag),sys:+$('sy').value||'',dia:+$('di').value||'',hr:+$('hr').value||'',
sugar:+$('su').value||'',stype:$('st').value,note:$('nt').value.trim(),synced:0};
if(!r.name)return toast('Enter visitor name');
if(r.mobile.length<11||r.mobile.length>15)return toast('Enter valid mobile number');
if(r.age===''||isNaN(r.age)||r.age<0||r.age>120)return toast('Enter age (0 to 120 years)');
if(!(r.sys&&r.dia)&&!r.hr&&!r.sugar)return toast('Enter at least one reading');
if((r.sys&&!r.dia)||(!r.sys&&r.dia))return toast('Enter both BP values');
if(r.sys&&(r.sys<50||r.sys>300||r.dia<20||r.dia>200||r.sys<=r.dia))return toast('Check BP values');
if(r.hr&&(r.hr<20||r.hr>300))return toast('Check heartbeat value');
if(r.sugar&&(r.sugar<10||r.sugar>900))return toast('Check sugar value (mg/dL)');
recs.push(r);store();
['nm','mb','ag','sy','di','hr','su','nt'].forEach(function(i){$(i).value=''});
$('d').value=today();$('tm').value=nowT();
sync(r);showRes(r)}
function rowH(k,v,t){return'<tr><td><b>'+k+'</b></td><td>'+v+'</td><td>'+tg(t)+'</td></tr>'}
function advH(r){return'<div class="adv">'+adv(r).o.map(function(t){return'<p>'+esc(t)+'</p>'}).join('')+'</div><p class="ref">Based on AHA/ACC 2025, AAP 2017, ADA 2026 and Cleveland Clinic ranges. Screening only, not a diagnosis. See the Guide tab for sources.</p>'}
function showRes(r){one=r;var a=agev(r),h='<h3 style="margin:0 0 4px">'+esc(r.name)+' ('+esc(r.age)+' yrs)</h3><small>'+fd(r.date)+' '+ft(r.time)+'</small><table style="margin-top:8px">';
if(r.sys)h+=rowH('BP',r.sys+'/'+r.dia+' mmHg',bpA(r.sys,r.dia,a));
if(r.hr)h+=rowH('Heartbeat',r.hr+' bpm',hrA(r.hr,a));
if(r.sugar)h+=rowH('Sugar',r.sugar+' mg/dL ('+esc(r.stype)+')',suA(r.sugar,r.stype));
h+='</table><h4 style="margin:12px 0 0">Advice</h4>'+advH(r)+'<button class="b" onclick="sendOne()">Send to WhatsApp</button><button class="b o" onclick="closeRes()">Close</button>';
$('rc').innerHTML=h;$('res').className='mdl';$('rc').scrollTop=0}
function closeRes(){$('res').className='mdl hide'}
function sendOne(){if(one)openExt(waLink(one.mobile,msg([one])))}
function line(r){var a=agev(r),o=fd(r.date)+' '+ft(r.time);
if(r.sys)o+='\nBP: '+r.sys+'/'+r.dia+' mmHg ('+bpA(r.sys,r.dia,a)+')';
if(r.hr)o+='\nHeartbeat: '+r.hr+' bpm ('+hrA(r.hr,a)+')';
if(r.sugar)o+='\nSugar: '+r.sugar+' mg/dL, '+r.stype+' ('+suA(r.sugar,r.stype)+')';
if(r.note)o+='\nNote: '+r.note;return o}
function msg(a){a=a.slice(-5);var l=a[a.length-1];
var o='*Life Pharmacy - Vital Record*\nName: '+l.name+(l.age!==''&&l.age!=null?' ('+l.age+' yrs)':'')+'\n\n'+a.map(line).join('\n\n');
o+='\n\n*Advice*\n'+adv(l).o.map(function(t){return'- '+t}).join('\n');
return o+'\n\n_Screening only, not a diagnosis. Please consult your doctor. Ref: AHA/ACC 2025, AAP 2017, ADA 2026._'}
function waLink(m,t){return'https://wa.me/'+m+'?text='+encodeURIComponent(t)}

/* ---- Google Sheet sync ---- */
function gu(){return APP_CFG.sheetUrl||''}
function sync(r){var u=gu();if(!u||!navigator.onLine)return Promise.resolve(false);
return fetch(u,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(Object.assign({token:APP_CFG.token},r))})
.then(function(x){return x.json()}).then(function(q){if(q&&q.ok){r.synced=1;store();return true}return false}).catch(function(){return false})}
function syncAll(){if(!gu())return toast('Sheet link not set');
var p=recs.filter(function(r){return!r.synced});if(!p.length)return toast('Nothing pending');
Promise.all(p.map(sync)).then(function(a){info();toast(a.filter(Boolean).length+' of '+a.length+' synced')})}
function restore(){var u=gu();if(!u)return toast('Sheet link not set');
toast('Restoring...');fetch(u+'?token='+encodeURIComponent(APP_CFG.token)).then(function(x){return x.json()}).then(function(a){if(!Array.isArray(a))throw 0;
var ids={};recs.forEach(function(r){ids[r.id]=1});var n=0;
a.forEach(function(r){if(r.id&&!ids[r.id]){r.synced=1;recs.push(r);n++}});store();info();toast(n+' records restored')})
.catch(function(){toast('Restore failed. Check internet and Sheet setup')})}
function info(){$('info').textContent='Version '+APP_CFG.versionName+' | Total records: '+recs.length+' | Pending sync: '+recs.filter(function(r){return!r.synced}).length}

/* ---- reports ---- */
function list(){
var q=$('q').value.toLowerCase().trim(),a=$('f1').value,b=$('f2').value,g={};
recs.forEach(function(r){
if(a&&r.date<a)return;if(b&&r.date>b)return;
if(q&&(r.name.toLowerCase().indexOf(q)<0&&r.mobile.indexOf(q.replace(/\D/g,'')||'#')<0))return;
(g[r.mobile]=g[r.mobile]||[]).push(r)});
var k=Object.keys(g).sort(function(x,y){return last(g[y]).localeCompare(last(g[x]))});
$('vl').innerHTML=k.length?k.map(function(m){var v=g[m],l=v[v.length-1];
return'<div class="v" onclick="detail(\''+m+'\')"><b>'+esc(l.name)+'</b> <small>+'+esc(m)+'</small><br><small>'+v.length+' visit(s) | Last: '+fd(l.date)+' '+ft(l.time)+'</small></div>'}).join(''):'<p>No visitors found.</p>'}
function last(v){return v.reduce(function(x,r){var s=r.date+r.time;return s>x?s:x},'')}
var cur=[];
function detail(m){
var a=$('f1').value,b=$('f2').value;
cur=recs.filter(function(r){return r.mobile==m&&(!a||r.date>=a)&&(!b||r.date<=b)})
.sort(function(x,y){return(x.date+x.time).localeCompare(y.date+y.time)});
if(!cur.length)return;
var l=cur[cur.length-1];
$('vd').innerHTML='<h3 style="margin:0 0 4px">'+esc(l.name)+(l.age!==''&&l.age!=null?' ('+esc(l.age)+' yrs)':'')+'</h3><small>+'+esc(m)+'</small>'+tbl()+
'<h4 style="margin:12px 0 0">Latest advice</h4>'+advH(l)+
'<button class="b small" onclick="sendAll()">WhatsApp Report</button>'+
(isNat()?'<button class="b s small" onclick="shareR()">Share</button>':'<button class="b s small" onclick="printR()">Print / PDF</button>')+
'<button class="b o small" onclick="back()">Back</button>';
$('lc').className='card hide';$('vd').className='card';$('main').scrollTop=0}
function back(){$('vd').className='card hide';$('lc').className='card';list()}
function tbl(){return'<div style="overflow-x:auto"><table><tr><th>Date/Time</th><th>BP</th><th>HR</th><th>Sugar</th><th></th></tr>'+
cur.map(function(r){var a=agev(r);return'<tr><td>'+fd(r.date)+'<br>'+ft(r.time)+'</td><td>'+(r.sys?r.sys+'/'+r.dia+'<br>'+tg(bpA(r.sys,r.dia,a)):'-')+'</td><td>'+(r.hr?r.hr+'<br>'+tg(hrA(r.hr,a)):'-')+
'</td><td>'+(r.sugar?r.sugar+'<br><small>'+esc(r.stype)+'</small><br>'+tg(suA(r.sugar,r.stype)):'-')+'</td><td><button class="b r small" onclick="del(\''+r.id+'\')">X</button></td></tr>'+
(r.note?'<tr><td colspan="5"><small>Note: '+esc(r.note)+'</small></td></tr>':'')}).join('')+'</table></div>'}
function sendAll(){openExt(waLink(cur[0].mobile,msg(cur)))}
function shareR(){var P=plg('Share');if(P)P.share({title:'Vital Record',text:msg(cur)}).catch(function(){})}
function printR(){var l=cur[cur.length-1];
$('pr').innerHTML='<h2 style="text-align:center">Life Pharmacy Vital Record</h2><p><b>Name:</b> '+esc(l.name)+' &nbsp; <b>Age:</b> '+esc(l.age)+' &nbsp; <b>Mobile:</b> +'+esc(l.mobile)+
'</p>'+tbl().replace(/<th><\/th>/,'').replace(/<td><button.*?<\/button><\/td>/g,'')+'<h4>Advice</h4>'+advH(l)+
'<p style="font-size:11px">Printed '+fd(today())+'. Developed by Haseeb Mirza +971507256801. All rights reserved.</p>';
window.print()}
function del(id){if(!confirm('Delete this record from this device? (Google Sheet copy stays)'))return;
var m=cur[0].mobile;recs=recs.filter(function(r){return r.id!=id});store();
recs.some(function(r){return r.mobile==m})?detail(m):back()}
function csv(){var h='ID,Date,Time,Name,Mobile,Age,Sys,Dia,HeartRate,Sugar,SugarType,Note\n';
var c=function(v){return'"'+String(v==null?'':v).replace(/"/g,'""')+'"'};
var t=h+recs.map(function(r){return[r.id,fd(r.date),r.time,r.name,r.mobile,r.age,r.sys,r.dia,r.hr,r.sugar,r.stype,r.note].map(c).join(',')}).join('\n');
var F=plg('Filesystem'),S=plg('Share');
if(isNat()&&F&&S){F.writeFile({path:'vital_records_'+today()+'.csv',data:'\ufeff'+t,directory:'CACHE',encoding:'utf8'}).then(function(r){return S.share({title:'Vital records',files:[r.uri]})}).catch(function(){toast('Export failed')});return}
var a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+t],{type:'text/csv'}));
a.download='vital_records_'+today()+'.csv';document.body.appendChild(a);a.click();a.remove()}

/* ---- view, native helpers, updates ---- */
function setView(d){document.body.className=d?'desk':'';$('vt').textContent=d?'Switch to Mobile view':'Switch to Desktop view';try{localStorage.setItem(V,d?'d':'m')}catch(e){}}
function toggleView(){setView(document.body.className!='desk')}
function isNat(){return!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform())}
function plg(n){return window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins[n]}
function openExt(u){var P=plg('AppLauncher');if(isNat()&&P){P.openUrl({url:u}).catch(function(){})}else window.open(u,'_blank')}
var UPD=null;
function chkUpd(manual){var u=gu();if(!u){if(manual)toast('Sheet link not set');return}
fetch(u+'?action=version&token='+encodeURIComponent(APP_CFG.token)).then(function(x){return x.json()}).then(function(v){
if(v&&+v.versionCode>APP_CFG.versionCode)showUpd(v);else if(manual)toast('App is up to date ('+APP_CFG.versionName+')')})
.catch(function(){if(manual)toast('Could not check for updates')})}
function showUpd(v){UPD=v;var b=$('upd');
b.innerHTML='<b>Update available: v'+esc(v.versionName)+'</b><br>'+esc(v.notes||'')+'<br><button class="b small" onclick="getUpd()">Update Now</button>'+(v.force?'':'<button class="b o small" onclick="$(\'upd\').className=\'hide\'">Later</button>');
b.className=v.force?'ovl':'ubar'}
function getUpd(){if(!UPD||String(UPD.apkUrl).indexOf('https://')!=0)return toast('Update link not set. Contact developer');openExt(UPD.apkUrl)}
(function(){var v=null;try{v=localStorage.getItem(V)}catch(e){}setView(v?v=='d':window.innerWidth>=900)})();
$('d').value=today();$('tm').value=nowT();
window.addEventListener('online',function(){recs.filter(function(r){return!r.synced}).forEach(sync)});
setTimeout(function(){recs.filter(function(r){return!r.synced}).forEach(sync)},3000);
setTimeout(function(){chkUpd(false)},2000);
