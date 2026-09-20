document.addEventListener(
    "DOMContentLoaded",
    () => {

        const poemPage =
            document.querySelector(
                ".poem-page"
            );


        const commentsSection =
            document.querySelector(
                ".comments-section"
            );


        if (
            !commentsSection ||
            !window.supabaseClient
        ) {
            return;
        }



        let pageId =
            commentsSection.dataset.pageId ||
            document.querySelector(
                ".poem-page"
            )?.dataset.pageId;



        /*
         * VIDEO PAGE
         *
         * video.html?v=nooniyah-al-qahtani
         *
         * becomes:
         *
         * video-nooniyah-al-qahtani
         */

        if (
            commentsSection.dataset
                .commentType ===
            "video"
        ) {

            const params =
                new URLSearchParams(
                    window.location.search
                );


            const videoId =
                params.get(
                    "v"
                );


            if (
                !videoId
            ) {

                console.error(
                    "Video comments could not determine the video ID."
                );

                return;

            }


            pageId =
                `video-${videoId}`;

        }



        /*
         * Every comments section must
         * ultimately have a page ID.
         */

        if (
            !pageId
        ) {

            console.error(
                "Comments section is missing a page ID."
            );

            return;

        }


        if (
            !pageId
        ) {

            console.error(
                "This poem page is missing data-page-id."
            );

            return;

        }


        const commentLoginPrompt =
            document.getElementById(
                "commentLoginPrompt"
            );


        const commentsLoginLink =
            document.getElementById(
                "commentsLoginLink"
            );


        const commentForm =
            document.getElementById(
                "commentForm"
            );


        const commentContent =
            document.getElementById(
                "commentContent"
            );


        const characterCount =
            document.getElementById(
                "commentCharacterCount"
            );


        const submitButton =
            document.getElementById(
                "submitCommentButton"
            );


        const commentMessage =
            document.getElementById(
                "commentMessage"
            );


        const commentsCount =
            document.getElementById(
                "commentsCount"
            );


        const commentsLoading =
            document.getElementById(
                "commentsLoading"
            );


        const commentsList =
            document.getElementById(
                "commentsList"
            );


        const commentsEmpty =
            document.getElementById(
                "commentsEmpty"
            );


        let currentUser =
            null;

        let commentsLoadId =
            0;

        let currentUserIsAdmin =
            false;


        /* =====================================
           INITIALISE
        ===================================== */

        async function initialiseComments() {

            const {
                data: {
                    user
                }
            } =
                await window
                    .supabaseClient
                    .auth
                    .getUser();


            currentUser =
                user || null;


            await checkAdminStatus();


            updateComposer();


            await loadComments();

        }



        /* =====================================
           AUTH UI
        ===================================== */

        function updateComposer() {

            const loggedIn =
                Boolean(
                    currentUser
                );


            commentLoginPrompt.hidden =
                loggedIn;


            commentForm.hidden =
                !loggedIn;


            if (
                commentsLoginLink
            ) {

                const returnPath =
                    `${window.location.pathname}#comments`;


                commentsLoginLink.href =
                    `login.html?redirect=${encodeURIComponent(
                        returnPath
                    )
                    }`;

            }

        }


        function scrollToLinkedComment() {

            const hash =
                window.location.hash;


            if (
                !hash.startsWith(
                    "#comment-"
                )
            ) {
                return;
            }


            const commentId =
                hash.substring(
                    1
                );


            const commentElement =
                document.getElementById(
                    commentId
                );


            if (
                !commentElement
            ) {
                return;
            }


            commentElement.scrollIntoView({
                behavior:
                    "smooth",

                block:
                    "center"
            });


            commentElement.classList.add(
                "linked-comment"
            );


            window.setTimeout(
                () => {

                    commentElement.classList.remove(
                        "linked-comment"
                    );

                },
                3500
            );

        }

        /* =====================================
           LOAD COMMENTS
        ===================================== */

        async function loadComments() {

            const loadId =
                ++commentsLoadId;


            commentsLoading.hidden =
                false;

            commentsEmpty.hidden =
                true;

            commentsList.innerHTML =
                "";


            /*
             * Load ALL comments for the page.
             *
             * Do not filter parent_id here because
             * replies also need to be loaded.
             */

            const {
                data,
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
                updated_at,
                author:profiles!comments_user_id_fkey (
                    username,
                    display_name,
                    avatar_url
                )
            `)
                    .eq(
                        "page_id",
                        pageId
                    )
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            if (
                loadId !==
                commentsLoadId
            ) {
                return;
            }


            if (
                error
            ) {

                commentsLoading.hidden =
                    true;


                console.error(
                    "Comments load error:",
                    error
                );


                showMessage(
                    "Unable to load comments.",
                    "error"
                );


                return;

            }


            /*
             * Remove accidental duplicates.
             */

            const uniqueComments =
                Array.from(
                    new Map(
                        (data || []).map(
                            comment => [
                                comment.id,
                                comment
                            ]
                        )
                    ).values()
                );


            /*
             * Load likes for every comment
             * currently visible on this page.
             */

            const commentIds =
                uniqueComments.map(
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
                    await window
                        .supabaseClient
                        .from(
                            "comment_likes"
                        )
                        .select(
                            "comment_id, user_id"
                        )
                        .in(
                            "comment_id",
                            commentIds
                        );


                if (
                    likesError
                ) {

                    console.error(
                        "Comment likes load error:",
                        likesError
                    );

                } else {

                    likes =
                        likesData || [];

                }

            }


            if (
                loadId !==
                commentsLoadId
            ) {
                return;
            }


            /*
             * Attach like information to
             * each comment.
             */

            uniqueComments.forEach(
                comment => {

                    comment.likeCount =
                        likes.filter(
                            like =>
                                like.comment_id ===
                                comment.id
                        ).length;


                    comment.userLiked =
                        Boolean(
                            currentUser &&
                            likes.some(
                                like =>
                                    like.comment_id ===
                                    comment.id &&
                                    like.user_id ===
                                    currentUser.id
                            )
                        );

                }
            );


            /*
             * Top-level comments.
             */

            const topLevelComments =
                uniqueComments.filter(
                    comment =>
                        comment.parent_id ===
                        null
                );


            /*
             * Only approved top-level comments
             * count toward the main comment count.
             */

            const approvedCount =
                topLevelComments.filter(
                    comment =>
                        comment.status ===
                        "approved"
                ).length;


            commentsCount.textContent =
                `${approvedCount} ${approvedCount === 1
                    ? "comment"
                    : "comments"
                }`;


            commentsLoading.hidden =
                true;


            if (
                topLevelComments.length ===
                0
            ) {

                commentsEmpty.hidden =
                    false;

                return;

            }


            /*
             * Render each comment and then
             * its replies beneath it.
             */

            topLevelComments.forEach(
                comment => {

                    const commentElement =
                        createComment(
                            comment,
                            false
                        );


                    /*
                     * Replies are shown oldest first
                     * underneath their parent.
                     */

                    const replies =
                        uniqueComments
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


                    if (
                        replies.length >
                        0
                    ) {

                        const repliesContainer =
                            document.createElement(
                                "div"
                            );


                        repliesContainer.className =
                            "comment-replies";


                        replies.forEach(
                            reply => {

                                repliesContainer
                                    .appendChild(
                                        createComment(
                                            reply,
                                            true
                                        )
                                    );

                            }
                        );


                        commentElement
                            .appendChild(
                                repliesContainer
                            );

                    }


                    commentsList
                        .appendChild(
                            commentElement
                        );

                }
            );

            
            scrollToLinkedComment();
        }



        /* =====================================
           CREATE COMMENT CARD
        ===================================== */

        function createComment(
            comment,
            isReply = false
        ) {

            const article =
                document.createElement(
                    "article"
                );


            article.className =
                isReply
                    ? "comment-card comment-reply"
                    : "comment-card";


            article.id =
                `comment-${comment.id}`;


            article.dataset.commentId =
                comment.id;



            /* =========================
               AVATAR
            ========================= */

            const avatar =
                document.createElement(
                    "img"
                );


            avatar.className =
                "comment-avatar";


            avatar.alt =
                "Profile avatar";


            avatar.src =
                comment.author
                    ?.avatar_url ||
                "/Images/Avatars/default-male.png";



            /* =========================
               BODY
            ========================= */

            const body =
                document.createElement(
                    "div"
                );


            body.className =
                "comment-body";



            /* =========================
               HEADER
            ========================= */

            const header =
                document.createElement(
                    "div"
                );


            header.className =
                "comment-header";


            const identity =
                document.createElement(
                    "div"
                );


            const name =
                document.createElement(
                    "span"
                );


            name.className =
                "comment-name";


            name.textContent =
                comment.author
                    ?.display_name ||
                comment.author
                    ?.username ||
                "User";


            const username =
                document.createElement(
                    "span"
                );


            username.className =
                "comment-username";


            if (
                comment.author
                    ?.username
            ) {

                username.textContent =
                    `@${comment.author.username}`;

            }


            identity.append(
                name,
                username
            );


            const date =
                document.createElement(
                    "time"
                );


            date.className =
                "comment-date";


            date.dateTime =
                comment.created_at;


            date.textContent =
                formatDate(
                    comment.created_at
                );


            header.append(
                identity,
                date
            );



            /* =========================
               CONTENT
            ========================= */

            const content =
                document.createElement(
                    "p"
                );


            content.className =
                "comment-content";


            /*
             * Keep textContent here.
             * Never use innerHTML for
             * user-submitted comments.
             */

            content.textContent =
                comment.content;


            body.append(
                header,
                content
            );



            /* =========================
               STATUS
            ========================= */

            const ownComment =
                currentUser &&
                comment.user_id ===
                currentUser.id;


            const shouldShowStatus =
                currentUserIsAdmin ||
                (
                    ownComment &&
                    comment.status !==
                    "approved"
                );


            if (
                shouldShowStatus
            ) {

                const status =
                    document.createElement(
                        "span"
                    );


                const statusValue =
                    comment.status ||
                    "pending";


                status.className =
                    `comment-status ${statusValue}`;


                switch (
                statusValue
                ) {

                    case "approved":

                        status.textContent =
                            "Approved";

                        break;


                    case "rejected":

                        status.textContent =
                            "Rejected";

                        break;


                    default:

                        status.textContent =
                            "Pending review";

                }


                body.appendChild(
                    status
                );

            }



            /* =========================
               ACTIONS
            ========================= */

            const actions =
                document.createElement(
                    "div"
                );


            actions.className =
                "comment-actions";



            /* =========================
               LIKE
            ========================= */

            const likeButton =
                document.createElement(
                    "button"
                );


            likeButton.type =
                "button";


            likeButton.className =
                "comment-action-button comment-like-button";


            if (
                comment.userLiked
            ) {

                likeButton.classList.add(
                    "active"
                );

            }


            likeButton.setAttribute(
                "aria-pressed",
                String(
                    comment.userLiked
                )
            );


            const likeIcon =
                document.createElement(
                    "i"
                );


            likeIcon.className =
                comment.userLiked
                    ? "fa-solid fa-thumbs-up"
                    : "fa-regular fa-thumbs-up";


            likeIcon.setAttribute(
                "aria-hidden",
                "true"
            );


            const likeCount =
                document.createElement(
                    "span"
                );


            likeCount.textContent =
                comment.likeCount || 0;


            likeButton.append(
                likeIcon,
                likeCount
            );


            likeButton.addEventListener(
                "click",
                async () => {

                    if (
                        !currentUser
                    ) {

                        if (
                            commentsLoginLink
                        ) {

                            window.location.href =
                                commentsLoginLink.href;

                        }

                        return;

                    }



                    await toggleCommentLike(
                        comment,
                        likeButton,
                        likeIcon,
                        likeCount
                    );

                }
            );


            actions.appendChild(
                likeButton
            );



            /* =========================
               REPLY
            ========================= */

            /*
             * Keep replies one level deep
             * for now, like YouTube.
             *
             * A reply cannot itself have
             * another nested reply thread.
             */

            /* =========================
   REPLY
========================= */

            if (
                currentUser
            ) {

                const replyButton =
                    document.createElement(
                        "button"
                    );


                replyButton.type =
                    "button";


                replyButton.className =
                    "comment-action-button";


                replyButton.innerHTML = `
        <i
            class="fa-regular fa-comment"
            aria-hidden="true"
        ></i>

        <span>
            Reply
        </span>
    `;


                replyButton.addEventListener(
                    "click",
                    () => {

                        /*
                         * If replying to a top-level comment,
                         * that comment becomes the thread parent.
                         *
                         * If replying to an existing reply,
                         * keep it inside the same original thread.
                         */

                        const threadParentId =
                            isReply
                                ? comment.parent_id
                                : comment.id;


                        const targetUsername =
                            isReply
                                ? (
                                    comment.author
                                        ?.username ||
                                    ""
                                )
                                : "";


                        showReplyForm(
                            body,
                            threadParentId,
                            targetUsername
                        );

                    }
                );


                actions.appendChild(
                    replyButton
                );

            }


            body.appendChild(
                actions
            );


            article.append(
                avatar,
                body
            );


            return article;

        }

        /* =====================================
   COMMENT LIKES
===================================== */

        async function toggleCommentLike(
            comment,
            likeButton,
            likeIcon,
            likeCount
        ) {

            if (
                !currentUser
            ) {
                return;
            }


            const wasLiked =
                comment.userLiked;


            const oldCount =
                comment.likeCount || 0;


            /*
             * Update UI immediately.
             */

            comment.userLiked =
                !wasLiked;


            comment.likeCount =
                wasLiked
                    ? Math.max(
                        0,
                        oldCount - 1
                    )
                    : oldCount + 1;


            likeButton.classList.toggle(
                "active",
                comment.userLiked
            );


            likeButton.setAttribute(
                "aria-pressed",
                String(
                    comment.userLiked
                )
            );


            likeIcon.className =
                comment.userLiked
                    ? "fa-solid fa-thumbs-up"
                    : "fa-regular fa-thumbs-up";


            likeCount.textContent =
                comment.likeCount;


            /*
             * Update Supabase quietly.
             */

            let error;


            if (
                wasLiked
            ) {

                const result =
                    await window
                        .supabaseClient
                        .from(
                            "comment_likes"
                        )
                        .delete()
                        .eq(
                            "comment_id",
                            comment.id
                        )
                        .eq(
                            "user_id",
                            currentUser.id
                        );


                error =
                    result.error;

            } else {

                const result =
                    await window
                        .supabaseClient
                        .from(
                            "comment_likes"
                        )
                        .insert({

                            user_id:
                                currentUser.id,

                            comment_id:
                                comment.id

                        });


                error =
                    result.error;

            }


            /*
             * If Supabase failed,
             * restore previous UI.
             */

            if (
                error
            ) {

                console.error(
                    "Comment like error:",
                    error
                );


                comment.userLiked =
                    wasLiked;


                comment.likeCount =
                    oldCount;


                likeButton.classList.toggle(
                    "active",
                    wasLiked
                );


                likeButton.setAttribute(
                    "aria-pressed",
                    String(
                        wasLiked
                    )
                );


                likeIcon.className =
                    wasLiked
                        ? "fa-solid fa-thumbs-up"
                        : "fa-regular fa-thumbs-up";


                likeCount.textContent =
                    oldCount;

            }

        }

        /* =====================================
   REPLY FORM
===================================== */

        function showReplyForm(
            container,
            parentId,
            targetUsername = ""
        ) {

            /*
             * Don't create another form
             * if one is already open.
             */

            const existingForm =
                container.querySelector(
                    ".reply-form"
                );


            if (
                existingForm
            ) {

                existingForm
                    .querySelector(
                        "textarea"
                    )
                    ?.focus();


                return;

            }


            const form =
                document.createElement(
                    "div"
                );


            form.className =
                "reply-form";


            const textarea =
                document.createElement(
                    "textarea"
                );


            textarea.className =
                "reply-textarea";


            textarea.placeholder =
                "Write a reply...";



            textarea.maxLength =
                3000;


            if (
                targetUsername
            ) {

                textarea.value =
                    `@${targetUsername} `;

            }

            textarea.setAttribute(
                "aria-label",
                "Write a reply"
            );



            const footer =
                document.createElement(
                    "div"
                );


            footer.className =
                "reply-form-actions";



            const cancelButton =
                document.createElement(
                    "button"
                );


            cancelButton.type =
                "button";


            cancelButton.className =
                "reply-cancel-button";


            cancelButton.textContent =
                "Cancel";



            const postButton =
                document.createElement(
                    "button"
                );


            postButton.type =
                "button";


            postButton.className =
                "reply-submit-button";


            postButton.textContent =
                "Reply";



            cancelButton.addEventListener(
                "click",
                () => {

                    form.remove();

                }
            );



            postButton.addEventListener(
                "click",
                async () => {

                    const content =
                        textarea.value
                            .trim();



                    const mentionOnly =
                        targetUsername &&
                        content ===
                        `@${targetUsername}`;


                    if (
                        !content ||
                        mentionOnly
                    ) {

                        textarea.focus();

                        return;

                    }


                    if (
                        !content
                    ) {

                        textarea.focus();

                        return;

                    }


                    if (
                        content.length >
                        3000
                    ) {

                        return;

                    }


                    postButton.disabled =
                        true;


                    postButton.innerHTML = `
                <i
                    class="fa-solid fa-circle-notch fa-spin"
                    aria-hidden="true"
                ></i>

                Posting...
            `;


                    const success =
                        await postReply(
                            parentId,
                            content
                        );


                    if (
                        !success
                    ) {

                        postButton.disabled =
                            false;


                        postButton.textContent =
                            "Reply";

                    }

                }
            );


            footer.append(
                cancelButton,
                postButton
            );


            form.append(
                textarea,
                footer
            );


            container.appendChild(
                form
            );


            textarea.focus();

        }

        /* =====================================
   POST REPLY
===================================== */

        async function postReply(
            parentId,
            content
        ) {

            if (
                !currentUser
            ) {
                return false;
            }


            const {
                error
            } =
                await window
                    .supabaseClient
                    .from(
                        "comments"
                    )
                    .insert({

                        user_id:
                            currentUser.id,

                        page_id:
                            pageId,

                        parent_id:
                            parentId,

                        content:
                            content

                    });


            if (
                error
            ) {

                console.error(
                    "Reply insert error:",
                    error
                );


                showMessage(
                    "Unable to post your reply. Please try again.",
                    "error"
                );


                return false;

            }


            showMessage(
                "Your reply has been submitted for review.",
                "success"
            );


            await loadComments();


            return true;

        }



        /* =====================================
           SUBMIT COMMENT
        ===================================== */

        commentForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                if (
                    !currentUser
                ) {
                    return;
                }


                const content =
                    commentContent
                        .value
                        .trim();


                if (
                    !content
                ) {

                    showMessage(
                        "Please write a comment first.",
                        "error"
                    );


                    return;

                }


                if (
                    content.length >
                    3000
                ) {

                    showMessage(
                        "Your comment cannot exceed 3000 characters.",
                        "error"
                    );


                    return;

                }


                setSubmitting(
                    true
                );


                const {
                    error
                } =
                    await window
                        .supabaseClient
                        .from(
                            "comments"
                        )
                        .insert({

                            user_id:
                                currentUser.id,

                            page_id:
                                pageId,

                            parent_id:
                                null,

                            content:
                                content

                        });


                setSubmitting(
                    false
                );


                if (
                    error
                ) {

                    console.error(
                        "Comment insert error:",
                        error
                    );


                    showMessage(
                        "Unable to post your comment. Please try again.",
                        "error"
                    );


                    return;

                }


                commentContent.value =
                    "";


                updateCharacterCount();


                showMessage(
                    "Your comment has been submitted for review. You can see it while it is pending.",
                    "success"
                );


                await loadComments();

            }
        );



        /* =====================================
           CHARACTER COUNTER
        ===================================== */

        commentContent.addEventListener(
            "input",
            updateCharacterCount
        );


        function updateCharacterCount() {

            characterCount.textContent =
                `${commentContent
                    .value
                    .length
                } / 3000`;

        }



        /* =====================================
           BUTTON LOADING
        ===================================== */

        function setSubmitting(
            loading
        ) {

            submitButton.disabled =
                loading;


            submitButton.innerHTML =
                loading
                    ? `
                        <span>
                            Posting...
                        </span>

                        <i
                            class="fa-solid fa-circle-notch fa-spin"
                            aria-hidden="true"
                        ></i>
                    `
                    : `
                        <span>
                            Post comment
                        </span>

                        <i
                            class="fa-regular fa-paper-plane"
                            aria-hidden="true"
                        ></i>
                    `;

        }



        /* =====================================
           MESSAGE
        ===================================== */

        let messageTimeout;


        function showMessage(
            message,
            type
        ) {

            clearTimeout(
                messageTimeout
            );


            commentMessage.textContent =
                message;


            commentMessage.className =
                `comment-message show ${type}`;


            messageTimeout =
                window.setTimeout(
                    () => {

                        commentMessage.textContent =
                            "";


                        commentMessage.className =
                            "comment-message";

                    },
                    5000
                );

        }



        /* =====================================
           DATE
        ===================================== */

        function formatDate(
            value
        ) {

            return new Date(
                value
            ).toLocaleDateString(
                undefined,
                {
                    day:
                        "numeric",

                    month:
                        "short",

                    year:
                        "numeric"
                }
            );

        }



        /* =====================================
           AUTH CHANGES
        ===================================== */

        window
            .supabaseClient
            .auth
            .onAuthStateChange(
                (
                    event,
                    session
                ) => {

                    /*
                     * initialiseComments()
                     * already handles the
                     * initial session.
                     */

                    if (
                        event ===
                        "INITIAL_SESSION"
                    ) {
                        return;
                    }


                    /*
                     * User logged in.
                     */

                    if (
                        event ===
                        "SIGNED_IN"
                    ) {

                        const previousUserId =
                            currentUser?.id;


                        currentUser =
                            session?.user ||
                            null;


                        updateComposer();


                        /*
                         * Only reload if this
                         * is actually a different
                         * authentication state.
                         */

                        if (
                            previousUserId !==
                            currentUser?.id
                        ) {

                            loadComments();

                        }


                        return;

                    }


                    /*
                     * User logged out.
                     */

                    if (
                        event ===
                        "SIGNED_OUT"
                    ) {

                        currentUser =
                            null;


                        currentUserIsAdmin =
                            false;


                        updateComposer();


                        loadComments();


                        return;

                    }


                    /*
                     * Profile/auth data changed.
                     */

                    if (
                        event ===
                        "USER_UPDATED"
                    ) {

                        currentUser =
                            session?.user ||
                            null;


                        updateComposer();

                    }

                }
            );


        async function checkAdminStatus() {

            if (
                !currentUser
            ) {

                currentUserIsAdmin =
                    false;

                return;

            }


            const {
                data,
                error
            } =
                await window.supabaseClient
                    .rpc(
                        "admin_check_access"
                    );


            if (
                error
            ) {

                console.error(
                    "Admin check error:",
                    error
                );


                currentUserIsAdmin =
                    false;


                return;

            }


            currentUserIsAdmin =
                data === true;

        }



        updateCharacterCount();


        initialiseComments();

    }
);