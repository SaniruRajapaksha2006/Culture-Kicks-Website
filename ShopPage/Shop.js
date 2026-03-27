let cart = [];
let selectedCategory = "All";
let currentProduct = null;
let featuredCollection = null;

// Load cart data from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartIcon();
    }

    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    const collectionParam = urlParams.get('collection');
    
    if (filterParam === 'new-featured') {
        selectedCategory = "New and Featured";
        if (collectionParam) {
            featuredCollection = collectionParam.toLowerCase();
        }
    }

    loadProducts();
    updateActiveLinks();
});

// Update Cart Icon and Save to Local Storage
function updateCartIcon() {
    const cartCount = document.getElementById('cart-count');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart Modal with Items
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
        itemDiv.innerHTML = `
            <div class="cart-item-left">
                <img src="${item.image}" alt="${item.name}" width="50">
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-meta">${item.color} • ${item.category} • Size: ${item.size}</p>
                    <p class="cart-item-price">Rs.${item.price}</p>
                </div>
            </div>
            <div class="cart-item-right">
                <div class="cart-quantity-controls">
                    <button class="decrease-quantity" data-id="${item.name}-${item.size}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.name}-${item.size}">+</button>
                </div>
                <button class="remove-item" data-id="${item.name}-${item.size}">Remove</button>
            </div>
        `;

        // Add event listeners
        itemDiv.querySelector('.decrease-quantity').addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-id');
            const [name, size] = itemId.split('-');
            const item = cart.find(item => item.name === name && item.size === size);
            if (item && item.quantity > 1) {
                item.quantity--;
                updateCartModal();
                updateCartIcon();
            }
        });

        itemDiv.querySelector('.increase-quantity').addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-id');
            const [name, size] = itemId.split('-');
            const item = cart.find(item => item.name === name && item.size === size);
            if (item) {
                item.quantity++;
                updateCartModal();
                updateCartIcon();
            }
        });

        itemDiv.querySelector('.remove-item').addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-id');
            const [name, size] = itemId.split('-');
            const index = cart.findIndex(item => item.name === name && item.size === size);
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

    document.getElementById('size-select').value = '8';

    modalImage.src = product.image;
    modalName.textContent = product.name;
    modalCategory.textContent = `Category: ${product.category}`;
    modalColor.textContent = `Color: ${product.color}`;
    modalPrice.textContent = `Price: Rs.${product.price}`;
    modalRating.textContent = `Rating: ${product.rating}/5`;
    modalDescription.textContent = product.description;
    quantity.textContent = 1;

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
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    document.getElementById('product-modal').style.display = 'none';
});
// Show Cart Modal
document.getElementById('cart-btn').addEventListener('click', () => {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = 'block';
    updateCartModal(); // Update modal when cart is clicked
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



// Update breadcrumbs based on current view
function updateBreadcrumbs() {
    const breadcrumbs = document.querySelector('.breadcrumbs');
    if (!breadcrumbs) return;

    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    const collectionParam = urlParams.get('collection');

    // Start with basic breadcrumbs
    let breadcrumbHTML = '<a href="../Index/index.html">Home</a> &gt; <a href="Shop.html">Shop</a>';

    if (filterParam === 'new-featured') {
        breadcrumbHTML += ' &gt; <a href="Shop.html?filter=new-featured">New & Featured</a>';
        
        if (collectionParam) {
            const collectionName = collectionParam.charAt(0).toUpperCase() + collectionParam.slice(1);
            breadcrumbHTML += ` &gt; <span>${collectionName} Collection</span>`;
        }
    } else if (selectedCategory !== "All") {
        breadcrumbHTML += ` &gt; <span>${selectedCategory}</span>`;
    }

    breadcrumbs.innerHTML = breadcrumbHTML;
}


function loadProducts() {
    const productContainer = document.getElementById('product-container');
    updateBreadcrumbs();
    productContainer.innerHTML = '<div class="loading">Loading products...</div>';

    fetch('../Data/Products.xml')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            
            // Check for XML parsing errors
            const parserError = xmlDoc.getElementsByTagName("parsererror");
            if (parserError.length > 0) {
                throw new Error("Invalid XML format");
            }

            const products = xmlDoc.getElementsByTagName("product");
            productContainer.innerHTML = '';

            // Create heading
            const heading = document.createElement('h2');
            if (featuredCollection) {
                heading.textContent = `${featuredCollection.charAt(0).toUpperCase() + featuredCollection.slice(1)} Collection`;
            } else {
                heading.textContent = selectedCategory === "All" ? "All Products" : selectedCategory;
            }
            productContainer.appendChild(heading);

            if (featuredCollection) {
                const backButton = document.createElement('button');
                backButton.textContent = '← View All Featured';
                backButton.className = 'back-button';
                backButton.onclick = () => window.location.href = 'Shop.html?filter=new-featured';
                productContainer.appendChild(backButton);
            }


            if (products.length === 0) {
                productContainer.innerHTML = '<p>No products available.</p>';
                return;
            }

            let hasProducts = false;
            const productFragment = document.createDocumentFragment();

            Array.from(products).forEach(product => {
                try {
                    const name = product.getElementsByTagName('name')[0]?.textContent || 'Unnamed Product';
                    const category = product.getElementsByTagName('category')[0]?.textContent || 'Uncategorized';
                    const color = product.getElementsByTagName('color')[0]?.textContent || 'No color specified';
                    const price = product.getElementsByTagName('price')[0]?.textContent || '0';
                    const image = product.getElementsByTagName('image')[0]?.textContent || '';
                    const featured = product.getElementsByTagName('featured')[0]?.textContent === 'true';
                    const rating = parseFloat(product.getElementsByTagName('rating')[0]?.textContent) || 0;
                    const description = product.getElementsByTagName('description')[0]?.textContent || 'No description available';

                    // Filtering logic
                    if (selectedCategory === "New and Featured") {
                        if (!featured) return;

                        const productCategory = getCollectionType(name);
                        
                        if (featuredCollection && productCategory !== featuredCollection) {
                            return;
                        }
                    } 
                    else if (selectedCategory !== "All" && category.toLowerCase() !== selectedCategory.toLowerCase()) {
                        return;
                    }

                    // Create product element
                    const productDiv = document.createElement('div');
                    productDiv.className = 'product';
                    productDiv.innerHTML = `
                        <img src="${image}" alt="${name}" loading="lazy">
                        <h3>${name}</h3>
                        <p>Category: ${category}</p>
                        <p>Color: ${color}</p>
                        <p>Price: Rs.${price}</p>
                        <span class="stars">${getStarRating(rating)}</span>
                    `;
                    

                    productDiv.addEventListener('click', () => showProductModal({
                        name, category, color, price, image, rating, description
                    }));
                    
                    productFragment.appendChild(productDiv);
                    hasProducts = true;
                } catch (error) {
                    console.error('Error processing product:', error);
                }
            });

            productContainer.appendChild(productFragment);
            
            if (!hasProducts) {
                const noProductsMsg = document.createElement('p');
                noProductsMsg.className = 'no-products';
                noProductsMsg.textContent = featuredCollection 
                    ? `No ${featuredCollection} products found.` 
                    : 'No products match your criteria.';
                productContainer.appendChild(noProductsMsg);
            }
        })
        .catch(error => {
            console.error('Error loading products:', error);
            productContainer.innerHTML = `
                <div class="error">
                    <p>Error loading products. Please try again.</p>
                    <button onclick="loadProducts()">Retry</button>
                </div>
            `;
        });
}

// Categorize products based on name
function getCollectionType(name) {
    const lowerName = name.toLowerCase();
    if (/pegasus/.test(lowerName)) return 'pegasus';
    if (/kyrie/.test(lowerName)) return 'kyrie';
    if (/air(\s*max|max)/.test(lowerName)) return 'airmax';
    if (/vomero/.test(lowerName)) return 'vomero';
    return 'other';
}

// Load Products on Page Load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateActiveLinks(); // Update active links on page load
});

// Filter Button Event Listener
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        selectedCategory = event.target.getAttribute('data-category');
        loadProducts();
        updateActiveLinks(); // Update active links when a filter is clicked
        updateBreadcrumbs();
    });
});

// Reset filter when clicking "Shop" in navbar
document.getElementById('shop-btn').addEventListener('click', () => {
    selectedCategory = "All"; // Show all products
    loadProducts();
    updateActiveLinks(); // Update active links when "Shop" is clicked
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
        if (button.getAttribute('data-category') === selectedCategory) {
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

