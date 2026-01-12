
document.querySelectorAll('.password-toggle-icon').forEach(item => {
    item.addEventListener('click', event => {
        let passwordField = item.previousElementSibling;
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            item.innerHTML = '<i class="fas fa-eye"></i>';
        } else {
            passwordField.type = 'password';
            item.innerHTML = '<i class="fas fa-eye-slash"></i>';
        }
    });
});

    
function validateForm() {
    const password = document.getElementById('password').value;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    
     const invalidPasswordModal = document.getElementById('invalidPasswordModal');

    if (!passwordRegex.test(password)) {
        // alert('Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special symbol.');
        invalidPasswordModal.style.display = 'block';
        return false;
    }

    const verifyPassword = document.getElementById('verify-password').value;
    if (password !== verifyPassword) {
        alert('Passwords do not match.');
        return false;
    }

    return true;
}

function closeModal() {
    const invalidPasswordModal = document.getElementById('invalidPasswordModal');
    if (invalidPasswordModal) {
      invalidPasswordModal.style.display = 'none';
    } else {
      console.error('Invalid password modal not found.');
    }
  }
