import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  
  // --- 1. GLOBAL THEME ENGINE (Controlled from Navbar to sync entire website) ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("terabyte_theme") === "dark";
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextTheme = !prev;
      localStorage.setItem("terabyte_theme", nextTheme ? "dark" : "light");
      return nextTheme;
    });
  };

  // Sync entire DOM elements instantaneously
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#121212';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#F9F6F0';
    }
  }, [isDarkMode]);

  // --- 2. AUTH STATES (Updated Default Identity to Arul) ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); 

  // Auth Functions
  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData || { name: 'Arul' }); // Set default authorized architect identity
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  // --- 3. SKUs QUANTITY PUSH LOGIC (STRICT AGGREGATION) ---
  const addToCart = (product) => {
    setCart((prev) => {
      const isItemInCart = prev.find((item) => item.id === product.id);
      // Capture customized incoming unit payload or default strictly to 1
      const incomingQty = product.quantity || 1;

      if (isItemInCart) {
        return prev.map((item) =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + incomingQty } 
            : item
        );
      }
      return [...prev, { ...product, quantity: incomingQty }];
    });
  };

  const decreaseQuantity = (id) => {
    setCart((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        decreaseQuantity, 
        removeFromCart, 
        clearCart, 
        cartTotal,
        // Auth exports
        isLoggedIn,
        user,
        login,
        logout,
        // Universal Theme exports
        isDarkMode,
        toggleTheme
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);