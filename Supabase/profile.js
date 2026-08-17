const messagesNavCount =
    document.getElementById(
        "messagesNavCount"
    );


const profileMessagesList =
    document.getElementById(
        "profileMessagesList"
    );


const profileMessagesLoading =
    document.getElementById(
        "profileMessagesLoading"
    );


const profileMessagesEmpty =
    document.getElementById(
        "profileMessagesEmpty"
    );


const markAllMessagesRead =
    document.getElementById(
        "markAllMessagesRead"
    );


let profileMessages =
    [];


let profileMessagesLoaded =
    false;

const profileNavButtons =
    document.querySelectorAll(
        ".profile-nav-button"
    );


const profileSections =
    document.querySelectorAll(
        ".profile-section"
    );


const profileCommentsList =
    document.getElementById(
        "profileCommentsList"
    );


const profileCommentsLoading =
    document.getElementById(
        "profileCommentsLoading"
    );

const profileCommentsMessage =
    document.getElementById(
        "profileCommentsMessage"
    );

const profileCommentsEmpty =
    document.getElementById(
        "profileCommentsEmpty"
    );


const profileCommentsTotal =
    document.getElementById(
        "profileCommentsTotal"
    );


const commentsNavCount =
    document.getElementById(
        "commentsNavCount"
    );


const profileCommentFilter =
    document.getElementById(
        "profileCommentFilter"
    );


let profileComments =
    [];


let profileCommentsLoaded =
    false;


const changePasswordForm =
    document.getElementById(
        "changePasswordForm"
    );


const currentPasswordInput =
    document.getElementById(
        "currentPassword"
    );


const profileNewPassword =
    document.getElementById(
        "profileNewPassword"
    );


const profileConfirmPassword =
    document.getElementById(
        "profileConfirmPassword"
    );


const changePasswordMessage =
    document.getElementById(
        "changePasswordMessage"
    );


const changePasswordButton =
    document.getElementById(
        "changePasswordButton"
    );

const profileLoading =
    document.getElementById(
        "profileLoading"
    );

const profilePage =
    document.getElementById(
        "profilePage"
    );

const profileFooter =
    document.getElementById(
        "profileFooter"
    );


const profileForm =
    document.getElementById(
        "profileForm"
    );


const usernameInput =
    document.getElementById(
        "username"
    );

const displayNameInput =
    document.getElementById(
        "displayName"
    );


const profileEmail =
    document.getElementById(
        "profileEmail"
    );

const profileUserId =
    document.getElementById(
        "profileUserId"
    );


const profileDisplayHeading =
    document.getElementById(
        "profileDisplayHeading"
    );

const profileUsernameHeading =
    document.getElementById(
        "profileUsernameHeading"
    );

const profileAvatar =
    document.getElementById(
        "profileAvatar"
    );


const avatarInputs =
    document.querySelectorAll(
        'input[name="avatar"]'
    );


const memberSince =
    document.getElementById(
        "memberSince"
    );

const commentCount =
    document.getElementById(
        "commentCount"
    );


const verificationBadge =
    document.getElementById(
        "verificationBadge"
    );

const emailStatus =
    document.getElementById(
        "emailStatus"
    );


const profileMessage =
    document.getElementById(
        "profileMessage"
    );

const saveProfileButton =
    document.getElementById(
        "saveProfileButton"
    );


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


let currentUser = null;

let currentProfile = null;



/* =====================================
   INITIALISE
===================================== */

async function initialiseProfile() {

    const {
        data: { user },
        error
    } =
        await window.supabaseClient
            .auth
            .getUser();


    if (
        error ||
        !user
    ) {

        window.location.href =
            "/login.html?redirect=/profile.html";

        return;

    }


    currentUser =
        user;


    await Promise.all([
        loadProfile(),
        loadCommentCount(),
        loadUnreadMessageCount()
    ]);


    displayAccountInformation();


    profileLoading.hidden =
        true;

    profilePage.hidden =
        false;

    profileFooter.hidden =
        false;

}


/* =====================================
   MESSAGE COUNT
===================================== */

async function loadUnreadMessageCount() {

    if (
        !currentUser
    ) {
        return;
    }


    const {
        data: messages,
        error: messagesError
    } =
        await window
            .supabaseClient
            .from(
                "messages"
            )
            .select(
                "id"
            );


    if (
        messagesError
    ) {

        console.error(
            "Unable to load message count:",
            messagesError
        );

        return;

    }


    if (
        !messages ||
        messages.length === 0
    ) {

        updateMessagesNavCount(
            0
        );

        return;

    }


    const messageIds =
        messages.map(
            message =>
                message.id
        );


    const {
        data: reads,
        error: readsError
    } =
        await window
            .supabaseClient
            .from(
                "message_reads"
            )
            .select(
                "message_id"
            )
            .eq(
                "user_id",
                currentUser.id
            )
            .in(
                "message_id",
                messageIds
            );


    if (
        readsError
    ) {

        console.error(
            "Unable to load message read state:",
            readsError
        );

        return;

    }


    const readIds =
        new Set(
            (reads || []).map(
                item =>
                    item.message_id
            )
        );


    const unread =
        messageIds.filter(
            id =>
                !readIds.has(
                    id
                )
        ).length;


    updateMessagesNavCount(
        unread
    );

}


