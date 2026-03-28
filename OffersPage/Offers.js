let cart = [];
let selectedOffer = "Sneaker the Weekend";
let currentProduct = null;
let b2g1SelectedProducts = []; // Track selected products for B2G1
let welcomeOfferUsed = localStorage.getItem('welcomeOfferUsed') === 'true'; // Track if the Welcome Offer has been used

// Load cart data from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartIcon();
    }
    loadOffers();
    updateActiveLinks();
});

// Update Cart Icon
function updateCartIcon() {
    const cartCount = document.getElementById('cart-count');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart Modal
function updateCartModal() {
    const modalCartItems = document.getElementById('modal-cart-items');
    const modalTotalAmount = document.getElementById('modal-total-amount');

    modalCartItems.innerHTML = '';
    let totalAmount = 0;

    if (cart.length === 0) {
        modalCartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        modalTotalAmount.textContent = '0.00';
        return;
    }

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('modal-cart-item');
        
        // Ensure size has a default value if undefined
        const displaySize = item.size || '8';
        
        itemDiv.innerHTML = `
            <div class="cart-item-left">
                <img src="${item.image}" alt="${item.name}" width="50">
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-meta">${item.color} • ${item.category} • Size: ${displaySize}</p>
                    <p class="cart-item-price">Rs.${item.price}</p>
                </div>
            </div>
            <div class="cart-item-right">
                <div class="cart-quantity-controls">
                    <button class="decrease-quantity" data-id="${item.name}-${displaySize}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.name}-${displaySize}">+</button>
                </div>
                <button class="remove-item" data-name="${item.name}" data-size="${displaySize}">Remove</button>
            </div>
        `;

        // Add event listeners
        itemDiv.querySelector('.decrease-quantity').addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-id');
            const [name, size] = itemId.split('-');
            const item = cart.find(item => item.name === name && (item.size || '8') === size);
            if (item && item.quantity > 1) {
                item.quantity--;
                updateCartModal();
                updateCartIcon();
            }
        });

        itemDiv.querySelector('.increase-quantity').addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-id');
            const [name, size] = itemId.split('-');
            const item = cart.find(item => item.name === name && (item.size || '8') === size);
            if (item) {
                item.quantity++;
                updateCartModal();
                updateCartIcon();
            }
        });

        itemDiv.querySelector('.remove-item').addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            const size = e.target.getAttribute('data-size');
            
            // Find the exact item to remove
            const index = cart.findIndex(item => 
                item.name === name && 
                (item.size || '8') === size
            );
            
            if (index > -1) {
                cart.splice(index, 1);
                updateCartIcon();
                updateCartModal();
            }
        });

        modalCartItems.appendChild(itemDiv);
        totalAmount += parseFloat(item.price) * item.quantity;
    });

    modalTotalAmount.textContent = totalAmount.toFixed(2);
}

