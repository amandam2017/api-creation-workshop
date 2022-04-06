let seasonFilter = 'All';
let genderFilter = 'All';

const seasonOptions = document.querySelector('.seasons');
const genderOptions = document.querySelector('.genders');
const searchResultsElem = document.querySelector('.searchResults');
const priceRangeElem = document.querySelector('.priceRange');
const showPriceRangeElem = document.querySelector('.showPriceRange');

const garmentsTemplateText = document.querySelector('.garmentListTemplate');
const garmentsTemplate = Handlebars.compile(garmentsTemplateText.innerHTML);

// fields to be read from the DOM
const domFields = {
		"description": "Rainbow unicorn sweater",
		"price": 799.00,
		"img" : "placeholder.png",
		"gender" : "Unisex",
		"season" : "All season"
  };
  
  axios.post('/api/garments', domFields)
	.then((result) => {
		// show snackbar - with success message
		console.log(result.data);
	})
	.catch(err => {
	  console.log(err);
	});
  

seasonOptions.addEventListener('click', function(evt){
	seasonFilter = evt.target.value;
	filterData();
});

genderOptions.addEventListener('click', function(evt){
	genderFilter = evt.target.value;
	filterData();
});

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