function updateMessagesNavCount(
    count
) {

    messagesNavCount.textContent =
        count;


    messagesNavCount.hidden =
        count === 0;

}

/* =====================================
   LOAD PROFILE
===================================== */

async function loadProfile() {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from("profiles")
            .select(`
                username,
                display_name,
                avatar_url,
                created_at
            `)
            .eq(
                "id",
                currentUser.id
            )
            .single();


    if (error) {

        console.error(
            "Unable to load profile:",
            error
        );

        showMessage(
            "Unable to load your profile.",
            "error"
        );

        return;

    }


    currentProfile =
        data;

    const avatarUrl =
        data.avatar_url ||
        "/Images/Avatars/default-male.png";


    profileAvatar.src =
        avatarUrl;


    avatarInputs.forEach(
        input => {

            input.checked =
                input.value ===
                avatarUrl;

        }
    );


    usernameInput.value =
        data.username || "";


    displayNameInput.value =
        data.display_name || "";


    const visibleName =
        data.display_name ||
        data.username ||
        "User";


    profileDisplayHeading.textContent =
        visibleName;


    profileUsernameHeading.textContent =
        data.username
            ? `@${data.username}`
            : "";



    memberSince.textContent =
        formatDate(
            data.created_at
        );

}



/* =====================================
   ACCOUNT INFORMATION
===================================== */

function displayAccountInformation() {

    profileEmail.textContent =
        currentUser.email || "—";


    profileUserId.textContent =
        currentUser.id;


    const isVerified =
        Boolean(
            currentUser
                .email_confirmed_at
        );


    if (isVerified) {

        verificationBadge.innerHTML =
            `
                <i
                    class="fa-solid fa-circle-check"
                    aria-hidden="true"
                ></i>

                Verified
            `;


        verificationBadge.classList
            .remove(
                "unverified"
            );


        emailStatus.textContent =
            "Verified";

        emailStatus.classList
            .remove(
                "unverified"
            );

    } else {

        verificationBadge.innerHTML =
            `
                <i
                    class="fa-regular fa-clock"
                    aria-hidden="true"
                ></i>

                Unverified
            `;


        verificationBadge.classList
            .add(
                "unverified"
            );


        emailStatus.textContent =
            "Unverified";

        emailStatus.classList
            .add(
                "unverified"
            );

    }

}



/* =====================================
   COMMENT COUNT
===================================== */

async function loadCommentCount() {

    const {
        count,
        error
    } =
        await window.supabaseClient
            .from("comments")
            .select(
                "*",
                {
                    count: "exact",
                    head: true
                }
            )
            .eq(
                "user_id",
                currentUser.id
            );


    if (error) {

        console.error(
            "Unable to load comment count:",
            error
        );

        return;

    }


    const total =
        count ?? 0;


    commentCount.textContent =
        total;


    commentsNavCount.textContent =
        total;

}


/* =====================================
   AVATAR PREVIEW
===================================== */

avatarInputs.forEach(
    input => {

        input.addEventListener(
            "change",
            () => {

                if (
                    input.checked
                ) {

                    profileAvatar.src =
                        input.value;

                }

            }
        );

    }
);

/* =====================================
   SAVE PROFILE
===================================== */

profileForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (
            !currentUser ||
            !currentProfile
        ) {
            return;
        }


        const displayName =
            displayNameInput
                .value
                .trim();


        if (
            displayName.length > 50
        ) {

            showMessage(
                "Display name must be 50 characters or fewer.",
                "error"
            );

            return;

        }


        setSaving(true);

        hideMessage();

        const selectedAvatar =
            document.querySelector(
                'input[name="avatar"]:checked'
            )?.value;


        if (!selectedAvatar) {

            showMessage(
                "Please choose a profile avatar.",
                "error"
            );

            return;

        }


        const {
            error
        } =
            await window.supabaseClient
                .from("profiles")
                .update({

                    display_name:
                        displayName ||
                        null,

                    avatar_url:
                        selectedAvatar

                })
                .eq(
                    "id",
                    currentUser.id
                );


        if (error) {

            console.error(
                error
            );


            showMessage(
                "Unable to save your profile.",
                "error"
            );


            setSaving(false);

            return;

        }

        currentProfile.avatar_url =
            selectedAvatar;


        profileAvatar.src =
            selectedAvatar;


        currentProfile.display_name =
            displayName || null;


        const visibleName =
            displayName ||
            currentProfile.username ||
            "User";


        profileDisplayHeading.textContent =
            visibleName;



        showMessage(
            "Your profile has been updated.",
            "success"
        );


        setSaving(false);

    }
);

/* =====================================
   LOG OUT
===================================== */

logoutButton.addEventListener(
    "click",
    async () => {

        logoutButton.disabled =
            true;


        const {
            error
        } =
            await window.supabaseClient
                .auth
                .signOut();


        if (error) {

            console.error(error);

            logoutButton.disabled =
                false;

            return;

        }


        window.location.href =
            "/";

    }
);



/* =====================================
   SAVING STATE
===================================== */

function setSaving(
    saving
) {

    saveProfileButton.disabled =
        saving;


    if (saving) {

        saveProfileButton.innerHTML =
            `
                <i
                    class="fa-solid fa-circle-notch fa-spin"
                    aria-hidden="true"
                ></i>

                <span>
                    Saving...
                </span>
            `;

    } else {

        saveProfileButton.innerHTML =
            `
                <i
                    class="fa-solid fa-check"
                    aria-hidden="true"
                ></i>

                <span>
                    Save changes
                </span>
            `;

    }

}



