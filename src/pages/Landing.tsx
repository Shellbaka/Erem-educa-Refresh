import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AccessibilityBar } from "@/components/AccessibilityBar";
import {
  BookOpen,
  Users,
  TrendingUp,
  Eye,
  Volume2,
  Keyboard,
  ArrowRight,
  GraduationCap,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SchoolBackground } from "@/components/SchoolBackground";

export default function Landing() {
  return (
    <SchoolBackground variant="textura">
      <AccessibilityBar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl mx-auto text-center lg:text-left space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-sm font-medium text-primary">
                <Heart className="h-4 w-4" />
                Educação Inclusiva e Acessível
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-balance">
                Bem-vindo ao{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Erem Conecta
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl text-balance">
                Uma plataforma educacional projetada para todos, com foco especial em estudantes com deficiência. Juntos, tornamos a educação mais acessível.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Button 
                  asChild 
                  size="lg"
                  className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <Link to="/auth">
                    Começar agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-6"
                  asChild
                >
                  <a href="#features">
                    Conhecer recursos
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative max-w-xl mx-auto">
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-3xl bg-primary/10 blur-2xl" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-secondary/10 blur-2xl" />
              <Card className="relative p-6 md:p-8 bg-gradient-to-br from-background to-muted/60 shadow-2xl border-primary/10">
                <div className="grid grid-cols-2 gap-5">
                  {[
                    {
                      src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
                      label: "Materiais e livros",
                    },
                    {
                      src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
                      label: "Estudantes conectados",
                    },
                    {
                      src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80",
                      label: "Professoras em ação",
                    },
                    {
                      src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
                      label: "Tecnologia na sala",
                    },
                  ].map((item, idx) => (
                    <figure
                      key={item.label}
                      className={`rounded-2xl overflow-hidden shadow-lg border border-white/30 bg-white/40 backdrop-blur ${idx % 2 !== 0 ? "translate-y-6" : ""}`}
                    >
                      <img
                        src={item.src}
                        alt={item.label}
                        className="object-cover h-40 w-full"
                        loading="lazy"
                      />
                      <figcaption className="p-3 text-xs font-medium text-muted-foreground text-center">
                        {item.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <p className="mt-6 text-xs md:text-sm text-muted-foreground text-center">
                  Fotografias reais de livros, estudantes e ambientes escolares para reforçar visualmente a proposta educacional.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold">
              Recursos Inclusivos
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ferramentas desenvolvidas pensando na acessibilidade e inclusão de todos os estudantes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: "Alto Contraste",
                description: "Interface adaptável com ajuste de contraste e tamanho de fonte para melhor visualização",
                color: "primary"
              },
              {
                icon: Volume2,
                title: "Leitor de Tela",
                description: "Suporte completo a leitores de tela e navegação por áudio integrada",
                color: "secondary"
              },
              {
                icon: Keyboard,
                title: "Navegação por Teclado",
                description: "100% navegável via teclado com atalhos intuitivos e acessíveis",
                color: "accent"
              },
              {
                icon: BookOpen,
                title: "Conteúdo Adaptado",
                description: "Material pedagógico em múltiplos formatos: texto, áudio, vídeo e Libras",
                color: "primary"
              },
              {
                icon: TrendingUp,
                title: "Acompanhamento",
                description: "Professores monitoram o progresso com dashboards intuitivos e relatórios detalhados",
                color: "secondary"
              },
              {
                icon: Users,
                title: "Comunicação Direta",
                description: "Chat integrado entre estudantes e professores para feedback contínuo",
                color: "accent"
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 animate-scale-in border-2 hover:border-primary/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-lg bg-${feature.color}-light flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Para Todos os Perfis
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades específicas para estudantes, professores e administradores
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Estudantes",
                description: "Acesse conteúdos adaptados, atividades e acompanhe seu progresso em tempo real",
                icon: GraduationCap,
              },
              {
                title: "Professores",
                description: "Gerencie turmas, publique conteúdo acessível e monitore o desempenho dos alunos",
                icon: Users,
              },
              {
                title: "Administradores",
                description: "Supervisione a plataforma, gerencie usuários e analise métricas de desempenho",
                icon: TrendingUp,
              },
            ].map((profile, index) => (
              <Card
                key={index}
                className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-primary"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <profile.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{profile.title}</h3>
                <p className="text-muted-foreground">{profile.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Pronto para começar?
            </h2>
            <p className="text-xl text-white/90">
              Junte-se a nós na missão de tornar a educação mais inclusiva e acessível para todos
            </p>
            <Button 
              asChild 
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
            >
              <Link to="/auth">
                Criar conta gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Erem Conecta. Todos os direitos reservados.</p>
          <p className="mt-2 text-sm">
            Plataforma desenvolvida com foco em acessibilidade (WCAG 2.1 AA) e inclusão educacional
          </p>
        </div>
      </footer>
    </SchoolBackground>
  );
}
