import type { ReplyMarkup } from "@/bot/types";
import { getBotConfig } from "@/lib/config";

export interface TelegramApiResponse<T = unknown> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

export interface TelegramBotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username?: string;
  can_join_groups?: boolean;
  supports_inline_queries?: boolean;
}

export interface TelegramWebhookInfo {
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
  max_connections?: number;
}

const DEFAULT_TIMEOUT_MS = 7500;

async function callTelegramJson<T>(
  method: string,
  payload: Record<string, unknown>,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<TelegramApiResponse<T>> {
  const { botToken } = getBotConfig();
  if (!botToken) {
    return { ok: false, description: "BOT_TOKEN is not configured" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = (await response.json()) as TelegramApiResponse<T>;
    return data;
  } catch (err) {
    const message = err instanceof Error && err.name === "AbortError" ? "Telegram API request timed out" : "Telegram API network error";
    return { ok: false, description: message };
  } finally {
    clearTimeout(timer);
  }
}

async function callTelegramMultipart<T>(
  method: string,
  formData: FormData,
  timeoutMs = 9000
): Promise<TelegramApiResponse<T>> {
  const { botToken } = getBotConfig();
  if (!botToken) {
    return { ok: false, description: "BOT_TOKEN is not configured" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    const data = (await response.json()) as TelegramApiResponse<T>;
    return data;
  } catch (err) {
    const message = err instanceof Error && err.name === "AbortError" ? "Telegram API upload timed out" : "Telegram API upload error";
    return { ok: false, description: message };
  } finally {
    clearTimeout(timer);
  }
}

export async function sendMessage(
  chatId: number,
  text: string,
  options?: {
    replyMarkup?: ReplyMarkup;
    parseMode?: "HTML" | "MarkdownV2";
    disableWebPagePreview?: boolean;
    replyToMessageId?: number;
  }
): Promise<TelegramApiResponse> {
  const safeText = text.length > 4090 ? `${text.slice(0, 4050)}\n\n...` : text;
  const payload: Record<string, unknown> = {
    chat_id: chatId,
    text: safeText,
  };
  if (options?.parseMode) {
    payload.parse_mode = options.parseMode;
  }
  if (options?.replyMarkup) {
    payload.reply_markup = options.replyMarkup;
  }
  if (typeof options?.disableWebPagePreview === "boolean") {
    payload.disable_web_page_preview = options.disableWebPagePreview;
  }
  if (typeof options?.replyToMessageId === "number") {
    payload.reply_to_message_id = options.replyToMessageId;
  }

  const result = await callTelegramJson("sendMessage", payload);
  if (!result.ok && options?.parseMode) {
    delete payload.parse_mode;
    return callTelegramJson("sendMessage", payload);
  }
  return result;
}

export async function sendPhotoByUrl(
  chatId: number,
  photoUrl: string,
  caption: string,
  replyMarkup?: ReplyMarkup,
  parseMode: "HTML" | undefined = "HTML"
): Promise<TelegramApiResponse> {
  const payload: Record<string, unknown> = {
    chat_id: chatId,
    photo: photoUrl,
    caption: caption.slice(0, 1000),
  };
  if (parseMode) {
    payload.parse_mode = parseMode;
  }
  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }
  return callTelegramJson("sendPhoto", payload, 9000);
}

export async function sendVideoByUrl(
  chatId: number,
  videoUrl: string,
  caption: string,
  replyMarkup?: ReplyMarkup
): Promise<TelegramApiResponse> {
  const payload: Record<string, unknown> = {
    chat_id: chatId,
    video: videoUrl,
    caption: caption.slice(0, 1000),
    parse_mode: "HTML",
    supports_streaming: true,
  };
  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }
  return callTelegramJson("sendVideo", payload, 9500);
}

export async function sendStickerBuffer(
  chatId: number,
  stickerBuffer: Buffer,
  filename: string,
  replyMarkup?: ReplyMarkup
): Promise<TelegramApiResponse> {
  const form = new FormData();
  form.append("chat_id", String(chatId));
  const blob = new Blob([new Uint8Array(stickerBuffer)], { type: "image/webp" });
  form.append("sticker", blob, filename);
  if (replyMarkup) {
    form.append("reply_markup", JSON.stringify(replyMarkup));
  }
  return callTelegramMultipart("sendSticker", form, 9000);
}

export async function sendVoiceBuffer(
  chatId: number,
  voiceBuffer: Buffer,
  filename: string,
  caption: string,
  replyMarkup?: ReplyMarkup
): Promise<TelegramApiResponse> {
  const form = new FormData();
  form.append("chat_id", String(chatId));
  const blob = new Blob([new Uint8Array(voiceBuffer)], { type: "audio/mpeg" });
  form.append("voice", blob, filename);
  if (caption) {
    form.append("caption", caption.slice(0, 1000));
    form.append("parse_mode", "HTML");
  }
  if (replyMarkup) {
    form.append("reply_markup", JSON.stringify(replyMarkup));
  }
  return callTelegramMultipart("sendVoice", form, 9000);
}

export async function sendChatAction(
  chatId: number,
  action: "typing" | "upload_photo" | "upload_video" | "upload_voice"
): Promise<void> {
  await callTelegramJson("sendChatAction", { chat_id: chatId, action }, 2000);
}

export async function getMe(): Promise<TelegramApiResponse<TelegramBotInfo>> {
  return callTelegramJson<TelegramBotInfo>("getMe", {}, 4500);
}

export async function getWebhookInfo(): Promise<TelegramApiResponse<TelegramWebhookInfo>> {
  return callTelegramJson<TelegramWebhookInfo>("getWebhookInfo", {}, 4500);
}
