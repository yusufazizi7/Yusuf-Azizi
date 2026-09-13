/* =========================================================
   ISLAMIC QALAM CHECKOUT
   ========================================================= */

const CHECKOUT_CART_STORAGE_KEY = "islamicqalam_ebook_cart";

const STRIPE_PUBLISHABLE_KEY =
    "pk_live_51QAVTYEeffhKyqcX1PCHKSr3UiXYEYspTLWwoeaHzlz4LPjWZnfpWcXSVqKT59ucdPAUGWcAUya7ed0MsC3MxmV300FFQHDGKR";

/* ================= ELEMENTS ================= */

const checkoutEmail = document.getElementById("checkoutEmail");

const emailError = document.getElementById("emailError");

const accountStatus = document.getElementById("accountStatus");

const checkoutItems = document.getElementById("checkoutItems");

const checkoutEmpty = document.getElementById("checkoutEmpty");

const checkoutTotals = document.getElementById("checkoutTotals");

const checkoutSubtotal = document.getElementById("checkoutSubtotal");

const checkoutTotal = document.getElementById("checkoutTotal");

const continuePaymentButton = document.getElementById("continuePaymentButton");

const checkoutDevelopmentMessage = document.getElementById(
    "checkoutDevelopmentMessage",
);

const paymentPlaceholder = document.getElementById("paymentPlaceholder");

const paymentElementContainer = document.getElementById(
    "paymentElementContainer",
);

const paymentError = document.getElementById("paymentError");

const checkoutPaymentHeading =
    document.getElementById(
        "checkoutPaymentHeading"
    );

const checkoutPaymentDescription =
    document.getElementById(
        "checkoutPaymentDescription"
    );

const paymentPlaceholderIcon =
    document.getElementById(
        "paymentPlaceholderIcon"
    );

const paymentPlaceholderTitle =
    document.getElementById(
        "paymentPlaceholderTitle"
    );

const paymentPlaceholderText =
    document.getElementById(
        "paymentPlaceholderText"
    );

const checkoutEmailSection = document.getElementById("checkoutEmailSection");
/* ================= STRIPE STATE ================= */

const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

let stripeCheckout = null;
let stripeActions = null;
let stripePaymentElement = null;

let checkoutSessionCreated = false;



/* ================= CART ================= */

function loadCheckoutCart() {
    try {
        const storedCart = localStorage.getItem(CHECKOUT_CART_STORAGE_KEY);

        if (!storedCart) {
            return [];
        }

        const parsedCart = JSON.parse(storedCart);

        return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
        console.error("Unable to read checkout cart:", error);

        return [];
    }
}

let checkoutCart = loadCheckoutCart();


/* =========================================================
   CHECKOUT CART HELPERS
   ========================================================= */

function saveCheckoutCart() {

    localStorage.setItem(
        CHECKOUT_CART_STORAGE_KEY,
        JSON.stringify(
            checkoutCart
        )
    );

}


function getCheckoutSubtotal() {

    return checkoutCart.reduce(
        (total, item) =>
            total + item.price_cents,
        0
    );

}


function isFreeCheckout() {

    return (
        checkoutCart.length > 0 &&
        getCheckoutSubtotal() === 0
    );

}


function removeCheckoutItem(
    productId
) {

    /*
     * Once Stripe has been initialised,
     * the order must not be changed because
     * the Stripe Session already contains
     * the selected products and total.
     */

    if (
        checkoutSessionCreated
    ) {

        return;

    }


    checkoutCart =
        checkoutCart.filter(
            (item) =>
                item.id !== productId
        );


    saveCheckoutCart();

    renderCheckoutOrder();

}


function setCheckoutItemsLocked(
    locked
) {

    document
        .querySelectorAll(
            ".checkout-remove-button"
        )
        .forEach(
            (button) => {

                button.disabled =
                    locked;

            }
        );

}

/* ================= PRICE ================= */

function formatCheckoutPrice(priceCents, currency) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
    }).format(priceCents / 100);
}

/* ================= PRODUCT IMAGE ================= */

function getCheckoutProductImageFolder(item) {

    const folderOverrides = {
        "oh-worshippers-of-christ":
            "haiyyah-ibn-al-qayyim"
    };


    return (
        folderOverrides[item.slug] ||
        item.slug
    );

}


