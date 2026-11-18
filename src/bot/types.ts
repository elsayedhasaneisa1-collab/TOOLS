export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramChat {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
  title?: string;
  username?: string;
  first_name?: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  reply_to_message?: TelegramMessage;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
}

export interface KeyboardButton {
  text: string;
}

export interface ReplyKeyboardMarkup {
  keyboard: KeyboardButton[][];
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
  is_persistent?: boolean;
  input_field_placeholder?: string;
}

export interface ReplyKeyboardRemove {
  remove_keyboard: true;
}

export type ReplyMarkup = ReplyKeyboardMarkup | ReplyKeyboardRemove;

export type SectionKey =
  | "decoration_ar"
  | "decoration_en"
  | "decoration_num"
  | "decoration_sentence"
  | "bio_ig"
  | "bio_tg"
  | "age"
  | "zodiac"
  | "stickers"
  | "voices"
  | "fortune"
  | "downloader"
  | "tools";

export interface BotResponse {
  text: string;
  replyMarkup?: ReplyMarkup;
  parseMode?: "HTML" | "MarkdownV2";
  disableWebPagePreview?: boolean;
}

export interface RequestDiagnostics {
  updateId: number;
  receivedAtIso: string;
  startedAtMs: number;
  messageType: string;
  payloadBytes: number;
  isAdmin: boolean;
  chatType: string;
}
