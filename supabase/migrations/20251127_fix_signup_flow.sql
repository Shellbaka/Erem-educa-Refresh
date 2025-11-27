-- Migration para corrigir o fluxo de cadastro
-- Garante que todas as colunas necessárias existam e que as políticas estejam corretas

-- Garantir que a coluna turno existe (pode já existir, mas vamos garantir)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'turno'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN turno text CHECK (turno IN ('manha', 'tarde', 'noite'));
  END IF;
END $$;

-- Garantir que deficiencia existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'deficiencia'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN deficiencia text CHECK (deficiencia IN ('Visual', 'Auditiva'));
  END IF;
END $$;

-- Garantir que escola_id e turma_id existem
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'escola_id'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN escola_id uuid REFERENCES public.escolas(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'turma_id'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN turma_id uuid REFERENCES public.turmas(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Criar função helper para verificar se é admin (evita recursão)
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id AND user_type = 'admin'
  );
$$;

-- Política para permitir que usuários criem seu próprio perfil durante signup
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Política para permitir que usuários atualizem seu próprio perfil
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política para admins lerem todos os perfis (usando a função helper)
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Política para admins atualizarem todos os perfis
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Garantir que professores podem ler perfis de alunos em suas matérias
DROP POLICY IF EXISTS "Teachers can read student profiles in their subjects" ON public.profiles;
CREATE POLICY "Teachers can read student profiles in their subjects" ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.materias m
    WHERE m.turma_id = profiles.turma_id
      AND m.teacher_id = auth.uid()
  )
);

-- Criar trigger para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, user_type, deficiencia, escola_id, turma_id, turno)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student')::text,
    CASE 
      WHEN NEW.raw_user_meta_data->>'deficiencia' IS NOT NULL 
      THEN NEW.raw_user_meta_data->>'deficiencia'
      ELSE NULL
    END,
    CASE 
      WHEN NEW.raw_user_meta_data->>'escola_id' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'escola_id')::uuid
      ELSE NULL
    END,
    CASE 
      WHEN NEW.raw_user_meta_data->>'turma_id' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'turma_id')::uuid
      ELSE NULL
    END,
    CASE 
      WHEN NEW.raw_user_meta_data->>'turno' IS NOT NULL 
      THEN NEW.raw_user_meta_data->>'turno'
      ELSE NULL
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    user_type = EXCLUDED.user_type,
    deficiencia = EXCLUDED.deficiencia,
    escola_id = EXCLUDED.escola_id,
    turma_id = EXCLUDED.turma_id,
    turno = EXCLUDED.turno;
  RETURN NEW;
END;
$$;

-- Dropar trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Comentários para documentação
COMMENT ON COLUMN public.profiles.turno IS 'Turno do estudante: manha, tarde ou noite. Apenas para alunos.';
COMMENT ON COLUMN public.profiles.escola_id IS 'ID da escola. Apenas para alunos.';
COMMENT ON COLUMN public.profiles.turma_id IS 'ID da turma. Apenas para alunos.';
COMMENT ON COLUMN public.profiles.deficiencia IS 'Tipo de deficiência: Visual ou Auditiva. Opcional para todos os tipos de usuário.';

