const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple file-based storage
const DB_FILE = './weather-data.json';

// Initialize database file if it doesn't exist
async function initDatabase() {
    try {
        await fs.access(DB_FILE);
    } catch (error) {
        // File doesn't exist, create it with empty array
        await fs.writeFile(DB_FILE, JSON.stringify([]));
    }
}

// Read data from file
async function readData() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Write data to file
async function writeData(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// Routes

// GET all weather data
app.get('/api/weather', async (req, res) => {
    try {
        const weatherData = await readData();
        // Sort by date descending
        weatherData.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET weather by ID
app.get('/api/weather/:id', async (req, res) => {
    try {
        const weatherData = await readData();
        const weather = weatherData.find(item => item._id === req.params.id);
        if (!weather) {
            return res.status(404).json({ error: 'Weather data not found' });
        }
        res.json(weather);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST new weather data
app.post('/api/weather', async (req, res) => {
    try {
        const weatherData = await readData();
        const newWeather = {
            _id: uuidv4(),
            ...req.body,
            date: new Date()
        };
        weatherData.push(newWeather);
        await writeData(weatherData);
        res.status(201).json(newWeather);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT (update) weather data
app.put('/api/weather/:id', async (req, res) => {
    try {
        const weatherData = await readData();
        const index = weatherData.findIndex(item => item._id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Weather data not found' });
        }
        
        weatherData[index] = {
            ...weatherData[index],
            ...req.body,
            _id: req.params.id // Preserve the original ID
        };
        
        await writeData(weatherData);
        res.json(weatherData[index]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE weather data
app.delete('/api/weather/:id', async (req, res) => {
    try {
        const weatherData = await readData();
        const index = weatherData.findIndex(item => item._id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Weather data not found' });
        }
        
        const deletedItem = weatherData.splice(index, 1)[0];
        await writeData(weatherData);
        res.json({ message: 'Weather data deleted successfully', deletedItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize database
initDatabase().catch(error => {
    console.error('Failed to initialize database:', error);
});

// Vercel requires us to export the app
module.exports = app;