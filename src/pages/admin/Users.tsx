import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCcw, PencilLine, ShieldCheck } from "lucide-react";
import { useCurrentUser, type Profile } from "@/hooks/useCurrentUser";
import { ProtectedPageLayout } from "@/components/ProtectedPageLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fetchEscolas, fetchTurmas } from "@/services/user";

type ProfileRow = Profile & {
  email?: string | null;
  turma?: {
    id: string;
    nome: string;
    ano?: string | null;
    escola?: {
      id: string;
      nome: string;
    } | null;
  } | null;
  escola?: {
    id: string;
    nome: string;
  } | null;
};

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useCurrentUser();
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ProfileRow | null>(null);
  const [formValues, setFormValues] = useState<{ name: string; user_type: "student" | "teacher" | "admin" }>(
    { name: "", user_type: "student" }
  );
  const [dialogSchoolId, setDialogSchoolId] = useState<string>("");
  const [dialogClassId, setDialogClassId] = useState<string>("");
  const [dialogSchools, setDialogSchools] = useState<Array<{ id: string; nome: string }>>([]);
  const [dialogTurmas, setDialogTurmas] = useState<Array<{ id: string; nome: string; ano?: string | null }>>([]);
  const [isLoadingDialogSchools, setIsLoadingDialogSchools] = useState(false);
  const [isLoadingDialogTurmas, setIsLoadingDialogTurmas] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin = useMemo(() => {
    const role = profile?.user_type || user?.user_metadata?.user_type;
    return role === "admin";
  }, [profile?.user_type, user?.user_metadata?.user_type]);

  useEffect(() => {
    const loadSchools = async () => {
      try {
        setIsLoadingDialogSchools(true);
        const result = await fetchEscolas();
        setDialogSchools(result.map(({ id, nome }) => ({ id, nome })));
      } catch (error: any) {
        toast.error(error.message || "Erro ao carregar escolas");
      } finally {
        setIsLoadingDialogSchools(false);
      }
    };

    loadSchools();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        navigate("/dashboard");
      }
    }
  }, [isAdmin, isLoading, navigate, user]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setIsFetching(true);
      setError(null);

      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          name,
          user_type,
          deficiencia,
          turma_id,
          escola_id,
          created_at,
          avatar_url,
          turma:turma_id ( id, nome, ano, escola:escola_id ( id, nome ) ),
          escola:escola_id ( id, nome )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted: ProfileRow[] = (data || []).map((row) => ({
        ...row,
        name: row.name ?? "Sem nome",
      }));

      setUsers(formatted);
    } catch (err: any) {
      setError(err.message || "Não foi possível carregar os usuários");
      toast.error("Erro ao carregar usuários. Verifique as permissões de acesso.");
    } finally {
      setIsFetching(false);
    }
  };

  const openEditDialog = (userData: ProfileRow) => {
    setSelectedUser(userData);
    setFormValues({
      name: userData.name ?? "",
      user_type: (userData.user_type as "student" | "teacher" | "admin") || "student",
    });
    setDialogSchoolId(userData.escola_id || "");
    setDialogClassId(userData.turma_id || "");
    setIsDialogOpen(true);
    if (userData.escola_id) {
      loadDialogTurmas(userData.escola_id);
    } else {
      setDialogTurmas([]);
    }
  };

  const loadDialogTurmas = async (schoolId: string) => {
    try {
      setIsLoadingDialogTurmas(true);
      const result = await fetchTurmas(schoolId);
      setDialogTurmas(result.map(({ id, nome, ano }) => ({ id, nome, ano })));
    } catch (error: any) {
      toast.error(error.message || "Erro ao carregar turmas");
    } finally {
      setIsLoadingDialogTurmas(false);
    }
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    if (!dialogSchoolId) {
      toast.error("Selecione a escola para o usuário");
      return;
    }

    if (!dialogClassId) {
      toast.error("Selecione a turma para o usuário");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: formValues.name,
          user_type: formValues.user_type,
          escola_id: dialogSchoolId || null,
          turma_id: dialogClassId || null,
        })
        .eq("id", selectedUser.id);

      if (error) throw error;

      const selectedSchoolName = dialogSchools.find((school) => school.id === dialogSchoolId)?.nome;
      const selectedClass = dialogTurmas.find((turma) => turma.id === dialogClassId);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                name: formValues.name,
                user_type: formValues.user_type,
                escola_id: dialogSchoolId || null,
                turma_id: dialogClassId || null,
                escola: dialogSchoolId
                  ? {
                      id: dialogSchoolId,
                      nome: selectedSchoolName || u.escola?.nome || u.turma?.escola?.nome || "",
                    }
                  : null,
                turma: dialogClassId
                  ? {
                      id: dialogClassId,
                      nome: selectedClass?.nome || "",
                      ano: selectedClass?.ano || null,
                      escola: dialogSchoolId
                        ? {
                            id: dialogSchoolId,
                            nome: selectedSchoolName || u.escola?.nome || u.turma?.escola?.nome || "",
                          }
                        : null,
                    }
                  : null,
              }
            : u
        )
      );

      toast.success("Usuário atualizado com sucesso!");
      setIsDialogOpen(false);
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Não foi possível atualizar o usuário");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <ProtectedPageLayout
      title="Gestão de Usuários"
      subtitle="Visualize e edite os perfis cadastrados na plataforma"
      description={
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-accent" />
          Acesso restrito a administradores
        </div>
      }
      user={user}
      profile={profile}
      actions={
        <Button
          variant="outline"
          size="sm"
          className="border-accent/40 hover:bg-accent hover:text-white"
          onClick={fetchUsers}
          disabled={isFetching}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      }
    >
      <Card className="shadow-school-lg">
        <CardHeader className="bg-gradient-to-br from-accent/10 to-primary/10">
          <CardTitle className="text-lg font-semibold text-accent">Usuários cadastrados</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Deficiência</TableHead>
                  <TableHead>Escola</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Carregando usuários...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/40">
                      <TableCell className="font-medium">{item.name || "Sem nome"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="capitalize border-accent/40 text-accent bg-accent/10"
                        >
                          {item.user_type === "teacher"
                            ? "Professor(a)"
                            : item.user_type === "admin"
                            ? "Administrador(a)"
                            : "Estudante"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.deficiencia ? (
                          <Badge
                            variant="outline"
                            className="capitalize border-primary/30 text-primary bg-primary/10"
                          >
                            {item.deficiencia}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Nenhuma</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.escola?.nome || item.turma?.escola?.nome ? (
                          <Badge
                            variant="outline"
                            className="capitalize border-secondary/30 text-secondary bg-secondary/10"
                          >
                            {item.escola?.nome || item.turma?.escola?.nome}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Não informado</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.turma?.nome ? (
                          <Badge
                            variant="outline"
                            className="capitalize border-accent/30 text-accent bg-accent/10"
                          >
                            {item.turma.nome}
                            {item.turma.ano ? ` • ${item.turma.ano}` : ""}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Não informado</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {item.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString("pt-BR")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/40 hover:bg-primary hover:text-white"
                          onClick={() => openEditDialog(item)}
                        >
                          <PencilLine className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar usuário</DialogTitle>
            <DialogDescription>
              Atualize o nome e o tipo de acesso do usuário selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formValues.name}
                onChange={(event) => setFormValues((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Tipo de usuário</Label>
              <Select
                value={formValues.user_type}
                onValueChange={(value: "student" | "teacher" | "admin") =>
                  setFormValues((prev) => ({ ...prev, user_type: value }))
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Estudante</SelectItem>
                  <SelectItem value="teacher">Professor(a)</SelectItem>
                  <SelectItem value="admin">Administrador(a)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialog-school">Escola</Label>
              <Select
                value={dialogSchoolId}
                onValueChange={(value) => {
                  setDialogSchoolId(value);
                  setDialogClassId("");
                  if (value) {
                    loadDialogTurmas(value);
                  } else {
                    setDialogTurmas([]);
                  }
                }}
                disabled={isLoadingDialogSchools}
              >
                <SelectTrigger id="dialog-school">
                  <SelectValue placeholder={isLoadingDialogSchools ? "Carregando escolas..." : "Selecione a escola"} />
                </SelectTrigger>
                <SelectContent>
                  {dialogSchools.length === 0 && !isLoadingDialogSchools ? (
                    <SelectItem value="" disabled>Nenhuma escola cadastrada</SelectItem>
                  ) : null}
                  {dialogSchools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialog-class">Turma</Label>
              <Select
                value={dialogClassId}
                onValueChange={setDialogClassId}
                disabled={!dialogSchoolId || isLoadingDialogTurmas}
              >
                <SelectTrigger id="dialog-class">
                  <SelectValue placeholder={
                    !dialogSchoolId
                      ? "Selecione uma escola primeiro"
                      : isLoadingDialogTurmas
                      ? "Carregando turmas..."
                      : "Selecione a turma"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {dialogTurmas.length === 0 && !isLoadingDialogTurmas ? (
                    <SelectItem value="" disabled>Nenhuma turma cadastrada</SelectItem>
                  ) : null}
                  {dialogTurmas.map((turma) => (
                    <SelectItem key={turma.id} value={turma.id}>
                      {turma.nome}
                      {turma.ano ? ` • ${turma.ano}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedPageLayout>
  );
}
