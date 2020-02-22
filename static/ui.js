class UI {
	constructor() {
		this.search = document.getElementById("search");
		this.temperature = document.getElementById("temperature");
		this.conditions = document.getElementById("conditions");
		this.humidity = document.getElementById("humidity");
		this.wind = document.getElementById("wind");
		this.location = document.getElementById("location");
		this.showcaseTop = document.getElementById("showcase-top");
		this.day1 = document.getElementById("day-1");
		this.day2 = document.getElementById("day-2");
		this.day3 = document.getElementById("day-3");
		this.day4 = document.getElementById("day-4");
		this.day5 = document.getElementById("day-5");
	}

	// Populate top part of UI with data
	showCurrentWeather(data) {
		console.log(data);
		this.temperature.textContent = `${Math.round(
			data.currently.temperature
		)}°`;
		this.conditions.textContent = data.currently.summary;
		this.humidity.innerHTML = `
      <p>Humidity</p>
      <h4>${data.currently.humidity * 100}%</h4>
      `;
		this.wind.innerHTML = `
      <p>Wind</p>
      <h4>${Math.round(data.currently.windSpeed)} Km/h</h4>
      `;
		this.location.textContent = this.search.value;

		// Show icon
		const icon = new Skycons({ color: "#fff" });
		icon.set("icon-main", data.currently.icon);
		icon.play();
	}

	// Takes an integer (1 for day, 2 for night, 3 for others) and changes bgcolor accordingly
	changeBgColor(phase) {
		if (phase === 1) {
			this.showcaseTop.style.background = `linear-gradient(
            180deg,
            rgba(2, 0, 36, 1) 0%,
            rgba(102, 204, 253, 1) 0%,
            rgba(143, 214, 246, 1) 100%
         )`;
		} else if (phase === 2) {
			this.showcaseTop.style.background = `linear-gradient(
            180deg, rgba(2,0,36,1) 0%, 
            rgba(71,32,151,1) 0%, 
            rgba(183,90,186,1) 100%
            )`;
		} else if (phase === 3) {
			this.showcaseTop.style.background = `linear-gradient(
            180deg, rgba(2,0,36,1) 0%, 
            rgba(211,97,133,1) 0%, 
            rgba(249,208,103,1) 100%
            )`;
		}
	}

	showForecast(data) {
		let dates = [];
		let icons = [];
		let days = [this.day1, this.day2, this.day3, this.day4, this.day5];

		// Populate arrays
		for (let i = 0; i < 6; i++) {
			dates[i] = new Date(data.daily.data[i + 1].time * 1000);
			icons[i] = new Skycons({ color: "#495057" });
		}

		// Populate forecast
		for (let [i, day] of days.entries()) {
			day.innerHTML = `
			<h3>${dates[i]
				.toDateString()
				.split(" ")[0]
				.toUpperCase()}</h3>
				<canvas id="icon-${i + 1}" width="50" height="50"></canvas>
				<h3>${Math.round(data.daily.data[i + 1].temperatureHigh)}°</h3
			`;
			icons[i].set(`icon-${i + 1}`, data.daily.data[i + 1].icon);
			icons[i].play();
		}
	}
}
