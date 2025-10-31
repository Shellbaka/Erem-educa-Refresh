import { Card } from "@/components/ui/card";

export default function TeacherClasses() {
  return (
    <div className="container mx-auto px-4 py-8" aria-labelledby="teacher-classes-title">
      <h1 id="teacher-classes-title" className="text-3xl font-bold mb-6">
        Minhas Turmas
      </h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6">Turma A - Resumo</Card>
        <Card className="p-6">Turma B - Resumo</Card>
      </div>
    </div>
  );
}