function getCheckoutProductCoverPath(item) {

    const folder =
        getCheckoutProductImageFolder(
            item
        );


    if (!folder) {
        return "";
    }


    return (
        `/Images/E-books/` +
        `${folder}/pdf/preview-1.webp`
    );

}


/* =========================================================
   CHECKOUT EXPERIENCE
   ========================================================= */

function updateCheckoutExperience() {

    const freeOrder =
        isFreeCheckout();


    /* =================================================
       FREE ORDER
       ================================================= */

    if (
        freeOrder
    ) {

        checkoutPaymentHeading.textContent =
            "No payment required";


        checkoutPaymentDescription.textContent =
            "Your order is completely free, so no payment details are required.";


        paymentPlaceholderIcon.className =
            "fa-solid fa-gift";


        paymentPlaceholderTitle.textContent =
            "Free order";


        paymentPlaceholderText.textContent =
            "Enter your email address above, then complete your order to receive your download access.";


        paymentPlaceholder.hidden =
            false;


        paymentElementContainer.hidden =
            true;


        if (
            !checkoutSessionCreated
        ) {

            continuePaymentButton.innerHTML = `
                Complete Free Order

                <i
                    class="fa-solid fa-arrow-right"
                    aria-hidden="true"
                ></i>
            `;

        }


        return;

    }


    /* =================================================
       PAID ORDER
       ================================================= */

    checkoutPaymentHeading.textContent =
        "Payment";


    checkoutPaymentDescription.textContent =
        "Payment information will be securely processed by Stripe.";


    paymentPlaceholderIcon.className =
        "fa-solid fa-lock";


    paymentPlaceholderTitle.textContent =
        "Secure payment";


    paymentPlaceholderText.textContent =
        "Continue below to load the secure Stripe payment form.";


    if (
        !checkoutSessionCreated
    ) {

        paymentPlaceholder.hidden =
            false;


        paymentElementContainer.hidden =
            true;


        continuePaymentButton.innerHTML = `
            Continue to Payment

            <i
                class="fa-solid fa-arrow-right"
                aria-hidden="true"
            ></i>
        `;

    }

}

/* ================= RENDER ORDER ================= */

function renderCheckoutOrder() {

    checkoutItems.innerHTML =
        "";


    /* =================================================
       EMPTY CART
       ================================================= */

    if (
        checkoutCart.length === 0
    ) {

        checkoutEmpty.hidden =
            false;


        checkoutTotals.hidden =
            true;


        continuePaymentButton.disabled =
            true;


        return;

    }


    checkoutEmpty.hidden =
        true;


    checkoutTotals.hidden =
        false;


    /* =================================================
       ITEMS
       ================================================= */

    checkoutCart.forEach(
        (item) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "checkout-item";


            /* ================= COVER ================= */

            const cover =
                document.createElement(
                    "div"
                );


            cover.className =
                "checkout-item-cover";


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                getCheckoutProductCoverPath(
                    item
                );


            image.alt =
                `Cover of ${item.title}`;


            cover.appendChild(
                image
            );


            /* ================= INFO ================= */

            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "checkout-item-info";


            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                item.title;


            info.appendChild(
                title
            );


            /* ================= PRICE ================= */

            const price =
                document.createElement(
                    "div"
                );


            price.className =
                "checkout-item-price";


            price.textContent =
                item.price_cents === 0

                    ? "Free"

                    : `${formatCheckoutPrice(
                        item.price_cents,
                        item.currency
                    )} ${item.currency.toUpperCase()}`;


            /* ================= REMOVE ================= */

            const removeButton =
                document.createElement(
                    "button"
                );


            removeButton.type =
                "button";


            removeButton.className =
                "checkout-remove-button";


            removeButton.setAttribute(
                "aria-label",
                `Remove ${item.title} from order`
            );


            removeButton.title =
                "Remove";


            removeButton.innerHTML = `
                <i
                    class="fa-solid fa-trash-can"
                    aria-hidden="true"
                ></i>
            `;


            removeButton.addEventListener(
                "click",
                () => {

                    removeCheckoutItem(
                        item.id
                    );

                }
            );


            /* ================= ROW ================= */

            row.appendChild(
                cover
            );


            row.appendChild(
                info
            );


            row.appendChild(
                price
            );


            row.appendChild(
                removeButton
            );


            checkoutItems.appendChild(
                row
            );

        }
    );


    /* =================================================
       TOTAL
       ================================================= */

    const subtotal =
        getCheckoutSubtotal();


    const currency =
        checkoutCart[0]
            ?.currency ||
        "usd";


    const formattedTotal =
        subtotal === 0

            ? "Free"

            : `${formatCheckoutPrice(
                subtotal,
                currency
            )} ${currency.toUpperCase()}`;


    checkoutSubtotal.textContent =
        formattedTotal;


    checkoutTotal.textContent =
        formattedTotal;


    /* =================================================
       FREE / PAID EXPERIENCE
       ================================================= */

    updateCheckoutExperience();


    validateCheckout();

}

