const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    const searchTerm = req.query.search || '';  // Get search term from query params
    console.log('Received search term:', searchTerm);  // Log for debugging
    
    // If searchTerm is empty, return all products
    let sql = 'SELECT * FROM products';
    let values = [];

    if (searchTerm.trim() !== '') {
        sql = 'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?';
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



router.post('/', (req, res) => {
    const { name, description, price, stock_quantity, category } = req.body;
    const sql = 'INSERT INTO products (name, description, price, stock_quantity, category) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [name, description, price, stock_quantity, category], (err, result) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ message: 'Product added', productId: result.insertId });
    });
});

module.exports = router;
