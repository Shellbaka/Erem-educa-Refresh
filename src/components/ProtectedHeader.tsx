import type { User } from "@supabase/supabase-js";
import { GraduationCap } from "lucide-react";
import { UserProfileMenu } from "@/components/UserProfileMenu";
import { AccessibilityButton } from "@/components/AccessibilityButton";
import type { Profile } from "@/hooks/useCurrentUser";

interface ProtectedHeaderProps {
  user: User;
  profile?: Profile | null;
  onLogout?: () => Promise<void> | void;
  pageTitle?: string;
}

export function ProtectedHeader({ user, profile, onLogout, pageTitle }: ProtectedHeaderProps) {
  const userType = profile?.user_type || user?.user_metadata?.user_type || "student";
  const headerBg =
    userType === "student"
      ? "from-primary/20 to-primary/5"
      : userType === "teacher"
      ? "from-secondary/20 to-secondary/5"
      : "from-accent/20 to-accent/5";

  const displayTitle = pageTitle || "Erem Conecta";
  const userTypeLabel =
    userType === "student" ? "Estudante" : userType === "teacher" ? "Professor(a)" : "Administrador(a)";

  return (
    <header
      className={`border-b bg-gradient-to-r ${headerBg} backdrop-blur-sm sticky top-0 z-50 shadow-sm`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg md:text-xl font-bold truncate">{displayTitle}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{userTypeLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <AccessibilityButton />
            <UserProfileMenu user={user} profile={profile ?? undefined} onLogout={onLogout} />
          </div>
        </div>
      </div>
    </header>
  );
}