/* =====================================
   MESSAGE
===================================== */

function showMessage(
    message,
    type
) {

    profileMessage.textContent =
        message;


    profileMessage.className =
        `profile-message show ${type}`;

}



function hideMessage() {

    profileMessage.textContent =
        "";


    profileMessage.className =
        "profile-message";

}



/* =====================================
   DATE
===================================== */

function formatDate(
    value
) {

    if (!value) {
        return "—";
    }


    return new Date(
        value
    ).toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}

/* =====================================
   CHANGE PASSWORD
===================================== */

changePasswordForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const currentPassword =
            currentPasswordInput.value;


        const newPassword =
            profileNewPassword.value;


        const confirmPassword =
            profileConfirmPassword.value;



        /* =============================
           VALIDATION
        ============================= */

        if (
            newPassword.length < 6
        ) {

            showChangePasswordMessage(
                "Your new password must be at least 6 characters long.",
                "error"
            );

            return;

        }


        if (
            newPassword !==
            confirmPassword
        ) {

            showChangePasswordMessage(
                "The new passwords do not match.",
                "error"
            );

            return;

        }


        if (
            currentPassword ===
            newPassword
        ) {

            showChangePasswordMessage(
                "Your new password must be different from your current password.",
                "error"
            );

            return;

        }



        setPasswordLoading(
            true
        );


        hideChangePasswordMessage();



        try {


            /*
             * Verify their existing password first.
             */

            const {
                error: passwordCheckError
            } =
                await window.supabaseClient
                    .auth
                    .signInWithPassword({

                        email:
                            currentUser.email,

                        password:
                            currentPassword

                    });


            if (
                passwordCheckError
            ) {

                showChangePasswordMessage(
                    "Your current password is incorrect.",
                    "error"
                );

                return;

            }



            /*
             * Change to the new password.
             */

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
                    "Password change error:",
                    error
                );


                showChangePasswordMessage(
                    error.message ||
                    "Unable to change your password.",
                    "error"
                );

                return;

            }



            /* =============================
               SUCCESS
            ============================= */

            changePasswordForm.reset();


            showChangePasswordMessage(
                "Your password has been changed successfully.",
                "success"
            );

            const {
                error: messageError
            } =
                await window
                    .supabaseClient
                    .rpc(
                        "create_password_changed_message"
                    );


            if (
                messageError
            ) {

                console.error(
                    "Unable to create password notification:",
                    messageError
                );

            } else {

                profileMessagesLoaded =
                    false;


                await loadUnreadMessageCount();

            }


        } catch (error) {

            console.error(error);


            showChangePasswordMessage(
                "Unable to change your password. Please try again.",
                "error"
            );

        } finally {

            setPasswordLoading(
                false
            );

        }

    }
);

/* =====================================
   CHANGE PASSWORD MESSAGE
===================================== */

function showChangePasswordMessage(
    message,
    type
) {

    changePasswordMessage.textContent =
        message;


    changePasswordMessage.className =
        `profile-message show ${type}`;

}


function hideChangePasswordMessage() {

    changePasswordMessage.textContent =
        "";


    changePasswordMessage.className =
        "profile-message";

}



/* =====================================
   CHANGE PASSWORD LOADING
===================================== */

function setPasswordLoading(
    loading
) {

    changePasswordButton.disabled =
        loading;


    if (loading) {

        changePasswordButton.innerHTML =
            `
                <i
                    class="fa-solid fa-circle-notch fa-spin"
                    aria-hidden="true"
                ></i>

                <span>
                    Changing password...
                </span>
            `;

    } else {

        changePasswordButton.innerHTML =
            `
                <i
                    class="fa-solid fa-key"
                    aria-hidden="true"
                ></i>

                <span>
                    Change password
                </span>
            `;

    }

}

/* =====================================
   PROFILE PASSWORD VISIBILITY
===================================== */

document
    .querySelectorAll(
        ".profile-password-toggle"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const input =
                        document.getElementById(
                            button.dataset.target
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

/* =====================================
   PROFILE NAVIGATION
===================================== */

profileNavButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            async () => {

                const section =
                    button.dataset
                        .profileSection;


                profileNavButtons
                    .forEach(
                        navButton => {

                            navButton.classList
                                .toggle(
                                    "active",
                                    navButton ===
                                    button
                                );

                        }
                    );


                profileSections
                    .forEach(
                        panel => {

                            const isActive =
                                panel.dataset
                                    .profilePanel ===
                                section;


                            panel.hidden =
                                !isActive;


                            panel.classList
                                .toggle(
                                    "active",
                                    isActive
                                );

                        }
                    );


                /*
                 * Only fetch comments
                 * when the user first
                 * opens My Comments.
                 */

                if (
                    section ===
                    "comments"
                    &&
                    !profileCommentsLoaded
                ) {

                    await loadProfileComments();

                }

                if (
                    section ===
                    "messages"
                    &&
                    !profileMessagesLoaded
                ) {

                    await loadProfileMessages();

                }

            }
        );

    }
);


/* =====================================
   LOAD MESSAGES
===================================== */

