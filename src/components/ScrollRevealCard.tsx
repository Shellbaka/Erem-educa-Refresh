import { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ScrollRevealCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollRevealCard({ children, className, delay = 0 }: ScrollRevealCardProps) {
  const { ref, isRevealed } = useScrollReveal();
  
  return (
    <Card
      ref={ref}
      className={cn(
        "card-school shadow-school",
        isRevealed ? "scroll-reveal revealed" : "scroll-reveal",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </Card>
  );
}

