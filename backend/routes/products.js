const express = require('express');
const router = express.Router();
const db = require('../db');

// Fetch products with search term
router.get('/', (req, res) => {
    const searchTerm = req.query.search || '';  // Get search term from query params
    console.log('Received search term:', searchTerm);  // Log for debugging
    
    // If searchTerm is empty, return all products
    let sql = 'SELECT * FROM products ORDER BY name ASC';
    let values = [];

    if (searchTerm.trim() !== '') {
        sql = 'SELECT * FROM products WHERE name LIKE ? OR product_id LIKE ? ORDER BY name ASC';
        values = [`%${searchTerm}%`, `%${searchTerm}%`];
    }

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Add new product
router.post('/', (req, res) => {
    const { name, description, price, stock_quantity, category } = req.body;
    const sql = 'INSERT INTO products (name, description, price, stock_quantity, category) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [name, description, price, stock_quantity, category], (err, result) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ message: 'Product added', productId: result.insertId });
    });
});

// Handle the sale and reduce stock quantity (New route)
router.post('/complete-sale', (req, res) => {
    const cart = req.body.cart; // Array of cart items {product_id, quantity}

    if (!cart || cart.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    // Begin a transaction to ensure atomicity (all or nothing)
    const transaction = db.beginTransaction();

    try {
        // Loop through the cart items and update stock quantity
        for (const item of cart) {
            const productId = item.product_id;
            const quantitySold = item.quantity;

            // Check if there is enough stock
            db.query('SELECT stock_quantity FROM products WHERE product_id = ?', [productId], (err, results) => {
                if (err) throw err;

                const product = results[0];
                if (!product || product.stock_quantity < quantitySold) {
                    throw new Error(`Not enough stock for product ID: ${productId}`);
                }

                // Update the stock quantity
                db.query(
                    'UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?',
                    [quantitySold, productId],
                    (err) => {
                        if (err) throw err;
                    }
                );
            });
        }

        // Commit transaction if everything is successful
        db.commit(transaction, (err) => {
            if (err) {
                db.rollback(transaction);
                return res.status(500).json({ error: 'Transaction failed: ' + err.message });
            }

            // Sale completed successfully
            res.json({ message: 'Sale completed successfully!' });
        });
     
        return res.json({ message: 'Sale completed successfully!' }); 
    } catch (error) {
        db.rollback(transaction);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
