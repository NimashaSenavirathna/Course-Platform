import React, { useEffect, useState, useCallback } from 'react';
import { viewCart, removeFromCart } from '../services/cartService';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [removingItemId, setRemovingItemId] = useState(null);

    const fetchCartItems = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await viewCart(1);
            console.log('Cart response:', response);
            
            if (response && response.data) {
                const processedItems = response.data.map(item => ({
                    ...item,
                    price: Number(item.price) || 0,
                    quantity: Number(item.quantity) || 1
                }));

                console.log('Processed items:', processedItems);
                setCartItems(processedItems);
                const totalPrice = processedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                setTotal(totalPrice.toFixed(2));
            } else {
                console.log('No items in cart');
                setCartItems([]);
                setTotal('0.00');
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setError('Failed to load cart items. Please try again.');
            setCartItems([]);
            setTotal('0.00');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    const handleRemoveFromCart = async (courseId) => {
        try {
            setRemovingItemId(courseId);
            setError('');
            await removeFromCart(1, courseId);
            await fetchCartItems();
        } catch (error) {
            console.error('Error removing course from cart:', error);
            setError('Failed to remove course from cart. Please try again.');
        } finally {
            setRemovingItemId(null);
        }
    };

    if (loading) {
        return (
            <div className="cart-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1 className="cart-title">Your Cart</h1>

            {error && (
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button onClick={fetchCartItems} className="retry-button">
                        Try Again
                    </button>
                </div>
            )}

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty</p>
                    <Link to="/courses" className="continue-shopping-button">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.courseId} className="cart-item">
                                <div className="item-details">
                                    <h3 className="item-title">{item.courseTitle}</h3>
                                    <p className="item-description">{item.description}</p>
                                    <p className="item-price">Price: ${item.price.toFixed(2)}</p>
                                    <p className="item-quantity">Quantity: {item.quantity}</p>
                                    <p className="item-subtotal">
                                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                                <button
                                    className="remove-button"
                                    onClick={() => handleRemoveFromCart(item.courseId)}
                                    disabled={removingItemId === item.courseId}
                                >
                                    {removingItemId === item.courseId ? 'Removing...' : 'Remove'}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <div className="total-section">
                            <h2>Order Summary</h2>
                            <div className="total-row">
                                <span>Total:</span>
                                <span className="total-amount">${total}</span>
                            </div>
                        </div>
                        <Link to="/checkout" className="checkout-button">
                            Proceed to Checkout
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
