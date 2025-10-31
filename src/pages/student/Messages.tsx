import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default function StudentMessages() {
  return (
    <div className="container mx-auto px-4 py-8" aria-labelledby="student-messages-title">
      <h1 id="student-messages-title" className="text-3xl font-bold mb-6">
        Mensagens
      </h1>
      <div className="grid md:grid-cols-2 gap-4">
        {["Prof. Ana", "Prof. Bruno", "Prof. Carla", "Prof. Diego"].map((name, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <MessageSquare className="h-4 w-4" />
                </span>
                {name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Última: "Lembrete da atividade"</span>
              <div className="flex items-center gap-2">
                <Badge>{idx % 2 === 0 ? 1 : 0}</Badge>
                <Button size="sm" variant="outline">Abrir</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


