function buildCookieConsentBanner() {
    const banner = document.createElement("div");
    banner.className = "cookie-consent-banner";
    banner.id = "cookie-consent-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.innerHTML = `
        <span>This site uses Google Analytics to improve the checklist experience.</span>
        <div class="cookie-consent-actions">
            <button id="cookie-consent-decline" type="button" class="secondary">Decline</button>
            <button id="cookie-consent-accept" type="button">Accept</button>
        </div>
    `;
    return banner;
}

function withTheme(element, theme) {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-theme", theme);
    wrapper.style.padding = "0.5rem";
    wrapper.style.background = "var(--bg)";
    wrapper.appendChild(element);
    return wrapper;
}

export default {
    title: "Components/CookieConsentBanner",
};

export const Visible = {
    name: "Cookie consent banner",
    render: () => buildCookieConsentBanner(),
};

export const VisibleDark = {
    name: "Cookie consent banner (dark mode)",
    render: () => withTheme(buildCookieConsentBanner(), "dark"),
};
