document.addEventListener(
    "DOMContentLoaded",
    () => {

        const settingsButton =
            document.getElementById(
                "settings-toggle"
            );

        const settingsSidebar =
            document.getElementById(
                "poem-settings"
            );

        const settingsCloseButton =
            document.getElementById(
                "settings-close"
            );

        const sidebarBackdrop =
            document.getElementById(
                "sidebar-backdrop"
            );


        function openSettings() {

            if (
                !settingsSidebar ||
                !settingsButton
            ) {
                return;
            }


            settingsSidebar.classList.add(
                "active"
            );

            sidebarBackdrop?.classList.add(
                "active"
            );

            document.body.classList.add(
                "sidebar-open"
            );


            settingsSidebar.setAttribute(
                "aria-hidden",
                "false"
            );

            settingsButton.setAttribute(
                "aria-expanded",
                "true"
            );

            settingsButton.setAttribute(
                "aria-label",
                "Close poem settings"
            );


            settingsCloseButton?.focus();

        }


        function closeSettings() {

            if (
                !settingsSidebar ||
                !settingsButton
            ) {
                return;
            }


            settingsSidebar.classList.remove(
                "active"
            );

            sidebarBackdrop?.classList.remove(
                "active"
            );

            document.body.classList.remove(
                "sidebar-open"
            );


            settingsSidebar.setAttribute(
                "aria-hidden",
                "true"
            );

            settingsButton.setAttribute(
                "aria-expanded",
                "false"
            );

            settingsButton.setAttribute(
                "aria-label",
                "Open poem settings"
            );

        }


        function toggleSettings() {

            const isOpen =
                settingsSidebar
                    ?.classList
                    .contains(
                        "active"
                    );


            if (isOpen) {

                closeSettings();

            } else {

                openSettings();

            }

        }


        settingsButton?.addEventListener(
            "click",
            toggleSettings
        );


        settingsCloseButton?.addEventListener(
            "click",
            closeSettings
        );


        sidebarBackdrop?.addEventListener(
            "click",
            closeSettings
        );


        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeSettings();

                }

            }
        );

    }
);