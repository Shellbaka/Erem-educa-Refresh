import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, PencilLine, Trash2, Plus } from "lucide-react";
import { ScrollRevealCard } from "@/components/ScrollRevealCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProtectedPageLayout } from "@/components/ProtectedPageLayout";

export default function TeacherClasses() {
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
      title="Minhas Turmas"
      subtitle="Gerencie suas turmas e acompanhe seus estudantes"
      user={user}
      profile={profile}
      actions={
        <Button size="sm" className="bg-primary hover:bg-primary-hover shadow-md">
          <Plus className="h-4 w-4 mr-2" /> Nova Turma
        </Button>
      }
    >
      <div className="grid md:grid-cols-2 gap-6">
        {[{n:"Turma A", s:28},{n:"Turma B", s:25}].map((c, idx) => (
          <ScrollRevealCard key={idx} delay={idx * 0.1}>
            <CardHeader className="pb-3 bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardTitle className="text-base font-semibold flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white shadow-md">
                  <Users className="h-5 w-5" />
                </span>
                {c.n}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium">
                <span className="text-secondary font-semibold">{c.s}</span> alunos
              </span>
              <div className="space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-primary/30 hover:bg-primary hover:text-white transition-colors"
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
              </div>
            </CardContent>
          </ScrollRevealCard>
        ))}
      </div>
    </ProtectedPageLayout>
  );
}


