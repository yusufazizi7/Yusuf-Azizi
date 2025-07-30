let currentThumbnails = [];
let currentIndex = 0;

const lightbox = document.querySelector('.lightbox');
const expandedImage = lightbox.querySelector('.expanded-image');
const closeLightboxBtn = lightbox.querySelector('.lightbox-close');
const prevArrow = lightbox.querySelector('.arrow-left');
const nextArrow = lightbox.querySelector('.arrow-right');

// Loop through each product
document.querySelectorAll('.product-page').forEach(productPage => {
    const thumbnails = productPage.querySelectorAll('.thumb');
    const mainImage = productPage.querySelector('.product-image');

    // Thumbnail click to change main image
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            mainImage.src = thumb.src;
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });

    // Open lightbox on main image click
    mainImage.addEventListener('click', () => {
        currentThumbnails = Array.from(thumbnails);
        currentIndex = currentThumbnails.findIndex(t => t.src === mainImage.src);
        if (currentIndex === -1) currentIndex = 0;

        expandedImage.src = currentThumbnails[currentIndex].src;
        lightbox.classList.add('active');
    });
});

// Navigate lightbox
prevArrow.addEventListener('click', () => {
    if (!currentThumbnails.length) return;
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentThumbnails.length - 1;
    expandedImage.src = currentThumbnails[currentIndex].src;
});

nextArrow.addEventListener('click', () => {
    if (!currentThumbnails.length) return;
    currentIndex = (currentIndex + 1) % currentThumbnails.length;
    expandedImage.src = currentThumbnails[currentIndex].src;
});

closeLightboxBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});
