
import React from 'react';
import Router, { Link, RouteHandler } from 'react-router';

import { EventEmitter } from 'events';
import { Dispatcher } from 'flux';

var gui = nodeRequire('nw.gui');

var TeamleaderTimeApp = React.createClass({
  render: function () {

    function showDevTools() {
      gui.Window.get().showDevTools();
    }

    var devLink = 
      <a href="javascript:;" className="dev-link" onClick={showDevTools}>
        <i className="fa fa-wrench"></i>
      </a>;

    return (
      <div className="app">
	  		<header>
	  			<div className="headerext"></div>
	  			<Link to="settings" className="settings-link" activeClassName="active">
	  				<i className="fa fa-cog"></i>
	  			</Link>
          {devLink}
	  		</header>

        {/* this is the important part */}
        <div className="container">
          <RouteHandler/>
        </div>
      </div>
    );
  }
});

export default TeamleaderTimeApp;
