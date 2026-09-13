/* =========================================================
   QUR'AN PAGE
   Search, availability filters, and unavailable-surah popup.
   ========================================================= */

const surahSearch =
    document.getElementById("surahSearch");

const surahLinks =
    Array.from(
        document.querySelectorAll(".surah-links")
    );

const surahFilters =
    Array.from(
        document.querySelectorAll(".surah-filter")
    );

const surahResultCount =
    document.getElementById("surahResultCount");

const availableSurahCount =
    document.getElementById("availableSurahCount");

const surahEmpty =
    document.getElementById("surahEmpty");

const surahPopup =
    document.getElementById("surahPopup");

const closeSurahPopupButton =
    document.getElementById("closeSurahPopup");

const surahPopupOkay =
    document.getElementById("surahPopupOkay");


let currentFilter =
    "all";


/* =========================================================
   HELPERS
   ========================================================= */

function normaliseSurahText(value) {

    return value
        .toLowerCase()
        .normalize("NFKD")

        // Remove Latin accent marks
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        // Remove Arabic harakat / Qur'anic marks
        .replace(
            /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g,
            ""
        )

        // Ignore apostrophe differences
        .replace(
            /['’‘]/g,
            ""
        )

        // Clean extra spaces
        .replace(
            /\s+/g,
            " "
        )

        .trim();

}


function isAvailableSurah(link) {

    const href =
        link.getAttribute("href");

    return Boolean(
        href &&
        href !== "#" &&
        !href.startsWith("javascript:")
    );

}


/* =========================================================
   INITIAL AVAILABILITY
   ========================================================= */

const availableLinks =
    surahLinks.filter(
        isAvailableSurah
    );


surahLinks.forEach((link) => {

    const available =
        isAvailableSurah(link);

    link.classList.toggle(
        "available",
        available
    );

    link.classList.toggle(
        "unavailable",
        !available
    );

    link.dataset.available =
        String(available);

});


if (availableSurahCount) {

    availableSurahCount.innerHTML =
        `
            <i
                class="fa-solid fa-book-open"
                aria-hidden="true">
            </i>

            ${availableLinks.length}
            ${availableLinks.length === 1
            ? "Surah"
            : "Surahs"
        }
            Available
        `;

}


/* =========================================================
   SEARCH + FILTER
   ========================================================= */

function updateSurahDirectory() {

    const query =
        normaliseSurahText(
            surahSearch?.value ?? ""
        );


    let visibleCount = 0;


    surahLinks.forEach((link) => {

        const searchableText =
            normaliseSurahText(
                link.textContent ?? ""
            );


        const matchesSearch =
            !query ||
            searchableText.includes(query);


        const matchesFilter =
            currentFilter === "all" ||
            (
                currentFilter === "available" &&
                link.dataset.available === "true"
            );


        const shouldShow =
            matchesSearch &&
            matchesFilter;


        link.hidden =
            !shouldShow;


        if (shouldShow) {
            visibleCount++;
        }

    });


    if (surahResultCount) {

        surahResultCount.textContent =
            `${visibleCount} ${visibleCount === 1
                ? "surah"
                : "surahs"
            }`;

    }


    if (surahEmpty) {

        surahEmpty.hidden =
            visibleCount !== 0;

    }

}


/* =========================================================
   SEARCH INPUT
   ========================================================= */

surahSearch?.addEventListener(
    "input",
    updateSurahDirectory
);


/* =========================================================
   FILTER BUTTONS
   ========================================================= */

surahFilters.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            currentFilter =
                button.dataset.filter ?? "all";


            surahFilters.forEach(
                (filterButton) => {

                    filterButton.classList.toggle(
                        "active",
                        filterButton === button
                    );

                }
            );


            updateSurahDirectory();

        }
    );

});


/* =========================================================
   UNAVAILABLE SURAH POPUP
   ========================================================= */

function openSurahPopup() {

    if (!surahPopup) {
        return;
    }


    surahPopup.classList.add(
        "active"
    );

    surahPopup.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    closeSurahPopupButton?.focus();

}


function closeSurahPopup() {

    if (!surahPopup) {
        return;
    }


    surahPopup.classList.remove(
        "active"
    );

    surahPopup.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   HANDLE UNAVAILABLE SURAH LINKS
   ========================================================= */

surahLinks.forEach((link) => {

    if (isAvailableSurah(link)) {
        return;
    }


    link.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            openSurahPopup();

        }
    );

});


/* =========================================================
   CLOSE POPUP BUTTONS
   ========================================================= */

closeSurahPopupButton?.addEventListener(
    "click",
    closeSurahPopup
);


surahPopupOkay?.addEventListener(
    "click",
    closeSurahPopup
);


/* =========================================================
   CLICK OUTSIDE POPUP
   ========================================================= */

surahPopup?.addEventListener(
    "click",
    (event) => {

        if (event.target === surahPopup) {

            closeSurahPopup();

        }

    }
);


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            surahPopup?.classList.contains("active")
        ) {

            closeSurahPopup();

        }

    }
);


/* =========================================================
   INITIALISE
   ========================================================= */

updateSurahDirectory();