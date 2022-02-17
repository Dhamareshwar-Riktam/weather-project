const express = require('express');
const app = express();
const https = require('https');


const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
    const city = req.body.cityName;
    const url = `https://api.weatherapi.com/v1/current.json?key=6c0215125f324f68aa241611221602&q=${city}&aqi=no`;
    https.get(url, response => {
        if (response.statusCode === 200) {
            response.on('data', data => {
                const weatherData = JSON.parse(data);
                res.write(`<h1>${weatherData.location.name}, ${weatherData.location.region}</h1>`);
                res.write(`<h2>${weatherData.current.condition.text}`)
                res.write(`<img src="https:${weatherData.current.condition.icon}">`)
                res.write(`<h3>${weatherData.current.temp_c}&deg;C</h3>`)
                res.send();
            })
        } else {
            response.on('data', data => {
                const errorData = JSON.parse(data);
                res.send(`<h1>${errorData.error.message}</h1>`);
            })
        }
    })
});



app.listen(PORT, () => console.log(`Server running @${PORT}`));

