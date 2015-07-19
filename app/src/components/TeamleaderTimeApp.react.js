
import React from 'react';
import Router, { Link, RouteHandler } from 'react-router';

import { EventEmitter } from 'events';
import { Dispatcher } from 'flux';

var gui = nodeRequire('nw.gui');

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

export default TeamleaderTimeApp;
