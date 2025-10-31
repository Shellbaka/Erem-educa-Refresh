import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, PencilLine, Trash2, BookOpen } from "lucide-react";

export default function TeacherContents() {
  return (
    <div className="container mx-auto px-4 py-8" aria-labelledby="teacher-contents-title">
      <h1 id="teacher-contents-title" className="text-3xl font-bold mb-6">
        Conteúdos
      </h1>
      <div className="mb-4 flex items-center gap-2">
        <Button size="sm"><Upload className="h-4 w-4 mr-2" /> Novo Material</Button>
        <Button size="sm" variant="outline">Criar Pasta</Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-md bg-secondary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-base">Material {i}</CardTitle>
                  <Badge variant="secondary" className="mt-1">Geografia</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Vídeo • 8 min</span>
              <div className="flex items-center gap-2">
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


