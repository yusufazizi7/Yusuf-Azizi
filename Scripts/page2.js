// document.addEventListener('DOMContentLoaded', function() {
//     const icon = document.getElementById('moon'); // Initially moon icon
//     const body = document.body;
//     const logo = document.getElementById('logo');

//     // Check if dark mode is enabled in localStorage when the page loads
//     const isDarkModeEnabled = localStorage.getItem('darkModeEnabled');

//     if (isDarkModeEnabled === 'true') {
//         // Enable dark mode
//         body.classList.add('dark-theme');
//         icon.classList.remove('fa-moon');
//         icon.classList.add('fa-sun');

//         logo.src = 'Images/QahtanilogoWhite.svg';
//     }

//     icon.onclick = function() {
//         // Toggle dark theme
//         body.classList.toggle('dark-theme');

//         // Toggle icon
//         if (body.classList.contains('dark-theme')) {
//             icon.classList.remove('fa-moon');
//             icon.classList.add('fa-sun');

//             logo.src = 'Images/QahtanilogoWhite.svg';
//             localStorage.setItem('darkModeEnabled', 'true');
//         } else {
//             icon.classList.remove('fa-sun');
//             icon.classList.add('fa-moon');

//             logo.src = 'Images/Qahtanipdflogo.svg';
//             localStorage.setItem('darkModeEnabled', 'false');
//         }
//     };
// });

// document.addEventListener('DOMContentLoaded', function() {
//     const logo = document.getElementById('logo');
//     const logoSrcDark = 'Images/QahtanilogoWhite.svg';
//     const logoSrcLight = 'Images/Qahtanipdflogo.svg';

//     // Function to update the logo based on dark mode
//     function updateLogo() {
//         const isDarkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
//         if (isDarkModeEnabled) {
//             logo.src = logoSrcDark;
//         } else {
//             logo.src = logoSrcLight;
//         }
//     }

//     // Initial update based on saved dark mode state
//     updateLogo();

//     // Optional: if you want to listen for changes in dark mode from the other script
//     document.addEventListener('darkModeToggle', updateLogo);
// });

document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector("#logo");

    logo.addEventListener('load', function() {
        var svgDoc = logo.contentDocument;
        var svgElements = svgDoc.querySelectorAll('*');

        // Function to update the logo based on dark mode
        function updateLogo() {
            const isDarkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
            if (isDarkModeEnabled) {
                svgElements.forEach(function(element) {
                    element.style.fill = 'white';
                });
            } else {
                svgElements.forEach(function(element) {
                    element.style.fill = 'black';
                });
            }
        }

        // Initial update based on saved dark mode state
        updateLogo();

        // Listen for changes in dark mode from the other script
        document.addEventListener('darkModeToggle', updateLogo);
    });
});



function changeFont(fontName) {
    const arabicText = document.querySelectorAll('.nooniyah, .quran');
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
        }
    );

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

const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const fontRadios = sidebar.querySelectorAll('input[name="font"]');

sidebarToggle.addEventListener('click', toggleSidebar);

function toggleSidebar() {
    sidebar.classList.toggle('active');
}

document.addEventListener('click', function(e) {
    if (!sidebar.contains(e.target) && e.target !== sidebarToggle) {
        sidebar.classList.remove('active');
    }
});

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


