document.addEventListener('DOMContentLoaded', function() {
    // Select elements with either 'svgObject' or 'anotherClass'
    const svgElements = document.querySelectorAll('.svgObject, .quransvg');

    svgElements.forEach(function(svgElement) {
        svgElement.addEventListener('load', function() {
            const svgDocument = this.contentDocument;
            svgDocument.addEventListener('click', function(e) {
                const event = new Event('click', { bubbles: true });
                document.dispatchEvent(event);
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const logos = document.querySelectorAll(".svgObject");

    logos.forEach(logo => {
        logo.addEventListener('load', function() {
            var svgDoc = logo.contentDocument;
            var svgElements = svgDoc.querySelectorAll('*');

            // Function to update the logo based on dark mode
            function updatesvg() {
                const isDarkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
                if (isDarkModeEnabled) {
                    svgElements.forEach(function(element) {
                        element.classList.add('dark-theme');
                    });
                } else {
                    svgElements.forEach(function(element) {
                        element.classList.remove('dark-theme');
                    });
                }
            }

            // Initial update based on saved dark mode state
            updatesvg();

            // Listen for changes in dark mode from the other script
            document.addEventListener('darkModeToggle', updatesvg);
        });
    });
});