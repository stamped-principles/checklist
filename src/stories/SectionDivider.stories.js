import { DATA } from "../checklist.js";

/** Build a section divider element matching the structure in buildChecklist(). */
function buildSectionDivider(section, si) {
    const divider = document.createElement("div");
    divider.className = "section-divider";
    divider.setAttribute("data-level", section.level);
    const totalItems = section.principles.flatMap((p) => p.items).length;
    divider.innerHTML = `
        <span class="section-badge ${section.level}">${section.label}</span>
        <span style="font-weight:600; font-size:0.95rem;">${
            section.level === "must" ? "Required" : section.level === "should" ? "Recommended" : "Optional"
        } Requirements</span>
        <span class="section-progress" id="sectionProgress_${si}">0/${totalItems}</span>
    `;
    return divider;
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
    title: "Components/SectionDivider",
};

export const MustDivider = {
    name: "MUST section divider",
    render: () => buildSectionDivider(DATA[0], 0),
};

export const ShouldDivider = {
    name: "SHOULD section divider",
    render: () => buildSectionDivider(DATA[1], 1),
};

export const MayDivider = {
    name: "MAY section divider",
    render: () => buildSectionDivider(DATA[2], 2),
};

export const MustDividerDark = {
    name: "MUST section divider (dark mode)",
    render: () => withTheme(buildSectionDivider(DATA[0], 0), "dark"),
};
