const resetPasswordForm =
    document.getElementById(
        "resetPasswordForm"
    );


const newPasswordInput =
    document.getElementById(
        "newPassword"
    );


const confirmNewPasswordInput =
    document.getElementById(
        "confirmNewPassword"
    );


const resetPasswordMessage =
    document.getElementById(
        "resetPasswordMessage"
    );


const changePasswordButton =
    document.getElementById(
        "changePasswordButton"
    );


const resetChecking =
    document.getElementById(
        "resetChecking"
    );


const resetInvalid =
    document.getElementById(
        "resetInvalid"
    );


let recoveryReady =
    false;


/* =====================================
   PASSWORD RECOVERY SESSION
===================================== */

const {
    data: authListener
} =
    window.supabaseClient
        .auth
        .onAuthStateChange(
            (event, session) => {

                if (
                    event ===
                    "PASSWORD_RECOVERY"
                    &&
                    session
                ) {

                    recoveryReady =
                        true;


                    sessionStorage.setItem(
                        "iq-password-recovery",
                        "true"
                    );


                    showPasswordForm();

                }

            }
        );


/* =====================================
   INITIALISE PAGE
===================================== */

async function initialiseResetPage() {

    /*
     * This also allows the page to survive
     * a refresh after the recovery session
     * has already been established.
     */

    const recoveryMarker =
        sessionStorage.getItem(
            "iq-password-recovery"
        );


    if (
        recoveryMarker ===
        "true"
    ) {

        const {
            data: {
                session
            }
        } =
            await window.supabaseClient
                .auth
                .getSession();


        if (session) {

            recoveryReady =
                true;


            showPasswordForm();


            return;

        }

    }


    /*
     * Give Supabase time to process the
     * recovery token from the URL and emit
     * PASSWORD_RECOVERY.
     */

    window.setTimeout(
        () => {

            if (
                !recoveryReady
            ) {

                showInvalidLink();

            }

        },
        3500
    );

}


/* =====================================
   SHOW PASSWORD FORM
===================================== */

function showPasswordForm() {

    resetChecking.hidden =
        true;


    resetInvalid.hidden =
        true;


    resetPasswordForm.hidden =
        false;


    newPasswordInput.focus();

}


/* =====================================
   INVALID / EXPIRED LINK
===================================== */

function showInvalidLink() {

    resetChecking.hidden =
        true;


    resetPasswordForm.hidden =
        true;


    resetInvalid.hidden =
        false;

}


/* =====================================
   CHANGE PASSWORD
===================================== */

resetPasswordForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (
            !recoveryReady
        ) {

            showMessage(
                "Your password reset session is no longer valid. Please request another reset link.",
                "error"
            );


            return;

        }


        const newPassword =
            newPasswordInput.value;


        const confirmPassword =
            confirmNewPasswordInput.value;



        /* =============================
           VALIDATION
        ============================= */

        if (
            newPassword.length < 6
        ) {

            showMessage(
                "Your password must be at least 6 characters long.",
                "error"
            );


            return;

        }


        if (
            newPassword !==
            confirmPassword
        ) {

            showMessage(
                "The passwords do not match.",
                "error"
            );


            return;

        }



        /* =============================
           LOADING
        ============================= */

        setLoading(
            true
        );


        hideMessage();



        try {


            /* =============================
               UPDATE PASSWORD
            ============================= */

            const {
                error
            } =
                await window.supabaseClient
                    .auth
                    .updateUser({

                        password:
                            newPassword

                    });


            if (error) {

                console.error(
                    "Password update error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to update your password.",
                    "error"
                );


                return;

            }



            /* =============================
               SUCCESS
            ============================= */

            sessionStorage.removeItem(
                "iq-password-recovery"
            );


            recoveryReady =
                false;


            newPasswordInput.value =
                "";


            confirmNewPasswordInput.value =
                "";


            showMessage(
                "Your password has been changed successfully. You can now log in with your new password.",
                "success"
            );


            changePasswordButton.disabled =
                true;



            /*
             * Sign out of the temporary
             * recovery session.
             */

            await window.supabaseClient
                .auth
                .signOut();



            /*
             * Send the user back to login.
             */

            window.setTimeout(
                () => {

                    window.location.href =
                        "/login.html";

                },
                2500
            );


        } catch (error) {

            console.error(
                error
            );


            showMessage(
                "Unable to update your password. Please try again.",
                "error"
            );

        } finally {

            if (
                recoveryReady
            ) {

                setLoading(
                    false
                );

            }

        }

    }
);

/* =====================================
   PASSWORD VISIBILITY
===================================== */

const passwordToggleButtons =
    document.querySelectorAll(
        ".password-toggle"
    );


passwordToggleButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const targetId =
                    button.dataset.target;


                const passwordInput =
                    document.getElementById(
                        targetId
                    );


                const icon =
                    button.querySelector(
                        "i"
                    );


                const passwordIsHidden =
                    passwordInput.type ===
                    "password";


                passwordInput.type =
                    passwordIsHidden
                        ? "text"
                        : "password";


                icon.className =
                    passwordIsHidden
                        ? "fa-regular fa-eye-slash"
                        : "fa-regular fa-eye";


                button.setAttribute(
                    "aria-label",
                    passwordIsHidden
                        ? "Hide password"
                        : "Show password"
                );

            }
        );

    }
);


/* =====================================
   MESSAGE
===================================== */

function showMessage(
    message,
    type
) {

    resetPasswordMessage.textContent =
        message;


    resetPasswordMessage.className =
        `login-message show ${type}`;

}


function hideMessage() {

    resetPasswordMessage.textContent =
        "";


    resetPasswordMessage.className =
        "login-message";

}


/* =====================================
   BUTTON LOADING
===================================== */

function setLoading(
    loading
) {

    changePasswordButton.disabled =
        loading;


    if (loading) {

        changePasswordButton.innerHTML =
            `
                <span>
                    Changing password...
                </span>

                <i
                    class="fa-solid fa-circle-notch fa-spin"
                    aria-hidden="true"
                ></i>
            `;

    } else {

        changePasswordButton.innerHTML =
            `
                <span>
                    Change Password
                </span>

                <i
                    class="fa-solid fa-arrow-right"
                    aria-hidden="true"
                ></i>
            `;

    }

}


/* =====================================
   START
===================================== */

initialiseResetPage();