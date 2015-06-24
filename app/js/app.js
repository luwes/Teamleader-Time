(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Util = require('../util');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SettingsConstants = require('../constants/SettingsConstants');

module.exports = {

	saveSettings: function saveSettings(data) {
		AppDispatcher.dispatch({
			type: SettingsConstants.SAVE_SETTINGS,
			data: data
		});
	},

	getUsers: function getUsers(data) {
		Util.apiRequest({
			url: '/getUsers.php',
			success: function success(string) {
				//reviver function to rename keys
				var data = JSON.parse(string, function (prop, val) {
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
				AppDispatcher.dispatch({
					type: SettingsConstants.RECEIVE_USERS,
					data: data
				});
			}
		});
	}

};

},{"../constants/SettingsConstants":13,"../dispatcher/AppDispatcher":15,"../util":22}],2:[function(require,module,exports){
'use strict';

var Util = require('../util');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TrackerConstants = require('../constants/TrackerConstants');

var TrackerActions = {

	getProjects: function getProjects() {
		Util.apiRequest({
			url: '/getProjects.php',
			data: {
				amount: 100,
				pageno: 0
			},
			success: function success(string) {
				//console.log(string)
				//reviver function to rename keys
				var data = JSON.parse(string, function (prop, val) {
					switch (prop) {
						case 'id':
							this.value = val;
							return;
						case 'title':
							this.label = val;
							return;
						default:
							return val;
					}
				});

				if (data.length > 0) {
					data.unshift({ value: 0, label: 'Choose...' });
				}

				AppDispatcher.dispatch({
					type: TrackerConstants.RECEIVE_PROJECTS,
					data: data
				});
			}
		});
	},

	setProject: function setProject(id) {
		AppDispatcher.dispatch({
			type: TrackerConstants.SET_PROJECT,
			id: id
		});
	},

	getProjectDetails: function getProjectDetails(project) {
		if (project > 0) {
			Util.apiRequest({
				url: '/getProject.php',
				data: {
					project_id: project
				},
				success: function success(string) {
					var data = JSON.parse(string);
					AppDispatcher.dispatch({
						type: TrackerConstants.SET_CONTACT_OR_COMPANY,
						option: data.contact_or_company,
						id: data.contact_or_company_id
					});
				}
			});
		}
	},

	getMilestones: function getMilestones(project) {
		if (project > 0) {
			Util.apiRequest({
				url: '/getMilestonesByProject.php',
				data: {
					project_id: project
				},
				success: function success(string) {
					//reviver function to rename keys
					var data = JSON.parse(string, function (prop, val) {
						switch (prop) {
							case 'id':
								this.value = val;
								return;
							case 'title':
								this.label = val;
								return;
							default:
								return val;
						}
					});

					for (var i = data.length - 1; i >= 0; i--) {
						if (data[i].closed == 1) {
							data.splice(i, 1);
						}
					}

					AppDispatcher.dispatch({
						type: TrackerConstants.RECEIVE_MILESTONES,
						data: data
					});
				}
			});
		}
	},

	setMilestone: function setMilestone(id) {
		AppDispatcher.dispatch({
			type: TrackerConstants.SET_MILESTONE,
			id: id
		});
	},

	getMilestoneTasks: function getMilestoneTasks(milestone) {

		if (milestone > 0) {

			Util.apiRequest({
				url: '/getTasksByMilestone.php',
				data: {
					milestone_id: milestone
				},
				success: function success(string) {
					//reviver function to rename keys
					var data = JSON.parse(string, function (prop, val) {
						switch (prop) {
							case 'id':
								this.value = val;
								return;
							case 'description':
								this.label = val;
								return;
							default:
								return val;
						}
					});

					for (var i = data.length - 1; i >= 0; i--) {
						if (data[i].done == 1) {
							data.splice(i, 1);
						}
					}

					var appSettings = JSON.parse(localStorage.getItem('settings'));
					if (appSettings && appSettings.userName) {
						for (var i = data.length - 1; i >= 0; i--) {
							if (data[i].owner_name != appSettings.userName) {
								data.splice(i, 1);
							}
						}
					}

					if (data.length > 0) {
						data.push({ value: 'new', label: 'New task...' });
					}

					AppDispatcher.dispatch({
						type: TrackerConstants.RECEIVE_MILESTONE_TASKS,
						data: data
					});
				}
			});
		}
	},

	setMilestoneTask: function setMilestoneTask(id) {
		AppDispatcher.dispatch({
			type: TrackerConstants.SET_MILESTONE_TASK,
			id: id
		});
	}

};

module.exports = TrackerActions;

},{"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"../util":22}],3:[function(require,module,exports){
'use strict';

var React = require('react');

var TrackerActions = require('../actions/TrackerActions');
var ProjectStore = require('../stores/ProjectStore');
var MilestoneStore = require('../stores/MilestoneStore');
var SelectInput = require('./SelectInput.react');

var MilestoneSelectContainer = React.createClass({
	displayName: 'MilestoneSelectContainer',

	getMilestonesState: function getMilestonesState() {
		return {
			milestones: MilestoneStore.getMilestones(),
			milestone: MilestoneStore.getMilestone()
		};
	},

	getInitialState: function getInitialState() {
		return this.getMilestonesState();
	},

	_onChange: function _onChange() {
		this.setState(this.getMilestonesState());
	},

	componentDidMount: function componentDidMount() {
		TrackerActions.getMilestones(ProjectStore.getProject());
		MilestoneStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function componentWillUnmount() {
		MilestoneStore.removeChangeListener(this._onChange);
	},

	handleChange: function handleChange(event) {
		var target = event.currentTarget;
		TrackerActions.setMilestone(target.value);
	},

	render: function render() {
		if (this.state.milestones.length === 0) return null;
		return React.createElement(
			'div',
			{ className: 'form-group' },
			React.createElement(
				'label',
				{ className: 'col-xs-3 control-label', htmlFor: 'milestone' },
				'Milestone'
			),
			React.createElement(
				'div',
				{ className: 'col-xs-6' },
				React.createElement(SelectInput, {
					id: 'milestone',
					ref: 'milestone',
					value: this.state.milestone,
					options: this.state.milestones,
					onChange: this.handleChange
				})
			)
		);
	}
});

module.exports = MilestoneSelectContainer;

},{"../actions/TrackerActions":2,"../stores/MilestoneStore":17,"../stores/ProjectStore":19,"./SelectInput.react":5,"react":"react"}],4:[function(require,module,exports){
'use strict';

var React = require('react');

var TrackerActions = require('../actions/TrackerActions');
var ProjectStore = require('../stores/ProjectStore');
var SelectInput = require('./SelectInput.react');

var ProjectSelectContainer = React.createClass({
	displayName: 'ProjectSelectContainer',

	getProjectsState: function getProjectsState() {
		return {
			projects: ProjectStore.getProjects(),
			project: ProjectStore.getProject()
		};
	},

	getInitialState: function getInitialState() {
		return this.getProjectsState();
	},

	_onChange: function _onChange() {
		this.setState(this.getProjectsState());
	},

	componentDidMount: function componentDidMount() {
		TrackerActions.getProjects();
		ProjectStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function componentWillUnmount() {
		ProjectStore.removeChangeListener(this._onChange);
	},

	handleChange: function handleChange(event) {
		var target = event.currentTarget;
		TrackerActions.setProject(target.value);
	},

	render: function render() {
		return React.createElement(
			'div',
			{ className: 'form-group' },
			React.createElement(
				'label',
				{ className: 'col-xs-3 control-label', htmlFor: 'project' },
				'Project'
			),
			React.createElement(
				'div',
				{ className: 'col-xs-6' },
				React.createElement(SelectInput, {
					id: 'project',
					ref: 'project',
					value: this.state.project,
					options: this.state.projects,
					onChange: this.handleChange
				})
			)
		);
	}
});

module.exports = ProjectSelectContainer;

},{"../actions/TrackerActions":2,"../stores/ProjectStore":19,"./SelectInput.react":5,"react":"react"}],5:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var Util = require('../util');

var SelectInput = React.createClass({
	displayName: 'SelectInput',

	render: function render() {

		var optionNodes = this.props.options.map(function (option) {
			return React.createElement(
				'option',
				{ key: option.value, value: option.value },
				Util.htmlEntities(option.label)
			);
		});

		return React.createElement(
			'select',
			_extends({}, this.props, {
				className: 'form-control'
			}),
			optionNodes
		);
	}
});

module.exports = SelectInput;

},{"../util":22,"react":"react"}],6:[function(require,module,exports){
'use strict';

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
	displayName: 'Settings',

	getInitialState: function getInitialState() {
		return SettingsStore.getSettings();
	},

	_onChange: function _onChange() {
		this.setState(SettingsStore.getSettings());
	},

	componentDidMount: function componentDidMount() {
		SettingsStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function componentWillUnmount() {
		SettingsStore.removeChangeListener(this._onChange);
	},

	handleSubmit: function handleSubmit(e) {
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

	render: function render() {
		return React.createElement(
			'div',
			{ className: 'settings' },
			React.createElement(
				'form',
				{ className: 'form-horizontal', onSubmit: this.handleSubmit },
				React.createElement(
					'div',
					{ className: 'form-group' },
					React.createElement(
						'label',
						{ className: 'col-xs-3 control-label', htmlFor: 'group-id' },
						'Group ID'
					),
					React.createElement(
						'div',
						{ className: 'col-xs-6' },
						React.createElement(TextInput, { id: 'group-id', ref: 'groupId', defaultValue: this.state.groupId })
					)
				),
				React.createElement(
					'div',
					{ className: 'form-group' },
					React.createElement(
						'label',
						{ className: 'col-xs-3 control-label', htmlFor: 'group-secret' },
						'Group Secret'
					),
					React.createElement(
						'div',
						{ className: 'col-xs-6' },
						React.createElement(TextInput, { id: 'group-secret', ref: 'groupSecret', defaultValue: this.state.groupSecret })
					)
				),
				React.createElement(UserSelectContainer, {
					ref: 'userSelectContainer',
					userId: this.state.userId
				}),
				React.createElement(
					'div',
					{ className: 'btn-toolbar' },
					React.createElement(
						'button',
						{ type: 'submit', className: 'btn btn-primary btn-sm save-settings-btn' },
						'Save'
					),
					React.createElement(
						Link,
						{ to: 'tracker', className: 'btn btn-default btn-sm back-settings-btn' },
						'Back'
					)
				)
			)
		);
	}
});

module.exports = Settings;

},{"../actions/SettingsActions":1,"../stores/SettingsStore":20,"../stores/SettingsUsersStore":21,"../util":22,"./SelectInput.react":5,"./TextInput.react":10,"./UserSelectContainer.react":12,"jquery":"jquery","react":"react","react-router":"react-router"}],7:[function(require,module,exports){
'use strict';

var React = require('react');

var TrackerActions = require('../actions/TrackerActions');
var MilestoneStore = require('../stores/MilestoneStore');
var MilestoneTaskStore = require('../stores/MilestoneTaskStore');
var SelectInput = require('./SelectInput.react');
var TaskTypeSelectContainer = require('./TaskTypeSelectContainer.react');

var TaskSelectContainer = React.createClass({
	displayName: 'TaskSelectContainer',

	getTasksState: function getTasksState() {
		return {
			tasks: MilestoneTaskStore.getMilestoneTasks(),
			task: MilestoneTaskStore.getMilestoneTask()
		};
	},

	getInitialState: function getInitialState() {
		return this.getTasksState();
	},

	_onChange: function _onChange() {
		this.setState(this.getTasksState());
	},

	componentDidMount: function componentDidMount() {
		TrackerActions.getMilestoneTasks(MilestoneStore.getMilestone());
		MilestoneTaskStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function componentWillUnmount() {
		MilestoneTaskStore.removeChangeListener(this._onChange);
	},

	handleChange: function handleChange(event) {
		var target = event.currentTarget;
		TrackerActions.setMilestoneTask(target.value);
	},

	render: function render() {
		if (this.state.tasks.length > 1) {
			return React.createElement(
				'div',
				{ className: 'form-group' },
				React.createElement(
					'label',
					{ className: 'col-xs-3 control-label', htmlFor: 'milestone-task' },
					'Todo'
				),
				React.createElement(
					'div',
					{ className: 'col-xs-6' },
					React.createElement(SelectInput, {
						id: 'milestone-task',
						ref: 'milestoneTask',
						value: this.state.task,
						options: this.state.tasks,
						onChange: this.handleChange
					})
				)
			);
		} else {
			return React.createElement(
				'div',
				{ className: 'custom-task' },
				React.createElement(
					'div',
					{ className: 'form-group' },
					React.createElement(
						'label',
						{ className: 'col-xs-3 control-label', htmlFor: 'task-type' },
						'Type'
					),
					React.createElement(
						'div',
						{ className: 'col-xs-6' },
						React.createElement(TaskTypeSelectContainer, null)
					)
				),
				React.createElement(
					'div',
					{ className: 'form-group' },
					React.createElement(
						'div',
						{ className: 'col-xs-12' },
						React.createElement('textarea', { id: 'task-description', ref: 'taskDescription', placeholder: 'Task description...', className: 'form-control', rows: '3' })
					)
				)
			);
		}
	}
});

module.exports = TaskSelectContainer;

},{"../actions/TrackerActions":2,"../stores/MilestoneStore":17,"../stores/MilestoneTaskStore":18,"./SelectInput.react":5,"./TaskTypeSelectContainer.react":8,"react":"react"}],8:[function(require,module,exports){
'use strict';

var React = require('react');

var Util = require('../util');
var SelectInput = require('./SelectInput.react');

var TaskTypeSelectContainer = React.createClass({
	displayName: 'TaskTypeSelectContainer',

	getInitialState: function getInitialState() {
		return {
			taskTypes: []
		};
	},
	componentDidMount: function componentDidMount() {
		var _this = this;

		Util.apiRequest({
			url: '/getTaskTypes.php',
			success: function success(string) {
				//reviver function to rename keys
				var data = JSON.parse(string, function (prop, val) {
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
				_this.setState({ taskTypes: data });
			}
		});
	},
	render: function render() {
		return React.createElement(SelectInput, { id: 'task-type', ref: 'taskType', options: this.state.taskTypes });
	}
});

module.exports = TaskTypeSelectContainer;

},{"../util":22,"./SelectInput.react":5,"react":"react"}],9:[function(require,module,exports){
'use strict';

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('flux').Dispatcher;

var TeamleaderTimeApp = React.createClass({
  displayName: 'TeamleaderTimeApp',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'app' },
      React.createElement(
        'header',
        null,
        React.createElement('div', { className: 'headerext' }),
        React.createElement(
          Link,
          { to: 'settings', className: 'settings-link', activeClassName: 'active' },
          React.createElement('i', { className: 'fa fa-cog' })
        )
      ),
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(RouteHandler, null)
      )
    );
  }
});

module.exports = TeamleaderTimeApp;
/* this is the important part */

},{"events":23,"flux":"flux","react":"react","react-router":"react-router"}],10:[function(require,module,exports){
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");

var TextInput = React.createClass({
	displayName: "TextInput",

	// getInitialState: function() {
	// 	return { value: '' };
	// },

	// componentWillReceiveProps: function(nextProps) {
	// 	this.setState({ value: nextProps.savedValue });
	// },

	// handleChange: function(event) {
	// 	this.setState({ value: event.target.value });
	//  },

	render: function render() {
		//var value = this.state.value;
		return React.createElement("input", _extends({}, this.props, {
			type: "text",
			className: "form-control"
			//value={value}
			//onChange={this.handleChange}
		}));
	}
});

module.exports = TextInput;

},{"react":"react"}],11:[function(require,module,exports){
'use strict';

var React = require('react');

var CustomerStore = require('../stores/CustomerStore');
var ProjectStore = require('../stores/ProjectStore');
var MilestoneStore = require('../stores/MilestoneStore');
var MilestoneTaskStore = require('../stores/MilestoneTaskStore');

var ProjectSelectContainer = require('./ProjectSelectContainer.react');
var MilestoneSelectContainer = require('./MilestoneSelectContainer.react');
var TaskSelectContainer = require('./TaskSelectContainer.react');

var Tracker = React.createClass({
	displayName: 'Tracker',

	getTrackerState: function getTrackerState() {
		return {
			project: ProjectStore.getProject(),
			milestone: MilestoneStore.getMilestone(),
			milestoneTask: MilestoneTaskStore.getMilestoneTask(),
			contactOrCompany: CustomerStore.getContactOrCompany(),
			contactOrCompanyId: CustomerStore.getContactOrCompanyId()
		};
	},

	getInitialState: function getInitialState() {
		return this.getTrackerState();
	},

	handleSubmit: function handleSubmit(e) {
		e.preventDefault();

		console.log(this.getTrackerState());
	},

	render: function render() {
		return React.createElement(
			'div',
			{ className: 'tracker' },
			React.createElement(
				'form',
				{ className: 'form-horizontal', onSubmit: this.handleSubmit },
				React.createElement(ProjectSelectContainer, null),
				React.createElement(MilestoneSelectContainer, null),
				React.createElement(TaskSelectContainer, null),
				React.createElement(
					'div',
					{ className: 'btn-toolbar' },
					React.createElement(
						'button',
						{ type: 'submit', className: 'btn btn-primary btn-sm start-timer-btn' },
						'Start timer'
					)
				)
			)
		);
	}
});

module.exports = Tracker;

},{"../stores/CustomerStore":16,"../stores/MilestoneStore":17,"../stores/MilestoneTaskStore":18,"../stores/ProjectStore":19,"./MilestoneSelectContainer.react":3,"./ProjectSelectContainer.react":4,"./TaskSelectContainer.react":7,"react":"react"}],12:[function(require,module,exports){
'use strict';

var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

var SettingsStore = require('../stores/SettingsStore');
var SettingsUsersStore = require('../stores/SettingsUsersStore');
var SettingsActions = require('../actions/SettingsActions');

var SelectInput = require('./SelectInput.react');

var UserSelectContainer = React.createClass({
	displayName: 'UserSelectContainer',

	getUsersState: function getUsersState() {
		return {
			'users': SettingsUsersStore.getUsers()
		};
	},

	getInitialState: function getInitialState() {
		return this.getUsersState();
	},

	_onChange: function _onChange() {
		this.setState(this.getUsersState());
	},

	componentDidMount: function componentDidMount() {
		SettingsActions.getUsers();
		SettingsUsersStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function componentWillUnmount() {
		SettingsUsersStore.removeChangeListener(this._onChange);
	},

	render: function render() {
		if (this.state.users.length === 0) return null;
		return React.createElement(
			'div',
			{ className: 'form-group' },
			React.createElement(
				'label',
				{ className: 'col-xs-3 control-label', htmlFor: 'user-select' },
				'Select user'
			),
			React.createElement(
				'div',
				{ className: 'col-xs-6' },
				React.createElement(SelectInput, {
					id: 'user-select',
					ref: 'userSelect',
					options: this.state.users,
					defaultValue: this.props.userId
				})
			)
		);
	}
});

module.exports = UserSelectContainer;

},{"../actions/SettingsActions":1,"../stores/SettingsStore":20,"../stores/SettingsUsersStore":21,"./SelectInput.react":5,"react":"react","react-router":"react-router"}],13:[function(require,module,exports){
'use strict';

var keyMirror = require('keymirror');

module.exports = keyMirror({
	SAVE_SETTINGS: null,
	RECEIVE_USERS: null
});

},{"keymirror":"keymirror"}],14:[function(require,module,exports){
'use strict';

var keyMirror = require('keymirror');

module.exports = keyMirror({
	RECEIVE_PROJECTS: null,
	RECEIVE_MILESTONES: null,
	RECEIVE_MILESTONE_TASKS: null,
	SET_PROJECT: null,
	SET_MILESTONE: null,
	SET_MILESTONE_TASK: null,
	SET_CONTACT_OR_COMPANY: null
});

},{"keymirror":"keymirror"}],15:[function(require,module,exports){
/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * AppDispatcher
 *
 * A singleton that operates as the central hub for application updates.
 */

'use strict';

var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();

},{"flux":"flux"}],16:[function(require,module,exports){
'use strict';

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TrackerConstants = require('../constants/TrackerConstants');
var TrackerActions = require('../actions/TrackerActions');

var _contactOrCompany;
var _contactOrCompanyId;

var CustomerStore = assign({}, EventEmitter.prototype, {

	// Emit Change event
	emitChange: function emitChange() {
		this.emit('change');
	},

	// Add change listener
	addChangeListener: function addChangeListener(callback) {
		this.on('change', callback);
	},

	// Remove change listener
	removeChangeListener: function removeChangeListener(callback) {
		this.removeListener('change', callback);
	},

	getContactOrCompany: function getContactOrCompany() {
		return _contactOrCompany;
	},

	getContactOrCompanyId: function getContactOrCompanyId() {
		return _contactOrCompanyId;
	}
});

CustomerStore.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.type) {

		case TrackerConstants.SET_CONTACT_OR_COMPANY:
			_contactOrCompany = action.option;
			_contactOrCompanyId = action.id;
			CustomerStore.emitChange();
			break;

		default:
		//no op
	}
});

