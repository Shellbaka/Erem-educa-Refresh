import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, PencilLine, Trash2, Plus } from "lucide-react";

export default function TeacherClasses() {
  return (
    <div className="container mx-auto px-4 py-8" aria-labelledby="teacher-classes-title">
      <h1 id="teacher-classes-title" className="text-3xl font-bold mb-6">
        Minhas Turmas
      </h1>
      <div className="mb-4">
        <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Nova Turma</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[{n:"Turma A", s:28},{n:"Turma B", s:25}].map((c, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Users className="h-4 w-4" />
                </span>
                {c.n}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.s} alunos</span>
              <div className="space-x-2">
                <Button size="sm" variant="outline"><PencilLine className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" className="text-destructive border-destructive/50"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


