import { withPrintStyles } from "./utils.js";

function buildPrintLayout({
    passingWidth = "0%",
    failingWidth = "0%",
    incompleteWidth = "100%",
    passingCount = 0,
    failingCount = 0,
    incompleteCount = 0,
} = {}) {
    const root = document.createElement("div");
    root.innerHTML = `
        <div class="header">
            <div class="header-actions">
                <button id="theme-toggle" class="header-icon-button" type="button" aria-label="Toggle dark mode">☀️</button>
            </div>
            <h1>📋 STAMPED Compliance Checklist</h1>
            <p>Assess your research objects against the STAMPED principles</p>
            <div class="progress-bar-container">
                <div class="progress-bar" id="progressBar">
                    <div class="progress-segment pass" data-progress-segment="passing" style="width:${passingWidth}"></div>
                    <div class="progress-segment fail" data-progress-segment="failing" style="width:${failingWidth}"></div>
                    <div class="progress-segment incomplete" data-progress-segment="incomplete" style="width:${incompleteWidth}"></div>
                </div>
            </div>
            <div class="progress-text" id="progressText">
                <span class="progress-value pass" data-progress-value="passing" aria-label="passing items">${passingCount}</span> /
                <span class="progress-value fail" data-progress-value="failing" aria-label="failing items">${failingCount}</span> /
                <span class="progress-value incomplete" data-progress-value="incomplete" aria-label="incomplete items">${incompleteCount}</span>
            </div>
        </div>
        <div class="toolbar">
            <button type="button"><span class="icon">🖨️</span> Print</button>
            <button type="button" class="danger"><span class="icon">🗑️</span> Reset</button>
        </div>
        <div class="container" id="app">
            <div class="intro-text">
                This checklist helps you assess compliance with the <strong>STAMPED</strong> principles for computational reproducibility.
                <div class="legend">
                    <div class="legend-item"><div class="legend-dot must"></div>MUST — Required</div>
                    <div class="legend-item"><div class="legend-dot should"></div>SHOULD — Recommended</div>
                    <div class="legend-item"><div class="legend-dot may"></div>MAY — Optional</div>
                </div>
            </div>
            <div class="cards-grid cols-auto">
                <div class="principle-card must">
                    <div class="principle-header">
                        <div class="principle-header-main">
                            <span class="level-badge must">MUST</span>
                            <span class="principle-code">T.1 + T.3 + T.5</span>
                            <div class="principle-heading">
                                <div class="principle-title-row">
                                    <div class="principle-title">Tracking</div>
                                </div>
                            </div>
                            <span class="principle-count">0/3</span>
                        </div>
                        <div class="principle-description">
                            Persistent content identification MUST be recorded for all components. Provenance of all
                            modifications MUST be recorded.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    return withPrintStyles(root);
}

export default {
    title: "Pages/PrintLayout",
};

export const Incomplete = {
    name: "Print layout (incomplete)",
    render: () => buildPrintLayout(),
};

export const Passing = {
    name: "Print layout (passing)",
    render: () =>
        buildPrintLayout({
            passingWidth: "100%",
            failingWidth: "0%",
            incompleteWidth: "0%",
            passingCount: 3,
            failingCount: 0,
            incompleteCount: 0,
        }),
};

export const Mixed = {
    name: "Print layout (mixed results)",
    render: () =>
        buildPrintLayout({
            passingWidth: "34%",
            failingWidth: "33%",
            incompleteWidth: "33%",
            passingCount: 1,
            failingCount: 1,
            incompleteCount: 1,
        }),
};
