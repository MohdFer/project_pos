import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to POS System</h1>
      <p>A modern point of sale system for your business</p>
      <Link to="/pos" className="btn btn-primary">
        <ShoppingCart size={18} style={{ marginRight: '0.5rem' }} />
        Open POS
      </Link>
    </div>
  );
}

export default Home;