// API Configuration
const WEATHER_API_KEY = '53d150c03e4220f4e1e1ce537117ee5a'; // Updated with your provided API key
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const locationInput = document.getElementById('locationInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const getCurrentLocationBtn = document.getElementById('getCurrentLocationBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const forecastDisplay = document.getElementById('forecastDisplay');
const savedWeatherList = document.getElementById('savedWeatherList');
const infoButton = document.getElementById('infoButton');
const infoModal = document.getElementById('infoModal');
const closeModal = document.querySelector('.close');

// Event Listeners
getWeatherBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        getWeatherData(location);
    }
});

getCurrentLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by this browser.');
        return;
    }
    
    // Show loading message
    showLoading();
    
    // Configure geolocation options for better accuracy
    const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
    };
    
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            console.log(`Geolocation successful: ${latitude}, ${longitude}`);
            getWeatherData(`${latitude},${longitude}`);
        },
        error => {
            let errorMessage = 'Unable to get your location. ';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Please enable location access in your browser settings and try again.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Location information is unavailable. Please try entering a location manually.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'The request timed out. Please try again or enter a location manually.';
                    break;
                default:
                    errorMessage += 'An unknown error occurred. Please try entering a location manually.';
                    break;
            }
            
            console.error('Geolocation error:', error);
            showError(errorMessage);
        },
        options
    );
});

infoButton.addEventListener('click', () => {
    infoModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    infoModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === infoModal) {
        infoModal.style.display = 'none';
    }
});

