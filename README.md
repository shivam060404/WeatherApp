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
- File-based data persistence (for Vercel deployment)
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
   - `WEATHER_API_KEY`: Your OpenWeatherMap API key
4. Start the application:
   ```
   npm start
   ```
   or for development:
   ```
   npm run dev
   ```

## Deployment to Vercel

This application can be deployed to Vercel for free. Follow these steps:

1. Sign up for a free account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm install -g vercel`
3. Run `vercel` in the project directory
4. Follow the prompts to deploy

### Vercel Configuration

The project includes:
- `vercel.json`: Configuration for Vercel deployment
- `api/`: Serverless functions for CRUD operations
- File-based storage instead of MongoDB for Vercel compatibility

## API Endpoints

- `GET /api/weather` - Retrieve all weather data
- `GET /api/weather/:id` - Retrieve specific weather data by ID
- `POST /api/weather` - Create new weather data
- `PUT /api/weather/:id` - Update existing weather data
- `DELETE /api/weather/:id` - Delete weather data

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Data Storage: File-based JSON storage (Vercel compatible)
- Weather API: OpenWeatherMap

## Author

Shivam Kumar