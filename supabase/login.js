const forgotPasswordButton =
    document.getElementById(
        "forgotPasswordButton"
    );


const forgotPasswordPanel =
    document.getElementById(
        "forgotPasswordPanel"
    );


const resetEmail =
    document.getElementById(
        "resetEmail"
    );


const resetMessage =
    document.getElementById(
        "resetMessage"
    );


const sendResetButton =
    document.getElementById(
        "sendResetButton"
    );


const cancelResetButton =
    document.getElementById(
        "cancelResetButton"
    );

const loginForm =
    document.getElementById(
        "loginForm"
    );


const identifierInput =
    document.getElementById(
        "identifier"
    );


const passwordInput =
    document.getElementById(
        "password"
    );


const loginButton =
    document.getElementById(
        "loginButton"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );



/* ================================
   PASSWORD VISIBILITY
================================ */

document
    .querySelectorAll(
        ".password-toggle"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const targetId =
                        button.dataset.target;


                    const input =
                        document.getElementById(
                            targetId
                        );


                    const icon =
                        button.querySelector(
                            "i"
                        );


                    const hidden =
                        input.type ===
                        "password";


                    input.type =
                        hidden
                            ? "text"
                            : "password";


                    icon.className =
                        hidden
                            ? "fa-regular fa-eye-slash"
                            : "fa-regular fa-eye";


                    button.setAttribute(
                        "aria-label",
                        hidden
                            ? "Hide password"
                            : "Show password"
                    );

                }
            );

        }
    );



/* ================================
   LOGIN
================================ */

loginForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const identifier =
            identifierInput
                .value
                .trim();


        const password =
            passwordInput.value;



        if (
            !identifier ||
            !password
        ) {

            showMessage(
                "Please enter your username or email and password.",
                "error"
            );

            return;

        }



        setLoading(true);


        hideMessage();



        let loginSuccessful =
            false;


        try {


            /* ========================
               EMAIL LOGIN
            ======================== */

            if (
                identifier.includes(
                    "@"
                )
            ) {

                loginSuccessful =
                    await loginWithEmail(
                        identifier,
                        password
                    );

            }


            /* ========================
               USERNAME LOGIN
            ======================== */

            else {

                loginSuccessful =
                    await loginWithUsername(
                        identifier,
                        password
                    );

            }



            if (
                !loginSuccessful
            ) {

                return;

            }



            showMessage(
                "Logged in successfully.",
                "success"
            );



            redirectAfterLogin();


        } catch (error) {

            console.error(error);


            showMessage(
                "Unable to log in. Please try again.",
                "error"
            );

        } finally {

            setLoading(false);

        }

    }
);



/* ================================
   EMAIL LOGIN
================================ */

async function loginWithEmail(
    email,
    password
) {

    const {
        error
    } =
        await window.supabaseClient
            .auth
            .signInWithPassword({
                email:
                    email,

                password:
                    password
            });


    if (
        error
    ) {

        console.error(
            error
        );


        /*
         * Suspended account.
         */

        if (
            error.code ===
            "user_banned"
        ) {

            await showSuspensionMessage(
                email,
                password
            );


            return false;

        }


        showMessage(
            "Invalid username/email or password.",
            "error"
        );


        return false;

    }


    return true;

}


/* ================================
   USERNAME LOGIN
================================ */

async function loginWithUsername(
    username,
    password
) {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .functions
            .invoke(
                "username-login",
                {
                    body: {
                        username:
                            username,

                        password:
                            password
                    }
                }
            );


    if (
        error
    ) {

        console.error(
            error
        );


        showMessage(
            "Unable to log in. Please try again.",
            "error"
        );


        return false;

    }


    /*
     * Suspended account.
     */

    if (
        data?.code ===
        "user_banned"
    ) {

        if (
            data.banned_until
        ) {

            showMessage(
                `Your account has been suspended until ${formatSuspensionDate(
                    data.banned_until
                )}.`,
                "error"
            );

        } else {

            showMessage(
                "Your account is currently suspended.",
                "error"
            );

        }


        return false;

    }


    /*
     * Normal failed login.
     */

    if (
        !data ||
        data.ok !== true ||
        !data.session
    ) {

        showMessage(
            data?.message ||
            "Invalid username/email or password.",
            "error"
        );


        return false;

    }


    /*
     * Create local Supabase session.
     */

    const {
        error: sessionError
    } =
        await window.supabaseClient
            .auth
            .setSession({

                access_token:
                    data.session
                        .access_token,

                refresh_token:
                    data.session
                        .refresh_token

            });


    if (
        sessionError
    ) {

        console.error(
            sessionError
        );


        showMessage(
            "Unable to create your login session.",
            "error"
        );


        return false;

    }


    return true;

}


function formatSuspensionDate(
    value
) {

    return new Date(
        value
    ).toLocaleString(
        undefined,
        {
            day:
                "numeric",

            month:
                "long",

            year:
                "numeric",

            hour:
                "numeric",

            minute:
                "2-digit"
        }
    );

}

