

function changeFont(fontName) {
    const arabicText = document.querySelectorAll('.nooniyah, .quran-container');
    const isMobile = window.matchMedia('(max-width: 640px)').matches;

    arabicText.forEach(element => {
        element.style.fontFamily = fontName;


        if (fontName.includes('Thuluth') && (!isMobile) ) {
           
            const currentFontSize = window.getComputedStyle(element).fontSize;
            // Extract the numerical value and add a few pixels
            const newFontSize = parseFloat(currentFontSize) + 13; // Adding 3 pixels
            element.style.fontSize = `${newFontSize}px`;
            
        } else if (fontName.includes('Thuluth') && (isMobile)) {

            const currentFontSize = window.getComputedStyle(element).fontSize;
            const newFontSize = parseFloat(currentFontSize) + 7; // Adding 3 pixels
            element.style.fontSize = `${newFontSize}px`;
        } else {

            element.style.fontSize = '';
        }
    
    });

    localStorage.setItem('fontquran', fontName);
}

function initializeFont() {
    const storedFont = localStorage.getItem('fontquran');
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
    
    
    const uthmanRadio = document.querySelector('input[name="font"][value="Uthman"]');
    const thuluthRadio = document.querySelector('input[name="font"][value="Thuluth"]');

    if (fontName.includes('Amiri')) {
        amiriRadio.checked = true;
    } else if (fontName.includes('Neiziri')) {
        neiziriRadio.checked = true;
    } else if (fontName.includes('Hafs')) {
        uthmanRadio.checked = true;
    } else if (fontName.includes('Thuluth')) {

        thuluthRadio.checked = true;
    } else {
        defaultRadio.checked = true;
    }
}

document.addEventListener('DOMContentLoaded', initializeFont);

// const sidebarToggle = document.getElementById("sidebarToggle");
// const sidebar = document.getElementById("sidebar")

const fontRadios = sidebar.querySelectorAll('input[name="font"]');

// sidebarToggle.addEventListener('click', toggleSidebar);

// function toggleSidebar() {
//     sidebar.classList.toggle('active');
// }

// document.addEventListener('click', function(e) {
//     if (!sidebar.contains(e.target) && e.target !== sidebarToggle) {
//         sidebar.classList.remove('active');
//     }
// });

fontRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.checked) {
            if (this.value === 'default') {
                changeFont("'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif");
            
            } else if (this.value === 'Uthman') {
                changeFont("Hafs");
            } else if (this.value === 'Thuluth'){

                changeFont("Thuluth");
            }
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const listItems = document.querySelectorAll('.quran-container p');

    listItems.forEach(item => {
        // Split the text into words
        const words = item.textContent.split(' ');
        
        // Wrap each word in a span with class "qword", skipping "*"
        const wrappedWords = words.map(word => {
            return word === '*' ? word : `<span class="qword">${word}</span>`;
        }).join(' ');
        
        // Wrap the entire text (now with wrapped words) in a span with class "list"
        const wrappedText = `<span class="list">${wrappedWords}</span>`;
        
        // Update the list item content
        item.innerHTML = wrappedText;
    });
});
