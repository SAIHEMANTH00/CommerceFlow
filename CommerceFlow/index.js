"use strict";

// ========================================
// 1. PRODUCT DATA
// ========================================

const products = [{
        id: 1,
        name: "Wireless Headphones",
        category: "Tech",
        price: 89,
        tag: "BESTSELLER",
        rating: 4.9,
        reviews: 128,
        description: "Premium sound and all-day comfort.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "Ceramic Coffee Mug",
        category: "Home",
        price: 24,
        tag: "HANDMADE",
        rating: 4.8,
        reviews: 86,
        description: "Make your morning feel special.",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Everyday Backpack",
        category: "Lifestyle",
        price: 68,
        tag: "POPULAR",
        rating: 4.9,
        reviews: 102,
        description: "A reliable companion for every day.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "Minimal Desk Lamp",
        category: "Home",
        price: 45,
        tag: "NEW",
        rating: 4.7,
        reviews: 54,
        description: "Bring a warm glow to your workspace.",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "Bluetooth Speaker",
        category: "Tech",
        price: 52,
        tag: "TOP RATED",
        rating: 4.8,
        reviews: 93,
        description: "Enjoy your music wherever you go.",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "Comfort Throw Blanket",
        category: "Home",
        price: 59,
        tag: "COZY PICK",
        rating: 4.9,
        reviews: 76,
        description: "Add comfort to your favorite corner.",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        name: "Travel Water Bottle",
        category: "Lifestyle",
        price: 32,
        tag: "EVERYDAY",
        rating: 4.6,
        reviews: 61,
        description: "Stay refreshed throughout the day.",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        name: "Wireless Charging Stand",
        category: "Tech",
        price: 39,
        tag: "SMART PICK",
        rating: 4.7,
        reviews: 48,
        description: "Keep your desk neat and organized.",
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=700&q=80"
    }
];


// ========================================
// 2. SELECT HTML ELEMENTS
// ========================================

const productGrid = document.getElementById("product-grid");

const searchInput = document.getElementById("search-input");

const sortSelect = document.getElementById("sort-select");

const resultsMessage = document.getElementById("results-message");

const emptyState = document.getElementById("empty-state");

const cartDrawer = document.getElementById("cart-drawer");

const cartOverlay = document.getElementById("cart-overlay");

const cartItemsContainer = document.getElementById("cart-items");


// ========================================
// 3. APPLICATION STATE
// ========================================

let activeCategory = "All";

let toastTimer;

function loadCart() {
    try {
        const savedCart = JSON.parse(
            localStorage.getItem("shopsphere-cart") || "[]"
        );

        if (!Array.isArray(savedCart)) {
            return [];
        }

        return savedCart
            .filter(item =>
                products.some(product => product.id === item.id) &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0
            )
            .map(item => ({
                id: item.id,
                quantity: item.quantity
            }));

    } catch (error) {
        console.warn("Could not load saved cart:", error);
        return [];
    }
}

let cart = loadCart();


// ========================================
// 4. FORMAT PRICES
// ========================================

function formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(price);
}


// ========================================
// 5. DISPLAY PRODUCTS
// ========================================

