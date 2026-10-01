(() => {

    "use strict";


    const MAX_TIMEOUT =
        2147483647;


    const cards =
        document.querySelectorAll(
            ".early-access-poem-card[data-poem-id]"
        );


    cards.forEach(
        card => {

            initialiseCard(
                card
            );

        }
    );



    function initialiseCard(
        card
    ) {

        const poemId =
            card.dataset.poemId;


        const poem =
            window.islamicQalamPoems
                ?.find(
                    item =>
                        item.id === poemId
                );


        if (
            !poem ||
            !poem.earlyAccess ||
            !poem.releaseAt
        ) {

            console.warn(
                "Early Access poem metadata not found:",
                poemId
            );

            return;
        }


        const releaseTime =
            new Date(
                poem.releaseAt
            ).getTime();


        if (
            !Number.isFinite(
                releaseTime
            )
        ) {

            console.warn(
                "Invalid Early Access release date:",
                poem.releaseAt
            );

            return;
        }


        const releaseText =
            card.querySelector(
                ".poem-release-date-text"
            );


        if (releaseText) {

            releaseText.textContent =
                `Public ${formatReleaseDate(
                    poem.releaseAt
                )}`;

        }


        scheduleCardRelease(
            card,
            releaseTime
        );

    }



    function scheduleCardRelease(
        card,
        releaseTime
    ) {

        const remaining =
            releaseTime -
            Date.now();


        /*
         * Already released.
         */

        if (
            remaining <= 0
        ) {

            makeCardPublic(
                card
            );

            return;
        }


        /*
         * If the visitor keeps the homepage
         * open when release time arrives,
         * change it automatically.
         */

        window.setTimeout(
            () => {

                scheduleCardRelease(
                    card,
                    releaseTime
                );

            },
            Math.min(
                remaining + 100,
                MAX_TIMEOUT
            )
        );

    }



    function makeCardPublic(
        card
    ) {

        card.classList.remove(
            "early-access-poem-card"
        );


        card
            .querySelector(
                ".poem-early-access-badge"
            )
            ?.remove();


        card
            .querySelector(
                ".poem-release-date"
            )
            ?.remove();


        const description =
            card.querySelector(
                ".early-access-poem-description"
            );


        if (
            description &&
            card.dataset.publicDescription
        ) {

            description.textContent =
                card.dataset.publicDescription;

        }


        const linkText =
            card.querySelector(
                ".card-link-text"
            );


        if (linkText) {

            linkText.textContent =
                "Read the poem";

        }

    }



    function formatReleaseDate(
        value
    ) {

        const date =
            new Date(
                value
            );


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