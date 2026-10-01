/* ==========================================
   ISLAMIC QALAM — PREMIUM PAGE
   ========================================== */

(async () => {

    const client =
        window.supabaseClient;


    if (!client) {

        console.error(
            "Supabase client is unavailable."
        );

        return;

    }


    const banner =
        document.getElementById(
            "premiumExistingMember"
        );


    const planLinks =
        document.querySelectorAll(
            "[data-premium-checkout]"
        );


    /* ==========================================
       HELPERS
       ========================================== */

    function setSignedOutState() {

        planLinks.forEach(link => {

            const rawCheckoutUrl =
                link.getAttribute("href");


            if (!rawCheckoutUrl) {
                return;
            }


            /*
             * login.js only accepts safe internal redirects
             * beginning with "/".
             */

            const checkoutUrl =
                rawCheckoutUrl.startsWith("/")
                    ? rawCheckoutUrl
                    : `/${rawCheckoutUrl}`;


            link.href =
                `/login.html?redirect=${encodeURIComponent(
                    checkoutUrl
                )}`;


            const icon =
                document.createElement("i");

            icon.className =
                "fa-solid fa-right-to-bracket";

            icon.setAttribute(
                "aria-hidden",
                "true"
            );


            link.replaceChildren(
                "Sign in to Subscribe ",
                icon
            );

        });

    }


    function setExistingMemberState() {

        if (banner) {
            banner.hidden = false;
        }


        planLinks.forEach(link => {

            link.href =
                "profile.html?premium=1";


            const icon =
                document.createElement("i");

            icon.className =
                "fa-solid fa-user-gear";

            icon.setAttribute(
                "aria-hidden",
                "true"
            );


            link.replaceChildren(
                "Manage Your Membership ",
                icon
            );

        });

    }


    /* ==========================================
       AUTHENTICATION
       ========================================== */

    try {

        const {
            data: {
                user
            },
            error: authError
        } =
            await client.auth.getUser();


        /*
         * Signed-out visitors must authenticate
         * before entering the Premium checkout.
         */

        if (
            authError ||
            !user
        ) {

            setSignedOutState();

            return;

        }


        /* ==========================================
           PREMIUM STATUS
           ========================================== */

        const {
            data,
            error
        } =
            await client.functions.invoke(
                "get-ebook-access",
                {
                    body: {
                        action:
                            "status"
                    }
                }
            );


        if (error) {

            console.error(
                "Unable to check Premium membership:",
                error
            );

            /*
             * The visitor is authenticated, so leave
             * the normal checkout links unchanged.
             */

            return;

        }


        /*
         * Signed in, but not Premium:
         * leave the original checkout buttons alone.
         */

        if (
            data?.hasPremium !== true
        ) {
            return;
        }


        /*
         * Existing Premium member:
         * replace checkout actions with membership
         * management links.
         */

        setExistingMemberState();


    } catch (error) {

        console.error(
            "Premium page initialisation failed:",
            error
        );

    }

})();