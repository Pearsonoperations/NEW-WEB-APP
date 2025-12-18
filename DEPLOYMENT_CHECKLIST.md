# Deployment Checklist

Use this checklist to ensure everything is set up correctly before deploying.

## ✅ Supabase Setup

- [ ] Created Supabase project
- [ ] Ran SQL to create `profiles` table with RLS policies
- [ ] Copied Project URL
- [ ] Copied Anon/Public key
- [ ] Copied Service Role key (from Settings → API)
- [ ] Added all 3 Supabase env vars to `.env.local`
- [ ] Tested signup/login locally

## ✅ Stripe Setup

- [ ] Created Stripe account
- [ ] Created product "Roast App Pro" (£9.99/month, recurring)
- [ ] Copied Price ID (starts with `price_...`)
- [ ] Copied Secret Key (starts with `sk_test_...` for test mode)
- [ ] Set up webhook endpoint (local or production)
- [ ] Copied Webhook Secret (starts with `whsec_...`)
- [ ] Added all 3 Stripe env vars to `.env.local`
- [ ] Tested checkout flow with test card

## ✅ Local Testing

- [ ] All dependencies installed (`npm install`)
- [ ] `.env.local` file created with all 6 variables
- [ ] Dev server runs (`npm run dev`)
- [ ] Stripe CLI installed (for webhooks)
- [ ] Stripe webhook forwarding working
- [ ] Can sign up and login
- [ ] Credits display correctly (3 for free users)
- [ ] Roast button works and decrements credits
- [ ] Upgrade modal appears when out of credits
- [ ] Stripe checkout redirects correctly
- [ ] Webhook upgrades user to Pro (100 credits)
- [ ] Pro badge shows after upgrade

## ✅ Vercel Deployment

- [ ] Code pushed to GitHub
- [ ] Project imported in Vercel
- [ ] All 6 environment variables added to Vercel:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `NEXT_PUBLIC_STRIPE_PRICE_ID`
  - [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] Deployed successfully
- [ ] Production URL is live

## ✅ Production Stripe Webhook

- [ ] Created production webhook in Stripe Dashboard
- [ ] Set URL to: `https://your-domain.vercel.app/api/webhook`
- [ ] Selected events:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.payment_succeeded`
- [ ] Copied production webhook secret
- [ ] Updated `STRIPE_WEBHOOK_SECRET` in Vercel
- [ ] Redeployed after updating env vars

## ✅ Production Testing

- [ ] Can access production URL
- [ ] Sign up works
- [ ] Login works
- [ ] Get 3 credits on signup
- [ ] Roast button works
- [ ] Credits decrement
- [ ] Upgrade modal appears
- [ ] Checkout redirects to Stripe
- [ ] Payment succeeds (using test card in test mode)
- [ ] Webhook fires (check Stripe Dashboard → Events)
- [ ] User upgraded to Pro
- [ ] Credits increased to 100
- [ ] Pro badge shows

## ✅ Go Live (Optional)

When ready to accept real payments:

- [ ] Completed Stripe account activation
- [ ] Provided business information
- [ ] Connected bank account
- [ ] Verified identity
- [ ] Switched to Live mode in Stripe
- [ ] Created LIVE product and price
- [ ] Copied LIVE API keys
- [ ] Updated all Stripe env vars with LIVE keys
- [ ] Created LIVE webhook endpoint
- [ ] Tested with real card (small amount)
- [ ] Confirmed payment appears in Stripe
- [ ] Confirmed user upgraded correctly

## 📝 Notes

### Important URLs

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Production App**: https://your-domain.vercel.app
- **Webhook Endpoint**: https://your-domain.vercel.app/api/webhook

### Test Cards

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

Use any future expiry, any CVC, any postal code.

### Support Resources

- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Stripe Setup Guide](./STRIPE_SETUP.md)
- [Quick Start Guide](./QUICK_START.md)
- [API Endpoints](./API_ENDPOINTS.md)

## 🎉 Launch!

Once all checkboxes are checked, you're ready to launch!

Share your app and start getting users roasted! 🔥