module.exports = CustomerStore;

},{"../actions/TrackerActions":2,"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"events":23,"object-assign":"object-assign"}],17:[function(require,module,exports){
'use strict';

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TrackerConstants = require('../constants/TrackerConstants');
var TrackerActions = require('../actions/TrackerActions');
var ProjectStore = require('../stores/ProjectStore');

var _milestones = [];
var _selected;

var MilestoneStore = assign({}, EventEmitter.prototype, {

	// Emit Change event
	emitChange: function emitChange() {
		this.emit('change');
	},

	// Add change listener
	addChangeListener: function addChangeListener(callback) {
		this.on('change', callback);
	},

	// Remove change listener
	removeChangeListener: function removeChangeListener(callback) {
		this.removeListener('change', callback);
	},

	getMilestones: function getMilestones() {
		return _milestones;
	},

	getMilestone: function getMilestone() {
		return _selected;
	}
});

MilestoneStore.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.type) {

		case TrackerConstants.SET_PROJECT:
			AppDispatcher.waitFor([ProjectStore.dispatchToken]);
			_milestones = [];
			_selected = 0;
			MilestoneStore.emitChange();
			break;

		case TrackerConstants.RECEIVE_MILESTONES:
			_milestones = action.data;
			if (_milestones.length > 0) {
				_selected = parseInt(_milestones[0].value);
				console.log('milestone', _selected);
			}
			MilestoneStore.emitChange();

			TrackerActions.getMilestoneTasks(_selected);
			break;

		case TrackerConstants.SET_MILESTONE:
			_selected = parseInt(action.id);
			console.log('milestone', _selected);
			MilestoneStore.emitChange();

			TrackerActions.getMilestoneTasks(_selected);
			break;

		default:
		//no op
	}
});

