const signupForm =
    document.getElementById(
        "signupForm"
    );

const signupMessage =
    document.getElementById(
        "signupMessage"
    );

const signupButton =
    document.getElementById(
        "signupButton"
    );


/* =====================================
   SIGN UP
===================================== */

signupForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const username =
            document
                .getElementById(
                    "username"
                )
                .value
                .trim();


        const email =
            document
                .getElementById(
                    "email"
                )
                .value
                .trim();


        const password =
            document
                .getElementById(
                    "password"
                )
                .value;


        const confirmPassword =
            document
                .getElementById(
                    "confirmPassword"
                )
                .value;



        /* =============================
           CLEAR OLD MESSAGE
        ============================= */

        hideMessage();



        /* =============================
           PASSWORD CHECK
        ============================= */

        if (
            password !==
            confirmPassword
        ) {

            showMessage(
                "The passwords do not match.",
                "error"
            );

            return;

        }



        /* =============================
           START LOADING
        ============================= */

        setLoading(
            true
        );


        showMessage(
            "Creating your account...",
            "loading"
        );



        try {


            /* =============================
               CREATE ACCOUNT
            ============================= */

            const {
                data,
                error
            } =
                await window
                    .supabaseClient
                    .auth
                    .signUp({

                        email:
                            email,

                        password:
                            password,

                        options: {

                            data: {
                                username:
                                    username
                            },

                            emailRedirectTo:
                                `${window.location.origin}/login.html`

                        }

                    });



            /* =============================
               ERROR
            ============================= */

            if (error) {

                console.error(
                    "Signup error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to create your account. Please try again.",
                    "error"
                );

                return;

            }



            /* =============================
               SUCCESS
            ============================= */

            signupForm.reset();


            showMessage(
                "Account created successfully! Please check your email and click the verification link before logging in.",
                "success"
            );


        } catch (error) {

            console.error(
                "Unexpected signup error:",
                error
            );


            showMessage(
                "Unable to create your account. Please try again.",
                "error"
            );

        } finally {

            setLoading(
                false
            );

        }

    }
);



/* =====================================
   MESSAGE
===================================== */

function showMessage(
    message,
    type
) {

    signupMessage.textContent =
        message;


    signupMessage.className =
        `signup-message show ${type}`;

}



function hideMessage() {

    signupMessage.textContent =
        "";


    signupMessage.className =
        "signup-message";

}



/* =====================================
   LOADING BUTTON
===================================== */

function setLoading(
    loading
) {

    if (!signupButton) {
        return;
    }


    signupButton.disabled =
        loading;


    if (loading) {

        signupButton.innerHTML =
            `
                <span>
                    Creating account...
                </span>

                <i
                    class="fa-solid fa-circle-notch fa-spin"
                    aria-hidden="true"
                ></i>
            `;

    } else {

        signupButton.innerHTML =
            `
                <span>
                    Create Account
                </span>

                <i
                    class="fa-solid fa-arrow-right"
                    aria-hidden="true"
                ></i>
            `;

    }

}



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