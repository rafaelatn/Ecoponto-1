# Guia de Instalação - Ecoponto FAECO

## Pré-requisitos

- Node.js 18+ e npm
- Conta no Supabase (gratuita)
- Git

## Passo a Passo

### 1. Instalar Dependências do Frontend

```bash
npm install
```

### 2. Instalar Dependências do Backend

```bash
cd backend
npm install
cd ..
```

### 3. Instalar Dependências do Hardware Middleware

```bash
cd hardware-middleware
npm install
cd ..
```

### 4. Configurar Banco de Dados no Supabase

1. **Criar projeto no Supabase:**
   - Acesse [https://supabase.com](https://supabase.com)
   - Faça login ou crie uma conta gratuita
   - Clique em "New Project"
   - Preencha: Name, Database Password (anote a senha!), Region
   - Aguarde a criação do projeto (alguns minutos)

2. **Obter string de conexão:**
   - No projeto, vá em **Settings** → **Database**
   - Role até **Connection string**
   - Selecione **URI** e copie a string
   - Substitua `[YOUR-PASSWORD]` pela senha que você criou

3. **Executar schema SQL:**
   - No Supabase, vá em **SQL Editor**
   - Clique em **New query**
   - Abra o arquivo `database/schema.sql` deste projeto
   - Cole todo o conteúdo no editor
   - Clique em **Run** (Ctrl+Enter)
   - Verifique se apareceu "Success"

4. **Configurar variável de ambiente:**
   - No arquivo `backend/.env`, configure a `DATABASE_URL` com a string copiada

### 5. Configurar Variáveis de Ambiente

#### Frontend (.env.local)

Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_HARDWARE_URL=http://localhost:3002
```

#### Backend (backend/.env)

Crie o arquivo `backend/.env`:

```env
PORT=3001
DATABASE_URL=postgresql://postgres:[SUA_SENHA]@db.[PROJECT_REF].supabase.co:5432/postgres
JWT_SECRET=seu_secret_jwt_aqui_mude_em_producao
NODE_ENV=development
```

**Importante**: Substitua `[SUA_SENHA]` e `[PROJECT_REF]` pelos valores do seu projeto Supabase.

#### Hardware Middleware (hardware-middleware/.env)

Crie o arquivo `hardware-middleware/.env`:

```env
PORT=3002
NODE_ENV=development
```

### 6. Executar o Projeto

#### Terminal 1 - Frontend
```bash
npm run dev
```
Acesse: http://localhost:3000

#### Terminal 2 - Backend
```bash
npm run backend:dev
```
API rodando em: http://localhost:3001

#### Terminal 3 - Hardware Middleware
```bash
npm run hardware:dev
```
Middleware rodando em: http://localhost:3002

## Modo Kiosk

Para rodar em modo kiosk (tela cheia):

### Windows
```bash
start chrome.exe --kiosk --app=http://localhost:3000
```

### Linux
```bash
chromium-browser --kiosk --app=http://localhost:3000
```

## Estrutura do Projeto

```
ecoponto-faeco/
├── app/                    # Next.js App Router (Frontend)
│   ├── page.tsx           # Tela inicial (Login/Cadastro)
│   ├── home/              # Área logada
│   │   ├── page.tsx       # Home
│   │   ├── descarte/      # Descarte de óleo
│   │   ├── fidelidade/    # Programa fidelidade
│   │   └── dados/         # Dados cadastrais
├── components/             # Componentes React
├── backend/                # API Backend
│   └── src/
│       ├── routes/        # Rotas da API
│       ├── middleware/    # Middlewares
│       └── db/            # Conexão com banco
├── hardware-middleware/    # Comunicação com hardware
│   └── src/
│       └── controllers/   # Controladores de hardware
└── database/               # Scripts SQL
```

## Testes

### Criar Usuário de Teste

1. Acesse http://localhost:3000
2. Clique em "Cadastrar"
3. Preencha os dados
4. Crie uma senha de 4 dígitos

### Testar Descarte

1. Faça login
2. Clique em "Descarte de óleo usado"
3. Clique em "Iniciar descarte"
4. O sistema simulará a pesagem (em desenvolvimento)

## Produção

### Build do Frontend
```bash
npm run build
npm start
```

### Build do Backend
```bash
cd backend
npm run build
npm start
```

### Build do Hardware Middleware
```bash
cd hardware-middleware
npm run build
npm start
```

## Notas Importantes

- Em desenvolvimento, o hardware é simulado
- Para usar hardware real, configure os pinos GPIO no `.env` do hardware-middleware
- Altere o `JWT_SECRET` em produção
- Configure HTTPS em produção
- Faça backup regular do banco de dados

