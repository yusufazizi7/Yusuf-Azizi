/* =========================================================
   CHECKOUT COMPLETE
   ========================================================= */

const COMPLETE_CART_STORAGE_KEY = "islamicqalam_ebook_cart";
const COMPLETE_ORDER_STORAGE_PREFIX = "islamicqalam_completed_order_";

/* ================= ELEMENTS ================= */

const completeLoading = document.getElementById("completeLoading");

const completeSuccess = document.getElementById("completeSuccess");

const completeProcessing = document.getElementById("completeProcessing");

const completeError = document.getElementById("completeError");

const completeItems = document.getElementById("completeItems");

const completeTotal = document.getElementById("completeTotal");

const completeOrderNumber = document.getElementById("completeOrderNumber");

const completeErrorText = document.getElementById("completeErrorText");

const checkAgainButton = document.getElementById("checkAgainButton");

/* ================= SESSION ================= */

const urlParameters =
    new URLSearchParams(
        window.location.search
    );



const checkoutSessionId =
    urlParameters.get(
        "session_id"
    );

const freeOrderId =
    urlParameters.get(
        "free_order_id"
    );

/* =========================================================
   COMPLETED ORDER CACHE
   ========================================================= */

function getCompletedOrderStorageKey() {

    if (
        typeof freeOrderId === "string" &&
        freeOrderId.length > 0
    ) {

        return (
            COMPLETE_ORDER_STORAGE_PREFIX +
            "free_" +
            freeOrderId
        );

    }


    if (
        typeof checkoutSessionId === "string" &&
        checkoutSessionId.length > 0
    ) {

        return (
            COMPLETE_ORDER_STORAGE_PREFIX +
            "stripe_" +
            checkoutSessionId
        );

    }


    return null;

}


function saveCompletedOrder(
    order
) {

    const storageKey =
        getCompletedOrderStorageKey();


    if (
        !storageKey
    ) {

        return;

    }


    try {

        sessionStorage.setItem(
            storageKey,
            JSON.stringify(
                order
            )
        );

    } catch (
    error
    ) {

        console.error(
            "Unable to cache completed order:",
            error
        );

    }

}


function getSavedCompletedOrder() {

    const storageKey =
        getCompletedOrderStorageKey();


    if (
        !storageKey
    ) {

        return null;

    }


    try {

        const storedOrder =
            sessionStorage.getItem(
                storageKey
            );


        if (
            !storedOrder
        ) {

            return null;

        }


        const order =
            JSON.parse(
                storedOrder
            );


        if (
            order?.status !== "paid" ||
            !Array.isArray(
                order?.items
            )
        ) {

            return null;

        }


        return order;


    } catch (
    error
    ) {

        console.error(
            "Unable to read cached completed order:",
            error
        );


        return null;

    }

}


function completedOrderTokensAreExpired(
    order
) {

    if (
        !Array.isArray(
            order?.items
        ) ||
        order.items.length === 0
    ) {

        return true;

    }


    return order.items.some(
        (
            item
        ) => {

            if (
                !item?.expiresAt
            ) {

                return true;

            }


            const expiresAt =
                new Date(
                    item.expiresAt
                );


            return (
                Number.isNaN(
                    expiresAt.getTime()
                ) ||
                expiresAt.getTime() <=
                Date.now()
            );

        }
    );

}

/* ================= STATE ================= */

function showCompleteState(state) {
    completeLoading.hidden = state !== "loading";

    completeSuccess.hidden = state !== "success";

    completeProcessing.hidden = state !== "processing";

    completeError.hidden = state !== "error";
}

/* ================= PRICE ================= */

function formatCompletePrice(priceCents, currency) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
    }).format(priceCents / 100);
}

/* =========================================================
   REMOVE ONLY PURCHASED PRODUCTS FROM CART
   ========================================================= */

function removePurchasedItemsFromCart(productIds) {
    try {
        const storedCart = localStorage.getItem(COMPLETE_CART_STORAGE_KEY);

        if (!storedCart) {
            return;
        }

        const cart = JSON.parse(storedCart);

        if (!Array.isArray(cart)) {
            return;
        }

        const purchasedIds = new Set(productIds);

        const remainingCart = cart.filter((item) => !purchasedIds.has(item.id));

        localStorage.setItem(
            COMPLETE_CART_STORAGE_KEY,
            JSON.stringify(remainingCart),
        );
    } catch (error) {
        console.error("Unable to update cart:", error);
    }
}

