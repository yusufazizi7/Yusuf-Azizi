document.addEventListener('DOMContentLoaded', function() {
    const icon = document.getElementById('moon'); // Initially moon icon
    const body = document.body;
    const svgLogo = document.querySelectorAll(".website-logo")

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


    svgLogo.forEach(function(logoSvg) {
        logoSvg.addEventListener('load', function() {
            var svgDoc = logoSvg.contentDocument;
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

const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');




sidebarToggle.addEventListener('click', toggleSidebar);

function toggleSidebar() {
    sidebar.classList.toggle('active');
}

document.addEventListener('click', function(e) {
    if (!sidebar.contains(e.target) && e.target !== sidebarToggle) {
        sidebar.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Check if the popup has been shown before
    if (!localStorage.getItem('popupShown')) {
        document.getElementById('donationPopup').style.display = 'block';
    }

    // Function to close the popup
    function closePopup() {
        document.getElementById('donationPopup').style.display = 'none';
        localStorage.setItem('popupShown', 'true'); // Store the info in localStorage
    }

    // Attach close action to the close button and cancel button
    document.querySelector('.close-btn').addEventListener('click', closePopup);
    document.getElementById('cancelButton').addEventListener('click', closePopup);

    // If the user clicks on the donate button, redirect them to your donation page
    document.getElementById('donateButton').addEventListener('click', function() {
        localStorage.setItem('popupShown', 'true'); // Save to prevent popup again
        window.open('https://buy.stripe.com/6oE3eY8xJ0ZM5Nu7sv', '_blank'); // Redirect to donation page
    });
});
