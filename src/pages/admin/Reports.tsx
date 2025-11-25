import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProtectedPageLayout } from "@/components/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, BookOpen } from "lucide-react";

export default function AdminReportsPage() {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if ((profile?.user_type || user.user_metadata?.user_type) !== "admin") {
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
      title="Relatórios (Exemplo)"
      subtitle="Visão geral fictícia para demonstração do painel administrativo"
      user={user}
      profile={profile}
      showUserInfo={false}
      infoSlot={
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
            Dados apenas ilustrativos
          </Badge>
        </div>
      }
    >
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-school-lg">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Users className="h-5 w-5" /> Usuários ativos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-2xl text-primary">120</span> contas ativas
            </p>
            <p>80 estudantes • 30 professores • 10 administradores.</p>
          </CardContent>
        </Card>

        <Card className="shadow-school-lg">
          <CardHeader className="bg-gradient-to-br from-secondary/10 to-primary/10">
            <CardTitle className="flex items-center gap-2 text-secondary">
              <BookOpen className="h-5 w-5" /> Conteúdos publicados
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-2xl text-secondary">45</span> materiais disponíveis
            </p>
            <p>Aulas em PDF, vídeos e atividades interativas.</p>
          </CardContent>
        </Card>

        <Card className="shadow-school-lg">
          <CardHeader className="bg-gradient-to-br from-accent/10 to-primary/10">
            <CardTitle className="flex items-center gap-2 text-accent">
              <TrendingUp className="h-5 w-5" /> Acessos na semana
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-2xl text-accent">320</span> acessos
            </p>
            <p>Maior pico de uso na segunda-feira à noite.</p>
          </CardContent>
        </Card>
      </div>
    </ProtectedPageLayout>
  );
}


