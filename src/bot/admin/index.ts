import type { RequestDiagnostics, SectionKey } from "@/bot/types";
import { DEVELOPER_SIGNATURE, getBotConfig, SECTION_LABELS } from "@/lib/config";
import { escapeHtml, isAdminUser } from "@/lib/security";
import { getMe, getWebhookInfo } from "@/lib/telegram";
import { calculateAgeDetails } from "@/bot/services/ageZodiac";
import { getRandomBioAcrossAll } from "@/bot/services/bios";
import { decorateArabicName, decorateEnglishName, decorateNumbers, decorateSentence } from "@/bot/services/decoration";
import { getEntertainmentFortuneMessage } from "@/bot/services/fortune";
import { verifyStickersIntegrity } from "@/bot/services/stickers";
import { pingExternalApis } from "@/bot/services/tools";
import { verifyVoicesIntegrity } from "@/bot/services/voices";

export function unauthorizedAdminMessage(): string {
  return "⛔ <b>وصول مرفوض</b>\n\nهذا القسم مخصص لمالك البوت فقط.";
}

export async function getRuntimeInfoMessage(userId: number | undefined): Promise<string> {
  if (!isAdminUser(userId)) {
    return unauthorizedAdminMessage();
  }
  const cfg = getBotConfig();
  const webhook = await getWebhookInfo();
  const memMb = (process.memoryUsage().rss / (1024 * 1024)).toFixed(1);
  const webhookUrlStatus = webhook.ok && webhook.result?.url ? "مربوط ✅" : "غير مضبوط أو تعذر الفحص ⚠️";
  const pendingCount = webhook.ok && webhook.result ? webhook.result.pending_update_count : 0;
  const lastErr = webhook.ok && webhook.result?.last_error_message ? escapeHtml(webhook.result.last_error_message) : "لا يوجد";

  return (
    `📊 <b>معلومات التشغيل الحالية</b>\n\n` +
    `⚡ البيئة: <b>Vercel Serverless (Stateless)</b>\n` +
    `🟢 إصدار Node.js: <b>${escapeHtml(process.version)}</b>\n` +
    `💾 ذاكرة الطلب الحالي: <b>${memMb} MB</b>\n` +
    `🗄️ قاعدة البيانات: <b>معطّلة نهائياً (بدون تخزين)</b>\n` +
    `🛠️ وضع الصيانة: <b>${cfg.maintenanceMode ? "مفعّل 🟠" : "غير مفعّل 🟢"}</b>\n\n` +
    `🔗 حالة Webhook: <b>${webhookUrlStatus}</b>\n` +
    `📬 التحديثات المعلقة: <b>${pendingCount}</b>\n` +
    `⚠️ آخر خطأ Webhook: <code>${lastErr}</code>`
  );
}

export function getSectionsManagementMessage(userId: number | undefined): string {
  if (!isAdminUser(userId)) {
    return unauthorizedAdminMessage();
  }
  const cfg = getBotConfig();
  const keys = Object.keys(SECTION_LABELS) as SectionKey[];
  const lines = keys.map((key) => {
    const enabled = !cfg.disabledSections.has(key);
    return `${enabled ? "🟢" : "🔴"} <b>${SECTION_LABELS[key]}</b> — <code>${key}</code>`;
  });

  return (
    `🧩 <b>إدارة الأقسام (Stateless)</b>\n\n` +
    `${lines.join("\n")}\n\n` +
    `ℹ️ لتعطيل أي قسم بشكل دائم دون قاعدة بيانات، أضف مفتاحه إلى متغير البيئة:\n` +
    `<code>DISABLED_SECTIONS</code> في إعدادات Vercel.`
  );
}

export async function getBotSettingsMessage(userId: number | undefined): Promise<string> {
  if (!isAdminUser(userId)) {
    return unauthorizedAdminMessage();
  }
  const cfg = getBotConfig();
  const me = await getMe();
  const botDisplay = me.ok && me.result ? `@${escapeHtml(me.result.username ?? cfg.botUsername)}` : cfg.botUsername ? `@${escapeHtml(cfg.botUsername)}` : "غير محدد";
  const botName = me.ok && me.result ? escapeHtml(me.result.first_name) : "البوت العربي الشامل";

  return (
    `⚙️ <b>إعدادات البوت الحالية</b>\n\n` +
    `🤖 اسم البوت: <b>${botName}</b>\n` +
    `🔗 المعرّف: <b>${botDisplay}</b>\n` +
    `👨‍💻 المطور: <b>${escapeHtml(cfg.developerName)}</b>\n` +
    `🛡️ عدد المدراء المصرّح لهم: <b>${cfg.adminIds.size}</b>\n` +
    `🔐 Webhook Secret: <b>${cfg.webhookSecret ? "مُفعّل ✅" : "غير مضبوط ⚠️"}</b>\n` +
    `🛠️ وضع الصيانة (MAINTENANCE_MODE): <b>${cfg.maintenanceMode ? "مفعّل 🟠" : "متوقف 🟢"}</b>\n` +
    `📂 عدد الأقسام الرئيسية: <b>${Object.keys(SECTION_LABELS).length}</b>\n\n` +
    `💜 ${DEVELOPER_SIGNATURE}`
  );
}

