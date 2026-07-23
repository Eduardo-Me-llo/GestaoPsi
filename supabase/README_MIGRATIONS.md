# 🔧 Como Aplicar as Migrations do Supabase

## ⚠️ IMPORTANTE: Migrations Pendentes

Existem 2 migrations que precisam ser aplicadas manualmente no Supabase Dashboard:

### **1. Adicionar tipo 'via-me' ao enum wheel_type**
**Arquivo:** `20260722120000_add_via_me_wheel_type.sql`

**O que faz:** Adiciona o valor 'via-me' ao enum `wheel_type` para permitir salvar a Roda da Vida VIA ME.

**Sintoma se não aplicada:** Erro ao salvar: `invalid input value for enum wheel_type: "via-me"`

### **2. Corrigir política RLS de wheel_entries**
**Arquivo:** `20260722130000_fix_wheel_entries_rls.sql`

**O que faz:** Corrige a validação de propriedade do cliente através da tabela `clients`.

**Sintoma se não aplicada:** Erro ao salvar: `The related client must belong to the same user`

---

## 📋 Como Aplicar (Método 1 - SQL Editor)

### **Passo 1:** Acesse o Supabase Dashboard
1. Vá em: https://supabase.com/dashboard
2. Selecione seu projeto: **GestãoPsi**
3. Clique em: **SQL Editor** (no menu lateral)

### **Passo 2:** Aplicar Migration 1
1. Clique em **"New query"**
2. Cole o conteúdo de `20260722120000_add_via_me_wheel_type.sql`:
```sql
ALTER TYPE public.wheel_type ADD VALUE IF NOT EXISTS 'via-me';
```
3. Clique em **Run** (▶️)
4. Aguarde a confirmação: "Success. No rows returned"

### **Passo 3:** Aplicar Migration 2
1. Clique em **"New query"** novamente
2. Cole o conteúdo de `20260722130000_fix_wheel_entries_rls.sql`:
```sql
DROP POLICY IF EXISTS "wheel_entries_own" ON public.wheel_entries;

CREATE POLICY "wheel_entries_own" ON public.wheel_entries FOR ALL TO authenticated
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = wheel_entries.client_id 
      AND clients.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = wheel_entries.client_id 
      AND clients.user_id = auth.uid()
    )
  );
```
3. Clique em **Run** (▶️)
4. Aguarde a confirmação: "Success. No rows returned"

### **Passo 4:** Verificar
Execute esta query para confirmar:
```sql
-- Verificar se 'via-me' foi adicionado
SELECT unnest(enum_range(NULL::wheel_type));

-- Verificar política RLS
SELECT policyname, tablename 
FROM pg_policies 
WHERE tablename = 'wheel_entries' 
AND policyname = 'wheel_entries_own';
```

Resultado esperado:
- Enum deve listar: `adolescente`, `adulto`, `via-me`
- Política deve aparecer: `wheel_entries_own` | `wheel_entries`

---

## 📋 Como Aplicar (Método 2 - CLI)

Se você tem o Supabase CLI instalado:

```bash
# 1. Instalar CLI (se não tiver)
npm install -g supabase

# 2. Fazer login
supabase login

# 3. Linkar ao projeto
supabase link --project-ref fdixndtvdborwgdizgqn

# 4. Aplicar migrations pendentes
supabase db push
```

---

## ✅ Checklist de Verificação

Após aplicar as migrations, verifique:

- [ ] Enum `wheel_type` contém 'via-me'
- [ ] Política `wheel_entries_own` foi recriada
- [ ] Consegue salvar Roda VIA ME sem erro
- [ ] Consegue exportar PDF da Roda VIA ME

---

## 🆘 Problemas Comuns

### **Erro: "type 'via-me' already exists"**
**Causa:** Migration já foi aplicada.
**Solução:** Ignore o erro, está tudo certo.

### **Erro: "permission denied for table wheel_entries"**
**Causa:** Usuário não tem permissão.
**Solução:** Execute as queries como o owner do projeto (geralmente seu usuário principal).

### **Erro ao salvar persiste**
**Causa:** Cache do navegador ou sessão antiga.
**Solução:** 
1. Faça logout
2. Limpe cache do navegador (Ctrl+Shift+Del)
3. Faça login novamente

---

## 📝 Histórico de Migrations

| Data | Arquivo | Descrição |
|------|---------|-----------|
| 2026-01-22 | `20260722100000_admin_panel.sql` | Adiciona painel administrativo completo |
| 2026-01-22 | `20260722120000_add_via_me_wheel_type.sql` | Adiciona tipo 'via-me' ao enum |
| 2026-01-22 | `20260722130000_fix_wheel_entries_rls.sql` | Corrige política RLS de wheel_entries |

---

**✨ Após aplicar as migrations, a Roda VIA ME funcionará completamente!**
