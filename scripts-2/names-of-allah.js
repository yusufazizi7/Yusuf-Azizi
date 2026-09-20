/* =========================================================
   NAMES OF ALLAH SEARCH
   ========================================================= */

const namesSearch =
    document.getElementById("namesSearch");

const namesRows =
    Array.from(
        document.querySelectorAll(".names-table tbody tr")
    );

const namesResultCount =
    document.getElementById("namesResultCount");

const namesEmpty =
    document.getElementById("namesEmpty");

const namesTableScroll =
    document.querySelector(".names-table-scroll");


function normaliseNamesSearch(value) {

    return value
        .toLowerCase()
        .normalize("NFKD")

        // Remove Latin accent marks
        .replace(/[\u0300-\u036f]/g, "")

        // Remove Arabic harakat / Qur'anic marks
        .replace(
            /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g,
            ""
        )

        // Ignore apostrophe differences
        .replace(/['’‘]/g, "")

        // Clean extra spaces
        .replace(/\s+/g, " ")
        .trim();

}


function updateNamesSearch() {

    const query =
        normaliseNamesSearch(
            namesSearch?.value ?? ""
        );


    let visibleCount = 0;


    namesRows.forEach((row) => {

        const searchableText =
            normaliseNamesSearch(
                row.textContent ?? ""
            );


        const matches =
            !query ||
            searchableText.includes(query);


        row.hidden =
            !matches;


        if (matches) {
            visibleCount++;
        }

    });


    /* ================= RESULT COUNT ================= */

    if (namesResultCount) {

        namesResultCount.textContent =
            `${visibleCount} ${visibleCount === 1
                ? "name"
                : "names"
            }`;

    }


    /* ================= EMPTY STATE ================= */

    if (namesEmpty) {

        namesEmpty.hidden =
            visibleCount !== 0;

    }


    /* ================= TABLE VISIBILITY ================= */

    if (namesTableScroll) {

        namesTableScroll.hidden =
            visibleCount === 0;

    }

}


/* ================= SEARCH INPUT ================= */

namesSearch?.addEventListener(
    "input",
    updateNamesSearch
);


/* ================= INITIALISE ================= */

updateNamesSearch();