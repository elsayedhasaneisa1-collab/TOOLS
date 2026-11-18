import { escapeHtml, validateExternalUrl } from "@/lib/security";

export type PlatformId = "tiktok" | "instagram" | "facebook" | "pinterest" | "stories" | "other";

export interface DownloadResolution {
  ok: boolean;
  platform: PlatformId;
  platformLabel: string;
  mediaType?: "video" | "photo";
  mediaUrl?: string;
  title?: string;
  sizeBytes?: number;
  tooLargeForTelegram?: boolean;
  messageHtml: string;
}

const MAX_TELEGRAM_MEDIA_BYTES = 18 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 5500;

const SOURCE_DOMAINS = [
  "tiktok.com",
  "instagram.com",
  "instagr.am",
  "facebook.com",
  "fb.com",
  "fb.watch",
  "pinterest.com",
  "pinterest.co.uk",
  "pin.it",
  "reddit.com",
  "redd.it",
  "youtube.com",
  "youtu.be",
  "x.com",
  "twitter.com",
  "vimeo.com",
];

const MEDIA_DOMAINS = [
  "tiktokcdn.com",
  "tiktokcdn-us.com",
  "tiktokv.com",
  "tikwm.com",
  "byteimg.com",
  "cdninstagram.com",
  "fbcdn.net",
  "pinimg.com",
  "redditmedia.com",
  "redd.it",
  "twimg.com",
  "ytimg.com",
  "vimeocdn.com",
];

