/* =========================================================
   E-BOOK DOWNLOAD
   ========================================================= */


/* ================= ELEMENTS ================= */

const downloadLoading =
    document.getElementById(
        "downloadLoading"
    );

const downloadReady =
    document.getElementById(
        "downloadReady"
    );

const downloadError =
    document.getElementById(
        "downloadError"
    );

const downloadErrorText =
    document.getElementById(
        "downloadErrorText"
    );

const downloadBookTitle =
    document.getElementById(
        "downloadBookTitle"
    );

const downloadFileButtons =
    document.getElementById(
        "downloadFileButtons"
    );


/* ================= STATE ================= */

function showDownloadState(
    state
) {

    downloadLoading.hidden =
        state !== "loading";

    downloadReady.hidden =
        state !== "ready";

    downloadError.hidden =
        state !== "error";

}


/* =========================================================
   GET TOKEN
   ========================================================= */

function getDownloadToken() {

    /*
     * Normal links:
     *
     * download.html#token=...
     */

    const hash =
        window.location.hash
            .replace(
                /^#/,
                ""
            );


    const hashParameters =
        new URLSearchParams(
            hash
        );


    const hashToken =
        hashParameters.get(
            "token"
        );


    if (
        hashToken
    ) {

        return hashToken;

    }


    /*
     * Backwards compatibility:
     *
     * download.html?token=...
     */

    const queryParameters =
        new URLSearchParams(
            window.location.search
        );


    return queryParameters.get(
        "token"
    );

}


/* =========================================================
   REQUEST FILE DOWNLOAD
   ========================================================= */

async function downloadEbookFile(
    token,
    fileId,
    button
) {

    const originalHtml =
        button.innerHTML;


    button.disabled =
        true;


    button.innerHTML =
        `
        <i
            class="fa-solid fa-circle-notch fa-spin"
            aria-hidden="true">
        </i>

        Preparing download...
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
                    "get-ebook-download",
                    {
                        body: {
                            token,
                            fileId
                        }
                    }
                );


        if (
            error
        ) {

            console.error(
                error
            );

            throw error;

        }


        if (
            !data?.signedUrl
        ) {

            throw new Error(
                data?.error ||
                "Unable to prepare this file."
            );

        }


        /*
         * The Edge Function has now generated
         * a fresh 60-second Storage URL.
         */

        window.location.assign(
            data.signedUrl
        );


    } catch (
    error
    ) {

        console.error(
            "Unable to download file:",
            error
        );


        alert(
            "This file could not be downloaded. "
            + "The access link may have expired."
        );


    } finally {

        button.disabled =
            false;


        button.innerHTML =
            originalHtml;

    }

}


/* =========================================================
   CREATE FILE BUTTON
   ========================================================= */

function createDownloadButton(
    file,
    token
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "download-primary-button";


    const icon =
        document.createElement(
            "i"
        );


    icon.className =
        "fa-solid fa-download";


    icon.setAttribute(
        "aria-hidden",
        "true"
    );


    const label =
        document.createElement(
            "span"
        );


    label.textContent =
        file.label;


    button.append(
        icon,
        document.createTextNode(
            " "
        ),
        label
    );


    button.addEventListener(
        "click",

        () =>
            downloadEbookFile(
                token,
                file.id,
                button
            )
    );


    return button;

}


/* =========================================================
   VERIFY PURCHASE AND LOAD FILES
   ========================================================= */

async function prepareEbookDownload() {

    const token =
        getDownloadToken();


    if (
        !token
    ) {

        downloadErrorText.textContent =
            "This download link is missing its access token.";


        showDownloadState(
            "error"
        );


        return;

    }


    showDownloadState(
        "loading"
    );


    try {

        const {
            data,
            error
        } =
            await window
                .supabaseClient
                .functions
                .invoke(
                    "get-ebook-download",
                    {
                        body: {
                            token
                        }
                    }
                );


        if (
            error
        ) {

            console.error(
                error
            );


            throw error;

        }


        if (
            !data?.title ||
            !Array.isArray(
                data?.files
            ) ||
            data.files.length ===
            0
        ) {

            throw new Error(
                data?.error ||
                "Invalid download response."
            );

        }


        /* ================= TITLE ================= */

        downloadBookTitle.textContent =
            data.title;


        /* ================= FILE BUTTONS ================= */

        downloadFileButtons.replaceChildren();


        for (
            const file
            of data.files
        ) {

            downloadFileButtons.appendChild(
                createDownloadButton(
                    file,
                    token
                )
            );

        }


        showDownloadState(
            "ready"
        );


    } catch (
    error
    ) {

        console.error(
            "Unable to prepare e-book:",
            error
        );


        downloadErrorText.textContent =
            "This download link could not be verified. "
            + "If you believe this is an error, "
            + "please contact Islamic Qalam.";


        showDownloadState(
            "error"
        );

    }

}


/* ================= INITIALISE ================= */

prepareEbookDownload();