/* =========================================================
   ISLAMIC QALAM ADMIN — PREMIUM SUBSCRIPTION SALES
   ========================================================= */

const salesLoading =
    document.getElementById(
        "salesLoading"
    );

const salesContent =
    document.getElementById(
        "salesContent"
    );

const salesEnvironmentBadge =
    document.getElementById(
        "salesEnvironmentBadge"
    );

const salesWeekRevenue =
    document.getElementById(
        "salesWeekRevenue"
    );

const salesWeekPayments =
    document.getElementById(
        "salesWeekPayments"
    );

const salesActivePremium =
    document.getElementById(
        "salesActivePremium"
    );

const salesAllTimeRevenue =
    document.getElementById(
        "salesAllTimeRevenue"
    );

const salesRecurringCount =
    document.getElementById(
        "salesRecurringCount"
    );

const salesPassCount =
    document.getElementById(
        "salesPassCount"
    );

const salesEndingCount =
    document.getElementById(
        "salesEndingCount"
    );

const salesPastDueCount =
    document.getElementById(
        "salesPastDueCount"
    );

const salesSubscriptionsBody =
    document.getElementById(
        "salesSubscriptionsBody"
    );

const salesSearch =
    document.getElementById(
        "salesSearch"
    );

const salesStatusFilter =
    document.getElementById(
        "salesStatusFilter"
    );

const salesPlanFilter =
    document.getElementById(
        "salesPlanFilter"
    );

const refreshSales =
    document.getElementById(
        "refreshSales"
    );


let adminPremiumSubscriptions =
    [];


/* =========================================================
   LOAD PREMIUM SALES
   ========================================================= */

