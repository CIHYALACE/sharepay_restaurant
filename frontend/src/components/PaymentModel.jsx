import React, { useEffect, useState } from "react";

export default function PaymentModal({ show, onClose, onPaymentSuccess, total }) {
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            // Reset form when modal closes
            setCardDetails({
                cardNumber: '',
                expiryDate: '',
                cvv: ''
            });
            setErrors({});
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    const validateForm = () => {
        const newErrors = {};
        if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) {
            newErrors.cardNumber = 'Please enter a valid 16-digit card number';
        }
        if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
            newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
        }
        if (!/^\d{3}$/.test(cardDetails.cvv)) {
            newErrors.cvv = 'Please enter a valid 3-digit CVV';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onPaymentSuccess(cardDetails);
        }
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    if (!show) return null;

    return (
        <>
            <div className="modal" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Card Payment</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label className="form-label">Card Number</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                                        placeholder="1234 5678 9012 3456"
                                        value={cardDetails.cardNumber}
                                        onChange={(e) => setCardDetails(prev => ({
                                            ...prev,
                                            cardNumber: formatCardNumber(e.target.value)
                                        }))}
                                        maxLength="19"
                                        required
                                    />
                                    {errors.cardNumber && (
                                        <div className="invalid-feedback">{errors.cardNumber}</div>
                                    )}
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Expiry Date</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                                            placeholder="MM/YY"
                                            value={cardDetails.expiryDate}
                                            onChange={(e) => setCardDetails(prev => ({
                                                ...prev,
                                                expiryDate: e.target.value
                                            }))}
                                            maxLength="5"
                                            required
                                        />
                                        {errors.expiryDate && (
                                            <div className="invalid-feedback">{errors.expiryDate}</div>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">CVV</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                                            placeholder="123"
                                            value={cardDetails.cvv}
                                            onChange={(e) => setCardDetails(prev => ({
                                                ...prev,
                                                cvv: e.target.value
                                            }))}
                                            maxLength="3"
                                            required
                                        />
                                        {errors.cvv && (
                                            <div className="invalid-feedback">{errors.cvv}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <h5>Total Amount: ${total.toFixed(2)}</h5>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    Pay Now
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show"></div>
        </>
    );
}