let list = document.querySelectorAll(".custom-navigation li");
const logout = document.querySelector(".logout")

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const username = document.getElementById("userFullname");
    const userRole = document.getElementById("userRole");

    if (user) {
        username.textContent = user.fullname || "Unknown User"; 
        userRole.textContent = user.rolename || "No Role"; 
    } else {
        console.error("User data not found in sessionStorage.");
    }
});

logout.addEventListener("click", ()=>{
    const removeToken = "";
    const removeUser = "";
    sessionStorage.setItem("authToken", removeToken);
    sessionStorage.setItem("user", removeUser);
    window.location.href = "..~/ppss-login/ppss-login.html";
});

function activeLink() {
    // Skip removing 'active-page' class and only add 'hovered'
    list.forEach(item => {
        if (!item.classList.contains("active-page")) {
            item.classList.remove("hovered");
        }
    });
    this.classList.add("hovered");
}

list.forEach(item => item.addEventListener("mouseover", activeLink));

// Ensure 'hovered' is removed when the mouse leaves
list.forEach(item => item.addEventListener("mouseout", () => {
    if (!item.classList.contains("active-page")) {
        item.classList.remove("hovered");
    }
}));

let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".custom-navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
    navigation.classList.toggle("active");
    main.classList.toggle("active");
};