
import React from 'react';
import { Router, Route } from 'react-router';
import HashHistory from 'react-router/lib/HashHistory';

import TeamleaderTimeApp from './components/TeamleaderTimeApp.react';
import Tracker from './components/Tracker.react';
import Login from './components/Login.react';
import Settings from './components/Settings.react';

import SettingsStore from './stores/SettingsStore';


export default class Routes {

	constructor() {

	  React.render((
	  	<Router history={new HashHistory}>
		    <Route component={TeamleaderTimeApp}>
		    	<Route path="/" component={Tracker} onEnter={this.requireAuth}/>
		      <Route path="/login" component={Login}/>
		      <Route path="/settings" component={Settings} onEnter={this.requireAuth}/>
		    </Route>
		  </Router>
		), document.body);
	}

	requireAuth(nextState, transition) {
	  if (!SettingsStore.isLoggedIn()) {
			transition.to('/login', null, { nextPathname: nextState.location.pathname });
	  }
	}
}