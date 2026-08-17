const PAGE_ID = "comments-test";


const commentForm =
    document.getElementById("commentForm");

const commentInput =
    document.getElementById("commentInput");

const commentMessage =
    document.getElementById("commentMessage");

const loggedOutMessage =
    document.getElementById("loggedOutMessage");

const commentsList =
    document.getElementById("commentsList");

const commentsLoading =
    document.getElementById("commentsLoading");


let currentUser = null;


/* =========================
   CHECK LOGIN STATUS
========================= */

async function checkLoginStatus() {

    const {
        data: { user },
        error
    } = await window.supabaseClient.auth.getUser();


    if (error || !user) {

        currentUser = null;

        commentForm.style.display =
            "none";

        loggedOutMessage.style.display =
            "block";

        return;
    }


    currentUser = user;

    loggedOutMessage.style.display =
        "none";

    commentForm.style.display =
        "block";

}


/* =========================
   LOAD COMMENTS
========================= */

async function loadComments() {

    commentsLoading.style.display =
        "block";


    const {
        data: comments,
        error
    } = await window.supabaseClient
        .from("comments")
        .select(`
            id,
            content,
            created_at,
            updated_at,
            user_id,
            parent_id,
            status,

            profiles!comments_user_id_fkey (
                username,
                display_name
            ),

            comment_likes (
                user_id
            )
        `)
        .eq("page_id", PAGE_ID)
        .order("created_at", {
            ascending: false
        });


    commentsLoading.style.display =
        "none";


    if (error) {

        console.error(error);

        commentsList.textContent =
            "Unable to load comments.";

        return;
    }


    renderComments(comments);

}


/* =========================
   DISPLAY COMMENTS
========================= */

function renderComments(comments) {

    commentsList.innerHTML = "";


    const topLevelComments =
        comments.filter(
            comment =>
                comment.parent_id === null
        );


    if (topLevelComments.length === 0) {

        const emptyMessage =
            document.createElement("p");

        emptyMessage.textContent =
            "No comments yet. Be the first to comment.";

        commentsList.appendChild(
            emptyMessage
        );

        return;
    }


    topLevelComments.forEach((comment) => {

        const article =
            createCommentElement(
                comment,
                false
            );


        /* Find replies belonging to this comment */

        const replies =
            comments.filter(
                reply =>
                    reply.parent_id === comment.id
            );


        if (replies.length > 0) {

            const repliesContainer =
                document.createElement("div");

            repliesContainer.classList.add(
                "replies"
            );


            replies.forEach((reply) => {

                const replyElement =
                    createCommentElement(
                        reply,
                        true
                    );


                repliesContainer.appendChild(
                    replyElement
                );

            });


            article.appendChild(
                repliesContainer
            );

        }


        commentsList.appendChild(
            article
        );

    });

}



