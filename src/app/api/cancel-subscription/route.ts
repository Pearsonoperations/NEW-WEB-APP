import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      console.error('No userId provided');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user's Stripe customer ID from Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    console.log('Profile lookup:', { userId, profile, profileError });

    if (profileError || !profile) {
      console.error('Profile not found:', profileError);
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    if (!profile.stripe_customer_id) {
      console.error('No stripe_customer_id for user:', userId);
      return NextResponse.json({ error: 'No subscription found. Please contact support.' }, { status: 404 });
    }

    // Get active subscriptions for this customer
    console.log('Looking up subscriptions for customer:', profile.stripe_customer_id);
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
      limit: 1,
    });

    console.log('Active subscriptions found:', subscriptions.data.length);

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    // Cancel the subscription at period end
    const subscription = subscriptions.data[0];
    console.log('Cancelling subscription:', subscription.id);

    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    console.log('Subscription cancelled successfully:', updatedSubscription.id);

    return NextResponse.json({
      success: true,
      message: 'Subscription will be cancelled at the end of the billing period'
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Error cancelling subscription: ${errorMessage}` },
      { status: 500 }
    );
  }
}
