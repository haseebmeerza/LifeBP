LIFE-BP  |  Life Pharmacy Vital Record (Walkin)
Developer: Haseeb Mirza +971507256801   All rights reserved.

FILES IN THIS FOLDER
  index.html     the whole app (mobile first, Desktop view button at top)
  manifest.json  app name "Life-BP" and icons (for install / APK)
  sw.js          offline support
  icon-192.png, icon-512.png   app icons (Life / BP, blue)
  logo.png       your logo shown in the footer
  Code.gs        Google Sheet backend (paste into Apps Script, NOT for GitHub)
  README.txt     these instructions

STEP 1 - GOOGLE SHEET (stores every record online)
  1. Open sheets.google.com and create a blank sheet. Name it "Life Pharmacy Vital Record".
  2. Menu: Extensions > Apps Script. Delete everything in the editor.
  3. Open Code.gs from this folder, copy all, paste into the editor, click Save.
  4. Click Deploy > New deployment. Gear icon > choose "Web app".
  5. Execute as: Me.  Who has access: Anyone.  Click Deploy.
  6. Click Authorize access, choose your Google account, Advanced > Go to project > Allow.
  7. Copy the "Web app URL" (it ends with /exec). Keep it private.
  The "Records" tab with headers is created automatically when the first record is saved.
  If you ever edit Code.gs: Deploy > Manage deployments > pencil icon > Version: New version > Deploy.

STEP 2 - GITHUB (hosting)
  1. Sign in at github.com, click New repository, name it e.g. life-bp, set Public, Create.
  2. Click "uploading an existing file". Upload ONLY these 6 files:
     index.html, manifest.json, sw.js, icon-192.png, icon-512.png, logo.png
     Do not upload Code.gs or README.txt. Click Commit changes.
  3. Settings > Pages > Source: "Deploy from a branch" > Branch: main, folder /(root) > Save.
  4. Wait 1-2 minutes. Your app link will be https://YOURNAME.github.io/life-bp/

STEP 3 - CONNECT THE APP TO THE SHEET
  1. Open the link on the phone. Tap Settings.
  2. Paste the Web app URL from Step 1 and tap Save URL.
  3. Add a test record. Check the "Records" tab in the Google Sheet. The row should appear.
  4. Delete the test row in the sheet afterwards.

STEP 4 - INSTALL ON MOBILE
  Option A (no APK): open the link in Chrome, menu (3 dots) > Add to Home screen / Install app.
  Option B (APK file):
    1. Go to pwabuilder.com, paste your GitHub Pages link, click Start.
    2. Click Package for stores > Android > Generate / Download.
    3. Unzip the download and copy the .apk to the phones. Open it and install.
       (Allow "Install unknown apps" if the phone asks.)
  If an old version is installed, uninstall it first.

DAILY USE
  New Record: enter name, mobile, readings > Save. WhatsApp opens with the report ready; tap Send.
  Reports: search or filter by date, tap a visitor to see all readings, WhatsApp, Print/PDF, delete.
  Settings: Sync Pending (after offline use), Restore from Google Sheet, Download CSV.
  Desktop view: tap "Switch to Desktop view" at the top for a wider layout on a PC. The choice is remembered.

IMPORTANT NOTES
  - WhatsApp cannot send silently from an app: it opens the message and you press Send once.
  - Records are saved on the phone first. If there is no internet they sync later with Sync Pending.
  - Each phone keeps its own records; the Google Sheet holds all of them together.
  - Readings are screening only, not a diagnosis. Keep the Sheet URL and app link for staff only.
