document.addEventListener('DOMContentLoaded', function() {
        var checkbox = document.getElementById('LineNumbers');
        var poemList = document.querySelector('.nooniyah');

    // Function to update the list style
        function updateListStyle() {
            if (checkbox.checked) {
                poemList.style.listStyleType = 'arabic-indic';

                
                } else {
                poemList.style.listStyleType = 'none';
                }
    }

    // Load the saved preference from localStorage
    var savedPreference = localStorage.getItem('showLineNumbers');
    if (savedPreference !== null) {
        checkbox.checked = JSON.parse(savedPreference);
    }

    // Initial update based on checkbox state
    updateListStyle();

    // Event listener for checkbox changes
    checkbox.addEventListener('change', function() {
        updateListStyle();
        // Save the current preference to localStorage
        localStorage.setItem('showLineNumbers', checkbox.checked);
    });
});


document.addEventListener('DOMContentLoaded', function() {
    var graphicToggle = document.getElementById('graphicToggle');
    var graphics = document.querySelectorAll('.nooniyah object, .nooniyah img, .nooniyah div'); // Use querySelectorAll to select all elements with the class 'graphics'

    // Function to update the graphics display
    function updateGraphics() {
        graphics.forEach(function(graphic) { // Loop through all selected elements
            if (graphicToggle.checked) {
                graphic.style.display = '';
            } else {
                graphic.style.display = 'none';
            }
        });
    }

    // Load the saved preference from localStorage
    var graphicTogglePref = localStorage.getItem('showgraphics');
    if (graphicTogglePref !== null) {
        graphicToggle.checked = JSON.parse(graphicTogglePref);
    }

    // Initial update based on checkbox state
    updateGraphics();

    // Event listener for checkbox changes
    graphicToggle.addEventListener('change', function() {
        updateGraphics();
        // Save the current preference to localStorage
        localStorage.setItem('showgraphics', graphicToggle.checked);
    });
});


document.addEventListener('DOMContentLoaded', function() {
    var engTransToggle = document.getElementById('engTransToggle');
    var engTranslation = document.querySelectorAll('.engTranslation'); // Use querySelectorAll to select all elements with the class 'graphics'

    // Function to update the graphics display
    function toggleEngTranslation() {
        engTranslation.forEach(function(translationLine) { // Loop through all selected elements
            if (engTransToggle.checked) {
                translationLine.style.display = '';
            } else {
                translationLine.style.display = 'none';
            }
        });
    }

    // Load the saved preference from localStorage
    var engTransTogglePref = localStorage.getItem('showEngTranslation');
    if (engTransTogglePref !== null) {
        engTransToggle.checked = JSON.parse(engTransTogglePref);
    }

    // Initial update based on checkbox state
    toggleEngTranslation();

    // Event listener for checkbox changes
    engTransToggle.addEventListener('change', function() {
        toggleEngTranslation();
        // Save the current preference to localStorage
        localStorage.setItem('showEngTranslation', engTransToggle.checked);
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const listItems = document.querySelectorAll('.nooniyah li');

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


document.addEventListener('DOMContentLoaded', function() {
    const listItems = document.querySelectorAll('.nooniyah li');

    listItems.forEach((item, lineIndex) => {
        // Split the text into words
        const words = item.textContent.split(' ');

        // Example translations array for each word, this should be updated with the actual translations
        const translations = [
            ['Oh', 'Revealer', 'of the Verses', 'and the Criterion', 'Between', 'You', 'and I', 'is the sanctity', 'of the Quran'],
            ['Expand', 'with it', 'my chest', 'for knowledge', 'of guidance', 'and protect', 'my heart', 'from Satan']
        ];

        // Wrap each word in a span with class "qword" and tooltip functionality, skipping "*"
        const wrappedWords = words.map((word, wordIndex) => {
            if (word === '*') return word; // Skip the "*" symbol as requested

            // Create the tooltip span with translation
            const tooltipSpan = `<span class="tooltip qword">${word}<span class="tooltiptext">${translations[lineIndex][wordIndex] || 'Translation here'}</span></span>`;
            return tooltipSpan;
        }).join(' ');

        // Wrap the entire text (now with wrapped words) in a span with class "list"
        const wrappedText = `<span class="list">${wrappedWords}</span>`;

        // Update the list item content
        item.innerHTML = wrappedText;
    });
});

