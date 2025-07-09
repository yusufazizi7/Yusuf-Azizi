document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".fa-bars");
    const navbar = document.querySelector(".navbar");

    menuIcon.addEventListener("click", function () {
        navbar.style.display = navbar.style.display === "flex" ? "none" : "flex";
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const popup = document.getElementById("donationPopup");
    const closeBtn = document.querySelector(".close-btn");
    const cancelButton = document.getElementById("cancelButton");
    const donateButton = document.getElementById("donateButton");

    // Check if the user has already closed the popup
    if (!localStorage.getItem("donationPopupClosed")) {
        // Show popup if not closed before
        popup.style.display = "flex";
    }

    // Function to close the popup
    function closePopup() {
        popup.style.display = "none";
        // Save preference so it doesn't show again
        localStorage.setItem("donationPopupClosed", "true");
    }

    // Close when clicking anywhere on the page
    document.addEventListener("click", function(event) {
        // Check if the click is outside the popup-content
        if (!popup.contains(event.target) || event.target === closeBtn || event.target === cancelButton) {
            closePopup();
        }
    });

    // Close popup when clicking the close button
    closeBtn.addEventListener("click", closePopup);
    cancelButton.addEventListener("click", closePopup);

    // Redirect to Stripe donation page when clicking donate button
    donateButton.addEventListener("click", function() {
        window.open("https://buy.stripe.com/6oE3eY8xJ0ZM5Nu7sv", "_blank");
        closePopup(); // Close the popup after clicking donate
    });
});


document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('Scripts/Data/icons.json');
  const icons = await res.json();

  const iconElements = document.querySelectorAll('icon');

  iconElements.forEach(async el => {
    const iconName = el.textContent.trim().toLowerCase();
    const existingClass = el.getAttribute('class') || '';

    if (icons[iconName]) {
      try {
        const svgRes = await fetch(icons[iconName]);
        let svgText = await svgRes.text();

        // Inject class into the <svg> tag
        const combinedClasses = `${existingClass} ${iconName}`.trim();
        svgText = svgText.replace('<svg', `<svg class="${combinedClasses}"`);

        el.outerHTML = svgText;
      } catch (err) {
        console.error(`Error loading SVG for "${iconName}":`, err);
      }
    } else {
      console.warn(`Icon "${iconName}" not found in icons.json`);
    }
  });
});

