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




document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".fa-bars");
    const navbar = document.querySelector(".navbar");

    menuIcon.addEventListener("click", function () {
        navbar.style.display = navbar.style.display === "flex" ? "none" : "flex";
    });
});



/* =====================================
   NAVBAR ACCOUNT STATUS
===================================== */

async function updateNavbarAccount() {

    const accountLink =
        document.getElementById(
            "navAccountLink"
        );


    const accountText =
        document.getElementById(
            "navAccountText"
        );


    if (
        !accountLink ||
        !accountText ||
        !window.supabaseClient
    ) {
        return;
    }


    const {
        data: {
            session
        },
        error
    } =
        await window.supabaseClient
            .auth
            .getSession();


    if (error) {

        console.error(
            "Unable to check login status:",
            error
        );

        return;

    }


    updateAccountLink(
        session
    );

}



/* =====================================
   UPDATE ACCOUNT LINK
===================================== */

function updateAccountLink(
    session
) {

    const accountLink =
        document.getElementById(
            "navAccountLink"
        );


    const accountText =
        document.getElementById(
            "navAccountText"
        );


    if (
        !accountLink ||
        !accountText
    ) {
        return;
    }


    const accountIcon =
        accountLink.querySelector(
            "i"
        );


    if (
        session &&
        session.user
    ) {

        accountLink.href =
            "profile.html";


        accountText.textContent =
            "Profile";


        accountIcon.className =
            "fa-regular fa-user";


        accountLink.setAttribute(
            "aria-label",
            "View your profile"
        );

    } else {

        accountLink.href =
            "login.html";


        accountText.textContent =
            "Login";


        accountIcon.className =
            "fa-solid fa-right-to-bracket";


        accountLink.setAttribute(
            "aria-label",
            "Log in"
        );

    }

}



/* =====================================
   LISTEN FOR AUTH CHANGES
===================================== */

if (
    window.supabaseClient
) {

    window.supabaseClient
        .auth
        .onAuthStateChange(
            (
                event,
                session
            ) => {

                updateAccountLink(
                    session
                );

            }
        );

}



/* =====================================
   INITIAL CHECK
===================================== */

updateNavbarAccount();
