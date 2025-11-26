# 🌤️ Weather App

The main purpose of this repo is to demo the pr review is automated from a remote Github action [Link](https://github.com/marketplace/actions/ai-pr-reviewer-with-rag) with minimal setup

A beautiful, modern and robust Python web application to display the real-time weather conditions for any place on the planet Earth. Built with Flask and featuring a responsive, gradient-based UI with PWA support.

## ✨ Features

- **Global Weather Search**: Search for weather conditions in any city worldwide
- **Major Cities Display**: Pre-configured weather display for important cities:
  - Fremont, CA, USA
  - New York, USA
  - Los Angeles, USA
  - Chennai, India
  - Beijing, China
  - Tokyo, Japan
  - Budapest, Hungary
  - Phuket, Thailand
  - Dubai, UAE
- **Modern UI**: Beautiful glassmorphism design with animated gradient hero section
- **Real-time Data**: Live weather updates from OpenWeatherMap API with intelligent caching
- **Celsius/Fahrenheit Toggle**: Switch between temperature units with localStorage persistence
- **Detailed Information**: Temperature, humidity, wind speed, pressure, visibility, sunrise/sunset times
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Progressive Web App (PWA)**: Install as a native app with offline support
- **Performance Optimized**: Server-side caching, lazy loading images, service worker caching
- **Accessibility**: Semantic HTML, ARIA attributes, keyboard navigation support

## 🚀 Quick Start

### Prerequisites

- Python 3.7 or higher
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd weather-app
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your OpenWeatherMap API key
   # Get your free API key from: https://openweathermap.org/api
   ```

5. **Run the application:**
   ```bash
   python app.py
   ```

6. **Open your browser:**
   Navigate to `http://localhost:5000`

## 📋 Configuration

### Environment Variables

The application supports the following environment variables (set them in your `.env` file):

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `WEATHER_API_KEY` | Your OpenWeatherMap API key | - | ✅ Yes |
| `CACHE_TTL` | Cache time-to-live in seconds | 300 (5 min) | ❌ No |
| `CACHE_MAXSIZE` | Maximum number of cached entries | 256 | ❌ No |

Example `.env` file:
```env
WEATHER_API_KEY=your_actual_api_key_here
CACHE_TTL=300
CACHE_MAXSIZE=256
```

### Getting an OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API keys section
4. Generate a new API key
5. Copy the key to your `.env` file:
   ```
   WEATHER_API_KEY=your_actual_api_key_here
   ```

### Caching Configuration

The app includes an in-memory cache to reduce API calls and avoid rate limiting:
- **CACHE_TTL**: How long (in seconds) weather data is cached before refreshing (default: 300 seconds = 5 minutes)
- **CACHE_MAXSIZE**: Maximum number of city weather entries to cache (default: 256)

Adjust these values based on your needs and API rate limits.

### Customizing Default Cities

Edit the `DEFAULT_CITIES` list in `app.py` to add or modify the cities displayed on the main page:

```python
DEFAULT_CITIES = [
    {'name': 'Your City', 'state': 'State', 'country': 'Country Code'},
    # ...
]
```

## 🏗️ Project Structure

```
weather-app/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore file
├── README.md             # This file
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── css/
    │   └── style.css     # Stylesheet
    └── js/
        └── app.js        # JavaScript functionality
```

## 🎨 Features in Detail

### Search Functionality
- Type any city name in the search box
- Press Enter or click Search
- View detailed weather information instantly

### Weather Information Displayed
- **Temperature**: Current temperature in Fahrenheit
- **Feels Like**: Perceived temperature
- **Description**: Weather condition description
- **Humidity**: Air humidity percentage
- **Wind Speed**: Wind speed in miles per hour
- **Pressure**: Atmospheric pressure in hPa
- **Visibility**: Visibility distance in kilometers
- **Sunrise/Sunset**: Local sunrise and sunset times

## 🔧 API Endpoints

- `GET /` - Main page
- `GET /api/weather?city=<city_name>&state=<state>&country=<country>` - Get weather for a specific location
- `GET /api/cities` - Get weather for all default cities

## 📱 Progressive Web App (PWA)

This app can be installed as a Progressive Web App for a native app-like experience!

### Installing the PWA

#### On Desktop (Chrome/Edge):
1. Open the app in your browser
2. Look for the install icon (➕) in the address bar
3. Click "Install" when prompted
4. The app will open in its own window

#### On Mobile (Android):
1. Open the app in Chrome
2. Tap the menu (⋮) and select "Add to Home screen"
3. Confirm the installation
4. Launch from your home screen

#### On Mobile (iOS):
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Confirm and launch from your home screen

### PWA Icon Setup

**Important**: The PWA requires icon files for proper installation. Follow these steps:

1. Navigate to `static/icons/` directory
2. Read the `README.md` file in that directory for instructions
3. Generate icons using one of the suggested tools:
   - [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
   - [Favicon.io](https://favicon.io/favicon-converter/)
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
4. Place the generated PNG files in `static/icons/`

Required icon sizes: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

### Offline Support

The service worker caches API responses and static assets, allowing the app to work partially offline:
- Static assets (HTML, CSS, JS) are cached for offline use
- API responses are cached for 5 minutes (configurable via `CACHE_TTL`)
- An offline fallback page is shown when completely offline

## 🛠️ Technologies Used

- **Backend**: Flask (Python web framework) with cachetools for in-memory caching
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla), Bootstrap 5
- **API**: OpenWeatherMap API
- **Styling**: Custom CSS with glassmorphism and animated gradients
- **PWA**: Service Worker with network-first caching strategy
- **Performance**: Lazy loading images, localStorage for preferences

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers with PWA support

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from OpenWeatherMap
- Fonts from [Google Fonts](https://fonts.google.com/)

## 🐛 Troubleshooting

### API Key Issues
- Make sure your API key is correctly set in the `.env` file
- Verify the API key is active on OpenWeatherMap
- Free tier allows 60 calls/minute and 1,000,000 calls/month

### City Not Found
- Try using the format: "City, Country Code" (e.g., "London, GB")
- Some cities may require state/province information
- Check spelling of city names

### Connection Errors
- Ensure you have an active internet connection
- Check if OpenWeatherMap API is accessible
- Verify firewall settings aren't blocking requests

---

**Enjoy checking the weather! ☀️🌧️⛅**

