/* =====================================
   CUSTOM SVG ICON SYSTEM
===================================== */

let customIconsPromise =
    null;


async function getCustomIcons() {

    if (
        customIconsPromise
    ) {

        return customIconsPromise;

    }


    customIconsPromise =
        fetch(
            "/Scripts/Data/icons.json"
        )
            .then(
                response => {

                    if (
                        !response.ok
                    ) {

                        throw new Error(
                            `Unable to load icons.json: ${response.status}`
                        );

                    }


                    return response.json();

                }
            );


    return customIconsPromise;

}



async function renderCustomIcons(
    root = document
) {

    const icons =
        await getCustomIcons();


    const iconElements =
        root.querySelectorAll(
            "icon"
        );


    const replacements =
        Array.from(
            iconElements
        ).map(
            async el => {

                const iconName =
                    el.textContent
                        .trim()
                        .toLowerCase();


                const existingClass =
                    el.getAttribute(
                        "class"
                    ) || "";


                if (
                    !icons[
                    iconName
                    ]
                ) {

                    console.warn(
                        `Icon "${iconName}" not found in icons.json`
                    );

                    return;

                }


                try {

                    const svgResponse =
                        await fetch(
                            icons[
                            iconName
                            ]
                        );


                    if (
                        !svgResponse.ok
                    ) {

                        throw new Error(
                            `Unable to load SVG: ${svgResponse.status}`
                        );

                    }


                    let svgText =
                        await svgResponse.text();


                    const combinedClasses =
                        `${existingClass} ${iconName}`
                            .trim();


                    svgText =
                        svgText.replace(
                            "<svg",
                            `<svg class="${combinedClasses}"`
                        );


                    el.outerHTML =
                        svgText;

                } catch (
                error
                ) {

                    console.error(
                        `Error loading SVG for "${iconName}":`,
                        error
                    );

                }

            }
        );


    await Promise.all(
        replacements
    );

}


/*
 * Make it available to scripts that
 * dynamically create <icon> elements.
 */

window.renderCustomIcons =
    renderCustomIcons;



/* =====================================
   INITIAL ICON RENDER
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderCustomIcons(
            document
        );

    }
);


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
            "/profile.html";


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
            "/login.html";


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
