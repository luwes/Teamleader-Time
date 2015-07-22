
import { clone } from 'underscore';

import React from 'react';
import Router, { Link } from 'react-router';

import SettingsStore from '../stores/SettingsStore';
import { getUsers } from '../actions/SettingsActions';

import SelectInput from './SelectInput.react';


var UserSelectContainer = React.createClass({

	getUsersState: function() {
		return {
			users: SettingsStore.getUsers()
		}
	},

	getInitialState: function() {
		return this.getUsersState();
  },

  _onChange: function() {
  	if (this.isMounted()) {
    	this.setState(this.getUsersState());
    }
  },

  componentDidMount: function() {
  	getUsers();
  	SettingsStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
  	SettingsStore.removeChangeListener(this._onChange);
  },

	render: function() {
		if (this.state.users.length === 0) return null;

		var users = clone(this.state.users);
		if (users.length > 0) {
			users.unshift({ id: 0, name: 'Choose...' });
		}

		return (
		  <div className="form-group">
		    <label className="col-xs-3 control-label" htmlFor="user-select">Select user</label>
		    <div className="col-xs-6">
		    	<SelectInput 
		    		id="user-select" 
		    		ref="userSelect" 
		    		labelKey="name" 
		    		options={users} 
		    		defaultValue={this.props.userId}
		    	/>
		    </div>
		  </div>
		);
	}
});

export default UserSelectContainer;
