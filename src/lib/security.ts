import { createHash, timingSafeEqual } from "node:crypto";
import { getBotConfig, type BotConfig } from "@/lib/config";

export function verifyWebhookSecret(headerToken: string | null, expectedSecret: string): boolean {
  if (!expectedSecret || !headerToken) {
    return false;
  }
  const actualHash = createHash("sha256").update(headerToken).digest();
  const expectedHash = createHash("sha256").update(expectedSecret).digest();
  return timingSafeEqual(actualHash, expectedHash);
}

export function isAdminUser(userId: number | undefined, config: BotConfig = getBotConfig()): boolean {
  if (typeof userId !== "number" || !Number.isSafeInteger(userId) || userId <= 0) {
    return false;
  }
  return config.adminIds.has(userId);
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function sanitizeUserText(raw: string, maxLength = 600): string {
  const cleaned = raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
  if (cleaned.length > maxLength) {
    return cleaned.slice(0, maxLength);
  }
  return cleaned;
}

function isPrivateOrBlockedIpv4(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) {
    return false;
  }
  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return true;
  }
  const [a, b] = nums;
  if (a === 0 || a === 10 || a === 127) {
    return true;
  }
  if (a === 169 && b === 254) {
    return true;
  }
  if (a === 172 && b >= 16 && b <= 31) {
    return true;
  }
  if (a === 192 && b === 168) {
    return true;
  }
  if (a === 100 && b >= 64 && b <= 127) {
    return true;
  }
  if (a >= 224) {
    return true;
  }
  return false;
}

function isBlockedHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (!host) {
    return true;
  }
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.endsWith(".arpa")
  ) {
    return true;
  }
  if (/^\d+$/.test(host) || /^0x[0-9a-f]+$/i.test(host)) {
    return true;
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    return isPrivateOrBlockedIpv4(host);
  }
  if (host.includes(":")) {
    if (
      host === "::" ||
      host === "::1" ||
      host.startsWith("fe80:") ||
      host.startsWith("fc") ||
      host.startsWith("fd") ||
      host.includes("::ffff:")
    ) {
      return true;
    }
  }
  if (!host.includes(".")) {
    return true;
  }
  return false;
}

export function validateExternalUrl(rawUrl: string): { ok: true; url: URL } | { ok: false; reason: string } {
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed.length > 1000) {
    return { ok: false, reason: "الرابط فارغ أو أطول من الحد المسموح (1000 حرف)." };
  }
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, reason: "صيغة الرابط غير صالحة. يرجى إرسال رابط يبدأ بـ https://" };
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { ok: false, reason: "يُسمح فقط بروابط HTTP و HTTPS العامة." };
  }
  if (parsed.username || parsed.password) {
    return { ok: false, reason: "غير مسموح بالروابط التي تحتوي على بيانات تسجيل دخول." };
  }
  if (parsed.port && parsed.port !== "80" && parsed.port !== "443") {
    return { ok: false, reason: "منفذ الرابط غير مسموح به لأسباب أمنية." };
  }
  if (isBlockedHostname(parsed.hostname)) {
    return { ok: false, reason: "هذا النطاق محجوب لأسباب أمنية." };
  }
  return { ok: true, url: parsed };
}
