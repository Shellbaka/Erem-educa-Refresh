import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProtectedPageLayout } from "@/components/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Users,
  FolderOpen,
  Award,
  CalendarCheck,
  BookOpenCheck,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

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
  const [turmas, setTurmas] = useState<Array<{ id: string; nome: string; ano?: string | null }>>([]);
  const [isLoadingTurmas, setIsLoadingTurmas] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectDescription, setNewSubjectDescription] = useState("");
  const [newSubjectClassId, setNewSubjectClassId] = useState<string>("");

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if ((profile?.user_type || user.user_metadata?.user_type) !== "teacher") {
        navigate("/dashboard");
      }
    }
  }, [isLoading, navigate, profile?.user_type, user]);

  // Carrega turmas da escola do professor (se houver vínculo)
  useEffect(() => {
    const loadTurmas = async () => {
      if (!user || !profile?.escola_id) return;
      try {
        setIsLoadingTurmas(true);
        const { data, error } = await supabase
          .from("turmas")
          .select("id, nome, ano")
          .eq("escola_id", profile.escola_id)
          .order("nome", { ascending: true });

        if (error) throw error;
        setTurmas((data || []) as Array<{ id: string; nome: string; ano?: string | null }>);
      } catch (error: any) {
        toast.error(error.message || "Erro ao carregar turmas para cadastro de matérias");
      } finally {
        setIsLoadingTurmas(false);
      }
    };

    loadTurmas();
  }, [profile?.escola_id, user]);

  const sampleSubjects: Subject[] = [
    {
      id: "sample-1",
      nome: "Matemática Aplicada",
      descricao: "Raciocínio lógico, funções e problemas contextualizados.",
      turma: {
        id: "sample-turma-1",
        nome: "3º A",
        ano: "2025",
        escola: {
          id: "sample-escola",
          nome: "Erem Anibal Falcão",
        },
      },
    },
    {
      id: "sample-2",
      nome: "Projeto Integrador STEM",
      descricao: "Metodologias ativas envolvendo tecnologia e ciência.",
      turma: {
        id: "sample-turma-2",
        nome: "2º B",
        ano: "2025",
        escola: {
          id: "sample-escola",
          nome: "Erem Anibal Falcão",
        },
      },
    },
  ];

  const sampleStudentsByClass: Record<string, StudentProfile[]> = {
    "sample-turma-1": [
      { id: "sample-student-1", name: "Ana Bezerra", deficiencia: "Visual", turma_id: "sample-turma-1" },
      { id: "sample-student-2", name: "Rafael Souza", deficiencia: null, turma_id: "sample-turma-1" },
    ],
    "sample-turma-2": [
      { id: "sample-student-3", name: "Paulo Henrique", deficiencia: "Auditiva", turma_id: "sample-turma-2" },
      { id: "sample-student-4", name: "Isabella Lima", deficiencia: null, turma_id: "sample-turma-2" },
    ],
  };

  const teachingHighlights = [
    {
      label: "Turmas acompanhadas",
      value: new Set(subjects.map((s) => s.turma?.id || s.id)).size,
      icon: Users,
      extra: "Atualizado automaticamente",
    },
    {
      label: "Projetos ativos",
      value: subjects.length > 0 ? subjects.length : sampleSubjects.length,
      icon: BookOpenCheck,
      extra: "Incluindo interdisciplinares",
    },
    {
      label: "Avaliações planejadas",
      value: "4 próximas",
      icon: CalendarCheck,
      extra: "Gerencie os prazos",
    },
    {
      label: "Reconhecimentos",
      value: "2 destaques",
      icon: Award,
      extra: "Coordenação pedagógica",
    },
  ];

  const upcomingActivities = [
    {
      title: "Revisão para ENEM",
      turma: "3º A",
      date: "16/05",
      type: "Mentoria",
    },
    {
      title: "Apresentação Projeto STEM",
      turma: "2º B",
      date: "21/05",
      type: "Projeto",
    },
    {
      title: "Avaliação diagnóstica",
      turma: "1º A",
      date: "28/05",
      type: "Prova",
    },
  ];

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

        if (subjectList.length === 0) {
          setSubjects(sampleSubjects);
          setStudentsByClass(sampleStudentsByClass);
          setIsFetching(false);
          return;
        }

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

  const handleCreateSubject = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;

    if (!newSubjectName.trim()) {
      toast.error("Informe o nome da matéria");
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from("materias")
        .insert({
          nome: newSubjectName.trim(),
          descricao: newSubjectDescription.trim() || null,
          turma_id: newSubjectClassId || null,
          teacher_id: user.id,
        })
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
        .single();

      if (error) throw error;

      const created = data as Subject;
      setSubjects((prev) => [...prev, created]);
      setNewSubjectName("");
      setNewSubjectDescription("");
      setNewSubjectClassId("");
      toast.success("Matéria cadastrada com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Não foi possível cadastrar a matéria");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (id.startsWith("sample-")) {
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      return;
    }
    if (!confirm("Tem certeza que deseja remover esta matéria?")) return;

    try {
      const { error } = await supabase.from("materias").delete().eq("id", id);
      if (error) throw error;

      setSubjects((prev) => prev.filter((s) => s.id !== id));
      toast.success("Matéria removida com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Não foi possível remover a matéria");
    }
  };

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
          {subjects.length} matérias • {totalStudents || Object.values(sampleStudentsByClass).flat().length} alunos
        </Badge>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        {teachingHighlights.map((item) => (
          <Card key={item.label} className="card-school shadow-school">
            <CardContent className="pt-6 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-full bg-primary/10 text-primary">
                  <item.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{item.extra}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-school-lg">
        <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardTitle className="flex items-center justify-between gap-2 text-primary">
            <span className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" /> Cadastrar nova matéria
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleCreateSubject} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="subject-name">Nome da matéria</Label>
              <Input
                id="subject-name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Ex: Matemática, Português..."
                required
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="subject-class">Turma (opcional)</Label>
              <select
                id="subject-class"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={newSubjectClassId}
                onChange={(e) => setNewSubjectClassId(e.target.value)}
                disabled={isLoadingTurmas || turmas.length === 0}
              >
                <option value="">
                  {isLoadingTurmas
                    ? "Carregando turmas..."
                    : turmas.length === 0
                    ? "Nenhuma turma encontrada para sua escola"
                    : "Selecione uma turma (opcional)"}
                </option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome}
                    {turma.ano ? ` • ${turma.ano}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="subject-description">Descrição (opcional)</Label>
              <Input
                id="subject-description"
                value={newSubjectDescription}
                onChange={(e) => setNewSubjectDescription(e.target.value)}
                placeholder="Breve descrição da matéria ou do conteúdo trabalhado"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar matéria"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isFetching ? (
        <div className="w-full py-16 flex items-center justify-center text-muted-foreground">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" aria-label="Carregando" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {subjects.map((subject) => {
            const classId = subject.turma?.id || "sem-turma";
            const students = studentsByClass[classId] || [];
            const isSampleSubject = subject.id.startsWith("sample-");

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

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-destructive/40 text-destructive hover:bg-destructive hover:text-white"
                      onClick={() => handleDeleteSubject(subject.id)}
                      disabled={isSampleSubject}
                    >
                      {isSampleSubject ? "Exemplo" : "Remover matéria"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="shadow-school-lg mt-6">
        <CardHeader className="bg-gradient-to-br from-secondary/10 to-primary/10">
          <CardTitle className="flex items-center gap-2 text-secondary">
            <MessageSquare className="h-5 w-5" /> Próximas atividades
          </CardTitle>
          <CardDescription>Planejamento visual dos próximos encontros</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          {upcomingActivities.map((activity) => (
            <div key={activity.title} className="p-4 rounded-xl border border-border/50 bg-card/40">
              <p className="text-xs uppercase tracking-wide text-primary">{activity.type}</p>
              <p className="text-base font-semibold text-foreground">{activity.title}</p>
              <p className="text-xs text-muted-foreground">Turma {activity.turma}</p>
              <p className="text-xs text-muted-foreground">Data: {activity.date}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-school-lg mt-6">
        <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardTitle className="flex items-center gap-2 text-primary">
            <TrendingUp className="h-5 w-5" /> Boas práticas
          </CardTitle>
          <CardDescription>Dicas para acompanhar estudantes com necessidades distintas</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="p-4 rounded-xl border border-border/40 bg-card/40">
            <p className="font-semibold text-foreground mb-1">Briefings semanais</p>
            <p>Envie um resumo em áudio ou texto com os objetivos da semana.</p>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-card/40">
            <p className="font-semibold text-foreground mb-1">Mapas visuais</p>
            <p>Combine cores e ícones para indicar prioridade ou dificuldade.</p>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-card/40">
            <p className="font-semibold text-foreground mb-1">Retornos personalizados</p>
            <p>Use mensagens individuais para orientar e reconhecer avanços.</p>
          </div>
        </CardContent>
      </Card>
    </ProtectedPageLayout>
  );
}
