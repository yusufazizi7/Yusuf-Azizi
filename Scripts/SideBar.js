document.addEventListener("DOMContentLoaded", function() {
    const gearIcon = document.querySelector(".fa-gear");
    const sidebar = document.getElementById("sidebar");

    gearIcon.addEventListener("click", function() {
        sidebar.classList.toggle("active");
    });

    // Close sidebar if user clicks outside of it
    document.addEventListener("click", function(event) {
        if (!sidebar.contains(event.target) && !gearIcon.contains(event.target)) {
            sidebar.classList.remove("active");
        }
    });
});