async function loadProfileMessages() {

    if (
        !currentUser
    ) {
        return;
    }


    profileMessagesLoading.hidden =
        false;


    profileMessagesEmpty.hidden =
        true;


    profileMessagesList.innerHTML =
        "";


    const {
        data: messages,
        error: messagesError
    } =
        await window
            .supabaseClient
            .from(
                "messages"
            )
            .select(`
                id,
                title,
                content,
                message_type,
                created_at
            `)
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (
        messagesError
    ) {

        profileMessagesLoading.hidden =
            true;


        console.error(
            "Unable to load messages:",
            messagesError
        );

        return;

    }


    const messageIds =
        (messages || []).map(
            message =>
                message.id
        );


    let reads =
        [];


    if (
        messageIds.length > 0
    ) {

        const {
            data,
            error
        } =
            await window
                .supabaseClient
                .from(
                    "message_reads"
                )
                .select(
                    "message_id"
                )
                .eq(
                    "user_id",
                    currentUser.id
                )
                .in(
                    "message_id",
                    messageIds
                );


        if (
            !error
        ) {
            reads =
                data || [];
        }

    }


    const readIds =
        new Set(
            reads.map(
                read =>
                    read.message_id
            )
        );


    profileMessages =
        (messages || []).map(
            message => ({
                ...message,

                isRead:
                    readIds.has(
                        message.id
                    )
            })
        );


    profileMessagesLoaded =
        true;


    profileMessagesLoading.hidden =
        true;


    renderProfileMessages();

    updateMessageUnreadCount();

}

/* =====================================
   LOAD MESSAGES
===================================== */

async function loadProfileComments() {

    if (
        !currentUser
    ) {
        return;
    }


    profileCommentsLoading.hidden =
        false;


    profileCommentsEmpty.hidden =
        true;


    profileCommentsList.innerHTML =
        "";


    /*
     * Load everything written
     * by this user.
     */

    const {
        data: ownComments,
        error
    } =
        await window
            .supabaseClient
            .from(
                "comments"
            )
            .select(`
                id,
                user_id,
                page_id,
                parent_id,
                content,
                status,
                created_at,
                updated_at
            `)
            .eq(
                "user_id",
                currentUser.id
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (
        error
    ) {

        profileCommentsLoading.hidden =
            true;


        console.error(
            "Unable to load comments:",
            error
        );


        profileCommentsList.innerHTML =
            `
                <div
                    class="profile-message show error"
                >
                    Unable to load your comments.
                </div>
            `;


        return;

    }


    /*
     * Only top-level comments can
     * own a discussion thread.
     */

    const topLevelIds =
        (ownComments || [])
            .filter(
                comment =>
                    comment.parent_id ===
                    null
            )
            .map(
                comment =>
                    comment.id
            );


    let replies =
        [];


    /*
     * Load replies written by
     * other users underneath the
     * user's comments.
     */

    if (
        topLevelIds.length > 0
    ) {

        const {
            data,
            error: repliesError
        } =
            await window
                .supabaseClient
                .from(
                    "comments"
                )
                .select(`
                    id,
                    user_id,
                    page_id,
                    parent_id,
                    content,
                    status,
                    created_at,
                    updated_at,
                    author:profiles!comments_user_id_fkey (
                        username,
                        display_name,
                        avatar_url
                    )
                `)
                .in(
                    "parent_id",
                    topLevelIds
                )
                .order(
                    "created_at",
                    {
                        ascending: true
                    }
                );


        if (
            repliesError
        ) {

            console.error(
                "Unable to load comment replies:",
                repliesError
            );

        } else {

            replies =
                data || [];

        }

    }


    /*
     * Get likes for the user's
     * comments AND the replies
     * we're going to display.
     */

    const allCommentIds =
        Array.from(
            new Set([
                ...(ownComments || [])
                    .map(
                        comment =>
                            comment.id
                    ),

                ...replies.map(
                    reply =>
                        reply.id
                )
            ])
        );


    let likes =
        [];


    if (
        allCommentIds.length > 0
    ) {

        const {
            data,
            error: likesError
        } =
            await window
                .supabaseClient
                .from(
                    "comment_likes"
                )
                .select(
                    "comment_id"
                )
                .in(
                    "comment_id",
                    allCommentIds
                );


        if (
            likesError
        ) {

            console.error(
                "Unable to load comment likes:",
                likesError
            );

        } else {

            likes =
                data || [];

        }

    }


    /*
     * Build like counts.
     */

    const likeCounts =
        new Map();


    likes.forEach(
        like => {

            likeCounts.set(
                like.comment_id,
                (
                    likeCounts.get(
                        like.comment_id
                    ) || 0
                ) + 1
            );

        }
    );


    const repliesWithLikes =
        replies.map(
            reply => ({

                ...reply,

                likeCount:
                    likeCounts.get(
                        reply.id
                    ) || 0

            })
        );


    profileComments =
        (ownComments || [])
            .map(
                comment => ({

                    ...comment,

                    likeCount:
                        likeCounts.get(
                            comment.id
                        ) || 0,

                    replies:
                        comment.parent_id ===
                            null
                            ? repliesWithLikes
                                .filter(
                                    reply =>
                                        reply.parent_id ===
                                        comment.id
                                )
                            : []

                })
            );


    profileCommentsLoaded =
        true;


    profileCommentsLoading.hidden =
        true;


    updateProfileCommentCounts();

    renderProfileComments();

}

function renderProfileMessages() {

    profileMessagesList.innerHTML =
        "";


    if (
        profileMessages.length ===
        0
    ) {

        profileMessagesEmpty.hidden =
            false;

        return;

    }


    profileMessagesEmpty.hidden =
        true;


    profileMessages.forEach(
        message => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                message.isRead
                    ? "profile-message-card"
                    : "profile-message-card unread";


            const icon =
                document.createElement(
                    "span"
                );


            icon.className =
                `profile-message-icon ${message.message_type}`;


            switch (
            message.message_type
            ) {

                case "security":

                    icon.innerHTML =
                        '<i class="fa-solid fa-shield-halved"></i>';

                    break;


                case "update":

                    icon.innerHTML =
                        '<i class="fa-solid fa-bullhorn"></i>';

                    break;


                case "admin":

                    icon.innerHTML =
                        '<i class="fa-solid fa-envelope"></i>';

                    break;


                default:

                    icon.innerHTML =
                        '<i class="fa-solid fa-circle-info"></i>';

            }


            const body =
                document.createElement(
                    "div"
                );


            body.className =
                "profile-message-body";


            const top =
                document.createElement(
                    "div"
                );


            top.className =
                "profile-message-card-top";


            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =
                message.title;


            const date =
                document.createElement(
                    "time"
                );


            date.textContent =
                formatDateTime(
                    message.created_at
                );


            top.append(
                title,
                date
            );


            const content =
                document.createElement(
                    "p"
                );


            content.textContent =
                message.content;


            body.append(
                top,
                content
            );


            if (
                !message.isRead
            ) {

                const newBadge =
                    document.createElement(
                        "span"
                    );


                newBadge.className =
                    "profile-message-new";


                newBadge.textContent =
                    "New";


                body.appendChild(
                    newBadge
                );

            }


            card.append(
                icon,
                body
            );


            card.addEventListener(
                "click",
                () => {

                    markMessageAsRead(
                        message,
                        card
                    );

                }
            );


            profileMessagesList
                .appendChild(
                    card
                );

        }
    );

}

