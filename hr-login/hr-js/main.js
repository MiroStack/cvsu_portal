let list = document.querySelectorAll(".custom-navigation li");

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