# 🤍 بوت تليجرام العربي الشامل (Stateless Vercel Serverless)

بوت تليجرام عربي متكامل وسريع مبني باستخدام **Next.js (App Router)** و **TypeScript** و **Telegram Bot API (Webhook فقط)** ليعمل مباشرة على **Vercel Serverless Functions** بدون أي قاعدة بيانات أو تخزين دائم أو مؤقت لبيانات المستخدمين.

---

## ✨ المميزات والأقسام الرئيسية

- **واجهة ReplyKeyboardMarkup احترافية:** لوحة مفاتيح أسفل المحادثة (`resize_keyboard` و `is_persistent`) مع قوائم فرعية وأزرار `🔙 رجوع` و `🏠 الرئيسية` و `🙈 إخفاء لوحة المفاتيح`.
- **✨ الزخرفة الاحترافية:**
  - زخرفة عربية (أكثر من 35 شكلاً مقروءاً يحافظ على ترابط الحروف العربية).
  - زخرفة إنجليزية (أكثر من 35 خطاً وشكلاً Unicode).
  - زخرفة الأرقام (18 شكلاً متنوعاً).
  - زخرفة الجمل والعبارات (25 تنسيقاً وإطاراً).
  - مكتبة الرموز والفواصل الجاهزة.
- **🤍 البايوهات والنبذات:** مكتبة ثابتة تشمل بايوهات إنستجرام، نبذات تليجرام، حب، حزن، كبرياء، غموض، إنجليزية، عربية، عبارات قصيرة، وحالات متنوعة.
- **🎂 العمر والأبراج:** حساب دقيق للعمر (سنوات، أشهر، أيام، إجمالي الأيام والساعات)، الأيام المتبقية لعيد الميلاد، ومعرفة البرج ومعلوماته الترفيهية محلياً.
- **🎭 الملصقات و 🎙️ الفويزات:** ملفات WebP و MP3 مضمّنة محلياً داخل المشروع دون تخزين خارجي.
- **🔮 الخيرة الترفيهية:** رسائل إيجابية وحكم للتسلية فقط مع تنبيه واضح.
- **📥 مركز التحميل العام:** يقبل روابط HTTPS العامة من TikTok وInstagram وFacebook وPinterest وReddit وYouTube وX وVimeo فقط، ويتحقق من النطاقات والوسائط وإعادة التوجيه والحجم للحماية من SSRF. يستطيع إرسال الوسائط المكشوفة علناً؛ قد تكون الوسائط المستخرجة من OpenGraph صورة معاينة فقط، وليست الفيديو الأصلي. لا يدعم الحسابات الخاصة أو ما يتطلب تسجيل دخول.
- **🧩 مركز الأدوات (APIs مجانية بدون مفتاح):** Advice API، JokeAPI Safe-Mode، Quotes Service، Open Trivia DB، Open-Meteo (الطقس)، Countries API (countries.dev، بيانات GeoNames برخصة CC BY 4.0)، DiceBear (الصور الرمزية)، ومكتبة الإيموجي.
- **👑 لوحة تحكم المالك:** متاحة فقط للمعرّفات الموجودة في `ADMIN_IDS` مع فحص صلاحيات صارم في كل أمر.

---

## ⚙️ إعداد متغيرات البيئة على Vercel

من لوحة تحكم المشروع في **Vercel -> Settings -> Environment Variables** أضف المتغيرات التالية:

| المتغير | الوصف | مثال |
| :--- | :--- | :--- |
| `BOT_TOKEN` | توكن البوت من BotFather | `123456789:AA...` |
| `ADMIN_IDS` | أرقام Telegram IDs للملاك مفصولة بفاصلة | `123456789,987654321` |
| `WEBHOOK_SECRET` | نص سري عشوائي طويل للتحقق من طلبات Webhook | `my_strong_secret_token_2026` |
| `BOT_USERNAME` | معرّف البوت بدون `@` | `MyArabicToolsBot` |
| `MAINTENANCE_MODE` | تفعيل/تعطيل وضع الصيانة (`true` أو `false`) | `false` |
| `DISABLED_SECTIONS` | مفاتيح الأقسام المعطلة اختيارياً مفصولة بفاصلة | `stickers,voices` |

> **ملاحظة أمنية:** لا تضع أي توكن أو معرّف إداري داخل الكود ولا ترفع ملف `.env` إلى GitHub. أي GitHub PAT نُشر في محادثة يجب إلغاؤه وإنشاء رمز جديد بعد الاستخدام.

---

## 🚀 النشر من GitHub على Vercel

1. افتح Vercel ثم اختر **Add New → Project → Import Git Repository**.
2. استورد `https://github.com/elsayedhasaneisa1-collab/TOOLS`.
3. اترك إطار العمل **Next.js** وخيارات البناء الافتراضية.
4. أضف متغيرات البيئة الموضحة أعلاه في **Production** قبل النشر.
5. اضغط **Deploy** وانتظر اكتمال البناء؛ افحص `https://YOUR-VERCEL-DOMAIN/api/health` للتأكد من أن `ok` تساوي `true`.

> رابط Webhook النهائي: **`https://YOUR-VERCEL-DOMAIN/api/telegram`**. اسم النطاق يظهر بعد النشر ولا يمكن تحديده من رابط GitHub وحده.

---

## 🔗 ربط Telegram Webhook

بعد نشر المشروع على Vercel والحصول على رابط النطاق (مثلاً `https://your-project.vercel.app`)، استخدم عنوان Webhook الخاص بنطاقك الفعلي فقط:

```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-project.vercel.app/api/telegram",
    "secret_token": "<WEBHOOK_SECRET>",
    "allowed_updates": ["message"]
  }'
```

وللتحقق من نجاح الربط:

```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

---

## 🧪 التشغيل المحلي

1. أنشئ ملف `.env.local` اعتماداً على `.env.example`.
2. ثبّت الحزم وشغّل الخادم:

```bash
npm install
npm run dev
```

3. مسار الفحص الصحي: `GET /api/health`
4. مسار استقبال التحديثات: `POST /api/telegram`

---

Developed by EL-sayed Hasan
