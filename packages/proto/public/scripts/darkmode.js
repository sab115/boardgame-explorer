function initDarkMode() {
    const checkbox = document.getElementById("dark-toggle");
    if (!checkbox) {
        console.warn("Dark mode toggle not found");
        return;
    }

    checkbox.addEventListener("change", (event) => {
        const checked = event.target.checked;
        const customEvent = new CustomEvent("darkmode:toggle", {
            detail: { checked }
        });
        event.stopPropagation();
        document.body.dispatchEvent(customEvent);
    });

    document.body.addEventListener("darkmode:toggle", (event) => {
        const on = event.detail?.checked;
        document.body.classList.toggle("dark-mode", on);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDarkMode);
} else {
    initDarkMode();
}