function renderProducts() {

    const searchTerm = searchInput.value
        .trim()
        .toLowerCase();

    let filteredProducts = products.filter(product => {

        const matchesCategory =
            activeCategory === "All" ||
            product.category === activeCategory;

        const searchableText = [
            product.name,
            product.category,
            product.description
        ].join(" ").toLowerCase();

        const matchesSearch =
            searchableText.includes(searchTerm);

        return matchesCategory && matchesSearch;
    });


    // Sort products

    switch (sortSelect.value) {

        case "low":
            filteredProducts.sort(
                (a, b) => a.price - b.price
            );
            break;

        case "high":
            filteredProducts.sort(
                (a, b) => b.price - a.price
            );
            break;

        case "name":
            filteredProducts.sort(
                (a, b) => a.name.localeCompare(b.name)
            );
            break;

        default:
            // Keep the original featured order.
            break;
    }


    // Create product cards

    productGrid.innerHTML = filteredProducts
        .map((product, index) => {

            return `
                <article
                    class="product-card"
                    style="animation-delay: ${index * 40}ms"
                >

                    <div class="product-image-wrap">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            class="product-image"
                            loading="lazy"
                        >

                        <span class="product-tag">
                            ${product.tag}
                        </span>

                        <button
                            class="quick-add"
                            data-add="${product.id}"
                            aria-label="Add ${product.name} to cart"
                        >
                            + Add to Cart
                        </button>

                    </div>

                    <div class="product-info">

                        <p class="product-category">
                            ${product.category}
                        </p>

                        <div class="product-name-row">

                            <h3 class="product-name">
                                ${product.name}
                            </h3>

                            <span class="product-price">
                                ${formatPrice(product.price)}
                            </span>

                        </div>

                        <p class="product-description">
                            ${product.description}
                        </p>

                        <div class="product-rating">
                            <span>★★★★★</span>
                            ${product.rating}
                            (${product.reviews} reviews)
                        </div>

                    </div>

                </article>
            `;
        })
        .join("");


    // Update search results

    resultsMessage.textContent =
        `Showing ${filteredProducts.length} of ${products.length} products`;

    emptyState.classList.toggle(
        "hidden",
        filteredProducts.length !== 0
    );

    productGrid.classList.toggle(
        "hidden",
        filteredProducts.length === 0
    );
}


// ========================================
// 6. CATEGORY FILTERING
// ========================================

function setCategory(category) {

    activeCategory = category;

    document.querySelectorAll(".filter-button")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category === category
            );
        });

    renderProducts();
}

document.querySelectorAll(".filter-button")
    .forEach(button => {

        button.addEventListener("click", () => {

            setCategory(button.dataset.category);

        });
    });


// ========================================
// 7. LIVE SEARCH
// ========================================

searchInput.addEventListener("input", () => {

    renderProducts();

});


// ========================================
// 8. SORT PRODUCTS
// ========================================

sortSelect.addEventListener("change", () => {

    renderProducts();

});


// ========================================
// 9. SAVE CART TO LOCAL STORAGE
// ========================================

function saveCart() {

    try {

        localStorage.setItem(
            "shopsphere-cart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.warn("Could not save cart:", error);

        showToast("Your browser could not save the cart.");
    }
}


// ========================================
// 10. ADD PRODUCT TO CART
// ========================================

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) {
        return;
    }

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            id: productId,
            quantity: 1
        });
    }

    saveCart();

    renderCart();

    showToast(`${product.name} added to your cart!`);
}


// Use event delegation for product buttons.

productGrid.addEventListener("click", event => {

    const button = event.target.closest("[data-add]");

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.add);

    addToCart(productId);

});


// ========================================
// 11. CHANGE PRODUCT QUANTITY
// ========================================

function changeQuantity(productId, change) {

    const item = cart.find(
        cartItem => cartItem.id === productId
    );

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {

        cart = cart.filter(
            cartItem => cartItem.id !== productId
        );
    }

    saveCart();

    renderCart();
}


// ========================================
// 12. REMOVE PRODUCT
// ========================================

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();

    renderCart();

    showToast("Product removed from your cart.");
}


// ========================================
// 13. RENDER SHOPPING CART
// ========================================

