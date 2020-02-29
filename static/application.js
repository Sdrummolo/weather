const search = document.querySelector("input");
// initialize google autocomplete
const autocomplete = new google.maps.places.Autocomplete(search);
// Initialize ui
const ui = new UI();
// API keys
const DARKSKYAPIKEY = "a542b5ae979df6d58aab3d3e74f11164";
const GOOGLEAPIKEY = "AIzaSyCMdvEyuNCCRTedIBxZKUf9pnvlL7bgk-g";

// Google proprietary event handler
autocomplete.addListener("place_changed", getCoords);

// Fetch user location weather
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(position => {
		const lat = position.coords.latitude;
		const lng = position.coords.longitude;

		getWeather(lat, lng);
	});
}

// Get coordinates of searchbar input
async function getCoords() {
	let address = search.value;
	console.log(address);

	if (address != "") {
		try {
			let coordsRequest = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLEAPIKEY}`
			);
			let coordsData = await coordsRequest.json();

			let lat = coordsData.results[0].geometry.location.lat;
			let lng = coordsData.results[0].geometry.location.lng;

			getWeather(lat, lng);
		} catch (err) {
			console.log(err);
		}
	}
}

// Call weather API
async function getWeather(lat, lng) {
	// Fetch user's location data
	try {
		let locationRequest = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLEAPIKEY}`
		);
		// Fetch weather data
		let weatherRequest = await fetch(
			`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${DARKSKYAPIKEY}/${lat},${lng}?units=si`
		);

		let locationData = await locationRequest.json();
		let weatherData = await weatherRequest.json();

		changeBG(weatherData);
		ui.showCurrentLocation(locationData);
		ui.showCurrentWeather(weatherData);
		ui.showForecast(weatherData);
	} catch (err) {
		console.log(err);
	}
}

// Determine sun state, day returns 2, nigh returns 1 and evening returns 3
function changeBG(data) {
	const currentTime = data.currently.time;
	const sunriseTime = data.daily.data[0].sunriseTime;
	const sunriseTimeTom = data.daily.data[1].sunriseTime;
	const sunsetTime = data.daily.data[0].sunsetTime;

	if (
		currentTime >= sunriseTime &&
		sunsetTime - currentTime <= 3600 &&
		sunsetTime - currentTime > 0
	) {
		return ui.changeBgColor(3);
	} else if (currentTime >= sunriseTime && sunsetTime - currentTime > 3600) {
		return ui.changeBgColor(1);
	} else if (
		sunriseTimeTom - currentTime <= 3600 &&
		sunriseTimeTom - currentTime > 0
	) {
		return ui.changeBgColor(3);
	} else {
		return ui.changeBgColor(2);
	}
}
