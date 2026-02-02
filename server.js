const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Serve images and static files
app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use(express.static(path.join(__dirname, "public")));

// --- MongoDB connection ---
mongoose.connect("mongodb://127.0.0.1:27017/ecommerceDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// --- Product schema ---
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    description: String,
    category: String
});
const Product = mongoose.model("Product", ProductSchema);

// --- API route to get products ---
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch(err) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// --- Serve pages ---
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/cart", (req, res) => res.sendFile(path.join(__dirname, "public", "cart.html")));

// --- Start server ---
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

app.get("/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});
