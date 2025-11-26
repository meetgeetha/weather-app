/**
 * Weather App - Main Client-Side Logic
 * Handles API calls, UI updates, unit conversion, localStorage caching, and modal interactions
 */

// App State
const appState = {
    unit: localStorage.getItem('tempUnit') || 'fahrenheit', // Default to Fahrenheit
    citiesData: [],
    featuredData: null
};

// DOM Elements
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const stateInput = document.getElementById('stateInput');
const countryInput = document.getElementById('countryInput');
const unitToggle = document.getElementById('unitToggle');
const citiesGrid = document.getElementById('citiesGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const featuredResult = document.getElementById('featuredResult');
const featuredCard = document.getElementById('featuredCard');
const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
const modalBody = document.getElementById('modalBody');

/**
 * Initialize the app on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Initialize app - set unit toggle, load cities, attach event listeners
 */
function initializeApp() {
    // Set unit toggle button text
    updateUnitToggle();
    
    // Load default cities weather
    loadDefaultCities();
    
    // Attach event listeners
    searchForm.addEventListener('submit', handleSearch);
    unitToggle.addEventListener('click', toggleTemperatureUnit);
}

/**
 * Fetch weather for default cities from API
 */
async function loadDefaultCities() {
    try {
        loadingSpinner.style.display = 'block';
        citiesGrid.innerHTML = '';
        
        const response = await fetch('/api/cities');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const cities = await response.json();
        appState.citiesData = cities;
        
        loadingSpinner.style.display = 'none';
        
        if (cities.length === 0) {
            citiesGrid.innerHTML = '<p class="text-center text-muted">No cities available</p>';
            return;
        }
        
        renderCitiesGrid(cities);
    } catch (error) {
        loadingSpinner.style.display = 'none';
        citiesGrid.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    <strong>Error loading cities:</strong> ${error.message}
                </div>
            </div>
        `;
        console.error('Error loading default cities:', error);
    }
}

/**
 * Handle search form submission
 */
async function handleSearch(e) {
    e.preventDefault();
    
    const city = cityInput.value.trim();
    const state = stateInput.value.trim();
    const country = countryInput.value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    
    try {
        featuredCard.innerHTML = '<div class="text-center p-4"><div class="spinner-border text-primary" role="status"></div></div>';
        featuredResult.style.display = 'block';
        
        // Build query string
        let url = `/api/weather?city=${encodeURIComponent(city)}`;
        if (state) url += `&state=${encodeURIComponent(state)}`;
        if (country) url += `&country=${encodeURIComponent(country)}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            featuredCard.innerHTML = renderErrorCard(data.error);
        } else {
            appState.featuredData = data;
            featuredCard.innerHTML = renderWeatherCard(data, true);
            
            // Clear form
            cityInput.value = '';
            stateInput.value = '';
            countryInput.value = '';
            
            // Scroll to result
            featuredResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    } catch (error) {
        featuredCard.innerHTML = renderErrorCard(`Failed to fetch weather: ${error.message}`);
        console.error('Search error:', error);
    }
}

/**
 * Toggle between Celsius and Fahrenheit
 */
function toggleTemperatureUnit() {
    appState.unit = appState.unit === 'fahrenheit' ? 'celsius' : 'fahrenheit';
    localStorage.setItem('tempUnit', appState.unit);
    updateUnitToggle();
    
    // Re-render all cards with new unit
    renderCitiesGrid(appState.citiesData);
    if (appState.featuredData) {
        featuredCard.innerHTML = renderWeatherCard(appState.featuredData, true);
    }
}

/**
 * Update unit toggle button text
 */
function updateUnitToggle() {
    unitToggle.textContent = appState.unit === 'fahrenheit' ? '°F' : '°C';
    unitToggle.classList.toggle('active', appState.unit === 'celsius');
}

/**
 * Convert Fahrenheit to Celsius
 */
function fahrenheitToCelsius(fahrenheit) {
    return Math.round((fahrenheit - 32) * 5 / 9);
}

/**
 * Get temperature display value based on current unit
 */
function getTemperature(fahrenheit) {
    if (appState.unit === 'celsius') {
        return fahrenheitToCelsius(fahrenheit);
    }
    return Math.round(fahrenheit);
}

/**
 * Get unit symbol
 */
function getUnitSymbol() {
    return appState.unit === 'fahrenheit' ? '°F' : '°C';
}

/**
 * Render cities grid
 */
function renderCitiesGrid(cities) {
    citiesGrid.innerHTML = cities.map(city => {
        if (city.error) {
            return `<div class="weather-card error-card">
                <div class="card-header">
                    <div class="city-name">${city.city || 'Unknown'}</div>
                </div>
                <div class="error-message">${city.error}</div>
            </div>`;
        }
        return renderWeatherCard(city);
    }).join('');
    
    // Attach click handlers for modal
    document.querySelectorAll('.weather-card:not(.error-card)').forEach((card, index) => {
        card.addEventListener('click', () => showDetailModal(cities[index]));
    });
}

/**
 * Render a single weather card
 */
function renderWeatherCard(data, isFeatured = false) {
    const temp = getTemperature(data.temperature);
    const feelsLike = getTemperature(data.feels_like);
    const unit = getUnitSymbol();
    const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    
    // Determine weather condition class for background
    const weatherClass = getWeatherConditionClass(data.icon);
    
    const sunrise = formatTime(data.sunrise, data.timezone);
    const sunset = formatTime(data.sunset, data.timezone);
    
    return `
        <div class="weather-card ${weatherClass}" role="article" aria-label="Weather for ${data.city}">
            <div class="card-header">
                <div class="city-name">${data.city}</div>
                <div class="country-badge">${data.country}</div>
            </div>
            <div class="weather-main">
                <div>
                    <div class="temperature">${temp}${unit}</div>
                    <div class="feels-like">Feels like ${feelsLike}${unit}</div>
                </div>
                <img 
                    src="${iconUrl}" 
                    alt="${data.description}" 
                    class="weather-icon"
                    loading="lazy"
                    onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"80\" height=\"80\"%3E%3Crect fill=\"%23e2e8f0\" width=\"80\" height=\"80\"/%3E%3C/svg%3E'">
            </div>
            <div class="description">${data.description}</div>
            <div class="weather-details">
                <div class="detail-item">
                    <span class="detail-label">💧 Humidity</span>
                    <span class="detail-value">${data.humidity}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">💨 Wind Speed</span>
                    <span class="detail-value">${data.wind_speed} mph</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">📊 Pressure</span>
                    <span class="detail-value">${data.pressure} hPa</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">👁️ Visibility</span>
                    <span class="detail-value">${data.visibility} km</span>
                </div>
                ${isFeatured ? `
                <div class="detail-item">
                    <span class="detail-label">🌅 Sunrise</span>
                    <span class="detail-value">${sunrise}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">🌇 Sunset</span>
                    <span class="detail-value">${sunset}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Render error card
 */
function renderErrorCard(errorMessage) {
    return `
        <div class="weather-card error-card">
            <div class="error-message">
                <strong>⚠️ Error:</strong> ${errorMessage}
            </div>
        </div>
    `;
}

/**
 * Get weather condition class for background styling
 */
function getWeatherConditionClass(icon) {
    const code = icon.substring(0, 2);
    const isDaytime = icon.endsWith('d');
    
    const conditionMap = {
        '01': isDaytime ? 'clear-day' : 'clear-night',
        '02': 'clouds',
        '03': 'clouds',
        '04': 'clouds',
        '09': 'rain',
        '10': 'rain',
        '11': 'thunderstorm',
        '13': 'snow',
        '50': 'clouds' // mist/fog
    };
    
    return conditionMap[code] || '';
}

/**
 * Show detailed modal for a city's weather
 */
function showDetailModal(data) {
    const temp = getTemperature(data.temperature);
    const feelsLike = getTemperature(data.feels_like);
    const unit = getUnitSymbol();
    const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
    
    const sunrise = formatTime(data.sunrise, data.timezone);
    const sunset = formatTime(data.sunset, data.timezone);
    
    document.getElementById('detailModalLabel').textContent = `${data.city}, ${data.country}`;
    
    modalBody.innerHTML = `
        <div class="text-center mb-4">
            <img src="${iconUrl}" alt="${data.description}" style="width: 120px; height: 120px;" loading="lazy">
            <h2 class="display-4 mb-0">${temp}${unit}</h2>
            <p class="text-muted">Feels like ${feelsLike}${unit}</p>
            <h4 class="text-capitalize">${data.description}</h4>
        </div>
        <div class="row g-3">
            <div class="col-md-6">
                <div class="detail-item">
                    <span class="detail-label">💧 Humidity</span>
                    <span class="detail-value">${data.humidity}%</span>
                </div>
            </div>
            <div class="col-md-6">
                <div class="detail-item">
                    <span class="detail-label">💨 Wind Speed</span>
                    <span class="detail-value">${data.wind_speed} mph</span>
                </div>
            </div>
            <div class="col-md-6">
                <div class="detail-item">
                    <span class="detail-label">📊 Pressure</span>
                    <span class="detail-value">${data.pressure} hPa</span>
                </div>
            </div>
            <div class="col-md-6">
                <div class="detail-item">
                    <span class="detail-label">👁️ Visibility</span>
                    <span class="detail-value">${data.visibility} km</span>
                </div>
            </div>
            <div class="col-md-6">
                <div class="detail-item">
                    <span class="detail-label">🌅 Sunrise</span>
                    <span class="detail-value">${sunrise}</span>
                </div>
            </div>
            <div class="col-md-6">
                <div class="detail-item">
                    <span class="detail-label">🌇 Sunset</span>
                    <span class="detail-value">${sunset}</span>
                </div>
            </div>
        </div>
    `;
    
    detailModal.show();
}

/**
 * Format Unix timestamp to readable time
 */
function formatTime(timestamp, timezone) {
    const date = new Date((timestamp + timezone) * 1000);
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();
    
    const hours = utcHours % 12 || 12;
    const minutes = utcMinutes.toString().padStart(2, '0');
    const period = utcHours >= 12 ? 'PM' : 'AM';
    
    return `${hours}:${minutes} ${period}`;
}

/**
 * Handle errors gracefully
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fahrenheitToCelsius,
        getTemperature,
        formatTime,
        getWeatherConditionClass
    };
}
