document.addEventListener('DOMContentLoaded', () => {
    const qiraahRadios = document.querySelectorAll('input[name="Qiraah"]');

    // 1. Apply saved preference on load
    const savedQiraah = localStorage.getItem('preferredQiraah');
    if (savedQiraah) {
        // If current Qiraah in URL is different, redirect to saved one
        const currentQiraahMatch = window.location.pathname.match(/\/Quran\/([^/]+)/);
        const currentQiraah = currentQiraahMatch ? currentQiraahMatch[1] : null;

        if (currentQiraah && currentQiraah !== savedQiraah) {
            const newUrl = window.location.href.replace(/\/Quran\/[^/]+/, `/Quran/${savedQiraah}`);
            window.location.href = newUrl;
            return;
        }

        // Check the correct radio
        const radioToCheck = document.querySelector(`input[name="Qiraah"][value="${savedQiraah}"]`);
        if (radioToCheck) radioToCheck.checked = true;
    }

    // 2. Save preference and redirect when changed
    qiraahRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const selectedQiraah = document.querySelector('input[name="Qiraah"]:checked').value;
            localStorage.setItem('preferredQiraah', selectedQiraah);

            const newUrl = window.location.href.replace(/\/Quran\/[^/]+/, `/Quran/${selectedQiraah}`);
            window.location.href = newUrl;
        });
    });
});