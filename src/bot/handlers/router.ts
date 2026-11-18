import type { BioCategoryKey } from "@/bot/data/bios";
import type { StickerCategoryKey, VoiceCategoryKey } from "@/bot/data/assets";
import {
  getAdminKeyboard,
  getAgeKeyboard,
  getArabicDecorationKeyboard,
  getBiosKeyboard,
  getCountriesQuickKeyboard,
  getDownloaderKeyboard,
  getEmojiSubKeyboard,
  getEnglishDecorationKeyboard,
  getFortuneKeyboard,
  getMainMenuKeyboard,
  getNumberDecorationKeyboard,
  getSentenceDecorationKeyboard,
  getStickersKeyboard,
  getToolsKeyboard,
  getVoicesKeyboard,
  getWeatherQuickKeyboard,
  getZodiacKeyboard,
  HIDE_KEYBOARD_MARKUP,
} from "@/bot/keyboards";
import {
  getBotSettingsMessage,
  getCurrentRequestMonitorMessage,
  getExternalApisStatusMessage,
  getRuntimeInfoMessage,
  getSectionsManagementMessage,
  runLocalServicesTest,
  unauthorizedAdminMessage,
} from "@/bot/admin";
import { findZodiacByButtonText, formatAgeMessage, formatZodiacMessage, parseBirthDate } from "@/bot/services/ageZodiac";
import { formatBioCategoryMessage, getRandomBioAcrossAll } from "@/bot/services/bios";
import {
  decorateArabicName,
  decorateEnglishName,
  decorateNumbers,
  decorateSentence,
  getSymbolsAndDividersMessage,
  pickRandomSample,
  SAMPLE_ARABIC_NAMES,
  SAMPLE_ENGLISH_NAMES,
  SAMPLE_NUMBERS,
  SAMPLE_SENTENCES,
} from "@/bot/services/decoration";
import { resolvePublicDownload } from "@/bot/services/downloader";
import { getEntertainmentFortuneMessage } from "@/bot/services/fortune";
import { loadStickerBuffer, pickStickerAsset } from "@/bot/services/stickers";
import {
  buildDiceBearAvatarUrl,
  getCountryInfoMessage,
  getEmojiCategoryMessage,
  getRandomAdviceMessage,
  getRandomJokeMessage,
  getRandomQuoteMessage,
  getTriviaQuestionMessage,
  getWeatherByCityMessage,
} from "@/bot/services/tools";
import { loadVoiceBuffer, pickVoiceAsset } from "@/bot/services/voices";
import type { RequestDiagnostics, SectionKey, TelegramMessage, TelegramUpdate } from "@/bot/types";
import { DEVELOPER_SIGNATURE, getBotConfig, isSectionEnabled, SECTION_LABELS } from "@/lib/config";
import { escapeHtml, isAdminUser, sanitizeUserText } from "@/lib/security";
import {
  sendChatAction,
  sendMessage,
  sendPhotoByUrl,
  sendStickerBuffer,
  sendVideoByUrl,
  sendVoiceBuffer,
} from "@/lib/telegram";

const BIO_BUTTON_MAP: Record<string, BioCategoryKey> = {
  "🤍 بايو إنستجرام": "instagram",
  "📖 نبذات تليجرام": "telegram",
  "❤️ بايوهات حب": "love",
  "🥀 بايوهات حزينة": "sad",
  "👑 بايوهات كبرياء": "pride",
  "🖤 بايوهات غامضة": "mystery",
  "🇬🇧 بايوهات إنجليزية": "english",
  "🌙 بايوهات عربية": "arabic",
  "💬 عبارات قصيرة": "short",
  "✨ حالات متنوعة": "statuses",
};

const STICKER_BUTTON_MAP: Record<string, StickerCategoryKey | undefined> = {
  "❤️ ملصقات حب": "love",
  "😂 ملصقات مضحكة": "funny",
  "⛩️ ملصقات أنمي": "anime",
  "🥀 ملصقات حزينة": "sad",
  "🎨 ملصقات متنوعة": "misc",
  "😊 ملصقات تعبيرية": "expressive",
  "🎲 ملصق عشوائي": undefined,
};

const VOICE_BUTTON_MAP: Record<string, VoiceCategoryKey | undefined> = {
  "😂 فويزات مضحكة": "funny",
  "❤️ فويزات حب": "love",
  "🔥 فويزات ترند": "trend",
  "🎵 فويزات متنوعة": "misc",
  "🎲 فويز عشوائي": undefined,
};

const WEATHER_QUICK_MAP: Record<string, string> = {
  "🌤️ طقس القاهرة": "Cairo",
  "🌤️ طقس الرياض": "Riyadh",
  "🌤️ طقس دبي": "Dubai",
  "🌤️ طقس بغداد": "Baghdad",
  "🌤️ طقس الدار البيضاء": "Casablanca",
};

const COUNTRY_QUICK_MAP: Record<string, string> = {
  "🌍 مصر": "egypt",
  "🌍 السعودية": "saudi arabia",
  "🌍 الإمارات": "united arab emirates",
  "🌍 المغرب": "morocco",
  "🌍 العراق": "iraq",
  "🌍 الأردن": "jordan",
};

