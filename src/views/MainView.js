/**
 * @fileoverview Generic main content view responsible for rendering:
 *  - The active entity (e.g., project, category, document) heading.
 *  - A list of items associated with that entity.
 *  - Action buttons for editing, deleting, starring, expanding items, etc.
 *
 * This view does not assume any specific schema. All data comes in
 * through arguments and is rendered generically.
 *
 * Exports:
 *  - MainView — A reusable UI view for list-based applications.
 *
 * Dependencies:
 *  - UIUtils
 *
 * @module MainView
 */

import { UIUtils } from "../utils/UIUtils.js";
import { formatDate } from "../utils/DateUtils.js";

import weatherIcons from "../assets/img/weather-icons/weatherIcons";

export class MainView {
    /**
     * @param {HTMLElement} container The DOM element for the main section.
     */
    constructor(container) {
        this.container = container;

        this._searchForm = container.querySelector(".search-form");
        this._searchBar = container.querySelector("#city-input");
        this._errorDisplay = container.querySelector(".error-display");
        this._loadingEl = container.querySelector("#loading");

        this._weatherDataContainer = container.querySelector(".weather-data");
        this._currentConditions = this._weatherDataContainer.querySelector(".current-conditions");
        this._celsiusButton = this._currentConditions.querySelector(".celsius-button");
        this._fahrenheitButton = this._currentConditions.querySelector(".fahrenheit-button");
        this._sevenDayForecast = this._weatherDataContainer.querySelector(".seven-day-forecast");

        this._onSearch = null;
        this._onTempToggle = null;

        this.useCelsius = true;

        this._setupEventListeners();
    }

    /**
     * Render the full weather data
     */
    update(weatherData) {
        this._weatherDataContainer.classList.add("visible");

        // Render Header
        document.querySelector(".header-title").textContent = `${weatherData.city} Weather`;

        this.renderCurrentConditions(weatherData);

        this.renderForecast(weatherData.sevenDayForecast);
    }

    /**
     * Event delegation for search bar
     */
    _setupEventListeners() {
        this._searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            this._errorDisplay.classList.remove("visible");
            this.setLoading(true);
            this._onSearch?.(this._searchBar.value);
        });

        this._celsiusButton.addEventListener("click", () => {
            if (this.useCelsius) {
                return;
            }

            this._celsiusButton.classList.add("selected");
            this._fahrenheitButton.classList.remove("selected");
            this._toggleCelsius();
            this._onTempToggle?.();
        });

        this._fahrenheitButton.addEventListener("click", () => {
            if (!this.useCelsius) {
                return;
            }

            this._fahrenheitButton.classList.add("selected");
            this._celsiusButton.classList.remove("selected");
            this._toggleCelsius();
            this._onTempToggle?.();
        });
    }

    setOnSearch(callback) {
        this._onSearch = callback;
    }

    setOnTempToggle(callback) {
        this._onTempToggle = callback;
    }

    displaySearchError(message) {
        this._errorDisplay.textContent = message;
        this._errorDisplay.classList.add("visible");
    }

    clearSearchBar() {
        this._searchBar.value = "";
    }

    renderCurrentConditions(weatherData) {
        const currentConditionsEl = this._currentConditions;

        UIUtils.renderSvg({
            path: weatherIcons[weatherData.currentIcon] ?? weatherIcons["clear-day"],
            target: currentConditionsEl.querySelector(".weather-icon-container"),
            className: "weather-icon",
        });

        currentConditionsEl.querySelector(".current-temp").textContent = this.useCelsius
            ? weatherData.currentTempC
            : weatherData.currentTempF;

        currentConditionsEl.querySelector(".weekday").textContent = formatDate(
            new Date(weatherData.currentDatetime),
            "EEEE h:00 a"
        );
        currentConditionsEl.querySelector(".conditions").textContent = weatherData.currentConditions;
    }

    renderForecast(sevenDayForecast) {
        let i = 0;
        let currForecastEl;

        const forecastEls = this._sevenDayForecast.querySelectorAll(".forecast-day");

        sevenDayForecast.forEach((forecastData) => {
            currForecastEl = forecastEls[i];

            currForecastEl.querySelector(".weekday").textContent = formatDate(forecastData.date, "E");
            UIUtils.renderSvg({
                path: weatherIcons[forecastData.icon] ?? weatherIcons["clear-day"],
                target: currForecastEl.querySelector(".weather-icon-container"),
                className: "weather-icon",
            });
            currForecastEl.querySelector(".conditions").textContent = forecastData.conditions;

            let tempMax = this.useCelsius ? forecastData.tempMaxC : forecastData.tempMaxF;
            let tempMin = this.useCelsius ? forecastData.tempMinC : forecastData.tempMinF;

            currForecastEl.querySelector(".temp-max").textContent = tempMax + "°";
            currForecastEl.querySelector(".temp-min").textContent = tempMin + "°";
            i++;
        });
    }

    _toggleCelsius() {
        this.useCelsius = !this.useCelsius;
    }

    setLoading(isLoading) {
        this._loadingEl.classList.toggle("visible", isLoading);

        this._searchForm.querySelector("button").disabled = isLoading;
    }
}
