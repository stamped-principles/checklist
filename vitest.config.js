import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        include: ["src/tests/unit/**/*.test.js"],
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov"],
            include: ["src/**/*.js"],
            exclude: ["src/tests/**", "src/stories/**"],
        },
    },
});