async function markMessageAsRead(
    message,
    card
) {

    if (
        message.isRead
    ) {
        return;
    }


    const {
        error
    } =
        await window
            .supabaseClient
            .from(
                "message_reads"
            )
            .insert({

                message_id:
                    message.id,

                user_id:
                    currentUser.id

            });


    if (
        error
    ) {

        console.error(
            "Unable to mark message as read:",
            error
        );

        return;

    }


    message.isRead =
        true;


    card.classList.remove(
        "unread"
    );


    card.querySelector(
        ".profile-message-new"
    )?.remove();


    updateMessageUnreadCount();

}


function updateMessageUnreadCount() {

    const unread =
        profileMessages.filter(
            message =>
                !message.isRead
        ).length;


    updateMessagesNavCount(
        unread
    );

}

markAllMessagesRead
    .addEventListener(
        "click",
        async () => {

            const unread =
                profileMessages.filter(
                    message =>
                        !message.isRead
                );


            if (
                unread.length ===
                0
            ) {
                return;
            }


            const rows =
                unread.map(
                    message => ({

                        message_id:
                            message.id,

                        user_id:
                            currentUser.id

                    })
                );


            const {
                error
            } =
                await window
                    .supabaseClient
                    .from(
                        "message_reads"
                    )
                    .insert(
                        rows
                    );


            if (
                error
            ) {

                console.error(
                    "Unable to mark messages as read:",
                    error
                );

                return;

            }


            profileMessages.forEach(
                message => {

                    message.isRead =
                        true;

                }
            );


            renderProfileMessages();

            updateMessagesNavCount(
                0
            );

        }
    );

/* =====================================
   COMMENT COUNTS
===================================== */

function updateProfileCommentCounts() {

    const total =
        profileComments.length;


    profileCommentsTotal.textContent =
        total;


    commentsNavCount.textContent =
        total;


    /*
     * Keep the number in the
     * profile summary synchronised.
     */

    commentCount.textContent =
        total;

}

/* =====================================
   RENDER COMMENTS
===================================== */

function renderProfileComments() {

    const filter =
        profileCommentFilter.value;


    const filteredComments =
        profileComments.filter(
            comment => {

                if (
                    filter ===
                    "all"
                ) {
                    return true;
                }


                return (
                    comment.status ===
                    filter
                );

            }
        );


    profileCommentsList.innerHTML =
        "";


    if (
        filteredComments.length ===
        0
    ) {

        profileCommentsEmpty.hidden =
            false;


        return;

    }


    profileCommentsEmpty.hidden =
        true;


    filteredComments.forEach(
        comment => {

            const card =
                createProfileCommentCard(
                    comment
                );


            profileCommentsList
                .appendChild(
                    card
                );

        }
    );

}

/* =====================================
   COMMENT CARD
===================================== */

