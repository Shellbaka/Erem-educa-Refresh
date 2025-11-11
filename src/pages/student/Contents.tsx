import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ScrollRevealCard } from "@/components/ScrollRevealCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProtectedPageLayout } from "@/components/ProtectedPageLayout";

export default function StudentContents() {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useCurrentUser();
  
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if ((profile?.user_type || user.user_metadata?.user_type) !== "student") {
        navigate("/dashboard");
      }
    }
  }, [isLoading, navigate, profile?.user_type, user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <ProtectedPageLayout
      title="Meus Conteúdos"
      subtitle="Explore seus materiais de estudo e atividades"
      description={`Bem-vindo, ${profile?.name || user.user_metadata?.name || "Estudante"}!`}
      user={user}
      profile={profile}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map((i, idx) => (
          <ScrollRevealCard key={i} delay={idx * 0.1} className="overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base font-semibold">Aula {i}: Tópico de Exemplo</CardTitle>
                  <Badge variant="secondary" className="mt-2 bg-secondary/20 text-secondary border-secondary/30">
                    Matemática
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium">PDF • 12 min</span>
              <Button 
                size="sm" 
                variant="outline"
                className="border-primary/30 hover:bg-primary hover:text-white transition-colors"
              >
                Abrir
              </Button>
            </CardContent>
          </ScrollRevealCard>
        ))}
      </div>
    </ProtectedPageLayout>
  );
}


