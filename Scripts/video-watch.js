document.addEventListener(
    "DOMContentLoaded",
    () => {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const videoId =
            params.get(
                "v"
            );


        const videoData =
            window.islamicQalamVideos
                ?.find(
                    item =>
                        item.id === videoId
                );

        const relatedVideosContainer =
            document.getElementById(
                "relatedVideos"
            );


        const relatedVideos =
            window.islamicQalamVideos
                .filter(
                    item =>
                        item.id !== videoData.id
                )
                .slice(
                    0,
                    12
                );


        relatedVideos.forEach(
            relatedVideo => {

                const link =
                    document.createElement(
                        "a"
                    );


                link.className =
                    "related-video-card";


                link.href =
                    `video.html?v=${encodeURIComponent(
                        relatedVideo.id
                    )}`;


                link.innerHTML = `

                <div class="related-video-thumbnail">

                    <img
                        class="related-video-image"
                        src="${relatedVideo.thumbnail}"
                        alt=""
                        loading="lazy"
                    >


                    <video
                        class="related-video-preview"
                        muted
                        playsinline
                        preload="none"
                        data-src="${relatedVideo.video}"
                    ></video>


                    <span class="related-video-play">

                        <i
                            class="fa-solid fa-play"
                            aria-hidden="true"
                        ></i>

                    </span>


                    <div class="related-preview-progress">

                        <span></span>

                    </div>

                </div>


                <div class="related-video-info">

                    <h3>
                        ${relatedVideo.title}
                    </h3>

                    <span>
                        ${relatedVideo.category}
                    </span>

                </div>

            `;


                relatedVideosContainer
                    .appendChild(
                        link
                    );

                initialiseRelatedPreview(
                    link
                );

            }
        );


        if (
            !videoData
        ) {

            window.location.href =
                "videos.html";

            return;

        }

        function initialiseRelatedPreview(
            card
        ) {

            const preview =
                card.querySelector(
                    ".related-video-preview"
                );


            const image =
                card.querySelector(
                    ".related-video-image"
                );


            const playIcon =
                card.querySelector(
                    ".related-video-play"
                );


            const progress =
                card.querySelector(
                    ".related-preview-progress span"
                );


            let loaded =
                false;


            let progressTimer =
                null;



            async function startPreview() {

                /*
                    Don't run hover previews
                    on touch devices.
                */

                if (
                    window.matchMedia(
                        "(hover: none)"
                    ).matches
                ) {
                    return;
                }


                if (
                    !loaded
                ) {

                    preview.src =
                        preview.dataset.src;


                    preview.load();


                    loaded =
                        true;

                }


                /*
                    Start from beginning.
                */

                try {

                    preview.currentTime =
                        0;

                } catch (
                error
                ) {
                    // Metadata may not
                    // have loaded yet.
                }


                preview.muted =
                    true;


                try {

                    await preview.play();


                    card.classList.add(
                        "related-previewing"
                    );


                    image.classList.add(
                        "hidden"
                    );


                    playIcon.classList.add(
                        "hidden"
                    );

                } catch (
                error
                ) {

                    return;

                }



                /*
                    Maximum preview:
                    first 60 seconds.
                */

                progressTimer =
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
                    progressTimer
                );


                preview.pause();


                try {

                    preview.currentTime =
                        0;

                } catch (
                error
                ) {
                    // Ignore.
                }


                progress.style.width =
                    "0%";


                image.classList.remove(
                    "hidden"
                );


                playIcon.classList.remove(
                    "hidden"
                );


                card.classList.remove(
                    "related-previewing"
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

        /* =====================================
           ELEMENTS
        ===================================== */

        const player =
            document.getElementById(
                "customVideoPlayer"
            );


        const video =
            document.getElementById(
                "mainVideo"
            );


        const largePlayButton =
            document.getElementById(
                "largePlayButton"
            );


        const playPauseButton =
            document.getElementById(
                "playPauseButton"
            );


        const rewindButton =
            document.getElementById(
                "rewindButton"
            );


        const forwardButton =
            document.getElementById(
                "forwardButton"
            );


        const muteButton =
            document.getElementById(
                "muteButton"
            );


        const volumeSlider =
            document.getElementById(
                "volumeSlider"
            );


        const seek =
            document.getElementById(
                "videoSeek"
            );


        const played =
            document.getElementById(
                "videoProgressPlayed"
            );


        const buffered =
            document.getElementById(
                "videoBuffered"
            );


        const currentTimeDisplay =
            document.getElementById(
                "currentTime"
            );


        const durationDisplay =
            document.getElementById(
                "duration"
            );


        const speedButton =
            document.getElementById(
                "speedButton"
            );


        const fullscreenButton =
            document.getElementById(
                "fullscreenButton"
            );


        const watchTitle =
            document.getElementById(
                "watchTitle"
            );


        const watchDescription =
            document.getElementById(
                "watchDescription"
            );


        const watchCategory =
            document.getElementById(
                "watchCategory"
            );



        /* =====================================
           LOAD VIDEO
        ===================================== */

        video.src =
            videoData.video;


        video.poster =
            videoData.thumbnail;


        watchTitle.textContent =
            videoData.title;


        watchDescription.textContent =
            videoData.description;


        watchCategory.textContent =
            videoData.category;


        document.title =
            `${videoData.title} | Islamic Qalam`;



        /* =====================================
           PLAY / PAUSE
        ===================================== */

        function togglePlayback() {

            if (
                video.paused
            ) {

                video.play();

            } else {

                video.pause();

            }

        }



        largePlayButton
            .addEventListener(
                "click",
                togglePlayback
            );


        playPauseButton
            .addEventListener(
                "click",
                togglePlayback
            );


        video.addEventListener(
            "click",
            togglePlayback
        );



        video.addEventListener(
            "play",
            () => {

                player.classList.add(
                    "playing"
                );


                playPauseButton.innerHTML =
                    '<i class="fa-solid fa-pause"></i>';

            }
        );


        video.addEventListener(
            "pause",
            () => {

                player.classList.remove(
                    "playing"
                );


                playPauseButton.innerHTML =
                    '<i class="fa-solid fa-play"></i>';

            }
        );



        /* =====================================
           SKIP
        ===================================== */

        rewindButton.addEventListener(
            "click",
            () => {

                video.currentTime =
                    Math.max(
                        0,
                        video.currentTime - 10
                    );

            }
        );


        forwardButton.addEventListener(
            "click",
            () => {

                video.currentTime =
                    Math.min(
                        video.duration ||
                        Infinity,
                        video.currentTime + 10
                    );

            }
        );



        /* =====================================
           TIME
        ===================================== */

        video.addEventListener(
            "loadedmetadata",
            () => {

                durationDisplay.textContent =
                    formatTime(
                        video.duration
                    );

            }
        );


        video.addEventListener(
            "timeupdate",
            () => {

                if (
                    !video.duration
                ) {
                    return;
                }


                const percentage =
                    (
                        video.currentTime /
                        video.duration
                    ) *
                    100;


                played.style.width =
                    `${percentage}%`;


                seek.value =
                    percentage;


                currentTimeDisplay.textContent =
                    formatTime(
                        video.currentTime
                    );

            }
        );



        seek.addEventListener(
            "input",
            () => {

                if (
                    !video.duration
                ) {
                    return;
                }


                video.currentTime =
                    (
                        Number(
                            seek.value
                        ) /
                        100
                    ) *
                    video.duration;

            }
        );



        /* =====================================
           BUFFERED
        ===================================== */

        video.addEventListener(
            "progress",
            () => {

                if (
                    !video.duration ||
                    !video.buffered.length
                ) {
                    return;
                }


                const end =
                    video.buffered.end(
                        video.buffered.length - 1
                    );


                const percentage =
                    (
                        end /
                        video.duration
                    ) *
                    100;


                buffered.style.width =
                    `${percentage}%`;

            }
        );



        /* =====================================
           VOLUME
        ===================================== */

        volumeSlider.addEventListener(
            "input",
            () => {

                video.volume =
                    Number(
                        volumeSlider.value
                    );


                video.muted =
                    video.volume === 0;


                updateVolumeIcon();

            }
        );


        muteButton.addEventListener(
            "click",
            () => {

                video.muted =
                    !video.muted;


                updateVolumeIcon();

            }
        );



        function updateVolumeIcon() {

            const icon =
                muteButton.querySelector(
                    "i"
                );


            if (
                video.muted ||
                video.volume === 0
            ) {

                icon.className =
                    "fa-solid fa-volume-xmark";

            } else if (
                video.volume <
                0.5
            ) {

                icon.className =
                    "fa-solid fa-volume-low";

            } else {

                icon.className =
                    "fa-solid fa-volume-high";

            }

        }



        /* =====================================
           SPEED
        ===================================== */

        const speeds =
            [
                0.5,
                0.75,
                1,
                1.25,
                1.5,
                2
            ];


        let speedIndex =
            2;


        speedButton.addEventListener(
            "click",
            () => {

                speedIndex =
                    (
                        speedIndex + 1
                    ) %
                    speeds.length;


                video.playbackRate =
                    speeds[
                    speedIndex
                    ];


                speedButton.textContent =
                    `${video.playbackRate}×`;

            }
        );



        /* =====================================
           FULLSCREEN
        ===================================== */

        fullscreenButton
            .addEventListener(
                "click",
                async () => {

                    if (
                        !document.fullscreenElement
                    ) {

                        await player
                            .requestFullscreen();

                    } else {

                        await document
                            .exitFullscreen();

                    }

                }
            );





        /* =====================================
        AUTO-HIDE VIDEO CONTROLS
        ===================================== */

        const customVideoPlayer =
            document.getElementById(
                "customVideoPlayer"
            );


        const videoControls =
            customVideoPlayer.querySelector(
                ".video-controls"
            );


        let controlsHideTimeout =
            null;


        const CONTROLS_HIDE_DELAY =
            2500;



        function showVideoControls() {

            clearTimeout(
                controlsHideTimeout
            );


            customVideoPlayer.classList.remove(
                "controls-hidden"
            );


            if (
                !mainVideo.paused &&
                !mainVideo.ended
            ) {

                controlsHideTimeout =
                    setTimeout(
                        hideVideoControls,
                        CONTROLS_HIDE_DELAY
                    );

            }

        }



        function hideVideoControls() {

            if (
                mainVideo.paused ||
                mainVideo.ended
            ) {
                return;
            }


            customVideoPlayer.classList.add(
                "controls-hidden"
            );

        }



        /* Mouse moves = show controls */

        customVideoPlayer.addEventListener(
            "mousemove",
            showVideoControls
        );


        /* Mouse enters player */

        customVideoPlayer.addEventListener(
            "mouseenter",
            showVideoControls
        );


        /* Start countdown when video plays */

        mainVideo.addEventListener(
            "play",
            showVideoControls
        );


        /* Paused = controls always visible */

        mainVideo.addEventListener(
            "pause",
            () => {

                clearTimeout(
                    controlsHideTimeout
                );


                customVideoPlayer.classList.remove(
                    "controls-hidden"
                );

            }
        );


        /* Video finished = controls visible */

        mainVideo.addEventListener(
            "ended",
            () => {

                clearTimeout(
                    controlsHideTimeout
                );


                customVideoPlayer.classList.remove(
                    "controls-hidden"
                );

            }
        );


        /* Interacting with controls resets timer */

        videoControls.addEventListener(
            "mousemove",
            showVideoControls
        );


        videoControls.addEventListener(
            "click",
            showVideoControls
        );


        const shareButton =
            document.getElementById(
                "shareButton"
            );


        shareButton.addEventListener(
            "click",
            async () => {

                const shareData = {

                    title:
                        videoData.title,

                    text:
                        `Watch ${videoData.title} on Islamic Qalam`,

                    url:
                        window.location.href

                };


                if (
                    navigator.share
                ) {

                    try {

                        await navigator.share(
                            shareData
                        );

                    } catch (
                    error
                    ) {

                        // User cancelled sharing.

                    }

                    return;

                }


                try {

                    await navigator.clipboard
                        .writeText(
                            window.location.href
                        );


                    const text =
                        shareButton.querySelector(
                            "span"
                        );


                    const original =
                        text.textContent;


                    text.textContent =
                        "Copied";


                    setTimeout(
                        () => {

                            text.textContent =
                                original;

                        },
                        1800
                    );

                } catch (
                error
                ) {

                    console.error(
                        "Could not copy video URL.",
                        error
                    );

                }

            }
        );

        /* =====================================
   VIDEO LIKES
===================================== */

        const likeButton =
            document.getElementById(
                "likeButton"
            );


        const videoLikeIcon =
            document.getElementById(
                "videoLikeIcon"
            );


        const videoLikeCountElement =
            document.getElementById(
                "videoLikeCount"
            );


        let videoLikeCurrentUser =
            null;


        let videoLikedByCurrentUser =
            false;


        let videoLikeCount =
            0;


        let videoLikeRequestInProgress =
            false;



        /* =====================================
           LOAD LIKE STATUS
        ===================================== */

        async function loadVideoLikes() {

            /*
             * Get the current logged-in user.
             */

            const {
                data: authData
            } =
                await window
                    .supabaseClient
                    .auth
                    .getUser();


            videoLikeCurrentUser =
                authData?.user ||
                null;



            /*
             * Get total number of likes.
             *
             * head:true means Supabase only
             * returns the count, not every row.
             */

            const {
                count,
                error: countError
            } =
                await window
                    .supabaseClient
                    .from(
                        "video_likes"
                    )
                    .select(
                        "*",
                        {
                            count:
                                "exact",

                            head:
                                true
                        }
                    )
                    .eq(
                        "video_id",
                        videoData.id
                    );


            if (
                countError
            ) {

                console.error(
                    "Video like count error:",
                    countError
                );

                return;

            }


            videoLikeCount =
                count || 0;



            /*
             * If logged in, check whether
             * this particular user liked it.
             */

            if (
                videoLikeCurrentUser
            ) {

                const {
                    data,
                    error
                } =
                    await window
                        .supabaseClient
                        .from(
                            "video_likes"
                        )
                        .select(
                            "user_id"
                        )
                        .eq(
                            "video_id",
                            videoData.id
                        )
                        .eq(
                            "user_id",
                            videoLikeCurrentUser.id
                        )
                        .maybeSingle();


                if (
                    error
                ) {

                    console.error(
                        "Video like status error:",
                        error
                    );

                } else {

                    videoLikedByCurrentUser =
                        Boolean(
                            data
                        );

                }

            } else {

                videoLikedByCurrentUser =
                    false;

            }


            updateVideoLikeUI();

        }



        /* =====================================
           UPDATE LIKE BUTTON
        ===================================== */

        function updateVideoLikeUI() {

            videoLikeCountElement
                .textContent =
                videoLikeCount;

            videoLikeCountElement
                .classList.remove(
                    "loading"
                );


            likeButton.classList.toggle(
                "active",
                videoLikedByCurrentUser
            );


            likeButton.setAttribute(
                "aria-pressed",
                String(
                    videoLikedByCurrentUser
                )
            );


            videoLikeIcon.className =
                videoLikedByCurrentUser
                    ? "fa-solid fa-thumbs-up"
                    : "fa-regular fa-thumbs-up";

        }



        /* =====================================
           TOGGLE LIKE
        ===================================== */

        likeButton.addEventListener(
            "click",
            async () => {

                /*
                 * Don't allow overlapping requests
                 * from very fast repeated clicking.
                 */

                if (
                    videoLikeRequestInProgress
                ) {
                    return;
                }


                /*
                 * Only accounts may like.
                 */

                if (
                    !videoLikeCurrentUser
                ) {

                    const returnPath =
                        `${window.location.pathname}${window.location.search}`;


                    window.location.href =
                        `login.html?redirect=${encodeURIComponent(
                            returnPath
                        )}`;


                    return;

                }


                videoLikeRequestInProgress =
                    true;



                /*
                 * Save previous state in case
                 * Supabase returns an error.
                 */

                const previousLiked =
                    videoLikedByCurrentUser;


                const previousCount =
                    videoLikeCount;



                /*
                 * Update immediately like YouTube.
                 */

                videoLikedByCurrentUser =
                    !previousLiked;


                videoLikeCount =
                    videoLikedByCurrentUser
                        ? previousCount + 1
                        : Math.max(
                            0,
                            previousCount - 1
                        );


                updateVideoLikeUI();



                let error;



                /*
                 * Remove like
                 */

                if (
                    previousLiked
                ) {

                    const result =
                        await window
                            .supabaseClient
                            .from(
                                "video_likes"
                            )
                            .delete()
                            .eq(
                                "video_id",
                                videoData.id
                            )
                            .eq(
                                "user_id",
                                videoLikeCurrentUser.id
                            );


                    error =
                        result.error;

                }


                /*
                 * Add like
                 */

                else {

                    const result =
                        await window
                            .supabaseClient
                            .from(
                                "video_likes"
                            )
                            .insert({

                                user_id:
                                    videoLikeCurrentUser.id,

                                video_id:
                                    videoData.id

                            });


                    error =
                        result.error;

                }



                /*
                 * If the database request failed,
                 * restore the original state.
                 */

                if (
                    error
                ) {

                    console.error(
                        "Video like error:",
                        error
                    );


                    videoLikedByCurrentUser =
                        previousLiked;


                    videoLikeCount =
                        previousCount;


                    updateVideoLikeUI();

                }


                videoLikeRequestInProgress =
                    false;

            }
        );



        /* =====================================
           INITIALISE LIKES
        ===================================== */

        loadVideoLikes();


        /* =====================================
        VIDEO VIEW COUNT
        ===================================== */

        const videoViewCountElement =
            document.getElementById(
                "videoViewCount"
            );


        let currentVideoViewCount =
            0;



        function formatViewCount(
            count
        ) {

            return new Intl.NumberFormat(
                "en-AU"
            ).format(
                count
            );

        }



        function updateViewCountUI() {

            videoViewCountElement
                .textContent =
                `${formatViewCount(
                    currentVideoViewCount
                )} ${currentVideoViewCount === 1
                    ? "view"
                    : "views"
                }`;


            videoViewCountElement
                .classList.remove(
                    "loading"
                );

        }



        async function loadVideoViewCount() {

            const {
                data,
                error
            } =
                await window
                    .supabaseClient
                    .from(
                        "video_stats"
                    )
                    .select(
                        "view_count"
                    )
                    .eq(
                        "video_id",
                        videoData.id
                    )
                    .maybeSingle();


            if (
                error
            ) {

                console.error(
                    "Video view count error:",
                    error
                );

                return;

            }


            currentVideoViewCount =
                data?.view_count || 0;


            updateViewCountUI();

        }

        /* =====================================
   VIEW WATCH-TIME TRACKING
===================================== */

        const VIEW_REQUIRED_MS =
            60 * 1000;


        let watchedTimeMs =
            0;


        let playbackSegmentStartedAt =
            null;


        let videoViewRegistered =
            false;


        let viewTrackingInterval =
            null;



        /* =====================================
           START WATCH SEGMENT
        ===================================== */

        function startWatchSegment() {

            if (
                videoViewRegistered ||
                playbackSegmentStartedAt !== null
            ) {
                return;
            }


            playbackSegmentStartedAt =
                performance.now();

        }



        /* =====================================
           STOP WATCH SEGMENT
        ===================================== */

        function stopWatchSegment() {

            if (
                playbackSegmentStartedAt ===
                null
            ) {
                return;
            }


            watchedTimeMs +=
                performance.now() -
                playbackSegmentStartedAt;


            playbackSegmentStartedAt =
                null;

        }



        /* =====================================
           CURRENT WATCH TIME
        ===================================== */

        function getCurrentWatchTime() {

            let total =
                watchedTimeMs;


            if (
                playbackSegmentStartedAt !==
                null
            ) {

                total +=
                    performance.now() -
                    playbackSegmentStartedAt;

            }


            return total;

        }

        /* =====================================
   PLAYBACK EVENTS
===================================== */


        /*
         * Actual playback has begun.
         */

        mainVideo.addEventListener(
            "playing",
            () => {

                startWatchSegment();

            }
        );


        /*
         * Pausing stops watch time.
         */

        mainVideo.addEventListener(
            "pause",
            () => {

                stopWatchSegment();

            }
        );


        /*
         * Buffering stops watch time.
         */

        mainVideo.addEventListener(
            "waiting",
            () => {

                stopWatchSegment();

            }
        );


        mainVideo.addEventListener(
            "stalled",
            () => {

                stopWatchSegment();

            }
        );


        /*
         * Seeking immediately stops
         * the current playback segment.
         *
         * The skipped distance therefore
         * contributes zero watch time.
         */

        mainVideo.addEventListener(
            "seeking",
            () => {

                stopWatchSegment();

            }
        );


        /*
         * Resume tracking after seeking
         * if playback continues.
         */

        mainVideo.addEventListener(
            "seeked",
            () => {

                if (
                    !mainVideo.paused &&
                    !mainVideo.ended
                ) {

                    startWatchSegment();

                }

            }
        );


        /*
         * Video finished.
         */

        mainVideo.addEventListener(
            "ended",
            () => {

                stopWatchSegment();

            }
        );

        /* =====================================
        CHECK VIEW THRESHOLD
        ===================================== */

        viewTrackingInterval =
            window.setInterval(
                async () => {

                    if (
                        videoViewRegistered
                    ) {

                        clearInterval(
                            viewTrackingInterval
                        );

                        return;

                    }


                    const totalWatched =
                        getCurrentWatchTime();


                    if (
                        totalWatched <
                        VIEW_REQUIRED_MS
                    ) {
                        return;
                    }


                    /*
                     * Mark it immediately so multiple
                     * requests cannot be triggered.
                     */

                    videoViewRegistered =
                        true;


                    stopWatchSegment();


                    clearInterval(
                        viewTrackingInterval
                    );


                    await registerVideoView();

                },
                500
            );


        /* =====================================
   REGISTER VIEW
===================================== */

        async function registerVideoView() {

            const {
                data,
                error
            } =
                await window
                    .supabaseClient
                    .rpc(
                        "register_video_view",
                        {
                            p_video_id:
                                videoData.id
                        }
                    );


            if (
                error
            ) {

                console.error(
                    "Register video view error:",
                    error
                );


                /*
                 * Allow another attempt if
                 * the network request failed.
                 */

                videoViewRegistered =
                    false;


                startViewTrackingAgain();


                return;

            }


            /*
             * Function returns the new
             * total count.
             */

            currentVideoViewCount =
                Number(
                    data
                ) || 0;


            updateViewCountUI();

        }

        function startViewTrackingAgain() {

            if (
                viewTrackingInterval
            ) {

                clearInterval(
                    viewTrackingInterval
                );

            }


            viewTrackingInterval =
                window.setInterval(
                    async () => {

                        if (
                            videoViewRegistered
                        ) {

                            clearInterval(
                                viewTrackingInterval
                            );

                            return;

                        }


                        if (
                            getCurrentWatchTime() >=
                            VIEW_REQUIRED_MS
                        ) {

                            videoViewRegistered =
                                true;


                            stopWatchSegment();


                            clearInterval(
                                viewTrackingInterval
                            );


                            await registerVideoView();

                        }

                    },
                    500
                );

        }





        loadVideoViewCount();


        /* =====================================
           KEYBOARD CONTROLS
        ===================================== */

        document.addEventListener(
            "keydown",
            event => {

                const target =
                    event.target;


                if (
                    target.tagName ===
                    "INPUT" ||
                    target.tagName ===
                    "TEXTAREA"
                ) {
                    return;
                }


                switch (
                event.key.toLowerCase()
                ) {

                    case " ":
                    case "k":

                        event.preventDefault();

                        togglePlayback();

                        break;


                    case "arrowleft":

                        video.currentTime =
                            Math.max(
                                0,
                                video.currentTime -
                                5
                            );

                        break;


                    case "arrowright":

                        video.currentTime =
                            Math.min(
                                video.duration ||
                                Infinity,
                                video.currentTime +
                                5
                            );

                        break;


                    case "m":

                        video.muted =
                            !video.muted;

                        updateVolumeIcon();

                        break;


                    case "f":

                        fullscreenButton
                            .click();

                        break;

                }

            }
        );


        /* =====================================
           FORMAT TIME
        ===================================== */

        function formatTime(
            value
        ) {

            if (
                !Number.isFinite(
                    value
                )
            ) {

                return "0:00";

            }


            const hours =
                Math.floor(
                    value /
                    3600
                );


            const minutes =
                Math.floor(
                    (
                        value %
                        3600
                    ) /
                    60
                );


            const seconds =
                Math.floor(
                    value %
                    60
                );


            if (
                hours > 0
            ) {

                return (
                    `${hours}:` +
                    `${String(
                        minutes
                    ).padStart(
                        2,
                        "0"
                    )}:` +
                    `${String(
                        seconds
                    ).padStart(
                        2,
                        "0"
                    )}`
                );

            }


            return (
                `${minutes}:` +
                `${String(
                    seconds
                ).padStart(
                    2,
                    "0"
                )}`
            );

        }

    }
);