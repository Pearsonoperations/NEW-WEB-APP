# Stripe Integration Setup Guide

## 1. Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for an account (or sign in)
3. Complete the account setup

## 2. Create a Product and Price

1. In Stripe Dashboard, go to **Products** → **Add Product**
2. Fill in the details:
   - **Name**: Roast App Pro
   - **Description**: 100 monthly roast credits
   - **Pricing**: Recurring
   - **Price**: £9.99 GBP
   - **Billing period**: Monthly
3. Click **Save product**
4. **Copy the Price ID** (starts with `price_...`) - you'll need this for `.env.local`

## 3. Get Your API Keys

1. Go to **Developers** → **API keys**
2. Copy your:
   - **Secret key** (starts with `sk_test_...` for test mode)
   - Keep the **Publishable key** visible (starts with `pk_test_...`)

## 4. Set Up Webhook

### For Local Development (using Stripe CLI):

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Or download from https://stripe.com/docs/stripe-cli
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhook events to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

4. Copy the **webhook signing secret** from the terminal output (starts with `whsec_...`)

### For Production (Vercel):

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://your-domain.vercel.app/api/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)

## 5. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_STRIPE_PRICE_ID=price_your_price_id
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 6. Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add all the variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PRICE_ID`
   - `STRIPE_WEBHOOK_SECRET`
4. Redeploy your application

## 7. Test the Integration

### Test Mode:
1. Start your dev server: `npm run dev`
2. In another terminal, run: `stripe listen --forward-to localhost:3000/api/webhook`
3. Sign up for an account
4. Use credits until you run out
5. Click "Upgrade to Pro"
6. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any postal code
7. Complete the checkout
8. Verify you have 100 credits and Pro status

### Stripe Test Cards:
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

## 8. Go Live

When ready to accept real payments:

1. **Complete Stripe account activation**:
   - Provide business information
   - Connect bank account
   - Verify identity

2. **Switch to live mode**:
   - Toggle from "Test mode" to "Live mode" in Stripe Dashboard
   - Get your **live API keys** (start with `pk_live_...` and `sk_live_...`)
   - Create a new **live product and price**
   - Set up **live webhook** endpoint

3. **Update environment variables**:
   - Replace test keys with live keys
   - Update the Price ID to the live price
   - Update webhook secret to live webhook secret

4. **Deploy to production**:
   ```bash
   git add .
   git commit -m "Add Stripe payment integration"
   git push
   ```

## API Endpoints

### `/api/checkout` (POST)
Creates a Stripe Checkout session for upgrading to Pro.

**Request:**
```json
{
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### `/api/webhook` (POST)
Handles Stripe webhook events:
- `checkout.session.completed` - Upgrades user to Pro
- `customer.subscription.deleted` - Downgrades user from Pro
- `invoice.payment_succeeded` - Resets monthly credits

## Troubleshooting

### Webhook not receiving events:
- Check that Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhook`
- Verify webhook secret in `.env.local` matches the CLI output
- Check webhook endpoint URL is correct

### Payment succeeds but user not upgraded:
- Check Vercel logs for webhook errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check that webhook events are being sent to the correct endpoint

### User upgraded but credits not showing:
- Refresh the page
- Check the `profiles` table in Supabase
- Verify the webhook processed successfully

## Security Notes

- Never commit `.env.local` to git (it's in `.gitignore`)
- Use test mode for development
- Verify webhook signatures (already implemented)
- Use service role key only in API routes (server-side)
