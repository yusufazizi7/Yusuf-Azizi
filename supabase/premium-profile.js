/* Islamic Qalam — Premium account panel. */

(() => {

    "use strict";


    const client =
        window.supabaseClient;


    const $ =
        id =>
            document.getElementById(
                id
            );


    const section =
        $("profileSectionPremium");


    if (
        !client ||
        !section
    ) {

        return;

    }


    /* =========================================================
       UI
       ========================================================= */

    const ui = {

        loading:
            $("premiumLoading"),

        message:
            $("premiumMessage"),

        empty:
            $("premiumNoSubscription"),

        subscribe:
            $("premiumSubscribeButton"),

        details:
            $("premiumMembershipDetails"),

        hero:
            $("premiumHero"),

        heroSubtitle:
            $("premiumHeroSubtitle"),

        plan:
            $("premiumPlanName"),

        status:
            $("premiumStatus"),

        paidLabel:
            $("premiumPeriodLabel"),

        paidThrough:
            $("premiumPaidThrough"),

        renewal:
            $("premiumRenewalStatus"),

        nextRenewal:
            $("premiumNextRenewal"),

        notice:
            $("premiumCancellationNotice"),

        restartPanel:
            $("premiumRestartPanel"),

        restart:
            $("premiumRestartButton"),

        manage:
            $("premiumActiveManagement"),

        cancel:
            $("premiumCancelButton"),

        reactivate:
            $("premiumReactivateButton"),

        payment:
            $("premiumPaymentMethod"),

        updatePayment:
            $("premiumUpdatePaymentButton")

    };


    /*
     * Existing HTML elements that do not currently
     * have IDs.
     */

    const premiumFacts =
        section.querySelectorAll(
            ".premium-fact"
        );


    const renewalLabel =
        premiumFacts[1]
            ?.querySelector(
                "span"
            ) ??
        null;


    const nextPaymentLabel =
        premiumFacts[2]
            ?.querySelector(
                "span"
            ) ??
        null;


    const billingRow =
        ui.payment
            ?.closest(
                ".premium-billing-row"
            ) ??
        null;


    const billingDivider =
        billingRow
            ?.previousElementSibling ??
        null;


    const headingDescription =
        section.querySelector(
            ".profile-page-heading > p:last-child"
        );


    const premiumTab =
        document.querySelector(
            '.profile-nav-button[data-profile-section="premium"]'
        );


    let busy =
        false;


    let latest =
        null;


    let requestVersion =
        0;


    /* =========================================================
       HELPERS
       ========================================================= */

    function formatDate(
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
            !Number.isFinite(
                date.getTime()
            )
        ) {

            return "—";

        }


        return new Intl.DateTimeFormat(
            "en-AU",
            {
                day:
                    "numeric",

                month:
                    "long",

                year:
                    "numeric"
            }
        )
            .format(
                date
            );

    }


    function showMessage(
        text = "",
        kind = "info"
    ) {

        ui.message.textContent =
            text;


        ui.message.className =
            text
                ? `profile-message show ${kind}`
                : "profile-message";

    }


    async function account(
        action
    ) {

        const {
            data,
            error
        } =
            await client
                .functions
                .invoke(
                    "premium-account",
                    {
                        body: {
                            action
                        }
                    }
                );


        if (
            error
        ) {

            let reason =
                error.message ||
                "Membership request failed.";


            try {

                const body =
                    await error
                        .context
                        ?.clone()
                        .json();


                if (
                    body?.error
                ) {

                    reason =
                        body.error;

                }

            } catch {

                /*
                 * Preserve original error.
                 */

            }


            throw new Error(
                reason
            );

        }


        if (
            data?.error
        ) {

            throw new Error(
                data.error
            );

        }


        return data;

    }


    function setBusy(
        value
    ) {

        busy =
            value;


        for (
            const element
            of [
                ui.subscribe,
                ui.restart,
                ui.cancel,
                ui.reactivate,
                ui.updatePayment
            ]
        ) {

            if (
                element
            ) {

                element.disabled =
                    value;

            }

        }

    }


    /* =========================================================
       RESET UI
       ========================================================= */

    function resetMembershipUi() {

        ui.loading.hidden =
            true;


        ui.empty.hidden =
            true;


        ui.details.hidden =
            true;


        ui.manage.hidden =
            true;


        ui.restartPanel.hidden =
            true;


        ui.cancel.hidden =
            true;


        ui.reactivate.hidden =
            true;


        ui.notice.hidden =
            true;


        ui.updatePayment.hidden =
            true;


        if (
            billingRow
        ) {

            billingRow.hidden =
                true;

        }


        if (
            billingDivider
        ) {

            billingDivider.hidden =
                true;

        }


        ui.hero.classList.remove(
            "is-ended"
        );


        ui.status.classList.remove(
            "is-active",
            "is-pending",
            "is-ended"
        );


        if (
            renewalLabel
        ) {

            renewalLabel.textContent =
                "Automatic renewal";

        }


        if (
            nextPaymentLabel
        ) {

            nextPaymentLabel.textContent =
                "Next payment";

        }


        if (
            headingDescription
        ) {

            headingDescription.textContent =
                "Manage your access, renewal and secure payment details.";

        }

    }


    /* =========================================================
       COMPLIMENTARY PREMIUM
       ========================================================= */

    function renderComplimentary(
        data
    ) {

        ui.details.hidden =
            false;


        const until =
            data.complimentaryUntil ??
            data.complimentaryMembership
                ?.scheduledUntil ??
            data.complimentaryMembership
                ?.activeUntil ??
            null;


        const untilText =
            formatDate(
                until
            );


        ui.plan.textContent =
            "Complimentary Premium";


        ui.heroSubtitle.textContent =
            "Your complimentary Premium access is active.";


        ui.status.textContent =
            "Active";


        ui.status.classList.add(
            "is-active"
        );


        ui.paidLabel.textContent =
            "Complimentary access until";


        ui.paidThrough.textContent =
            untilText;


        if (
            renewalLabel
        ) {

            renewalLabel.textContent =
                "Automatic renewal";

        }


        ui.renewal.textContent =
            "Off — complimentary access";


        if (
            nextPaymentLabel
        ) {

            nextPaymentLabel.textContent =
                "Next payment";

        }


        ui.nextRenewal.textContent =
            "No payment scheduled";


        ui.notice.hidden =
            false;


        ui.notice.textContent =
            until
                ? (
                    `Your complimentary Premium membership remains active until ${untilText}. ` +
                    "It does not renew automatically and no payment method is required. " +
                    "After it ends, you can choose a Premium plan if you would like to continue."
                )
                : (
                    "Your complimentary Premium membership is active. " +
                    "It does not renew automatically and no payment method is required."
                );


        /*
         * Complimentary Premium has no Stripe billing.
         */

        ui.manage.hidden =
            true;


        ui.restartPanel.hidden =
            true;


        ui.cancel.hidden =
            true;


        ui.reactivate.hidden =
            true;


        ui.updatePayment.hidden =
            true;


        if (
            billingRow
        ) {

            billingRow.hidden =
                true;

        }


        if (
            billingDivider
        ) {

            billingDivider.hidden =
                true;

        }


        if (
            headingDescription
        ) {

            headingDescription.textContent =
                "Review your complimentary Islamic Qalam Premium access.";

        }

    }


    /* =========================================================
       PAID STRIPE PREMIUM
       ========================================================= */

    function renderPaid(
        data
    ) {

        ui.details.hidden =
            false;


        if (
            billingRow
        ) {

            billingRow.hidden =
                false;

        }


        if (
            billingDivider
        ) {

            billingDivider.hidden =
                false;

        }


        const isPass =
            data.plan ===
            "pass";


        const status =
            data.status ??
            "unknown";


        const ended =
            [
                "canceled",
                "incomplete_expired"
            ]
                .includes(
                    status
                );


        const paidDate =
            new Date(
                data.paidThrough ??
                ""
            )
                .getTime();


        const hasPaidPeriod =
            Number.isFinite(
                paidDate
            ) &&
            paidDate >
            Date.now();


        const active =
            data.hasPaidPremium ===
            true &&
            hasPaidPeriod &&
            [
                "active",
                "past_due"
            ]
                .includes(
                    status
                );


        const off =
            data.cancelAtPeriodEnd ===
            true;


        const planName =
            isPass
                ? "One-Month Premium Pass"
                : "Monthly Premium";


        ui.plan.textContent =
            planName;


        ui.hero.classList.toggle(
            "is-ended",
            ended
        );


        ui.heroSubtitle.textContent =
            ended
                ? "This paid membership has finished. Your billing history is preserved."
                : active
                    ? "Your Premium library access is available."
                    : "Your paid membership is being checked.";


        ui.status.textContent =
            ended
                ? "Expired"
                : active
                    ? status ===
                        "past_due"
                        ? "Payment overdue"
                        : "Active"
                    : status ===
                        "unpaid"
                        ? "Payment required"
                        : "Payment pending";


        ui.status.classList.add(
            ended
                ? "is-ended"
                : active
                    ? "is-active"
                    : "is-pending"
        );


        ui.paidLabel.textContent =
            ended
                ? "Previous access ended"
                : "Paid access until";


        ui.paidThrough.textContent =
            formatDate(
                ended
                    ? (
                        data.endedAt ||
                        data.paidThrough
                    )
                    : data.paidThrough
            );


        if (
            renewalLabel
        ) {

            renewalLabel.textContent =
                "Automatic renewal";

        }


        ui.renewal.textContent =
            ended
                ? "Ended"
                : off
                    ? "Off — cancellation scheduled"
                    : active
                        ? "On — renews monthly"
                        : "Not confirmed";


        if (
            nextPaymentLabel
        ) {

            nextPaymentLabel.textContent =
                "Next payment";

        }


        ui.nextRenewal.textContent =
            ended ||
                off
                ? "No payment scheduled"
                : active
                    ? formatDate(
                        data.nextRenewal ||
                        data.paidThrough
                    )
                    : "Awaiting confirmation";


        /* ==========================================
           PAYMENT METHOD
           ========================================== */

        const card =
            data.paymentMethod;


        ui.payment.textContent =
            card?.last4
                ? (
                    `${(
                        card.brand ||
                        "Card"
                    )
                        .toUpperCase()} •••• ${card.last4} · ` +
                    `expires ${String(
                        card.expMonth
                    )
                        .padStart(
                            2,
                            "0"
                        )}/${card.expYear}`
                )
                : "No saved card is available to display.";


        ui.updatePayment.hidden =
            false;


        /* ==========================================
           EXPIRED PAID SUBSCRIPTION
           ========================================== */

        if (
            ended
        ) {

            ui.restartPanel.hidden =
                false;


            ui.restart.textContent =
                isPass
                    ? "Restart One-Month Pass"
                    : "Restart Monthly Premium";


            ui.notice.hidden =
                false;


            ui.notice.textContent =
                "Your previous subscription has ended. " +
                "There are no scheduled renewal charges for that subscription.";


            return;

        }


        /* ==========================================
           ACTIVE PAID SUBSCRIPTION
           ========================================== */

        if (
            active
        ) {

            ui.notice.hidden =
                false;


            let notice =
                off
                    ? (
                        `Your paid access remains available until ${formatDate(
                            data.paidThrough
                        )}. ` +
                        "You won't be charged again unless you choose to continue."
                    )
                    : (
                        "Your membership automatically renews at $7.90 USD each month " +
                        "until you turn off renewal."
                    );


            /*
             * The account can have both paid and
             * complimentary Premium simultaneously.
             */

            if (
                data.hasComplimentaryPremium ===
                true &&
                data.complimentaryUntil
            ) {

                notice +=
                    ` You also have complimentary Premium access scheduled through ${formatDate(
                        data.complimentaryUntil
                    )}.`;

            }


            ui.notice.textContent =
                notice;


            if (
                status ===
                "active"
            ) {

                ui.manage.hidden =
                    false;


                /*
                 * Existing naming is preserved:
                 *
                 * cancel button = turn renewal off
                 * reactivate button = keep renewal on
                 */

                ui.cancel.hidden =
                    off;


                ui.reactivate.hidden =
                    !off;

            }


            return;

        }


        /* ==========================================
           PAYMENT NOT CONFIRMED
           ========================================== */

        ui.notice.hidden =
            false;


        ui.notice.textContent =
            "Stripe hasn't confirmed a current paid period for this subscription. " +
            "Check your payment details or contact support; please don't purchase " +
            "a duplicate subscription.";

    }


    /* =========================================================
       MAIN RENDER
       ========================================================= */

    function render(
        data
    ) {

        latest =
            data;


        resetMembershipUi();


        const hasPremium =
            data?.hasPremium ===
            true;


        const hasPaidPremium =
            data?.hasPaidPremium ===
            true;


        const hasComplimentaryPremium =
            data?.hasComplimentaryPremium ===
            true;


        const hasStripeSubscription =
            data?.hasStripeSubscription ===
            true ||
            data?.hasSubscription ===
            true;


        /* ==========================================
           NO PREMIUM
           ========================================== */

        if (
            !hasPremium &&
            !hasStripeSubscription
        ) {

            ui.empty.hidden =
                false;


            return;

        }


        /* ==========================================
           COMPLIMENTARY PREMIUM
           
           This also covers:
           
           - complimentary-only account
           - old/expired Stripe membership +
             currently active complimentary access
           ========================================== */

        if (
            hasComplimentaryPremium &&
            !hasPaidPremium
        ) {

            renderComplimentary(
                data
            );


            return;

        }


        /* ==========================================
           PAID STRIPE MEMBERSHIP
           
           If both paid + complimentary are active,
           the paid membership remains the main UI
           because it has billing controls.
           ========================================== */

        if (
            hasStripeSubscription
        ) {

            renderPaid(
                data
            );


            return;

        }


        /*
         * Defensive fallback.
         */

        ui.empty.hidden =
            false;

    }


    /* =========================================================
       LOAD MEMBERSHIP
       ========================================================= */

    async function loadMembership() {

        if (
            busy
        ) {

            return;

        }


        const version =
            ++requestVersion;


        ui.loading.hidden =
            false;


        showMessage();


        try {

            const {
                data: {
                    user
                },
                error
            } =
                await client
                    .auth
                    .getUser();


            if (
                error
            ) {

                throw error;

            }


            if (
                !user
            ) {

                /*
                 * Main profile module handles redirect.
                 */

                return;

            }


            /*
             * Stripe's portal changes the customer's
             * default payment method.
             */

            const params =
                new URLSearchParams(
                    window.location.search
                );


            if (
                params.get(
                    "payment_updated"
                ) ===
                "1"
            ) {

                await account(
                    "sync_payment_method"
                );


                const cleanUrl =
                    new URL(
                        window.location.href
                    );


                cleanUrl.searchParams.delete(
                    "payment_updated"
                );


                window.history.replaceState(
                    {},
                    "",
                    cleanUrl.toString()
                );

            }


            /*
             * premium-account now:
             *
             * - resolves paid Premium
             * - resolves Complimentary Premium
             * - claims waiting grants where appropriate
             */

            const result =
                await account(
                    "status"
                );


            if (
                version !==
                requestVersion
            ) {

                return;

            }


            render(
                result
            );


        } catch (
        error
        ) {

            if (
                version !==
                requestVersion
            ) {

                return;

            }


            ui.loading.hidden =
                true;


            showMessage(
                error.message ||
                "Unable to load your membership.",
                "error"
            );


            console.error(
                "Premium membership error:",
                error
            );

        }

    }


    /* =========================================================
       CHANGE RENEWAL
       ========================================================= */

    async function changeRenewal(
        action
    ) {

        /*
         * Complimentary members can never reach
         * Stripe renewal actions.
         */

        if (
            busy ||
            !latest?.hasStripeSubscription ||
            !latest?.hasPaidPremium
        ) {

            return;

        }


        const reactivate =
            action ===
            "reactivate";


        const date =
            formatDate(
                latest.paidThrough
            );


        const explanation =
            reactivate
                ? (
                    "Keep your subscription? It will renew at $7.90 USD on " +
                    `${date} and monthly after that until you cancel.`
                )
                : (
                    "Turn off automatic renewal? You'll retain Premium until " +
                    `${date}, with no further automatic charge.`
                );


        if (
            !window.confirm(
                explanation
            )
        ) {

            return;

        }


        setBusy(
            true
        );


        showMessage(
            "Updating your renewal preference…"
        );


        try {

            const result =
                await account(
                    action
                );


            if (
                !result?.success
            ) {

                throw new Error(
                    "Stripe did not confirm the update."
                );

            }


            render(
                result
            );


            showMessage(
                reactivate
                    ? "Monthly renewal is now enabled."
                    : "Automatic renewal is off; your paid access is unchanged.",
                "success"
            );


        } catch (
        error
        ) {

            showMessage(
                error.message ||
                "Unable to update renewal.",
                "error"
            );


        } finally {

            setBusy(
                false
            );

        }

    }


    /* =========================================================
       EVENTS
       ========================================================= */

    ui.subscribe
        ?.addEventListener(
            "click",
            () => {

                window.location.assign(
                    "/premium.html"
                );

            }
        );


    ui.restart
        ?.addEventListener(
            "click",
            () => {

                if (
                    busy ||
                    !latest
                ) {

                    return;

                }


                const plan =
                    latest.plan ===
                        "pass"
                        ? "pass"
                        : "recurring";


                window.location.assign(
                    `/premium-checkout.html?plan=${plan}`
                );

            }
        );


    ui.cancel
        ?.addEventListener(
            "click",
            () =>
                changeRenewal(
                    "cancel"
                )
        );


    ui.reactivate
        ?.addEventListener(
            "click",
            () =>
                changeRenewal(
                    "reactivate"
                )
        );


    ui.updatePayment
        ?.addEventListener(
            "click",
            async () => {

                if (
                    busy ||
                    !latest?.hasStripeSubscription
                ) {

                    return;

                }


                setBusy(
                    true
                );


                showMessage(
                    "Opening Stripe's secure payment settings…"
                );


                try {

                    const result =
                        await account(
                            "payment_method"
                        );


                    const target =
                        new URL(
                            result.url
                        );


                    if (
                        target.protocol !==
                        "https:" ||
                        ![
                            "billing.stripe.com",
                            "portal.stripe.com"
                        ]
                            .includes(
                                target.hostname
                            )
                    ) {

                        throw new Error(
                            "Unexpected billing portal URL."
                        );

                    }


                    window.location.assign(
                        target.toString()
                    );


                } catch (
                error
                ) {

                    showMessage(
                        error.message ||
                        "Unable to open payment settings.",
                        "error"
                    );


                    setBusy(
                        false
                    );

                }

            }
        );


    /* =========================================================
       INITIAL LOAD
       ========================================================= */

    premiumTab
        ?.addEventListener(
            "click",
            loadMembership
        );


    if (
        new URLSearchParams(
            window.location.search
        )
            .get(
                "premium"
            ) ===
        "1"
    ) {

        premiumTab
            ?.click();

    } else {

        loadMembership();

    }

})();