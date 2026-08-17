const adminLoading =
    document.getElementById(
        "adminLoading"
    );

const accessDenied =
    document.getElementById(
        "accessDenied"
    );

const adminDashboard =
    document.getElementById(
        "adminDashboard"
    );

const adminFooter =
    document.getElementById(
        "adminFooter"
    );

const adminEmail =
    document.getElementById(
        "adminEmail"
    );


const pendingCount =
    document.getElementById(
        "pendingCount"
    );

const approvedCount =
    document.getElementById(
        "approvedCount"
    );

const rejectedCount =
    document.getElementById(
        "rejectedCount"
    );

const usersCount =
    document.getElementById(
        "usersCount"
    );

const pendingTabCount =
    document.getElementById(
        "pendingTabCount"
    );


const commentsAdminList =
    document.getElementById(
        "commentsAdminList"
    );

const usersTableBody =
    document.getElementById(
        "usersTableBody"
    );


const commentSearch =
    document.getElementById(
        "commentSearch"
    );

const userSearch =
    document.getElementById(
        "userSearch"
    );

const adminMessageForm =
    document.getElementById(
        "adminMessageForm"
    );


const messageRecipient =
    document.getElementById(
        "messageRecipient"
    );


const messageType =
    document.getElementById(
        "messageType"
    );


const messageTitle =
    document.getElementById(
        "messageTitle"
    );


const messageContent =
    document.getElementById(
        "messageContent"
    );


const sendAdminMessageButton =
    document.getElementById(
        "sendAdminMessageButton"
    );


const adminMessageStatus =
    document.getElementById(
        "adminMessageStatus"
    );


let currentAdminUser =
    null;

let adminComments = [];

let adminUsers = [];

let activeCommentFilter =
    "pending";



/* =====================================
   ADMIN INITIALISATION
===================================== */

async function initialiseAdmin() {

    const {
        data: { user },
        error: userError
    } =
        await window.supabaseClient
            .auth
            .getUser();


    if (
        userError ||
        !user
    ) {

        window.location.href =
            "/login.html?redirect=/admin-test.html";

        return;

    }


    const {
        data: hasAccess,
        error: accessError
    } =
        await window.supabaseClient
            .rpc(
                "admin_check_access"
            );


    if (
        accessError ||
        hasAccess !== true
    ) {

        console.error(
            accessError
        );

        showAccessDenied();

        return;

    }

    currentAdminUser =
        user;


    adminEmail.textContent =
        user.email;


    adminLoading.hidden =
        true;

    adminDashboard.hidden =
        false;

    adminFooter.hidden =
        false;


    await Promise.all([
        loadAdminComments(),
        loadAdminUsers()
    ]);

}



/* =====================================
   ACCESS DENIED
===================================== */

function showAccessDenied() {

    adminLoading.hidden =
        true;

    accessDenied.hidden =
        false;

}



/* =====================================
   LOAD COMMENTS
===================================== */

async function loadAdminComments() {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "comments"
            )
            .select(`
                id,
                user_id,
                page_id,
                parent_id,
                content,
                created_at,
                updated_at,
                status,

                profiles!comments_user_id_fkey (
                    username,
                    display_name
                )
            `)
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (
        error
    ) {

        console.error(
            "Unable to load comments:",
            error
        );


        commentsAdminList.textContent =
            "Unable to load comments.";


        return;

    }


    adminComments =
        data || [];


    /*
     * Load like information for
     * every comment and reply.
     */

    const commentIds =
        adminComments.map(
            comment =>
                comment.id
        );


    let likes =
        [];


    if (
        commentIds.length > 0
    ) {

        const {
            data: likesData,
            error: likesError
        } =
            await window.supabaseClient
                .from(
                    "comment_likes"
                )
                .select(
                    "comment_id"
                )
                .in(
                    "comment_id",
                    commentIds
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
                likesData || [];

        }

    }


    /*
     * Attach like count to
     * each comment.
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


    adminComments.forEach(
        comment => {

            comment.likeCount =
                likeCounts.get(
                    comment.id
                ) || 0;

        }
    );


    updateDashboardCounts();

    renderAdminComments();

}



/* =====================================
   COMMENT COUNTS
===================================== */

function updateDashboardCounts() {

    const pending =
        adminComments.filter(
            comment =>
                comment.status ===
                "pending"
        ).length;


    const approved =
        adminComments.filter(
            comment =>
                comment.status ===
                "approved"
        ).length;


    const rejected =
        adminComments.filter(
            comment =>
                comment.status ===
                "rejected"
        ).length;


    pendingCount.textContent =
        pending;

    approvedCount.textContent =
        approved;

    rejectedCount.textContent =
        rejected;

    pendingTabCount.textContent =
        pending;

}



