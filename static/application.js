const search = document.getElementById("search");
// Initialize ui
const ui = new UI();
let geocoder;

// To put in env variable
const DARKSKYAPIKEY = "a542b5ae979df6d58aab3d3e74f11164";

// google autocomplete stuff
const autocomplete = new google.maps.places.Autocomplete(search);
google.maps.event.addDomListener(window, "load");

search.addEventListener("change", getCoords);

function getCoords() {
	event.preventDefault();

	geocoder = new google.maps.Geocoder();

	if (search.value !== "") {
		geocoder.geocode({ address: search.value }, (result, status) => {
			if (status == "OK") {
				const lat = result[0].geometry.location.lat();
				const lng = result[0].geometry.location.lng();

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
// Time changes according to timezone
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
