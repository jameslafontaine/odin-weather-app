# Weather App

A dynamic, modular weather application built to explore **asynchronous JavaScript patterns** and **API integration**.  
This project emphasizes the practical use of **Promises**, **async/await**, and clean **state management** while interacting with external APIs.

---

## 🧩 Project Description

The Weather App allows users to:

- Search for weather in any city
- Display current weather conditions and forecasts
- Handle API requests asynchronously using **fetch** with **Promises** or **async/await**
- Gracefully handle errors from API calls
- Dynamically update the UI without page reloads

The project demonstrates a structured approach to managing **asynchronous data flow** and **DOM updates**, keeping logic modular and maintainable.

---

## 🚀 Features

### 🛠 Modern JavaScript Techniques

- **Async/Await & Promises** for clean asynchronous code
- **Error handling** for network/API failures
- Modularized code using **ES6 modules**
- Dynamic UI updates without page refresh
- Smooth **fade-in transitions** for data updates

---

### 🧠 Application Architecture

The code is structured into **separate modules** for clean separation of concerns:

#### **API Layer**

- Handles all API requests
- Returns Promises that resolve with structured weather data

#### **UI Layer**

- Responsible for rendering weather data
- Includes smooth **opacity transitions** for data updates
- Uses DOM utilities to avoid repetitive code

#### **Controller Layer**

- Orchestrates user input, API calls, and UI updates
- Handles async flows using **async/await**
- Manages error states and loading indicators

---

## 💾 Error Handling & Loading State

- Loading indicators display while fetching data
- Errors are displayed in a **non-disruptive UI container**
- Smooth transitions prevent layout jumps when errors appear/disappear

---

## 🎨 UI / UX Features

- Responsive layout
- Smooth fade-in/out transitions for updated data
- Clean separation between components for maintainable styling
- Input validation with user feedback
- Dynamic icons tied to weather data

---

## 📁 Folder Structure

```
src/
├── assets/
│ ├── fonts/
│ └── img/
├─ services/
│ └── weatherService.js
├── styles/
│ ├── base.css
│ ├── components.css
│ ├── layout.css
│ ├── tokens.css
│ └── utilities.css
├── utils/
│ ├── DateUtils.js
│ └── UIUtils.js
├── views/
│ └── MainView.js
├── controller.js
├── index.html
├── styles.css
└── styles.js
```

---

## 🎯 Learning Objectives

This project was built to develop practical experience with: - Asynchronous JavaScript using **Promises** and **async/await** - Fetching and processing **API data** - Error handling and user feedback for asynchronous operations - Dynamic DOM updates and smooth UI transitions - Modular JS code architecture with **ES6 modules**

---

## 🌐 Live Demo

[Odin Weather App Live Demo](https://jameslafontaine.github.io/odin-weather-app/)

---

## 🔮 Future Improvements

- Implement **location-based weather detection**
- Add **caching** to reduce repeated API calls
- Dark/light theme toggle
- Unit testing for API and UI modules
- Implement full transition animation for weather data

---

## 📜 License

This project is for **educational purposes**.  
Feel free to fork, modify, and explore.
