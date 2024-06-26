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