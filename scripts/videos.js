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


                    card.className =
                        "video-card";


                    card.href =
                        `video.html?v=${encodeURIComponent(
                            video.id
                        )}`;


                    card.setAttribute(
                        "aria-label",
                        `Watch ${video.title}`
                    );



                    card.innerHTML = `

                        <div class="video-thumbnail">

                            <img
                                src="${video.thumbnail}"
                                alt=""
                                loading="lazy"
                                class="video-thumbnail-image"
                            >


                            <video
                                class="video-preview"
                                muted
                                playsinline
                                preload="none"
                                data-src="${video.video}"
                            ></video>


                            <span class="video-category">
                                ${video.category}
                            </span>


                            <span class="video-play-overlay">

                                <span class="video-play-circle">

                                    <i
                                        class="fa-solid fa-play"
                                        aria-hidden="true"
                                    ></i>

                                </span>

                            </span>


                            <div class="video-preview-progress">

                                <span></span>

                            </div>

                        </div>


                        <div class="video-info">

                            <h3>
                                ${video.title}
                            </h3>


                            <p>
                                ${video.description}
                            </p>


                            <span class="video-watch-link">

                                Watch video

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


                    initialisePreview(
                        card
                    );

                }
            );



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