// import preact
import { h, Component } from 'preact';

// import required Components from 'components/'
import Iphone from './iphone';
import Ipad from './ipad';
import { Link } from 'react-router-dom'

export default class App extends Component {
//var App = React.createClass({

	// once the components are loaded, checks if the url bar has a path with "ipad" in it, if so sets state of tablet to be true
	componentDidMount() {
		const urlBar = window.location.href;
		if(urlBar.includes("ipad")) {
			this.setState({
				"isTablet": true
			});
		} else {
			this.setState({
				"isTablet": false
			});
		}
	}

	/*
		A render method to display the required Component on screen (iPhone or iPad) : selected by checking component's isTablet state
	*/
	render(){
		if(this.state.isTablet){
			return (
				<div>
					<nav>
						<Link to="/dashboard" component={ () => 'Welcome!' }>Dashboard</Link>
					</nav>
					<div id="app">
						<Ipad/ >
					</div>
				</div>
			);
		}
		else {
			return (
				<div>
					<nav>
						<Link to="/dashboard">Dashboard</Link>
					</nav>
				<div id="app">
					<Iphone/ >
				</div>
				</div>
			);
		}
	}
}