/* =========================================================
   RENDER SUCCESS
   ========================================================= */

function renderSuccessfulOrder(order) {
    completeItems.innerHTML = "";

    order.items.forEach((item) => {
        const row = document.createElement("div");

        row.className = "complete-item";

        /* INFO */

        const info = document.createElement("div");

        info.className = "complete-item-info";

        const title = document.createElement("div");

        title.className = "complete-item-title";

        title.textContent = item.title;

        const price = document.createElement("div");

        price.className = "complete-item-price";

        price.textContent = `${formatCompletePrice(
            item.priceCents,
            order.currency,
        )} ${order.currency.toUpperCase()}`;

        info.appendChild(title);

        info.appendChild(price);

        /* DOWNLOAD */

        const download = document.createElement("a");

        download.className = "complete-download-button";
        download.target =
            "_blank";

        download.rel =
            "noopener";

        /*
         * This becomes the permanent
         * customer-facing download URL.
         *
         * We build download.html next.
         */
        download.href = `download.html#token=${encodeURIComponent(
            item.downloadToken,
        )}`;

        download.innerHTML = `
                <i
                    class="fa-solid fa-download"
                    aria-hidden="true"
                ></i>

                Download
            `;

        row.appendChild(info);

        row.appendChild(download);

        completeItems.appendChild(row);
    });

    completeTotal.textContent = `${formatCompletePrice(
        order.totalCents,
        order.currency,
    )} ${order.currency.toUpperCase()}`;

    /*
     * Don't expose the entire UUID visually.
     */

    completeOrderNumber.textContent = `Order ${order.orderId.slice(0, 8).toUpperCase()}`;

    removePurchasedItemsFromCart(order.items.map((item) => item.productId));

    showCompleteState("success");
}

/* =========================================================
   VERIFY
   ========================================================= */

async function verifyCompletedCheckout() {


    const savedOrder =
        getSavedCompletedOrder();


    if (
        savedOrder
    ) {

        if (
            completedOrderTokensAreExpired(
                savedOrder
            )
        ) {

            completeErrorText.textContent =
                "Your checkout download link has expired. "
                + "Please use your account or the Retrieve Purchase page "
                + "to generate a new download link.";


            showCompleteState(
                "error"
            );


            return;

        }


        renderSuccessfulOrder(
            savedOrder
        );


        return;

    }

    const hasStripeSession =
        checkoutSessionId &&
        checkoutSessionId.startsWith(
            "cs_"
        );


    const hasFreeOrder =
        typeof freeOrderId ===
        "string" &&
        freeOrderId.length > 0;


    if (
        !hasStripeSession &&
        !hasFreeOrder
    ) {

        completeErrorText.textContent =
            "This checkout link is invalid.";

        showCompleteState(
            "error"
        );

        return;

    }

    showCompleteState("loading");

    try {
        const { data, error } = await window.supabaseClient.functions.invoke(
            "get-ebook-order-success",
            {
                body:
                    hasFreeOrder
                        ? {
                            freeOrderId
                        }
                        : {
                            sessionId:
                                checkoutSessionId
                        }
            }
        );
        if (error) {
            console.error(error);

            throw error;
        }

        if (data?.status === "processing") {
            showCompleteState("processing");

            return;
        }

        if (data?.status !== "paid" || !Array.isArray(data?.items)) {
            throw new Error("Invalid order response.");
        }

        const checkoutTokenAlreadyIssued =
            data.items.some(
                (item) =>
                    item.checkoutTokenAlreadyIssued ||
                    !item.downloadToken
            );


        if (
            checkoutTokenAlreadyIssued
        ) {

            completeErrorText.textContent =
                "The checkout download link for this purchase "
                + "has already been issued. "
                + "Please use your account or the Retrieve Purchase "
                + "page to generate a new download link.";


            showCompleteState(
                "error"
            );


            return;

        }

        saveCompletedOrder(
            data
        );

        renderSuccessfulOrder(
            data
        );

    } catch (error) {
        console.error("Order verification failed:", error);

        completeErrorText.textContent =
            "We couldn't verify your purchase. Please check your payment status or try again.";

        showCompleteState("error");
    }
}

/* ================= CHECK AGAIN ================= */

checkAgainButton?.addEventListener("click", verifyCompletedCheckout);

/* ================= INITIALISE ================= */

verifyCompletedCheckout();
