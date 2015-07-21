
import $ from 'jquery';
import React from 'react';
import Router, { Link } from 'react-router';

import SettingsStore from '../stores/SettingsStore';
import { saveSettings } from '../actions/SettingsActions';
import TextInput from './TextInput.react';
import SelectInput from './SelectInput.react';
import UserSelectContainer from './UserSelectContainer.react';


var Login = React.createClass({

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

	handleSubmit: function(e) {
		e.preventDefault();

		var groupId = React.findDOMNode(this.refs.groupId).value.trim();
		var groupSecret = React.findDOMNode(this.refs.groupSecret).value.trim();
		if (!groupSecret || !groupId) {
			return;
		}

		var container = this.refs.userSelectContainer;
		var select = container.refs.userSelect;
		var selectNode = React.findDOMNode(select);

		saveSettings({
			groupId: groupId,
			groupSecret: groupSecret,
			userId: select ? selectNode.value : 0,
			userName: select ? $(selectNode).find('option:selected').text() : ''
		});

		return;
	},

	render: function() {
		return (
			<div className="login">
				<form className="form-horizontal" onSubmit={this.handleSubmit}>
				  <div className="form-group">
				    <label className="col-xs-3 control-label" htmlFor="group-id">Group ID</label>
				    <div className="col-xs-6">
				    	<TextInput id="group-id" ref="groupId" defaultValue={this.state.groupId} />
				    </div>
				  </div>
				  <div className="form-group">
				    <label className="col-xs-3 control-label" htmlFor="group-secret">Group Secret</label>
				    <div className="col-xs-6">
				    	<TextInput id="group-secret" ref="groupSecret" defaultValue={this.state.groupSecret} />
				    </div>
				  </div>
				  <UserSelectContainer 
				  	ref="userSelectContainer"
				    userId={this.state.userId}
					/>
				  <div className="btn-toolbar">
						<button type="submit" className="btn btn-primary btn-sm">Login</button> 
					</div>
				</form>
			</div>
		);
	}
});

export default Login;
