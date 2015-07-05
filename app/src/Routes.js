
import React from 'react';
import Router, { DefaultRoute, Route } from 'react-router';

import TeamleaderTimeApp from './components/TeamleaderTimeApp.react';
import Tracker from './components/Tracker.react';
import Settings from './components/Settings.react';


export default class Routes {

	constructor() {

	  var routes = (
	    <Route name="app" path="/" handler={TeamleaderTimeApp}>
	      <Route name="settings" handler={Settings}/>
	      <DefaultRoute name="tracker" handler={Tracker}/>
	    </Route>
	  );

	  Router.run(routes, function (Handler) {
	    React.render(<Handler/>, document.body);
	  });
	}
}