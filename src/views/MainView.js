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

export class MainView {
    /**
     * @param {HTMLElement} container The DOM element for the main section.
     */
    constructor(container) {
        this.container = container;

        this._searchForm = container.querySelector(".search-form");
        this._searchBar = container.querySelector("#city-input");
        this._errorDisplay = container.querySelector(".error-display");
        this._weatherDataContainer = container.querySelector(".weather-data");

        this._onSearch = null;

        this._setupEventListeners();
    }

    /**
     * Render the full weather data
     */
    update(weatherData) {
        this._weatherDataContainer.classList.add("visible");

        // Render Header
        document.querySelector(".header-title").textContent = `${weatherData.city} Weather`;
        //UIUtils.renderSvg();

        // today's date converted to the current weekday
        formatDate(new Date(), "E..EEE");
    }

    /**
     * Event delegation for search bar
     */
    _setupEventListeners() {
        this._searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            this._errorDisplay.textContent = "";
            this._onSearch?.(this._searchBar.value);
        });
    }

    setOnSearch(callback) {
        this._onSearch = callback;
    }

    displaySearchError(message) {
        this._errorDisplay.textContent = message;
    }

    clearSearchBar() {
        this._searchBar.value = "";
    }
}
