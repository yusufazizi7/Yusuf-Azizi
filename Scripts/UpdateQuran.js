document.addEventListener('DOMContentLoaded', function() {
    const quransvgElements = document.querySelectorAll(".quransvg");

    quransvgElements.forEach(function(quransvg) {
        quransvg.addEventListener('load', function() {
            var svgDoc = quransvg.contentDocument;
            var svgElements = svgDoc.querySelectorAll('*:not(.rect)');
            var rects = svgDoc.querySelectorAll('.rect');

            // Function to update the logo based on dark mode
            function updateQuran() {
                const isDarkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
                if (isDarkModeEnabled) {
                    svgElements.forEach(function(element) {
                        element.style.fill = 'white';
                        
                        
                    });

                    rects.forEach(function(element) {
                        element.style.fill = 'darkblue';
                        
                        
                    });
                    
                } else {
                    svgElements.forEach(function(element) {
                        element.style.fill = '';
                        
                    });

                    rects.forEach(function(element) {
                        element.style.fill = '';
                        
                        
                    });
                    
                }
            }

            // Initial update based on saved dark mode state
            updateQuran();

            // Optional: if you want to listen for changes in dark mode from the other script
            document.addEventListener('darkModeToggle', updateQuran);
        });
    });
});