/* =========================================================
   ISLAMIC QALAM ADMIN — COMPLIMENTARY PREMIUM
   ========================================================= */


/* =========================================================
   GRANT FORM ELEMENTS
   ========================================================= */

const premiumGrantForm =
    document.getElementById(
        "premiumGrantForm"
    );


const premiumGrantEmail =
    document.getElementById(
        "premiumGrantEmail"
    );


const premiumGrantMonths =
    document.getElementById(
        "premiumGrantMonths"
    );


const premiumGrantReason =
    document.getElementById(
        "premiumGrantReason"
    );


const premiumGrantNote =
    document.getElementById(
        "premiumGrantNote"
    );


const premiumGrantMessage =
    document.getElementById(
        "premiumGrantMessage"
    );


const premiumGrantButton =
    document.getElementById(
        "premiumGrantButton"
    );


/* =========================================================
   MANAGEMENT ELEMENTS
   ========================================================= */

const premiumGrantsTableBody =
    document.getElementById(
        "premiumGrantsTableBody"
    );


const premiumGrantSearch =
    document.getElementById(
        "premiumGrantSearch"
    );


const premiumGrantStatusFilter =
    document.getElementById(
        "premiumGrantStatusFilter"
    );


const refreshPremiumGrants =
    document.getElementById(
        "refreshPremiumGrants"
    );


const premiumGrantsActiveCount =
    document.getElementById(
        "premiumGrantsActiveCount"
    );


const premiumGrantsUpcomingCount =
    document.getElementById(
        "premiumGrantsUpcomingCount"
    );


const premiumGrantsUnclaimedCount =
    document.getElementById(
        "premiumGrantsUnclaimedCount"
    );


const premiumGrantsExpiredCount =
    document.getElementById(
        "premiumGrantsExpiredCount"
    );


const premiumGrantsRevokedCount =
    document.getElementById(
        "premiumGrantsRevokedCount"
    );


let adminPremiumGrants =
    [];


/* =========================================================
   LOAD GRANTS
   ========================================================= */

async function loadPremiumGrants() {

    if (
        !premiumGrantsTableBody
    ) {
        return;
    }


    setPremiumGrantsRefreshState(
        true
    );


    premiumGrantsTableBody.innerHTML =
        `
            <tr>
                <td
                    colspan="7"
                    class="admin-table-empty"
                >
                    Loading complimentary memberships...
                </td>
            </tr>
        `;


    try {

        const {
            data,
            error
        } =
            await window
                .supabaseClient
                .functions
                .invoke(
                    "admin-premium-grants",
                    {
                        body: {
                            action:
                                "list"
                        }
                    }
                );


        if (error) {

            console.error(
                "Unable to load complimentary memberships:",
                error
            );

            throw error;

        }


        if (
            !data ||
            data.success !== true
        ) {

            throw new Error(
                data?.error ||
                "Unable to load complimentary memberships."
            );

        }


        adminPremiumGrants =
            Array.isArray(
                data.grants
            )
                ? data.grants
                : [];


        renderPremiumGrantSummary(
            data.summary || {}
        );


        renderPremiumGrants();


    } catch (error) {

        console.error(
            "Complimentary Premium list failed:",
            error
        );


        premiumGrantsTableBody.innerHTML =
            `
                <tr>
                    <td
                        colspan="7"
                        class="admin-table-empty"
                    >
                        Unable to load complimentary memberships.
                    </td>
                </tr>
            `;

    } finally {

        setPremiumGrantsRefreshState(
            false
        );

    }

}


/* =========================================================
   SUMMARY
   ========================================================= */

function renderPremiumGrantSummary(
    summary
) {

    if (premiumGrantsActiveCount) {

        premiumGrantsActiveCount.textContent =
            formatPremiumGrantNumber(
                summary.active || 0
            );

    }


    if (premiumGrantsUpcomingCount) {

        premiumGrantsUpcomingCount.textContent =
            formatPremiumGrantNumber(
                summary.upcoming || 0
            );

    }


    if (premiumGrantsUnclaimedCount) {

        premiumGrantsUnclaimedCount.textContent =
            formatPremiumGrantNumber(
                summary.unclaimed || 0
            );

    }


    if (premiumGrantsExpiredCount) {

        premiumGrantsExpiredCount.textContent =
            formatPremiumGrantNumber(
                summary.expired || 0
            );

    }


    if (premiumGrantsRevokedCount) {

        premiumGrantsRevokedCount.textContent =
            formatPremiumGrantNumber(
                summary.revoked || 0
            );

    }

}


