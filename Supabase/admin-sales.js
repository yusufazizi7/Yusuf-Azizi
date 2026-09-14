/* =========================================================
   ISLAMIC QALAM ADMIN SALES
   ========================================================= */
const salesLoading =
    document.getElementById(
        "salesLoading"
    );

const salesContent =
    document.getElementById(
        "salesContent"
    );

const salesWeekRevenue =
    document.getElementById(
        "salesWeekRevenue"
    );

const salesWeekOrders =
    document.getElementById(
        "salesWeekOrders"
    );

const salesWeekItems =
    document.getElementById(
        "salesWeekItems"
    );

const salesAllTimeRevenue =
    document.getElementById(
        "salesAllTimeRevenue"
    );

const salesOrdersBody =
    document.getElementById(
        "salesOrdersBody"
    );

const salesSearch =
    document.getElementById(
        "salesSearch"
    );

const salesStatusFilter =
    document.getElementById(
        "salesStatusFilter"
    );

const salesTypeFilter =
    document.getElementById(
        "salesTypeFilter"
    );

const refreshSales =
    document.getElementById(
        "refreshSales"
    );


let adminSalesOrders =
    [];


/* =========================================================
   LOAD SALES
   ========================================================= */

async function loadAdminSales() {

    if (
        !salesOrdersBody
    ) {
        return;
    }


    setSalesRefreshState(
        true
    );

    salesLoading.hidden =
        false;

    salesContent.hidden =
        true;


    salesOrdersBody.innerHTML = `
        <tr>

            <td
                colspan="7"
                class="admin-table-empty"
            >
                Loading sales...
            </td>

        </tr>
    `;


    try {

        const {
            data,
            error
        } =
            await window.supabaseClient
                .rpc(
                    "admin_get_ebook_sales"
                );


        if (
            error
        ) {

            console.error(
                "Unable to load e-book sales:",
                error
            );


            throw error;

        }


        const summary =
            data?.summary ||
            {};


        adminSalesOrders =
            Array.isArray(
                data?.orders
            )
                ? data.orders
                : [];


        renderSalesSummary(
            summary
        );


        renderAdminSales();

        salesLoading.hidden =
            true;

        salesContent.hidden =
            false;

    } catch (
    error
    ) {

        console.error(
            "Sales dashboard failed:",
            error
        );

        salesLoading.hidden =
            true;

        salesContent.hidden =
            false;


        salesOrdersBody.innerHTML = `
            <tr>

                <td
                    colspan="7"
                    class="admin-table-empty"
                >
                    Unable to load sales information.
                </td>

            </tr>
        `;

    } finally {

        setSalesRefreshState(
            false
        );

    }

}


/* =========================================================
   SUMMARY
   ========================================================= */

function renderSalesSummary(
    summary
) {

    const currency =
        summary.currency ||
        "usd";


    salesWeekRevenue.textContent =
        formatAdminSalesMoney(
            summary.weekRevenueCents || 0,
            currency,
            false
        );


    salesWeekOrders.textContent =
        String(
            summary.weekOrders ||
            0
        );


    salesWeekItems.textContent =
        String(
            summary.weekItems ||
            0
        );


    salesAllTimeRevenue.textContent =
        formatAdminSalesMoney(
            summary.allTimeRevenueCents || 0,
            currency,
            false
        );

}


/* =========================================================
   RENDER ORDERS
   ========================================================= */