function createProfileCommentCard(
    comment
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "profile-comment-card";


    card.dataset.commentId =
        comment.id;



    /* =====================================
       TOP
    ===================================== */

    const top =
        document.createElement(
            "div"
        );


    top.className =
        "profile-comment-top";


    const meta =
        document.createElement(
            "div"
        );


    meta.className =
        "profile-comment-meta";


    const page =
        document.createElement(
            "a"
        );


    page.className =
        "profile-comment-page";

    page.href =
        getCommentPageUrl(
            comment
        );


    page.title =
        "View this comment";


    const pageIcon =
        document.createElement(
            "i"
        );


    pageIcon.className =
        "fa-regular fa-file-lines";


    pageIcon.setAttribute(
        "aria-hidden",
        "true"
    );


    page.appendChild(
        pageIcon
    );


    page.append(
        ` ${formatPageName(
            comment.page_id
        )}`
    );



    const date =
        document.createElement(
            "span"
        );


    const dateIcon =
        document.createElement(
            "i"
        );


    dateIcon.className =
        "fa-regular fa-clock";


    dateIcon.setAttribute(
        "aria-hidden",
        "true"
    );


    date.appendChild(
        dateIcon
    );


    date.append(
        ` ${formatDateTime(
            comment.created_at
        )}`
    );


    meta.append(
        page,
        date
    );



    const status =
        document.createElement(
            "span"
        );


    const statusValue =
        comment.status ||
        "pending";


    status.className =
        `profile-comment-status ${statusValue}`;


    status.textContent =
        formatCommentStatus(
            statusValue
        );


    top.append(
        meta,
        status
    );



    /* =====================================
       CONTENT
    ===================================== */

    const content =
        document.createElement(
            "p"
        );


    content.className =
        "profile-comment-content";


    content.textContent =
        comment.content;



    /* =====================================
       FOOTER
    ===================================== */

    const footer =
        document.createElement(
            "div"
        );


    footer.className =
        "profile-comment-footer";


    const footerInfo =
        document.createElement(
            "div"
        );

    const likeInfo =
        document.createElement(
            "span"
        );


    likeInfo.className =
        "profile-comment-engagement";


    likeInfo.innerHTML = `
    <i
        class="fa-regular fa-thumbs-up"
        aria-hidden="true"
    ></i>

    <span>
        ${comment.likeCount || 0}
    </span>
    `;

    if (
        !comment.parent_id
    ) {

        const replyInfo =
            document.createElement(
                "span"
            );


        const replyCount =
            comment.replies?.length ||
            0;


        replyInfo.className =
            "profile-comment-engagement";


        replyInfo.innerHTML = `
        <i
            class="fa-regular fa-comment"
            aria-hidden="true"
        ></i>

        <span>
            ${replyCount}
            ${replyCount === 1
                ? "reply"
                : "replies"
            }
        </span>
    `;


        footerInfo.appendChild(
            replyInfo
        );

    }


    footerInfo.appendChild(
        likeInfo
    );


    footerInfo.className =
        "profile-comment-footer-info";


    const typeInfo =
        document.createElement(
            "span"
        );


    if (
        comment.parent_id
    ) {

        typeInfo.className =
            "profile-comment-reply-badge";


        typeInfo.innerHTML =
            `
            <i
                class="fa-solid fa-reply"
                aria-hidden="true"
            ></i>

            Reply
        `;

    } else {

        typeInfo.textContent =
            "Comment";

    }


    footerInfo.prepend(
        typeInfo
    );



    /* =====================================
       ACTIONS
    ===================================== */

    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "profile-comment-actions";


    const editButton =
        document.createElement(
            "button"
        );


    editButton.type =
        "button";


    editButton.className =
        "profile-comment-action edit";


    editButton.innerHTML =
        `
            <i
                class="fa-regular fa-pen-to-square"
                aria-hidden="true"
            ></i>

            Edit
        `;



    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.type =
        "button";


    deleteButton.className =
        "profile-comment-action delete";


    deleteButton.innerHTML =
        `
            <i
                class="fa-regular fa-trash-can"
                aria-hidden="true"
            ></i>

            Delete
        `;



    editButton.addEventListener(
        "click",
        () => {

            startCommentEdit(
                comment,
                card,
                content,
                footer
            );

        }
    );



    deleteButton.addEventListener(
        "click",
        () => {

            showCommentDeleteConfirmation(
                comment,
                actions
            );

        }
    );



    actions.append(
        editButton,
        deleteButton
    );


    footer.append(
        footerInfo,
        actions
    );


    card.append(
        top,
        content,
        footer
    );


    if (
        !comment.parent_id &&
        comment.replies?.length
    ) {

        card.appendChild(
            createProfileReplies(
                comment.replies
            )
        );

    }


    return card;

}


