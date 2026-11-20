// Life-BP backend (Developer: Haseeb Mirza)
var TOKEN='CHANGE_THIS_SECRET'; // must be the same as "token" in app.config.json
var HEAD=['ID','Date','Time','Name','Mobile','BP Systolic','BP Diastolic','Heartbeat','Sugar','Sugar Type','Note','Age'];
var KEYS=['id','date','time','name','mobile','sys','dia','hr','sugar','stype','note','age'];
function sh_(){
  var ss=SpreadsheetApp.getActiveSpreadsheet(), s=ss.getSheetByName('Records');
  if(!s){s=ss.insertSheet('Records');s.appendRow(HEAD);s.setFrozenRows(1);
    s.getRange(1,1,1,HEAD.length).setFontWeight('bold').setBackground('#1a5fd0').setFontColor('#ffffff');
    s.getRange(2,1,5000,HEAD.length).setNumberFormat('@');}
  if(s.getRange(1,HEAD.length).getValue()!=='Age') s.getRange(1,HEAD.length).setValue('Age').setFontWeight('bold').setBackground('#1a5fd0').setFontColor('#ffffff');
  return s;
}
function ok_(t){return String(t)===TOKEN;}
function doPost(e){
  var lock=LockService.getScriptLock();lock.waitLock(20000);
  try{
    var d=JSON.parse(e.postData.contents);
    if(!ok_(d.token)) return out_({ok:0,error:'auth'});
    var s=sh_(), n=s.getLastRow();
    if(n>1){var ids=s.getRange(2,1,n-1,1).getValues();
      for(var i=0;i<ids.length;i++) if(String(ids[i][0])==String(d.id)) return out_({ok:1,dup:1});}
    var row=KEYS.map(function(k){var v=d[k];if(k=='date'){var a=String(v).split('-');v=a.length==3?a[2]+'/'+a[1]+'/'+a[0]:v;}return v==null?'':String(v);});
    s.getRange(n+1,1,1,row.length).setNumberFormat('@').setValues([row]);
    return out_({ok:1});
  }catch(err){return out_({ok:0,error:String(err)});}
  finally{lock.releaseLock();}
}
function doGet(e){
  var p=(e&&e.parameter)||{};
  if(!ok_(p.token)) return out_({ok:0,error:'auth'});
  if(p.action=='version') return out_(ver_());
  var s=sh_(), n=s.getLastRow(), res=[];
  if(n>1){s.getRange(2,1,n-1,KEYS.length).getValues().forEach(function(r){
    var o={};KEYS.forEach(function(k,i){o[k]=r[i];});
    var a=String(o.date).split('/');if(a.length==3)o.date=a[2]+'-'+a[1]+'-'+a[0];
    ['sys','dia','hr','sugar'].forEach(function(k){o[k]=o[k]===''?'':Number(o[k]);});
    res.push(o);});}
  return out_(res);
}
// Tab "Update": change these cells to announce a new APK to all installed apps
function ver_(){
  var ss=SpreadsheetApp.getActiveSpreadsheet(), s=ss.getSheetByName('Update');
  if(!s){s=ss.insertSheet('Update');
    s.getRange('A1:C5').setValues([['versionCode',1,'Whole number. Raise it to announce an update'],['versionName','1.0.0','Shown to the user'],['apkUrl','','Direct download link (https) of the new APK'],['notes','','What is new'],['force','FALSE','TRUE = user must update to continue']]);}
  var v=s.getRange('B1:B5').getValues();
  return {versionCode:Number(v[0][0])||0,versionName:String(v[1][0]),apkUrl:String(v[2][0]),notes:String(v[3][0]),force:String(v[4][0]).toUpperCase()=='TRUE'};
}
function out_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