/* =====================================
   RENDER COMMENTS
===================================== */

function renderAdminComments() {

    commentsAdminList.innerHTML =
        "";


    const query =
        commentSearch.value
            .trim()
            .toLowerCase();


    /*
     * Only top-level comments
     * become main cards.
     */

    const topLevelComments =
        adminComments.filter(
            comment =>
                comment.parent_id ===
                null
        );


    /*
     * Build each discussion thread.
     */

    const threads =
        topLevelComments
            .map(
                comment => {

                    /*
                     * Get every reply belonging
                     * to this discussion.
                     */

                    const allReplies =
                        adminComments
                            .filter(
                                reply =>
                                    reply.parent_id ===
                                    comment.id
                            )
                            .sort(
                                (
                                    a,
                                    b
                                ) =>
                                    new Date(
                                        a.created_at
                                    ) -
                                    new Date(
                                        b.created_at
                                    )
                            );


                    /*
                     * Only show replies that belong
                     * to the currently selected
                     * moderation status.
                     *
                     * "All" shows everything.
                     */

                    const visibleReplies =
                        allReplies.filter(
                            reply =>
                                adminCommentMatchesFilter(
                                    reply,
                                    query
                                )
                        );


                    /*
                     * Check whether the parent
                     * itself matches the current
                     * filter.
                     */

                    const parentMatches =
                        adminCommentMatchesFilter(
                            comment,
                            query
                        );


                    return {

                        comment,

                        replies:
                            visibleReplies,

                        parentMatches

                    };

                }
            )
            .filter(
                thread => {

                    /*
                     * Keep this discussion when:
                     *
                     * 1. The parent matches, OR
                     * 2. At least one reply matches.
                     *
                     * The parent is still displayed
                     * as context when only a reply
                     * matches.
                     */

                    return (
                        thread.parentMatches ||
                        thread.replies.length > 0
                    );

                }
            );


    if (
        threads.length ===
        0
    ) {

        const empty =
            document.createElement(
                "p"
            );


        empty.className =
            "admin-empty-state";


        empty.textContent =
            activeCommentFilter ===
                "pending"
                ? "No comments are waiting for approval."
                : "No comments found.";


        commentsAdminList.appendChild(
            empty
        );


        return;

    }


    threads.forEach(
        thread => {

            commentsAdminList
                .appendChild(
                    createAdminCommentCard(
                        thread.comment,
                        thread.replies
                    )
                );

        }
    );

}

function adminCommentMatchesFilter(
    comment,
    query
) {

    const matchesStatus =
        activeCommentFilter ===
        "all" ||
        comment.status ===
        activeCommentFilter;


    const author =
        (
            comment
                .profiles
                ?.display_name ||
            comment
                .profiles
                ?.username ||
            ""
        )
            .toLowerCase();


    const matchesSearch =
        !query ||
        comment.content
            .toLowerCase()
            .includes(
                query
            ) ||
        author.includes(
            query
        ) ||
        comment.page_id
            .toLowerCase()
            .includes(
                query
            );


    return (
        matchesStatus &&
        matchesSearch
    );

}


/* =====================================
   COMMENT CARD
===================================== */

