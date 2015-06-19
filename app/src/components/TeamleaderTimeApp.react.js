
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('flux').Dispatcher;


var TeamleaderTimeApp = React.createClass({
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

module.exports = TeamleaderTimeApp;
