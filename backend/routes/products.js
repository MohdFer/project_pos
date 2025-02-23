const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(results);
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
