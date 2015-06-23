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

},{"../constants/SettingsConstants":8,"../dispatcher/AppDispatcher":10,"../util":17}],2:[function(require,module,exports){
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

},{"../constants/TrackerConstants":9,"../dispatcher/AppDispatcher":10,"../util":17}],3:[function(require,module,exports){
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

},{"../util":17,"react":"react"}],4:[function(require,module,exports){
'use strict';

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

	render: function render() {
		return React.createElement(
			'div',
			{ className: 'settings' },
			React.createElement(SettingsForm, {
				groupId: this.state.groupId,
				groupSecret: this.state.groupSecret,
				userId: this.state.userId
			})
		);
	}
});

var SettingsForm = React.createClass({
	displayName: 'SettingsForm',

	handleSubmit: function handleSubmit(e) {
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

	render: function render() {

		//console.log(this.props.groupId)

		return React.createElement(
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
					React.createElement(TextInput, { id: 'group-id', ref: 'groupId', defaultValue: this.props.groupId })
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
					React.createElement(TextInput, { id: 'group-secret', ref: 'groupSecret', defaultValue: this.props.groupSecret })
				)
			),
			React.createElement(UserSelectInputContainer, {
				ref: 'userSelectInputContainer',
				userId: this.props.userId
			}),
			React.createElement(
				'div',
				{ className: 'btn-toolbar' },
				React.createElement(
					'button',
					{ type: 'submit', 'data-loading-text': 'Loading...', className: 'btn btn-primary btn-sm save-settings-btn' },
					'Save'
				),
				React.createElement(
					Link,
					{ to: 'tracker', className: 'btn btn-default btn-sm back-settings-btn' },
					'Back'
				)
			)
		);
	}
});

var UserSelectInputContainer = React.createClass({
	displayName: 'UserSelectInputContainer',

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

module.exports = Settings;

},{"../actions/SettingsActions":1,"../stores/SettingsStore":15,"../stores/SettingsUsersStore":16,"../util":17,"./SelectInput.react":3,"./TextInput.react":6,"jquery":"jquery","react":"react","react-router":"react-router"}],5:[function(require,module,exports){
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

},{"events":18,"flux":"flux","react":"react","react-router":"react-router"}],6:[function(require,module,exports){
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

},{"react":"react"}],7:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var React = require('react');

var TrackerActions = require('../actions/TrackerActions');
var CustomerStore = require('../stores/CustomerStore');
var ProjectStore = require('../stores/ProjectStore');
var MilestoneStore = require('../stores/MilestoneStore');
var MilestoneTaskStore = require('../stores/MilestoneTaskStore');

var Util = require('../util');
var TextInput = require('./TextInput.react');
var SelectInput = require('./SelectInput.react');

var Tracker = React.createClass({
	displayName: 'Tracker',

	handleTrackerSubmit: function handleTrackerSubmit(data) {},

	render: function render() {
		return React.createElement(
			'div',
			{ className: 'tracker' },
			React.createElement(TrackerForm, {
				onTrackerSubmit: this.handleTrackerSubmit
			})
		);
	}
});

var TrackerForm = React.createClass({
	displayName: 'TrackerForm',

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
		);
	}
});

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

