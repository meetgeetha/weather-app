// Weather App JavaScript

// Load default cities weather on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDefaultCities();
    
    // Add Enter key support for search
    document.getElementById('citySearch').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });
});

/**
 * Load weather data for all default cities
 */
async function loadDefaultCities() {
    const loading = document.getElementById('loading');
    const citiesGrid = document.getElementById('citiesGrid');
    
    try {
        const response = await fetch('/api/cities');
        const cities = await response.json();
        
        loading.style.display = 'none';
        citiesGrid.innerHTML = '';
        
        cities.forEach(city => {
            if (city.error) {
                citiesGrid.innerHTML += createErrorCard(city.city, city.error);
            } else {
                citiesGrid.innerHTML += createWeatherCard(city);
            }
        });
    } catch (error) {
        loading.innerHTML = `<p style="color: #e74c3c;">Error loading weather data: ${error.message}</p>`;
    }
}

/**
 * Search for weather in a specific city
 */
async function searchWeather() {
    const cityInput = document.getElementById('citySearch');
    const city = cityInput.value.trim();
    const errorDiv = document.getElementById('searchError');
    const resultsSection = document.getElementById('searchResults');
    const resultCard = document.getElementById('searchResultCard');
    
    // Clear previous errors
    errorDiv.classList.remove('show');
    errorDiv.textContent = '';
    
    if (!city) {
        errorDiv.textContent = 'Please enter a city name';
        errorDiv.classList.add('show');
        return;
    }
    
    try {
        resultCard.innerHTML = '<div class="loading">Loading...</div>';
        resultsSection.style.display = 'block';
        
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();
        
        if (data.error) {
            resultCard.innerHTML = createErrorCard(city, data.error);
        } else {
            resultCard.innerHTML = createWeatherCard(data);
            cityInput.value = ''; // Clear input on success
        }
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
        resultCard.innerHTML = createErrorCard(city, `Network error: ${error.message}`);
    }
}

/**
 * Create a weather card HTML element
 */
function createWeatherCard(data) {
    const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    const sunrise = formatTime(data.sunrise, data.timezone);
    const sunset = formatTime(data.sunset, data.timezone);
    
    return `
        <div class="weather-card">
            <div class="weather-header">
                <div class="city-name">${data.city}</div>
                <div class="country-badge">${getCountryName(data.country)}</div>
            </div>
            <div class="weather-main">
                <div>
                    <div class="temperature">${data.temperature}°F</div>
                    <div class="feels-like">Feels like ${data.feels_like}°F</div>
                </div>
                <img src="${iconUrl}" alt="${data.description}" class="weather-icon">
            </div>
            <div class="weather-description">${data.description}</div>
            <div class="weather-details">
                <div class="detail-item">
                    <span class="detail-label">Humidity</span>
                    <span class="detail-value">${data.humidity}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Wind Speed</span>
                    <span class="detail-value">${data.wind_speed} mph</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Pressure</span>
                    <span class="detail-value">${data.pressure} hPa</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Visibility</span>
                    <span class="detail-value">${data.visibility} km</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Sunrise</span>
                    <span class="detail-value">${sunrise}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Sunset</span>
                    <span class="detail-value">${sunset}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create an error card HTML element
 */
function createErrorCard(city, error) {
    return `
        <div class="weather-card" style="border-left: 5px solid #e74c3c;">
            <div class="weather-header">
                <div class="city-name">${city}</div>
            </div>
            <div style="color: #e74c3c; padding: 20px 0;">
                <strong>Error:</strong> ${error}
            </div>
        </div>
    `;
}

/**
 * Format Unix timestamp to readable time
 */
function formatTime(timestamp, timezone) {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

/**
 * Get country name from country code
 */
function getCountryName(code) {
    const countries = {
        'US': 'United States',
        'IN': 'India',
        'CN': 'China',
        'JP': 'Japan',
        'HU': 'Hungary',
        'CA': 'Canada',
        'GB': 'United Kingdom',
        'FR': 'France',
        'DE': 'Germany',
        'IT': 'Italy',
        'ES': 'Spain',
        'AU': 'Australia',
        'BR': 'Brazil',
        'MX': 'Mexico',
        'RU': 'Russia'
    };
    return countries[code] || code;
}