/* ================= EMAIL ================= */

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateCheckout() {
    if (checkoutCart.length === 0) {
        continuePaymentButton.disabled = true;

        return false;
    }

    const email = checkoutEmail.value.trim();

    const valid = isValidEmail(email);

    if (!checkoutSessionCreated) {
        continuePaymentButton.disabled = !valid;
    }

    if (email.length === 0) {
        emailError.hidden = true;
    }

    return valid;
}

checkoutEmail.addEventListener("input", () => {
    emailError.hidden = true;

    checkoutDevelopmentMessage.hidden = true;

    validateCheckout();
});

checkoutEmail.addEventListener("blur", () => {
    const email = checkoutEmail.value.trim();

    if (email && !isValidEmail(email)) {
        emailError.hidden = false;
    }
});

/* ================= SUPABASE ACCOUNT ================= */

async function loadCheckoutUser() {
    if (!window.supabaseClient) {
        return;
    }

    const { data, error } = await window.supabaseClient.auth.getSession();

    if (error) {
        console.error("Unable to read Supabase session:", error);

        return;
    }

    const user = data?.session?.user;

    /* ================= GUEST ================= */

    if (!user) {
        checkoutEmailSection.hidden = false;

        accountStatus.hidden = true;

        return;
    }

    /* ================= LOGGED IN ================= */

    if (user.email) {
        /*
         * Keep the account email in the input
         * internally because the existing checkout
         * code reads checkoutEmail.value.
         */

        checkoutEmail.value = user.email;

        /*
         * Logged-in customers don't need to
         * enter another email address.
         */

        checkoutEmailSection.hidden = false;



        checkoutEmailSection.style.display = "none";

        emailError.hidden = true;
    }

    accountStatus.innerHTML = `
        <i
            class="fa-solid fa-circle-check"
            aria-hidden="true"
        ></i>

        Signed in as
        <strong></strong>
    `;

    const strong = accountStatus.querySelector("strong");

    if (strong) {
        strong.textContent = user.email || "your account";
    }

    accountStatus.hidden = false;

    validateCheckout();
}
/* ================= CREATE CHECKOUT SESSION ================= */

/* =========================================================
   STRIPE CHECKOUT
   ========================================================= */

