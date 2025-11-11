import { useEffect } from "react";

const DEFICIENCY_CLASS_MAP: Record<string, string> = {
  Visual: "deficiency-visual",
  Auditiva: "deficiency-auditiva",
};

export function useDeficiencyTheme(deficiency?: string | null) {
  useEffect(() => {
    const classList = document.body.classList;
    Object.values(DEFICIENCY_CLASS_MAP).forEach((cls) => classList.remove(cls));

    if (deficiency && DEFICIENCY_CLASS_MAP[deficiency]) {
      classList.add(DEFICIENCY_CLASS_MAP[deficiency]);
    }

    return () => {
      Object.values(DEFICIENCY_CLASS_MAP).forEach((cls) => classList.remove(cls));
    };
  }, [deficiency]);
}
