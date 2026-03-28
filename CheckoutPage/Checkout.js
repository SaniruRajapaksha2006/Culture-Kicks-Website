document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('order-items');
    const totalAmount = document.getElementById('total-amount');
    const progressSteps = document.querySelectorAll('.progress-indicator .step');
    const orderSummarySection = document.getElementById('order-summary');
    const shippingAddressSection = document.getElementById('shipping-address');
    const paymentMethodSection = document.getElementById('payment-method');
    const confirmationSection = document.getElementById('confirmation');

    let total = 0;

    // Display cart items and calculate total
    if (cart.length === 0) {
        orderItems.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('order-item');
            itemDiv.innerHTML = `
                <span>${item.name} (Size: ${item.size}) x ${item.quantity}</span>
                <span>Rs.${(item.price * item.quantity).toFixed(2)}</span>
            `;
            orderItems.appendChild(itemDiv);
            total += item.price * item.quantity;
        });
    }

    // Display the total amount
    totalAmount.textContent = total.toFixed(2);

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Retrieve user data from localStorage and populate shipping form fields
    if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            document.getElementById('name').value = user.fullname || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('street').value = user.street || '';
            document.getElementById('city').value = user.city || '';
            document.getElementById('state').value = user.state || '';
            document.getElementById('zipCode').value = user.zipcode || '';
        }
    } else {
        // Clear fields for guest checkout
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('street').value = '';
        document.getElementById('city').value = '';
        document.getElementById('state').value = '';
        document.getElementById('zipCode').value = '';
    }

    // Proceed to Shipping
    document.getElementById('proceed-to-shipping').addEventListener('click', () => {
        orderSummarySection.style.display = 'none';
        shippingAddressSection.style.display = 'block';
        progressSteps[0].classList.remove('active');
        progressSteps[1].classList.add('active');
    });

    // Handle shipping address form submission
    document.getElementById('shipping-form').addEventListener('submit', function(event) {
        event.preventDefault();

        let isValid = true;

        document.querySelectorAll('.error-message').forEach(msg => msg.remove());

        const fields = ['name', 'email', 'street', 'city', 'state', 'zipCode'];
        fields.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                showError(input, 'This field is required.');
                isValid = false;
            }
        });

        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            showError(document.getElementById('email'), 'Enter a valid email.');
            isValid = false;
        }
        if (!isValid) return;

        const shippingAddress = {
            name: document.getElementById('name').value.trim(),
            email: email,
            street: document.getElementById('street').value.trim(),
            city: document.getElementById('city').value.trim(),
            state: document.getElementById('state').value.trim(),
            zipCode: document.getElementById('zipCode').value.trim()
        };
        localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));

        // Move to Payment section
        shippingAddressSection.style.display = 'none';
        paymentMethodSection.style.display = 'block';
        progressSteps[1].classList.remove('active');
        progressSteps[2].classList.add('active');
    });

    // Payment method selection handling
    const paymentMethod = document.getElementById('paymentMethod');
    const cardNumberField = document.getElementById('cardNumberField');
    const cardDetails = document.getElementById('cardDetails');
    const paypalApplePayMessage = document.getElementById('paypalApplePayMessage');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');

    paymentMethod.addEventListener('change', function() {
        const selectedMethod = paymentMethod.value;

        if (selectedMethod === 'visa' || selectedMethod === 'mastercard') {
            cardNumberField.style.display = 'block';
            cardDetails.style.display = 'block';
            paypalApplePayMessage.style.display = 'none';
            cardNumberInput.setAttribute('required', true);
            expiryDateInput.setAttribute('required', true);
            cvvInput.setAttribute('required', true);
        } else {
            cardNumberField.style.display = 'none';
            cardDetails.style.display = 'none';
            paypalApplePayMessage.style.display = 'block';
            cardNumberInput.removeAttribute('required');
            expiryDateInput.removeAttribute('required');
            cvvInput.removeAttribute('required');
        }
    });

    // Format card number input (1234 5678 9101 1123)
    cardNumberInput.addEventListener('input', function() {
        let value = cardNumberInput.value.replace(/\D/g, ''); // Remove non-numeric characters
        let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim(); // Add spaces every 4 digits
        cardNumberInput.value = formattedValue.substring(0, 19); // Limit to 19 characters
    });

    // Handle payment form submission
    document.getElementById('payment-form').addEventListener('submit', function(event) {
        event.preventDefault();

        let isValid = true;
        document.querySelectorAll('.error-message').forEach(msg => msg.remove());

        const selectedMethod = paymentMethod.value;
        if (!selectedMethod) {
            alert('Please select a payment method.');
            return;
        }

        if (selectedMethod === 'visa' || selectedMethod === 'mastercard') {
            const cardNumber = cardNumberInput.value.trim();
            const expiryDate = expiryDateInput.value.trim();
            const cvv = cvvInput.value.trim();

            if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
                showError(cardNumberInput, 'Enter a valid 16-digit card number.');
                isValid = false;
            }
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
                showError(expiryDateInput, 'Enter a valid MM/YY expiry date (e.g., 12/25)');
                isValid = false;
            } else {
                // Extract month and year
                const [month, year] = expiryDate.split('/');
                const expiry = new Date(`20${year}`, month - 1); // Convert to Date object
                const now = new Date();
                
                // Compare with current date
                if (expiry < now) {
                  showError(expiryDateInput, 'This card has expired');
                  isValid = false;
                }
            }
            if (cvv.length !== 3 || isNaN(cvv)) {
                showError(cvvInput, 'Enter a valid 3-digit CVV.');
                isValid = false;
            }
        }

        if (!isValid) return;

        localStorage.setItem('paymentDetails', JSON.stringify({ method: selectedMethod }));

        paymentMethodSection.style.display = 'none';
        confirmationSection.style.display = 'block';
        progressSteps[2].classList.remove('active');
        progressSteps[3].classList.add('active');

        const confirmationItems = document.getElementById('confirmation-items');
        if (confirmationItems) {
            cart.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.innerHTML = `
                    <p>${item.name} (Size: ${item.size}) x ${item.quantity} - Rs.${(item.price * item.quantity).toFixed(2)}</p>
                `;
                confirmationItems.appendChild(itemDiv);
            });
            
            const totalDiv = document.createElement('div');
            totalDiv.innerHTML = `<p><strong>Total: Rs.${total.toFixed(2)}</strong></p>`;
            totalDiv.style.marginTop = '10px';
            confirmationItems.appendChild(totalDiv);
        }

        setTimeout(() => {
            localStorage.removeItem('cart');
            localStorage.removeItem('isLoggedIn');
            window.location.href = '../Index/index.html';
        }, 3000);
    });

    function showError(input, message) {
        const error = document.createElement('p');
        error.className = 'error-message';
        error.textContent = message;
        error.style.color = 'red';
        error.style.fontSize = '12px';
        error.style.marginTop = '5px';
        input.parentNode.appendChild(error);
    }
});
