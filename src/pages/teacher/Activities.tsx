import { Card } from "@/components/ui/card";

export default function TeacherActivities() {
  return (
    <div className="container mx-auto px-4 py-8" aria-labelledby="teacher-activities-title">
      <h1 id="teacher-activities-title" className="text-3xl font-bold mb-6">
        Atividades
      </h1>
      <Card className="p-6">Criação e correção de tarefas</Card>
    </div>
  );
}


