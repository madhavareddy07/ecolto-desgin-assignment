import React, { useState, useEffect } from 'react';
import './App.css';

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

function App() {
  const [cart, setCart] = useState([]);
  const [freeGiftAdded, setFreeGiftAdded] = useState(false);

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    // Check if we need to add or remove the free gift
    if (subtotal >= THRESHOLD && !freeGiftAdded) {
      setCart(prevCart => [...prevCart, { ...FREE_GIFT, quantity: 1 }]);
      setFreeGiftAdded(true);
    } else if (subtotal < THRESHOLD && freeGiftAdded) {
      setCart(prevCart => prevCart.filter(item => item.id !== FREE_GIFT.id));
      setFreeGiftAdded(false);
    }
  }, [subtotal, freeGiftAdded]);

  // Add product to cart
  const addToCart = (productId) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        // Increase quantity if product already in cart
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new product to cart
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Update quantity in cart
  const updateQuantity = (productId, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.id === FREE_GIFT.id || item.quantity > 0);
    });
  };
  
  // Remove item from cart
  const removeItem = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  return (
    <div>
      <div className="product-list-container">
        <h1>Product List</h1>
        <ul className="product-list">
          {PRODUCTS.map(product => (
            <li key={product.id} className="product-item">
              {product.name} ${product.price}
              <button 
                className="product-link" 
                onClick={() => addToCart(product.id)}
              >
                Add to Cart
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="shopping-cart-container">
        <h2 className="shopping-cart-title">Shopping Cart</h2>
        
        {cart.length > 0 ? (
          <>
            <table className="cart-table">
              <tbody>
                {cart.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>${item.price}</td>
                    <td className="quantity-cell">
                      Quantity: {item.quantity}
                      {item.id !== FREE_GIFT.id && (
                        <>
                          <button 
                            className="quantity-btn" 
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            -
                          </button>
                          <button 
                            className="quantity-btn" 
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            +
                          </button>
                        </>
                      )}
                    </td>
                    <td>
                      {item.id !== FREE_GIFT.id && (
                        <button 
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {freeGiftAdded && (
              <div className="cart-notification">
                Congratulations! You have earned a free gift.
              </div>
            )}
          </>
        ) : (
          <p>Your cart is empty. Add some products to get started!</p>
        )}
      </div>
    </div>
  );
}

export default App;