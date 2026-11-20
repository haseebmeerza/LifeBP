// Copies the web app to www/ and protects (obfuscates) the code. Config is injected here.
const fs=require('fs');
const cfg=JSON.parse(fs.readFileSync('app.config.json','utf8'));
if(!cfg.sheetUrl||cfg.sheetUrl.indexOf('https://script.google.com/')!==0) throw new Error('app.config.json: set sheetUrl to your Apps Script Web app URL');
if(!cfg.token||cfg.token==='CHANGE_THIS_SECRET') throw new Error('app.config.json: change token to your own secret');
fs.rmSync('www',{recursive:true,force:true});fs.mkdirSync('www');
fs.copyFileSync('src/index.html','www/index.html');
fs.copyFileSync('src/logo.png','www/logo.png');
const pre='var APP_CFG='+JSON.stringify({sheetUrl:cfg.sheetUrl,token:cfg.token,versionCode:cfg.versionCode,versionName:cfg.versionName})+';\n';
const O=require('javascript-obfuscator');
const out=O.obfuscate(pre+fs.readFileSync('src/app.js','utf8'),{
  compact:true,controlFlowFlattening:true,controlFlowFlatteningThreshold:0.6,
  stringArray:true,stringArrayEncoding:['base64'],stringArrayThreshold:0.8,
  identifierNamesGenerator:'hexadecimal',renameGlobals:false,disableConsoleOutput:true,
  splitStrings:true,splitStringsChunkLength:6,sourceMap:false}).getObfuscatedCode();
fs.writeFileSync('www/app.js',out);
console.log('web build ok, version',cfg.versionName,'('+cfg.versionCode+')');
