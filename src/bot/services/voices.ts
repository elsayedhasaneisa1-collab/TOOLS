import { readFile } from "node:fs/promises";
import path from "node:path";
import { VOICE_ASSETS, type VoiceAsset, type VoiceCategoryKey } from "@/bot/data/assets";

export function pickVoiceAsset(category?: VoiceCategoryKey): VoiceAsset {
  const pool = category ? VOICE_ASSETS.filter((v) => v.category === category) : VOICE_ASSETS;
  const list = pool.length > 0 ? pool : VOICE_ASSETS;
  return list[Math.floor(Math.random() * list.length)];
}

export async function loadVoiceBuffer(asset: VoiceAsset): Promise<Buffer> {
  const safeName = path.basename(asset.filename);
  const fullPath = path.join(process.cwd(), "src", "bot", "assets", "voices", safeName);
  return readFile(fullPath);
}

export async function verifyVoicesIntegrity(): Promise<{ ok: boolean; count: number }> {
  let valid = 0;
  for (const item of VOICE_ASSETS) {
    try {
      const buf = await loadVoiceBuffer(item);
      if (buf.byteLength > 100) {
        valid += 1;
      }
    } catch {
      return { ok: false, count: valid };
    }
  }
  return { ok: valid === VOICE_ASSETS.length, count: valid };
}