/* ================================
   SUSPENSION MESSAGE
================================ */

async function showSuspensionMessage(
    email,
    password
) {

    try {

        const {
            data,
            error
        } =
            await window.supabaseClient
                .functions
                .invoke(
                    "login-suspension-info",
                    {
                        body: {

                            email:
                                email,

                            password:
                                password

                        }
                    }
                );


        if (
            error
        ) {

            console.error(
                "Unable to get suspension information:",
                error
            );


            showMessage(
                "Your account is currently suspended.",
                "error"
            );


            return true;

        }


        if (
            data?.permanently_banned ===
            true
        ) {

            showMessage(
                "Your account has been permanently banned.",
                "error"
            );


            return true;

        }


        if (
            data?.suspended &&
            data?.banned_until
        ) {

            showMessage(
                `Your account has been suspended until ${formatSuspensionDate(
                    data.banned_until
                )}.`,
                "error"
            );


            return true;

        }


        showMessage(
            "Your account is currently suspended.",
            "error"
        );


        return true;


    } catch (
    error
    ) {

        console.error(
            "Unable to check suspension:",
            error
        );


        showMessage(
            "Your account is currently suspended.",
            "error"
        );


        return true;

    }

}




/* =====================================
   FORGOT PASSWORD PANEL
===================================== */

forgotPasswordButton.addEventListener(
    "click",
    () => {

        forgotPasswordPanel.hidden =
            false;


        resetMessage.textContent =
            "";


        resetMessage.className =
            "login-message";


        /*
         * If the user typed an email into the
         * normal login field, copy it automatically.
         */

        const identifier =
            identifierInput
                .value
                .trim();


        if (
            identifier.includes("@")
        ) {

            resetEmail.value =
                identifier;

        }


        resetEmail.focus();

    }
);



cancelResetButton.addEventListener(
    "click",
    () => {

        forgotPasswordPanel.hidden =
            true;


        resetEmail.value =
            "";


        resetMessage.textContent =
            "";


        resetMessage.className =
            "login-message";

    }
);

/* =====================================
   SEND PASSWORD RESET EMAIL
===================================== */

sendResetButton.addEventListener(
    "click",
    async () => {

        const email =
            resetEmail
                .value
                .trim();


        if (!email) {

            showResetMessage(
                "Please enter your email address.",
                "error"
            );

            return;

        }


        sendResetButton.disabled =
            true;


        sendResetButton.innerHTML =
            `
                <i
                    class="fa-solid fa-circle-notch fa-spin"
                    aria-hidden="true"
                ></i>

                <span>
                    Sending...
                </span>
            `;


        try {

            const {
                error
            } =
                await window.supabaseClient
                    .auth
                    .resetPasswordForEmail(
                        email,
                        {
                            redirectTo:
                                `${window.location.origin}/reset-password.html`
                        }
                    );


            if (error) {

                console.error(
                    "Password reset error:",
                    error
                );


                showResetMessage(
                    "Unable to send the reset email. Please try again.",
                    "error"
                );


                return;

            }


            showResetMessage(
                "If an account exists for that email, a password reset link has been sent. Please check your inbox.",
                "success"
            );


            resetEmail.value =
                "";

        } catch (error) {

            console.error(error);


            showResetMessage(
                "Unable to send the reset email. Please try again.",
                "error"
            );

        } finally {

            sendResetButton.disabled =
                false;


            sendResetButton.innerHTML =
                `
                    <i
                        class="fa-regular fa-paper-plane"
                        aria-hidden="true"
                    ></i>

                    <span>
                        Send reset link
                    </span>
                `;

        }

    }
);

/* ================================
   REDIRECT
================================ */

function redirectAfterLogin() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const redirect =
        params.get(
            "redirect"
        );


    if (
        redirect &&
        redirect.startsWith("/") &&
        !redirect.startsWith("//")
    ) {

        window.location.href =
            redirect;

        return;

    }


    window.location.href =
        "/";

}



/* ================================
   LOADING STATE
================================ */

function setLoading(
    loading
) {

    loginButton.disabled =
        loading;


    if (loading) {

        loginButton.innerHTML =
            `
                <span>
                    Logging in...
                </span>

                <i
                    class="fa-solid fa-circle-notch fa-spin"
                    aria-hidden="true"
                ></i>
            `;

    } else {

        loginButton.innerHTML =
            `
                <span>
                    Log In
                </span>

                <i
                    class="fa-solid fa-arrow-right"
                    aria-hidden="true"
                ></i>
            `;

    }

}



/* ================================
   MESSAGE
================================ */

function showMessage(
    message,
    type
) {

    loginMessage.textContent =
        message;


    loginMessage.className =
        `login-message show ${type}`;

}



function hideMessage() {

    loginMessage.textContent =
        "";


    loginMessage.className =
        "login-message";

}

/* =====================================
   RESET MESSAGE
===================================== */

function showResetMessage(
    message,
    type
) {

    resetMessage.textContent =
        message;


    resetMessage.className =
        `login-message show ${type}`;

}