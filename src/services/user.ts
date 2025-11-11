import { supabase } from "@/integrations/supabase/client";

export type Escola = {
  id: string;
  nome: string;
  endereco?: string | null;
};

export type Turma = {
  id: string;
  nome: string;
  ano?: string | null;
  escola_id: string | null;
};

export async function fetchEscolas() {
  const { data, error } = await supabase
    .from("escolas")
    .select("id, nome, endereco")
    .order("nome", { ascending: true });

  if (error) throw error;
  return (data || []) as Escola[];
}

export async function fetchTurmas(escolaId: string) {
  const { data, error } = await supabase
    .from("turmas")
    .select("id, nome, ano, escola_id")
    .eq("escola_id", escolaId)
    .order("nome", { ascending: true });

  if (error) throw error;
  return (data || []) as Turma[];
}

export async function updateUserVinculo({
  userId,
  escolaId,
  turmaId,
}: {
  userId: string;
  escolaId: string;
  turmaId: string;
}) {
  const { error } = await supabase
    .from("profiles")
    .update({
      escola_id: escolaId,
      turma_id: turmaId,
    })
    .eq("id", userId);

  if (error) throw error;
}
