

document.addEventListener('DOMContentLoaded', function() {
    const quranDivs = document.querySelectorAll('.quran');

    quranDivs.forEach(div => {
        const paragraphs = div.querySelectorAll('p'); // Get all <p> elements inside the .quran div
        
        paragraphs.forEach(p => {
            // Split the text into words
            const words = p.textContent.split(' ');
            
            // Wrap each word in a span with class "qword"
            const wrappedWords = words.map(word => {
                return word === '*' ? word : `<span class="qword">${word}</span>`;
            }).join(' ');
            
            // Wrap the entire text (now with wrapped words) in a span with class "list"
            const wrappedText = `<span class="list">${wrappedWords}</span>`;
            
            // Update the paragraph content
            p.innerHTML = wrappedText;
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const listItems = document.querySelectorAll('.quran p');

    // Example translations array for each word, this should be updated with the actual translations
    const translations = [
        ['All praise', 'for Allah', 'Lord', 'of the Worlds', 'Ayah 1'],
   
    ];

    listItems.forEach((item, lineIndex) => {
        // Split the text into words
        const words = item.textContent.split(' ');

        // Wrap each word in a span with class "qword" and tooltip functionality, skipping "*"
        let translationIndex = 0; // Keeps track of the translation word index
        const wrappedWords = words.map(word => {
            if (word === '*') {
                return '*'; // Keep the "*" symbol as it is without wrapping
            }

            // Create the tooltip span with translation only if it's not "*"
            const tooltipSpan = `<span class="tooltip qword">${word}<span class="tooltiptext">${translations[lineIndex][translationIndex] }</span></span>`;
            translationIndex++; // Increment the translation index only if the word is not "*"
            return tooltipSpan;

        }).join(' ');

        // Wrap the entire text (now with wrapped words) in a span with class "list"
        const wrappedText = `<span class="list">${wrappedWords}</span>`;

        // Update the list item content
        item.innerHTML = wrappedText;
    });
});