function createAdminCommentCard(
    comment,
    replies = [],
    isNestedReply = false
) {

    const card =
        document.createElement(
            "article"
        );

    card.className =
        isNestedReply
            ? "admin-comment-card admin-comment-reply-card"
            : "admin-comment-card";


    const top =
        document.createElement(
            "div"
        );

    top.className =
        "admin-comment-top";


    const authorWrapper =
        document.createElement(
            "div"
        );

    authorWrapper.className =
        "admin-comment-author";


    const avatar =
        document.createElement(
            "span"
        );

    avatar.className =
        "admin-comment-avatar";


    const displayName =
        comment
            .profiles
            ?.display_name ||
        comment
            .profiles
            ?.username ||
        "User";


    avatar.textContent =
        displayName
            .charAt(0)
            .toUpperCase();


    const authorInfo =
        document.createElement(
            "div"
        );

    authorInfo.className =
        "admin-comment-author-info";


    const authorName =
        document.createElement(
            "strong"
        );

    authorName.textContent =
        displayName;


    const date =
        document.createElement(
            "span"
        );

    date.className =
        "admin-comment-meta";

    date.textContent =
        new Date(
            comment.created_at
        ).toLocaleString();


    authorInfo.append(
        authorName,
        date
    );


    authorWrapper.append(
        avatar,
        authorInfo
    );


    const status =
        document.createElement(
            "span"
        );

    status.className =
        `admin-status-badge ${comment.status}`;

    status.textContent =
        comment.status;


    top.append(
        authorWrapper,
        status
    );


    const content =
        document.createElement(
            "p"
        );

    content.className =
        "admin-comment-content";

    content.textContent =
        comment.content;


    const context =
        document.createElement(
            "div"
        );

    context.className =
        "admin-comment-context";


    const page =
        document.createElement(
            "span"
        );

    page.innerHTML =
        `<i class="fa-regular fa-file-lines"></i>
         Page: ${escapeHtml(comment.page_id)}`;


    const type =
        document.createElement(
            "span"
        );

    type.innerHTML =
        comment.parent_id
            ? `<i class="fa-solid fa-reply"></i>
               Reply to #${comment.parent_id}`
            : `<i class="fa-regular fa-comment"></i>
               Top-level comment`;


    context.append(
        page,
        type
    );

    const likesInfo =
        document.createElement(
            "span"
        );


    likesInfo.className =
        "admin-comment-engagement";


    likesInfo.innerHTML = `
    <i
        class="fa-regular fa-thumbs-up"
        aria-hidden="true"
    ></i>

    ${comment.likeCount || 0}
    ${comment.likeCount === 1
            ? "like"
            : "likes"
        }
    `;


    context.appendChild(
        likesInfo
    );


    if (
        !comment.parent_id
    ) {

        const repliesInfo =
            document.createElement(
                "span"
            );


        repliesInfo.className =
            "admin-comment-engagement";


        repliesInfo.innerHTML = `
        <i
            class="fa-regular fa-comments"
            aria-hidden="true"
        ></i>

        ${replies.length}
        ${replies.length === 1
                ? "reply"
                : "replies"
            }
    `;


        context.appendChild(
            repliesInfo
        );

    }


    const actions =
        document.createElement(
            "div"
        );

    actions.className =
        "admin-comment-actions";


    if (
        comment.status !==
        "approved"
    ) {

        const approve =
            createActionButton(
                "approve",
                "fa-check",
                "Approve"
            );


        approve.addEventListener(
            "click",
            () => {

                moderateComment(
                    comment.id,
                    "approved"
                );

            }
        );


        actions.appendChild(
            approve
        );

    }


    if (
        comment.status !==
        "rejected"
    ) {

        const reject =
            createActionButton(
                "reject",
                "fa-xmark",
                "Reject"
            );


        reject.addEventListener(
            "click",
            () => {

                moderateComment(
                    comment.id,
                    "rejected"
                );

            }
        );


        actions.appendChild(
            reject
        );

    }


    if (
        comment.status !==
        "pending"
    ) {

        const pending =
            createActionButton(
                "restore",
                "fa-clock",
                "Move to Pending"
            );


        pending.addEventListener(
            "click",
            () => {

                moderateComment(
                    comment.id,
                    "pending"
                );

            }
        );


        actions.appendChild(
            pending
        );

    }

    const deleteButton =
        createActionButton(
            "delete",
            "fa-trash-can",
            "Delete Permanently"
        );


    deleteButton.addEventListener(
        "click",
        () => {

            showPermanentDeleteConfirmation(
                comment,
                actions
            );

        }
    );


    actions.appendChild(
        deleteButton
    );


    card.append(
        top,
        content,
        context,
        actions
    );


    /*
     * Only main comments contain
     * their reply thread.
     */

    if (
        !isNestedReply &&
        replies.length > 0
    ) {

        card.appendChild(
            createAdminRepliesSection(
                replies
            )
        );

    }


    return card;

}


/* =====================================
   COMMENT REPLIES
===================================== */

function createAdminRepliesSection(
    replies
) {

    const COLLAPSED_REPLY_LIMIT =
        3;


    const section =
        document.createElement(
            "div"
        );


    section.className =
        "admin-replies-section";


    const heading =
        document.createElement(
            "div"
        );


    heading.className =
        "admin-replies-heading";


    heading.innerHTML = `
        <i
            class="fa-solid fa-reply"
            aria-hidden="true"
        ></i>

        <strong>
            ${replies.length === 1
            ? "1 reply"
            : `${replies.length} replies`
        }
        </strong>
    `;


    section.appendChild(
        heading
    );


    const list =
        document.createElement(
            "div"
        );


    list.className =
        "admin-replies-list";


    const hiddenReplies =
        [];


    replies.forEach(
        (
            reply,
            index
        ) => {

            const replyCard =
                createAdminCommentCard(
                    reply,
                    [],
                    true
                );


            if (
                index >=
                COLLAPSED_REPLY_LIMIT
            ) {

                replyCard.hidden =
                    true;


                hiddenReplies.push(
                    replyCard
                );

            }


            list.appendChild(
                replyCard
            );

        }
    );


    section.appendChild(
        list
    );


    /*
     * More than 3 replies:
     * hide the remainder.
     */

    if (
        hiddenReplies.length >
        0
    ) {

        const toggle =
            document.createElement(
                "button"
            );


        toggle.type =
            "button";


        toggle.className =
            "admin-replies-toggle";


        let expanded =
            false;


        function updateToggle() {

            toggle.innerHTML =
                expanded
                    ? `
                        <i
                            class="fa-solid fa-chevron-up"
                            aria-hidden="true"
                        ></i>

                        Hide replies
                    `
                    : `
                        <i
                            class="fa-solid fa-chevron-down"
                            aria-hidden="true"
                        ></i>

                        Show
                        ${hiddenReplies.length}
                        more
                        ${hiddenReplies.length === 1
                        ? "reply"
                        : "replies"
                    }
                    `;

        }


        toggle.addEventListener(
            "click",
            () => {

                expanded =
                    !expanded;


                hiddenReplies.forEach(
                    reply => {

                        reply.hidden =
                            !expanded;

                    }
                );


                updateToggle();

            }
        );


        updateToggle();


        section.appendChild(
            toggle
        );

    }


    return section;

}


