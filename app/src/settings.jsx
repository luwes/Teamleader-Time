
var $ = require('jquery');
var React = require('react');

var Router = require('react-router');
var Link = Router.Link;
var Route = Router.Route;

var LocalStorageMixin = require('react-localstorage');

var Util = require('./util');
var TextInput = require('./text-input');
var SelectInput = require('./select-input');

var Settings = React.createClass({
	displayName: 'settings',
	//mixins: [LocalStorageMixin],

	getInitialState: function() {
		return {
			groupId: '',
			groupSecret: '',
			userId: 0,
			userName: ''
		};
  },

	handleSettingsSubmit: function(settings) {
		this.setState({
			groupId: settings.groupId,
			groupSecret: settings.groupSecret,
			userId: settings.userId,
			userName: settings.userName
		});
	},

	render: function() {
		return (
			<div className="settings">
				<SettingsForm 
					onSettingsSubmit={this.handleSettingsSubmit} 
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

		this.props.onSettingsSubmit({
			groupId: groupId,
			groupSecret: groupSecret,
			userId: select ? React.findDOMNode(select).value : 0
		});

		return;
	},

	render: function() {
		return (
			<form className="form-horizontal" onSubmit={this.handleSubmit}>
			  <div className="form-group">
			    <label className="col-xs-3 control-label" htmlFor="group-id">Group ID</label>
			    <div className="col-xs-6">
			    	<TextInput id="group-id" ref="groupId" savedValue={this.props.groupId} />
			    </div>
			  </div>
			  <div className="form-group">
			    <label className="col-xs-3 control-label" htmlFor="group-secret">Group Secret</label>
			    <div className="col-xs-6">
			    	<TextInput id="group-secret" ref="groupSecret" savedValue={this.props.groupSecret} />
			    </div>
			  </div>
			  <UserSelectInputContainer 
			  	ref="userSelectInputContainer"
			    groupId={this.props.groupId} 
			    groupSecret={this.props.groupSecret} 
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
	displayName: 'settings-users',
	mixins: [LocalStorageMixin],

	getInitialState: function() {
		return {
			users: []
		};
  },

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.groupId && nextProps.groupSecret) {

			Util.apiRequest({
				url: '/getUsers.php',
				success: (string) => {
					console.log(string)
					//reviver function to rename keys
					var data = JSON.parse(string, function(prop, val) {
						switch (prop) {
							case 'id':
								this.value = val;
								return;
							case 'name':
								this.label = val;
								return;
							default:
								return val;
						}
					});
					this.setState({ users: data });
	      }
			});
		}
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
