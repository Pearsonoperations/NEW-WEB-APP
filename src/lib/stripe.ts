import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key';

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-12-15.clover',
});

export const STRIPE_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || '';
