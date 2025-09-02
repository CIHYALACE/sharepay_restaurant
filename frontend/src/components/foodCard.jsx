import { useState } from 'react';
import FoodModal from './FoodModal';
import { useCart } from './cartContext';

export default function FoodCard({ foodItem }) {
  const [showModal, setShowModal] = useState(false);

  if (!foodItem) {
    return <div>Loading...</div>;
  }

  const handleCardClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      <a href="#" className="text-decoration-none" onClick={handleCardClick}>
        <div className="row">
          <div className="col-md-12 mb-4">
            <div className="card food-card h-100">
              <img
                src={foodItem.img}
                className="card-img-top food-img"
                alt={foodItem.name}
              />

              <div className="card-body">
                <div className="mb-2">
                  {foodItem.is_vegan ? (
                    <span className="veg-icon">
                      <i className="fa-solid fa-circle"></i> Veg
                    </span>
                  ) : (
                    <span className="non-veg-icon">
                      <i className="fa-solid fa-circle"></i> Non-Veg
                    </span>
                  )}
                </div>

                <h5 className="card-title food-title">{foodItem.name}</h5>

                <p className="card-text food-description">
                  {foodItem.description.substring(0, 40)}...
                </p>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="food-price">${foodItem.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>

      <FoodModal
        food={foodItem}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
