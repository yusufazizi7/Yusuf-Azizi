
document.addEventListener("DOMContentLoaded", function () {
    const qiraahRadios = document.querySelectorAll('input[name="Qiraah"]');
    const quranPages = document.querySelectorAll(".quransvg");

    // Load saved Qiraah preference
    let savedQiraah = localStorage.getItem("selectedQiraah") || "Hafs";

    // Apply saved Qiraah on page load
    qiraahRadios.forEach(radio => {
        if (radio.value === savedQiraah) {
            radio.checked = true;
        }
    });

    function updateQiraah(newQiraah) {
        quranPages.forEach(page => {
            let currentData = page.getAttribute("data");
            let updatedData = currentData.replace(/Hafs|Warsh/g, newQiraah);
            page.setAttribute("data", updatedData);
        });

        // Save the preference in localStorage
        localStorage.setItem("selectedQiraah", newQiraah);
    }

    // Change Qiraah when user selects a radio button
    qiraahRadios.forEach(radio => {
        radio.addEventListener("change", function () {
            updateQiraah(this.value);
        });
    });

    // Apply the selected Qiraah on page load
    updateQiraah(savedQiraah);
});

