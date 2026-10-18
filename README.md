# بيثيل اسمارت

CRM لمناديب شركات الأدوية: زيارات بالموقع (GPS)، فواتير وتحصيل ومرتجع، مخزن وتحويلات، تارجت، مهام، أجازات وخصومات، وتقارير Excel.

- `www/` واجهة البرنامج (index.html + ui.js)
- `src/main.js` الربط مع Firebase والـ GPS وحفظ الملفات
- `firestore.rules` قواعد حماية قاعدة البيانات (بتتحط في Firebase Console ← Firestore ← Rules)
- كل push على `main` بيبني APK جديد ويحطه في Releases باسم `latest`
