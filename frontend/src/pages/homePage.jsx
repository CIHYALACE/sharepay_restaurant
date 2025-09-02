import HeroSection from "../components/heroSection";
import CategorySection from "../components/categorySection";
import { useEffect , useState} from "react";
import { getMenuItems } from "../api/axios";

export default function HomePage() {
    let categories = ["Beef", "Chicken", "Vegan"];
    const [foodItems, setFoodItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await getMenuItems();
                console.log("Fetched menu items:", response.data);
                setFoodItems(response.data);
            } catch (error) {
                console.error("Error fetching menu items:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const getFoodItemsByCategory = (category) => {
        return foodItems.filter(item => 
            item.category?.name?.toLowerCase() === category.toLowerCase()
        );
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <HeroSection/>
            <div className="container py-5">
                <div className="row">
                    {categories.map((category) => {
                        const items = getFoodItemsByCategory(category);
                        console.log(`Items for ${category}:`, items); // Debug log
                        return (
                            <div className="col-12 mb-4" key={category}>
                                <CategorySection 
                                    id={category} 
                                    category={category} 
                                    foodItems={items} 
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}