const EMOJI_BUTTON_MAP: Record<string, string> = {
  "🤍 قلوب ومشاعر": "hearts",
  "✨ نجوم ولمسات": "sparkles",
  "😊 وجوه وتعبير": "faces",
  "🌸 طبيعة وورود": "nature",
  "🔣 رموز للزخرفة والبايو": "symbols",
};

function buildWelcomeMessage(firstName: string | undefined, isAdmin: boolean): string {
  const safeName = firstName ? escapeHtml(firstName) : "صديقي";
  const adminBadge = isAdmin ? "\n👑 <b>حساب المالك مُفعّل</b> — زر لوحة الإدارة متاح بالأسفل." : "";
  return (
    `🤍 <b>أهلاً بك يا ${safeName} في البوت العربي الشامل</b>\n\n` +
    `🖤💜 تجربة سريعة ومنظمة عبر لوحة الأزرار أسفل المحادثة:\n` +
    `• ✨ زخرفة عربية، إنجليزية، أرقام وجمل\n` +
    `• 🤍 بايوهات إنستجرام ونبذات تليجرام\n` +
    `• 🎂 حساب العمر الدقيق والأبراج\n` +
    `• 🎭 ملصقات وفويزات و🔮 خيرة ترفيهية\n` +
    `• 📥 مركز التحميل و🧩 أدوات APIs مجانية${adminBadge}\n\n` +
    `📌 اختر أي قسم من لوحة المفاتيح بالأسفل أو أرسل نصاً أو رابطاً مباشرة.\n\n` +
    `<i>${DEVELOPER_SIGNATURE}</i>`
  );
}

function buildAboutMessage(): string {
  return (
    `ℹ️ <b>معلومات البوت</b>\n\n` +
    `🤍 بوت عربي متكامل يعمل ببنية <b>Stateless</b> سريعة بدون أي تخزين لبيانات المستخدمين.\n` +
    `💜 يعتمد حصرياً على لوحة المفاتيح التفاعلية أسفل الشاشة.\n\n` +
    `📌 لإظهار القائمة الرئيسية في أي وقت أرسل: /start أو /menu\n\n` +
    `<b>${DEVELOPER_SIGNATURE}</b>`
  );
}

function sectionDisabledMessage(section: SectionKey): string {
  return `🟠 <b>القسم غير متاح حالياً</b>\n\nتم تعطيل قسم <b>${SECTION_LABELS[section]}</b> مؤقتاً من إعدادات التشغيل.`;
}

function extractReplyContext(replyText: string | undefined): string | null {
  if (!replyText) return null;
  const match = replyText.match(/\[القسم:\s*([^\]]+)\]/);
  return match?.[1]?.trim() ?? null;
}

async function handleDownloadFlow(chatId: number, rawUrl: string, isAdmin: boolean): Promise<void> {
  if (!isSectionEnabled("downloader")) {
    await sendMessage(chatId, sectionDisabledMessage("downloader"), {
      parseMode: "HTML",
      replyMarkup: getMainMenuKeyboard(isAdmin),
    });
    return;
  }

  await sendChatAction(chatId, "typing");
  const resolution = await resolvePublicDownload(rawUrl);
  const kb = getDownloaderKeyboard();

  if (!resolution.ok || resolution.tooLargeForTelegram || !resolution.mediaUrl) {
    await sendMessage(chatId, resolution.messageHtml, {
      parseMode: "HTML",
      replyMarkup: kb,
      disableWebPagePreview: !resolution.tooLargeForTelegram,
    });
    return;
  }

  if (resolution.mediaType === "video") {
    await sendChatAction(chatId, "upload_video");
    const sent = await sendVideoByUrl(chatId, resolution.mediaUrl, resolution.messageHtml, kb);
    if (!sent.ok) {
      await sendMessage(
        chatId,
        `${resolution.messageHtml}\n\n⚠️ تعذر الإرسال المباشر عبر تليجرام، يمكنك الفتح عبر الرابط العام:\n${escapeHtml(resolution.mediaUrl)}`,
        { parseMode: "HTML", replyMarkup: kb }
      );
    }
    return;
  }

  await sendChatAction(chatId, "upload_photo");
  const sent = await sendPhotoByUrl(chatId, resolution.mediaUrl, resolution.messageHtml, kb);
  if (!sent.ok) {
    await sendMessage(
      chatId,
      `${resolution.messageHtml}\n\n⚠️ تعذر إرسال الصورة مباشرة، الرابط العام:\n${escapeHtml(resolution.mediaUrl)}`,
      { parseMode: "HTML", replyMarkup: kb }
    );
  }
}

