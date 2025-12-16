const API_KEY = "BUT7CRHV9X6V7EU8ZKTHAKZL7";

class WeatherApiError extends Error {
    constructor(message, status, code) {
        super(message);
        this.name = "WeatherApiError";
        this.status = status;
        this.code = code;
    }
}

class WeatherDataError extends Error {
    constructor(message) {
        super(message);
        this.name = "WeatherDataError";
    }
}

// fetches weather data from Visual Crossing Weather API
async function fetchWeatherData(city) {
    let response;

    try {
        response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${API_KEY}&contentType=json`
        );
    } catch {
        // Network / DNS / offline
        throw new WeatherApiError("Network error while fetching weather data");
    }

    if (!response.ok) {
        if (response.status === 400) {
            throw new WeatherApiError("Invalid city name", response.status, "INVALID_CITY");
        }

        throw new WeatherApiError("Weather service error", response.status, "API_ERROR");
    }

    const rawData = await response.json();
    console.log("Raw Weather Data:", rawData);
    return processWeatherData(rawData);
}

// returns an object with only the needed weather data
function processWeatherData(data) {
    if (!data?.currentConditions) {
        throw new WeatherDataError("Malformed weather data received");
    }

    return {
        sevenDayForecast: data.days.slice(0, 7).map((day) => ({
            date: day.datetime,
            tempMaxC: Math.round(day.tempmax),
            tempMinC: Math.round(day.tempmin),
            tempMaxF: Math.round(convertTempToFahrenheit(day.tempmax)),
            tempMinF: Math.round(convertTempToFahrenheit(day.tempmin)),
            conditions: day.conditions,
            icon: day.icon,
        })),
        city: data.resolvedAddress,
        currentDatetime: data.days[0].datetime + "T" + data.currentConditions.datetime,
        currentTempC: Math.round(data.currentConditions.temp),
        currentTempF: Math.round(convertTempToFahrenheit(data.currentConditions.temp)),
        currentConditions: data.currentConditions.conditions,
        currentIcon: data.currentConditions.icon,
    };
}

function convertTempToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
}

export { fetchWeatherData };
