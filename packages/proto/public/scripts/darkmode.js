// Toggle dark mode using a custom event pattern
document.body.addEventListener("darkmode:toggle", (event) => {
    const on = event.detail?.checked;
    document.body.classList.toggle("dark-mode", on);
});

// Relay the checkbox change as a custom event
const checkbox = document.getElementById("dark-toggle");
checkbox.addEventListener("change", (event) => {
    const checked = event.target.checked;
    const customEvent = new CustomEvent("darkmode:toggle", {
        detail: { checked }
    });
    event.stopPropagation();
    document.body.dispatchEvent(customEvent);
});
