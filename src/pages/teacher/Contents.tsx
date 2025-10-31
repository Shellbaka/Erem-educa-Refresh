import { Card } from "@/components/ui/card";

export default function TeacherContents() {
  return (
    <div className="container mx-auto px-4 py-8" aria-labelledby="teacher-contents-title">
      <h1 id="teacher-contents-title" className="text-3xl font-bold mb-6">
        Conteúdos
      </h1>
      <Card className="p-6">Gerenciamento e upload de materiais</Card>
    </div>
  );
}


