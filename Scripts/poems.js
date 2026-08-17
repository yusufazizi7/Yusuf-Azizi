document.addEventListener(
    "DOMContentLoaded",
    () => {

        const poemContainer =
            document.querySelector(
                ".poem-container"
            );

        if (!poemContainer) {
            return;
        }


        const verses =
            document.querySelectorAll(
                ".poem-verse"
            );


        const arabicTexts =
            document.querySelectorAll(
                ".arabic-text"
            );


        const translations =
            document.querySelectorAll(
                ".eng-translation"
            );


        const fontRadios =
            document.querySelectorAll(
                "input[name='font']"
            );


        const verseToggle =
            document.getElementById(
                "LineNumbers"
            );


        const translationToggle =
            document.getElementById(
                "engTranslationToggle"
            );


        const verseDropdown =
            document.getElementById(
                "verseDropdown"
            );


        const increaseFontButton =
            document.getElementById(
                "increaseFont"
            );


        const decreaseFontButton =
            document.getElementById(
                "decreaseFont"
            );


        const resetFontButton =
            document.getElementById(
                "resetFont"
            );


        const fontSizeDisplay =
            document.getElementById(
                "fontSizeDisplay"
            );


        const poemVerseCount =
            document.getElementById(
                "poemVerseCount"
            );




        const copyToast =
            document.getElementById(
                "copyToast"
            );



        /* =====================================
           VERSE COUNT
        ===================================== */

        if (poemVerseCount) {

            poemVerseCount.textContent =
                `${verses.length} ${
                    verses.length === 1
                        ? "verse"
                        : "verses"
                }`;

        }



        /* =====================================
           FONT SIZE
        ===================================== */

        const defaultFontSize =
            27;


        let fontSize =
            Number.parseInt(
                localStorage.getItem(
                    "fontSize"
                ),
                10
            );


        if (
            Number.isNaN(
                fontSize
            )
        ) {

            fontSize =
                defaultFontSize;

        }


        fontSize =
            Math.min(
                40,
                Math.max(
                    12,
                    fontSize
                )
            );


        function applyFontSize() {

            arabicTexts.forEach(
                text => {

                    text.style.fontSize =
                        `${fontSize}px`;

                }
            );


            if (
                fontSizeDisplay
            ) {

                fontSizeDisplay.textContent =
                    `${fontSize}px`;

            }

        }


        applyFontSize();



        increaseFontButton
            ?.addEventListener(
                "click",
                () => {

                    if (
                        fontSize >= 40
                    ) {
                        return;
                    }


                    fontSize += 1;


                    localStorage.setItem(
                        "fontSize",
                        fontSize
                    );


                    applyFontSize();

                }
            );


        decreaseFontButton
            ?.addEventListener(
                "click",
                () => {

                    if (
                        fontSize <= 12
                    ) {
                        return;
                    }


                    fontSize -= 1;


                    localStorage.setItem(
                        "fontSize",
                        fontSize
                    );


                    applyFontSize();

                }
            );


        resetFontButton
            ?.addEventListener(
                "click",
                () => {

                    fontSize =
                        defaultFontSize;


                    localStorage.setItem(
                        "fontSize",
                        fontSize
                    );


                    applyFontSize();

                }
            );



        /* =====================================
           FONT FAMILY
        ===================================== */

        const fontFamilies = {

            default:
                "",

            amiri:
                "Amiri",

            Neiziri:
                "Neiziri",

            Uthman:
                "Uthman",

            Thuluth:
                "Thuluth"

        };


        let savedFont =
            localStorage.getItem(
                "selectedFont"
            ) ||
            "default";


        /*
         * Compatibility with the old script.
         */

        if (
            savedFont ===
            "inherit"
        ) {

            savedFont =
                "default";

        }


        function applyFont(
            fontKey
        ) {

            const family =
                fontFamilies[
                    fontKey
                ] ?? "";


            arabicTexts.forEach(
                text => {

                    text.style.fontFamily =
                        family;

                }
            );

        }


        applyFont(
            savedFont
        );


        const savedRadio =
            document.querySelector(
                `input[name="font"][value="${savedFont}"]`
            );


        if (
            savedRadio
        ) {

            savedRadio.checked =
                true;

        }


        fontRadios.forEach(
            radio => {

                radio.addEventListener(
                    "change",
                    () => {

                        const fontKey =
                            radio.value;


                        applyFont(
                            fontKey
                        );


                        localStorage.setItem(
                            "selectedFont",
                            fontKey
                        );

                    }
                );

            }
        );



        /* =====================================
           VERSE NUMBERS
        ===================================== */

        const savedVerseNumbers =
            localStorage.getItem(
                "showVerseNumbers"
            );


        const showVerseNumbers =
            savedVerseNumbers ===
            null
                ? true
                : savedVerseNumbers ===
                    "true";


        poemContainer.classList.toggle(
            "show-verse-numbers",
            showVerseNumbers
        );


        if (
            verseToggle
        ) {

            verseToggle.checked =
                showVerseNumbers;


            verseToggle.addEventListener(
                "change",
                () => {

                    poemContainer
                        .classList
                        .toggle(
                            "show-verse-numbers",
                            verseToggle.checked
                        );


                    localStorage.setItem(
                        "showVerseNumbers",
                        verseToggle.checked
                            ? "true"
                            : "false"
                    );

                }
            );

        }



        /* =====================================
           TRANSLATION
        ===================================== */

        if (
            translations.length
        ) {

            const savedTranslation =
                localStorage.getItem(
                    "showTranslation"
                );


            /*
             * First-time visitors see
             * the translation.
             */

            const showTranslation =
                savedTranslation ===
                null
                    ? true
                    : savedTranslation ===
                        "true";


            translations.forEach(
                translation => {

                    translation.hidden =
                        !showTranslation;

                }
            );


            if (
                translationToggle
            ) {

                translationToggle.checked =
                    showTranslation;


                translationToggle
                    .addEventListener(
                        "change",
                        () => {

                            translations
                                .forEach(
                                    translation => {

                                        translation.hidden =
                                            !translationToggle
                                                .checked;

                                    }
                                );


                            localStorage.setItem(
                                "showTranslation",
                                translationToggle
                                    .checked
                                    ? "true"
                                    : "false"
                            );

                        }
                    );

            }

        } else if (
            translationToggle
        ) {

            translationToggle
                .closest("label")
                ?.setAttribute(
                    "hidden",
                    ""
                );

        }



        /* =====================================
           BUILD VERSE CONTROLS
        ===================================== */

        verses.forEach(
            (
                verse,
                index
            ) => {

                const verseNumber =
                    index + 1;


                verse.id =
                    `verse-${verseNumber}`;



                /* JUMP DROPDOWN */

                if (
                    verseDropdown
                ) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        verse.id;


                    option.textContent =
                        `Verse ${verseNumber}`;


                    verseDropdown
                        .appendChild(
                            option
                        );

                }



                /* COPY WRAPPER */

                const copyWrapper =
                    document.createElement(
                        "div"
                    );


                copyWrapper.className =
                    "copy-wrapper";



                const copyButton =
                    document.createElement(
                        "button"
                    );


                copyButton.type =
                    "button";


                copyButton.className =
                    "copy-btn";


                copyButton.setAttribute(
                    "aria-label",
                    `Copy verse ${verseNumber}`
                );


                copyButton.setAttribute(
                    "aria-expanded",
                    "false"
                );


                copyButton.innerHTML =
                    `
                        <i
                            class="fa-regular fa-copy"
                            aria-hidden="true"
                        ></i>
                    `;



                const dropdown =
                    document.createElement(
                        "div"
                    );


                dropdown.className =
                    "copy-dropdown";



                const arabicOption =
                    document.createElement(
                        "button"
                    );


                arabicOption.type =
                    "button";


                arabicOption.className =
                    "copy-option";


                arabicOption.dataset.type =
                    "arabic";


                arabicOption.textContent =
                    "Copy Arabic";


                dropdown.appendChild(
                    arabicOption
                );



                if (
                    verse.querySelector(
                        ".eng-translation"
                    )
                ) {

                    const englishOption =
                        document.createElement(
                            "button"
                        );


                    englishOption.type =
                        "button";


                    englishOption.className =
                        "copy-option";


                    englishOption.dataset.type =
                        "english";


                    englishOption.textContent =
                        "Copy English";


                    dropdown.appendChild(
                        englishOption
                    );

                }



                copyWrapper.append(
                    copyButton,
                    dropdown
                );


                verse.appendChild(
                    copyWrapper
                );

            }
        );



        /* =====================================
           JUMP TO VERSE
        ===================================== */

        verseDropdown
            ?.addEventListener(
                "change",
                event => {

                    const verseId =
                        event.target.value;


                    if (
                        !verseId
                    ) {
                        return;
                    }


                    const target =
                        document.getElementById(
                            verseId
                        );


                    if (
                        !target
                    ) {
                        return;
                    }


                    target.scrollIntoView({
                        behavior:
                            "smooth",

                        block:
                            "center"
                    });


                    target.classList.add(
                        "highlight-verse"
                    );


                    window.setTimeout(
                        () => {

                            target.classList.remove(
                                "highlight-verse"
                            );

                        },
                        1800
                    );

                }
            );



        /* =====================================
           COPY MENU
        ===================================== */

        document.addEventListener(
            "click",
            event => {

                const copyButton =
                    event.target.closest(
                        ".copy-btn"
                    );


                if (
                    copyButton
                ) {

                    const wrapper =
                        copyButton.closest(
                            ".copy-wrapper"
                        );


                    const dropdown =
                        wrapper.querySelector(
                            ".copy-dropdown"
                        );


                    document
                        .querySelectorAll(
                            ".copy-dropdown"
                        )
                        .forEach(
                            menu => {

                                if (
                                    menu !==
                                    dropdown
                                ) {

                                    menu.classList
                                        .remove(
                                            "open"
                                        );

                                }

                            }
                        );


                    const open =
                        dropdown.classList
                            .toggle(
                                "open"
                            );


                    copyButton.setAttribute(
                        "aria-expanded",
                        open
                            ? "true"
                            : "false"
                    );


                    return;

                }


                if (
                    !event.target.closest(
                        ".copy-dropdown"
                    )
                ) {

                    document
                        .querySelectorAll(
                            ".copy-dropdown"
                        )
                        .forEach(
                            menu => {

                                menu.classList.remove(
                                    "open"
                                );

                            }
                        );

                }

            }
        );



        /* =====================================
           COPY CONTENT
        ===================================== */

        document.addEventListener(
            "click",
            async event => {

                const option =
                    event.target.closest(
                        ".copy-option"
                    );


                if (
                    !option
                ) {
                    return;
                }


                const verse =
                    option.closest(
                        ".poem-verse"
                    );


                const type =
                    option.dataset.type;


                const selector =
                    type ===
                    "arabic"
                        ? ".arabic-text"
                        : ".eng-translation";


                const text =
                    verse
                        .querySelector(
                            selector
                        )
                        ?.innerText
                        .trim() ||
                    "";


                if (
                    !text
                ) {
                    return;
                }


                try {

                    await navigator.clipboard
                        .writeText(
                            text
                        );


                    showCopyToast();

                } catch (
                    error
                ) {

                    console.error(
                        "Unable to copy:",
                        error
                    );

                }


                option
                    .closest(
                        ".copy-dropdown"
                    )
                    .classList
                    .remove(
                        "open"
                    );

            }
        );



        function showCopyToast() {

            if (
                !copyToast
            ) {
                return;
            }


            copyToast.classList.add(
                "show"
            );


            window.setTimeout(
                () => {

                    copyToast.classList.remove(
                        "show"
                    );

                },
                1500
            );

        }



    }
);