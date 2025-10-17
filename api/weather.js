const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

// Simple file-based storage
const DB_FILE = '../weather-data.json';

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

// Initialize database
initDatabase().catch(error => {
    console.error('Failed to initialize database:', error);
});

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
            if (id) {
                // Get specific weather data
                try {
                    const weatherData = await readData();
                    const weather = weatherData.find(item => item._id === id);
                    if (!weather) {
                        return res.status(404).json({ error: 'Weather data not found' });
                    }
                    res.status(200).json(weather);
                } catch (error) {
                    res.status(500).json({ error: error.message });
                }
            } else {
                // Get all weather data
                try {
                    const weatherData = await readData();
                    // Sort by date descending
                    weatherData.sort((a, b) => new Date(b.date) - new Date(a.date));
                    res.status(200).json(weatherData);
                } catch (error) {
                    res.status(500).json({ error: error.message });
                }
            }
            break;

        case 'POST':
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
            break;

        case 'PUT':
            try {
                const weatherData = await readData();
                const index = weatherData.findIndex(item => item._id === id);
                if (index === -1) {
                    return res.status(404).json({ error: 'Weather data not found' });
                }
                
                weatherData[index] = {
                    ...weatherData[index],
                    ...req.body,
                    _id: id // Preserve the original ID
                };
                
                await writeData(weatherData);
                res.status(200).json(weatherData[index]);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
            break;

        case 'DELETE':
            try {
                const weatherData = await readData();
                const index = weatherData.findIndex(item => item._id === id);
                if (index === -1) {
                    return res.status(404).json({ error: 'Weather data not found' });
                }
                
                const deletedItem = weatherData.splice(index, 1)[0];
                await writeData(weatherData);
                res.status(200).json({ message: 'Weather data deleted successfully', deletedItem });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}