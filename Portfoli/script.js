const THEME_STORAGE_KEY = "portfolio-theme";

function initThemeToggle() {
    const toggles = document.querySelectorAll("[data-theme-switch]");
    if (!toggles.length) {
        return;
    }

    const labels = document.querySelectorAll("[data-theme-label]");
    const root = document.documentElement;
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const currentTheme = savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : root.getAttribute("data-bs-theme") === "dark"
            ? "dark"
            : "light";

    function syncTheme(theme) {
        const isDark = theme === "dark";
        root.setAttribute("data-bs-theme", theme);
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        toggles.forEach((toggle) => {
            toggle.checked = isDark;
        });
        labels.forEach((label) => {
            label.textContent = isDark ? "Modo oscuro" : "Modo claro";
        });
    }

    syncTheme(currentTheme);

    toggles.forEach((toggle) => {
        toggle.addEventListener("change", (event) => {
            syncTheme(event.target.checked ? "dark" : "light");
        });
    });
}

function isSafeLocalPath(value) {
    return Boolean(value)
        && !value.includes("..")
        && /^[a-z0-9 _()/.-]+\.html$/i.test(value);
}

function isSafeWindowsHtmlPath(value) {
    return /^[a-z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]+\.html$/i.test(value || "");
}

function toFileUrl(path) {
    return `file:///${encodeURI(path.replace(/\\/g, "/"))}`;
}

function initViewer() {
    const iframe = document.querySelector("[data-practice-frame]");
    if (!iframe) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const title = params.get("title") || "Practica";
    const url = params.get("url") || "";
    const externalPath = params.get("path") || "";
    const back = params.get("back") || "index.html";
    const resolvedSrc = isSafeLocalPath(url)
        ? url
        : isSafeWindowsHtmlPath(externalPath)
            ? toFileUrl(externalPath)
            : "";

    const titleTarget = document.querySelector("[data-viewer-title]");
    const backLinks = document.querySelectorAll("[data-back-link]");
    const emptyState = document.querySelector("[data-viewer-empty]");

    if (titleTarget) {
        titleTarget.textContent = title;
    }

    backLinks.forEach((link) => {
        link.setAttribute("href", isSafeLocalPath(back) ? back : "index.html");
    });

    if (!resolvedSrc) {
        iframe.removeAttribute("src");
        emptyState?.classList.add("is-visible");
        return;
    }

    iframe.src = resolvedSrc;
    iframe.title = title;
    emptyState?.classList.remove("is-visible");
}

document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initViewer();
});