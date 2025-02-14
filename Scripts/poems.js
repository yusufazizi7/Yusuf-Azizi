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

document.addEventListener("DOMContentLoaded", function () {
    const fontRadios = document.querySelectorAll("input[name='font']");
    const verseToggle = document.getElementById("LineNumbers");
    const translationToggle = document.getElementById("engTranslationToggle");
    const poemContainer = document.querySelector(".poem-container");
    const arabicText = document.querySelectorAll(".arabic-text");
    const translations = document.querySelectorAll(".eng-translation");

    // Font Size Controls
    const increaseFontBtn = document.getElementById("increaseFont");
    const decreaseFontBtn = document.getElementById("decreaseFont");
    const resetFontBtn = document.getElementById("resetFont");
    const fontSizeDisplay = document.getElementById("fontSizeDisplay");

    // Default font size
    const defaultFontSize = 27; // 18px default
    let fontSize = parseInt(localStorage.getItem("fontSize")) || defaultFontSize; // Load saved font size or default

    // Apply font size
    function applyFontSize() {
        arabicText.forEach(text => text.style.fontSize = `${fontSize}px`);
        fontSizeDisplay.textContent = `${fontSize}px`;
    }
    applyFontSize(); // Apply saved or default font size

    // Increase Font Size
    increaseFontBtn.addEventListener("click", function () {
        if (fontSize < 40) { // Max limit
            fontSize += 1;
            localStorage.setItem("fontSize", fontSize);
            applyFontSize();
        }
    });

    // Decrease Font Size
    decreaseFontBtn.addEventListener("click", function () {
        if (fontSize > 12) { // Min limit
            fontSize -= 1;
            localStorage.setItem("fontSize", fontSize);
            applyFontSize();
        }
    });

    // Reset Font Size
    resetFontBtn.addEventListener("click", function () {
        fontSize = defaultFontSize; // Reset to default
        localStorage.setItem("fontSize", fontSize);
        applyFontSize();
    });

    // Apply saved font preference
    const savedFont = localStorage.getItem("selectedFont");
    if (savedFont) {
        arabicText.forEach(text => text.style.fontFamily = savedFont);
        const selectedRadio = document.querySelector(`input[value='${savedFont}']`);
        if (selectedRadio) selectedRadio.checked = true;
    }

    // Apply saved verse number preference
    const savedVerseNumbers = localStorage.getItem("showVerseNumbers");
    if (savedVerseNumbers === "true") {
        poemContainer.style.listStyleType = "arabic-indic";
        verseToggle.checked = true;
    } else {
        poemContainer.style.listStyleType = "none";
        verseToggle.checked = false;
    }

    // Check if translations exist before modifying them
    const savedTranslation = localStorage.getItem("showTranslation");
    if (translations.length > 0) {
        if (savedTranslation === "true") {
            translations.forEach(translation => translation.style.display = "block");
            translationToggle.checked = true;
        } else {
            translations.forEach(translation => translation.style.display = "none");
            translationToggle.checked = false;
        }

        translationToggle.addEventListener("change", function () {
            if (this.checked) {
                translations.forEach(translation => translation.style.display = "block");
                localStorage.setItem("showTranslation", "true");
            } else {
                translations.forEach(translation => translation.style.display = "none");
                localStorage.setItem("showTranslation", "false");
            }
        });
    } else {
        if (translationToggle) {
            translationToggle.parentElement.style.display = "none";
        }
    }

    // Change font based on selection
    fontRadios.forEach(radio => {
        radio.addEventListener("change", function () {
            const selectedFont = this.value === "default" ? "inherit" : this.value;
            arabicText.forEach(text => text.style.fontFamily = selectedFont);
            localStorage.setItem("selectedFont", selectedFont);
        });
    });

    // Toggle verse numbers
    verseToggle.addEventListener("change", function () {
        if (this.checked) {
            poemContainer.style.listStyleType = "arabic-indic";
            localStorage.setItem("showVerseNumbers", "true");
        } else {
            poemContainer.style.listStyleType = "none";
            localStorage.setItem("showVerseNumbers", "false");
        }
    });
});
