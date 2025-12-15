/**
 * @fileoverview Bootstraps and orchestrates the main application.
 *
 * Responsibilities:
 *  - Initialize core application components.
 *  - Create and configure all view instances.
 *  - Connect the data/model layer with view event handlers.
 *  - Trigger the render of UI components.
 *
 * @module controller
 */

import { fetchWeatherData } from "./services/weatherService";
import { MainView } from "./views/MainView.js";

// ----------------------
// View instances
// ----------------------
const mainView = new MainView(document.querySelector(".app"));

// ----------------------
// Helper to render the entire app state
// ----------------------
(function renderAll() {})();

// ----------------------
// Assign all callbacks between views and the manager
// ----------------------
function assignCallbacks() {}

// ----------------------
// Initialize the app
// ----------------------
export async function initApp() {
    //assignCallbacks();
    //manager.loadFromStorage?.();
    //renderAll();

    let prompt = window.prompt("Input city name for weather data:") || "Melbourne";

    fetchWeatherData(prompt)
        .then((weather) => {
            console.log("Processed Weather Data:", weather);
        })
        .catch((error) => {
            if (error.name === "WeatherApiError") {
                console.error("Weather service unavailable:", error.message);
            } else if (error.name === "WeatherDataError") {
                console.error("Received invalid weather data");
            } else {
                console.error("Unexpected error:", error);
            }
        });
}
