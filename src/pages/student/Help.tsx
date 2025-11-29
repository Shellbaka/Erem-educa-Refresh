import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProtectedPageLayout } from "@/components/ProtectedPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ListChecks,
  Hand,
  Waves,
  Info,
  Keyboard,
  MousePointer2,
  Accessibility,
  Laptop,
} from "lucide-react";

export default function StudentHelpPage() {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && (!user || (profile?.user_type || user.user_metadata?.user_type) !== "student")) {
      navigate("/dashboard");
    }
  }, [isLoading, navigate, profile?.user_type, user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const tutorialSteps = [
    {
      title: "Organize sua rotina",
      details: "Use o Dashboard para ver conteúdos, mensagens e avisos mais importantes.",
    },
    {
      title: "Ative recursos de acessibilidade",
      details: "Clique na engrenagem do canto superior direito para ajustar fonte, contraste e audiodescrição.",
    },
    {
      title: "Converse com professores",
      details: "Na aba Mensagens, envie dúvidas ou arquivos diretamente aos responsáveis pelas disciplinas.",
    },
  ];

  const shortcutTips = [
    { title: "Navegação por teclado", description: "Use Tab / Shift + Tab para percorrer botões rapidamente.", icon: Keyboard },
    { title: "Foco visível", description: "Todos os botões importantes exibem contorno quando selecionados.", icon: MousePointer2 },
    { title: "Preferências salvas", description: "Mudanças de acessibilidade são guardadas automaticamente no navegador.", icon: Accessibility },
  ];

  return (
    <ProtectedPageLayout
      title="Ajuda e Acessibilidade"
      subtitle="Dicas rápidas para aproveitar todos os recursos da plataforma"
      user={user}
      profile={profile}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-school-lg">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardTitle className="flex items-center gap-2 text-primary">
              <ListChecks className="h-5 w-5" /> Primeiros passos
            </CardTitle>
            <CardDescription>Um guia rápido para se orientar pela plataforma</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5 text-sm text-muted-foreground">
            {tutorialSteps.map((step, index) => (
              <div key={step.title} className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{step.title}</p>
                  <p>{step.details}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-school-lg">
          <CardHeader className="bg-gradient-to-br from-secondary/10 to-primary/10">
            <CardTitle className="flex items-center gap-2 text-secondary">
              <Hand className="h-5 w-5" /> Libras e Audiodescrição
            </CardTitle>
            <CardDescription>Atalhos para quem utiliza recursos de tradução ou narração</CardDescription>
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
              <AccordionItem value="voz">
                <AccordionTrigger>Atalhos de voz</AccordionTrigger>
                <AccordionContent>
                  Combine o leitor de tela do seu dispositivo com os botões de navegação visíveis para acelerar respostas em atividades.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-school-lg">
        <CardHeader className="bg-gradient-to-br from-accent/10 to-primary/10">
          <CardTitle className="flex items-center gap-2 text-accent">
            <Waves className="h-5 w-5" /> Navegação inclusiva
          </CardTitle>
          <CardDescription>Boas práticas para usar a Erem Conecta com conforto e segurança</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 grid md:grid-cols-3 gap-4">
          {shortcutTips.map((tip) => (
            <div key={tip.title} className="p-4 rounded-xl border border-border/50 bg-card/40">
              <tip.icon className="h-5 w-5 text-accent mb-3" />
              <p className="font-semibold text-sm text-foreground">{tip.title}</p>
              <p className="text-xs text-muted-foreground">{tip.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-school-lg">
        <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Laptop className="h-5 w-5" /> Tutorial rápido
          </CardTitle>
          <CardDescription>Relembre onde estão os botões essenciais</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 text-sm text-muted-foreground space-y-4">
          <ol className="list-decimal pl-4 space-y-2">
            <li>Menu principal: use o cabeçalho fixo para mudar entre conteúdos, desempenho e mensagens.</li>
            <li>Perfil: clique no avatar (topo direito) para editar dados pessoais ou sair da conta.</li>
            <li>Botão de acessibilidade: a engrenagem ao lado do avatar ajusta contraste, fonte e sons.</li>
          </ol>
        </CardContent>
      </Card>

      <Card className="shadow-school-lg">
        <CardHeader className="bg-gradient-to-br from-secondary/10 to-primary/10">
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
