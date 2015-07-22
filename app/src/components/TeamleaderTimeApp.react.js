
import $ from 'jquery';
import React from 'react';
import { Navigation, Link } from 'react-router';

import { EventEmitter } from 'events';
import { Dispatcher } from 'flux';

var gui = nodeRequire('nw.gui');


var TeamleaderTimeApp = React.createClass({

  mixins: [ Navigation ],

  openTimesheets: function(e) {
    e.preventDefault();
    gui.Shell.openExternal(e.currentTarget.href);
  },

  toggleBack: function(e) {
    var el = e.currentTarget;
    if ($(el).hasClass('active')) {
      e.preventDefault();
      this.transitionTo('/');
    }
  },

  render: function () {
    return (
      <div className="app">
	  		<header>
          <div className="row">
            <div className="col-xs-7">
  	  			  <div className="headerext"></div>
            </div>
            <div className="col-xs-5 text-right">
              <a className="btn btn-sm btn-success timesheets-link" href="https://www.teamleader.be/timesheets.php" onClick={this.openTimesheets}>
                My timesheets
              </a>
  	  			  <Link to="/settings" className="settings-link" activeClassName="active" onClick={this.toggleBack}>
  	  				 <i className="fa fa-cog"></i>
  	  			  </Link>
            </div>
          </div>
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
