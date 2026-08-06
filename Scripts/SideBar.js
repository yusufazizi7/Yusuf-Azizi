document.addEventListener("DOMContentLoaded", () => {
    const navigation = document.getElementById("primary-navigation");
    const menuButton = document.getElementById("menu-bars");

    const settingsButton = document.getElementById("settings-toggle");
    const settingsSidebar = document.getElementById("poem-settings");
    const settingsCloseButton = document.getElementById("settings-close");
    const sidebarBackdrop = document.getElementById("sidebar-backdrop");

    function closeNavigation() {
        navigation?.classList.remove("active");
        menuButton?.setAttribute("aria-expanded", "false");
        menuButton?.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    }

    function toggleNavigation() {
        if (!navigation || !menuButton) {
            return;
        }

        const isOpen = navigation.classList.toggle("active");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );
    }

    function openSettings() {
        if (!settingsSidebar || !settingsButton) {
            return;
        }

        closeNavigation();

        settingsSidebar.classList.add("active");
        sidebarBackdrop?.classList.add("active");
        document.body.classList.add("sidebar-open");

        settingsSidebar.setAttribute("aria-hidden", "false");
        settingsButton.setAttribute("aria-expanded", "true");
        settingsButton.setAttribute(
            "aria-label",
            "Close poem settings"
        );

        settingsCloseButton?.focus();
    }

    function closeSettings() {
        if (!settingsSidebar || !settingsButton) {
            return;
        }

        settingsSidebar.classList.remove("active");
        sidebarBackdrop?.classList.remove("active");
        document.body.classList.remove("sidebar-open");

        settingsSidebar.setAttribute("aria-hidden", "true");
        settingsButton.setAttribute("aria-expanded", "false");
        settingsButton.setAttribute(
            "aria-label",
            "Open poem settings"
        );
    }

    function toggleSettings() {
        const isOpen =
            settingsSidebar?.classList.contains("active");

        if (isOpen) {
            closeSettings();
        } else {
            openSettings();
        }
    }

    menuButton?.addEventListener(
        "click",
        toggleNavigation
    );

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

    navigation?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNavigation();
            closeSettings();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeNavigation();
        }
    });
});