import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, PencilLine, Trash2, BookOpen, FolderPlus } from "lucide-react";
import { ScrollRevealCard } from "@/components/ScrollRevealCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProtectedPageLayout } from "@/components/ProtectedPageLayout";

export default function TeacherContents() {
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
      title="Conteúdos"
      subtitle="Publique e organize seus materiais pedagógicos"
      user={user}
      profile={profile}
      actions={
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-secondary hover:bg-secondary-hover shadow-md">
            <Upload className="h-4 w-4 mr-2" /> Novo Material
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-secondary/30 hover:bg-secondary hover:text-white transition-colors"
          >
            <FolderPlus className="h-4 w-4 mr-2" /> Criar Pasta
          </Button>
        </div>
      }
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map((i, idx) => (
          <ScrollRevealCard key={i} delay={idx * 0.1} className="overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-br from-secondary/10 to-primary/10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-md">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base font-semibold">Material {i}</CardTitle>
                  <Badge variant="secondary" className="mt-2 bg-secondary/20 text-secondary border-secondary/30">
                    Geografia
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium">Vídeo • 8 min</span>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-secondary/30 hover:bg-secondary hover:text-white transition-colors"
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


