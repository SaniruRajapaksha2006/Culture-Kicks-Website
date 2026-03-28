# 👟 Culture Kicks - Sneaker E-Commerce Website

A modern, responsive e-commerce website for sneaker enthusiasts featuring product browsing, shopping cart, user authentication, and special offers.

---

## 📋 Features

### 🛍️ Shop Page

- Browse products by category (Men, Women, Kids, Limited Editions)
- Search functionality to find specific sneakers
- Product modal with size selection and quantity controls
- "New and Featured" section highlighting recent releases

### 🎁 Offers Page

- Multiple promotional offers:
  - **Sneaker the Weekend**: 20% off selected sneakers
  - **Buy 2 Get 1 Free**: Special B2G1 promotion
  - **Pre-Order**: 10% off limited edition releases
  - **Spin Your Luck**: In-store wheel spin discounts
  - **Welcome Offer**: 15% off first purchase
  - **Cashback Offer**: In-store cashback deals

### 👥 User System

- User registration with multi-step form
- Secure login with localStorage
- Profile management with user details
- Persistent login state

### 🛒 Shopping Cart

- Add/remove items with size selection
- Quantity adjustments
- Real-time cart total calculation
- Cart persists across pages

### 📦 Checkout Process

- Multi-step checkout (Order Summary → Shipping → Payment → Confirmation)
- Form validation for shipping details
- Payment method selection (Visa, MasterCard, PayPal, Apple Pay)
- Order confirmation with redirect

### ℹ️ About Us Page

- Company story and mission
- Core values section
- Team member profiles
- Customer testimonials from XML data

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup |
| **CSS3** | Responsive design with Flexbox and Grid |
| **JavaScript (ES6+)** | Dynamic content, cart management, localStorage |
| **XML** | Product and offers data storage |
| **Font Awesome** | Icons and visual elements |
| **Google Fonts** | Poppins typography |

---

## 📁 Project Structure

```
culture-kicks-website/
├── Index/               # Homepage
│   ├── index.html
│   ├── index.css
│   └── index.js
├── ShopPage/            # Product catalog
│   ├── Shop.html
│   ├── Shop.css
│   └── Shop.js
├── OffersPage/          # Promotions page
│   ├── Offers.html
│   ├── Offers.css
│   └── Offers.js
├── AboutUsPage/         # Company information
│   ├── AboutUs.html
│   ├── AboutUs.css
│   └── AboutUs.js
├── LoginPage/           # User authentication
│   ├── Login.html
│   ├── Login.css
│   └── Login.js
├── SignupPage/          # User registration
│   ├── Signup.html
│   ├── Signup.css
│   └── Signup.js
├── CheckoutPage/        # Order processing
│   ├── Checkout.html
│   ├── Checkout.css
│   └── Checkout.js
├── Data/                # XML data files
│   ├── Products.xml
│   ├── Offers.xml
│   └── Reviews.xml
├── Assets/              # Images and media
│   └── Pictures/
│       ├── Logos/
│       ├── Banner/
│       ├── Shoes/
│       └── Offers/
├── Global.css           # Shared styles
└── README.md            # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- Local server (optional — works with `file://` protocol)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/culture-kicks-website.git
   ```

2. **Navigate to the project folder**
   ```bash
   cd culture-kicks-website
   ```

3. **Open the website**
   - Open `Index/index.html` in your browser
   - Or use Live Server in VS Code for a better experience

---

## 💻 How to Use

### Browsing Products

1. Navigate to the Shop page
2. Filter products by category or search by name
3. Click on any product to view details
4. Select size and quantity
5. Add to cart

### Making a Purchase

1. Add items to cart using the cart button (top-right)
2. Review cart and proceed to checkout
3. Enter shipping details (register for faster checkout)
4. Select payment method
5. Confirm order

### Creating an Account

1. Click **Sign Up** in the navigation bar
2. Fill in personal details (Step 1)
3. Create a secure password (Step 2)
4. Accept terms and complete registration

### Applying Offers

1. Visit the Offers page
2. Browse available promotions
3. Products automatically show discounted prices
4. Special offers like B2G1 guide you through the process

---

## 📱 Responsive Design

The website is fully responsive and works on:

- Desktop computers (1920×1080 and above)
- Laptops (1366×768)
- Tablets (768×1024)
- Mobile devices (375×667 and above)

---

## 🔒 Data Storage

This project uses browser `localStorage` for:

- User authentication state
- Shopping cart contents
- User profile information
- Order details

> **Note:** All data is stored locally on the user's device. No backend database is required.

---

## 🎨 Color Scheme

| Role | Color | Hex |
|------|-------|-----|
| Primary | Deep Teal | `#19647E` |
| Secondary | Light Teal | `#28AFB0` |
| Accent | Red (hover) | `#ff0033` |
| Background | Light Gray | `#f9f9f9` |
| Text | Dark Gray | `#333333` |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

---

## 📝 Future Enhancements

- [ ] Add product reviews and ratings system
- [ ] Implement wishlist functionality
- [ ] Add payment gateway integration (Stripe/PayPal)
- [ ] Create admin dashboard for product management
- [ ] Add email notifications for order confirmation
- [ ] Implement real-time inventory tracking
- [ ] Add product recommendations based on browsing history

---

## 📄 License


---

## 👨‍💻 Author

**Your Name**
- GitHub: [@SaniruRajapaksha2006](https://github.com/SaniruRajapaksha2006)
- Project Link: https://github.com/SaniruRajapaksha2006/Culture-Kicks-Website
- Email: sanirurajapaksha@icloud.com

---

## 🙏 Acknowledgments

- Nike, Adidas, Puma, and other brands for product inspiration
- [Font Awesome](https://fontawesome.com/) for the amazing icon set
- [Google Fonts](https://fonts.google.com/) for the Poppins font family
- All sneaker enthusiasts who inspired this project

---

*Made with ❤️ for sneaker lovers everywhere*