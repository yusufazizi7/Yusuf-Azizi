// document.addEventListener('DOMContentLoaded', function() {
//     const quransvgElements = document.querySelectorAll(".quransvg");

//     quransvgElements.forEach(function(quransvg) {
//         quransvg.addEventListener('load', function() {
//             var svgDoc = quransvg.contentDocument;
//             var svgElements = svgDoc.querySelectorAll('*:not(.rect):not(.wordrect)');
//             var rects = svgDoc.querySelectorAll('.rect');

//             // Function to update the logo based on dark mode
//             function updateQuran() {
//                 const isDarkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
//                 if (isDarkModeEnabled) {
//                     svgElements.forEach(function(element) {
//                         element.style.fill = 'white';

//                         element.classList.add('dark-theme');
                        
                        
//                     });

//                     rects.forEach(function(element) {
//                         element.style.fill = 'darkblue';
//                         element.classList.add('dark-theme');
                        
                        
//                     });
                    
//                 } else {
//                     svgElements.forEach(function(element) {
//                         element.style.fill = '';
//                         element.classList.remove('dark-theme');
                        
//                     });

//                     rects.forEach(function(element) {
//                         element.style.fill = '';
//                         element.classList.remove('dark-theme');
                        
//                     });
                    
//                 }
//             }

//             // Initial update based on saved dark mode state
//             updateQuran();

//             // Optional: if you want to listen for changes in dark mode from the other script
//             document.addEventListener('darkModeToggle', updateQuran);
//         });
//     });
// });



document.addEventListener('DOMContentLoaded', function() {
    const quransvgElements = document.querySelectorAll(".quransvg");

    quransvgElements.forEach(function(quransvg) {
        quransvg.addEventListener('load', function() {
            var svgDoc = quransvg.contentDocument;
            var svgElements = svgDoc.querySelectorAll('*');
            

            // Function to update the logo based on dark mode
            function updateQuran() {
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
            updateQuran();

            // Optional: if you want to listen for changes in dark mode from the other script
            document.addEventListener('darkModeToggle', updateQuran);
        });
    });
});