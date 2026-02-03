const productsGrid = document.getElementById('productsGrid');
let allProducts = [];

// Cart functionality
let cart = [];
const cartSidebar = document.getElementById('cartSidebar');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');
const cartIcon = document.getElementById('cartIcon');
const closeCartBtn = document.getElementById('closeCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

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

// Add item to cart
function addToCart(product) {
    const existing = cart.find(p => p.name === product.name);
    if (existing) existing.qty += 1;
    else cart.push({...product, qty: 1});

    updateCartDisplay();
    animateCartBadge();
    cartSidebar.classList.add('open');
}

// Update cart display with thumbnails
function updateCartDisplay() {
    cartItemsEl.innerHTML = '';
    let total = 0;

    cart.forEach(p => {
        const li = document.createElement('li');
        li.classList.add('cart-item');
        li.innerHTML = `
            <img src="${p.image}" alt="${p.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${p.name}</h4>
                <p>Qty: ${p.qty}</p>
                <p>Price: $${p.price * p.qty}</p>
            </div>
        `;
        cartItemsEl.appendChild(li);
        total += p.price * p.qty;
    });

    cartTotalEl.textContent = `$${total}`;
    cartCountEl.textContent = cart.reduce((acc, p) => acc + p.qty, 0);
}

// Animate cart badge on add
function animateCartBadge() {
    cartCountEl.classList.add('cart-bump');
    setTimeout(() => cartCountEl.classList.remove('cart-bump'), 200);
}

// Checkout button
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

// Open/close cart sidebar
cartIcon.addEventListener('click', () => cartSidebar.classList.add('open'));
closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));

// Tagline fade-in and typing effect
window.addEventListener('DOMContentLoaded', () => {
    const topDesc = document.querySelector('.top-description');
    setTimeout(() => topDesc.classList.add('visible'), 100);

    const subText = document.querySelector('.top-description .sub-text');
    const message = "Light up your space, lift your mood, and add elegance to your home.";
    let index = 0;

    function type() {
        if (index < message.length) {
            subText.textContent += message.charAt(index);
            index++;
            setTimeout(type, 50);
        }
    }

    setTimeout(type, 1200);
});

// Fetch products on page load
fetchProducts();
