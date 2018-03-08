/* eslint-disable semi */
// import preact
import {h, render, Component} from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
import style_iphone1 from '../WeeklyButton/style_iphone1';
import style_iphone3 from '../HourlyButton/style_iphone3';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';
import WeeklyButton from '../WeeklyButton';
import HourlyButton from '../HourlyButton';
import _ from 'lodash';
import LocationChooser from "../LocationChooser";

var DUMMY_WEEKLY_PATH = './assets/dummy_data/weekly.json'
var DUMMY_HOURLY_PATH = './assets/dummy_data/hourly.json'
var USE_DUMMY_DATA = false

export default class Iphone extends Component {

	// a constructor with initial set states
	constructor(props) {
		super(props);
		// temperature state
		this.state.temp = "";
		this.state.data = {weekly: null, hourly: null}; // initialise data
		this.state.selectedCity = 'London';
		this.state.apiKey = '9436449a823b2d05';
		this.state.locationChooserVisible = false;
		// button display state
		this.setState({display: true})
	}

	fetchJson(url) {
		console.log('[fetchJson] url=' + url)
		return new Promise((resolve, reject) => {
			$.ajax({
				url: url,
				dataType: "jsonp",
				success: resolve,
				error: reject
			})
		})
	}

	get urls(){
		return {
			hourly: `http://api.wunderground.com/api/${this.state.apiKey}/hourly/q/UK/${this.state.selectedCity}.json`,
			hourly10day: `http://api.wunderground.com/api/${this.state.apiKey}/hourly10day/q/UK/${this.state.selectedCity}.json`,
			conditions: `http://api.wunderground.com/api/${this.state.apiKey}/conditions/q/UK/${this.state.selectedCity}.json`
		}
	}

	componentDidMount() {
		let fetchPromise
		if(USE_DUMMY_DATA){
			fetchPromise = Promise.all([this.fetchJson(DUMMY_HOURLY_PATH), this.fetchJson(DUMMY_WEEKLY_PATH)])
				.then(([hourlyData, weeklyData]) => {
					this.setState({data: {weekly: weeklyData, hourly: hourlyData}})

					console.log('data fetched:', this.state)
				})
				.catch((error)=>{
					console.log('error loading dummy data', error)
				})
		}else{
			fetchPromise = Promise.resolve()
		}
		fetchPromise.then(() => {
				this.updateWeatherAll()
			})
	}

	updateWeatherAll(){
		for(let readingType of Object.getOwnPropertyNames(this.urls)){
			this.updateWeather(readingType)
		}
	}

	updateWeather(readingType){
		let url = this.urls[readingType]

		let newState = {}
		let callback

		switch (readingType){
			case 'hourly':
				callback = this.parseResponseHourly
				newState.display2 = false
				break;
			case 'hourly10day':
				callback = this.parseResponseWeekly
				newState.display1 = false
				break;
			case 'conditions':
				callback = this.parseResponseConditions
				newState.display = false
				break;
			default:
				throw 'Invalid weather reading ' + readingType
		}

		return this.fetchJson(url)
			.then(response => {
				if (_.isArray(response.response.results)) {

					let queryLocation = _.first(response.response.results).l
					let queryIndex = url.indexOf('/q/')
					let newUrl = `${url.slice(0, queryIndex)}${queryLocation}.json`
					let numberOfResults = response.response.results.length

					console.warn(`[updateWeather] city "${this.state.selectedCity}" is ambiguous and returned ${numberOfResults} results; defaulting to first result: `, newUrl)
					return this.fetchJson(newUrl)
				} else {
					return response
				}
			})
			.then(callback)
			.then(() => this.setState(newState))
		}

	get weatherReadingTypes() {
		return Object.keys(this.urls)
	}

	// tells the browser to stay on the same page
	onSearch(event) {
		this.setState({locationChooserVisible: false});
		event.preventDefault() //a form has the behavior to take you on new page - prevents it

		let currentSelectedCity = this.state.selectedCity
		let city = document.querySelector('#searchInput').value
		this.setState({selectedCity: city})

		let readingsUpdated = _.forEach(this.weatherReadingTypes, (readingType) => this.updateWeather(readingType))

		return Promise.all(readingsUpdated)
			.catch((error) => {
				console.log(`[onSearch] error updating city to ${this.state.selectedCity}:`, error)
				this.setState({selectedCity: currentSelectedCity}) // revert the change to city state if an error occured
			})
	}

