/* ================= E-BOOK STORE ================= */


const ebookSupabase = window.supabaseClient;

/* ================= PRICE FORMATTING ================= */

/**
 * Convert an integer number of cents into a formatted
 * currency amount.
 *
 * Example:
 * 799 + USD -> $7.99
 */
function formatProductPrice(priceCents, currency) {
    const currencyCode = currency.toUpperCase();

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode
    }).format(priceCents / 100);
}

/* ================= PRODUCT IMAGE ================= */

/* ================= PRODUCT IMAGE ================= */

function getProductImageFolder(product) {

    /*
     * Most image folders use the same name
     * as the product slug.
     *
     * Exceptions can be mapped here.
     */

    const folderOverrides = {
        "oh-worshippers-of-christ":
            "haiyyah-ibn-al-qayyim"
    };


    return (
        folderOverrides[product.slug] ||
        product.slug
    );

}


function getProductCoverPath(product) {

    const folder =
        getProductImageFolder(
            product
        );


    return (
        `/images/e-books-2/` +
        `${folder}/pdf/preview-1.webp`
    );

}


/* ================= LOAD PRODUCTS ================= */

/**
 * Load active e-book products from Supabase and match
 * them to the cards using data-product-slug.
 */
async function loadEbookProducts() {
    const productCards = document.querySelectorAll(
        ".ebook-card[data-product-slug]"
    );

    if (!productCards.length) {
        return;
    }

    const { data: products, error } = await ebookSupabase
        .from("ebook_products")
        .select(`
            id,
            slug,
            title,
            price_cents,
            currency,
            active
        `)
        .eq("active", true);

    if (error) {
        console.error(
            "Unable to load e-book products:",
            error
        );

        productCards.forEach((card) => {
            showUnavailableProduct(card);
        });

        return;
    }

    /*
     * Turn the returned array into a map:
     *
     * {
     *   "nooniyah-al-qahtani": {...},
     *   "taiyyah-al-ilbiri": {...}
     * }
     */
    const productsBySlug = new Map(
        products.map((product) => [
            product.slug,
            product
        ])
    );

    productCards.forEach((card) => {
        const slug = card.dataset.productSlug;
        const product = productsBySlug.get(slug);

        if (!product) {
            showUnavailableProduct(card);
            return;
        }

        updateProductCard(card, product);
    });
}


/* =========================================================
   LOAD E-BOOK DETAIL PRODUCT
   ========================================================= */

async function loadEbookDetailProduct() {

    const productPage =
        document.querySelector(
            ".product-page[data-product-slug]"
        );


    if (!productPage) {
        return;
    }


    const slug =
        productPage.dataset.productSlug;


    if (!slug) {
        return;
    }


    const priceElement =
        productPage.querySelector(
            ".ebook-product-price"
        );


    const addToCartButton =
        document.getElementById(
            "ebookAddToCartButton"
        );


    const checkoutLink =
        document.getElementById(
            "ebookCheckoutButton"
        );


    const {
        data: product,
        error
    } =
        await ebookSupabase
            .from(
                "ebook_products"
            )
            .select(`
                id,
                slug,
                title,
                price_cents,
                currency,
                active
            `)
            .eq(
                "slug",
                slug
            )
            .eq(
                "active",
                true
            )
            .maybeSingle();


    if (
        error ||
        !product
    ) {

        console.error(
            "Unable to load e-book product:",
            error
        );


        if (priceElement) {
            priceElement.textContent =
                "Unavailable";
        }


        if (addToCartButton) {
            addToCartButton.disabled =
                true;
        }


        return;

    }


    /* ================= PRICE ================= */

    if (priceElement) {

        priceElement.textContent =
            product.price_cents === 0
                ? "Free"
                : `${formatProductPrice(
                    product.price_cents,
                    product.currency
                )} ${product.currency.toUpperCase()}`;

    }


    /* ================= ALREADY IN CART ================= */

    const alreadyInCart =
        ebookCart.some(
            (item) =>
                item.id ===
                product.id
        );


    if (
        alreadyInCart &&
        checkoutLink
    ) {

        checkoutLink.hidden =
            false;

    }


    /* ================= ADD TO CART ================= */

    if (addToCartButton) {

        addToCartButton.disabled =
            false;


        addToCartButton.addEventListener(
            "click",
            () => {

                addProductToCart(
                    product
                );


                if (checkoutLink) {

                    checkoutLink.hidden =
                        false;

                }

            }
        );

    }

}

