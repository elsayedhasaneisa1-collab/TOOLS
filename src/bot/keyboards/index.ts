import type { KeyboardButton, ReplyKeyboardMarkup, ReplyKeyboardRemove } from "@/bot/types";

function btn(text: string): KeyboardButton {
  return { text };
}

function makeKeyboard(rows: string[][], placeholder?: string): ReplyKeyboardMarkup {
  return {
    keyboard: rows.map((row) => row.map(btn)),
    resize_keyboard: true,
    is_persistent: true,
    one_time_keyboard: false,
    ...(placeholder ? { input_field_placeholder: placeholder } : {}),
  };
}

export const HIDE_KEYBOARD_MARKUP: ReplyKeyboardRemove = {
  remove_keyboard: true,
};

export function getMainMenuKeyboard(isAdmin: boolean): ReplyKeyboardMarkup {
  const rows: string[][] = [
    ["✨ زخرفة عربية", "🔤 زخرفة إنجليزية"],
    ["🔢 زخرفة أرقام", "📝 زخرفة جمل"],
    ["🤍 بايو إنستجرام", "📖 نبذات تليجرام"],
    ["🎂 معرفة عمري", "♈ معرفة برجي"],
    ["🎭 الملصقات", "🎙️ الفويزات"],
    ["🔮 الخيرة الترفيهية", "📥 مركز التحميل"],
    ["🧩 مركز الأدوات"],
  ];

  if (isAdmin) {
    rows.push(["👑 لوحة الإدارة", "ℹ️ عن البوت", "🙈 إخفاء لوحة المفاتيح"]);
  } else {
    rows.push(["ℹ️ عن البوت", "🙈 إخفاء لوحة المفاتيح"]);
  }

  return makeKeyboard(rows, "اختر خدمة أو أرسل نصاً مباشرة...");
}

export function getArabicDecorationKeyboard(): ReplyKeyboardMarkup {
  return makeKeyboard(
    [
      ["🎲 مثال زخرفة عربية", "🔣 رموز وفواصل"],
      ["🔤 زخرفة إنجليزية", "📝 زخرفة جمل"],
      ["🔙 رجوع", "🏠 الرئيسية", "🙈 إخفاء لوحة المفاتيح"],
    ],
    "أرسل الاسم العربي الآن لزخرفته بأكثر من 35 شكلاً..."
  );
}

export function getEnglishDecorationKeyboard(): ReplyKeyboardMarkup {
  return makeKeyboard(
    [
      ["🎲 مثال زخرفة إنجليزية", "🔣 رموز وفواصل"],
      ["✨ زخرفة عربية", "🔢 زخرفة أرقام"],
      ["🔙 رجوع", "🏠 الرئيسية", "🙈 إخفاء لوحة المفاتيح"],
    ],
    "Send an English name to decorate..."
  );
}

export function getNumberDecorationKeyboard(): ReplyKeyboardMarkup {
  return makeKeyboard(
    [
      ["🎲 مثال زخرفة أرقام", "🔣 رموز وفواصل"],
      ["✨ زخرفة عربية", "🔤 زخرفة إنجليزية"],
      ["🔙 رجوع", "🏠 الرئيسية", "🙈 إخفاء لوحة المفاتيح"],
    ],
    "أرسل أي رقم الآن لزخرفته..."
  );
}

export function getSentenceDecorationKeyboard(): ReplyKeyboardMarkup {
  return makeKeyboard(
    [
      ["🎲 مثال زخرفة جملة", "🔣 رموز وفواصل"],
      ["✨ زخرفة عربية", "🤍 بايو إنستجرام"],
      ["🔙 رجوع", "🏠 الرئيسية", "🙈 إخفاء لوحة المفاتيح"],
    ],
    "أرسل جملة أو عبارة الآن لزخرفتها..."
  );
}

export function getBiosKeyboard(): ReplyKeyboardMarkup {
  return makeKeyboard(
    [
      ["🤍 بايو إنستجرام", "📖 نبذات تليجرام"],
      ["❤️ بايوهات حب", "🥀 بايوهات حزينة"],
      ["👑 بايوهات كبرياء", "🖤 بايوهات غامضة"],
      ["🇬🇧 بايوهات إنجليزية", "🌙 بايوهات عربية"],
      ["💬 عبارات قصيرة", "✨ حالات متنوعة"],
      ["🎲 بايو عشوائي"],
      ["🔙 رجوع", "🏠 الرئيسية", "🙈 إخفاء لوحة المفاتيح"],
    ],
    "اختر تصنيف البايو أو النبذة..."
  );
}

export function getAgeKeyboard(): ReplyKeyboardMarkup {
  return makeKeyboard(
    [
      ["📅 مثال: 2000-05-15", "♈ معرفة برجي"],
      ["🔙 رجوع", "🏠 الرئيسية", "🙈 إخفاء لوحة المفاتيح"],
    ],
    "أرسل تاريخ ميلادك مثل: 1998-04-22 أو 22/04/1998"
  );
}

