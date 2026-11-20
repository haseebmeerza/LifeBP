LIFE-BP  |  Life Pharmacy Vital Record (Walkin)  -  ANDROID APK PROJECT
Developer: Haseeb Mirza +971507256801   All rights reserved.

This is a real Android app (Capacitor). The app code is inside the APK, protected (obfuscated).
The APK is built automatically by GitHub in the cloud: nothing to install on your PC.
You hand over ONLY the signed APK to the client.

VERSION 1.1.0 - WHAT IS NEW
  Age field with age-wise BP / heartbeat / sugar status and advice (AHA/ACC 2025, AAP 2017, ADA 2026,
  Cleveland Clinic), Health Guide tab with sources, blue theme with 3D buttons, frozen header and footer,
  Sheet link field removed from Settings. A new "Age" column is added to the Records tab.
  IF YOU ALREADY DID STEP 1: open Apps Script, paste the NEW google-sheet/Code.gs again (keep your secret
  word on line 2), then Deploy > Manage deployments > pencil > New version > Deploy (same URL).

WHAT IS IN THIS FOLDER
  src/                 the app (index.html, app.js, logo.png)
  android-res/         app icon (Life / BP, blue)
  app.config.json      YOUR settings: sheet link, secret token, app version
  google-sheet/Code.gs backend for Google Sheet (paste into Apps Script; keep private)
  .github/workflows/   the two build robots (build-apk.yml, create-keystore.yml)
  build.js, patch-android.js, package.json, capacitor.config.json   build files (do not edit)

STEP 1 - GOOGLE SHEET
  1. Create a blank Google Sheet "Life Pharmacy Vital Record". Extensions > Apps Script.
  2. Delete everything, paste all of google-sheet/Code.gs.
  3. In line 2 change CHANGE_THIS_SECRET to your own secret word (letters/numbers, no spaces). Remember it.
  4. Save. Deploy > New deployment > gear > Web app. Execute as: Me. Who has access: Anyone. Deploy.
  5. Authorize (Advanced > Go to project > Allow). Copy the Web app URL (ends with /exec).

STEP 2 - GITHUB (use a PRIVATE repository so nobody can see your code)
  1. github.com > New repository > name life-bp-app > select PRIVATE > Create.
  2. Upload every file and folder from this project (drag & drop all, including the hidden
     folder .github). If .github does not upload: Add file > Create new file, type
     .github/workflows/build-apk.yml and paste that file's text; repeat for create-keystore.yml.
  3. Open app.config.json in GitHub (pencil icon). Set "sheetUrl" to the URL from Step 1 and "token"
     to the same secret word as in Code.gs. Commit.

STEP 3 - SIGNING KEY (one time only)
  1. Repo > Actions > "Create Keystore (run once)" > Run workflow. Wait until green.
  2. Open that run > Artifacts > download "keystore" (zip). SAVE IT SAFELY (Drive + USB). If this
     key is lost, installed apps can never be updated.
  3. Repo > Settings > Secrets and variables > Actions > New repository secret:
       KEYSTORE_B64      = the whole text inside keystore_b64.txt
       KEYSTORE_PASSWORD = the text inside keystore_password.txt
  4. Delete the artifact from the run after saving it.

STEP 4 - BUILD THE APK
  Repo > Actions > "Build APK" > Run workflow. After about 5-10 minutes open the run > Artifacts >
  download "Life-BP-APK". Unzip: Life-BP-v1.0.0.apk is the file for the client.
  Install: copy to phone, open it, allow "Install unknown apps" for that file manager/browser.

STEP 5 - SEND AN UPDATE LATER (shows inside the app)
  1. In app.config.json raise versionCode (1 > 2) and change versionName (1.0.1). Commit.
  2. Run "Build APK" again and download the new APK.
  3. Upload the APK to Google Drive > Share > Anyone with the link. Take the file id from the link
     (…/d/FILEID/view) and make the direct link:  https://drive.google.com/uc?export=download&id=FILEID
  4. Open your Google Sheet, tab "Update" (it appears after the app has opened once with internet):
       B1 versionCode = 2   B2 versionName = 1.0.1   B3 apkUrl = the direct link
       B4 notes = what is new   B5 force = FALSE (or TRUE to make the update compulsory)
  5. Every installed app shows an "Update available" bar at next start, with Update Now.
     Tapping it downloads the APK; the user taps it to install over the old one. Records are kept.
  Always raise versionCode, and always build with the same signing key.

DAILY USE
  New Record > Save. WhatsApp opens with the report ready; press Send once (WhatsApp does not allow
  silent sending). Reports: search/filter, tap a visitor for readings, WhatsApp, Share, delete.
  Settings: Sync Pending, Restore from Google Sheet, Download CSV (share), Check for Updates.
  Top link switches Mobile / Desktop layout.

CODE PROTECTION (honest summary)
  Done: private repo, code obfuscated, debugging and backup disabled, APK signed, sheet access needs
  your secret token, remote force-update. No APK can be made 100% copy-proof, but this stops casual
  copying and re-publishing. The footer and licence text show ownership.

IF THE BUILD FAILS
  Actions > the red run > open the red step > copy the last red error lines and send them to Claude.
