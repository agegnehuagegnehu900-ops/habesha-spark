// Cross-platform share: Capacitor on native, Web Share API on browser
import { Share } from "@capacitor/share";

export async function shareVideo(opts: { title?: string; text?: string; url: string }) {
  try {
    // Capacitor works on web too (falls back gracefully)
    await Share.share({
      title: opts.title || "Agegnehu",
      text: opts.text || "ይህን ቪዲዮ ይመልከቱ",
      url: opts.url,
      dialogTitle: "አጋራ",
    });
    return true;
  } catch {
    // Fallback to navigator.share or clipboard
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title: opts.title, text: opts.text, url: opts.url });
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(opts.url);
        return true;
      }
    } catch {}
    return false;
  }
}
