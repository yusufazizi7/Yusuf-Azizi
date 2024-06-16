document.addEventListener('DOMContentLoaded', function() {
    const icon = document.getElementById('moon'); // Initially moon icon
    const body = document.body;
    const logo = document.getElementById('logo');

    // Check if dark mode is enabled in localStorage when the page loads
    const isDarkModeEnabled = localStorage.getItem('darkModeEnabled');

    if (isDarkModeEnabled === 'true') {
        // Enable dark mode
        body.classList.add('dark-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');

        logo.src = 'Images/QahtanilogoWhite.svg';
    }

    icon.onclick = function() {
        // Toggle dark theme
        body.classList.toggle('dark-theme');

        // Toggle icon
        if (body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');

            logo.src = 'Images/QahtanilogoWhite.svg';
            localStorage.setItem('darkModeEnabled', 'true');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');

            logo.src = 'Images/Qahtanipdflogo.svg';
            localStorage.setItem('darkModeEnabled', 'false');
        }
    };
});

function changeFont(fontName) {
    const arabicText = document.querySelectorAll('.nooniyah');
    arabicText.forEach(element => {
        element.style.fontFamily = fontName;
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

    if (fontName.includes('Amiri')) {
        amiriRadio.checked = true;
    } else if (fontName.includes('Neiziri')) {
        neiziriRadio.checked = true;
    } else if (fontName.includes('Uthman')) {
        uthmanRadio.checked = true;
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
            }
        }
    });
});