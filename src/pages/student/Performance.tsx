import { Card } from "@/components/ui/card";

export default function StudentPerformance() {
  return (
    <div className="container mx-auto px-4 py-8" aria-labelledby="student-performance-title">
      <h1 id="student-performance-title" className="text-3xl font-bold mb-6">
        Desempenho
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">Progresso geral</Card>
        <Card className="p-6">Notas recentes</Card>
        <Card className="p-6">Tempo de estudo</Card>
      </div>
    </div>
  );
}


