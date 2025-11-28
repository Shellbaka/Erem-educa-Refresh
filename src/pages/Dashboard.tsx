import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  BookOpen,
  TrendingUp,
  Users,
  Settings,
  GraduationCap,
  Calendar,
  MessageSquare,
  HelpCircle,
  BookOpenCheck,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDeficiencyTheme } from "@/hooks/useDeficiencyTheme";
import { Badge } from "@/components/ui/badge";
import { ProtectedHeader } from "@/components/ProtectedHeader";
import { SchoolBackground } from "@/components/SchoolBackground";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useCurrentUser();
  useDeficiencyTheme(profile?.deficiencia || user?.user_metadata?.deficiencia);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [isLoading, navigate, user]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logout realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer logout");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userType = profile?.user_type || user?.user_metadata?.user_type || "student";
  const userName = profile?.name || user?.user_metadata?.name || "Usuário";
  const escolaNome = profile?.escola?.nome || user.user_metadata?.escola_nome;
  const turmaNome = profile?.turma?.nome || user.user_metadata?.turma_nome;
  const turmaAno = profile?.turma?.ano;

  return (
    <SchoolBackground variant="escola">
      <ProtectedHeader user={user} profile={profile} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-8 pb-8">
        <div className="mb-10 animate-fade-in">
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Olá, {userName}! 👋
          </h2>
          <p className="text-muted-foreground text-lg">
            Bem-vindo ao seu painel de controle
          </p>
          <div className="flex flex-wrap gap-2 mt-4 text-sm">
            {profile?.deficiencia ? (
              <Badge variant="outline" className="capitalize border-primary/30 text-primary bg-primary/10">
                Deficiência: {profile.deficiencia}
              </Badge>
            ) : (
              <Badge variant="outline" className="border-muted-foreground/20 text-muted-foreground bg-muted/40">
                Sem deficiência cadastrada
              </Badge>
            )}
            {escolaNome ? (
              <Badge variant="outline" className="border-secondary/30 text-secondary bg-secondary/10">
                Escola: {escolaNome}
              </Badge>
            ) : null}
            {turmaNome ? (
              <Badge variant="outline" className="border-accent/30 text-accent bg-accent/10">
                Turma: {turmaNome}
                {turmaAno ? ` • ${turmaAno}` : ""}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Student Dashboard */}
          {userType === "student" && (
            <>
              <Link to="/student/contents" className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-md" aria-label="Ir para Meus Conteúdos">
                <Card className="card-school shadow-school hover:shadow-school-lg transition-all cursor-pointer" role="link">
                  <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/5">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-3 shadow-md">
                      <BookOpen className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-primary">Meus Conteúdos</CardTitle>
                    <CardDescription className="text-base">
                      Acesse materiais e atividades das suas disciplinas
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/student/performance" className="block focus:outline-none focus:ring-2 focus:ring-secondary rounded-md" aria-label="Ir para Desempenho">
                <Card className="card-school shadow-school hover:shadow-school-lg transition-all cursor-pointer" role="link">
                  <CardHeader className="bg-gradient-to-br from-secondary/10 to-primary/5">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mb-3 shadow-md">
                      <TrendingUp className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-secondary">Desempenho</CardTitle>
                    <CardDescription className="text-base">
                      Acompanhe suas notas e progresso
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/student/messages" className="block focus:outline-none focus:ring-2 focus:ring-accent rounded-md" aria-label="Ir para Mensagens">
                <Card className="card-school shadow-school hover:shadow-school-lg transition-all cursor-pointer" role="link">
                  <CardHeader className="bg-gradient-to-br from-accent/10 to-primary/5">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-3 shadow-md">
                      <MessageSquare className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-accent">Mensagens</CardTitle>
                    <CardDescription className="text-base">
                      Converse com seus professores
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/student/help" className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-md" aria-label="Ir para Ajuda e Acessibilidade">
                <Card className="card-school shadow-school hover:shadow-school-lg transition-all cursor-pointer" role="link">
                  <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/5">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3 shadow-md">
                      <HelpCircle className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-primary">Ajuda e Acessibilidade</CardTitle>
                    <CardDescription className="text-base">
                      Tutorial de uso e recursos de inclusão
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </>
          )}

          {/* Teacher Dashboard */}
          {userType === "teacher" && (
            <>
              <Link to="/teacher/classes" className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-md" aria-label="Ir para Minhas Turmas">
                <Card className="card-school shadow-school hover:shadow-school-lg transition-all cursor-pointer" role="link">
                  <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/5">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-3 shadow-md">
                      <Users className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-primary">Minhas Turmas</CardTitle>
                    <CardDescription className="text-base">
                      Gerencie suas turmas e estudantes
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/teacher/contents" className="block focus:outline-none focus:ring-2 focus:ring-secondary rounded-md" aria-label="Ir para Conteúdos">
                <Card className="card-school shadow-school hover:shadow-school-lg transition-all cursor-pointer" role="link">
                  <CardHeader className="bg-gradient-to-br from-secondary/10 to-primary/5">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mb-3 shadow-md">
                      <BookOpen className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-secondary">Conteúdos</CardTitle>
                    <CardDescription className="text-base">
                      Publique e organize materiais pedagógicos
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/teacher/activities" className="block focus:outline-none focus:ring-2 focus:ring-accent rounded-md" aria-label="Ir para Atividades">
                <Card className="card-school shadow-school hover:shadow-school-lg transition-all cursor-pointer" role="link">
                  <CardHeader className="bg-gradient-to-br from-accent/10 to-primary/5">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-3 shadow-md">
                      <Calendar className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-accent">Atividades</CardTitle>
                    <CardDescription className="text-base">
                      Crie e agende avaliações
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/professor/materias" className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-md" aria-label="Ir para Minhas Matérias">
                <Card className="card-school shadow-school hover:shadow-school-lg transition-all cursor-pointer" role="link">
                  <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/5">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-3 shadow-md">
                      <BookOpenCheck className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-primary">Minhas Matérias</CardTitle>
                    <CardDescription className="text-base">
                      Veja turmas e alunos vinculados às suas aulas
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </>
          )}

          {/* Admin Dashboard */}
          {userType === "admin" && (
            <>
              <Link
                to="/admin/users"
                className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                aria-label="Ir para gestão de usuários"
              >
                <Card
                  className="card-school shadow-school hover:shadow-school-lg transition-all cursor-pointer"
                  role="link"
                >
                  <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/5">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-3 shadow-md">
                      <Users className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-primary">Usuários</CardTitle>
                    <CardDescription className="text-base">
                      Gerencie estudantes, professores e permissões
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link
                to="/admin/reports"
                className="block focus:outline-none focus:ring-2 focus:ring-secondary rounded-md"
                aria-label="Ir para Relatórios"
              >
                <Card
                  className="card-school shadow-school hover:shadow-school-lg transition-all cursor-pointer"
                  role="link"
                >
                  <CardHeader className="bg-gradient-to-br from-secondary/10 to-primary/5">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mb-3 shadow-md">
                      <TrendingUp className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-secondary">Relatórios</CardTitle>
                    <CardDescription className="text-base">
                      Visualize métricas de uso e indicadores (exemplo)
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link
                to="/admin/settings"
                className="block focus:outline-none focus:ring-2 focus:ring-accent rounded-md"
                aria-label="Ir para Configurações"
              >
                <Card
                  className="card-school shadow-school hover:shadow-school-lg transition-all cursor-pointer"
                  role="link"
                >
                  <CardHeader className="bg-gradient-to-br from-accent/10 to-primary/5">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-3 shadow-md">
                      <Settings className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-accent">Configurações</CardTitle>
                    <CardDescription className="text-base">
                      Ajuste opções da plataforma (exemplo)
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold mb-8 text-foreground">Estatísticas Rápidas</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="card-school shadow-school hover:shadow-school-lg transition-all">
              <CardContent className="pt-6 pb-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">24</div>
                <p className="text-sm text-muted-foreground font-medium">Conteúdos disponíveis</p>
              </CardContent>
            </Card>
            <Card className="card-school shadow-school hover:shadow-school-lg transition-all">
              <CardContent className="pt-6 pb-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-secondary to-secondary/70 bg-clip-text text-transparent mb-2">12</div>
                <p className="text-sm text-muted-foreground font-medium">Atividades pendentes</p>
              </CardContent>
            </Card>
            <Card className="card-school shadow-school hover:shadow-school-lg transition-all">
              <CardContent className="pt-6 pb-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent mb-2">5</div>
                <p className="text-sm text-muted-foreground font-medium">Mensagens não lidas</p>
              </CardContent>
            </Card>
            <Card className="card-school shadow-school hover:shadow-school-lg transition-all">
              <CardContent className="pt-6 pb-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-success to-success/70 bg-clip-text text-transparent mb-2">8.5</div>
                <p className="text-sm text-muted-foreground font-medium">Média geral</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </SchoolBackground>
  );
}
