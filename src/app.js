if(typeof APP_CFG==='undefined')var APP_CFG={sheetUrl:'',token:'',versionCode:0,versionName:'web'};

var K='lpvr_records',U='lpvr_url',CC='971';
var recs=load();
function load(){try{return JSON.parse(localStorage.getItem(K)||'[]')}catch(e){return[]}}
function store(){try{localStorage.setItem(K,JSON.stringify(recs))}catch(e){toast('Storage full or blocked')}}
function $(i){return document.getElementById(i)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function toast(m){var t=$('toast');t.textContent=m;t.className='on';setTimeout(function(){t.className=''},2500)}
function p2(n){return(n<10?'0':'')+n}
function today(){var n=new Date();return n.getFullYear()+'-'+p2(n.getMonth()+1)+'-'+p2(n.getDate())}
function nowT(){var n=new Date();return p2(n.getHours())+':'+p2(n.getMinutes())}
function fd(s){var a=String(s).split('-');return a.length==3?a[2]+'/'+a[1]+'/'+a[0]:s}
function ft(s){var a=String(s).split(':'),h=+a[0],m=a[1]||'00';return(h%12||12)+':'+m+' '+(h>=12?'PM':'AM')}
function tab(n){for(var i=1;i<=3;i++){$('p'+i).className=i==n?'':'hide';$('t'+i).className=i==n?'on':''}
if(n==2){$('vd').className='card hide';list()}if(n==3)info()}
function phone(m){var d=String(m).replace(/\D/g,'');if(d.indexOf('00')==0)d=d.slice(2);
if(d.indexOf(CC)==0)return d;if(d.charAt(0)=='0')d=d.slice(1);return CC+d}
function bpS(s,d){if(!s||!d)return'';return(s>=140||d>=90)?'High':(s<90||d<60)?'Low':(s>=130||d>=85)?'Elevated':'Normal'}
function hrS(h){if(!h)return'';return h<60?'Low':h>100?'High':'Normal'}
function suS(v,t){if(!v)return'';if(v<70)return'Low';if(t=='Fasting')return v<100?'Normal':v<126?'Elevated':'High';
return v<140?'Normal':v<200?'Elevated':'High'}
function tg(s){return s?' <span class="tag '+s+'">'+s+'</span>':''}
function newId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}

function save(){
var r={id:newId(),date:$('d').value||today(),time:$('tm').value||nowT(),name:$('nm').value.trim(),
mobile:phone($('mb').value),sys:+$('sy').value||'',dia:+$('di').value||'',hr:+$('hr').value||'',
sugar:+$('su').value||'',stype:$('st').value,note:$('nt').value.trim(),synced:0};
if(!r.name)return toast('Enter visitor name');
if(r.mobile.length<11)return toast('Enter valid mobile number');
if(!(r.sys&&r.dia)&&!r.hr&&!r.sugar)return toast('Enter at least one reading');
if((r.sys&&!r.dia)||(!r.sys&&r.dia))return toast('Enter both BP values');
recs.push(r);store();
var w=$('wa').checked;
$('nm').value=$('mb').value=$('sy').value=$('di').value=$('hr').value=$('su').value=$('nt').value='';
$('d').value=today();$('tm').value=nowT();
toast('Record saved');
sync(r);
if(w)openExt(waLink(r.mobile,msg([r])));
}
function line(r){var o=fd(r.date)+' '+ft(r.time);
if(r.sys)o+='\nBP: '+r.sys+'/'+r.dia+' mmHg ('+bpS(r.sys,r.dia)+')';
if(r.hr)o+='\nHeartbeat: '+r.hr+' bpm ('+hrS(r.hr)+')';
if(r.sugar)o+='\nSugar: '+r.sugar+' mg/dL, '+r.stype+' ('+suS(r.sugar,r.stype)+')';
if(r.note)o+='\nNote: '+r.note;return o}
function msg(a){var o='*Life Pharmacy - Vital Record*\nName: '+a[0].name+'\n\n';
o+=a.map(line).join('\n\n');
return o+'\n\n_Screening reading only, not a diagnosis. Please consult your doctor._'}
function waLink(m,t){return'https://wa.me/'+m+'?text='+encodeURIComponent(t)}

