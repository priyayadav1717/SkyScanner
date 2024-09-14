// app.js
const express = require('express');
const axios = require('axios');
const app = express();

// Set the view engine to EJS
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));

// Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Home route - displays the form
// Home route - displays the form
app.get('/', (req, res) => {
    res.render('index', { error: null });  // Pass error as null initially
});



// Result route - handles form submission and API request
// Result route - handles form submission and API request
app.post('/result', async (req, res) => {
    const city = req.body.city;
    const apiKey = '60cefbaaebc3a131e186699b62fc83e3';  // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        const forecast = response.data.list;
        
        // Extract weather data for tomorrow
        const tomorrowForecast = forecast.find(item => {
            const date = new Date(item.dt * 1000);
            return date.getDate() === new Date().getDate() + 1;
        });

        const weather = {
            city: response.data.city.name,
            condition: tomorrowForecast.weather[0].description,
            temp: tomorrowForecast.main.temp,
            willRain: tomorrowForecast.weather[0].main.toLowerCase().includes('rain')
        };

        res.render('result', { weather });
    } catch (error) {
        console.error(error);
        res.render('index', { error: 'Could not retrieve weather data. Please try again.' });
    }
});


// Start the server
const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