/* =====================================
   ACTION BUTTON
===================================== */

function createActionButton(
    className,
    icon,
    text
) {

    const button =
        document.createElement(
            "button"
        );

    button.type =
        "button";

    button.className =
        `admin-action ${className}`;


    const iconElement =
        document.createElement(
            "i"
        );

    iconElement.className =
        `fa-solid ${icon}`;

    iconElement.setAttribute(
        "aria-hidden",
        "true"
    );


    button.append(
        iconElement,
        document.createTextNode(
            text
        )
    );


    return button;

}



/* =====================================
   MODERATE COMMENT
===================================== */

async function moderateComment(
    commentId,
    newStatus
) {

    const {
        error
    } =
        await window.supabaseClient
            .rpc(
                "admin_set_comment_status",
                {
                    p_comment_id:
                        commentId,

                    p_status:
                        newStatus
                }
            );


    if (error) {

        console.error(
            error
        );

        alert(
            "Unable to update comment."
        );

        return;

    }


    const comment =
        adminComments.find(
            item =>
                item.id ===
                commentId
        );


    if (comment) {

        comment.status =
            newStatus;

    }


    updateDashboardCounts();

    renderAdminComments();

}



/* =====================================
   DELETE COMMENT CONFIRMATION
===================================== */

function showPermanentDeleteConfirmation(
    comment,
    actions
) {

    actions.innerHTML =
        "";


    actions.classList.add(
        "admin-delete-confirmation"
    );


    const warning =
        document.createElement(
            "div"
        );


    warning.className =
        "admin-delete-warning";


    warning.innerHTML = `
        <i
            class="fa-solid fa-triangle-exclamation"
            aria-hidden="true"
        ></i>

        <span>
            Permanently delete this comment?
            ${!comment.parent_id
            ? " Its replies will also be deleted."
            : ""
        }
        </span>
    `;


    const cancelButton =
        document.createElement(
            "button"
        );


    cancelButton.type =
        "button";


    cancelButton.className =
        "admin-delete-cancel";


    cancelButton.textContent =
        "Cancel";


    const confirmButton =
        document.createElement(
            "button"
        );


    confirmButton.type =
        "button";


    confirmButton.className =
        "admin-delete-confirm";


    confirmButton.innerHTML = `
        <i
            class="fa-solid fa-trash-can"
            aria-hidden="true"
        ></i>

        Delete permanently
    `;


    cancelButton.addEventListener(
        "click",
        () => {

            renderAdminComments();

        }
    );


    confirmButton.addEventListener(
        "click",
        async () => {

            await permanentlyDeleteComment(
                comment.id,
                confirmButton
            );

        }
    );


    actions.append(
        warning,
        cancelButton,
        confirmButton
    );

}

/* =====================================
   PERMANENTLY DELETE COMMENT
===================================== */

async function permanentlyDeleteComment(
    commentId,
    button
) {

    button.disabled =
        true;


    button.innerHTML = `
        <i
            class="fa-solid fa-circle-notch fa-spin"
            aria-hidden="true"
        ></i>

        Deleting...
    `;


    const {
        data,
        error
    } =
        await window
            .supabaseClient
            .rpc(
                "admin_delete_comment",
                {
                    p_comment_id:
                        commentId
                }
            );


    if (
        error
    ) {

        console.error(
            "Unable to permanently delete comment:",
            error
        );


        alert(
            "Unable to permanently delete this comment."
        );


        renderAdminComments();

        return;

    }


    if (
        data !== true
    ) {

        alert(
            "This comment no longer exists."
        );


        await loadAdminComments();

        return;

    }


    /*
     * Reload from Supabase because
     * deleting a parent may also have
     * deleted multiple replies.
     */

    await loadAdminComments();

}

