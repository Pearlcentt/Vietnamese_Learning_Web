function showLogin() {
    document.getElementById('login-page').classList.add('active');
    document.getElementById('signup-page').classList.remove('active');
}

function showSignup() {
    document.getElementById('signup-page').classList.add('active');
    document.getElementById('login-page').classList.remove('active');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) { // Kiểm tra input tồn tại
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

// Handle URL parameters for switching between login/register
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('register') === 'true') {
        showSignup();
    } else {
        showLogin();
    }

    // Auto-hide alerts after 5 seconds
    setTimeout(() => {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            alert.style.transition = 'opacity 0.5s ease-in-out';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        });
    }, 5000);

    // Client-side validation

    const registerForm = document.getElementById('signup-page').querySelector('form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {

            const passwordInput = registerForm.querySelector('#password');
            if (passwordInput && passwordInput.value && passwordInput.value.length < 6) {
                e.preventDefault();

                let errorEl = passwordInput.parentElement.parentElement.querySelector('.field-error-js');
                if (!errorEl) {
                    errorEl = document.createElement('div');
                    errorEl.className = 'field-error field-error-js';

                    passwordInput.closest('.form-group').appendChild(errorEl);
                }
                errorEl.textContent = 'Password must be at least 6 characters long!';
                passwordInput.classList.add('is-invalid');
                // alert('Password must be at least 6 characters long!');
            } else {
                // Xóa thông báo lỗi nếu đã hợp lệ
                let errorEl = passwordInput.parentElement.parentElement.querySelector('.field-error-js');
                if (errorEl) errorEl.remove();
                if (passwordInput) passwordInput.classList.remove('is-invalid');
            }
        });
    }
});