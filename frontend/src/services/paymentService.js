import axios from 'axios';

export const createPaymentIntent = async (amount) => {
  try {
    const response = await axios.post('http://localhost:8080/api/payment/create-intent', {
      amount: amount
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.data || !response.data.clientSecret) {
      console.error('Invalid response:', response.data);
      throw new Error(response.data.error || 'Invalid response from payment server');
    }

    return response;
  } catch (error) {
    console.error('Payment intent creation error:', error);
    if (error.response) {
      const errorMessage = error.response.data.error || error.response.data.message;
      throw new Error(errorMessage || 'Failed to create payment intent');
    } else if (error.request) {
      throw new Error('No response from payment server');
    } else {
      throw new Error('Error creating payment intent: ' + error.message);
    }
  }
};