/* =====================================
   LOAD USERS
===================================== */

async function loadAdminUsers() {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .rpc(
                "admin_list_users"
            );


    if (error) {

        console.error(
            "Unable to load users:",
            error
        );

        usersTableBody.innerHTML =
            `
                <tr>
                    <td
                        colspan="6"
                        class="admin-table-empty"
                    >
                        Unable to load users.
                    </td>
                </tr>
            `;

        return;

    }


    adminUsers =
        data || [];


    usersCount.textContent =
        adminUsers.length;


    renderAdminUsers();


    populateMessageRecipients();

}

/* =====================================
   MESSAGE RECIPIENTS
===================================== */

function populateMessageRecipients() {

    const selectedValue =
        messageRecipient.value;


    messageRecipient.innerHTML =
        "";


    /*
     * Global broadcast.
     */

    const globalOption =
        document.createElement(
            "option"
        );


    globalOption.value =
        "all";


    globalOption.textContent =
        "All registered users — Global broadcast";


    messageRecipient.appendChild(
        globalOption
    );


    /*
     * Individual users.
     */

    const sortedUsers =
        [...adminUsers]
            .filter(
                user =>
                    user.id !==
                    currentAdminUser?.id
            )
            .sort(
                (
                    a,
                    b
                ) => {

                    const nameA =
                        (
                            a.display_name ||
                            a.username ||
                            a.email ||
                            ""
                        )
                            .toLowerCase();


                    const nameB =
                        (
                            b.display_name ||
                            b.username ||
                            b.email ||
                            ""
                        )
                            .toLowerCase();


                    return nameA.localeCompare(
                        nameB
                    );

                }
            );


    sortedUsers.forEach(
        user => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                user.id;


            const displayName =
                user.display_name ||
                user.username ||
                "User";


            const username =
                user.username
                    ? `@${user.username}`
                    : "";


            const email =
                user.email ||
                "";


            option.textContent =
                [
                    displayName,
                    username,
                    email
                ]
                    .filter(
                        Boolean
                    )
                    .join(
                        " — "
                    );


            messageRecipient.appendChild(
                option
            );

        }
    );


    /*
     * Preserve selection when possible.
     */

    if (
        selectedValue &&
        Array.from(
            messageRecipient.options
        ).some(
            option =>
                option.value ===
                selectedValue
        )
    ) {

        messageRecipient.value =
            selectedValue;

    }

}

/* =====================================
   RENDER USERS
===================================== */

