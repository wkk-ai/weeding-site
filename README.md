# NossoCasamento

Plataforma de sites de casamento para o Brasil — templates, RSVP, lista de presentes com taxa a partir de 1,99%.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Supabase** — Auth, PostgreSQL, Storage, RLS
- **Asaas** — PIX e cartão (split de pagamento)
- **Vercel** + **Cloudflare** — hospedagem e DNS wildcard

## Planos

| Plano | Preço | Taxa lista |
|-------|-------|------------|
| Grátis | R$0 | 3,29% |
| Essencial | R$49 | 2,49% |
| Completo | R$99 | 1,99% |

## Setup local

### 1. Clone e instale

```bash
npm install
cp .env.example .env.local
```

### 2. Configure Supabase

1. Crie projeto em [supabase.com](https://supabase.com)
2. Rode a migration em `supabase/migrations/001_initial_schema.sql` no SQL Editor
3. Preencha `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configure Asaas (opcional para dev)

1. Conta em [asaas.com](https://www.asaas.com) — use sandbox
2. Preencha `ASAAS_API_KEY` e `ASAAS_WEBHOOK_TOKEN`
3. Webhook URL: `https://seu-dominio.com/api/webhooks/asaas`

Sem Asaas, pagamentos rodam em **modo demo** com PIX fictício.

### 4. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Estrutura

```
src/
  app/
    page.tsx              # Landing
    signup/ login/        # Auth
    app/                  # Dashboard do casal
    s/[slug]/             # Site público do casamento
    api/                  # RSVP, pagamentos, webhooks
  components/
    wedding/              # Templates do site
    marketing/            # Landing components
  lib/
    supabase/             # Clients
    asaas.ts              # Integração pagamentos
    constants.ts          # Planos e taxas
```

## Deploy (Vercel)

1. Push para GitHub
2. Importe no Vercel
3. Configure env vars
4. Domínio wildcard: `*.nossocasamento.com.br` → Vercel
5. Registre domínio master no Hostinger, DNS no Cloudflare

## Rotas públicas do casal

- `/s/{slug}` — homepage
- `/s/{slug}/rsvp` — confirmar presença
- `/s/{slug}/presentes` — lista de presentes
- `/s/{slug}/presentes/{id}` — checkout

## Licença

Proprietário — uso interno.
