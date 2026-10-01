
/* =========================================
   ISLAMIC QALAM — CUSTOM PREMIUM CHECKOUT
   ========================================= */

(async () => {
    const client = window.supabaseClient;

    const params = new URLSearchParams(location.search);
    const plan = params.get("plan") === "pass"
        ? "pass"
        : "recurring";

    const $ = id => document.getElementById(id);

    const form = $("premiumPaymentForm");
    const loading = $("checkoutLoading");
    const payButton = $("checkoutPayButton");
    const payLabel = payButton.querySelector("span");
    const errorBox = $("checkoutPaymentError");
    const unavailable = $("checkoutUnavailable");
    const unavailableText = $("checkoutUnavailableText");
    const renewalLabel = $("checkoutRenewalLabel");
    const renewalConsent = $("checkoutRenewalConsent");

    const recurringChoice = $("checkoutRecurringPlan");
    const passChoice = $("checkoutPassPlan");

    let checkout;
    let checkoutActions;
    let checkoutSessionId;
    let canConfirm = false;
    let isProcessing = false;
    let formattedTotal = "";

    /* ============== PLAN DISPLAY ============== */

    const recurring = plan === "recurring";

    const selectedChoice = recurring
        ? recurringChoice
        : passChoice;

    selectedChoice.classList.add("is-selected");
    selectedChoice.setAttribute("aria-current", "true");

    $("checkoutSummaryPlan").textContent = recurring
        ? "Monthly Premium"
        : "30-Day Premium Pass";

    $("checkoutSummaryDescription").textContent = recurring
        ? "Automatically renews each month."
        : "One payment for 30 days of access.";

    $("checkoutSummaryRenewal").textContent = recurring
        ? "Renews at $7.90 USD per month until cancelled."
        : "No automatic renewal. Access expires after 30 days.";

    renewalLabel.hidden = !recurring;

    /* ============== UI HELPERS ============== */

    function showError(message) {
        errorBox.textContent = message;
        errorBox.hidden = false;
    }

    function clearError() {
        errorBox.hidden = true;
        errorBox.textContent = "";
    }

    function showUnavailable(message) {
        loading.hidden = true;
        form.hidden = true;

        unavailableText.textContent = message;
        unavailable.hidden = false;
    }

    function updatePayButton() {
        payButton.disabled =
            isProcessing ||
            !canConfirm ||
            !formattedTotal ||
            (recurring && !renewalConsent.checked);

        payLabel.textContent = isProcessing
            ? "Processing your payment..."
            : formattedTotal
                ? `Pay ${formattedTotal}`
                : "Preparing payment...";
    }

    function updateCheckoutTotal(session) {
        const total = session?.total?.total?.amount;

        if (!total) {
            canConfirm = false;
            updatePayButton();
            return;
        }

        formattedTotal = total;

        $("checkoutSummaryPrice").textContent = total;
        $("checkoutSummaryTotal").textContent = total;

        canConfirm = session.canConfirm === true;
        updatePayButton();
    }

    async function invokeFunction(name, body) {
        const { data, error } =
            await client.functions.invoke(
                name,
                { body }
            );

        if (error) {
            let message = error.message;

            try {
                const response =
                    await error.context?.clone().json();

                message = response?.error || message;

                if (response?.alreadyPremium) {
                    showUnavailable(message);
                }
            } catch {
                // Keep the original error.
            }

            throw new Error(message);
        }

        if (data?.error) {
            throw new Error(data.error);
        }

        return data;
    }

    /* ============== PAYMENT FORM ============== */

    renewalConsent.addEventListener(
        "change",
        updatePayButton
    );

    form.addEventListener("submit", async event => {
        event.preventDefault();
        clearError();

        if (
            !checkoutActions ||
            isProcessing ||
            !canConfirm ||
            (recurring && !renewalConsent.checked)
        ) {
            return;
        }

        isProcessing = true;
        updatePayButton();

        try {
            const result = await checkoutActions.confirm({
                redirect: "if_required"
            });

            if (result?.type === "error") {
                throw new Error(
                    result.error?.message ||
                    "Payment could not be completed."
                );
            }

            // Only Stripe's webhook grants access.
            // The completion page checks the resulting status.
            location.assign(
                "/premium-complete.html?session_id=" +
                encodeURIComponent(checkoutSessionId)
            );

        } catch (error) {
            console.error("Payment failed:", error);

            showError(
                error.message ||
                "Payment failed. Please try again."
            );

            isProcessing = false;
            updatePayButton();
        }
    });

    /* ============== INITIALISE ============== */

    try {
        if (!client || typeof window.Stripe !== "function") {
            throw new Error(
                "The secure payment service is unavailable."
            );
        }

        const {
            data: { user },
            error: authError
        } = await client.auth.getUser();

        if (authError) {
            throw authError;
        }

        if (!user) {
            const destination =
                location.pathname + location.search;

            location.replace(
                "/login.html?redirect=" +
                encodeURIComponent(destination)
            );

            return;
        }

        $("checkoutAccountEmail").textContent =
            user.email || "Your Islamic Qalam account";

        const status = await invokeFunction(
            "get-ebook-access",
            { action: "status" }
        );

        if (status?.hasPremium) {
            showUnavailable(
                "You already have an active Premium membership."
            );

            unavailable.querySelector("a").href =
                "/e-books.html";

            unavailable.querySelector("a").textContent =
                "Browse your Premium library";

            return;
        }

        // This Edge Function handles both payment plans.
        const session = await invokeFunction(
            "create-premium-custom-checkout",
            { plan }
        );

        checkoutSessionId = session.sessionId;

        const stripe = Stripe(session.publishableKey);

        if (
            typeof stripe.initCheckoutElementsSdk !== "function"
        ) {
            throw new Error(
                "Your Stripe.js version does not support " +
                "Checkout Elements."
            );
        }

        checkout = stripe.initCheckoutElementsSdk({
            clientSecret: session.clientSecret,

            elementsOptions: {
                appearance: {
                    theme: "stripe",
                    variables: {
                        colorPrimary: "#bf9446",
                        colorText: "#173e2b",
                        colorBackground: "#fffdf8",
                        borderRadius: "8px",
                        fontFamily: "Arial, sans-serif"
                    }
                }
            }
        });

        const loaded = await checkout.loadActions();

        if (loaded.type !== "success") {
            throw new Error(
                loaded.error?.message ||
                "Unable to load secure Checkout."
            );
        }

        checkoutActions = loaded.actions;

        // Display the price returned by Stripe itself.
        updateCheckoutTotal(
            checkoutActions.getSession()
        );

        checkout.on("change", sessionState => {
            updateCheckoutTotal(sessionState);
        });

        const paymentElement =
            checkout.createPaymentElement({
                layout: "tabs"
            });

        paymentElement.mount("#payment-element");

        loading.hidden = true;
        form.hidden = false;

        updatePayButton();

    } catch (error) {
        console.error(
            "Premium checkout initialisation failed:",
            error
        );

        if (!unavailable.hidden) return;

        showUnavailable(
            error.message ||
            "Unable to prepare your payment. Please try again."
        );
    }
})();
