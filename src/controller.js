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
// Data objects
// ----------------------

// ----------------------
// View instances
// ----------------------
const mainView = new MainView(document.querySelector(".app"));

// ----------------------
// Helper to render the entire app state
// ----------------------
function renderAll(weatherData) {
    mainView.clearSearchBar();
    mainView.update(weatherData);
}

// ----------------------
// Assign all callbacks between views and the manager
// ----------------------
function assignCallbacks() {
    mainView.setOnSearch((city) => {
        handleWeatherData(city);
    });
}

function handleWeatherData(city) {
    fetchWeatherData(city)
        .then((weatherData) => {
            console.log("Processed Weather Data:", weatherData);
            renderAll(weatherData);
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
        });
}

// ----------------------
// Initialize the app
// ----------------------
export async function initApp() {
    assignCallbacks();
    //manager.loadFromStorage?.();
    //renderAll();
}