// Weather Functions
async function getWeatherData(location) {
    try {
        showLoading();
        
        // Parse location input
        let url;
        if (location.includes(',')) {
            // Handle coordinates (latitude,longitude format)
            const coords = location.split(',');
            if (coords.length !== 2) {
                throw new Error('Invalid coordinate format. Please use "latitude,longitude"');
            }
            
            const lat = parseFloat(coords[0].trim());
            const lon = parseFloat(coords[1].trim());
            
            if (isNaN(lat) || isNaN(lon)) {
                throw new Error('Invalid coordinate values. Please use valid numbers for latitude and longitude.');
            }
            
            // Validate coordinate ranges
            if (lat < -90 || lat > 90) {
                throw new Error('Latitude must be between -90 and 90 degrees.');
            }
            
            if (lon < -180 || lon > 180) {
                throw new Error('Longitude must be between -180 and 180 degrees.');
            }
            
            url = `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
        } else if (/^\d{5}(-\d{4})?$/.test(location)) {
            // Handle US zip codes (5 digits or 5+4 format)
            url = `${WEATHER_API_BASE}/weather?zip=${location},US&appid=${WEATHER_API_KEY}&units=metric`;
        } else if (/^\d{5}$/.test(location)) {
            // Handle generic 5-digit codes (assume US zip)
            url = `${WEATHER_API_BASE}/weather?zip=${location},US&appid=${WEATHER_API_KEY}&units=metric`;
        } else {
            // Assume it's a city name
            url = `${WEATHER_API_BASE}/weather?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=metric`;
        }
        
        // Fetch current weather
        const response = await fetch(url);
        
        // Check if response is OK
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Weather API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        displayCurrentWeather(data);
        
        // Fetch forecast
        let forecastUrl;
        if (location.includes(',')) {
            // Handle coordinates
            const coords = location.split(',');
            const lat = parseFloat(coords[0].trim());
            const lon = parseFloat(coords[1].trim());
            forecastUrl = `${WEATHER_API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
        } else if (/^\d{5}(-\d{4})?$/.test(location) || /^\d{5}$/.test(location)) {
            // Handle zip codes
            forecastUrl = `${WEATHER_API_BASE}/forecast?zip=${location},US&appid=${WEATHER_API_KEY}&units=metric`;
        } else {
            // Handle city names
            forecastUrl = `${WEATHER_API_BASE}/forecast?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=metric`;
        }
        
        const forecastResponse = await fetch(forecastUrl);
        
        // Check if forecast response is OK
        if (!forecastResponse.ok) {
            const errorData = await forecastResponse.json().catch(() => ({}));
            throw new Error(errorData.message || `Forecast API error: ${forecastResponse.status} ${forecastResponse.statusText}`);
        }
        
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
        
        // Save to database
        saveWeatherData(data, forecastData);
        
    } catch (error) {
        console.error('Weather API Error:', error);
        showError(`Error fetching weather data: ${error.message}`);
    }
}

function displayCurrentWeather(data) {
    const weatherHtml = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <div class="weather-icon">
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
        </div>
        <p class="temperature">${Math.round(data.main.temp)}°C</p>
        <p class="description">${data.weather[0].description}</p>
        <div class="details">
            <p>Feels like: ${Math.round(data.main.feels_like)}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        </div>
    `;
    
    weatherDisplay.innerHTML = weatherHtml;
}

function displayForecast(data) {
    // Filter to get one forecast per day (around noon)
    const dailyForecasts = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = item;
        }
    });
    
    // Get first 5 days
    const dates = Object.keys(dailyForecasts).slice(0, 5);
    
    let forecastHtml = '<h3>5-Day Forecast</h3><div class="forecast-container">';
    dates.forEach(date => {
        const item = dailyForecasts[date];
        const day = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        forecastHtml += `
            <div class="forecast-item">
                <p><strong>${day}</strong></p>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                </div>
                <p>${Math.round(item.main.temp)}°C</p>
                <p>${item.weather[0].description}</p>
            </div>
        `;
    });
    forecastHtml += '</div>';
    
    forecastDisplay.innerHTML = forecastHtml;
}

// UI Helper Functions
function showLoading() {
    weatherDisplay.innerHTML = '<div class="loading">Loading weather data...</div>';
    forecastDisplay.innerHTML = '';
}

function showError(message) {
    weatherDisplay.innerHTML = `<div class="error">${message}</div>`;
    forecastDisplay.innerHTML = '';
}

// CRUD Operations (connected to backend)
async function saveWeatherData(currentWeather, forecast) {
    try {
        const weatherData = {
            location: currentWeather.name,
            country: currentWeather.sys.country,
            temperature: currentWeather.main.temp,
            feelsLike: currentWeather.main.feels_like,
            humidity: currentWeather.main.humidity,
            windSpeed: currentWeather.wind.speed,
            description: currentWeather.weather[0].description,
            icon: currentWeather.weather[0].icon,
            forecast: forecast.list.slice(0, 5).map(item => ({
                date: new Date(item.dt * 1000),
                temperature: item.main.temp,
                description: item.weather[0].description,
                icon: item.weather[0].icon
            }))
        };

        const response = await fetch(`${API_BASE_URL}/weather`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(weatherData)
        });

        if (!response.ok) {
            throw new Error('Failed to save weather data');
        }

        const savedData = await response.json();
        console.log('Weather data saved:', savedData);
        loadSavedWeather(); // Refresh the saved weather list
    } catch (error) {
        console.error('Error saving weather data:', error);
    }
}

async function loadSavedWeather() {
    try {
        const response = await fetch(`${API_BASE_URL}/weather`);
        if (!response.ok) {
            throw new Error('Failed to load saved weather data');
        }

        const weatherData = await response.json();
        displaySavedWeather(weatherData);
    } catch (error) {
        console.error('Error loading saved weather data:', error);
    }
}

async function updateWeatherData(id, updates) {
    try {
        const response = await fetch(`${API_BASE_URL}/weather/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            throw new Error('Failed to update weather data');
        }

        const updatedData = await response.json();
        console.log('Weather data updated:', updatedData);
        loadSavedWeather(); // Refresh the saved weather list
    } catch (error) {
        console.error('Error updating weather data:', error);
    }
}

async function deleteWeatherData(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/weather/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete weather data');
        }

        console.log('Weather data deleted');
        loadSavedWeather(); // Refresh the saved weather list
    } catch (error) {
        console.error('Error deleting weather data:', error);
    }
}

// Function to display saved weather data
function displaySavedWeather(weatherData) {
    if (!weatherData || weatherData.length === 0) {
        savedWeatherList.innerHTML = '<p>No saved weather data found.</p>';
        return;
    }

    let html = '';
    weatherData.forEach(item => {
        html += `
            <div class="saved-weather-item" data-id="${item._id}">
                <h4>${item.location}, ${item.country}</h4>
                <p>Temperature: ${item.temperature}°C</p>
                <p>Description: ${item.description}</p>
                <p>Date: ${new Date(item.date).toLocaleString()}</p>
                <button class="update-btn" onclick="editWeatherData('${item._id}')">Edit</button>
                <button class="delete-btn" onclick="deleteWeatherData('${item._id}')">Delete</button>
            </div>
        `;
    });

    savedWeatherList.innerHTML = html;
}

// Function to edit weather data
function editWeatherData(id) {
    const newDescription = prompt('Enter new description:');
    if (newDescription !== null) {
        updateWeatherData(id, { description: newDescription });
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadSavedWeather();
});