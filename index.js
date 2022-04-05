// add code in here to create an API with ExpressJS
const express = require('express');
const app = express();

// import the dataset to be used here
const garments = require('./garments.json');

//middlewere to make public folder visible
app.use(express.static('public'));

// API routes to be added here
app.get('/api/garments', function (req, res) {

    const gender = req.query.gender;
	const season = req.query.season;

	const filteredGarments = garments.filter(garment => {
		// if both gender & season was supplied
		if (gender != 'All' && season != 'All') {
			return garment.gender === gender 
				&& garment.season === season;
		} else if(gender != 'All') { // if gender was supplied
			return garment.gender === gender
		} else if(season != 'All') { // if season was supplied
			return garment.season === season
		}
		return true;
	});

	// note that this route just send JSON data to the browser
	// there is no template
	res.json({ 
		garments : filteredGarments
	});

})
// added price route
app.get('/api/garments/price/:price', function(req, res){
	const maxPrice = Number(req.params.price);
	const filteredGarments = garments.filter( garment => {
		// filter only if the maxPrice is bigger than maxPrice
		if (maxPrice > 0) {
			return garment.price <= maxPrice;
		}
		return true;
	});

	res.json({ 
		garments : filteredGarments
	});
});


// app.get('/api/garments/price/:${price}', function(req, res){
//     res.json({price})
// })


const PORT = process.env.PORT || 4017;

app.listen(PORT, function () {
    console.log(`App started on port ${PORT}`)
});

// STAND-UP 
// Struggled with garments data ....I had installed express, and added 