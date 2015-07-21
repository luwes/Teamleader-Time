
import React from 'react';
import { Router, Route } from 'react-router';
var history = require('react-router/lib/BrowserHistory').history;

import TeamleaderTimeApp from './components/TeamleaderTimeApp.react';
import Tracker from './components/Tracker.react';
import Login from './components/Login.react';
import Settings from './components/Settings.react';


export default class Routes {

	constructor() {

		console.log(history)

	  React.render((
	  	<Router history={history}>
		    <Route component={TeamleaderTimeApp}>
		    	<Route path="/" component={Tracker} />
		      <Route path="/login" component={Login} />
		      <Route path="/settings" component={Settings} />
		    </Route>
		  </Router>
		), document.body);
	}
}