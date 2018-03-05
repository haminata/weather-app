/**
 * Created by haminata on 04/03/2018.
 */


import {h, render, Component} from 'preact';
// import stylesheets for ipad & button

import style from './style';

// import jquery for API calls
import $ from 'jquery';

export default class LocationChooser extends Component {

	render(props, state){
		console.log(props, state)
		return (<div class={style['location-chooser']}>Choose Location</div>)
	}

}
