import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProtectedPageLayout } from "@/components/ProtectedPageLayout";
import {
  Flame,
  Brain,
  Award,
  Activity,
  MessageCircle,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

export default function StudentPerformance() {
  const progressData = [
    { month: "Jan", media: 6.5 },
    { month: "Fev", media: 7.2 },
    { month: "Mar", media: 7.8 },
    { month: "Abr", media: 8.1 },
    { month: "Mai", media: 8.6 },
  ];

  const disciplineData = [
    { disciplina: "Matemática", media: 8.7 },
    { disciplina: "Português", media: 8.3 },
    { disciplina: "História", media: 7.9 },
    { disciplina: "Ciências", media: 9.1 },
    { disciplina: "Inglês", media: 8.0 },
  ];

  const assessments = [
    { title: "Prova Trimestral", date: "12/05", score: 8.5, weight: "40%" },
    { title: "Projeto Interdisciplinar", date: "28/04", score: 9.2, weight: "35%" },
    { title: "Redação", date: "10/04", score: 8.0, weight: "15%" },
    { title: "Atividades em sala", date: "Semanal", score: 9.5, weight: "10%" },
  ];

  const engagementData = [
    { label: "Participação em aula", value: 82 },
    { label: "Pontualidade em entregas", value: 91 },
    { label: "Colaboração em grupo", value: 76 },
  ];

  const teacherFeedback = [
    {
      professor: "Prof.ª Helena Silva",
      disciplina: "Português",
      mensagem: "Excelente evolução na interpretação de textos! Continue explorando leituras extras.",
      data: "08/05",
    },
    {
      professor: "Prof. Marcos Andrade",
      disciplina: "Matemática",
      mensagem: "Você demonstrou domínio em resolução de equações. Reforce geometria para a próxima prova.",
      data: "03/05",
    },
  ];

  const behaviorHistory = [
    {
      periodo: "Abril • Semana 3",
      destaque: "Participação ativa nas aulas híbridas",
      progresso: "+15% em colaboração",
    },
    {
      periodo: "Abril • Semana 1",
      destaque: "Entrega antecipada de todas as atividades avaliativas",
      progresso: "2 dias antes do prazo",
    },
    {
      periodo: "Março • Semana 4",
      destaque: "Resolução de conflitos em grupo com autonomia",
      progresso: "Feedback positivo da coordenação",
    },
  ];

  const radarData = [{ name: "Presença", value: 92 }];

  const stats = [
    { label: "Média geral", value: "8,4", change: "+0,6", icon: Flame },
    { label: "Frequência", value: "92%", change: "+4%", icon: Activity },
    { label: "Projetos concluídos", value: "12", change: "3 em andamento", icon: Award },
    { label: "Bem-estar acadêmico", value: "87%", change: "monitorado semanalmente", icon: Brain },
  ];

  const navigate = useNavigate();
  const { user, profile, isLoading } = useCurrentUser();

  const adaptativeInsights =
    profile?.deficiencia === "Visual"
      ? {
          title: "Adaptações para deficiência visual",
          tips: [
            "Ative fontes ampliadas no painel de acessibilidade.",
            "Prefira materiais com alto contraste e narrativas em áudio.",
            "Solicite versões em áudio das avaliações quando possível.",
          ],
          nextStep: "Audiodescrição ativa nas páginas principais",
        }
      : profile?.deficiencia === "Auditiva"
      ? {
          title: "Adaptações para deficiência auditiva",
          tips: [
            "Ligue o botão de Libras (canto inferior esquerdo) para acompanhar aulas gravadas.",
            "Use legendas automáticas nos vídeos indicados pelos professores.",
            "Combine sinais visuais (cores e ícones) para tarefas urgentes.",
          ],
          nextStep: "Disponibilizar resumo visual pós-aulas",
        }
      : {
          title: "Dicas gerais de estudo",
          tips: [
            "Mantenha um cronograma semanal com alarmes para entregas.",
            "Intercale sessões de estudo com pausas curtas a cada 25 minutos.",
            "Registre dúvidas assim que surgirem e envie pelos Mensagens.",
          ],
          nextStep: "Explorar recursos extras de estudo no menu Conteúdos",
        };
  const chartReveal = useScrollReveal();
  const barReveal = useScrollReveal();
  const statsReveal = useScrollReveal();
  const listReveal = useScrollReveal();
  const engagementReveal = useScrollReveal();
  const adaptReveal = useScrollReveal();
  const feedbackReveal = useScrollReveal();
  const behaviorReveal = useScrollReveal();

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
      title="Desempenho"
      subtitle="Acompanhe seu progresso e evolução acadêmica"
      description={`Dados referentes ao aluno ${profile?.name || user.user_metadata?.name || user.email}`}
      user={user}
      profile={profile}
    >
      <div
        ref={statsReveal.ref}
        className={`grid md:grid-cols-2 xl:grid-cols-4 gap-5 scroll-reveal ${
          statsReveal.isRevealed ? "revealed" : ""
        }`}
        aria-label="Indicadores rápidos"
      >
        {stats.map((item) => (
          <Card key={item.label} className="card-school shadow-school">
            <CardContent className="pt-6 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-full bg-primary/10 text-primary">
                  <item.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{item.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          ref={chartReveal.ref}
          className={`card-school shadow-school-lg ${chartReveal.isRevealed ? "scroll-reveal revealed" : "scroll-reveal"}`}
        >
          <CardHeader className="bg-gradient-to-br from-secondary/10 to-primary/10">
            <CardTitle className="text-lg font-semibold text-secondary">Progresso geral</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{ media: { label: "Média", color: "#22c55e" } }}
              className="h-56"
            >
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="media" 
                  stroke="#22c55e" 
                  strokeWidth={3} 
                  dot={{ fill: "#22c55e", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card
          ref={barReveal.ref}
          className={`card-school shadow-school-lg ${barReveal.isRevealed ? "scroll-reveal revealed" : "scroll-reveal"}`}
        >
          <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardTitle className="text-lg font-semibold text-primary">Desempenho por disciplina</CardTitle>
            <CardDescription>Comparativo das últimas avaliações</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{ media: { label: "Média", color: "hsl(var(--primary))" } }}
              className="h-64"
            >
              <BarChart data={disciplineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="disciplina" stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="media" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card 
          ref={engagementReveal.ref}
          className={`card-school shadow-school-lg ${engagementReveal.isRevealed ? "scroll-reveal revealed" : "scroll-reveal"}`}
        >
          <CardHeader className="bg-gradient-to-br from-accent/10 to-primary/10">
            <CardTitle className="text-lg font-semibold text-accent">Tempo e engajamento</CardTitle>
            <CardDescription>Indicadores comportamentais acompanhados pela escola</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-4">
              <ChartContainer
                config={{ presença: { label: "Presença", color: "hsl(var(--secondary))" } }}
                className="w-40 h-40"
              >
                <RadialBarChart data={radarData} startAngle={90} endAngle={-270} innerRadius="55%" outerRadius="100%">
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar
                    dataKey="value"
                    cornerRadius={100}
                    fill="hsl(var(--secondary))"
                    background={{ fill: "hsl(var(--muted))" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadialBarChart>
              </ChartContainer>
              <div>
                <p className="text-sm text-muted-foreground">Frequência acumulada</p>
                <p className="text-4xl font-bold text-secondary">92%</p>
                <p className="text-xs text-muted-foreground">Meta mínima: 85%</p>
              </div>
            </div>
            <div className="space-y-3">
              {engagementData.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card
          ref={listReveal.ref}
          className={`card-school shadow-school-lg ${listReveal.isRevealed ? "scroll-reveal revealed" : "scroll-reveal"}`}
        >
          <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardTitle className="text-lg font-semibold text-primary">Resultados detalhados</CardTitle>
            <CardDescription>Ponderação das últimas atividades avaliativas</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {assessments.map((assessment) => (
              <div
                key={assessment.title}
                className="flex items-center justify-between p-3 rounded-lg border border-border/40"
              >
                <div>
                  <p className="font-semibold text-foreground">{assessment.title}</p>
                  <p className="text-xs text-muted-foreground">Aplicado em {assessment.date}</p>
                </div>
                <div className="text-right">
                  <Badge className="text-base font-semibold">{assessment.score.toFixed(1)}</Badge>
                  <p className="text-xs text-muted-foreground">Peso {assessment.weight}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card
          ref={adaptReveal.ref}
          className={`card-school shadow-school-lg ${adaptReveal.isRevealed ? "scroll-reveal revealed" : "scroll-reveal"}`}
        >
          <CardHeader className="bg-gradient-to-br from-secondary/10 to-primary/5">
            <CardTitle className="text-lg font-semibold text-secondary">{adaptativeInsights.title}</CardTitle>
            <CardDescription>Personalizado a partir das preferências do seu perfil</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <ul className="space-y-3">
              {adaptativeInsights.tips.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-secondary" />
                  {tip}
                </li>
              ))}
            </ul>
            <div className="rounded-lg bg-secondary/10 p-4 border border-secondary/20">
              <p className="text-xs uppercase tracking-wide text-secondary mb-1">Próximo passo sugerido</p>
              <p className="text-sm font-semibold text-secondary">{adaptativeInsights.nextStep}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card
          ref={feedbackReveal.ref}
          className={`card-school shadow-school-lg ${feedbackReveal.isRevealed ? "scroll-reveal revealed" : "scroll-reveal"}`}
        >
          <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardTitle className="flex items-center gap-2 text-primary">
              <MessageCircle className="h-5 w-5" />
              Feedback dos professores
            </CardTitle>
            <CardDescription>Mensagens registradas após as últimas entregas</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {teacherFeedback.map((feedback) => (
              <div key={feedback.mensagem} className="rounded-xl border border-border/40 bg-card/40 p-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>
                    {feedback.professor} • {feedback.disciplina}
                  </span>
                  <span>{feedback.data}</span>
                </div>
                <p className="text-sm text-foreground">{feedback.mensagem}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card
          ref={behaviorReveal.ref}
          className={`card-school shadow-school-lg ${behaviorReveal.isRevealed ? "scroll-reveal revealed" : "scroll-reveal"}`}
        >
          <CardHeader className="bg-gradient-to-br from-secondary/10 to-primary/10">
            <CardTitle className="flex items-center gap-2 text-secondary">
              <TrendingUp className="h-5 w-5" />
              Histórico comportamental
            </CardTitle>
            <CardDescription>Registros acompanhados pela orientação</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {behaviorHistory.map((item, index) => (
              <div key={item.periodo} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  {index !== behaviorHistory.length - 1 && <div className="w-0.5 flex-1 bg-border/40 mt-2" />}
                </div>
                <div className="pb-6">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.periodo}</p>
                  <p className="text-sm font-semibold text-foreground">{item.destaque}</p>
                  <p className="text-xs text-muted-foreground">{item.progresso}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </ProtectedPageLayout>
  );
}