function renderAdminSales() {

    if (
        !salesOrdersBody
    ) {
        return;
    }


    const query =
        salesSearch
            ?.value
            .trim()
            .toLowerCase() ||
        "";


    const selectedStatus =
        salesStatusFilter
            ?.value ||
        "all";

    const selectedSaleType =
        salesTypeFilter
            ?.value ||
        "non-free";
        


    const orders =
        adminSalesOrders.filter(
            order => {

                const matchesStatus =
                    selectedStatus ===
                    "all" ||
                    order.status ===
                    selectedStatus;


                const itemText =
                    (
                        order.items ||
                        []
                    )
                        .map(
                            item =>
                                item.title
                        )
                        .join(
                            " "
                        )
                        .toLowerCase();

                const totalCents =
                    Number(
                        order.totalCents ||
                        0
                    );


                const matchesSaleType =
                    selectedSaleType ===
                    "all" ||

                    (
                        selectedSaleType ===
                        "non-free" &&
                        totalCents > 0
                    ) ||

                    (
                        selectedSaleType ===
                        "free" &&
                        totalCents === 0
                    );


                const matchesSearch =
                    !query ||

                    (
                        order.email ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            query
                        ) ||

                    (
                        order.id ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            query
                        ) ||

                    itemText.includes(
                        query
                    );


                return (
                    matchesStatus &&
                    matchesSaleType &&
                    matchesSearch
                );
            }
        );


    salesOrdersBody.innerHTML =
        "";


    if (
        orders.length ===
        0
    ) {

        salesOrdersBody.innerHTML = `
            <tr>

                <td
                    colspan="7"
                    class="admin-table-empty"
                >
                    No matching orders found.
                </td>

            </tr>
        `;


        return;

    }


    orders.forEach(
        order => {

            const row =
                document.createElement(
                    "tr"
                );


            /* ================= ORDER ================= */

            const orderCell =
                document.createElement(
                    "td"
                );


            const shortOrderId =
                (
                    order.id ||
                    ""
                )
                    .slice(
                        0,
                        8
                    )
                    .toUpperCase();


            orderCell.innerHTML = `
                <div class="admin-sales-order-id">

                    <strong>
                        #${escapeAdminSalesHtml(
                shortOrderId
            )}
                    </strong>

                    <span title="${escapeAdminSalesHtml(
                order.id ||
                ""
            )}">
                        ${escapeAdminSalesHtml(
                order.id ||
                ""
            )}
                    </span>

                </div>
            `;


            /* ================= CUSTOMER ================= */

            const customerCell =
                document.createElement(
                    "td"
                );


            customerCell.innerHTML = `
                <div class="admin-sales-customer">

                    <strong>
                        ${escapeAdminSalesHtml(
                order.email ||
                "No email"
            )}
                    </strong>

                    <span
                        class="admin-sales-customer-type ${order.customerType ===
                    "account"
                    ? "account"
                    : "guest"
                }"
                    >
                        ${order.customerType ===
                    "account"
                    ? "Account"
                    : "Guest"
                }
                    </span>

                </div>
            `;


            /* ================= ITEMS ================= */

            const itemsCell =
                document.createElement(
                    "td"
                );


            itemsCell.className =
                "admin-sales-items-cell";


            const items =
                Array.isArray(
                    order.items
                )
                    ? order.items
                    : [];


            if (
                items.length ===
                0
            ) {

                itemsCell.textContent =
                    "—";

            } else {

                items.forEach(
                    item => {

                        const itemRow =
                            document.createElement(
                                "div"
                            );


                        itemRow.className =
                            "admin-sales-item";


                        itemRow.innerHTML = `
                            <span>
                                ${escapeAdminSalesHtml(
                            item.title ||
                            "E-book"
                        )}
                            </span>

                            <small>
                                ${escapeAdminSalesHtml(
                            formatAdminSalesMoney(
                                item.priceCents ||
                                0,
                                order.currency
                            )
                        )}
                            </small>
                        `;


                        itemsCell.appendChild(
                            itemRow
                        );

                    }
                );

            }


            /* ================= TOTAL ================= */

            const totalCell =
                document.createElement(
                    "td"
                );


            totalCell.innerHTML = `
                <strong class="admin-sales-total">
                    ${escapeAdminSalesHtml(
                formatAdminSalesMoney(
                    order.totalCents ||
                    0,
                    order.currency
                )
            )}
                </strong>
            `;


            /* ================= PAYMENT ================= */

            const paymentCell =
                document.createElement(
                    "td"
                );


            const provider =
                order.paymentProvider ===
                    "free"
                    ? "Free"
                    : "Stripe";


            paymentCell.innerHTML = `
                <div class="admin-sales-payment">

                    <strong>
                        ${provider}
                    </strong>

                    ${order.paymentSessionReference
                    ? `
                                <span
                                    title="${escapeAdminSalesHtml(
                        order.paymentSessionReference
                    )}"
                                >
                                    ${escapeAdminSalesHtml(
                        order.paymentSessionReference
                            .slice(
                                0,
                                14
                            )
                    )}…
                                </span>
                            `
                    : ""
                }

                </div>
            `;


            /* ================= STATUS ================= */

            const statusCell =
                document.createElement(
                    "td"
                );


            statusCell.innerHTML = `
                <span
                    class="admin-order-status ${escapeAdminSalesHtml(
                order.status ||
                "unknown"
            )}"
                >
                    ${escapeAdminSalesHtml(
                order.status ||
                "unknown"
            )}
                </span>

                ${order.receiptEmailSent
                    ? `
                            <span class="admin-sales-receipt">
                                <i
                                    class="fa-regular fa-envelope"
                                    aria-hidden="true"
                                ></i>

                                Receipt sent
                            </span>
                        `
                    : ""
                }
            `;


            /* ================= DATE ================= */

            const dateCell =
                document.createElement(
                    "td"
                );


            dateCell.innerHTML = `
                <div class="admin-sales-date">

                    <strong>
                        ${escapeAdminSalesHtml(
                formatAdminSalesDate(
                    order.createdAt ||
                    order.paidAt
                )
            )}
                    </strong>

                    ${order.paidAt
                    ? `
                                <span>
                                    Paid:
                                    ${escapeAdminSalesHtml(
                        formatAdminSalesDate(
                            order.paidAt
                        )
                    )}
                                </span>
                            `
                    : ""
                }

                </div>
            `;


            row.append(
                orderCell,
                customerCell,
                itemsCell,
                totalCell,
                paymentCell,
                statusCell,
                dateCell
            );


            salesOrdersBody.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   FORMAT MONEY
   ========================================================= */

function formatAdminSalesMoney(
    cents,
    currency = "usd",
    zeroAsFree = true
) {

    if (
        Number(cents) === 0 &&
        zeroAsFree
    ) {

        return "Free";

    }


    return new Intl.NumberFormat(
        "en-US",
        {
            style:
                "currency",

            currency:
                String(
                    currency ||
                    "usd"
                )
                    .toUpperCase()
        }
    )
        .format(
            Number(
                cents
            ) /
            100
        );

}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatAdminSalesDate(
    value
) {

    if (
        !value
    ) {
        return "—";
    }


    return new Date(
        value
    )
        .toLocaleString(
            undefined,
            {
                dateStyle:
                    "medium",

                timeStyle:
                    "short"
            }
        );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeAdminSalesHtml(
    value
) {

    return String(
        value
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   REFRESH BUTTON
   ========================================================= */

function setSalesRefreshState(
    loading
) {

    if (
        !refreshSales
    ) {
        return;
    }


    refreshSales.disabled =
        loading;


    refreshSales.innerHTML =
        loading
            ? `
                <i
                    class="fa-solid fa-circle-notch fa-spin"
                    aria-hidden="true"
                ></i>

                Loading
            `
            : `
                <i
                    class="fa-solid fa-rotate"
                    aria-hidden="true"
                ></i>

                Refresh
            `;

}


/* =========================================================
   EVENTS
   ========================================================= */

salesSearch
    ?.addEventListener(
        "input",
        renderAdminSales
    );


salesStatusFilter
    ?.addEventListener(
        "change",
        renderAdminSales
    );

salesTypeFilter
    ?.addEventListener(
        "change",
        renderAdminSales
    );


refreshSales
    ?.addEventListener(
        "click",
        loadAdminSales
    );