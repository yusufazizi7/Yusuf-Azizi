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






document.addEventListener("DOMContentLoaded", function() {
    // Mapping English digits to Arabic digits
    const englishToArabicDigits = {
        '0': '٠',
        '1': '١',
        '2': '٢',
        '3': '٣',
        '4': '٤',
        '5': '٥',
        '6': '٦',
        '7': '٧',
        '8': '٨',
        '9': '٩'
    };

    // Function to convert English digits to Arabic digits
    function convertToArabic(number) {
        return number.toString().split('').map(digit => englishToArabicDigits[digit]).join('');
    }

    // Get all divs with class 'page-number'
    const pageNumberDivs = document.querySelectorAll('div.page-number');

    if (pageNumberDivs.length > 0) {
        // Extract the number from the first 'page-number' div
        let currentPageNumber = parseInt(pageNumberDivs[0].textContent);

        // If the number is valid, increment and set for each subsequent div
        if (!isNaN(currentPageNumber)) {
            pageNumberDivs.forEach((div, index) => {
                let newPageNumber = currentPageNumber + index;
                div.textContent = convertToArabic(newPageNumber);
            });
        } else {
            console.error("The first 'page-number' div does not contain a valid number.");
        }
    } else {
        console.error("No divs with the class 'page-number' found.");
    }
});