async function handleContextOrSmartText(
  message: TelegramMessage,
  text: string,
  isAdmin: boolean
): Promise<void> {
  const chatId = message.chat.id;
  const replyCtx = extractReplyContext(message.reply_to_message?.text);

  if (replyCtx === "زخرفة عربية" || /^زخرف\s*عربي\s*[:：]\s*/i.test(text)) {
    if (!isSectionEnabled("decoration_ar")) {
      await sendMessage(chatId, sectionDisabledMessage("decoration_ar"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    const clean = text.replace(/^زخرف\s*عربي\s*[:：]\s*/i, "");
    const res = decorateArabicName(clean);
    await sendMessage(chatId, res.html, { parseMode: "HTML", replyMarkup: getArabicDecorationKeyboard() });
    return;
  }

  if (replyCtx === "زخرفة إنجليزية" || /^زخرف\s*(?:انجليزي|إنجليزي)\s*[:：]\s*/i.test(text)) {
    if (!isSectionEnabled("decoration_en")) {
      await sendMessage(chatId, sectionDisabledMessage("decoration_en"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    const clean = text.replace(/^زخرف\s*(?:انجليزي|إنجليزي)\s*[:：]\s*/i, "");
    const res = decorateEnglishName(clean);
    await sendMessage(chatId, res.html, { parseMode: "HTML", replyMarkup: getEnglishDecorationKeyboard() });
    return;
  }

  if (replyCtx === "زخرفة أرقام" || /^زخرف\s*(?:رقم|أرقام)\s*[:：]\s*/i.test(text)) {
    if (!isSectionEnabled("decoration_num")) {
      await sendMessage(chatId, sectionDisabledMessage("decoration_num"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    const clean = text.replace(/^زخرف\s*(?:رقم|أرقام)\s*[:：]\s*/i, "");
    const res = decorateNumbers(clean);
    await sendMessage(chatId, res.html, { parseMode: "HTML", replyMarkup: getNumberDecorationKeyboard() });
    return;
  }

  if (replyCtx === "زخرفة جمل" || /^زخرف\s*(?:جملة|جمل)\s*[:：]\s*/i.test(text)) {
    if (!isSectionEnabled("decoration_sentence")) {
      await sendMessage(chatId, sectionDisabledMessage("decoration_sentence"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    const clean = text.replace(/^زخرف\s*(?:جملة|جمل)\s*[:：]\s*/i, "");
    const res = decorateSentence(clean);
    await sendMessage(chatId, res.html, { parseMode: "HTML", replyMarkup: getSentenceDecorationKeyboard() });
    return;
  }

  if (replyCtx === "معرفة عمري" || replyCtx === "معرفة برجي" || /^(?:عمري|تاريخ|برجي)\s*[:：]\s*/i.test(text)) {
    const clean = text.replace(/^(?:عمري|تاريخ|برجي)\s*[:：]\s*/i, "");
    const parsed = parseBirthDate(clean);
    if (!parsed) {
      await sendMessage(
        chatId,
        "⚠️ <b>تاريخ غير صالح</b>\n\nيرجى إرسال تاريخ الميلاد بصيغة واضحة مثل:\n<code>1999-08-24</code> أو <code>24/08/1999</code>\n\n[القسم: معرفة عمري]",
        { parseMode: "HTML", replyMarkup: getAgeKeyboard() }
      );
      return;
    }
    await sendMessage(chatId, formatAgeMessage(parsed), {
      parseMode: "HTML",
      replyMarkup: replyCtx === "معرفة برجي" ? getZodiacKeyboard() : getAgeKeyboard(),
    });
    return;
  }

  if (replyCtx === "مركز التحميل" || /^(?:تحميل|رابط)\s*[:：]\s*/i.test(text)) {
    const clean = text.replace(/^(?:تحميل|رابط)\s*[:：]\s*/i, "");
    await handleDownloadFlow(chatId, clean, isAdmin);
    return;
  }

  if (replyCtx === "الطقس" || /^طقس\s*[:：]\s*/i.test(text)) {
    const clean = text.replace(/^طقس\s*[:：]\s*/i, "");
    await sendChatAction(chatId, "typing");
    const weatherMsg = await getWeatherByCityMessage(clean);
    await sendMessage(chatId, weatherMsg, { parseMode: "HTML", replyMarkup: getWeatherQuickKeyboard() });
    return;
  }

  if (replyCtx === "الدول" || /^دولة\s*[:：]\s*/i.test(text)) {
    const clean = text.replace(/^دولة\s*[:：]\s*/i, "");
    await sendChatAction(chatId, "typing");
    const countryMsg = await getCountryInfoMessage(clean);
    await sendMessage(chatId, countryMsg, { parseMode: "HTML", replyMarkup: getCountriesQuickKeyboard() });
    return;
  }

  if (replyCtx === "أفاتار" || /^(?:أفاتار|افاتار|صورة رمزية)\s*[:：]\s*/i.test(text)) {
    const clean = text.replace(/^(?:أفاتار|افاتار|صورة رمزية)\s*[:：]\s*/i, "");
    const avatar = buildDiceBearAvatarUrl(clean);
    await sendChatAction(chatId, "upload_photo");
    const sent = await sendPhotoByUrl(
      chatId,
      avatar.url,
      `🎨 <b>صورة رمزية عبر DiceBear</b>\n🔑 الاسم/المعرّف: <code>${escapeHtml(avatar.seed)}</code>\n✨ النمط: <b>${escapeHtml(avatar.style)}</b>`,
      getToolsKeyboard()
    );
    if (!sent.ok) {
      await sendMessage(chatId, "⚠️ تعذر توليد الصورة الرمزية حالياً، حاول مرة أخرى.", {
        parseMode: "HTML",
        replyMarkup: getToolsKeyboard(),
      });
    }
    return;
  }

  if (/^https?:\/\/\S+/i.test(text)) {
    const firstUrl = text.split(/\s+/)[0];
    await handleDownloadFlow(chatId, firstUrl, isAdmin);
    return;
  }

  const maybeDate = parseBirthDate(text);
  if (maybeDate && isSectionEnabled("age")) {
    await sendMessage(chatId, formatAgeMessage(maybeDate), {
      parseMode: "HTML",
      replyMarkup: getAgeKeyboard(),
    });
    return;
  }

  if (/^[\d\u0660-\u0669\u06F0-\u06F9\s\-+.,]+$/.test(text) && /[\d\u0660-\u0669\u06F0-\u06F9]/.test(text)) {
    if (isSectionEnabled("decoration_num")) {
      const res = decorateNumbers(text);
      await sendMessage(chatId, res.html, { parseMode: "HTML", replyMarkup: getNumberDecorationKeyboard() });
      return;
    }
  }

  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const hasLatin = /[A-Za-z]/.test(text);

  if (hasLatin && !hasArabic) {
    if (text.length <= 35 && isSectionEnabled("decoration_en")) {
      const res = decorateEnglishName(text);
      await sendMessage(chatId, res.html, { parseMode: "HTML", replyMarkup: getEnglishDecorationKeyboard() });
      return;
    }
    if (isSectionEnabled("decoration_sentence")) {
      const res = decorateSentence(text);
      await sendMessage(chatId, res.html, { parseMode: "HTML", replyMarkup: getSentenceDecorationKeyboard() });
      return;
    }
  }

  if (hasArabic) {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    if (text.length <= 24 && wordCount <= 2 && isSectionEnabled("decoration_ar")) {
      const res = decorateArabicName(text);
      await sendMessage(chatId, res.html, { parseMode: "HTML", replyMarkup: getArabicDecorationKeyboard() });
      return;
    }
    if (isSectionEnabled("decoration_sentence")) {
      const res = decorateSentence(text);
      await sendMessage(chatId, res.html, { parseMode: "HTML", replyMarkup: getSentenceDecorationKeyboard() });
      return;
    }
  }

  await sendMessage(
    chatId,
    `🤍 اختر القسم المطلوب من لوحة المفاتيح بالأسفل، أو أرسل:\n• اسماً عربياً أو إنجليزياً للزخرفة\n• تاريخ ميلادك مثل <code>2000-05-15</code>\n• رابطاً عاماً للتحميل`,
    { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) }
  );
}

export async function processTelegramUpdate(
  update: TelegramUpdate,
  diagnostics: RequestDiagnostics
): Promise<void> {
  const message = update.message;
  if (!message || !message.chat || message.from?.is_bot) {
    return;
  }

  const chatId = message.chat.id;
  const userId = message.from?.id;
  const config = getBotConfig();
  const isAdmin = isAdminUser(userId, config);
  const text = sanitizeUserText(message.text ?? "");

  if (config.maintenanceMode && !isAdmin) {
    await sendMessage(
      chatId,
      `🛠️ <b>البوت في وضع الصيانة حالياً</b>\n\nنعمل على تحديث وتحسين الخدمات، يرجى المحاولة لاحقاً.\n\n<i>${DEVELOPER_SIGNATURE}</i>`,
      { parseMode: "HTML", replyMarkup: HIDE_KEYBOARD_MARKUP }
    );
    return;
  }

  if (!text) {
    await sendMessage(
      chatId,
      "🤍 يرجى استخدام الأزرار بالأسفل أو إرسال رسالة نصية واضحة.",
      { replyMarkup: getMainMenuKeyboard(isAdmin) }
    );
    return;
  }

  if (text === "/start" || text === "/menu" || text === "🏠 الرئيسية" || text === "🔙 العودة للرئيسية" || text === "🔙 رجوع") {
    await sendMessage(chatId, buildWelcomeMessage(message.from?.first_name, isAdmin), {
      parseMode: "HTML",
      replyMarkup: getMainMenuKeyboard(isAdmin),
    });
    return;
  }

  if (text === "/help" || text === "ℹ️ عن البوت") {
    await sendMessage(chatId, buildAboutMessage(), {
      parseMode: "HTML",
      replyMarkup: getMainMenuKeyboard(isAdmin),
    });
    return;
  }

  if (text === "🙈 إخفاء لوحة المفاتيح") {
    await sendMessage(
      chatId,
      "🙈 تم إخفاء لوحة المفاتيح.\n📌 لإظهارها في أي وقت أرسل /start أو /menu.",
      { replyMarkup: HIDE_KEYBOARD_MARKUP }
    );
    return;
  }

  if (text === "/admin" || text === "👑 لوحة الإدارة") {
    if (!isAdmin) {
      await sendMessage(chatId, unauthorizedAdminMessage(), {
        parseMode: "HTML",
        replyMarkup: getMainMenuKeyboard(false),
      });
      return;
    }
    await sendMessage(
      chatId,
      `👑 <b>لوحة تحكم المالك</b>\n\n🤍 أهلاً بك. جميع الأدوات الإدارية تعمل بشكل فوري وبدون تخزين بيانات.\n\n<i>${DEVELOPER_SIGNATURE}</i>`,
      { parseMode: "HTML", replyMarkup: getAdminKeyboard() }
    );
    return;
  }

  if (text === "📊 معلومات التشغيل") {
    const reply = await getRuntimeInfoMessage(userId);
    await sendMessage(chatId, reply, {
      parseMode: "HTML",
      replyMarkup: isAdmin ? getAdminKeyboard() : getMainMenuKeyboard(false),
    });
    return;
  }

  if (text === "🧩 إدارة الأقسام") {
    const reply = getSectionsManagementMessage(userId);
    await sendMessage(chatId, reply, {
      parseMode: "HTML",
      replyMarkup: isAdmin ? getAdminKeyboard() : getMainMenuKeyboard(false),
    });
    return;
  }

  if (text === "⚙️ إعدادات البوت") {
    const reply = await getBotSettingsMessage(userId);
    await sendMessage(chatId, reply, {
      parseMode: "HTML",
      replyMarkup: isAdmin ? getAdminKeyboard() : getMainMenuKeyboard(false),
    });
    return;
  }

  if (text === "🔍 اختبار الخدمات") {
    if (isAdmin) await sendChatAction(chatId, "typing");
    const reply = await runLocalServicesTest(userId);
    await sendMessage(chatId, reply, {
      parseMode: "HTML",
      replyMarkup: isAdmin ? getAdminKeyboard() : getMainMenuKeyboard(false),
    });
    return;
  }

  if (text === "🌐 حالة APIs") {
    if (isAdmin) await sendChatAction(chatId, "typing");
    const reply = await getExternalApisStatusMessage(userId);
    await sendMessage(chatId, reply, {
      parseMode: "HTML",
      replyMarkup: isAdmin ? getAdminKeyboard() : getMainMenuKeyboard(false),
    });
    return;
  }

  if (text === "📈 مراقبة الطلب الحالي") {
    const reply = getCurrentRequestMonitorMessage(userId, diagnostics);
    await sendMessage(chatId, reply, {
      parseMode: "HTML",
      replyMarkup: isAdmin ? getAdminKeyboard() : getMainMenuKeyboard(false),
    });
    return;
  }

  if (text === "✨ زخرفة عربية") {
    if (!isSectionEnabled("decoration_ar", config)) {
      await sendMessage(chatId, sectionDisabledMessage("decoration_ar"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(
      chatId,
      "✨ <b>قسم الزخرفة العربية</b>\n\n📌 أرسل الاسم العربي الآن (أو رُد على هذه الرسالة) للحصول على أكثر من 35 شكلاً مقروءاً وجاهزاً للنسخ.\n\n[القسم: زخرفة عربية]",
      { parseMode: "HTML", replyMarkup: getArabicDecorationKeyboard() }
    );
    return;
  }

  if (text === "🎲 مثال زخرفة عربية") {
    if (!isSectionEnabled("decoration_ar", config)) {
      await sendMessage(chatId, sectionDisabledMessage("decoration_ar"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    const sample = pickRandomSample(SAMPLE_ARABIC_NAMES);
    const res = decorateArabicName(sample);
    await sendMessage(chatId, res.html, { parseMode: "HTML", replyMarkup: getArabicDecorationKeyboard() });
    return;
  }

  if (text === "🔤 زخرفة إنجليزية") {
    if (!isSectionEnabled("decoration_en", config)) {
      await sendMessage(chatId, sectionDisabledMessage("decoration_en"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(
      chatId,
      "🔤 <b>قسم الزخرفة الإنجليزية</b>\n\n📌 أرسل الاسم الإنجليزي الآن (أو رُد على هذه الرسالة) للحصول على أكثر من 35 خطاً وشكلاً مزخرفاً.\n\n[القسم: زخرفة إنجليزية]",
      { parseMode: "HTML", replyMarkup: getEnglishDecorationKeyboard() }
    );
    return;
  }

  if (text === "🎲 مثال زخرفة إنجليزية") {
    if (!isSectionEnabled("decoration_en", config)) {
      await sendMessage(chatId, sectionDisabledMessage("decoration_en"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    const sample = pickRandomSample(SAMPLE_ENGLISH_NAMES);
    const res = decorateEnglishName(sample);
    await sendMessage(chatId, res.html, { parseMode: "HTML", replyMarkup: getEnglishDecorationKeyboard() });
    return;
  }

  if (text === "🔢 زخرفة أرقام") {
    if (!isSectionEnabled("decoration_num", config)) {
      await sendMessage(chatId, sectionDisabledMessage("decoration_num"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(
      chatId,
      "🔢 <b>قسم زخرفة الأرقام</b>\n\n📌 أرسل أي رقم الآن (مثل <code>2026</code> أو <code>777</code>) لزخرفته بأشكال متعددة.\n\n[القسم: زخرفة أرقام]",
      { parseMode: "HTML", replyMarkup: getNumberDecorationKeyboard() }
    );
    return;
  }

  if (text === "🎲 مثال زخرفة أرقام") {
    if (!isSectionEnabled("decoration_num", config)) {
      await sendMessage(chatId, sectionDisabledMessage("decoration_num"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    const sample = pickRandomSample(SAMPLE_NUMBERS);
    const res = decorateNumbers(sample);
    await sendMessage(chatId, res.html, { parseMode: "HTML", replyMarkup: getNumberDecorationKeyboard() });
    return;
  }

  if (text === "📝 زخرفة جمل") {
    if (!isSectionEnabled("decoration_sentence", config)) {
      await sendMessage(chatId, sectionDisabledMessage("decoration_sentence"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(
      chatId,
      "📝 <b>قسم زخرفة الجمل</b>\n\n📌 أرسل الجملة أو العبارة الآن (عربية أو إنجليزية) للحصول على إطارات وتنسيقات جاهزة.\n\n[القسم: زخرفة جمل]",
      { parseMode: "HTML", replyMarkup: getSentenceDecorationKeyboard() }
    );
    return;
  }

  if (text === "🎲 مثال زخرفة جملة") {
    if (!isSectionEnabled("decoration_sentence", config)) {
      await sendMessage(chatId, sectionDisabledMessage("decoration_sentence"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    const sample = pickRandomSample(SAMPLE_SENTENCES);
    const res = decorateSentence(sample);
    await sendMessage(chatId, res.html, { parseMode: "HTML", replyMarkup: getSentenceDecorationKeyboard() });
    return;
  }

  if (text === "🔣 رموز وفواصل") {
    await sendMessage(chatId, getSymbolsAndDividersMessage(), {
      parseMode: "HTML",
      replyMarkup: getArabicDecorationKeyboard(),
    });
    return;
  }

  if (text in BIO_BUTTON_MAP) {
    const bioCat = BIO_BUTTON_MAP[text];
    if (bioCat === "instagram" && !isSectionEnabled("bio_ig", config)) {
      await sendMessage(chatId, sectionDisabledMessage("bio_ig"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    if (bioCat === "telegram" && !isSectionEnabled("bio_tg", config)) {
      await sendMessage(chatId, sectionDisabledMessage("bio_tg"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(chatId, formatBioCategoryMessage(bioCat), {
      parseMode: "HTML",
      replyMarkup: getBiosKeyboard(),
    });
    return;
  }

  if (text === "🎲 بايو عشوائي") {
    await sendMessage(chatId, getRandomBioAcrossAll(), {
      parseMode: "HTML",
      replyMarkup: getBiosKeyboard(),
    });
    return;
  }

  if (text === "🎂 معرفة عمري") {
    if (!isSectionEnabled("age", config)) {
      await sendMessage(chatId, sectionDisabledMessage("age"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(
      chatId,
      "🎂 <b>حاسبة العمر الدقيقة</b>\n\n📅 أرسل تاريخ ميلادك الآن بصيغة:\n<code>1999-05-20</code> أو <code>20/05/1999</code>\n\n[القسم: معرفة عمري]",
      { parseMode: "HTML", replyMarkup: getAgeKeyboard() }
    );
    return;
  }

  if (text === "📅 مثال: 2000-05-15") {
    if (!isSectionEnabled("age", config)) {
      await sendMessage(chatId, sectionDisabledMessage("age"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    const parsed = parseBirthDate("2000-05-15");
    if (parsed) {
      await sendMessage(chatId, formatAgeMessage(parsed), {
        parseMode: "HTML",
        replyMarkup: getAgeKeyboard(),
      });
    }
    return;
  }

  if (text === "♈ معرفة برجي") {
    if (!isSectionEnabled("zodiac", config)) {
      await sendMessage(chatId, sectionDisabledMessage("zodiac"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(
      chatId,
      "♈ <b>قسم الأبراج الترفيهي</b>\n\n✨ اختر برجك من الأزرار بالأسفل أو أرسل تاريخ ميلادك لمعرفة برجك وتفاصيله تلقائياً.\n\n[القسم: معرفة برجي]",
      { parseMode: "HTML", replyMarkup: getZodiacKeyboard() }
    );
    return;
  }

  const matchedZodiac = findZodiacByButtonText(text);
  if (matchedZodiac) {
    if (!isSectionEnabled("zodiac", config)) {
      await sendMessage(chatId, sectionDisabledMessage("zodiac"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(chatId, formatZodiacMessage(matchedZodiac), {
      parseMode: "HTML",
      replyMarkup: getZodiacKeyboard(),
    });
    return;
  }

  if (text === "🎭 الملصقات") {
    if (!isSectionEnabled("stickers", config)) {
      await sendMessage(chatId, sectionDisabledMessage("stickers"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(
      chatId,
      "🎭 <b>قسم الملصقات</b>\n\n🤍 اختر تصنيف الملصقات من لوحة المفاتيح بالأسفل لإرسال ملصق مباشر:",
      { parseMode: "HTML", replyMarkup: getStickersKeyboard() }
    );
    return;
  }

  if (text in STICKER_BUTTON_MAP) {
    if (!isSectionEnabled("stickers", config)) {
      await sendMessage(chatId, sectionDisabledMessage("stickers"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    const asset = pickStickerAsset(STICKER_BUTTON_MAP[text]);
    try {
      const buf = await loadStickerBuffer(asset);
      const res = await sendStickerBuffer(chatId, buf, asset.filename, getStickersKeyboard());
      if (!res.ok) {
        await sendMessage(chatId, "⚠️ تعذر إرسال الملصق عبر Telegram API حالياً.", { replyMarkup: getStickersKeyboard() });
      }
    } catch {
      await sendMessage(chatId, "⚠️ تعذر تحميل ملف الملصق.", { replyMarkup: getStickersKeyboard() });
    }
    return;
  }

  if (text === "🎙️ الفويزات") {
    if (!isSectionEnabled("voices", config)) {
      await sendMessage(chatId, sectionDisabledMessage("voices"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(
      chatId,
      "🎙️ <b>قسم الفويزات</b>\n\n💜 اختر تصنيف المقطع الصوتي من الأزرار بالأسفل لإرساله كرسالة صوتية:",
      { parseMode: "HTML", replyMarkup: getVoicesKeyboard() }
    );
    return;
  }

  if (text in VOICE_BUTTON_MAP) {
    if (!isSectionEnabled("voices", config)) {
      await sendMessage(chatId, sectionDisabledMessage("voices"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    const asset = pickVoiceAsset(VOICE_BUTTON_MAP[text]);
    await sendChatAction(chatId, "upload_voice");
    try {
      const buf = await loadVoiceBuffer(asset);
      const caption = `🎙️ <b>${escapeHtml(asset.title)}</b>\n${escapeHtml(asset.description)}`;
      const res = await sendVoiceBuffer(chatId, buf, asset.filename, caption, getVoicesKeyboard());
      if (!res.ok) {
        await sendMessage(chatId, "⚠️ تعذر إرسال المقطع الصوتي حالياً.", { replyMarkup: getVoicesKeyboard() });
      }
    } catch {
      await sendMessage(chatId, "⚠️ تعذر قراءة ملف الصوت.", { replyMarkup: getVoicesKeyboard() });
    }
    return;
  }

  if (text === "🔮 الخيرة الترفيهية" || text === "🔮 اسحب خيرة جديدة") {
    if (!isSectionEnabled("fortune", config)) {
      await sendMessage(chatId, sectionDisabledMessage("fortune"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(chatId, getEntertainmentFortuneMessage("fortune"), {
      parseMode: "HTML",
      replyMarkup: getFortuneKeyboard(),
    });
    return;
  }

  if (text === "🌟 رسالة تفاؤل") {
    if (!isSectionEnabled("fortune", config)) {
      await sendMessage(chatId, sectionDisabledMessage("fortune"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(chatId, getEntertainmentFortuneMessage("optimism"), {
      parseMode: "HTML",
      replyMarkup: getFortuneKeyboard(),
    });
    return;
  }

  if (text === "📜 حكمة اليوم") {
    if (!isSectionEnabled("fortune", config)) {
      await sendMessage(chatId, sectionDisabledMessage("fortune"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(chatId, getEntertainmentFortuneMessage("wisdom"), {
      parseMode: "HTML",
      replyMarkup: getFortuneKeyboard(),
    });
    return;
  }

  if (text === "📥 مركز التحميل") {
    if (!isSectionEnabled("downloader", config)) {
      await sendMessage(chatId, sectionDisabledMessage("downloader"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(
      chatId,
      "📥 <b>مركز التحميل العام</b>\n\n" +
        "🔗 اختر المنصة أو أرسل الرابط العام مباشرة.\n" +
        "⚖️ يدعم البوت المحتوى العام المسموح به فقط دون تجاوز تسجيل الدخول أو الحسابات الخاصة.\n\n" +
        "[القسم: مركز التحميل]",
      { parseMode: "HTML", replyMarkup: getDownloaderKeyboard() }
    );
    return;
  }

  if (
    text === "📥 تحميل من TikTok" ||
    text === "📥 تحميل من Instagram" ||
    text === "📥 تحميل من Facebook" ||
    text === "📥 تحميل من Pinterest" ||
    text === "📥 تحميل ستوريات عامة" ||
    text === "📥 تحميل من منصات أخرى مدعومة"
  ) {
    if (!isSectionEnabled("downloader", config)) {
      await sendMessage(chatId, sectionDisabledMessage("downloader"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    const platformNote =
      text === "📥 تحميل من Instagram" || text === "📥 تحميل من Facebook" || text === "📥 تحميل ستوريات عامة"
        ? "\n⚠️ الروابط التي تتطلب تسجيل دخول أو الحسابات الخاصة لا يمكن تحميلها. قد تتوفر صورة معاينة فقط."
        : text === "📥 تحميل من منصات أخرى مدعومة"
          ? "\n🌐 المنصات المدعومة هنا: Reddit وYouTube وX وVimeo. تُرسل الوسائط المكشوفة علناً فقط، وقد تكون صورة معاينة."
          : "";
    await sendMessage(
      chatId,
      `<b>${escapeHtml(text)}</b>\n\n🔗 أرسل الآن رابط المنشور أو الفيديو العام للتحقق منه ومعالجته.${platformNote}\n\n[القسم: مركز التحميل]`,
      { parseMode: "HTML", replyMarkup: getDownloaderKeyboard() }
    );
    return;
  }

  if (text === "🧩 مركز الأدوات") {
    if (!isSectionEnabled("tools", config)) {
      await sendMessage(chatId, sectionDisabledMessage("tools"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(
      chatId,
      "🧩 <b>مركز الأدوات والخدمات الذكية</b>\n\n⚡ اختر أي أداة من لوحة المفاتيح بالأسفل:",
      { parseMode: "HTML", replyMarkup: getToolsKeyboard() }
    );
    return;
  }

  if (text === "💡 نصيحة عشوائية") {
    if (!isSectionEnabled("tools", config)) {
      await sendMessage(chatId, sectionDisabledMessage("tools"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendChatAction(chatId, "typing");
    await sendMessage(chatId, await getRandomAdviceMessage(), { parseMode: "HTML", replyMarkup: getToolsKeyboard() });
    return;
  }

  if (text === "😂 نكتة عشوائية") {
    if (!isSectionEnabled("tools", config)) {
      await sendMessage(chatId, sectionDisabledMessage("tools"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendChatAction(chatId, "typing");
    await sendMessage(chatId, await getRandomJokeMessage(), { parseMode: "HTML", replyMarkup: getToolsKeyboard() });
    return;
  }

  if (text === "📜 اقتباس وحكمة") {
    if (!isSectionEnabled("tools", config)) {
      await sendMessage(chatId, sectionDisabledMessage("tools"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendChatAction(chatId, "typing");
    await sendMessage(chatId, await getRandomQuoteMessage(), { parseMode: "HTML", replyMarkup: getToolsKeyboard() });
    return;
  }

  if (text === "❓ سؤال معلومات عامة") {
    if (!isSectionEnabled("tools", config)) {
      await sendMessage(chatId, sectionDisabledMessage("tools"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendChatAction(chatId, "typing");
    await sendMessage(chatId, await getTriviaQuestionMessage(), { parseMode: "HTML", replyMarkup: getToolsKeyboard() });
    return;
  }

  if (text === "🌤️ معرفة الطقس") {
    if (!isSectionEnabled("tools", config)) {
      await sendMessage(chatId, sectionDisabledMessage("tools"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(
      chatId,
      "🌤️ <b>خدمة معرفة الطقس</b>\n\n📍 اختر مدينة من الأزرار أو أرسل اسم أي مدينة (أو رُد على هذه الرسالة).\n\n[القسم: الطقس]",
      { parseMode: "HTML", replyMarkup: getWeatherQuickKeyboard() }
    );
    return;
  }

  if (text in WEATHER_QUICK_MAP) {
    if (!isSectionEnabled("tools", config)) {
      await sendMessage(chatId, sectionDisabledMessage("tools"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendChatAction(chatId, "typing");
    const msg = await getWeatherByCityMessage(WEATHER_QUICK_MAP[text]);
    await sendMessage(chatId, msg, { parseMode: "HTML", replyMarkup: getWeatherQuickKeyboard() });
    return;
  }

  if (text === "🌍 معلومات الدول") {
    if (!isSectionEnabled("tools", config)) {
      await sendMessage(chatId, sectionDisabledMessage("tools"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(
      chatId,
      "🌍 <b>معلومات الدول</b>\n\n🗺️ اختر دولة من الأزرار أو أرسل اسم أي دولة بالعربية أو الإنجليزية.\n\n[القسم: الدول]",
      { parseMode: "HTML", replyMarkup: getCountriesQuickKeyboard() }
    );
    return;
  }

  if (text in COUNTRY_QUICK_MAP) {
    if (!isSectionEnabled("tools", config)) {
      await sendMessage(chatId, sectionDisabledMessage("tools"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendChatAction(chatId, "typing");
    const msg = await getCountryInfoMessage(COUNTRY_QUICK_MAP[text]);
    await sendMessage(chatId, msg, { parseMode: "HTML", replyMarkup: getCountriesQuickKeyboard() });
    return;
  }

  if (text === "🎨 صورة رمزية DiceBear") {
    if (!isSectionEnabled("tools", config)) {
      await sendMessage(chatId, sectionDisabledMessage("tools"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    const seed = message.from?.username || message.from?.first_name || `star-${Date.now() % 1000}`;
    const avatar = buildDiceBearAvatarUrl(seed);
    await sendChatAction(chatId, "upload_photo");
    const sent = await sendPhotoByUrl(
      chatId,
      avatar.url,
      `🎨 <b>صورتك الرمزية من DiceBear</b>\n🔑 المفتاح: <code>${escapeHtml(avatar.seed)}</code>\n\n📌 أرسل رداً على هذه الرسالة بأي اسم لتوليد صورة رمزية مخصصة.\n\n[القسم: أفاتار]`,
      getToolsKeyboard()
    );
    if (!sent.ok) {
      await sendMessage(chatId, "⚠️ تعذر توليد الصورة الرمزية حالياً.", {
        parseMode: "HTML",
        replyMarkup: getToolsKeyboard(),
      });
    }
    return;
  }

  if (text === "😀 مكتبة الإيموجي والرموز") {
    if (!isSectionEnabled("tools", config)) {
      await sendMessage(chatId, sectionDisabledMessage("tools"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(chatId, getEmojiCategoryMessage("hearts"), {
      parseMode: "HTML",
      replyMarkup: getEmojiSubKeyboard(),
    });
    return;
  }

  if (text in EMOJI_BUTTON_MAP) {
    if (!isSectionEnabled("tools", config)) {
      await sendMessage(chatId, sectionDisabledMessage("tools"), { parseMode: "HTML", replyMarkup: getMainMenuKeyboard(isAdmin) });
      return;
    }
    await sendMessage(chatId, getEmojiCategoryMessage(EMOJI_BUTTON_MAP[text]), {
      parseMode: "HTML",
      replyMarkup: getEmojiSubKeyboard(),
    });
    return;
  }

  await handleContextOrSmartText(message, text, isAdmin);
}
