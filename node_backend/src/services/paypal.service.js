const { Client, Environment, OrdersController } = require('@paypal/paypal-server-sdk');

// Lazy initialization helper
let clientInstance = null;
let ordersControllerInstance = null;

const getOrdersController = () => {
  if (!ordersControllerInstance) {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('PayPal client credentials (PAYPAL_CLIENT_ID & PAYPAL_CLIENT_SECRET) are not set in environment variables.');
    }

    clientInstance = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: clientId,
        oAuthClientSecret: clientSecret,
      },
      environment: process.env.PAYPAL_ENVIRONMENT === 'live' ? Environment.Production : Environment.Sandbox,
    });

    ordersControllerInstance = new OrdersController(clientInstance);
  }
  return ordersControllerInstance;
};

/**
 * Creates a PayPal Order
 * @param {string} amount - Booking price (e.g. "100.00")
 * @param {string} currency - e.g. "USD" or "INR"
 * @param {string} returnUrl - Redirect URL upon payment success
 * @param {string} cancelUrl - Redirect URL upon payment cancel
 * @returns {Promise<Object>} - Contains order details and the approve URL
 */
const createPayPalOrder = async (amount, currency, returnUrl, cancelUrl) => {
  const controller = getOrdersController();

  const orderRequest = {
    intent: 'CAPTURE',
    purchaseUnits: [
      {
        amount: {
          currencyCode: currency || 'USD',
          value: amount
        }
      }
    ],
    paymentSource: {
      paypal: {
        experienceContext: {
          returnUrl,
          cancelUrl,
          userAction: 'PAY_NOW',
          brandName: 'Roots-ip'
        }
      }
    }
  };

  const response = await controller.createOrder({
    body: orderRequest,
    prefer: 'return=representation'
  });

  // Check for HTTP errors or invalid response structure
  if (response.statusCode >= 400 || !response.result || response.result.error) {
    const errorDetails = response.result?.error_description || response.result?.error || 'Unknown error';
    throw new Error(`PayPal Order Creation Failed (HTTP ${response.statusCode}): ${errorDetails}`);
  }

  const order = response.result;
  const approveLink = order.links?.find(link => link.rel === 'approve' || link.rel === 'payer-action');
  
  if (!approveLink) {
    console.error('PayPal Order Response without Approve Link:', JSON.stringify(order, null, 2));
    throw new Error('No PayPal approval link returned in the response.');
  }

  return {
    id: order.id,
    approveUrl: approveLink.href,
    status: order.status
  };
};

/**
 * Captures a PayPal Order payment securely on the backend
 * @param {string} orderId - PayPal Order ID to capture
 * @returns {Promise<Object>} - Captured order results
 */
const capturePayPalOrder = async (orderId) => {
  const controller = getOrdersController();

  const response = await controller.captureOrder({
    id: orderId,
    prefer: 'return=representation'
  });

  if (response.statusCode >= 400 || !response.result || response.result.error) {
    const errorDetails = response.result?.error_description || response.result?.error || 'Unknown error';
    throw new Error(`PayPal Capture Failed (HTTP ${response.statusCode}): ${errorDetails}`);
  }

  return response.result;
};

module.exports = {
  createPayPalOrder,
  capturePayPalOrder
};
