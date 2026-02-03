const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to fetch products from JSON file
app.get('/products', (req, res) => {
    fs.readFile(path.join(__dirname, 'products.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to read products');
        }
        const products = JSON.parse(data);
        res.json(products);
    });
});

// Fallback route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

