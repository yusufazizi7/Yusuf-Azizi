document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menu-bars");
    const navigation = document.getElementById("primary-navigation");
    const menuIcon = menuButton?.querySelector("i");

    function closeNavigation() {
        if (!menuButton || !navigation) return;

        navigation.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");

        if (menuIcon) {
            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");
        }
    }

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("active");

            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

            if (menuIcon) {
                menuIcon.classList.toggle("fa-bars", !isOpen);
                menuIcon.classList.toggle("fa-xmark", isOpen);
            }
        });

        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeNavigation);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                closeNavigation();
            }
        });
    }

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    const popup = document.getElementById("donationPopup");
    const closeButton = popup?.querySelector(".close-btn");
    const cancelButton = document.getElementById("cancelButton");
    const donateButton = document.getElementById("donateButton");

    const donationUrl =
        "https://buy.stripe.com/6oE3eY8xJ0ZM5Nu7sv";

    function openPopup() {
        if (!popup) return;

        popup.classList.add("is-visible");
        popup.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        closeButton?.focus();
    }

    function closePopup() {
        if (!popup) return;

        popup.classList.remove("is-visible");
        popup.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        sessionStorage.setItem(
            "islamicQalamDonationSeen",
            "true"
        );
    }

    closeButton?.addEventListener("click", closePopup);

    cancelButton?.addEventListener("click", closePopup);

    donateButton?.addEventListener("click", () => {
        sessionStorage.setItem(
            "islamicQalamDonationSeen",
            "true"
        );

        window.open(
            donationUrl,
            "_blank",
            "noopener,noreferrer"
        );

        closePopup();
    });

    popup?.addEventListener("click", (event) => {
        if (event.target === popup) {
            closePopup();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            popup?.classList.contains("is-visible")
        ) {
            closePopup();
        }
    });

    const popupHasBeenSeen =
        sessionStorage.getItem(
            "islamicQalamDonationSeen"
        ) === "true";

    if (popup && !popupHasBeenSeen) {
        setTimeout(openPopup, 10000);
    }
});