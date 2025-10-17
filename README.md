# Weather Application - Shivam Kumar

A full-stack weather application with real-time weather data retrieval and CRUD functionality.

## Features

### Assessment 1: Core Weather App
- Location input (city, zip code, coordinates)
- Browser location detection
- Real-time weather data from OpenWeatherMap API
- Current weather display with icons
- 5-day weather forecast

### Assessment 2: Advanced Features & Persistence
- MongoDB database integration
- CRUD operations for weather data
- Data persistence for previously searched locations
- Update and delete functionality for saved data

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your environment variables in `.env`:
   - `WEATHER_API_KEY`: Your OpenWeatherMap API key (current key: 53d150c03e4220f4e1e1ce537117ee5a)
   - `MONGODB_URI`: Your MongoDB connection string (default: mongodb://localhost:27017/weatherapp)
4. Make sure MongoDB is running on your system
5. Start the application:
   ```
   npm start
   ```
   or for development:
   ```
   npm run dev
   ```

## API Endpoints

- `GET /api/weather` - Retrieve all weather data
- `GET /api/weather/:id` - Retrieve specific weather data by ID
- `POST /api/weather` - Create new weather data
- `PUT /api/weather/:id` - Update existing weather data
- `DELETE /api/weather/:id` - Delete weather data

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Weather API: OpenWeatherMap

## Testing

To test the CRUD operations, run:
```
node test-crud.js
```

To test the Weather API key, run:
```
node test-weather-api.js
```

## Note on API Key

The application includes error handling for invalid API keys. If the provided key is invalid, the application will display mock data for demonstration purposes while maintaining full CRUD functionality with the database.

## Author

Shivam Kumar