function createProfileReplies(
    replies
) {

    const container =
        document.createElement(
            "div"
        );


    container.className =
        "profile-comment-replies";


    const heading =
        document.createElement(
            "strong"
        );


    heading.className =
        "profile-replies-heading";


    heading.textContent =
        replies.length === 1
            ? "1 reply"
            : `${replies.length} replies`;


    container.appendChild(
        heading
    );


    replies.forEach(
        reply => {

            const item =
                document.createElement(
                    "article"
                );


            item.className =
                "profile-reply-card";


            const avatar =
                document.createElement(
                    "img"
                );


            avatar.className =
                "profile-reply-avatar";


            avatar.src =
                reply.author
                    ?.avatar_url ||
                "/Images/Avatars/default-male.png";


            avatar.alt =
                "";


            const body =
                document.createElement(
                    "div"
                );


            body.className =
                "profile-reply-body";


            const header =
                document.createElement(
                    "div"
                );


            header.className =
                "profile-reply-header";


            const identity =
                document.createElement(
                    "div"
                );


            const name =
                document.createElement(
                    "strong"
                );


            name.textContent =
                reply.author
                    ?.display_name ||
                reply.author
                    ?.username ||
                "User";


            const username =
                document.createElement(
                    "span"
                );


            username.className =
                "profile-reply-username";


            if (
                reply.author
                    ?.username
            ) {

                username.textContent =
                    `@${reply.author.username}`;

            }


            identity.append(
                name,
                username
            );


            const date =
                document.createElement(
                    "span"
                );


            date.className =
                "profile-reply-date";


            date.textContent =
                formatDateTime(
                    reply.created_at
                );


            header.append(
                identity,
                date
            );


            const text =
                document.createElement(
                    "p"
                );


            text.className =
                "profile-reply-content";


            text.textContent =
                reply.content;


            const engagement =
                document.createElement(
                    "div"
                );


            engagement.className =
                "profile-reply-engagement";


            engagement.innerHTML = `
                <i
                    class="fa-regular fa-thumbs-up"
                    aria-hidden="true"
                ></i>

                <span>
                    ${reply.likeCount || 0}
                </span>
            `;


            body.append(
                header,
                text,
                engagement
            );


            item.append(
                avatar,
                body
            );


            container.appendChild(
                item
            );

        }
    );


    return container;

}

/* =====================================
   START COMMENT EDIT
===================================== */

function startCommentEdit(
    comment,
    card,
    contentElement,
    footer
) {

    if (
        card.querySelector(
            ".profile-comment-editor"
        )
    ) {
        return;
    }


    contentElement.hidden =
        true;


    footer.hidden =
        true;



    const editor =
        document.createElement(
            "div"
        );


    editor.className =
        "profile-comment-editor";



    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.className =
        "profile-comment-edit-textarea";


    textarea.maxLength =
        3000;


    textarea.value =
        comment.content;



    const bottom =
        document.createElement(
            "div"
        );


    bottom.className =
        "profile-comment-editor-bottom";



    const characterCount =
        document.createElement(
            "span"
        );


    characterCount.className =
        "profile-comment-character-count";


    characterCount.textContent =
        `${textarea.value.length} / 3000`;



    const editorActions =
        document.createElement(
            "div"
        );


    editorActions.className =
        "profile-comment-editor-actions";



    const cancelButton =
        document.createElement(
            "button"
        );


    cancelButton.type =
        "button";


    cancelButton.className =
        "profile-comment-cancel";


    cancelButton.textContent =
        "Cancel";



    const saveButton =
        document.createElement(
            "button"
        );


    saveButton.type =
        "button";


    saveButton.className =
        "profile-comment-save";


    saveButton.innerHTML =
        `
            <i
                class="fa-solid fa-check"
                aria-hidden="true"
            ></i>

            Save changes
        `;



    textarea.addEventListener(
        "input",
        () => {

            characterCount.textContent =
                `${textarea.value.length} / 3000`;

        }
    );



    cancelButton.addEventListener(
        "click",
        () => {

            editor.remove();


            contentElement.hidden =
                false;


            footer.hidden =
                false;

        }
    );



    saveButton.addEventListener(
        "click",
        async () => {

            await saveCommentEdit(
                comment,
                textarea,
                saveButton
            );

        }
    );



    editorActions.append(
        cancelButton,
        saveButton
    );


    bottom.append(
        characterCount,
        editorActions
    );


    editor.append(
        textarea,
        bottom
    );


    contentElement.insertAdjacentElement(
        "afterend",
        editor
    );


    textarea.focus();


    textarea.setSelectionRange(
        textarea.value.length,
        textarea.value.length
    );

}

/* =====================================
   SAVE COMMENT EDIT
===================================== */

async function saveCommentEdit(
    comment,
    textarea,
    saveButton
) {

    const newContent =
        textarea.value.trim();


    if (!newContent) {

        showProfileCommentsMessage(
            "Your comment cannot be empty.",
            "error"
        );


        textarea.focus();


        return;

    }


    if (
        newContent.length >
        3000
    ) {

        showProfileCommentsMessage(
            "Comments cannot exceed 3000 characters.",
            "error"
        );


        return;

    }


    if (
        newContent ===
        comment.content
    ) {

        showProfileCommentsMessage(
            "You haven't made any changes to this comment.",
            "error"
        );


        return;

    }



    saveButton.disabled =
        true;


    saveButton.innerHTML =
        `
            <i
                class="fa-solid fa-circle-notch fa-spin"
                aria-hidden="true"
            ></i>

            Saving...
        `;



    try {

        const {
            data,
            error
        } =
            await window.supabaseClient
                .from(
                    "comments"
                )
                .update({

                    content:
                        newContent

                })
                .eq(
                    "id",
                    comment.id
                )
                .eq(
                    "user_id",
                    currentUser.id
                )
                .select(`
                    id,
                    content,
                    status,
                    updated_at
                `)
                .single();



        if (error) {

            console.error(
                "Comment edit error:",
                error
            );


            showProfileCommentsMessage(
                "Unable to update your comment. Please try again.",
                "error"
            );


            return;

        }



        const index =
            profileComments.findIndex(
                item =>
                    item.id ===
                    comment.id
            );


        if (
            index !== -1
        ) {

            profileComments[index] = {

                ...profileComments[index],

                content:
                    data.content,

                status:
                    data.status,

                updated_at:
                    data.updated_at

            };

        }



        renderProfileComments();



        showProfileCommentsMessage(
            "Your comment has been updated and sent for review.",
            "success"
        );


    } catch (error) {

        console.error(
            error
        );


        showProfileCommentsMessage(
            "Unable to update your comment. Please try again.",
            "error"
        );


    } finally {

        saveButton.disabled =
            false;

    }

}

