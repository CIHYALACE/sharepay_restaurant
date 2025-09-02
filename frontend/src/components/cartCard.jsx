import { useState, useEffect } from "react";
import { useCart } from "./cartContext";

export default function CartCard({ item, onRemove }) {
  const { updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const totalPrice = item.menu_item.price * quantity;

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity > 0) {
      setQuantity(newQuantity);
      updateQuantity(item.menu_item.id, newQuantity);
    }
  };

  return (
    <div className="container py-1">
      <div className="product-card d-flex border">
        <div className="col-md-6 p-0">
          <img
            src={item.menu_item.img || "../../public/download.jpg"}
            alt={item.menu_item.name}
            className="product-image w-100 h-100 object-cover img-fluid"
          />
        </div>

        <div className="col-md-3 product-info">
          <div className="d-flex flex-column h-100">
            <h6 className="mb-1">{item.menu_item.name}</h6>

            <small className="text-muted mb-1">
              {item.menu_item.category.name}
            </small>

            <div className="mb-1">
              <h6 className="text-success">${totalPrice.toFixed(2)}</h6>
            </div>

            <div className="d-flex align-items-center action-buttons mt-auto">
              <div className="me-1">
                <label htmlFor="quantity" className="form-label">
                  Quantity
                </label>
                <div className="input-group quantity-control">
                  <input
                    type="number"
                    className="form-control text-center"
                    value={quantity}
                    min="1"
                    onChange={handleQuantityChange}
                  />
                </div>
              </div>
              <button
                className="btn btn-outline-danger remove-btn align-self-end fs-6"
                onClick={() => onRemove(item.menu_item.id)}
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
