// import 'promise-polyfill';
// import 'isomorphic-fetch';
import { h, render } from 'preact';
import './style';

// react-dom (what we'll use here)
import { BrowserRouter, NotFound, Switch, Route } from 'react-router-dom'

let root;
function init() {
	let App = require('./components/app').default;

	root = render(<BrowserRouter>
						<Switch>
							<Route exact path='/' component={ App } />
							<Route component={ () => 'Not Found' } />
						</Switch>
					</BrowserRouter>, document.body, root);
}

// register ServiceWorker via OfflinePlugin, for prod only:
if (process.env.NODE_ENV==='production') {
	require('./pwa');
}

// in development, set up HMR:
if (module.hot) {
	require('preact/devtools');   // turn this on if you want to enable React DevTools!
	module.hot.accept('./components/app', () => requestAnimationFrame(init) );
}

init();
