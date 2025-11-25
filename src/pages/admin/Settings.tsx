import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProtectedPageLayout } from "@/components/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, ShieldCheck, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
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
      title="Configurações (Exemplo)"
      subtitle="Ajustes fictícios apenas para demonstração do painel administrativo"
      user={user}
      profile={profile}
      showUserInfo={false}
      infoSlot={
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline" className="border-accent/30 text-accent bg-accent/10">
            Nenhuma configuração é salva de verdade aqui
          </Badge>
        </div>
      }
    >
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-school-lg">
          <CardHeader className="bg-gradient-to-br from-accent/10 to-primary/10">
            <CardTitle className="flex items-center gap-2 text-accent">
              <Settings className="h-5 w-5" /> Preferências da escola
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
            <p>Esses controles são apenas ilustrativos, simulando opções que um administrador poderia ajustar.</p>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="cfg-atividades">Permitir atividades online</Label>
              <Switch id="cfg-atividades" checked={true} readOnly aria-readonly="true" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="cfg-mensagens">Habilitar mensagens aluno-professor</Label>
              <Switch id="cfg-mensagens" checked={true} readOnly aria-readonly="true" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-school-lg">
          <CardHeader className="bg-gradient-to-br from-secondary/10 to-primary/10">
            <CardTitle className="flex items-center gap-2 text-secondary">
              <Bell className="h-5 w-5" /> Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="cfg-email">Alertas por e-mail</Label>
              <Switch id="cfg-email" checked={false} readOnly aria-readonly="true" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="cfg-relatorios">Resumo semanal de relatórios</Label>
              <Switch id="cfg-relatorios" checked={true} readOnly aria-readonly="true" />
            </div>
            <p className="text-xs text-muted-foreground">
              No futuro, essas opções poderiam ser integradas ao Supabase para salvar as preferências reais da escola.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-school-lg md:col-span-2">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardTitle className="flex items-center gap-2 text-primary">
              <ShieldCheck className="h-5 w-5" /> Privacidade e segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-2 text-sm text-muted-foreground">
            <p>
              Este bloco ilustra textos explicativos que podem orientar a escola sobre LGPD, uso de dados dos alunos e
              boas práticas de proteção.
            </p>
            <p>
              Nenhuma configuração é realmente aplicada aqui; a ideia é apenas mostrar como seria uma tela completa de
              configurações administrativas.
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtectedPageLayout>
  );
}