function createCommentElement(
    comment,
    isReply
) {

    const article =
        document.createElement("article");


    article.classList.add(
        isReply
            ? "reply"
            : "comment"
    );


    /* =========================
       HEADER
    ========================= */

    const header =
        document.createElement("div");

    header.classList.add(
        "comment-header"
    );


    const author =
        document.createElement("span");

    author.classList.add(
        "comment-author"
    );


    author.textContent =
        comment.profiles?.display_name ||
        comment.profiles?.username ||
        "User";


    const date =
        document.createElement("span");

    date.classList.add(
        "comment-date"
    );


    date.textContent =
        new Date(
            comment.created_at
        ).toLocaleString();


    header.append(
        author,
        date
    );


    /* =========================
       COMMENT CONTENT
    ========================= */

    const content =
        document.createElement("p");

    content.classList.add(
        "comment-content"
    );

    content.textContent =
        comment.content;


    article.append(
        header,
        content
    );

    /* =========================
    MODERATION STATUS
    ========================= */

    if (comment.status === "pending") {

        const status =
            document.createElement("div");

        status.classList.add(
            "comment-status",
            "pending"
        );

        status.textContent =
            "⏳ Awaiting approval";

        article.appendChild(status);

    }


    if (comment.status === "rejected") {

        const status =
            document.createElement("div");

        status.classList.add(
            "comment-status",
            "rejected"
        );

        status.textContent =
            "Comment not approved";

        article.appendChild(status);

    }


    /* =========================
       ACTIONS
    ========================= */

    const actions =
        document.createElement("div");

    actions.classList.add(
        "comment-actions"
    );


    /* =========================
       LIKE
    ========================= */


    if (comment.status === "approved") {

    // LIKE BUTTON CODE

    const likes =
        comment.comment_likes || [];


    const likeCount =
        likes.length;


    const userHasLiked =
        currentUser
            ? likes.some(
                like =>
                    like.user_id === currentUser.id
            )
            : false;


    const likeButton =
        document.createElement("button");

    likeButton.type =
        "button";

    likeButton.classList.add(
        "like-button"
    );


    if (userHasLiked) {

        likeButton.classList.add(
            "liked"
        );

    }


    likeButton.textContent =
        `${userHasLiked ? "♥" : "♡"} ${likeCount}`;


    if (currentUser) {

        likeButton.addEventListener(
            "click",
            async () => {

                likeButton.disabled =
                    true;


                await toggleLike(
                    comment.id,
                    userHasLiked
                );

            }
        );

    } else {

        likeButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "/login.html?redirect=/comments-test.html";

            }
        );

    }


    actions.appendChild(
        likeButton
    );

}
    


    /* =========================
       REPLY

       Only top-level comments
       get Reply for now.
    ========================= */

    if (
        currentUser &&
        !isReply &&
        comment.status === "approved"
    ) {

        const replyButton =
            document.createElement("button");

        replyButton.type =
            "button";

        replyButton.classList.add(
            "comment-action-button"
        );

        replyButton.textContent =
            "Reply";


        replyButton.addEventListener(
            "click",
            () => {

                showReplyForm(
                    article,
                    comment.id
                );

            }
        );


        actions.appendChild(
            replyButton
        );

    }


    /* =========================
       EDIT + DELETE

       Only show on your own
       comments/replies.
    ========================= */

    if (
        currentUser &&
        comment.user_id === currentUser.id
    ) {

        const editButton =
            document.createElement("button");

        editButton.type =
            "button";

        editButton.classList.add(
            "comment-action-button"
        );

        editButton.textContent =
            "Edit";


        editButton.addEventListener(
            "click",
            () => {

                showEditForm(
                    article,
                    comment
                );

            }
        );


        const deleteButton =
            document.createElement("button");

        deleteButton.type =
            "button";

        deleteButton.classList.add(
            "comment-action-button",
            "delete"
        );

        deleteButton.textContent =
            "Delete";


        deleteButton.addEventListener(
            "click",
            () => {

                deleteComment(
                    comment.id
                );

            }
        );


        actions.append(
            editButton,
            deleteButton
        );

    }


    article.appendChild(
        actions
    );


    return article;

}

function showReplyForm(
    article,
    parentId
) {

    /*
        Don't create another form
        if one is already open.
    */

    if (
        article.querySelector(
            ".reply-form"
        )
    ) {
        return;
    }


    const form =
        document.createElement("div");

    form.classList.add(
        "reply-form"
    );


    const textarea =
        document.createElement("textarea");

    textarea.placeholder =
        "Write a reply...";

    textarea.maxLength =
        3000;


    const actions =
        document.createElement("div");

    actions.classList.add(
        "reply-actions"
    );


    const postButton =
        document.createElement("button");

    postButton.type =
        "button";

    postButton.classList.add(
        "comment-action-button"
    );

    postButton.textContent =
        "Post Reply";


    const cancelButton =
        document.createElement("button");

    cancelButton.type =
        "button";

    cancelButton.classList.add(
        "comment-action-button"
    );

    cancelButton.textContent =
        "Cancel";


    postButton.addEventListener(
        "click",
        async () => {

            const content =
                textarea.value.trim();


            if (!content) {
                return;
            }


            postButton.disabled =
                true;

            postButton.textContent =
                "Posting...";


            await postReply(
                parentId,
                content
            );

        }
    );


    cancelButton.addEventListener(
        "click",
        () => {

            form.remove();

        }
    );


    actions.append(
        postButton,
        cancelButton
    );


    form.append(
        textarea,
        actions
    );


    article.appendChild(
        form
    );


    textarea.focus();

}

