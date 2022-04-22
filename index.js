// add code in here to create an API with ExpressJS
const express = require('express');

const app = express();

require('dotenv').config();

// import the dataset to be used here
const garments = require('./garments.json');

//middlewere to make public folder visible
app.use(express.static('public'));

// require jsonwebtoken below:
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const adminUser = { username: 'amandam2017' }
console.log(adminUser);
// add a login route below:
app.post('/api/login', function (req, res) {

	// get the username using ES6 constructor
	const { username } = req.body;
	// const username = req.body.username;

	if (username === adminUser.username) {

		const key = generateAccessToken(username);
		console.log(key);
		// below we are serialising the user
		//   const key = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

		res.json({ key })
	}
	else {
		res.json({
			message: 'User not allowed to login',
			status: 401
		})
	}


})

const authanticateToken = (req, res, next) => {
	// inside this function we want to get the token that is generated/sent to us and to verify if this is the correct user.
	const authHeader = req.headers['authorization']
	// console.log({authHeader});
	const token = authHeader && authHeader.split(" ")[1]
	// if theres no token tell me
	if (token === null) return res.sendStatus(401)
	// if there is then verify if its the correct user using id if not return the error
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		// console.log(err);
		if (err) return res.sendStatus(403)
		console.log('show error' + err);

		req.user = user
		console.log(user);
		next()
	})

}

const generateAccessToken = async (user) => {
	return await jwt.sign(user, 'secretKey', { expiresIn: '24h' });
}

// API routes to be added here
app.get('/api/posts', authanticateToken, function (req, res) {
	res.json({ garmants: garments })
})
// ADDED GARMENT which is the main route ---
app.get('/api/garments', function (req, res) {

	const gender = req.query.gender;
	const season = req.query.season;

	const filteredGarments = garments.filter(garment => {
		// if both gender & season was supplied
		if (gender != 'All' && season != 'All') {
			return garment.gender === gender
				&& garment.season === season;
		} else if (gender != 'All') { // if gender was supplied
			return garment.gender === gender
		} else if (season != 'All') { // if season was supplied
			return garment.season === season
		}
		return true;
	});

	// note that this route just send JSON data to the browser
	// there is no template
	res.json({
		garments: filteredGarments
	});

})
// ADDED A PRICE ROUTE ---
app.get('/api/garments/price/:price', function (req, res) {
	const maxPrice = Number(req.params.price);
	const filteredGarments = garments.filter(garment => {
		// filter only if the maxPrice is bigger than maxPrice
		if (maxPrice > 0) {
			return garment.price <= maxPrice;
		}
		return true;
	});

	res.json({
		garments: filteredGarments
	});
});

// ADDED a POST ROUTE----
app.post('/api/garments', (req, res) => {

	// get the fields send in from req.body
	const {
		description,
		img,
		gender,
		season,
		price
	} = req.body;

	// add some validation to see if all the fields are there.
	// only 3 fields are made mandatory here
	// you can change that

	if (!description || !img || !price) {
		res.json({
			status: 'error',
			message: 'Required data not supplied',
		});
	} else {

		// you can check for duplicates here using garments.find

		// add a new entry into the garments list
		garments.push({
			description,
			img,
			gender,
			season,
			price
		});

		res.json({
			status: 'success',
			message: 'New garment added.',
		});
	}

});


const PORT = process.env.PORT || 4017;

app.listen(PORT, function () {
	console.log(`App started on port ${PORT}`)
});