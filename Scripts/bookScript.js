let currentThumbnails = [];
let currentIndex = 0;

/* ================= LIGHTBOX ================= */

const lightbox = document.querySelector(".lightbox");
const expandedImage = lightbox?.querySelector(".expanded-image");
const closeLightboxBtn = lightbox?.querySelector(".lightbox-close");
const prevArrow = lightbox?.querySelector(".arrow-left");
const nextArrow = lightbox?.querySelector(".arrow-right");

/**
 * Prevent page scrolling whenever a popup or lightbox is open.
 */
function updatePageScrolling() {
    const resourcePopup = document.getElementById("resourceSupportPopup");

    const lightboxIsOpen =
        lightbox && lightbox.classList.contains("active");

    const resourcePopupIsOpen =
        resourcePopup && resourcePopup.classList.contains("active");

    document.body.style.overflow =
        lightboxIsOpen || resourcePopupIsOpen ? "hidden" : "";
}

/**
 * Set up every e-book product gallery.
 */
document.querySelectorAll(".product-page").forEach((productPage) => {
    const thumbnails = productPage.querySelectorAll(".thumb");
    const mainImage = productPage.querySelector(".product-image");

    if (!mainImage || thumbnails.length === 0) {
        return;
    }

    // Thumbnail click changes the main image.
    thumbnails.forEach((thumb) => {
        thumb.addEventListener("click", () => {
            mainImage.src = thumb.src;
            mainImage.alt = thumb.alt;

            thumbnails.forEach((thumbnail) => {
                thumbnail.classList.remove("active");
            });

            thumb.classList.add("active");
        });
    });

    // Open lightbox when the main image is clicked.
    mainImage.addEventListener("click", () => {
        if (!lightbox || !expandedImage) {
            return;
        }

        currentThumbnails = Array.from(thumbnails);

        currentIndex = currentThumbnails.findIndex(
            (thumbnail) => thumbnail.src === mainImage.src
        );

        if (currentIndex === -1) {
            currentIndex = 0;
        }

        const selectedImage = currentThumbnails[currentIndex];

        expandedImage.src = selectedImage.src;
        expandedImage.alt = selectedImage.alt;

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");

        updatePageScrolling();
    });
});

/**
 * Display the previous image in the lightbox.
 */
if (prevArrow) {
    prevArrow.addEventListener("click", () => {
        if (!currentThumbnails.length || !expandedImage) {
            return;
        }

        currentIndex =
            currentIndex > 0
                ? currentIndex - 1
                : currentThumbnails.length - 1;

        const selectedImage = currentThumbnails[currentIndex];

        expandedImage.src = selectedImage.src;
        expandedImage.alt = selectedImage.alt;
    });
}

/**
 * Display the next image in the lightbox.
 */
if (nextArrow) {
    nextArrow.addEventListener("click", () => {
        if (!currentThumbnails.length || !expandedImage) {
            return;
        }

        currentIndex =
            (currentIndex + 1) % currentThumbnails.length;

        const selectedImage = currentThumbnails[currentIndex];

        expandedImage.src = selectedImage.src;
        expandedImage.alt = selectedImage.alt;
    });
}

/**
 * Close the image lightbox.
 */
function closeImageLightbox() {
    if (!lightbox) {
        return;
    }

    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");

    updatePageScrolling();
}

if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener(
        "click",
        closeImageLightbox
    );
}

if (lightbox) {
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeImageLightbox();
        }
    });
}


/* ================= RESOURCE SUPPORT POPUP ================= */

const resourceLinks = document.querySelectorAll(".resource-link");

const resourcePopup = document.getElementById(
    "resourceSupportPopup"
);

const continueResourceButton = document.getElementById(
    "continueResourceButton"
);

const resourcePopupClose = document.querySelector(
    ".resource-support-close"
);

let selectedResourceUrl = "";
let selectedResourceAction = "";
let selectedDownloadName = "";

/**
 * Open the support popup.
 */
function openResourcePopup() {
    if (!resourcePopup) {
        return;
    }

    resourcePopup.classList.add("active");
    resourcePopup.setAttribute("aria-hidden", "false");

    updatePageScrolling();
}

/**
 * Close the support popup.
 */
function closeResourcePopup() {
    if (!resourcePopup) {
        return;
    }

    resourcePopup.classList.remove("active");
    resourcePopup.setAttribute("aria-hidden", "true");

    updatePageScrolling();
}

/**
 * Show the support popup before reading or downloading.
 */
resourceLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        selectedResourceUrl = link.href;
        selectedResourceAction =
            link.dataset.action || "read";

        selectedDownloadName =
            link.getAttribute("download") || "";

        openResourcePopup();
    });
});

/**
 * Continue to the e-book without donating.
 */
if (continueResourceButton) {
    continueResourceButton.addEventListener("click", () => {
        closeResourcePopup();

        if (!selectedResourceUrl) {
            return;
        }

        if (selectedResourceAction === "download") {
            const temporaryDownloadLink =
                document.createElement("a");

            temporaryDownloadLink.href =
                selectedResourceUrl;

            temporaryDownloadLink.download =
                selectedDownloadName;

            temporaryDownloadLink.style.display = "none";

            document.body.appendChild(
                temporaryDownloadLink
            );

            temporaryDownloadLink.click();
            temporaryDownloadLink.remove();
        } else {
            window.open(
                selectedResourceUrl,
                "_blank",
                "noopener,noreferrer"
            );
        }

        selectedResourceUrl = "";
        selectedResourceAction = "";
        selectedDownloadName = "";
    });
}

/**
 * Close the popup using its close button.
 */
if (resourcePopupClose) {
    resourcePopupClose.addEventListener(
        "click",
        closeResourcePopup
    );
}

/**
 * Close the popup by clicking its dark background.
 */
if (resourcePopup) {
    resourcePopup.addEventListener("click", (event) => {
        if (event.target === resourcePopup) {
            closeResourcePopup();
        }
    });
}


/* ================= KEYBOARD CONTROLS ================= */

document.addEventListener("keydown", (event) => {
    const resourcePopupIsOpen =
        resourcePopup &&
        resourcePopup.classList.contains("active");

    const lightboxIsOpen =
        lightbox &&
        lightbox.classList.contains("active");

    if (event.key === "Escape") {
        if (resourcePopupIsOpen) {
            closeResourcePopup();
            return;
        }

        if (lightboxIsOpen) {
            closeImageLightbox();
        }
    }

    if (!lightboxIsOpen || !currentThumbnails.length) {
        return;
    }

    if (event.key === "ArrowLeft" && prevArrow) {
        prevArrow.click();
    }

    if (event.key === "ArrowRight" && nextArrow) {
        nextArrow.click();
    }
});