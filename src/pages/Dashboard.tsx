import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AccessibilityBar } from "@/components/AccessibilityBar";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import {
  BookOpen,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  GraduationCap,
  Calendar,
  MessageSquare,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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

  const userType = user?.user_metadata?.user_type || "student";
  const userName = user?.user_metadata?.name || "Usuário";
  const headerBg = userType === "student" ? "from-primary/20 to-primary/5" : userType === "teacher" ? "from-secondary/20 to-secondary/5" : "from-accent/20 to-accent/5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <AccessibilityBar />
      
      {/* Header */}
      <header className={`border-b bg-gradient-to-r ${headerBg} backdrop-blur-sm sticky top-0 z-40`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Erem Conecta</h1>
                <p className="text-sm text-muted-foreground">
                  {userType === "student" && "Estudante"}
                  {userType === "teacher" && "Professor(a)"}
                  {userType === "admin" && "Administrador(a)"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1 h-9 w-9 rounded-full" aria-label="Abrir menu do perfil">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback>{(userName || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold">{userName}</span>
                      <span className="text-xs text-muted-foreground break-all">{user?.email}</span>
                      <span className="text-xs mt-1">Papel: {userType}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="#" aria-label="Ver perfil">Ver perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="#" aria-label="Configurações">Configurações</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">
            Olá, {userName}! 👋
          </h2>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel de controle
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Student Dashboard */}
          {userType === "student" && (
            <>
              <Link to="/student/contents" className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-md" aria-label="Ir para Meus Conteúdos">
                <Card className="hover:shadow-lg transition-all cursor-pointer" role="link">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mb-2">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Meus Conteúdos</CardTitle>
                    <CardDescription>
                      Acesse materiais e atividades das suas disciplinas
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/student/performance" className="block focus:outline-none focus:ring-2 focus:ring-secondary rounded-md" aria-label="Ir para Desempenho">
                <Card className="hover:shadow-lg transition-all cursor-pointer" role="link">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-secondary-light flex items-center justify-center mb-2">
                      <TrendingUp className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle>Desempenho</CardTitle>
                    <CardDescription>
                      Acompanhe suas notas e progresso
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/student/messages" className="block focus:outline-none focus:ring-2 focus:ring-accent rounded-md" aria-label="Ir para Mensagens">
                <Card className="hover:shadow-lg transition-all cursor-pointer" role="link">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center mb-2">
                      <MessageSquare className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle>Mensagens</CardTitle>
                    <CardDescription>
                      Converse com seus professores
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
                <Card className="hover:shadow-lg transition-all cursor-pointer" role="link">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mb-2">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Minhas Turmas</CardTitle>
                    <CardDescription>
                      Gerencie suas turmas e estudantes
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/teacher/contents" className="block focus:outline-none focus:ring-2 focus:ring-secondary rounded-md" aria-label="Ir para Conteúdos">
                <Card className="hover:shadow-lg transition-all cursor-pointer" role="link">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-secondary-light flex items-center justify-center mb-2">
                      <BookOpen className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle>Conteúdos</CardTitle>
                    <CardDescription>
                      Publique e organize materiais pedagógicos
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/teacher/activities" className="block focus:outline-none focus:ring-2 focus:ring-accent rounded-md" aria-label="Ir para Atividades">
                <Card className="hover:shadow-lg transition-all cursor-pointer" role="link">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center mb-2">
                      <Calendar className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle>Atividades</CardTitle>
                    <CardDescription>
                      Crie e agende avaliações
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </>
          )}

          {/* Admin Dashboard */}
          {userType === "admin" && (
            <>
              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Usuários</CardTitle>
                  <CardDescription>
                    Gerencie estudantes, professores e permissões
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-secondary-light flex items-center justify-center mb-2">
                    <TrendingUp className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle>Relatórios</CardTitle>
                  <CardDescription>
                    Visualize métricas e indicadores da plataforma
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center mb-2">
                    <Settings className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Configurações</CardTitle>
                  <CardDescription>
                    Configure a plataforma e sistema
                  </CardDescription>
                </CardHeader>
              </Card>
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-6">Estatísticas Rápidas</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">24</div>
                <p className="text-sm text-muted-foreground">Conteúdos disponíveis</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-secondary">12</div>
                <p className="text-sm text-muted-foreground">Atividades pendentes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-accent">5</div>
                <p className="text-sm text-muted-foreground">Mensagens não lidas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-success">8.5</div>
                <p className="text-sm text-muted-foreground">Média geral</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