/* =========================================================
   RENDER TABLE
   ========================================================= */

function renderPremiumGrants() {

    if (
        !premiumGrantsTableBody
    ) {
        return;
    }


    const query =
        premiumGrantSearch
            ?.value
            .trim()
            .toLowerCase() ||
        "";


    const selectedStatus =
        premiumGrantStatusFilter
            ?.value ||
        "all";


    const grants =
        adminPremiumGrants.filter(
            grant => {

                const matchesSearch =
                    !query ||
                    String(
                        grant.email ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            query
                        );


                const matchesStatus =
                    selectedStatus ===
                    "all" ||
                    grant.status ===
                    selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    premiumGrantsTableBody.innerHTML =
        "";


    if (
        grants.length ===
        0
    ) {

        premiumGrantsTableBody.innerHTML =
            `
                <tr>
                    <td
                        colspan="7"
                        class="admin-table-empty"
                    >
                        No matching complimentary memberships found.
                    </td>
                </tr>
            `;

        return;

    }


    grants.forEach(
        grant => {

            premiumGrantsTableBody.appendChild(
                createPremiumGrantRow(
                    grant
                )
            );

        }
    );

}


/* =========================================================
   CREATE TABLE ROW
   ========================================================= */

function createPremiumGrantRow(
    grant
) {

    const row =
        document.createElement(
            "tr"
        );


    const status =
        grant.status ||
        "expired";


    const statusLabel =
        getPremiumGrantStatusLabel(
            status
        );


    const claimed =
        grant.claimed ===
        true;


    const canRevoke =
        status ===
        "active" ||
        status ===
        "upcoming";

    const durationMonths =
        Number(
            grant.durationMonths
        ) || 0;


    const durationLabel =
        durationMonths === 1
            ? "1 month"
            : `${durationMonths} months`;


    const accessPeriodHtml =
        status === "unclaimed"
            ? `
            <div class="admin-premium-grant-period waiting">

                <strong>
                    Starts when claimed
                </strong>

                <span>
                    ${escapePremiumGrantHtml(
                durationLabel
            )} of Premium
                </span>

            </div>
        `
            : `
            <div class="admin-premium-grant-period">

                <strong>
                    ${escapePremiumGrantHtml(
                formatPremiumGrantDate(
                    grant.startsAt
                )
            )}
                </strong>

                <span>
                    to
                </span>

                <strong>
                    ${escapePremiumGrantHtml(
                formatPremiumGrantDate(
                    grant.endsAt
                )
            )}
                </strong>

                ${durationMonths
                ? `
                            <span>
                                ${escapePremiumGrantHtml(
                    durationLabel
                )}
                            </span>
                        `
                : ""
            }

            </div>
        `;


    row.innerHTML =
        `
            <td>

                <div class="admin-premium-grant-recipient">

                    <strong>
                        ${escapePremiumGrantHtml(
            grant.email ||
            "Unknown email"
        )}
                    </strong>

                    <span>
                        ${escapePremiumGrantHtml(
            String(
                grant.id ||
                ""
            )
                .slice(
                    0,
                    8
                )
                .toUpperCase()
        )}
                    </span>

                </div>

            </td>


            <td>

                <span
                    class="admin-premium-grant-status ${escapePremiumGrantHtml(
            status
        )}"
                >
                    ${escapePremiumGrantHtml(
            statusLabel
        )}
                </span>

            </td>


            <td>
                ${accessPeriodHtml}
            </td>


            <td>
                ${escapePremiumGrantHtml(
            formatPremiumGrantReason(
                grant.reason
            )
        )}
            </td>


            <td>

                <div
                    class="admin-premium-claim-status ${claimed
            ? "claimed"
            : "unclaimed"
        }"
                >

                    <strong>
                        ${claimed
            ? "Claimed"
            : "Unclaimed"
        }
                    </strong>

                    <span>
                        ${claimed
            ? "Linked to account"
            : "Waiting for matching email"
        }
                    </span>

                </div>

            </td>


            <td>

                <span class="admin-premium-grant-note">
                    ${escapePremiumGrantHtml(
            grant.note ||
            "—"
        )}
                </span>

            </td>


            <td>

                <div class="admin-premium-grant-actions">

                    <button
                        type="button"
                        class="admin-premium-grant-action extend"
                        data-action="extend"
                    >
                        <i
                            class="fa-solid fa-plus"
                            aria-hidden="true"
                        ></i>

                        Extend
                    </button>


                    ${canRevoke
            ? `
                                <button
                                    type="button"
                                    class="admin-premium-grant-action revoke"
                                    data-action="revoke"
                                >
                                    <i
                                        class="fa-solid fa-ban"
                                        aria-hidden="true"
                                    ></i>

                                    Revoke
                                </button>
                            `
            : ""
        }

                </div>

            </td>
        `;


    const extendButton =
        row.querySelector(
            '[data-action="extend"]'
        );


    extendButton
        ?.addEventListener(
            "click",
            () => {

                preparePremiumGrantExtension(
                    grant
                );

            }
        );


    const revokeButton =
        row.querySelector(
            '[data-action="revoke"]'
        );


    revokeButton
        ?.addEventListener(
            "click",
            () => {

                revokePremiumGrant(
                    grant,
                    revokeButton
                );

            }
        );


    return row;

}


/* =========================================================
   EXTEND
   ========================================================= */

function preparePremiumGrantExtension(
    grant
) {

    if (
        !premiumGrantEmail ||
        !premiumGrantMonths
    ) {
        return;
    }


    premiumGrantEmail.value =
        grant.email ||
        "";


    premiumGrantMonths.value =
        "1";


    if (
        premiumGrantReason &&
        grant.reason
    ) {

        const validOption =
            Array.from(
                premiumGrantReason.options
            )
                .some(
                    option =>
                        option.value ===
                        grant.reason
                );


        premiumGrantReason.value =
            validOption
                ? grant.reason
                : "donation";

    }


    if (
        premiumGrantNote
    ) {

        premiumGrantNote.value =
            "";

    }


    showPremiumGrantMessage(
        `Extending ${grant.email}. Choose how many additional months to grant.`,
        "success"
    );


    premiumGrantForm
        ?.scrollIntoView({
            behavior:
                "smooth",

            block:
                "center"
        });


    window.setTimeout(
        () => {

            premiumGrantMonths.focus();
            premiumGrantMonths.select();

        },
        350
    );

}


/* =========================================================
   REVOKE
   ========================================================= */

async function revokePremiumGrant(
    grant,
    button
) {

    const confirmed =
        window.confirm(
            `Revoke this complimentary Premium grant for ${grant.email}?`
        );


    if (
        !confirmed
    ) {
        return;
    }


    button.disabled =
        true;


    button.innerHTML =
        `
            <i
                class="fa-solid fa-circle-notch fa-spin"
                aria-hidden="true"
            ></i>

            Revoking...
        `;


    try {

        const {
            data,
            error
        } =
            await window
                .supabaseClient
                .functions
                .invoke(
                    "admin-premium-grants",
                    {
                        body: {

                            action:
                                "revoke",

                            id:
                                grant.id

                        }
                    }
                );


        if (error) {

            console.error(
                "Unable to revoke complimentary Premium:",
                error
            );

            throw error;

        }


        if (
            !data ||
            data.success !== true
        ) {

            throw new Error(
                data?.error ||
                "Unable to revoke grant."
            );

        }


        showPremiumGrantMessage(
            `Complimentary Premium for ${grant.email} was revoked.`,
            "success"
        );


        await loadPremiumGrants();


    } catch (error) {

        console.error(
            "Complimentary Premium revoke failed:",
            error
        );


        showPremiumGrantMessage(
            "Unable to revoke this complimentary membership.",
            "error"
        );


        button.disabled =
            false;


        button.innerHTML =
            `
                <i
                    class="fa-solid fa-ban"
                    aria-hidden="true"
                ></i>

                Revoke
            `;

    }

}


/* =========================================================
   CREATE GRANT
   ========================================================= */

premiumGrantForm
    ?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const email =
                premiumGrantEmail
                    .value
                    .trim()
                    .toLowerCase();


            const months =
                Number(
                    premiumGrantMonths
                        .value
                );


            const reason =
                premiumGrantReason
                    .value;


            const note =
                premiumGrantNote
                    .value
                    .trim();


            if (!email) {

                showPremiumGrantMessage(
                    "Please enter an email address.",
                    "error"
                );

                return;

            }


            if (
                !Number.isInteger(
                    months
                ) ||
                months < 1
            ) {

                showPremiumGrantMessage(
                    "Please enter a valid number of months.",
                    "error"
                );

                return;

            }


            setPremiumGrantLoading(
                true
            );


            hidePremiumGrantMessage();


            try {

                const {
                    data,
                    error
                } =
                    await window
                        .supabaseClient
                        .functions
                        .invoke(
                            "admin-premium-grants",
                            {
                                body: {

                                    action:
                                        "grant",

                                    email,

                                    months,

                                    reason,

                                    note

                                }
                            }
                        );


                if (error) {

                    console.error(
                        "Unable to grant complimentary Premium:",
                        error
                    );

                    throw error;

                }


                if (
                    !data ||
                    data.success !== true ||
                    !data.grant
                ) {

                    throw new Error(
                        data?.error ||
                        "Unable to grant Complimentary Premium."
                    );

                }


                const grant =
                    data.grant;


                const endsAt =
                    formatPremiumGrantDate(
                        grant.endsAt
                    );


                const accountState =
                    grant.claimed
                        ? "It has been linked to their existing account."
                        : "It will be linked when they sign in or create an account with this email.";


                showPremiumGrantMessage(
                    `Complimentary Premium granted until ${endsAt}. ${accountState}`,
                    "success"
                );


                premiumGrantEmail.value =
                    "";


                premiumGrantMonths.value =
                    "1";


                premiumGrantReason.value =
                    "donation";


                premiumGrantNote.value =
                    "";


                await loadPremiumGrants();


                premiumGrantEmail.focus();


            } catch (error) {

                console.error(
                    "Complimentary Premium grant failed:",
                    error
                );


                showPremiumGrantMessage(
                    "Unable to grant Complimentary Premium.",
                    "error"
                );


            } finally {

                setPremiumGrantLoading(
                    false
                );

            }

        }
    );


