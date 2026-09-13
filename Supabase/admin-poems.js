document.addEventListener(
    "DOMContentLoaded",
    async () => {


        /* =====================================================
           ELEMENTS
           ===================================================== */

        const poemsPanel =
            document.getElementById(
                "poemsPanel"
            );


        if (!poemsPanel) {
            return;
        }


        const poemsList =
            document.getElementById(
                "adminPoemsList"
            );


        const poemSearch =
            document.getElementById(
                "poemSearch"
            );


        const poemSort =
            document.getElementById(
                "poemSort"
            );


        const refreshButton =
            document.getElementById(
                "refreshPoemStats"
            );


        const totalPoemsElement =
            document.getElementById(
                "poemTotalCount"
            );


        const totalViewsElement =
            document.getElementById(
                "poemTotalViews"
            );


        const totalLikesElement =
            document.getElementById(
                "poemTotalLikes"
            );


        const totalCommentsElement =
            document.getElementById(
                "poemTotalComments"
            );



        let adminPoems =
            [];



        /* =====================================================
           NUMBER FORMAT
           ===================================================== */

        const formatter =
            new Intl.NumberFormat(
                "en-AU"
            );


        function formatNumber(
            value
        ) {

            return formatter.format(
                Number(value) || 0
            );

        }



        /* =====================================================
           ADMIN CHECK
           ===================================================== */

        async function verifyAdminAccess() {

            const {
                data: {
                    user
                }
            } =
                await window
                    .supabaseClient
                    .auth
                    .getUser();


            if (!user) {
                return false;
            }


            const {
                data,
                error
            } =
                await window
                    .supabaseClient
                    .rpc(
                        "admin_check_access"
                    );


            if (
                error ||
                data !== true
            ) {

                if (error) {

                    console.error(
                        "Poem analytics admin check:",
                        error
                    );

                }


                return false;

            }


            return true;

        }



        /* =====================================================
           LOAD
           ===================================================== */

        async function loadPoemAnalytics() {


            const poemDefinitions =
                Array.isArray(
                    window.islamicQalamPoems
                )
                    ? window.islamicQalamPoems
                    : [];


            if (
                poemDefinitions.length ===
                0
            ) {

                poemsList.innerHTML = `

                    <p class="admin-empty-state">

                        No poems were found in
                        Scripts/Data/poems.js.

                    </p>

                `;

                return;

            }



            setLoading();


            refreshButton.disabled =
                true;



            const poemIds =
                poemDefinitions.map(
                    poem =>
                        poem.id
                );



            const {
                data,
                error
            } =
                await window
                    .supabaseClient
                    .rpc(
                        "admin_get_poem_analytics",
                        {
                            p_poem_ids:
                                poemIds
                        }
                    );


            if (
                error
            ) {

                console.error(
                    "Unable to load poem analytics:",
                    error
                );


                poemsList.innerHTML = `

                    <p class="admin-empty-state">

                        Unable to load poem statistics.

                    </p>

                `;


                finishRefresh();

                return;

            }



            const statsMap =
                new Map(
                    (
                        data ||
                        []
                    ).map(
                        row => [

                            row.poem_id,

                            row

                        ]
                    )
                );



            adminPoems =
                poemDefinitions.map(
                    poem => {


                        const stats =
                            statsMap.get(
                                poem.id
                            ) || {};


                        return {

                            id:
                                poem.id,

                            title:
                                poem.title ||
                                poem.id,

                            url:
                                poem.url ||
                                `/poems/${poem.id}.html`,

                            views:
                                Number(
                                    stats.view_count
                                ) || 0,

                            likes:
                                Number(
                                    stats.like_count
                                ) || 0,

                            comments:
                                Number(
                                    stats.comment_count
                                ) || 0

                        };

                    }
                );


            updateTotals();

            renderPoems();

            finishRefresh();

        }



        /* =====================================================
           TOTALS
           ===================================================== */

        function updateTotals() {

            totalPoemsElement.textContent =
                formatNumber(
                    adminPoems.length
                );


            totalViewsElement.textContent =
                formatNumber(
                    adminPoems.reduce(
                        (
                            total,
                            poem
                        ) =>
                            total +
                            poem.views,
                        0
                    )
                );


            totalLikesElement.textContent =
                formatNumber(
                    adminPoems.reduce(
                        (
                            total,
                            poem
                        ) =>
                            total +
                            poem.likes,
                        0
                    )
                );


            totalCommentsElement.textContent =
                formatNumber(
                    adminPoems.reduce(
                        (
                            total,
                            poem
                        ) =>
                            total +
                            poem.comments,
                        0
                    )
                );

        }



        /* =====================================================
           RENDER
           ===================================================== */

        function renderPoems() {


            poemsList.innerHTML =
                "";


            const query =
                poemSearch.value
                    .trim()
                    .toLowerCase();


            let poems =
                adminPoems.filter(
                    poem =>

                        !query ||

                        poem.title
                            .toLowerCase()
                            .includes(
                                query
                            ) ||

                        poem.id
                            .toLowerCase()
                            .includes(
                                query
                            )

                );


            poems =
                sortPoems(
                    poems
                );


            if (
                poems.length ===
                0
            ) {

                poemsList.innerHTML = `

                    <p class="admin-empty-state">

                        No poems found.

                    </p>

                `;

                return;

            }


            poems.forEach(
                poem => {

                    poemsList.appendChild(
                        createPoemCard(
                            poem
                        )
                    );

                }
            );
            
            window.renderCustomIcons
                ?.(
                    poemsList
                );

        }



        /* =====================================================
           SORT
           ===================================================== */

        function sortPoems(
            poems
        ) {

            const sorted =
                [...poems];


            switch (
            poemSort.value
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

            }


            return sorted;

        }



        /* =====================================================
           CARD
           ===================================================== */

        function createPoemCard(
            poem
        ) {

            const article =
                document.createElement(
                    "article"
                );


            /*
             * Reuse your video card styling.
             */

            article.className =
                "admin-video-card admin-poem-card";



            const symbol =
                document.createElement(
                    "a"
                );


            symbol.className =
                "admin-video-thumbnail admin-poem-symbol";


            symbol.href =
                poem.url;


            symbol.target =
                "_blank";


            symbol.rel =
                "noopener noreferrer";


            symbol.innerHTML = `

                <icon class="poem-title">
                    ${poem.id}
                </icon>

            `;



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


            const category =
                document.createElement(
                    "span"
                );


            category.className =
                "admin-video-category";


            category.textContent =
                "Islamic Poetry";



            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                poem.title;


            header.append(
                category,
                title
            );



            const stats =
                document.createElement(
                    "div"
                );


            stats.className =
                "admin-video-stats";


            stats.append(

                createMetric(
                    "fa-regular fa-eye",
                    poem.views,
                    poem.views === 1
                        ? "view"
                        : "views"
                ),

                createMetric(
                    "fa-regular fa-thumbs-up",
                    poem.likes,
                    poem.likes === 1
                        ? "like"
                        : "likes"
                ),

                createMetric(
                    "fa-regular fa-comments",
                    poem.comments,
                    poem.comments === 1
                        ? "comment"
                        : "comments"
                )

            );



            const footer =
                document.createElement(
                    "div"
                );


            footer.className =
                "admin-video-footer";



            const id =
                document.createElement(
                    "span"
                );


            id.className =
                "admin-video-id";


            id.textContent =
                `ID: ${poem.id}`;



            const open =
                document.createElement(
                    "a"
                );


            open.className =
                "admin-video-open";


            open.href =
                poem.url;


            open.target =
                "_blank";


            open.rel =
                "noopener noreferrer";


            open.innerHTML = `

                View poem

                <i
                    class="fa-solid fa-arrow-up-right-from-square"
                    aria-hidden="true">
                </i>

            `;



            footer.append(
                id,
                open
            );


            content.append(
                header,
                stats,
                footer
            );


            article.append(
                symbol,
                content
            );


            return article;

        }



        /* =====================================================
           METRIC
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

        function setLoading() {

            poemsList.innerHTML = `

                <div class="admin-video-loading">

                    <span
                        class="admin-loading-spinner">
                    </span>

                    <p>
                        Loading poem statistics...
                    </p>

                </div>

            `;

        }



        function finishRefresh() {

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

        poemSearch.addEventListener(
            "input",
            renderPoems
        );


        poemSort.addEventListener(
            "change",
            renderPoems
        );


        refreshButton.addEventListener(
            "click",
            loadPoemAnalytics
        );



        /* =====================================================
           START
           ===================================================== */

        const hasAccess =
            await verifyAdminAccess();


        if (!hasAccess) {
            return;
        }


        await loadPoemAnalytics();


    }
);