// Show Product Modal
function showProductModal(product) {
    currentProduct = product;
    const modal = document.getElementById('product-modal');
    const modalImage = document.getElementById('modal-product-image');
    const modalName = document.getElementById('modal-product-name');
    const modalCategory = document.getElementById('modal-product-category');
    const modalColor = document.getElementById('modal-product-color');
    const modalPrice = document.getElementById('modal-product-price');
    const modalRating = document.getElementById('modal-product-rating');
    const modalDescription = document.getElementById('modal-product-description');
    const quantity = document.getElementById('quantity');

    // Reset size selection to default (size 8)
    document.getElementById('size-select').value = '8';

    modalImage.src = product.image;
    modalName.textContent = product.name;
    modalCategory.textContent = `Category: ${product.category}`;
    modalColor.textContent = `Color: ${product.color}`;
    
    // Apply discounts based on the selected offer
    if (selectedOffer === "Sneaker the Weekend") {
        const discountedPrice = (product.price * 0.8).toFixed(2); // 20% discount
        modalPrice.innerHTML = `<del>Rs.${product.price}</del> Rs.${discountedPrice}`;
        currentProduct.price = discountedPrice; // Update the price to the discounted price
    } else if (selectedOffer === "Pre-Order") {
        const discountedPrice = (product.price * 0.9).toFixed(2); // 10% discount
        modalPrice.innerHTML = `<del>Rs.${product.price}</del> Rs.${discountedPrice}`;
        currentProduct.price = discountedPrice; // Update the price to the discounted price
    } else if (selectedOffer === "Welcome Offer") {
        const discountedPrice = (product.price * 0.85).toFixed(2); // 15% discount
        modalPrice.innerHTML = `<del>Rs.${product.price}</del> Rs.${discountedPrice}`;
        currentProduct.price = discountedPrice; // Update the price to the discounted price
    } else {
        modalPrice.textContent = `Price: Rs.${product.price}`;
        currentProduct.price = product.price; // Use the original price
    }

    modalRating.textContent = `Rating: ${product.rating}/5`;
    modalDescription.textContent = product.description;
    quantity.textContent = 1;

    // Hide quantity controls for Welcome Offer
    if (selectedOffer === "Welcome Offer") {
        document.getElementById('quantity').style.display = 'none';
        document.getElementById('increase-quantity').style.display = 'none';
        document.getElementById('decrease-quantity').style.display = 'none';
    } else {
        document.getElementById('quantity').style.display = 'inline';
        document.getElementById('increase-quantity').style.display = 'inline';
        document.getElementById('decrease-quantity').style.display = 'inline';
    }

    modal.style.display = 'block';
}

// Close Product Modal
document.querySelector('#product-modal .close-btn').addEventListener('click', () => {
    document.getElementById('product-modal').style.display = 'none';
});

// Quantity Controls
document.getElementById('increase-quantity').addEventListener('click', () => {
    const quantity = document.getElementById('quantity');
    quantity.textContent = parseInt(quantity.textContent) + 1;
});

document.getElementById('decrease-quantity').addEventListener('click', () => {
    const quantity = document.getElementById('quantity');
    if (parseInt(quantity.textContent) > 1) {
        quantity.textContent = parseInt(quantity.textContent) - 1;
    }
});

// Add to Cart from Modal
document.getElementById('modal-add-to-cart').addEventListener('click', () => {
    if (selectedOffer === "Welcome Offer" && welcomeOfferUsed) {
        alert('You can only purchase one product with the Welcome Offer.');
        return;
    }

    const quantity = parseInt(document.getElementById('quantity').textContent);
    const size = document.getElementById('size-select').value;
    
    // Create a unique ID for the item (name + size)
    const itemId = `${currentProduct.name}-${size}`;
    
    const existingItem = cart.find(item => 
        `${item.name}-${item.size}` === itemId
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ 
            ...currentProduct, 
            quantity,
            size 
        });
    }

    if (selectedOffer === "Welcome Offer") {
        welcomeOfferUsed = true; // Mark the Welcome Offer as used
        localStorage.setItem('welcomeOfferUsed', 'true'); // Persist the flag
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    document.getElementById('product-modal').style.display = 'none';
});

// Show Cart Modal
document.getElementById('cart-btn').addEventListener('click', () => {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = 'block';
    updateCartModal();
});

// Close Cart Modal
document.querySelector('#cart-modal .close-btn').addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'none';
});

