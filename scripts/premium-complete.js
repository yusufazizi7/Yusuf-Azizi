
/* ================= PAYMENT COMPLETION ================= */

(async () => {
    const client = window.supabaseClient;

    const title =
        document.getElementById("paymentStatusTitle");

    const message =
        document.getElementById("paymentStatusMessage");

    const icon =
        document.getElementById("paymentStatusIcon");

    const libraryLink =
        document.getElementById("paymentLibraryLink");

    const sessionId = new URLSearchParams(
        window.location.search
    ).get("session_id");

    const sleep = ms =>
        new Promise(resolve => setTimeout(resolve, ms));

    try {
        const {
            data: { user }
        } = await client.auth.getUser();

        if (!user || !sessionId) {
            title.textContent =
                "Unable to confirm membership";

            message.textContent =
                "Please sign in and check your membership " +
                "from your profile.";

            return;
        }

        // The webhook may take a few moments to update
        // the database after Stripe confirms the payment.
        for (let attempt = 0; attempt < 6; attempt++) {
            const { data, error } =
                await client.functions.invoke(
                    "get-ebook-access",
                    { body: { action: "status" } }
                );

            if (!error && data?.hasPremium === true) {
                title.textContent =
                    "Welcome to Islamic Qalam Premium!";

                message.textContent =
                    "Your membership is active. " +
                    "You can now download Premium e-books.";

                icon.classList.add("is-success");
                icon.innerHTML =
                    '<i class="fa-solid fa-check" ' +
                    'aria-hidden="true"></i>';

                libraryLink.hidden = false;
                return;
            }

            await sleep(1800);
        }

        title.textContent =
            "Your payment is being processed";

        message.textContent =
            "We haven't confirmed your Premium access yet. " +
            "Please check your profile shortly. " +
            "If you were charged, do not pay again.";

    } catch (error) {
        console.error(
            "Premium confirmation failed:",
            error
        );

        title.textContent =
            "Unable to check your payment";

        message.textContent =
            "Please check your membership in your profile. " +
            "Do not make another payment until you've " +
            "confirmed the status of this one.";
    }
})();
