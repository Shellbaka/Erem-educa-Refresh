import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { SchoolBackground } from "@/components/SchoolBackground";

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [userType, setUserType] = useState<string>("");
  const [deficiency, setDeficiency] = useState<string>("none");
  const [schools, setSchools] = useState<Array<{ id: string; nome: string }>>([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [schoolId, setSchoolId] = useState<string>("");
  const [turmas, setTurmas] = useState<Array<{ id: string; nome: string; ano: string | null }>>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [classId, setClassId] = useState<string>("");
  const [turno, setTurno] = useState<string>("manha");
  const [hasWarnedAboutLegacyProfile, setHasWarnedAboutLegacyProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const upsertProfileWithFallback = async (payload: Record<string, any>) => {
    const attempt = async (body: Record<string, any>, allowRetry: boolean) => {
      const { error } = await supabase.from("profiles").upsert(body);

      if (error) {
        const errorMessage = (error.message || "").toLowerCase();
        const isMissingTurnoColumn =
          errorMessage.includes('column "turno"') || errorMessage.includes("column turno");

        if (allowRetry && isMissingTurnoColumn) {
          if (!hasWarnedAboutLegacyProfile) {
            toast.info("Atualize as migrações para salvar o turno dos estudantes.", {
              description: "Estamos registrando o restante das informações sem o campo de turno.",
            });
            setHasWarnedAboutLegacyProfile(true);
          }

          const { turno: _ignored, ...fallback } = body;
          return attempt(fallback, false);
        }

        throw error;
      }
    };

    await attempt(payload, true);
  };

  useEffect(() => {
    const loadSchools = async () => {
      try {
        setIsLoadingSchools(true);
        const { data, error } = await supabase
          .from("escolas")
          .select("id, nome")
          .order("nome", { ascending: true });

        if (error) throw error;
        setSchools(data || []);
      } catch (error: any) {
        toast.error(error.message || "Não foi possível carregar as escolas");
      } finally {
        setIsLoadingSchools(false);
      }
    };

    loadSchools();
  }, []);

  useEffect(() => {
    const loadTurmas = async () => {
      if (!schoolId) {
        setTurmas([]);
        setClassId("");
        return;
      }

      try {
        setIsLoadingClasses(true);
        const { data, error } = await supabase
          .from("turmas")
          .select("id, nome, ano")
          .eq("escola_id", schoolId)
          .order("nome", { ascending: true });

        if (error) throw error;
        setTurmas(data || []);
      } catch (error: any) {
        toast.error(error.message || "Não foi possível carregar as turmas");
      } finally {
        setIsLoadingClasses(false);
      }
    };

    loadTurmas();
  }, [schoolId]);

  // Limpar turma quando o tipo de usuário mudar para não-aluno (mas manter escola)
  useEffect(() => {
    if (userType !== "student") {
      setClassId("");
      setTurmas([]);
    }
  }, [userType]);

  // Garantir que turno tenha valor padrão quando for estudante
  useEffect(() => {
    if (userType === "student" && !turno) {
      setTurno("manha");
    }
  }, [userType]);

  const deficiencyOptions = useMemo(
    () => [
      { value: "none", label: "Nenhuma" },
      { value: "Visual", label: "Visual" },
      { value: "Auditiva", label: "Auditiva" },
    ],
    []
  );

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const name = formData.get("name") as string;

      if (!userType) {
        setError("Por favor, selecione seu perfil");
        toast.error("Por favor, selecione seu perfil");
        setIsLoading(false);
        return;
      }

      // Validação condicional: apenas alunos precisam de escola e turma
      if (userType === "student") {
        if (!schoolId) {
          setError("Selecione a escola");
          toast.error("Selecione a escola");
          setIsLoading(false);
          return;
        }

        if (!classId) {
          setError("Selecione a turma");
          toast.error("Selecione a turma");
          setIsLoading(false);
          return;
        }

        if (!turno) {
          setError("Selecione o turno");
          toast.error("Selecione o turno");
          setIsLoading(false);
          return;
        }
      }
      // Preparar dados do perfil baseado no tipo de usuário
      const profileData: Record<string, any> = {
        name,
        user_type: userType,
        deficiencia: deficiency !== "none" ? deficiency : null,
        escola_id: schoolId || null, // Todos os tipos de usuário podem ter escola
      };

      // Apenas alunos têm turma e turno
      if (userType === "student") {
        profileData.turma_id = classId;
        profileData.turno = turno;
      } else {
        // Professores e admins não têm turma/turno
        profileData.turma_id = null;
        profileData.turno = null;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            name,
            user_type: userType,
            deficiencia: deficiency !== "none" ? deficiency : null,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        await upsertProfileWithFallback({
          id: data.user.id,
          ...profileData,
        });
      }

      toast.success("Conta criada com sucesso! Você já pode fazer login.");
      setError(null);
      setTimeout(() => {
        setActiveTab("login");
        // Limpar formulário
        setUserType("");
        setDeficiency("none");
        setSchoolId("");
        setClassId("");
        setTurno("manha");
      }, 1500);
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      const errorMessage = error.message || "Erro ao criar conta. Tente novamente.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SchoolBackground variant="textura">
      <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para início
          </Link>
          
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold">Erem Conecta</h1>
          <p className="text-muted-foreground">Acesse sua conta ou crie uma nova</p>
        </div>

        <Card className="shadow-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader className="space-y-1">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar conta</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="pt-6 relative z-10">
              <TabsContent value="login" className="mt-0">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      aria-required="true"
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      aria-required="true"
                      autoComplete="current-password"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    aria-busy={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-0 relative z-10">
                {error && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSignup} className="space-y-4" key={userType}>
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome completo</Label>
                    <Input
                      id="signup-name"
                      name="name"
                      type="text"
                      placeholder="Seu nome"
                      required
                      aria-required="true"
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      aria-required="true"
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      aria-required="true"
                      autoComplete="new-password"
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user-type">Eu sou...</Label>
                    <Select value={userType} onValueChange={setUserType} required>
                      <SelectTrigger id="user-type" aria-required="true">
                        <SelectValue placeholder="Selecione seu perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Estudante</SelectItem>
                        <SelectItem value="teacher">Professor(a)</SelectItem>
                        <SelectItem value="admin">Administrador(a)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deficiency">Deficiência (opcional)</Label>
                    <Select value={deficiency} onValueChange={setDeficiency}>
                      <SelectTrigger id="deficiency">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {deficiencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="predefined-school">Escola</Label>
                    <Select
                      value={schoolId || ""}
                      onValueChange={(value) => {
                        setSchoolId(value);
                        setClassId("");
                      }}
                    >
                      <SelectTrigger id="predefined-school">
                        <SelectValue placeholder="Selecione uma escola" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="erem-anibal-falcao">Erem Anibal Falcão</SelectItem>
                        <SelectItem value="erem-petronio-correia">Erem Petronio Correia</SelectItem>
                        <SelectItem value="erem-paulo-guerra">Erem Paulo Guerra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Campos específicos para ALUNOS: Turno, Escola e Turma */}
                  {userType === "student" && activeTab === "signup" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="turno">Turno <span className="text-destructive">*</span></Label>
                        <Select 
                          value={turno || "manha"} 
                          onValueChange={(value) => setTurno(value)} 
                          required
                        >
                          <SelectTrigger id="turno" aria-required="true">
                            <SelectValue placeholder="Selecione o turno" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manha">Manhã</SelectItem>
                            <SelectItem value="tarde">Tarde</SelectItem>
                            <SelectItem value="noite">Noite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="class">Turma <span className="text-destructive">*</span></Label>
                        <Select
                          value={classId || ""}
                          onValueChange={(value) => setClassId(value)}
                          required
                          disabled={!schoolId || isLoadingClasses}
                        >
                          <SelectTrigger id="class" aria-required="true" disabled={!schoolId || isLoadingClasses}>
                            <SelectValue placeholder={
                              !schoolId
                                ? "Selecione uma escola primeiro"
                                : isLoadingClasses
                                ? "Carregando turmas..."
                                : "Selecione a turma"
                            } />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingClasses ? (
                              <SelectItem value="" disabled>Carregando...</SelectItem>
                            ) : !schoolId ? (
                              <SelectItem value="" disabled>Selecione uma escola primeiro</SelectItem>
                            ) : turmas.length === 0 ? (
                              <SelectItem value="" disabled>Nenhuma turma cadastrada</SelectItem>
                            ) : (
                              turmas.map((turma) => (
                                <SelectItem key={turma.id} value={turma.id}>
                                  {turma.nome}
                                  {turma.ano ? ` • ${turma.ano}` : ""}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : null}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    aria-busy={isLoading}
                  >
                    {isLoading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Ao continuar, você concorda com nossos termos de uso e política de privacidade
        </p>
      </div>
      </div>
    </SchoolBackground>
  );
}
