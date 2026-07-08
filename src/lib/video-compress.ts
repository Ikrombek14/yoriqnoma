import {
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  Conversion,
  Input,
  Mp4OutputFormat,
  Output,
} from "mediabunny";

/** Supabase Free rejasida bitta faylning qattiq cheklovi — 50 MB. */
export const MAX_UPLOAD_MB = 50;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

/** Shundan kichik fayllarni siqib o'tirmaymiz — foydasi kam. */
const SKIP_UNDER_BYTES = 8 * 1024 * 1024;

/** Chiqish sifati: 720p, ~1.5 Mbit/s video + 96 kbit/s audio (~12 MB/daqiqa). */
const TARGET_WIDTH = 1280;
const VIDEO_BITRATE = 1_500_000;
const AUDIO_BITRATE = 96_000;

export interface CompressResult {
  file: File;
  /** Siqish amalga oshdimi (false — asl fayl qaytdi). */
  compressed: boolean;
}

/**
 * Videoni brauzerning o'zida (WebCodecs orqali) 720p MP4 ga siqadi.
 * Siqish imkoni bo'lmasa (eski brauzer, qo'llanmaydigan format, natija
 * asl fayldan katta) — asl faylni o'zgarishsiz qaytaradi.
 */
export async function compressVideo(
  file: File,
  onProgress?: (pct: number) => void
): Promise<CompressResult> {
  if (file.size < SKIP_UNDER_BYTES) return { file, compressed: false };
  // WebCodecs yo'q bo'lsa siqib bo'lmaydi
  if (typeof VideoEncoder === "undefined") return { file, compressed: false };

  try {
    const input = new Input({
      source: new BlobSource(file),
      formats: ALL_FORMATS,
    });
    const output = new Output({
      // fastStart: metadata fayl boshiga yoziladi — video darhol o'ynay boshlaydi
      format: new Mp4OutputFormat({ fastStart: "in-memory" }),
      target: new BufferTarget(),
    });

    const conversion = await Conversion.init({
      input,
      output,
      video: (track) => ({
        // Kichik videoni kattalashtirmaymiz
        width: Math.min(TARGET_WIDTH, track.displayWidth),
        bitrate: VIDEO_BITRATE,
      }),
      audio: { bitrate: AUDIO_BITRATE },
    });
    if (!conversion.isValid) return { file, compressed: false };

    conversion.onProgress = (p) => onProgress?.(Math.round(p * 100));
    await conversion.execute();

    const buffer = output.target.buffer;
    // Natija asl fayldan kichik bo'lsagina ishlatamiz
    if (!buffer || buffer.byteLength >= file.size) {
      return { file, compressed: false };
    }
    const name = file.name.replace(/\.[^.]+$/, "") + ".mp4";
    return {
      file: new File([buffer], name, { type: "video/mp4" }),
      compressed: true,
    };
  } catch {
    // Siqish ishlamasa — asl faylni yuklayveramiz
    return { file, compressed: false };
  }
}

export function fmtMB(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}
