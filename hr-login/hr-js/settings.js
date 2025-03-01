document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('settingsForm');
    const successMessage = document.getElementById('successMessage');
    const imagePreview = document.getElementById('imagePreview');
    const requiredFields = ['username', 'currentPassword', 'password', 'confirmPassword'];

    // Add event listeners for required fields
    requiredFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId);

        field.addEventListener('input', function () {
            if (this.value.trim() !== '') {
                this.classList.remove('is-invalid');
            }
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let isValid = true;

        // Validate required fields
        requiredFields.forEach((fieldId) => {
            const field = document.getElementById(fieldId);
            if (field.value.trim() === '') {
                field.classList.add('is-invalid');
                isValid = false;
            }
        });

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Username validation (letters, numbers, underscores, periods)
        const usernameRegex = /^[a-zA-Z0-9._]+$/;
        if (!usernameRegex.test(username)) {
            alert('Username: Only letters, numbers, underscores, and periods allowed.');
            isValid = false;
        }

        // Password validation (min 8 chars, uppercase, lowercase, numbers, special symbols)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if (!passwordRegex.test(password)) {
            alert('Password: Min 8 chars, upper, lower, number, symbol.');
            isValid = false;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        if (!isValid) {
            return; // Stop submission if fields are invalid
        }

        // Simulate updating settings
        successMessage.style.display = 'block';

        // Reset the form fields
        form.reset();
        imagePreview.src = "";
        imagePreview.style.display = "none";

        // Hide success message after 3 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    });
});