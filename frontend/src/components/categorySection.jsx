import FoodCard from "./foodCard"

export default function CategorySection({ category, foodItems }) {
    if (!foodItems || foodItems.length === 0) {
        return (
            <div>
                <h3 className="mb-4" id={category}>{category}</h3>
                <p>No items available in this category</p>
            </div>
        );
    }

    return (
        <>
            <div>
                <h3 className="mb-4" id={category}>{category}</h3>
                <div className="row">
                    {foodItems.map(foodItem => (
                        <div className="col-md-4 mb-4" key={foodItem.id}>
                            <FoodCard foodItem={foodItem} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}