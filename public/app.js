let seasonFilter = 'All';
let genderFilter = 'All';

const seasonOptions = document.querySelector('.seasons');
const genderOptions = document.querySelector('.genders');
const searchResultsElem = document.querySelector('.searchResults');
const priceRangeElem = document.querySelector('.priceRange');
const showPriceRangeElem = document.querySelector('.showPriceRange');

const garmentsTemplateText = document.querySelector('.garmentListTemplate');
const garmentsTemplate = Handlebars.compile(garmentsTemplateText.innerHTML);

seasonOptions.addEventListener('click', function(evt){
	seasonFilter = evt.target.value;
	filterData();
});

genderOptions.addEventListener('click', function(evt){
	genderFilter = evt.target.value;
	filterData();
});

// const garmentsList = async(req, res)=>{
// 	axios.get('http://localhost:4017/api/garments').then(function(results){
// 		console.log(results.data);

// 		res.render('index', {
// 			garmentsTemplate: garments
// 		})

// 		// res.json({garments});
// 	})
// }
// garmentsList(); 

const garmentsList =()=>{
	axios.get('http://localhost:4017/api/garments').then(function(result){
		console.log(result.data);
		garmentsTemplate(result.data.garments);	
	})
}

garmentsList();

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