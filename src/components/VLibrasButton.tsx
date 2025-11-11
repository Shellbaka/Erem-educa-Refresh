import { Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const VLibrasButton = () => {
  const [isActive, setIsActive] = useState(false);
  const { profile } = useCurrentUser();
  const highlight = profile?.deficiencia === "Auditiva";

  const toggleVLibras = () => {
    const vLibrasButton = document.querySelector('[vw-access-button]') as HTMLElement;
    if (vLibrasButton) {
      vLibrasButton.click();
      setIsActive(!isActive);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleVLibras}
      className={`libras-button fixed bottom-4 left-4 z-50 rounded-full shadow-lg transition-all ${
        isActive ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-card-hover'
      } ${
        highlight ? 'border-2 border-secondary text-secondary' : ''
      }`}
      aria-label="Ativar/Desativar tradução para Libras"
      title="Tradução para Libras (VLibras)"
    >
      <Hand className="h-5 w-5" />
    </Button>
  );
};