// Hide Cart Modal when clicking outside of it
window.addEventListener('click', (event) => {
    const cartModal = document.getElementById('cart-modal');
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

//Star Rating
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? '' : '';
    const emptyStars = 5 - (fullStars + (halfStar ? 1 : 0));
    return '★'.repeat(fullStars) + halfStar + '☆'.repeat(emptyStars);
}

// Update breadcrumbs based on current offer
function updateBreadcrumbs() {
    const breadcrumbs = document.querySelector('.breadcrumbs');
    if (!breadcrumbs) return;

    // Start with basic breadcrumbs
    let breadcrumbHTML = '<a href="../Index/index.html">Home</a> &gt; <a href="Offers.html">Offers</a>';

    // Add current offer if not the default
    if (selectedOffer !== "Sneaker the Weekend") {
        breadcrumbHTML += ` &gt; <span>${selectedOffer}</span>`;
    }

    breadcrumbs.innerHTML = breadcrumbHTML;
}

// Load Products from Offers XML
function loadOffers() {
    fetch('../Data/Offers.xml')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const offers = xmlDoc.getElementsByTagName("offer");

            const productContainer = document.getElementById('product-container');
            productContainer.innerHTML = '';

            updateBreadcrumbs();

            Array.from(offers).forEach(offer => {
                const offerName = offer.getAttribute('name');
                if (offerName !== selectedOffer) return;

                const products = offer.getElementsByTagName("product");
                Array.from(products).forEach(product => {
                    const name = product.getElementsByTagName('name')[0].textContent;
                    const category = product.getElementsByTagName('category')[0].textContent;
                    const color = product.getElementsByTagName('color')[0].textContent;
                    const price = parseFloat(product.getElementsByTagName('price')[0].textContent);
                    const image = product.getElementsByTagName('image')[0].textContent;
                    const rating = product.getElementsByTagName('rating')[0].textContent;
                    const description = product.getElementsByTagName('description')[0].textContent;

                    const productDiv = document.createElement('div');
                    productDiv.classList.add('product');

                    // Apply discounts or special logic based on the selected offer
                    let priceDisplay = `Price: Rs.${price}`;
                    if (selectedOffer === "Sneaker the Weekend") {
                        const discountedPrice = (price * 0.8).toFixed(2); // 20% discount
                        priceDisplay = `<del>Rs.${price}</del> Rs.${discountedPrice}`;
                    } else if (selectedOffer === "Pre-Order") {
                        const discountedPrice = (price * 0.9).toFixed(2); // 10% discount
                        priceDisplay = `<del>Rs.${price}</del> Rs.${discountedPrice}`;
                    } else if (selectedOffer === "Welcome Offer") {
                        const discountedPrice = (price * 0.85).toFixed(2); // 15% discount
                        priceDisplay = `<del>Rs.${price}</del> Rs.${discountedPrice}`;
                    }

                    productDiv.innerHTML = `
                        <img src="${image}" alt="${name}" loading="lazy">
                        <h3>${name}</h3>
                        <p>Category: ${category}</p>
                        <p>Color: ${color}</p>
                        <p>${priceDisplay}</p>
                        <span class="stars">${getStarRating(rating)}</span>
                    `;

                    productDiv.addEventListener('click', () => {
                        if (selectedOffer === "B2G1") {
                            // Handle B2G1 logic
                            if (b2g1SelectedProducts.length < 2) {
                                b2g1SelectedProducts.push({ name, price, image, quantity: 1 });
                                alert(`Added ${name} to B2G1 selection. Choose 1 more product.`);
                                if (b2g1SelectedProducts.length === 2) {
                                    alert('You can now choose a free product under Rs.45,000.');
                                    // Load free products for selection
                                    loadFreeProducts();
                                }
                            }
                        } else if (selectedOffer === "Welcome Offer" && welcomeOfferUsed) {
                            alert('You can only purchase one product with the Welcome Offer.');
                        } else {
                            showProductModal({ name, category, color, price, image, rating, description });
                        }
                    });

                    productContainer.appendChild(productDiv);
                });
            });

            // Handle Spin Your Luck and Cashback Offer
            if (selectedOffer === "Spin Your Luck" || selectedOffer === "Cashback Offer") {
                productContainer.innerHTML = `
                    <div class="offer-message">
                        <h2>${selectedOffer}</h2>
                        <p>Visit our showroom to ${selectedOffer === "Spin Your Luck" ? "spin the wheel and win discounts!" : "avail cashback offers!"}</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error loading offers:', error);
            const productContainer = document.getElementById('product-container');
            productContainer.innerHTML = '<p>Failed to load offers. Please try again later.</p>';
        });
}

// Load Free Products for B2G1
function loadFreeProducts() {
    fetch('../Data/Offers.xml')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const products = xmlDoc.getElementsByTagName("product");

            const productContainer = document.getElementById('product-container');
            productContainer.innerHTML = '<h2>Choose a Free Product (Under Rs.45,000)</h2>';

            Array.from(products).forEach(product => {
                const price = parseFloat(product.getElementsByTagName('price')[0].textContent);
                if (price < 45000) {
                    const name = product.getElementsByTagName('name')[0].textContent;
                    const category = product.getElementsByTagName('category')[0].textContent;
                    const color = product.getElementsByTagName('color')[0].textContent;
                    const image = product.getElementsByTagName('image')[0].textContent;

                    const productDiv = document.createElement('div');
                    productDiv.classList.add('product');

                    productDiv.innerHTML = `
                        <img src="${image}" alt="${name}" loading="lazy">
                        <h3>${name}</h3>
                        <p>Category: ${category}</p>
                        <p>Color: ${color}</p>
                        <p>Price: Rs.${price}</p>
                    `;

                    productDiv.addEventListener('click', () => {
                        // Add the two selected products (with size 8 as default) and the free product to the cart
                        b2g1SelectedProducts.forEach(item => {
                            cart.push({ 
                                ...item, 
                                size: '8' // Default size for B2G1 selected items
                            }); // Add the two selected products
                        });
                        cart.push({ 
                            name, 
                            price: 0, 
                            image, 
                            quantity: 1,
                            size: '8' // Default size for free product
                        }); // Add free product to cart
                        updateCartIcon();
                        alert(`Added ${name} as your free product!`);
                        b2g1SelectedProducts = []; // Reset B2G1 selection
                        loadOffers(); // Reload offers
                    });

                    productContainer.appendChild(productDiv);
                }
            });
        })
        .catch(error => {
            console.error('Error loading free products:', error);
        });
}

// Load Offers on Page Load
document.addEventListener('DOMContentLoaded', () => {
    loadOffers();
});

// Filter Button Event Listener
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        selectedOffer = event.target.getAttribute('data-category');
        updateActiveLinks();
        b2g1SelectedProducts = []; // Reset B2G1 selection
        loadOffers();
        updateBreadcrumbs();
    });
});

// Search Functionality
document.getElementById('search-bar').addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        const name = product.querySelector('h3').textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
});

// Checkout Button
document.getElementById('checkout-btn').addEventListener('click', () => {
    localStorage.removeItem('cart');
    updateCartIcon();
    localStorage.removeItem('welcomeOfferUsed'); // Reset Welcome Offer flag
    window.location.href = '../CheckoutPage/Checkout.html';
});

// Underline the current page and selected category
function updateActiveLinks() {
    // Remove active class from all links
    const navLinks = document.querySelectorAll('.nav-links a');
    const filterButtons = document.querySelectorAll('.filter-btn');

    navLinks.forEach(link => link.classList.remove('active'));
    filterButtons.forEach(button => button.classList.remove('active'));

    // Add active class to the current page link
    const currentPage = window.location.pathname.split('/').pop(); 
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Add active class to the selected category button
    filterButtons.forEach(button => {
        if (button.getAttribute('data-category') === selectedOffer) {
            button.classList.add('active');
        }
    });
}

// Show/hide button based on scroll position
window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    backToTopBtn.style.display = "block";
    } else {
    backToTopBtn.style.display = "none";
    }
}

// Smooth scroll to top when clicked
document.getElementById("backToTopBtn").addEventListener("click", function() {
    window.scrollTo({
    top: 0,
    behavior: "smooth"
    });
});