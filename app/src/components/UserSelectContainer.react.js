
var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

var SettingsStore = require('../stores/SettingsStore');
var SettingsUsersStore = require('../stores/SettingsUsersStore');
var SettingsActions = require('../actions/SettingsActions');

var SelectInput = require('./SelectInput.react');

var UserSelectContainer = React.createClass({

	getUsersState: function() {
		return {
			'users': SettingsUsersStore.getUsers()
		}
	},

	getInitialState: function() {
		return this.getUsersState();
  },

  _onChange: function() {
    this.setState(this.getUsersState());
  },

  componentDidMount: function() {
  	SettingsActions.getUsers();
  	SettingsUsersStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
  	SettingsUsersStore.removeChangeListener(this._onChange);
  },

	render: function() {
		if (this.state.users.length === 0) return null;
		return (
		  <div className="form-group">
		    <label className="col-xs-3 control-label" htmlFor="user-select">Select user</label>
		    <div className="col-xs-6">
		    	<SelectInput 
		    		id="user-select" 
		    		ref="userSelect" 
		    		options={this.state.users} 
		    		defaultValue={this.props.userId}
		    	/>
		    </div>
		  </div>
		);
	}
});

module.exports = UserSelectContainer;
