import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { ScrollRevealCard } from "@/components/ScrollRevealCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProtectedPageLayout } from "@/components/ProtectedPageLayout";

export default function StudentMessages() {
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
      title="Mensagens"
      subtitle="Converse com seus professores e acompanhe suas conversas"
      description={`Você está conectado como ${profile?.name || user.user_metadata?.name || user.email}`}
      user={user}
      profile={profile}
    >
      <div className="grid md:grid-cols-2 gap-6">
        {["Prof. Ana", "Prof. Bruno", "Prof. Carla", "Prof. Diego"].map((name, idx) => (
          <ScrollRevealCard key={idx} delay={idx * 0.1}>
            <CardHeader className="pb-3 bg-gradient-to-br from-accent/10 to-primary/10">
              <CardTitle className="text-base font-semibold flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/80 text-white shadow-md">
                  <MessageSquare className="h-5 w-5" />
                </span>
                {name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium flex-1">
                Última: "Lembrete da atividade"
              </span>
              <div className="flex items-center gap-2">
                {idx % 2 === 0 && (
                  <Badge className="bg-secondary text-white border-0 shadow-sm">
                    {1}
                  </Badge>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-accent/30 hover:bg-accent hover:text-white transition-colors"
                >
                  Abrir
                </Button>
              </div>
            </CardContent>
          </ScrollRevealCard>
        ))}
      </div>
    </ProtectedPageLayout>
  );
}


