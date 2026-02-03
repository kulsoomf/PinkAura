const productsGrid = document.getElementById('productsGrid');
let allProducts = [];

// Fetch products from JSON
async function fetchProducts() {
    try {
        const res = await fetch('/products');
        allProducts = await res.json();
        displayProducts(allProducts); // show all products initially
    } catch (err) {
        console.error('Failed to fetch products:', err);
        productsGrid.innerHTML = "<p style='text-align:center; width:100%; margin-top:20px;'>Failed to load products.</p>";
    }
}

// Display products
function displayProducts(products) {
    productsGrid.innerHTML = '';
    productsGrid.style.display = 'flex';

    if (products.length === 0) {
        productsGrid.innerHTML = "<p style='text-align:center; width:100%; margin-top:20px;'>No products found.</p>";
        return;
    }

    products.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('product');
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button>Add to Cart</button>
        `;
        div.querySelector('button').addEventListener('click', () => addToCart(product));
        productsGrid.appendChild(div);
    });
}

// Category click
document.querySelectorAll('.category').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        const filtered = allProducts.filter(p => p.category === category);
        displayProducts(filtered);
        window.scrollTo({ top: productsGrid.offsetTop, behavior: 'smooth' });
    });
});

// Cart functionality
let cart = [];
const cartSidebar = document.getElementById('cartSidebar');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');
const cartIcon = document.getElementById('cartIcon');
const closeCartBtn = document.getElementById('closeCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

cartIcon.addEventListener('click', () => cartSidebar.classList.add('open'));
closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));

function addToCart(product) {
    const existing = cart.find(p => p.name === product.name);
    if (existing) existing.qty += 1;
    else cart.push({...product, qty: 1});
    updateCartDisplay();
    cartSidebar.classList.add('open');
}

function updateCartDisplay() {
    cartItemsEl.innerHTML = '';
    let total = 0;
    cart.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.name} x ${p.qty} - $${p.price * p.qty}`;
        cartItemsEl.appendChild(li);
        total += p.price * p.qty;
    });
    cartTotalEl.textContent = `$${total}`;
    cartCountEl.textContent = cart.reduce((acc, p) => acc + p.qty, 0);
}

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }
    alert("Thank you for your purchase!");
    cart = [];
    updateCartDisplay();
    cartSidebar.classList.remove('open');
});

// Fetch products on page load
window.addEventListener('DOMContentLoaded', fetchProducts);
