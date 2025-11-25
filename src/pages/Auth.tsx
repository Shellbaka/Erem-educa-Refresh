import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AccessibilityBar } from "@/components/AccessibilityBar";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<string>("");
  const [deficiency, setDeficiency] = useState<string>("none");
  const [schools, setSchools] = useState<Array<{ id: string; nome: string }>>([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [schoolId, setSchoolId] = useState<string>("");
  const [turmas, setTurmas] = useState<Array<{ id: string; nome: string; ano: string | null }>>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [classId, setClassId] = useState<string>("");
  const [turno, setTurno] = useState<string>("manha");

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

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!userType) {
      toast.error("Por favor, selecione seu perfil");
      setIsLoading(false);
      return;
    }

    if (!schoolId) {
      toast.error("Selecione a escola");
      setIsLoading(false);
      return;
    }

    if (!classId) {
      toast.error("Selecione a turma");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            name,
            user_type: userType,
            deficiencia: deficiency !== "none" ? deficiency : null,
            escola_id: schoolId,
            turma_id: classId,
            turno,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            name,
            user_type: userType,
            deficiencia: deficiency !== "none" ? deficiency : null,
            escola_id: schoolId,
            turma_id: classId,
            turno,
          });

        if (profileError) throw profileError;
      }

      toast.success("Conta criada! Você já pode fazer login.");
      setTimeout(() => {
        const loginTab = document.querySelector('[value="login"]') as HTMLElement;
        loginTab?.click();
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-4">
      <AccessibilityBar />
      
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
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="space-y-1">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar conta</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="login">
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

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
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
                    <div className="mt-3 grid grid-cols-2 gap-2" aria-label="Atalhos visuais de ação">
                      <Button
                        type="button"
                        className="h-11 text-base font-semibold bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => {
                          const loginTab = document.querySelector('[value="login"]') as HTMLElement;
                          loginTab?.click();
                        }}
                      >
                        🔴 Entrar
                      </Button>
                      <Button
                        type="button"
                        className="h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                          const signupTab = document.querySelector('[value="signup"]') as HTMLElement;
                          signupTab?.click();
                        }}
                      >
                        🔵 Criar conta
                      </Button>
                      <Button
                        type="button"
                        className="h-11 text-base font-semibold bg-green-600 hover:bg-green-700 text-white col-span-2"
                        onClick={() => document.getElementById("deficiency")?.focus()}
                      >
                        🟢 Acessibilidade visual
                      </Button>
                      <Button
                        asChild
                        type="button"
                        className="h-11 text-base font-semibold bg-yellow-500 hover:bg-yellow-600 text-black col-span-2"
                      >
                        <Link to="/">🟡 Voltar para o início</Link>
                      </Button>
                    </div>
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
                    <Label htmlFor="turno">Turno</Label>
                    <Select value={turno} onValueChange={setTurno} required>
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
                    <Label htmlFor="school">Escola</Label>
                    <Select
                      value={schoolId}
                      onValueChange={(value) => {
                        setSchoolId(value);
                        setClassId("");
                      }}
                      required
                    >
                      <SelectTrigger id="school" aria-required="true">
                        <SelectValue placeholder={isLoadingSchools ? "Carregando escolas..." : "Selecione a escola"} />
                      </SelectTrigger>
                      <SelectContent>
                        {schools.length === 0 && !isLoadingSchools ? (
                          <SelectItem value="" disabled>Nenhuma escola cadastrada</SelectItem>
                        ) : null}
                        {schools.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class">Turma</Label>
                    <Select
                      value={classId}
                      onValueChange={setClassId}
                      required
                      disabled={!schoolId || isLoadingClasses}
                    >
                      <SelectTrigger id="class" aria-required="true">
                        <SelectValue placeholder={
                          !schoolId
                            ? "Selecione uma escola primeiro"
                            : isLoadingClasses
                            ? "Carregando turmas..."
                            : "Selecione a turma"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {turmas.length === 0 && !isLoadingClasses ? (
                          <SelectItem value="" disabled>Nenhuma turma cadastrada</SelectItem>
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
  );
}
