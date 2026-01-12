
document.addEventListener('DOMContentLoaded', () => {
    const passwordField = document.getElementById('password');
    const toggleIcon = document.querySelector('.password-toggle-icon i');

    if (passwordField && toggleIcon) {
        toggleIcon.addEventListener('click', () => {
            
            const isPasswordVisible = passwordField.type === 'text';
            passwordField.type = isPasswordVisible ? 'password' : 'text';
            
            
            toggleIcon.classList.toggle('fa-eye-slash');
            toggleIcon.classList.toggle('fa-eye');
        });
    } else {
        console.error('Password field or toggle icon not found.');
    }
});
