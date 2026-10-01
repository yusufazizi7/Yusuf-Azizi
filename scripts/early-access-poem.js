(() => {

    "use strict";


    const page =
        document.querySelector(
            ".poem-page[data-early-access='true'][data-page-id]"
        );


    /*
     * This script should only do anything
     * on an Early Access poem page.
     */

    if (!page) {
        return;
    }


    const poemId =
        page.dataset.pageId;


    const poemContainer =
        page.querySelector(
            ".poem-container"
        );


    const poemData =
        window.islamicQalamPoems
            ?.find(
                item =>
                    item.id === poemId
            );


    const releaseAt =
        poemData?.releaseAt ||
        "";


    /*
     * Other poem scripts can await this Promise.
     *
     * true  = secure poem content was loaded
     * false = visitor does not currently have access
     */

    window.iqEarlyAccessPoemReady =
        loadEarlyAccessPoem();



    async function loadEarlyAccessPoem() {

        if (
            !poemId ||
            !poemContainer
        ) {

            console.error(
                "Early Access poem configuration is incomplete."
            );

            return false;
        }


        /*
         * Don't briefly expose an empty normal
         * poem reader while access is checked.
         */

        poemContainer.hidden =
            true;


        try {

            const {
                data,
                error
            } =
                await window
                    .supabaseClient
                    .functions
                    .invoke(
                        "get-early-access",
                        {
                            body: {

                                action:
                                    "access",

                                contentType:
                                    "poem",

                                contentKey:
                                    poemId

                            }
                        }
                    );


            if (error) {

                const status =
                    error?.context?.status;


                if (
                    status === 401
                ) {

                    showLockedMessage(
                        "signedOut"
                    );

                    return false;
                }


                if (
                    status === 403
                ) {

                    showLockedMessage(
                        "premiumRequired"
                    );

                    return false;
                }


                console.error(
                    "Early Access poem request failed:",
                    error
                );


                showLockedMessage(
                    "error"
                );

                return false;
            }


            if (
                typeof data?.content !==
                "string" ||
                !data.content.trim()
            ) {

                console.error(
                    "No Early Access poem content was returned."
                );


                showLockedMessage(
                    "error"
                );

                return false;
            }


            /*
             * This HTML comes from our own private
             * Supabase Storage bucket after the
             * server-side entitlement check.
             */

            poemContainer.innerHTML =
                data.content;


            poemContainer.hidden =
                false;


            document
                .getElementById(
                    "earlyAccessPoemGate"
                )
                ?.remove();


            return true;


        } catch (error) {

            console.error(
                "Unable to load Early Access poem:",
                error
            );


            showLockedMessage(
                "error"
            );


            return false;

        }

    }



    function showLockedMessage(
        state
    ) {

        poemContainer.hidden =
            true;


        let gate =
            document.getElementById(
                "earlyAccessPoemGate"
            );


        if (!gate) {

            gate =
                document.createElement(
                    "div"
                );


            gate.id =
                "earlyAccessPoemGate";


            gate.className =
                "early-access-poem-gate";


            poemContainer
                .before(
                    gate
                );

        }


        const formattedRelease =
            formatReleaseDate(
                releaseAt
            );


        const returnPath =
            `${window.location.pathname}${window.location.search}`;


        if (
            state === "signedOut"
        ) {

            gate.innerHTML = `

                <div class="early-access-poem-gate-inner">

                    <i
                        class="fa-solid fa-crown"
                        aria-hidden="true"
                    ></i>

                    <strong>
                        Premium Early Access
                    </strong>

                    <p>
                        Sign in with a Premium account to read
                        this poem before its public release.
                    </p>

                    ${formattedRelease
                    ? `
                                <span>
                                    Public release:
                                    ${formattedRelease}
                                </span>
                              `
                    : ""
                }

                    <a href="/login.html?redirect=${encodeURIComponent(
                    returnPath
                )}">
                        Sign in
                    </a>

                </div>

            `;


            return;
        }


        if (
            state === "premiumRequired"
        ) {

            gate.innerHTML = `

                <div class="early-access-poem-gate-inner">

                    <i
                        class="fa-solid fa-crown"
                        aria-hidden="true"
                    ></i>

                    <strong>
                        Premium Early Access
                    </strong>

                    <p>
                        This poem is currently available
                        exclusively to Islamic Qalam Premium
                        members.
                    </p>

                    ${formattedRelease
                    ? `
                                <span>
                                    Public release:
                                    ${formattedRelease}
                                </span>
                              `
                    : ""
                }

                    <a href="/premium.html">
                        Get Premium
                    </a>

                </div>

            `;


            return;
        }


        gate.innerHTML = `

            <div class="early-access-poem-gate-inner">

                <strong>
                    Unable to load poem
                </strong>

                <p>
                    We couldn't check Early Access right now.
                    Please refresh the page and try again.
                </p>

                <a href="${window.location.href}">
                    Refresh page
                </a>

            </div>

        `;

    }



    function formatReleaseDate(
        value
    ) {

        const date =
            new Date(
                value
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "";
        }


        return new Intl.DateTimeFormat(
            "en-AU",
            {
                day:
                    "numeric",

                month:
                    "long",

                year:
                    "numeric"
            }
        ).format(
            date
        );

    }

})();