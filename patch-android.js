// Applies version, icons, splash and security settings to the generated Android project
const fs=require('fs'),path=require('path');
const cfg=JSON.parse(fs.readFileSync('app.config.json','utf8'));
const A='android/app', R=A+'/src/main/res';
let g=fs.readFileSync(A+'/build.gradle','utf8');
g=g.replace(/versionCode\s+\d+/,'versionCode '+cfg.versionCode).replace(/versionName\s+"[^"]*"/,'versionName "'+cfg.versionName+'"');
fs.writeFileSync(A+'/build.gradle',g);
const mp=A+'/src/main/AndroidManifest.xml';
let m=fs.readFileSync(mp,'utf8');
m=m.replace('android:allowBackup="true"','android:allowBackup="false"');
fs.writeFileSync(mp,m);
function cp(s,d){fs.mkdirSync(d,{recursive:true});for(const f of fs.readdirSync(s)){const a=path.join(s,f),b=path.join(d,f);fs.statSync(a).isDirectory()?cp(a,b):fs.copyFileSync(a,b)}}
cp('android-res',R);
(function w(d){for(const f of fs.readdirSync(d)){const p=path.join(d,f);if(fs.statSync(p).isDirectory())w(p);else if(f==='splash.png')fs.unlinkSync(p)}})(R);
fs.mkdirSync(R+'/drawable',{recursive:true});
fs.writeFileSync(R+'/drawable/splash.xml','<?xml version="1.0" encoding="utf-8"?>\n<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle"><solid android:color="#1a5fd0"/></shape>\n');
console.log('android patched');
