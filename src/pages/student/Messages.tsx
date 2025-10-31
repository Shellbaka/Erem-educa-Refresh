import { Card } from "@/components/ui/card";

export default function StudentMessages() {
  return (
    <div className="container mx-auto px-4 py-8" aria-labelledby="student-messages-title">
      <h1 id="student-messages-title" className="text-3xl font-bold mb-6">
        Mensagens
      </h1>
      <Card className="p-6">Conversas com professores</Card>
    </div>
  );
}


