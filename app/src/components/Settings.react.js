
var $ = require('jquery');
var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

var SettingsStore = require('../stores/SettingsStore');
var SettingsUsersStore = require('../stores/SettingsUsersStore');
var SettingsActions = require('../actions/SettingsActions');

var Util = require('../util');
var TextInput = require('./TextInput.react');
var SelectInput = require('./SelectInput.react');

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
				<SettingsForm 
					groupId={this.state.groupId}
					groupSecret={this.state.groupSecret}
					userId={this.state.userId}
				/>
			</div>
		);
	}
});

var SettingsForm = React.createClass({

	handleSubmit: function(e) {
		e.preventDefault();

		var groupId = React.findDOMNode(this.refs.groupId).value.trim();
		var groupSecret = React.findDOMNode(this.refs.groupSecret).value.trim();
		if (!groupSecret || !groupId) {
			return;
		}

		var container = this.refs.userSelectInputContainer;
		var select = container.refs.userSelect;
		var selectNode = React.findDOMNode(select);

		SettingsActions.saveSettings({
			groupId: groupId,
			groupSecret: groupSecret,
			userId: select ? selectNode.value : 0,
			userName: select ? $(selectNode).find('option:selected').text() : ''
		});

		return;
	},

	render: function() {

		//console.log(this.props.groupId)

		return (
			<form className="form-horizontal" onSubmit={this.handleSubmit}>
			  <div className="form-group">
			    <label className="col-xs-3 control-label" htmlFor="group-id">Group ID</label>
			    <div className="col-xs-6">
			    	<TextInput id="group-id" ref="groupId" defaultValue={this.props.groupId} />
			    </div>
			  </div>
			  <div className="form-group">
			    <label className="col-xs-3 control-label" htmlFor="group-secret">Group Secret</label>
			    <div className="col-xs-6">
			    	<TextInput id="group-secret" ref="groupSecret" defaultValue={this.props.groupSecret} />
			    </div>
			  </div>
			  <UserSelectInputContainer 
			  	ref="userSelectInputContainer"
			    userId={this.props.userId}
				/>
			  <div className="btn-toolbar">
					<button type="submit" data-loading-text="Loading..." className="btn btn-primary btn-sm save-settings-btn">Save</button> 
					<Link to="home" className="btn btn-default btn-sm back-settings-btn">Back</Link>
				</div>
			</form>
		);
	}
});

var UserSelectInputContainer = React.createClass({

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

module.exports = Settings
