import { baseUrl, dashboard, setToken } from "../scripts/main.js";


const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.querySelector("#register");
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const username = document.getElementById("username");
const password = document.getElementById("password");
const authToken = sessionStorage.getItem("authToken");
const loadingContainer = document.querySelector(".container-loader");
const formContainer = document.querySelector(".form-container")


const validateToken = async (authToken)=>{
    try{
       const response = await fetch(`${baseUrl}/validate?token=${authToken}`,{
        method:"GET",
        headers: { "Content-Type": "application/json" },
        mode:"cors"
       })
       const data = await response.json(); // ✅ Call response.json()
        
        if (data) {
            console.log(data); // ✅ Now this should print
            sessionStorage.setItem("user", JSON.stringify(data));
            dashboard();
        }
    } catch (error) {
        alert("Error:", error);
    }
}

if(authToken){

    validateToken(authToken);
}



// Initial form state
document.addEventListener("DOMContentLoaded", () => {
    loginForm.style.left = "50%";
    loginForm.style.opacity = 1;
    registerForm.style.left = "-50%";
    registerForm.style.opacity = 0;

    
});






// **Login Handler**
document.getElementById("loginBtn").addEventListener("click", async () => {
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
            body:JSON.stringify(userObject),
            mode: "cors", // Enable CORS
        });

        if (response.ok) {
            const data = await response.text();
            console.log("Login Successful:", data);
            setToken(data);
            validateToken(data);
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