function sync(r){var u=gu();if(!u||!navigator.onLine)return Promise.resolve(false);
return fetch(u,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(Object.assign({token:APP_CFG.token},r))})
.then(function(x){return x.json()}).then(function(q){if(q&&q.ok){r.synced=1;store();return true}return false}).catch(function(){return false})}
function syncAll(){if(!gu())return toast('Save Sheet URL first');
var p=recs.filter(function(r){return!r.synced});if(!p.length)return toast('Nothing pending');
Promise.all(p.map(sync)).then(function(a){info();toast(a.filter(Boolean).length+' of '+a.length+' synced')})}
function restore(){var u=gu();if(!u)return toast('Save Sheet URL first');
toast('Restoring...');fetch(u+'?token='+encodeURIComponent(APP_CFG.token)).then(function(x){return x.json()}).then(function(a){if(!Array.isArray(a))throw 0;
var ids={};recs.forEach(function(r){ids[r.id]=1});var n=0;
a.forEach(function(r){if(r.id&&!ids[r.id]){r.synced=1;recs.push(r);n++}});store();info();toast(n+' records restored')})
.catch(function(){toast('Restore failed. Check URL and deployment access')})}
function saveUrl(){var v=$('url').value.trim();
if(v&&v.indexOf('https://script.google.com/')!=0)return toast('URL must start with https://script.google.com/');
localStorage.setItem(U,v);toast('Saved');info()}
function info(){$('url').value=gu()||'';
$('info').textContent='Version '+APP_CFG.versionName+' | Total records: '+recs.length+' | Pending sync: '+recs.filter(function(r){return!r.synced}).length}

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
var h=tbl();
$('vd').innerHTML='<h3 style="margin:0 0 8px">'+esc(cur[0].name)+' (+'+esc(m)+')</h3>'+h+
'<button class="b g small" onclick="sendAll()">WhatsApp Report</button>'+
(isNat()?'<button class="b s small" onclick="shareR()">Share</button>':'<button class="b s small" onclick="printR()">Print / PDF</button>')+
'<button class="b o small" onclick="$(\'vd\').className=\'card hide\';$(\'vl\').parentNode.className=\'card\'">Back</button>';
$('vl').parentNode.className='card hide';$('vd').className='card'}
function tbl(){return'<div style="overflow-x:auto"><table><tr><th>Date/Time</th><th>BP</th><th>HR</th><th>Sugar</th><th></th></tr>'+
cur.map(function(r){return'<tr><td>'+fd(r.date)+'<br>'+ft(r.time)+'</td><td>'+(r.sys?r.sys+'/'+r.dia+tg(bpS(r.sys,r.dia)):'-')+'</td><td>'+(r.hr?r.hr+tg(hrS(r.hr)):'-')+
'</td><td>'+(r.sugar?r.sugar+'<br><small>'+esc(r.stype)+'</small>'+tg(suS(r.sugar,r.stype)):'-')+'</td><td><button class="b r small" onclick="del(\''+r.id+'\')">X</button></td></tr>'+
(r.note?'<tr><td colspan="5"><small>Note: '+esc(r.note)+'</small></td></tr>':'')}).join('')+'</table></div>'}
function sendAll(){openExt(waLink(cur[0].mobile,msg(cur)))}
function printR(){
$('pr').innerHTML='<h2 style="text-align:center">Life Pharmacy Vital Record</h2><p><b>Name:</b> '+esc(cur[0].name)+' &nbsp; <b>Mobile:</b> +'+esc(cur[0].mobile)+
'</p>'+tbl().replace(/<th><\/th>/,'').replace(/<td><button.*?<\/button><\/td>/g,'')+
'<p style="font-size:11px">Screening readings only, not a diagnosis. Printed '+fd(today())+'. Developed by Haseeb Mirza +971507256801. All rights reserved.</p>';
window.print()}
function del(id){if(!confirm('Delete this record from this device? (Google Sheet copy stays)'))return;
var m=cur[0].mobile;recs=recs.filter(function(r){return r.id!=id});store();
recs.some(function(r){return r.mobile==m})?detail(m):($('vd').className='card hide',$('vl').parentNode.className='card',list())}
function csv(){var h='ID,Date,Time,Name,Mobile,Sys,Dia,HeartRate,Sugar,SugarType,Note\n';
var c=function(v){return'"'+String(v==null?'':v).replace(/"/g,'""')+'"'};
var t=h+recs.map(function(r){return[r.id,fd(r.date),r.time,r.name,r.mobile,r.sys,r.dia,r.hr,r.sugar,r.stype,r.note].map(c).join(',')}).join('\n');
var F=plg('Filesystem'),S=plg('Share');
if(isNat()&&F&&S){F.writeFile({path:'vital_records_'+today()+'.csv',data:'\ufeff'+t,directory:'CACHE',encoding:'utf8'}).then(function(r){return S.share({title:'Vital records',files:[r.uri]})}).catch(function(){toast('Export failed')});return}
var a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+t],{type:'text/csv'}));
a.download='vital_records_'+today()+'.csv';document.body.appendChild(a);a.click();a.remove()}

