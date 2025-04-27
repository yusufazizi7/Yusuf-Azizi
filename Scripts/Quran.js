// Function to open the "Surah Not Available" popup
function openSurahPopup() {
    document.getElementById("surahPopup").style.display = "flex";
}

// Function to close the popup
function closeSurahPopup() {
    document.getElementById("surahPopup").style.display = "none";
}

// Close the popup when clicking anywhere outside the content
document.getElementById("surahPopup").addEventListener("click", function(event) {
    if (event.target === this) { // Ensure only the background click closes it
        closeSurahPopup();
    }
});

document.querySelectorAll(".surah-links").forEach(link => {
    if (link.getAttribute("href") === "#") {
        link.classList.add("surah-unavailable");

        // Attach event listener to unavailable surah links
        link.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default link behaviour
            openSurahPopup();
        });
    }
});





