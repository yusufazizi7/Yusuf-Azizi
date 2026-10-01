
/* ==================================================
   ISLAMIC QALAM — E-BOOK ACCESS
   Free account + Premium subscription
   ================================================== */

(() => {
    const client = window.supabaseClient;

    if (!client) {
        console.error("Supabase client is missing.");
        return;
    }

    let currentUser = null;
    let hasPremium = false;
    let membershipChecked = false;

    const products = new Map();

    /* ================= HELPERS ================= */

    function loginUrl(tier) {
        const destination = tier === "premium"
            ? "/premium.html"
            : window.location.pathname + window.location.search;

        return "/login.html?redirect=" +
            encodeURIComponent(destination);
    }

    async function invokeAccess(body) {
        const { data, error } =
            await client.functions.invoke(
                "get-ebook-access",
                { body }
            );

        if (error) {
            let message = error.message;

            try {
                const details =
                    await error.context?.clone().json();

                message = details?.error || message;
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

    async function checkMembership() {
        membershipChecked = false;

        if (!currentUser) {
            hasPremium = false;
            membershipChecked = true;
            return;
        }

        try {
            const status = await invokeAccess({
                action: "status"
            });

            hasPremium = status.hasPremium === true;
            membershipChecked = true;
        } catch (error) {
            console.error(
                "Unable to check membership:",
                error
            );

            hasPremium = false;
        }
    }

    function getButtonLabel(product) {
        if (product.access_tier === "free") {
            return currentUser
                ? "Download"
                : "Sign in to download";
        }

        if (!currentUser) {
            return "Sign in for Premium";
        }

        if (!membershipChecked) {
            return "Check membership";
        }

        return hasPremium
            ? "Download"
            : "Premium";
    }

    function createBadge(product) {
        const badge = document.createElement("span");

        badge.className =
            "ebook-access-badge " +
            (product.access_tier === "premium"
                ? "is-premium"
                : "is-free");

        badge.textContent =
            product.access_tier === "premium"
                ? "Premium"
                : "Free";

        return badge;
    }

    /* ================= DOWNLOAD DIALOG ================= */

    const dialog = document.createElement("div");
    dialog.className = "ebook-access-dialog";
    dialog.hidden = true;

    const dialogPanel = document.createElement("div");
    dialogPanel.className = "ebook-access-dialog-panel";
    dialogPanel.setAttribute("role", "dialog");
    dialogPanel.setAttribute("aria-modal", "true");
    dialogPanel.setAttribute(
        "aria-labelledby",
        "ebookAccessDialogTitle"
    );

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "ebook-access-dialog-close";
    closeButton.setAttribute(
        "aria-label",
        "Close download window"
    );
    closeButton.textContent = "×";

    const dialogTitle = document.createElement("h2");
    dialogTitle.id = "ebookAccessDialogTitle";

    const dialogDescription = document.createElement("p");
    dialogDescription.textContent =
        "Choose the format you would like to download.";

    const dialogFiles = document.createElement("div");
    dialogFiles.className = "ebook-access-file-list";

    const dialogMessage = document.createElement("p");
    dialogMessage.className = "ebook-access-message";
    dialogMessage.setAttribute("role", "status");

    dialogPanel.append(
        closeButton,
        dialogTitle,
        dialogDescription,
        dialogFiles,
        dialogMessage
    );

    dialog.append(dialogPanel);
    document.body.append(dialog);

    let previousFocus = null;

    function closeDialog() {
        dialog.hidden = true;
        dialogFiles.replaceChildren();
        dialogMessage.textContent = "";

        document.body.style.overflow = "";
        previousFocus?.focus();
    }

    closeButton.addEventListener("click", closeDialog);

    dialog.addEventListener("click", event => {
        if (event.target === dialog) {
            closeDialog();
        }
    });

    document.addEventListener("keydown", event => {
        if (!dialog.hidden && event.key === "Escape") {
            closeDialog();
        }
    });

    async function showDownloadDialog(product) {
        previousFocus = document.activeElement;

        dialogTitle.textContent = product.title;
        dialogFiles.textContent = "Loading available formats...";
        dialogMessage.textContent = "";

        dialog.hidden = false;
        document.body.style.overflow = "hidden";
        closeButton.focus();

        try {
            const result = await invokeAccess({
                action: "list",
                productId: product.id
            });

            dialogFiles.replaceChildren();

            for (const file of result.files || []) {
                const button =
                    document.createElement("button");

                button.type = "button";
                button.className =
                    "ebook-access-file-button";

                button.textContent = file.label;

                button.addEventListener(
                    "click",
                    async () => {
                        button.disabled = true;
                        button.textContent =
                            "Preparing download...";

                        dialogMessage.textContent = "";

                        try {
                            const download =
                                await invokeAccess({
                                    action: "download",
                                    productId: product.id,
                                    fileId: file.id
                                });

                            if (!download?.signedUrl) {
                                throw new Error(
                                    "No download URL returned."
                                );
                            }

                            // The signed link expires in 60 seconds.
                            window.location.assign(
                                download.signedUrl
                            );

                            button.textContent =
                                file.label;
                        } catch (error) {
                            console.error(error);

                            dialogMessage.textContent =
                                error.message ||
                                "Unable to download this file.";

                            button.textContent =
                                file.label;
                        } finally {
                            button.disabled = false;
                        }
                    }
                );

                dialogFiles.append(button);
            }

            if (!result.files?.length) {
                dialogFiles.textContent =
                    "No downloadable formats are available.";
            }

        } catch (error) {
            console.error(error);

            dialogFiles.replaceChildren();
            dialogMessage.textContent =
                error.message ||
                "Unable to load the available files.";
        }
    }

    /* ================= ACCESS ACTION ================= */

    async function handleAccess(product) {
        if (!currentUser) {
            window.location.assign(
                loginUrl(product.access_tier)
            );

            return;
        }

        if (product.access_tier === "free") {
            await showDownloadDialog(product);
            return;
        }

        if (!membershipChecked) {
            await checkMembership();

            if (!membershipChecked) {
                window.alert(
                    "Unable to check your membership. " +
                    "Please try again."
                );

                return;
            }
        }

        if (!hasPremium) {
            window.location.assign("/premium.html");

            return;
        }

        await showDownloadDialog(product);
    }


    /* ================= ACCESS BUTTON ================= */

    function setAccessButton(button, product) {
        if (!button) return;

        const canDownload = Boolean(
            currentUser &&
            (
                product.access_tier === "free" ||
                (membershipChecked && hasPremium)
            )
        );

        const icon = document.createElement("i");
        icon.setAttribute("aria-hidden", "true");

        if (canDownload) {
            icon.className = "fa-solid fa-download";
        } else if (product.access_tier === "premium") {
            icon.className = "fa-solid fa-crown";
        } else {
            icon.className = "fa-solid fa-right-to-bracket";
        }

        const label = document.createElement("span");
        label.textContent = getButtonLabel(product);

        button.replaceChildren(icon, label);
        button.disabled = false;

        button.onclick = () => handleAccess(product);
    }


    /* ================= LIBRARY CARDS ================= */

    function updateLibraryCards() {
        document.querySelectorAll(
            ".ebook-card[data-product-slug]"
        ).forEach(card => {
            const product = products.get(
                card.dataset.productSlug
            );

            const button = card.querySelector(
                ".ebook-access-button"
            );

            if (
                !product ||
                !["free", "premium"].includes(product.access_tier)
            ) {
                if (button) {
                    button.disabled = true;
                    button.textContent = "Unavailable";
                }

                return;
            }

            // Display the Free or Premium badge
            // immediately after the existing category.

            const badge = createBadge(product);

            const existingBadge = card.querySelector(
                ".ebook-access-badge"
            );

            if (existingBadge) {
                existingBadge.replaceWith(badge);
            } else {
                card.querySelector(
                    ".ebook-category"
                )?.after(badge);
            }

            setAccessButton(button, product);
        });
    }


    /* ================= DETAIL PAGE ================= */

    function updateDetailPage() {
        const page = document.querySelector(
            ".product-page[data-product-slug]"
        );

        if (!page) return;

        const product = products.get(
            page.dataset.productSlug
        );

        const tierValue = page.querySelector(
            ".ebook-tier-value"
        );

        const button = page.querySelector(
            ".ebook-access-button"
        );

        if (
            !product ||
            !["free", "premium"].includes(product.access_tier)
        ) {
            if (tierValue) {
                tierValue.textContent = "Unavailable";
            }

            if (button) {
                button.disabled = true;
                button.textContent = "Unavailable";
            }

            return;
        }

        // Replace the placeholder in the fourth
        // information box with the coloured badge.

        if (tierValue) {
            tierValue.replaceChildren(
                createBadge(product)
            );
        }

        // Configure the existing HTML button.
        // Do not generate or replace its container.

        setAccessButton(button, product);
    }


    /* ================= INITIALISE ================= */

    async function initialise() {
        // Authentication.
        try {
            const { data } = await client.auth.getUser();
            currentUser = data?.user ?? null;
        } catch {
            currentUser = null;
        }

        // Membership.
        await checkMembership();

        // Public product metadata.
        const { data: books, error } =
            await client
                .from("ebook_products")
                .select(
                    "id, slug, title, access_tier, active"
                )
                .eq("active", true);

        if (error) {
            console.error(
                "Unable to load e-book catalogue:",
                error
            );

            return;
        }

        for (const book of books || []) {
            products.set(book.slug, book);
        }

        updateLibraryCards();
        updateDetailPage();
    }

    initialise();
})();
