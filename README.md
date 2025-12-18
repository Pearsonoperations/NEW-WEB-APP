# 🔥 Roast App

A Next.js app that roasts users with AI-generated insults. Features authentication, credit system, and Stripe payments.

## ✨ Features

- **Authentication** - Email/password login with Supabase
- **Password Toggle** - Eye icon to show/hide password
- **Credit System** - 3 free credits, 100 credits for Pro (£9.99/month)
- **Stripe Payments** - Secure checkout and subscription management
- **Animated Background** - Moving sparkles effect
- **Share Functionality** - Share roasts via Web Share API or clipboard
- **Responsive Design** - Works on mobile and desktop

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your keys

# 3. Run development server
npm run dev

# 4. Open http://localhost:3000
```

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Quick setup guide
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Supabase configuration
- **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** - Stripe integration

## 🔧 Environment Variables

You need to set up 6 environment variables:

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side only)

### Stripe
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_STRIPE_PRICE_ID` - Your product price ID
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret

See `.env.local.example` for the template.

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Animations**: Framer Motion, tsparticles
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts    # Create Stripe checkout session
│   │   └── webhook/route.ts     # Handle Stripe webhooks
│   ├── layout.tsx               # Root layout with AuthProvider
│   └── page.tsx                 # Main app with roast button
├── components/
│   ├── auth/
│   │   └── AuthForm.tsx         # Login/signup form
│   └── ui/
│       └── sparkles.tsx         # Animated sparkles background
├── contexts/
│   └── AuthContext.tsx          # Authentication state management
└── lib/
    ├── stripe.ts                # Stripe client configuration
    ├── supabase.ts              # Supabase client configuration
    └── utils.ts                 # Utility functions
```

## 🎯 How It Works

### Free Users
1. Sign up with email and password
2. Get 3 free credits
3. Click "ROAST ME" to get roasted (uses 1 credit)
4. When credits run out, see upgrade modal

### Pro Users (£9.99/month)
1. Click "Upgrade to Pro" when out of credits
2. Complete Stripe checkout
3. Get 100 credits
4. Credits reset monthly
5. Cancel anytime

## 🧪 Testing

### Test Locally
```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Forward webhooks
stripe listen --forward-to localhost:3000/api/webhook
```

### Test Cards
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, any postal code.

## 🚢 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy
5. Set up Stripe webhook with production URL

```bash
git add .
git commit -m "Add authentication and payment"
git push
```

### Webhook Endpoint
Production: `https://your-domain.vercel.app/api/webhook`

## 📊 Database Schema

### `profiles` table
```sql
id UUID PRIMARY KEY (references auth.users)
email TEXT NOT NULL
credits INTEGER DEFAULT 3
is_pro BOOLEAN DEFAULT FALSE
created_at TIMESTAMP DEFAULT NOW()
```

## 🔐 Security

- Row Level Security (RLS) enabled on Supabase
- Webhook signature verification
- Environment variables for secrets
- Service role key used only server-side
- HTTPS enforced on production

## 📝 License

MIT

## 🤝 Contributing

Feel free to submit issues and pull requests!

## 📧 Support

For issues, check the documentation:
- [Quick Start Guide](./QUICK_START.md)
- [Supabase Setup](./SUPABASE_SETUP.md)
- [Stripe Setup](./STRIPE_SETUP.md)
