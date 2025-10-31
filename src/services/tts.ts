export type SpeakOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
};

class TTSService {
  private synth: SpeechSynthesis | null;
  private defaultLang = "pt-BR";

  constructor() {
    this.synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  }

  public isSupported(): boolean {
    return !!this.synth && typeof SpeechSynthesisUtterance !== "undefined";
  }

  public cancel(): void {
    if (!this.synth) return;
    this.synth.cancel();
  }

  public speak(text: string, options?: SpeakOptions): void {
    if (!this.isSupported() || !text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.lang || this.defaultLang;
    if (typeof options?.rate === "number") utterance.rate = options.rate;
    if (typeof options?.pitch === "number") utterance.pitch = options.pitch;
    if (typeof options?.volume === "number") utterance.volume = options.volume;
    this.synth!.speak(utterance);
  }

  public describeElement(el: Element): string {
    const ariaLabel = (el.getAttribute("aria-label") || "").trim();
    const alt = (el.getAttribute("alt") || "").trim();
    const role = (el.getAttribute("role") || "").trim();
    const text = (el.textContent || "").trim();

    const parts: string[] = [];
    if (ariaLabel) parts.push(ariaLabel);
    if (!ariaLabel && alt) parts.push(alt);
    if (!ariaLabel && !alt && text) parts.push(text);
    if (role) parts.push(`(papel: ${role})`);
    return parts.join(" ");
  }
}

export const ttsService = new TTSService();


