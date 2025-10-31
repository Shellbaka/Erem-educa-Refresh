import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export default function StudentContents() {
  return (
    <div className="container mx-auto px-4 py-8" aria-labelledby="student-contents-title">
      <h1 id="student-contents-title" className="text-3xl font-bold mb-6">
        Meus Conteúdos
      </h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Aula {i}: Tópico de Exemplo</CardTitle>
                  <Badge variant="secondary" className="mt-1">Matemática</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">PDF • 12 min</span>
              <Button size="sm" variant="outline">Abrir</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


