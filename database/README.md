# Banco de Dados - Ecoponto FAECO (Supabase)

## Configuração no Supabase

### Passo 1: Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha:
   - **Name**: ecoponto-faeco (ou outro nome)
   - **Database Password**: Crie uma senha forte (anote esta senha!)
   - **Region**: Escolha a região mais próxima
5. Clique em "Create new project" e aguarde a criação (pode levar alguns minutos)

### Passo 2: Obter String de Conexão

1. No projeto criado, vá em **Settings** → **Database**
2. Role até a seção **Connection string**
3. Selecione **URI** no dropdown
4. Copie a string de conexão (ela será algo como):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. Substitua `[YOUR-PASSWORD]` pela senha que você criou

### Passo 3: Executar Schema SQL

1. No projeto Supabase, vá em **SQL Editor** (ícone no menu lateral)
2. Clique em **New query**
3. Abra o arquivo `database/schema.sql` deste projeto
4. Cole todo o conteúdo no editor SQL do Supabase
5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Verifique se apareceu "Success. No rows returned"

### Passo 4: Configurar Variável de Ambiente

No arquivo `backend/.env`, configure:

```env
DATABASE_URL=postgresql://postgres:[SUA_SENHA]@db.[PROJECT_REF].supabase.co:5432/postgres
```

**Importante**: 
- Substitua `[SUA_SENHA]` pela senha do banco
- Substitua `[PROJECT_REF]` pelo ID do seu projeto (aparece na URL do Supabase)

Exemplo real:
```env
DATABASE_URL=postgresql://postgres:MinhaSenh@123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

## Estrutura das Tabelas

### users
Armazena dados dos usuários cadastrados.
- Campos: id, nome_completo, cpf, senha_hash, creditos, etc.

### descartes
Registra todos os descartes de óleo realizados.
- Campos: id, user_id, peso_kg, quantidade_pets, creditos_gerados, status

### resgates
Registra todos os resgates de óleo novo.
- Campos: id, user_id, creditos_utilizados, quantidade_oleo_ml

### reservatorio_status
Controla o status e capacidade do reservatório de óleo usado.
- Campos: id, peso_atual_kg, capacidade_maxima_kg, status

## Verificação

Após executar o schema, você pode verificar as tabelas:

1. No Supabase, vá em **Table Editor**
2. Você deve ver as 4 tabelas criadas:
   - users
   - descartes
   - resgates
   - reservatorio_status

## Segurança

O schema inclui Row Level Security (RLS) habilitado. As políticas básicas permitem leitura geral, mas você pode ajustar conforme necessário nas configurações do Supabase.

## Backup

O Supabase faz backup automático, mas você pode:
1. Ir em **Settings** → **Database**
2. Usar a opção de backup manual se necessário