module.exports = Tracker;

},{"../actions/TrackerActions":2,"../stores/CustomerStore":11,"../stores/MilestoneStore":12,"../stores/MilestoneTaskStore":13,"../stores/ProjectStore":14,"../util":17,"./SelectInput.react":3,"./TextInput.react":6,"jquery":"jquery","react":"react"}],8:[function(require,module,exports){
'use strict';

var keyMirror = require('keymirror');

module.exports = keyMirror({
	SAVE_SETTINGS: null,
	RECEIVE_USERS: null
});

},{"keymirror":"keymirror"}],9:[function(require,module,exports){
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

},{"keymirror":"keymirror"}],10:[function(require,module,exports){
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

},{"flux":"flux"}],11:[function(require,module,exports){
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

},{"../actions/TrackerActions":2,"../constants/TrackerConstants":9,"../dispatcher/AppDispatcher":10,"events":18,"jquery":"jquery"}],12:[function(require,module,exports){
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

},{"../actions/TrackerActions":2,"../constants/TrackerConstants":9,"../dispatcher/AppDispatcher":10,"../stores/ProjectStore":14,"events":18,"jquery":"jquery"}],13:[function(require,module,exports){
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

},{"../constants/TrackerConstants":9,"../dispatcher/AppDispatcher":10,"../stores/MilestoneStore":12,"events":18,"jquery":"jquery"}],14:[function(require,module,exports){
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

},{"../actions/TrackerActions":2,"../constants/TrackerConstants":9,"../dispatcher/AppDispatcher":10,"events":18,"jquery":"jquery"}],15:[function(require,module,exports){
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

},{"../constants/SettingsConstants":8,"../dispatcher/AppDispatcher":10,"events":18,"jquery":"jquery"}],16:[function(require,module,exports){
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

},{"../actions/SettingsActions":1,"../constants/SettingsConstants":8,"../dispatcher/AppDispatcher":10,"./SettingsStore":15,"events":18,"jquery":"jquery"}],17:[function(require,module,exports){
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

},{"./stores/SettingsStore":15,"jquery":"jquery"}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{"./components/Settings.react":4,"./components/TeamleaderTimeApp.react":5,"./components/Tracker.react":7,"react":"react","react-router":"react-router"}]},{},[19])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1NlbGVjdElucHV0LnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9TZXR0aW5ncy5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVGVhbWxlYWRlclRpbWVBcHAucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1RleHRJbnB1dC5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVHJhY2tlci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL0N1c3RvbWVyU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvTWlsZXN0b25lU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvTWlsZXN0b25lVGFza1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1Byb2plY3RTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3N0b3Jlcy9TZXR0aW5nc1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1NldHRpbmdzVXNlcnNTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3V0aWwuanN4Iiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0NBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFOUIsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDM0QsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzs7QUFFbEUsTUFBTSxDQUFDLE9BQU8sR0FBRzs7QUFFZixhQUFZLEVBQUUsc0JBQVMsSUFBSSxFQUFFO0FBQzNCLGVBQWEsQ0FBQyxRQUFRLENBQUM7QUFDckIsT0FBSSxFQUFFLGlCQUFpQixDQUFDLGFBQWE7QUFDckMsT0FBSSxFQUFFLElBQUk7R0FDWCxDQUFDLENBQUM7RUFDSjs7QUFFRCxTQUFRLEVBQUUsa0JBQVMsSUFBSSxFQUFFO0FBQ3pCLE1BQUksQ0FBQyxVQUFVLENBQUM7QUFDZixNQUFHLEVBQUUsZUFBZTtBQUNwQixVQUFPLEVBQUUsaUJBQUMsTUFBTSxFQUFLOztBQUVwQixRQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDakQsYUFBUSxJQUFJO0FBQ1gsV0FBSyxJQUFJO0FBQ1IsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsY0FBTztBQUFBLEFBQ1IsV0FBSyxNQUFNO0FBQ1YsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsY0FBTztBQUFBLEFBQ1I7QUFDQyxjQUFPLEdBQUcsQ0FBQztBQUFBLE1BQ1o7S0FDRCxDQUFDLENBQUM7QUFDRixpQkFBYSxDQUFDLFFBQVEsQ0FBQztBQUN0QixTQUFJLEVBQUUsaUJBQWlCLENBQUMsYUFBYTtBQUNyQyxTQUFJLEVBQUUsSUFBSTtLQUNWLENBQUMsQ0FBQztJQUNGO0dBQ0gsQ0FBQyxDQUFDO0VBQ0Y7O0NBRUYsQ0FBQzs7Ozs7QUN2Q0YsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUU5QixJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUMzRCxJQUFJLGdCQUFnQixHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDOztBQUVoRSxJQUFJLGNBQWMsR0FBRzs7QUFFcEIsWUFBVyxFQUFFLHVCQUFXO0FBQ3ZCLE1BQUksQ0FBQyxVQUFVLENBQUM7QUFDZixNQUFHLEVBQUUsa0JBQWtCO0FBQ3ZCLE9BQUksRUFBRTtBQUNMLFVBQU0sRUFBRSxHQUFHO0FBQ1gsVUFBTSxFQUFFLENBQUM7SUFDVDtBQUNELFVBQU8sRUFBRSxpQkFBQyxNQUFNLEVBQUs7OztBQUdwQixRQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDakQsYUFBUSxJQUFJO0FBQ1gsV0FBSyxJQUFJO0FBQ1IsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsY0FBTztBQUFBLEFBQ1IsV0FBSyxPQUFPO0FBQ1gsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsY0FBTztBQUFBLEFBQ1I7QUFDQyxjQUFPLEdBQUcsQ0FBQztBQUFBLE1BQ1o7S0FDRCxDQUFDLENBQUM7O0FBRUgsUUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNwQixTQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztLQUMvQzs7QUFFQyxpQkFBYSxDQUFDLFFBQVEsQ0FBQztBQUNyQixTQUFJLEVBQUUsZ0JBQWdCLENBQUMsZ0JBQWdCO0FBQ3ZDLFNBQUksRUFBRSxJQUFJO0tBQ1gsQ0FBQyxDQUFDO0lBQ0Y7R0FDSixDQUFDLENBQUM7RUFDSDs7QUFFRCxXQUFVLEVBQUUsb0JBQVMsRUFBRSxFQUFFO0FBQ3RCLGVBQWEsQ0FBQyxRQUFRLENBQUM7QUFDckIsT0FBSSxFQUFFLGdCQUFnQixDQUFDLFdBQVc7QUFDbEMsS0FBRSxFQUFFLEVBQUU7R0FDUCxDQUFDLENBQUM7RUFDTDs7QUFFRCxrQkFBaUIsRUFBRSwyQkFBUyxPQUFPLEVBQUU7QUFDcEMsTUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO0FBQ2hCLE9BQUksQ0FBQyxVQUFVLENBQUM7QUFDZixPQUFHLEVBQUUsaUJBQWlCO0FBQ3RCLFFBQUksRUFBRTtBQUNMLGVBQVUsRUFBRSxPQUFPO0tBQ25CO0FBQ0QsV0FBTyxFQUFFLGlCQUFDLE1BQU0sRUFBSztBQUNwQixTQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLGtCQUFhLENBQUMsUUFBUSxDQUFDO0FBQ3JCLFVBQUksRUFBRSxnQkFBZ0IsQ0FBQyxzQkFBc0I7QUFDN0MsWUFBTSxFQUFFLElBQUksQ0FBQyxrQkFBa0I7QUFDL0IsUUFBRSxFQUFFLElBQUksQ0FBQyxxQkFBcUI7TUFDL0IsQ0FBQyxDQUFDO0tBQ0Y7SUFDSixDQUFDLENBQUM7R0FDSDtFQUNEOztBQUVELGNBQWEsRUFBRSx1QkFBUyxPQUFPLEVBQUU7QUFDaEMsTUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO0FBQ2hCLE9BQUksQ0FBQyxVQUFVLENBQUM7QUFDZixPQUFHLEVBQUUsNkJBQTZCO0FBQ2xDLFFBQUksRUFBRTtBQUNMLGVBQVUsRUFBRSxPQUFPO0tBQ25CO0FBQ0QsV0FBTyxFQUFFLGlCQUFDLE1BQU0sRUFBSzs7QUFFcEIsU0FBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBUyxJQUFJLEVBQUUsR0FBRyxFQUFFO0FBQ2pELGNBQVEsSUFBSTtBQUNYLFlBQUssSUFBSTtBQUNSLFlBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLGVBQU87QUFBQSxBQUNSLFlBQUssT0FBTztBQUNYLFlBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLGVBQU87QUFBQSxBQUNSO0FBQ0MsZUFBTyxHQUFHLENBQUM7QUFBQSxPQUNaO01BQ0QsQ0FBQyxDQUFDOztBQUVILFVBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4QyxVQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0FBQ3hCLFdBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQ2xCO01BQ0Q7O0FBRUMsa0JBQWEsQ0FBQyxRQUFRLENBQUM7QUFDckIsVUFBSSxFQUFFLGdCQUFnQixDQUFDLGtCQUFrQjtBQUN6QyxVQUFJLEVBQUUsSUFBSTtNQUNYLENBQUMsQ0FBQztLQUNGO0lBQ0osQ0FBQyxDQUFDO0dBRUg7RUFDRDs7QUFFRCxhQUFZLEVBQUUsc0JBQVMsRUFBRSxFQUFFO0FBQ3hCLGVBQWEsQ0FBQyxRQUFRLENBQUM7QUFDckIsT0FBSSxFQUFFLGdCQUFnQixDQUFDLGFBQWE7QUFDcEMsS0FBRSxFQUFFLEVBQUU7R0FDUCxDQUFDLENBQUM7RUFDTDs7QUFFRCxrQkFBaUIsRUFBRSwyQkFBUyxTQUFTLEVBQUU7O0FBRXRDLE1BQUksU0FBUyxHQUFHLENBQUMsRUFBRTs7QUFFbEIsT0FBSSxDQUFDLFVBQVUsQ0FBQztBQUNmLE9BQUcsRUFBRSwwQkFBMEI7QUFDL0IsUUFBSSxFQUFFO0FBQ0wsaUJBQVksRUFBRSxTQUFTO0tBQ3ZCO0FBQ0QsV0FBTyxFQUFFLGlCQUFDLE1BQU0sRUFBSzs7QUFFcEIsU0FBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBUyxJQUFJLEVBQUUsR0FBRyxFQUFFO0FBQ2pELGNBQVEsSUFBSTtBQUNYLFlBQUssSUFBSTtBQUNSLFlBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLGVBQU87QUFBQSxBQUNSLFlBQUssYUFBYTtBQUNqQixZQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNqQixlQUFPO0FBQUEsQUFDUjtBQUNDLGVBQU8sR0FBRyxDQUFDO0FBQUEsT0FDWjtNQUNELENBQUMsQ0FBQzs7QUFFSCxVQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDeEMsVUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRTtBQUN0QixXQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztPQUNsQjtNQUNEOztBQUVELFNBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQy9ELFNBQUksV0FBVyxJQUFJLFdBQVcsQ0FBQyxRQUFRLEVBQUU7QUFDeEMsV0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3hDLFdBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFO0FBQy9DLFlBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xCO09BQ0Q7TUFDRDs7QUFFRCxTQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDO01BQ2xEOztBQUVDLGtCQUFhLENBQUMsUUFBUSxDQUFDO0FBQ3JCLFVBQUksRUFBRSxnQkFBZ0IsQ0FBQyx1QkFBdUI7QUFDOUMsVUFBSSxFQUFFLElBQUk7TUFDWCxDQUFDLENBQUM7S0FDRjtJQUNKLENBQUMsQ0FBQztHQUVIO0VBQ0Q7O0FBRUQsaUJBQWdCLEVBQUUsMEJBQVMsRUFBRSxFQUFFO0FBQzVCLGVBQWEsQ0FBQyxRQUFRLENBQUM7QUFDckIsT0FBSSxFQUFFLGdCQUFnQixDQUFDLGtCQUFrQjtBQUN6QyxLQUFFLEVBQUUsRUFBRTtHQUNQLENBQUMsQ0FBQztFQUNMOztDQUVELENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUM7Ozs7Ozs7QUMvS2hDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRTlCLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUVuQyxPQUFNLEVBQUUsa0JBQVc7O0FBRWpCLE1BQUksV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFTLE1BQU0sRUFBRTtBQUN2RCxVQUNDOztNQUFRLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxBQUFDLEVBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEFBQUM7SUFBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFBVSxDQUMxRjtHQUNKLENBQUMsQ0FBQzs7QUFFSixTQUNFOztnQkFDSyxJQUFJLENBQUMsS0FBSztBQUNkLGFBQVMsRUFBQyxjQUFjOztHQUV2QixXQUFXO0dBQ0osQ0FDVDtFQUNGO0NBQ0QsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDOzs7OztBQ3hCN0IsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3JDLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7O0FBRXZCLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3ZELElBQUksa0JBQWtCLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFDakUsSUFBSSxlQUFlLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7O0FBRTVELElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM5QixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM3QyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7QUFFakQsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRWhDLGdCQUFlLEVBQUUsMkJBQVc7QUFDM0IsU0FBTyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7RUFDbEM7O0FBRUQsVUFBUyxFQUFFLHFCQUFXO0FBQ3BCLE1BQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7RUFDNUM7O0FBRUQsa0JBQWlCLEVBQUUsNkJBQVc7QUFDN0IsZUFBYSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUNoRDs7QUFFRCxxQkFBb0IsRUFBRSxnQ0FBVztBQUNoQyxlQUFhLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ25EOztBQUVGLE9BQU0sRUFBRSxrQkFBVztBQUNsQixTQUNDOztLQUFLLFNBQVMsRUFBQyxVQUFVO0dBQ3hCLG9CQUFDLFlBQVk7QUFDWixXQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEFBQUM7QUFDNUIsZUFBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxBQUFDO0FBQ3BDLFVBQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQUFBQztLQUN6QjtHQUNHLENBQ0w7RUFDRjtDQUNELENBQUMsQ0FBQzs7QUFFSCxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFFcEMsYUFBWSxFQUFFLHNCQUFTLENBQUMsRUFBRTtBQUN6QixHQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRW5CLE1BQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEUsTUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN4RSxNQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQzdCLFVBQU87R0FDUDs7QUFFRCxNQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDO0FBQ25ELE1BQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ3ZDLE1BQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTNDLGlCQUFlLENBQUMsWUFBWSxDQUFDO0FBQzVCLFVBQU8sRUFBRSxPQUFPO0FBQ2hCLGNBQVcsRUFBRSxXQUFXO0FBQ3hCLFNBQU0sRUFBRSxNQUFNLEdBQUcsVUFBVSxDQUFDLEtBQUssR0FBRyxDQUFDO0FBQ3JDLFdBQVEsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7R0FDcEUsQ0FBQyxDQUFDOztBQUVILFNBQU87RUFDUDs7QUFFRCxPQUFNLEVBQUUsa0JBQVc7Ozs7QUFJbEIsU0FDQzs7S0FBTSxTQUFTLEVBQUMsaUJBQWlCLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLEFBQUM7R0FDNUQ7O01BQUssU0FBUyxFQUFDLFlBQVk7SUFDekI7O09BQU8sU0FBUyxFQUFDLHdCQUF3QixFQUFDLE9BQU8sRUFBQyxVQUFVOztLQUFpQjtJQUM3RTs7T0FBSyxTQUFTLEVBQUMsVUFBVTtLQUN4QixvQkFBQyxTQUFTLElBQUMsRUFBRSxFQUFDLFVBQVUsRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQUFBQyxHQUFHO0tBQ3RFO0lBQ0Y7R0FDTjs7TUFBSyxTQUFTLEVBQUMsWUFBWTtJQUN6Qjs7T0FBTyxTQUFTLEVBQUMsd0JBQXdCLEVBQUMsT0FBTyxFQUFDLGNBQWM7O0tBQXFCO0lBQ3JGOztPQUFLLFNBQVMsRUFBQyxVQUFVO0tBQ3hCLG9CQUFDLFNBQVMsSUFBQyxFQUFFLEVBQUMsY0FBYyxFQUFDLEdBQUcsRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxBQUFDLEdBQUc7S0FDbEY7SUFDRjtHQUNOLG9CQUFDLHdCQUF3QjtBQUN4QixPQUFHLEVBQUMsMEJBQTBCO0FBQzdCLFVBQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQUFBQztLQUMzQjtHQUNEOztNQUFLLFNBQVMsRUFBQyxhQUFhO0lBQzVCOztPQUFRLElBQUksRUFBQyxRQUFRLEVBQUMscUJBQWtCLFlBQVksRUFBQyxTQUFTLEVBQUMsMENBQTBDOztLQUFjO0lBQ3ZIO0FBQUMsU0FBSTtPQUFDLEVBQUUsRUFBQyxTQUFTLEVBQUMsU0FBUyxFQUFDLDBDQUEwQzs7S0FBWTtJQUM5RTtHQUNBLENBQ047RUFDRjtDQUNELENBQUMsQ0FBQzs7QUFFSCxJQUFJLHdCQUF3QixHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUVoRCxjQUFhLEVBQUUseUJBQVc7QUFDekIsU0FBTztBQUNOLFVBQU8sRUFBRSxrQkFBa0IsQ0FBQyxRQUFRLEVBQUU7R0FDdEMsQ0FBQTtFQUNEOztBQUVELGdCQUFlLEVBQUUsMkJBQVc7QUFDM0IsU0FBTyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7RUFDM0I7O0FBRUQsVUFBUyxFQUFFLHFCQUFXO0FBQ3BCLE1BQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7RUFDckM7O0FBRUQsa0JBQWlCLEVBQUUsNkJBQVc7QUFDN0IsaUJBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMzQixvQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDckQ7O0FBRUQscUJBQW9CLEVBQUUsZ0NBQVc7QUFDaEMsb0JBQWtCLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ3hEOztBQUVGLE9BQU0sRUFBRSxrQkFBVztBQUNsQixNQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDL0MsU0FDRTs7S0FBSyxTQUFTLEVBQUMsWUFBWTtHQUN6Qjs7TUFBTyxTQUFTLEVBQUMsd0JBQXdCLEVBQUMsT0FBTyxFQUFDLGFBQWE7O0lBQW9CO0dBQ25GOztNQUFLLFNBQVMsRUFBQyxVQUFVO0lBQ3hCLG9CQUFDLFdBQVc7QUFDWCxPQUFFLEVBQUMsYUFBYTtBQUNoQixRQUFHLEVBQUMsWUFBWTtBQUNoQixZQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEFBQUM7QUFDMUIsaUJBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQUFBQztNQUMvQjtJQUNHO0dBQ0YsQ0FDTjtFQUNGO0NBQ0QsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFBOzs7OztBQ2hKekIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNyQyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7O0FBRXZDLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7QUFDbEQsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQzs7QUFHNUMsSUFBSSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFDeEMsUUFBTSxFQUFFLGtCQUFZO0FBQ2xCLFdBQ0U7O1FBQUssU0FBUyxFQUFDLEtBQUs7TUFDckI7OztRQUNDLDZCQUFLLFNBQVMsRUFBQyxXQUFXLEdBQU87UUFDakM7QUFBQyxjQUFJO1lBQUMsRUFBRSxFQUFDLFVBQVUsRUFBQyxTQUFTLEVBQUMsZUFBZSxFQUFDLGVBQWUsRUFBQyxRQUFRO1VBQ3JFLDJCQUFHLFNBQVMsRUFBQyxXQUFXLEdBQUs7U0FDdkI7T0FDQztNQUdOOztVQUFLLFNBQVMsRUFBQyxXQUFXO1FBQ3hCLG9CQUFDLFlBQVksT0FBRTtPQUNYO0tBQ0YsQ0FDTjtHQUNIO0NBQ0YsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsaUJBQWlCLENBQUM7Ozs7Ozs7O0FDN0JuQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQWNqQyxPQUFNLEVBQUUsa0JBQVc7O0FBRWxCLFNBQ0MsMENBQ0ssSUFBSSxDQUFDLEtBQUs7QUFDZCxPQUFJLEVBQUMsTUFBTTtBQUNYLFlBQVMsRUFBQyxjQUFjOzs7QUFBQSxLQUd2QixDQUNEO0VBQ0Y7Q0FDRCxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7Ozs7O0FDOUIzQixJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUMxRCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUN2RCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNyRCxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN6RCxJQUFJLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDOztBQUVqRSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDOUIsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDN0MsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0FBRWpELElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUUvQixvQkFBbUIsRUFBRSw2QkFBUyxJQUFJLEVBQUUsRUFDbkM7O0FBRUQsT0FBTSxFQUFFLGtCQUFXO0FBQ2xCLFNBQ0M7O0tBQUssU0FBUyxFQUFDLFNBQVM7R0FDdkIsb0JBQUMsV0FBVztBQUNYLG1CQUFlLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixBQUFDO0tBQ3pDO0dBQ0csQ0FDTDtFQUNGO0NBQ0QsQ0FBQyxDQUFDOztBQUVILElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUVuQyxnQkFBZSxFQUFFLDJCQUFXO0FBQzNCLFNBQU87QUFDTixVQUFPLEVBQUUsWUFBWSxDQUFDLFVBQVUsRUFBRTtBQUNsQyxZQUFTLEVBQUUsY0FBYyxDQUFDLFlBQVksRUFBRTtBQUN4QyxnQkFBYSxFQUFFLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFO0FBQ3BELG1CQUFnQixFQUFFLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRTtBQUNyRCxxQkFBa0IsRUFBRSxhQUFhLENBQUMscUJBQXFCLEVBQUU7R0FDekQsQ0FBQTtFQUNEOztBQUVELGdCQUFlLEVBQUUsMkJBQVc7QUFDM0IsU0FBTyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUE7RUFDN0I7O0FBRUQsYUFBWSxFQUFFLHNCQUFTLENBQUMsRUFBRTtBQUN6QixHQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRW5CLFNBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7RUFDcEM7O0FBRUQsT0FBTSxFQUFFLGtCQUFXO0FBQ2xCLFNBQ0M7O0tBQU0sU0FBUyxFQUFDLGlCQUFpQixFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWSxBQUFDO0dBRTdELG9CQUFDLHNCQUFzQixPQUFHO0dBQzFCLG9CQUFDLHdCQUF3QixPQUFHO0dBQzVCLG9CQUFDLG1CQUFtQixPQUFHO0dBRXRCOztNQUFLLFNBQVMsRUFBQyxhQUFhO0lBQzVCOztPQUFRLElBQUksRUFBQyxRQUFRLEVBQUMsU0FBUyxFQUFDLHdDQUF3Qzs7S0FFL0Q7SUFDSjtHQUNBLENBQ047RUFDRjtDQUNELENBQUMsQ0FBQzs7QUFFSCxJQUFJLHNCQUFzQixHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUU5QyxpQkFBZ0IsRUFBRSw0QkFBVztBQUM1QixTQUFPO0FBQ04sV0FBUSxFQUFFLFlBQVksQ0FBQyxXQUFXLEVBQUU7R0FDcEMsQ0FBQTtFQUNEOztBQUVELGdCQUFlLEVBQUUsMkJBQVc7QUFDM0IsU0FBTyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztFQUMvQjs7QUFFQSxVQUFTLEVBQUUscUJBQVc7QUFDcEIsTUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO0VBQ3hDOztBQUVELGtCQUFpQixFQUFFLDZCQUFXO0FBQzdCLGdCQUFjLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDN0IsY0FBWSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUMvQzs7QUFFRCxxQkFBb0IsRUFBRSxnQ0FBVztBQUNoQyxjQUFZLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ2xEOztBQUVGLGFBQVksRUFBRSxzQkFBUyxLQUFLLEVBQUU7QUFDN0IsTUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztBQUNqQyxnQkFBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDeEM7O0FBRUQsT0FBTSxFQUFFLGtCQUFXO0FBQ2xCLFNBQ0U7O0tBQUssU0FBUyxFQUFDLFlBQVk7R0FDekI7O01BQU8sU0FBUyxFQUFDLHdCQUF3QixFQUFDLE9BQU8sRUFBQyxTQUFTOztJQUFnQjtHQUMzRTs7TUFBSyxTQUFTLEVBQUMsVUFBVTtJQUMxQixvQkFBQyxXQUFXLElBQUMsRUFBRSxFQUFDLFNBQVMsRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQUFBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWSxBQUFDLEdBQUc7SUFDaEc7R0FDRCxDQUNMO0VBQ0Y7Q0FDRCxDQUFDLENBQUM7O0FBRUgsSUFBSSx3QkFBd0IsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFFaEQsbUJBQWtCLEVBQUUsOEJBQVc7QUFDOUIsU0FBTztBQUNOLGFBQVUsRUFBRSxjQUFjLENBQUMsYUFBYSxFQUFFO0FBQzFDLFlBQVMsRUFBRSxjQUFjLENBQUMsWUFBWSxFQUFFO0dBQ3hDLENBQUE7RUFDRDs7QUFFRCxnQkFBZSxFQUFFLDJCQUFXO0FBQzNCLFNBQU8sSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7RUFDakM7O0FBRUEsVUFBUyxFQUFFLHFCQUFXO0FBQ3BCLE1BQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztFQUMxQzs7QUFFRCxrQkFBaUIsRUFBRSw2QkFBVztBQUM3QixnQkFBYyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUN4RCxnQkFBYyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUNqRDs7QUFFRCxxQkFBb0IsRUFBRSxnQ0FBVztBQUNoQyxnQkFBYyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUNwRDs7QUFFRixhQUFZLEVBQUUsc0JBQVMsS0FBSyxFQUFFO0FBQzdCLE1BQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7QUFDakMsZ0JBQWMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzFDOztBQUVELE9BQU0sRUFBRSxrQkFBVztBQUNsQixNQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDcEQsU0FDRTs7S0FBSyxTQUFTLEVBQUMsWUFBWTtHQUN6Qjs7TUFBTyxTQUFTLEVBQUMsd0JBQXdCLEVBQUMsT0FBTyxFQUFDLFdBQVc7O0lBQWtCO0dBQy9FOztNQUFLLFNBQVMsRUFBQyxVQUFVO0lBQzFCLG9CQUFDLFdBQVc7QUFDWCxPQUFFLEVBQUMsV0FBVztBQUNkLFFBQUcsRUFBQyxXQUFXO0FBQ2YsVUFBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxBQUFDO0FBQzVCLFlBQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQUFBQztBQUMvQixhQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQUFBQztNQUMzQjtJQUNHO0dBQ0QsQ0FDTDtFQUNGO0NBQ0QsQ0FBQyxDQUFDOztBQUVILElBQUksbUJBQW1CLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRTNDLGNBQWEsRUFBRSx5QkFBVztBQUN6QixTQUFPO0FBQ04sUUFBSyxFQUFFLGtCQUFrQixDQUFDLGlCQUFpQixFQUFFO0FBQzdDLE9BQUksRUFBRSxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRTtHQUMzQyxDQUFBO0VBQ0Q7O0FBRUQsZ0JBQWUsRUFBRSwyQkFBVztBQUMzQixTQUFPLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztFQUM1Qjs7QUFFQSxVQUFTLEVBQUUscUJBQVc7QUFDcEIsTUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztFQUNyQzs7QUFFRCxrQkFBaUIsRUFBRSw2QkFBVztBQUM3QixnQkFBYyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBQ2hFLG9CQUFrQixDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUNyRDs7QUFFRCxxQkFBb0IsRUFBRSxnQ0FBVztBQUNoQyxvQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDeEQ7O0FBRUYsYUFBWSxFQUFFLHNCQUFTLEtBQUssRUFBRTtBQUM3QixNQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO0FBQ2pDLGdCQUFjLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzlDOztBQUVELE9BQU0sRUFBRSxrQkFBVztBQUNsQixNQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDaEMsVUFDRTs7TUFBSyxTQUFTLEVBQUMsWUFBWTtJQUN6Qjs7T0FBTyxTQUFTLEVBQUMsd0JBQXdCLEVBQUMsT0FBTyxFQUFDLGdCQUFnQjs7S0FBYTtJQUMvRTs7T0FBSyxTQUFTLEVBQUMsVUFBVTtLQUMxQixvQkFBQyxXQUFXO0FBQ1gsUUFBRSxFQUFDLGdCQUFnQjtBQUNuQixTQUFHLEVBQUMsZUFBZTtBQUNuQixXQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEFBQUM7QUFDdkIsYUFBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxBQUFDO0FBQzFCLGNBQVEsRUFBRSxJQUFJLENBQUMsWUFBWSxBQUFDO09BQzNCO0tBQ0c7SUFDRCxDQUNMO0dBQ0YsTUFBTTtBQUNOLFVBQ0M7O01BQUssU0FBUyxFQUFDLGFBQWE7SUFDM0I7O09BQUssU0FBUyxFQUFDLFlBQVk7S0FDekI7O1FBQU8sU0FBUyxFQUFDLHdCQUF3QixFQUFDLE9BQU8sRUFBQyxXQUFXOztNQUFhO0tBQzFFOztRQUFLLFNBQVMsRUFBQyxVQUFVO01BQ3hCLG9CQUFDLHVCQUF1QixPQUFHO01BQ3RCO0tBQ0Y7SUFDTjs7T0FBSyxTQUFTLEVBQUMsWUFBWTtLQUN6Qjs7UUFBSyxTQUFTLEVBQUMsV0FBVztNQUN6QixrQ0FBVSxFQUFFLEVBQUMsa0JBQWtCLEVBQUMsR0FBRyxFQUFDLGlCQUFpQixFQUFDLFdBQVcsRUFBQyxxQkFBcUIsRUFBQyxTQUFTLEVBQUMsY0FBYyxFQUFDLElBQUksRUFBQyxHQUFHLEdBQVk7TUFDaEk7S0FDRjtJQUNELENBQ0w7R0FDRjtFQUNEO0NBQ0QsQ0FBQyxDQUFDOztBQUVILElBQUksdUJBQXVCLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRS9DLGdCQUFlLEVBQUUsMkJBQVc7QUFDM0IsU0FBTztBQUNOLFlBQVMsRUFBRSxFQUFFO0dBQ2IsQ0FBQTtFQUNEO0FBQ0Qsa0JBQWlCLEVBQUUsNkJBQVc7OztBQUU3QixNQUFJLENBQUMsVUFBVSxDQUFDO0FBQ2YsTUFBRyxFQUFFLG1CQUFtQjtBQUN4QixVQUFPLEVBQUUsaUJBQUMsTUFBTSxFQUFLOztBQUVwQixRQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDakQsYUFBUSxJQUFJO0FBQ1gsV0FBSyxJQUFJO0FBQ1IsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsY0FBTztBQUFBLEFBQ1IsV0FBSyxNQUFNO0FBQ1YsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsY0FBTztBQUFBLEFBQ1I7QUFDQyxjQUFPLEdBQUcsQ0FBQztBQUFBLE1BQ1o7S0FDRCxDQUFDLENBQUM7QUFDSCxVQUFLLFFBQVEsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDO0dBQ0osQ0FBQyxDQUFDO0VBQ0g7QUFDRCxPQUFNLEVBQUUsa0JBQVc7QUFDbEIsU0FDQyxvQkFBQyxXQUFXLElBQUMsRUFBRSxFQUFDLFdBQVcsRUFBQyxHQUFHLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQUFBQyxHQUFHLENBQzNFO0VBQ0Y7Q0FDRCxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7Ozs7O0FDeFF4QixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXJDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQzFCLGNBQWEsRUFBRSxJQUFJO0FBQ25CLGNBQWEsRUFBRSxJQUFJO0NBQ25CLENBQUMsQ0FBQzs7Ozs7QUNMSCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXJDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQzFCLGlCQUFnQixFQUFFLElBQUk7QUFDdEIsbUJBQWtCLEVBQUUsSUFBSTtBQUN4Qix3QkFBdUIsRUFBRSxJQUFJO0FBQzdCLFlBQVcsRUFBRSxJQUFJO0FBQ2pCLGNBQWEsRUFBRSxJQUFJO0FBQ25CLG1CQUFrQixFQUFFLElBQUk7QUFDeEIsdUJBQXNCLEVBQUUsSUFBSTtDQUM1QixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0VILElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUM7O0FBRTVDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ2RsQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQzs7QUFFbEQsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDM0QsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUNoRSxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7QUFFMUQsSUFBSSxjQUFjLENBQUM7QUFDbkIsSUFBSSxpQkFBaUIsQ0FBQztBQUN0QixJQUFJLG1CQUFtQixDQUFDOztJQUVsQixhQUFhO0FBRVAsVUFGTixhQUFhLEdBRUo7Ozt3QkFGVCxhQUFhOztBQUdqQiw2QkFISSxhQUFhLDZDQUdUOztBQUVSLGdCQUFjLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxVQUFDLE1BQU0sRUFBSzs7QUFFbkQsV0FBUSxNQUFNLENBQUMsSUFBSTs7QUFFbEIsU0FBSyxnQkFBZ0IsQ0FBQyxzQkFBc0I7QUFDM0Msc0JBQWlCLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNsQyx3QkFBbUIsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDO0FBQ2hDLFdBQUssVUFBVSxFQUFFLENBQUM7QUFDbEIsV0FBTTs7QUFBQSxBQUVQLFlBQVE7O0lBRVI7R0FFRCxDQUFDLENBQUM7RUFDSDs7V0FwQkksYUFBYTs7Y0FBYixhQUFhOzs7O1NBdUJQLHNCQUFHO0FBQ1gsT0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUNyQjs7Ozs7U0FHZ0IsMkJBQUMsUUFBUSxFQUFFO0FBQzFCLE9BQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQzdCOzs7OztTQUdtQiw4QkFBQyxRQUFRLEVBQUU7QUFDN0IsT0FBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7R0FDekM7OztTQUVjLDRCQUFHO0FBQ2xCLFVBQU8sY0FBYyxDQUFDO0dBQ3RCOzs7U0FFa0IsK0JBQUc7QUFDckIsVUFBTyxpQkFBaUIsQ0FBQztHQUN6Qjs7O1NBRW9CLGlDQUFHO0FBQ3ZCLFVBQU8sbUJBQW1CLENBQUM7R0FDM0I7OztRQS9DSSxhQUFhO0dBQVMsWUFBWTs7QUFtRHhDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7OztBQzlEckMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7O0FBRWxELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQzNELElBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDaEUsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDMUQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7O0FBRXJELElBQUksY0FBYyxDQUFDO0FBQ25CLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUNyQixJQUFJLFNBQVMsQ0FBQzs7SUFFUixjQUFjO0FBRVIsVUFGTixjQUFjLEdBRUw7Ozt3QkFGVCxjQUFjOztBQUdsQiw2QkFISSxjQUFjLDZDQUdWO0FBQ1IsZ0JBQWMsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLFVBQUMsTUFBTSxFQUFLOztBQUVuRCxXQUFRLE1BQU0sQ0FBQyxJQUFJOztBQUVsQixTQUFLLGdCQUFnQixDQUFDLFdBQVc7QUFDaEMsa0JBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekQsZ0JBQVcsR0FBRyxFQUFFLENBQUM7QUFDakIsY0FBUyxHQUFHLENBQUMsQ0FBQztBQUNkLFdBQUssVUFBVSxFQUFFLENBQUM7QUFDbEIsV0FBTTs7QUFBQSxBQUVQLFNBQUssZ0JBQWdCLENBQUMsa0JBQWtCO0FBQ3ZDLGdCQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUMxQixTQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzNCLGVBQVMsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNDLGFBQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO01BQ3BDO0FBQ0QsV0FBSyxVQUFVLEVBQUUsQ0FBQzs7QUFFbEIsbUJBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1QyxXQUFNOztBQUFBLEFBRVAsU0FBSyxnQkFBZ0IsQ0FBQyxhQUFhO0FBQ2xDLGNBQVMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2hDLFlBQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLFdBQUssVUFBVSxFQUFFLENBQUM7O0FBRWxCLG1CQUFjLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDNUMsV0FBTTs7QUFBQSxBQUVQLFlBQVE7O0lBRVI7R0FFRCxDQUFDLENBQUM7RUFDSDs7V0F2Q0ksY0FBYzs7Y0FBZCxjQUFjOzs7O1NBMENSLHNCQUFHO0FBQ1gsT0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUNyQjs7Ozs7U0FHZ0IsMkJBQUMsUUFBUSxFQUFFO0FBQzFCLE9BQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQzdCOzs7OztTQUdtQiw4QkFBQyxRQUFRLEVBQUU7QUFDN0IsT0FBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7R0FDekM7OztTQUVjLDRCQUFHO0FBQ2xCLFVBQU8sY0FBYyxDQUFDO0dBQ3RCOzs7U0FFWSx5QkFBRztBQUNmLFVBQU8sV0FBVyxDQUFDO0dBQ25COzs7U0FFVyx3QkFBRztBQUNkLFVBQU8sU0FBUyxDQUFDO0dBQ2pCOzs7UUFsRUksY0FBYztHQUFTLFlBQVk7O0FBc0V6QyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNsRnRDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDOztBQUVsRCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUMzRCxJQUFJLGdCQUFnQixHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ2hFLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOztBQUV6RCxJQUFJLGNBQWMsQ0FBQztBQUNuQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsSUFBSSxTQUFTLENBQUM7O0lBRVIsa0JBQWtCO0FBRVosVUFGTixrQkFBa0IsR0FFVDs7O3dCQUZULGtCQUFrQjs7QUFHdEIsNkJBSEksa0JBQWtCLDZDQUdkO0FBQ1IsZ0JBQWMsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLFVBQUMsTUFBTSxFQUFLOztBQUVuRCxXQUFRLE1BQU0sQ0FBQyxJQUFJOztBQUVsQixTQUFLLGdCQUFnQixDQUFDLFdBQVcsQ0FBQztBQUNsQyxTQUFLLGdCQUFnQixDQUFDLGFBQWE7QUFDbEMsa0JBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDM0QsV0FBTSxHQUFHLEVBQUUsQ0FBQztBQUNaLGNBQVMsR0FBRyxDQUFDLENBQUM7QUFDZCxXQUFLLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFdBQU07O0FBQUEsQUFFUCxTQUFLLGdCQUFnQixDQUFDLHVCQUF1QjtBQUM1QyxXQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNyQixTQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3RCLGVBQVMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RDLGFBQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO01BQy9CO0FBQ0QsV0FBSyxVQUFVLEVBQUUsQ0FBQztBQUNsQixXQUFNOztBQUFBLEFBRVAsU0FBSyxnQkFBZ0IsQ0FBQyxrQkFBa0I7QUFDdkMsY0FBUyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEMsWUFBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDL0IsV0FBSyxVQUFVLEVBQUUsQ0FBQztBQUNsQixXQUFNOztBQUFBLEFBRVAsWUFBUTs7SUFFUjtHQUVELENBQUMsQ0FBQztFQUNIOztXQXBDSSxrQkFBa0I7O2NBQWxCLGtCQUFrQjs7OztTQXVDWixzQkFBRztBQUNYLE9BQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDckI7Ozs7O1NBR2dCLDJCQUFDLFFBQVEsRUFBRTtBQUMxQixPQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUM3Qjs7Ozs7U0FHbUIsOEJBQUMsUUFBUSxFQUFFO0FBQzdCLE9BQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ3pDOzs7U0FFYyw0QkFBRztBQUNsQixVQUFPLGNBQWMsQ0FBQztHQUN0Qjs7O1NBRWdCLDZCQUFHO0FBQ25CLFVBQU8sTUFBTSxDQUFDO0dBQ2Q7OztTQUVlLDRCQUFHO0FBQ2xCLFVBQU8sU0FBUyxDQUFDO0dBQ2pCOzs7UUEvREksa0JBQWtCO0dBQVMsWUFBWTs7QUFrRTdDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDN0UxQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQzs7QUFFbEQsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDM0QsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUNoRSxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7QUFFMUQsSUFBSSxjQUFjLENBQUM7QUFDbkIsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ25CLElBQUksU0FBUyxDQUFDOztJQUVSLFlBQVk7QUFFTixVQUZOLFlBQVksR0FFSDs7O3dCQUZULFlBQVk7O0FBR2hCLDZCQUhJLFlBQVksNkNBR1I7QUFDUixnQkFBYyxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsVUFBQyxNQUFNLEVBQUs7O0FBRW5ELFdBQVEsTUFBTSxDQUFDLElBQUk7O0FBRWxCLFNBQUssZ0JBQWdCLENBQUMsZ0JBQWdCO0FBQ3JDLGNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3hCLFdBQUssVUFBVSxFQUFFLENBQUM7QUFDbEIsV0FBTTs7QUFBQSxBQUVQLFNBQUssZ0JBQWdCLENBQUMsV0FBVztBQUNoQyxjQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNoQyxZQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNsQyxXQUFLLFVBQVUsRUFBRSxDQUFDOztBQUVoQixtQkFBYyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzlDLG1CQUFjLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3hDLFdBQU07O0FBQUEsQUFFUCxZQUFROztJQUVSO0dBRUQsQ0FBQyxDQUFDO0VBQ0g7O1dBM0JJLFlBQVk7O2NBQVosWUFBWTs7OztTQThCTixzQkFBRztBQUNYLE9BQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDckI7Ozs7O1NBR2dCLDJCQUFDLFFBQVEsRUFBRTtBQUMxQixPQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUM3Qjs7Ozs7U0FHbUIsOEJBQUMsUUFBUSxFQUFFO0FBQzdCLE9BQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ3pDOzs7U0FFYyw0QkFBRztBQUNsQixVQUFPLGNBQWMsQ0FBQztHQUN0Qjs7O1NBRVUsdUJBQUc7QUFDYixVQUFPLFNBQVMsQ0FBQztHQUNqQjs7O1NBRVMsc0JBQUc7QUFDWixVQUFPLFNBQVMsQ0FBQztHQUNqQjs7O1FBdERJLFlBQVk7R0FBUyxZQUFZOztBQXlEdkMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDcEVwQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTFCLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7QUFDbEQsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDM0QsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzs7QUFFbEUsSUFBSSxjQUFjLENBQUM7O0lBRWIsYUFBYTtBQUVQLFVBRk4sYUFBYSxHQUVKOzs7d0JBRlQsYUFBYTs7QUFHakIsNkJBSEksYUFBYSw2Q0FHVDtBQUNSLGdCQUFjLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxVQUFDLE1BQU0sRUFBSzs7QUFFbkQsV0FBUSxNQUFNLENBQUMsSUFBSTs7QUFFbEIsU0FBSyxpQkFBaUIsQ0FBQyxhQUFhO0FBQ25DLFdBQUssV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixXQUFLLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFdBQU07O0FBQUEsQUFFUCxZQUFROztJQUVSO0dBRUQsQ0FBQyxDQUFDO0VBQ0g7O1dBbEJJLGFBQWE7O2NBQWIsYUFBYTs7OztTQXFCUCxzQkFBRztBQUNYLE9BQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDckI7Ozs7O1NBR2dCLDJCQUFDLFFBQVEsRUFBRTtBQUMxQixPQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUM3Qjs7Ozs7U0FHbUIsOEJBQUMsUUFBUSxFQUFFO0FBQzdCLE9BQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ3pDOzs7U0FFYyw0QkFBRztBQUNsQixVQUFPLGNBQWMsQ0FBQztHQUN0Qjs7O1NBRVUscUJBQUMsSUFBSSxFQUFFO0FBQ2pCLE9BQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN0RCxlQUFZLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7R0FDM0Q7OztTQUVVLHVCQUFHO0FBQ2IsVUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDMUQ7OztRQTlDSSxhQUFhO0dBQVMsWUFBWTs7QUFpRHhDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ3pEckMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7O0FBRWxELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQzNELElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDbEUsSUFBSSxlQUFlLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7O0FBRTVELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztBQUUvQyxJQUFJLGNBQWMsQ0FBQztBQUNuQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7O0lBRVYsa0JBQWtCO0FBRVosVUFGTixrQkFBa0IsR0FFVDs7O3dCQUZULGtCQUFrQjs7QUFHdEIsNkJBSEksa0JBQWtCLDZDQUdkO0FBQ1IsZ0JBQWMsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLFVBQUMsTUFBTSxFQUFLOztBQUVuRCxXQUFRLE1BQU0sQ0FBQyxJQUFJOztBQUVsQixTQUFLLGlCQUFpQixDQUFDLGFBQWE7QUFDbkMsa0JBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUQsb0JBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMzQixXQUFNOztBQUFBLEFBRVAsU0FBSyxpQkFBaUIsQ0FBQyxhQUFhO0FBQ25DLFdBQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3JCLFdBQUssVUFBVSxFQUFFLENBQUM7QUFDbEIsV0FBTTs7QUFBQSxBQUVQLFlBQVE7O0lBRVI7R0FFRCxDQUFDLENBQUM7RUFDSDs7V0F2Qkksa0JBQWtCOztjQUFsQixrQkFBa0I7Ozs7U0EwQlosc0JBQUc7QUFDWCxPQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ3JCOzs7OztTQUdnQiwyQkFBQyxRQUFRLEVBQUU7QUFDMUIsT0FBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7R0FDN0I7Ozs7O1NBR21CLDhCQUFDLFFBQVEsRUFBRTtBQUM3QixPQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUN6Qzs7O1NBRWMsNEJBQUc7QUFDbEIsVUFBTyxjQUFjLENBQUM7R0FDdEI7OztTQUVPLG9CQUFHO0FBQ1YsVUFBTyxNQUFNLENBQUM7R0FDZDs7O1FBOUNJLGtCQUFrQjtHQUFTLFlBQVk7O0FBaUQ3QyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQzs7Ozs7Ozs7O0FDN0QxQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTFCLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDOztJQUVoRCxJQUFJO1VBQUosSUFBSTt3QkFBSixJQUFJOzs7Y0FBSixJQUFJOztTQUVRLG9CQUFDLE9BQU8sRUFBRTs7QUFFMUIsT0FBSSxRQUFRLEdBQUc7QUFDZCxRQUFJLEVBQUUsTUFBTTtBQUNaLFlBQVEsRUFBRSxNQUFNO0FBQ2hCLFFBQUksRUFBRSxFQUFFO0FBQ0wsU0FBSyxFQUFFLGVBQVMsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7QUFDcEMsWUFBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztLQUNoRDtJQUNKLENBQUM7O0FBRUYsT0FBSSxXQUFXLEdBQUcsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzlDLE9BQUksV0FBVyxFQUFFO0FBQ2hCLFlBQVEsQ0FBQyxJQUFJLEdBQUc7QUFDZixjQUFTLEVBQUUsV0FBVyxDQUFDLE9BQU87QUFDOUIsZUFBVSxFQUFFLFdBQVcsQ0FBQyxXQUFXO0tBQ25DLENBQUM7SUFDRjs7QUFFRCxPQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDakQsT0FBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUN4RCxLQUFDLENBQUMsSUFBSSxDQUFDLCtCQUErQixHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDaEU7R0FDRDs7O1NBRWtCLHNCQUFDLE1BQU0sRUFBRTtBQUMzQixVQUFPLE1BQU0sQ0FDWCxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUN0QixPQUFPLENBQUMsU0FBUyxFQUFFLElBQUcsQ0FBQyxDQUFDO0dBQzFCOzs7UUEvQkksSUFBSTs7O0FBbUNWLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOzs7QUN4Q3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1U0EsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2hDLElBQUksRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0FBQ3pDLElBQUk7QUFDRixJQUFFLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLEVBQUU7QUFDckMsWUFBUSxFQUFFLEtBQUssRUFDaEIsQ0FBQyxDQUFDO0FBQ0gsS0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0NBQzVCLENBQUMsT0FBTSxFQUFFLEVBQUU7QUFDVixTQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUN6Qjs7QUFFRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3JDLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDdkMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQzs7QUFFekIsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQztBQUN4RSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNwRCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7QUFFdEQsSUFBSSxNQUFNLEdBQ1I7QUFBQyxPQUFLO0lBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsQUFBQztFQUNwRCxvQkFBQyxLQUFLLElBQUMsSUFBSSxFQUFDLFVBQVUsRUFBQyxPQUFPLEVBQUUsUUFBUSxBQUFDLEdBQUU7RUFDM0Msb0JBQUMsWUFBWSxJQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsT0FBTyxFQUFFLE9BQU8sQUFBQyxHQUFFO0NBQzFDLEFBQ1QsQ0FBQzs7QUFFRixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLE9BQU8sRUFBRTtBQUNwQyxPQUFLLENBQUMsTUFBTSxDQUFDLG9CQUFDLE9BQU8sT0FBRSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUN6QyxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBTZXR0aW5nc0NvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBzYXZlU2V0dGluZ3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFNldHRpbmdzQ29uc3RhbnRzLlNBVkVfU0VUVElOR1MsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0sXG5cbiAgZ2V0VXNlcnM6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRVdGlsLmFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFVzZXJzLnBocCcsXG5cdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0Y2FzZSAnbmFtZSc6XG5cdFx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHQgIFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0ICBcdFx0dHlwZTogU2V0dGluZ3NDb25zdGFudHMuUkVDRUlWRV9VU0VSUyxcblx0XHQgIFx0XHRkYXRhOiBkYXRhXG5cdFx0ICBcdH0pO1xuXHQgICAgfVxuXHRcdH0pO1xuICB9XG5cbn07XG4iLCJcbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIFRyYWNrZXJDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvVHJhY2tlckNvbnN0YW50cycpO1xuXG52YXIgVHJhY2tlckFjdGlvbnMgPSB7XG5cblx0Z2V0UHJvamVjdHM6IGZ1bmN0aW9uKCkge1xuXHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHR1cmw6ICcvZ2V0UHJvamVjdHMucGhwJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0YW1vdW50OiAxMDAsXG5cdFx0XHRcdHBhZ2VubzogMFxuXHRcdFx0fSxcblx0XHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhzdHJpbmcpXG5cdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0Y2FzZSAndGl0bGUnOlxuXHRcdFx0XHRcdFx0XHR0aGlzLmxhYmVsID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoZGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0ZGF0YS51bnNoaWZ0KHsgdmFsdWU6IDAsIGxhYmVsOiAnQ2hvb3NlLi4uJyB9KTtcblx0XHRcdFx0fVxuXG5cdFx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdCAgICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9QUk9KRUNUUyxcblx0XHQgICAgICBkYXRhOiBkYXRhXG5cdFx0ICAgIH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXHR9LFxuXG5cdHNldFByb2plY3Q6IGZ1bmN0aW9uKGlkKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlNFVF9QUk9KRUNULFxuICAgICAgaWQ6IGlkXG4gICAgfSk7XG5cdH0sXG5cblx0Z2V0UHJvamVjdERldGFpbHM6IGZ1bmN0aW9uKHByb2plY3QpIHtcblx0XHRpZiAocHJvamVjdCA+IDApIHtcblx0XHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHRcdHVybDogJy9nZXRQcm9qZWN0LnBocCcsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRwcm9qZWN0X2lkOiBwcm9qZWN0XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nKTtcblx0XHRcdCAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHRcdCAgICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuU0VUX0NPTlRBQ1RfT1JfQ09NUEFOWSxcblx0XHRcdCAgICAgIG9wdGlvbjogZGF0YS5jb250YWN0X29yX2NvbXBhbnksXG5cdFx0XHQgICAgICBpZDogZGF0YS5jb250YWN0X29yX2NvbXBhbnlfaWRcblx0XHRcdCAgICB9KTtcblx0ICAgICAgfVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdGdldE1pbGVzdG9uZXM6IGZ1bmN0aW9uKHByb2plY3QpIHtcblx0XHRpZiAocHJvamVjdCA+IDApIHtcblx0XHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHRcdHVybDogJy9nZXRNaWxlc3RvbmVzQnlQcm9qZWN0LnBocCcsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRwcm9qZWN0X2lkOiBwcm9qZWN0XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdFx0XHQvL3Jldml2ZXIgZnVuY3Rpb24gdG8gcmVuYW1lIGtleXNcblx0XHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcCkge1xuXHRcdFx0XHRcdFx0XHRjYXNlICdpZCc6XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3RpdGxlJzpcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmxhYmVsID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IGRhdGEubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5jbG9zZWQgPT0gMSkge1xuXHRcdFx0XHRcdFx0XHRkYXRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdCAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHRcdCAgICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVTLFxuXHRcdFx0ICAgICAgZGF0YTogZGF0YVxuXHRcdFx0ICAgIH0pO1xuXHQgICAgICB9XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0fSxcblxuXHRzZXRNaWxlc3RvbmU6IGZ1bmN0aW9uKGlkKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlNFVF9NSUxFU1RPTkUsXG4gICAgICBpZDogaWRcbiAgICB9KTtcblx0fSxcblxuXHRnZXRNaWxlc3RvbmVUYXNrczogZnVuY3Rpb24obWlsZXN0b25lKSB7XG5cblx0XHRpZiAobWlsZXN0b25lID4gMCkge1xuXG5cdFx0XHRVdGlsLmFwaVJlcXVlc3Qoe1xuXHRcdFx0XHR1cmw6ICcvZ2V0VGFza3NCeU1pbGVzdG9uZS5waHAnLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0bWlsZXN0b25lX2lkOiBtaWxlc3RvbmVcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcsIGZ1bmN0aW9uKHByb3AsIHZhbCkge1xuXHRcdFx0XHRcdFx0c3dpdGNoIChwcm9wKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnZGVzY3JpcHRpb24nOlxuXHRcdFx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRmb3IgKHZhciBpID0gZGF0YS5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHRcdGlmIChkYXRhW2ldLmRvbmUgPT0gMSkge1xuXHRcdFx0XHRcdFx0XHRkYXRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR2YXIgYXBwU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXR0aW5ncycpKTtcblx0XHRcdFx0XHRpZiAoYXBwU2V0dGluZ3MgJiYgYXBwU2V0dGluZ3MudXNlck5hbWUpIHtcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSBkYXRhLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5vd25lcl9uYW1lICE9IGFwcFNldHRpbmdzLnVzZXJOYW1lKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoZGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRkYXRhLnB1c2goeyB2YWx1ZTogJ25ldycsIGxhYmVsOiAnTmV3IHRhc2suLi4nIH0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX01JTEVTVE9ORV9UQVNLUyxcblx0XHRcdCAgICAgIGRhdGE6IGRhdGFcblx0XHRcdCAgICB9KTtcblx0ICAgICAgfVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cdH0sXG5cblx0c2V0TWlsZXN0b25lVGFzazogZnVuY3Rpb24oaWQpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuU0VUX01JTEVTVE9ORV9UQVNLLFxuICAgICAgaWQ6IGlkXG4gICAgfSk7XG5cdH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFja2VyQWN0aW9ucztcbiIsIlxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgU2VsZWN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblxuICBcdHZhciBvcHRpb25Ob2RlcyA9IHRoaXMucHJvcHMub3B0aW9ucy5tYXAoZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgXHQ8b3B0aW9uIGtleT17b3B0aW9uLnZhbHVlfSB2YWx1ZT17b3B0aW9uLnZhbHVlfSA+e1V0aWwuaHRtbEVudGl0aWVzKG9wdGlvbi5sYWJlbCl9PC9vcHRpb24+XG4gICAgICApO1xuICBcdH0pO1xuXG5cdFx0cmV0dXJuIChcblx0ICBcdDxzZWxlY3QgXG5cdCAgXHRcdHsuLi50aGlzLnByb3BzfSBcblx0ICBcdFx0Y2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgXG5cdFx0XHQ+XG5cdCAgXHRcdHtvcHRpb25Ob2Rlc31cblx0ICBcdDwvc2VsZWN0PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdElucHV0OyIsIlxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcbnZhciBMaW5rID0gUm91dGVyLkxpbms7XG5cbnZhciBTZXR0aW5nc1N0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL1NldHRpbmdzU3RvcmUnKTtcbnZhciBTZXR0aW5nc1VzZXJzU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvU2V0dGluZ3NVc2Vyc1N0b3JlJyk7XG52YXIgU2V0dGluZ3NBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9TZXR0aW5nc0FjdGlvbnMnKTtcblxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG52YXIgVGV4dElucHV0ID0gcmVxdWlyZSgnLi9UZXh0SW5wdXQucmVhY3QnKTtcbnZhciBTZWxlY3RJbnB1dCA9IHJlcXVpcmUoJy4vU2VsZWN0SW5wdXQucmVhY3QnKTtcblxudmFyIFNldHRpbmdzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFNldHRpbmdzU3RvcmUuZ2V0U2V0dGluZ3MoKTtcbiAgfSxcblxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoU2V0dGluZ3NTdG9yZS5nZXRTZXR0aW5ncygpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0U2V0dGluZ3NTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFNldHRpbmdzU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwic2V0dGluZ3NcIj5cblx0XHRcdFx0PFNldHRpbmdzRm9ybSBcblx0XHRcdFx0XHRncm91cElkPXt0aGlzLnN0YXRlLmdyb3VwSWR9XG5cdFx0XHRcdFx0Z3JvdXBTZWNyZXQ9e3RoaXMuc3RhdGUuZ3JvdXBTZWNyZXR9XG5cdFx0XHRcdFx0dXNlcklkPXt0aGlzLnN0YXRlLnVzZXJJZH1cblx0XHRcdFx0Lz5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgU2V0dGluZ3NGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHZhciBncm91cElkID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmdyb3VwSWQpLnZhbHVlLnRyaW0oKTtcblx0XHR2YXIgZ3JvdXBTZWNyZXQgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuZ3JvdXBTZWNyZXQpLnZhbHVlLnRyaW0oKTtcblx0XHRpZiAoIWdyb3VwU2VjcmV0IHx8ICFncm91cElkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGNvbnRhaW5lciA9IHRoaXMucmVmcy51c2VyU2VsZWN0SW5wdXRDb250YWluZXI7XG5cdFx0dmFyIHNlbGVjdCA9IGNvbnRhaW5lci5yZWZzLnVzZXJTZWxlY3Q7XG5cdFx0dmFyIHNlbGVjdE5vZGUgPSBSZWFjdC5maW5kRE9NTm9kZShzZWxlY3QpO1xuXG5cdFx0U2V0dGluZ3NBY3Rpb25zLnNhdmVTZXR0aW5ncyh7XG5cdFx0XHRncm91cElkOiBncm91cElkLFxuXHRcdFx0Z3JvdXBTZWNyZXQ6IGdyb3VwU2VjcmV0LFxuXHRcdFx0dXNlcklkOiBzZWxlY3QgPyBzZWxlY3ROb2RlLnZhbHVlIDogMCxcblx0XHRcdHVzZXJOYW1lOiBzZWxlY3QgPyAkKHNlbGVjdE5vZGUpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnRleHQoKSA6ICcnXG5cdFx0fSk7XG5cblx0XHRyZXR1cm47XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblxuXHRcdC8vY29uc29sZS5sb2codGhpcy5wcm9wcy5ncm91cElkKVxuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxmb3JtIGNsYXNzTmFtZT1cImZvcm0taG9yaXpvbnRhbFwiIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG5cdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cImdyb3VwLWlkXCI+R3JvdXAgSUQ8L2xhYmVsPlxuXHRcdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdCAgICBcdDxUZXh0SW5wdXQgaWQ9XCJncm91cC1pZFwiIHJlZj1cImdyb3VwSWRcIiBkZWZhdWx0VmFsdWU9e3RoaXMucHJvcHMuZ3JvdXBJZH0gLz5cblx0XHRcdCAgICA8L2Rpdj5cblx0XHRcdCAgPC9kaXY+XG5cdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cImdyb3VwLXNlY3JldFwiPkdyb3VwIFNlY3JldDwvbGFiZWw+XG5cdFx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0ICAgIFx0PFRleHRJbnB1dCBpZD1cImdyb3VwLXNlY3JldFwiIHJlZj1cImdyb3VwU2VjcmV0XCIgZGVmYXVsdFZhbHVlPXt0aGlzLnByb3BzLmdyb3VwU2VjcmV0fSAvPlxuXHRcdFx0ICAgIDwvZGl2PlxuXHRcdFx0ICA8L2Rpdj5cblx0XHRcdCAgPFVzZXJTZWxlY3RJbnB1dENvbnRhaW5lciBcblx0XHRcdCAgXHRyZWY9XCJ1c2VyU2VsZWN0SW5wdXRDb250YWluZXJcIlxuXHRcdFx0ICAgIHVzZXJJZD17dGhpcy5wcm9wcy51c2VySWR9XG5cdFx0XHRcdC8+XG5cdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLXRvb2xiYXJcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBkYXRhLWxvYWRpbmctdGV4dD1cIkxvYWRpbmcuLi5cIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIHNhdmUtc2V0dGluZ3MtYnRuXCI+U2F2ZTwvYnV0dG9uPiBcblx0XHRcdFx0XHQ8TGluayB0bz1cInRyYWNrZXJcIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtIGJhY2stc2V0dGluZ3MtYnRuXCI+QmFjazwvTGluaz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Zvcm0+XG5cdFx0KTtcblx0fVxufSk7XG5cbnZhciBVc2VyU2VsZWN0SW5wdXRDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0VXNlcnNTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdCd1c2Vycyc6IFNldHRpbmdzVXNlcnNTdG9yZS5nZXRVc2VycygpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VXNlcnNTdGF0ZSgpO1xuICB9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFVzZXJzU3RhdGUoKSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFNldHRpbmdzQWN0aW9ucy5nZXRVc2VycygpO1xuICBcdFNldHRpbmdzVXNlcnNTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFNldHRpbmdzVXNlcnNTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS51c2Vycy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXHRcdHJldHVybiAoXG5cdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwidXNlci1zZWxlY3RcIj5TZWxlY3QgdXNlcjwvbGFiZWw+XG5cdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHQgICAgXHQ8U2VsZWN0SW5wdXQgXG5cdFx0ICAgIFx0XHRpZD1cInVzZXItc2VsZWN0XCIgXG5cdFx0ICAgIFx0XHRyZWY9XCJ1c2VyU2VsZWN0XCIgXG5cdFx0ICAgIFx0XHRvcHRpb25zPXt0aGlzLnN0YXRlLnVzZXJzfSBcblx0XHQgICAgXHRcdGRlZmF1bHRWYWx1ZT17dGhpcy5wcm9wcy51c2VySWR9XG5cdFx0ICAgIFx0Lz5cblx0XHQgICAgPC9kaXY+XG5cdFx0ICA8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5nc1xuIiwiXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFJvdXRlciA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlcicpO1xudmFyIExpbmsgPSBSb3V0ZXIuTGluaztcbnZhciBSb3V0ZUhhbmRsZXIgPSBSb3V0ZXIuUm91dGVIYW5kbGVyO1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4JykuRGlzcGF0Y2hlcjtcblxuXG52YXIgVGVhbWxlYWRlclRpbWVBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcFwiPlxuXHQgIFx0XHQ8aGVhZGVyPlxuXHQgIFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyZXh0XCI+PC9kaXY+XG5cdCAgXHRcdFx0PExpbmsgdG89XCJzZXR0aW5nc1wiIGNsYXNzTmFtZT1cInNldHRpbmdzLWxpbmtcIiBhY3RpdmVDbGFzc05hbWU9XCJhY3RpdmVcIj5cblx0ICBcdFx0XHRcdDxpIGNsYXNzTmFtZT1cImZhIGZhLWNvZ1wiPjwvaT5cblx0ICBcdFx0XHQ8L0xpbms+XG5cdCAgXHRcdDwvaGVhZGVyPlxuXG4gICAgICAgIHsvKiB0aGlzIGlzIHRoZSBpbXBvcnRhbnQgcGFydCAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICA8Um91dGVIYW5kbGVyLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtbGVhZGVyVGltZUFwcDtcbiIsIlxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIFRleHRJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHQvLyBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHQvLyBcdHJldHVybiB7IHZhbHVlOiAnJyB9O1xuXHQvLyB9LFxuXG5cdC8vIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuXHQvLyBcdHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogbmV4dFByb3BzLnNhdmVkVmFsdWUgfSk7XG5cdC8vIH0sXG5cblx0Ly8gaGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHQvLyBcdHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlIH0pO1xuIC8vICB9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0Ly92YXIgdmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8aW5wdXQgXG5cdFx0XHRcdHsuLi50aGlzLnByb3BzfVxuXHRcdFx0XHR0eXBlPVwidGV4dFwiIFxuXHRcdFx0XHRjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBcblx0XHRcdFx0Ly92YWx1ZT17dmFsdWV9XG5cdFx0XHRcdC8vb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSBcblx0XHRcdC8+XG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGV4dElucHV0OyIsIlxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBUcmFja2VyQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnKTtcbnZhciBDdXN0b21lclN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL0N1c3RvbWVyU3RvcmUnKTtcbnZhciBQcm9qZWN0U3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvUHJvamVjdFN0b3JlJyk7XG52YXIgTWlsZXN0b25lU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvTWlsZXN0b25lU3RvcmUnKTtcbnZhciBNaWxlc3RvbmVUYXNrU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvTWlsZXN0b25lVGFza1N0b3JlJyk7XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xudmFyIFRleHRJbnB1dCA9IHJlcXVpcmUoJy4vVGV4dElucHV0LnJlYWN0Jyk7XG52YXIgU2VsZWN0SW5wdXQgPSByZXF1aXJlKCcuL1NlbGVjdElucHV0LnJlYWN0Jyk7XG5cbnZhciBUcmFja2VyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGhhbmRsZVRyYWNrZXJTdWJtaXQ6IGZ1bmN0aW9uKGRhdGEpIHtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInRyYWNrZXJcIj5cblx0XHRcdFx0PFRyYWNrZXJGb3JtIFxuXHRcdFx0XHRcdG9uVHJhY2tlclN1Ym1pdD17dGhpcy5oYW5kbGVUcmFja2VyU3VibWl0fSBcblx0XHRcdFx0Lz5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgVHJhY2tlckZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0VHJhY2tlclN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJvamVjdDogUHJvamVjdFN0b3JlLmdldFByb2plY3QoKSxcblx0XHRcdG1pbGVzdG9uZTogTWlsZXN0b25lU3RvcmUuZ2V0TWlsZXN0b25lKCksXG5cdFx0XHRtaWxlc3RvbmVUYXNrOiBNaWxlc3RvbmVUYXNrU3RvcmUuZ2V0TWlsZXN0b25lVGFzaygpLFxuXHRcdFx0Y29udGFjdE9yQ29tcGFueTogQ3VzdG9tZXJTdG9yZS5nZXRDb250YWN0T3JDb21wYW55KCksXG5cdFx0XHRjb250YWN0T3JDb21wYW55SWQ6IEN1c3RvbWVyU3RvcmUuZ2V0Q29udGFjdE9yQ29tcGFueUlkKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRUcmFja2VyU3RhdGUoKVxuXHR9LFxuXG5cdGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnNvbGUubG9nKHRoaXMuZ2V0VHJhY2tlclN0YXRlKCkpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxmb3JtIGNsYXNzTmFtZT1cImZvcm0taG9yaXpvbnRhbFwiIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG5cblx0XHRcdFx0PFByb2plY3RTZWxlY3RDb250YWluZXIgLz5cblx0XHRcdFx0PE1pbGVzdG9uZVNlbGVjdENvbnRhaW5lciAvPlxuXHRcdFx0XHQ8VGFza1NlbGVjdENvbnRhaW5lciAvPlxuXG5cdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLXRvb2xiYXJcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIHN0YXJ0LXRpbWVyLWJ0blwiPlxuXHRcdFx0XHRcdFx0U3RhcnQgdGltZXJcblx0XHRcdFx0XHQ8L2J1dHRvbj4gXG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9mb3JtPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgUHJvamVjdFNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRQcm9qZWN0c1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJvamVjdHM6IFByb2plY3RTdG9yZS5nZXRQcm9qZWN0cygpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UHJvamVjdHNTdGF0ZSgpO1xuXHR9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFByb2plY3RzU3RhdGUoKSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFRyYWNrZXJBY3Rpb25zLmdldFByb2plY3RzKCk7XG4gIFx0UHJvamVjdFN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0UHJvamVjdFN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cdFx0VHJhY2tlckFjdGlvbnMuc2V0UHJvamVjdCh0YXJnZXQudmFsdWUpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJwcm9qZWN0XCI+UHJvamVjdDwvbGFiZWw+XG5cdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0XHQ8U2VsZWN0SW5wdXQgaWQ9XCJwcm9qZWN0XCIgcmVmPVwicHJvamVjdFwiIG9wdGlvbnM9e3RoaXMuc3RhdGUucHJvamVjdHN9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gLz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxudmFyIE1pbGVzdG9uZVNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRNaWxlc3RvbmVzU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRtaWxlc3RvbmVzOiBNaWxlc3RvbmVTdG9yZS5nZXRNaWxlc3RvbmVzKCksXG5cdFx0XHRtaWxlc3RvbmU6IE1pbGVzdG9uZVN0b3JlLmdldE1pbGVzdG9uZSgpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0TWlsZXN0b25lc1N0YXRlKCk7XG5cdH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0TWlsZXN0b25lc1N0YXRlKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRUcmFja2VyQWN0aW9ucy5nZXRNaWxlc3RvbmVzKFByb2plY3RTdG9yZS5nZXRQcm9qZWN0KCkpO1xuICBcdE1pbGVzdG9uZVN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0TWlsZXN0b25lU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblx0XHRUcmFja2VyQWN0aW9ucy5zZXRNaWxlc3RvbmUodGFyZ2V0LnZhbHVlKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLm1pbGVzdG9uZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0XHRyZXR1cm4gKFxuXHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cIm1pbGVzdG9uZVwiPk1pbGVzdG9uZTwvbGFiZWw+XG5cdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0XHQ8U2VsZWN0SW5wdXQgXG5cdFx0XHRcdFx0XHRpZD1cIm1pbGVzdG9uZVwiIFxuXHRcdFx0XHRcdFx0cmVmPVwibWlsZXN0b25lXCIgXG5cdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS5taWxlc3RvbmV9XG5cdFx0XHRcdFx0XHRvcHRpb25zPXt0aGlzLnN0YXRlLm1pbGVzdG9uZXN9IFxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSBcblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgVGFza1NlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRUYXNrc1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGFza3M6IE1pbGVzdG9uZVRhc2tTdG9yZS5nZXRNaWxlc3RvbmVUYXNrcygpLFxuXHRcdFx0dGFzazogTWlsZXN0b25lVGFza1N0b3JlLmdldE1pbGVzdG9uZVRhc2soKVxuXHRcdH1cblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFRhc2tzU3RhdGUoKTtcblx0fSxcblxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRUYXNrc1N0YXRlKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRUcmFja2VyQWN0aW9ucy5nZXRNaWxlc3RvbmVUYXNrcyhNaWxlc3RvbmVTdG9yZS5nZXRNaWxlc3RvbmUoKSk7XG4gIFx0TWlsZXN0b25lVGFza1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0TWlsZXN0b25lVGFza1N0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cdFx0VHJhY2tlckFjdGlvbnMuc2V0TWlsZXN0b25lVGFzayh0YXJnZXQudmFsdWUpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUudGFza3MubGVuZ3RoID4gMSkge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwibWlsZXN0b25lLXRhc2tcIj5Ub2RvPC9sYWJlbD5cblx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0XHQ8U2VsZWN0SW5wdXQgXG5cdFx0XHRcdFx0XHRcdGlkPVwibWlsZXN0b25lLXRhc2tcIiBcblx0XHRcdFx0XHRcdFx0cmVmPVwibWlsZXN0b25lVGFza1wiIFxuXHRcdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS50YXNrfSBcblx0XHRcdFx0XHRcdFx0b3B0aW9ucz17dGhpcy5zdGF0ZS50YXNrc30gXG5cdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY3VzdG9tLXRhc2tcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0XHQgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cInRhc2stdHlwZVwiPlR5cGU8L2xhYmVsPlxuXHRcdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdCAgXHQ8VGFza1R5cGVTZWxlY3RDb250YWluZXIgLz5cblx0XHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cblx0XHRcdFx0XHQgIFx0PHRleHRhcmVhIGlkPVwidGFzay1kZXNjcmlwdGlvblwiIHJlZj1cInRhc2tEZXNjcmlwdGlvblwiIHBsYWNlaG9sZGVyPVwiVGFzayBkZXNjcmlwdGlvbi4uLlwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHJvd3M9XCIzXCI+PC90ZXh0YXJlYT5cblx0XHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdCk7XG5cdFx0fVxuXHR9XG59KTtcblxudmFyIFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRhc2tUeXBlczogW11cblx0XHR9XG5cdH0sXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcblxuXHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHR1cmw6ICcvZ2V0VGFza1R5cGVzLnBocCcsXG5cdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0Y2FzZSAnbmFtZSc6XG5cdFx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHRhc2tUeXBlczogZGF0YSB9KTtcbiAgICAgIH1cblx0XHR9KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PFNlbGVjdElucHV0IGlkPVwidGFzay10eXBlXCIgcmVmPVwidGFza1R5cGVcIiBvcHRpb25zPXt0aGlzLnN0YXRlLnRhc2tUeXBlc30gLz5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFja2VyXG4iLCJcbnZhciBrZXlNaXJyb3IgPSByZXF1aXJlKCdrZXltaXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3Ioe1xuXHRTQVZFX1NFVFRJTkdTOiBudWxsLFxuXHRSRUNFSVZFX1VTRVJTOiBudWxsXG59KTtcbiIsIlxudmFyIGtleU1pcnJvciA9IHJlcXVpcmUoJ2tleW1pcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcih7XG5cdFJFQ0VJVkVfUFJPSkVDVFM6IG51bGwsXG5cdFJFQ0VJVkVfTUlMRVNUT05FUzogbnVsbCxcblx0UkVDRUlWRV9NSUxFU1RPTkVfVEFTS1M6IG51bGwsXG5cdFNFVF9QUk9KRUNUOiBudWxsLFxuXHRTRVRfTUlMRVNUT05FOiBudWxsLFxuXHRTRVRfTUlMRVNUT05FX1RBU0s6IG51bGwsXG5cdFNFVF9DT05UQUNUX09SX0NPTVBBTlk6IG51bGxcbn0pO1xuIiwiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQXBwRGlzcGF0Y2hlclxuICpcbiAqIEEgc2luZ2xldG9uIHRoYXQgb3BlcmF0ZXMgYXMgdGhlIGNlbnRyYWwgaHViIGZvciBhcHBsaWNhdGlvbiB1cGRhdGVzLlxuICovXG5cbnZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IERpc3BhdGNoZXIoKTtcbiIsIlxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgVHJhY2tlckNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJyk7XG52YXIgVHJhY2tlckFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJyk7XG5cbnZhciBfZGlzcGF0Y2hUb2tlbjtcbnZhciBfY29udGFjdE9yQ29tcGFueTtcbnZhciBfY29udGFjdE9yQ29tcGFueUlkO1xuXG5jbGFzcyBDdXN0b21lclN0b3JlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXG5cdFx0X2Rpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKChhY3Rpb24pID0+IHtcblxuXHRcdFx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0XHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfQ09OVEFDVF9PUl9DT01QQU5ZOlxuXHRcdFx0XHRcdF9jb250YWN0T3JDb21wYW55ID0gYWN0aW9uLm9wdGlvbjtcblx0XHRcdFx0XHRfY29udGFjdE9yQ29tcGFueUlkID0gYWN0aW9uLmlkO1xuXHRcdFx0XHRcdHRoaXMuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Ly9ubyBvcFxuXHRcdFx0fVxuXG5cdFx0fSk7XG5cdH1cblxuICAvLyBFbWl0IENoYW5nZSBldmVudFxuICBlbWl0Q2hhbmdlKCkge1xuICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gIH1cblxuICAvLyBBZGQgY2hhbmdlIGxpc3RlbmVyXG4gIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgLy8gUmVtb3ZlIGNoYW5nZSBsaXN0ZW5lclxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfVxuXG5cdGdldERpc3BhdGNoVG9rZW4oKSB7XG5cdFx0cmV0dXJuIF9kaXNwYXRjaFRva2VuO1xuXHR9XG5cblx0Z2V0Q29udGFjdE9yQ29tcGFueSgpIHtcblx0XHRyZXR1cm4gX2NvbnRhY3RPckNvbXBhbnk7XG5cdH1cblxuXHRnZXRDb250YWN0T3JDb21wYW55SWQoKSB7XG5cdFx0cmV0dXJuIF9jb250YWN0T3JDb21wYW55SWQ7XG5cdH1cblx0XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEN1c3RvbWVyU3RvcmUoKTtcbiIsIlxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgVHJhY2tlckNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJyk7XG52YXIgVHJhY2tlckFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJyk7XG52YXIgUHJvamVjdFN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL1Byb2plY3RTdG9yZScpO1xuXG52YXIgX2Rpc3BhdGNoVG9rZW47XG52YXIgX21pbGVzdG9uZXMgPSBbXTtcbnZhciBfc2VsZWN0ZWQ7XG5cbmNsYXNzIE1pbGVzdG9uZVN0b3JlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdF9kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcigoYWN0aW9uKSA9PiB7XG5cblx0XHRcdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdFx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX1BST0pFQ1Q6XG5cdFx0XHRcdFx0QXBwRGlzcGF0Y2hlci53YWl0Rm9yKFtQcm9qZWN0U3RvcmUuZ2V0RGlzcGF0Y2hUb2tlbigpXSk7XG5cdFx0XHRcdFx0X21pbGVzdG9uZXMgPSBbXTtcblx0XHRcdFx0XHRfc2VsZWN0ZWQgPSAwO1xuXHRcdFx0XHRcdHRoaXMuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX01JTEVTVE9ORVM6XG5cdFx0XHRcdFx0X21pbGVzdG9uZXMgPSBhY3Rpb24uZGF0YTtcblx0XHRcdFx0XHRpZiAoX21pbGVzdG9uZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoX21pbGVzdG9uZXNbMF0udmFsdWUpO1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ21pbGVzdG9uZScsIF9zZWxlY3RlZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuZW1pdENoYW5nZSgpO1xuXG5cdFx0XHRcdFx0VHJhY2tlckFjdGlvbnMuZ2V0TWlsZXN0b25lVGFza3MoX3NlbGVjdGVkKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX01JTEVTVE9ORTpcblx0XHRcdFx0XHRfc2VsZWN0ZWQgPSBwYXJzZUludChhY3Rpb24uaWQpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdtaWxlc3RvbmUnLCBfc2VsZWN0ZWQpO1xuXHRcdFx0XHRcdHRoaXMuZW1pdENoYW5nZSgpO1xuXG5cdFx0XHRcdFx0VHJhY2tlckFjdGlvbnMuZ2V0TWlsZXN0b25lVGFza3MoX3NlbGVjdGVkKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdC8vbm8gb3Bcblx0XHRcdH1cblxuXHRcdH0pO1xuXHR9XG5cbiAgLy8gRW1pdCBDaGFuZ2UgZXZlbnRcbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICB9XG5cbiAgLy8gQWRkIGNoYW5nZSBsaXN0ZW5lclxuICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMub24oJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSBjaGFuZ2UgbGlzdGVuZXJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH1cblxuXHRnZXREaXNwYXRjaFRva2VuKCkge1xuXHRcdHJldHVybiBfZGlzcGF0Y2hUb2tlbjtcblx0fVxuXG5cdGdldE1pbGVzdG9uZXMoKSB7XG5cdFx0cmV0dXJuIF9taWxlc3RvbmVzO1xuXHR9XG5cblx0Z2V0TWlsZXN0b25lKCkge1xuXHRcdHJldHVybiBfc2VsZWN0ZWQ7XG5cdH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBNaWxlc3RvbmVTdG9yZSgpO1xuIiwiXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBUcmFja2VyQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnKTtcbnZhciBNaWxlc3RvbmVTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9NaWxlc3RvbmVTdG9yZScpO1xuXG52YXIgX2Rpc3BhdGNoVG9rZW47XG52YXIgX3Rhc2tzID0gW107XG52YXIgX3NlbGVjdGVkO1xuXG5jbGFzcyBNaWxlc3RvbmVUYXNrU3RvcmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0X2Rpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKChhY3Rpb24pID0+IHtcblxuXHRcdFx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0XHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfUFJPSkVDVDpcblx0XHRcdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9NSUxFU1RPTkU6XG5cdFx0XHRcdFx0QXBwRGlzcGF0Y2hlci53YWl0Rm9yKFtNaWxlc3RvbmVTdG9yZS5nZXREaXNwYXRjaFRva2VuKCldKTtcblx0XHRcdFx0XHRfdGFza3MgPSBbXTtcblx0XHRcdFx0XHRfc2VsZWN0ZWQgPSAwO1xuXHRcdFx0XHRcdHRoaXMuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX01JTEVTVE9ORV9UQVNLUzpcblx0XHRcdFx0XHRfdGFza3MgPSBhY3Rpb24uZGF0YTtcblx0XHRcdFx0XHRpZiAoX3Rhc2tzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KF90YXNrc1swXS52YWx1ZSk7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygndGFzaycsIF9zZWxlY3RlZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FX1RBU0s6XG5cdFx0XHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoYWN0aW9uLmlkKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygndGFzaycsIF9zZWxlY3RlZCk7XG5cdFx0XHRcdFx0dGhpcy5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHQvL25vIG9wXG5cdFx0XHR9XG5cblx0XHR9KTtcblx0fVxuXG4gIC8vIEVtaXQgQ2hhbmdlIGV2ZW50XG4gIGVtaXRDaGFuZ2UoKSB7XG4gICAgdGhpcy5lbWl0KCdjaGFuZ2UnKTtcbiAgfVxuXG4gIC8vIEFkZCBjaGFuZ2UgbGlzdGVuZXJcbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH1cblxuICAvLyBSZW1vdmUgY2hhbmdlIGxpc3RlbmVyXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9XG5cblx0Z2V0RGlzcGF0Y2hUb2tlbigpIHtcblx0XHRyZXR1cm4gX2Rpc3BhdGNoVG9rZW47XG5cdH1cblxuXHRnZXRNaWxlc3RvbmVUYXNrcygpIHtcblx0XHRyZXR1cm4gX3Rhc2tzO1xuXHR9XG5cblx0Z2V0TWlsZXN0b25lVGFzaygpIHtcblx0XHRyZXR1cm4gX3NlbGVjdGVkO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IE1pbGVzdG9uZVRhc2tTdG9yZSgpO1xuIiwiXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBUcmFja2VyQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnKTtcbnZhciBUcmFja2VyQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnKTtcblxudmFyIF9kaXNwYXRjaFRva2VuO1xudmFyIF9wcm9qZWN0cyA9IFtdO1xudmFyIF9zZWxlY3RlZDtcblxuY2xhc3MgUHJvamVjdFN0b3JlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdF9kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcigoYWN0aW9uKSA9PiB7XG5cblx0XHRcdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdFx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9QUk9KRUNUUzpcblx0XHRcdFx0XHRfcHJvamVjdHMgPSBhY3Rpb24uZGF0YTtcblx0XHRcdFx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX1BST0pFQ1Q6XG5cdFx0XHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoYWN0aW9uLmlkKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygncHJvamVjdCcsIF9zZWxlY3RlZCk7XG5cdFx0XHRcdFx0dGhpcy5lbWl0Q2hhbmdlKCk7XG5cbiAgICBcdFx0XHRUcmFja2VyQWN0aW9ucy5nZXRQcm9qZWN0RGV0YWlscyhfc2VsZWN0ZWQpO1xuXHRcdFx0XHRcdFRyYWNrZXJBY3Rpb25zLmdldE1pbGVzdG9uZXMoX3NlbGVjdGVkKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdC8vbm8gb3Bcblx0XHRcdH1cblxuXHRcdH0pO1xuXHR9XG5cbiAgLy8gRW1pdCBDaGFuZ2UgZXZlbnRcbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICB9XG5cbiAgLy8gQWRkIGNoYW5nZSBsaXN0ZW5lclxuICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMub24oJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSBjaGFuZ2UgbGlzdGVuZXJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH1cblxuXHRnZXREaXNwYXRjaFRva2VuKCkge1xuXHRcdHJldHVybiBfZGlzcGF0Y2hUb2tlbjtcblx0fVxuXG5cdGdldFByb2plY3RzKCkge1xuXHRcdHJldHVybiBfcHJvamVjdHM7XG5cdH1cblxuXHRnZXRQcm9qZWN0KCkge1xuXHRcdHJldHVybiBfc2VsZWN0ZWQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUHJvamVjdFN0b3JlKCk7XG4iLCJcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIFNldHRpbmdzQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1NldHRpbmdzQ29uc3RhbnRzJyk7XG5cbnZhciBfZGlzcGF0Y2hUb2tlbjtcblxuY2xhc3MgU2V0dGluZ3NTdG9yZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHRfZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoKGFjdGlvbikgPT4ge1xuXG5cdFx0XHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRcdFx0Y2FzZSBTZXR0aW5nc0NvbnN0YW50cy5TQVZFX1NFVFRJTkdTOlxuXHRcdFx0XHRcdHRoaXMuc2V0U2V0dGluZ3MoYWN0aW9uLmRhdGEpO1xuXHRcdFx0XHRcdHRoaXMuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Ly9ubyBvcFxuXHRcdFx0fVxuXG5cdFx0fSk7XG5cdH1cblxuICAvLyBFbWl0IENoYW5nZSBldmVudFxuICBlbWl0Q2hhbmdlKCkge1xuICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gIH1cblxuICAvLyBBZGQgY2hhbmdlIGxpc3RlbmVyXG4gIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgLy8gUmVtb3ZlIGNoYW5nZSBsaXN0ZW5lclxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfVxuXG5cdGdldERpc3BhdGNoVG9rZW4oKSB7XG5cdFx0cmV0dXJuIF9kaXNwYXRjaFRva2VuO1xuXHR9XG5cblx0c2V0U2V0dGluZ3MoZGF0YSkge1xuXHRcdHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCB0aGlzLmdldFNldHRpbmdzKCksIGRhdGEpO1xuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzZXR0aW5ncycsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzKSk7XG5cdH1cblxuXHRnZXRTZXR0aW5ncygpIHtcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZ3MnKSkgfHwge307XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgU2V0dGluZ3NTdG9yZSgpO1xuIiwiXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBTZXR0aW5nc0NvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cycpO1xudmFyIFNldHRpbmdzQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvU2V0dGluZ3NBY3Rpb25zJyk7XG5cbnZhciBTZXR0aW5nc1N0b3JlID0gcmVxdWlyZSgnLi9TZXR0aW5nc1N0b3JlJyk7XG5cbnZhciBfZGlzcGF0Y2hUb2tlbjtcbnZhciBfdXNlcnMgPSBbXTtcblxuY2xhc3MgU2V0dGluZ3NVc2Vyc1N0b3JlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdF9kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcigoYWN0aW9uKSA9PiB7XG5cblx0XHRcdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdFx0XHRjYXNlIFNldHRpbmdzQ29uc3RhbnRzLlNBVkVfU0VUVElOR1M6XG5cdFx0XHRcdFx0QXBwRGlzcGF0Y2hlci53YWl0Rm9yKFtTZXR0aW5nc1N0b3JlLmdldERpc3BhdGNoVG9rZW4oKV0pO1xuXHRcdFx0XHRcdFNldHRpbmdzQWN0aW9ucy5nZXRVc2VycygpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgU2V0dGluZ3NDb25zdGFudHMuUkVDRUlWRV9VU0VSUzpcblx0XHRcdFx0XHRfdXNlcnMgPSBhY3Rpb24uZGF0YTtcblx0XHRcdFx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdC8vbm8gb3Bcblx0XHRcdH1cblxuXHRcdH0pO1xuXHR9XG5cbiAgLy8gRW1pdCBDaGFuZ2UgZXZlbnRcbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICB9XG5cbiAgLy8gQWRkIGNoYW5nZSBsaXN0ZW5lclxuICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMub24oJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSBjaGFuZ2UgbGlzdGVuZXJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH1cblxuXHRnZXREaXNwYXRjaFRva2VuKCkge1xuXHRcdHJldHVybiBfZGlzcGF0Y2hUb2tlbjtcblx0fVxuXG5cdGdldFVzZXJzKCkge1xuXHRcdHJldHVybiBfdXNlcnM7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgU2V0dGluZ3NVc2Vyc1N0b3JlKCk7XG4iLCJcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbnZhciBTZXR0aW5nc1N0b3JlID0gcmVxdWlyZSgnLi9zdG9yZXMvU2V0dGluZ3NTdG9yZScpO1xuXG5jbGFzcyBVdGlsIHtcblx0XG5cdHN0YXRpYyBhcGlSZXF1ZXN0KG9wdGlvbnMpIHtcblxuXHRcdHZhciBkZWZhdWx0cyA9IHtcblx0XHRcdHR5cGU6ICdQT1NUJyxcblx0XHRcdGRhdGFUeXBlOiAndGV4dCcsXG5cdFx0XHRkYXRhOiB7fSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucy51cmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgfVxuXHRcdH07XG5cblx0XHR2YXIgYXBwU2V0dGluZ3MgPSBTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCk7XG5cdFx0aWYgKGFwcFNldHRpbmdzKSB7XG5cdFx0XHRkZWZhdWx0cy5kYXRhID0ge1xuXHRcdFx0XHRhcGlfZ3JvdXA6IGFwcFNldHRpbmdzLmdyb3VwSWQsXG5cdFx0XHRcdGFwaV9zZWNyZXQ6IGFwcFNldHRpbmdzLmdyb3VwU2VjcmV0XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHRydWUsIGRlZmF1bHRzLCBvcHRpb25zKTtcblx0XHRpZiAoc2V0dGluZ3MuZGF0YS5hcGlfZ3JvdXAgJiYgc2V0dGluZ3MuZGF0YS5hcGlfc2VjcmV0KSB7XG5cdFx0XHQkLmFqYXgoJ2h0dHBzOi8vd3d3LnRlYW1sZWFkZXIuYmUvYXBpJyArIG9wdGlvbnMudXJsLCBzZXR0aW5ncyk7XG5cdFx0fVxuXHR9XG5cblx0c3RhdGljIGh0bWxFbnRpdGllcyhzdHJpbmcpIHtcblx0XHRyZXR1cm4gc3RyaW5nXG5cdFx0XHQucmVwbGFjZSgvJmFtcDsvZywgJyYnKVxuXHRcdFx0LnJlcGxhY2UoLyYjMDM5Oy9nLCBcIidcIik7XG5cdH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFV0aWw7IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiXG52YXIgZ3VpID0gbm9kZVJlcXVpcmUoJ253Lmd1aScpO1xudmFyIG1iID0gbmV3IGd1aS5NZW51KHt0eXBlOiAnbWVudWJhcid9KTtcbnRyeSB7XG4gIG1iLmNyZWF0ZU1hY0J1aWx0aW4oJ1RlYW1sZWFkZXIgVGltZScsIHtcbiAgICBoaWRlRWRpdDogZmFsc2UsXG4gIH0pO1xuICBndWkuV2luZG93LmdldCgpLm1lbnUgPSBtYjtcbn0gY2F0Y2goZXgpIHtcbiAgY29uc29sZS5sb2coZXgubWVzc2FnZSk7XG59XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUm91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG52YXIgRGVmYXVsdFJvdXRlID0gUm91dGVyLkRlZmF1bHRSb3V0ZTtcbnZhciBSb3V0ZSA9IFJvdXRlci5Sb3V0ZTtcblxudmFyIFRlYW1sZWFkZXJUaW1lQXBwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1RlYW1sZWFkZXJUaW1lQXBwLnJlYWN0Jyk7XG52YXIgVHJhY2tlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9UcmFja2VyLnJlYWN0Jyk7XG52YXIgU2V0dGluZ3MgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvU2V0dGluZ3MucmVhY3QnKTtcblxudmFyIHJvdXRlcyA9IChcbiAgPFJvdXRlIG5hbWU9XCJhcHBcIiBwYXRoPVwiL1wiIGhhbmRsZXI9e1RlYW1sZWFkZXJUaW1lQXBwfT5cbiAgICA8Um91dGUgbmFtZT1cInNldHRpbmdzXCIgaGFuZGxlcj17U2V0dGluZ3N9Lz5cbiAgICA8RGVmYXVsdFJvdXRlIG5hbWU9XCJ0cmFja2VyXCIgaGFuZGxlcj17VHJhY2tlcn0vPlxuICA8L1JvdXRlPlxuKTtcblxuUm91dGVyLnJ1bihyb3V0ZXMsIGZ1bmN0aW9uIChIYW5kbGVyKSB7XG4gIFJlYWN0LnJlbmRlcig8SGFuZGxlci8+LCBkb2N1bWVudC5ib2R5KTtcbn0pOyJdfQ==
