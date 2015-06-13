
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

//var jQuery = require('jquery');
//console.log(jQuery);
//var bootstrap = require('bootstrap');
//console.log(bootstrap);

var React = require('react');
var Router = require('react-router');

var Home = require('./home');
var Settings = require('./settings');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;


var App = React.createClass({
  render: function () {
    return (
      <div className="app">
	  		<header>
	  			<div className="headerext"></div>
	  			<Link to="settings" className="settings-link" activeClassName="active">
	  				<i className="fa fa-cog"></i>
	  			</Link>
	  		</header>

        {/* this is the important part */}
        <div className="container">
          <RouteHandler/>
        </div>
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
  	<Route name="settings" handler={Settings}/>
    <DefaultRoute name="home" handler={Home}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
