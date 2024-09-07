const thumbnails = document.querySelectorAll('.thumbnail-images img');
let currentIndex = 0;
const lightbox = document.getElementById('lightbox');
const expandedImage = document.getElementById('expanded-image');
const mainImage = document.getElementById('current-image');

// Change main image when thumbnail is clicked
function changeImage(el) {
    mainImage.src = el.src;
    currentIndex = Array.from(thumbnails).indexOf(el);
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    el.classList.add('active');
}

// Open the lightbox with the current image
function openLightbox() {
    lightbox.classList.add('active');
    expandedImage.src = mainImage.src;
}

// Close the lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
}

// Navigate to the previous image
function prevImage() {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : thumbnails.length - 1;
    updateLightbox();
}

// Navigate to the next image
function nextImage() {
    currentIndex = (currentIndex + 1) % thumbnails.length;
    updateLightbox();
}

// Update lightbox with the new image
function updateLightbox() {
    expandedImage.src = thumbnails[currentIndex].src;
}