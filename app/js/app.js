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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TrackerConstants = require('../constants/TrackerConstants');
var TrackerActions = require('../actions/TrackerActions');

var _dispatchToken;
var _contactOrCompany;
var _contactOrCompanyId;

var CustomerStore = (function (_EventEmitter) {
	function CustomerStore() {
		var _this = this;

		_classCallCheck(this, CustomerStore);

		_get(Object.getPrototypeOf(CustomerStore.prototype), 'constructor', this).call(this);

		_dispatchToken = AppDispatcher.register(function (action) {

			switch (action.type) {

				case TrackerConstants.SET_CONTACT_OR_COMPANY:
					_contactOrCompany = action.option;
					_contactOrCompanyId = action.id;
					_this.emitChange();
					break;

				default:
				//no op
			}
		});
	}

	_inherits(CustomerStore, _EventEmitter);

	_createClass(CustomerStore, [{
		key: 'emitChange',

		// Emit Change event
		value: function emitChange() {
			this.emit('change');
		}
	}, {
		key: 'addChangeListener',

		// Add change listener
		value: function addChangeListener(callback) {
			this.on('change', callback);
		}
	}, {
		key: 'removeChangeListener',

		// Remove change listener
		value: function removeChangeListener(callback) {
			this.removeListener('change', callback);
		}
	}, {
		key: 'getDispatchToken',
		value: function getDispatchToken() {
			return _dispatchToken;
		}
	}, {
		key: 'getContactOrCompany',
		value: function getContactOrCompany() {
			return _contactOrCompany;
		}
	}, {
		key: 'getContactOrCompanyId',
		value: function getContactOrCompanyId() {
			return _contactOrCompanyId;
		}
	}]);

	return CustomerStore;
})(EventEmitter);

module.exports = new CustomerStore();

},{"../actions/TrackerActions":2,"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"events":23}],17:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var $ = require('jquery');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TrackerConstants = require('../constants/TrackerConstants');
var TrackerActions = require('../actions/TrackerActions');
var ProjectStore = require('../stores/ProjectStore');

var _dispatchToken;
var _milestones = [];
var _selected;

var MilestoneStore = (function (_EventEmitter) {
	function MilestoneStore() {
		var _this = this;

		_classCallCheck(this, MilestoneStore);

		_get(Object.getPrototypeOf(MilestoneStore.prototype), 'constructor', this).call(this);
		_dispatchToken = AppDispatcher.register(function (action) {

			switch (action.type) {

				case TrackerConstants.SET_PROJECT:
					AppDispatcher.waitFor([ProjectStore.getDispatchToken()]);
					_milestones = [];
					_selected = 0;
					_this.emitChange();
					break;

				case TrackerConstants.RECEIVE_MILESTONES:
					_milestones = action.data;
					if (_milestones.length > 0) {
						_selected = parseInt(_milestones[0].value);
						console.log('milestone', _selected);
					}
					_this.emitChange();

					TrackerActions.getMilestoneTasks(_selected);
					break;

				case TrackerConstants.SET_MILESTONE:
					_selected = parseInt(action.id);
					console.log('milestone', _selected);
					_this.emitChange();

					TrackerActions.getMilestoneTasks(_selected);
					break;

				default:
				//no op
			}
		});
	}

	_inherits(MilestoneStore, _EventEmitter);

	_createClass(MilestoneStore, [{
		key: 'emitChange',

		// Emit Change event
		value: function emitChange() {
			this.emit('change');
		}
	}, {
		key: 'addChangeListener',

		// Add change listener
		value: function addChangeListener(callback) {
			this.on('change', callback);
		}
	}, {
		key: 'removeChangeListener',

		// Remove change listener
		value: function removeChangeListener(callback) {
			this.removeListener('change', callback);
		}
	}, {
		key: 'getDispatchToken',
		value: function getDispatchToken() {
			return _dispatchToken;
		}
	}, {
		key: 'getMilestones',
		value: function getMilestones() {
			return _milestones;
		}
	}, {
		key: 'getMilestone',
		value: function getMilestone() {
			return _selected;
		}
	}]);

	return MilestoneStore;
})(EventEmitter);

module.exports = new MilestoneStore();

},{"../actions/TrackerActions":2,"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"../stores/ProjectStore":19,"events":23,"jquery":"jquery"}],18:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TrackerConstants = require('../constants/TrackerConstants');
var MilestoneStore = require('../stores/MilestoneStore');

var _dispatchToken;
var _tasks = [];
var _selected;

var MilestoneTaskStore = (function (_EventEmitter) {
	function MilestoneTaskStore() {
		var _this = this;

		_classCallCheck(this, MilestoneTaskStore);

		_get(Object.getPrototypeOf(MilestoneTaskStore.prototype), 'constructor', this).call(this);
		_dispatchToken = AppDispatcher.register(function (action) {

			switch (action.type) {

				case TrackerConstants.SET_PROJECT:
				case TrackerConstants.SET_MILESTONE:
					AppDispatcher.waitFor([MilestoneStore.getDispatchToken()]);
					_tasks = [];
					_selected = 0;
					_this.emitChange();
					break;

				case TrackerConstants.RECEIVE_MILESTONE_TASKS:
					_tasks = action.data;
					if (_tasks.length > 0) {
						_selected = parseInt(_tasks[0].value);
						console.log('task', _selected);
					}
					_this.emitChange();
					break;

				case TrackerConstants.SET_MILESTONE_TASK:
					_selected = parseInt(action.id);
					console.log('task', _selected);
					_this.emitChange();
					break;

				default:
				//no op
			}
		});
	}

	_inherits(MilestoneTaskStore, _EventEmitter);

	_createClass(MilestoneTaskStore, [{
		key: 'emitChange',

		// Emit Change event
		value: function emitChange() {
			this.emit('change');
		}
	}, {
		key: 'addChangeListener',

		// Add change listener
		value: function addChangeListener(callback) {
			this.on('change', callback);
		}
	}, {
		key: 'removeChangeListener',

		// Remove change listener
		value: function removeChangeListener(callback) {
			this.removeListener('change', callback);
		}
	}, {
		key: 'getDispatchToken',
		value: function getDispatchToken() {
			return _dispatchToken;
		}
	}, {
		key: 'getMilestoneTasks',
		value: function getMilestoneTasks() {
			return _tasks;
		}
	}, {
		key: 'getMilestoneTask',
		value: function getMilestoneTask() {
			return _selected;
		}
	}]);

	return MilestoneTaskStore;
})(EventEmitter);

module.exports = new MilestoneTaskStore();

},{"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"../stores/MilestoneStore":17,"events":23}],19:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TrackerConstants = require('../constants/TrackerConstants');
var TrackerActions = require('../actions/TrackerActions');

var _dispatchToken;
var _projects = [];
var _selected;

var ProjectStore = (function (_EventEmitter) {
	function ProjectStore() {
		var _this = this;

		_classCallCheck(this, ProjectStore);

		_get(Object.getPrototypeOf(ProjectStore.prototype), 'constructor', this).call(this);
		_dispatchToken = AppDispatcher.register(function (action) {

			switch (action.type) {

				case TrackerConstants.RECEIVE_PROJECTS:
					_projects = action.data;
					_this.emitChange();
					break;

				case TrackerConstants.SET_PROJECT:
					_selected = parseInt(action.id);
					console.log('project', _selected);
					_this.emitChange();

					TrackerActions.getProjectDetails(_selected);
					TrackerActions.getMilestones(_selected);
					break;

				default:
				//no op
			}
		});
	}

	_inherits(ProjectStore, _EventEmitter);

	_createClass(ProjectStore, [{
		key: 'emitChange',

		// Emit Change event
		value: function emitChange() {
			this.emit('change');
		}
	}, {
		key: 'addChangeListener',

		// Add change listener
		value: function addChangeListener(callback) {
			this.on('change', callback);
		}
	}, {
		key: 'removeChangeListener',

		// Remove change listener
		value: function removeChangeListener(callback) {
			this.removeListener('change', callback);
		}
	}, {
		key: 'getDispatchToken',
		value: function getDispatchToken() {
			return _dispatchToken;
		}
	}, {
		key: 'getProjects',
		value: function getProjects() {
			return _projects;
		}
	}, {
		key: 'getProject',
		value: function getProject() {
			return _selected;
		}
	}]);

	return ProjectStore;
})(EventEmitter);

module.exports = new ProjectStore();

},{"../actions/TrackerActions":2,"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"events":23}],20:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var $ = require('jquery');

var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SettingsConstants = require('../constants/SettingsConstants');

var _dispatchToken;

var SettingsStore = (function (_EventEmitter) {
	function SettingsStore() {
		var _this = this;

		_classCallCheck(this, SettingsStore);

		_get(Object.getPrototypeOf(SettingsStore.prototype), 'constructor', this).call(this);
		_dispatchToken = AppDispatcher.register(function (action) {

			switch (action.type) {

				case SettingsConstants.SAVE_SETTINGS:
					_this.setSettings(action.data);
					_this.emitChange();
					break;

				default:
				//no op
			}
		});
	}

	_inherits(SettingsStore, _EventEmitter);

	_createClass(SettingsStore, [{
		key: 'emitChange',

		// Emit Change event
		value: function emitChange() {
			this.emit('change');
		}
	}, {
		key: 'addChangeListener',

		// Add change listener
		value: function addChangeListener(callback) {
			this.on('change', callback);
		}
	}, {
		key: 'removeChangeListener',

		// Remove change listener
		value: function removeChangeListener(callback) {
			this.removeListener('change', callback);
		}
	}, {
		key: 'getDispatchToken',
		value: function getDispatchToken() {
			return _dispatchToken;
		}
	}, {
		key: 'setSettings',
		value: function setSettings(data) {
			var settings = $.extend({}, this.getSettings(), data);
			localStorage.setItem('settings', JSON.stringify(settings));
		}
	}, {
		key: 'getSettings',
		value: function getSettings() {
			return JSON.parse(localStorage.getItem('settings')) || {};
		}
	}]);

	return SettingsStore;
})(EventEmitter);

module.exports = new SettingsStore();

},{"../constants/SettingsConstants":13,"../dispatcher/AppDispatcher":15,"events":23,"jquery":"jquery"}],21:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SettingsConstants = require('../constants/SettingsConstants');
var SettingsActions = require('../actions/SettingsActions');

