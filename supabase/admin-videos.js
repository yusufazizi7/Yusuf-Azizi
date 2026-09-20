document.addEventListener(
    "DOMContentLoaded",
    async () => {


        /* =====================================================
           ELEMENTS
           ===================================================== */

        const videosPanel =
            document.getElementById(
                "videosPanel"
            );


        if (!videosPanel) {
            return;
        }


        const videosList =
            document.getElementById(
                "adminVideosList"
            );


        const videoSearch =
            document.getElementById(
                "videoSearch"
            );


        const videoSort =
            document.getElementById(
                "videoSort"
            );


        const refreshButton =
            document.getElementById(
                "refreshVideoStats"
            );


        const totalVideosElement =
            document.getElementById(
                "videoTotalCount"
            );


        const totalViewsElement =
            document.getElementById(
                "videoTotalViews"
            );


        const totalLikesElement =
            document.getElementById(
                "videoTotalLikes"
            );


        const totalCommentsElement =
            document.getElementById(
                "videoTotalComments"
            );



        /* =====================================================
           STATE
           ===================================================== */

        let adminVideos =
            [];



        /* =====================================================
           FORMAT NUMBER
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
           SECURITY / ADMIN CHECK
           ===================================================== */

        async function verifyAdminAccess() {

            if (
                !window.supabaseClient
            ) {

                console.error(
                    "Supabase client is unavailable."
                );

                return false;

            }


            const {
                data: {
                    user
                },
                error: userError
            } =
                await window
                    .supabaseClient
                    .auth
                    .getUser();


            if (
                userError ||
                !user
            ) {

                return false;

            }


            const {
                data: hasAccess,
                error: accessError
            } =
                await window
                    .supabaseClient
                    .rpc(
                        "admin_check_access"
                    );


            if (
                accessError ||
                hasAccess !== true
            ) {

                if (accessError) {

                    console.error(
                        "Video analytics admin check failed:",
                        accessError
                    );

                }


                return false;

            }


            return true;

        }



        /* =====================================================
           LOAD ANALYTICS
           ===================================================== */

        async function loadVideoAnalytics() {


            setLoadingState();


            refreshButton.disabled =
                true;


            refreshButton.innerHTML = `
                <i
                    class="fa-solid fa-circle-notch fa-spin"
                    aria-hidden="true">
                </i>

                Refreshing
            `;


            /*
             * Video metadata comes from
             * scripts/Data/videos.js
             */

            const videoDefinitions =
                Array.isArray(
                    window.islamicQalamVideos
                )
                    ? window.islamicQalamVideos
                    : [];


            if (
                videoDefinitions.length ===
                0
            ) {

                videosList.innerHTML = `

                    <p class="admin-empty-state">

                        No video definitions were found.

                    </p>

                `;


                finishRefreshButton();

                return;

            }



            /* =================================================
               DATABASE REQUESTS
               ================================================= */


            const [
                statsResult,
                likesResult,
                commentsResult
            ] =
                await Promise.all([


                    /*
                     * View counts
                     */

                    window
                        .supabaseClient
                        .from(
                            "video_stats"
                        )
                        .select(
                            `
                                video_id,
                                view_count,
                                updated_at
                            `
                        ),


                    /*
                     * One row = one video like
                     */

                    window
                        .supabaseClient
                        .from(
                            "video_likes"
                        )
                        .select(
                            "video_id"
                        ),


                    /*
                     * Match the public comments counter:
                     *
                     * - approved
                     * - top-level only
                     * - video pages only
                     */

                    window
                        .supabaseClient
                        .from(
                            "comments"
                        )
                        .select(
                            `
                                id,
                                page_id
                            `
                        )
                        .like(
                            "page_id",
                            "video-%"
                        )
                        .eq(
                            "status",
                            "approved"
                        )
                        .is(
                            "parent_id",
                            null
                        )

                ]);



            /* =================================================
               HANDLE DATABASE ERRORS
               ================================================= */

            if (
                statsResult.error
            ) {

                console.error(
                    "Unable to load video views:",
                    statsResult.error
                );

            }


            if (
                likesResult.error
            ) {

                console.error(
                    "Unable to load video likes:",
                    likesResult.error
                );

            }


            if (
                commentsResult.error
            ) {

                console.error(
                    "Unable to load video comments:",
                    commentsResult.error
                );

            }



            /* =================================================
               VIEW COUNTS
               ================================================= */

            const viewsByVideo =
                new Map();


            (
                statsResult.data ||
                []
            ).forEach(
                row => {

                    viewsByVideo.set(
                        row.video_id,
                        Number(
                            row.view_count
                        ) || 0
                    );

                }
            );



            /* =================================================
               LIKE COUNTS
               ================================================= */

            const likesByVideo =
                new Map();


            (
                likesResult.data ||
                []
            ).forEach(
                row => {

                    likesByVideo.set(
                        row.video_id,
                        (
                            likesByVideo.get(
                                row.video_id
                            ) || 0
                        ) + 1
                    );

                }
            );



            /* =================================================
               COMMENT COUNTS
               ================================================= */

            const commentsByVideo =
                new Map();


            (
                commentsResult.data ||
                []
            ).forEach(
                row => {

                    if (
                        !row.page_id ||
                        !row.page_id.startsWith(
                            "video-"
                        )
                    ) {
                        return;
                    }


                    const videoId =
                        row.page_id.substring(
                            6
                        );


                    commentsByVideo.set(
                        videoId,
                        (
                            commentsByVideo.get(
                                videoId
                            ) || 0
                        ) + 1
                    );

                }
            );



            /* =================================================
               MERGE VIDEO DATA
               ================================================= */

            adminVideos =
                videoDefinitions.map(
                    video => {

                        return {

                            id:
                                video.id,

                            title:
                                video.title ||
                                video.id,

                            category:
                                video.category ||
                                "Video",

                            thumbnail:
                                video.thumbnail ||
                                "",

                            description:
                                video.description ||
                                "",


                            views:
                                viewsByVideo.get(
                                    video.id
                                ) || 0,


                            likes:
                                likesByVideo.get(
                                    video.id
                                ) || 0,


                            comments:
                                commentsByVideo.get(
                                    video.id
                                ) || 0

                        };

                    }
                );



            /* =================================================
               UPDATE TOTALS
               ================================================= */

            updateVideoTotals();


            /* =================================================
               RENDER
               ================================================= */

            renderVideos();


            finishRefreshButton();

        }



        /* =====================================================
           TOTAL STATISTICS
           ===================================================== */

        function updateVideoTotals() {

            const totalVideos =
                adminVideos.length;


            const totalViews =
                adminVideos.reduce(
                    (
                        total,
                        video
                    ) =>
                        total +
                        video.views,
                    0
                );


            const totalLikes =
                adminVideos.reduce(
                    (
                        total,
                        video
                    ) =>
                        total +
                        video.likes,
                    0
                );


            const totalComments =
                adminVideos.reduce(
                    (
                        total,
                        video
                    ) =>
                        total +
                        video.comments,
                    0
                );


            totalVideosElement.textContent =
                formatNumber(
                    totalVideos
                );


            totalViewsElement.textContent =
                formatNumber(
                    totalViews
                );


            totalLikesElement.textContent =
                formatNumber(
                    totalLikes
                );


            totalCommentsElement.textContent =
                formatNumber(
                    totalComments
                );

        }



        /* =====================================================
           RENDER VIDEOS
           ===================================================== */

        function renderVideos() {

            videosList.innerHTML =
                "";


            const query =
                (
                    videoSearch.value ||
                    ""
                )
                    .trim()
                    .toLowerCase();


            let visibleVideos =
                adminVideos.filter(
                    video => {

                        return (
                            !query ||
                            video.title
                                .toLowerCase()
                                .includes(
                                    query
                                ) ||
                            video.category
                                .toLowerCase()
                                .includes(
                                    query
                                ) ||
                            video.id
                                .toLowerCase()
                                .includes(
                                    query
                                )
                        );

                    }
                );


            visibleVideos =
                sortVideos(
                    visibleVideos
                );


            if (
                visibleVideos.length ===
                0
            ) {

                videosList.innerHTML = `

                    <p class="admin-empty-state">

                        No videos found.

                    </p>

                `;


                return;

            }


            visibleVideos.forEach(
                video => {

                    videosList.appendChild(
                        createVideoCard(
                            video
                        )
                    );

                }
            );

        }



        /* =====================================================
           SORT
           ===================================================== */

        function sortVideos(
            videos
        ) {

            const sorted =
                [...videos];


            switch (
            videoSort.value
            ) {


                case "likes-desc":

                    sorted.sort(
                        (
                            a,
                            b
                        ) =>
                            b.likes -
                            a.likes
                    );

                    break;


                case "comments-desc":

                    sorted.sort(
                        (
                            a,
                            b
                        ) =>
                            b.comments -
                            a.comments
                    );

                    break;


                case "views-asc":

                    sorted.sort(
                        (
                            a,
                            b
                        ) =>
                            a.views -
                            b.views
                    );

                    break;


                case "title-asc":

                    sorted.sort(
                        (
                            a,
                            b
                        ) =>
                            a.title.localeCompare(
                                b.title
                            )
                    );

                    break;


                case "views-desc":
                default:

                    sorted.sort(
                        (
                            a,
                            b
                        ) =>
                            b.views -
                            a.views
                    );

                    break;

            }


            return sorted;

        }



        /* =====================================================
           CREATE VIDEO CARD
           ===================================================== */

        function createVideoCard(
            video
        ) {

            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "admin-video-card";


            const thumbnail =
                document.createElement(
                    "a"
                );


            thumbnail.className =
                "admin-video-thumbnail";


            thumbnail.href =
                `/video.html?v=${encodeURIComponent(
                    video.id
                )}`;


            thumbnail.target =
                "_blank";


            thumbnail.rel =
                "noopener noreferrer";



            if (
                video.thumbnail
            ) {

                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    video.thumbnail;


                image.alt =
                    video.title;


                image.loading =
                    "lazy";


                thumbnail.appendChild(
                    image
                );

            } else {

                thumbnail.innerHTML = `

                    <span class="admin-video-thumbnail-placeholder">

                        <i
                            class="fa-solid fa-video"
                            aria-hidden="true">
                        </i>

                    </span>

                `;

            }



            const content =
                document.createElement(
                    "div"
                );


            content.className =
                "admin-video-content";



            const header =
                document.createElement(
                    "div"
                );


            header.className =
                "admin-video-header";


            const heading =
                document.createElement(
                    "div"
                );


            const category =
                document.createElement(
                    "span"
                );


            category.className =
                "admin-video-category";


            category.textContent =
                video.category;



            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                video.title;


            heading.append(
                category,
                title
            );


            header.appendChild(
                heading
            );



            /* =================================================
               VIDEO STATISTICS
               ================================================= */

            const stats =
                document.createElement(
                    "div"
                );


            stats.className =
                "admin-video-stats";


            stats.append(
                createMetric(
                    "fa-regular fa-eye",
                    video.views,
                    video.views === 1
                        ? "view"
                        : "views"
                ),

                createMetric(
                    "fa-regular fa-thumbs-up",
                    video.likes,
                    video.likes === 1
                        ? "like"
                        : "likes"
                ),

                createMetric(
                    "fa-regular fa-comments",
                    video.comments,
                    video.comments === 1
                        ? "comment"
                        : "comments"
                )
            );



            /* =================================================
               FOOTER
               ================================================= */

            const footer =
                document.createElement(
                    "div"
                );


            footer.className =
                "admin-video-footer";


            const videoId =
                document.createElement(
                    "span"
                );


            videoId.className =
                "admin-video-id";


            videoId.textContent =
                `ID: ${video.id}`;



            const openVideo =
                document.createElement(
                    "a"
                );


            openVideo.className =
                "admin-video-open";


            openVideo.href =
                `/video.html?v=${encodeURIComponent(
                    video.id
                )}`;


            openVideo.target =
                "_blank";


            openVideo.rel =
                "noopener noreferrer";


            openVideo.innerHTML = `

                View video

                <i
                    class="fa-solid fa-arrow-up-right-from-square"
                    aria-hidden="true">
                </i>

            `;


            footer.append(
                videoId,
                openVideo
            );


            content.append(
                header,
                stats,
                footer
            );


            article.append(
                thumbnail,
                content
            );


            return article;

        }



        /* =====================================================
           CREATE METRIC
           ===================================================== */

        function createMetric(
            icon,
            value,
            label
        ) {

            const metric =
                document.createElement(
                    "div"
                );


            metric.className =
                "admin-video-metric";


            metric.innerHTML = `

                <i
                    class="${icon}"
                    aria-hidden="true">
                </i>

                <div>

                    <strong>
                        ${formatNumber(
                value
            )}
                    </strong>

                    <span>
                        ${label}
                    </span>

                </div>

            `;


            return metric;

        }



        /* =====================================================
           LOADING
           ===================================================== */

        function setLoadingState() {

            videosList.innerHTML = `

                <div class="admin-video-loading">

                    <span
                        class="admin-loading-spinner">
                    </span>

                    <p>
                        Loading video statistics...
                    </p>

                </div>

            `;

        }



        function finishRefreshButton() {

            refreshButton.disabled =
                false;


            refreshButton.innerHTML = `

                <i
                    class="fa-solid fa-rotate"
                    aria-hidden="true">
                </i>

                Refresh

            `;

        }



        /* =====================================================
           EVENTS
           ===================================================== */

        videoSearch.addEventListener(
            "input",
            renderVideos
        );


        videoSort.addEventListener(
            "change",
            renderVideos
        );


        refreshButton.addEventListener(
            "click",
            loadVideoAnalytics
        );



        /* =====================================================
           INITIALISE
           ===================================================== */

        const hasAdminAccess =
            await verifyAdminAccess();


        if (
            !hasAdminAccess
        ) {

            return;

        }


        await loadVideoAnalytics();


    }
);