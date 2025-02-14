document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".fa-bars");
    const navbar = document.querySelector(".navbar");

    menuIcon.addEventListener("click", function () {
        navbar.style.display = navbar.style.display === "flex" ? "none" : "flex";
    });
});