function renderAdminUsers() {

    usersTableBody.innerHTML =
        "";


    const query =
        userSearch.value
            .trim()
            .toLowerCase();


    const filtered =
        adminUsers.filter(
            user => {

                const searchable =
                    [
                        user.email,
                        user.username,
                        user.display_name
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                return (
                    !query ||
                    searchable.includes(
                        query
                    )
                );

            }
        );


    if (
        filtered.length === 0
    ) {

        usersTableBody.innerHTML =
            `
                <tr>
                    <td
                        colspan="6"
                        class="admin-table-empty"
                    >
                        No users found.
                    </td>
                </tr>
            `;

        return;

    }


    filtered.forEach(
        user => {

            const row =
                document.createElement(
                    "tr"
                );


            const userCell =
                document.createElement(
                    "td"
                );


            const userName =
                document.createElement(
                    "div"
                );

            userName.className =
                "admin-user-name";


            const display =
                document.createElement(
                    "strong"
                );

            display.textContent =
                user.display_name ||
                user.username ||
                "User";


            const username =
                document.createElement(
                    "span"
                );

            username.textContent =
                user.username
                    ? `@${user.username}`
                    : user.id;


            userName.append(
                display,
                username
            );


            userCell.appendChild(
                userName
            );


            const emailCell =
                document.createElement(
                    "td"
                );

            emailCell.textContent =
                user.email || "—";


            const statusCell =
                document.createElement(
                    "td"
                );


            const status =
                document.createElement(
                    "span"
                );


            const suspendedUntil =
                user.banned_until
                    ? new Date(
                        user.banned_until
                    )
                    : null;


            const isSuspended =
                suspendedUntil &&
                suspendedUntil >
                new Date();

            const isPermanentlyBanned =
                user.is_permanently_banned ===
                true;


            if (
                isPermanentlyBanned
            ) {

                status.className =
                    "admin-user-status banned";


                status.textContent =
                    "Banned";

            } else if (
                isSuspended
            ) {

                status.className =
                    "admin-user-status suspended";


                status.textContent =
                    `Suspended until ${formatDate(
                        user.banned_until
                    )}`;

            } else if (
                user.email_confirmed_at
            ) {

                status.className =
                    "admin-user-status verified";


                status.textContent =
                    "Verified";

            } else {

                status.className =
                    "admin-user-status unverified";


                status.textContent =
                    "Unverified";

            }

            statusCell.appendChild(
                status
            );


            const joinedCell =
                document.createElement(
                    "td"
                );

            joinedCell.textContent =
                formatDate(
                    user.created_at
                );


            const signInCell =
                document.createElement(
                    "td"
                );

            signInCell.textContent =
                user.last_sign_in_at
                    ? formatDate(
                        user.last_sign_in_at
                    )
                    : "Never";

            const actionsCell =
                document.createElement(
                    "td"
                );


            actionsCell.className =
                "admin-user-actions-cell";


            /*
             * Don't show account controls
             * for the admin currently using
             * the dashboard.
             */

            if (
                user.id ===
                currentAdminUser?.id
            ) {

                const selfLabel =
                    document.createElement(
                        "span"
                    );


                selfLabel.className =
                    "admin-current-user-label";


                selfLabel.textContent =
                    "Current admin";


                actionsCell.appendChild(
                    selfLabel
                );

            } else if (
                isPermanentlyBanned
            ) {

                /*
                 * Permanently banned:
                 * only show Unban.
                 */

                const unbanButton =
                    createAccountActionButton(
                        "unban",
                        "fa-user-check",
                        "Unban"
                    );


                unbanButton.addEventListener(
                    "click",
                    () => {

                        const confirmed =
                            window.confirm(
                                `Unban ${user.email ||
                                user.username ||
                                "this account"
                                }? They will be able to log in again.`
                            );


                        if (
                            !confirmed
                        ) {
                            return;
                        }


                        changePermanentBan(
                            user,
                            "unban",
                            unbanButton
                        );

                    }
                );


                actionsCell.appendChild(
                    unbanButton
                );

            } else {

                const actionGroup =
                    document.createElement(
                        "div"
                    );


                actionGroup.className =
                    "admin-user-action-group";


                /*
                 * Suspended account.
                 */

                if (
                    isSuspended
                ) {

                    const unsuspendButton =
                        createAccountActionButton(
                            "unsuspend",
                            "fa-unlock",
                            "Unsuspend"
                        );


                    unsuspendButton.addEventListener(
                        "click",
                        () => {

                            changeUserSuspension(
                                user,
                                "none",
                                unsuspendButton
                            );

                        }
                    );


                    actionGroup.appendChild(
                        unsuspendButton
                    );

                } else {

                    /*
                     * Normal account:
                     * temporary suspension controls.
                     */

                    const suspensionControls =
                        document.createElement(
                            "div"
                        );


                    suspensionControls.className =
                        "admin-suspension-controls";


                    const duration =
                        document.createElement(
                            "select"
                        );


                    duration.className =
                        "admin-suspension-duration";


                    duration.innerHTML = `
            <option value="1h">
                1 hour
            </option>

            <option value="24h">
                24 hours
            </option>

            <option value="168h">
                7 days
            </option>

            <option value="720h">
                30 days
            </option>
        `;


                    const suspendButton =
                        createAccountActionButton(
                            "suspend",
                            "fa-user-clock",
                            "Suspend"
                        );


                    suspendButton.addEventListener(
                        "click",
                        () => {

                            const confirmed =
                                window.confirm(
                                    `Suspend ${user.email ||
                                    user.username ||
                                    "this user"
                                    } for ${duration.options[
                                        duration.selectedIndex
                                    ].text
                                    }?`
                                );


                            if (
                                !confirmed
                            ) {
                                return;
                            }


                            changeUserSuspension(
                                user,
                                duration.value,
                                suspendButton
                            );

                        }
                    );


                    suspensionControls.append(
                        duration,
                        suspendButton
                    );


                    actionGroup.appendChild(
                        suspensionControls
                    );

                }


                /*
                 * Permanent ban is available for
                 * both normal and suspended users.
                 */

                const banButton =
                    createAccountActionButton(
                        "ban",
                        "fa-user-slash",
                        "Ban"
                    );


                banButton.addEventListener(
                    "click",
                    () => {

                        const confirmed =
                            window.confirm(
                                `Permanently ban ${user.email ||
                                user.username ||
                                "this account"
                                }?\n\nThe account will remain in the database, but the user will no longer be able to log in.`
                            );


                        if (
                            !confirmed
                        ) {
                            return;
                        }


                        changePermanentBan(
                            user,
                            "ban",
                            banButton
                        );

                    }
                );


                actionGroup.appendChild(
                    banButton
                );


                actionsCell.appendChild(
                    actionGroup
                );

            }

            /*
             * Permanent deletion.
            */

            if (
                user.id !==
                currentAdminUser?.id
            ) {

                const deleteAccountButton =
                    createAccountActionButton(
                        "delete-account",
                        "fa-trash-can",
                        "Delete"
                    );


                deleteAccountButton.addEventListener(
                    "click",
                    () => {

                        permanentlyDeleteUser(
                            user,
                            deleteAccountButton
                        );

                    }
                );


                actionsCell.appendChild(
                    deleteAccountButton
                );

            }


            row.append(
                userCell,
                emailCell,
                statusCell,
                joinedCell,
                signInCell,
                actionsCell
            );


            usersTableBody.appendChild(
                row
            );

        }
    );

}


function createAccountActionButton(
    className,
    icon,
    text
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        `admin-user-action ${className}`;


    button.innerHTML = `
        <i
            class="fa-solid ${icon}"
            aria-hidden="true"
        ></i>

        ${text}
    `;


    return button;

}


/* =====================================
   PERMANENT ACCOUNT BAN
===================================== */

async function changePermanentBan(
    user,
    action,
    button
) {

    const originalContent =
        button.innerHTML;


    button.disabled =
        true;


    button.innerHTML = `
        <i
            class="fa-solid fa-circle-notch fa-spin"
            aria-hidden="true"
        ></i>

        ${action === "ban"
            ? "Banning..."
            : "Unbanning..."
        }
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
                    "admin-user-suspension",
                    {
                        body: {

                            user_id:
                                user.id,

                            action:
                                action

                        }
                    }
                );


        if (
            error
        ) {

            console.error(
                error
            );


            alert(
                action === "ban"
                    ? "Unable to ban this account."
                    : "Unable to unban this account."
            );


            button.disabled =
                false;


            button.innerHTML =
                originalContent;


            return;

        }


        if (
            data?.error
        ) {

            alert(
                data.error
            );


            button.disabled =
                false;


            button.innerHTML =
                originalContent;


            return;

        }


        await loadAdminUsers();


    } catch (
    error
    ) {

        console.error(
            error
        );


        alert(
            "Unable to update this account."
        );


        button.disabled =
            false;


        button.innerHTML =
            originalContent;

    }

}


/* =====================================
   PERMANENT ACCOUNT DELETION
===================================== */

async function permanentlyDeleteUser(
    user,
    button
) {

    const accountName =
        user.email ||
        user.username ||
        "this account";


    const confirmation =
        window.prompt(
            `Permanently delete ${accountName}?\n\nThis cannot be undone.\n\nType DELETE to confirm.`
        );


    if (
        confirmation !==
        "DELETE"
    ) {
        return;
    }


    const reason =
        window.prompt(
            "Reason for deletion (optional):",
            "User requested account deletion"
        );


    const originalContent =
        button.innerHTML;


    button.disabled =
        true;


    button.innerHTML = `
        <i
            class="fa-solid fa-circle-notch fa-spin"
            aria-hidden="true"
        ></i>

        Deleting...
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
                    "admin-delete-user",
                    {
                        body: {

                            user_id:
                                user.id,

                            reason:
                                reason || null

                        }
                    }
                );


        if (
            error
        ) {

            console.error(
                "Delete account error:",
                error
            );


            alert(
                "Unable to permanently delete this account."
            );


            button.disabled =
                false;


            button.innerHTML =
                originalContent;


            return;

        }


        if (
            data?.error
        ) {

            alert(
                data.error
            );


            button.disabled =
                false;


            button.innerHTML =
                originalContent;


            return;

        }


        /*
         * Reload dashboard users.
         */

        await loadAdminUsers();


        alert(
            "The account has been permanently deleted."
        );


    } catch (
        error
    ) {

        console.error(
            error
        );


        alert(
            "Unable to permanently delete this account."
        );


        button.disabled =
            false;


        button.innerHTML =
            originalContent;

    }

}

