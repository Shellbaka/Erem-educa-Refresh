import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProtectedPageLayout } from "@/components/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchEscolas, fetchTurmas, updateUserVinculo } from "@/services/user";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, isLoading, refreshProfile } = useCurrentUser();
  const [isSaving, setIsSaving] = useState(false);

  const [escolas, setEscolas] = useState<Array<{ id: string; nome: string }>>([]);
  const [turmas, setTurmas] = useState<Array<{ id: string; nome: string; ano?: string | null }>>([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(true);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [isLoading, navigate, user]);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoadingSchools(true);
        const result = await fetchEscolas();
        setEscolas(result.map(({ id, nome }) => ({ id, nome })));
      } catch (error: any) {
        toast.error(error.message || "Erro ao carregar escolas");
      } finally {
        setIsLoadingSchools(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (profile?.escola_id) {
      setSelectedSchool(profile.escola_id);
    }
    if (profile?.turma_id) {
      setSelectedClass(profile.turma_id);
    }
  }, [profile?.escola_id, profile?.turma_id]);

  useEffect(() => {
    const load = async () => {
      if (!selectedSchool) {
        setTurmas([]);
        setSelectedClass("");
        return;
      }

      try {
        setIsLoadingClasses(true);
        const result = await fetchTurmas(selectedSchool);
        setTurmas(result.map(({ id, nome, ano }) => ({ id, nome, ano })));
      } catch (error: any) {
        toast.error(error.message || "Erro ao carregar turmas");
      } finally {
        setIsLoadingClasses(false);
      }
    };

    load();
  }, [selectedSchool]);

  const deficiencyBadge = useMemo(() => {
    const value = profile?.deficiencia;
    if (!value) return "Nenhuma";
    return value;
  }, [profile?.deficiencia]);

  const handleSave = async () => {
    if (!user) return;

    if (!selectedSchool) {
      toast.error("Selecione a escola");
      return;
    }

    if (!selectedClass) {
      toast.error("Selecione a turma");
      return;
    }

    try {
      setIsSaving(true);
      await updateUserVinculo({
        userId: user.id,
        escolaId: selectedSchool,
        turmaId: selectedClass,
      });

      await refreshProfile();
      toast.success("Vínculo escolar atualizado!");
    } catch (error: any) {
      toast.error(error.message || "Não foi possível atualizar o vínculo");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <ProtectedPageLayout
      title="Meu Perfil"
      subtitle={profile.name || user.user_metadata?.name || user.email}
      description={profile.user_type ? `Tipo de usuário: ${profile.user_type}` : undefined}
      infoSlot={
        <div className="flex flex-col gap-2 text-sm text-muted-foreground pt-2">
          <div>
            <strong className="text-foreground">Deficiência:</strong> {deficiencyBadge}
          </div>
          <div>
            <strong className="text-foreground">Escola:</strong> {profile.escola?.nome || "Não informada"}
          </div>
          <div>
            <strong className="text-foreground">Turma:</strong> {profile.turma?.nome ? `${profile.turma.nome}${profile.turma.ano ? ` • ${profile.turma.ano}` : ""}` : "Não informada"}
          </div>
        </div>
      }
      actions={
        <div className="flex items-center gap-2">
          <Button onClick={handleSave} disabled={isSaving || !selectedSchool || !selectedClass}>
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      }
    >
      <Card className="shadow-school-lg">
        <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardTitle className="text-lg font-semibold text-foreground">Vínculo Escolar</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="profile-school">Escola</Label>
            <Select
              value={selectedSchool}
              onValueChange={(value) => {
                setSelectedSchool(value);
                setSelectedClass("");
              }}
              disabled={isLoadingSchools}
            >
              <SelectTrigger id="profile-school">
                <SelectValue placeholder={isLoadingSchools ? "Carregando escolas..." : "Selecione a escola"} />
              </SelectTrigger>
              <SelectContent>
                {escolas.length === 0 && !isLoadingSchools ? (
                  <SelectItem value="" disabled>Nenhuma escola cadastrada</SelectItem>
                ) : null}
                {escolas.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-class">Turma</Label>
            <Select
              value={selectedClass}
              onValueChange={setSelectedClass}
              disabled={!selectedSchool || isLoadingClasses}
            >
              <SelectTrigger id="profile-class">
                <SelectValue placeholder={
                  !selectedSchool
                    ? "Selecione uma escola primeiro"
                    : isLoadingClasses
                    ? "Carregando turmas..."
                    : "Selecione a turma"
                } />
              </SelectTrigger>
              <SelectContent>
                {turmas.length === 0 && !isLoadingClasses ? (
                  <SelectItem value="" disabled>Nenhuma turma encontrada</SelectItem>
                ) : null}
                {turmas.map((turma) => (
                  <SelectItem key={turma.id} value={turma.id}>
                    {turma.nome}
                    {turma.ano ? ` • ${turma.ano}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving || !selectedSchool || !selectedClass}>
              {isSaving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </ProtectedPageLayout>
  );
}
