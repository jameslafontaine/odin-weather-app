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
import { formatDueDate } from "../utils/DateUtils.js";

export class MainView {
    /**
     * @param {HTMLElement} container The DOM element for the main section.
     */
    constructor(container) {
        this.container = container;

        this._searchBtn = container.querySelector(".search-btn");

        this._onSearch = null;

        this._setupEventListeners();
    }

    /**
     * Render the full weather data
     */
    update(weatherData) {}

    /**
     * Event delegation for search bar
     */
    _setupEventListeners() {
        this._searchBtn.addEventListener();
    }

    setOnSearch(callback) {
        this._onSearch = callback;
    }
}
