const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Products route
app.get('/products', (req, res) => {
    fs.readFile(path.join(__dirname, 'products.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).send('Failed to read products');
        res.json(JSON.parse(data));
    });
});

// Catch-all route for frontend routing
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
