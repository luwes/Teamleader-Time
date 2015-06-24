(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.saveSettings = saveSettings;
exports.getUsers = getUsers;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _util = require('../util');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsSettingsConstants = require('../constants/SettingsConstants');

var _constantsSettingsConstants2 = _interopRequireDefault(_constantsSettingsConstants);

function saveSettings(data) {
	_dispatcherAppDispatcher2['default'].dispatch({
		type: _constantsSettingsConstants2['default'].SAVE_SETTINGS,
		data: data
	});
}

function getUsers(data) {
	(0, _util.apiRequest)({
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
			_dispatcherAppDispatcher2['default'].dispatch({
				type: _constantsSettingsConstants2['default'].RECEIVE_USERS,
				data: data
			});
		}
	});
}

},{"../constants/SettingsConstants":13,"../dispatcher/AppDispatcher":15,"../util":22}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.getProjects = getProjects;
exports.setProject = setProject;
exports.getProjectDetails = getProjectDetails;
exports.getMilestones = getMilestones;
exports.setMilestone = setMilestone;
exports.getMilestoneTasks = getMilestoneTasks;
exports.setMilestoneTask = setMilestoneTask;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _util = require('../util');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsTrackerConstants = require('../constants/TrackerConstants');

var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

function getProjects() {
	(0, _util.apiRequest)({
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

			_dispatcherAppDispatcher2['default'].dispatch({
				type: _constantsTrackerConstants2['default'].RECEIVE_PROJECTS,
				data: data
			});
		}
	});
}

function setProject(id) {
	_dispatcherAppDispatcher2['default'].dispatch({
		type: _constantsTrackerConstants2['default'].SET_PROJECT,
		id: id
	});
}

function getProjectDetails(project) {
	if (project > 0) {
		(0, _util.apiRequest)({
			url: '/getProject.php',
			data: {
				project_id: project
			},
			success: function success(string) {
				var data = JSON.parse(string);
				_dispatcherAppDispatcher2['default'].dispatch({
					type: _constantsTrackerConstants2['default'].SET_CONTACT_OR_COMPANY,
					option: data.contact_or_company,
					id: data.contact_or_company_id
				});
			}
		});
	}
}

function getMilestones(project) {
	if (project > 0) {
		(0, _util.apiRequest)({
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

				_dispatcherAppDispatcher2['default'].dispatch({
					type: _constantsTrackerConstants2['default'].RECEIVE_MILESTONES,
					data: data
				});
			}
		});
	}
}

function setMilestone(id) {
	_dispatcherAppDispatcher2['default'].dispatch({
		type: _constantsTrackerConstants2['default'].SET_MILESTONE,
		id: id
	});
}

function getMilestoneTasks(milestone) {

	if (milestone > 0) {

		(0, _util.apiRequest)({
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

				_dispatcherAppDispatcher2['default'].dispatch({
					type: _constantsTrackerConstants2['default'].RECEIVE_MILESTONE_TASKS,
					data: data
				});
			}
		});
	}
}

