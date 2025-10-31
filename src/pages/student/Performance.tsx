import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";

export default function StudentPerformance() {
  const progressData = [
    { month: "Jan", media: 6.5 },
    { month: "Fev", media: 7.2 },
    { month: "Mar", media: 7.8 },
    { month: "Abr", media: 8.1 },
    { month: "Mai", media: 8.6 },
  ];

  return (
    <div className="container mx-auto px-4 py-8" aria-labelledby="student-performance-title">
      <h1 id="student-performance-title" className="text-3xl font-bold mb-6">
        Desempenho
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Progresso geral</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ media: { label: "Média", color: "#22c55e" } }}
              className="h-56"
            >
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 10]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="media" stroke="var(--color-media)" strokeWidth={2} dot />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notas recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between"><span>Matemática</span><Badge variant="secondary">8.7</Badge></div>
            <div className="flex items-center justify-between"><span>Português</span><Badge variant="secondary">8.3</Badge></div>
            <div className="flex items-center justify-between"><span>História</span><Badge variant="secondary">7.9</Badge></div>
            <div className="flex items-center justify-between"><span>Ciências</span><Badge variant="secondary">9.1</Badge></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tempo de estudo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">Média semanal</p>
            <div className="text-3xl font-bold">6h 20m</div>
            <p className="text-sm text-muted-foreground">+ 40 min vs. semana anterior</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