module.exports = MilestoneStore;

},{"../actions/TrackerActions":2,"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"../stores/ProjectStore":19,"events":23,"object-assign":"object-assign"}],18:[function(require,module,exports){
'use strict';

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TrackerConstants = require('../constants/TrackerConstants');
var MilestoneStore = require('../stores/MilestoneStore');

var _tasks = [];
var _selected;

var MilestoneTaskStore = assign({}, EventEmitter.prototype, {

	// Emit Change event
	emitChange: function emitChange() {
		this.emit('change');
	},

	// Add change listener
	addChangeListener: function addChangeListener(callback) {
		this.on('change', callback);
	},

	// Remove change listener
	removeChangeListener: function removeChangeListener(callback) {
		this.removeListener('change', callback);
	},

	getMilestoneTasks: function getMilestoneTasks() {
		return _tasks;
	},

	getMilestoneTask: function getMilestoneTask() {
		return _selected;
	}
});

MilestoneTaskStore.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.type) {

		case TrackerConstants.SET_PROJECT:
		case TrackerConstants.SET_MILESTONE:
			AppDispatcher.waitFor([MilestoneStore.dispatchToken]);
			_tasks = [];
			_selected = 0;
			MilestoneTaskStore.emitChange();
			break;

		case TrackerConstants.RECEIVE_MILESTONE_TASKS:
			_tasks = action.data;
			if (_tasks.length > 0) {
				_selected = parseInt(_tasks[0].value);
				console.log('task', _selected);
			}
			MilestoneTaskStore.emitChange();
			break;

		case TrackerConstants.SET_MILESTONE_TASK:
			_selected = parseInt(action.id);
			console.log('task', _selected);
			MilestoneTaskStore.emitChange();
			break;

		default:
		//no op
	}
});

module.exports = MilestoneTaskStore;

},{"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"../stores/MilestoneStore":17,"events":23,"object-assign":"object-assign"}],19:[function(require,module,exports){
'use strict';

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TrackerConstants = require('../constants/TrackerConstants');
var TrackerActions = require('../actions/TrackerActions');

var _projects = [];
var _selected;

var ProjectStore = assign({}, EventEmitter.prototype, {

	// Emit Change event
	emitChange: function emitChange() {
		this.emit('change');
	},

	// Add change listener
	addChangeListener: function addChangeListener(callback) {
		this.on('change', callback);
	},

	// Remove change listener
	removeChangeListener: function removeChangeListener(callback) {
		this.removeListener('change', callback);
	},

	getProjects: function getProjects() {
		return _projects;
	},

	getProject: function getProject() {
		return _selected;
	}
});

ProjectStore.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.type) {

		case TrackerConstants.RECEIVE_PROJECTS:
			_projects = action.data;
			ProjectStore.emitChange();
			break;

		case TrackerConstants.SET_PROJECT:
			_selected = parseInt(action.id);
			console.log('project', _selected);
			ProjectStore.emitChange();

			TrackerActions.getProjectDetails(_selected);
			TrackerActions.getMilestones(_selected);
			break;

		default:
		//no op
	}
});

module.exports = ProjectStore;

},{"../actions/TrackerActions":2,"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"events":23,"object-assign":"object-assign"}],20:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var assign = require('object-assign');

var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SettingsConstants = require('../constants/SettingsConstants');

function _setSettings(data) {
	var settings = $.extend({}, SettingsStore.getSettings(), data);
	localStorage.setItem('settings', JSON.stringify(settings));
}

var SettingsStore = assign({}, EventEmitter.prototype, {

	// Emit Change event
	emitChange: function emitChange() {
		this.emit('change');
	},

	// Add change listener
	addChangeListener: function addChangeListener(callback) {
		this.on('change', callback);
	},

	// Remove change listener
	removeChangeListener: function removeChangeListener(callback) {
		this.removeListener('change', callback);
	},

	getSettings: function getSettings() {
		return JSON.parse(localStorage.getItem('settings')) || {};
	}
});

SettingsStore.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.type) {

		case SettingsConstants.SAVE_SETTINGS:
			_setSettings(action.data);
			SettingsStore.emitChange();
			break;

		default:
		//no op
	}
});

module.exports = SettingsStore;

},{"../constants/SettingsConstants":13,"../dispatcher/AppDispatcher":15,"events":23,"jquery":"jquery","object-assign":"object-assign"}],21:[function(require,module,exports){
'use strict';

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SettingsConstants = require('../constants/SettingsConstants');
var SettingsActions = require('../actions/SettingsActions');

var SettingsStore = require('./SettingsStore');

var _users = [];

var SettingsUsersStore = assign({}, EventEmitter.prototype, {

	// Emit Change event
	emitChange: function emitChange() {
		this.emit('change');
	},

	// Add change listener
	addChangeListener: function addChangeListener(callback) {
		this.on('change', callback);
	},

	// Remove change listener
	removeChangeListener: function removeChangeListener(callback) {
		this.removeListener('change', callback);
	},

	getUsers: function getUsers() {
		return _users;
	}
});

SettingsUsersStore.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.type) {

		case SettingsConstants.SAVE_SETTINGS:
			AppDispatcher.waitFor([SettingsStore.dispatchToken]);
			SettingsActions.getUsers();
			break;

		case SettingsConstants.RECEIVE_USERS:
			_users = action.data;
			SettingsUsersStore.emitChange();
			break;

		default:
		//no op
	}
});

module.exports = SettingsUsersStore;

},{"../actions/SettingsActions":1,"../constants/SettingsConstants":13,"../dispatcher/AppDispatcher":15,"./SettingsStore":20,"events":23,"object-assign":"object-assign"}],22:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $ = require('jquery');

var SettingsStore = require('./stores/SettingsStore');

