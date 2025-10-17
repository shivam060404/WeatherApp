const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/weatherapp';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};

// Initial connection attempt
connectDB();

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Weather data schema
const weatherSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    country: String,
    temperature: Number,
    feelsLike: Number,
    humidity: Number,
    windSpeed: Number,
    description: String,
    icon: String,
    date: {
        type: Date,
        default: Date.now
    },
    dateRange: {
        startDate: Date,
        endDate: Date
    },
    forecast: [{
        date: Date,
        temperature: Number,
        description: String,
        icon: String
    }]
});

const Weather = mongoose.model('Weather', weatherSchema);

// Routes

// GET all weather data
app.get('/api/weather', async (req, res) => {
    try {
        const weatherData = await Weather.find().sort({ date: -1 });
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET weather by ID
app.get('/api/weather/:id', async (req, res) => {
    try {
        const weather = await Weather.findById(req.params.id);
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
        const weather = new Weather(req.body);
        await weather.save();
        res.status(201).json(weather);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT (update) weather data
app.put('/api/weather/:id', async (req, res) => {
    try {
        const weather = await Weather.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!weather) {
            return res.status(404).json({ error: 'Weather data not found' });
        }
        res.json(weather);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE weather data
app.delete('/api/weather/:id', async (req, res) => {
    try {
        const weather = await Weather.findByIdAndDelete(req.params.id);
        if (!weather) {
            return res.status(404).json({ error: 'Weather data not found' });
        }
        res.json({ message: 'Weather data deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});