/* =====================================
   DELETE CONFIRMATION
===================================== */

function showCommentDeleteConfirmation(
    comment,
    actions
) {

    const originalContent =
        actions.innerHTML;


    actions.innerHTML =
        "";


    actions.classList.add(
        "profile-delete-confirmation"
    );



    const question =
        document.createElement(
            "span"
        );


    question.textContent =
        "Delete this comment?";



    const cancelButton =
        document.createElement(
            "button"
        );


    cancelButton.type =
        "button";


    cancelButton.className =
        "profile-delete-cancel";


    cancelButton.textContent =
        "Cancel";



    const confirmButton =
        document.createElement(
            "button"
        );


    confirmButton.type =
        "button";


    confirmButton.className =
        "profile-delete-confirm";


    confirmButton.innerHTML =
        `
            <i
                class="fa-regular fa-trash-can"
                aria-hidden="true"
            ></i>

            Delete
        `;



    cancelButton.addEventListener(
        "click",
        () => {

            renderProfileComments();

        }
    );



    confirmButton.addEventListener(
        "click",
        async () => {

            await deleteProfileComment(
                comment,
                confirmButton
            );

        }
    );



    actions.append(
        question,
        cancelButton,
        confirmButton
    );

}

/* =====================================
   DELETE COMMENT
===================================== */

async function deleteProfileComment(
    comment,
    deleteButton
) {

    deleteButton.disabled =
        true;


    deleteButton.innerHTML =
        `
            <i
                class="fa-solid fa-circle-notch fa-spin"
                aria-hidden="true"
            ></i>

            Deleting...
        `;



    try {

        const {
            error
        } =
            await window.supabaseClient
                .from(
                    "comments"
                )
                .delete()
                .eq(
                    "id",
                    comment.id
                )
                .eq(
                    "user_id",
                    currentUser.id
                );



        if (error) {

            console.error(
                "Comment delete error:",
                error
            );


            /*
             * A parent comment may have
             * replies depending on how
             * the parent_id FK is set up.
             */

            if (
                error.code ===
                "23503"
            ) {

                showProfileCommentsMessage(
                    "This comment cannot be deleted because it has replies.",
                    "error"
                );

            } else {

                showProfileCommentsMessage(
                    "Unable to delete your comment. Please try again.",
                    "error"
                );

            }


            renderProfileComments();


            return;

        }



        profileComments =
            profileComments.filter(
                item =>
                    item.id !==
                    comment.id
            );



        updateProfileCommentCounts();


        renderProfileComments();



        showProfileCommentsMessage(
            "Your comment has been deleted.",
            "success"
        );


    } catch (error) {

        console.error(
            error
        );


        showProfileCommentsMessage(
            "Unable to delete your comment. Please try again.",
            "error"
        );


        renderProfileComments();

    }

}

/* =====================================
   COMMENTS MESSAGE
===================================== */

let profileCommentsMessageTimer;


function showProfileCommentsMessage(
    message,
    type
) {

    clearTimeout(
        profileCommentsMessageTimer
    );


    profileCommentsMessage.textContent =
        message;


    profileCommentsMessage.className =
        `profile-message show ${type}`;


    profileCommentsMessageTimer =
        window.setTimeout(
            () => {

                profileCommentsMessage.textContent =
                    "";


                profileCommentsMessage.className =
                    "profile-message";

            },
            5000
        );

}

/* =====================================
   COMMENT HELPERS
===================================== */

function formatCommentStatus(
    status
) {

    switch (status) {

        case "approved":
            return "Approved";

        case "rejected":
            return "Rejected";

        default:
            return "Pending review";

    }

}



function formatPageName(
    pageId
) {

    if (!pageId) {
        return "Islamic Qalam";
    }


    return pageId
        .replace(
            /[-_]+/g,
            " "
        )
        .replace(
            /\b\w/g,
            character =>
                character
                    .toUpperCase()
        );

}

function getCommentPageUrl(
    comment
) {

    if (
        !comment.page_id
    ) {
        return "#";
    }


    const anchor =
        `comment-${comment.id}`;


    /*
     * Video comments use:
     *
     * video-VIDEO_ID
     */

    if (
        comment.page_id.startsWith(
            "video-"
        )
    ) {

        const videoId =
            comment.page_id.substring(
                6
            );


        return (
            `video.html?v=${encodeURIComponent(
                videoId
            )}` +
            `#${anchor}`
        );

    }


    /*
     * Poem comments use the
     * page slug directly.
     */

    return (
        `${comment.page_id}.html` +
        `#${anchor}`
    );

}


function formatDateTime(
    value
) {

    if (!value) {
        return "—";
    }


    return new Date(
        value
    ).toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}

/* =====================================
   COMMENT FILTER
===================================== */

profileCommentFilter.addEventListener(
    "change",
    () => {

        renderProfileComments();

    }
);


/* =====================================
   START
===================================== */

initialiseProfile();