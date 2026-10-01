/* Islamic Qalam — Premium word-by-word tooltips.
 * Reusable on any poem page with data-page-id. JSON NEVER belongs in /Scripts/.
 * This file contains no translations; it requests them from the authorised
 * get-poem-word-translations Edge Function for an active Premium member.
 */
(() => {
    "use strict";

    // One script for every poem: read its slug from the HTML page.
    const PAGE_SELECTOR = ".poem-page[data-page-id]";
    const PREMIUM_URL = "/premium.html";
    const LOGIN_URL = "/login.html";
    const DIACRITICS = /[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/gu;

    function arabicKey(value) {
        // Match words whose LETTERS agree even if the website and JSON use
        // different tashkeel. Different letters never receive a tooltip.
        return String(value).normalize("NFC").replace(DIACRITICS, "");
    }

    async function initialise() {

        if (
            window.iqEarlyAccessPoemReady
        ) {

            const contentReady =
                await window
                    .iqEarlyAccessPoemReady;


            if (!contentReady) {
                return;
            }

        }
        
        const page = document.querySelector(PAGE_SELECTOR);
        const POEM = page?.dataset.pageId;
        const toggle = document.getElementById("iq-words-toggle");
        const status = document.getElementById("iq-words-status");
        const cta = document.getElementById("iq-words-cta");
        const switchVisual = document.getElementById("iq-words-switch");
        const modal = document.getElementById("iq-words-premium-modal");
        const dialog = modal?.querySelector(".iq-premium-dialog");
        const closeModalButton = document.getElementById("iq-words-modal-close");
        const laterButton = document.getElementById("iq-words-modal-later");
        const modalBackdrop = document.getElementById("iq-words-modal-backdrop");
        const client = window.supabaseClient;
        if (!page || !POEM || !toggle || !status || !cta || !switchVisual || !modal || !dialog) return;

        const paragraphs = [...page.querySelectorAll(".poem-container > .poem-verse > .arabic-text")];
        const tooltip = document.createElement("div");
        tooltip.id = "iq-word-tooltip";
        tooltip.className = "iq-word-tooltip";
        tooltip.setAttribute("role", "tooltip");
        tooltip.hidden = true;
        document.body.appendChild(tooltip);

        let glosses = null;
        let annotated = [];
        let wordSpans = [];
        let meanings = new WeakMap();
        let displayedWord = null;
        let pinnedWord = null;
        let authorisedUntil = 0;
        let enabled = false;
        let requestVersion = 0;
        let currentAccountId = null;
        let accessState = "checking"; // checking | premium | signedOut | upgrade | error
        let previousFocus = null;
        const preferencePrefix = "iq-premium-words:";

        function message(text) {
            status.textContent = text;
        }

        function updateControl(state) {
            accessState = state;
            const canSwitch = state === "premium";
            cta.hidden = canSwitch || state === "checking" || state === "error";
            switchVisual.hidden = !canSwitch && state !== "checking" && state !== "error";
            toggle.disabled = state === "checking";
            toggle.dataset.access = state;
            toggle.setAttribute("aria-checked", String(canSwitch && enabled));
            if (state === "signedOut" || state === "upgrade") {
                toggle.setAttribute("aria-label", "Word-by-word meanings: Get Premium");
            } else {
                toggle.removeAttribute("aria-label");
            }
        }

        function savePreference(value) {
            if (!currentAccountId) return;
            try { localStorage.setItem(preferencePrefix + currentAccountId, String(value)); }
            catch { /* The switch still works when localStorage is disabled. */ }
        }

        function readPreference() {
            if (!currentAccountId) return true;

            try {
                const saved = localStorage.getItem(preferencePrefix + currentAccountId);

                // Premium users get word meanings ON by default.
                // After they manually change it, remember their choice.
                return saved === null ? true : saved === "true";
            } catch {
                // If localStorage is unavailable, default Premium users to ON.
                return true;
            }
        }

        function openPremiumModal() {
            previousFocus = document.activeElement;
            modal.hidden = false;
            document.body.classList.add("iq-premium-modal-open");
            // The primary action is an ordinary link and preserves the login redirect.
            document.getElementById("iq-words-modal-login")?.focus();
        }

        function closePremiumModal() {
            if (modal.hidden) return;
            modal.hidden = true;
            document.body.classList.remove("iq-premium-modal-open");
            (previousFocus?.isConnected ? previousFocus : toggle)?.focus();
        }

        closeModalButton?.addEventListener("click", closePremiumModal);
        laterButton?.addEventListener("click", closePremiumModal);
        modalBackdrop?.addEventListener("click", closePremiumModal);
        modal.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                event.preventDefault(); closePremiumModal(); return;
            }
            if (event.key !== "Tab") return;
            const focusables = [...modal.querySelectorAll('a[href], button:not([disabled])')]
                .filter(element => !element.hidden);
            const first = focusables[0], last = focusables.at(-1);
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault(); last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault(); first?.focus();
            }
        });

        function positionTooltip(word) {
            if (!word || tooltip.hidden) return;
            const box = word.getBoundingClientRect();
            const tip = tooltip.getBoundingClientRect();
            const gap = 12;
            const x = Math.max(10, Math.min(
                window.innerWidth - tip.width - 10,
                box.left + (box.width - tip.width) / 2
            ));
            const above = box.top >= tip.height + gap + 8;
            const y = above ? box.top - tip.height - gap : box.bottom + gap;
            tooltip.classList.toggle("iq-tooltip-below", !above);
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${Math.max(8, Math.min(window.innerHeight - tip.height - 8, y))}px`;
        }

        function hideTooltip() {
            if (displayedWord) displayedWord.classList.remove("iq-word-selected");
            displayedWord = null;
            pinnedWord = null;
            tooltip.hidden = true;
        }

        function hasValidTranslations() {
            if (!glosses) return false;
            if (authorisedUntil && Date.now() >= authorisedUntil) {
                // This is a UI clean-up, not a security control; the Edge
                // Function independently verifies membership every request.
                revokeTranslations(
                    "Your Premium access has ended. Renew Premium to use word meanings."
                );
                return false;
            }
            return true;
        }

        function canShow() {
            return enabled && hasValidTranslations();
        }

        function showTooltip(word, pinned = false) {
            if (!canShow()) return;
            const meaning = meanings.get(word);
            if (!meaning) return;
            if (displayedWord) displayedWord.classList.remove("iq-word-selected");
            displayedWord = word;
            if (pinned) pinnedWord = word;
            tooltip.textContent = meaning; // Never inject translation JSON as HTML.
            tooltip.hidden = false;
            word.classList.add("iq-word-selected");
            positionTooltip(word);
        }

        function unwrapWords() {
            hideTooltip();
            for (const { paragraph, original } of annotated) {
                // Our annotated paragraphs originally contained only text.
                // Other poem controls (copy menu, font and verse numbers)
                // operate on the containing paragraph, not its child spans.
                paragraph.textContent = original;
            }
            annotated = [];
            wordSpans = [];
            meanings = new WeakMap();
        }

        function annotateVerses(verses) {
            unwrapWords();
            let success = 0;
            let missing = 0;
            paragraphs.forEach((paragraph, verseIndex) => {
                const number = String(verseIndex + 1);
                const pairs = verses[number];
                const source = paragraph.textContent;
                const matches = [...source.matchAll(/[^\s*]+/gu)];
                if (!Array.isArray(pairs) || matches.length !== pairs.length ||
                    pairs.some((entry, index) => !Array.isArray(entry) ||
                        typeof entry[0] !== "string" || typeof entry[1] !== "string" ||
                        !entry[1].trim() || arabicKey(entry[0]) !== arabicKey(matches[index][0]))) {
                    missing += 1;
                    console.warn(`Islamic Qalam: word alignment needs review in verse ${number}.`);
                    return;
                }
                if (paragraph.childElementCount) {
                    missing += 1;
                    console.warn(`Islamic Qalam: verse ${number} has other nested markup; left untouched.`);
                    return;
                }
                const fragment = document.createDocumentFragment();
                let previousEnd = 0;
                matches.forEach((match, index) => {
                    fragment.appendChild(document.createTextNode(source.slice(previousEnd, match.index)));
                    const span = document.createElement("span");
                    span.className = "iq-word";
                    span.lang = "ar";
                    span.dir = "rtl";
                    span.textContent = match[0];
                    span.setAttribute("role", "button");
                    span.setAttribute("aria-describedby", tooltip.id);
                    span.setAttribute("aria-label", `${match[0]}: ${pairs[index][1]}`);
                    span.tabIndex = -1;
                    meanings.set(span, pairs[index][1]);
                    wordSpans.push(span);
                    fragment.appendChild(span);
                    previousEnd = match.index + match[0].length;
                    success += 1;
                });
                fragment.appendChild(document.createTextNode(source.slice(previousEnd)));
                annotated.push({ paragraph, original: source });
                paragraph.replaceChildren(fragment);
            });
            if (wordSpans.length) wordSpans[0].tabIndex = 0;
            if (!wordSpans.length) throw new Error("No Arabic words could be matched to the JSON.");
            return { success, missing };
        }

        function setEnabled(next, persist = true) {
            if (!glosses) return;
            enabled = next;
            if (next) {
                const counts = annotateVerses(glosses);
                message(counts.missing
                    ? `Meanings active for ${counts.success} words. ${counts.missing} verse(s) need alignment.`
                    : "Hover or tap Arabic words to see their contextual meanings.");
            } else {
                unwrapWords();
                message("Word meanings are off. Turn them on whenever you like.");
            }
            toggle.setAttribute("aria-checked", String(next));
            if (persist) savePreference(next);
            updateControl("premium");
        }

        function revokeTranslations(reason, nextState = "upgrade") {
            requestVersion += 1; // Discard an old response still in flight.
            enabled = false;
            glosses = null;
            authorisedUntil = 0;
            unwrapWords();
            closePremiumModal();
            updateControl(nextState);
            message(reason || "Word-by-word meanings are exclusively for Premium members.");
        }

        async function checkMembership() {
            const callVersion = ++requestVersion;
            enabled = false;
            glosses = null;
            authorisedUntil = 0;
            unwrapWords();
            updateControl("checking");
            message("Checking Premium membership…");

            if (!client?.auth?.getSession || !client?.functions?.invoke) {
                updateControl("error");
                message("Membership check unavailable. Click to retry.");
                return;
            }

            let session;
            try {
                const result = await client.auth.getSession();
                if (result.error) throw result.error;
                session = result.data?.session;
            } catch (error) {
                if (callVersion !== requestVersion) return;
                console.warn("Premium words: could not read sign-in state:", error);
                updateControl("error");
                message("Unable to check your account. Click to retry.");
                return;
            }
            if (callVersion !== requestVersion) return;
            currentAccountId = session?.user?.id ?? null;
            if (!currentAccountId) {
                updateControl("signedOut");
                message("Get Premium to unlock contextual word meanings.");
                return;
            }

            try {
                const { data, error } = await client.functions.invoke(
                    "get-poem-word-translations", { body: { poem: POEM } }
                );
                if (callVersion !== requestVersion) return;
                if (error) {
                    const httpStatus = error.context?.status;
                    if (httpStatus === 401 || httpStatus === 403) {
                        revokeTranslations(httpStatus === 401
                            ? "Sign in to unlock word-by-word translations."
                            : "Get Premium to unlock word-by-word translations.",
                            httpStatus === 401 ? "signedOut" : "upgrade");
                        return;
                    }
                    throw error;
                }
                if (data?.code === "PREMIUM_REQUIRED") {
                    revokeTranslations("Get Premium to unlock word-by-word translations.");
                    return;
                }
                if (data?.poem !== POEM || !data.verses || typeof data.verses !== "object") {
                    throw new Error("Unexpected translation response.");
                }
                const accessUntil =
                    data.paidThrough ??
                    data.complimentaryUntil ??
                    null;


                const expiry =
                    new Date(
                        accessUntil ?? ""
                    )
                        .getTime();


                if (
                    !Number.isFinite(
                        expiry
                    ) ||
                    expiry <= Date.now()
                ) {

                    revokeTranslations(
                        "Your Premium membership is not currently active."
                    );

                    return;

                }


                authorisedUntil =
                    expiry;

                
                glosses = data.verses;
                updateControl("premium");
                setEnabled(readPreference(), false);
            } catch (error) {
                if (callVersion !== requestVersion) return;
                console.warn("Premium words could not be loaded:", error);
                updateControl("error");
                message("Word meanings couldn't be loaded. Click to retry.");
            }
        }

        toggle.addEventListener("click", () => {
            if (accessState === "signedOut") {
                openPremiumModal();
            } else if (accessState === "upgrade") {
                window.location.assign(PREMIUM_URL);
            } else if (accessState === "premium" && glosses) {
                if (hasValidTranslations()) setEnabled(!enabled);
            } else if (accessState === "error") {
                void checkMembership();
            }
        });

        page.addEventListener("pointerover", event => {
            if (event.pointerType === "touch" || pinnedWord) return;
            const word = event.target.closest?.(".iq-word");
            if (word && page.contains(word)) showTooltip(word);
        });
        page.addEventListener("pointerout", event => {
            if (pinnedWord) return;
            if (event.target.closest?.(".iq-word")) hideTooltip();
        });
        page.addEventListener("click", event => {
            const word = event.target.closest?.(".iq-word");
            if (!word || !page.contains(word)) return;
            if (pinnedWord === word) hideTooltip();
            else showTooltip(word, true);
        });
        document.addEventListener("pointerdown", event => {
            if (!event.target.closest?.(".iq-word")) hideTooltip();
        });
        page.addEventListener("focusin", event => {
            const word = event.target.closest?.(".iq-word");
            if (word) {
                const old = wordSpans.find(span => span.tabIndex === 0);
                if (old && old !== word) old.tabIndex = -1;
                word.tabIndex = 0;
                showTooltip(word);
            }
        });
        page.addEventListener("focusout", event => {
            if (event.target.closest?.(".iq-word") && !pinnedWord) hideTooltip();
        });
        page.addEventListener("keydown", event => {
            const word = event.target.closest?.(".iq-word");
            if (!word) return;
            if (event.key === "Escape") { hideTooltip(); return; }
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                pinnedWord === word ? hideTooltip() : showTooltip(word, true);
                return;
            }
            const move = event.key === "ArrowLeft" || event.key === "ArrowDown" ? 1
                : event.key === "ArrowRight" || event.key === "ArrowUp" ? -1 : 0;
            if (move) {
                event.preventDefault();
                const next = wordSpans[wordSpans.indexOf(word) + move];
                if (next) { pinnedWord = null; next.focus(); }
            }
        });
        window.addEventListener("resize", () => positionTooltip(displayedWord));
        window.addEventListener("scroll", () => positionTooltip(displayedWord), true);
        document.addEventListener("visibilitychange", () => {
            if (!document.hidden && glosses) canShow();
        });

        // A logout or switch of accounts immediately clears the translations
        // already delivered to this browser. In-flight requests are invalidated.
        client?.auth?.onAuthStateChange?.((event, session) => {
            const newId = session?.user?.id ?? null;
            if (event === "SIGNED_OUT" || (currentAccountId && newId && currentAccountId !== newId)) {
                currentAccountId = newId;
                revokeTranslations(event === "SIGNED_OUT"
                    ? "Get Premium to unlock word-by-word translations."
                    : "Your account changed. Checking your Premium membership.",
                    event === "SIGNED_OUT" ? "signedOut" : "checking");
                if (event !== "SIGNED_OUT") {
                    // Avoid querying Supabase inside its auth-change callback.
                    window.setTimeout(() => void checkMembership(), 0);
                }
            } else if (event === "SIGNED_IN" && newId && newId !== currentAccountId) {
                currentAccountId = newId;
                window.setTimeout(() => void checkMembership(), 0);
            }
        });

        void checkMembership();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialise, { once: true });
    } else {
        initialise();
    }
})();
