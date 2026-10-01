
/* ================= E-BOOK PREVIEW GALLERY ================= */

(() => {
    const page = document.querySelector(".product-page");
    if (!page) return;

    const mainImage = page.querySelector(".product-image");

    const formatButtons = [
        ...page.querySelectorAll(".ebook-format-button")
    ];

    const groups = [
        ...page.querySelectorAll(".ebook-preview-group")
    ];

    const lightbox = document.querySelector(".lightbox");
    const expandedImage =
        lightbox?.querySelector(".expanded-image");

    const closeButton =
        lightbox?.querySelector(".lightbox-close");

    const previousButton =
        lightbox?.querySelector(".arrow-left");

    const nextButton =
        lightbox?.querySelector(".arrow-right");

    let currentImages = [];
    let currentIndex = 0;

    function activeGroup() {
        return page.querySelector(
            ".ebook-preview-group.active"
        );
    }

    function activeImages() {
        return [
            ...(activeGroup()?.querySelectorAll(".thumb") || [])
        ];
    }

    function showImage(image) {
        if (!mainImage || !image) return;

        mainImage.src = image.src;
        mainImage.alt = image.alt;

        activeImages().forEach(thumbnail => {
            thumbnail.classList.toggle(
                "active",
                thumbnail === image
            );
        });
    }

    groups.forEach(group => {
        group.querySelectorAll(".thumb")
            .forEach(thumbnail => {
                thumbnail.addEventListener(
                    "click",
                    () => showImage(thumbnail)
                );
            });
    });

    formatButtons.forEach(button => {
        button.addEventListener("click", () => {
            const format = button.dataset.format;

            formatButtons.forEach(item => {
                const selected = item === button;

                item.classList.toggle(
                    "active",
                    selected
                );

                item.setAttribute(
                    "aria-selected",
                    String(selected)
                );
            });

            groups.forEach(group => {
                const selected =
                    group.dataset.previewFormat === format;

                group.classList.toggle(
                    "active",
                    selected
                );

                group.hidden = !selected;
            });

            const first = activeImages()[0];

            if (first) {
                showImage(first);
            }
        });
    });

    function showExpandedImage() {
        const selected = currentImages[currentIndex];

        if (!selected || !expandedImage) return;

        expandedImage.src = selected.src;
        expandedImage.alt = selected.alt;
    }

    function openLightbox() {
        if (!lightbox || !expandedImage) return;

        currentImages = activeImages();

        if (!currentImages.length) return;

        currentIndex = Math.max(
            0,
            currentImages.findIndex(
                image => image.src === mainImage?.src
            )
        );

        showExpandedImage();

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
        closeButton?.focus();
    }

    function closeLightbox() {
        if (!lightbox) return;

        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";
        mainImage?.focus();
    }

    function move(direction) {
        if (!currentImages.length) return;

        currentIndex = (
            currentIndex +
            direction +
            currentImages.length
        ) % currentImages.length;

        showExpandedImage();
    }

    mainImage?.addEventListener(
        "click",
        openLightbox
    );

    closeButton?.addEventListener(
        "click",
        closeLightbox
    );

    previousButton?.addEventListener(
        "click",
        () => move(-1)
    );

    nextButton?.addEventListener(
        "click",
        () => move(1)
    );

    lightbox?.addEventListener(
        "click",
        event => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {
            if (!lightbox?.classList.contains("active")) {
                return;
            }

            if (event.key === "Escape") {
                closeLightbox();
            }

            if (event.key === "ArrowLeft") {
                move(-1);
            }

            if (event.key === "ArrowRight") {
                move(1);
            }
        }
    );
})();
