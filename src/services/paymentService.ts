/**
 * Viva Wallet Native Smart Checkout Integration
 * Demo Environment Implementation
 */

export interface VivaOrderRequest {
  amount: number;
  customerDetails: {
    email?: string;
    fullName?: string;
    phone?: string;
  };
}

export interface VivaOrderResponse {
  orderCode: string;
  errorCode?: number;
  errorText?: string;
}

/**
 * Creates a Viva Wallet order code for Native Smart Checkout
 * Calls the Next.js API route which then calls the Viva Wallet Sandbox API
 */
export async function createVivaOrderCode(
  amount: number,
  customerDetails: VivaOrderRequest['customerDetails']
): Promise<VivaOrderResponse> {
  try {
    // Call our Next.js API route to avoid CORS issues
    const response = await fetch('/api/viva', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, customerDetails }),
    });

    console.log('Server API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server API Error:', response.status, errorText);
      return {
        orderCode: '',
        errorCode: response.status,
        errorText: `Server Error (${response.status}): ${errorText}`,
      };
    }

    const data = await response.json();
    console.log('Server API Response:', data);
    return {
      orderCode: data.orderCode,
    };
  } catch (error) {
    console.error('Viva Wallet Service Error:', error);
    return {
      orderCode: '',
      errorCode: 500,
      errorText: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Redirects to Viva Wallet payment page
 */
export function redirectToVivaPayment(orderCode: string): void {
  // Use the demo payment page URL for Smart Checkout v2
  const paymentUrl = `https://demo.vivapayments.com/web/checkout?ref=${orderCode}`;
  console.log('Redirecting to Viva Wallet:', paymentUrl);
  window.location.href = paymentUrl;
}

/**
 * Verifies a Viva Wallet transaction
 * This should be called on the server-side for security
 */
export async function verifyVivaTransaction(transactionId: string): Promise<boolean> {
  const VIVA_API_KEY = import.meta.env.VITE_VIVA_API_KEY || '';
  const VIVA_MERCHANT_ID = import.meta.env.VITE_VIVA_MERCHANT_ID || '';
  const VIVA_DEMO_URL = import.meta.env.VITE_VIVA_DEMO_URL || 'https://demo.vivapayments.com';

  if (!VIVA_API_KEY || !VIVA_MERCHANT_ID) {
    console.warn('Viva Wallet credentials not configured. Skipping verification.');
    return true; // For demo mode, always return true
  }

  try {
    const apiUrl = `${VIVA_DEMO_URL}/api/transactions/${transactionId}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${VIVA_MERCHANT_ID}:${VIVA_API_KEY}`)}`,
      },
    });

    if (!response.ok) {
      console.error('Viva Wallet Verification Error:', response.status);
      return false;
    }

    const data = await response.json();
    return data.status === 'Completed' || data.Status === 'Completed';
  } catch (error) {
    console.error('Viva Wallet Verification Error:', error);
    return false;
  }
}