var Util = (function () {
	function Util() {
		_classCallCheck(this, Util);
	}

	_createClass(Util, null, [{
		key: 'apiRequest',
		value: function apiRequest(options) {

			var defaults = {
				type: 'POST',
				dataType: 'text',
				data: {},
				error: function error(xhr, status, err) {
					console.error(options.url, status, err.toString());
				}
			};

			var appSettings = SettingsStore.getSettings();
			if (appSettings) {
				defaults.data = {
					api_group: appSettings.groupId,
					api_secret: appSettings.groupSecret
				};
			}

			var settings = $.extend(true, defaults, options);
			if (settings.data.api_group && settings.data.api_secret) {
				$.ajax('https://www.teamleader.be/api' + options.url, settings);
			}
		}
	}, {
		key: 'htmlEntities',
		value: function htmlEntities(string) {
			return string.replace(/&amp;/g, '&').replace(/&#039;/g, '\'');
		}
	}]);

	return Util;
})();

module.exports = Util;

},{"./stores/SettingsStore":20,"jquery":"jquery"}],23:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],24:[function(require,module,exports){
'use strict';

var gui = nodeRequire('nw.gui');
var mb = new gui.Menu({ type: 'menubar' });
try {
  mb.createMacBuiltin('Teamleader Time', {
    hideEdit: false });
  gui.Window.get().menu = mb;
} catch (ex) {
  console.log(ex.message);
}

var React = require('react');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;

var TeamleaderTimeApp = require('./components/TeamleaderTimeApp.react');
var Tracker = require('./components/Tracker.react');
var Settings = require('./components/Settings.react');

var routes = React.createElement(
  Route,
  { name: 'app', path: '/', handler: TeamleaderTimeApp },
  React.createElement(Route, { name: 'settings', handler: Settings }),
  React.createElement(DefaultRoute, { name: 'tracker', handler: Tracker })
);

Router.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.body);
});

},{"./components/Settings.react":6,"./components/TeamleaderTimeApp.react":9,"./components/Tracker.react":11,"react":"react","react-router":"react-router"}]},{},[24])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL01pbGVzdG9uZVNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvUHJvamVjdFNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvU2VsZWN0SW5wdXQucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1NldHRpbmdzLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UYXNrU2VsZWN0Q29udGFpbmVyLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UYXNrVHlwZVNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVGVhbWxlYWRlclRpbWVBcHAucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1RleHRJbnB1dC5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVHJhY2tlci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVXNlclNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL0N1c3RvbWVyU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvTWlsZXN0b25lU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvTWlsZXN0b25lVGFza1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1Byb2plY3RTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3N0b3Jlcy9TZXR0aW5nc1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1NldHRpbmdzVXNlcnNTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3V0aWwuanN4Iiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0NBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFOUIsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDM0QsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzs7QUFFbEUsTUFBTSxDQUFDLE9BQU8sR0FBRzs7QUFFZixhQUFZLEVBQUUsc0JBQVMsSUFBSSxFQUFFO0FBQzNCLGVBQWEsQ0FBQyxRQUFRLENBQUM7QUFDckIsT0FBSSxFQUFFLGlCQUFpQixDQUFDLGFBQWE7QUFDckMsT0FBSSxFQUFFLElB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QUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNqRCxPQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3hELEtBQUMsQ0FBQyxJQUFJLENBQUMsK0JBQStCLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRTtHQUNEOzs7U0FFa0Isc0JBQUMsTUFBTSxFQUFFO0FBQzNCLFVBQU8sTUFBTSxDQUNYLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQ3RCLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBRyxDQUFDLENBQUM7R0FDMUI7OztRQS9CSSxJQUFJOzs7QUFtQ1YsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7OztBQ3hDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVTQSxJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDaEMsSUFBSSxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7QUFDekMsSUFBSTtBQUNGLElBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRTtBQUNyQyxZQUFRLEVBQUUsS0FBSyxFQUNoQixDQUFDLENBQUM7QUFDSCxLQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7Q0FDNUIsQ0FBQyxPQUFNLEVBQUUsRUFBRTtBQUNWLFNBQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQ3pCOztBQUVELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDckMsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztBQUN2QyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDOztBQUV6QixJQUFJLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0FBQ3hFLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3BELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDOztBQUV0RCxJQUFJLE1BQU0sR0FDUjtBQUFDLE9BQUs7SUFBQyxJQUFJLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixBQUFDO0VBQ3BELG9CQUFDLEtBQUssSUFBQyxJQUFJLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBRSxRQUFRLEFBQUMsR0FBRTtFQUMzQyxvQkFBQyxZQUFZLElBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxPQUFPLEVBQUUsT0FBTyxBQUFDLEdBQUU7Q0FDMUMsQUFDVCxDQUFDOztBQUVGLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsT0FBTyxFQUFFO0FBQ3BDLE9BQUssQ0FBQyxNQUFNLENBQUMsb0JBQUMsT0FBTyxPQUFFLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ3pDLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIFNldHRpbmdzQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1NldHRpbmdzQ29uc3RhbnRzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIHNhdmVTZXR0aW5nczogZnVuY3Rpb24oZGF0YSkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgdHlwZTogU2V0dGluZ3NDb25zdGFudHMuU0FWRV9TRVRUSU5HUyxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSxcblxuICBnZXRVc2VyczogZnVuY3Rpb24oZGF0YSkge1xuXHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHR1cmw6ICcvZ2V0VXNlcnMucGhwJyxcblx0XHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdFx0Ly9yZXZpdmVyIGZ1bmN0aW9uIHRvIHJlbmFtZSBrZXlzXG5cdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcsIGZ1bmN0aW9uKHByb3AsIHZhbCkge1xuXHRcdFx0XHRcdHN3aXRjaCAocHJvcCkge1xuXHRcdFx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRjYXNlICduYW1lJzpcblx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdCAgXHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHQgIFx0XHR0eXBlOiBTZXR0aW5nc0NvbnN0YW50cy5SRUNFSVZFX1VTRVJTLFxuXHRcdCAgXHRcdGRhdGE6IGRhdGFcblx0XHQgIFx0fSk7XG5cdCAgICB9XG5cdFx0fSk7XG4gIH1cblxufTtcbiIsIlxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgVHJhY2tlckNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJyk7XG5cbnZhciBUcmFja2VyQWN0aW9ucyA9IHtcblxuXHRnZXRQcm9qZWN0czogZnVuY3Rpb24oKSB7XG5cdFx0VXRpbC5hcGlSZXF1ZXN0KHtcblx0XHRcdHVybDogJy9nZXRQcm9qZWN0cy5waHAnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRhbW91bnQ6IDEwMCxcblx0XHRcdFx0cGFnZW5vOiAwXG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKHN0cmluZylcblx0XHRcdFx0Ly9yZXZpdmVyIGZ1bmN0aW9uIHRvIHJlbmFtZSBrZXlzXG5cdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcsIGZ1bmN0aW9uKHByb3AsIHZhbCkge1xuXHRcdFx0XHRcdHN3aXRjaCAocHJvcCkge1xuXHRcdFx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRjYXNlICd0aXRsZSc6XG5cdFx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChkYXRhLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRkYXRhLnVuc2hpZnQoeyB2YWx1ZTogMCwgbGFiZWw6ICdDaG9vc2UuLi4nIH0pO1xuXHRcdFx0XHR9XG5cblx0XHQgICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX1BST0pFQ1RTLFxuXHRcdCAgICAgIGRhdGE6IGRhdGFcblx0XHQgICAgfSk7XG4gICAgICB9XG5cdFx0fSk7XG5cdH0sXG5cblx0c2V0UHJvamVjdDogZnVuY3Rpb24oaWQpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuU0VUX1BST0pFQ1QsXG4gICAgICBpZDogaWRcbiAgICB9KTtcblx0fSxcblxuXHRnZXRQcm9qZWN0RGV0YWlsczogZnVuY3Rpb24ocHJvamVjdCkge1xuXHRcdGlmIChwcm9qZWN0ID4gMCkge1xuXHRcdFx0VXRpbC5hcGlSZXF1ZXN0KHtcblx0XHRcdFx0dXJsOiAnL2dldFByb2plY3QucGhwJyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdHByb2plY3RfaWQ6IHByb2plY3Rcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcpO1xuXHRcdFx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5TRVRfQ09OVEFDVF9PUl9DT01QQU5ZLFxuXHRcdFx0ICAgICAgb3B0aW9uOiBkYXRhLmNvbnRhY3Rfb3JfY29tcGFueSxcblx0XHRcdCAgICAgIGlkOiBkYXRhLmNvbnRhY3Rfb3JfY29tcGFueV9pZFxuXHRcdFx0ICAgIH0pO1xuXHQgICAgICB9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0Z2V0TWlsZXN0b25lczogZnVuY3Rpb24ocHJvamVjdCkge1xuXHRcdGlmIChwcm9qZWN0ID4gMCkge1xuXHRcdFx0VXRpbC5hcGlSZXF1ZXN0KHtcblx0XHRcdFx0dXJsOiAnL2dldE1pbGVzdG9uZXNCeVByb2plY3QucGhwJyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdHByb2plY3RfaWQ6IHByb2plY3Rcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcsIGZ1bmN0aW9uKHByb3AsIHZhbCkge1xuXHRcdFx0XHRcdFx0c3dpdGNoIChwcm9wKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0Y2FzZSAndGl0bGUnOlxuXHRcdFx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRmb3IgKHZhciBpID0gZGF0YS5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHRcdGlmIChkYXRhW2ldLmNsb3NlZCA9PSAxKSB7XG5cdFx0XHRcdFx0XHRcdGRhdGEuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX01JTEVTVE9ORVMsXG5cdFx0XHQgICAgICBkYXRhOiBkYXRhXG5cdFx0XHQgICAgfSk7XG5cdCAgICAgIH1cblx0XHRcdH0pO1xuXG5cdFx0fVxuXHR9LFxuXG5cdHNldE1pbGVzdG9uZTogZnVuY3Rpb24oaWQpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuU0VUX01JTEVTVE9ORSxcbiAgICAgIGlkOiBpZFxuICAgIH0pO1xuXHR9LFxuXG5cdGdldE1pbGVzdG9uZVRhc2tzOiBmdW5jdGlvbihtaWxlc3RvbmUpIHtcblxuXHRcdGlmIChtaWxlc3RvbmUgPiAwKSB7XG5cblx0XHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHRcdHVybDogJy9nZXRUYXNrc0J5TWlsZXN0b25lLnBocCcsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRtaWxlc3RvbmVfaWQ6IG1pbGVzdG9uZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdFx0Ly9yZXZpdmVyIGZ1bmN0aW9uIHRvIHJlbmFtZSBrZXlzXG5cdFx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZywgZnVuY3Rpb24ocHJvcCwgdmFsKSB7XG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdkZXNjcmlwdGlvbic6XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSBkYXRhLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0uZG9uZSA9PSAxKSB7XG5cdFx0XHRcdFx0XHRcdGRhdGEuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHZhciBhcHBTZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpO1xuXHRcdFx0XHRcdGlmIChhcHBTZXR0aW5ncyAmJiBhcHBTZXR0aW5ncy51c2VyTmFtZSkge1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IGRhdGEubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChkYXRhW2ldLm93bmVyX25hbWUgIT0gYXBwU2V0dGluZ3MudXNlck5hbWUpIHtcblx0XHRcdFx0XHRcdFx0XHRkYXRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChkYXRhLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdGRhdGEucHVzaCh7IHZhbHVlOiAnbmV3JywgbGFiZWw6ICdOZXcgdGFzay4uLicgfSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHQgICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHQgICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfTUlMRVNUT05FX1RBU0tTLFxuXHRcdFx0ICAgICAgZGF0YTogZGF0YVxuXHRcdFx0ICAgIH0pO1xuXHQgICAgICB9XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0fSxcblxuXHRzZXRNaWxlc3RvbmVUYXNrOiBmdW5jdGlvbihpZCkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FX1RBU0ssXG4gICAgICBpZDogaWRcbiAgICB9KTtcblx0fVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNrZXJBY3Rpb25zO1xuIiwiXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgVHJhY2tlckFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJyk7XG52YXIgUHJvamVjdFN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL1Byb2plY3RTdG9yZScpO1xudmFyIE1pbGVzdG9uZVN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL01pbGVzdG9uZVN0b3JlJyk7XG52YXIgU2VsZWN0SW5wdXQgPSByZXF1aXJlKCcuL1NlbGVjdElucHV0LnJlYWN0Jyk7XG5cbnZhciBNaWxlc3RvbmVTZWxlY3RDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0TWlsZXN0b25lc1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bWlsZXN0b25lczogTWlsZXN0b25lU3RvcmUuZ2V0TWlsZXN0b25lcygpLFxuXHRcdFx0bWlsZXN0b25lOiBNaWxlc3RvbmVTdG9yZS5nZXRNaWxlc3RvbmUoKVxuXHRcdH1cblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmdldE1pbGVzdG9uZXNTdGF0ZSgpO1xuXHR9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldE1pbGVzdG9uZXNTdGF0ZSgpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0VHJhY2tlckFjdGlvbnMuZ2V0TWlsZXN0b25lcyhQcm9qZWN0U3RvcmUuZ2V0UHJvamVjdCgpKTtcbiAgXHRNaWxlc3RvbmVTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdE1pbGVzdG9uZVN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cdFx0VHJhY2tlckFjdGlvbnMuc2V0TWlsZXN0b25lKHRhcmdldC52YWx1ZSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS5taWxlc3RvbmVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cdFx0cmV0dXJuIChcblx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJtaWxlc3RvbmVcIj5NaWxlc3RvbmU8L2xhYmVsPlxuXHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0PFNlbGVjdElucHV0IFxuXHRcdFx0XHRcdFx0aWQ9XCJtaWxlc3RvbmVcIiBcblx0XHRcdFx0XHRcdHJlZj1cIm1pbGVzdG9uZVwiIFxuXHRcdFx0XHRcdFx0dmFsdWU9e3RoaXMuc3RhdGUubWlsZXN0b25lfVxuXHRcdFx0XHRcdFx0b3B0aW9ucz17dGhpcy5zdGF0ZS5taWxlc3RvbmVzfSBcblx0XHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHRcdFx0Lz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBNaWxlc3RvbmVTZWxlY3RDb250YWluZXI7IiwiXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgVHJhY2tlckFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJyk7XG52YXIgUHJvamVjdFN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL1Byb2plY3RTdG9yZScpO1xudmFyIFNlbGVjdElucHV0ID0gcmVxdWlyZSgnLi9TZWxlY3RJbnB1dC5yZWFjdCcpO1xuXG52YXIgUHJvamVjdFNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRQcm9qZWN0c1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJvamVjdHM6IFByb2plY3RTdG9yZS5nZXRQcm9qZWN0cygpLFxuXHRcdFx0cHJvamVjdDogUHJvamVjdFN0b3JlLmdldFByb2plY3QoKVxuXHRcdH1cblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFByb2plY3RzU3RhdGUoKTtcblx0fSxcblxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRQcm9qZWN0c1N0YXRlKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRUcmFja2VyQWN0aW9ucy5nZXRQcm9qZWN0cygpO1xuICBcdFByb2plY3RTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFByb2plY3RTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdFRyYWNrZXJBY3Rpb25zLnNldFByb2plY3QodGFyZ2V0LnZhbHVlKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwicHJvamVjdFwiPlByb2plY3Q8L2xhYmVsPlxuXHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0PFNlbGVjdElucHV0IFxuXHRcdFx0XHRcdFx0aWQ9XCJwcm9qZWN0XCIgXG5cdFx0XHRcdFx0XHRyZWY9XCJwcm9qZWN0XCIgXG5cdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS5wcm9qZWN0fVxuXHRcdFx0XHRcdFx0b3B0aW9ucz17dGhpcy5zdGF0ZS5wcm9qZWN0c30gXG5cdFx0XHRcdFx0XHRvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IFxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvamVjdFNlbGVjdENvbnRhaW5lcjtcbiIsIlxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgU2VsZWN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblxuICBcdHZhciBvcHRpb25Ob2RlcyA9IHRoaXMucHJvcHMub3B0aW9ucy5tYXAoZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgXHQ8b3B0aW9uIGtleT17b3B0aW9uLnZhbHVlfSB2YWx1ZT17b3B0aW9uLnZhbHVlfSA+e1V0aWwuaHRtbEVudGl0aWVzKG9wdGlvbi5sYWJlbCl9PC9vcHRpb24+XG4gICAgICApO1xuICBcdH0pO1xuXG5cdFx0cmV0dXJuIChcblx0ICBcdDxzZWxlY3QgXG5cdCAgXHRcdHsuLi50aGlzLnByb3BzfSBcblx0ICBcdFx0Y2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgXG5cdFx0XHQ+XG5cdCAgXHRcdHtvcHRpb25Ob2Rlc31cblx0ICBcdDwvc2VsZWN0PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdElucHV0OyIsIlxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcbnZhciBMaW5rID0gUm91dGVyLkxpbms7XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xudmFyIFNldHRpbmdzU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvU2V0dGluZ3NTdG9yZScpO1xudmFyIFNldHRpbmdzVXNlcnNTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9TZXR0aW5nc1VzZXJzU3RvcmUnKTtcbnZhciBTZXR0aW5nc0FjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucycpO1xudmFyIFRleHRJbnB1dCA9IHJlcXVpcmUoJy4vVGV4dElucHV0LnJlYWN0Jyk7XG52YXIgU2VsZWN0SW5wdXQgPSByZXF1aXJlKCcuL1NlbGVjdElucHV0LnJlYWN0Jyk7XG52YXIgVXNlclNlbGVjdENvbnRhaW5lciA9IHJlcXVpcmUoJy4vVXNlclNlbGVjdENvbnRhaW5lci5yZWFjdCcpO1xuXG52YXIgU2V0dGluZ3MgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gU2V0dGluZ3NTdG9yZS5nZXRTZXR0aW5ncygpO1xuICB9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZShTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRTZXR0aW5nc1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0U2V0dGluZ3NTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0aGFuZGxlU3VibWl0OiBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIGdyb3VwSWQgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuZ3JvdXBJZCkudmFsdWUudHJpbSgpO1xuXHRcdHZhciBncm91cFNlY3JldCA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5ncm91cFNlY3JldCkudmFsdWUudHJpbSgpO1xuXHRcdGlmICghZ3JvdXBTZWNyZXQgfHwgIWdyb3VwSWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgY29udGFpbmVyID0gdGhpcy5yZWZzLnVzZXJTZWxlY3RDb250YWluZXI7XG5cdFx0dmFyIHNlbGVjdCA9IGNvbnRhaW5lci5yZWZzLnVzZXJTZWxlY3Q7XG5cdFx0dmFyIHNlbGVjdE5vZGUgPSBSZWFjdC5maW5kRE9NTm9kZShzZWxlY3QpO1xuXG5cdFx0U2V0dGluZ3NBY3Rpb25zLnNhdmVTZXR0aW5ncyh7XG5cdFx0XHRncm91cElkOiBncm91cElkLFxuXHRcdFx0Z3JvdXBTZWNyZXQ6IGdyb3VwU2VjcmV0LFxuXHRcdFx0dXNlcklkOiBzZWxlY3QgPyBzZWxlY3ROb2RlLnZhbHVlIDogMCxcblx0XHRcdHVzZXJOYW1lOiBzZWxlY3QgPyAkKHNlbGVjdE5vZGUpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnRleHQoKSA6ICcnXG5cdFx0fSk7XG5cblx0XHRyZXR1cm47XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJzZXR0aW5nc1wiPlxuXHRcdFx0XHQ8Zm9ybSBjbGFzc05hbWU9XCJmb3JtLWhvcml6b250YWxcIiBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuXHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwiZ3JvdXAtaWRcIj5Hcm91cCBJRDwvbGFiZWw+XG5cdFx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdCAgICBcdDxUZXh0SW5wdXQgaWQ9XCJncm91cC1pZFwiIHJlZj1cImdyb3VwSWRcIiBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUuZ3JvdXBJZH0gLz5cblx0XHRcdFx0ICAgIDwvZGl2PlxuXHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwiZ3JvdXAtc2VjcmV0XCI+R3JvdXAgU2VjcmV0PC9sYWJlbD5cblx0XHRcdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0ICAgIFx0PFRleHRJbnB1dCBpZD1cImdyb3VwLXNlY3JldFwiIHJlZj1cImdyb3VwU2VjcmV0XCIgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLmdyb3VwU2VjcmV0fSAvPlxuXHRcdFx0XHQgICAgPC9kaXY+XG5cdFx0XHRcdCAgPC9kaXY+XG5cdFx0XHRcdCAgPFVzZXJTZWxlY3RDb250YWluZXIgXG5cdFx0XHRcdCAgXHRyZWY9XCJ1c2VyU2VsZWN0Q29udGFpbmVyXCJcblx0XHRcdFx0ICAgIHVzZXJJZD17dGhpcy5zdGF0ZS51c2VySWR9XG5cdFx0XHRcdFx0Lz5cblx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi10b29sYmFyXCI+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIHNhdmUtc2V0dGluZ3MtYnRuXCI+U2F2ZTwvYnV0dG9uPiBcblx0XHRcdFx0XHRcdDxMaW5rIHRvPVwidHJhY2tlclwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4tc20gYmFjay1zZXR0aW5ncy1idG5cIj5CYWNrPC9MaW5rPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcbiIsIlxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIFRyYWNrZXJBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucycpO1xudmFyIE1pbGVzdG9uZVN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL01pbGVzdG9uZVN0b3JlJyk7XG52YXIgTWlsZXN0b25lVGFza1N0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL01pbGVzdG9uZVRhc2tTdG9yZScpO1xudmFyIFNlbGVjdElucHV0ID0gcmVxdWlyZSgnLi9TZWxlY3RJbnB1dC5yZWFjdCcpO1xudmFyIFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyID0gcmVxdWlyZSgnLi9UYXNrVHlwZVNlbGVjdENvbnRhaW5lci5yZWFjdCcpO1xuXG52YXIgVGFza1NlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRUYXNrc1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGFza3M6IE1pbGVzdG9uZVRhc2tTdG9yZS5nZXRNaWxlc3RvbmVUYXNrcygpLFxuXHRcdFx0dGFzazogTWlsZXN0b25lVGFza1N0b3JlLmdldE1pbGVzdG9uZVRhc2soKVxuXHRcdH1cblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFRhc2tzU3RhdGUoKTtcblx0fSxcblxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRUYXNrc1N0YXRlKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRUcmFja2VyQWN0aW9ucy5nZXRNaWxlc3RvbmVUYXNrcyhNaWxlc3RvbmVTdG9yZS5nZXRNaWxlc3RvbmUoKSk7XG4gIFx0TWlsZXN0b25lVGFza1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0TWlsZXN0b25lVGFza1N0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cdFx0VHJhY2tlckFjdGlvbnMuc2V0TWlsZXN0b25lVGFzayh0YXJnZXQudmFsdWUpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUudGFza3MubGVuZ3RoID4gMSkge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwibWlsZXN0b25lLXRhc2tcIj5Ub2RvPC9sYWJlbD5cblx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0XHQ8U2VsZWN0SW5wdXQgXG5cdFx0XHRcdFx0XHRcdGlkPVwibWlsZXN0b25lLXRhc2tcIiBcblx0XHRcdFx0XHRcdFx0cmVmPVwibWlsZXN0b25lVGFza1wiIFxuXHRcdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS50YXNrfSBcblx0XHRcdFx0XHRcdFx0b3B0aW9ucz17dGhpcy5zdGF0ZS50YXNrc30gXG5cdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY3VzdG9tLXRhc2tcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0XHQgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cInRhc2stdHlwZVwiPlR5cGU8L2xhYmVsPlxuXHRcdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdCAgXHQ8VGFza1R5cGVTZWxlY3RDb250YWluZXIgLz5cblx0XHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cblx0XHRcdFx0XHQgIFx0PHRleHRhcmVhIGlkPVwidGFzay1kZXNjcmlwdGlvblwiIHJlZj1cInRhc2tEZXNjcmlwdGlvblwiIHBsYWNlaG9sZGVyPVwiVGFzayBkZXNjcmlwdGlvbi4uLlwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHJvd3M9XCIzXCI+PC90ZXh0YXJlYT5cblx0XHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdCk7XG5cdFx0fVxuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUYXNrU2VsZWN0Q29udGFpbmVyO1xuIiwiXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcbnZhciBTZWxlY3RJbnB1dCA9IHJlcXVpcmUoJy4vU2VsZWN0SW5wdXQucmVhY3QnKTtcblxudmFyIFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRhc2tUeXBlczogW11cblx0XHR9XG5cdH0sXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcblxuXHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHR1cmw6ICcvZ2V0VGFza1R5cGVzLnBocCcsXG5cdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0Y2FzZSAnbmFtZSc6XG5cdFx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHRhc2tUeXBlczogZGF0YSB9KTtcbiAgICAgIH1cblx0XHR9KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PFNlbGVjdElucHV0IGlkPVwidGFzay10eXBlXCIgcmVmPVwidGFza1R5cGVcIiBvcHRpb25zPXt0aGlzLnN0YXRlLnRhc2tUeXBlc30gLz5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUYXNrVHlwZVNlbGVjdENvbnRhaW5lcjtcbiIsIlxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcbnZhciBMaW5rID0gUm91dGVyLkxpbms7XG52YXIgUm91dGVIYW5kbGVyID0gUm91dGVyLlJvdXRlSGFuZGxlcjtcblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXI7XG5cblxudmFyIFRlYW1sZWFkZXJUaW1lQXBwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhcHBcIj5cblx0ICBcdFx0PGhlYWRlcj5cblx0ICBcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImhlYWRlcmV4dFwiPjwvZGl2PlxuXHQgIFx0XHRcdDxMaW5rIHRvPVwic2V0dGluZ3NcIiBjbGFzc05hbWU9XCJzZXR0aW5ncy1saW5rXCIgYWN0aXZlQ2xhc3NOYW1lPVwiYWN0aXZlXCI+XG5cdCAgXHRcdFx0XHQ8aSBjbGFzc05hbWU9XCJmYSBmYS1jb2dcIj48L2k+XG5cdCAgXHRcdFx0PC9MaW5rPlxuXHQgIFx0XHQ8L2hlYWRlcj5cblxuICAgICAgICB7LyogdGhpcyBpcyB0aGUgaW1wb3J0YW50IHBhcnQgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgPFJvdXRlSGFuZGxlci8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbWxlYWRlclRpbWVBcHA7XG4iLCJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBUZXh0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Ly8gZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0Ly8gXHRyZXR1cm4geyB2YWx1ZTogJycgfTtcblx0Ly8gfSxcblxuXHQvLyBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcblx0Ly8gXHR0aGlzLnNldFN0YXRlKHsgdmFsdWU6IG5leHRQcm9wcy5zYXZlZFZhbHVlIH0pO1xuXHQvLyB9LFxuXG5cdC8vIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0Ly8gXHR0aGlzLnNldFN0YXRlKHsgdmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZSB9KTtcbiAvLyAgfSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdC8vdmFyIHZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZTtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGlucHV0IFxuXHRcdFx0XHR7Li4udGhpcy5wcm9wc31cblx0XHRcdFx0dHlwZT1cInRleHRcIiBcblx0XHRcdFx0Y2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgXG5cdFx0XHRcdC8vdmFsdWU9e3ZhbHVlfVxuXHRcdFx0XHQvL29uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHQvPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRJbnB1dDsiLCJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBDdXN0b21lclN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL0N1c3RvbWVyU3RvcmUnKTtcbnZhciBQcm9qZWN0U3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvUHJvamVjdFN0b3JlJyk7XG52YXIgTWlsZXN0b25lU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvTWlsZXN0b25lU3RvcmUnKTtcbnZhciBNaWxlc3RvbmVUYXNrU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvTWlsZXN0b25lVGFza1N0b3JlJyk7XG5cbnZhciBQcm9qZWN0U2VsZWN0Q29udGFpbmVyID0gcmVxdWlyZSgnLi9Qcm9qZWN0U2VsZWN0Q29udGFpbmVyLnJlYWN0Jyk7XG52YXIgTWlsZXN0b25lU2VsZWN0Q29udGFpbmVyID0gcmVxdWlyZSgnLi9NaWxlc3RvbmVTZWxlY3RDb250YWluZXIucmVhY3QnKTtcbnZhciBUYXNrU2VsZWN0Q29udGFpbmVyID0gcmVxdWlyZSgnLi9UYXNrU2VsZWN0Q29udGFpbmVyLnJlYWN0Jyk7XG5cbnZhciBUcmFja2VyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldFRyYWNrZXJTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHByb2plY3Q6IFByb2plY3RTdG9yZS5nZXRQcm9qZWN0KCksXG5cdFx0XHRtaWxlc3RvbmU6IE1pbGVzdG9uZVN0b3JlLmdldE1pbGVzdG9uZSgpLFxuXHRcdFx0bWlsZXN0b25lVGFzazogTWlsZXN0b25lVGFza1N0b3JlLmdldE1pbGVzdG9uZVRhc2soKSxcblx0XHRcdGNvbnRhY3RPckNvbXBhbnk6IEN1c3RvbWVyU3RvcmUuZ2V0Q29udGFjdE9yQ29tcGFueSgpLFxuXHRcdFx0Y29udGFjdE9yQ29tcGFueUlkOiBDdXN0b21lclN0b3JlLmdldENvbnRhY3RPckNvbXBhbnlJZCgpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VHJhY2tlclN0YXRlKClcblx0fSxcblxuXHRoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zb2xlLmxvZyh0aGlzLmdldFRyYWNrZXJTdGF0ZSgpKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInRyYWNrZXJcIj5cblx0XHRcdFx0PGZvcm0gY2xhc3NOYW1lPVwiZm9ybS1ob3Jpem9udGFsXCIgb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cblxuXHRcdFx0XHRcdDxQcm9qZWN0U2VsZWN0Q29udGFpbmVyIC8+XG5cdFx0XHRcdFx0PE1pbGVzdG9uZVNlbGVjdENvbnRhaW5lciAvPlxuXHRcdFx0XHRcdDxUYXNrU2VsZWN0Q29udGFpbmVyIC8+XG5cblx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi10b29sYmFyXCI+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIHN0YXJ0LXRpbWVyLWJ0blwiPlxuXHRcdFx0XHRcdFx0XHRTdGFydCB0aW1lclxuXHRcdFx0XHRcdFx0PC9idXR0b24+IFxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFja2VyXG4iLCJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcbnZhciBMaW5rID0gUm91dGVyLkxpbms7XG5cbnZhciBTZXR0aW5nc1N0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL1NldHRpbmdzU3RvcmUnKTtcbnZhciBTZXR0aW5nc1VzZXJzU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvU2V0dGluZ3NVc2Vyc1N0b3JlJyk7XG52YXIgU2V0dGluZ3NBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9TZXR0aW5nc0FjdGlvbnMnKTtcblxudmFyIFNlbGVjdElucHV0ID0gcmVxdWlyZSgnLi9TZWxlY3RJbnB1dC5yZWFjdCcpO1xuXG52YXIgVXNlclNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRVc2Vyc1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0J3VzZXJzJzogU2V0dGluZ3NVc2Vyc1N0b3JlLmdldFVzZXJzKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRVc2Vyc1N0YXRlKCk7XG4gIH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0VXNlcnNTdGF0ZSgpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0U2V0dGluZ3NBY3Rpb25zLmdldFVzZXJzKCk7XG4gIFx0U2V0dGluZ3NVc2Vyc1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0U2V0dGluZ3NVc2Vyc1N0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLnVzZXJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cdFx0cmV0dXJuIChcblx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJ1c2VyLXNlbGVjdFwiPlNlbGVjdCB1c2VyPC9sYWJlbD5cblx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdCAgICBcdDxTZWxlY3RJbnB1dCBcblx0XHQgICAgXHRcdGlkPVwidXNlci1zZWxlY3RcIiBcblx0XHQgICAgXHRcdHJlZj1cInVzZXJTZWxlY3RcIiBcblx0XHQgICAgXHRcdG9wdGlvbnM9e3RoaXMuc3RhdGUudXNlcnN9IFxuXHRcdCAgICBcdFx0ZGVmYXVsdFZhbHVlPXt0aGlzLnByb3BzLnVzZXJJZH1cblx0XHQgICAgXHQvPlxuXHRcdCAgICA8L2Rpdj5cblx0XHQgIDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJTZWxlY3RDb250YWluZXI7XG4iLCJcbnZhciBrZXlNaXJyb3IgPSByZXF1aXJlKCdrZXltaXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3Ioe1xuXHRTQVZFX1NFVFRJTkdTOiBudWxsLFxuXHRSRUNFSVZFX1VTRVJTOiBudWxsXG59KTtcbiIsIlxudmFyIGtleU1pcnJvciA9IHJlcXVpcmUoJ2tleW1pcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcih7XG5cdFJFQ0VJVkVfUFJPSkVDVFM6IG51bGwsXG5cdFJFQ0VJVkVfTUlMRVNUT05FUzogbnVsbCxcblx0UkVDRUlWRV9NSUxFU1RPTkVfVEFTS1M6IG51bGwsXG5cdFNFVF9QUk9KRUNUOiBudWxsLFxuXHRTRVRfTUlMRVNUT05FOiBudWxsLFxuXHRTRVRfTUlMRVNUT05FX1RBU0s6IG51bGwsXG5cdFNFVF9DT05UQUNUX09SX0NPTVBBTlk6IG51bGxcbn0pO1xuIiwiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQXBwRGlzcGF0Y2hlclxuICpcbiAqIEEgc2luZ2xldG9uIHRoYXQgb3BlcmF0ZXMgYXMgdGhlIGNlbnRyYWwgaHViIGZvciBhcHBsaWNhdGlvbiB1cGRhdGVzLlxuICovXG5cbnZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IERpc3BhdGNoZXIoKTtcbiIsIlxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgVHJhY2tlckNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJyk7XG52YXIgVHJhY2tlckFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJyk7XG5cbnZhciBfY29udGFjdE9yQ29tcGFueTtcbnZhciBfY29udGFjdE9yQ29tcGFueUlkO1xuXG52YXIgQ3VzdG9tZXJTdG9yZSA9IGFzc2lnbih7fSwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gIC8vIEVtaXQgQ2hhbmdlIGV2ZW50XG4gIGVtaXRDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gIH0sXG5cbiAgLy8gQWRkIGNoYW5nZSBsaXN0ZW5lclxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLy8gUmVtb3ZlIGNoYW5nZSBsaXN0ZW5lclxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH0sXG5cblx0Z2V0Q29udGFjdE9yQ29tcGFueTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9jb250YWN0T3JDb21wYW55O1xuXHR9LFxuXG5cdGdldENvbnRhY3RPckNvbXBhbnlJZDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9jb250YWN0T3JDb21wYW55SWQ7XG5cdH1cbn0pO1xuXG5DdXN0b21lclN0b3JlLmRpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKChhY3Rpb24pID0+IHtcblxuXHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX0NPTlRBQ1RfT1JfQ09NUEFOWTpcblx0XHRcdF9jb250YWN0T3JDb21wYW55ID0gYWN0aW9uLm9wdGlvbjtcblx0XHRcdF9jb250YWN0T3JDb21wYW55SWQgPSBhY3Rpb24uaWQ7XG5cdFx0XHRDdXN0b21lclN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8vbm8gb3Bcblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDdXN0b21lclN0b3JlO1xuIiwiXG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBUcmFja2VyQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnKTtcbnZhciBUcmFja2VyQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnKTtcbnZhciBQcm9qZWN0U3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvUHJvamVjdFN0b3JlJyk7XG5cbnZhciBfbWlsZXN0b25lcyA9IFtdO1xudmFyIF9zZWxlY3RlZDtcblxudmFyIE1pbGVzdG9uZVN0b3JlID0gYXNzaWduKHt9LCBFdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgLy8gRW1pdCBDaGFuZ2UgZXZlbnRcbiAgZW1pdENoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbWl0KCdjaGFuZ2UnKTtcbiAgfSxcblxuICAvLyBBZGQgY2hhbmdlIGxpc3RlbmVyXG4gIGFkZENoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHRoaXMub24oJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfSxcblxuICAvLyBSZW1vdmUgY2hhbmdlIGxpc3RlbmVyXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfSxcblxuXHRnZXRNaWxlc3RvbmVzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gX21pbGVzdG9uZXM7XG5cdH0sXG5cblx0Z2V0TWlsZXN0b25lOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gX3NlbGVjdGVkO1xuXHR9XG59KTtcblxuTWlsZXN0b25lU3RvcmUuZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoKGFjdGlvbikgPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfUFJPSkVDVDpcblx0XHRcdEFwcERpc3BhdGNoZXIud2FpdEZvcihbUHJvamVjdFN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcblx0XHRcdF9taWxlc3RvbmVzID0gW107XG5cdFx0XHRfc2VsZWN0ZWQgPSAwO1xuXHRcdFx0TWlsZXN0b25lU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVTOlxuXHRcdFx0X21pbGVzdG9uZXMgPSBhY3Rpb24uZGF0YTtcblx0XHRcdGlmIChfbWlsZXN0b25lcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KF9taWxlc3RvbmVzWzBdLnZhbHVlKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ21pbGVzdG9uZScsIF9zZWxlY3RlZCk7XG5cdFx0XHR9XG5cdFx0XHRNaWxlc3RvbmVTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cblx0XHRcdFRyYWNrZXJBY3Rpb25zLmdldE1pbGVzdG9uZVRhc2tzKF9zZWxlY3RlZCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FOlxuXHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoYWN0aW9uLmlkKTtcblx0XHRcdGNvbnNvbGUubG9nKCdtaWxlc3RvbmUnLCBfc2VsZWN0ZWQpO1xuXHRcdFx0TWlsZXN0b25lU3RvcmUuZW1pdENoYW5nZSgpO1xuXG5cdFx0XHRUcmFja2VyQWN0aW9ucy5nZXRNaWxlc3RvbmVUYXNrcyhfc2VsZWN0ZWQpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1pbGVzdG9uZVN0b3JlO1xuIiwiXG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBUcmFja2VyQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnKTtcbnZhciBNaWxlc3RvbmVTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9NaWxlc3RvbmVTdG9yZScpO1xuXG52YXIgX3Rhc2tzID0gW107XG52YXIgX3NlbGVjdGVkO1xuXG52YXIgTWlsZXN0b25lVGFza1N0b3JlICA9IGFzc2lnbih7fSwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gIC8vIEVtaXQgQ2hhbmdlIGV2ZW50XG4gIGVtaXRDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gIH0sXG5cbiAgLy8gQWRkIGNoYW5nZSBsaXN0ZW5lclxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLy8gUmVtb3ZlIGNoYW5nZSBsaXN0ZW5lclxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH0sXG5cblx0Z2V0TWlsZXN0b25lVGFza3M6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBfdGFza3M7XG5cdH0sXG5cblx0Z2V0TWlsZXN0b25lVGFzazogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9zZWxlY3RlZDtcblx0fVxufSk7XG5cbk1pbGVzdG9uZVRhc2tTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcigoYWN0aW9uKSA9PiB7XG5cblx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9QUk9KRUNUOlxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FOlxuXHRcdFx0QXBwRGlzcGF0Y2hlci53YWl0Rm9yKFtNaWxlc3RvbmVTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG5cdFx0XHRfdGFza3MgPSBbXTtcblx0XHRcdF9zZWxlY3RlZCA9IDA7XG5cdFx0XHRNaWxlc3RvbmVUYXNrU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVfVEFTS1M6XG5cdFx0XHRfdGFza3MgPSBhY3Rpb24uZGF0YTtcblx0XHRcdGlmIChfdGFza3MubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRfc2VsZWN0ZWQgPSBwYXJzZUludChfdGFza3NbMF0udmFsdWUpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygndGFzaycsIF9zZWxlY3RlZCk7XG5cdFx0XHR9XG5cdFx0XHRNaWxlc3RvbmVUYXNrU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX01JTEVTVE9ORV9UQVNLOlxuXHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoYWN0aW9uLmlkKTtcblx0XHRcdGNvbnNvbGUubG9nKCd0YXNrJywgX3NlbGVjdGVkKTtcblx0XHRcdE1pbGVzdG9uZVRhc2tTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvL25vIG9wXG5cdH1cblxufSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBNaWxlc3RvbmVUYXNrU3RvcmU7XG4iLCJcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xuXG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIFRyYWNrZXJDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvVHJhY2tlckNvbnN0YW50cycpO1xudmFyIFRyYWNrZXJBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucycpO1xuXG52YXIgX3Byb2plY3RzID0gW107XG52YXIgX3NlbGVjdGVkO1xuXG52YXIgUHJvamVjdFN0b3JlICA9IGFzc2lnbih7fSwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gIC8vIEVtaXQgQ2hhbmdlIGV2ZW50XG4gIGVtaXRDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gIH0sXG5cbiAgLy8gQWRkIGNoYW5nZSBsaXN0ZW5lclxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLy8gUmVtb3ZlIGNoYW5nZSBsaXN0ZW5lclxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH0sXG5cblx0Z2V0UHJvamVjdHM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBfcHJvamVjdHM7XG5cdH0sXG5cblx0Z2V0UHJvamVjdDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9zZWxlY3RlZDtcblx0fVxufSk7XG5cblByb2plY3RTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcigoYWN0aW9uKSA9PiB7XG5cblx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfUFJPSkVDVFM6XG5cdFx0XHRfcHJvamVjdHMgPSBhY3Rpb24uZGF0YTtcblx0XHRcdFByb2plY3RTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfUFJPSkVDVDpcblx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KGFjdGlvbi5pZCk7XG5cdFx0XHRjb25zb2xlLmxvZygncHJvamVjdCcsIF9zZWxlY3RlZCk7XG5cdFx0XHRQcm9qZWN0U3RvcmUuZW1pdENoYW5nZSgpO1xuXG5cdFx0XHRUcmFja2VyQWN0aW9ucy5nZXRQcm9qZWN0RGV0YWlscyhfc2VsZWN0ZWQpO1xuXHRcdFx0VHJhY2tlckFjdGlvbnMuZ2V0TWlsZXN0b25lcyhfc2VsZWN0ZWQpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2plY3RTdG9yZTtcbiIsIlxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIFNldHRpbmdzQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1NldHRpbmdzQ29uc3RhbnRzJyk7XG5cbmZ1bmN0aW9uIF9zZXRTZXR0aW5ncyhkYXRhKSB7XG5cdHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCksIGRhdGEpO1xuXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2V0dGluZ3MnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xufVxuXG52YXIgU2V0dGluZ3NTdG9yZSAgPSBhc3NpZ24oe30sIEV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcblxuICAvLyBFbWl0IENoYW5nZSBldmVudFxuICBlbWl0Q2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICB9LFxuXG4gIC8vIEFkZCBjaGFuZ2UgbGlzdGVuZXJcbiAgYWRkQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9LFxuXG4gIC8vIFJlbW92ZSBjaGFuZ2UgbGlzdGVuZXJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9LFxuXG5cdGdldFNldHRpbmdzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZ3MnKSkgfHwge307XG5cdH1cbn0pO1xuXG5cblNldHRpbmdzU3RvcmUuZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoKGFjdGlvbikgPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgU2V0dGluZ3NDb25zdGFudHMuU0FWRV9TRVRUSU5HUzpcblx0XHRcdF9zZXRTZXR0aW5ncyhhY3Rpb24uZGF0YSk7XG5cdFx0XHRTZXR0aW5nc1N0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8vbm8gb3Bcblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5nc1N0b3JlO1xuIiwiXG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBTZXR0aW5nc0NvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cycpO1xudmFyIFNldHRpbmdzQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvU2V0dGluZ3NBY3Rpb25zJyk7XG5cbnZhciBTZXR0aW5nc1N0b3JlID0gcmVxdWlyZSgnLi9TZXR0aW5nc1N0b3JlJyk7XG5cbnZhciBfdXNlcnMgPSBbXTtcblxudmFyIFNldHRpbmdzVXNlcnNTdG9yZSAgPSBhc3NpZ24oe30sIEV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcblxuICAvLyBFbWl0IENoYW5nZSBldmVudFxuICBlbWl0Q2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICB9LFxuXG4gIC8vIEFkZCBjaGFuZ2UgbGlzdGVuZXJcbiAgYWRkQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9LFxuXG4gIC8vIFJlbW92ZSBjaGFuZ2UgbGlzdGVuZXJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9LFxuXG5cdGdldFVzZXJzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gX3VzZXJzO1xuXHR9XG59KTtcblxuU2V0dGluZ3NVc2Vyc1N0b3JlLmRpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKChhY3Rpb24pID0+IHtcblxuXHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRjYXNlIFNldHRpbmdzQ29uc3RhbnRzLlNBVkVfU0VUVElOR1M6XG5cdFx0XHRBcHBEaXNwYXRjaGVyLndhaXRGb3IoW1NldHRpbmdzU3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuXHRcdFx0U2V0dGluZ3NBY3Rpb25zLmdldFVzZXJzKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgU2V0dGluZ3NDb25zdGFudHMuUkVDRUlWRV9VU0VSUzpcblx0XHRcdF91c2VycyA9IGFjdGlvbi5kYXRhO1xuXHRcdFx0U2V0dGluZ3NVc2Vyc1N0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8vbm8gb3Bcblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5nc1VzZXJzU3RvcmU7XG4iLCJcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbnZhciBTZXR0aW5nc1N0b3JlID0gcmVxdWlyZSgnLi9zdG9yZXMvU2V0dGluZ3NTdG9yZScpO1xuXG5jbGFzcyBVdGlsIHtcblx0XG5cdHN0YXRpYyBhcGlSZXF1ZXN0KG9wdGlvbnMpIHtcblxuXHRcdHZhciBkZWZhdWx0cyA9IHtcblx0XHRcdHR5cGU6ICdQT1NUJyxcblx0XHRcdGRhdGFUeXBlOiAndGV4dCcsXG5cdFx0XHRkYXRhOiB7fSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucy51cmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgfVxuXHRcdH07XG5cblx0XHR2YXIgYXBwU2V0dGluZ3MgPSBTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCk7XG5cdFx0aWYgKGFwcFNldHRpbmdzKSB7XG5cdFx0XHRkZWZhdWx0cy5kYXRhID0ge1xuXHRcdFx0XHRhcGlfZ3JvdXA6IGFwcFNldHRpbmdzLmdyb3VwSWQsXG5cdFx0XHRcdGFwaV9zZWNyZXQ6IGFwcFNldHRpbmdzLmdyb3VwU2VjcmV0XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHRydWUsIGRlZmF1bHRzLCBvcHRpb25zKTtcblx0XHRpZiAoc2V0dGluZ3MuZGF0YS5hcGlfZ3JvdXAgJiYgc2V0dGluZ3MuZGF0YS5hcGlfc2VjcmV0KSB7XG5cdFx0XHQkLmFqYXgoJ2h0dHBzOi8vd3d3LnRlYW1sZWFkZXIuYmUvYXBpJyArIG9wdGlvbnMudXJsLCBzZXR0aW5ncyk7XG5cdFx0fVxuXHR9XG5cblx0c3RhdGljIGh0bWxFbnRpdGllcyhzdHJpbmcpIHtcblx0XHRyZXR1cm4gc3RyaW5nXG5cdFx0XHQucmVwbGFjZSgvJmFtcDsvZywgJyYnKVxuXHRcdFx0LnJlcGxhY2UoLyYjMDM5Oy9nLCBcIidcIik7XG5cdH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFV0aWw7IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiXG52YXIgZ3VpID0gbm9kZVJlcXVpcmUoJ253Lmd1aScpO1xudmFyIG1iID0gbmV3IGd1aS5NZW51KHt0eXBlOiAnbWVudWJhcid9KTtcbnRyeSB7XG4gIG1iLmNyZWF0ZU1hY0J1aWx0aW4oJ1RlYW1sZWFkZXIgVGltZScsIHtcbiAgICBoaWRlRWRpdDogZmFsc2UsXG4gIH0pO1xuICBndWkuV2luZG93LmdldCgpLm1lbnUgPSBtYjtcbn0gY2F0Y2goZXgpIHtcbiAgY29uc29sZS5sb2coZXgubWVzc2FnZSk7XG59XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUm91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG52YXIgRGVmYXVsdFJvdXRlID0gUm91dGVyLkRlZmF1bHRSb3V0ZTtcbnZhciBSb3V0ZSA9IFJvdXRlci5Sb3V0ZTtcblxudmFyIFRlYW1sZWFkZXJUaW1lQXBwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1RlYW1sZWFkZXJUaW1lQXBwLnJlYWN0Jyk7XG52YXIgVHJhY2tlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9UcmFja2VyLnJlYWN0Jyk7XG52YXIgU2V0dGluZ3MgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvU2V0dGluZ3MucmVhY3QnKTtcblxudmFyIHJvdXRlcyA9IChcbiAgPFJvdXRlIG5hbWU9XCJhcHBcIiBwYXRoPVwiL1wiIGhhbmRsZXI9e1RlYW1sZWFkZXJUaW1lQXBwfT5cbiAgICA8Um91dGUgbmFtZT1cInNldHRpbmdzXCIgaGFuZGxlcj17U2V0dGluZ3N9Lz5cbiAgICA8RGVmYXVsdFJvdXRlIG5hbWU9XCJ0cmFja2VyXCIgaGFuZGxlcj17VHJhY2tlcn0vPlxuICA8L1JvdXRlPlxuKTtcblxuUm91dGVyLnJ1bihyb3V0ZXMsIGZ1bmN0aW9uIChIYW5kbGVyKSB7XG4gIFJlYWN0LnJlbmRlcig8SGFuZGxlci8+LCBkb2N1bWVudC5ib2R5KTtcbn0pO1xuIl19
