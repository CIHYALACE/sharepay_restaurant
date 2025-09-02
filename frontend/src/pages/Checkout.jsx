import { useState } from 'react';
import { useCart } from '../components/cartContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import PaymentModal from '../components/PaymentModel';

export default function Checkout() {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone_number: '',
        delivery_address: '',
        payment_method: 'cash',
        card_details: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (name === 'payment_method' && value === 'card') {
            setShowPaymentModal(true);
        }
        else if (name === 'payment_method' && value === 'sharepay'){
            setShowPaymentModal(false);
        }
    };

    const handlePaymentSuccess = (cardDetails) => {
        setFormData(prev => ({
            ...prev,
            card_details: cardDetails,
            payment_method: 'card'
        }));
        setShowPaymentModal(false);
        // Don't submit the form yet, just close the modal and update the payment method
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        // Validate required fields
        if (!formData.name || !formData.phone_number || !formData.delivery_address) {
            setError('Please fill in all required fields');
            return;
        }

        // Validate card details if payment method is card
        if (formData.payment_method === 'card' && !formData.card_details) {
            setError('Please enter card details');
            setShowPaymentModal(true);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Prepare order data
            const orderData = {
                name: formData.name,
                phone_number: formData.phone_number,
                delivery_address: formData.delivery_address,
                payment_method: formData.payment_method,
                items: cartItems.map(item => ({
                    menu_item_id: item.menu_item.id,
                    quantity: item.quantity
                }))
            };

            // Add card details if payment method is card
            if (formData.payment_method === 'card') {
                orderData.card_details = formData.card_details;
            }

            console.log('Submitting order:', orderData); // Debug log

            const response = await api.post('/orders/create_with_items/', orderData);
            console.log('Order response:', response.data); // Debug log
            
            clearCart();
            navigate(`/order/${response.data.id}`);
        } catch (error) {
            console.error('Order error:', error); // Debug log
            setError(
                error.response?.data?.message || 
                'Failed to create order. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowPaymentModal(false);
        setFormData(prev => ({ ...prev, payment_method: 'cash' }));
    };

    if (cartItems.length === 0) {
        return (
            <div className="container py-5 text-center">
                <h2>Your cart is empty</h2>
                <button 
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/')}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2>Checkout</h2>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <div className="row">
                <div className="col-md-8">
                    <form onSubmit={handleSubmit} className="needs-validation">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name *</label>
                            <input
                                type="text"
                                className={`form-control ${!formData.name && 'is-invalid'}`}
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <div className="invalid-feedback">
                                Please enter your name
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone_number" className="form-label">Phone Number *</label>
                            <input
                                type="tel"
                                className={`form-control ${!formData.phone_number && 'is-invalid'}`}
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                            />
                            <div className="invalid-feedback">
                                Please enter your phone number
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="delivery_address" className="form-label">Delivery Address *</label>
                            <textarea
                                className={`form-control ${!formData.delivery_address && 'is-invalid'}`}
                                id="delivery_address"
                                name="delivery_address"
                                value={formData.delivery_address}
                                onChange={handleChange}
                                required
                            />
                            <div className="invalid-feedback">
                                Please enter your delivery address
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="payment_method" className="form-label">Payment Method *</label>
                            <select
                                className="form-select"
                                id="payment_method"
                                name="payment_method"
                                value={formData.payment_method}
                                onChange={handleChange}
                                required
                            >
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="sharepay">Sharepay</option>
                            </select>
                        </div>
                        {formData.payment_method === 'card' && formData.card_details && (
                            <div className="mb-3 card bg-light">
                                <div className="card-body">
                                    <h6>Card Details</h6>
                                    <p className="mb-0">Card ending in: {formData.card_details.cardNumber.slice(-4)}</p>
                                </div>
                            </div>
                        )}
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Order Summary</h5>
                            {cartItems.map(item => (
                                <div key={item.menu_item.id} className="d-flex justify-content-between mb-2">
                                    <span>{item.quantity}x {item.menu_item.name}</span>
                                    <span>${(item.menu_item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between">
                                <strong>Total:</strong>
                                <strong>${getCartTotal().toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <PaymentModal 
                show={showPaymentModal} 
                onClose={handleModalClose}
                onPaymentSuccess={handlePaymentSuccess}
                total={getCartTotal()}
            />
        </div>
    );
}