import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  name: string | null;
  user_type: "student" | "teacher" | "admin" | null;
  avatar_url?: string | null;
  deficiencia?: "Visual" | "Auditiva" | null;
  turma_id?: string | null;
  escola_id?: string | null;
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
    endereco?: string | null;
  } | null;
  created_at?: string;
};

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (userId: string) => {
    const fetchProfile = async (includeAvatar = true) => {
      const selectFields = `
        id,
        name,
        user_type,
        ${includeAvatar ? "avatar_url," : ""}
        deficiencia,
        turma_id,
        escola_id,
        created_at,
        turma:turma_id ( id, nome, ano, escola:escola_id ( id, nome ) ),
        escola:escola_id ( id, nome, endereco )
      `;

      return supabase.from("profiles").select(selectFields).eq("id", userId).single();
    };

    try {
      const { data, error } = await fetchProfile(true);
      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      const message = (err?.message || "").toLowerCase();
      const hasAvatarColumnIssue = message.includes("avatar_url");

      if (hasAvatarColumnIssue) {
        try {
          const { data, error } = await fetchProfile(false);
          if (error) throw error;
          setProfile(data);
          setError(null);
          return;
        } catch (fallbackError: any) {
          setError(fallbackError.message || "Não foi possível carregar o perfil");
          setProfile(null);
          return;
        }
      }

      setError(err.message || "Não foi possível carregar o perfil");
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      const authUser = session?.user ?? null;
      setUser(authUser);

      if (authUser) {
        await loadProfile(authUser.id);
      } else {
        setProfile(null);
      }

      if (isMounted) setIsLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);

      if (authUser) {
        loadProfile(authUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user.id);
    }
  }, [loadProfile, user]);

  return {
    user,
    profile,
    isLoading,
    error,
    refreshProfile,
  };
}
