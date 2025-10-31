import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarPlus, PencilLine, Trash2 } from "lucide-react";

export default function TeacherActivities() {
  return (
    <div className="container mx-auto px-4 py-8" aria-labelledby="teacher-activities-title">
      <h1 id="teacher-activities-title" className="text-3xl font-bold mb-6">
        Atividades
      </h1>
      <div className="mb-4">
        <Button size="sm"><CalendarPlus className="h-4 w-4 mr-2" /> Nova Atividade</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Próximas atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Entrega</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[{t:"Lista 1",c:"Turma A",d:"10/11"},{t:"Trabalho",c:"Turma B",d:"15/11"},{t:"Prova",c:"Turma A",d:"20/11"}].map((a, idx) => (
                <TableRow key={idx}>
                  <TableCell>{a.t}</TableCell>
                  <TableCell>{a.c}</TableCell>
                  <TableCell>{a.d}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline"><PencilLine className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive/50"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


