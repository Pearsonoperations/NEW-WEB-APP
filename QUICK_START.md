# Roast App - Quick Start Guide

## Overview
A roasting app with authentication, credit system, and Stripe payments.

## Features
- ✅ Login/Signup with password visibility toggle
- ✅ Supabase authentication
- ✅ Credit system (3 free, 100 pro)
- ✅ Stripe payment integration
- ✅ Animated sparkles background
- ✅ Share roasts functionality

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

Quick steps:
1. Create project at https://supabase.com
2. Run SQL to create `profiles` table
3. Get your URL and keys

### 3. Set Up Stripe
See [STRIPE_SETUP.md](./STRIPE_SETUP.md) for detailed instructions.

Quick steps:
1. Create account at https://stripe.com
2. Create a product (£9.99/month)
3. Get API keys and Price ID
4. Set up webhook

### 4. Configure Environment Variables
Copy `.env.local.example` to `.env.local` and fill in your keys:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your actual values.

### 5. Run Development Server
```bash
npm run dev
```

### 6. Test Locally
1. Open http://localhost:3000
2. Sign up with email/password
3. You get 3 free credits
4. Use credits to get roasted
5. When out of credits, upgrade to Pro
6. Use test card: `4242 4242 4242 4242`

### 7. Deploy to Vercel
```bash
# Add environment variables in Vercel dashboard
# Then deploy:
git add .
git commit -m "Your message"
git push
```

## Environment Variables Required

### Supabase (3 variables)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Stripe (3 variables)
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`

## API Endpoints

### `/api/checkout`
Creates Stripe checkout session for Pro upgrade.

**Endpoint URL for webhook**: `https://your-domain.vercel.app/api/webhook`

### `/api/webhook`
Handles Stripe webhooks for:
- Successful payments → Upgrade to Pro
- Subscription canceled → Downgrade
- Monthly renewal → Reset credits

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts    # Stripe checkout
│   │   └── webhook/route.ts     # Stripe webhooks
│   ├── layout.tsx               # Root layout with AuthProvider
│   └── page.tsx                 # Main app
├── components/
│   ├── auth/
│   │   └── AuthForm.tsx         # Login/Signup form
│   └── ui/
│       └── sparkles.tsx         # Sparkles background
├── contexts/
│   └── AuthContext.tsx          # Auth state management
└── lib/
    ├── stripe.ts                # Stripe client
    ├── supabase.ts              # Supabase client
    └── utils.ts                 # Utilities
```

## Testing Webhooks Locally

Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

## Support

For issues:
1. Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. Check [STRIPE_SETUP.md](./STRIPE_SETUP.md)
3. Verify all environment variables are set
4. Check Vercel logs for errors
