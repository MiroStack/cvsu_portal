const loginBtn = document.querySelector("#login");
    const registerBtn = document.querySelector("#register");
    const loginForm = document.querySelector(".login-form");
    const registerForm = document.querySelector(".register-form");

    document.addEventListener("DOMContentLoaded", () => {
        // Set initial visibility for forms
        loginForm.style.left = "50%";
        loginForm.style.opacity = 1;

        registerForm.style.left = "-50%";
        registerForm.style.opacity = 0;
    });

    loginBtn.addEventListener("click", () => {
        loginBtn.style.backgroundColor = "#0a5d00";
        registerBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";

        loginForm.style.left = "50%";
        registerForm.style.left = "-50%";

        loginForm.style.opacity = 1;
        registerForm.style.opacity = 0;
    });

    registerBtn.addEventListener("click", () => {
        loginBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        registerBtn.style.backgroundColor = "#0a5d00";

        loginForm.style.left = "-50%";
        registerForm.style.left = "50%";

        loginForm.style.opacity = 0;
        registerForm.style.opacity = 1;
    });

/** https://www.youtube.com/watch?v=ARQgANFpwQ8 (24:11) **/
