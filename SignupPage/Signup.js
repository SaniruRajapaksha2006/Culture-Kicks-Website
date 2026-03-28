let currentStep = 1;

// Show current step
function showStep(step) {
    document.querySelectorAll('.form-step').forEach((stepElement) => {
        stepElement.classList.remove('active');
    });
    document.getElementById(`step${step}`).classList.add('active');
    
    // Update progress bar
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index < step - 1) {
            step.classList.add('completed');
        } else {
            step.classList.remove('completed');
        }
        step.classList.toggle('active', index === step - 1);
    });
}

// Email validation
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Password strength check
function checkPasswordStrength(password) {
    const strengthBars = document.querySelectorAll('.strength-bar');
    strengthBars.forEach(bar => bar.style.backgroundColor = '#e0e0e0');
    
    if (password.length === 0) return;
    
    if (password.length < 6) {
        strengthBars[0].style.backgroundColor = '#ff6b6b';
    } else if (password.length < 9) {
        strengthBars[0].style.backgroundColor = '#ffb347';
        strengthBars[1].style.backgroundColor = '#ffb347';
    } else {
        strengthBars[0].style.backgroundColor = '#4CAF50';
        strengthBars[1].style.backgroundColor = '#4CAF50';
        strengthBars[2].style.backgroundColor = '#4CAF50';
    }
}

// Password validation
function validatePassword(password, confirmPassword) {
    return password === confirmPassword && password.length >= 6;
}

function showError(fieldId, message) {
    clearError(fieldId); // Remove existing errors

    const field = document.getElementById(fieldId);
    if (!field) return; // Safety check

    let error = document.createElement('p');
    error.className = 'error-message';
    error.textContent = message;
    error.style.color = '#ff6b6b';
    error.style.fontSize = '12px';
    error.style.marginTop = '5px';

    // Check if an existing error message is present
    let parent = field.parentNode;
    let existingError = parent.querySelector('.error-message');
    if (!existingError) {
        parent.appendChild(error);
    }

    // Add red border to input field
    field.style.borderColor = '#ff6b6b';
}



// Clear error message
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const error = field.parentNode.querySelector('.error-message');
    if (error) {
        error.remove();
    }
    field.style.borderColor = '#ddd';
}


// Clear all errors
function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('input').forEach(input => {
        input.style.borderColor = '#ddd';
    });
}

function containsNumbers(str) {
    return /\d/.test(str);
}

// Event Listeners
document.getElementById('next1').addEventListener('click', () => {
    clearAllErrors();
    let isValid = true;
    
    // Validate each field in step 1 with specific messages
    const fullname = document.getElementById('fullname').value.trim();
    if (!fullname) {
        showError('fullname', 'Full name is required');
        isValid = false;
    } else if (containsNumbers(fullname)) {
        showError('fullname', 'Full name cannot contain numbers');
        isValid = false;
    }
    
    const email = document.getElementById('email').value.trim();
    if (!email) {
        showError('email', 'Email address is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!document.getElementById('street').value.trim()) {
        showError('street', 'Street address is required');
        isValid = false;
    }
    
    const city = document.getElementById('city').value.trim();
    if (!city) {
        showError('city', 'City is required');
        isValid = false;
    } else if (containsNumbers(city)) {
        showError('city', 'City name cannot contain numbers');
        isValid = false;
    }
    
    const state = document.getElementById('state').value.trim();
    if (!state) {
        showError('state', 'State is required');
        isValid = false;
    } else if (containsNumbers(state)) {
        showError('state', 'State name cannot contain numbers');
        isValid = false;
    }
    
    const zipcode = document.getElementById('zipcode').value.trim();
    if (!zipcode) {
        showError('zipcode', 'Zip code is required');
        isValid = false;
    } else if (!/^\d{5}(-\d{4})?$/.test(zipcode)) {
        showError('zipcode', 'Please enter a valid 5 digit zip code');
        isValid = false;
    }
    
    if (isValid) {
        currentStep = 2;
        showStep(currentStep);
    }
});

document.getElementById('back1').addEventListener('click', () => {
    clearAllErrors();
    currentStep = 1;
    showStep(currentStep);
});

document.getElementById('password').addEventListener('input', (e) => {
    checkPasswordStrength(e.target.value);
});

document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    clearAllErrors();
    
    let isValid = true;
    
    // Check password fields
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    if (!password) {
        showError('password', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (!confirmPassword) {
        showError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    // Check terms checkbox
    if (!document.getElementById('terms').checked) {
        showError('terms', 'You must accept the terms and conditions');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Show loading state
    const btn = document.querySelector('.signup-btn');
    const originalBtnContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    // Simulate network delay
    setTimeout(() => {
        // Save user data to localStorage
        const user = {
            fullname: document.getElementById('fullname').value.trim(),
            email: document.getElementById('email').value.trim(),
            street: document.getElementById('street').value.trim(),
            city: document.getElementById('city').value.trim(),
            state: document.getElementById('state').value.trim(),
            zipcode: document.getElementById('zipcode').value.trim(),
            password: password
        };
        localStorage.setItem('user', JSON.stringify(user));

        // Show success state
        btn.innerHTML = '<i class="fas fa-check"></i>';
        
        // Redirect to login page after short delay
        setTimeout(() => {
            window.location.href = "../LoginPage/Login.html";
        }, 800);
    }, 1500);
});

// Initialize first step
showStep(currentStep);