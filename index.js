document.addEventListener('DOMContentLoaded', function() {
    const icon = document.getElementById('moon'); // Initially moon icon
    const body = document.body;

    // Check if dark mode is enabled in localStorage when the page loads
    const isDarkModeEnabled = localStorage.getItem('darkModeEnabled');

    if (isDarkModeEnabled === 'true') {
        // Enable dark mode
        body.classList.add('dark-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    icon.onclick = function() {
        // Toggle dark theme
        body.classList.toggle('dark-theme');

        // Toggle icon
        if (body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('darkModeEnabled', 'true');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('darkModeEnabled', 'false');
        }

        // Trigger a custom event to notify about the dark mode change
        const darkModeToggleEvent = new Event('darkModeToggle');
        document.dispatchEvent(darkModeToggleEvent);
    };
});