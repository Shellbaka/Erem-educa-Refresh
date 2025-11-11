import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProtectedPageLayout } from "@/components/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ListChecks, Hand, Waves, Info } from "lucide-react";

export default function StudentHelpPage() {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && (!user || (profile?.user_type || user.user_metadata?.user_type) !== "student")) {
      navigate("/dashboard");
    }
  }, [isLoading, navigate, profile?.user_type, user]);

  if (isLoading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <ProtectedPageLayout
      title="Ajuda e Acessibilidade"
      subtitle="Dicas rápidas para aproveitar todos os recursos da plataforma"
      user={user}
      profile={profile}
    >
      <Card className="shadow-school-lg">
        <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardTitle className="flex items-center gap-2 text-primary">
            <ListChecks className="h-5 w-5" /> Primeiros passos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-3 text-sm text-muted-foreground">
          <p>
            1. Use o menu principal para acessar conteúdos, mensagens e desempenho.
          </p>
          <p>
            2. No canto superior direito, você encontra suas informações pessoais e pode ajustar seu vínculo escolar.
          </p>
          <p>
            3. Explore as estatísticas para acompanhar seu progresso e suas atividades pendentes.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-school-lg">
        <CardHeader className="bg-gradient-to-br from-secondary/10 to-primary/10">
          <CardTitle className="flex items-center gap-2 text-secondary">
            <Hand className="h-5 w-5" /> Libras e Audiodescrição
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-sm text-muted-foreground space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="libras">
              <AccordionTrigger>Ativar tradução em Libras</AccordionTrigger>
              <AccordionContent>
                Clique no botão com o ícone de mão no canto inferior esquerdo. Se você marcou deficiência auditiva, ele ficará destacado para facilitar o acesso.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="audio">
              <AccordionTrigger>Usar audiodescrição</AccordionTrigger>
              <AccordionContent>
                Utilize o painel superior da tela (ícone de engrenagem) para ativar o modo audiodescrição. Ao ligar, elementos importantes serão narrados automaticamente.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="shadow-school-lg">
        <CardHeader className="bg-gradient-to-br from-accent/10 to-primary/10">
          <CardTitle className="flex items-center gap-2 text-accent">
            <Waves className="h-5 w-5" /> Navegação inclusiva
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-sm text-muted-foreground space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>Use a tecla <strong>Tab</strong> para navegar pelos botões rapidamente.</li>
            <li>Os botões principais possuem alto contraste quando a deficiência visual está ativa.</li>
            <li>Você pode ampliar a fonte usando os controles de acessibilidade no topo da página.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-school-lg">
        <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Info className="h-5 w-5" /> Precisa de mais suporte?
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-sm text-muted-foreground space-y-3">
          <p>
            Em caso de dúvidas, entre em contato com a coordenação ou utilize a área de mensagens para falar com seus professores.
          </p>
          <p>
            Estamos trabalhando para deixar a plataforma cada vez mais acessível. Sua opinião é fundamental!
          </p>
        </CardContent>
      </Card>
    </ProtectedPageLayout>
  );
}
