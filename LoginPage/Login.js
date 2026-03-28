document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Validate mandatory fields
    let isValid = true;
    
    if (!email) {
        showError('Email is required', 'username');
        isValid = false;
    }
    
    if (!password) {
        showError('Password is required', 'password');
        isValid = false;
    }
    
    if (!isValid) return;
    
    const btn = document.querySelector('.login-btn');
    const originalBtnContent = btn.innerHTML;
    
    // Show loading state
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    // Simulate network delay
    setTimeout(() => {
        // Retrieve user data from localStorage
        const user = JSON.parse(localStorage.getItem('user'));

        // Validate login
        if (user && user.email === email && user.password === password) {
            // Set login state in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            
            // Show success animation
            btn.innerHTML = '<i class="fas fa-check"></i>';
            
            // Redirect to homepage after short delay
            setTimeout(() => {
                window.location.href = "../Index/index.html";
            }, 800);
        } else {
            // Show error state
            btn.innerHTML = originalBtnContent;
            btn.disabled = false;
            
            // Add shake animation
            document.getElementById('loginForm').classList.add('shake');
            setTimeout(() => {
                document.getElementById('loginForm').classList.remove('shake');
            }, 500);
            
            showError('Invalid email or password', 'loginForm');
        }
    }, 1500);
});

function showError(message, fieldId) {
    const field = document.getElementById(fieldId);
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.color = '#ff0000';
    error.style.fontSize = '0.8rem';
    error.style.marginTop = '5px';
    
    if (fieldId === 'loginForm') {
        field.parentNode.insertBefore(error, field.nextSibling);
    } else {
        field.parentNode.appendChild(error);
    }
}

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    .error-message {
        color: #ff6b6b;
        font-size: 12px;
        margin-top: 5px;
    }
`;
document.head.appendChild(style);