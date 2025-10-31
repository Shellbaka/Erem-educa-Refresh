import { Card } from "@/components/ui/card";

export default function StudentContents() {
  return (
    <div className="container mx-auto px-4 py-8" aria-labelledby="student-contents-title">
      <h1 id="student-contents-title" className="text-3xl font-bold mb-6">
        Meus Conteúdos
      </h1>
      <Card className="p-6">Lista de aulas e materiais disponíveis</Card>
    </div>
  );
}


