# जे. के. मोटर्स (JK Motors) - Setup & Deployment Guide 🚗💨

या प्रोजेक्टमध्ये **JK Motors** (जे. के. मोटर्स, नाशिक) ची संपूर्ण मोबाईल-फर्स्ट कार शोरूम वेबसाईट तयार करण्यात आली आहे.

---

## 🌟 वैशिष्ट्ये (Key Features Implemented)
1. **डिझाईन आणि रंगसंगती:**
   - **गहरा निळा (#0B2447):** हेडर आणि हिरो सेक्शन.
   - **पिवळा (#FFC727):** बटन्स, हायलाइट्स आणि गाडीच्या फोटोवरील डाव्या बाजूने कट केलेला प्राईस-टॅग (`price-tag-cut`).
   - **हिरवा (#25D366):** WhatsApp थेट चॅट आणि बुकिंग बटन्स.
   - **रोड-स्ट्राइप (Yellow Road Stripe):** हिरो सेक्शनच्या खाली अॅनिमेटेड हायवे डॅश लेन.
   - **डार्क मोड (Dark Mode):** लाईट आणि डार्क मोड एका क्लिकवर.
   - **फॉन्ट्स:** हेडिंगसाठी `Bricolage Grotesque`, मजकुरासाठी `DM Sans`.

2. **गाडी कार्ड (Car Cards):**
   - मोठा आकर्षक फोटो आणि फोटो काऊंटर.
   - पिवळा कट प्राईस-टॅग.
   - विकली गेलेल्या गाड्यांसाठी **SOLD OUT** ओव्हरले.
   - वर्ष, किलोमीटर, इंधन (Diesel/Petrol/CNG), आणि मालक (1st/2nd Owner) चे चिप्स.
   - **"Details"** (खालून उघडणारी शीट) आणि **"Book करा"** (WhatsApp बुकिंग).

3. **खालून उघडणारी शीट (Bottom Sheet Details):**
   - स्वाइप करता येणारी फोटो गॅलरी.
   - **व्हिडिओ वॉकथ्रू:** शोरूमचे प्रोप्रा. नरेश जोशी यांच्या इनोव्हा आणि स्कॉर्पिओच्या प्रत्यक्ष व्हिडिओचे इनलाइन प्लेयर.
   - **Instagram Reel:** `@jk_motors_nashik` चा रील पाहण्यासाठी थेट बटण.
   - गाडीचे संपूर्ण तपशील आणि सुलभ हप्ते (EMI) कॅल्क्युलेटर.
   - खाली स्टिकी (चिटकून राहणारे) **"WhatsApp वर बुकिंग पाठवा"** बटण.

4. **WhatsApp बुकिंग सिस्टीम:**
   - ग्राहकाचे नाव आणि भेटीची वेळ (Visit Time Slot) विचारून थेट `wa.me/917020114633` वर फॉरमॅट केलेला संदेश आणि गाडीची वेबसाईट लिंक पाठवते.

5. **अॅडमिन पॅनेल (Admin Panel - Login सुरक्षित):**
   - डिफॉल्ट पासवर्ड: `jkadmin` (किंवा `7020`)
   - नवीन गाड्या जोडणे (अनेक फोटो, व्हिडिओ, रील लिंक, किंमत, फीचर्स).
   - गाड्या एडिट करणे, डिलीट करणे, किंवा एका क्लिकवर **SOLD** मार्क करणे.
   - शोरूमचे नाव, टॅगलाईन, WhatsApp नंबर, पत्ता आणि कामाची वेळ बदलणे.

---

## 🔥 1. Firebase Setup Steps (फायरबेस सेटअप पायऱ्या)

ही ॲप **ऑफलाईन आणि ऑनलाईन दोन्ही मोडमध्ये काम करते**. सध्या ती लोकल स्टोरेजमध्ये चालत असून खालील पायऱ्या करून तुम्ही तुमचा खरा Firestore डेटाबेस जोडू शकता:

### पायरी 1: Firebase Project तयार करा
1. [firebase.google.com](https://firebase.google.com) वर जाऊन तुमच्या गुगल खात्याने लॉगिन करा.
2. **"Go to console"** वर क्लिक करा आणि **"Create a project"** निवडा.
3. प्रोजेक्टला नाव द्या (उदा. `jk-motors-nashik`) आणि **Continue** करा.

### पायरी 2: Firestore Database सुरू करा
1. डाव्या मेनूमधून **Build > Firestore Database** वर क्लिक करा.
2. **"Create database"** बटनावर क्लिक करा.
3. लोकेशन निवडा (उदा. `asia-south1` मुंबई) आणि **"Start in test mode"** निवडा.
4. **Rules** टॅबमध्ये खालील नियम पेस्ट करून **Publish** करा:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cars/{carId} {
      allow read: if true;
      allow write: if true; // प्रोडक्शनमध्ये योग्य ऑथ चेक ठेवा
    }
    match /settings/{settingId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

### पायरी 3: Firebase Configuration मिळवा
1. डाव्या बाजूला **Project settings (गिअर आयकॉन)** वर जा.
2. **"Your apps"** खाली **Web icon (`</>`)** वर क्लिक करा.
3. ॲपचे नाव द्या (`jk-motors-web`) आणि **Register app** करा.
4. तुम्हाला खालीलप्रमाणे कोड दिसेल:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "jk-motors-nashik.firebaseapp.com",
     projectId: "jk-motors-nashik",
     storageBucket: "jk-motors-nashik.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:12345:web:abcdef"
   };
   ```
5. हे मूल्ये तुमच्या ॲपच्या **Admin Panel > Firebase & Deploy** टॅबमध्ये पेस्ट करा किंवा `.env` फाईलमध्ये टाका:
   ```env
   VITE_FIREBASE_API_KEY="AIzaSy..."
   VITE_FIREBASE_PROJECT_ID="jk-motors-nashik"
   VITE_FIREBASE_AUTH_DOMAIN="jk-motors-nashik.firebaseapp.com"
   VITE_FIREBASE_STORAGE_BUCKET="jk-motors-nashik.appspot.com"
   ```

---

## 🚀 2. Vercel वर Deploy करण्याच्या पायऱ्या (सर्वात सोपे)

1. आपला कोड GitHub वर पुश करा:
   ```bash
   git add .
   git commit -m "JK Motors Showroom App Complete"
   git push origin main
   ```
2. [vercel.com](https://vercel.com) वर जाऊन लॉगिन करा.
3. **"Add New Project"** वर क्लिक करा आणि GitHub रिपॉझिटरी निवडा.
4. बिल्ड सेटिंग्ज तपासा:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **"Deploy"** वर क्लिक करा. 1 ते 2 मिनिटांत तुमची वेबसाईट जगभरात लाईव्ह होईल!

---

## 🌐 3. Netlify वर Deploy करण्याच्या पायऱ्या

1. [netlify.com](https://netlify.com) वर लॉगिन करा.
2. **"Add new site > Import an existing project"** वर क्लिक करा.
3. **GitHub** निवडून रिपॉझिटरी सिलेक्ट करा.
4. सेटिंग्ज:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. **"Deploy site"** बटनावर क्लिक करा.
6. तुम्ही **Domain management** मध्ये जाऊन तुमचे स्वतःचे कस्टम डोमेन (उदा. `jkmotorsnashik.com`) सहज जोडू शकता.

---

## 📱 संपर्क व सोशल लिंक्स
- **प्रोप्रा.:** नरेश जोशी (Naresh Joshi)
- **WhatsApp:** +91 7020114633
- **कॉल:** +91 9271807774
- **Instagram:** [https://www.instagram.com/jk_motors_nashik?vrfl=MXVsMjQ3bzgxbzN0Nw==](https://www.instagram.com/jk_motors_nashik?vrfl=MXVsMjQ3bzgxbzN0Nw==)
- **शोरूम पत्ता:** जवळ आयकॉन / त्रिवेणी सिरॅमिक्स, अंबड लिंक रोड, नाशिक, महाराष्ट्र.
