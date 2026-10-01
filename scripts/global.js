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
            "/scripts/data/icons.json"
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



/* ==========================================
   ISLAMIC QALAM — PREMIUM NAVIGATION
   ========================================== */

(() => {
    const client = window.supabaseClient;
    const premiumLink = document.getElementById(
        "navPremiumLink"
    );

    if (!client || !premiumLink) return;

    let requestVersion = 0;

    async function updatePremiumNav() {

        const version =
            ++requestVersion;


        // Keep it hidden until we know the user's status.
        premiumLink.hidden =
            true;


        try {

            const {
                data: {
                    session
                },
                error: authError
            } =
                await client
                    .auth
                    .getSession();


            if (
                version !==
                requestVersion
            ) {

                return;

            }


            if (
                authError
            ) {

                console.error(
                    "Unable to check login status:",
                    authError
                );

                return;

            }


            const user =
                session?.user ??
                null;


            // Guests can see the Premium offer.
            if (
                !user
            ) {

                premiumLink.hidden =
                    false;

                return;

            }


            // Check the signed-in user's membership.
            const {
                data,
                error
            } =
                await client
                    .functions
                    .invoke(
                        "get-ebook-access",
                        {
                            body: {
                                action:
                                    "status"
                            }
                        }
                    );


            if (
                version !==
                requestVersion
            ) {

                return;

            }


            if (
                error
            ) {

                console.error(
                    "Unable to check Premium membership:",
                    error
                );

                return;

            }


            // Free members: show.
            // Premium members: hide.
            premiumLink.hidden =
                data?.hasPremium !==
                false;


        } catch (
        error
        ) {

            console.error(
                "Premium navigation error:",
                error
            );

        }

    }

    // Initial check whenever the page opens.
    updatePremiumNav();

    // Update if the user signs in or out
    // without a full page reload.
    client.auth.onAuthStateChange(() => {
        setTimeout(updatePremiumNav, 0);
    });
})();
