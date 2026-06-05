import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, customerDetails } = body;

    const VIVA_CLIENT_ID = process.env.VIVA_CLIENT_ID || '';
    const VIVA_CLIENT_SECRET = process.env.VIVA_CLIENT_SECRET || '';
    const VIVA_SOURCE_CODE = process.env.VIVA_SOURCE_CODE || '';
    const VIVA_API_URL = process.env.VIVA_API_URL || 'https://demo-api.vivapayments.com/checkout/v2/orders';
    const VIVA_TOKEN_URL = process.env.VIVA_TOKEN_URL || 'https://demo-accounts.vivapayments.com/connect/token';

    console.log('Server: Viva Wallet OAuth 2.0 Credentials Check:');
    console.log('  Client ID:', VIVA_CLIENT_ID ? 'Present' : 'Missing');
    console.log('  Client Secret:', VIVA_CLIENT_SECRET ? 'Present (length: ' + VIVA_CLIENT_SECRET.length + ')' : 'Missing');
    console.log('  Source Code:', VIVA_SOURCE_CODE);
    console.log('  Token URL:', VIVA_TOKEN_URL);
    console.log('  API URL:', VIVA_API_URL);

    if (!VIVA_CLIENT_ID || !VIVA_CLIENT_SECRET) {
      console.warn('Viva Wallet OAuth credentials not configured. Using demo mode.');
      const mockOrderCode = Math.random().toString(36).substring(2, 15).toUpperCase();
      return NextResponse.json({ orderCode: mockOrderCode });
    }

    // STEP 1: Request Access Token using OAuth 2.0 Client Credentials Grant
    console.log('Server: Step 1 - Requesting access token from:', VIVA_TOKEN_URL);

    const tokenAuth = Buffer.from(`${VIVA_CLIENT_ID}:${VIVA_CLIENT_SECRET}`).toString('base64');
    const tokenParams = new URLSearchParams();
    tokenParams.append('grant_type', 'client_credentials');

    const tokenResponse = await fetch(VIVA_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${tokenAuth}`,
      },
      body: tokenParams.toString(),
    });

    console.log('Server: Token Response status:', tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Server: Viva Wallet Token Error:', tokenResponse.status, errorText);
      return NextResponse.json(
        { error: `Token Error (${tokenResponse.status}): ${errorText}` },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('Server: No access token in response:', tokenData);
      return NextResponse.json(
        { error: 'No access token received from Viva Wallet' },
        { status: 500 }
      );
    }

    console.log('Server: Access token received successfully');

    // STEP 2: Create Payment Order using Bearer token
    console.log('Server: Step 2 - Creating payment order at:', VIVA_API_URL);

    const orderBody = {
      amount: amount * 100,
      customerTrns: `Order-${Date.now()}`,
      merchantTrns: `Juco-${Date.now()}`,
      sourceCode: VIVA_SOURCE_CODE,
      currencyCode: '978',
      paymentTimeout: 900,
      maxInstallments: 0,
      allowRecurring: false,
      isPreAuth: false,
      disableExactAmount: false,
      disableCash: true,
      disableWallet: false,
      tipAmount: 0,
      disableVivaWallet: false,
    };

    const orderResponse = await fetch(VIVA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderBody),
    });

    console.log('Server: Order Response status:', orderResponse.status);

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('Server: Viva Wallet Order Error:', orderResponse.status, errorText);
      return NextResponse.json(
        { error: `Order Error (${orderResponse.status}): ${errorText}` },
        { status: orderResponse.status }
      );
    }

    const orderData = await orderResponse.json();
    console.log('Server: Viva Wallet Order Response:', orderData);

    const orderCode = orderData.orderCode || orderData.OrderCode;

    if (!orderCode) {
      console.error('Server: No order code in response:', orderData);
      return NextResponse.json(
        { error: 'No order code received from Viva Wallet' },
        { status: 500 }
      );
    }

    return NextResponse.json({ orderCode });
  } catch (error) {
    console.error('Server: Viva Wallet Service Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
