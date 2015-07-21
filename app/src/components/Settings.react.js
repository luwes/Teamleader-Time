
import $ from 'jquery';
import React from 'react';

import SettingsStore from '../stores/SettingsStore';
import { saveSettings } from '../actions/SettingsActions';


var Settings = React.createClass({

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

	render: function() {
		return (
			<div className="settings">



			</div>
		);
	}
});

export default Settings;
