import { baseUrl, hrDashboard, addAccount, setToken } from "/scripts/main.js";
const loginBtn = document.querySelector("#login");
const loginForm = document.querySelector(".login-form");
const authToken = sessionStorage.getItem("authToken");
const loadingContainer = document.querySelector(".container-loader");
const formContainer = document.querySelector(".form-container")
const username = document.getElementById("username");
const password = document.getElementById("password");


const validateToken = async (authToken) => {
    try {
        const response = await fetch(`${baseUrl}/validate?token=${authToken}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            mode: "cors"
        })
        const data = await response.json(); // ✅ Call response.json()

        if (data) {
            if (data.position === "ODASS") {
                console.log(data); // ✅ Now this should print
                sessionStorage.setItem("user", JSON.stringify(data));
                hrDashboard();
            } else if (data.rolename === "SuperAdmin") {
                console.log(data); // ✅ Now this should print
                sessionStorage.setItem("user", JSON.stringify(data));
                addAccount();
            } else {
                alert("You are not authorized to access this page");
                sessionStorage.removeItem("authToken");
            }
        }
    } catch (error) {
        alert("Error:", error);
    }
}

if (authToken) {

    validateToken(authToken);
}



document.addEventListener("DOMContentLoaded", () => {
    // Set initial visibility for forms
    loginForm.style.left = "50%";
    loginForm.style.opacity = 1;

});
// **Login Handler**
loginBtn.addEventListener("click", async () => {
    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();
    loadingContainer.style.display = "flex";
    formContainer.style.display = "none";

    if (usernameValue === "" || passwordValue === "") {
        alert("Please fill in all fields");
        return;
    }

    console.log(typeof jQuery !== "undefined" ? "jQuery is loaded" : "jQuery is not loaded");
    const userObject = {
        username: usernameValue,
        password: passwordValue
    };

    try {

        const response = await fetch(`${baseUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userObject),
            mode: "cors", // Enable CORS
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                const token = data.token;
                console.log("Login Successful:", token);
                setToken(token);
                validateToken(token);
            }
            else {
                alert(data.message);
            }

        } else {
            alert("Invalid username or password");
        }
        loadingContainer.style.display = "none";
        formContainer.style.display = "flex";
    } catch (error) {
        console.error("Login failed:", error);
        alert("Something went wrong. Try again later.");
    }
});


