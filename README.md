# Agendador — Frontend

Interface web do Agendador: SaaS de agendamento para profissionais de saúde e beleza com confirmação via WhatsApp.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + TypeScript strict |
| Build | Vite 6 |
| Roteamento | React Router v7 |
| Dados do servidor | TanStack Query v5 |
| Estado global | Zustand v5 |
| Formulários | React Hook Form + Zod |
| Estilo | Tailwind CSS v3 |
| HTTP | Axios (com interceptors de JWT) |
| Linting | ESLint v9 + prettier-plugin-tailwindcss |

## Pré-requisitos

- Node.js 20+
- npm 10+
- Backend rodando (ver `../backend/README.md`)

## Setup inicial

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Editar VITE_API_URL se o backend rodar em porta diferente de 8001

# 3. Iniciar servidor de desenvolvimento
npm run dev
```

O app estará disponível em: **http://localhost:5173**

O Vite faz proxy automático de `/api/*` para o backend — sem problemas de CORS em desenvolvimento.

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8001` | URL base do backend Django |
| `VITE_APP_ENV` | `development` | Ambiente atual |
| `VITE_APP_NAME` | `Agendador` | Nome exibido na UI |

## Comandos

```bash
npm run dev           # Servidor de desenvolvimento (http://localhost:5173)
npm run build         # Build de produção (saída em dist/)
npm run preview       # Preview do build de produção
npm run type-check    # Verificação TypeScript sem compilar
npm run lint          # Análise ESLint
npm run lint:fix      # ESLint com correção automática
npm run format        # Formata com Prettier
npm run format:check  # Verifica formatação sem alterar
```

## Estrutura de pastas

```
src/
├── assets/              # Imagens, fontes e ícones estáticos
├── components/
│   ├── ui/              # Primitivos reutilizáveis: Button, Input, Modal, Badge…
│   └── shared/          # Compostos compartilhados: Layout, ProtectedRoute, Navbar…
├── features/            # Módulos por domínio de negócio (feature-based)
│   ├── auth/            # Login, cadastro e fluxo OTP via WhatsApp/email
│   ├── appointments/    # Listagem, detalhes e ações sobre agendamentos
│   ├── providers/       # Perfil e configurações do prestador
│   └── scheduling/      # Fluxo público de agendamento (seleção de serviço/horário)
├── hooks/               # Hooks globais reutilizáveis (useMediaQuery, useDebounce…)
├── lib/
│   ├── api.ts           # Instância Axios com interceptors de JWT e refresh automático
│   └── queryClient.ts   # Configuração global do TanStack Query
├── pages/               # Componentes de rota (thin wrappers — lógica fica nas features)
│   ├── public/          # Acessíveis sem autenticação (Login, Agendamento público)
│   └── dashboard/       # Painel do prestador (requer autenticação)
├── router/              # Definição de rotas com lazy loading e ProtectedRoute
├── store/
│   └── authStore.ts     # Zustand: accessToken (memória) + refreshToken (localStorage)
├── styles/
│   └── globals.css      # Reset CSS + diretivas Tailwind
├── types/
│   └── api.ts           # Interfaces TypeScript para todas as entidades da API
└── utils/
    ├── cn.ts            # Combina classes Tailwind (clsx + tailwind-merge)
    └── format.ts        # Formatação de moeda (BRL), data/hora e telefone brasileiro
```

Cada feature segue a mesma convenção interna:

```
features/<nome>/
├── components/   # Componentes visuais exclusivos da feature
├── hooks/        # Hooks com lógica de negócio (usam TanStack Query)
├── api/          # Funções que chamam o backend (tipadas com Zod/TS)
└── index.ts      # Barrel export — único ponto de importação externo
```

## Autenticação

O fluxo usa JWT com dois tokens:

- **`accessToken`** — vida curta (15 min), guardado **apenas em memória** (Zustand sem persistência). Nunca vai para o localStorage ou cookie.
- **`refreshToken`** — vida longa (30 dias), persistido no `localStorage` via Zustand `persist`.

O interceptor do Axios em `lib/api.ts` cuida do refresh automático: ao receber um `401`, enfileira as requisições que falharam, obtém um novo access token e as reexecuta — transparente para o código das features.

## Decisões de arquitetura

| Decisão | Motivo |
|---|---|
| Feature-based structure | Isola domínios, evita acoplamento entre features, escala sem conflito |
| Zustand (não Redux) | Estado global mínimo (só auth) — Redux seria over-engineering aqui |
| TanStack Query | Cache de servidor, invalidação automática, estados de loading/error sem boilerplate |
| Lazy loading em todas as páginas | Chunks menores = carregamento inicial mais rápido |
| Proxy Vite para `/api` | Elimina CORS em dev sem precisar configurar o Django para `localhost:5173` |
| Zod + React Hook Form | Validação isomórfica — mesmos schemas no form e na camada de API |
