# Ecoponto FAECO - Totem de Coleta de Óleo Usado

Sistema completo de totem para coleta de óleo usado com programa de fidelidade.

## Estrutura do Projeto

```
ecoponto-faeco/
├── app/                    # Next.js App Router (Frontend)
├── components/             # Componentes React reutilizáveis
├── lib/                    # Utilitários e configurações
├── backend/                # API Backend (Node.js/Express)
├── hardware-middleware/    # Middleware de comunicação com hardware
└── database/               # Scripts e esquemas do banco de dados
```

## Tecnologias

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Banco de Dados**: Supabase (PostgreSQL gerenciado)
- **Hardware**: Node.js (HX711, Solenoide, Impressora)

## Instalação

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Hardware Middleware
```bash
cd hardware-middleware
npm install
npm run dev
```

## Variáveis de Ambiente

Crie arquivos `.env.local` conforme necessário:

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_HARDWARE_URL=http://localhost:3002
```

### Backend (backend/.env)
```
PORT=3001
DATABASE_URL=postgresql://postgres:[SENHA]@db.[PROJECT_REF].supabase.co:5432/postgres
JWT_SECRET=...
```

**Configuração do Supabase**: Veja `CONFIGURAR_SUPABASE.md` para instruções detalhadas.

### Hardware Middleware (hardware-middleware/.env)
```
PORT=3002
HX711_DT_PIN=5
HX711_SCK_PIN=6
SOLENOID_PIN=7
```

## Funcionalidades

- ✅ Cadastro e Login de usuários
- ✅ Descarte de óleo usado com pesagem automática
- ✅ Programa de fidelidade com créditos
- ✅ Controle de capacidade do reservatório
- ✅ Integração com hardware (balança, solenoide)
- ✅ Histórico de descartes e resgates

## Modo Kiosk

Para rodar em modo kiosk, configure o navegador para iniciar em tela cheia:
- Chrome: `chrome.exe --kiosk --app=http://localhost:3000`
- Edge: `msedge.exe --kiosk --app=http://localhost:3000`


