import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { UserProfileMenu } from "@/components/UserProfileMenu";
import type { Profile } from "@/hooks/useCurrentUser";
import { useDeficiencyTheme } from "@/hooks/useDeficiencyTheme";
import { Badge } from "@/components/ui/badge";

interface ProtectedPageLayoutProps {
  title: string;
  subtitle?: ReactNode;
  description?: ReactNode;
  user: User;
  profile?: Profile | null;
  children: ReactNode;
  actions?: ReactNode;
  infoSlot?: ReactNode;
  showUserInfo?: boolean;
}

export function ProtectedPageLayout({
  title,
  subtitle,
  description,
  user,
  profile,
  children,
  actions,
  infoSlot,
  showUserInfo = true,
}: ProtectedPageLayoutProps) {
  useDeficiencyTheme(profile?.deficiencia ?? user.user_metadata?.deficiencia);

  const defaultInfo = (() => {
    if (!showUserInfo || !profile) return null;

    const items: ReactNode[] = [];

    if (profile.deficiencia) {
      items.push(
        <Badge key="def" variant="outline" className="capitalize border-primary/30 text-primary bg-primary/10">
          Deficiência: {profile.deficiencia}
        </Badge>
      );
    }

    const escolaNome = profile.escola?.nome || user.user_metadata?.escola_nome;
    if (profile.escola_id || escolaNome) {
      items.push(
        <Badge key="escola" variant="outline" className="border-secondary/30 text-secondary bg-secondary/10">
          Escola: {escolaNome || "vinculada"}
        </Badge>
      );
    }

    const turmaNome = profile.turma?.nome || user.user_metadata?.turma_nome;
    const turmaAno = profile.turma?.ano;
    if (profile.turma_id || turmaNome) {
      items.push(
        <Badge key="turma" variant="outline" className="border-accent/30 text-accent bg-accent/10">
          Turma: {turmaNome || "vinculada"}
          {turmaAno ? ` • ${turmaAno}` : ""}
        </Badge>
      );
    }

    if (items.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 pt-2" aria-label="Informações do vínculo escolar">
        {items}
      </div>
    );
  })();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-10">
          <div className="max-w-2xl space-y-2">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{title}</h1>
              {subtitle ? <div className="text-lg text-muted-foreground">{subtitle}</div> : null}
              {description ? <div className="text-sm text-muted-foreground">{description}</div> : null}
            </div>
            {infoSlot || defaultInfo}
          </div>
          <div className="flex items-center gap-3 self-end lg:self-auto">
            {actions}
            <UserProfileMenu user={user} profile={profile ?? undefined} />
          </div>
        </div>
        <div className="space-y-8">{children}</div>
      </div>
    </div>
  );
}
