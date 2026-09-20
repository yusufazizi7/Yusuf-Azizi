const retrieveDownloadForm =
    document.getElementById(
        "retrieveDownloadForm"
    );

const retrieveEmail =
    document.getElementById(
        "retrieveEmail"
    );

const retrieveMessage =
    document.getElementById(
        "retrieveMessage"
    );

const retrieveButton =
    document.getElementById(
        "retrieveButton"
    );


function showRetrieveMessage(
    message,
    type
) {

    retrieveMessage.textContent =
        message;

    retrieveMessage.className =
        `retrieve-message ${type}`;

    retrieveMessage.hidden =
        false;

}


function isValidEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            email
        );

}


retrieveDownloadForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            retrieveEmail.value
                .trim();


        retrieveMessage.hidden =
            true;


        if (
            !isValidEmail(email)
        ) {

            showRetrieveMessage(
                "Please enter a valid email address.",
                "error"
            );

            retrieveEmail.focus();

            return;

        }


        const previousHTML =
            retrieveButton.innerHTML;


        retrieveButton.disabled =
            true;


        retrieveButton.innerHTML = `
            <i
                class="fa-solid fa-circle-notch fa-spin"
                aria-hidden="true"
            ></i>

            Checking purchases...
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
                        "retrieve-ebook-downloads",
                        {
                            body: {
                                email
                            }
                        }
                    );


            if (error) {

                console.error(
                    "Retrieve purchase function error:",
                    error
                );

                throw error;

            }


            if (
                data?.status ===
                "not_found"
            ) {

                showRetrieveMessage(
                    data.message ||
                    "No e-books were purchased with this email address.",
                    "error"
                );

                return;

            }


            if (
                data?.status ===
                "sent"
            ) {

                showRetrieveMessage(
                    data.message ||
                    "Your download link has been sent to your email.",
                    "success"
                );

                return;

            }


            throw new Error(
                "Unexpected retrieval response."
            );

        } catch (error) {

            console.error(
                "Unable to retrieve downloads:",
                error
            );


            showRetrieveMessage(
                "We couldn't retrieve your download links. Please try again.",
                "error"
            );

        } finally {

            retrieveButton.disabled =
                false;

            retrieveButton.innerHTML =
                previousHTML;

        }

    }
);