
import $ from 'jquery';
import React from 'react';
import { Router, Link, Navigation } from 'react-router';

import SettingsStore from '../stores/SettingsStore';
import { saveSettings } from '../actions/SettingsActions';


var Settings = React.createClass({

  mixins: [ Navigation ],

	getInitialState: function() {
		return SettingsStore.getSettings();
  },

  _onChange: function() {
    this.setState(SettingsStore.getSettings());
  },

  componentDidMount: function() {
  	SettingsStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
  	SettingsStore.removeChangeListener(this._onChange);
  },

  handleLogout: function(e) {
    e.preventDefault();

    saveSettings({
      userId: null,
      userName: null
    });

    this.replaceWith('/login');
  },

	render: function() {
		return (
			<div className="settings">
        <p>Logged in as {this.state.userName}</p>
        <div className="btn-toolbar"> 
          <button className="btn btn-primary btn-sm" onClick={this.handleLogout}>Logout</button>
        </div>
			</div>
		);
	}
});

export default Settings;
