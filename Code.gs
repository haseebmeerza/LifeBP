// Life Pharmacy Vital Record - Google Sheet backend (Developer: Haseeb Mirza)
var HEAD=['ID','Date','Time','Name','Mobile','BP Systolic','BP Diastolic','Heartbeat','Sugar','Sugar Type','Note'];
var KEYS=['id','date','time','name','mobile','sys','dia','hr','sugar','stype','note'];
function sh_(){
  var ss=SpreadsheetApp.getActiveSpreadsheet(), s=ss.getSheetByName('Records');
  if(!s){s=ss.insertSheet('Records');s.appendRow(HEAD);s.setFrozenRows(1);
    s.getRange(1,1,1,HEAD.length).setFontWeight('bold').setBackground('#0b7a4b').setFontColor('#ffffff');
    s.getRange(2,1,1000,HEAD.length).setNumberFormat('@');}
  return s;
}
function doPost(e){
  var lock=LockService.getScriptLock();lock.waitLock(20000);
  try{
    var d=JSON.parse(e.postData.contents), s=sh_(), n=s.getLastRow();
    if(n>1){var ids=s.getRange(2,1,n-1,1).getValues();
      for(var i=0;i<ids.length;i++) if(String(ids[i][0])==String(d.id)) return out_({ok:1,dup:1});}
    var row=KEYS.map(function(k){var v=d[k];if(k=='date'){var a=String(v).split('-');v=a.length==3?a[2]+'/'+a[1]+'/'+a[0]:v;}return v==null?'':String(v);});
    s.getRange(n+1,1,1,row.length).setNumberFormat('@').setValues([row]);
    return out_({ok:1});
  }catch(err){return out_({ok:0,error:String(err)});}
  finally{lock.releaseLock();}
}
function doGet(){
  var s=sh_(), n=s.getLastRow(), res=[];
  if(n>1){s.getRange(2,1,n-1,KEYS.length).getValues().forEach(function(r){
    var o={};KEYS.forEach(function(k,i){o[k]=r[i];});
    var a=String(o.date).split('/');if(a.length==3)o.date=a[2]+'-'+a[1]+'-'+a[0];
    ['sys','dia','hr','sugar'].forEach(function(k){o[k]=o[k]===''?'':Number(o[k]);});
    res.push(o);});}
  return out_(res);
}
function out_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
