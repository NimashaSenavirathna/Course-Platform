import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '../services/paymentService';
import { useNavigate } from 'react-router-dom';
import { viewCart } from '../services/cartService';
import axios from 'axios';
import '../styles/Checkout.css';

const stripePromise = loadStripe('pk_test_51RIkLURtp3CVmVuYG3CKWzISq42Z4rCrhXn18NMlSNOs4OMoPbyvov2VskVZxlwjQKrzjnHBYTBwym4eG8wEjIAi00RxFTYbVg');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await viewCart(1); // Assuming user ID is 1
        setCartItems(response.data);
        const totalPrice = response.data.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotal(totalPrice);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Failed to load cart items');
      }
    };
    fetchCart();
  }, []);

  const applyCoupon = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/coupons/${coupon}`);
      if (response.data) {
        setDiscount(response.data.discount);
        setError('');
        setSuccess(`${response.data.discount}% discount applied!`);
      } else {
        setError('Invalid coupon code');
        setSuccess('');
      }
    } catch (error) {
      setError('Invalid coupon code');
      setSuccess('');
    }
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discount) / 100;
    return (subtotal - discountAmount).toFixed(2);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!stripe || !elements) {
      setError('Stripe has not been initialized');
      setLoading(false);
      return;
    }

    const finalAmount = Math.round(calculateTotal() * 100); // Convert to cents for Stripe

    try {
      // Create payment intent
      const { data: paymentIntentData } = await createPaymentIntent(finalAmount);
      
      if (!paymentIntentData || !paymentIntentData.clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      // Confirm the payment
      const result = await stripe.confirmCardPayment(paymentIntentData.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            // Add any additional billing details if needed
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setSuccess('Payment successful! Redirecting...');
        setTimeout(() => navigate('/success'), 2000);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'There was an error processing the payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2>Checkout</h2>
        <p>Complete your purchase securely</p>
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <span className="course-title">{item.courseTitle}</span>
            <span className="course-price">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        
        <div className="price-summary">
          <div className="price-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="price-row">
              <span>Discount ({discount}%)</span>
              <span>-${((total * discount) / 100).toFixed(2)}</span>
            </div>
          )}
          <div className="price-row total">
            <span>Total</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>
      </div>

      <div className="payment-form">
        <div className="coupon-section">
          <h3>Apply Coupon</h3>
          <div className="coupon-input">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button type="button" onClick={applyCoupon}>Apply</button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <h3>Payment Details</h3>
        <div className="stripe-element">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#2c3e50',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#e74c3c',
              },
            },
          }} />
        </div>

        <button 
          className="submit-button" 
          type="submit" 
          onClick={handleSubmit}
          disabled={!stripe || loading}
        >
          {loading ? 'Processing...' : `Pay $${calculateTotal()}`}
        </button>
      </div>
    </div>
  );
};

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;
