import { Cart, ICart } from '../cart/cart.model';

const STRIPE_API_BASE = 'https://api.stripe.com/v1';
const DEFAULT_DELIVERY_FEE = 20;
const DEFAULT_CURRENCY = 'egp';

interface StripeCheckoutSession {
  id: string;
  url: string | null;
  payment_status: 'paid' | 'unpaid' | 'no_payment_required';
  status: 'open' | 'complete' | 'expired';
  payment_intent?: string;
  client_reference_id?: string;
}

const getStripeSecretKey = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY.');
  }

  return secretKey;
};

async function stripeRequest<T>(path: string, init?: { method?: 'GET' | 'POST'; body?: URLSearchParams }) {
  const secretKey = getStripeSecretKey();

  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    method: init?.method || 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      ...(init?.body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    },
    body: init?.body?.toString(),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error?.message || 'Stripe request failed');
  }

  return payload as T;
}

export async function createStripeCheckoutSession(params: {
  cart: ICart;
  orderId: string;
  userId: string;
}) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const currency = process.env.STRIPE_CURRENCY || DEFAULT_CURRENCY;
  const body = new URLSearchParams();

  body.append('mode', 'payment');
  body.append('success_url', `${frontendUrl}/orders/success/${params.orderId}?session_id={CHECKOUT_SESSION_ID}`);
  body.append('cancel_url', `${frontendUrl}/checkout?payment=cancelled&orderId=${params.orderId}`);
  body.append('client_reference_id', params.orderId);
  body.append('metadata[orderId]', params.orderId);
  body.append('metadata[userId]', params.userId);

  params.cart.items.forEach((item: any, index: number) => {
    body.append(`line_items[${index}][price_data][currency]`, currency);
    body.append(`line_items[${index}][price_data][unit_amount]`, String(Math.round(item.price * 100)));
    body.append(`line_items[${index}][price_data][product_data][name]`, item.name.en);
    body.append(`line_items[${index}][price_data][product_data][description]`, item.name.ar);
    body.append(`line_items[${index}][quantity]`, String(item.quantity));
  });

  const deliveryIndex = params.cart.items.length;
  body.append(`line_items[${deliveryIndex}][price_data][currency]`, currency);
  body.append(`line_items[${deliveryIndex}][price_data][unit_amount]`, String(DEFAULT_DELIVERY_FEE * 100));
  body.append(`line_items[${deliveryIndex}][price_data][product_data][name]`, 'Delivery Fee');
  body.append(`line_items[${deliveryIndex}][quantity]`, '1');

  return stripeRequest<StripeCheckoutSession>('/checkout/sessions', {
    method: 'POST',
    body,
  });
}

export async function retrieveStripeCheckoutSession(sessionId: string) {
  return stripeRequest<StripeCheckoutSession>(`/checkout/sessions/${sessionId}`);
}
