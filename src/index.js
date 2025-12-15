/**
 * @fileoverview Webpack entry point.
 *
 * Responsibilities:
 *  - Loads styles
 *  - Initializes app on DOMContentLoaded
 *
 * @module index
 */
import "./styles.js";
import { initApp } from "./controller.js";

console.log("🚀 Webpack Template Running!");

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});