	onAddLocation(event){
		console.log('add location')
		this.setState({locationChooserVisible: true});
	}

	// the main render method for the iphone component
	render() {
		// check if data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
		const feelStyles = this.state.feel ? `${style.filled1} ${style.right1} ${style.filled2}` : style.right1;
		const temp1Styles = this.state.tmp1 ? `${style.temp1} ${style.filled2}` : style.temp1;
		const temp2Styles = this.state.tmp2 ? `${style.temp2} ${style.filled2}` : style.temp2;
		const temp3Styles = this.state.tmp3 ? `${style.temp3} ${style.filled2}` : style.temp3;
		const temp4Styles = this.state.tmp4 ? `${style.temp4} ${style.filled2}` : style.temp4;
		const temp5Styles = this.state.tmp5 ? `${style.temp5} ${style.filled2}` : style.temp5;
		const temp6Styles = this.state.tmp6 ? `${style.temp6} ${style.filled2}` : style.temp6;
		const htemp1Styles = this.state.hrtemp1 ? `${style.htemp1} ${style.filled2}` : style.htemp1;
		const htemp2Styles = this.state.hrtemp2 ? `${style.htemp2} ${style.filled2}` : style.htemp2;
		const htemp3Styles = this.state.hrtemp3 ? `${style.htemp3} ${style.filled2}` : style.htemp3;
		const htemp4Styles = this.state.hrtemp4 ? `${style.htemp4} ${style.filled2}` : style.htemp4;
		const htemp5Styles = this.state.hrtemp5 ? `${style.htemp5} ${style.filled2}` : style.htemp5;
		const htemp6Styles = this.state.hrtemp6 ? `${style.htemp6} ${style.filled2}` : style.htemp6;

		// adds images for the current weather
		var ic = "https://icons.wxug.com/i/c/k/" + this.state.icon1 + ".gif";
		var ic1 = "https://icons.wxug.com/i/c/k/" + this.state.icA1 + ".gif";
		var ic2 = "https://icons.wxug.com/i/c/k/" + this.state.icA2 + ".gif";
		var ic3 = "https://icons.wxug.com/i/c/k/" + this.state.icA3 + ".gif";
		var ic4 = "https://icons.wxug.com/i/c/k/" + this.state.icA4 + ".gif";
		var ic5 = "https://icons.wxug.com/i/c/k/" + this.state.icA5 + ".gif";
		var ic6 = "https://icons.wxug.com/i/c/k/" + this.state.icA6 + ".gif";

		var ic01 = "https://icons.wxug.com/i/c/k/" + this.state.icB1 + ".gif";
		var ic02 = "https://icons.wxug.com/i/c/k/" + this.state.icB2 + ".gif";
		var ic03 = "https://icons.wxug.com/i/c/k/" + this.state.icB3 + ".gif";
		var ic04 = "https://icons.wxug.com/i/c/k/" + this.state.icB4 + ".gif";
		var ic05 = "https://icons.wxug.com/i/c/k/" + this.state.icB5 + ".gif";
		var ic06 = "https://icons.wxug.com/i/c/k/" + this.state.icB6 + ".gif";

		console.log("VAR: " + this.state.locationChooserVisible);
		// display all weather data
		// if a location has been entered in locationChooserVisible then the weather data will print, if not then the search bar appears
		return (
			<div class={ style.container }>
			{ !(this.state.locationChooserVisible) ?
				<div>
				<div class={ style.header }> UniSky
					<div class={ style.city }>{ this.state.locate }</div>
					<div class={ style.conditions }>{ this.state.cond }</div>
					<div class={ style.hour }>{ this.state.hourly }</div>
					<span class={ tempStyles }>{ this.state.temp }</span>
					<span class={ feelStyles }>{ this.state.feel }</span>
					<span class={ temp1Styles }>{ this.state.tmp1 }</span>
					<span class={ temp2Styles }>{ this.state.tmp2 }</span>
					<span class={ temp3Styles }>{ this.state.tmp3 }</span>
					<span class={ temp4Styles }>{ this.state.tmp4 }</span>
					<span class={ temp5Styles }>{ this.state.tmp5 }</span>
					<span class={ temp6Styles }>{ this.state.tmp6 }</span>
					<span class={ htemp1Styles }>{ this.state.hrtemp1}</span>
					<span class={ htemp2Styles }>{ this.state.hrtemp2}</span>
					<span class={ htemp3Styles }>{ this.state.hrtemp3}</span>
					<span class={ htemp4Styles }>{ this.state.hrtemp4}</span>
					<span class={ htemp5Styles }>{ this.state.hrtemp5}</span>
					<span class={ htemp6Styles }>{ this.state.hrtemp6}</span>
					<div class={style.icon}><img src={ic} alt={this.state.icon1}></img></div>
					<div class= {style.iconA1}><img src={ic1} alt={this.state.icA1}></img></div>
					<div class= {style.iconA2}><img src={ic2} alt={this.state.icA2}></img></div>
					<div class= {style.iconA3}><img src={ic3} alt={this.state.icA3}></img></div>
					<div class= {style.iconA4}><img src={ic4} alt={this.state.icA4}></img></div>
					<div class= {style.iconA5}><img src={ic5} alt={this.state.icA5}></img></div>
					<div class= {style.iconA6}><img src={ic5} alt={this.state.icA6}></img></div>

					<div class= {style.iconB1}><img src={ic01} alt={this.state.icB1}></img></div>
					<div class= {style.iconB2}><img src={ic02} alt={this.state.icB2}></img></div>
					<div class= {style.iconB3}><img src={ic03} alt={this.state.icB3}></img></div>
					<div class= {style.iconB4}><img src={ic04} alt={this.state.icB4}></img></div>
					<div class= {style.iconB5}><img src={ic05} alt={this.state.icB5}></img></div>
					<div class= {style.iconB6}><img src={ic06} alt={this.state.icB6}></img></div>
					<div class={ style.day1 }>{ this.state.dy1 }</div>
					<div class={ style.day2 }>{ this.state.dy2 }</div>
					<div class={ style.day3 }>{ this.state.dy3 }</div>
					<div class={ style.day4 }>{ this.state.dy4 }</div>
					<div class={ style.day5 }>{ this.state.dy5 }</div>
					<div class={ style.day6 }>{ this.state.dy6 }</div>
					<div class={ style.hour1 }>{ this.state.hr1 }</div>
					<div class={ style.hour2 }>{ this.state.hr2 }</div>
					<div class={ style.hour3 }>{ this.state.hr3 }</div>
					<div class={ style.hour4 }>{ this.state.hr4 }</div>
					<div class={ style.hour5 }>{ this.state.hr5 }</div>
					<div class={ style.hour6 }>{ this.state.hr6 }</div>
					<div class={ style.hline }></div>
					<div class={ style.hline1 }></div>
					<div class={ style.hline2 }></div>

					<div>
						<button class={ style['btn-add-location'] } onclick={this.onAddLocation.bind(this)}>
							<img src="https://png.icons8.com/ios/50/000000/plus.png" />
						</button>
					</div>

				</div>
				<div class={ style.details }></div>
				<div class={ style_iphone.container }>
					{ this.state.display ?
						<Button class={ style_iphone.button } clickFunction={ this.fetchWeatherData }/> : null }
				</div>
				<div class={ style_iphone1.container1 }>
					{ this.state.display1 ?
						<WeeklyButton class={ style_iphone1.WeeklyButton} clickFunction={ () => this.updateWeather('weekly') }/> : null }
				</div>
				<div class={ style_iphone3.container3 }>
					{ this.state.display2 ?
						<HourlyButton class={ style_iphone3.HourlyButton} clickFunction={ () => this.updateWeather('hourly') }/> : null }
				</div>
				</div>
				:
				<div>
				<form onsubmit={this.onSearch.bind(this)}>
					<input id="searchInput" type="text" size="50" value={this.state.selectedCity} placeholder="Search City" required></input>
					<button onclick>Search</button>
				</form>
				</div>
 			}
			</div>
		);
	}

