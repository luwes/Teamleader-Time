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
			projects: ProjectStore.getProjects()
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
				React.createElement(SelectInput, { id: 'project', ref: 'project', options: this.state.projects, onChange: this.handleChange })
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

var $ = require('jquery');
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

},{"../actions/TrackerActions":2,"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"events":23,"jquery":"jquery"}],17:[function(require,module,exports){
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

var $ = require('jquery');
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

},{"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"../stores/MilestoneStore":17,"events":23,"jquery":"jquery"}],19:[function(require,module,exports){
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

},{"../actions/TrackerActions":2,"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"events":23,"jquery":"jquery"}],20:[function(require,module,exports){
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

var $ = require('jquery');
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

},{"../actions/SettingsActions":1,"../constants/SettingsConstants":13,"../dispatcher/AppDispatcher":15,"./SettingsStore":20,"events":23,"jquery":"jquery"}],22:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL01pbGVzdG9uZVNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvUHJvamVjdFNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvU2VsZWN0SW5wdXQucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1NldHRpbmdzLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UYXNrU2VsZWN0Q29udGFpbmVyLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UYXNrVHlwZVNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVGVhbWxlYWRlclRpbWVBcHAucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1RleHRJbnB1dC5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVHJhY2tlci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVXNlclNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL0N1c3RvbWVyU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvTWlsZXN0b25lU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvTWlsZXN0b25lVGFza1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1Byb2plY3RTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3N0b3Jlcy9TZXR0aW5nc1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1NldHRpbmdzVXNlcnNTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3V0aWwuanN4Iiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0NBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFOUIsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDM0QsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzs7QUFFbEUsTUFBTSxDQUFDLE9BQU8sR0FBRzs7QUFFZixhQUFZLEVBQUUsc0JBQVMsSUFBSSxFQUFFO0FBQzNCLGVBQWEsQ0FBQyxRQUFRLENBQUM7QUFDckIsT0FBSSxFQUFFLGlCQUFpQixDQUFDLGFBQWE7QUFDckMsT0FBSSxFQUFFLElBQUk7R0FDWCxDQUFDLENBQUM7RUFDSjs7QUFFRCxTQUFRLEVBQUUsa0JBQVMsSUFBSSxFQUFFO0FBQ3pCLE1BQUksQ0FBQyxVQUFVLENBQUM7QUFDZixNQUFHLEVBQUUsZUFBZTtBQUNwQixVQUFPLEVBQUUsaUJBQUMsTUFBTSxFQUFLOztBQUVwQixRQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDakQsYUFBUSxJQUFJO0FBQ1gsV0FBSyxJQUFJO0FBQ1IsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsY0FBTztBQUFBLEFBQ1IsV0FBSyxNQUFNO0FBQ1YsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsY0FBTztBQUFBLEFBQ1I7QUFDQyxjQUFPLEdBQUcsQ0FBQztBQUFBLE1BQ1o7S0FDRCxDQUFDLENBQUM7QUFDRixpQkFBYSxDQUFDLFFBQVEsQ0FBQztBQUN0QixTQUFJLEVBQUUsaUJBQWlCLENBQUMsYUFBYTtBQUNyQyxTQUFJLEVBQUUsSUFBSTtLQUNWLENBQUMsQ0FBQztJQUNGO0dBQ0gsQ0FBQyxDQUFDO0VBQ0Y7O0NBRUYsQ0FBQzs7Ozs7QUN2Q0YsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUU5QixJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUMzRCxJQUFJLGdCQUFnQixHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDOztBQUVoRSxJQUFJLGNBQWMsR0FBRzs7QUFFcEIsWUFBVyxFQUFFLHVCQUFXO0FBQ3ZCLE1BQUksQ0FBQyxVQUFVLENBQUM7QUFDZixNQUFHLEVBQUUsa0JBQWtCO0FBQ3ZCLE9BQUksRUFBRTtBQUNMLFVBQU0sRUFBRSxHQUFHO0FBQ1gsVUFBTSxFQUFFLENBQUM7SUFDVDtBQUNELFVBQU8sRUFBRSxpQkFBQyxNQUFNLEVBQUs7OztBQUdwQixRQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDakQsYUFBUSxJQUFJO0FBQ1gsV0FBSyxJQUFJO0FBQ1IsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsY0FBTztBQUFBLEFBQ1IsV0FBSyxPQUFPO0FBQ1gsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsY0FBTztBQUFBLEFBQ1I7QUFDQyxjQUFPLEdBQUcsQ0FBQztBQUFBLE1BQ1o7S0FDRCxDQUFDLENBQUM7O0FBRUgsUUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNwQixTQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztLQUMvQzs7QUFFQyxpQkFBYSxDQUFDLFFBQVEsQ0FBQztBQUNyQixTQUFJLEVBQUUsZ0JBQWdCLENBQUMsZ0JBQWdCO0FBQ3ZDLFNBQUksRUFBRSxJQUFJO0tBQ1gsQ0FBQyxDQUFDO0lBQ0Y7R0FDSixDQUFDLENBQUM7RUFDSDs7QUFFRCxXQUFVLEVBQUUsb0JBQVMsRUFBRSxFQUFFO0FBQ3RCLGVBQWEsQ0FBQyxRQUFRLENBQUM7QUFDckIsT0FBSSxFQUFFLGdCQUFnQixDQUFDLFdBQVc7QUFDbEMsS0FBRSxFQUFFLEVBQUU7R0FDUCxDQUFDLENBQUM7RUFDTDs7QUFFRCxrQkFBaUIsRUFBRSwyQkFBUyxPQUFPLEVBQUU7QUFDcEMsTUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO0FBQ2hCLE9BQUksQ0FBQyxVQUFVLENBQUM7QUFDZixPQUFHLEVBQUUsaUJBQWlCO0FBQ3RCLFFBQUksRUFBRTtBQUNMLGVBQVUsRUFBRSxPQUFPO0tBQ25CO0FBQ0QsV0FBTyxFQUFFLGlCQUFDLE1BQU0sRUFBSztBQUNwQixTQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLGtCQUFhLENBQUMsUUFBUSxDQUFDO0FBQ3JCLFVBQUksRUFBRSxnQkFBZ0IsQ0FBQyxzQkFBc0I7QUFDN0MsWUFBTSxFQUFFLElBQUksQ0FBQyxrQkFBa0I7QUFDL0IsUUFBRSxFQUFFLElBQUksQ0FBQyxxQkFBcUI7TUFDL0IsQ0FBQyxDQUFDO0tBQ0Y7SUFDSixDQUFDLENBQUM7R0FDSDtFQUNEOztBQUVELGNBQWEsRUFBRSx1QkFBUyxPQUFPLEVBQUU7QUFDaEMsTUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO0FBQ2hCLE9BQUksQ0FBQyxVQUFVLENBQUM7QUFDZixPQUFHLEVBQUUsNkJBQTZCO0FBQ2xDLFFBQUksRUFBRTtBQUNMLGVBQVUsRUFBRSxPQUFPO0tBQ25CO0FBQ0QsV0FBTyxFQUFFLGlCQUFDLE1BQU0sRUFBSzs7QUFFcEIsU0FBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBUyxJQUFJLEVBQUUsR0FBRyxFQUFFO0FBQ2pELGNBQVEsSUFBSTtBQUNYLFlBQUssSUFBSTtBQUNSLFlBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLGVBQU87QUFBQSxBQUNSLFlBQUssT0FBTztBQUNYLFlBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLGVBQU87QUFBQSxBQUNSO0FBQ0MsZUFBTyxHQUFHLENBQUM7QUFBQSxPQUNaO01BQ0QsQ0FBQyxDQUFDOztBQUVILFVBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4QyxVQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0FBQ3hCLFdBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQ2xCO01BQ0Q7O0FBRUMsa0JBQWEsQ0FBQyxRQUFRLENBQUM7QUFDckIsVUFBSSxFQUFFLGdCQUFnQixDQUFDLGtCQUFrQjtBQUN6QyxVQUFJLEVBQUUsSUFBSTtNQUNYLENBQUMsQ0FBQztLQUNGO0lBQ0osQ0FBQyxDQUFDO0dBRUg7RUFDRDs7QUFFRCxhQUFZLEVBQUUsc0JBQVMsRUFBRSxFQUFFO0FBQ3hCLGVBQWEsQ0FBQyxRQUFRLENBQUM7QUFDckIsT0FBSSxFQUFFLGdCQUFnQixDQUFDLGFBQWE7QUFDcEMsS0FBRSxFQUFFLEVBQUU7R0FDUCxDQUFDLENBQUM7RUFDTDs7QUFFRCxrQkFBaUIsRUFBRSwyQkFBUyxTQUFTLEVBQUU7O0FBRXRDLE1BQUksU0FBUyxHQUFHLENBQUMsRUFBRTs7QUFFbEIsT0FBSSxDQUFDLFVBQVUsQ0FBQztBQUNmLE9BQUcsRUFBRSwwQkFBMEI7QUFDL0IsUUFBSSxFQUFFO0FBQ0wsaUJBQVksRUFBRSxTQUFTO0tBQ3ZCO0FBQ0QsV0FBTyxFQUFFLGlCQUFDLE1BQU0sRUFBSzs7QUFFcEIsU0FBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBUyxJQUFJLEVBQUUsR0FBRyxFQUFFO0FBQ2pELGNBQVEsSUFBSTtBQUNYLFlBQUssSUFBSTtBQUNSLFlBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLGVBQU87QUFBQSxBQUNSLFlBQUssYUFBYTtBQUNqQixZQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNqQixlQUFPO0FBQUEsQUFDUjtBQUNDLGVBQU8sR0FBRyxDQUFDO0FBQUEsT0FDWjtNQUNELENBQUMsQ0FBQzs7QUFFSCxVQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDeEMsVUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRTtBQUN0QixXQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztPQUNsQjtNQUNEOztBQUVELFNBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQy9ELFNBQUksV0FBVyxJQUFJLFdBQVcsQ0FBQyxRQUFRLEVBQUU7QUFDeEMsV0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3hDLFdBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFO0FBQy9DLFlBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xCO09BQ0Q7TUFDRDs7QUFFRCxTQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDO01BQ2xEOztBQUVDLGtCQUFhLENBQUMsUUFBUSxDQUFDO0FBQ3JCLFVBQUksRUFBRSxnQkFBZ0IsQ0FBQyx1QkFBdUI7QUFDOUMsVUFBSSxFQUFFLElBQUk7TUFDWCxDQUFDLENBQUM7S0FDRjtJQUNKLENBQUMsQ0FBQztHQUVIO0VBQ0Q7O0FBRUQsaUJBQWdCLEVBQUUsMEJBQVMsRUFBRSxFQUFFO0FBQzVCLGVBQWEsQ0FBQyxRQUFRLENBQUM7QUFDckIsT0FBSSxFQUFFLGdCQUFnQixDQUFDLGtCQUFrQjtBQUN6QyxLQUFFLEVBQUUsRUFBRTtHQUNQLENBQUMsQ0FBQztFQUNMOztDQUVELENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUM7Ozs7O0FDL0toQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQzFELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3JELElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3pELElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOztBQUVqRCxJQUFJLHdCQUF3QixHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUVoRCxtQkFBa0IsRUFBRSw4QkFBVztBQUM5QixTQUFPO0FBQ04sYUFBVSxFQUFFLGNBQWMsQ0FBQyxhQUFhLEVBQUU7QUFDMUMsWUFBUyxFQUFFLGNBQWMsQ0FBQyxZQUFZLEVBQUU7R0FDeEMsQ0FBQTtFQUNEOztBQUVELGdCQUFlLEVBQUUsMkJBQVc7QUFDM0IsU0FBTyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztFQUNqQzs7QUFFQSxVQUFTLEVBQUUscUJBQVc7QUFDcEIsTUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO0VBQzFDOztBQUVELGtCQUFpQixFQUFFLDZCQUFXO0FBQzdCLGdCQUFjLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0FBQ3hELGdCQUFjLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ2pEOztBQUVELHFCQUFvQixFQUFFLGdDQUFXO0FBQ2hDLGdCQUFjLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ3BEOztBQUVGLGFBQVksRUFBRSxzQkFBUyxLQUFLLEVBQUU7QUFDN0IsTUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztBQUNqQyxnQkFBYyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDMUM7O0FBRUQsT0FBTSxFQUFFLGtCQUFXO0FBQ2xCLE1BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQztBQUNwRCxTQUNFOztLQUFLLFNBQVMsRUFBQyxZQUFZO0dBQ3pCOztNQUFPLFNBQVMsRUFBQyx3QkFBd0IsRUFBQyxPQUFPLEVBQUMsV0FBVzs7SUFBa0I7R0FDL0U7O01BQUssU0FBUyxFQUFDLFVBQVU7SUFDMUIsb0JBQUMsV0FBVztBQUNYLE9BQUUsRUFBQyxXQUFXO0FBQ2QsUUFBRyxFQUFDLFdBQVc7QUFDZixVQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEFBQUM7QUFDNUIsWUFBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxBQUFDO0FBQy9CLGFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWSxBQUFDO01BQzNCO0lBQ0c7R0FDRCxDQUNMO0VBQ0Y7Q0FDRCxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyx3QkFBd0IsQ0FBQzs7Ozs7QUN6RDFDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDMUQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDckQsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0FBRWpELElBQUksc0JBQXNCLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRTlDLGlCQUFnQixFQUFFLDRCQUFXO0FBQzVCLFNBQU87QUFDTixXQUFRLEVBQUUsWUFBWSxDQUFDLFdBQVcsRUFBRTtHQUNwQyxDQUFBO0VBQ0Q7O0FBRUQsZ0JBQWUsRUFBRSwyQkFBVztBQUMzQixTQUFPLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0VBQy9COztBQUVBLFVBQVMsRUFBRSxxQkFBVztBQUNwQixNQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7RUFDeEM7O0FBRUQsa0JBQWlCLEVBQUUsNkJBQVc7QUFDN0IsZ0JBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM3QixjQUFZLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQy9DOztBQUVELHFCQUFvQixFQUFFLGdDQUFXO0FBQ2hDLGNBQVksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDbEQ7O0FBRUYsYUFBWSxFQUFFLHNCQUFTLEtBQUssRUFBRTtBQUM3QixNQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO0FBQ2pDLGdCQUFjLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUN4Qzs7QUFFRCxPQUFNLEVBQUUsa0JBQVc7QUFDbEIsU0FDRTs7S0FBSyxTQUFTLEVBQUMsWUFBWTtHQUN6Qjs7TUFBTyxTQUFTLEVBQUMsd0JBQXdCLEVBQUMsT0FBTyxFQUFDLFNBQVM7O0lBQWdCO0dBQzNFOztNQUFLLFNBQVMsRUFBQyxVQUFVO0lBQzFCLG9CQUFDLFdBQVcsSUFBQyxFQUFFLEVBQUMsU0FBUyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxBQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLEFBQUMsR0FBRztJQUNoRztHQUNELENBQ0w7RUFDRjtDQUNELENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLHNCQUFzQixDQUFDOzs7Ozs7O0FDaER4QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUU5QixJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFFbkMsT0FBTSxFQUFFLGtCQUFXOztBQUVqQixNQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBUyxNQUFNLEVBQUU7QUFDdkQsVUFDQzs7TUFBUSxHQUFHLEVBQUUsTUFBTSxDQUFDLEtBQUssQUFBQyxFQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxBQUFDO0lBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQVUsQ0FDMUY7R0FDSixDQUFDLENBQUM7O0FBRUosU0FDRTs7Z0JBQ0ssSUFBSSxDQUFDLEtBQUs7QUFDZCxhQUFTLEVBQUMsY0FBYzs7R0FFdkIsV0FBVztHQUNKLENBQ1Q7RUFDRjtDQUNELENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQzs7Ozs7QUN4QjdCLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNyQyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDOztBQUV2QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDOUIsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDdkQsSUFBSSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUNqRSxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUM1RCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM3QyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNqRCxJQUFJLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDOztBQUVqRSxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFFaEMsZ0JBQWUsRUFBRSwyQkFBVztBQUMzQixTQUFPLGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztFQUNsQzs7QUFFRCxVQUFTLEVBQUUscUJBQVc7QUFDcEIsTUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztFQUM1Qzs7QUFFRCxrQkFBaUIsRUFBRSw2QkFBVztBQUM3QixlQUFhLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ2hEOztBQUVELHFCQUFvQixFQUFFLGdDQUFXO0FBQ2hDLGVBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDbkQ7O0FBRUYsYUFBWSxFQUFFLHNCQUFTLENBQUMsRUFBRTtBQUN6QixHQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRW5CLE1BQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEUsTUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN4RSxNQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQzdCLFVBQU87R0FDUDs7QUFFRCxNQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDO0FBQzlDLE1BQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ3ZDLE1BQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTNDLGlCQUFlLENBQUMsWUFBWSxDQUFDO0FBQzVCLFVBQU8sRUFBRSxPQUFPO0FBQ2hCLGNBQVcsRUFBRSxXQUFXO0FBQ3hCLFNBQU0sRUFBRSxNQUFNLEdBQUcsVUFBVSxDQUFDLEtBQUssR0FBRyxDQUFDO0FBQ3JDLFdBQVEsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7R0FDcEUsQ0FBQyxDQUFDOztBQUVILFNBQU87RUFDUDs7QUFFRCxPQUFNLEVBQUUsa0JBQVc7QUFDbEIsU0FDQzs7S0FBSyxTQUFTLEVBQUMsVUFBVTtHQUN4Qjs7TUFBTSxTQUFTLEVBQUMsaUJBQWlCLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLEFBQUM7SUFDNUQ7O09BQUssU0FBUyxFQUFDLFlBQVk7S0FDekI7O1FBQU8sU0FBUyxFQUFDLHdCQUF3QixFQUFDLE9BQU8sRUFBQyxVQUFVOztNQUFpQjtLQUM3RTs7UUFBSyxTQUFTLEVBQUMsVUFBVTtNQUN4QixvQkFBQyxTQUFTLElBQUMsRUFBRSxFQUFDLFVBQVUsRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQUFBQyxHQUFHO01BQ3RFO0tBQ0Y7SUFDTjs7T0FBSyxTQUFTLEVBQUMsWUFBWTtLQUN6Qjs7UUFBTyxTQUFTLEVBQUMsd0JBQXdCLEVBQUMsT0FBTyxFQUFDLGNBQWM7O01BQXFCO0tBQ3JGOztRQUFLLFNBQVMsRUFBQyxVQUFVO01BQ3hCLG9CQUFDLFNBQVMsSUFBQyxFQUFFLEVBQUMsY0FBYyxFQUFDLEdBQUcsRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxBQUFDLEdBQUc7TUFDbEY7S0FDRjtJQUNOLG9CQUFDLG1CQUFtQjtBQUNuQixRQUFHLEVBQUMscUJBQXFCO0FBQ3hCLFdBQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQUFBQztNQUMzQjtJQUNEOztPQUFLLFNBQVMsRUFBQyxhQUFhO0tBQzVCOztRQUFRLElBQUksRUFBQyxRQUFRLEVBQUMsU0FBUyxFQUFDLDBDQUEwQzs7TUFBYztLQUN4RjtBQUFDLFVBQUk7UUFBQyxFQUFFLEVBQUMsU0FBUyxFQUFDLFNBQVMsRUFBQywwQ0FBMEM7O01BQVk7S0FDOUU7SUFDQTtHQUNGLENBQ0w7RUFDRjtDQUNELENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQzs7Ozs7QUNyRjFCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDMUQsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDekQsSUFBSSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUNqRSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNqRCxJQUFJLHVCQUF1QixHQUFHLE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDOztBQUV6RSxJQUFJLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUUzQyxjQUFhLEVBQUUseUJBQVc7QUFDekIsU0FBTztBQUNOLFFBQUssRUFBRSxrQkFBa0IsQ0FBQyxpQkFBaUIsRUFBRTtBQUM3QyxPQUFJLEVBQUUsa0JBQWtCLENBQUMsZ0JBQWdCLEVBQUU7R0FDM0MsQ0FBQTtFQUNEOztBQUVELGdCQUFlLEVBQUUsMkJBQVc7QUFDM0IsU0FBTyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7RUFDNUI7O0FBRUEsVUFBUyxFQUFFLHFCQUFXO0FBQ3BCLE1BQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7RUFDckM7O0FBRUQsa0JBQWlCLEVBQUUsNkJBQVc7QUFDN0IsZ0JBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztBQUNoRSxvQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDckQ7O0FBRUQscUJBQW9CLEVBQUUsZ0NBQVc7QUFDaEMsb0JBQWtCLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ3hEOztBQUVGLGFBQVksRUFBRSxzQkFBUyxLQUFLLEVBQUU7QUFDN0IsTUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztBQUNqQyxnQkFBYyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUM5Qzs7QUFFRCxPQUFNLEVBQUUsa0JBQVc7QUFDbEIsTUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2hDLFVBQ0U7O01BQUssU0FBUyxFQUFDLFlBQVk7SUFDekI7O09BQU8sU0FBUyxFQUFDLHdCQUF3QixFQUFDLE9BQU8sRUFBQyxnQkFBZ0I7O0tBQWE7SUFDL0U7O09BQUssU0FBUyxFQUFDLFVBQVU7S0FDMUIsb0JBQUMsV0FBVztBQUNYLFFBQUUsRUFBQyxnQkFBZ0I7QUFDbkIsU0FBRyxFQUFDLGVBQWU7QUFDbkIsV0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxBQUFDO0FBQ3ZCLGFBQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQUFBQztBQUMxQixjQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQUFBQztPQUMzQjtLQUNHO0lBQ0QsQ0FDTDtHQUNGLE1BQU07QUFDTixVQUNDOztNQUFLLFNBQVMsRUFBQyxhQUFhO0lBQzNCOztPQUFLLFNBQVMsRUFBQyxZQUFZO0tBQ3pCOztRQUFPLFNBQVMsRUFBQyx3QkFBd0IsRUFBQyxPQUFPLEVBQUMsV0FBVzs7TUFBYTtLQUMxRTs7UUFBSyxTQUFTLEVBQUMsVUFBVTtNQUN4QixvQkFBQyx1QkFBdUIsT0FBRztNQUN0QjtLQUNGO0lBQ047O09BQUssU0FBUyxFQUFDLFlBQVk7S0FDekI7O1FBQUssU0FBUyxFQUFDLFdBQVc7TUFDekIsa0NBQVUsRUFBRSxFQUFDLGtCQUFrQixFQUFDLEdBQUcsRUFBQyxpQkFBaUIsRUFBQyxXQUFXLEVBQUMscUJBQXFCLEVBQUMsU0FBUyxFQUFDLGNBQWMsRUFBQyxJQUFJLEVBQUMsR0FBRyxHQUFZO01BQ2hJO0tBQ0Y7SUFDRCxDQUNMO0dBQ0Y7RUFDRDtDQUNELENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLG1CQUFtQixDQUFDOzs7OztBQzNFckMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDOUIsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0FBRWpELElBQUksdUJBQXVCLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRS9DLGdCQUFlLEVBQUUsMkJBQVc7QUFDM0IsU0FBTztBQUNOLFlBQVMsRUFBRSxFQUFFO0dBQ2IsQ0FBQTtFQUNEO0FBQ0Qsa0JBQWlCLEVBQUUsNkJBQVc7OztBQUU3QixNQUFJLENBQUMsVUFBVSxDQUFDO0FBQ2YsTUFBRyxFQUFFLG1CQUFtQjtBQUN4QixVQUFPLEVBQUUsaUJBQUMsTUFBTSxFQUFLOztBQUVwQixRQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDakQsYUFBUSxJQUFJO0FBQ1gsV0FBSyxJQUFJO0FBQ1IsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsY0FBTztBQUFBLEFBQ1IsV0FBSyxNQUFNO0FBQ1YsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsY0FBTztBQUFBLEFBQ1I7QUFDQyxjQUFPLEdBQUcsQ0FBQztBQUFBLE1BQ1o7S0FDRCxDQUFDLENBQUM7QUFDSCxVQUFLLFFBQVEsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDO0dBQ0osQ0FBQyxDQUFDO0VBQ0g7QUFDRCxPQUFNLEVBQUUsa0JBQVc7QUFDbEIsU0FDQyxvQkFBQyxXQUFXLElBQUMsRUFBRSxFQUFDLFdBQVcsRUFBQyxHQUFHLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQUFBQyxHQUFHLENBQzNFO0VBQ0Y7Q0FDRCxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQzs7Ozs7QUN6Q3pDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDckMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN2QixJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDOztBQUV2QyxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDO0FBQ2xELElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUM7O0FBRzVDLElBQUksaUJBQWlCLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBQ3hDLFFBQU0sRUFBRSxrQkFBWTtBQUNsQixXQUNFOztRQUFLLFNBQVMsRUFBQyxLQUFLO01BQ3JCOzs7UUFDQyw2QkFBSyxTQUFTLEVBQUMsV0FBVyxHQUFPO1FBQ2pDO0FBQUMsY0FBSTtZQUFDLEVBQUUsRUFBQyxVQUFVLEVBQUMsU0FBUyxFQUFDLGVBQWUsRUFBQyxlQUFlLEVBQUMsUUFBUTtVQUNyRSwyQkFBRyxTQUFTLEVBQUMsV0FBVyxHQUFLO1NBQ3ZCO09BQ0M7TUFHTjs7VUFBSyxTQUFTLEVBQUMsV0FBVztRQUN4QixvQkFBQyxZQUFZLE9BQUU7T0FDWDtLQUNGLENBQ047R0FDSDtDQUNGLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLGlCQUFpQixDQUFDOzs7Ozs7OztBQzdCbkMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUFjakMsT0FBTSxFQUFFLGtCQUFXOztBQUVsQixTQUNDLDBDQUNLLElBQUksQ0FBQyxLQUFLO0FBQ2QsT0FBSSxFQUFDLE1BQU07QUFDWCxZQUFTLEVBQUMsY0FBYzs7O0FBQUEsS0FHdkIsQ0FDRDtFQUNGO0NBQ0QsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDOzs7OztBQzlCM0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUN2RCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNyRCxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN6RCxJQUFJLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDOztBQUVqRSxJQUFJLHNCQUFzQixHQUFHLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ3ZFLElBQUksd0JBQXdCLEdBQUcsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7QUFDM0UsSUFBSSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7QUFFakUsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRS9CLGdCQUFlLEVBQUUsMkJBQVc7QUFDM0IsU0FBTztBQUNOLFVBQU8sRUFBRSxZQUFZLENBQUMsVUFBVSxFQUFFO0FBQ2xDLFlBQVMsRUFBRSxjQUFjLENBQUMsWUFBWSxFQUFFO0FBQ3hDLGdCQUFhLEVBQUUsa0JBQWtCLENBQUMsZ0JBQWdCLEVBQUU7QUFDcEQsbUJBQWdCLEVBQUUsYUFBYSxDQUFDLG1CQUFtQixFQUFFO0FBQ3JELHFCQUFrQixFQUFFLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRTtHQUN6RCxDQUFBO0VBQ0Q7O0FBRUQsZ0JBQWUsRUFBRSwyQkFBVztBQUMzQixTQUFPLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQTtFQUM3Qjs7QUFFRCxhQUFZLEVBQUUsc0JBQVMsQ0FBQyxFQUFFO0FBQ3pCLEdBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFbkIsU0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztFQUNwQzs7QUFFRCxPQUFNLEVBQUUsa0JBQVc7QUFDbEIsU0FDQzs7S0FBSyxTQUFTLEVBQUMsU0FBUztHQUN2Qjs7TUFBTSxTQUFTLEVBQUMsaUJBQWlCLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLEFBQUM7SUFFN0Qsb0JBQUMsc0JBQXNCLE9BQUc7SUFDMUIsb0JBQUMsd0JBQXdCLE9BQUc7SUFDNUIsb0JBQUMsbUJBQW1CLE9BQUc7SUFFdEI7O09BQUssU0FBUyxFQUFDLGFBQWE7S0FDNUI7O1FBQVEsSUFBSSxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsd0NBQXdDOztNQUUvRDtLQUNKO0lBQ0E7R0FDRixDQUNMO0VBQ0Y7Q0FDRCxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7Ozs7O0FDckR4QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNyQyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDOztBQUV2QixJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUN2RCxJQUFJLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBQ2pFLElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOztBQUU1RCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7QUFFakQsSUFBSSxtQkFBbUIsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFFM0MsY0FBYSxFQUFFLHlCQUFXO0FBQ3pCLFNBQU87QUFDTixVQUFPLEVBQUUsa0JBQWtCLENBQUMsUUFBUSxFQUFFO0dBQ3RDLENBQUE7RUFDRDs7QUFFRCxnQkFBZSxFQUFFLDJCQUFXO0FBQzNCLFNBQU8sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0VBQzNCOztBQUVELFVBQVMsRUFBRSxxQkFBVztBQUNwQixNQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO0VBQ3JDOztBQUVELGtCQUFpQixFQUFFLDZCQUFXO0FBQzdCLGlCQUFlLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDM0Isb0JBQWtCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ3JEOztBQUVELHFCQUFvQixFQUFFLGdDQUFXO0FBQ2hDLG9CQUFrQixDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUN4RDs7QUFFRixPQUFNLEVBQUUsa0JBQVc7QUFDbEIsTUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQy9DLFNBQ0U7O0tBQUssU0FBUyxFQUFDLFlBQVk7R0FDekI7O01BQU8sU0FBUyxFQUFDLHdCQUF3QixFQUFDLE9BQU8sRUFBQyxhQUFhOztJQUFvQjtHQUNuRjs7TUFBSyxTQUFTLEVBQUMsVUFBVTtJQUN4QixvQkFBQyxXQUFXO0FBQ1gsT0FBRSxFQUFDLGFBQWE7QUFDaEIsUUFBRyxFQUFDLFlBQVk7QUFDaEIsWUFBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxBQUFDO0FBQzFCLGlCQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEFBQUM7TUFDL0I7SUFDRztHQUNGLENBQ047RUFDRjtDQUNELENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLG1CQUFtQixDQUFDOzs7OztBQ3REckMsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUVyQyxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUMxQixjQUFhLEVBQUUsSUFBSTtBQUNuQixjQUFhLEVBQUUsSUFBSTtDQUNuQixDQUFDLENBQUM7Ozs7O0FDTEgsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUVyQyxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUMxQixpQkFBZ0IsRUFBRSxJQUFJO0FBQ3RCLG1CQUFrQixFQUFFLElBQUk7QUFDeEIsd0JBQXVCLEVBQUUsSUFBSTtBQUM3QixZQUFXLEVBQUUsSUFBSTtBQUNqQixjQUFhLEVBQUUsSUFBSTtBQUNuQixtQkFBa0IsRUFBRSxJQUFJO0FBQ3hCLHVCQUFzQixFQUFFLElBQUk7Q0FDNUIsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNFSCxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDOztBQUU1QyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNkbEMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7O0FBRWxELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQzNELElBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDaEUsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7O0FBRTFELElBQUksY0FBYyxDQUFDO0FBQ25CLElBQUksaUJBQWlCLENBQUM7QUFDdEIsSUFBSSxtQkFBbUIsQ0FBQzs7SUFFbEIsYUFBYTtBQUVQLFVBRk4sYUFBYSxHQUVKOzs7d0JBRlQsYUFBYTs7QUFHakIsNkJBSEksYUFBYSw2Q0FHVDs7QUFFUixnQkFBYyxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsVUFBQyxNQUFNLEVBQUs7O0FBRW5ELFdBQVEsTUFBTSxDQUFDLElBQUk7O0FBRWxCLFNBQUssZ0JBQWdCLENBQUMsc0JBQXNCO0FBQzNDLHNCQUFpQixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDbEMsd0JBQW1CLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQztBQUNoQyxXQUFLLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFdBQU07O0FBQUEsQUFFUCxZQUFROztJQUVSO0dBRUQsQ0FBQyxDQUFDO0VBQ0g7O1dBcEJJLGFBQWE7O2NBQWIsYUFBYTs7OztTQXVCUCxzQkFBRztBQUNYLE9BQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDckI7Ozs7O1NBR2dCLDJCQUFDLFFBQVEsRUFBRTtBQUMxQixPQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUM3Qjs7Ozs7U0FHbUIsOEJBQUMsUUFBUSxFQUFFO0FBQzdCLE9BQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ3pDOzs7U0FFYyw0QkFBRztBQUNsQixVQUFPLGNBQWMsQ0FBQztHQUN0Qjs7O1NBRWtCLCtCQUFHO0FBQ3JCLFVBQU8saUJBQWlCLENBQUM7R0FDekI7OztTQUVvQixpQ0FBRztBQUN2QixVQUFPLG1CQUFtQixDQUFDO0dBQzNCOzs7UUEvQ0ksYUFBYTtHQUFTLFlBQVk7O0FBbUR4QyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7QUM5RHJDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDOztBQUVsRCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUMzRCxJQUFJLGdCQUFnQixHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ2hFLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQzFELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDOztBQUVyRCxJQUFJLGNBQWMsQ0FBQztBQUNuQixJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDckIsSUFBSSxTQUFTLENBQUM7O0lBRVIsY0FBYztBQUVSLFVBRk4sY0FBYyxHQUVMOzs7d0JBRlQsY0FBYzs7QUFHbEIsNkJBSEksY0FBYyw2Q0FHVjtBQUNSLGdCQUFjLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxVQUFDLE1BQU0sRUFBSzs7QUFFbkQsV0FBUSxNQUFNLENBQUMsSUFBSTs7QUFFbEIsU0FBSyxnQkFBZ0IsQ0FBQyxXQUFXO0FBQ2hDLGtCQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pELGdCQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLGNBQVMsR0FBRyxDQUFDLENBQUM7QUFDZCxXQUFLLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFdBQU07O0FBQUEsQUFFUCxTQUFLLGdCQUFnQixDQUFDLGtCQUFrQjtBQUN2QyxnQkFBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDMUIsU0FBSSxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUMzQixlQUFTLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQyxhQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztNQUNwQztBQUNELFdBQUssVUFBVSxFQUFFLENBQUM7O0FBRWxCLG1CQUFjLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDNUMsV0FBTTs7QUFBQSxBQUVQLFNBQUssZ0JBQWdCLENBQUMsYUFBYTtBQUNsQyxjQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNoQyxZQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNwQyxXQUFLLFVBQVUsRUFBRSxDQUFDOztBQUVsQixtQkFBYyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzVDLFdBQU07O0FBQUEsQUFFUCxZQUFROztJQUVSO0dBRUQsQ0FBQyxDQUFDO0VBQ0g7O1dBdkNJLGNBQWM7O2NBQWQsY0FBYzs7OztTQTBDUixzQkFBRztBQUNYLE9BQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDckI7Ozs7O1NBR2dCLDJCQUFDLFFBQVEsRUFBRTtBQUMxQixPQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUM3Qjs7Ozs7U0FHbUIsOEJBQUMsUUFBUSxFQUFFO0FBQzdCLE9BQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ3pDOzs7U0FFYyw0QkFBRztBQUNsQixVQUFPLGNBQWMsQ0FBQztHQUN0Qjs7O1NBRVkseUJBQUc7QUFDZixVQUFPLFdBQVcsQ0FBQztHQUNuQjs7O1NBRVcsd0JBQUc7QUFDZCxVQUFPLFNBQVMsQ0FBQztHQUNqQjs7O1FBbEVJLGNBQWM7R0FBUyxZQUFZOztBQXNFekMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDbEZ0QyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQzs7QUFFbEQsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDM0QsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUNoRSxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQzs7QUFFekQsSUFBSSxjQUFjLENBQUM7QUFDbkIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLElBQUksU0FBUyxDQUFDOztJQUVSLGtCQUFrQjtBQUVaLFVBRk4sa0JBQWtCLEdBRVQ7Ozt3QkFGVCxrQkFBa0I7O0FBR3RCLDZCQUhJLGtCQUFrQiw2Q0FHZDtBQUNSLGdCQUFjLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxVQUFDLE1BQU0sRUFBSzs7QUFFbkQsV0FBUSxNQUFNLENBQUMsSUFBSTs7QUFFbEIsU0FBSyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUM7QUFDbEMsU0FBSyxnQkFBZ0IsQ0FBQyxhQUFhO0FBQ2xDLGtCQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNELFdBQU0sR0FBRyxFQUFFLENBQUM7QUFDWixjQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsV0FBSyxVQUFVLEVBQUUsQ0FBQztBQUNsQixXQUFNOztBQUFBLEFBRVAsU0FBSyxnQkFBZ0IsQ0FBQyx1QkFBdUI7QUFDNUMsV0FBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDckIsU0FBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN0QixlQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QyxhQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztNQUMvQjtBQUNELFdBQUssVUFBVSxFQUFFLENBQUM7QUFDbEIsV0FBTTs7QUFBQSxBQUVQLFNBQUssZ0JBQWdCLENBQUMsa0JBQWtCO0FBQ3ZDLGNBQVMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2hDLFlBQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLFdBQUssVUFBVSxFQUFFLENBQUM7QUFDbEIsV0FBTTs7QUFBQSxBQUVQLFlBQVE7O0lBRVI7R0FFRCxDQUFDLENBQUM7RUFDSDs7V0FwQ0ksa0JBQWtCOztjQUFsQixrQkFBa0I7Ozs7U0F1Q1osc0JBQUc7QUFDWCxPQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ3JCOzs7OztTQUdnQiwyQkFBQyxRQUFRLEVBQUU7QUFDMUIsT0FBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7R0FDN0I7Ozs7O1NBR21CLDhCQUFDLFFBQVEsRUFBRTtBQUM3QixPQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUN6Qzs7O1NBRWMsNEJBQUc7QUFDbEIsVUFBTyxjQUFjLENBQUM7R0FDdEI7OztTQUVnQiw2QkFBRztBQUNuQixVQUFPLE1BQU0sQ0FBQztHQUNkOzs7U0FFZSw0QkFBRztBQUNsQixVQUFPLFNBQVMsQ0FBQztHQUNqQjs7O1FBL0RJLGtCQUFrQjtHQUFTLFlBQVk7O0FBa0U3QyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7OztBQzdFMUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7O0FBRWxELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQzNELElBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDaEUsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7O0FBRTFELElBQUksY0FBYyxDQUFDO0FBQ25CLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNuQixJQUFJLFNBQVMsQ0FBQzs7SUFFUixZQUFZO0FBRU4sVUFGTixZQUFZLEdBRUg7Ozt3QkFGVCxZQUFZOztBQUdoQiw2QkFISSxZQUFZLDZDQUdSO0FBQ1IsZ0JBQWMsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLFVBQUMsTUFBTSxFQUFLOztBQUVuRCxXQUFRLE1BQU0sQ0FBQyxJQUFJOztBQUVsQixTQUFLLGdCQUFnQixDQUFDLGdCQUFnQjtBQUNyQyxjQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN4QixXQUFLLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFdBQU07O0FBQUEsQUFFUCxTQUFLLGdCQUFnQixDQUFDLFdBQVc7QUFDaEMsY0FBUyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEMsWUFBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbEMsV0FBSyxVQUFVLEVBQUUsQ0FBQzs7QUFFaEIsbUJBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM5QyxtQkFBYyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN4QyxXQUFNOztBQUFBLEFBRVAsWUFBUTs7SUFFUjtHQUVELENBQUMsQ0FBQztFQUNIOztXQTNCSSxZQUFZOztjQUFaLFlBQVk7Ozs7U0E4Qk4sc0JBQUc7QUFDWCxPQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ3JCOzs7OztTQUdnQiwyQkFBQyxRQUFRLEVBQUU7QUFDMUIsT0FBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7R0FDN0I7Ozs7O1NBR21CLDhCQUFDLFFBQVEsRUFBRTtBQUM3QixPQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUN6Qzs7O1NBRWMsNEJBQUc7QUFDbEIsVUFBTyxjQUFjLENBQUM7R0FDdEI7OztTQUVVLHVCQUFHO0FBQ2IsVUFBTyxTQUFTLENBQUM7R0FDakI7OztTQUVTLHNCQUFHO0FBQ1osVUFBTyxTQUFTLENBQUM7R0FDakI7OztRQXRESSxZQUFZO0dBQVMsWUFBWTs7QUF5RHZDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ3BFcEMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUUxQixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDO0FBQ2xELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQzNELElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7O0FBRWxFLElBQUksY0FBYyxDQUFDOztJQUViLGFBQWE7QUFFUCxVQUZOLGFBQWEsR0FFSjs7O3dCQUZULGFBQWE7O0FBR2pCLDZCQUhJLGFBQWEsNkNBR1Q7QUFDUixnQkFBYyxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsVUFBQyxNQUFNLEVBQUs7O0FBRW5ELFdBQVEsTUFBTSxDQUFDLElBQUk7O0FBRWxCLFNBQUssaUJBQWlCLENBQUMsYUFBYTtBQUNuQyxXQUFLLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsV0FBSyxVQUFVLEVBQUUsQ0FBQztBQUNsQixXQUFNOztBQUFBLEFBRVAsWUFBUTs7SUFFUjtHQUVELENBQUMsQ0FBQztFQUNIOztXQWxCSSxhQUFhOztjQUFiLGFBQWE7Ozs7U0FxQlAsc0JBQUc7QUFDWCxPQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ3JCOzs7OztTQUdnQiwyQkFBQyxRQUFRLEVBQUU7QUFDMUIsT0FBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7R0FDN0I7Ozs7O1NBR21CLDhCQUFDLFFBQVEsRUFBRTtBQUM3QixPQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUN6Qzs7O1NBRWMsNEJBQUc7QUFDbEIsVUFBTyxjQUFjLENBQUM7R0FDdEI7OztTQUVVLHFCQUFDLElBQUksRUFBRTtBQUNqQixPQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdEQsZUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0dBQzNEOzs7U0FFVSx1QkFBRztBQUNiLFVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0dBQzFEOzs7UUE5Q0ksYUFBYTtHQUFTLFlBQVk7O0FBaUR4QyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7QUN6RHJDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDOztBQUVsRCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUMzRCxJQUFJLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ2xFLElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOztBQUU1RCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7QUFFL0MsSUFBSSxjQUFjLENBQUM7QUFDbkIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDOztJQUVWLGtCQUFrQjtBQUVaLFVBRk4sa0JBQWtCLEdBRVQ7Ozt3QkFGVCxrQkFBa0I7O0FBR3RCLDZCQUhJLGtCQUFrQiw2Q0FHZDtBQUNSLGdCQUFjLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxVQUFDLE1BQU0sRUFBSzs7QUFFbkQsV0FBUSxNQUFNLENBQUMsSUFBSTs7QUFFbEIsU0FBSyxpQkFBaUIsQ0FBQyxhQUFhO0FBQ25DLGtCQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFELG9CQUFlLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDM0IsV0FBTTs7QUFBQSxBQUVQLFNBQUssaUJBQWlCLENBQUMsYUFBYTtBQUNuQyxXQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNyQixXQUFLLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFdBQU07O0FBQUEsQUFFUCxZQUFROztJQUVSO0dBRUQsQ0FBQyxDQUFDO0VBQ0g7O1dBdkJJLGtCQUFrQjs7Y0FBbEIsa0JBQWtCOzs7O1NBMEJaLHNCQUFHO0FBQ1gsT0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUNyQjs7Ozs7U0FHZ0IsMkJBQUMsUUFBUSxFQUFFO0FBQzFCLE9BQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQzdCOzs7OztTQUdtQiw4QkFBQyxRQUFRLEVBQUU7QUFDN0IsT0FBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7R0FDekM7OztTQUVjLDRCQUFHO0FBQ2xCLFVBQU8sY0FBYyxDQUFDO0dBQ3RCOzs7U0FFTyxvQkFBRztBQUNWLFVBQU8sTUFBTSxDQUFDO0dBQ2Q7OztRQTlDSSxrQkFBa0I7R0FBUyxZQUFZOztBQWlEN0MsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7Ozs7Ozs7OztBQzdEMUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUUxQixJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQzs7SUFFaEQsSUFBSTtVQUFKLElBQUk7d0JBQUosSUFBSTs7O2NBQUosSUFBSTs7U0FFUSxvQkFBQyxPQUFPLEVBQUU7O0FBRTFCLE9BQUksUUFBUSxHQUFHO0FBQ2QsUUFBSSxFQUFFLE1BQU07QUFDWixZQUFRLEVBQUUsTUFBTTtBQUNoQixRQUFJLEVBQUUsRUFBRTtBQUNMLFNBQUssRUFBRSxlQUFTLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO0FBQ3BDLFlBQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7S0FDaEQ7SUFDSixDQUFDOztBQUVGLE9BQUksV0FBVyxHQUFHLGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM5QyxPQUFJLFdBQVcsRUFBRTtBQUNoQixZQUFRLENBQUMsSUFBSSxHQUFHO0FBQ2YsY0FBUyxFQUFFLFdBQVcsQ0FBQyxPQUFPO0FBQzlCLGVBQVUsRUFBRSxXQUFXLENBQUMsV0FBVztLQUNuQyxDQUFDO0lBQ0Y7O0FBRUQsT0FBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2pELE9BQUksUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDeEQsS0FBQyxDQUFDLElBQUksQ0FBQywrQkFBK0IsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hFO0dBQ0Q7OztTQUVrQixzQkFBQyxNQUFNLEVBQUU7QUFDM0IsVUFBTyxNQUFNLENBQ1gsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FDdEIsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFHLENBQUMsQ0FBQztHQUMxQjs7O1FBL0JJLElBQUk7OztBQW1DVixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzs7O0FDeEN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDNVNBLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNoQyxJQUFJLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztBQUN6QyxJQUFJO0FBQ0YsSUFBRSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFO0FBQ3JDLFlBQVEsRUFBRSxLQUFLLEVBQ2hCLENBQUMsQ0FBQztBQUNILEtBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztDQUM1QixDQUFDLE9BQU0sRUFBRSxFQUFFO0FBQ1YsU0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDekI7O0FBRUQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNyQyxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO0FBQ3ZDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7O0FBRXpCLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7QUFDeEUsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDcEQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7O0FBRXRELElBQUksTUFBTSxHQUNSO0FBQUMsT0FBSztJQUFDLElBQUksRUFBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEFBQUM7RUFDcEQsb0JBQUMsS0FBSyxJQUFDLElBQUksRUFBQyxVQUFVLEVBQUMsT0FBTyxFQUFFLFFBQVEsQUFBQyxHQUFFO0VBQzNDLG9CQUFDLFlBQVksSUFBQyxJQUFJLEVBQUMsU0FBUyxFQUFDLE9BQU8sRUFBRSxPQUFPLEFBQUMsR0FBRTtDQUMxQyxBQUNULENBQUM7O0FBRUYsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxPQUFPLEVBQUU7QUFDcEMsT0FBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBQyxPQUFPLE9BQUUsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDekMsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgU2V0dGluZ3NDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvU2V0dGluZ3NDb25zdGFudHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgc2F2ZVNldHRpbmdzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICB0eXBlOiBTZXR0aW5nc0NvbnN0YW50cy5TQVZFX1NFVFRJTkdTLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pO1xuICB9LFxuXG4gIGdldFVzZXJzOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0VXRpbC5hcGlSZXF1ZXN0KHtcblx0XHRcdHVybDogJy9nZXRVc2Vycy5waHAnLFxuXHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHQvL3Jldml2ZXIgZnVuY3Rpb24gdG8gcmVuYW1lIGtleXNcblx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZywgZnVuY3Rpb24ocHJvcCwgdmFsKSB7XG5cdFx0XHRcdFx0c3dpdGNoIChwcm9wKSB7XG5cdFx0XHRcdFx0XHRjYXNlICdpZCc6XG5cdFx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGNhc2UgJ25hbWUnOlxuXHRcdFx0XHRcdFx0XHR0aGlzLmxhYmVsID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0ICBcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdCAgXHRcdHR5cGU6IFNldHRpbmdzQ29uc3RhbnRzLlJFQ0VJVkVfVVNFUlMsXG5cdFx0ICBcdFx0ZGF0YTogZGF0YVxuXHRcdCAgXHR9KTtcblx0ICAgIH1cblx0XHR9KTtcbiAgfVxuXG59O1xuIiwiXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBUcmFja2VyQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnKTtcblxudmFyIFRyYWNrZXJBY3Rpb25zID0ge1xuXG5cdGdldFByb2plY3RzOiBmdW5jdGlvbigpIHtcblx0XHRVdGlsLmFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFByb2plY3RzLnBocCcsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGFtb3VudDogMTAwLFxuXHRcdFx0XHRwYWdlbm86IDBcblx0XHRcdH0sXG5cdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coc3RyaW5nKVxuXHRcdFx0XHQvL3Jldml2ZXIgZnVuY3Rpb24gdG8gcmVuYW1lIGtleXNcblx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZywgZnVuY3Rpb24ocHJvcCwgdmFsKSB7XG5cdFx0XHRcdFx0c3dpdGNoIChwcm9wKSB7XG5cdFx0XHRcdFx0XHRjYXNlICdpZCc6XG5cdFx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGNhc2UgJ3RpdGxlJzpcblx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYgKGRhdGEubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGRhdGEudW5zaGlmdCh7IHZhbHVlOiAwLCBsYWJlbDogJ0Nob29zZS4uLicgfSk7XG5cdFx0XHRcdH1cblxuXHRcdCAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHQgICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfUFJPSkVDVFMsXG5cdFx0ICAgICAgZGF0YTogZGF0YVxuXHRcdCAgICB9KTtcbiAgICAgIH1cblx0XHR9KTtcblx0fSxcblxuXHRzZXRQcm9qZWN0OiBmdW5jdGlvbihpZCkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5TRVRfUFJPSkVDVCxcbiAgICAgIGlkOiBpZFxuICAgIH0pO1xuXHR9LFxuXG5cdGdldFByb2plY3REZXRhaWxzOiBmdW5jdGlvbihwcm9qZWN0KSB7XG5cdFx0aWYgKHByb2plY3QgPiAwKSB7XG5cdFx0XHRVdGlsLmFwaVJlcXVlc3Qoe1xuXHRcdFx0XHR1cmw6ICcvZ2V0UHJvamVjdC5waHAnLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0cHJvamVjdF9pZDogcHJvamVjdFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZyk7XG5cdFx0XHQgICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHQgICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlNFVF9DT05UQUNUX09SX0NPTVBBTlksXG5cdFx0XHQgICAgICBvcHRpb246IGRhdGEuY29udGFjdF9vcl9jb21wYW55LFxuXHRcdFx0ICAgICAgaWQ6IGRhdGEuY29udGFjdF9vcl9jb21wYW55X2lkXG5cdFx0XHQgICAgfSk7XG5cdCAgICAgIH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRnZXRNaWxlc3RvbmVzOiBmdW5jdGlvbihwcm9qZWN0KSB7XG5cdFx0aWYgKHByb2plY3QgPiAwKSB7XG5cdFx0XHRVdGlsLmFwaVJlcXVlc3Qoe1xuXHRcdFx0XHR1cmw6ICcvZ2V0TWlsZXN0b25lc0J5UHJvamVjdC5waHAnLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0cHJvamVjdF9pZDogcHJvamVjdFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdFx0Ly9yZXZpdmVyIGZ1bmN0aW9uIHRvIHJlbmFtZSBrZXlzXG5cdFx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZywgZnVuY3Rpb24ocHJvcCwgdmFsKSB7XG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRjYXNlICd0aXRsZSc6XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSBkYXRhLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0uY2xvc2VkID09IDEpIHtcblx0XHRcdFx0XHRcdFx0ZGF0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHQgICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHQgICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfTUlMRVNUT05FUyxcblx0XHRcdCAgICAgIGRhdGE6IGRhdGFcblx0XHRcdCAgICB9KTtcblx0ICAgICAgfVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cdH0sXG5cblx0c2V0TWlsZXN0b25lOiBmdW5jdGlvbihpZCkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FLFxuICAgICAgaWQ6IGlkXG4gICAgfSk7XG5cdH0sXG5cblx0Z2V0TWlsZXN0b25lVGFza3M6IGZ1bmN0aW9uKG1pbGVzdG9uZSkge1xuXG5cdFx0aWYgKG1pbGVzdG9uZSA+IDApIHtcblxuXHRcdFx0VXRpbC5hcGlSZXF1ZXN0KHtcblx0XHRcdFx0dXJsOiAnL2dldFRhc2tzQnlNaWxlc3RvbmUucGhwJyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdG1pbGVzdG9uZV9pZDogbWlsZXN0b25lXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdFx0XHQvL3Jldml2ZXIgZnVuY3Rpb24gdG8gcmVuYW1lIGtleXNcblx0XHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcCkge1xuXHRcdFx0XHRcdFx0XHRjYXNlICdpZCc6XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2Rlc2NyaXB0aW9uJzpcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmxhYmVsID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IGRhdGEubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5kb25lID09IDEpIHtcblx0XHRcdFx0XHRcdFx0ZGF0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dmFyIGFwcFNldHRpbmdzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZ3MnKSk7XG5cdFx0XHRcdFx0aWYgKGFwcFNldHRpbmdzICYmIGFwcFNldHRpbmdzLnVzZXJOYW1lKSB7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gZGF0YS5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0ub3duZXJfbmFtZSAhPSBhcHBTZXR0aW5ncy51c2VyTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRcdGRhdGEuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGRhdGEubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0ZGF0YS5wdXNoKHsgdmFsdWU6ICduZXcnLCBsYWJlbDogJ05ldyB0YXNrLi4uJyB9KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdCAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHRcdCAgICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVfVEFTS1MsXG5cdFx0XHQgICAgICBkYXRhOiBkYXRhXG5cdFx0XHQgICAgfSk7XG5cdCAgICAgIH1cblx0XHRcdH0pO1xuXG5cdFx0fVxuXHR9LFxuXG5cdHNldE1pbGVzdG9uZVRhc2s6IGZ1bmN0aW9uKGlkKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlNFVF9NSUxFU1RPTkVfVEFTSyxcbiAgICAgIGlkOiBpZFxuICAgIH0pO1xuXHR9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2tlckFjdGlvbnM7XG4iLCJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBUcmFja2VyQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnKTtcbnZhciBQcm9qZWN0U3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvUHJvamVjdFN0b3JlJyk7XG52YXIgTWlsZXN0b25lU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvTWlsZXN0b25lU3RvcmUnKTtcbnZhciBTZWxlY3RJbnB1dCA9IHJlcXVpcmUoJy4vU2VsZWN0SW5wdXQucmVhY3QnKTtcblxudmFyIE1pbGVzdG9uZVNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRNaWxlc3RvbmVzU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRtaWxlc3RvbmVzOiBNaWxlc3RvbmVTdG9yZS5nZXRNaWxlc3RvbmVzKCksXG5cdFx0XHRtaWxlc3RvbmU6IE1pbGVzdG9uZVN0b3JlLmdldE1pbGVzdG9uZSgpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0TWlsZXN0b25lc1N0YXRlKCk7XG5cdH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0TWlsZXN0b25lc1N0YXRlKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRUcmFja2VyQWN0aW9ucy5nZXRNaWxlc3RvbmVzKFByb2plY3RTdG9yZS5nZXRQcm9qZWN0KCkpO1xuICBcdE1pbGVzdG9uZVN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0TWlsZXN0b25lU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblx0XHRUcmFja2VyQWN0aW9ucy5zZXRNaWxlc3RvbmUodGFyZ2V0LnZhbHVlKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLm1pbGVzdG9uZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0XHRyZXR1cm4gKFxuXHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cIm1pbGVzdG9uZVwiPk1pbGVzdG9uZTwvbGFiZWw+XG5cdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0XHQ8U2VsZWN0SW5wdXQgXG5cdFx0XHRcdFx0XHRpZD1cIm1pbGVzdG9uZVwiIFxuXHRcdFx0XHRcdFx0cmVmPVwibWlsZXN0b25lXCIgXG5cdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS5taWxlc3RvbmV9XG5cdFx0XHRcdFx0XHRvcHRpb25zPXt0aGlzLnN0YXRlLm1pbGVzdG9uZXN9IFxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSBcblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1pbGVzdG9uZVNlbGVjdENvbnRhaW5lcjsiLCJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBUcmFja2VyQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnKTtcbnZhciBQcm9qZWN0U3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvUHJvamVjdFN0b3JlJyk7XG52YXIgU2VsZWN0SW5wdXQgPSByZXF1aXJlKCcuL1NlbGVjdElucHV0LnJlYWN0Jyk7XG5cbnZhciBQcm9qZWN0U2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldFByb2plY3RzU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRwcm9qZWN0czogUHJvamVjdFN0b3JlLmdldFByb2plY3RzKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRQcm9qZWN0c1N0YXRlKCk7XG5cdH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0UHJvamVjdHNTdGF0ZSgpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0VHJhY2tlckFjdGlvbnMuZ2V0UHJvamVjdHMoKTtcbiAgXHRQcm9qZWN0U3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRQcm9qZWN0U3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblx0XHRUcmFja2VyQWN0aW9ucy5zZXRQcm9qZWN0KHRhcmdldC52YWx1ZSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cInByb2plY3RcIj5Qcm9qZWN0PC9sYWJlbD5cblx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdDxTZWxlY3RJbnB1dCBpZD1cInByb2plY3RcIiByZWY9XCJwcm9qZWN0XCIgb3B0aW9ucz17dGhpcy5zdGF0ZS5wcm9qZWN0c30gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSAvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2plY3RTZWxlY3RDb250YWluZXI7XG4iLCJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIFNlbGVjdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cbiAgXHR2YXIgb3B0aW9uTm9kZXMgPSB0aGlzLnByb3BzLm9wdGlvbnMubWFwKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgcmV0dXJuIChcbiAgICAgIFx0PG9wdGlvbiBrZXk9e29wdGlvbi52YWx1ZX0gdmFsdWU9e29wdGlvbi52YWx1ZX0gPntVdGlsLmh0bWxFbnRpdGllcyhvcHRpb24ubGFiZWwpfTwvb3B0aW9uPlxuICAgICAgKTtcbiAgXHR9KTtcblxuXHRcdHJldHVybiAoXG5cdCAgXHQ8c2VsZWN0IFxuXHQgIFx0XHR7Li4udGhpcy5wcm9wc30gXG5cdCAgXHRcdGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIFxuXHRcdFx0PlxuXHQgIFx0XHR7b3B0aW9uTm9kZXN9XG5cdCAgXHQ8L3NlbGVjdD5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RJbnB1dDsiLCJcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgUm91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG52YXIgTGluayA9IFJvdXRlci5MaW5rO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcbnZhciBTZXR0aW5nc1N0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL1NldHRpbmdzU3RvcmUnKTtcbnZhciBTZXR0aW5nc1VzZXJzU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvU2V0dGluZ3NVc2Vyc1N0b3JlJyk7XG52YXIgU2V0dGluZ3NBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9TZXR0aW5nc0FjdGlvbnMnKTtcbnZhciBUZXh0SW5wdXQgPSByZXF1aXJlKCcuL1RleHRJbnB1dC5yZWFjdCcpO1xudmFyIFNlbGVjdElucHV0ID0gcmVxdWlyZSgnLi9TZWxlY3RJbnB1dC5yZWFjdCcpO1xudmFyIFVzZXJTZWxlY3RDb250YWluZXIgPSByZXF1aXJlKCcuL1VzZXJTZWxlY3RDb250YWluZXIucmVhY3QnKTtcblxudmFyIFNldHRpbmdzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFNldHRpbmdzU3RvcmUuZ2V0U2V0dGluZ3MoKTtcbiAgfSxcblxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoU2V0dGluZ3NTdG9yZS5nZXRTZXR0aW5ncygpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0U2V0dGluZ3NTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFNldHRpbmdzU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHZhciBncm91cElkID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmdyb3VwSWQpLnZhbHVlLnRyaW0oKTtcblx0XHR2YXIgZ3JvdXBTZWNyZXQgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuZ3JvdXBTZWNyZXQpLnZhbHVlLnRyaW0oKTtcblx0XHRpZiAoIWdyb3VwU2VjcmV0IHx8ICFncm91cElkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGNvbnRhaW5lciA9IHRoaXMucmVmcy51c2VyU2VsZWN0Q29udGFpbmVyO1xuXHRcdHZhciBzZWxlY3QgPSBjb250YWluZXIucmVmcy51c2VyU2VsZWN0O1xuXHRcdHZhciBzZWxlY3ROb2RlID0gUmVhY3QuZmluZERPTU5vZGUoc2VsZWN0KTtcblxuXHRcdFNldHRpbmdzQWN0aW9ucy5zYXZlU2V0dGluZ3Moe1xuXHRcdFx0Z3JvdXBJZDogZ3JvdXBJZCxcblx0XHRcdGdyb3VwU2VjcmV0OiBncm91cFNlY3JldCxcblx0XHRcdHVzZXJJZDogc2VsZWN0ID8gc2VsZWN0Tm9kZS52YWx1ZSA6IDAsXG5cdFx0XHR1c2VyTmFtZTogc2VsZWN0ID8gJChzZWxlY3ROb2RlKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS50ZXh0KCkgOiAnJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwic2V0dGluZ3NcIj5cblx0XHRcdFx0PGZvcm0gY2xhc3NOYW1lPVwiZm9ybS1ob3Jpem9udGFsXCIgb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cblx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cImdyb3VwLWlkXCI+R3JvdXAgSUQ8L2xhYmVsPlxuXHRcdFx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHQgICAgXHQ8VGV4dElucHV0IGlkPVwiZ3JvdXAtaWRcIiByZWY9XCJncm91cElkXCIgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLmdyb3VwSWR9IC8+XG5cdFx0XHRcdCAgICA8L2Rpdj5cblx0XHRcdFx0ICA8L2Rpdj5cblx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cImdyb3VwLXNlY3JldFwiPkdyb3VwIFNlY3JldDwvbGFiZWw+XG5cdFx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdCAgICBcdDxUZXh0SW5wdXQgaWQ9XCJncm91cC1zZWNyZXRcIiByZWY9XCJncm91cFNlY3JldFwiIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS5ncm91cFNlY3JldH0gLz5cblx0XHRcdFx0ICAgIDwvZGl2PlxuXHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHQgIDxVc2VyU2VsZWN0Q29udGFpbmVyIFxuXHRcdFx0XHQgIFx0cmVmPVwidXNlclNlbGVjdENvbnRhaW5lclwiXG5cdFx0XHRcdCAgICB1c2VySWQ9e3RoaXMuc3RhdGUudXNlcklkfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJidG4tdG9vbGJhclwiPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSBzYXZlLXNldHRpbmdzLWJ0blwiPlNhdmU8L2J1dHRvbj4gXG5cdFx0XHRcdFx0XHQ8TGluayB0bz1cInRyYWNrZXJcIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtIGJhY2stc2V0dGluZ3MtYnRuXCI+QmFjazwvTGluaz5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dGluZ3M7XG4iLCJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBUcmFja2VyQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnKTtcbnZhciBNaWxlc3RvbmVTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9NaWxlc3RvbmVTdG9yZScpO1xudmFyIE1pbGVzdG9uZVRhc2tTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9NaWxlc3RvbmVUYXNrU3RvcmUnKTtcbnZhciBTZWxlY3RJbnB1dCA9IHJlcXVpcmUoJy4vU2VsZWN0SW5wdXQucmVhY3QnKTtcbnZhciBUYXNrVHlwZVNlbGVjdENvbnRhaW5lciA9IHJlcXVpcmUoJy4vVGFza1R5cGVTZWxlY3RDb250YWluZXIucmVhY3QnKTtcblxudmFyIFRhc2tTZWxlY3RDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0VGFza3NTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRhc2tzOiBNaWxlc3RvbmVUYXNrU3RvcmUuZ2V0TWlsZXN0b25lVGFza3MoKSxcblx0XHRcdHRhc2s6IE1pbGVzdG9uZVRhc2tTdG9yZS5nZXRNaWxlc3RvbmVUYXNrKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRUYXNrc1N0YXRlKCk7XG5cdH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0VGFza3NTdGF0ZSgpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0VHJhY2tlckFjdGlvbnMuZ2V0TWlsZXN0b25lVGFza3MoTWlsZXN0b25lU3RvcmUuZ2V0TWlsZXN0b25lKCkpO1xuICBcdE1pbGVzdG9uZVRhc2tTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdE1pbGVzdG9uZVRhc2tTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdFRyYWNrZXJBY3Rpb25zLnNldE1pbGVzdG9uZVRhc2sodGFyZ2V0LnZhbHVlKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLnRhc2tzLmxlbmd0aCA+IDEpIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cIm1pbGVzdG9uZS10YXNrXCI+VG9kbzwvbGFiZWw+XG5cdFx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdFx0PFNlbGVjdElucHV0IFxuXHRcdFx0XHRcdFx0XHRpZD1cIm1pbGVzdG9uZS10YXNrXCIgXG5cdFx0XHRcdFx0XHRcdHJlZj1cIm1pbGVzdG9uZVRhc2tcIiBcblx0XHRcdFx0XHRcdFx0dmFsdWU9e3RoaXMuc3RhdGUudGFza30gXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnM9e3RoaXMuc3RhdGUudGFza3N9IFxuXHRcdFx0XHRcdFx0XHRvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IFxuXHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImN1c3RvbS10YXNrXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHRcdFx0ICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJ0YXNrLXR5cGVcIj5UeXBlPC9sYWJlbD5cblx0XHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0XHQgIFx0PFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyIC8+XG5cdFx0XHRcdFx0ICA8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG5cdFx0XHRcdFx0ICBcdDx0ZXh0YXJlYSBpZD1cInRhc2stZGVzY3JpcHRpb25cIiByZWY9XCJ0YXNrRGVzY3JpcHRpb25cIiBwbGFjZWhvbGRlcj1cIlRhc2sgZGVzY3JpcHRpb24uLi5cIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiByb3dzPVwiM1wiPjwvdGV4dGFyZWE+XG5cdFx0XHRcdFx0ICA8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQpO1xuXHRcdH1cblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGFza1NlbGVjdENvbnRhaW5lcjtcbiIsIlxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG52YXIgU2VsZWN0SW5wdXQgPSByZXF1aXJlKCcuL1NlbGVjdElucHV0LnJlYWN0Jyk7XG5cbnZhciBUYXNrVHlwZVNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0YXNrVHlwZXM6IFtdXG5cdFx0fVxuXHR9LFxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG5cblx0XHRVdGlsLmFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFRhc2tUeXBlcy5waHAnLFxuXHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHQvL3Jldml2ZXIgZnVuY3Rpb24gdG8gcmVuYW1lIGtleXNcblx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZywgZnVuY3Rpb24ocHJvcCwgdmFsKSB7XG5cdFx0XHRcdFx0c3dpdGNoIChwcm9wKSB7XG5cdFx0XHRcdFx0XHRjYXNlICdpZCc6XG5cdFx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGNhc2UgJ25hbWUnOlxuXHRcdFx0XHRcdFx0XHR0aGlzLmxhYmVsID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyB0YXNrVHlwZXM6IGRhdGEgfSk7XG4gICAgICB9XG5cdFx0fSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxTZWxlY3RJbnB1dCBpZD1cInRhc2stdHlwZVwiIHJlZj1cInRhc2tUeXBlXCIgb3B0aW9ucz17dGhpcy5zdGF0ZS50YXNrVHlwZXN9IC8+XG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGFza1R5cGVTZWxlY3RDb250YWluZXI7XG4iLCJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUm91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG52YXIgTGluayA9IFJvdXRlci5MaW5rO1xudmFyIFJvdXRlSGFuZGxlciA9IFJvdXRlci5Sb3V0ZUhhbmRsZXI7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyO1xuXG5cbnZhciBUZWFtbGVhZGVyVGltZUFwcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXBwXCI+XG5cdCAgXHRcdDxoZWFkZXI+XG5cdCAgXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJoZWFkZXJleHRcIj48L2Rpdj5cblx0ICBcdFx0XHQ8TGluayB0bz1cInNldHRpbmdzXCIgY2xhc3NOYW1lPVwic2V0dGluZ3MtbGlua1wiIGFjdGl2ZUNsYXNzTmFtZT1cImFjdGl2ZVwiPlxuXHQgIFx0XHRcdFx0PGkgY2xhc3NOYW1lPVwiZmEgZmEtY29nXCI+PC9pPlxuXHQgIFx0XHRcdDwvTGluaz5cblx0ICBcdFx0PC9oZWFkZXI+XG5cbiAgICAgICAgey8qIHRoaXMgaXMgdGhlIGltcG9ydGFudCBwYXJ0ICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgIDxSb3V0ZUhhbmRsZXIvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1sZWFkZXJUaW1lQXBwO1xuIiwiXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgVGV4dElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdC8vIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdC8vIFx0cmV0dXJuIHsgdmFsdWU6ICcnIH07XG5cdC8vIH0sXG5cblx0Ly8gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG5cdC8vIFx0dGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiBuZXh0UHJvcHMuc2F2ZWRWYWx1ZSB9KTtcblx0Ly8gfSxcblxuXHQvLyBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdC8vIFx0dGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiBldmVudC50YXJnZXQudmFsdWUgfSk7XG4gLy8gIH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHQvL3ZhciB2YWx1ZSA9IHRoaXMuc3RhdGUudmFsdWU7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxpbnB1dCBcblx0XHRcdFx0ey4uLnRoaXMucHJvcHN9XG5cdFx0XHRcdHR5cGU9XCJ0ZXh0XCIgXG5cdFx0XHRcdGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIFxuXHRcdFx0XHQvL3ZhbHVlPXt2YWx1ZX1cblx0XHRcdFx0Ly9vbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IFxuXHRcdFx0Lz5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0SW5wdXQ7IiwiXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgQ3VzdG9tZXJTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9DdXN0b21lclN0b3JlJyk7XG52YXIgUHJvamVjdFN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL1Byb2plY3RTdG9yZScpO1xudmFyIE1pbGVzdG9uZVN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL01pbGVzdG9uZVN0b3JlJyk7XG52YXIgTWlsZXN0b25lVGFza1N0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL01pbGVzdG9uZVRhc2tTdG9yZScpO1xuXG52YXIgUHJvamVjdFNlbGVjdENvbnRhaW5lciA9IHJlcXVpcmUoJy4vUHJvamVjdFNlbGVjdENvbnRhaW5lci5yZWFjdCcpO1xudmFyIE1pbGVzdG9uZVNlbGVjdENvbnRhaW5lciA9IHJlcXVpcmUoJy4vTWlsZXN0b25lU2VsZWN0Q29udGFpbmVyLnJlYWN0Jyk7XG52YXIgVGFza1NlbGVjdENvbnRhaW5lciA9IHJlcXVpcmUoJy4vVGFza1NlbGVjdENvbnRhaW5lci5yZWFjdCcpO1xuXG52YXIgVHJhY2tlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRUcmFja2VyU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRwcm9qZWN0OiBQcm9qZWN0U3RvcmUuZ2V0UHJvamVjdCgpLFxuXHRcdFx0bWlsZXN0b25lOiBNaWxlc3RvbmVTdG9yZS5nZXRNaWxlc3RvbmUoKSxcblx0XHRcdG1pbGVzdG9uZVRhc2s6IE1pbGVzdG9uZVRhc2tTdG9yZS5nZXRNaWxlc3RvbmVUYXNrKCksXG5cdFx0XHRjb250YWN0T3JDb21wYW55OiBDdXN0b21lclN0b3JlLmdldENvbnRhY3RPckNvbXBhbnkoKSxcblx0XHRcdGNvbnRhY3RPckNvbXBhbnlJZDogQ3VzdG9tZXJTdG9yZS5nZXRDb250YWN0T3JDb21wYW55SWQoKVxuXHRcdH1cblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFRyYWNrZXJTdGF0ZSgpXG5cdH0sXG5cblx0aGFuZGxlU3VibWl0OiBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc29sZS5sb2codGhpcy5nZXRUcmFja2VyU3RhdGUoKSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ0cmFja2VyXCI+XG5cdFx0XHRcdDxmb3JtIGNsYXNzTmFtZT1cImZvcm0taG9yaXpvbnRhbFwiIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG5cblx0XHRcdFx0XHQ8UHJvamVjdFNlbGVjdENvbnRhaW5lciAvPlxuXHRcdFx0XHRcdDxNaWxlc3RvbmVTZWxlY3RDb250YWluZXIgLz5cblx0XHRcdFx0XHQ8VGFza1NlbGVjdENvbnRhaW5lciAvPlxuXG5cdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJidG4tdG9vbGJhclwiPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSBzdGFydC10aW1lci1idG5cIj5cblx0XHRcdFx0XHRcdFx0U3RhcnQgdGltZXJcblx0XHRcdFx0XHRcdDwvYnV0dG9uPiBcblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2tlclxuIiwiXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgUm91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG52YXIgTGluayA9IFJvdXRlci5MaW5rO1xuXG52YXIgU2V0dGluZ3NTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9TZXR0aW5nc1N0b3JlJyk7XG52YXIgU2V0dGluZ3NVc2Vyc1N0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL1NldHRpbmdzVXNlcnNTdG9yZScpO1xudmFyIFNldHRpbmdzQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvU2V0dGluZ3NBY3Rpb25zJyk7XG5cbnZhciBTZWxlY3RJbnB1dCA9IHJlcXVpcmUoJy4vU2VsZWN0SW5wdXQucmVhY3QnKTtcblxudmFyIFVzZXJTZWxlY3RDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0VXNlcnNTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdCd1c2Vycyc6IFNldHRpbmdzVXNlcnNTdG9yZS5nZXRVc2VycygpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VXNlcnNTdGF0ZSgpO1xuICB9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFVzZXJzU3RhdGUoKSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFNldHRpbmdzQWN0aW9ucy5nZXRVc2VycygpO1xuICBcdFNldHRpbmdzVXNlcnNTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFNldHRpbmdzVXNlcnNTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS51c2Vycy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXHRcdHJldHVybiAoXG5cdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwidXNlci1zZWxlY3RcIj5TZWxlY3QgdXNlcjwvbGFiZWw+XG5cdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHQgICAgXHQ8U2VsZWN0SW5wdXQgXG5cdFx0ICAgIFx0XHRpZD1cInVzZXItc2VsZWN0XCIgXG5cdFx0ICAgIFx0XHRyZWY9XCJ1c2VyU2VsZWN0XCIgXG5cdFx0ICAgIFx0XHRvcHRpb25zPXt0aGlzLnN0YXRlLnVzZXJzfSBcblx0XHQgICAgXHRcdGRlZmF1bHRWYWx1ZT17dGhpcy5wcm9wcy51c2VySWR9XG5cdFx0ICAgIFx0Lz5cblx0XHQgICAgPC9kaXY+XG5cdFx0ICA8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyU2VsZWN0Q29udGFpbmVyO1xuIiwiXG52YXIga2V5TWlycm9yID0gcmVxdWlyZSgna2V5bWlycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yKHtcblx0U0FWRV9TRVRUSU5HUzogbnVsbCxcblx0UkVDRUlWRV9VU0VSUzogbnVsbFxufSk7XG4iLCJcbnZhciBrZXlNaXJyb3IgPSByZXF1aXJlKCdrZXltaXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3Ioe1xuXHRSRUNFSVZFX1BST0pFQ1RTOiBudWxsLFxuXHRSRUNFSVZFX01JTEVTVE9ORVM6IG51bGwsXG5cdFJFQ0VJVkVfTUlMRVNUT05FX1RBU0tTOiBudWxsLFxuXHRTRVRfUFJPSkVDVDogbnVsbCxcblx0U0VUX01JTEVTVE9ORTogbnVsbCxcblx0U0VUX01JTEVTVE9ORV9UQVNLOiBudWxsLFxuXHRTRVRfQ09OVEFDVF9PUl9DT01QQU5ZOiBudWxsXG59KTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEFwcERpc3BhdGNoZXJcbiAqXG4gKiBBIHNpbmdsZXRvbiB0aGF0IG9wZXJhdGVzIGFzIHRoZSBjZW50cmFsIGh1YiBmb3IgYXBwbGljYXRpb24gdXBkYXRlcy5cbiAqL1xuXG52YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEaXNwYXRjaGVyKCk7XG4iLCJcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xuXG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIFRyYWNrZXJDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvVHJhY2tlckNvbnN0YW50cycpO1xudmFyIFRyYWNrZXJBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucycpO1xuXG52YXIgX2Rpc3BhdGNoVG9rZW47XG52YXIgX2NvbnRhY3RPckNvbXBhbnk7XG52YXIgX2NvbnRhY3RPckNvbXBhbnlJZDtcblxuY2xhc3MgQ3VzdG9tZXJTdG9yZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdF9kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcigoYWN0aW9uKSA9PiB7XG5cblx0XHRcdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdFx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX0NPTlRBQ1RfT1JfQ09NUEFOWTpcblx0XHRcdFx0XHRfY29udGFjdE9yQ29tcGFueSA9IGFjdGlvbi5vcHRpb247XG5cdFx0XHRcdFx0X2NvbnRhY3RPckNvbXBhbnlJZCA9IGFjdGlvbi5pZDtcblx0XHRcdFx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdC8vbm8gb3Bcblx0XHRcdH1cblxuXHRcdH0pO1xuXHR9XG5cbiAgLy8gRW1pdCBDaGFuZ2UgZXZlbnRcbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICB9XG5cbiAgLy8gQWRkIGNoYW5nZSBsaXN0ZW5lclxuICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMub24oJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSBjaGFuZ2UgbGlzdGVuZXJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH1cblxuXHRnZXREaXNwYXRjaFRva2VuKCkge1xuXHRcdHJldHVybiBfZGlzcGF0Y2hUb2tlbjtcblx0fVxuXG5cdGdldENvbnRhY3RPckNvbXBhbnkoKSB7XG5cdFx0cmV0dXJuIF9jb250YWN0T3JDb21wYW55O1xuXHR9XG5cblx0Z2V0Q29udGFjdE9yQ29tcGFueUlkKCkge1xuXHRcdHJldHVybiBfY29udGFjdE9yQ29tcGFueUlkO1xuXHR9XG5cdFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBDdXN0b21lclN0b3JlKCk7XG4iLCJcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xuXG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIFRyYWNrZXJDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvVHJhY2tlckNvbnN0YW50cycpO1xudmFyIFRyYWNrZXJBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucycpO1xudmFyIFByb2plY3RTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9Qcm9qZWN0U3RvcmUnKTtcblxudmFyIF9kaXNwYXRjaFRva2VuO1xudmFyIF9taWxlc3RvbmVzID0gW107XG52YXIgX3NlbGVjdGVkO1xuXG5jbGFzcyBNaWxlc3RvbmVTdG9yZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHRfZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoKGFjdGlvbikgPT4ge1xuXG5cdFx0XHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRcdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9QUk9KRUNUOlxuXHRcdFx0XHRcdEFwcERpc3BhdGNoZXIud2FpdEZvcihbUHJvamVjdFN0b3JlLmdldERpc3BhdGNoVG9rZW4oKV0pO1xuXHRcdFx0XHRcdF9taWxlc3RvbmVzID0gW107XG5cdFx0XHRcdFx0X3NlbGVjdGVkID0gMDtcblx0XHRcdFx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVTOlxuXHRcdFx0XHRcdF9taWxlc3RvbmVzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRcdFx0aWYgKF9taWxlc3RvbmVzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KF9taWxlc3RvbmVzWzBdLnZhbHVlKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdtaWxlc3RvbmUnLCBfc2VsZWN0ZWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblxuXHRcdFx0XHRcdFRyYWNrZXJBY3Rpb25zLmdldE1pbGVzdG9uZVRhc2tzKF9zZWxlY3RlZCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9NSUxFU1RPTkU6XG5cdFx0XHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoYWN0aW9uLmlkKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnbWlsZXN0b25lJywgX3NlbGVjdGVkKTtcblx0XHRcdFx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblxuXHRcdFx0XHRcdFRyYWNrZXJBY3Rpb25zLmdldE1pbGVzdG9uZVRhc2tzKF9zZWxlY3RlZCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHQvL25vIG9wXG5cdFx0XHR9XG5cblx0XHR9KTtcblx0fVxuXG4gIC8vIEVtaXQgQ2hhbmdlIGV2ZW50XG4gIGVtaXRDaGFuZ2UoKSB7XG4gICAgdGhpcy5lbWl0KCdjaGFuZ2UnKTtcbiAgfVxuXG4gIC8vIEFkZCBjaGFuZ2UgbGlzdGVuZXJcbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH1cblxuICAvLyBSZW1vdmUgY2hhbmdlIGxpc3RlbmVyXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9XG5cblx0Z2V0RGlzcGF0Y2hUb2tlbigpIHtcblx0XHRyZXR1cm4gX2Rpc3BhdGNoVG9rZW47XG5cdH1cblxuXHRnZXRNaWxlc3RvbmVzKCkge1xuXHRcdHJldHVybiBfbWlsZXN0b25lcztcblx0fVxuXG5cdGdldE1pbGVzdG9uZSgpIHtcblx0XHRyZXR1cm4gX3NlbGVjdGVkO1xuXHR9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgTWlsZXN0b25lU3RvcmUoKTtcbiIsIlxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgVHJhY2tlckNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJyk7XG52YXIgTWlsZXN0b25lU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvTWlsZXN0b25lU3RvcmUnKTtcblxudmFyIF9kaXNwYXRjaFRva2VuO1xudmFyIF90YXNrcyA9IFtdO1xudmFyIF9zZWxlY3RlZDtcblxuY2xhc3MgTWlsZXN0b25lVGFza1N0b3JlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdF9kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcigoYWN0aW9uKSA9PiB7XG5cblx0XHRcdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdFx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX1BST0pFQ1Q6XG5cdFx0XHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FOlxuXHRcdFx0XHRcdEFwcERpc3BhdGNoZXIud2FpdEZvcihbTWlsZXN0b25lU3RvcmUuZ2V0RGlzcGF0Y2hUb2tlbigpXSk7XG5cdFx0XHRcdFx0X3Rhc2tzID0gW107XG5cdFx0XHRcdFx0X3NlbGVjdGVkID0gMDtcblx0XHRcdFx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVfVEFTS1M6XG5cdFx0XHRcdFx0X3Rhc2tzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRcdFx0aWYgKF90YXNrcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRfc2VsZWN0ZWQgPSBwYXJzZUludChfdGFza3NbMF0udmFsdWUpO1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ3Rhc2snLCBfc2VsZWN0ZWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX01JTEVTVE9ORV9UQVNLOlxuXHRcdFx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KGFjdGlvbi5pZCk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3Rhc2snLCBfc2VsZWN0ZWQpO1xuXHRcdFx0XHRcdHRoaXMuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Ly9ubyBvcFxuXHRcdFx0fVxuXG5cdFx0fSk7XG5cdH1cblxuICAvLyBFbWl0IENoYW5nZSBldmVudFxuICBlbWl0Q2hhbmdlKCkge1xuICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gIH1cblxuICAvLyBBZGQgY2hhbmdlIGxpc3RlbmVyXG4gIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgLy8gUmVtb3ZlIGNoYW5nZSBsaXN0ZW5lclxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfVxuXG5cdGdldERpc3BhdGNoVG9rZW4oKSB7XG5cdFx0cmV0dXJuIF9kaXNwYXRjaFRva2VuO1xuXHR9XG5cblx0Z2V0TWlsZXN0b25lVGFza3MoKSB7XG5cdFx0cmV0dXJuIF90YXNrcztcblx0fVxuXG5cdGdldE1pbGVzdG9uZVRhc2soKSB7XG5cdFx0cmV0dXJuIF9zZWxlY3RlZDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBNaWxlc3RvbmVUYXNrU3RvcmUoKTtcbiIsIlxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgVHJhY2tlckNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJyk7XG52YXIgVHJhY2tlckFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJyk7XG5cbnZhciBfZGlzcGF0Y2hUb2tlbjtcbnZhciBfcHJvamVjdHMgPSBbXTtcbnZhciBfc2VsZWN0ZWQ7XG5cbmNsYXNzIFByb2plY3RTdG9yZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHRfZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoKGFjdGlvbikgPT4ge1xuXG5cdFx0XHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRcdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfUFJPSkVDVFM6XG5cdFx0XHRcdFx0X3Byb2plY3RzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRcdFx0dGhpcy5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9QUk9KRUNUOlxuXHRcdFx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KGFjdGlvbi5pZCk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3Byb2plY3QnLCBfc2VsZWN0ZWQpO1xuXHRcdFx0XHRcdHRoaXMuZW1pdENoYW5nZSgpO1xuXG4gICAgXHRcdFx0VHJhY2tlckFjdGlvbnMuZ2V0UHJvamVjdERldGFpbHMoX3NlbGVjdGVkKTtcblx0XHRcdFx0XHRUcmFja2VyQWN0aW9ucy5nZXRNaWxlc3RvbmVzKF9zZWxlY3RlZCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHQvL25vIG9wXG5cdFx0XHR9XG5cblx0XHR9KTtcblx0fVxuXG4gIC8vIEVtaXQgQ2hhbmdlIGV2ZW50XG4gIGVtaXRDaGFuZ2UoKSB7XG4gICAgdGhpcy5lbWl0KCdjaGFuZ2UnKTtcbiAgfVxuXG4gIC8vIEFkZCBjaGFuZ2UgbGlzdGVuZXJcbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH1cblxuICAvLyBSZW1vdmUgY2hhbmdlIGxpc3RlbmVyXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9XG5cblx0Z2V0RGlzcGF0Y2hUb2tlbigpIHtcblx0XHRyZXR1cm4gX2Rpc3BhdGNoVG9rZW47XG5cdH1cblxuXHRnZXRQcm9qZWN0cygpIHtcblx0XHRyZXR1cm4gX3Byb2plY3RzO1xuXHR9XG5cblx0Z2V0UHJvamVjdCgpIHtcblx0XHRyZXR1cm4gX3NlbGVjdGVkO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFByb2plY3RTdG9yZSgpO1xuIiwiXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBTZXR0aW5nc0NvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cycpO1xuXG52YXIgX2Rpc3BhdGNoVG9rZW47XG5cbmNsYXNzIFNldHRpbmdzU3RvcmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0X2Rpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKChhY3Rpb24pID0+IHtcblxuXHRcdFx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0XHRcdGNhc2UgU2V0dGluZ3NDb25zdGFudHMuU0FWRV9TRVRUSU5HUzpcblx0XHRcdFx0XHR0aGlzLnNldFNldHRpbmdzKGFjdGlvbi5kYXRhKTtcblx0XHRcdFx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdC8vbm8gb3Bcblx0XHRcdH1cblxuXHRcdH0pO1xuXHR9XG5cbiAgLy8gRW1pdCBDaGFuZ2UgZXZlbnRcbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICB9XG5cbiAgLy8gQWRkIGNoYW5nZSBsaXN0ZW5lclxuICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMub24oJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSBjaGFuZ2UgbGlzdGVuZXJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH1cblxuXHRnZXREaXNwYXRjaFRva2VuKCkge1xuXHRcdHJldHVybiBfZGlzcGF0Y2hUb2tlbjtcblx0fVxuXG5cdHNldFNldHRpbmdzKGRhdGEpIHtcblx0XHR2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5nZXRTZXR0aW5ncygpLCBkYXRhKTtcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2V0dGluZ3MnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xuXHR9XG5cblx0Z2V0U2V0dGluZ3MoKSB7XG5cdFx0cmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpIHx8IHt9O1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFNldHRpbmdzU3RvcmUoKTtcbiIsIlxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgU2V0dGluZ3NDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvU2V0dGluZ3NDb25zdGFudHMnKTtcbnZhciBTZXR0aW5nc0FjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucycpO1xuXG52YXIgU2V0dGluZ3NTdG9yZSA9IHJlcXVpcmUoJy4vU2V0dGluZ3NTdG9yZScpO1xuXG52YXIgX2Rpc3BhdGNoVG9rZW47XG52YXIgX3VzZXJzID0gW107XG5cbmNsYXNzIFNldHRpbmdzVXNlcnNTdG9yZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHRfZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoKGFjdGlvbikgPT4ge1xuXG5cdFx0XHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRcdFx0Y2FzZSBTZXR0aW5nc0NvbnN0YW50cy5TQVZFX1NFVFRJTkdTOlxuXHRcdFx0XHRcdEFwcERpc3BhdGNoZXIud2FpdEZvcihbU2V0dGluZ3NTdG9yZS5nZXREaXNwYXRjaFRva2VuKCldKTtcblx0XHRcdFx0XHRTZXR0aW5nc0FjdGlvbnMuZ2V0VXNlcnMoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFNldHRpbmdzQ29uc3RhbnRzLlJFQ0VJVkVfVVNFUlM6XG5cdFx0XHRcdFx0X3VzZXJzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRcdFx0dGhpcy5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHQvL25vIG9wXG5cdFx0XHR9XG5cblx0XHR9KTtcblx0fVxuXG4gIC8vIEVtaXQgQ2hhbmdlIGV2ZW50XG4gIGVtaXRDaGFuZ2UoKSB7XG4gICAgdGhpcy5lbWl0KCdjaGFuZ2UnKTtcbiAgfVxuXG4gIC8vIEFkZCBjaGFuZ2UgbGlzdGVuZXJcbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH1cblxuICAvLyBSZW1vdmUgY2hhbmdlIGxpc3RlbmVyXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9XG5cblx0Z2V0RGlzcGF0Y2hUb2tlbigpIHtcblx0XHRyZXR1cm4gX2Rpc3BhdGNoVG9rZW47XG5cdH1cblxuXHRnZXRVc2VycygpIHtcblx0XHRyZXR1cm4gX3VzZXJzO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFNldHRpbmdzVXNlcnNTdG9yZSgpO1xuIiwiXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG52YXIgU2V0dGluZ3NTdG9yZSA9IHJlcXVpcmUoJy4vc3RvcmVzL1NldHRpbmdzU3RvcmUnKTtcblxuY2xhc3MgVXRpbCB7XG5cdFxuXHRzdGF0aWMgYXBpUmVxdWVzdChvcHRpb25zKSB7XG5cblx0XHR2YXIgZGVmYXVsdHMgPSB7XG5cdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRkYXRhVHlwZTogJ3RleHQnLFxuXHRcdFx0ZGF0YToge30sXG4gICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKG9wdGlvbnMudXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcbiAgICAgIH1cblx0XHR9O1xuXG5cdFx0dmFyIGFwcFNldHRpbmdzID0gU2V0dGluZ3NTdG9yZS5nZXRTZXR0aW5ncygpO1xuXHRcdGlmIChhcHBTZXR0aW5ncykge1xuXHRcdFx0ZGVmYXVsdHMuZGF0YSA9IHtcblx0XHRcdFx0YXBpX2dyb3VwOiBhcHBTZXR0aW5ncy5ncm91cElkLFxuXHRcdFx0XHRhcGlfc2VjcmV0OiBhcHBTZXR0aW5ncy5ncm91cFNlY3JldFxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHR2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cdFx0aWYgKHNldHRpbmdzLmRhdGEuYXBpX2dyb3VwICYmIHNldHRpbmdzLmRhdGEuYXBpX3NlY3JldCkge1xuXHRcdFx0JC5hamF4KCdodHRwczovL3d3dy50ZWFtbGVhZGVyLmJlL2FwaScgKyBvcHRpb25zLnVybCwgc2V0dGluZ3MpO1xuXHRcdH1cblx0fVxuXG5cdHN0YXRpYyBodG1sRW50aXRpZXMoc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHN0cmluZ1xuXHRcdFx0LnJlcGxhY2UoLyZhbXA7L2csICcmJylcblx0XHRcdC5yZXBsYWNlKC8mIzAzOTsvZywgXCInXCIpO1xuXHR9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVdGlsOyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIlxudmFyIGd1aSA9IG5vZGVSZXF1aXJlKCdudy5ndWknKTtcbnZhciBtYiA9IG5ldyBndWkuTWVudSh7dHlwZTogJ21lbnViYXInfSk7XG50cnkge1xuICBtYi5jcmVhdGVNYWNCdWlsdGluKCdUZWFtbGVhZGVyIFRpbWUnLCB7XG4gICAgaGlkZUVkaXQ6IGZhbHNlLFxuICB9KTtcbiAgZ3VpLldpbmRvdy5nZXQoKS5tZW51ID0gbWI7XG59IGNhdGNoKGV4KSB7XG4gIGNvbnNvbGUubG9nKGV4Lm1lc3NhZ2UpO1xufVxuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFJvdXRlciA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlcicpO1xudmFyIERlZmF1bHRSb3V0ZSA9IFJvdXRlci5EZWZhdWx0Um91dGU7XG52YXIgUm91dGUgPSBSb3V0ZXIuUm91dGU7XG5cbnZhciBUZWFtbGVhZGVyVGltZUFwcCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9UZWFtbGVhZGVyVGltZUFwcC5yZWFjdCcpO1xudmFyIFRyYWNrZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvVHJhY2tlci5yZWFjdCcpO1xudmFyIFNldHRpbmdzID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1NldHRpbmdzLnJlYWN0Jyk7XG5cbnZhciByb3V0ZXMgPSAoXG4gIDxSb3V0ZSBuYW1lPVwiYXBwXCIgcGF0aD1cIi9cIiBoYW5kbGVyPXtUZWFtbGVhZGVyVGltZUFwcH0+XG4gICAgPFJvdXRlIG5hbWU9XCJzZXR0aW5nc1wiIGhhbmRsZXI9e1NldHRpbmdzfS8+XG4gICAgPERlZmF1bHRSb3V0ZSBuYW1lPVwidHJhY2tlclwiIGhhbmRsZXI9e1RyYWNrZXJ9Lz5cbiAgPC9Sb3V0ZT5cbik7XG5cblJvdXRlci5ydW4ocm91dGVzLCBmdW5jdGlvbiAoSGFuZGxlcikge1xuICBSZWFjdC5yZW5kZXIoPEhhbmRsZXIvPiwgZG9jdW1lbnQuYm9keSk7XG59KTtcbiJdfQ==
