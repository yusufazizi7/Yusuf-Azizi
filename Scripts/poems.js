

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




document.addEventListener('DOMContentLoaded', () => {
    const verseDropdown = document.getElementById('verseDropdown');
    const verses = document.querySelectorAll('.poem-verse');

    // Populate the dropdown
    verses.forEach((verse, index) => {
        // Give ID automatically
        verse.id = `verse-${index + 1}`;

        const option = document.createElement('option');
        option.value = verse.id;
        option.textContent = `Verse ${index + 1}`;
        verseDropdown.appendChild(option);

        const copyWrapper = document.createElement('div');
        copyWrapper.className = 'copy-wrapper';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i>';
        copyWrapper.appendChild(copyBtn);

        const dropdown = document.createElement('div');
        dropdown.className = 'copy-dropdown';
        dropdown.innerHTML = `
            <div class="copy-option" data-type="arabic">Copy Arabic</div>
            <div class="copy-option" data-type="english">Copy English</div>
        `;
        copyWrapper.appendChild(dropdown);

        verse.appendChild(copyWrapper);

    });

    // On change, scroll to the verse
    verseDropdown.addEventListener('change', (e) => {
        const verseId = e.target.value;
        if (verseId) {
            const targetVerse = document.getElementById(verseId);
            targetVerse.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Highlight
            targetVerse.classList.add('highlight-verse');
            setTimeout(() => {
                targetVerse.classList.remove('highlight-verse');
            }, 2000);
        }
    });
});



// Show/hide dropdown on button click
document.addEventListener('click', function (e) {
    const isButton = e.target.closest('.copy-btn');
    const allDropdowns = document.querySelectorAll('.copy-dropdown');

    if (isButton) {
        const dropdown = isButton.parentElement.querySelector('.copy-dropdown');
        // Close all others first
        allDropdowns.forEach(d => d.style.display = 'none');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    } else {
        // Clicked outside — close all
        allDropdowns.forEach(d => d.style.display = 'none');
    }
});

// Handle copy option click
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('copy-option')) {
        const verse = e.target.closest('.poem-verse');
        const arabic = verse.querySelector('.arabic-text')?.innerText.trim() || '';
        const english = verse.querySelector('.eng-translation')?.innerText.trim() || '';

        const type = e.target.getAttribute('data-type');
        const textToCopy = (type === 'arabic') ? arabic : english;

        navigator.clipboard.writeText(textToCopy).then(() => {
            const toast = document.getElementById('copyToast');
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 1500); // show for 1.5 seconds
        });

        // Close dropdown after copy
        e.target.closest('.copy-dropdown').style.display = 'none';
    }
});