	parseResponseConditions = (parsed_json) => {
		var location = parsed_json['current_observation']['display_location']['city'];
		var temp_c = parsed_json['current_observation']['temp_c'];
		var conditions = parsed_json['current_observation']['weather'];
		var feelslike_c = parsed_json['current_observation']['feelslike_c'];
		var icon = parsed_json['current_observation']['icon'];

		console.log('Icon:', icon)

		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c,
			cond: conditions,
			feel: feelslike_c,
			icon1: icon
		});
	}

	parseResponseWeekly = (parsed_json1) => {
			var day1 = parsed_json1['hourly_forecast'][24]['FCTTIME']['weekday_name_abbrev'];
			var temp1 = parsed_json1['hourly_forecast'][24]['temp'].metric;
			var iconA1 = parsed_json1['hourly_forecast'][24]['icon'];
			var day2 = parsed_json1['hourly_forecast'][48]['FCTTIME']['weekday_name_abbrev'];
			var temp2 = parsed_json1['hourly_forecast'][48]['temp'].metric;
			var iconA2 = parsed_json1['hourly_forecast'][48]['icon'];
			var day3 = parsed_json1['hourly_forecast'][72]['FCTTIME']['weekday_name_abbrev'];
			var temp3 = parsed_json1['hourly_forecast'][72]['temp'].metric;
			var iconA3 = parsed_json1['hourly_forecast'][72]['icon'];
			var day4 = parsed_json1['hourly_forecast'][96]['FCTTIME']['weekday_name_abbrev'];
			var temp4 = parsed_json1['hourly_forecast'][96]['temp'].metric;
			var iconA4 = parsed_json1['hourly_forecast'][96]['icon'];
			var day5 = parsed_json1['hourly_forecast'][120]['FCTTIME']['weekday_name_abbrev'];
			var temp5 = parsed_json1['hourly_forecast'][120]['temp'].metric;
			var iconA5 = parsed_json1['hourly_forecast'][120]['icon'];
			var day6 = parsed_json1['hourly_forecast'][144]['FCTTIME']['weekday_name_abbrev'];
			var temp6 = parsed_json1['hourly_forecast'][144]['temp'].metric;
			var iconA6 = parsed_json1['hourly_forecast'][144]['icon'];

			this.setState({
				dy1 : day1,
				tmp1 : temp1,
				icA1 : iconA1,
				dy2 : day2,
				tmp2 : temp2,
				icA2 : iconA2,
				dy3 : day3,
				tmp3 : temp3,
				icA3 : iconA3,
				dy4 : day4,
				tmp4 : temp4,
				icA4 : iconA4,
				dy5 : day5,
				tmp5 : temp5,
				icA5 : iconA5,
				dy6 : day6,
				tmp6 : temp6,
				icA6 : iconA6,
			});
		}

	parseResponseHourly = (parsed_json2) => {
		var hour1 = parsed_json2['hourly_forecast'][0]['FCTTIME']['hour'];
		var htemp1 = parsed_json2['hourly_forecast'][0]['temp'].metric;
		var iconB1 = parsed_json2['hourly_forecast'][0]['icon'];
		var hour2 = parsed_json2['hourly_forecast'][1]['FCTTIME']['hour'];
		var htemp2 = parsed_json2['hourly_forecast'][1]['temp'].metric;
		var iconB2 = parsed_json2['hourly_forecast'][1]['icon'];
		var hour3 = parsed_json2['hourly_forecast'][2]['FCTTIME']['hour'];
		var htemp3 = parsed_json2['hourly_forecast'][2]['temp'].metric;
		var iconB3 = parsed_json2['hourly_forecast'][2]['icon'];
		var hour4 = parsed_json2['hourly_forecast'][3]['FCTTIME']['hour'];
		var htemp4 = parsed_json2['hourly_forecast'][3]['temp'].metric;
		var iconB4 = parsed_json2['hourly_forecast'][3]['icon'];
		var hour5 = parsed_json2['hourly_forecast'][4]['FCTTIME']['hour'];
		var htemp5 = parsed_json2['hourly_forecast'][4]['temp'].metric;
		var iconB5 = parsed_json2['hourly_forecast'][4]['icon'];
		var hour6 = parsed_json2['hourly_forecast'][5]['FCTTIME']['hour'];
		var htemp6 = parsed_json2['hourly_forecast'][5]['temp'].metric;
		var iconB6 = parsed_json2['hourly_forecast'][5]['icon'];

		this.setState({
			 hr1 : hour1,
			 hrtemp1 : htemp1,
			 icB1 : iconB1,
			 hr2 : hour2,
			 hrtemp2 : htemp2,
			 icB2 : iconB2,
			 hr3 : hour3,
			 hrtemp3 : htemp3,
			 icB3 : iconB3,
			 hr4 : hour4,
			 hrtemp4 : htemp4,
			 icB4 : iconB4,
			 hr5 : hour5,
			 hrtemp5 : htemp5,
			 icB5 : iconB5,
			 hr6 : hour6,
			 hrtemp6 : htemp6,
			 icB6 : iconB6,
		});
	}
}
