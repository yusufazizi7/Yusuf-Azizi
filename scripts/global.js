/* =====================================
   POEM TITLE SVG SYSTEM
===================================== */

let poemTitlesPromise =
    null;


/* =====================================
   LOAD POEM TITLE MAP
===================================== */

async function getPoemTitles() {

    if (
        poemTitlesPromise
    ) {

        return poemTitlesPromise;

    }


    poemTitlesPromise =
        fetch(
            "/scripts/Data/icons.json"
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


    return poemTitlesPromise;

}


/* =====================================
   RENDER POEM TITLE SVGS
===================================== */

async function renderPoemTitles(
    root = document
) {

    const icons =
        await getPoemTitles();


    const titleElements =
        root.querySelectorAll(
            ".poem-title-icon[data-icon]"
        );


    const replacements =
        Array.from(
            titleElements
        ).map(
            async element => {

                /*
                 * Do not render the same element twice.
                 */

                if (
                    element.dataset.rendered ===
                    "true"
                ) {

                    return;

                }


                const iconName =
                    element.dataset.icon
                        ?.trim()
                        .toLowerCase();


                if (
                    !iconName
                ) {

                    return;

                }


                const svgPath =
                    icons[
                    iconName
                    ];


                if (
                    !svgPath
                ) {

                    console.warn(
                        `Poem title "${iconName}" not found in icons.json`
                    );

                    return;

                }


                try {

                    const svgResponse =
                        await fetch(
                            svgPath
                        );


                    if (
                        !svgResponse.ok
                    ) {

                        throw new Error(
                            `Unable to load SVG: ${svgResponse.status}`
                        );

                    }


                    const svgText =
                        await svgResponse.text();


                    /*
                     * Parse the SVG rather than doing a
                     * string replacement on "<svg".
                     */

                    const parser =
                        new DOMParser();


                    const svgDocument =
                        parser.parseFromString(
                            svgText,
                            "image/svg+xml"
                        );


                    const svg =
                        svgDocument.querySelector(
                            "svg"
                        );


                    if (
                        !svg
                    ) {

                        throw new Error(
                            "SVG element not found."
                        );

                    }


                    /*
                     * Keep the existing .poem-title class
                     * on the actual SVG so your current
                     * SVG styling can continue to work.
                     */

                    svg.classList.add(
                        "poem-title",
                        iconName
                    );


                    /*
                     * The Arabic text already provides the
                     * accessible title, so the decorative
                     * SVG should not be read separately.
                     */

                    svg.setAttribute(
                        "aria-hidden",
                        "true"
                    );


                    svg.setAttribute(
                        "focusable",
                        "false"
                    );


                    /*
                     * Put the SVG before the Arabic fallback
                     * text instead of replacing the whole
                     * HTML element.
                     */

                    element.prepend(
                        document.importNode(
                            svg,
                            true
                        )
                    );


                    element.dataset.rendered =
                        "true";


                    element.classList.add(
                        "poem-title-rendered"
                    );


                } catch (
                error
                ) {

                    console.error(
                        `Error loading poem title "${iconName}":`,
                        error
                    );

                }

            }
        );


    await Promise.all(
        replacements
    );

}


/* =====================================
   MAKE AVAILABLE GLOBALLY
===================================== */

window.renderPoemTitles =
    renderPoemTitles;


/*
 * Temporary backwards compatibility
 * if any existing scripts still call:
 *
 * window.renderCustomIcons(...)
 */

window.renderCustomIcons =
    renderPoemTitles;


/* =====================================
   INITIAL POEM TITLE RENDER
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderPoemTitles(
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