function setMilestoneTask(id) {
	_dispatcherAppDispatcher2['default'].dispatch({
		type: _constantsTrackerConstants2['default'].SET_MILESTONE_TASK,
		id: id
	});
}

},{"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"../util":22}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actionsTrackerActions = require('../actions/TrackerActions');

var _storesProjectStore = require('../stores/ProjectStore');

var _storesProjectStore2 = _interopRequireDefault(_storesProjectStore);

var _storesMilestoneStore = require('../stores/MilestoneStore');

var _storesMilestoneStore2 = _interopRequireDefault(_storesMilestoneStore);

var _SelectInputReact = require('./SelectInput.react');

var _SelectInputReact2 = _interopRequireDefault(_SelectInputReact);

var MilestoneSelectContainer = _react2['default'].createClass({
	displayName: 'MilestoneSelectContainer',

	getMilestonesState: function getMilestonesState() {
		return {
			milestones: _storesMilestoneStore2['default'].getMilestones(),
			milestone: _storesMilestoneStore2['default'].getMilestone()
		};
	},

	getInitialState: function getInitialState() {
		return this.getMilestonesState();
	},

	_onChange: function _onChange() {
		this.setState(this.getMilestonesState());
	},

	componentDidMount: function componentDidMount() {
		(0, _actionsTrackerActions.getMilestones)(_storesProjectStore2['default'].getProject());
		_storesMilestoneStore2['default'].addChangeListener(this._onChange);
	},

	componentWillUnmount: function componentWillUnmount() {
		_storesMilestoneStore2['default'].removeChangeListener(this._onChange);
	},

	handleChange: function handleChange(event) {
		var target = event.currentTarget;
		(0, _actionsTrackerActions.setMilestone)(target.value);
	},

	render: function render() {
		if (this.state.milestones.length === 0) return null;
		return _react2['default'].createElement(
			'div',
			{ className: 'form-group' },
			_react2['default'].createElement(
				'label',
				{ className: 'col-xs-3 control-label', htmlFor: 'milestone' },
				'Milestone'
			),
			_react2['default'].createElement(
				'div',
				{ className: 'col-xs-6' },
				_react2['default'].createElement(_SelectInputReact2['default'], {
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

exports['default'] = MilestoneSelectContainer;
module.exports = exports['default'];

},{"../actions/TrackerActions":2,"../stores/MilestoneStore":17,"../stores/ProjectStore":19,"./SelectInput.react":5,"react":"react"}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actionsTrackerActions = require('../actions/TrackerActions');

var _storesProjectStore = require('../stores/ProjectStore');

var _storesProjectStore2 = _interopRequireDefault(_storesProjectStore);

var _SelectInputReact = require('./SelectInput.react');

var _SelectInputReact2 = _interopRequireDefault(_SelectInputReact);

var ProjectSelectContainer = _react2['default'].createClass({
	displayName: 'ProjectSelectContainer',

	getProjectsState: function getProjectsState() {
		return {
			projects: _storesProjectStore2['default'].getProjects(),
			project: _storesProjectStore2['default'].getProject()
		};
	},

	getInitialState: function getInitialState() {
		return this.getProjectsState();
	},

	_onChange: function _onChange() {
		this.setState(this.getProjectsState());
	},

	componentDidMount: function componentDidMount() {
		(0, _actionsTrackerActions.getProjects)();
		_storesProjectStore2['default'].addChangeListener(this._onChange);
	},

	componentWillUnmount: function componentWillUnmount() {
		_storesProjectStore2['default'].removeChangeListener(this._onChange);
	},

	handleChange: function handleChange(event) {
		var target = event.currentTarget;
		(0, _actionsTrackerActions.setProject)(target.value);
	},

	render: function render() {
		return _react2['default'].createElement(
			'div',
			{ className: 'form-group' },
			_react2['default'].createElement(
				'label',
				{ className: 'col-xs-3 control-label', htmlFor: 'project' },
				'Project'
			),
			_react2['default'].createElement(
				'div',
				{ className: 'col-xs-6' },
				_react2['default'].createElement(_SelectInputReact2['default'], {
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

exports['default'] = ProjectSelectContainer;
module.exports = exports['default'];

},{"../actions/TrackerActions":2,"../stores/ProjectStore":19,"./SelectInput.react":5,"react":"react"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _util = require('../util');

var SelectInput = _react2['default'].createClass({
	displayName: 'SelectInput',

	render: function render() {

		var optionNodes = this.props.options.map(function (option) {
			return _react2['default'].createElement(
				'option',
				{ key: option.value, value: option.value },
				(0, _util.htmlEntities)(option.label)
			);
		});

		return _react2['default'].createElement(
			'select',
			_extends({}, this.props, {
				className: 'form-control'
			}),
			optionNodes
		);
	}
});

exports['default'] = SelectInput;
module.exports = exports['default'];

},{"../util":22,"react":"react"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reactRouter2 = _interopRequireDefault(_reactRouter);

var _storesSettingsStore = require('../stores/SettingsStore');

var _storesSettingsStore2 = _interopRequireDefault(_storesSettingsStore);

var _storesSettingsUsersStore = require('../stores/SettingsUsersStore');

var _storesSettingsUsersStore2 = _interopRequireDefault(_storesSettingsUsersStore);

var _actionsSettingsActions = require('../actions/SettingsActions');

var _actionsSettingsActions2 = _interopRequireDefault(_actionsSettingsActions);

var _TextInputReact = require('./TextInput.react');

var _TextInputReact2 = _interopRequireDefault(_TextInputReact);

var _SelectInputReact = require('./SelectInput.react');

var _SelectInputReact2 = _interopRequireDefault(_SelectInputReact);

var _UserSelectContainerReact = require('./UserSelectContainer.react');

var _UserSelectContainerReact2 = _interopRequireDefault(_UserSelectContainerReact);

var Settings = _react2['default'].createClass({
	displayName: 'Settings',

	getInitialState: function getInitialState() {
		return _storesSettingsStore2['default'].getSettings();
	},

	_onChange: function _onChange() {
		this.setState(_storesSettingsStore2['default'].getSettings());
	},

	componentDidMount: function componentDidMount() {
		_storesSettingsStore2['default'].addChangeListener(this._onChange);
	},

	componentWillUnmount: function componentWillUnmount() {
		_storesSettingsStore2['default'].removeChangeListener(this._onChange);
	},

	handleSubmit: function handleSubmit(e) {
		e.preventDefault();

		var groupId = _react2['default'].findDOMNode(this.refs.groupId).value.trim();
		var groupSecret = _react2['default'].findDOMNode(this.refs.groupSecret).value.trim();
		if (!groupSecret || !groupId) {
			return;
		}

		var container = this.refs.userSelectContainer;
		var select = container.refs.userSelect;
		var selectNode = _react2['default'].findDOMNode(select);

		_actionsSettingsActions2['default'].saveSettings({
			groupId: groupId,
			groupSecret: groupSecret,
			userId: select ? selectNode.value : 0,
			userName: select ? (0, _jquery2['default'])(selectNode).find('option:selected').text() : ''
		});

		return;
	},

	render: function render() {
		return _react2['default'].createElement(
			'div',
			{ className: 'settings' },
			_react2['default'].createElement(
				'form',
				{ className: 'form-horizontal', onSubmit: this.handleSubmit },
				_react2['default'].createElement(
					'div',
					{ className: 'form-group' },
					_react2['default'].createElement(
						'label',
						{ className: 'col-xs-3 control-label', htmlFor: 'group-id' },
						'Group ID'
					),
					_react2['default'].createElement(
						'div',
						{ className: 'col-xs-6' },
						_react2['default'].createElement(_TextInputReact2['default'], { id: 'group-id', ref: 'groupId', defaultValue: this.state.groupId })
					)
				),
				_react2['default'].createElement(
					'div',
					{ className: 'form-group' },
					_react2['default'].createElement(
						'label',
						{ className: 'col-xs-3 control-label', htmlFor: 'group-secret' },
						'Group Secret'
					),
					_react2['default'].createElement(
						'div',
						{ className: 'col-xs-6' },
						_react2['default'].createElement(_TextInputReact2['default'], { id: 'group-secret', ref: 'groupSecret', defaultValue: this.state.groupSecret })
					)
				),
				_react2['default'].createElement(_UserSelectContainerReact2['default'], {
					ref: 'userSelectContainer',
					userId: this.state.userId
				}),
				_react2['default'].createElement(
					'div',
					{ className: 'btn-toolbar' },
					_react2['default'].createElement(
						'button',
						{ type: 'submit', className: 'btn btn-primary btn-sm save-settings-btn' },
						'Save'
					),
					_react2['default'].createElement(
						_reactRouter.Link,
						{ to: 'tracker', className: 'btn btn-default btn-sm back-settings-btn' },
						'Back'
					)
				)
			)
		);
	}
});

exports['default'] = Settings;
module.exports = exports['default'];

},{"../actions/SettingsActions":1,"../stores/SettingsStore":20,"../stores/SettingsUsersStore":21,"./SelectInput.react":5,"./TextInput.react":10,"./UserSelectContainer.react":12,"jquery":"jquery","react":"react","react-router":"react-router"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actionsTrackerActions = require('../actions/TrackerActions');

var _storesMilestoneStore = require('../stores/MilestoneStore');

var _storesMilestoneStore2 = _interopRequireDefault(_storesMilestoneStore);

var _storesMilestoneTaskStore = require('../stores/MilestoneTaskStore');

var _storesMilestoneTaskStore2 = _interopRequireDefault(_storesMilestoneTaskStore);

var _SelectInputReact = require('./SelectInput.react');

var _SelectInputReact2 = _interopRequireDefault(_SelectInputReact);

var _TaskTypeSelectContainerReact = require('./TaskTypeSelectContainer.react');

var _TaskTypeSelectContainerReact2 = _interopRequireDefault(_TaskTypeSelectContainerReact);

var TaskSelectContainer = _react2['default'].createClass({
	displayName: 'TaskSelectContainer',

	getTasksState: function getTasksState() {
		return {
			tasks: _storesMilestoneTaskStore2['default'].getMilestoneTasks(),
			task: _storesMilestoneTaskStore2['default'].getMilestoneTask()
		};
	},

	getInitialState: function getInitialState() {
		return this.getTasksState();
	},

	_onChange: function _onChange() {
		this.setState(this.getTasksState());
	},

	componentDidMount: function componentDidMount() {
		(0, _actionsTrackerActions.getMilestoneTasks)(_storesMilestoneStore2['default'].getMilestone());
		_storesMilestoneTaskStore2['default'].addChangeListener(this._onChange);
	},

	componentWillUnmount: function componentWillUnmount() {
		_storesMilestoneTaskStore2['default'].removeChangeListener(this._onChange);
	},

	handleChange: function handleChange(event) {
		var target = event.currentTarget;
		(0, _actionsTrackerActions.setMilestoneTask)(target.value);
	},

	render: function render() {
		if (this.state.tasks.length > 1) {
			return _react2['default'].createElement(
				'div',
				{ className: 'form-group' },
				_react2['default'].createElement(
					'label',
					{ className: 'col-xs-3 control-label', htmlFor: 'milestone-task' },
					'Todo'
				),
				_react2['default'].createElement(
					'div',
					{ className: 'col-xs-6' },
					_react2['default'].createElement(_SelectInputReact2['default'], {
						id: 'milestone-task',
						ref: 'milestoneTask',
						value: this.state.task,
						options: this.state.tasks,
						onChange: this.handleChange
					})
				)
			);
		} else {
			return _react2['default'].createElement(
				'div',
				{ className: 'custom-task' },
				_react2['default'].createElement(
					'div',
					{ className: 'form-group' },
					_react2['default'].createElement(
						'label',
						{ className: 'col-xs-3 control-label', htmlFor: 'task-type' },
						'Type'
					),
					_react2['default'].createElement(
						'div',
						{ className: 'col-xs-6' },
						_react2['default'].createElement(_TaskTypeSelectContainerReact2['default'], null)
					)
				),
				_react2['default'].createElement(
					'div',
					{ className: 'form-group' },
					_react2['default'].createElement(
						'div',
						{ className: 'col-xs-12' },
						_react2['default'].createElement('textarea', { id: 'task-description', ref: 'taskDescription', placeholder: 'Task description...', className: 'form-control', rows: '3' })
					)
				)
			);
		}
	}
});

exports['default'] = TaskSelectContainer;
module.exports = exports['default'];

},{"../actions/TrackerActions":2,"../stores/MilestoneStore":17,"../stores/MilestoneTaskStore":18,"./SelectInput.react":5,"./TaskTypeSelectContainer.react":8,"react":"react"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _util = require('../util');

var _SelectInputReact = require('./SelectInput.react');

var _SelectInputReact2 = _interopRequireDefault(_SelectInputReact);

var TaskTypeSelectContainer = _react2['default'].createClass({
	displayName: 'TaskTypeSelectContainer',

	getInitialState: function getInitialState() {
		return {
			taskTypes: []
		};
	},
	componentDidMount: function componentDidMount() {
		var _this = this;

		(0, _util.apiRequest)({
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
		return _react2['default'].createElement(_SelectInputReact2['default'], { id: 'task-type', ref: 'taskType', options: this.state.taskTypes });
	}
});

exports['default'] = TaskTypeSelectContainer;
module.exports = exports['default'];

},{"../util":22,"./SelectInput.react":5,"react":"react"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reactRouter2 = _interopRequireDefault(_reactRouter);

var _events = require('events');

var _flux = require('flux');

var TeamleaderTimeApp = _react2['default'].createClass({
  displayName: 'TeamleaderTimeApp',

  render: function render() {
    return _react2['default'].createElement(
      'div',
      { className: 'app' },
      _react2['default'].createElement(
        'header',
        null,
        _react2['default'].createElement('div', { className: 'headerext' }),
        _react2['default'].createElement(
          _reactRouter.Link,
          { to: 'settings', className: 'settings-link', activeClassName: 'active' },
          _react2['default'].createElement('i', { className: 'fa fa-cog' })
        )
      ),
      _react2['default'].createElement(
        'div',
        { className: 'container' },
        _react2['default'].createElement(_reactRouter.RouteHandler, null)
      )
    );
  }
});

exports['default'] = TeamleaderTimeApp;
module.exports = exports['default'];
/* this is the important part */

},{"events":23,"flux":"flux","react":"react","react-router":"react-router"}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var TextInput = _react2["default"].createClass({
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
		return _react2["default"].createElement("input", _extends({}, this.props, {
			type: "text",
			className: "form-control"
			//value={value}
			//onChange={this.handleChange}
		}));
	}
});

exports["default"] = TextInput;
module.exports = exports["default"];

},{"react":"react"}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storesCustomerStore = require('../stores/CustomerStore');

var _storesCustomerStore2 = _interopRequireDefault(_storesCustomerStore);

var _storesProjectStore = require('../stores/ProjectStore');

var _storesProjectStore2 = _interopRequireDefault(_storesProjectStore);

var _storesMilestoneStore = require('../stores/MilestoneStore');

var _storesMilestoneStore2 = _interopRequireDefault(_storesMilestoneStore);

var _storesMilestoneTaskStore = require('../stores/MilestoneTaskStore');

var _storesMilestoneTaskStore2 = _interopRequireDefault(_storesMilestoneTaskStore);

var _ProjectSelectContainerReact = require('./ProjectSelectContainer.react');

var _ProjectSelectContainerReact2 = _interopRequireDefault(_ProjectSelectContainerReact);

var _MilestoneSelectContainerReact = require('./MilestoneSelectContainer.react');

var _MilestoneSelectContainerReact2 = _interopRequireDefault(_MilestoneSelectContainerReact);

var _TaskSelectContainerReact = require('./TaskSelectContainer.react');

var _TaskSelectContainerReact2 = _interopRequireDefault(_TaskSelectContainerReact);

var Tracker = _react2['default'].createClass({
	displayName: 'Tracker',

	getTrackerState: function getTrackerState() {
		return {
			project: _storesProjectStore2['default'].getProject(),
			milestone: _storesMilestoneStore2['default'].getMilestone(),
			milestoneTask: _storesMilestoneTaskStore2['default'].getMilestoneTask(),
			contactOrCompany: _storesCustomerStore2['default'].getContactOrCompany(),
			contactOrCompanyId: _storesCustomerStore2['default'].getContactOrCompanyId()
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
		return _react2['default'].createElement(
			'div',
			{ className: 'tracker' },
			_react2['default'].createElement(
				'form',
				{ className: 'form-horizontal', onSubmit: this.handleSubmit },
				_react2['default'].createElement(_ProjectSelectContainerReact2['default'], null),
				_react2['default'].createElement(_MilestoneSelectContainerReact2['default'], null),
				_react2['default'].createElement(_TaskSelectContainerReact2['default'], null),
				_react2['default'].createElement(
					'div',
					{ className: 'btn-toolbar' },
					_react2['default'].createElement(
						'button',
						{ type: 'submit', className: 'btn btn-primary btn-sm start-timer-btn' },
						'Start timer'
					)
				)
			)
		);
	}
});

exports['default'] = Tracker;
module.exports = exports['default'];

},{"../stores/CustomerStore":16,"../stores/MilestoneStore":17,"../stores/MilestoneTaskStore":18,"../stores/ProjectStore":19,"./MilestoneSelectContainer.react":3,"./ProjectSelectContainer.react":4,"./TaskSelectContainer.react":7,"react":"react"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reactRouter2 = _interopRequireDefault(_reactRouter);

var _storesSettingsStore = require('../stores/SettingsStore');

var _storesSettingsStore2 = _interopRequireDefault(_storesSettingsStore);

var _storesSettingsUsersStore = require('../stores/SettingsUsersStore');

var _storesSettingsUsersStore2 = _interopRequireDefault(_storesSettingsUsersStore);

var _actionsSettingsActions = require('../actions/SettingsActions');

var _SelectInputReact = require('./SelectInput.react');

var _SelectInputReact2 = _interopRequireDefault(_SelectInputReact);

var UserSelectContainer = _react2['default'].createClass({
	displayName: 'UserSelectContainer',

	getUsersState: function getUsersState() {
		return {
			'users': _storesSettingsUsersStore2['default'].getUsers()
		};
	},

	getInitialState: function getInitialState() {
		return this.getUsersState();
	},

	_onChange: function _onChange() {
		this.setState(this.getUsersState());
	},

	componentDidMount: function componentDidMount() {
		(0, _actionsSettingsActions.getUsers)();
		_storesSettingsUsersStore2['default'].addChangeListener(this._onChange);
	},

	componentWillUnmount: function componentWillUnmount() {
		_storesSettingsUsersStore2['default'].removeChangeListener(this._onChange);
	},

	render: function render() {
		if (this.state.users.length === 0) return null;
		return _react2['default'].createElement(
			'div',
			{ className: 'form-group' },
			_react2['default'].createElement(
				'label',
				{ className: 'col-xs-3 control-label', htmlFor: 'user-select' },
				'Select user'
			),
			_react2['default'].createElement(
				'div',
				{ className: 'col-xs-6' },
				_react2['default'].createElement(_SelectInputReact2['default'], {
					id: 'user-select',
					ref: 'userSelect',
					options: this.state.users,
					defaultValue: this.props.userId
				})
			)
		);
	}
});

exports['default'] = UserSelectContainer;
module.exports = exports['default'];

},{"../actions/SettingsActions":1,"../stores/SettingsStore":20,"../stores/SettingsUsersStore":21,"./SelectInput.react":5,"react":"react","react-router":"react-router"}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

exports['default'] = (0, _keymirror2['default'])({
	SAVE_SETTINGS: null,
	RECEIVE_USERS: null
});
module.exports = exports['default'];

},{"keymirror":"keymirror"}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

exports['default'] = (0, _keymirror2['default'])({
	RECEIVE_PROJECTS: null,
	RECEIVE_MILESTONES: null,
	RECEIVE_MILESTONE_TASKS: null,
	SET_PROJECT: null,
	SET_MILESTONE: null,
	SET_MILESTONE_TASK: null,
	SET_CONTACT_OR_COMPANY: null
});
module.exports = exports['default'];

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

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _flux = require('flux');

exports['default'] = new _flux.Dispatcher();
module.exports = exports['default'];

},{"flux":"flux"}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _events = require('events');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsTrackerConstants = require('../constants/TrackerConstants');

var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

var _contactOrCompany;
var _contactOrCompanyId;

var CustomerStore = (0, _objectAssign2['default'])({}, _events.EventEmitter.prototype, {

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

CustomerStore.dispatchToken = _dispatcherAppDispatcher2['default'].register(function (action) {

	switch (action.type) {

		case _constantsTrackerConstants2['default'].SET_CONTACT_OR_COMPANY:
			_contactOrCompany = action.option;
			_contactOrCompanyId = action.id;
			CustomerStore.emitChange();
			break;

		default:
		//no op
	}
});

exports['default'] = CustomerStore;
module.exports = exports['default'];

},{"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"events":23,"object-assign":"object-assign"}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _events = require('events');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsTrackerConstants = require('../constants/TrackerConstants');

var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

var _actionsTrackerActions = require('../actions/TrackerActions');

var _storesProjectStore = require('../stores/ProjectStore');

var _storesProjectStore2 = _interopRequireDefault(_storesProjectStore);

var _milestones = [];
var _selected;

var MilestoneStore = (0, _objectAssign2['default'])({}, _events.EventEmitter.prototype, {

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

MilestoneStore.dispatchToken = _dispatcherAppDispatcher2['default'].register(function (action) {

	switch (action.type) {

		case _constantsTrackerConstants2['default'].SET_PROJECT:
			_dispatcherAppDispatcher2['default'].waitFor([_storesProjectStore2['default'].dispatchToken]);
			_milestones = [];
			_selected = 0;
			MilestoneStore.emitChange();
			break;

		case _constantsTrackerConstants2['default'].RECEIVE_MILESTONES:
			_milestones = action.data;
			if (_milestones.length > 0) {
				_selected = parseInt(_milestones[0].value);
				console.log('milestone', _selected);
			}
			MilestoneStore.emitChange();

			(0, _actionsTrackerActions.getMilestoneTasks)(_selected);
			break;

		case _constantsTrackerConstants2['default'].SET_MILESTONE:
			_selected = parseInt(action.id);
			console.log('milestone', _selected);
			MilestoneStore.emitChange();

			(0, _actionsTrackerActions.getMilestoneTasks)(_selected);
			break;

		default:
		//no op
	}
});

exports['default'] = MilestoneStore;
module.exports = exports['default'];

},{"../actions/TrackerActions":2,"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"../stores/ProjectStore":19,"events":23,"object-assign":"object-assign"}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _events = require('events');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsTrackerConstants = require('../constants/TrackerConstants');

var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

var _storesMilestoneStore = require('../stores/MilestoneStore');

var _storesMilestoneStore2 = _interopRequireDefault(_storesMilestoneStore);

var _tasks = [];
var _selected;

var MilestoneTaskStore = (0, _objectAssign2['default'])({}, _events.EventEmitter.prototype, {

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

MilestoneTaskStore.dispatchToken = _dispatcherAppDispatcher2['default'].register(function (action) {

	switch (action.type) {

		case _constantsTrackerConstants2['default'].SET_PROJECT:
		case _constantsTrackerConstants2['default'].SET_MILESTONE:
			_dispatcherAppDispatcher2['default'].waitFor([_storesMilestoneStore2['default'].dispatchToken]);
			_tasks = [];
			_selected = 0;
			MilestoneTaskStore.emitChange();
			break;

		case _constantsTrackerConstants2['default'].RECEIVE_MILESTONE_TASKS:
			_tasks = action.data;
			if (_tasks.length > 0) {
				_selected = parseInt(_tasks[0].value);
				console.log('task', _selected);
			}
			MilestoneTaskStore.emitChange();
			break;

		case _constantsTrackerConstants2['default'].SET_MILESTONE_TASK:
			_selected = parseInt(action.id);
			console.log('task', _selected);
			MilestoneTaskStore.emitChange();
			break;

		default:
		//no op
	}
});

exports['default'] = MilestoneTaskStore;
module.exports = exports['default'];

},{"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"../stores/MilestoneStore":17,"events":23,"object-assign":"object-assign"}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _events = require('events');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsTrackerConstants = require('../constants/TrackerConstants');

var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

var _actionsTrackerActions = require('../actions/TrackerActions');

var _projects = [];
var _selected;

var ProjectStore = (0, _objectAssign2['default'])({}, _events.EventEmitter.prototype, {

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

ProjectStore.dispatchToken = _dispatcherAppDispatcher2['default'].register(function (action) {

	switch (action.type) {

		case _constantsTrackerConstants2['default'].RECEIVE_PROJECTS:
			_projects = action.data;
			ProjectStore.emitChange();
			break;

		case _constantsTrackerConstants2['default'].SET_PROJECT:
			_selected = parseInt(action.id);
			console.log('project', _selected);
			ProjectStore.emitChange();

			(0, _actionsTrackerActions.getProjectDetails)(_selected);
			(0, _actionsTrackerActions.getMilestones)(_selected);
			break;

		default:
		//no op
	}
});

exports['default'] = ProjectStore;
module.exports = exports['default'];

},{"../actions/TrackerActions":2,"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"events":23,"object-assign":"object-assign"}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _events = require('events');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsSettingsConstants = require('../constants/SettingsConstants');

var _constantsSettingsConstants2 = _interopRequireDefault(_constantsSettingsConstants);

function _setSettings(data) {
	var settings = _jquery2['default'].extend({}, SettingsStore.getSettings(), data);
	localStorage.setItem('settings', JSON.stringify(settings));
}

var SettingsStore = (0, _objectAssign2['default'])({}, _events.EventEmitter.prototype, {

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

SettingsStore.dispatchToken = _dispatcherAppDispatcher2['default'].register(function (action) {

	switch (action.type) {

		case _constantsSettingsConstants2['default'].SAVE_SETTINGS:
			_setSettings(action.data);
			SettingsStore.emitChange();
			break;

		default:
		//no op
	}
});

exports['default'] = SettingsStore;
module.exports = exports['default'];

},{"../constants/SettingsConstants":13,"../dispatcher/AppDispatcher":15,"events":23,"jquery":"jquery","object-assign":"object-assign"}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _events = require('events');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsSettingsConstants = require('../constants/SettingsConstants');

var _constantsSettingsConstants2 = _interopRequireDefault(_constantsSettingsConstants);

var _actionsSettingsActions = require('../actions/SettingsActions');

var _SettingsStore = require('./SettingsStore');

var _SettingsStore2 = _interopRequireDefault(_SettingsStore);

var _users = [];

var SettingsUsersStore = (0, _objectAssign2['default'])({}, _events.EventEmitter.prototype, {

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

SettingsUsersStore.dispatchToken = _dispatcherAppDispatcher2['default'].register(function (action) {

	switch (action.type) {

		case _constantsSettingsConstants2['default'].SAVE_SETTINGS:
			_dispatcherAppDispatcher2['default'].waitFor([_SettingsStore2['default'].dispatchToken]);
			(0, _actionsSettingsActions.getUsers)();
			break;

		case _constantsSettingsConstants2['default'].RECEIVE_USERS:
			_users = action.data;
			SettingsUsersStore.emitChange();
			break;

		default:
		//no op
	}
});

exports['default'] = SettingsUsersStore;
module.exports = exports['default'];

},{"../actions/SettingsActions":1,"../constants/SettingsConstants":13,"../dispatcher/AppDispatcher":15,"./SettingsStore":20,"events":23,"object-assign":"object-assign"}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.apiRequest = apiRequest;
exports.htmlEntities = htmlEntities;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _storesSettingsStore = require('./stores/SettingsStore');

var _storesSettingsStore2 = _interopRequireDefault(_storesSettingsStore);

function apiRequest(options) {

	var defaults = {
		type: 'POST',
		dataType: 'text',
		data: {},
		error: function error(xhr, status, err) {
			console.error(options.url, status, err.toString());
		}
	};

	var appSettings = _storesSettingsStore2['default'].getSettings();
	if (appSettings) {
		defaults.data = {
			api_group: appSettings.groupId,
			api_secret: appSettings.groupSecret
		};
	}

	var settings = _jquery2['default'].extend(true, defaults, options);
	if (settings.data.api_group && settings.data.api_secret) {
		_jquery2['default'].ajax('https://www.teamleader.be/api' + options.url, settings);
	}
}

function htmlEntities(string) {
	return string.replace(/&amp;/g, '&').replace(/&#039;/g, '\'');
}

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var gui = nodeRequire('nw.gui');
var mb = new gui.Menu({ type: 'menubar' });
try {
  mb.createMacBuiltin('Teamleader Time', {
    hideEdit: false });
  gui.Window.get().menu = mb;
} catch (ex) {
  console.log(ex.message);
}

var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;

var TeamleaderTimeApp = require('./components/TeamleaderTimeApp.react');
var Tracker = require('./components/Tracker.react');
var Settings = require('./components/Settings.react');

var routes = _react2['default'].createElement(
  Route,
  { name: 'app', path: '/', handler: TeamleaderTimeApp },
  _react2['default'].createElement(Route, { name: 'settings', handler: Settings }),
  _react2['default'].createElement(DefaultRoute, { name: 'tracker', handler: Tracker })
);

Router.run(routes, function (Handler) {
  _react2['default'].render(_react2['default'].createElement(Handler, null), document.body);
});

},{"./components/Settings.react":6,"./components/TeamleaderTimeApp.react":9,"./components/Tracker.react":11,"react":"react","react-router":"react-router"}]},{},[24])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL01pbGVzdG9uZVNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvUHJvamVjdFNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvU2VsZWN0SW5wdXQucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1NldHRpbmdzLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UYXNrU2VsZWN0Q29udGFpbmVyLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UYXNrVHlwZVNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVGVhbWxlYWRlclRpbWVBcHAucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1RleHRJbnB1dC5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVHJhY2tlci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVXNlclNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL0N1c3RvbWVyU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvTWlsZXN0b25lU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvTWlsZXN0b25lVGFza1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1Byb2plY3RTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3N0b3Jlcy9TZXR0aW5nc1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1NldHRpbmdzVXNlcnNTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3V0aWwuanN4Iiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ01nQixZQUFZLEdBQVosWUFBWTtRQU9aLFFBQVEsR0FBUixRQUFROzs7O29CQVpHLFNBQVM7O3VDQUNWLDZCQUE2Qjs7OzswQ0FDekIsZ0NBQWdDOzs7O0FBR3ZELFNBQVMsWUFBWSxDQUFDLElBQUksRUFBRTtBQUNqQyxzQ0FBYyxRQUFRLENBQUM7QUFDckIsTUFBSSxFQUFFLHdDQUFrQixhQUFhO0FBQ3JDLE1BQUksRUFBRSxJQUFJO0VBQ1gsQ0FBQyxDQUFDO0NBQ0o7O0FBRU0sU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFO0FBQzlCLFdBYlEsVUFBVSxFQWFQO0FBQ1YsS0FBRyxFQUFF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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztxQkNqU2tCLE9BQU87Ozs7QUFYekIsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2hDLElBQUksRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0FBQ3pDLElBQUk7QUFDRixJQUFFLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLEVBQUU7QUFDckMsWUFBUSxFQUFFLEtBQUssRUFDaEIsQ0FBQyxDQUFDO0FBQ0gsS0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0NBQzVCLENBQUMsT0FBTSxFQUFFLEVBQUU7QUFDVixTQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUN6Qjs7QUFHRCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDckMsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztBQUN2QyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDOztBQUV6QixJQUFJLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0FBQ3hFLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3BELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDOztBQUV0RCxJQUFJLE1BQU0sR0FDUjtBQUFDLE9BQUs7SUFBQyxJQUFJLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixBQUFDO0VBQ3BELGlDQUFDLEtBQUssSUFBQyxJQUFJLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBRSxRQUFRLEFBQUMsR0FBRTtFQUMzQyxpQ0FBQyxZQUFZLElBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxPQUFPLEVBQUUsT0FBTyxBQUFDLEdBQUU7Q0FDMUMsQUFDVCxDQUFDOztBQUVGLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsT0FBTyxFQUFFO0FBQ3BDLHFCQUFNLE1BQU0sQ0FBQyxpQ0FBQyxPQUFPLE9BQUUsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDekMsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuaW1wb3J0IHsgYXBpUmVxdWVzdCB9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBTZXR0aW5nc0NvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvU2V0dGluZ3NDb25zdGFudHMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlU2V0dGluZ3MoZGF0YSkge1xuICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICB0eXBlOiBTZXR0aW5nc0NvbnN0YW50cy5TQVZFX1NFVFRJTkdTLFxuICAgIGRhdGE6IGRhdGFcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVc2VycyhkYXRhKSB7XG5cdGFwaVJlcXVlc3Qoe1xuXHRcdHVybDogJy9nZXRVc2Vycy5waHAnLFxuXHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZywgZnVuY3Rpb24ocHJvcCwgdmFsKSB7XG5cdFx0XHRcdHN3aXRjaCAocHJvcCkge1xuXHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0Y2FzZSAnbmFtZSc6XG5cdFx0XHRcdFx0XHR0aGlzLmxhYmVsID0gdmFsO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0ICBcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHQgIFx0XHR0eXBlOiBTZXR0aW5nc0NvbnN0YW50cy5SRUNFSVZFX1VTRVJTLFxuXHQgIFx0XHRkYXRhOiBkYXRhXG5cdCAgXHR9KTtcbiAgICB9XG5cdH0pO1xufVxuIiwiXG5pbXBvcnQgeyBhcGlSZXF1ZXN0IH0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFRyYWNrZXJDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9qZWN0cygpIHtcblx0YXBpUmVxdWVzdCh7XG5cdFx0dXJsOiAnL2dldFByb2plY3RzLnBocCcsXG5cdFx0ZGF0YToge1xuXHRcdFx0YW1vdW50OiAxMDAsXG5cdFx0XHRwYWdlbm86IDBcblx0XHR9LFxuXHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdC8vY29uc29sZS5sb2coc3RyaW5nKVxuXHRcdFx0Ly9yZXZpdmVyIGZ1bmN0aW9uIHRvIHJlbmFtZSBrZXlzXG5cdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0c3dpdGNoIChwcm9wKSB7XG5cdFx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRjYXNlICd0aXRsZSc6XG5cdFx0XHRcdFx0XHR0aGlzLmxhYmVsID0gdmFsO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdFxuXHRcdFx0aWYgKGRhdGEubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRkYXRhLnVuc2hpZnQoeyB2YWx1ZTogMCwgbGFiZWw6ICdDaG9vc2UuLi4nIH0pO1xuXHRcdFx0fVxuXG5cdCAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX1BST0pFQ1RTLFxuXHQgICAgICBkYXRhOiBkYXRhXG5cdCAgICB9KTtcbiAgICB9XG5cdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0UHJvamVjdChpZCkge1xuICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlNFVF9QUk9KRUNULFxuICAgIGlkOiBpZFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb2plY3REZXRhaWxzKHByb2plY3QpIHtcblx0aWYgKHByb2plY3QgPiAwKSB7XG5cdFx0YXBpUmVxdWVzdCh7XG5cdFx0XHR1cmw6ICcvZ2V0UHJvamVjdC5waHAnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwcm9qZWN0X2lkOiBwcm9qZWN0XG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nKTtcblx0XHQgICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5TRVRfQ09OVEFDVF9PUl9DT01QQU5ZLFxuXHRcdCAgICAgIG9wdGlvbjogZGF0YS5jb250YWN0X29yX2NvbXBhbnksXG5cdFx0ICAgICAgaWQ6IGRhdGEuY29udGFjdF9vcl9jb21wYW55X2lkXG5cdFx0ICAgIH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNaWxlc3RvbmVzKHByb2plY3QpIHtcblx0aWYgKHByb2plY3QgPiAwKSB7XG5cdFx0YXBpUmVxdWVzdCh7XG5cdFx0XHR1cmw6ICcvZ2V0TWlsZXN0b25lc0J5UHJvamVjdC5waHAnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwcm9qZWN0X2lkOiBwcm9qZWN0XG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHQvL3Jldml2ZXIgZnVuY3Rpb24gdG8gcmVuYW1lIGtleXNcblx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZywgZnVuY3Rpb24ocHJvcCwgdmFsKSB7XG5cdFx0XHRcdFx0c3dpdGNoIChwcm9wKSB7XG5cdFx0XHRcdFx0XHRjYXNlICdpZCc6XG5cdFx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGNhc2UgJ3RpdGxlJzpcblx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGZvciAodmFyIGkgPSBkYXRhLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHRcdGlmIChkYXRhW2ldLmNsb3NlZCA9PSAxKSB7XG5cdFx0XHRcdFx0XHRkYXRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdCAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHQgICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfTUlMRVNUT05FUyxcblx0XHQgICAgICBkYXRhOiBkYXRhXG5cdFx0ICAgIH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldE1pbGVzdG9uZShpZCkge1xuICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlNFVF9NSUxFU1RPTkUsXG4gICAgaWQ6IGlkXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWlsZXN0b25lVGFza3MobWlsZXN0b25lKSB7XG5cblx0aWYgKG1pbGVzdG9uZSA+IDApIHtcblxuXHRcdGFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFRhc2tzQnlNaWxlc3RvbmUucGhwJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWlsZXN0b25lX2lkOiBtaWxlc3RvbmVcblx0XHRcdH0sXG5cdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0Y2FzZSAnZGVzY3JpcHRpb24nOlxuXHRcdFx0XHRcdFx0XHR0aGlzLmxhYmVsID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IGRhdGEubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdFx0aWYgKGRhdGFbaV0uZG9uZSA9PSAxKSB7XG5cdFx0XHRcdFx0XHRkYXRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgYXBwU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXR0aW5ncycpKTtcblx0XHRcdFx0aWYgKGFwcFNldHRpbmdzICYmIGFwcFNldHRpbmdzLnVzZXJOYW1lKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IGRhdGEubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5vd25lcl9uYW1lICE9IGFwcFNldHRpbmdzLnVzZXJOYW1lKSB7XG5cdFx0XHRcdFx0XHRcdGRhdGEuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChkYXRhLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRkYXRhLnB1c2goeyB2YWx1ZTogJ25ldycsIGxhYmVsOiAnTmV3IHRhc2suLi4nIH0pO1xuXHRcdFx0XHR9XG5cblx0XHQgICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX01JTEVTVE9ORV9UQVNLUyxcblx0XHQgICAgICBkYXRhOiBkYXRhXG5cdFx0ICAgIH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldE1pbGVzdG9uZVRhc2soaWQpIHtcbiAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FX1RBU0ssXG4gICAgaWQ6IGlkXG4gIH0pO1xufVxuXG5cbiIsIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgZ2V0TWlsZXN0b25lcywgc2V0TWlsZXN0b25lIH0gZnJvbSAnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucyc7XG5pbXBvcnQgUHJvamVjdFN0b3JlIGZyb20gJy4uL3N0b3Jlcy9Qcm9qZWN0U3RvcmUnO1xuaW1wb3J0IE1pbGVzdG9uZVN0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVTdG9yZSc7XG5pbXBvcnQgU2VsZWN0SW5wdXQgZnJvbSAnLi9TZWxlY3RJbnB1dC5yZWFjdCc7XG5cblxudmFyIE1pbGVzdG9uZVNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRNaWxlc3RvbmVzU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRtaWxlc3RvbmVzOiBNaWxlc3RvbmVTdG9yZS5nZXRNaWxlc3RvbmVzKCksXG5cdFx0XHRtaWxlc3RvbmU6IE1pbGVzdG9uZVN0b3JlLmdldE1pbGVzdG9uZSgpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0TWlsZXN0b25lc1N0YXRlKCk7XG5cdH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0TWlsZXN0b25lc1N0YXRlKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRnZXRNaWxlc3RvbmVzKFByb2plY3RTdG9yZS5nZXRQcm9qZWN0KCkpO1xuICBcdE1pbGVzdG9uZVN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0TWlsZXN0b25lU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblx0XHRzZXRNaWxlc3RvbmUodGFyZ2V0LnZhbHVlKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLm1pbGVzdG9uZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0XHRyZXR1cm4gKFxuXHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cIm1pbGVzdG9uZVwiPk1pbGVzdG9uZTwvbGFiZWw+XG5cdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0XHQ8U2VsZWN0SW5wdXQgXG5cdFx0XHRcdFx0XHRpZD1cIm1pbGVzdG9uZVwiIFxuXHRcdFx0XHRcdFx0cmVmPVwibWlsZXN0b25lXCIgXG5cdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS5taWxlc3RvbmV9XG5cdFx0XHRcdFx0XHRvcHRpb25zPXt0aGlzLnN0YXRlLm1pbGVzdG9uZXN9IFxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSBcblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBNaWxlc3RvbmVTZWxlY3RDb250YWluZXI7IiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBnZXRQcm9qZWN0cywgc2V0UHJvamVjdCB9IGZyb20gJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnO1xuaW1wb3J0IFByb2plY3RTdG9yZSBmcm9tICcuLi9zdG9yZXMvUHJvamVjdFN0b3JlJztcbmltcG9ydCBTZWxlY3RJbnB1dCBmcm9tICcuL1NlbGVjdElucHV0LnJlYWN0JztcblxuXG52YXIgUHJvamVjdFNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRQcm9qZWN0c1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJvamVjdHM6IFByb2plY3RTdG9yZS5nZXRQcm9qZWN0cygpLFxuXHRcdFx0cHJvamVjdDogUHJvamVjdFN0b3JlLmdldFByb2plY3QoKVxuXHRcdH1cblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFByb2plY3RzU3RhdGUoKTtcblx0fSxcblxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRQcm9qZWN0c1N0YXRlKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRnZXRQcm9qZWN0cygpO1xuICBcdFByb2plY3RTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFByb2plY3RTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdHNldFByb2plY3QodGFyZ2V0LnZhbHVlKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwicHJvamVjdFwiPlByb2plY3Q8L2xhYmVsPlxuXHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0PFNlbGVjdElucHV0IFxuXHRcdFx0XHRcdFx0aWQ9XCJwcm9qZWN0XCIgXG5cdFx0XHRcdFx0XHRyZWY9XCJwcm9qZWN0XCIgXG5cdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS5wcm9qZWN0fVxuXHRcdFx0XHRcdFx0b3B0aW9ucz17dGhpcy5zdGF0ZS5wcm9qZWN0c30gXG5cdFx0XHRcdFx0XHRvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IFxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFByb2plY3RTZWxlY3RDb250YWluZXI7XG4iLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBodG1sRW50aXRpZXMgfSBmcm9tICcuLi91dGlsJztcblxuXG52YXIgU2VsZWN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblxuICBcdHZhciBvcHRpb25Ob2RlcyA9IHRoaXMucHJvcHMub3B0aW9ucy5tYXAoZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgXHQ8b3B0aW9uIGtleT17b3B0aW9uLnZhbHVlfSB2YWx1ZT17b3B0aW9uLnZhbHVlfSA+e2h0bWxFbnRpdGllcyhvcHRpb24ubGFiZWwpfTwvb3B0aW9uPlxuICAgICAgKTtcbiAgXHR9KTtcblxuXHRcdHJldHVybiAoXG5cdCAgXHQ8c2VsZWN0IFxuXHQgIFx0XHR7Li4udGhpcy5wcm9wc30gXG5cdCAgXHRcdGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIFxuXHRcdFx0PlxuXHQgIFx0XHR7b3B0aW9uTm9kZXN9XG5cdCAgXHQ8L3NlbGVjdD5cblx0XHQpO1xuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0SW5wdXQ7IiwiXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSb3V0ZXIsIHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcic7XG5cbmltcG9ydCBTZXR0aW5nc1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9TZXR0aW5nc1N0b3JlJztcbmltcG9ydCBTZXR0aW5nc1VzZXJzU3RvcmUgZnJvbSAnLi4vc3RvcmVzL1NldHRpbmdzVXNlcnNTdG9yZSc7XG5pbXBvcnQgU2V0dGluZ3NBY3Rpb25zIGZyb20gJy4uL2FjdGlvbnMvU2V0dGluZ3NBY3Rpb25zJztcbmltcG9ydCBUZXh0SW5wdXQgZnJvbSAnLi9UZXh0SW5wdXQucmVhY3QnO1xuaW1wb3J0IFNlbGVjdElucHV0IGZyb20gJy4vU2VsZWN0SW5wdXQucmVhY3QnO1xuaW1wb3J0IFVzZXJTZWxlY3RDb250YWluZXIgZnJvbSAnLi9Vc2VyU2VsZWN0Q29udGFpbmVyLnJlYWN0JztcblxuXG52YXIgU2V0dGluZ3MgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gU2V0dGluZ3NTdG9yZS5nZXRTZXR0aW5ncygpO1xuICB9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZShTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRTZXR0aW5nc1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0U2V0dGluZ3NTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0aGFuZGxlU3VibWl0OiBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIGdyb3VwSWQgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuZ3JvdXBJZCkudmFsdWUudHJpbSgpO1xuXHRcdHZhciBncm91cFNlY3JldCA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5ncm91cFNlY3JldCkudmFsdWUudHJpbSgpO1xuXHRcdGlmICghZ3JvdXBTZWNyZXQgfHwgIWdyb3VwSWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgY29udGFpbmVyID0gdGhpcy5yZWZzLnVzZXJTZWxlY3RDb250YWluZXI7XG5cdFx0dmFyIHNlbGVjdCA9IGNvbnRhaW5lci5yZWZzLnVzZXJTZWxlY3Q7XG5cdFx0dmFyIHNlbGVjdE5vZGUgPSBSZWFjdC5maW5kRE9NTm9kZShzZWxlY3QpO1xuXG5cdFx0U2V0dGluZ3NBY3Rpb25zLnNhdmVTZXR0aW5ncyh7XG5cdFx0XHRncm91cElkOiBncm91cElkLFxuXHRcdFx0Z3JvdXBTZWNyZXQ6IGdyb3VwU2VjcmV0LFxuXHRcdFx0dXNlcklkOiBzZWxlY3QgPyBzZWxlY3ROb2RlLnZhbHVlIDogMCxcblx0XHRcdHVzZXJOYW1lOiBzZWxlY3QgPyAkKHNlbGVjdE5vZGUpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnRleHQoKSA6ICcnXG5cdFx0fSk7XG5cblx0XHRyZXR1cm47XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJzZXR0aW5nc1wiPlxuXHRcdFx0XHQ8Zm9ybSBjbGFzc05hbWU9XCJmb3JtLWhvcml6b250YWxcIiBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuXHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwiZ3JvdXAtaWRcIj5Hcm91cCBJRDwvbGFiZWw+XG5cdFx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdCAgICBcdDxUZXh0SW5wdXQgaWQ9XCJncm91cC1pZFwiIHJlZj1cImdyb3VwSWRcIiBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUuZ3JvdXBJZH0gLz5cblx0XHRcdFx0ICAgIDwvZGl2PlxuXHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwiZ3JvdXAtc2VjcmV0XCI+R3JvdXAgU2VjcmV0PC9sYWJlbD5cblx0XHRcdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0ICAgIFx0PFRleHRJbnB1dCBpZD1cImdyb3VwLXNlY3JldFwiIHJlZj1cImdyb3VwU2VjcmV0XCIgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLmdyb3VwU2VjcmV0fSAvPlxuXHRcdFx0XHQgICAgPC9kaXY+XG5cdFx0XHRcdCAgPC9kaXY+XG5cdFx0XHRcdCAgPFVzZXJTZWxlY3RDb250YWluZXIgXG5cdFx0XHRcdCAgXHRyZWY9XCJ1c2VyU2VsZWN0Q29udGFpbmVyXCJcblx0XHRcdFx0ICAgIHVzZXJJZD17dGhpcy5zdGF0ZS51c2VySWR9XG5cdFx0XHRcdFx0Lz5cblx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi10b29sYmFyXCI+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIHNhdmUtc2V0dGluZ3MtYnRuXCI+U2F2ZTwvYnV0dG9uPiBcblx0XHRcdFx0XHRcdDxMaW5rIHRvPVwidHJhY2tlclwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4tc20gYmFjay1zZXR0aW5ncy1idG5cIj5CYWNrPC9MaW5rPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU2V0dGluZ3M7XG4iLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IGdldE1pbGVzdG9uZVRhc2tzLCBzZXRNaWxlc3RvbmVUYXNrIH0gZnJvbSAnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucyc7XG5pbXBvcnQgTWlsZXN0b25lU3RvcmUgZnJvbSAnLi4vc3RvcmVzL01pbGVzdG9uZVN0b3JlJztcbmltcG9ydCBNaWxlc3RvbmVUYXNrU3RvcmUgZnJvbSAnLi4vc3RvcmVzL01pbGVzdG9uZVRhc2tTdG9yZSc7XG5pbXBvcnQgU2VsZWN0SW5wdXQgZnJvbSAnLi9TZWxlY3RJbnB1dC5yZWFjdCc7XG5pbXBvcnQgVGFza1R5cGVTZWxlY3RDb250YWluZXIgZnJvbSAnLi9UYXNrVHlwZVNlbGVjdENvbnRhaW5lci5yZWFjdCc7XG5cblxudmFyIFRhc2tTZWxlY3RDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0VGFza3NTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRhc2tzOiBNaWxlc3RvbmVUYXNrU3RvcmUuZ2V0TWlsZXN0b25lVGFza3MoKSxcblx0XHRcdHRhc2s6IE1pbGVzdG9uZVRhc2tTdG9yZS5nZXRNaWxlc3RvbmVUYXNrKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRUYXNrc1N0YXRlKCk7XG5cdH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0VGFza3NTdGF0ZSgpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0Z2V0TWlsZXN0b25lVGFza3MoTWlsZXN0b25lU3RvcmUuZ2V0TWlsZXN0b25lKCkpO1xuICBcdE1pbGVzdG9uZVRhc2tTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdE1pbGVzdG9uZVRhc2tTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdHNldE1pbGVzdG9uZVRhc2sodGFyZ2V0LnZhbHVlKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLnRhc2tzLmxlbmd0aCA+IDEpIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cIm1pbGVzdG9uZS10YXNrXCI+VG9kbzwvbGFiZWw+XG5cdFx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdFx0PFNlbGVjdElucHV0IFxuXHRcdFx0XHRcdFx0XHRpZD1cIm1pbGVzdG9uZS10YXNrXCIgXG5cdFx0XHRcdFx0XHRcdHJlZj1cIm1pbGVzdG9uZVRhc2tcIiBcblx0XHRcdFx0XHRcdFx0dmFsdWU9e3RoaXMuc3RhdGUudGFza30gXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnM9e3RoaXMuc3RhdGUudGFza3N9IFxuXHRcdFx0XHRcdFx0XHRvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IFxuXHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImN1c3RvbS10YXNrXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHRcdFx0ICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJ0YXNrLXR5cGVcIj5UeXBlPC9sYWJlbD5cblx0XHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0XHQgIFx0PFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyIC8+XG5cdFx0XHRcdFx0ICA8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG5cdFx0XHRcdFx0ICBcdDx0ZXh0YXJlYSBpZD1cInRhc2stZGVzY3JpcHRpb25cIiByZWY9XCJ0YXNrRGVzY3JpcHRpb25cIiBwbGFjZWhvbGRlcj1cIlRhc2sgZGVzY3JpcHRpb24uLi5cIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiByb3dzPVwiM1wiPjwvdGV4dGFyZWE+XG5cdFx0XHRcdFx0ICA8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQpO1xuXHRcdH1cblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRhc2tTZWxlY3RDb250YWluZXI7XG4iLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IGFwaVJlcXVlc3QgfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCBTZWxlY3RJbnB1dCBmcm9tICcuL1NlbGVjdElucHV0LnJlYWN0JztcblxuXG52YXIgVGFza1R5cGVTZWxlY3RDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGFza1R5cGVzOiBbXVxuXHRcdH1cblx0fSxcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0YXBpUmVxdWVzdCh7XG5cdFx0XHR1cmw6ICcvZ2V0VGFza1R5cGVzLnBocCcsXG5cdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0Y2FzZSAnbmFtZSc6XG5cdFx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHRhc2tUeXBlczogZGF0YSB9KTtcbiAgICAgIH1cblx0XHR9KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PFNlbGVjdElucHV0IGlkPVwidGFzay10eXBlXCIgcmVmPVwidGFza1R5cGVcIiBvcHRpb25zPXt0aGlzLnN0YXRlLnRhc2tUeXBlc30gLz5cblx0XHQpO1xuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVGFza1R5cGVTZWxlY3RDb250YWluZXI7XG4iLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUm91dGVyLCB7IExpbmssIFJvdXRlSGFuZGxlciB9IGZyb20gJ3JlYWN0LXJvdXRlcic7XG5cbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgeyBEaXNwYXRjaGVyIH0gZnJvbSAnZmx1eCc7XG5cblxudmFyIFRlYW1sZWFkZXJUaW1lQXBwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhcHBcIj5cblx0ICBcdFx0PGhlYWRlcj5cblx0ICBcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImhlYWRlcmV4dFwiPjwvZGl2PlxuXHQgIFx0XHRcdDxMaW5rIHRvPVwic2V0dGluZ3NcIiBjbGFzc05hbWU9XCJzZXR0aW5ncy1saW5rXCIgYWN0aXZlQ2xhc3NOYW1lPVwiYWN0aXZlXCI+XG5cdCAgXHRcdFx0XHQ8aSBjbGFzc05hbWU9XCJmYSBmYS1jb2dcIj48L2k+XG5cdCAgXHRcdFx0PC9MaW5rPlxuXHQgIFx0XHQ8L2hlYWRlcj5cblxuICAgICAgICB7LyogdGhpcyBpcyB0aGUgaW1wb3J0YW50IHBhcnQgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgPFJvdXRlSGFuZGxlci8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRlYW1sZWFkZXJUaW1lQXBwO1xuIiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5cbnZhciBUZXh0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Ly8gZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0Ly8gXHRyZXR1cm4geyB2YWx1ZTogJycgfTtcblx0Ly8gfSxcblxuXHQvLyBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcblx0Ly8gXHR0aGlzLnNldFN0YXRlKHsgdmFsdWU6IG5leHRQcm9wcy5zYXZlZFZhbHVlIH0pO1xuXHQvLyB9LFxuXG5cdC8vIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0Ly8gXHR0aGlzLnNldFN0YXRlKHsgdmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZSB9KTtcbiAvLyAgfSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdC8vdmFyIHZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZTtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGlucHV0IFxuXHRcdFx0XHR7Li4udGhpcy5wcm9wc31cblx0XHRcdFx0dHlwZT1cInRleHRcIiBcblx0XHRcdFx0Y2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgXG5cdFx0XHRcdC8vdmFsdWU9e3ZhbHVlfVxuXHRcdFx0XHQvL29uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHQvPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUZXh0SW5wdXQ7IiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgQ3VzdG9tZXJTdG9yZSBmcm9tICcuLi9zdG9yZXMvQ3VzdG9tZXJTdG9yZSc7XG5pbXBvcnQgUHJvamVjdFN0b3JlIGZyb20gJy4uL3N0b3Jlcy9Qcm9qZWN0U3RvcmUnO1xuaW1wb3J0IE1pbGVzdG9uZVN0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVTdG9yZSc7XG5pbXBvcnQgTWlsZXN0b25lVGFza1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVUYXNrU3RvcmUnO1xuXG5pbXBvcnQgUHJvamVjdFNlbGVjdENvbnRhaW5lciBmcm9tICcuL1Byb2plY3RTZWxlY3RDb250YWluZXIucmVhY3QnO1xuaW1wb3J0IE1pbGVzdG9uZVNlbGVjdENvbnRhaW5lciBmcm9tICcuL01pbGVzdG9uZVNlbGVjdENvbnRhaW5lci5yZWFjdCc7XG5pbXBvcnQgVGFza1NlbGVjdENvbnRhaW5lciBmcm9tICcuL1Rhc2tTZWxlY3RDb250YWluZXIucmVhY3QnO1xuXG5cbnZhciBUcmFja2VyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldFRyYWNrZXJTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHByb2plY3Q6IFByb2plY3RTdG9yZS5nZXRQcm9qZWN0KCksXG5cdFx0XHRtaWxlc3RvbmU6IE1pbGVzdG9uZVN0b3JlLmdldE1pbGVzdG9uZSgpLFxuXHRcdFx0bWlsZXN0b25lVGFzazogTWlsZXN0b25lVGFza1N0b3JlLmdldE1pbGVzdG9uZVRhc2soKSxcblx0XHRcdGNvbnRhY3RPckNvbXBhbnk6IEN1c3RvbWVyU3RvcmUuZ2V0Q29udGFjdE9yQ29tcGFueSgpLFxuXHRcdFx0Y29udGFjdE9yQ29tcGFueUlkOiBDdXN0b21lclN0b3JlLmdldENvbnRhY3RPckNvbXBhbnlJZCgpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VHJhY2tlclN0YXRlKClcblx0fSxcblxuXHRoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zb2xlLmxvZyh0aGlzLmdldFRyYWNrZXJTdGF0ZSgpKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInRyYWNrZXJcIj5cblx0XHRcdFx0PGZvcm0gY2xhc3NOYW1lPVwiZm9ybS1ob3Jpem9udGFsXCIgb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cblxuXHRcdFx0XHRcdDxQcm9qZWN0U2VsZWN0Q29udGFpbmVyIC8+XG5cdFx0XHRcdFx0PE1pbGVzdG9uZVNlbGVjdENvbnRhaW5lciAvPlxuXHRcdFx0XHRcdDxUYXNrU2VsZWN0Q29udGFpbmVyIC8+XG5cblx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi10b29sYmFyXCI+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIHN0YXJ0LXRpbWVyLWJ0blwiPlxuXHRcdFx0XHRcdFx0XHRTdGFydCB0aW1lclxuXHRcdFx0XHRcdFx0PC9idXR0b24+IFxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVHJhY2tlclxuIiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJvdXRlciwgeyBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJztcblxuaW1wb3J0IFNldHRpbmdzU3RvcmUgZnJvbSAnLi4vc3RvcmVzL1NldHRpbmdzU3RvcmUnO1xuaW1wb3J0IFNldHRpbmdzVXNlcnNTdG9yZSBmcm9tICcuLi9zdG9yZXMvU2V0dGluZ3NVc2Vyc1N0b3JlJztcbmltcG9ydCB7IGdldFVzZXJzIH0gZnJvbSAnLi4vYWN0aW9ucy9TZXR0aW5nc0FjdGlvbnMnO1xuXG5pbXBvcnQgU2VsZWN0SW5wdXQgZnJvbSAnLi9TZWxlY3RJbnB1dC5yZWFjdCc7XG5cblxudmFyIFVzZXJTZWxlY3RDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0VXNlcnNTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdCd1c2Vycyc6IFNldHRpbmdzVXNlcnNTdG9yZS5nZXRVc2VycygpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VXNlcnNTdGF0ZSgpO1xuICB9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFVzZXJzU3RhdGUoKSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdGdldFVzZXJzKCk7XG4gIFx0U2V0dGluZ3NVc2Vyc1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0U2V0dGluZ3NVc2Vyc1N0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLnVzZXJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cdFx0cmV0dXJuIChcblx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJ1c2VyLXNlbGVjdFwiPlNlbGVjdCB1c2VyPC9sYWJlbD5cblx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdCAgICBcdDxTZWxlY3RJbnB1dCBcblx0XHQgICAgXHRcdGlkPVwidXNlci1zZWxlY3RcIiBcblx0XHQgICAgXHRcdHJlZj1cInVzZXJTZWxlY3RcIiBcblx0XHQgICAgXHRcdG9wdGlvbnM9e3RoaXMuc3RhdGUudXNlcnN9IFxuXHRcdCAgICBcdFx0ZGVmYXVsdFZhbHVlPXt0aGlzLnByb3BzLnVzZXJJZH1cblx0XHQgICAgXHQvPlxuXHRcdCAgICA8L2Rpdj5cblx0XHQgIDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBVc2VyU2VsZWN0Q29udGFpbmVyO1xuIiwiXG5pbXBvcnQga2V5TWlycm9yIGZyb20gJ2tleW1pcnJvcic7XG5cbmV4cG9ydCBkZWZhdWx0IGtleU1pcnJvcih7XG5cdFNBVkVfU0VUVElOR1M6IG51bGwsXG5cdFJFQ0VJVkVfVVNFUlM6IG51bGxcbn0pO1xuIiwiXG5pbXBvcnQga2V5TWlycm9yIGZyb20gJ2tleW1pcnJvcic7XG5cbmV4cG9ydCBkZWZhdWx0IGtleU1pcnJvcih7XG5cdFJFQ0VJVkVfUFJPSkVDVFM6IG51bGwsXG5cdFJFQ0VJVkVfTUlMRVNUT05FUzogbnVsbCxcblx0UkVDRUlWRV9NSUxFU1RPTkVfVEFTS1M6IG51bGwsXG5cdFNFVF9QUk9KRUNUOiBudWxsLFxuXHRTRVRfTUlMRVNUT05FOiBudWxsLFxuXHRTRVRfTUlMRVNUT05FX1RBU0s6IG51bGwsXG5cdFNFVF9DT05UQUNUX09SX0NPTVBBTlk6IG51bGxcbn0pO1xuIiwiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQXBwRGlzcGF0Y2hlclxuICpcbiAqIEEgc2luZ2xldG9uIHRoYXQgb3BlcmF0ZXMgYXMgdGhlIGNlbnRyYWwgaHViIGZvciBhcHBsaWNhdGlvbiB1cGRhdGVzLlxuICovXG5cbmltcG9ydCB7IERpc3BhdGNoZXIgfSBmcm9tICdmbHV4JztcbmV4cG9ydCBkZWZhdWx0IG5ldyBEaXNwYXRjaGVyKCk7XG4iLCJcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFRyYWNrZXJDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnO1xuXG5cbnZhciBfY29udGFjdE9yQ29tcGFueTtcbnZhciBfY29udGFjdE9yQ29tcGFueUlkO1xuXG52YXIgQ3VzdG9tZXJTdG9yZSA9IGFzc2lnbih7fSwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gIC8vIEVtaXQgQ2hhbmdlIGV2ZW50XG4gIGVtaXRDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gIH0sXG5cbiAgLy8gQWRkIGNoYW5nZSBsaXN0ZW5lclxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLy8gUmVtb3ZlIGNoYW5nZSBsaXN0ZW5lclxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH0sXG5cblx0Z2V0Q29udGFjdE9yQ29tcGFueTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9jb250YWN0T3JDb21wYW55O1xuXHR9LFxuXG5cdGdldENvbnRhY3RPckNvbXBhbnlJZDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9jb250YWN0T3JDb21wYW55SWQ7XG5cdH1cbn0pO1xuXG5DdXN0b21lclN0b3JlLmRpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGFjdGlvbiA9PiB7XG5cblx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9DT05UQUNUX09SX0NPTVBBTlk6XG5cdFx0XHRfY29udGFjdE9yQ29tcGFueSA9IGFjdGlvbi5vcHRpb247XG5cdFx0XHRfY29udGFjdE9yQ29tcGFueUlkID0gYWN0aW9uLmlkO1xuXHRcdFx0Q3VzdG9tZXJTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvL25vIG9wXG5cdH1cblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEN1c3RvbWVyU3RvcmU7XG4iLCJcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFRyYWNrZXJDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnO1xuaW1wb3J0IHsgZ2V0TWlsZXN0b25lVGFza3MgfSBmcm9tICcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJztcbmltcG9ydCBQcm9qZWN0U3RvcmUgZnJvbSAnLi4vc3RvcmVzL1Byb2plY3RTdG9yZSc7XG5cblxudmFyIF9taWxlc3RvbmVzID0gW107XG52YXIgX3NlbGVjdGVkO1xuXG52YXIgTWlsZXN0b25lU3RvcmUgPSBhc3NpZ24oe30sIEV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcblxuICAvLyBFbWl0IENoYW5nZSBldmVudFxuICBlbWl0Q2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICB9LFxuXG4gIC8vIEFkZCBjaGFuZ2UgbGlzdGVuZXJcbiAgYWRkQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9LFxuXG4gIC8vIFJlbW92ZSBjaGFuZ2UgbGlzdGVuZXJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9LFxuXG5cdGdldE1pbGVzdG9uZXM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBfbWlsZXN0b25lcztcblx0fSxcblxuXHRnZXRNaWxlc3RvbmU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBfc2VsZWN0ZWQ7XG5cdH1cbn0pO1xuXG5NaWxlc3RvbmVTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfUFJPSkVDVDpcblx0XHRcdEFwcERpc3BhdGNoZXIud2FpdEZvcihbUHJvamVjdFN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcblx0XHRcdF9taWxlc3RvbmVzID0gW107XG5cdFx0XHRfc2VsZWN0ZWQgPSAwO1xuXHRcdFx0TWlsZXN0b25lU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVTOlxuXHRcdFx0X21pbGVzdG9uZXMgPSBhY3Rpb24uZGF0YTtcblx0XHRcdGlmIChfbWlsZXN0b25lcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KF9taWxlc3RvbmVzWzBdLnZhbHVlKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ21pbGVzdG9uZScsIF9zZWxlY3RlZCk7XG5cdFx0XHR9XG5cdFx0XHRNaWxlc3RvbmVTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cblx0XHRcdGdldE1pbGVzdG9uZVRhc2tzKF9zZWxlY3RlZCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FOlxuXHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoYWN0aW9uLmlkKTtcblx0XHRcdGNvbnNvbGUubG9nKCdtaWxlc3RvbmUnLCBfc2VsZWN0ZWQpO1xuXHRcdFx0TWlsZXN0b25lU3RvcmUuZW1pdENoYW5nZSgpO1xuXG5cdFx0XHRnZXRNaWxlc3RvbmVUYXNrcyhfc2VsZWN0ZWQpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBNaWxlc3RvbmVTdG9yZTtcbiIsIlxuaW1wb3J0IGFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbmltcG9ydCBBcHBEaXNwYXRjaGVyIGZyb20gJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcic7XG5pbXBvcnQgVHJhY2tlckNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvVHJhY2tlckNvbnN0YW50cyc7XG5pbXBvcnQgTWlsZXN0b25lU3RvcmUgZnJvbSAnLi4vc3RvcmVzL01pbGVzdG9uZVN0b3JlJztcblxuXG52YXIgX3Rhc2tzID0gW107XG52YXIgX3NlbGVjdGVkO1xuXG52YXIgTWlsZXN0b25lVGFza1N0b3JlICA9IGFzc2lnbih7fSwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gIC8vIEVtaXQgQ2hhbmdlIGV2ZW50XG4gIGVtaXRDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gIH0sXG5cbiAgLy8gQWRkIGNoYW5nZSBsaXN0ZW5lclxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLy8gUmVtb3ZlIGNoYW5nZSBsaXN0ZW5lclxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH0sXG5cblx0Z2V0TWlsZXN0b25lVGFza3M6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBfdGFza3M7XG5cdH0sXG5cblx0Z2V0TWlsZXN0b25lVGFzazogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9zZWxlY3RlZDtcblx0fVxufSk7XG5cbk1pbGVzdG9uZVRhc2tTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfUFJPSkVDVDpcblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX01JTEVTVE9ORTpcblx0XHRcdEFwcERpc3BhdGNoZXIud2FpdEZvcihbTWlsZXN0b25lU3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuXHRcdFx0X3Rhc2tzID0gW107XG5cdFx0XHRfc2VsZWN0ZWQgPSAwO1xuXHRcdFx0TWlsZXN0b25lVGFza1N0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfTUlMRVNUT05FX1RBU0tTOlxuXHRcdFx0X3Rhc2tzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRpZiAoX3Rhc2tzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoX3Rhc2tzWzBdLnZhbHVlKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ3Rhc2snLCBfc2VsZWN0ZWQpO1xuXHRcdFx0fVxuXHRcdFx0TWlsZXN0b25lVGFza1N0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9NSUxFU1RPTkVfVEFTSzpcblx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KGFjdGlvbi5pZCk7XG5cdFx0XHRjb25zb2xlLmxvZygndGFzaycsIF9zZWxlY3RlZCk7XG5cdFx0XHRNaWxlc3RvbmVUYXNrU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5cbmV4cG9ydCBkZWZhdWx0IE1pbGVzdG9uZVRhc2tTdG9yZTtcbiIsIlxuaW1wb3J0IGFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbmltcG9ydCBBcHBEaXNwYXRjaGVyIGZyb20gJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcic7XG5pbXBvcnQgVHJhY2tlckNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvVHJhY2tlckNvbnN0YW50cyc7XG5pbXBvcnQgeyBnZXRQcm9qZWN0RGV0YWlscywgZ2V0TWlsZXN0b25lcyB9IGZyb20gJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnO1xuXG5cbnZhciBfcHJvamVjdHMgPSBbXTtcbnZhciBfc2VsZWN0ZWQ7XG5cbnZhciBQcm9qZWN0U3RvcmUgID0gYXNzaWduKHt9LCBFdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgLy8gRW1pdCBDaGFuZ2UgZXZlbnRcbiAgZW1pdENoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbWl0KCdjaGFuZ2UnKTtcbiAgfSxcblxuICAvLyBBZGQgY2hhbmdlIGxpc3RlbmVyXG4gIGFkZENoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHRoaXMub24oJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfSxcblxuICAvLyBSZW1vdmUgY2hhbmdlIGxpc3RlbmVyXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfSxcblxuXHRnZXRQcm9qZWN0czogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9wcm9qZWN0cztcblx0fSxcblxuXHRnZXRQcm9qZWN0OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gX3NlbGVjdGVkO1xuXHR9XG59KTtcblxuUHJvamVjdFN0b3JlLmRpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGFjdGlvbiA9PiB7XG5cblx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfUFJPSkVDVFM6XG5cdFx0XHRfcHJvamVjdHMgPSBhY3Rpb24uZGF0YTtcblx0XHRcdFByb2plY3RTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfUFJPSkVDVDpcblx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KGFjdGlvbi5pZCk7XG5cdFx0XHRjb25zb2xlLmxvZygncHJvamVjdCcsIF9zZWxlY3RlZCk7XG5cdFx0XHRQcm9qZWN0U3RvcmUuZW1pdENoYW5nZSgpO1xuXG5cdFx0XHRnZXRQcm9qZWN0RGV0YWlscyhfc2VsZWN0ZWQpO1xuXHRcdFx0Z2V0TWlsZXN0b25lcyhfc2VsZWN0ZWQpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBQcm9qZWN0U3RvcmU7XG4iLCJcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgYXNzaWduIGZyb20gJ29iamVjdC1hc3NpZ24nO1xuXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBTZXR0aW5nc0NvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvU2V0dGluZ3NDb25zdGFudHMnO1xuXG5cbmZ1bmN0aW9uIF9zZXRTZXR0aW5ncyhkYXRhKSB7XG5cdHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCksIGRhdGEpO1xuXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2V0dGluZ3MnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xufVxuXG52YXIgU2V0dGluZ3NTdG9yZSAgPSBhc3NpZ24oe30sIEV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcblxuICAvLyBFbWl0IENoYW5nZSBldmVudFxuICBlbWl0Q2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICB9LFxuXG4gIC8vIEFkZCBjaGFuZ2UgbGlzdGVuZXJcbiAgYWRkQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9LFxuXG4gIC8vIFJlbW92ZSBjaGFuZ2UgbGlzdGVuZXJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9LFxuXG5cdGdldFNldHRpbmdzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZ3MnKSkgfHwge307XG5cdH1cbn0pO1xuXG5cblNldHRpbmdzU3RvcmUuZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoYWN0aW9uID0+IHtcblxuXHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRjYXNlIFNldHRpbmdzQ29uc3RhbnRzLlNBVkVfU0VUVElOR1M6XG5cdFx0XHRfc2V0U2V0dGluZ3MoYWN0aW9uLmRhdGEpO1xuXHRcdFx0U2V0dGluZ3NTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvL25vIG9wXG5cdH1cblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNldHRpbmdzU3RvcmU7XG4iLCJcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFNldHRpbmdzQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cyc7XG5pbXBvcnQgeyBnZXRVc2VycyB9IGZyb20gJy4uL2FjdGlvbnMvU2V0dGluZ3NBY3Rpb25zJztcblxuaW1wb3J0IFNldHRpbmdzU3RvcmUgZnJvbSAnLi9TZXR0aW5nc1N0b3JlJztcblxuXG52YXIgX3VzZXJzID0gW107XG5cbnZhciBTZXR0aW5nc1VzZXJzU3RvcmUgID0gYXNzaWduKHt9LCBFdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgLy8gRW1pdCBDaGFuZ2UgZXZlbnRcbiAgZW1pdENoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbWl0KCdjaGFuZ2UnKTtcbiAgfSxcblxuICAvLyBBZGQgY2hhbmdlIGxpc3RlbmVyXG4gIGFkZENoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHRoaXMub24oJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfSxcblxuICAvLyBSZW1vdmUgY2hhbmdlIGxpc3RlbmVyXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfSxcblxuXHRnZXRVc2VyczogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF91c2Vycztcblx0fVxufSk7XG5cblNldHRpbmdzVXNlcnNTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgU2V0dGluZ3NDb25zdGFudHMuU0FWRV9TRVRUSU5HUzpcblx0XHRcdEFwcERpc3BhdGNoZXIud2FpdEZvcihbU2V0dGluZ3NTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG5cdFx0XHRnZXRVc2VycygpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFNldHRpbmdzQ29uc3RhbnRzLlJFQ0VJVkVfVVNFUlM6XG5cdFx0XHRfdXNlcnMgPSBhY3Rpb24uZGF0YTtcblx0XHRcdFNldHRpbmdzVXNlcnNTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvL25vIG9wXG5cdH1cblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNldHRpbmdzVXNlcnNTdG9yZTtcbiIsIlxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBTZXR0aW5nc1N0b3JlIGZyb20gJy4vc3RvcmVzL1NldHRpbmdzU3RvcmUnO1xuXHRcbmV4cG9ydCBmdW5jdGlvbiBhcGlSZXF1ZXN0KG9wdGlvbnMpIHtcblxuXHR2YXIgZGVmYXVsdHMgPSB7XG5cdFx0dHlwZTogJ1BPU1QnLFxuXHRcdGRhdGFUeXBlOiAndGV4dCcsXG5cdFx0ZGF0YToge30sXG4gICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucy51cmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xuICAgIH1cblx0fTtcblxuXHR2YXIgYXBwU2V0dGluZ3MgPSBTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCk7XG5cdGlmIChhcHBTZXR0aW5ncykge1xuXHRcdGRlZmF1bHRzLmRhdGEgPSB7XG5cdFx0XHRhcGlfZ3JvdXA6IGFwcFNldHRpbmdzLmdyb3VwSWQsXG5cdFx0XHRhcGlfc2VjcmV0OiBhcHBTZXR0aW5ncy5ncm91cFNlY3JldFxuXHRcdH07XG5cdH1cblxuXHR2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cdGlmIChzZXR0aW5ncy5kYXRhLmFwaV9ncm91cCAmJiBzZXR0aW5ncy5kYXRhLmFwaV9zZWNyZXQpIHtcblx0XHQkLmFqYXgoJ2h0dHBzOi8vd3d3LnRlYW1sZWFkZXIuYmUvYXBpJyArIG9wdGlvbnMudXJsLCBzZXR0aW5ncyk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGh0bWxFbnRpdGllcyhzdHJpbmcpIHtcblx0cmV0dXJuIHN0cmluZ1xuXHRcdC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpXG5cdFx0LnJlcGxhY2UoLyYjMDM5Oy9nLCBcIidcIik7XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJcbnZhciBndWkgPSBub2RlUmVxdWlyZSgnbncuZ3VpJyk7XG52YXIgbWIgPSBuZXcgZ3VpLk1lbnUoe3R5cGU6ICdtZW51YmFyJ30pO1xudHJ5IHtcbiAgbWIuY3JlYXRlTWFjQnVpbHRpbignVGVhbWxlYWRlciBUaW1lJywge1xuICAgIGhpZGVFZGl0OiBmYWxzZSxcbiAgfSk7XG4gIGd1aS5XaW5kb3cuZ2V0KCkubWVudSA9IG1iO1xufSBjYXRjaChleCkge1xuICBjb25zb2xlLmxvZyhleC5tZXNzYWdlKTtcbn1cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbnZhciBSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcbnZhciBEZWZhdWx0Um91dGUgPSBSb3V0ZXIuRGVmYXVsdFJvdXRlO1xudmFyIFJvdXRlID0gUm91dGVyLlJvdXRlO1xuXG52YXIgVGVhbWxlYWRlclRpbWVBcHAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvVGVhbWxlYWRlclRpbWVBcHAucmVhY3QnKTtcbnZhciBUcmFja2VyID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1RyYWNrZXIucmVhY3QnKTtcbnZhciBTZXR0aW5ncyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9TZXR0aW5ncy5yZWFjdCcpO1xuXG52YXIgcm91dGVzID0gKFxuICA8Um91dGUgbmFtZT1cImFwcFwiIHBhdGg9XCIvXCIgaGFuZGxlcj17VGVhbWxlYWRlclRpbWVBcHB9PlxuICAgIDxSb3V0ZSBuYW1lPVwic2V0dGluZ3NcIiBoYW5kbGVyPXtTZXR0aW5nc30vPlxuICAgIDxEZWZhdWx0Um91dGUgbmFtZT1cInRyYWNrZXJcIiBoYW5kbGVyPXtUcmFja2VyfS8+XG4gIDwvUm91dGU+XG4pO1xuXG5Sb3V0ZXIucnVuKHJvdXRlcywgZnVuY3Rpb24gKEhhbmRsZXIpIHtcbiAgUmVhY3QucmVuZGVyKDxIYW5kbGVyLz4sIGRvY3VtZW50LmJvZHkpO1xufSk7XG4iXX0=
