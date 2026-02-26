# Tostão 🪙
Educação financeira gamificada para jovens portugueses.

## Setup em 5 passos

### 1. Configurar o Supabase
- Vai ao teu projeto Supabase → SQL Editor
- Cola o conteúdo de `supabase-setup.sql` e clica Run
- Vai a Authentication → Settings → activa "Email confirmations" OFF (para testes)

### 2. Instalar dependências
```bash
npm install
```

### 3. Correr localmente
```bash
npm run dev
```
Abre http://localhost:3000

### 4. Deploy no Vercel
- Vai a vercel.com e liga à tua conta GitHub
- Importa este projeto
- Adiciona as variáveis de ambiente:
  - `NEXT_PUBLIC_SUPABASE_URL` = https://xclyjavbfxnpklhefkpw.supabase.co
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sb_publishable_Ylitu924VeacNIrMxnv0nw_iKFVc6vr
- Deploy!

## Estrutura do projeto
```
app/
  page.tsx          → Login / Registo
  dashboard/        → Ecrã principal
  lesson/[id]/      → Lições interativas
lib/
  supabase.ts       → Cliente Supabase
```