var SettingsStore = require('./SettingsStore');

var _dispatchToken;
var _users = [];

var SettingsUsersStore = (function (_EventEmitter) {
	function SettingsUsersStore() {
		var _this = this;

		_classCallCheck(this, SettingsUsersStore);

		_get(Object.getPrototypeOf(SettingsUsersStore.prototype), 'constructor', this).call(this);
		_dispatchToken = AppDispatcher.register(function (action) {

			switch (action.type) {

				case SettingsConstants.SAVE_SETTINGS:
					AppDispatcher.waitFor([SettingsStore.getDispatchToken()]);
					SettingsActions.getUsers();
					break;

				case SettingsConstants.RECEIVE_USERS:
					_users = action.data;
					_this.emitChange();
					break;

				default:
				//no op
			}
		});
	}

	_inherits(SettingsUsersStore, _EventEmitter);

	_createClass(SettingsUsersStore, [{
		key: 'emitChange',

		// Emit Change event
		value: function emitChange() {
			this.emit('change');
		}
	}, {
		key: 'addChangeListener',

		// Add change listener
		value: function addChangeListener(callback) {
			this.on('change', callback);
		}
	}, {
		key: 'removeChangeListener',

		// Remove change listener
		value: function removeChangeListener(callback) {
			this.removeListener('change', callback);
		}
	}, {
		key: 'getDispatchToken',
		value: function getDispatchToken() {
			return _dispatchToken;
		}
	}, {
		key: 'getUsers',
		value: function getUsers() {
			return _users;
		}
	}]);

	return SettingsUsersStore;
})(EventEmitter);

