/**
 * @fileoverview Bootstraps and orchestrates the main application.
 *
 * Responsibilities:
 *  - Initialize core application components.
 *  - Create and configure all view instances.
 *  - Trigger the render of UI components.
 *
 * @module controller
 */

import { fetchWeatherData } from "./services/weatherService";
import { MainView } from "./views/MainView.js";

// ----------------------
// Data objects
// ----------------------
let storedWeatherData = {};

// ----------------------
// View instances
// ----------------------
const mainView = new MainView(document.querySelector(".app"));

// ----------------------
// Helper to render the entire app state
// ----------------------
function renderAll() {
    mainView.clearSearchBar();
    mainView.update(storedWeatherData);
}

// ----------------------
// Assign all callbacks between views and the manager
// ----------------------
function assignCallbacks() {
    mainView.setOnSearch(handleWeatherData);
    mainView.setOnTempToggle(renderAll);
}

async function handleWeatherData(city) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    fetchWeatherData(city)
        .then((weatherData) => {
            console.log("Processed Weather Data:", weatherData);
            storedWeatherData = weatherData;
            renderAll();
        })
        .catch((error) => {
            if (error.name === "WeatherApiError") {
                switch (error.code) {
                    case "INVALID_CITY":
                        mainView.displaySearchError("City not found. Please check the spelling.");
                        break;

                    case "API_ERROR":
                        mainView.displaySearchError("Weather service is temporarily unavailable.");
                        break;

                    default:
                        mainView.displaySearchError("Unexpected weather error.");
                }
            } else if (error.name === "WeatherDataError") {
                mainView.displaySearchError("Received invalid weather data.");
            } else {
                mainView.displaySearchError("An unexpected error occurred.");
                console.error(error);
            }
        })
        .finally(() => {
            mainView.setLoading(false);
        });
}

// ----------------------
// Initialize the app
// ----------------------
export async function initApp() {
    assignCallbacks();
}
