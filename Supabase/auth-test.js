const authStatus =
    document.getElementById("authStatus");

const userEmail =
    document.getElementById("userEmail");

const loginButton =
    document.getElementById("loginButton");

const logoutButton =
    document.getElementById("logoutButton");


async function checkAuthStatus() {

    const {
        data: { session },
        error
    } = await window.supabaseClient.auth.getSession();


    if (error) {

        console.error(error);

        authStatus.textContent =
            "Unable to check login status.";

        return;
    }


    if (session) {

        authStatus.textContent =
            "✅ Logged In";


        const { data: profile, error: profileError } =
            await window.supabaseClient
                .from("profiles")
                .select("username, display_name")
                .eq("id", session.user.id)
                .single();


        if (profileError) {

            console.error(profileError);

            userEmail.textContent =
                `Email: ${session.user.email}`;

        } else {

            const name =
                profile.display_name ||
                profile.username;

            userEmail.innerHTML = "";

            const usernameLine =
                document.createElement("div");

            const emailLine =
                document.createElement("div");


            usernameLine.textContent =
                `Username: ${name}`;

            emailLine.textContent =
                `Email: ${session.user.email}`;


            userEmail.append(
                usernameLine,
                emailLine
            );

        }


        loginButton.style.display =
            "none";

        logoutButton.style.display =
            "inline-flex";

    } else {

        authStatus.textContent =
            "❌ Logged Out";

        userEmail.textContent = "";


        loginButton.style.display =
            "inline-flex";

        logoutButton.style.display =
            "none";

    }

}


logoutButton.addEventListener(
    "click",
    async () => {

        const { error } =
            await window.supabaseClient.auth.signOut();


        if (error) {

            console.error(error);

            authStatus.textContent =
                "Unable to log out.";

            return;

        }


        await checkAuthStatus();

    }
);


checkAuthStatus();