/* =========================================================
   FORM MESSAGE
   ========================================================= */

function showPremiumGrantMessage(
    message,
    type
) {

    if (
        !premiumGrantMessage
    ) {
        return;
    }


    premiumGrantMessage.textContent =
        message;


    premiumGrantMessage.className =
        `admin-premium-grant-message ${type}`;

}


function hidePremiumGrantMessage() {

    if (
        !premiumGrantMessage
    ) {
        return;
    }


    premiumGrantMessage.textContent =
        "";


    premiumGrantMessage.className =
        "admin-premium-grant-message";

}


/* =========================================================
   BUTTON STATES
   ========================================================= */

function setPremiumGrantLoading(
    loading
) {

    if (
        !premiumGrantButton
    ) {
        return;
    }


    premiumGrantButton.disabled =
        loading;


    premiumGrantButton.innerHTML =
        loading
            ? `
                <i
                    class="fa-solid fa-circle-notch fa-spin"
                    aria-hidden="true"
                ></i>

                Granting...
            `
            : `
                <i
                    class="fa-solid fa-gift"
                    aria-hidden="true"
                ></i>

                Grant Premium
            `;

}


function setPremiumGrantsRefreshState(
    loading
) {

    if (
        !refreshPremiumGrants
    ) {
        return;
    }


    refreshPremiumGrants.disabled =
        loading;


    refreshPremiumGrants.innerHTML =
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
   FORMATTERS
   ========================================================= */

function formatPremiumGrantDate(
    value
) {

    if (
        !value
    ) {
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


    return date
        .toLocaleDateString(
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


function formatPremiumGrantNumber(
    value
) {

    return new Intl.NumberFormat(
        "en-AU"
    )
        .format(
            Number(
                value
            ) ||
            0
        );

}


function formatPremiumGrantReason(
    value
) {

    const reasons = {

        donation:
            "Donation",

        gift:
            "Gift",

        promotion:
            "Promotion",

        admin:
            "Administrator grant"

    };


    return reasons[value] ||
        String(
            value ||
            "Other"
        );

}


function getPremiumGrantStatusLabel(
    status
) {

    const statuses = {

        active:
            "Active",

        upcoming:
            "Upcoming",

        unclaimed:
            "Unclaimed",

        expired:
            "Expired",

        revoked:
            "Revoked"

    };


    return statuses[status] ||
        "Unknown";

}


/* =========================================================
   SECURITY
   ========================================================= */

function escapePremiumGrantHtml(
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
   EVENTS
   ========================================================= */

premiumGrantSearch
    ?.addEventListener(
        "input",
        renderPremiumGrants
    );


premiumGrantStatusFilter
    ?.addEventListener(
        "change",
        renderPremiumGrants
    );


refreshPremiumGrants
    ?.addEventListener(
        "click",
        loadPremiumGrants
    );


/* =========================================================
   INITIAL LOAD
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        loadPremiumGrants
    );

} else {

    loadPremiumGrants();

}