/* ================= UPDATE PRODUCT CARD ================= */

/**
 * Put the database price into the corresponding HTML card.
 */
function updateProductCard(card, product) {

    const priceElement =
        card.querySelector(
            ".ebook-price-value"
        );

    const currencyElement =
        card.querySelector(
            ".ebook-currency"
        );

    const cartButton =
        card.querySelector(
            ".ebook-cart-button"
        );

    const coverImage =
        card.querySelector(
            ".ebook-cover img"
        );

    /* COVER IMAGE */

    if (coverImage) {

        coverImage.src =
            getProductCoverPath(
                product
            );

        coverImage.alt =
            `Cover of ${product.title}`;

    }

    /* PRICE */

    if (
        product.price_cents === 0
    ) {

        if (priceElement) {
            priceElement.textContent =
                "Free";
        }

        if (currencyElement) {
            currencyElement.textContent =
                "";
        }

    } else {

        if (priceElement) {
            priceElement.textContent =
                formatProductPrice(
                    product.price_cents,
                    product.currency
                );
        }

        if (currencyElement) {
            currencyElement.textContent =
                product.currency.toUpperCase();
        }

    }


    /* PRODUCT ID */

    card.dataset.productId =
        product.id;


    /* ADD TO CART */

    if (cartButton) {

        cartButton.disabled =
            false;

        cartButton.addEventListener(
            "click",
            () => {
                addProductToCart(
                    product
                );
            }
        );

    }
}


/* ================= UNAVAILABLE PRODUCTS ================= */

/**
 * Used if the product cannot be found or Supabase
 * fails to return it.
 */
function showUnavailableProduct(card) {
    const priceElement = card.querySelector(
        ".ebook-price-value"
    );

    const currencyElement = card.querySelector(
        ".ebook-currency"
    );

    const cartButton = card.querySelector(
        ".ebook-cart-button"
    );

    if (priceElement) {
        priceElement.textContent = "Unavailable";
    }

    if (currencyElement) {
        currencyElement.textContent = "";
    }

    if (cartButton) {
        cartButton.disabled = true;
    }
}


/* ================= SHOPPING CART ================= */

const CART_STORAGE_KEY = "islamicqalam_ebook_cart";

let ebookCart = loadCart();


/* ================= CART ELEMENTS ================= */

const navCartButton =
    document.getElementById("navCartButton");

const cartItemCount =
    document.getElementById("cartItemCount");

const shoppingCart =
    document.getElementById("shoppingCart");

const cartOverlay =
    document.getElementById("cartOverlay");

const closeCartButton =
    document.getElementById("closeCartButton");

const cartItems =
    document.getElementById("cartItems");

const emptyCartMessage =
    document.getElementById("emptyCartMessage");

const cartFooter =
    document.getElementById("cartFooter");

const cartSubtotal =
    document.getElementById("cartSubtotal");

const checkoutButton =
    document.getElementById("checkoutButton");


/* ================= LOCAL STORAGE ================= */

/**
 * Load the customer's cart from localStorage.
 */
function loadCart() {
    try {
        const storedCart =
            localStorage.getItem(CART_STORAGE_KEY);

        if (!storedCart) {
            return [];
        }

        const parsedCart =
            JSON.parse(storedCart);

        return Array.isArray(parsedCart)
            ? parsedCart
            : [];
    } catch (error) {
        console.error(
            "Unable to load cart:",
            error
        );

        return [];
    }
}


/**
 * Save the current cart.
 */
function saveCart() {
    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(ebookCart)
    );
}


/* ================= OPEN / CLOSE CART ================= */

function openCart() {
    if (!shoppingCart || !cartOverlay) {
        return;
    }

    shoppingCart.classList.add("active");
    cartOverlay.classList.add("active");

    shoppingCart.setAttribute(
        "aria-hidden",
        "false"
    );

    cartOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

    navCartButton?.setAttribute(
        "aria-expanded",
        "true"
    );

    document.body.style.overflow = "hidden";
}


function closeCart() {
    if (!shoppingCart || !cartOverlay) {
        return;
    }

    shoppingCart.classList.remove("active");
    cartOverlay.classList.remove("active");

    shoppingCart.setAttribute(
        "aria-hidden",
        "true"
    );

    cartOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

    navCartButton?.setAttribute(
        "aria-expanded",
        "false"
    );

    document.body.style.overflow = "";
}


/* ================= ADD PRODUCT ================= */

