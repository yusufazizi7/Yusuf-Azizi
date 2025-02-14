document.querySelectorAll('.product-page').forEach(productPage => {
    const thumbnails = productPage.querySelectorAll('.thumb');
    const mainImage = productPage.querySelector('.product-image');
    const lightbox = document.querySelector('.lightbox'); // Global lightbox
    const expandedImage = lightbox.querySelector('.expanded-image');
    const closeLightboxBtn = lightbox.querySelector('.lightbox-close');
    const prevArrow = lightbox.querySelector('.arrow-left');
    const nextArrow = lightbox.querySelector('.arrow-right');

    let currentIndex = 0;
    let currentThumbnails = []; // Store thumbnails for current product

    // Function to update the main image
    function changeImage(index) {
        mainImage.src = currentThumbnails[index].src;
        currentIndex = index;

        // Remove active class from all thumbnails and add to the current one
        currentThumbnails.forEach(t => t.classList.remove('active'));
        currentThumbnails[index].classList.add('active');
    }

    // Function to update lightbox image
    function updateLightbox() {
        expandedImage.src = currentThumbnails[currentIndex].src;
    }

    // Change main image when a thumbnail is clicked
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            currentThumbnails = Array.from(thumbnails); // Update current thumbnails
            changeImage(index);
        });
    });

    // Open the lightbox with the current image
    mainImage.addEventListener('click', () => {
        lightbox.classList.add('active');
        expandedImage.src = mainImage.src;
        currentThumbnails = Array.from(thumbnails); // Ensure correct thumbnails are used
    });

    // Close the lightbox
    closeLightboxBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Close lightbox if clicked outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // Navigate to the previous image
    prevArrow.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentThumbnails.length - 1;
        updateLightbox();
    });

    // Navigate to the next image
    nextArrow.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % currentThumbnails.length;
        updateLightbox();
    });
});
