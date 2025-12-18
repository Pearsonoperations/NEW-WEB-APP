# API Endpoints

## POST /api/checkout

Creates a Stripe Checkout session for upgrading to Pro.

### Request
```json
{
  "userId": "user-uuid-from-supabase"
}
```

### Response (Success)
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### Response (Error)
```json
{
  "error": "Error message"
}
```

### Usage
```javascript
const response = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: user.id })
});

const { url } = await response.json();
window.location.href = url; // Redirect to Stripe checkout
```

---

## POST /api/webhook

Handles Stripe webhook events. This endpoint is called by Stripe, not by your frontend.

### Webhook URL
- **Local**: `http://localhost:3000/api/webhook`
- **Production**: `https://your-domain.vercel.app/api/webhook`

### Events Handled

#### 1. `checkout.session.completed`
Triggered when a user successfully completes payment.

**Action**: Upgrades user to Pro with 100 credits.

```javascript
// Updates Supabase profiles table:
{
  is_pro: true,
  credits: 100
}
```

#### 2. `customer.subscription.deleted`
Triggered when a subscription is canceled.

**Action**: Downgrades user from Pro to free tier.

```javascript
// Updates Supabase profiles table:
{
  is_pro: false,
  credits: 3
}
```

#### 3. `invoice.payment_succeeded`
Triggered on successful recurring payment (monthly renewal).

**Action**: Resets credits to 100 for the new billing period.

```javascript
// Updates Supabase profiles table:
{
  credits: 100
}
```

### Response
```json
{
  "received": true
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

---

## Setting Up Webhooks

### Local Development (Stripe CLI)

1. Install Stripe CLI
2. Login: `stripe login`
3. Forward events:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
4. Copy the webhook secret from terminal output
5. Add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Production (Vercel)

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Set URL: `https://your-domain.vercel.app/api/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
5. Copy the signing secret
6. Add to Vercel environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
7. Redeploy

---

## Security

### Webhook Signature Verification

The webhook endpoint verifies that requests come from Stripe using the webhook secret:

```typescript
const signature = req.headers.get('stripe-signature')!;
const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
```

This prevents unauthorized requests from modifying user data.

### Authentication

The `/api/checkout` endpoint requires a valid `userId` but doesn't verify the session. In production, you should add authentication middleware to verify the user's session token.

---

## Testing

### Test Checkout Flow

```bash
# 1. Start dev server
npm run dev

# 2. Start webhook forwarding
stripe listen --forward-to localhost:3000/api/webhook

# 3. In the app:
# - Sign up
# - Use all 3 credits
# - Click "Upgrade to Pro"
# - Use test card: 4242 4242 4242 4242
# - Complete checkout

# 4. Verify in terminal:
# - Webhook received: checkout.session.completed
# - User upgraded: check Supabase profiles table
```

### Test Webhook Events Manually

```bash
# Trigger checkout.session.completed
stripe trigger checkout.session.completed

# Trigger customer.subscription.deleted
stripe trigger customer.subscription.deleted

# Trigger invoice.payment_succeeded
stripe trigger invoice.payment_succeeded
```

---

## Error Handling

### Common Errors

1. **"User ID required"** - Missing userId in request
2. **"User not found"** - userId doesn't exist in Supabase
3. **"Invalid signature"** - Webhook secret mismatch
4. **"Error creating checkout session"** - Stripe API error

### Debugging

Check logs:
- **Local**: Terminal output
- **Vercel**: Function logs in dashboard
- **Stripe**: Dashboard → Developers → Events

---

## Rate Limits

Stripe API has rate limits:
- **Test mode**: 100 requests/second
- **Live mode**: 100 requests/second per account

The webhook endpoint is called by Stripe and doesn't count toward your rate limit.
