
import React from 'react';
import { Link } from 'react-router';

import { EventEmitter } from 'events';
import { Dispatcher } from 'flux';


var TeamleaderTimeApp = React.createClass({
  render: function () {

    return (
      <div className="app">
	  		<header>
	  			<div className="headerext"></div>
	  			<Link to="/settings" className="settings-link" activeClassName="active">
	  				<i className="fa fa-cog"></i>
	  			</Link>
	  		</header>

        {/* this is the important part */}
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
});

export default TeamleaderTimeApp;