function addProductToCart(product) {

    const alreadyInCart = ebookCart.some(
        (item) => item.id === product.id
    );

    if (alreadyInCart) {
        openCart();
        return;
    }

    ebookCart.push({
        id: product.id,
        slug: product.slug,
        title: product.title,
        price_cents: product.price_cents,
        currency: product.currency
    });;

    saveCart();
    renderCart();
    openCart();
}


/* ================= REMOVE PRODUCT ================= */

function removeProductFromCart(productId) {

    ebookCart = ebookCart.filter(
        (item) => item.id !== productId
    );

    saveCart();
    renderCart();
}


/* ================= CART TOTAL ================= */

function calculateCartSubtotal() {
    return ebookCart.reduce(
        (total, item) =>
            total + item.price_cents,
        0
    );
}


/* ================= RENDER CART ================= */

function renderCart() {

    if (
        !cartItems ||
        !emptyCartMessage ||
        !cartFooter ||
        !cartSubtotal ||
        !cartItemCount
    ) {
        return;
    }

    cartItems.innerHTML = "";

    const itemCount = ebookCart.length;

    cartItemCount.textContent =
        String(itemCount);

    cartItemCount.setAttribute(
        "aria-label",
        `${itemCount} ${itemCount === 1
            ? "item"
            : "items"
        } in cart`
    );


    /* ================= EMPTY ================= */

    if (itemCount === 0) {

        emptyCartMessage.hidden = false;

        cartFooter.hidden = true;

        if (checkoutButton) {
            checkoutButton.disabled = true;
        }

        return;
    }


    /* ================= HAS ITEMS ================= */

    emptyCartMessage.hidden = true;

    cartFooter.hidden = false;

    if (checkoutButton) {
        checkoutButton.disabled = false;
    }


    ebookCart.forEach((item) => {

        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item";


        /* COVER */

        const coverContainer =
            document.createElement("div");

        coverContainer.className =
            "cart-item-cover";

        const coverImage =
            document.createElement("img");

        coverImage.src =
            getProductCoverPath(
                item
            );

        coverImage.alt =
            `Cover of ${item.title}`;

        coverContainer.appendChild(
            coverImage
        );


        /* DETAILS */

        const details =
            document.createElement("div");

        details.className =
            "cart-item-details";

        const title =
            document.createElement("h3");

        title.textContent =
            item.title;

        const price =
            document.createElement("div");

        price.className =
            "cart-item-price";

        price.textContent =
            item.price_cents === 0
                ? "Free"
                : `${formatProductPrice(
                    item.price_cents,
                    item.currency
                )} ${item.currency.toUpperCase()}`;

        details.appendChild(title);
        details.appendChild(price);


        /* REMOVE */

        const removeButton =
            document.createElement("button");

        removeButton.className =
            "cart-remove-button";

        removeButton.type =
            "button";

        removeButton.setAttribute(
            "aria-label",
            `Remove ${item.title} from cart`
        );

        removeButton.innerHTML =
            '<i class="fa-solid fa-trash-can" aria-hidden="true"></i>';

        removeButton.addEventListener(
            "click",
            () => {
                removeProductFromCart(
                    item.id
                );
            }
        );


        cartItem.appendChild(
            coverContainer
        );

        cartItem.appendChild(
            details
        );

        cartItem.appendChild(
            removeButton
        );

        cartItems.appendChild(
            cartItem
        );
    });


    /* ================= SUBTOTAL ================= */

    const subtotal =
        calculateCartSubtotal();

    const currency =
        ebookCart[0]?.currency || "usd";

    cartSubtotal.textContent =
        subtotal === 0
            ? "Free"
            : `${formatProductPrice(
                subtotal,
                currency
            )} ${currency.toUpperCase()}`;
}


/* ================= CART EVENTS ================= */

navCartButton?.addEventListener(
    "click",
    openCart
);

closeCartButton?.addEventListener(
    "click",
    closeCart
);

cartOverlay?.addEventListener(
    "click",
    closeCart
);

checkoutButton?.addEventListener(
    "click",
    () => {
        if (ebookCart.length === 0) {
            return;
        }

        window.location.href =
            "/checkout.html";
    }
);


/* ESC closes cart */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            shoppingCart?.classList.contains(
                "active"
            )
        ) {
            closeCart();
        }

    }
);

/* ================= INITIALISE STORE ================= */

renderCart();

loadEbookProducts();

loadEbookDetailProduct();