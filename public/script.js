// Fetch products
async function fetchProducts() {
    try {
        const res = await fetch("/products");
        const data = await res.json();
        allProducts = data;
    } catch (err) {
        console.error("Failed to fetch products:", err);
    }
}

// Display products
function displayProducts(products) {
    productsGrid.innerHTML = "";
    productsGrid.style.display = "flex"; // show products grid

    if (products.length === 0) {
        productsGrid.innerHTML = "<p style='text-align:center; width:100%; margin-top:20px;'>No products found.</p>";
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product");
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button>Add to Cart</button>
        `;
        productsGrid.appendChild(card);

        if (product.category === "Customizable") {
            card.querySelector("button").addEventListener("click", () => {
                window.location.href = "/customize.html";
            });
        } else {
            card.querySelector("button").addEventListener("click", () => {
                addToCart(product); // <-- fixed: use single function
            });
        }
    });
}

// Category card click
const categoryCards = document.querySelectorAll(".category");
categoryCards.forEach(card => {
    card.addEventListener("click", () => {
        const category = card.dataset.category;

        // Customize redirect
        if (category === "Customizable") {
            window.location.href = "/customize.html";
            return;
        }

        const filtered = allProducts.filter(p => p.category === category);
        displayProducts(filtered);

        // Scroll to products
        window.scrollTo({ top: productsGrid.offsetTop, behavior: 'smooth' });
    });
});

// Initialize
fetchProducts();

// -------------------------
// Cart functionality setup
// -------------------------
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

// -------------------------
// Single addToCart function
// -------------------------
function addToCart(product) {
    const existing = cart.find(p => p.name === product.name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({...product, qty: 1});
    }
    updateCartDisplay();

    // Open cart sidebar automatically
    cartSidebar.classList.add('open');
}

// Update cart display
function updateCartDisplay() {
    cartItemsEl.innerHTML = '';
    let total = 0;

    cart.forEach(p => {
        const li = document.createElement('li');
        li.classList.add('cart-item'); // add class for styling
        li.innerHTML = `
            <img src="${p.image}" alt="${p.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${p.name}</h4>
                <p>Price: $${p.price}</p>
                <p>Qty: ${p.qty}</p>
                <p>Total: $${(p.price * p.qty).toFixed(2)}</p>
            </div>
        `;
        cartItemsEl.appendChild(li);
        total += p.price * p.qty;
    });

    cartTotalEl.textContent = `$${total.toFixed(2)}`;
    cartCountEl.textContent = cart.reduce((acc, p) => acc + p.qty, 0);

    // Animate badge
    cartCountEl.classList.add('cart-bump');
    setTimeout(() => {
        cartCountEl.classList.remove('cart-bump');
    }, 200);
}

// Animate the badge
cartCountEl.classList.add('cart-bump');
setTimeout(() => {
    cartCountEl.classList.remove('cart-bump');
}, 200);


// -------------------------
// Top description fade-in & typing
// -------------------------
const topDesc = document.querySelector('.top-description');
if(topDesc){
    setTimeout(() => topDesc.classList.add('visible'), 100);

    const subText = document.querySelector('.top-description .sub-text');
    const message = "Light up your space, lift your mood, and add elegance to your home.";
    let index = 0;
    function type() {
        if(index < message.length){
            subText.textContent += message.charAt(index);
            index++;
            setTimeout(type, 50);
        }
    }
    setTimeout(type, 1200);
}

// -------------------------
// DOM elements
// -------------------------
const productsGrid = document.getElementById("productsGrid");
let allProducts = [];

