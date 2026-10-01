document.addEventListener(
    "DOMContentLoaded",
    () => {

        const videoGrid =
            document.getElementById(
                "videoGrid"
            );


        if (
            !videoGrid ||
            !window.islamicQalamVideos
        ) {
            return;
        }



        window.islamicQalamVideos
            .forEach(
                video => {

                    const card =
                        document.createElement(
                            "a"
                        );


                    const managedAccess =
                        video.earlyAccess === true;


                    const releaseTime =
                        managedAccess
                            ? new Date(
                                video.releaseAt
                            ).getTime()
                            : 0;


                    const isEarlyAccess =
                        managedAccess &&
                        Number.isFinite(
                            releaseTime
                        ) &&
                        Date.now() <
                        releaseTime;


                    card.className =
                        "video-card";


                    if (managedAccess) {
                        card.classList.add(
                            "managed-access-video"
                        );
                    }


                    if (isEarlyAccess) {
                        card.classList.add(
                            "early-access-video"
                        );
                    }


                    card.href =
                        `video.html?v=${encodeURIComponent(
                            video.id
                        )}`;


                    card.setAttribute(
                        "aria-label",
                        isEarlyAccess
                            ? `Premium Early Access: ${video.title}`
                            : `Watch ${video.title}`
                    );



                    const previewMarkup =
                        video.video
                            ? `
                                <video
                                    class="video-preview"
                                    muted
                                    playsinline
                                    preload="none"
                                    data-src="${video.video}"
                                ></video>
                            `
                            : "";


                    const progressMarkup =
                        video.video
                            ? `
                                <div class="video-preview-progress">
                                    <span></span>
                                </div>
                            `
                            : "";


                    const earlyAccessMarkup =
                        isEarlyAccess
                            ? `
                                <span class="video-early-access-badge">
                                    <i
                                        class="fa-solid fa-crown"
                                        aria-hidden="true"
                                    ></i>

                                    Premium Early Access
                                </span>
                            `
                            : "";


                    const releaseMarkup =
                        isEarlyAccess
                            ? `
                                <div class="video-release-info">

                                    <i
                                        class="fa-regular fa-calendar"
                                        aria-hidden="true"
                                    ></i>

                                    <span>
                                        Public ${formatReleaseDate(
                                video.releaseAt
                            )}
                                    </span>

                                </div>
                            `
                            : "";


                    card.innerHTML = `

                        <div class="video-thumbnail">

                            <img
                                src="${video.thumbnail}"
                                alt=""
                                loading="lazy"
                                class="video-thumbnail-image"
                            >


                            ${previewMarkup}


                            <span class="video-category">
                                ${video.category}
                            </span>


                            ${earlyAccessMarkup}


                            <span class="video-play-overlay">

                                <span class="video-play-circle">

                                    <i
                                        class="fa-solid ${isEarlyAccess
                            ? "fa-crown"
                            : "fa-play"
                        }"
                                        aria-hidden="true"
                                    ></i>

                                </span>

                            </span>


                            ${progressMarkup}

                        </div>


                        <div class="video-info">

                            <h3>
                                ${video.title}
                            </h3>


                            ${releaseMarkup}


                            <p>
                                ${video.description}
                            </p>


                            <span class="video-watch-link">

                                ${isEarlyAccess
                            ? "Watch with Premium"
                            : "Watch video"
                        }

                                <i
                                    class="fa-solid fa-arrow-right"
                                    aria-hidden="true"
                                ></i>

                            </span>

                        </div>

                    `;


                    videoGrid.appendChild(
                        card
                    );


                    /*
                     * Only ordinary public videos that
                     * actually contain a public video URL
                     * receive hover previews.
                     *
                     * Private Early Access files never
                     * enter this code path.
                     */

                    if (video.video) {

                        initialisePreview(
                            card
                        );

                    }

                }
            );



        /* =====================================
           RELEASE DATE
        ===================================== */

        function formatReleaseDate(
            value
        ) {

            const date =
                new Date(
                    value
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return "";
            }


            return new Intl.DateTimeFormat(
                "en-AU",
                {
                    day:
                        "numeric",

                    month:
                        "long",

                    year:
                        "numeric"
                }
            ).format(
                date
            );

        }



        /* =====================================
           VIDEO PREVIEW
        ===================================== */

        function initialisePreview(
            card
        ) {

            const preview =
                card.querySelector(
                    ".video-preview"
                );


            const image =
                card.querySelector(
                    ".video-thumbnail-image"
                );


            const progress =
                card.querySelector(
                    ".video-preview-progress span"
                );


            if (
                !preview ||
                !image ||
                !progress
            ) {
                return;
            }


            let previewLoaded =
                false;


            let previewTimer =
                null;



            async function startPreview() {

                if (
                    window.matchMedia(
                        "(hover: none)"
                    ).matches
                ) {
                    return;
                }


                if (
                    !previewLoaded
                ) {

                    preview.src =
                        preview.dataset.src;


                    preview.load();


                    previewLoaded =
                        true;

                }


                preview.currentTime =
                    0;


                preview.muted =
                    true;


                try {

                    await preview.play();


                    card.classList.add(
                        "previewing"
                    );


                    image.classList.add(
                        "hidden"
                    );

                } catch (
                error
                ) {

                    return;

                }


                previewTimer =
                    window.setInterval(
                        () => {

                            const maximumPreview =
                                Math.min(
                                    60,
                                    preview.duration ||
                                    60
                                );


                            const percentage =
                                Math.min(
                                    (
                                        preview.currentTime /
                                        maximumPreview
                                    ) *
                                    100,
                                    100
                                );


                            progress.style.width =
                                `${percentage}%`;


                            if (
                                preview.currentTime >=
                                maximumPreview
                            ) {

                                stopPreview();

                            }

                        },
                        200
                    );

            }



            function stopPreview() {

                window.clearInterval(
                    previewTimer
                );


                preview.pause();


                try {

                    preview.currentTime =
                        0;

                } catch (
                error
                ) {
                    // Video metadata may not
                    // have loaded yet.
                }


                progress.style.width =
                    "0%";


                image.classList.remove(
                    "hidden"
                );


                card.classList.remove(
                    "previewing"
                );

            }



            card.addEventListener(
                "mouseenter",
                startPreview
            );


            card.addEventListener(
                "mouseleave",
                stopPreview
            );

        }

    }
);