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

// Attach event listener to all unavailable Surah links
document.querySelectorAll(".unavailable-surah").forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent default link behavior
        openSurahPopup();
    });
});
