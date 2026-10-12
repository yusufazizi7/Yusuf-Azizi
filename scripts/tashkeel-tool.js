document.addEventListener(
    "DOMContentLoaded",
    async () => {


        /* =====================================================
           CONFIGURATION
           ===================================================== */

        const API_ENDPOINT =
            "https://islamicqalam-tashkeel-api-649788023515.asia-northeast3.run.app/api/tashkeel";


        const MAX_CHARACTERS =
            10000;



        /* =====================================================
           ELEMENTS
           ===================================================== */

        const input =
            document.getElementById(
                "tashkeelInput"
            );


        const output =
            document.getElementById(
                "tashkeelOutput"
            );


        const inputCount =
            document.getElementById(
                "tashkeelInputCount"
            );


        const outputCount =
            document.getElementById(
                "tashkeelOutputCount"
            );


        const addButton =
            document.getElementById(
                "addTashkeelButton"
            );


        const addButtonText =
            document.getElementById(
                "addTashkeelButtonText"
            );


        const addButtonIcon =
            document.getElementById(
                "tashkeelButtonIcon"
            );


        const buttonSpinner =
            document.getElementById(
                "tashkeelButtonSpinner"
            );


        const clearInputButton =
            document.getElementById(
                "clearTashkeelInput"
            );


        const clearOutputButton =
            document.getElementById(
                "clearTashkeelOutput"
            );


        const pasteButton =
            document.getElementById(
                "pasteTashkeelInput"
            );


        const copyButton =
            document.getElementById(
                "copyTashkeelOutput"
            );


        const copyText =
            document.getElementById(
                "copyTashkeelText"
            );


        const status =
            document.getElementById(
                "tashkeelStatus"
            );


        const statusText =
            document.getElementById(
                "tashkeelStatusText"
            );


        const message =
            document.getElementById(
                "tashkeelMessage"
            );


        const accountState =
            document.getElementById(
                "toolAccountState"
            );


        const accountText =
            document.getElementById(
                "toolAccountText"
            );


        const accessNotice =
            document.getElementById(
                "tashkeelAccessNotice"
            );


        const accessIcon =
            document.getElementById(
                "tashkeelAccessIcon"
            );


        const accessTitle =
            document.getElementById(
                "tashkeelAccessTitle"
            );


        const accessText =
            document.getElementById(
                "tashkeelAccessText"
            );


        const accessLink =
            document.getElementById(
                "tashkeelAccessLink"
            );


        const currentYear =
            document.getElementById(
                "current-year"
            );



        /* =====================================================
           STATE
           ===================================================== */

        let supabaseClient =
            null;


        let currentSession =
            null;


        let isProcessing =
            false;



        /* =====================================================
           YEAR
           ===================================================== */

        if (
            currentYear
        ) {

            currentYear.textContent =
                new Date()
                    .getFullYear();

        }



        /* =====================================================
           SUPABASE
           ===================================================== */

        function getSupabaseClient() {

            if (
                window.supabaseClient
                &&
                window.supabaseClient.auth
            ) {

                return window.supabaseClient;

            }


            /*
             * Allows the script to keep working if the
             * client is exposed under another global name
             * in the future.
             */

            if (
                window.iqSupabase
                &&
                window.iqSupabase.auth
            ) {

                return window.iqSupabase;

            }


            return null;

        }



        async function waitForSupabaseClient(
            timeout = 5000
        ) {

            const start =
                Date.now();


            while (
                Date.now() - start
                <
                timeout
            ) {

                const client =
                    getSupabaseClient();


                if (
                    client
                ) {

                    return client;

                }


                await new Promise(
                    resolve =>
                        window.setTimeout(
                            resolve,
                            100
                        )
                );

            }


            return null;

        }



        async function refreshSession() {

            supabaseClient =
                await waitForSupabaseClient();


            if (
                !supabaseClient
            ) {

                currentSession =
                    null;


                setAccountState(
                    "error",
                    "Account unavailable"
                );


                showMessage(
                    "Islamic Qalam account services could not be loaded.",
                    "error"
                );


                updateSubmitButton();

                return;

            }


            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .auth
                        .getSession();


                if (
                    error
                ) {

                    throw error;

                }


                currentSession =
                    data?.session
                    ||
                    null;


                syncSessionInterface();


            } catch (
            error
            ) {

                console.error(
                    "Unable to read Supabase session:",
                    error
                );


                currentSession =
                    null;


                setAccountState(
                    "error",
                    "Account error"
                );


                updateSubmitButton();

            }

        }



        function syncSessionInterface() {

            if (
                currentSession
            ) {

                setAccountState(
                    "ready",
                    "Signed in"
                );


                hideAccessNotice();


            } else {

                setAccountState(
                    "error",
                    "Login required"
                );


                showAccessNotice(
                    "login"
                );

            }


            updateSubmitButton();

        }



        /* =====================================================
           ACCOUNT STATE
           ===================================================== */

        function setAccountState(
            state,
            text
        ) {

            if (
                !accountState
                ||
                !accountText
            ) {
                return;
            }


            accountState
                .classList
                .remove(
                    "is-ready",
                    "is-premium",
                    "is-error"
                );


            if (
                state
            ) {

                accountState
                    .classList
                    .add(
                        `is-${state}`
                    );

            }


            accountText.textContent =
                text;

        }



        /* =====================================================
           ACCESS NOTICE
           ===================================================== */

        function hideAccessNotice() {

            if (
                accessNotice
            ) {

                accessNotice.hidden =
                    true;

            }

        }



        function showAccessNotice(
            type
        ) {

            if (
                !accessNotice
            ) {
                return;
            }


            accessNotice.hidden =
                false;


            if (
                type ===
                "login"
            ) {

                if (
                    accessIcon
                ) {

                    accessIcon.className =
                        "fa-solid fa-right-to-bracket";

                }


                if (
                    accessTitle
                ) {

                    accessTitle.textContent =
                        "Login required";

                }


                if (
                    accessText
                ) {

                    accessText.textContent =
                        "Log in to your Islamic Qalam account to use the Premium Tashkeel tool.";

                }


                if (
                    accessLink
                ) {

                    accessLink.href =
                        "/login.html?redirect=/tools/tashkeel.html";

                    accessLink.textContent =
                        "Login";

                }


                return;

            }


            if (
                type ===
                "premium"
            ) {

                if (
                    accessIcon
                ) {

                    accessIcon.className =
                        "fa-solid fa-crown";

                }


                if (
                    accessTitle
                ) {

                    accessTitle.textContent =
                        "Islamic Qalam Premium required";

                }


                if (
                    accessText
                ) {

                    accessText.textContent =
                        "Your account is signed in, but an active Premium membership is required to use this tool.";

                }


                if (
                    accessLink
                ) {

                    accessLink.href =
                        "/premium.html";

                    accessLink.textContent =
                        "View Premium";

                }

            }

        }



        /* =====================================================
           CHARACTER COUNTS
           ===================================================== */

        function formatCount(
            number
        ) {

            return (
                `${number.toLocaleString()} ` +
                (
                    number === 1
                        ? "character"
                        : "characters"
                )
            );

        }



        function updateInputCount() {

            if (
                !input
                ||
                !inputCount
            ) {
                return;
            }


            const count =
                input.value.length;


            inputCount.textContent =
                formatCount(
                    count
                );


            updateSubmitButton();

        }



        function updateOutputCount() {

            if (
                !output
                ||
                !outputCount
            ) {
                return;
            }


            outputCount.textContent =
                formatCount(
                    output.value.length
                );


            if (
                copyButton
            ) {

                copyButton.disabled =
                    !output.value.trim();

            }

        }



        /* =====================================================
           SUBMIT BUTTON STATE
           ===================================================== */

        function updateSubmitButton() {

            if (
                !addButton
            ) {
                return;
            }


            const hasText =
                Boolean(
                    input?.value.trim()
                );


            addButton.disabled =
                (
                    isProcessing
                    ||
                    !currentSession
                    ||
                    !hasText
                );

        }



        /* =====================================================
           STATUS
           ===================================================== */

        function setStatus(
            state,
            text
        ) {

            if (
                !status
                ||
                !statusText
            ) {
                return;
            }


            status
                .classList
                .remove(
                    "is-processing",
                    "is-success",
                    "is-error"
                );


            if (
                state
            ) {

                status
                    .classList
                    .add(
                        `is-${state}`
                    );

            }


            statusText.textContent =
                text;

        }



        /* =====================================================
           MESSAGES
           ===================================================== */

        function hideMessage() {

            if (
                !message
            ) {
                return;
            }


            message.hidden =
                true;


            message.textContent =
                "";


            message
                .classList
                .remove(
                    "is-error",
                    "is-success"
                );

        }



        function showMessage(
            text,
            type = ""
        ) {

            if (
                !message
            ) {
                return;
            }


            message.textContent =
                text;


            message.hidden =
                false;


            message
                .classList
                .remove(
                    "is-error",
                    "is-success"
                );


            if (
                type
            ) {

                message
                    .classList
                    .add(
                        `is-${type}`
                    );

            }

        }



        /* =====================================================
           PROCESSING STATE
           ===================================================== */

        function setProcessing(
            processing
        ) {

            isProcessing =
                processing;


            if (
                input
            ) {

                input.readOnly =
                    processing;

            }


            if (
                pasteButton
            ) {

                pasteButton.disabled =
                    processing;

            }


            if (
                clearInputButton
            ) {

                clearInputButton.disabled =
                    processing;

            }


            if (
                buttonSpinner
            ) {

                buttonSpinner.hidden =
                    !processing;

            }


            if (
                addButtonIcon
            ) {

                addButtonIcon.hidden =
                    processing;

            }


            if (
                addButtonText
            ) {

                addButtonText.textContent =
                    processing
                        ? "Adding Tashkeel..."
                        : "Add Tashkeel";

            }


            if (
                processing
            ) {

                setStatus(
                    "processing",
                    "Processing"
                );

            }


            updateSubmitButton();

        }



        /* =====================================================
           VALIDATION
           ===================================================== */

        function validateInput() {

            if (
                !input
            ) {

                return false;

            }


            const text =
                input.value;


            if (
                !text.trim()
            ) {

                showMessage(
                    "Enter some Arabic text first.",
                    "error"
                );


                input.focus();

                return false;

            }


            if (
                text.length >
                MAX_CHARACTERS
            ) {

                showMessage(
                    `The maximum is ${MAX_CHARACTERS.toLocaleString()} characters per request.`,
                    "error"
                );


                return false;

            }


            const containsArabic =
                /[\u0600-\u06FF]/.test(
                    text
                );


            if (
                !containsArabic
            ) {

                showMessage(
                    "The text must contain Arabic.",
                    "error"
                );


                return false;

            }


            return true;

        }



        /* =====================================================
           GET FRESH ACCESS TOKEN
           ===================================================== */

        async function getAccessToken() {

            if (
                !supabaseClient
            ) {

                throw new Error(
                    "Islamic Qalam account services are unavailable."
                );

            }


            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .getSession();


            if (
                error
            ) {

                throw error;

            }


            currentSession =
                data?.session
                ||
                null;


            if (
                !currentSession
            ) {

                syncSessionInterface();


                throw new Error(
                    "Please log in to Islamic Qalam to use this tool."
                );

            }


            return currentSession
                .access_token;

        }



        /* =====================================================
           API REQUEST
           ===================================================== */

        async function requestTashkeel(
            text
        ) {

            const accessToken =
                await getAccessToken();


            const response =
                await fetch(
                    API_ENDPOINT,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${accessToken}`

                        },

                        body:
                            JSON.stringify({

                                text:
                                    text

                            })

                    }
                );


            let result =
                null;


            try {

                result =
                    await response.json();

            } catch {

                throw new Error(
                    "The Tashkeel server returned an invalid response."
                );

            }


            if (
                response.status ===
                401
            ) {

                currentSession =
                    null;


                syncSessionInterface();


                throw new Error(
                    "Please log in to Islamic Qalam to use this tool."
                );

            }


            if (
                response.status ===
                403
            ) {

                setAccountState(
                    "error",
                    "Premium required"
                );


                showAccessNotice(
                    "premium"
                );


                throw new Error(
                    "Islamic Qalam Premium is required to use this tool."
                );

            }


            if (
                response.status ===
                429
            ) {

                throw new Error(
                    "Too many requests. Please wait a moment and try again."
                );

            }


            if (
                !response.ok
            ) {

                throw new Error(
                    result?.error
                    ||
                    result?.message
                    ||
                    "Unable to process the Arabic text."
                );

            }


            if (
                typeof result?.text
                !==
                "string"
            ) {

                throw new Error(
                    "The server did not return a valid Tashkeel result."
                );

            }


            return result.text;

        }



        /* =====================================================
           RUN TASHKEEL
           ===================================================== */

        async function addTashkeel() {

            hideMessage();


            if (
                !currentSession
            ) {

                showAccessNotice(
                    "login"
                );


                return;

            }


            if (
                !validateInput()
            ) {

                return;

            }


            const sourceText =
                input.value;


            setProcessing(
                true
            );


            try {

                const result =
                    await requestTashkeel(
                        sourceText
                    );


                if (
                    output
                ) {

                    output.value =
                        result;

                }


                updateOutputCount();


                setStatus(
                    "success",
                    "Complete"
                );


                setAccountState(
                    "premium",
                    "Premium verified"
                );


                hideAccessNotice();


                showMessage(
                    "Tashkeel added successfully.",
                    "success"
                );


            } catch (
            error
            ) {

                console.error(
                    "Tashkeel request failed:",
                    error
                );


                setStatus(
                    "error",
                    "Error"
                );


                showMessage(
                    error?.message
                    ||
                    "Something went wrong while adding tashkeel.",
                    "error"
                );


            } finally {

                setProcessing(
                    false
                );

            }

        }



        /* =====================================================
           INPUT
           ===================================================== */

        input
            ?.addEventListener(
                "input",
                () => {

                    updateInputCount();

                    hideMessage();

                }
            );



        /* =====================================================
           CLEAR INPUT
           ===================================================== */

        clearInputButton
            ?.addEventListener(
                "click",
                () => {

                    if (
                        !input
                    ) {
                        return;
                    }


                    input.value =
                        "";


                    updateInputCount();

                    hideMessage();


                    input.focus();

                }
            );



        /* =====================================================
           CLEAR OUTPUT
           ===================================================== */

        clearOutputButton
            ?.addEventListener(
                "click",
                () => {

                    if (
                        !output
                    ) {
                        return;
                    }


                    output.value =
                        "";


                    updateOutputCount();

                    hideMessage();

                }
            );



        /* =====================================================
           PASTE
           ===================================================== */

        pasteButton
            ?.addEventListener(
                "click",
                async () => {

                    if (
                        !input
                    ) {
                        return;
                    }


                    try {

                        const clipboardText =
                            await navigator
                                .clipboard
                                .readText();


                        if (
                            !clipboardText
                        ) {

                            showMessage(
                                "There is no text available to paste.",
                                "error"
                            );


                            return;

                        }


                        input.value =
                            clipboardText
                                .slice(
                                    0,
                                    MAX_CHARACTERS
                                );


                        updateInputCount();

                        hideMessage();

                        input.focus();


                    } catch (
                    error
                    ) {

                        console.error(
                            "Clipboard error:",
                            error
                        );


                        showMessage(
                            "Clipboard access was blocked. Paste your text manually instead.",
                            "error"
                        );

                    }

                }
            );



        /* =====================================================
           COPY OUTPUT
           ===================================================== */

        copyButton
            ?.addEventListener(
                "click",
                async () => {

                    if (
                        !output?.value
                    ) {

                        return;

                    }


                    try {

                        await navigator
                            .clipboard
                            .writeText(
                                output.value
                            );


                        if (
                            copyText
                        ) {

                            copyText.textContent =
                                "Copied";

                        }


                        window.setTimeout(
                            () => {

                                if (
                                    copyText
                                ) {

                                    copyText.textContent =
                                        "Copy Result";

                                }

                            },
                            1500
                        );


                    } catch (
                    error
                    ) {

                        console.error(
                            "Copy failed:",
                            error
                        );


                        output.focus();

                        output.select();


                        showMessage(
                            "Automatic copying was blocked. The result has been selected so you can copy it manually.",
                            "error"
                        );

                    }

                }
            );



        /* =====================================================
           SUBMIT BUTTON
           ===================================================== */

        addButton
            ?.addEventListener(
                "click",
                addTashkeel
            );



        /* =====================================================
           CTRL / CMD + ENTER
           ===================================================== */

        input
            ?.addEventListener(
                "keydown",
                event => {

                    const submitShortcut =
                        (
                            event.ctrlKey
                            ||
                            event.metaKey
                        )
                        &&
                        event.key ===
                        "Enter";


                    if (
                        !submitShortcut
                    ) {

                        return;

                    }


                    event.preventDefault();


                    if (
                        !addButton?.disabled
                    ) {

                        addTashkeel();

                    }

                }
            );



        /* =====================================================
           AUTH STATE CHANGES
           ===================================================== */

        await refreshSession();


        if (
            supabaseClient
        ) {

            supabaseClient
                .auth
                .onAuthStateChange(
                    (
                        event,
                        session
                    ) => {

                        currentSession =
                            session
                            ||
                            null;


                        syncSessionInterface();

                    }
                );

        }



        /* =====================================================
           INITIAL STATE
           ===================================================== */

        updateInputCount();

        updateOutputCount();


        setStatus(
            "",
            "Ready"
        );

    }
);