var V='lpvr_view';
function setView(d){document.body.className=d?'desk':'';$('vt').textContent=d?'Switch to Mobile view':'Switch to Desktop view';try{localStorage.setItem(V,d?'d':'m')}catch(e){}}
function toggleView(){setView(document.body.className!='desk')}
(function(){var v=null;try{v=localStorage.getItem(V)}catch(e){}setView(v?v=='d':window.innerWidth>=900)})();
$('d').value=today();$('tm').value=nowT();
window.addEventListener('online',function(){recs.filter(function(r){return!r.synced}).forEach(sync)});

function gu(){return localStorage.getItem(U)||APP_CFG.sheetUrl||''}
function isNat(){return!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform())}
function plg(n){return window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins[n]}
function openExt(u){var P=plg('AppLauncher');if(isNat()&&P){P.openUrl({url:u}).catch(function(){})}else window.open(u,'_blank')}
function shareR(){var P=plg('Share');if(P)P.share({title:'Vital Record',text:msg(cur)}).catch(function(){})}
var UPD=null;
function chkUpd(manual){var u=gu();if(!u){if(manual)toast('Sheet URL not set');return}
fetch(u+'?action=version&token='+encodeURIComponent(APP_CFG.token)).then(function(x){return x.json()}).then(function(v){
if(v&&+v.versionCode>APP_CFG.versionCode)showUpd(v);else if(manual)toast('App is up to date ('+APP_CFG.versionName+')')})
.catch(function(){if(manual)toast('Could not check for updates')})}
function showUpd(v){UPD=v;var b=$('upd');
b.innerHTML='<b>Update available: v'+esc(v.versionName)+'</b><br>'+esc(v.notes||'')+'<br><button class="b small" onclick="getUpd()">Update Now</button>'+(v.force?'':'<button class="b o small" onclick="$(\'upd\').className=\'hide\'">Later</button>');
b.className=v.force?'ovl':'ubar'}
function getUpd(){if(!UPD||String(UPD.apkUrl).indexOf('https://')!=0)return toast('Update link not set. Contact developer');openExt(UPD.apkUrl)}
if(APP_CFG.sheetUrl)$('urlbox').className='hide';
setTimeout(function(){recs.filter(function(r){return!r.synced}).forEach(sync)},3000);
setTimeout(function(){chkUpd(false)},2000);
