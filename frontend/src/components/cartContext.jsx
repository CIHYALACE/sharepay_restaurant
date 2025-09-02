import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (foodItem, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.menu_item.id === foodItem.id);
            if (existing) {
                return prev.map(item => 
                    item.menu_item.id === foodItem.id 
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { menu_item: foodItem, quantity }];
        });
    };

    const updateQuantity = (foodItemId, newQuantity) => {
        setCartItems(prev => 
            prev.map(item => 
                item.menu_item.id === foodItemId 
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const removeFromCart = (foodItemId) => {
        setCartItems(prev => prev.filter(item => item.menu_item.id !== foodItemId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.menu_item.price * item.quantity);
        }, 0);
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            clearCart,
            getCartTotal,
            updateQuantity
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);