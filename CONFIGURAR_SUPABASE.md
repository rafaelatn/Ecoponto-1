# 🚀 Guia Completo: Configurar Supabase

Este guia passo a passo vai te ajudar a configurar o Supabase para o projeto Ecoponto FAECO.

## Passo 1: Criar Conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **Sign Up** (ou **Sign In** se já tiver conta)
3. Faça login com GitHub, Google ou email
4. Confirme seu email se necessário

## Passo 2: Criar Novo Projeto

1. No dashboard do Supabase, clique em **New Project**
2. Preencha os dados:
   - **Name**: `ecoponto-faeco` (ou outro nome de sua preferência)
   - **Database Password**: 
     - ⚠️ **IMPORTANTE**: Crie uma senha forte e anote em local seguro!
     - Você precisará desta senha para conectar o backend
     - Exemplo: `MinhaSenh@123!Segura`
   - **Region**: Escolha a região mais próxima do Brasil (ex: `South America (São Paulo)`)
   - **Pricing Plan**: Free (plano gratuito é suficiente para desenvolvimento)
3. Clique em **Create new project**
4. ⏳ Aguarde a criação (pode levar 2-5 minutos)

## Passo 3: Obter String de Conexão

1. No projeto criado, vá em **Settings** (ícone de engrenagem no menu lateral)
2. Clique em **Database** no menu lateral
3. Role a página até encontrar a seção **Connection string**
4. No dropdown, selecione **URI**
5. Você verá algo como:
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   ```
6. **Mas vamos usar a versão direta:**
   - Clique no dropdown e selecione **Connection string** novamente
   - Procure por **URI** ou **Connection pooling**
   - A string correta será algo como:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
7. **Copie esta string** (você vai precisar dela)

## Passo 4: Executar Schema SQL

1. No projeto Supabase, vá em **SQL Editor** (ícone de banco de dados no menu lateral)
2. Clique em **New query**
3. Abra o arquivo `database/schema.sql` deste projeto no seu editor de código
4. **Selecione todo o conteúdo** do arquivo (Ctrl+A)
5. **Cole no editor SQL do Supabase**
6. Clique no botão **Run** (ou pressione `Ctrl+Enter`)
7. Aguarde alguns segundos
8. Você deve ver a mensagem: **"Success. No rows returned"**

✅ Se apareceu "Success", o schema foi criado com sucesso!

## Passo 5: Verificar Tabelas Criadas

1. No Supabase, vá em **Table Editor** (ícone de tabela no menu lateral)
2. Você deve ver 4 tabelas:
   - ✅ `users`
   - ✅ `descartes`
   - ✅ `resgates`
   - ✅ `reservatorio_status`

Se todas aparecerem, está tudo certo! 🎉

## Passo 6: Configurar Backend (Arquivo Local)

⚠️ **IMPORTANTE**: Este passo é feito no seu computador, no editor de código (Cursor, VS Code, etc.), NÃO no Supabase!

1. **No seu editor de código** (Cursor/VS Code), abra o arquivo:
   - Caminho: `backend/.env`
   - Este arquivo está na pasta do projeto no seu computador

2. Você verá algo como:
   ```env
   DATABASE_URL=postgresql://postgres:[SUA_SENHA]@db.[PROJECT_REF].supabase.co:5432/postgres
   ```

3. **Substitua os valores `[SUA_SENHA]` e `[PROJECT_REF]`** pela string real que você copiou do Supabase:
   - Use a string completa que você copiou no **Passo 3**
   - Ou substitua manualmente os valores

### Como encontrar os valores:

**Opção 1 - Usar a string completa do Supabase (RECOMENDADO):**
- No Supabase, vá em **Settings** → **Database**
- Em **Connection string**, selecione **URI**
- Copie a string completa (já vem com tudo configurado)
- Cole diretamente no arquivo `backend/.env` substituindo a linha `DATABASE_URL=`

**Opção 2 - Montar manualmente:**
- **`[SUA_SENHA]`**: É a senha que você criou no Passo 2
- **`[PROJECT_REF]`**: É o ID do seu projeto
  - Aparece na URL do Supabase: `https://app.supabase.com/project/abcdefghijklmnop`
  - Ou na string de conexão: `db.abcdefghijklmnop.supabase.co`
  - Então `[PROJECT_REF]` = `abcdefghijklmnop`

### Exemplo Real:

Se você copiou a string do Supabase, ela já vem assim:
```env
DATABASE_URL=postgresql://postgres.abcdefghijklmnop:MinhaSenh@123@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

Ou se for montar manualmente:
```env
DATABASE_URL=postgresql://postgres:MinhaSenh@123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

💡 **Dica**: É mais fácil copiar a string completa do Supabase!

⚠️ **ATENÇÃO**: Se sua senha tiver caracteres especiais, pode precisar codificar (URL encode):
- `@` vira `%40`
- `#` vira `%23`
- `$` vira `%24`
- etc.

Ou use a string completa que o Supabase fornece (já vem codificada).

## Passo 7: Testar Conexão

1. Inicie o backend:
   ```bash
   npm run backend:dev
   ```
2. Você deve ver a mensagem:
   ```
   ✅ Conectado ao Supabase
   🚀 Servidor rodando na porta 3001
   ```

Se aparecer erro de conexão:
- Verifique se a senha está correta
- Verifique se o project ref está correto
- Verifique se não há espaços extras na string
- Tente usar a string completa do Supabase (Connection pooling)

## Dicas Importantes

### Segurança
- ⚠️ **NUNCA** commite o arquivo `.env` no Git
- O arquivo `.env` já está no `.gitignore`
- Em produção, use variáveis de ambiente do servidor

### Limites do Plano Gratuito
- 500 MB de banco de dados
- 2 GB de transferência por mês
- Suficiente para desenvolvimento e testes

### Backup
- O Supabase faz backup automático
- Você pode fazer backup manual em **Settings** → **Database** → **Backups**

### Monitoramento
- Veja estatísticas em **Project Settings** → **Usage**
- Monitore queries em **SQL Editor** → **History**

## Próximos Passos

Após configurar o Supabase:

1. ✅ Banco de dados configurado
2. ⏭️ Inicie o backend: `npm run backend:dev`
3. ⏭️ Inicie o frontend: `npm run dev`
4. ⏭️ Inicie o hardware middleware: `npm run hardware:dev`
5. ⏭️ Acesse: http://localhost:3000

## Problemas Comuns

### "Connection refused"
- Verifique se a string de conexão está correta
- Verifique se o projeto Supabase está ativo (não pausado)

### "Password authentication failed"
- Verifique se a senha está correta
- Tente resetar a senha em **Settings** → **Database** → **Reset database password**

### "Table does not exist"
- Verifique se executou o schema SQL corretamente
- Vá em **Table Editor** e confirme que as tabelas existem

### "SSL required"
- O código já está configurado para usar SSL
- Se ainda der erro, verifique se está usando a string de conexão correta

## Suporte

Se tiver problemas:
1. Verifique os logs do backend
2. Verifique o SQL Editor do Supabase para erros
3. Consulte a documentação: [docs.supabase.com](https://docs.supabase.com)