module.exports = new SettingsUsersStore();

},{"../actions/SettingsActions":1,"../constants/SettingsConstants":13,"../dispatcher/AppDispatcher":15,"./SettingsStore":20,"events":23}],22:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL01pbGVzdG9uZVNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvUHJvamVjdFNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvU2VsZWN0SW5wdXQucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1NldHRpbmdzLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UYXNrU2VsZWN0Q29udGFpbmVyLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UYXNrVHlwZVNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVGVhbWxlYWRlclRpbWVBcHAucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1RleHRJbnB1dC5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVHJhY2tlci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVXNlclNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL0N1c3RvbWVyU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvTWlsZXN0b25lU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvTWlsZXN0b25lVGFza1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1Byb2plY3RTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3N0b3Jlcy9TZXR0aW5nc1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1NldHRpbmdzVXNlcnNTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3V0aWwuanN4Iiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0NBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFOUIsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDM0QsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzs7QUFFbEUsTUFBTSxDQUFDLE9BQU8sR0FBRzs7QUFFZixhQUFZLEVBQUUsc0JBQVMsSUFBSSxFQUFFO0FBQzNCLGVBQWEsQ0FBQyxRQUFRLENBQUM7QUFDckIsT0FBSSxFQUFFLGlCQUFpQixDQUFDLGFBQWE7QUFDckMsT0FBSSxFQUFFLElB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVTQSxJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDaEMsSUFBSSxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7QUFDekMsSUFBSTtBQUNGLElBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRTtBQUNyQyxZQUFRLEVBQUUsS0FBSyxFQUNoQixDQUFDLENBQUM7QUFDSCxLQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7Q0FDNUIsQ0FBQyxPQUFNLEVBQUUsRUFBRTtBQUNWLFNBQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQ3pCOztBQUVELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDckMsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztBQUN2QyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDOztBQUV6QixJQUFJLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0FBQ3hFLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3BELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDOztBQUV0RCxJQUFJLE1BQU0sR0FDUjtBQUFDLE9BQUs7SUFBQyxJQUFJLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixBQUFDO0VBQ3BELG9CQUFDLEtBQUssSUFBQyxJQUFJLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBRSxRQUFRLEFBQUMsR0FBRTtFQUMzQyxvQkFBQyxZQUFZLElBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxPQUFPLEVBQUUsT0FBTyxBQUFDLEdBQUU7Q0FDMUMsQUFDVCxDQUFDOztBQUVGLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsT0FBTyxFQUFFO0FBQ3BDLE9BQUssQ0FBQyxNQUFNLENBQUMsb0JBQUMsT0FBTyxPQUFFLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ3pDLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIFNldHRpbmdzQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1NldHRpbmdzQ29uc3RhbnRzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIHNhdmVTZXR0aW5nczogZnVuY3Rpb24oZGF0YSkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgdHlwZTogU2V0dGluZ3NDb25zdGFudHMuU0FWRV9TRVRUSU5HUyxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSxcblxuICBnZXRVc2VyczogZnVuY3Rpb24oZGF0YSkge1xuXHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHR1cmw6ICcvZ2V0VXNlcnMucGhwJyxcblx0XHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdFx0Ly9yZXZpdmVyIGZ1bmN0aW9uIHRvIHJlbmFtZSBrZXlzXG5cdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcsIGZ1bmN0aW9uKHByb3AsIHZhbCkge1xuXHRcdFx0XHRcdHN3aXRjaCAocHJvcCkge1xuXHRcdFx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRjYXNlICduYW1lJzpcblx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdCAgXHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHQgIFx0XHR0eXBlOiBTZXR0aW5nc0NvbnN0YW50cy5SRUNFSVZFX1VTRVJTLFxuXHRcdCAgXHRcdGRhdGE6IGRhdGFcblx0XHQgIFx0fSk7XG5cdCAgICB9XG5cdFx0fSk7XG4gIH1cblxufTtcbiIsIlxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgVHJhY2tlckNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJyk7XG5cbnZhciBUcmFja2VyQWN0aW9ucyA9IHtcblxuXHRnZXRQcm9qZWN0czogZnVuY3Rpb24oKSB7XG5cdFx0VXRpbC5hcGlSZXF1ZXN0KHtcblx0XHRcdHVybDogJy9nZXRQcm9qZWN0cy5waHAnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRhbW91bnQ6IDEwMCxcblx0XHRcdFx0cGFnZW5vOiAwXG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKHN0cmluZylcblx0XHRcdFx0Ly9yZXZpdmVyIGZ1bmN0aW9uIHRvIHJlbmFtZSBrZXlzXG5cdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcsIGZ1bmN0aW9uKHByb3AsIHZhbCkge1xuXHRcdFx0XHRcdHN3aXRjaCAocHJvcCkge1xuXHRcdFx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRjYXNlICd0aXRsZSc6XG5cdFx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChkYXRhLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRkYXRhLnVuc2hpZnQoeyB2YWx1ZTogMCwgbGFiZWw6ICdDaG9vc2UuLi4nIH0pO1xuXHRcdFx0XHR9XG5cblx0XHQgICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX1BST0pFQ1RTLFxuXHRcdCAgICAgIGRhdGE6IGRhdGFcblx0XHQgICAgfSk7XG4gICAgICB9XG5cdFx0fSk7XG5cdH0sXG5cblx0c2V0UHJvamVjdDogZnVuY3Rpb24oaWQpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuU0VUX1BST0pFQ1QsXG4gICAgICBpZDogaWRcbiAgICB9KTtcblx0fSxcblxuXHRnZXRQcm9qZWN0RGV0YWlsczogZnVuY3Rpb24ocHJvamVjdCkge1xuXHRcdGlmIChwcm9qZWN0ID4gMCkge1xuXHRcdFx0VXRpbC5hcGlSZXF1ZXN0KHtcblx0XHRcdFx0dXJsOiAnL2dldFByb2plY3QucGhwJyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdHByb2plY3RfaWQ6IHByb2plY3Rcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcpO1xuXHRcdFx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5TRVRfQ09OVEFDVF9PUl9DT01QQU5ZLFxuXHRcdFx0ICAgICAgb3B0aW9uOiBkYXRhLmNvbnRhY3Rfb3JfY29tcGFueSxcblx0XHRcdCAgICAgIGlkOiBkYXRhLmNvbnRhY3Rfb3JfY29tcGFueV9pZFxuXHRcdFx0ICAgIH0pO1xuXHQgICAgICB9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0Z2V0TWlsZXN0b25lczogZnVuY3Rpb24ocHJvamVjdCkge1xuXHRcdGlmIChwcm9qZWN0ID4gMCkge1xuXHRcdFx0VXRpbC5hcGlSZXF1ZXN0KHtcblx0XHRcdFx0dXJsOiAnL2dldE1pbGVzdG9uZXNCeVByb2plY3QucGhwJyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdHByb2plY3RfaWQ6IHByb2plY3Rcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcsIGZ1bmN0aW9uKHByb3AsIHZhbCkge1xuXHRcdFx0XHRcdFx0c3dpdGNoIChwcm9wKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0Y2FzZSAndGl0bGUnOlxuXHRcdFx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRmb3IgKHZhciBpID0gZGF0YS5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHRcdGlmIChkYXRhW2ldLmNsb3NlZCA9PSAxKSB7XG5cdFx0XHRcdFx0XHRcdGRhdGEuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX01JTEVTVE9ORVMsXG5cdFx0XHQgICAgICBkYXRhOiBkYXRhXG5cdFx0XHQgICAgfSk7XG5cdCAgICAgIH1cblx0XHRcdH0pO1xuXG5cdFx0fVxuXHR9LFxuXG5cdHNldE1pbGVzdG9uZTogZnVuY3Rpb24oaWQpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuU0VUX01JTEVTVE9ORSxcbiAgICAgIGlkOiBpZFxuICAgIH0pO1xuXHR9LFxuXG5cdGdldE1pbGVzdG9uZVRhc2tzOiBmdW5jdGlvbihtaWxlc3RvbmUpIHtcblxuXHRcdGlmIChtaWxlc3RvbmUgPiAwKSB7XG5cblx0XHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHRcdHVybDogJy9nZXRUYXNrc0J5TWlsZXN0b25lLnBocCcsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRtaWxlc3RvbmVfaWQ6IG1pbGVzdG9uZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdFx0Ly9yZXZpdmVyIGZ1bmN0aW9uIHRvIHJlbmFtZSBrZXlzXG5cdFx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZywgZnVuY3Rpb24ocHJvcCwgdmFsKSB7XG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdkZXNjcmlwdGlvbic6XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSBkYXRhLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0uZG9uZSA9PSAxKSB7XG5cdFx0XHRcdFx0XHRcdGRhdGEuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHZhciBhcHBTZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpO1xuXHRcdFx0XHRcdGlmIChhcHBTZXR0aW5ncyAmJiBhcHBTZXR0aW5ncy51c2VyTmFtZSkge1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IGRhdGEubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChkYXRhW2ldLm93bmVyX25hbWUgIT0gYXBwU2V0dGluZ3MudXNlck5hbWUpIHtcblx0XHRcdFx0XHRcdFx0XHRkYXRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChkYXRhLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdGRhdGEucHVzaCh7IHZhbHVlOiAnbmV3JywgbGFiZWw6ICdOZXcgdGFzay4uLicgfSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHQgICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHQgICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfTUlMRVNUT05FX1RBU0tTLFxuXHRcdFx0ICAgICAgZGF0YTogZGF0YVxuXHRcdFx0ICAgIH0pO1xuXHQgICAgICB9XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0fSxcblxuXHRzZXRNaWxlc3RvbmVUYXNrOiBmdW5jdGlvbihpZCkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FX1RBU0ssXG4gICAgICBpZDogaWRcbiAgICB9KTtcblx0fVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNrZXJBY3Rpb25zO1xuIiwiXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgVHJhY2tlckFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJyk7XG52YXIgUHJvamVjdFN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL1Byb2plY3RTdG9yZScpO1xudmFyIE1pbGVzdG9uZVN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL01pbGVzdG9uZVN0b3JlJyk7XG52YXIgU2VsZWN0SW5wdXQgPSByZXF1aXJlKCcuL1NlbGVjdElucHV0LnJlYWN0Jyk7XG5cbnZhciBNaWxlc3RvbmVTZWxlY3RDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0TWlsZXN0b25lc1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bWlsZXN0b25lczogTWlsZXN0b25lU3RvcmUuZ2V0TWlsZXN0b25lcygpLFxuXHRcdFx0bWlsZXN0b25lOiBNaWxlc3RvbmVTdG9yZS5nZXRNaWxlc3RvbmUoKVxuXHRcdH1cblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmdldE1pbGVzdG9uZXNTdGF0ZSgpO1xuXHR9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldE1pbGVzdG9uZXNTdGF0ZSgpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0VHJhY2tlckFjdGlvbnMuZ2V0TWlsZXN0b25lcyhQcm9qZWN0U3RvcmUuZ2V0UHJvamVjdCgpKTtcbiAgXHRNaWxlc3RvbmVTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdE1pbGVzdG9uZVN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cdFx0VHJhY2tlckFjdGlvbnMuc2V0TWlsZXN0b25lKHRhcmdldC52YWx1ZSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS5taWxlc3RvbmVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cdFx0cmV0dXJuIChcblx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJtaWxlc3RvbmVcIj5NaWxlc3RvbmU8L2xhYmVsPlxuXHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0PFNlbGVjdElucHV0IFxuXHRcdFx0XHRcdFx0aWQ9XCJtaWxlc3RvbmVcIiBcblx0XHRcdFx0XHRcdHJlZj1cIm1pbGVzdG9uZVwiIFxuXHRcdFx0XHRcdFx0dmFsdWU9e3RoaXMuc3RhdGUubWlsZXN0b25lfVxuXHRcdFx0XHRcdFx0b3B0aW9ucz17dGhpcy5zdGF0ZS5taWxlc3RvbmVzfSBcblx0XHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHRcdFx0Lz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBNaWxlc3RvbmVTZWxlY3RDb250YWluZXI7IiwiXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgVHJhY2tlckFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJyk7XG52YXIgUHJvamVjdFN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL1Byb2plY3RTdG9yZScpO1xudmFyIFNlbGVjdElucHV0ID0gcmVxdWlyZSgnLi9TZWxlY3RJbnB1dC5yZWFjdCcpO1xuXG52YXIgUHJvamVjdFNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRQcm9qZWN0c1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJvamVjdHM6IFByb2plY3RTdG9yZS5nZXRQcm9qZWN0cygpLFxuXHRcdFx0cHJvamVjdDogUHJvamVjdFN0b3JlLmdldFByb2plY3QoKVxuXHRcdH1cblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFByb2plY3RzU3RhdGUoKTtcblx0fSxcblxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRQcm9qZWN0c1N0YXRlKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRUcmFja2VyQWN0aW9ucy5nZXRQcm9qZWN0cygpO1xuICBcdFByb2plY3RTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFByb2plY3RTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdFRyYWNrZXJBY3Rpb25zLnNldFByb2plY3QodGFyZ2V0LnZhbHVlKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwicHJvamVjdFwiPlByb2plY3Q8L2xhYmVsPlxuXHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0PFNlbGVjdElucHV0IFxuXHRcdFx0XHRcdFx0aWQ9XCJwcm9qZWN0XCIgXG5cdFx0XHRcdFx0XHRyZWY9XCJwcm9qZWN0XCIgXG5cdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS5wcm9qZWN0fVxuXHRcdFx0XHRcdFx0b3B0aW9ucz17dGhpcy5zdGF0ZS5wcm9qZWN0c30gXG5cdFx0XHRcdFx0XHRvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IFxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvamVjdFNlbGVjdENvbnRhaW5lcjtcbiIsIlxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgU2VsZWN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblxuICBcdHZhciBvcHRpb25Ob2RlcyA9IHRoaXMucHJvcHMub3B0aW9ucy5tYXAoZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgXHQ8b3B0aW9uIGtleT17b3B0aW9uLnZhbHVlfSB2YWx1ZT17b3B0aW9uLnZhbHVlfSA+e1V0aWwuaHRtbEVudGl0aWVzKG9wdGlvbi5sYWJlbCl9PC9vcHRpb24+XG4gICAgICApO1xuICBcdH0pO1xuXG5cdFx0cmV0dXJuIChcblx0ICBcdDxzZWxlY3QgXG5cdCAgXHRcdHsuLi50aGlzLnByb3BzfSBcblx0ICBcdFx0Y2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgXG5cdFx0XHQ+XG5cdCAgXHRcdHtvcHRpb25Ob2Rlc31cblx0ICBcdDwvc2VsZWN0PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdElucHV0OyIsIlxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcbnZhciBMaW5rID0gUm91dGVyLkxpbms7XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xudmFyIFNldHRpbmdzU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvU2V0dGluZ3NTdG9yZScpO1xudmFyIFNldHRpbmdzVXNlcnNTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9TZXR0aW5nc1VzZXJzU3RvcmUnKTtcbnZhciBTZXR0aW5nc0FjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucycpO1xudmFyIFRleHRJbnB1dCA9IHJlcXVpcmUoJy4vVGV4dElucHV0LnJlYWN0Jyk7XG52YXIgU2VsZWN0SW5wdXQgPSByZXF1aXJlKCcuL1NlbGVjdElucHV0LnJlYWN0Jyk7XG52YXIgVXNlclNlbGVjdENvbnRhaW5lciA9IHJlcXVpcmUoJy4vVXNlclNlbGVjdENvbnRhaW5lci5yZWFjdCcpO1xuXG52YXIgU2V0dGluZ3MgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gU2V0dGluZ3NTdG9yZS5nZXRTZXR0aW5ncygpO1xuICB9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZShTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRTZXR0aW5nc1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0U2V0dGluZ3NTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0aGFuZGxlU3VibWl0OiBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIGdyb3VwSWQgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuZ3JvdXBJZCkudmFsdWUudHJpbSgpO1xuXHRcdHZhciBncm91cFNlY3JldCA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5ncm91cFNlY3JldCkudmFsdWUudHJpbSgpO1xuXHRcdGlmICghZ3JvdXBTZWNyZXQgfHwgIWdyb3VwSWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgY29udGFpbmVyID0gdGhpcy5yZWZzLnVzZXJTZWxlY3RDb250YWluZXI7XG5cdFx0dmFyIHNlbGVjdCA9IGNvbnRhaW5lci5yZWZzLnVzZXJTZWxlY3Q7XG5cdFx0dmFyIHNlbGVjdE5vZGUgPSBSZWFjdC5maW5kRE9NTm9kZShzZWxlY3QpO1xuXG5cdFx0U2V0dGluZ3NBY3Rpb25zLnNhdmVTZXR0aW5ncyh7XG5cdFx0XHRncm91cElkOiBncm91cElkLFxuXHRcdFx0Z3JvdXBTZWNyZXQ6IGdyb3VwU2VjcmV0LFxuXHRcdFx0dXNlcklkOiBzZWxlY3QgPyBzZWxlY3ROb2RlLnZhbHVlIDogMCxcblx0XHRcdHVzZXJOYW1lOiBzZWxlY3QgPyAkKHNlbGVjdE5vZGUpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnRleHQoKSA6ICcnXG5cdFx0fSk7XG5cblx0XHRyZXR1cm47XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJzZXR0aW5nc1wiPlxuXHRcdFx0XHQ8Zm9ybSBjbGFzc05hbWU9XCJmb3JtLWhvcml6b250YWxcIiBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuXHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwiZ3JvdXAtaWRcIj5Hcm91cCBJRDwvbGFiZWw+XG5cdFx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdCAgICBcdDxUZXh0SW5wdXQgaWQ9XCJncm91cC1pZFwiIHJlZj1cImdyb3VwSWRcIiBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUuZ3JvdXBJZH0gLz5cblx0XHRcdFx0ICAgIDwvZGl2PlxuXHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwiZ3JvdXAtc2VjcmV0XCI+R3JvdXAgU2VjcmV0PC9sYWJlbD5cblx0XHRcdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0ICAgIFx0PFRleHRJbnB1dCBpZD1cImdyb3VwLXNlY3JldFwiIHJlZj1cImdyb3VwU2VjcmV0XCIgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLmdyb3VwU2VjcmV0fSAvPlxuXHRcdFx0XHQgICAgPC9kaXY+XG5cdFx0XHRcdCAgPC9kaXY+XG5cdFx0XHRcdCAgPFVzZXJTZWxlY3RDb250YWluZXIgXG5cdFx0XHRcdCAgXHRyZWY9XCJ1c2VyU2VsZWN0Q29udGFpbmVyXCJcblx0XHRcdFx0ICAgIHVzZXJJZD17dGhpcy5zdGF0ZS51c2VySWR9XG5cdFx0XHRcdFx0Lz5cblx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi10b29sYmFyXCI+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIHNhdmUtc2V0dGluZ3MtYnRuXCI+U2F2ZTwvYnV0dG9uPiBcblx0XHRcdFx0XHRcdDxMaW5rIHRvPVwidHJhY2tlclwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4tc20gYmFjay1zZXR0aW5ncy1idG5cIj5CYWNrPC9MaW5rPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcbiIsIlxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIFRyYWNrZXJBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucycpO1xudmFyIE1pbGVzdG9uZVN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL01pbGVzdG9uZVN0b3JlJyk7XG52YXIgTWlsZXN0b25lVGFza1N0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL01pbGVzdG9uZVRhc2tTdG9yZScpO1xudmFyIFNlbGVjdElucHV0ID0gcmVxdWlyZSgnLi9TZWxlY3RJbnB1dC5yZWFjdCcpO1xudmFyIFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyID0gcmVxdWlyZSgnLi9UYXNrVHlwZVNlbGVjdENvbnRhaW5lci5yZWFjdCcpO1xuXG52YXIgVGFza1NlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRUYXNrc1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGFza3M6IE1pbGVzdG9uZVRhc2tTdG9yZS5nZXRNaWxlc3RvbmVUYXNrcygpLFxuXHRcdFx0dGFzazogTWlsZXN0b25lVGFza1N0b3JlLmdldE1pbGVzdG9uZVRhc2soKVxuXHRcdH1cblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFRhc2tzU3RhdGUoKTtcblx0fSxcblxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRUYXNrc1N0YXRlKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRUcmFja2VyQWN0aW9ucy5nZXRNaWxlc3RvbmVUYXNrcyhNaWxlc3RvbmVTdG9yZS5nZXRNaWxlc3RvbmUoKSk7XG4gIFx0TWlsZXN0b25lVGFza1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0TWlsZXN0b25lVGFza1N0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cdFx0VHJhY2tlckFjdGlvbnMuc2V0TWlsZXN0b25lVGFzayh0YXJnZXQudmFsdWUpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUudGFza3MubGVuZ3RoID4gMSkge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwibWlsZXN0b25lLXRhc2tcIj5Ub2RvPC9sYWJlbD5cblx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0XHQ8U2VsZWN0SW5wdXQgXG5cdFx0XHRcdFx0XHRcdGlkPVwibWlsZXN0b25lLXRhc2tcIiBcblx0XHRcdFx0XHRcdFx0cmVmPVwibWlsZXN0b25lVGFza1wiIFxuXHRcdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS50YXNrfSBcblx0XHRcdFx0XHRcdFx0b3B0aW9ucz17dGhpcy5zdGF0ZS50YXNrc30gXG5cdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY3VzdG9tLXRhc2tcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0XHQgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cInRhc2stdHlwZVwiPlR5cGU8L2xhYmVsPlxuXHRcdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdCAgXHQ8VGFza1R5cGVTZWxlY3RDb250YWluZXIgLz5cblx0XHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cblx0XHRcdFx0XHQgIFx0PHRleHRhcmVhIGlkPVwidGFzay1kZXNjcmlwdGlvblwiIHJlZj1cInRhc2tEZXNjcmlwdGlvblwiIHBsYWNlaG9sZGVyPVwiVGFzayBkZXNjcmlwdGlvbi4uLlwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHJvd3M9XCIzXCI+PC90ZXh0YXJlYT5cblx0XHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdCk7XG5cdFx0fVxuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUYXNrU2VsZWN0Q29udGFpbmVyO1xuIiwiXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcbnZhciBTZWxlY3RJbnB1dCA9IHJlcXVpcmUoJy4vU2VsZWN0SW5wdXQucmVhY3QnKTtcblxudmFyIFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRhc2tUeXBlczogW11cblx0XHR9XG5cdH0sXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcblxuXHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHR1cmw6ICcvZ2V0VGFza1R5cGVzLnBocCcsXG5cdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0Y2FzZSAnbmFtZSc6XG5cdFx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHRhc2tUeXBlczogZGF0YSB9KTtcbiAgICAgIH1cblx0XHR9KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PFNlbGVjdElucHV0IGlkPVwidGFzay10eXBlXCIgcmVmPVwidGFza1R5cGVcIiBvcHRpb25zPXt0aGlzLnN0YXRlLnRhc2tUeXBlc30gLz5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUYXNrVHlwZVNlbGVjdENvbnRhaW5lcjtcbiIsIlxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcbnZhciBMaW5rID0gUm91dGVyLkxpbms7XG52YXIgUm91dGVIYW5kbGVyID0gUm91dGVyLlJvdXRlSGFuZGxlcjtcblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXI7XG5cblxudmFyIFRlYW1sZWFkZXJUaW1lQXBwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhcHBcIj5cblx0ICBcdFx0PGhlYWRlcj5cblx0ICBcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImhlYWRlcmV4dFwiPjwvZGl2PlxuXHQgIFx0XHRcdDxMaW5rIHRvPVwic2V0dGluZ3NcIiBjbGFzc05hbWU9XCJzZXR0aW5ncy1saW5rXCIgYWN0aXZlQ2xhc3NOYW1lPVwiYWN0aXZlXCI+XG5cdCAgXHRcdFx0XHQ8aSBjbGFzc05hbWU9XCJmYSBmYS1jb2dcIj48L2k+XG5cdCAgXHRcdFx0PC9MaW5rPlxuXHQgIFx0XHQ8L2hlYWRlcj5cblxuICAgICAgICB7LyogdGhpcyBpcyB0aGUgaW1wb3J0YW50IHBhcnQgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgPFJvdXRlSGFuZGxlci8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbWxlYWRlclRpbWVBcHA7XG4iLCJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBUZXh0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Ly8gZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0Ly8gXHRyZXR1cm4geyB2YWx1ZTogJycgfTtcblx0Ly8gfSxcblxuXHQvLyBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcblx0Ly8gXHR0aGlzLnNldFN0YXRlKHsgdmFsdWU6IG5leHRQcm9wcy5zYXZlZFZhbHVlIH0pO1xuXHQvLyB9LFxuXG5cdC8vIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0Ly8gXHR0aGlzLnNldFN0YXRlKHsgdmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZSB9KTtcbiAvLyAgfSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdC8vdmFyIHZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZTtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGlucHV0IFxuXHRcdFx0XHR7Li4udGhpcy5wcm9wc31cblx0XHRcdFx0dHlwZT1cInRleHRcIiBcblx0XHRcdFx0Y2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgXG5cdFx0XHRcdC8vdmFsdWU9e3ZhbHVlfVxuXHRcdFx0XHQvL29uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHQvPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRJbnB1dDsiLCJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBDdXN0b21lclN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL0N1c3RvbWVyU3RvcmUnKTtcbnZhciBQcm9qZWN0U3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvUHJvamVjdFN0b3JlJyk7XG52YXIgTWlsZXN0b25lU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvTWlsZXN0b25lU3RvcmUnKTtcbnZhciBNaWxlc3RvbmVUYXNrU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvTWlsZXN0b25lVGFza1N0b3JlJyk7XG5cbnZhciBQcm9qZWN0U2VsZWN0Q29udGFpbmVyID0gcmVxdWlyZSgnLi9Qcm9qZWN0U2VsZWN0Q29udGFpbmVyLnJlYWN0Jyk7XG52YXIgTWlsZXN0b25lU2VsZWN0Q29udGFpbmVyID0gcmVxdWlyZSgnLi9NaWxlc3RvbmVTZWxlY3RDb250YWluZXIucmVhY3QnKTtcbnZhciBUYXNrU2VsZWN0Q29udGFpbmVyID0gcmVxdWlyZSgnLi9UYXNrU2VsZWN0Q29udGFpbmVyLnJlYWN0Jyk7XG5cbnZhciBUcmFja2VyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldFRyYWNrZXJTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHByb2plY3Q6IFByb2plY3RTdG9yZS5nZXRQcm9qZWN0KCksXG5cdFx0XHRtaWxlc3RvbmU6IE1pbGVzdG9uZVN0b3JlLmdldE1pbGVzdG9uZSgpLFxuXHRcdFx0bWlsZXN0b25lVGFzazogTWlsZXN0b25lVGFza1N0b3JlLmdldE1pbGVzdG9uZVRhc2soKSxcblx0XHRcdGNvbnRhY3RPckNvbXBhbnk6IEN1c3RvbWVyU3RvcmUuZ2V0Q29udGFjdE9yQ29tcGFueSgpLFxuXHRcdFx0Y29udGFjdE9yQ29tcGFueUlkOiBDdXN0b21lclN0b3JlLmdldENvbnRhY3RPckNvbXBhbnlJZCgpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VHJhY2tlclN0YXRlKClcblx0fSxcblxuXHRoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zb2xlLmxvZyh0aGlzLmdldFRyYWNrZXJTdGF0ZSgpKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInRyYWNrZXJcIj5cblx0XHRcdFx0PGZvcm0gY2xhc3NOYW1lPVwiZm9ybS1ob3Jpem9udGFsXCIgb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cblxuXHRcdFx0XHRcdDxQcm9qZWN0U2VsZWN0Q29udGFpbmVyIC8+XG5cdFx0XHRcdFx0PE1pbGVzdG9uZVNlbGVjdENvbnRhaW5lciAvPlxuXHRcdFx0XHRcdDxUYXNrU2VsZWN0Q29udGFpbmVyIC8+XG5cblx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi10b29sYmFyXCI+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIHN0YXJ0LXRpbWVyLWJ0blwiPlxuXHRcdFx0XHRcdFx0XHRTdGFydCB0aW1lclxuXHRcdFx0XHRcdFx0PC9idXR0b24+IFxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFja2VyXG4iLCJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcbnZhciBMaW5rID0gUm91dGVyLkxpbms7XG5cbnZhciBTZXR0aW5nc1N0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL1NldHRpbmdzU3RvcmUnKTtcbnZhciBTZXR0aW5nc1VzZXJzU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvU2V0dGluZ3NVc2Vyc1N0b3JlJyk7XG52YXIgU2V0dGluZ3NBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9TZXR0aW5nc0FjdGlvbnMnKTtcblxudmFyIFNlbGVjdElucHV0ID0gcmVxdWlyZSgnLi9TZWxlY3RJbnB1dC5yZWFjdCcpO1xuXG52YXIgVXNlclNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRVc2Vyc1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0J3VzZXJzJzogU2V0dGluZ3NVc2Vyc1N0b3JlLmdldFVzZXJzKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRVc2Vyc1N0YXRlKCk7XG4gIH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0VXNlcnNTdGF0ZSgpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0U2V0dGluZ3NBY3Rpb25zLmdldFVzZXJzKCk7XG4gIFx0U2V0dGluZ3NVc2Vyc1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0U2V0dGluZ3NVc2Vyc1N0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLnVzZXJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cdFx0cmV0dXJuIChcblx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJ1c2VyLXNlbGVjdFwiPlNlbGVjdCB1c2VyPC9sYWJlbD5cblx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdCAgICBcdDxTZWxlY3RJbnB1dCBcblx0XHQgICAgXHRcdGlkPVwidXNlci1zZWxlY3RcIiBcblx0XHQgICAgXHRcdHJlZj1cInVzZXJTZWxlY3RcIiBcblx0XHQgICAgXHRcdG9wdGlvbnM9e3RoaXMuc3RhdGUudXNlcnN9IFxuXHRcdCAgICBcdFx0ZGVmYXVsdFZhbHVlPXt0aGlzLnByb3BzLnVzZXJJZH1cblx0XHQgICAgXHQvPlxuXHRcdCAgICA8L2Rpdj5cblx0XHQgIDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJTZWxlY3RDb250YWluZXI7XG4iLCJcbnZhciBrZXlNaXJyb3IgPSByZXF1aXJlKCdrZXltaXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3Ioe1xuXHRTQVZFX1NFVFRJTkdTOiBudWxsLFxuXHRSRUNFSVZFX1VTRVJTOiBudWxsXG59KTtcbiIsIlxudmFyIGtleU1pcnJvciA9IHJlcXVpcmUoJ2tleW1pcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcih7XG5cdFJFQ0VJVkVfUFJPSkVDVFM6IG51bGwsXG5cdFJFQ0VJVkVfTUlMRVNUT05FUzogbnVsbCxcblx0UkVDRUlWRV9NSUxFU1RPTkVfVEFTS1M6IG51bGwsXG5cdFNFVF9QUk9KRUNUOiBudWxsLFxuXHRTRVRfTUlMRVNUT05FOiBudWxsLFxuXHRTRVRfTUlMRVNUT05FX1RBU0s6IG51bGwsXG5cdFNFVF9DT05UQUNUX09SX0NPTVBBTlk6IG51bGxcbn0pO1xuIiwiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQXBwRGlzcGF0Y2hlclxuICpcbiAqIEEgc2luZ2xldG9uIHRoYXQgb3BlcmF0ZXMgYXMgdGhlIGNlbnRyYWwgaHViIGZvciBhcHBsaWNhdGlvbiB1cGRhdGVzLlxuICovXG5cbnZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IERpc3BhdGNoZXIoKTtcbiIsIlxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBUcmFja2VyQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnKTtcbnZhciBUcmFja2VyQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnKTtcblxudmFyIF9kaXNwYXRjaFRva2VuO1xudmFyIF9jb250YWN0T3JDb21wYW55O1xudmFyIF9jb250YWN0T3JDb21wYW55SWQ7XG5cbmNsYXNzIEN1c3RvbWVyU3RvcmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cblx0XHRfZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoKGFjdGlvbikgPT4ge1xuXG5cdFx0XHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRcdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9DT05UQUNUX09SX0NPTVBBTlk6XG5cdFx0XHRcdFx0X2NvbnRhY3RPckNvbXBhbnkgPSBhY3Rpb24ub3B0aW9uO1xuXHRcdFx0XHRcdF9jb250YWN0T3JDb21wYW55SWQgPSBhY3Rpb24uaWQ7XG5cdFx0XHRcdFx0dGhpcy5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHQvL25vIG9wXG5cdFx0XHR9XG5cblx0XHR9KTtcblx0fVxuXG4gIC8vIEVtaXQgQ2hhbmdlIGV2ZW50XG4gIGVtaXRDaGFuZ2UoKSB7XG4gICAgdGhpcy5lbWl0KCdjaGFuZ2UnKTtcbiAgfVxuXG4gIC8vIEFkZCBjaGFuZ2UgbGlzdGVuZXJcbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH1cblxuICAvLyBSZW1vdmUgY2hhbmdlIGxpc3RlbmVyXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9XG5cblx0Z2V0RGlzcGF0Y2hUb2tlbigpIHtcblx0XHRyZXR1cm4gX2Rpc3BhdGNoVG9rZW47XG5cdH1cblxuXHRnZXRDb250YWN0T3JDb21wYW55KCkge1xuXHRcdHJldHVybiBfY29udGFjdE9yQ29tcGFueTtcblx0fVxuXG5cdGdldENvbnRhY3RPckNvbXBhbnlJZCgpIHtcblx0XHRyZXR1cm4gX2NvbnRhY3RPckNvbXBhbnlJZDtcblx0fVxuXHRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQ3VzdG9tZXJTdG9yZSgpO1xuIiwiXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBUcmFja2VyQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnKTtcbnZhciBUcmFja2VyQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnKTtcbnZhciBQcm9qZWN0U3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvUHJvamVjdFN0b3JlJyk7XG5cbnZhciBfZGlzcGF0Y2hUb2tlbjtcbnZhciBfbWlsZXN0b25lcyA9IFtdO1xudmFyIF9zZWxlY3RlZDtcblxuY2xhc3MgTWlsZXN0b25lU3RvcmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0X2Rpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKChhY3Rpb24pID0+IHtcblxuXHRcdFx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0XHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfUFJPSkVDVDpcblx0XHRcdFx0XHRBcHBEaXNwYXRjaGVyLndhaXRGb3IoW1Byb2plY3RTdG9yZS5nZXREaXNwYXRjaFRva2VuKCldKTtcblx0XHRcdFx0XHRfbWlsZXN0b25lcyA9IFtdO1xuXHRcdFx0XHRcdF9zZWxlY3RlZCA9IDA7XG5cdFx0XHRcdFx0dGhpcy5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfTUlMRVNUT05FUzpcblx0XHRcdFx0XHRfbWlsZXN0b25lcyA9IGFjdGlvbi5kYXRhO1xuXHRcdFx0XHRcdGlmIChfbWlsZXN0b25lcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRfc2VsZWN0ZWQgPSBwYXJzZUludChfbWlsZXN0b25lc1swXS52YWx1ZSk7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnbWlsZXN0b25lJywgX3NlbGVjdGVkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5lbWl0Q2hhbmdlKCk7XG5cblx0XHRcdFx0XHRUcmFja2VyQWN0aW9ucy5nZXRNaWxlc3RvbmVUYXNrcyhfc2VsZWN0ZWQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FOlxuXHRcdFx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KGFjdGlvbi5pZCk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ21pbGVzdG9uZScsIF9zZWxlY3RlZCk7XG5cdFx0XHRcdFx0dGhpcy5lbWl0Q2hhbmdlKCk7XG5cblx0XHRcdFx0XHRUcmFja2VyQWN0aW9ucy5nZXRNaWxlc3RvbmVUYXNrcyhfc2VsZWN0ZWQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Ly9ubyBvcFxuXHRcdFx0fVxuXG5cdFx0fSk7XG5cdH1cblxuICAvLyBFbWl0IENoYW5nZSBldmVudFxuICBlbWl0Q2hhbmdlKCkge1xuICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gIH1cblxuICAvLyBBZGQgY2hhbmdlIGxpc3RlbmVyXG4gIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgLy8gUmVtb3ZlIGNoYW5nZSBsaXN0ZW5lclxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfVxuXG5cdGdldERpc3BhdGNoVG9rZW4oKSB7XG5cdFx0cmV0dXJuIF9kaXNwYXRjaFRva2VuO1xuXHR9XG5cblx0Z2V0TWlsZXN0b25lcygpIHtcblx0XHRyZXR1cm4gX21pbGVzdG9uZXM7XG5cdH1cblxuXHRnZXRNaWxlc3RvbmUoKSB7XG5cdFx0cmV0dXJuIF9zZWxlY3RlZDtcblx0fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IE1pbGVzdG9uZVN0b3JlKCk7XG4iLCJcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgVHJhY2tlckNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJyk7XG52YXIgTWlsZXN0b25lU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvTWlsZXN0b25lU3RvcmUnKTtcblxudmFyIF9kaXNwYXRjaFRva2VuO1xudmFyIF90YXNrcyA9IFtdO1xudmFyIF9zZWxlY3RlZDtcblxuY2xhc3MgTWlsZXN0b25lVGFza1N0b3JlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdF9kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcigoYWN0aW9uKSA9PiB7XG5cblx0XHRcdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdFx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX1BST0pFQ1Q6XG5cdFx0XHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FOlxuXHRcdFx0XHRcdEFwcERpc3BhdGNoZXIud2FpdEZvcihbTWlsZXN0b25lU3RvcmUuZ2V0RGlzcGF0Y2hUb2tlbigpXSk7XG5cdFx0XHRcdFx0X3Rhc2tzID0gW107XG5cdFx0XHRcdFx0X3NlbGVjdGVkID0gMDtcblx0XHRcdFx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVfVEFTS1M6XG5cdFx0XHRcdFx0X3Rhc2tzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRcdFx0aWYgKF90YXNrcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRfc2VsZWN0ZWQgPSBwYXJzZUludChfdGFza3NbMF0udmFsdWUpO1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ3Rhc2snLCBfc2VsZWN0ZWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX01JTEVTVE9ORV9UQVNLOlxuXHRcdFx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KGFjdGlvbi5pZCk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3Rhc2snLCBfc2VsZWN0ZWQpO1xuXHRcdFx0XHRcdHRoaXMuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Ly9ubyBvcFxuXHRcdFx0fVxuXG5cdFx0fSk7XG5cdH1cblxuICAvLyBFbWl0IENoYW5nZSBldmVudFxuICBlbWl0Q2hhbmdlKCkge1xuICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gIH1cblxuICAvLyBBZGQgY2hhbmdlIGxpc3RlbmVyXG4gIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgLy8gUmVtb3ZlIGNoYW5nZSBsaXN0ZW5lclxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfVxuXG5cdGdldERpc3BhdGNoVG9rZW4oKSB7XG5cdFx0cmV0dXJuIF9kaXNwYXRjaFRva2VuO1xuXHR9XG5cblx0Z2V0TWlsZXN0b25lVGFza3MoKSB7XG5cdFx0cmV0dXJuIF90YXNrcztcblx0fVxuXG5cdGdldE1pbGVzdG9uZVRhc2soKSB7XG5cdFx0cmV0dXJuIF9zZWxlY3RlZDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBNaWxlc3RvbmVUYXNrU3RvcmUoKTtcbiIsIlxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBUcmFja2VyQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnKTtcbnZhciBUcmFja2VyQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnKTtcblxudmFyIF9kaXNwYXRjaFRva2VuO1xudmFyIF9wcm9qZWN0cyA9IFtdO1xudmFyIF9zZWxlY3RlZDtcblxuY2xhc3MgUHJvamVjdFN0b3JlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdF9kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcigoYWN0aW9uKSA9PiB7XG5cblx0XHRcdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdFx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9QUk9KRUNUUzpcblx0XHRcdFx0XHRfcHJvamVjdHMgPSBhY3Rpb24uZGF0YTtcblx0XHRcdFx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX1BST0pFQ1Q6XG5cdFx0XHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoYWN0aW9uLmlkKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygncHJvamVjdCcsIF9zZWxlY3RlZCk7XG5cdFx0XHRcdFx0dGhpcy5lbWl0Q2hhbmdlKCk7XG5cbiAgICBcdFx0XHRUcmFja2VyQWN0aW9ucy5nZXRQcm9qZWN0RGV0YWlscyhfc2VsZWN0ZWQpO1xuXHRcdFx0XHRcdFRyYWNrZXJBY3Rpb25zLmdldE1pbGVzdG9uZXMoX3NlbGVjdGVkKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdC8vbm8gb3Bcblx0XHRcdH1cblxuXHRcdH0pO1xuXHR9XG5cbiAgLy8gRW1pdCBDaGFuZ2UgZXZlbnRcbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICB9XG5cbiAgLy8gQWRkIGNoYW5nZSBsaXN0ZW5lclxuICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMub24oJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSBjaGFuZ2UgbGlzdGVuZXJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH1cblxuXHRnZXREaXNwYXRjaFRva2VuKCkge1xuXHRcdHJldHVybiBfZGlzcGF0Y2hUb2tlbjtcblx0fVxuXG5cdGdldFByb2plY3RzKCkge1xuXHRcdHJldHVybiBfcHJvamVjdHM7XG5cdH1cblxuXHRnZXRQcm9qZWN0KCkge1xuXHRcdHJldHVybiBfc2VsZWN0ZWQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUHJvamVjdFN0b3JlKCk7XG4iLCJcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIFNldHRpbmdzQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1NldHRpbmdzQ29uc3RhbnRzJyk7XG5cbnZhciBfZGlzcGF0Y2hUb2tlbjtcblxuY2xhc3MgU2V0dGluZ3NTdG9yZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHRfZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoKGFjdGlvbikgPT4ge1xuXG5cdFx0XHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRcdFx0Y2FzZSBTZXR0aW5nc0NvbnN0YW50cy5TQVZFX1NFVFRJTkdTOlxuXHRcdFx0XHRcdHRoaXMuc2V0U2V0dGluZ3MoYWN0aW9uLmRhdGEpO1xuXHRcdFx0XHRcdHRoaXMuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Ly9ubyBvcFxuXHRcdFx0fVxuXG5cdFx0fSk7XG5cdH1cblxuICAvLyBFbWl0IENoYW5nZSBldmVudFxuICBlbWl0Q2hhbmdlKCkge1xuICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gIH1cblxuICAvLyBBZGQgY2hhbmdlIGxpc3RlbmVyXG4gIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgLy8gUmVtb3ZlIGNoYW5nZSBsaXN0ZW5lclxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfVxuXG5cdGdldERpc3BhdGNoVG9rZW4oKSB7XG5cdFx0cmV0dXJuIF9kaXNwYXRjaFRva2VuO1xuXHR9XG5cblx0c2V0U2V0dGluZ3MoZGF0YSkge1xuXHRcdHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCB0aGlzLmdldFNldHRpbmdzKCksIGRhdGEpO1xuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzZXR0aW5ncycsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzKSk7XG5cdH1cblxuXHRnZXRTZXR0aW5ncygpIHtcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZ3MnKSkgfHwge307XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgU2V0dGluZ3NTdG9yZSgpO1xuIiwiXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xuXG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIFNldHRpbmdzQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1NldHRpbmdzQ29uc3RhbnRzJyk7XG52YXIgU2V0dGluZ3NBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9TZXR0aW5nc0FjdGlvbnMnKTtcblxudmFyIFNldHRpbmdzU3RvcmUgPSByZXF1aXJlKCcuL1NldHRpbmdzU3RvcmUnKTtcblxudmFyIF9kaXNwYXRjaFRva2VuO1xudmFyIF91c2VycyA9IFtdO1xuXG5jbGFzcyBTZXR0aW5nc1VzZXJzU3RvcmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0X2Rpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKChhY3Rpb24pID0+IHtcblxuXHRcdFx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0XHRcdGNhc2UgU2V0dGluZ3NDb25zdGFudHMuU0FWRV9TRVRUSU5HUzpcblx0XHRcdFx0XHRBcHBEaXNwYXRjaGVyLndhaXRGb3IoW1NldHRpbmdzU3RvcmUuZ2V0RGlzcGF0Y2hUb2tlbigpXSk7XG5cdFx0XHRcdFx0U2V0dGluZ3NBY3Rpb25zLmdldFVzZXJzKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBTZXR0aW5nc0NvbnN0YW50cy5SRUNFSVZFX1VTRVJTOlxuXHRcdFx0XHRcdF91c2VycyA9IGFjdGlvbi5kYXRhO1xuXHRcdFx0XHRcdHRoaXMuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Ly9ubyBvcFxuXHRcdFx0fVxuXG5cdFx0fSk7XG5cdH1cblxuICAvLyBFbWl0IENoYW5nZSBldmVudFxuICBlbWl0Q2hhbmdlKCkge1xuICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gIH1cblxuICAvLyBBZGQgY2hhbmdlIGxpc3RlbmVyXG4gIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgLy8gUmVtb3ZlIGNoYW5nZSBsaXN0ZW5lclxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfVxuXG5cdGdldERpc3BhdGNoVG9rZW4oKSB7XG5cdFx0cmV0dXJuIF9kaXNwYXRjaFRva2VuO1xuXHR9XG5cblx0Z2V0VXNlcnMoKSB7XG5cdFx0cmV0dXJuIF91c2Vycztcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBTZXR0aW5nc1VzZXJzU3RvcmUoKTtcbiIsIlxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxudmFyIFNldHRpbmdzU3RvcmUgPSByZXF1aXJlKCcuL3N0b3Jlcy9TZXR0aW5nc1N0b3JlJyk7XG5cbmNsYXNzIFV0aWwge1xuXHRcblx0c3RhdGljIGFwaVJlcXVlc3Qob3B0aW9ucykge1xuXG5cdFx0dmFyIGRlZmF1bHRzID0ge1xuXHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0ZGF0YVR5cGU6ICd0ZXh0Jyxcblx0XHRcdGRhdGE6IHt9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnIpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihvcHRpb25zLnVybCwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSk7XG4gICAgICB9XG5cdFx0fTtcblxuXHRcdHZhciBhcHBTZXR0aW5ncyA9IFNldHRpbmdzU3RvcmUuZ2V0U2V0dGluZ3MoKTtcblx0XHRpZiAoYXBwU2V0dGluZ3MpIHtcblx0XHRcdGRlZmF1bHRzLmRhdGEgPSB7XG5cdFx0XHRcdGFwaV9ncm91cDogYXBwU2V0dGluZ3MuZ3JvdXBJZCxcblx0XHRcdFx0YXBpX3NlY3JldDogYXBwU2V0dGluZ3MuZ3JvdXBTZWNyZXRcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0dmFyIHNldHRpbmdzID0gJC5leHRlbmQodHJ1ZSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXHRcdGlmIChzZXR0aW5ncy5kYXRhLmFwaV9ncm91cCAmJiBzZXR0aW5ncy5kYXRhLmFwaV9zZWNyZXQpIHtcblx0XHRcdCQuYWpheCgnaHR0cHM6Ly93d3cudGVhbWxlYWRlci5iZS9hcGknICsgb3B0aW9ucy51cmwsIHNldHRpbmdzKTtcblx0XHR9XG5cdH1cblxuXHRzdGF0aWMgaHRtbEVudGl0aWVzKHN0cmluZykge1xuXHRcdHJldHVybiBzdHJpbmdcblx0XHRcdC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpXG5cdFx0XHQucmVwbGFjZSgvJiMwMzk7L2csIFwiJ1wiKTtcblx0fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXRpbDsiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJcbnZhciBndWkgPSBub2RlUmVxdWlyZSgnbncuZ3VpJyk7XG52YXIgbWIgPSBuZXcgZ3VpLk1lbnUoe3R5cGU6ICdtZW51YmFyJ30pO1xudHJ5IHtcbiAgbWIuY3JlYXRlTWFjQnVpbHRpbignVGVhbWxlYWRlciBUaW1lJywge1xuICAgIGhpZGVFZGl0OiBmYWxzZSxcbiAgfSk7XG4gIGd1aS5XaW5kb3cuZ2V0KCkubWVudSA9IG1iO1xufSBjYXRjaChleCkge1xuICBjb25zb2xlLmxvZyhleC5tZXNzYWdlKTtcbn1cblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcbnZhciBEZWZhdWx0Um91dGUgPSBSb3V0ZXIuRGVmYXVsdFJvdXRlO1xudmFyIFJvdXRlID0gUm91dGVyLlJvdXRlO1xuXG52YXIgVGVhbWxlYWRlclRpbWVBcHAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvVGVhbWxlYWRlclRpbWVBcHAucmVhY3QnKTtcbnZhciBUcmFja2VyID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1RyYWNrZXIucmVhY3QnKTtcbnZhciBTZXR0aW5ncyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9TZXR0aW5ncy5yZWFjdCcpO1xuXG52YXIgcm91dGVzID0gKFxuICA8Um91dGUgbmFtZT1cImFwcFwiIHBhdGg9XCIvXCIgaGFuZGxlcj17VGVhbWxlYWRlclRpbWVBcHB9PlxuICAgIDxSb3V0ZSBuYW1lPVwic2V0dGluZ3NcIiBoYW5kbGVyPXtTZXR0aW5nc30vPlxuICAgIDxEZWZhdWx0Um91dGUgbmFtZT1cInRyYWNrZXJcIiBoYW5kbGVyPXtUcmFja2VyfS8+XG4gIDwvUm91dGU+XG4pO1xuXG5Sb3V0ZXIucnVuKHJvdXRlcywgZnVuY3Rpb24gKEhhbmRsZXIpIHtcbiAgUmVhY3QucmVuZGVyKDxIYW5kbGVyLz4sIGRvY3VtZW50LmJvZHkpO1xufSk7XG4iXX0=