export function getZodiacKeyboard(): ReplyKeyboardMarkup {
  return makeKeyboard(
    [
      ["♈ الحمل", "♉ الثور", "♊ الجوزاء"],
      ["♋ السرطان", "♌ الأسد", "♍ العذراء"],
      ["♎ الميزان", "♏ العقرب", "♐ القوس"],
      ["♑ الجدي", "♒ الدلو", "♓ الحوت"],
      ["🎂 معرفة عمري"],
      ["🔙 رجوع", "🏠 الرئيسية", "🙈 إخفاء لوحة المفاتيح"],
    ],
    "اختر برجك أو أرسل تاريخ ميلادك..."
  );
}

export function getStickersKeyboard(): ReplyKeyboardMarkup {
  return makeKeyboard(
    [
      ["❤️ ملصقات حب", "😂 ملصقات مضحكة"],
      ["⛩️ ملصقات أنمي", "🥀 ملصقات حزينة"],
      ["🎨 ملصقات متنوعة", "😊 ملصقات تعبيرية"],
      ["🎲 ملصق عشوائي"],
      ["🔙 رجوع", "🏠 الرئيسية", "🙈 إخفاء لوحة المفاتيح"],
    ],
    "اختر قسم الملصقات..."
  );
}

export function getVoicesKeyboard(): ReplyKeyboardMarkup {
  return makeKeyboard(
    [
      ["😂 فويزات مضحكة", "❤️ فويزات حب"],
      ["🔥 فويزات ترند", "🎵 فويزات متنوعة"],
      ["🎲 فويز عشوائي"],
      ["🔙 رجوع", "🏠 الرئيسية", "🙈 إخفاء لوحة المفاتيح"],
    ],
    "اختر قسم الفويزات..."
  );
}

export function getFortuneKeyboard(): ReplyKeyboardMarkup {
  return makeKeyboard(
    [
      ["🔮 اسحب خيرة جديدة", "🌟 رسالة تفاؤل"],
      ["📜 حكمة اليوم"],
      ["🔙 رجوع", "🏠 الرئيسية", "🙈 إخفاء لوحة المفاتيح"],
    ],
    "اختر من أزرار الخيرة الترفيهية..."
  );
}

export function getDownloaderKeyboard(): ReplyKeyboardMarkup {
  return makeKeyboard(
    [
      ["📥 تحميل من TikTok", "📥 تحميل من Instagram"],
      ["📥 تحميل من Facebook", "📥 تحميل من Pinterest"],
      ["📥 تحميل ستوريات عامة", "📥 تحميل من منصات أخرى مدعومة"],
      ["🔙 رجوع", "🏠 الرئيسية", "🙈 إخفاء لوحة المفاتيح"],
    ],
    "أرسل رابطاً عاماً للتحقق والتحميل..."
  );
}

export function getToolsKeyboard(): ReplyKeyboardMarkup {
  return makeKeyboard(
    [
      ["💡 نصيحة عشوائية", "😂 نكتة عشوائية"],
      ["📜 اقتباس وحكمة", "❓ سؤال معلومات عامة"],
      ["🌤️ معرفة الطقس", "🌍 معلومات الدول"],
      ["🎨 صورة رمزية DiceBear", "😀 مكتبة الإيموجي والرموز"],
      ["🔙 رجوع", "🏠 الرئيسية", "🙈 إخفاء لوحة المفاتيح"],
    ],
    "اختر أداة من مركز الأدوات..."
  );
}

export function getWeatherQuickKeyboard(): ReplyKeyboardMarkup {
  return makeKeyboard(
    [
      ["🌤️ طقس القاهرة", "🌤️ طقس الرياض", "🌤️ طقس دبي"],
      ["🌤️ طقس بغداد", "🌤️ طقس الدار البيضاء"],
      ["🧩 مركز الأدوات", "🔙 رجوع", "🏠 الرئيسية"],
    ],
    "أرسل اسم أي مدينة بالعربية أو الإنجليزية..."
  );
}

export function getCountriesQuickKeyboard(): ReplyKeyboardMarkup {
  return makeKeyboard(
    [
      ["🌍 مصر", "🌍 السعودية", "🌍 الإمارات"],
      ["🌍 المغرب", "🌍 العراق", "🌍 الأردن"],
      ["🧩 مركز الأدوات", "🔙 رجوع", "🏠 الرئيسية"],
    ],
    "أرسل اسم أي دولة بالإنجليزية أو العربية..."
  );
}

export function getEmojiSubKeyboard(): ReplyKeyboardMarkup {
  return makeKeyboard(
    [
      ["🤍 قلوب ومشاعر", "✨ نجوم ولمسات"],
      ["😊 وجوه وتعبير", "🌸 طبيعة وورود"],
      ["🔣 رموز للزخرفة والبايو"],
      ["🧩 مركز الأدوات", "🔙 رجوع", "🏠 الرئيسية"],
    ],
    "اختر تصنيف الإيموجي..."
  );
}

export function getAdminKeyboard(): ReplyKeyboardMarkup {
  return makeKeyboard(
    [
      ["📊 معلومات التشغيل", "🧩 إدارة الأقسام"],
      ["⚙️ إعدادات البوت", "🔍 اختبار الخدمات"],
      ["🌐 حالة APIs", "📈 مراقبة الطلب الحالي"],
      ["🔙 العودة للرئيسية", "🙈 إخفاء لوحة المفاتيح"],
    ],
    "لوحة تحكم المالك — اختر أداة إدارية..."
  );
}