/* =====================================
   USER SUSPENSION
===================================== */

async function changeUserSuspension(
    user,
    duration,
    button
) {

    const originalContent =
        button.innerHTML;


    button.disabled =
        true;


    button.innerHTML = `
        <i
            class="fa-solid fa-circle-notch fa-spin"
            aria-hidden="true"
        ></i>

        ${duration === "none"
            ? "Unsuspending..."
            : "Suspending..."
        }
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
                    "admin-user-suspension",
                    {
                        body: {

                            user_id:
                                user.id,

                            duration:
                                duration

                        }
                    }
                );


        if (
            error
        ) {

            console.error(
                "User suspension error:",
                error
            );


            alert(
                "Unable to update this user's suspension."
            );


            button.disabled =
                false;


            button.innerHTML =
                originalContent;


            return;

        }


        if (
            data?.error
        ) {

            alert(
                data.error
            );


            button.disabled =
                false;


            button.innerHTML =
                originalContent;


            return;

        }


        /*
         * Reload so banned_until
         * comes directly from Auth.
         */

        await loadAdminUsers();


    } catch (
    error
    ) {

        console.error(
            error
        );


        alert(
            "Unable to update this user's suspension."
        );


        button.disabled =
            false;


        button.innerHTML =
            originalContent;

    }

}

/* =====================================
   FILTERS
===================================== */

document
    .querySelectorAll(
        ".comment-filter"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".comment-filter"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    button.classList.add(
                        "active"
                    );


                    activeCommentFilter =
                        button.dataset.status;


                    renderAdminComments();

                }
            );

        }
    );


commentSearch.addEventListener(
    "input",
    renderAdminComments
);


userSearch.addEventListener(
    "input",
    renderAdminUsers
);



/* =====================================
   DASHBOARD TABS
===================================== */

document
    .querySelectorAll(
        ".admin-tab"
    )
    .forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".admin-tab"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    tab.classList.add(
                        "active"
                    );


                    const selected =
                        tab.dataset.tab;


                    document
                        .getElementById(
                            "commentsPanel"
                        )
                        .hidden =
                        selected !==
                        "comments";


                    document
                        .getElementById(
                            "messagesPanel"
                        )
                        .hidden =
                        selected !==
                        "messages";


                    document
                        .getElementById(
                            "usersPanel"
                        )
                        .hidden =
                        selected !==
                        "users";

                }
            );

        }
    );



/* =====================================
   LOGOUT
===================================== */

document
    .getElementById(
        "adminLogoutButton"
    )
    .addEventListener(
        "click",
        async () => {

            await window
                .supabaseClient
                .auth
                .signOut();


            window.location.href =
                "/login.html";

        }
    );



/* =====================================
   HELPERS
===================================== */

function formatDate(value) {

    if (!value) {
        return "—";
    }


    return new Date(
        value
    ).toLocaleString(
        undefined,
        {
            dateStyle:
                "medium",

            timeStyle:
                "short"
        }
    );

}


function escapeHtml(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}

/* =====================================
   SEND ADMIN MESSAGE
===================================== */

adminMessageForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (
            !currentAdminUser
        ) {
            return;
        }


        const title =
            messageTitle.value
                .trim();


        const content =
            messageContent.value
                .trim();


        const recipientValue =
            messageRecipient.value;


        const type =
            messageType.value;


        if (
            !title ||
            !content
        ) {

            showAdminMessageStatus(
                "Please enter both a title and message.",
                "error"
            );


            return;

        }


        const recipientUserId =
            recipientValue ===
                "all"
                ? null
                : recipientValue;


        /*
         * Prevent accidental broadcasts.
         */

        if (
            recipientUserId ===
            null
        ) {

            const confirmed =
                window.confirm(
                    "Send this message to all registered users?"
                );


            if (
                !confirmed
            ) {
                return;
            }

        }


        setAdminMessageSending(
            true
        );


        const {
            error
        } =
            await window.supabaseClient
                .from(
                    "messages"
                )
                .insert({

                    recipient_user_id:
                        recipientUserId,

                    title:
                        title,

                    content:
                        content,

                    message_type:
                        type,

                    created_by:
                        currentAdminUser.id

                });


        setAdminMessageSending(
            false
        );


        if (
            error
        ) {

            console.error(
                "Unable to send admin message:",
                error
            );


            showAdminMessageStatus(
                "Unable to send the message.",
                "error"
            );


            return;

        }


        if (
            recipientUserId ===
            null
        ) {

            showAdminMessageStatus(
                "Global broadcast sent successfully.",
                "success"
            );

        } else {

            showAdminMessageStatus(
                "Message sent successfully.",
                "success"
            );

        }


        /*
         * Clear message but preserve
         * selected recipient/type.
         */

        messageTitle.value =
            "";


        messageContent.value =
            "";

    }
);

function setAdminMessageSending(
    sending
) {

    sendAdminMessageButton.disabled =
        sending;


    sendAdminMessageButton.innerHTML =
        sending
            ? `
                <i
                    class="fa-solid fa-circle-notch fa-spin"
                    aria-hidden="true"
                ></i>

                Sending...
            `
            : `
                <i
                    class="fa-regular fa-paper-plane"
                    aria-hidden="true"
                ></i>

                Send message
            `;

}


let adminMessageStatusTimer;


function showAdminMessageStatus(
    text,
    type
) {

    clearTimeout(
        adminMessageStatusTimer
    );


    adminMessageStatus.textContent =
        text;


    adminMessageStatus.className =
        `admin-message-status show ${type}`;


    adminMessageStatusTimer =
        window.setTimeout(
            () => {

                adminMessageStatus.textContent =
                    "";


                adminMessageStatus.className =
                    "admin-message-status";

            },
            5000
        );

}


/* =====================================
   START
===================================== */

initialiseAdmin();