document.querySelectorAll('.product-page').forEach(productPage => {
    const thumbnails = productPage.querySelectorAll('.thumb');
    const mainImage = productPage.querySelector('.product-image');
    const lightbox = productPage.querySelector('.lightbox');
    const expandedImage = productPage.querySelector('.expanded-image');
    let currentIndex = 0;

    // Change main image when a thumbnail is clicked
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            mainImage.src = thumb.src;
            currentIndex = index;
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });

    // Open the lightbox with the current image
    mainImage.addEventListener('click', () => {
        lightbox.classList.add('active');
        expandedImage.src = mainImage.src;
    });

    // Close the lightbox
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Navigate to the previous image
    lightbox.querySelector('.arrow-left').addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : thumbnails.length - 1;
        updateLightbox();
    });

    // Navigate to the next image
    lightbox.querySelector('.arrow-right').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % thumbnails.length;
        updateLightbox();
    });

    // Update the lightbox image
    function updateLightbox() {
        expandedImage.src = thumbnails[currentIndex].src;
    }
});