function hostMatches(hostname: string, domain: string): boolean {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function isTrustedDomain(hostname: string, domains: string[]): boolean {
  const host = hostname.toLowerCase();
  return domains.some((domain) => hostMatches(host, domain));
}

export function isSupportedSourceUrl(url: URL): boolean {
  return url.protocol === "https:" && isTrustedDomain(url.hostname, [...SOURCE_DOMAINS, ...MEDIA_DOMAINS]);
}

function isTrustedMediaUrl(url: URL): boolean {
  return url.protocol === "https:" && isTrustedDomain(url.hostname, MEDIA_DOMAINS);
}

export function detectPlatform(url: URL): PlatformId {
  const host = url.hostname.toLowerCase();
  const path = url.pathname.toLowerCase();

  if (isTrustedDomain(host, ["tiktok.com"])) return "tiktok";
  if (isTrustedDomain(host, ["pinterest.com", "pinterest.co.uk", "pin.it", "pinimg.com"])) return "pinterest";
  if (isTrustedDomain(host, ["instagram.com", "instagr.am", "cdninstagram.com"])) {
    return path.includes("/stories/") || path.includes("/story/") ? "stories" : "instagram";
  }
  if (isTrustedDomain(host, ["facebook.com", "fb.com", "fb.watch", "fbcdn.net"])) {
    return path.includes("/stories/") || path.includes("/story/") ? "stories" : "facebook";
  }
  return "other";
}

export function getPlatformLabel(platform: PlatformId): string {
  switch (platform) {
    case "tiktok":
      return "TikTok";
    case "instagram":
      return "Instagram";
    case "facebook":
      return "Facebook";
    case "pinterest":
      return "Pinterest";
    case "stories":
      return "الستوريات العامة";
    default:
      return "منصة خارجية";
  }
}

async function probeContentLength(mediaUrl: string): Promise<number | undefined> {
  const check = validateExternalUrl(mediaUrl);
  if (!check.ok || !isTrustedMediaUrl(check.url)) {
    return undefined;
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 3000);
  try {
    let current = check.url;
    for (let hop = 0; hop < 3; hop++) {
      const res = await fetch(current.toString(), {
        method: "HEAD",
        signal: ctrl.signal,
        redirect: "manual",
      });
      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (!location) return undefined;
        const next = validateExternalUrl(new URL(location, current).toString());
        if (!next.ok || !isTrustedMediaUrl(next.url)) return undefined;
        current = next.url;
        continue;
      }
      if (!res.ok) return undefined;
      const raw = res.headers.get("content-length");
      return raw && /^\d+$/.test(raw) ? Number(raw) : undefined;
    }
    return undefined;
  } catch {
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}

async function resolveTikTok(url: URL): Promise<DownloadResolution> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);

  try {
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url.toString())}`;
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
      signal: ctrl.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        ok: false,
        platform: "tiktok",
        platformLabel: "TikTok",
        messageHtml:
          `📥 <b>التحميل من TikTok</b>\n\n` +
          `⚠️ تعذر الوصول إلى خدمة التحليل العامة حالياً (HTTP ${res.status}). يرجى المحاولة لاحقاً.`,
      };
    }

    const json = (await res.json()) as {
      code?: number;
      msg?: string;
      data?: {
        title?: string;
        play?: string;
        wmplay?: string;
        images?: string[];
        size?: number;
      };
    };

    const videoUrl = json.data?.play || json.data?.wmplay;
    const firstImage = json.data?.images?.[0];

    if (json.code !== 0 || (!videoUrl && !firstImage)) {
      return {
        ok: false,
        platform: "tiktok",
        platformLabel: "TikTok",
        messageHtml:
          `📥 <b>التحميل من TikTok</b>\n\n` +
          `⚠️ تعذر استخراج الوسائط من هذا الرابط. تأكد أن المقطع عام وليس خاصاً أو محذوفاً.`,
      };
    }

    const targetUrl = videoUrl || firstImage || "";
    const validatedMedia = validateExternalUrl(targetUrl);
    if (!validatedMedia.ok || !isTrustedMediaUrl(validatedMedia.url)) {
      return {
        ok: false,
        platform: "tiktok",
        platformLabel: "TikTok",
        messageHtml: "⚠️ رابط الوسائط الناتج ليس من نطاق موثوق أو لم يجتز الفحص الأمني.",
      };
    }

    const mediaType = videoUrl ? "video" : "photo";
    const sizeBytes = json.data?.size || (await probeContentLength(validatedMedia.url.toString()));
    const tooLarge = typeof sizeBytes === "number" && sizeBytes > MAX_TELEGRAM_MEDIA_BYTES;
    const title = (json.data?.title ?? "مقطع TikTok عام").trim().slice(0, 140);

    if (tooLarge) {
      const sizeMb = (sizeBytes / (1024 * 1024)).toFixed(1);
      return {
        ok: true,
        platform: "tiktok",
        platformLabel: "TikTok",
        mediaType,
        mediaUrl: validatedMedia.url.toString(),
        title,
        sizeBytes,
        tooLargeForTelegram: true,
        messageHtml:
          `📥 <b>تم العثور على الفيديو (TikTok)</b>\n\n` +
          `📝 الوصف: ${escapeHtml(title)}\n` +
          `📦 الحجم: <b>${sizeMb} MB</b> (يتجاوز حد الإرسال المباشر عبر الخادم)\n\n` +
          `🔗 رابط التحميل المباشر العام:\n${escapeHtml(validatedMedia.url.toString())}`,
      };
    }

    return {
      ok: true,
      platform: "tiktok",
      platformLabel: "TikTok",
      mediaType,
      mediaUrl: validatedMedia.url.toString(),
      title,
      sizeBytes,
      tooLargeForTelegram: false,
      messageHtml: `📥 <b>وسائط TikTok العامة</b>\n\n📝 ${escapeHtml(title)}`,
    };
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return {
      ok: false,
      platform: "tiktok",
      platformLabel: "TikTok",
      messageHtml:
        `📥 <b>التحميل من TikTok</b>\n\n` +
        `⚠️ ${isTimeout ? "انتهت مهلة الاتصال بخدمة التحليل." : "حدث خطأ أثناء معالجة رابط TikTok."}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

function extractMetaContent(html: string, property: string): string | undefined {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, "i"),
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match?.[1]) {
      return match[1].replace(/&amp;/g, "&").trim();
    }
  }
  return undefined;
}