export async function runLocalServicesTest(userId: number | undefined): Promise<string> {
  if (!isAdminUser(userId)) {
    return unauthorizedAdminMessage();
  }
  const started = Date.now();
  const ar = decorateArabicName("محمد");
  const en = decorateEnglishName("Noor");
  const num = decorateNumbers("2026");
  const sent = decorateSentence("الأمل يصنع المستحيل");
  const age = calculateAgeDetails({ year: 2000, month: 5, day: 15 });
  const bio = getRandomBioAcrossAll();
  const fortune = getEntertainmentFortuneMessage("fortune");
  const stickers = await verifyStickersIntegrity();
  const voices = await verifyVoicesIntegrity();
  const elapsed = Date.now() - started;

  return (
    `🔍 <b>نتيجة اختبار الخدمات المحلية</b>\n\n` +
    `• الزخرفة العربية: <b>${ar.count >= 30 ? `ناجح ✅ (${ar.count} شكلاً)` : "تحذير ⚠️"}</b>\n` +
    `• الزخرفة الإنجليزية: <b>${en.count >= 30 ? `ناجح ✅ (${en.count} شكلاً)` : "تحذير ⚠️"}</b>\n` +
    `• زخرفة الأرقام: <b>${num.count >= 15 ? `ناجح ✅ (${num.count} شكلاً)` : "تحذير ⚠️"}</b>\n` +
    `• زخرفة الجمل: <b>${sent.count >= 20 ? `ناجح ✅ (${sent.count} شكلاً)` : "تحذير ⚠️"}</b>\n` +
    `• العمر والأبراج: <b>${age.years >= 0 && age.zodiac.nameAr ? "ناجح ✅" : "فشل ❌"}</b>\n` +
    `• مكتبة البايوهات: <b>${bio.length > 20 ? "ناجح ✅" : "فشل ❌"}</b>\n` +
    `• الخيرة الترفيهية: <b>${fortune.includes("للترفيه") ? "ناجح ✅" : "فشل ❌"}</b>\n` +
    `• الملصقات المضمّنة: <b>${stickers.ok ? `ناجح ✅ (${stickers.count} ملفاً)` : `ناقص ⚠️ (${stickers.count})`}</b>\n` +
    `• الفويزات المضمّنة: <b>${voices.ok ? `ناجح ✅ (${voices.count} ملفاً)` : `ناقص ⚠️ (${voices.count})`}</b>\n\n` +
    `⏱️ زمن الاختبار الكلي: <b>${elapsed}ms</b>`
  );
}

export async function getExternalApisStatusMessage(userId: number | undefined): Promise<string> {
  if (!isAdminUser(userId)) {
    return unauthorizedAdminMessage();
  }
  const results = await pingExternalApis();
  const lines = results.map(
    (r) => `${r.ok ? "🟢" : "🔴"} <b>${escapeHtml(r.name)}</b>: ${escapeHtml(r.status)} (${r.latencyMs}ms)`
  );
  const healthyCount = results.filter((r) => r.ok).length;

  return (
    `🌐 <b>حالة واجهات APIs الخارجية (اختبار فوري)</b>\n\n` +
    `${lines.join("\n")}\n\n` +
    `📊 الجاهزية الآن: <b>${healthyCount}/${results.length}</b> خدمة متاحة.`
  );
}

export function getCurrentRequestMonitorMessage(
  userId: number | undefined,
  diag: RequestDiagnostics
): string {
  if (!isAdminUser(userId)) {
    return unauthorizedAdminMessage();
  }
  const elapsedMs = Date.now() - diag.startedAtMs;
  return (
    `📈 <b>مراقبة الطلب الحالي (بدون تخزين)</b>\n\n` +
    `🆔 رقم التحديث (Update ID): <code>${diag.updateId}</code>\n` +
    `🕒 وقت الاستلام: <code>${escapeHtml(diag.receivedAtIso)}</code>\n` +
    `💬 نوع المحادثة: <b>${escapeHtml(diag.chatType)}</b>\n` +
    `📩 نوع الرسالة: <b>${escapeHtml(diag.messageType)}</b>\n` +
    `📦 حجم الطلب: <b>${diag.payloadBytes} بايت</b>\n` +
    `⚡ زمن المعالجة حتى الآن: <b>${elapsedMs}ms</b>\n` +
    `🛡️ صلاحية المالك: <b>مؤكدة ✅</b>`
  );
}
