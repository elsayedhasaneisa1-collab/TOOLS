import { NextRequest, NextResponse } from "next/server";
import { processTelegramUpdate } from "@/bot/handlers/router";
import type { RequestDiagnostics, TelegramUpdate } from "@/bot/types";
import { getBotConfig } from "@/lib/config";
import { isAdminUser, verifyWebhookSecret } from "@/lib/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_WEBHOOK_BODY_BYTES = 65_536;

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "telegram-webhook",
    mode: "stateless",
  });
}

export async function POST(request: NextRequest) {
  const startedAtMs = Date.now();
  const config = getBotConfig();

  if (!config.webhookSecret) {
    return NextResponse.json({ ok: false, error: "webhook_not_configured" }, { status: 500 });
  }

  const secretHeader = request.headers.get("x-telegram-bot-api-secret-token");
  if (!verifyWebhookSecret(secretHeader, config.webhookSecret)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let rawBody = "";
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const payloadBytes = Buffer.byteLength(rawBody, "utf8");
  if (payloadBytes === 0 || payloadBytes > MAX_WEBHOOK_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "payload_out_of_bounds" }, { status: 400 });
  }

  let update: TelegramUpdate;
  try {
    update = JSON.parse(rawBody) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!update || typeof update.update_id !== "number") {
    return NextResponse.json({ ok: false, error: "invalid_update" }, { status: 400 });
  }

  const message = update.message;
  if (!message) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const diagnostics: RequestDiagnostics = {
    updateId: update.update_id,
    receivedAtIso: new Date(startedAtMs).toISOString(),
    startedAtMs,
    messageType: message.text ? "text" : "other",
    payloadBytes,
    isAdmin: isAdminUser(message.from?.id, config),
    chatType: message.chat?.type ?? "unknown",
  };

  try {
    await processTelegramUpdate(update, diagnostics);
  } catch {
    return NextResponse.json({ ok: true, handled: false });
  }

  return NextResponse.json({ ok: true });
}