async function readSmallHtml(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  const parts: string[] = [];
  let bytesRead = 0;
  const maxBytes = 260_000;

  while (bytesRead < maxBytes) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = value.subarray(0, maxBytes - bytesRead);
    parts.push(decoder.decode(chunk, { stream: true }));
    bytesRead += chunk.length;
    if (bytesRead >= maxBytes) {
      await reader.cancel();
      break;
    }
  }
  return parts.join("");
}

async function resolvePublicOpenGraph(url: URL, platform: PlatformId): Promise<DownloadResolution> {
  const platformLabel = getPlatformLabel(platform);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);

  try {
    let currentUrl = url;
    let response: Response | null = null;
    for (let hop = 0; hop < 3; hop++) {
      response = await fetch(currentUrl.toString(), {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; TelegramBotHelper/1.0)",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "manual",
        signal: ctrl.signal,
      });

      if (response.status >= 300 && response.status < 400) {
        const loc = response.headers.get("location");
        if (!loc) break;
        const resolved = new URL(loc, currentUrl);
        const check = validateExternalUrl(resolved.toString());
        if (!check.ok || !isSupportedSourceUrl(check.url)) {
          return {
            ok: false,
            platform,
            platformLabel,
            messageHtml: "⚠️ تم إيقاف إعادة التوجيه إلى نطاق غير مدعوم لأسباب أمنية.",
          };
        }
        if (resolved.pathname.toLowerCase().includes("login")) {
          return {
            ok: false,
            platform,
            platformLabel,
            messageHtml:
              `📥 <b>التحميل من ${platformLabel}</b>\n\n` +
              `🔒 هذا المحتوى يتطلب تسجيل دخول أو ينتمي لحساب مقيد.\n` +
              `⚠️ البوت يدعم المحتوى العام المتاح بدون تسجيل دخول فقط، ولا يتجاوز قيود الحماية.`,
          };
        }
        currentUrl = check.url;
        continue;
      }
      break;
    }

    if (!response || !response.ok) {
      return {
        ok: false,
        platform,
        platformLabel,
        messageHtml:
          `📥 <b>التحميل من ${platformLabel}</b>\n\n` +
          `⚠️ لم يتمكن البوت من الوصول للرابط بشكل عام (رمز الحالة: ${response?.status ?? "غير متاح"}).\n` +
          `📌 قد يكون المنشور خاصاً أو يتطلب تسجيل دخول في المنصة.`,
      };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.startsWith("video/") || contentType.startsWith("image/")) {
      if (!isTrustedMediaUrl(currentUrl)) {
        await response.body?.cancel();
        return {
          ok: false,
          platform,
          platformLabel,
          messageHtml: "⚠️ تعذر إرسال الملف لأن عنوان الوسائط ليس من مصدر موثوق.",
        };
      }
      await response.body?.cancel();
      const sizeBytes = await probeContentLength(currentUrl.toString());
      const mediaType = contentType.startsWith("video/") ? "video" : "photo";
      if (typeof sizeBytes === "number" && sizeBytes > MAX_TELEGRAM_MEDIA_BYTES) {
        return {
          ok: true,
          platform,
          platformLabel,
          mediaType,
          mediaUrl: currentUrl.toString(),
          sizeBytes,
          tooLargeForTelegram: true,
          messageHtml:
            `📥 <b>تم التحقق من الملف المباشر</b>\n\n` +
            `📦 الحجم يتجاوز حد الإرسال المباشر (${(sizeBytes / (1024 * 1024)).toFixed(1)} MB).\n` +
            `🔗 رابط مباشر:\n${escapeHtml(currentUrl.toString())}`,
        };
      }
      return {
        ok: true,
        platform,
        platformLabel,
        mediaType,
        mediaUrl: currentUrl.toString(),
        sizeBytes,
        tooLargeForTelegram: false,
        messageHtml: `📥 <b>ملف عام من ${platformLabel}</b>`,
      };
    }

    const rawText = await readSmallHtml(response);
    const ogVideo = extractMetaContent(rawText, "og:video:secure_url") || extractMetaContent(rawText, "og:video");
    const ogImage = extractMetaContent(rawText, "og:image");
    const ogTitle = extractMetaContent(rawText, "og:title") || `محتوى عام من ${platformLabel}`;

    const candidateUrl = ogVideo || ogImage;
    if (!candidateUrl) {
      return {
        ok: false,
        platform,
        platformLabel,
        messageHtml:
          `📥 <b>التحميل من ${platformLabel}</b>\n\n` +
          `⚠️ لم تتوفر وسائط عامة قابلة للاستخراج من هذا الرابط.\n` +
          `ℹ️ قيود منصات مثل Instagram وFacebook والستوريات تمنع الوصول دون تسجيل دخول، والنظام يلتزم بدعم المحتوى العام المتاح فقط.`,
      };
    }

    const mediaCheck = validateExternalUrl(candidateUrl);
    if (!mediaCheck.ok || !isTrustedMediaUrl(mediaCheck.url)) {
      return {
        ok: false,
        platform,
        platformLabel,
        messageHtml: "⚠️ رابط الوسائط المستخرج ليس من نطاق موثوق أو لم يجتز الفحص الأمني.",
      };
    }

    const mediaType = ogVideo ? "video" : "photo";
    const previewNote = mediaType === "photo" ? "\n🖼️ هذه الصورة المتاحة علناً؛ قد تكون معاينة للمنشور وليست الفيديو الأصلي." : "";
    const sizeBytes = await probeContentLength(mediaCheck.url.toString());
    const tooLarge = typeof sizeBytes === "number" && sizeBytes > MAX_TELEGRAM_MEDIA_BYTES;

    if (tooLarge) {
      return {
        ok: true,
        platform,
        platformLabel,
        mediaType,
        mediaUrl: mediaCheck.url.toString(),
        title: ogTitle,
        sizeBytes,
        tooLargeForTelegram: true,
        messageHtml:
          `📥 <b>تم العثور على الوسائط (${platformLabel})</b>\n\n` +
          `📝 ${escapeHtml(ogTitle.slice(0, 120))}${previewNote}\n` +
          `📦 الحجم يتجاوز حد الإرسال المباشر.\n` +
          `🔗 الرابط العام:\n${escapeHtml(mediaCheck.url.toString())}`,
      };
    }

    return {
      ok: true,
      platform,
      platformLabel,
      mediaType,
      mediaUrl: mediaCheck.url.toString(),
      title: ogTitle.slice(0, 120),
      sizeBytes,
      tooLargeForTelegram: false,
      messageHtml: `📥 <b>${escapeHtml(platformLabel)}</b>\n\n📝 ${escapeHtml(ogTitle.slice(0, 120))}${previewNote}`,
    };
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return {
      ok: false,
      platform,
      platformLabel,
      messageHtml:
        `📥 <b>التحميل من ${platformLabel}</b>\n\n` +
        `⚠️ ${isTimeout ? "انتهت مهلة الاتصال بالمصدر." : "تعذر جلب الرابط أو تحليله حالياً."}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function resolvePublicDownload(rawUrl: string): Promise<DownloadResolution> {
  const validated = validateExternalUrl(rawUrl);
  if (!validated.ok) {
    return {
      ok: false,
      platform: "other",
      platformLabel: "رابط غير صالح",
      messageHtml: `⚠️ <b>تعذر فحص الرابط</b>\n\n${escapeHtml(validated.reason)}`,
    };
  }

  if (!isSupportedSourceUrl(validated.url)) {
    return {
      ok: false,
      platform: "other",
      platformLabel: "منصة غير مدعومة",
      messageHtml:
        "⚠️ <b>الرابط غير مدعوم بأمان</b>\n\n" +
        "أرسل رابط HTTPS عاماً من TikTok أو Instagram أو Facebook أو Pinterest أو Reddit أو YouTube أو X أو Vimeo فقط.",
    };
  }

  const platform = detectPlatform(validated.url);
  if (platform === "tiktok") {
    return resolveTikTok(validated.url);
  }

  return resolvePublicOpenGraph(validated.url, platform);
}
