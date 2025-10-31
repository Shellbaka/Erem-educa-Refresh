import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface AccessibleToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  playSound?: boolean;
}

// Audio feedback for different toast types
const playToastSound = (type: ToastType) => {
  const soundsEnabled = localStorage.getItem("sounds-enabled") !== "false";
  if (!soundsEnabled) return;

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Different frequencies and durations for different types
  const soundConfig = {
    success: { frequency: 800, duration: 0.15 },
    error: { frequency: 200, duration: 0.3 },
    warning: { frequency: 600, duration: 0.2 },
    info: { frequency: 500, duration: 0.15 },
  };

  const config = soundConfig[type];
  oscillator.frequency.value = config.frequency;
  gainNode.gain.value = 0.3;

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + config.duration);

  // Fade out
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + config.duration
  );
};

export const useAccessibleToast = () => {
  const { toast } = useToast();

  const showAccessibleToast = useCallback(
    ({ title, description, type = "info", playSound = true }: AccessibleToastOptions) => {
      // Play sound if enabled
      if (playSound) {
        playToastSound(type);
      }

      // Show visual toast
      toast({
        title,
        description,
        variant: type === "error" ? "destructive" : "default",
        className: type === "success" 
          ? "border-success bg-success/10" 
          : type === "warning"
          ? "border-accent bg-accent/10"
          : "",
      });

      // Vibration feedback on mobile (if supported)
      if (navigator.vibrate && type === "error") {
        navigator.vibrate([100, 50, 100]);
      } else if (navigator.vibrate && type === "success") {
        navigator.vibrate(100);
      }
    },
    [toast]
  );

  return { showAccessibleToast };
};
