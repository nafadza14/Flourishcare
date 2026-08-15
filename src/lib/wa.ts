/**
 * Normalisasi nomor Indonesia ke format wa.me:
 *  - "08626262722"      → "628626262722"
 *  - "+628626262722"    → "628626262722"
 *  - "628626262722"     → "628626262722"
 *  - "0862 6262 722"    → "628626262722"
 *  - "(+62) 812-3456"   → "62812345 6"
 */
export function toWaNumber(raw: string | null | undefined): string {
  if (!raw) return "";
  // Hapus semua karakter non-digit
  let n = String(raw).replace(/\D/g, "");
  // Kalau mulai dengan 62, biarkan
  if (n.startsWith("62")) return n;
  // Kalau mulai dengan 0, ganti dengan 62
  if (n.startsWith("0")) return "62" + n.slice(1);
  // Kalau mulai dengan 8 (tanpa 0 atau 62), tambah 62 di depan
  if (n.startsWith("8")) return "62" + n;
  return n;
}

/** URL lengkap ke WhatsApp web/app. Opsional prefill message. */
export function waLink(raw: string | null | undefined, message?: string): string {
  const num = toWaNumber(raw);
  if (!num) return "#";
  const base = `https://wa.me/${num}`;
  if (message) return `${base}?text=${encodeURIComponent(message)}`;
  return base;
}

/** Format tampilan nomor: 08... jadi 0812-3456-7890 */
export function formatWaDisplay(raw: string | null | undefined): string {
  if (!raw) return "-";
  let n = String(raw).replace(/\D/g, "");
  // Kalau 62..., ubah jadi 0...
  if (n.startsWith("62")) n = "0" + n.slice(2);
  if (n.length < 4) return n;
  // Format: 0812-3456-7890
  return n.slice(0, 4) + "-" + n.slice(4, 8) + (n.length > 8 ? "-" + n.slice(8) : "");
}
