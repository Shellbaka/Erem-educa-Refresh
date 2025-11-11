import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProtectedPageLayout } from "@/components/ProtectedPageLayout";

export default function StudentPerformance() {
  const progressData = [
    { month: "Jan", media: 6.5 },
    { month: "Fev", media: 7.2 },
    { month: "Mar", media: 7.8 },
    { month: "Abr", media: 8.1 },
    { month: "Mai", media: 8.6 },
  ];

  const navigate = useNavigate();
  const { user, profile, isLoading } = useCurrentUser();
  const chartReveal = useScrollReveal();
  const notesReveal = useScrollReveal();
  const timeReveal = useScrollReveal();

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
          ref={notesReveal.ref}
          className={`card-school shadow-school-lg ${notesReveal.isRevealed ? "scroll-reveal revealed" : "scroll-reveal"}`}
        >
          <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardTitle className="text-lg font-semibold text-primary">Notas recentes</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="font-medium">Matemática</span>
              <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30 font-semibold">8.7</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="font-medium">Português</span>
              <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30 font-semibold">8.3</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="font-medium">História</span>
              <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30 font-semibold">7.9</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="font-medium">Ciências</span>
              <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30 font-semibold">9.1</Badge>
            </div>
          </CardContent>
        </Card>
        <Card 
          ref={timeReveal.ref}
          className={`card-school shadow-school-lg ${timeReveal.isRevealed ? "scroll-reveal revealed" : "scroll-reveal"}`}
        >
          <CardHeader className="bg-gradient-to-br from-accent/10 to-primary/10">
            <CardTitle className="text-lg font-semibold text-accent">Tempo de estudo</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <p className="text-muted-foreground font-medium">Média semanal</p>
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              6h 20m
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="text-secondary font-semibold">+ 40 min</span> vs. semana anterior
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtectedPageLayout>
  );
}


