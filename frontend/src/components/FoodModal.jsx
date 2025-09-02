import { useCart } from "./cartContext";
import { useEffect } from "react";

export default function FoodModal({ food, show, onClose }) {
    const { addToCart } = useCart();

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    if (!show) return null;

    const handleAddToCart = () => {
        addToCart(food);
        onClose();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            <div 
                className="modal" 
                onClick={handleBackdropClick}
                style={{ display: 'block' }}
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{food.name}</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={onClose}
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <img
                                        src={food.img}
                                        alt={food.name}
                                        className="img-fluid rounded w-100"
                                        style={{ maxHeight: '300px', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        {food.is_vegan ? (
                                            <span className="veg-icon">
                                                <i className="fa-solid fa-circle"></i> Veg
                                            </span>
                                        ) : (
                                            <span className="non-veg-icon">
                                                <i className="fa-solid fa-circle"></i> Non-Veg
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="mb-3">${food.price}</h4>
                                    <p>{food.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={onClose}
                            >
                                Close
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-primary" 
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show"></div>
        </>
    );
}