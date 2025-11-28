import { ReactNode } from "react";
import escolaImg from "@/pages/imagens/escola.jpeg";
import texturaImg from "@/pages/imagens/textura escolar.png";

interface SchoolBackgroundProps {
  children: ReactNode;
  variant?: "escola" | "textura";
}

export function SchoolBackground({ children, variant = "escola" }: SchoolBackgroundProps) {
  const backgroundImage = variant === "escola" ? escolaImg : texturaImg;
  const opacity = variant === "escola" ? 0.15 : 0.2;
  const backgroundRepeat = variant === "textura" ? "repeat" : "no-repeat";

  return (
    <div
      className="min-h-screen relative"
      style={{
        background:
          "linear-gradient(135deg, hsl(210, 85%, 98%) 0%, hsl(150, 60%, 98%) 50%, hsl(210, 85%, 98%) 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: variant === "textura" ? "cover" : "cover",
          backgroundPosition: "center",
          backgroundRepeat: backgroundRepeat as "repeat" | "no-repeat",
          backgroundAttachment: "fixed",
          opacity: opacity,
          zIndex: 0,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

