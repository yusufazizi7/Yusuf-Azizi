







function changeFont(fontName) {
    const arabicText = document.querySelectorAll('.nooniyah :not(.engTranslation), .quran');
    const isMobile = window.matchMedia('(max-width: 640px)').matches;

    arabicText.forEach(element => {
        // Store the original font size if not already stored
        if (!element.dataset.originalFontSize) {
            element.dataset.originalFontSize = window.getComputedStyle(element).fontSize;
        }

        // Reset to the original font size before applying new adjustments
        const originalFontSize = parseFloat(element.dataset.originalFontSize);
        element.style.fontSize = `${originalFontSize}px`;

        element.style.fontFamily = fontName;

        if (fontName.includes('Thuluth') && !isMobile) {
            const newFontSize = originalFontSize + 6;
            element.style.fontSize = `${newFontSize}px`;
        } else if (fontName.includes('Thuluth') && isMobile) {
            const newFontSize = originalFontSize + 7;
            element.style.fontSize = `${newFontSize}px`;
        } else if (fontName.includes('Neiziri')) {
            const newFontSize = originalFontSize - 3;
            element.style.fontSize = `${newFontSize}px`;
        } else {
            element.style.fontSize = `${originalFontSize}px`; // Reset to original font size
        }
    });

    localStorage.setItem('selectedFont', fontName);
}

function initializeFont() {
    const storedFont = localStorage.getItem('selectedFont');
    if (storedFont) {
        // Apply stored font preference
        changeFont(storedFont);
        updateRadioButtons(storedFont);
    } else {
        // Default initialization if no preference stored
        const defaultFont = "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif";
        changeFont(defaultFont);
        updateRadioButtons(defaultFont);
    }
}

function updateRadioButtons(fontName) {
    const defaultRadio = document.querySelector('input[name="font"][value="default"]');
    const amiriRadio = document.querySelector('input[name="font"][value="amiri"]');
    const neiziriRadio = document.querySelector('input[name="font"][value="Neiziri"]');
    const uthmanRadio = document.querySelector('input[name="font"][value="Uthman"]');
    const thuluthRadio = document.querySelector('input[name="font"][value="Thuluth"]');

    if (fontName.includes('Amiri')) {
        amiriRadio.checked = true;
    } else if (fontName.includes('Neiziri')) {
        neiziriRadio.checked = true;
    } else if (fontName.includes('Uthman')) {
        uthmanRadio.checked = true;
    } else if (fontName.includes('Thuluth')) {

        thuluthRadio.checked = true;
    } else {
        defaultRadio.checked = true;
    }
}

document.addEventListener('DOMContentLoaded', initializeFont);

// const sidebar2 = document.getElementById('sidebar');

const fontRadios = sidebar.querySelectorAll('input[name="font"]');



fontRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.checked) {
            if (this.value === 'default') {
                changeFont("'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif");
            } else if (this.value === 'amiri') {
                changeFont("'Amiri'");
            } else if (this.value === 'Neiziri') {
                changeFont("'Neiziri'");
            } else if (this.value === 'Uthman') {
                changeFont("'Uthman'");
            } else if (this.value === 'Thuluth'){

                changeFont('Thuluth')
            }
        }
    });
});


