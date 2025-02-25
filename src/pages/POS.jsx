import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

function POS() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        //const response = await axios.get(`http://192.168.31.132:5000/api/products`, {
        const response = await axios.get(`http://localhost:5000/api/products`, {
          params: { search: searchTerm }  // Use params to send search query
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300); // Delay search requests to avoid too many calls
  
    return () => clearTimeout(delayDebounce); // Cleanup
  }, [searchTerm]);  // Re-run when searchTerm changes

  const addToCart = (product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, change) => {
    setCart(currentCart =>
      currentCart
        .map(item =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="pos-container">
      <div>
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on change
          />
        </div>

        <div className="products-grid">
          {products.map(product => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => addToCart(product)}
            >
              <div className="product-name">{product.name}</div>
              <div className="product-price">₹{Number(product.price).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cart-section">
        <div className="cart-header">
          <h2><ShoppingCart size={24} style={{ verticalAlign: 'middle' }} /> Cart</h2>
        </div>

        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div>
                <div>{item.name}</div>
                <div>₹{Number(item.price).toFixed(2)}</div>
              </div>
              <div className="cart-item-quantity">
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button className="btn btn-success" style={{ marginBottom: '0.5rem' }}>
            Complete Sale
          </button>
          <button className="btn btn-danger" onClick={clearCart}>
            <Trash2 size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default POS;