async function loadAdminSales() {

    if (
        !salesSubscriptionsBody
    ) {
        return;
    }


    setSalesRefreshState(
        true
    );


    if (salesLoading) {
        salesLoading.hidden =
            false;
    }


    if (salesContent) {
        salesContent.hidden =
            true;
    }


    salesSubscriptionsBody.innerHTML =
        `
            <tr>
                <td
                    colspan="8"
                    class="admin-table-empty"
                >
                    Loading Premium subscriptions...
                </td>
            </tr>
        `;


    try {

        const {
            data,
            error
        } =
            await window.supabaseClient
                .functions
                .invoke(
                    "admin-premium-sales",
                    {
                        body: {
                            action:
                                "overview"
                        }
                    }
                );


        if (error) {

            console.error(
                "Unable to load Premium sales:",
                error
            );

            throw error;

        }


        if (
            !data ||
            data.ok !== true
        ) {

            throw new Error(
                data?.error ||
                "Unable to load Premium sales."
            );

        }


        adminPremiumSubscriptions =
            Array.isArray(
                data.subscriptions
            )
                ? data.subscriptions
                : [];


        renderSalesEnvironment(
            data.environment
        );


        renderSalesSummary(
            data.summary || {}
        );


        renderAdminSales();


        if (salesLoading) {
            salesLoading.hidden =
                true;
        }


        if (salesContent) {
            salesContent.hidden =
                false;
        }


    } catch (error) {

        console.error(
            "Premium sales dashboard failed:",
            error
        );


        if (salesLoading) {
            salesLoading.hidden =
                true;
        }


        if (salesContent) {
            salesContent.hidden =
                false;
        }


        salesSubscriptionsBody.innerHTML =
            `
                <tr>
                    <td
                        colspan="8"
                        class="admin-table-empty"
                    >
                        Unable to load Premium subscription information.
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
   ENVIRONMENT
   ========================================================= */

function renderSalesEnvironment(
    environment
) {

    if (!salesEnvironmentBadge) {
        return;
    }


    const live =
        environment ===
        "live";


    salesEnvironmentBadge.textContent =
        live
            ? "Live Stripe"
            : "Test Stripe";


    salesEnvironmentBadge.classList.toggle(
        "live",
        live
    );

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
            currency
        );


    salesWeekPayments.textContent =
        formatAdminSalesNumber(
            summary.weekPayments || 0
        );


    salesActivePremium.textContent =
        formatAdminSalesNumber(
            summary.activePremium || 0
        );


    salesAllTimeRevenue.textContent =
        formatAdminSalesMoney(
            summary.allTimeRevenueCents || 0,
            currency
        );


    salesRecurringCount.textContent =
        formatAdminSalesNumber(
            summary.activeRecurring || 0
        );


    salesPassCount.textContent =
        formatAdminSalesNumber(
            summary.activePasses || 0
        );


    salesEndingCount.textContent =
        formatAdminSalesNumber(
            summary.endingAtPeriodEnd || 0
        );


    salesPastDueCount.textContent =
        formatAdminSalesNumber(
            summary.pastDue || 0
        );

}


/* =========================================================
   FILTER + RENDER
   ========================================================= */

function renderAdminSales() {

    if (
        !salesSubscriptionsBody
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


    const selectedPlan =
        salesPlanFilter
            ?.value ||
        "all";


    const subscriptions =
        adminPremiumSubscriptions
            .filter(
                subscription => {

                    const matchesStatus =
                        selectedStatus ===
                        "all" ||
                        subscription.status ===
                        selectedStatus;


                    const matchesPlan =
                        selectedPlan ===
                        "all" ||
                        subscription.plan ===
                        selectedPlan;


                    const searchable =
                        [
                            subscription.email,
                            subscription.subscriptionId,
                            subscription.customerId
                        ]
                            .filter(Boolean)
                            .join(" ")
                            .toLowerCase();


                    const matchesSearch =
                        !query ||
                        searchable.includes(
                            query
                        );


                    return (
                        matchesStatus &&
                        matchesPlan &&
                        matchesSearch
                    );

                }
            );


    salesSubscriptionsBody.innerHTML =
        "";


    if (
        subscriptions.length ===
        0
    ) {

        salesSubscriptionsBody.innerHTML =
            `
                <tr>
                    <td
                        colspan="8"
                        class="admin-table-empty"
                    >
                        No matching Premium subscriptions found.
                    </td>
                </tr>
            `;

        return;

    }


    subscriptions.forEach(
        subscription => {

            const row =
                document.createElement(
                    "tr"
                );


            const email =
                subscription.email ||
                "Email unavailable";


            const subscriptionId =
                subscription.subscriptionId ||
                "";


            const shortSubscriptionId =
                subscriptionId
                    ? `${subscriptionId.slice(0, 18)}…`
                    : "—";


            const plan =
                subscription.plan ===
                "pass"
                    ? "pass"
                    : "recurring";


            const planLabel =
                plan ===
                "pass"
                    ? "One-Month Pass"
                    : "Monthly Premium";


            const hasAccess =
                subscription.hasAccess ===
                true;


            const accessLabel =
                hasAccess
                    ? (
                        subscription.cancelAtPeriodEnd
                            ? "Active — ending"
                            : "Active"
                    )
                    : "No active access";


            const status =
                subscription.status ||
                "unknown";


            const billingNote =
                subscription.cancelAtPeriodEnd
                    ? "Renewal disabled"
                    : (
                        plan === "pass"
                            ? "Ends automatically"
                            : (
                                status === "active"
                                    ? "Renews monthly"
                                    : formatAdminSalesStatus(
                                        status
                                    )
                            )
                    );


            row.innerHTML =
                `
                    <td>
                        <div class="admin-premium-subscriber">
                            <strong>
                                ${escapeAdminSalesHtml(
                                    email
                                )}
                            </strong>

                            <span title="${escapeAdminSalesHtml(
                                subscriptionId
                            )}">
                                ${escapeAdminSalesHtml(
                                    shortSubscriptionId
                                )}
                            </span>
                        </div>
                    </td>

                    <td>
                        <span class="admin-premium-plan-badge ${plan}">
                            ${escapeAdminSalesHtml(
                                planLabel
                            )}
                        </span>
                    </td>

                    <td>
                        <span class="admin-premium-access-badge ${
                            hasAccess
                                ? "active"
                                : "inactive"
                        }">
                            ${escapeAdminSalesHtml(
                                accessLabel
                            )}
                        </span>
                    </td>

                    <td>
                        <div class="admin-premium-billing">
                            <span class="admin-premium-status ${escapeAdminSalesHtml(
                                status
                            )}">
                                ${escapeAdminSalesHtml(
                                    formatAdminSalesStatus(
                                        status
                                    )
                                )}
                            </span>

                            <span>
                                ${escapeAdminSalesHtml(
                                    billingNote
                                )}
                            </span>
                        </div>
                    </td>

                    <td>
                        <strong class="admin-premium-total-paid">
                            ${escapeAdminSalesHtml(
                                formatAdminSalesMoney(
                                    subscription.totalPaidCents || 0,
                                    subscription.currency || "usd"
                                )
                            )}
                        </strong>
                    </td>

                    <td>
                        <span class="admin-premium-payment-count">
                            ${escapeAdminSalesHtml(
                                formatAdminSalesNumber(
                                    subscription.paymentCount || 0
                                )
                            )}
                        </span>
                    </td>

                    <td>
                        <div class="admin-premium-date">
                            <strong>
                                ${escapeAdminSalesHtml(
                                    formatAdminSalesDate(
                                        subscription.paidThrough
                                    )
                                )}
                            </strong>

                            <span>
                                ${
                                    subscription.lastPaymentAt
                                        ? `Last paid ${escapeAdminSalesHtml(
                                            formatAdminSalesDate(
                                                subscription.lastPaymentAt
                                            )
                                        )}`
                                        : "No paid invoice"
                                }
                            </span>
                        </div>
                    </td>

                    <td>
                        <div class="admin-premium-date">
                            <strong>
                                ${escapeAdminSalesHtml(
                                    formatAdminSalesDate(
                                        subscription.createdAt
                                    )
                                )}
                            </strong>

                            <span>
                                Stripe subscription
                            </span>
                        </div>
                    </td>
                `;


            salesSubscriptionsBody.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   FORMATTERS
   ========================================================= */

function formatAdminSalesMoney(
    cents,
    currency = "usd"
) {

    const amount =
        (
            Number(cents) ||
            0
        ) / 100;


    try {

        return new Intl.NumberFormat(
            "en-AU",
            {
                style:
                    "currency",
                currency:
                    String(currency)
                        .toUpperCase(),
                minimumFractionDigits:
                    2
            }
        )
            .format(
                amount
            );

    } catch {

        return `$${amount.toFixed(2)}`;

    }

}


function formatAdminSalesNumber(
    value
) {

    return new Intl.NumberFormat(
        "en-AU"
    )
        .format(
            Number(value) ||
            0
        );

}


function formatAdminSalesDate(
    value
) {

    if (!value) {
        return "—";
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }


    return date.toLocaleDateString(
        "en-AU",
        {
            day:
                "numeric",
            month:
                "short",
            year:
                "numeric"
        }
    );

}


function formatAdminSalesStatus(
    value
) {

    const labels = {
        active:
            "Active",
        past_due:
            "Past due",
        canceled:
            "Cancelled",
        incomplete:
            "Incomplete",
        incomplete_expired:
            "Expired",
        trialing:
            "Trialling",
        unpaid:
            "Unpaid",
        paused:
            "Paused"
    };


    return labels[value] ||
        String(value || "Unknown")
            .replaceAll(
                "_",
                " "
            );

}


function escapeAdminSalesHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            "\"",
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   REFRESH
   ========================================================= */

function setSalesRefreshState(
    loading
) {

    if (!refreshSales) {
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
                Refreshing
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


salesPlanFilter
    ?.addEventListener(
        "change",
        renderAdminSales
    );


refreshSales
    ?.addEventListener(
        "click",
        loadAdminSales
    );