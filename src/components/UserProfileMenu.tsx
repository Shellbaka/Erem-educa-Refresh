import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, LogOut, UserCircle2 } from "lucide-react";
import type { Profile } from "@/hooks/useCurrentUser";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserProfileMenuProps {
  user?: User | null;
  profile?: Profile | null;
  onLogout?: () => Promise<void> | void;
}

export function UserProfileMenu({ user, profile, onLogout }: UserProfileMenuProps) {
  const initials = useMemo(() => {
    if (profile?.name) {
      return profile.name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
    }

    if (user?.user_metadata?.name) {
      return user.user_metadata.name
        .split(" ")
        .slice(0, 2)
        .map((part: string) => part[0])
        .join("")
        .toUpperCase();
    }

    return user?.email?.slice(0, 2).toUpperCase() ?? "US";
  }, [profile?.name, user]);

  const avatarUrl =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.avatarURL ||
    user?.user_metadata?.picture ||
    null;

  const displayName = profile?.name || user?.user_metadata?.name || user?.email || "Usuário";
  const userType = profile?.user_type || user?.user_metadata?.user_type || "student";
  const createdAt = profile?.created_at || user?.created_at;

  const handleLogout = async () => {
    try {
      if (onLogout) {
        await onLogout();
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer logout");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-10 w-10 rounded-full border border-border/60 hover:border-primary/70"
          aria-label="Abrir menu do perfil"
        >
          <Avatar className="h-8 w-8">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{displayName}</span>
                <Badge variant="outline" className="capitalize border-primary/40 text-primary text-xs">
                  {userType === "student"
                    ? "Estudante"
                    : userType === "teacher"
                    ? "Professor(a)"
                    : "Administrador(a)"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground break-words">{user?.email}</p>
              {createdAt ? (
                <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  Desde {new Date(createdAt).toLocaleDateString("pt-BR")}
                </p>
              ) : null}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="w-full text-sm flex items-center gap-2">
            <UserCircle2 className="h-4 w-4 text-muted-foreground" />
            Ver perfil completo
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
