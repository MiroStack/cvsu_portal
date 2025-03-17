let list = document.querySelectorAll(".custom-navigation li");
const logout = document.querySelector(".logout")
const user = JSON.parse(sessionStorage.getItem("user"));
const username = document.getElementById("userFullname");
const userRole = document.getElementById("userRole");
const position = user.position;
const addAccountList = document.getElementById("add_account");
const menuAccountList = document.getElementById("manage_account");




document.addEventListener("DOMContentLoaded", () => {
  

    if (user) {
        username.textContent = user.fullname || "Unknown User"; 
        userRole.textContent = user.rolename || "No Role"; 
    } else {
        console.error("User data not found in sessionStorage.");
    }

    if(user.rolename === "Admin"){
        addAccountList.style.display = "none";
        menuAccountList.style.display = "none";
    }
    else{
        addAccountList.style.display = "";
        menuAccountList.style.display = "";
    }


logout.addEventListener("click", ()=>{
    const removeToken = "";
    const removeUser = "";
    sessionStorage.setItem("authToken", removeToken);
    sessionStorage.setItem("user", removeUser);
    position === "HR" ? window.location.replace("./hr-login.html") :
    window.location.replace("./ppss-login.html"); // Redirect without history entry
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
    // Check if it's currently displayed, then toggle properly
    if (username.style.display === "none") {
        username.style.display = "block";
        userRole.style.display = "block";
    } else {
        username.style.display = "none";
        userRole.style.display = "none";
    }
};

});