const search = document.querySelector("input");
// Initialize ui
const ui = new UI();
let geocoder;

const DARKSKYAPIKEY = "a542b5ae979df6d58aab3d3e74f11164";

// google autocomplete
const autocomplete = new google.maps.places.Autocomplete(search);
google.maps.event.addDomListener(window, "load");

search.addEventListener("change", getCoords);

// Fetch user location weather
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(position => {
		const lat = position.coords.latitude;
		const lng = position.coords.longitude;

		getWeather(lat, lng);
		getCurrentLocation(lat, lng);
	});
}

// Get coordinates of searchbar input
function getCoords() {
	event.preventDefault();

	geocoder = new google.maps.Geocoder();

	if (search.value !== "") {
		geocoder.geocode({ address: search.value }, (result, status) => {
			if (status == "OK") {
				const lat = result[0].geometry.location.lat();
				const lng = result[0].geometry.location.lng();
				getCurrentLocation(lat, lng);

				return getWeather(lat, lng);
			} else {
				alert(
					"Geocode was not successful for the following reason: " + status
				);
			}
		});
	}
}

// Call weather API
async function getWeather(lat, lng) {
	try {
		let request = await fetch(
			`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${DARKSKYAPIKEY}/${lat},${lng}?units=si`
		);
		let data = await request.json();

		getSunState(data);
		ui.showCurrentWeather(data);
		ui.showForecast(data);
	} catch (err) {
		console.log(err);
	}
}

// Determine sun state, day returns 2, nigh returns 1 and evening returns 3
function getSunState(data) {
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

async function getCurrentLocation(lat, lng) {
	try {
		let request = await fetch(
			"https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
				lat +
				"," +
				lng +
				"&key=" +
				"AIzaSyCMdvEyuNCCRTedIBxZKUf9pnvlL7bgk-g"
		);

		let data = await request.json();

		ui.showCurrentLocation(data);
	} catch (err) {
		console.log(err);
	}
}
