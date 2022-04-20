let seasonFilter = 'All';
let genderFilter = 'All';

const seasonOptions = document.querySelector('.seasons');
const genderOptions = document.querySelector('.genders');
const searchResultsElem = document.querySelector('.searchResults');
const priceRangeElem = document.querySelector('.priceRange');
const showPriceRangeElem = document.querySelector('.showPriceRange');
const snackbarElem = document.querySelector('.snackbar');
const userInputElem = document.querySelector('.userInput');
const loginbtnElem = document.querySelector('.loginbtn');

const garmentsTemplateText = document.querySelector('.garmentListTemplate');
const garmentsTemplate = Handlebars.compile(garmentsTemplateText.innerHTML);
  
const showSnackBar = ()=>{
	const snackbarElem = document.getElementById('snackbar');
	snackbarElem.className = 'show';
	setTimeout(function(){ snackbarElem.className = snackbarElem.className.replace("show", ""); }, 3000);
}

seasonOptions.addEventListener('click', function(evt){
	seasonFilter = evt.target.value;
	filterData();
});

genderOptions.addEventListener('click', function(evt){
	genderFilter = evt.target.value;
	filterData();
});

// event lister for a button
loginbtnElem.addEventListener('click', function(){
	let username = userInputElem.value
	console.log(username);
	loginRoute();
})

// local storage
let storedTokens = []
if(localStorage['userToken']){
    storedTokens = JSON.parse(localStorage.getItem('userToken'));
}

const loginRoute = ()=>{
	axios.get(`http://localhost:4017/api/login`).then(function(result){
		console.log(result.data);
		username = result.data

		console.log(username);

		localStorage.setItem('myTokens', JSON.stringify(username));

	})
}

const securedPosts = ()=>{
	axios.get(`http://localhost:4017/api/posts`, {
		
	}).then(function(result){
		searchResultsElem.innerHTML = garmentsTemplate({
			garments: result.data.garments
		})
	})
}

securedPosts();

// garments end point
const garmentsList =()=>{
	axios.get('http://localhost:4017/api/garments').then(function(result){
		console.log(result.data);
		searchResultsElem.innerHTML = garmentsTemplate({
			garments: result.data.garments
		})
	})
}

garmentsList();

// /api/garments/price/:price ----end point
const priceEndpoint = ()=>{
	axios.get('http://localhost:4017/api/garments/price/:price').then(function(result){
		console.log(result.data);
		searchResultsElem.innerHTML = garmentsTemplate({
			garments: result.data.garments,
		})
		
	})
}

priceEndpoint();

function filterData() {
	axios
		.get(`/api/garments?gender=${genderFilter}&season=${seasonFilter}`)
		.then(function(result) {
			searchResultsElem.innerHTML = garmentsTemplate({
				garments : result.data.garments
			})
		});
}

priceRangeElem.addEventListener('change', function(evt){
	const maxPrice = evt.target.value;
	showPriceRangeElem.innerHTML = maxPrice;
	axios
		.get(`/api/garments/price/${maxPrice}`)
		.then(function(result) {
			searchResultsElem.innerHTML = garmentsTemplate({
				garments : result.data.garments
			})
		});
});

filterData();
