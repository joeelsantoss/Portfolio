// Clave unica para guardar el tema (light/dark) en localStorage.
const THEME_STORAGE_KEY = "portfolio-theme";

// Inicializa el switch de tema en cualquier pagina que tenga [data-theme-switch].
function initThemeToggle() {
    // Puede haber varios switches (navbar en distintas paginas), por eso se usa querySelectorAll.
    const toggles = document.querySelectorAll("[data-theme-switch]");
    if (!toggles.length) {
        // Si la pagina no tiene switch, no hace nada.
        return;
    }

    // Etiquetas de texto junto al switch: "Modo claro" / "Modo oscuro".
    const labels = document.querySelectorAll("[data-theme-label]");
    // <html>: Bootstrap lee data-bs-theme desde aqui para aplicar su tema.
    const root = document.documentElement;
    // Recupera la preferencia guardada.
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    // Tema inicial: primero localStorage, si no existe usa lo que tenga el HTML.
    const currentTheme = savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : root.getAttribute("data-bs-theme") === "dark"
            ? "dark"
            : "light";

    // Sincroniza estado visual + atributo del tema + persistencia local.
    function syncTheme(theme) {
        const isDark = theme === "dark";
        root.setAttribute("data-bs-theme", theme);
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        // Refleja en todos los switches el estado actual.
        toggles.forEach((toggle) => {
            toggle.checked = isDark;
        });
        // Actualiza el texto informativo del modo actual.
        labels.forEach((label) => {
            label.textContent = isDark ? "Modo oscuro" : "Modo claro";
        });
    }

    // Aplica tema inicial al cargar.
    syncTheme(currentTheme);

    // Escucha cambios de cada switch para alternar el tema.
    toggles.forEach((toggle) => {
        toggle.addEventListener("change", (event) => {
            syncTheme(event.target.checked ? "dark" : "light");
        });
    });
}

// Valida rutas relativas locales .html seguras para el iframe del visor.
// Reglas: que exista, sin ".." y con caracteres permitidos.
function isSafeLocalPath(value) {
    return Boolean(value)
        && !value.includes("..")
        && /^[a-z0-9 _()/.-]+\.html$/i.test(value);
}

// Valida rutas absolutas de Windows acabadas en .html (por compatibilidad).
function isSafeWindowsHtmlPath(value) {
    return /^[a-z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]+\.html$/i.test(value || "");
}

// Convierte una ruta de Windows a file:/// para usarla como src de iframe.
function toFileUrl(path) {
    return `file:///${encodeURI(path.replace(/\\/g, "/"))}`;
}

// Inicializa la logica del visor.html (titulo, iframe, enlace volver y estado vacio).
function initViewer() {
    // Solo aplica en visor.html, porque en otras paginas no existe este iframe.
    const iframe = document.querySelector("[data-practice-frame]");
    if (!iframe) {
        return;
    }

    // Lee parametros de la URL: ?title=...&url=...&back=...
    const params = new URLSearchParams(window.location.search);
    const title = params.get("title") || "Practica";
    const url = params.get("url") || "";
    const externalPath = params.get("path") || "";
    const back = params.get("back") || "index.html";
    // Solo carga rutas validadas para evitar rutas peligrosas o mal formadas.
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

    // Protege el enlace de vuelta: si no es valido, vuelve al index por defecto.
    backLinks.forEach((link) => {
        link.setAttribute("href", isSafeLocalPath(back) ? back : "index.html");
    });

    // Si no hay fuente valida, muestra aviso y no carga iframe.
    if (!resolvedSrc) {
        iframe.removeAttribute("src");
        emptyState?.classList.add("is-visible");
        return;
    }

    // Carga la practica y oculta mensaje de error.
    iframe.src = resolvedSrc;
    iframe.title = title;
    emptyState?.classList.remove("is-visible");
}

// Punto de entrada cuando el DOM ya esta cargado.
document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initViewer();
});
