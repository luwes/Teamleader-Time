
var $ = require('jquery');
var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

var Util = require('../util');
var SettingsStore = require('../stores/SettingsStore');
var SettingsUsersStore = require('../stores/SettingsUsersStore');
var SettingsActions = require('../actions/SettingsActions');
var TextInput = require('./TextInput.react');
var SelectInput = require('./SelectInput.react');
var UserSelectContainer = require('./UserSelectContainer.react');

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

		SettingsActions.saveSettings({
			groupId: groupId,
			groupSecret: groupSecret,
			userId: select ? selectNode.value : 0,
			userName: select ? $(selectNode).find('option:selected').text() : ''
		});

		return;
	},

	render: function() {
		return (
			<div className="settings">
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
						<button type="submit" className="btn btn-primary btn-sm save-settings-btn">Save</button> 
						<Link to="tracker" className="btn btn-default btn-sm back-settings-btn">Back</Link>
					</div>
				</form>
			</div>
		);
	}
});

module.exports = Settings;
