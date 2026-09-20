document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =====================================================
           POEM
           ===================================================== */

        const poemPage =
            document.querySelector(
                ".poem-page"
            );


        if (
            !poemPage ||
            !window.supabaseClient
        ) {

            return;

        }


        const poemId =
            poemPage.dataset.pageId;


        if (
            !poemId
        ) {

            console.error(
                "Poem analytics could not determine the poem ID."
            );

            return;

        }



        /* =====================================================
           ELEMENTS
           ===================================================== */

        const viewCountElement =
            document.getElementById(
                "poemViewCount"
            );


        const likeButton =
            document.getElementById(
                "poemLikeButton"
            );


        const likeIcon =
            document.getElementById(
                "poemLikeIcon"
            );


        const likeCountElement =
            document.getElementById(
                "poemLikeCount"
            );



        /* =====================================================
           NUMBER FORMAT
           ===================================================== */

        const numberFormatter =
            new Intl.NumberFormat(
                "en-AU"
            );


        function formatNumber(
            value
        ) {

            return numberFormatter.format(
                Number(value) || 0
            );

        }



        /* =====================================================
           VIEW COUNT
           ===================================================== */

        let currentViewCount =
            0;


        function updateViewUI() {

            if (
                !viewCountElement
            ) {

                return;

            }


            viewCountElement.textContent =
                `${formatNumber(
                    currentViewCount
                )} ${currentViewCount === 1
                    ? "view"
                    : "views"
                }`;

        }



        async function loadViewCount() {

            const {
                data,
                error
            } =
                await window
                    .supabaseClient
                    .from(
                        "poem_stats"
                    )
                    .select(
                        "view_count"
                    )
                    .eq(
                        "poem_id",
                        poemId
                    )
                    .maybeSingle();


            if (
                error
            ) {

                console.error(
                    "Poem view count error:",
                    error
                );

                return;

            }


            currentViewCount =
                Number(
                    data?.view_count
                ) || 0;


            updateViewUI();

        }



        /* =====================================================
           10-SECOND VIEW SESSION
           ===================================================== */

        const VIEW_REQUIRED_MS =
            10 * 1000;


        let visibleTimeMs =
            0;


        let visibleSegmentStartedAt =
            null;


        let poemViewRegistered =
            false;


        let viewTrackingInterval =
            null;



        /* =====================================================
           START VISIBLE SEGMENT
           ===================================================== */

        function startVisibleSegment() {

            if (
                poemViewRegistered ||
                visibleSegmentStartedAt !==
                null ||
                document.visibilityState !==
                "visible"
            ) {

                return;

            }


            visibleSegmentStartedAt =
                performance.now();

        }



        /* =====================================================
           STOP VISIBLE SEGMENT
           ===================================================== */

        function stopVisibleSegment() {

            if (
                visibleSegmentStartedAt ===
                null
            ) {

                return;

            }


            visibleTimeMs +=
                performance.now() -
                visibleSegmentStartedAt;


            visibleSegmentStartedAt =
                null;

        }



        /* =====================================================
           CURRENT VISIBLE TIME
           ===================================================== */

        function getVisibleTime() {

            let total =
                visibleTimeMs;


            if (
                visibleSegmentStartedAt !==
                null
            ) {

                total +=
                    performance.now() -
                    visibleSegmentStartedAt;

            }


            return total;

        }



        /* =====================================================
           START A BRAND-NEW VISIT SESSION
           ===================================================== */

        function startNewViewSession() {

            window.clearInterval(
                viewTrackingInterval
            );


            visibleTimeMs =
                0;


            visibleSegmentStartedAt =
                null;


            poemViewRegistered =
                false;


            if (
                document.visibilityState ===
                "visible"
            ) {

                startVisibleSegment();

            }


            viewTrackingInterval =
                window.setInterval(
                    checkViewThreshold,
                    250
                );

        }



        /* =====================================================
           CHECK 10-SECOND THRESHOLD
           ===================================================== */

        async function checkViewThreshold() {

            if (
                poemViewRegistered
            ) {

                window.clearInterval(
                    viewTrackingInterval
                );

                return;

            }


            const totalVisibleTime =
                getVisibleTime();


            if (
                totalVisibleTime <
                VIEW_REQUIRED_MS
            ) {

                return;

            }


            /*
             * Set this immediately so another
             * interval cannot register a second view.
             */

            poemViewRegistered =
                true;


            stopVisibleSegment();


            window.clearInterval(
                viewTrackingInterval
            );


            await registerPoemView();

        }



        /* =====================================================
           REGISTER VIEW IN SUPABASE
           ===================================================== */

        async function registerPoemView() {

            const {
                data,
                error
            } =
                await window
                    .supabaseClient
                    .rpc(
                        "register_poem_view",
                        {
                            p_poem_id:
                                poemId
                        }
                    );


            if (
                error
            ) {

                console.error(
                    "Register poem view error:",
                    error
                );


                /*
                 * Allow another attempt if the
                 * database/network request failed.
                 */

                poemViewRegistered =
                    false;


                startVisibleSegment();


                viewTrackingInterval =
                    window.setInterval(
                        checkViewThreshold,
                        250
                    );


                return;

            }


            /*
             * RPC returns the NEW total view count.
             */

            currentViewCount =
                Number(
                    data
                ) || currentViewCount;


            updateViewUI();

        }



        /* =====================================================
           TAB VISIBILITY
           ===================================================== */

        document.addEventListener(
            "visibilitychange",
            () => {


                /*
                 * Don't count time while the tab
                 * is hidden/backgrounded.
                 */

                if (
                    document.visibilityState ===
                    "hidden"
                ) {

                    stopVisibleSegment();

                    return;

                }


                startVisibleSegment();

            }
        );



        /* =====================================================
           NAVIGATING AWAY
           ===================================================== */

        window.addEventListener(
            "pagehide",
            () => {


                /*
                 * End this visit completely.
                 *
                 * This is important for browser
                 * back/forward cache behaviour.
                 */

                stopVisibleSegment();


                window.clearInterval(
                    viewTrackingInterval
                );


                visibleTimeMs =
                    0;


                visibleSegmentStartedAt =
                    null;


                poemViewRegistered =
                    false;

            }
        );



        /* =====================================================
           RETURNING TO PAGE
           ===================================================== */

        window.addEventListener(
            "pageshow",
            event => {


                /*
                 * Especially important when browser
                 * restores this page from BFCache.
                 *
                 * Returning begins a completely NEW
                 * 10-second session.
                 */

                if (
                    event.persisted
                ) {

                    startNewViewSession();

                }

            }
        );



        /* =====================================================
           LIKES
           ===================================================== */

        let currentUser =
            null;


        let poemLikedByCurrentUser =
            false;


        let poemLikeCount =
            0;


        let likeRequestInProgress =
            false;



        /* =====================================================
           LOAD LIKES
           ===================================================== */

        async function loadPoemLikes() {


            /*
             * Load public total.
             */

            const {
                data: countData,
                error: countError
            } =
                await window
                    .supabaseClient
                    .rpc(
                        "get_poem_like_count",
                        {
                            p_poem_id:
                                poemId
                        }
                    );


            if (
                countError
            ) {

                console.error(
                    "Poem like count error:",
                    countError
                );

            } else {

                poemLikeCount =
                    Number(
                        countData
                    ) || 0;

            }



            /*
             * Get current user.
             */

            const {
                data: authData
            } =
                await window
                    .supabaseClient
                    .auth
                    .getUser();


            currentUser =
                authData?.user ||
                null;



            /*
             * Check whether this logged-in
             * user already liked the poem.
             */

            if (
                currentUser
            ) {

                const {
                    data,
                    error
                } =
                    await window
                        .supabaseClient
                        .from(
                            "poem_likes"
                        )
                        .select(
                            "user_id"
                        )
                        .eq(
                            "poem_id",
                            poemId
                        )
                        .eq(
                            "user_id",
                            currentUser.id
                        )
                        .maybeSingle();


                if (
                    error
                ) {

                    console.error(
                        "Poem like status error:",
                        error
                    );

                } else {

                    poemLikedByCurrentUser =
                        Boolean(
                            data
                        );

                }

            }


            updateLikeUI();

        }



        /* =====================================================
           LIKE UI
           ===================================================== */

        function updateLikeUI() {

            if (
                likeCountElement
            ) {

                likeCountElement.textContent =
                    `${formatNumber(
                        poemLikeCount
                    )} ${poemLikeCount === 1
                        ? "like"
                        : "likes"
                    }`;

            }


            if (
                !likeButton
            ) {

                return;

            }


            likeButton.classList.toggle(
                "active",
                poemLikedByCurrentUser
            );


            likeButton.setAttribute(
                "aria-pressed",
                String(
                    poemLikedByCurrentUser
                )
            );


            if (
                likeIcon
            ) {

                likeIcon.className =
                    poemLikedByCurrentUser
                        ? "fa-solid fa-thumbs-up"
                        : "fa-regular fa-thumbs-up";

            }

        }



        /* =====================================================
           LIKE / UNLIKE
           ===================================================== */

        likeButton
            ?.addEventListener(
                "click",
                async () => {


                    if (
                        likeRequestInProgress
                    ) {

                        return;

                    }



                    /*
                     * Likes require an account,
                     * just like your video likes.
                     */

                    if (
                        !currentUser
                    ) {

                        const returnPath =
                            `${window.location.pathname}${window.location.search}`;


                        window.location.href =
                            `/login.html?redirect=${encodeURIComponent(
                                returnPath
                            )}`;


                        return;

                    }


                    likeRequestInProgress =
                        true;


                    likeButton.disabled =
                        true;


                    const previousLiked =
                        poemLikedByCurrentUser;


                    const previousCount =
                        poemLikeCount;



                    /*
                     * Optimistic UI.
                     */

                    poemLikedByCurrentUser =
                        !previousLiked;


                    poemLikeCount =
                        poemLikedByCurrentUser
                            ? previousCount + 1
                            : Math.max(
                                0,
                                previousCount - 1
                            );


                    updateLikeUI();



                    let error;



                    /* ================= UNLIKE ================= */

                    if (
                        previousLiked
                    ) {

                        const result =
                            await window
                                .supabaseClient
                                .from(
                                    "poem_likes"
                                )
                                .delete()
                                .eq(
                                    "poem_id",
                                    poemId
                                )
                                .eq(
                                    "user_id",
                                    currentUser.id
                                );


                        error =
                            result.error;

                    }



                    /* ================= LIKE ================= */

                    else {

                        const result =
                            await window
                                .supabaseClient
                                .from(
                                    "poem_likes"
                                )
                                .insert({

                                    user_id:
                                        currentUser.id,

                                    poem_id:
                                        poemId

                                });


                        error =
                            result.error;

                    }



                    /* ================= FAILURE ================= */

                    if (
                        error
                    ) {

                        console.error(
                            "Poem like error:",
                            error
                        );


                        poemLikedByCurrentUser =
                            previousLiked;


                        poemLikeCount =
                            previousCount;


                        updateLikeUI();

                    }


                    likeRequestInProgress =
                        false;


                    likeButton.disabled =
                        false;

                }
            );



        /* =====================================================
           AUTH CHANGES
           ===================================================== */

        window
            .supabaseClient
            .auth
            .onAuthStateChange(
                (
                    event,
                    session
                ) => {


                    if (
                        event ===
                        "INITIAL_SESSION"
                    ) {

                        return;

                    }


                    currentUser =
                        session?.user ||
                        null;


                    if (
                        !currentUser
                    ) {

                        poemLikedByCurrentUser =
                            false;

                    }


                    loadPoemLikes();

                }
            );



        /* =====================================================
           INITIALISE
           ===================================================== */

        loadViewCount();


        loadPoemLikes();


        startNewViewSession();


    }
);