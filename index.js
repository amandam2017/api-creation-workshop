// add code in here to create an API with ExpressJS
const express = require('express');
const app = express();

// import the dataset to be used here
const garments = require('./garments.json');

//middlewere to make public folder visible
app.use(express.static('public'));

// API routes to be added here
app.get('/api/garments', function (req, res) {

    res.json({ garments });

})

app.get('/api/garments/price/:price', function (req, res){
    res.json(garments.price)
})

app.get('/api/garments/price/:${price}', function(req, res){
    res.json({price})
})


const PORT = process.env.PORT || 4017;

app.listen(PORT, function () {
    console.log(`App started on port ${PORT}`)
});

// STAND-UP 
// Struggled with garments data ....I had installed express, and added 