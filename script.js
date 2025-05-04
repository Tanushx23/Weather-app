const cityInput=document.querySelector('.input-city');
const searchbtn=document.querySelector('.search-btn');
const notFoundSection=document.querySelector('.not-found');
const searchCitySection=document.querySelector('.search-city');
const weatherInfoSection=document.querySelector('.weather-info');
const countrytext=document.querySelector('.country-text');
const temptext=document.querySelector('.temp-text');
const conditiontext=document.querySelector('.condition-text');
const humiditytext=document.querySelector('.humidity-value-text');
const windtext=document.querySelector('.wind-value-text');
const weatherSummaryImg=document.querySelector('.weather-summary');
const datetext=document.querySelector('.current-date-text');
const forecastContainerData=document.querySelector('.forecast-items-container');
const apiKey='9693706697ac077feb0fadb77ea57d1f'

searchbtn.addEventListener('click',()=>{
	if(cityInput.value.trim()!=''){
		updateWeatherinfo(cityInput.value);
		cityInput.value='';
		cityInput.blur();
	}
});

cityInput.addEventListener('keydown',(event)=>{
	if(event.key=='Enter' && cityInput.value.trim()!=''){
		updateWeatherinfo(cityInput.value);
		cityInput.value='';
		cityInput.blur();
	}
});

function getWeatherIcon(id){
	if (id <= 232) return 'thunderstorm.svg'
	if (id <= 321) return 'drizzles.svg'
	if (id <= 531) return 'rain.svg'
	if (id <= 622) return 'snow.svg'
	if (id <= 781) return 'atmosphere.svg'
	if (id <= 800) return 'clear.svg'

	else return 'clouds.svg';
}

function getCurrentdate(){
	const date=new Date();
	const options={
		weekday: 'short',
		day: '2-digit',
		month: 'short'
	}

		return date.toLocaleDateString('en-GB',options);
	
}

async function getfetchdata(endPoint,city){
	const apiurl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
	const response = await fetch(apiurl);
	return response.json();

}
async function updateWeatherinfo(city){
	const weatherData=await getfetchdata('weather',city);
	if(weatherData.cod!=200){
		showDisplaysection(notFoundSection);
		return;
	}

	const {
		name: country,
		main: {temp,humidity},
		weather: [{id,main}],
		wind: {speed}
	} = weatherData

	countrytext.textContent=country;
	temptext.textContent=Math.round(temp) + '°C';
	humiditytext.textContent=humidity + '%';
	conditiontext.textContent=main;
	windtext.textContent=speed + 'm/s';
	weatherSummaryImg.src= `assets/weather/${getWeatherIcon(id)}`;
	datetext.textContent= getCurrentdate();

	await Updateforecast(city);

	showDisplaysection(weatherInfoSection);
}

async function  Updateforecast(city){
	const forecastData= await getfetchdata('forecast',city);
	const timeTaken='12:00:00';
	const todayDate=new Date().toISOString().split('T')[0];
	forecastContainerData.innerHTML='';
	forecastData.list.forEach((forecastWeather) => {
	if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
		updateForecastItems(forecastWeather);
	}
});
}

function updateForecastItems(weatherData){
	const {
		dt_txt: date,
		weather: [{id}],
		main: {temp}
	}=weatherData

	const dateTaken=new Date(date);
	const dateOption = {
		day: '2-digit',
		month: 'short'
	}

	const resultdate=dateTaken.toLocaleDateString('en-US',dateOption);

	const forecastItem=`
				<div class="forecast-item">
          <h5 class="forecast-item-date regular-text">${resultdate}</h5>
          <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
          <h5 class="forecast-item-temp">
          ${Math.round(temp)} °C</h5>
        </div>`


				forecastContainerData.insertAdjacentHTML('beforeend',forecastItem);
}



function showDisplaysection(section){
	[notFoundSection,weatherInfoSection,searchCitySection].forEach(
		section => section.style.display = 'none')
		section.style.display= 'flex';
}

