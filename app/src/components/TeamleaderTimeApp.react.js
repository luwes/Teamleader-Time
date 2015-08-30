
import $ from 'jquery';
import React from 'react';
import { Navigation, Link } from 'react-router';

import { EventEmitter } from 'events';
import { Dispatcher } from 'flux';

var gui = nodeRequire('nw.gui');


var TeamleaderTimeApp = React.createClass({

  mixins: [ Navigation ],

  getInitialState: function() {
    this.menu = new gui.Menu();
    this.menu.append(new gui.MenuItem({label: 'Preferences...', click: this.preferences}));
    this.menu.append(new gui.MenuItem({type: 'separator' }));
    this.menu.append(new gui.MenuItem({label: 'Quit Teamleader', click: this.quit}));
    
    return null;
  },

  home: function(e) {
    e.preventDefault();
    this.transitionTo('/');
  },

  preferences: function() {
    this.transitionTo('/settings');
  },

  quit: function() {
    gui.App.quit();
  },

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

  toggleMenu: function(e) {
    e.preventDefault();
    var el = e.currentTarget;
    var rect = el.getBoundingClientRect();
    this.menu.popup(parseInt(rect.left+rect.width), parseInt(rect.top+rect.height));
  },

  render: function () {
    return (
      <div className="app">
	  		<header>
          <div className="row">
            <div className="col-xs-7">
  	  			  <a className="logo" onClick={this.home} href="#">
                <img src="images/teamleader-logo.svg" alt="" />
              </a>
            </div>
            <div className="col-xs-5 text-right">
              <a className="btn btn-sm btn-success timesheets-link" href="https://www.teamleader.be/timesheets.php" onClick={this.openTimesheets}>
                My timesheets
              </a>
  	  			  <a className="settings-link" onClick={this.toggleMenu} href="#">
  	  				 <i className="fa fa-cog"></i>
  	  			  </a>
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
