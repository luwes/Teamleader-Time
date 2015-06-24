
var gui = nodeRequire('nw.gui');
var mb = new gui.Menu({type: 'menubar'});
try {
  mb.createMacBuiltin('Teamleader Time', {
    hideEdit: false,
  });
  gui.Window.get().menu = mb;
} catch(ex) {
  console.log(ex.message);
}

import React from 'react';
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;

var TeamleaderTimeApp = require('./components/TeamleaderTimeApp.react');
var Tracker = require('./components/Tracker.react');
var Settings = require('./components/Settings.react');

var routes = (
  <Route name="app" path="/" handler={TeamleaderTimeApp}>
    <Route name="settings" handler={Settings}/>
    <DefaultRoute name="tracker" handler={Tracker}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
