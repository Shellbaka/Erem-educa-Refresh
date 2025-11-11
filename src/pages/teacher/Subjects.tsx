import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProtectedPageLayout } from "@/components/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, FolderOpen } from "lucide-react";

type Subject = {
  id: string;
  nome: string;
  descricao?: string | null;
  turma: {
    id: string;
    nome: string;
    ano?: string | null;
    escola?: {
      id: string;
      nome: string;
    } | null;
  } | null;
};

type StudentProfile = {
  id: string;
  name: string | null;
  deficiencia?: string | null;
  turma_id?: string | null;
};

export default function TeacherSubjectsPage() {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useCurrentUser();
  const [isFetching, setIsFetching] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studentsByClass, setStudentsByClass] = useState<Record<string, StudentProfile[]>>({});

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if ((profile?.user_type || user.user_metadata?.user_type) !== "teacher") {
        navigate("/dashboard");
      }
    }
  }, [isLoading, navigate, profile?.user_type, user]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        setIsFetching(true);
        const { data, error } = await supabase
          .from("materias")
          .select(`
            id,
            nome,
            descricao,
            turma:turma_id (
              id,
              nome,
              ano,
              escola:escola_id ( id, nome )
            )
          `)
          .eq("teacher_id", user.id)
          .order("nome", { ascending: true });

        if (error) throw error;

        const subjectList = (data || []) as Subject[];
        setSubjects(subjectList);

        const turmaIds = subjectList
          .map((subject) => subject.turma?.id)
          .filter((id): id is string => Boolean(id));

        if (turmaIds.length > 0) {
          const { data: studentsData, error: studentsError } = await supabase
            .from("profiles")
            .select("id, name, deficiencia, turma_id")
            .in("turma_id", turmaIds)
            .eq("user_type", "student")
            .order("name", { ascending: true });

          if (studentsError) throw studentsError;

          const grouped: Record<string, StudentProfile[]> = {};
          (studentsData || []).forEach((student) => {
            const turmaId = student.turma_id || "sem-turma";
            if (!grouped[turmaId]) grouped[turmaId] = [];
            grouped[turmaId].push(student as StudentProfile);
          });

          setStudentsByClass(grouped);
        } else {
          setStudentsByClass({});
        }
      } catch (error: any) {
        toast.error(error.message || "Erro ao carregar matérias");
      } finally {
        setIsFetching(false);
      }
    };

    load();
  }, [user]);

  const totalStudents = useMemo(() => {
    return Object.values(studentsByClass).reduce((acc, list) => acc + list.length, 0);
  }, [studentsByClass]);

  if (isLoading || !user || !profile || profile.user_type !== "teacher") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <ProtectedPageLayout
      title="Minhas Matérias"
      subtitle="Visão geral das turmas e estudantes que acompanham suas aulas"
      user={user}
      profile={profile}
      actions={
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          {subjects.length} matérias • {totalStudents} alunos
        </Badge>
      }
    >
      {isFetching ? (
        <div className="w-full py-16 flex items-center justify-center text-muted-foreground">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" aria-label="Carregando" />
        </div>
      ) : subjects.length === 0 ? (
        <Card className="shadow-school-lg">
          <CardHeader className="bg-gradient-to-br from-muted/60 to-muted/20">
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <FolderOpen className="h-5 w-5" /> Nenhuma matéria cadastrada
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            <p>Cadastre suas matérias para visualizar os alunos e turmas vinculadas.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {subjects.map((subject) => {
            const classId = subject.turma?.id || "sem-turma";
            const students = studentsByClass[classId] || [];

            return (
              <Card key={subject.id} className="shadow-school-lg">
                <CardHeader className="bg-gradient-to-br from-secondary/10 to-primary/10">
                  <CardTitle className="flex items-center gap-3 text-secondary">
                    <Users className="h-5 w-5" /> {subject.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                  <div className="flex flex-wrap gap-2">
                    {subject.turma?.nome ? (
                      <Badge variant="outline" className="border-secondary/30 text-secondary bg-secondary/10">
                        Turma: {subject.turma.nome}
                        {subject.turma.ano ? ` • ${subject.turma.ano}` : ""}
                      </Badge>
                    ) : null}
                    {subject.turma?.escola?.nome ? (
                      <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                        Escola: {subject.turma.escola.nome}
                      </Badge>
                    ) : null}
                    <Badge variant="outline" className="border-accent/30 text-accent bg-accent/10">
                      {students.length} aluno(s)
                    </Badge>
                  </div>

                  {subject.descricao ? <p>{subject.descricao}</p> : null}

                  {students.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nenhum aluno vinculado à turma até o momento.</p>
                  ) : (
                    <div className="space-y-2">
                      {students.map((student) => (
                        <div key={student.id} className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{(student.name || "AL").slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground text-sm">{student.name || "Aluno(a)"}</p>
                            <p className="text-xs text-muted-foreground">
                              Deficiência: {student.deficiencia || "Nenhuma"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </ProtectedPageLayout>
  );
}