async function postReply(
    parentId,
    content
) {

    if (!currentUser) {
        return;
    }


    const { error } =
        await window.supabaseClient
            .from("comments")
            .insert({

                user_id:
                    currentUser.id,

                page_id:
                    PAGE_ID,

                parent_id:
                    parentId,

                content:
                    content

            });


    if (error) {

        console.error(error);

        alert(
            "Unable to post reply."
        );

        return;

    }


    await loadComments();

}

function showEditForm(
    article,
    comment
) {

    article.innerHTML = "";


    const textarea =
        document.createElement("textarea");

    textarea.classList.add(
        "edit-comment-input"
    );

    textarea.maxLength = 3000;

    textarea.value =
        comment.content;


    const actions =
        document.createElement("div");

    actions.classList.add(
        "edit-actions"
    );


    const saveButton =
        document.createElement("button");

    saveButton.type = "button";

    saveButton.classList.add(
        "comment-action-button"
    );

    saveButton.textContent =
        "Save";


    const cancelButton =
        document.createElement("button");

    cancelButton.type = "button";

    cancelButton.classList.add(
        "comment-action-button"
    );

    cancelButton.textContent =
        "Cancel";


    saveButton.addEventListener(
        "click",
        async () => {

            const newContent =
                textarea.value.trim();


            if (!newContent) {
                return;
            }


            await updateComment(
                comment.id,
                newContent
            );

        }
    );


    cancelButton.addEventListener(
        "click",
        () => {
            loadComments();
        }
    );


    actions.append(
        saveButton,
        cancelButton
    );


    article.append(
        textarea,
        actions
    );

}

async function updateComment(
    commentId,
    newContent
) {

    if (!currentUser) {
        return;
    }


    const { error } =
        await window.supabaseClient
            .from("comments")
            .update({

                content:
                    newContent,

                updated_at:
                    new Date().toISOString()

            })
            .eq(
                "id",
                commentId
            );


    if (error) {

        console.error(error);

        alert(
            "Unable to update comment."
        );

        return;

    }


    await loadComments();

}


async function deleteComment(
    commentId
) {

    if (!currentUser) {
        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this comment?"
        );


    if (!confirmed) {
        return;
    }


    const { error } =
        await window.supabaseClient
            .from("comments")
            .delete()
            .eq(
                "id",
                commentId
            );


    if (error) {

        console.error(error);

        alert(
            "Unable to delete comment."
        );

        return;

    }


    await loadComments();

}


/* =========================
   LIKE / UNLIKE
========================= */

async function toggleLike(
    commentId,
    userHasLiked
) {

    if (!currentUser) {
        return;
    }


    let error;


    /* REMOVE LIKE */

    if (userHasLiked) {

        const result =
            await window.supabaseClient
                .from("comment_likes")
                .delete()
                .eq(
                    "comment_id",
                    commentId
                )
                .eq(
                    "user_id",
                    currentUser.id
                );


        error =
            result.error;

    }

    /* ADD LIKE */

    else {

        const result =
            await window.supabaseClient
                .from("comment_likes")
                .insert({

                    user_id:
                        currentUser.id,

                    comment_id:
                        commentId

                });


        error =
            result.error;

    }


    if (error) {

        console.error(error);

        alert(
            "Unable to update like."
        );

        return;

    }


    /*
        Reload comments so the
        new like count appears.
    */

    await loadComments();

}
/* =========================
   POST COMMENT
========================= */

commentForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!currentUser) {

            commentMessage.textContent =
                "You must be logged in.";

            return;
        }


        const content =
            commentInput.value.trim();


        if (!content) {

            commentMessage.textContent =
                "Comment cannot be empty.";

            return;
        }


        commentMessage.textContent =
            "Posting...";


        const { error } =
            await window.supabaseClient
                .from("comments")
                .insert({

                    user_id:
                        currentUser.id,

                    page_id:
                        PAGE_ID,

                    content:
                        content

                });


        if (error) {

            console.error(error);

            commentMessage.textContent =
                "Unable to post comment.";

            return;
        }


        commentInput.value = "";

        commentMessage.textContent =
            "Comment submitted for approval";


        await loadComments();

    }
);


/* =========================
   INITIALISE
========================= */

async function initialiseComments() {

    await checkLoginStatus();

    await loadComments();

}


initialiseComments();