async function createStripeCheckout() {
    const email = checkoutEmail.value.trim();

    /* ================= VALIDATION ================= */

    if (!isValidEmail(email)) {
        emailError.hidden = false;

        checkoutEmail.focus();

        return;
    }

    if (checkoutCart.length === 0) {
        return;
    }

    /* ================= PRODUCT IDS ================= */

    const productIds = checkoutCart.map((item) => item.id);

    /* ================= UI ================= */

    continuePaymentButton.disabled = true;

    const freeOrder =
        isFreeCheckout();


    continuePaymentButton.innerHTML = `
    <i
        class="fa-solid fa-circle-notch fa-spin"
        aria-hidden="true"
    ></i>

    ${freeOrder
            ? "Completing free order..."
            : "Loading secure payment..."
        }
    `;

    paymentError.hidden = true;

    try {
        /* ================= SERVER ================= */

        const { data, error } = await window.supabaseClient.functions.invoke(
            "create-ebook-checkout",
            {
                body: {
                    email,
                    productIds,
                },
            },
        );



        if (data?.status === "already_purchased") {
            paymentError.textContent =
                data.message || "You've already purchased this e-book.";

            paymentError.hidden = false;

            updateCheckoutExperience();

            continuePaymentButton.disabled = false;

            return;
        }

        if (error) {
            console.error("Checkout function error:", error);

            throw error;
        }

        /* ================= FREE ORDER ================= */

        if (
            data?.status ===
            "free_completed"
        ) {

            window.location.href =
                `/checkout-complete.html?free_order_id=${encodeURIComponent(
                    data.orderId
                )}`;

            return;

        }


        if (!data?.clientSecret) {
            throw new Error("Stripe client secret was not returned.");
        }

        /* ================= APPEARANCE ================= */

        const appearance = {
            theme: "stripe",

            inputs: "spaced",

            labels: "above",

            variables: {
                colorPrimary: "#0d3b26",

                colorBackground: "#ffffff",

                colorText: "#2b2b2b",

                colorDanger: "#b52121",

                fontFamily: "Calibri, Arial, sans-serif",

                fontSizeBase: "16px",

                borderRadius: "9px",

                spacingUnit: "4px",
            },
        };

        /* ================= INITIALISE CHECKOUT ================= */

        stripeCheckout = stripe.initCheckout({
            clientSecret: data.clientSecret,

            elementsOptions: {
                appearance,
            },
        });

        /*
         * Current Stripe API:
         * loadActions() gives us confirm(),
         * getSession(), etc.
         */

        const loadResult = await stripeCheckout.loadActions();

        if (loadResult.type !== "success") {
            console.error("Stripe loadActions failed:", loadResult);

            throw new Error("Unable to initialise Stripe Checkout.");
        }

        stripeActions = loadResult.actions;

        /* ================= PAYMENT ELEMENT ================= */

        stripePaymentElement = stripeCheckout.createPaymentElement();

        stripePaymentElement.mount("#payment-element");

        /* ================= SHOW ELEMENT ================= */

        paymentPlaceholder.hidden = true;

        paymentElementContainer.hidden = false;

        /*
         * The email was used to create this Stripe
         * Session, so don't let it silently change
         * after the session exists.
         */

        checkoutEmail.readOnly = true;

        checkoutSessionCreated = true;

        setCheckoutItemsLocked(
            true
        );

        /* ================= PAY BUTTON ================= */

        const total = checkoutCart.reduce((sum, item) => sum + item.price_cents, 0);

        const currency = checkoutCart[0]?.currency || "usd";

        continuePaymentButton.innerHTML = `
            <i
                class="fa-solid fa-lock"
                aria-hidden="true"
            ></i>

            Pay ${formatCheckoutPrice(
            total,
            currency,
        )} ${currency.toUpperCase()}
        `;

        /*
         * Stripe tells us when the mounted
         * checkout has enough information
         * to be confirmed.
         */

        stripeCheckout.on("change", (session) => {
            continuePaymentButton.disabled = !session.canConfirm;
        });
    } catch (error) {
        console.error("Unable to initialise Stripe:", error);

        paymentError.textContent =
            "We couldn't load the secure payment form. Please try again.";

        paymentError.hidden = false;

        updateCheckoutExperience();

        continuePaymentButton.disabled = false;
    }
}

/* =========================================================
   CONFIRM PAYMENT
   ========================================================= */

async function confirmStripePayment() {
    if (!stripeActions) {
        return;
    }

    paymentError.hidden = true;

    continuePaymentButton.disabled = true;

    const previousHTML = continuePaymentButton.innerHTML;

    continuePaymentButton.innerHTML = `
        <i
            class="fa-solid fa-circle-notch fa-spin"
            aria-hidden="true"
        ></i>

        Processing payment...
    `;

    try {
        const result = await stripeActions.confirm();

        /*
         * Redirect-based payment methods may
         * navigate away instead of reaching here.
         */

        if (result.type === "error") {
            paymentError.textContent =
                result.error?.message || "Your payment could not be completed.";

            paymentError.hidden = false;

            continuePaymentButton.innerHTML = previousHTML;

            continuePaymentButton.disabled = false;
        }
    } catch (error) {
        console.error("Stripe confirmation failed:", error);

        paymentError.textContent =
            "Something went wrong while processing your payment. Please try again.";

        paymentError.hidden = false;

        continuePaymentButton.innerHTML = previousHTML;

        continuePaymentButton.disabled = false;
    }
}

/* =========================================================
   MAIN CHECKOUT BUTTON
   ========================================================= */

continuePaymentButton.addEventListener("click", async () => {
    if (!checkoutSessionCreated) {
        await createStripeCheckout();

        return;
    }

    await confirmStripePayment();
});

/* ================= INITIALISE ================= */

renderCheckoutOrder();

loadCheckoutUser();