function renderCart() {

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = cart.reduce(
        (total, item) => {

            const product = products.find(
                product => product.id === item.id
            );

            return total + product.price * item.quantity;

        },
        0
    );


    // Update cart counters

    document.getElementById("cart-count")
        .textContent = totalQuantity;


    // Show total

    document.getElementById("cart-subtotal")
        .textContent = formatPrice(subtotal);


    // Display cart products

    cartItemsContainer.innerHTML = cart
        .map(item => {

            const product = products.find(
                product => product.id === item.id
            );

            return `
                <div class="cart-item">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <div>

                        <span class="item-category">
                            ${product.category}
                        </span>

                        <h3>${product.name}</h3>

                        <span class="item-price">
                            ${formatPrice(product.price)}
                        </span>

                        <div class="quantity-control">

                            <button
                                data-quantity="${product.id}"
                                data-change="-1"
                                aria-label="Decrease ${product.name} quantity"
                            >
                                −
                            </button>

                            <span>${item.quantity}</span>

                            <button
                                data-quantity="${product.id}"
                                data-change="1"
                                aria-label="Increase ${product.name} quantity"
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <button
                        class="remove-item"
                        data-remove="${product.id}"
                    >
                        Remove
                    </button>

                </div>
            `;
        })
        .join("");


    // Toggle empty cart state

    const isEmpty = cart.length === 0;

    document.getElementById("cart-empty")
        .classList.toggle("hidden", !isEmpty);

    cartItemsContainer.classList.toggle(
        "hidden",
        isEmpty
    );

    document.getElementById("cart-footer")
        .classList.toggle("hidden", isEmpty);
}


// ========================================
// 14. CART BUTTON EVENTS
// ========================================

cartItemsContainer.addEventListener("click", event => {

    const quantityButton =
        event.target.closest("[data-quantity]");

    const removeButton =
        event.target.closest("[data-remove]");


    if (quantityButton) {

        const productId = Number(
            quantityButton.dataset.quantity
        );

        const change = Number(
            quantityButton.dataset.change
        );

        changeQuantity(productId, change);
    }


    if (removeButton) {

        const productId = Number(
            removeButton.dataset.remove
        );

        removeFromCart(productId);
    }
});


// ========================================
// 15. OPEN AND CLOSE CART
// ========================================

function openCart() {

    cartDrawer.classList.add("open");

    cartOverlay.classList.add("open");

    cartDrawer.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    document.getElementById("close-cart").focus();
}


function closeCart() {

    cartDrawer.classList.remove("open");

    cartOverlay.classList.remove("open");

    cartDrawer.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    document.getElementById("open-cart").focus();
}


document.getElementById("open-cart")
    .addEventListener("click", openCart);


document.getElementById("close-cart")
    .addEventListener("click", closeCart);


cartOverlay.addEventListener("click", closeCart);


document.getElementById("continue-shopping")
    .addEventListener("click", closeCart);


// ========================================
// 16. SEARCH ICON
// ========================================

document.getElementById("search-focus")
    .addEventListener("click", () => {

        document.getElementById("products")
            .scrollIntoView({
                behavior: "smooth"
            });

        setTimeout(() => {
            searchInput.focus();
        }, 400);
    });


// ========================================
// 17. RESET FILTERS
// ========================================

document.getElementById("reset-filters")
    .addEventListener("click", () => {

        searchInput.value = "";

        sortSelect.value = "featured";

        setCategory("All");
    });


// ========================================
// 18. MOBILE NAVIGATION
// ========================================

const menuButton = document.getElementById("menu-button");

const navigation = document.getElementById("navigation");


menuButton.addEventListener("click", () => {

    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );
});


navigation.addEventListener("click", event => {

    if (event.target.closest("a")) {

        navigation.classList.remove("open");

        menuButton.setAttribute("aria-expanded", "false");
    }
});


// ========================================
// 19. TOAST NOTIFICATIONS
// ========================================

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


// ========================================
// 20. DEMO CHECKOUT
// ========================================

document.getElementById("checkout-button")
    .addEventListener("click", () => {

        showToast(
            "Demo checkout only. No payment was processed."
        );
    });


// ========================================
// 21. KEYBOARD SUPPORT
// ========================================

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        if (cartDrawer.classList.contains("open")) {
            closeCart();
        }

        navigation.classList.remove("open");

        menuButton.setAttribute("aria-expanded", "false");
    }
});


// ========================================
// 22. FOOTER YEAR
// ========================================

document.getElementById("year").textContent =
    new Date().getFullYear();


// ========================================
// 23. INITIALIZE APPLICATION
// ========================================

renderProducts();

renderCart();