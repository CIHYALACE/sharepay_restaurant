import CartCard from "./cartCard";
import { useCart } from "./cartContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const { cartItems, removeFromCart, getCartTotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const scrollToCategory = (categoryId) => {
        const element = document.getElementById(categoryId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand p-2 px-2 ps-md-5" href="#">
                        Sharepay Retaurant
                    </a>
                        <div className="d-md-none nav-item dropdown px-0">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="navbarDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="fa-solid fa-basket-shopping"></i>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end cart-dropdown-menu mt-3" aria-labelledby="navbarDropdown">
                                {cartItems.map((item) => (
                                    <CartCard 
                                        key={item.menu_item.id} 
                                        item={item} 
                                        onRemove={() => removeFromCart(item.menu_item.id)}
                                    />
                                ))}
                                <li className="checkout-section">
                                    <hr className="dropdown-divider" />
                                    <div className="px-2">
                                        <p className="text-end mb-2">Total: ${getCartTotal().toFixed(2)}</p>
                                        <div className="d-grid gap-2">
                                            <button 
                                                className="btn btn-primary" 
                                                onClick={handleCheckout}
                                                disabled={cartItems.length === 0}
                                            >
                                                Checkout
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a 
                                    className="nav-link active" 
                                    onClick={() => scrollToCategory('Beef')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Beef
                                </a>
                            </li>
                            <li className="nav-item">
                                <a 
                                    className="nav-link active"
                                    onClick={() => scrollToCategory('Chicken')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Chicken
                                </a>
                            </li>
                            <li className="nav-item">
                                <a 
                                    className="nav-link active"
                                    onClick={() => scrollToCategory('Vegan')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Vegans
                                </a>
                            </li>
                        </ul>
                        <div className="d-none d-md-flex nav-item dropdown px-2">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="navbarDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="fa-solid fa-basket-shopping"></i>
                            </a>
                            <ul className="dropdown-menu cart-dropdown-menu mt-3" aria-labelledby="navbarDropdown">
                                {cartItems.map((item) => (
                                    <CartCard 
                                        key={item.menu_item.id} 
                                        item={item} 
                                        onRemove={() => removeFromCart(item.menu_item.id)}
                                    />
                                ))}
                                <li className="checkout-section">
                                    <hr className="dropdown-divider" />
                                    <div className="px-2">
                                        <p className="text-end mb-2">Total: ${getCartTotal().toFixed(2)}</p>
                                        <div className="d-grid gap-2">
                                            <button 
                                                className="btn btn-primary" 
                                                onClick={handleCheckout}
                                                disabled={cartItems.length === 0}
                                            >
                                                Checkout
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <form className="d-flex me-5">
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Find Your Dish . . ."
                                aria-label="Search"
                            />
                            <button className="btn btn-outline-success" type="submit">
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </nav>
        </>
    );
}
