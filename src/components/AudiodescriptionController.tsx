import { useEffect, useRef } from "react";
import { ttsService } from "@/services/tts";

// Enables basic audiodescription using focus and hover announcements
export const AudiodescriptionController = () => {
  const enabledRef = useRef<boolean>(
    typeof window !== "undefined" && localStorage.getItem("audio-description-enabled") === "true"
  );

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const custom = e as CustomEvent<{ enabled: boolean }>;
      enabledRef.current = !!custom.detail?.enabled;
      if (!enabledRef.current) {
        ttsService.cancel();
      }
    };

    window.addEventListener("audio-description-toggle", handleToggle as EventListener);
    return () => window.removeEventListener("audio-description-toggle", handleToggle as EventListener);
  }, []);

  useEffect(() => {
    const onFocus = (ev: FocusEvent) => {
      if (!enabledRef.current) return;
      const target = ev.target as Element;
      const description = ttsService.describeElement(target);
      if (description) ttsService.speak(description);
    };

    const onMouseEnter = (ev: MouseEvent) => {
      if (!enabledRef.current) return;
      const target = ev.target as Element;
      const description = ttsService.describeElement(target);
      if (description) ttsService.speak(description);
    };

    const onClick = (ev: MouseEvent) => {
      if (!enabledRef.current) return;
      const target = ev.target as Element;
      const description = ttsService.describeElement(target);
      if (description) ttsService.speak(`${description}. Ativado.`);
    };

    document.addEventListener("focusin", onFocus);
    document.addEventListener("mouseenter", onMouseEnter, { capture: true });
    document.addEventListener("click", onClick, { capture: true });

    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("mouseenter", onMouseEnter, { capture: true } as any);
      document.removeEventListener("click", onClick, { capture: true } as any);
    };
  }, []);

  return null;
};


