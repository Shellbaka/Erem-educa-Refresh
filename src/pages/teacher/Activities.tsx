import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarPlus, PencilLine, Trash2 } from "lucide-react";
import { ScrollRevealCard } from "@/components/ScrollRevealCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProtectedPageLayout } from "@/components/ProtectedPageLayout";

export default function TeacherActivities() {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useCurrentUser();
  
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if ((profile?.user_type || user.user_metadata?.user_type) !== "teacher") {
        navigate("/dashboard");
      }
    }
  }, [isLoading, navigate, profile?.user_type, user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <ProtectedPageLayout
      title="Atividades"
      subtitle="Crie e gerencie atividades e avaliações para suas turmas"
      user={user}
      profile={profile}
      actions={
        <Button size="sm" className="bg-accent hover:bg-accent-hover shadow-md">
          <CalendarPlus className="h-4 w-4 mr-2" /> Nova Atividade
        </Button>
      }
    >
      <ScrollRevealCard className="shadow-school-lg">
        <CardHeader className="bg-gradient-to-br from-accent/10 to-primary/10">
          <CardTitle className="text-lg font-semibold text-accent">Próximas atividades</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead className="font-semibold">Título</TableHead>
                <TableHead className="font-semibold">Turma</TableHead>
                <TableHead className="font-semibold">Entrega</TableHead>
                <TableHead className="text-right font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[{t:"Lista 1",c:"Turma A",d:"10/11"},{t:"Trabalho",c:"Turma B",d:"15/11"},{t:"Prova",c:"Turma A",d:"20/11"}].map((a, idx) => (
                <TableRow 
                  key={idx}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium">{a.t}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium">
                      {a.c}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{a.d}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-accent/30 hover:bg-accent hover:text-white transition-colors"
                    >
                      <PencilLine className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-destructive border-destructive/50 hover:bg-destructive hover:text-white transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </ScrollRevealCard>
    </ProtectedPageLayout>
  );
}


