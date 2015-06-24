(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.saveSettings = saveSettings;
exports.getUsers = getUsers;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsUtils = require('../utils/Utils');

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
	(0, _utilsUtils.apiRequest)({
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

},{"../constants/SettingsConstants":13,"../dispatcher/AppDispatcher":15,"../utils/Utils":23}],2:[function(require,module,exports){
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

var _utilsUtils = require('../utils/Utils');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsTrackerConstants = require('../constants/TrackerConstants');

var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

function getProjects() {
	(0, _utilsUtils.apiRequest)({
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
		(0, _utilsUtils.apiRequest)({
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
		(0, _utilsUtils.apiRequest)({
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

		(0, _utilsUtils.apiRequest)({
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

},{"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"../utils/Utils":23}],3:[function(require,module,exports){
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

var _utilsUtils = require('../utils/Utils');

var SelectInput = _react2['default'].createClass({
	displayName: 'SelectInput',

	render: function render() {

		var optionNodes = this.props.options.map(function (option) {
			return _react2['default'].createElement(
				'option',
				{ key: option.value, value: option.value },
				(0, _utilsUtils.htmlEntities)(option.label)
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

},{"../utils/Utils":23,"react":"react"}],6:[function(require,module,exports){
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

		(0, _actionsSettingsActions.saveSettings)({
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

var _utilsUtils = require('../utils/Utils');

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

		(0, _utilsUtils.apiRequest)({
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

},{"../utils/Utils":23,"./SelectInput.react":5,"react":"react"}],9:[function(require,module,exports){
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

},{"events":24,"flux":"flux","react":"react","react-router":"react-router"}],10:[function(require,module,exports){
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

var _utilsStoreUtils = require('../utils/StoreUtils');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsTrackerConstants = require('../constants/TrackerConstants');

var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

var _contactOrCompany;
var _contactOrCompanyId;

var CustomerStore = (0, _utilsStoreUtils.createStore)({

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

},{"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"../utils/StoreUtils":22}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsStoreUtils = require('../utils/StoreUtils');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsTrackerConstants = require('../constants/TrackerConstants');

var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

var _actionsTrackerActions = require('../actions/TrackerActions');

var _storesProjectStore = require('../stores/ProjectStore');

var _storesProjectStore2 = _interopRequireDefault(_storesProjectStore);

var _milestones = [];
var _selected;

var MilestoneStore = (0, _utilsStoreUtils.createStore)({

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

},{"../actions/TrackerActions":2,"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"../stores/ProjectStore":19,"../utils/StoreUtils":22}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsStoreUtils = require('../utils/StoreUtils');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsTrackerConstants = require('../constants/TrackerConstants');

var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

var _storesMilestoneStore = require('../stores/MilestoneStore');

var _storesMilestoneStore2 = _interopRequireDefault(_storesMilestoneStore);

var _tasks = [];
var _selected;

var MilestoneTaskStore = (0, _utilsStoreUtils.createStore)({

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

},{"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"../stores/MilestoneStore":17,"../utils/StoreUtils":22}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsStoreUtils = require('../utils/StoreUtils');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsTrackerConstants = require('../constants/TrackerConstants');

var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

var _actionsTrackerActions = require('../actions/TrackerActions');

var _projects = [];
var _selected;

var ProjectStore = (0, _utilsStoreUtils.createStore)({

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

},{"../actions/TrackerActions":2,"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"../utils/StoreUtils":22}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _utilsStoreUtils = require('../utils/StoreUtils');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsSettingsConstants = require('../constants/SettingsConstants');

var _constantsSettingsConstants2 = _interopRequireDefault(_constantsSettingsConstants);

function _setSettings(data) {
	var settings = _jquery2['default'].extend({}, SettingsStore.getSettings(), data);
	localStorage.setItem('settings', JSON.stringify(settings));
}

var SettingsStore = (0, _utilsStoreUtils.createStore)({

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

},{"../constants/SettingsConstants":13,"../dispatcher/AppDispatcher":15,"../utils/StoreUtils":22,"jquery":"jquery"}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsStoreUtils = require('../utils/StoreUtils');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsSettingsConstants = require('../constants/SettingsConstants');

var _constantsSettingsConstants2 = _interopRequireDefault(_constantsSettingsConstants);

var _actionsSettingsActions = require('../actions/SettingsActions');

var _SettingsStore = require('./SettingsStore');

var _SettingsStore2 = _interopRequireDefault(_SettingsStore);

var _users = [];

var SettingsUsersStore = (0, _utilsStoreUtils.createStore)({

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

},{"../actions/SettingsActions":1,"../constants/SettingsConstants":13,"../dispatcher/AppDispatcher":15,"../utils/StoreUtils":22,"./SettingsStore":20}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createStore = createStore;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _underscore = require('underscore');

var _events = require('events');

var CHANGE_EVENT = 'change';

function createStore(spec) {
  var emitter = new _events.EventEmitter();
  emitter.setMaxListeners(0);

  var store = (0, _objectAssign2['default'])({
    emitChange: function emitChange() {
      emitter.emit(CHANGE_EVENT);
    },

    addChangeListener: function addChangeListener(callback) {
      emitter.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function removeChangeListener(callback) {
      emitter.removeListener(CHANGE_EVENT, callback);
    }
  }, spec);

  // Auto-bind store methods for convenience
  (0, _underscore.each)(store, function (val, key) {
    if ((0, _underscore.isFunction)(val)) {
      store[key] = store[key].bind(store);
    }
  });

  return store;
}

},{"events":24,"object-assign":"object-assign","underscore":"underscore"}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.apiRequest = apiRequest;
exports.htmlEntities = htmlEntities;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _storesSettingsStore = require('../stores/SettingsStore');

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

},{"../stores/SettingsStore":20,"jquery":"jquery"}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{"./components/Settings.react":6,"./components/TeamleaderTimeApp.react":9,"./components/Tracker.react":11,"react":"react","react-router":"react-router"}]},{},[25])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL01pbGVzdG9uZVNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvUHJvamVjdFNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvU2VsZWN0SW5wdXQucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1NldHRpbmdzLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UYXNrU2VsZWN0Q29udGFpbmVyLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UYXNrVHlwZVNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVGVhbWxlYWRlclRpbWVBcHAucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1RleHRJbnB1dC5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVHJhY2tlci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVXNlclNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL0N1c3RvbWVyU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvTWlsZXN0b25lU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvTWlsZXN0b25lVGFza1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1Byb2plY3RTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3N0b3Jlcy9TZXR0aW5nc1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1NldHRpbmdzVXNlcnNTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3V0aWxzL1N0b3JlVXRpbHMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy91dGlscy9VdGlscy5qc3giLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O1FDTWdCLFlBQVksR0FBWixZQUFZO1FBT1osUUFBUSxHQUFSLFFBQVE7Ozs7MEJBWkcsZ0JBQWdCOzt1Q0FDakIsNkJBQTZCOzs7OzBDQUN6QixnQ0FBZ0M7Ozs7QUFHdkQsU0FBUyxZQUFZLENBQUMsSUFBSSxFQUFFO0FBQ2pDLHNDQUFjLFFBQVEsQ0FBQztBQUNyQixNQUFJLEVBQUUsd0NBQWtCLGFBQWE7QUFDckMsTUFB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7cUJDalNrQixPQUFPOzs7O0FBWHpCLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNoQyxJQUFJLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztBQUN6QyxJQUFJO0FBQ0YsSUFBRSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFO0FBQ3JDLFlBQVEsRUFBRSxLQUFLLEVBQ2hCLENBQUMsQ0FBQztBQUNILEtBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztDQUM1QixDQUFDLE9BQU0sRUFBRSxFQUFFO0FBQ1YsU0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDekI7O0FBR0QsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3JDLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDdkMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQzs7QUFFekIsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQztBQUN4RSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNwRCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7QUFFdEQsSUFBSSxNQUFNLEdBQ1I7QUFBQyxPQUFLO0lBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsQUFBQztFQUNwRCxpQ0FBQyxLQUFLLElBQUMsSUFBSSxFQUFDLFVBQVUsRUFBQyxPQUFPLEVBQUUsUUFBUSxBQUFDLEdBQUU7RUFDM0MsaUNBQUMsWUFBWSxJQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsT0FBTyxFQUFFLE9BQU8sQUFBQyxHQUFFO0NBQzFDLEFBQ1QsQ0FBQzs7QUFFRixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLE9BQU8sRUFBRTtBQUNwQyxxQkFBTSxNQUFNLENBQUMsaUNBQUMsT0FBTyxPQUFFLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ3pDLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbmltcG9ydCB7IGFwaVJlcXVlc3QgfSBmcm9tICcuLi91dGlscy9VdGlscyc7XG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFNldHRpbmdzQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVTZXR0aW5ncyhkYXRhKSB7XG4gIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgIHR5cGU6IFNldHRpbmdzQ29uc3RhbnRzLlNBVkVfU0VUVElOR1MsXG4gICAgZGF0YTogZGF0YVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVzZXJzKGRhdGEpIHtcblx0YXBpUmVxdWVzdCh7XG5cdFx0dXJsOiAnL2dldFVzZXJzLnBocCcsXG5cdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0Ly9yZXZpdmVyIGZ1bmN0aW9uIHRvIHJlbmFtZSBrZXlzXG5cdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0c3dpdGNoIChwcm9wKSB7XG5cdFx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRjYXNlICduYW1lJzpcblx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHQgIFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdCAgXHRcdHR5cGU6IFNldHRpbmdzQ29uc3RhbnRzLlJFQ0VJVkVfVVNFUlMsXG5cdCAgXHRcdGRhdGE6IGRhdGFcblx0ICBcdH0pO1xuICAgIH1cblx0fSk7XG59XG4iLCJcbmltcG9ydCB7IGFwaVJlcXVlc3QgfSBmcm9tICcuLi91dGlscy9VdGlscyc7XG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFRyYWNrZXJDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9qZWN0cygpIHtcblx0YXBpUmVxdWVzdCh7XG5cdFx0dXJsOiAnL2dldFByb2plY3RzLnBocCcsXG5cdFx0ZGF0YToge1xuXHRcdFx0YW1vdW50OiAxMDAsXG5cdFx0XHRwYWdlbm86IDBcblx0XHR9LFxuXHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdC8vY29uc29sZS5sb2coc3RyaW5nKVxuXHRcdFx0Ly9yZXZpdmVyIGZ1bmN0aW9uIHRvIHJlbmFtZSBrZXlzXG5cdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0c3dpdGNoIChwcm9wKSB7XG5cdFx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRjYXNlICd0aXRsZSc6XG5cdFx0XHRcdFx0XHR0aGlzLmxhYmVsID0gdmFsO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdFxuXHRcdFx0aWYgKGRhdGEubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRkYXRhLnVuc2hpZnQoeyB2YWx1ZTogMCwgbGFiZWw6ICdDaG9vc2UuLi4nIH0pO1xuXHRcdFx0fVxuXG5cdCAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX1BST0pFQ1RTLFxuXHQgICAgICBkYXRhOiBkYXRhXG5cdCAgICB9KTtcbiAgICB9XG5cdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0UHJvamVjdChpZCkge1xuICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlNFVF9QUk9KRUNULFxuICAgIGlkOiBpZFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb2plY3REZXRhaWxzKHByb2plY3QpIHtcblx0aWYgKHByb2plY3QgPiAwKSB7XG5cdFx0YXBpUmVxdWVzdCh7XG5cdFx0XHR1cmw6ICcvZ2V0UHJvamVjdC5waHAnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwcm9qZWN0X2lkOiBwcm9qZWN0XG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nKTtcblx0XHQgICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5TRVRfQ09OVEFDVF9PUl9DT01QQU5ZLFxuXHRcdCAgICAgIG9wdGlvbjogZGF0YS5jb250YWN0X29yX2NvbXBhbnksXG5cdFx0ICAgICAgaWQ6IGRhdGEuY29udGFjdF9vcl9jb21wYW55X2lkXG5cdFx0ICAgIH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNaWxlc3RvbmVzKHByb2plY3QpIHtcblx0aWYgKHByb2plY3QgPiAwKSB7XG5cdFx0YXBpUmVxdWVzdCh7XG5cdFx0XHR1cmw6ICcvZ2V0TWlsZXN0b25lc0J5UHJvamVjdC5waHAnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwcm9qZWN0X2lkOiBwcm9qZWN0XG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHQvL3Jldml2ZXIgZnVuY3Rpb24gdG8gcmVuYW1lIGtleXNcblx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZywgZnVuY3Rpb24ocHJvcCwgdmFsKSB7XG5cdFx0XHRcdFx0c3dpdGNoIChwcm9wKSB7XG5cdFx0XHRcdFx0XHRjYXNlICdpZCc6XG5cdFx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGNhc2UgJ3RpdGxlJzpcblx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGZvciAodmFyIGkgPSBkYXRhLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHRcdGlmIChkYXRhW2ldLmNsb3NlZCA9PSAxKSB7XG5cdFx0XHRcdFx0XHRkYXRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdCAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHQgICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfTUlMRVNUT05FUyxcblx0XHQgICAgICBkYXRhOiBkYXRhXG5cdFx0ICAgIH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldE1pbGVzdG9uZShpZCkge1xuICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlNFVF9NSUxFU1RPTkUsXG4gICAgaWQ6IGlkXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWlsZXN0b25lVGFza3MobWlsZXN0b25lKSB7XG5cblx0aWYgKG1pbGVzdG9uZSA+IDApIHtcblxuXHRcdGFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFRhc2tzQnlNaWxlc3RvbmUucGhwJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWlsZXN0b25lX2lkOiBtaWxlc3RvbmVcblx0XHRcdH0sXG5cdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0Y2FzZSAnZGVzY3JpcHRpb24nOlxuXHRcdFx0XHRcdFx0XHR0aGlzLmxhYmVsID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IGRhdGEubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdFx0aWYgKGRhdGFbaV0uZG9uZSA9PSAxKSB7XG5cdFx0XHRcdFx0XHRkYXRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgYXBwU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXR0aW5ncycpKTtcblx0XHRcdFx0aWYgKGFwcFNldHRpbmdzICYmIGFwcFNldHRpbmdzLnVzZXJOYW1lKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IGRhdGEubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5vd25lcl9uYW1lICE9IGFwcFNldHRpbmdzLnVzZXJOYW1lKSB7XG5cdFx0XHRcdFx0XHRcdGRhdGEuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChkYXRhLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRkYXRhLnB1c2goeyB2YWx1ZTogJ25ldycsIGxhYmVsOiAnTmV3IHRhc2suLi4nIH0pO1xuXHRcdFx0XHR9XG5cblx0XHQgICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX01JTEVTVE9ORV9UQVNLUyxcblx0XHQgICAgICBkYXRhOiBkYXRhXG5cdFx0ICAgIH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldE1pbGVzdG9uZVRhc2soaWQpIHtcbiAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FX1RBU0ssXG4gICAgaWQ6IGlkXG4gIH0pO1xufVxuXG5cbiIsIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgZ2V0TWlsZXN0b25lcywgc2V0TWlsZXN0b25lIH0gZnJvbSAnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucyc7XG5pbXBvcnQgUHJvamVjdFN0b3JlIGZyb20gJy4uL3N0b3Jlcy9Qcm9qZWN0U3RvcmUnO1xuaW1wb3J0IE1pbGVzdG9uZVN0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVTdG9yZSc7XG5pbXBvcnQgU2VsZWN0SW5wdXQgZnJvbSAnLi9TZWxlY3RJbnB1dC5yZWFjdCc7XG5cblxudmFyIE1pbGVzdG9uZVNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRNaWxlc3RvbmVzU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRtaWxlc3RvbmVzOiBNaWxlc3RvbmVTdG9yZS5nZXRNaWxlc3RvbmVzKCksXG5cdFx0XHRtaWxlc3RvbmU6IE1pbGVzdG9uZVN0b3JlLmdldE1pbGVzdG9uZSgpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0TWlsZXN0b25lc1N0YXRlKCk7XG5cdH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0TWlsZXN0b25lc1N0YXRlKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRnZXRNaWxlc3RvbmVzKFByb2plY3RTdG9yZS5nZXRQcm9qZWN0KCkpO1xuICBcdE1pbGVzdG9uZVN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0TWlsZXN0b25lU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblx0XHRzZXRNaWxlc3RvbmUodGFyZ2V0LnZhbHVlKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLm1pbGVzdG9uZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0XHRyZXR1cm4gKFxuXHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cIm1pbGVzdG9uZVwiPk1pbGVzdG9uZTwvbGFiZWw+XG5cdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0XHQ8U2VsZWN0SW5wdXQgXG5cdFx0XHRcdFx0XHRpZD1cIm1pbGVzdG9uZVwiIFxuXHRcdFx0XHRcdFx0cmVmPVwibWlsZXN0b25lXCIgXG5cdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS5taWxlc3RvbmV9XG5cdFx0XHRcdFx0XHRvcHRpb25zPXt0aGlzLnN0YXRlLm1pbGVzdG9uZXN9IFxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSBcblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBNaWxlc3RvbmVTZWxlY3RDb250YWluZXI7IiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBnZXRQcm9qZWN0cywgc2V0UHJvamVjdCB9IGZyb20gJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnO1xuaW1wb3J0IFByb2plY3RTdG9yZSBmcm9tICcuLi9zdG9yZXMvUHJvamVjdFN0b3JlJztcbmltcG9ydCBTZWxlY3RJbnB1dCBmcm9tICcuL1NlbGVjdElucHV0LnJlYWN0JztcblxuXG52YXIgUHJvamVjdFNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRQcm9qZWN0c1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJvamVjdHM6IFByb2plY3RTdG9yZS5nZXRQcm9qZWN0cygpLFxuXHRcdFx0cHJvamVjdDogUHJvamVjdFN0b3JlLmdldFByb2plY3QoKVxuXHRcdH1cblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFByb2plY3RzU3RhdGUoKTtcblx0fSxcblxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRQcm9qZWN0c1N0YXRlKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRnZXRQcm9qZWN0cygpO1xuICBcdFByb2plY3RTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFByb2plY3RTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdHNldFByb2plY3QodGFyZ2V0LnZhbHVlKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwicHJvamVjdFwiPlByb2plY3Q8L2xhYmVsPlxuXHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0PFNlbGVjdElucHV0IFxuXHRcdFx0XHRcdFx0aWQ9XCJwcm9qZWN0XCIgXG5cdFx0XHRcdFx0XHRyZWY9XCJwcm9qZWN0XCIgXG5cdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS5wcm9qZWN0fVxuXHRcdFx0XHRcdFx0b3B0aW9ucz17dGhpcy5zdGF0ZS5wcm9qZWN0c30gXG5cdFx0XHRcdFx0XHRvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IFxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFByb2plY3RTZWxlY3RDb250YWluZXI7XG4iLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBodG1sRW50aXRpZXMgfSBmcm9tICcuLi91dGlscy9VdGlscyc7XG5cblxudmFyIFNlbGVjdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cbiAgXHR2YXIgb3B0aW9uTm9kZXMgPSB0aGlzLnByb3BzLm9wdGlvbnMubWFwKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgcmV0dXJuIChcbiAgICAgIFx0PG9wdGlvbiBrZXk9e29wdGlvbi52YWx1ZX0gdmFsdWU9e29wdGlvbi52YWx1ZX0gPntodG1sRW50aXRpZXMob3B0aW9uLmxhYmVsKX08L29wdGlvbj5cbiAgICAgICk7XG4gIFx0fSk7XG5cblx0XHRyZXR1cm4gKFxuXHQgIFx0PHNlbGVjdCBcblx0ICBcdFx0ey4uLnRoaXMucHJvcHN9IFxuXHQgIFx0XHRjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBcblx0XHRcdD5cblx0ICBcdFx0e29wdGlvbk5vZGVzfVxuXHQgIFx0PC9zZWxlY3Q+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNlbGVjdElucHV0OyIsIlxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUm91dGVyLCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInO1xuXG5pbXBvcnQgU2V0dGluZ3NTdG9yZSBmcm9tICcuLi9zdG9yZXMvU2V0dGluZ3NTdG9yZSc7XG5pbXBvcnQgU2V0dGluZ3NVc2Vyc1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9TZXR0aW5nc1VzZXJzU3RvcmUnO1xuaW1wb3J0IHsgc2F2ZVNldHRpbmdzIH0gZnJvbSAnLi4vYWN0aW9ucy9TZXR0aW5nc0FjdGlvbnMnO1xuaW1wb3J0IFRleHRJbnB1dCBmcm9tICcuL1RleHRJbnB1dC5yZWFjdCc7XG5pbXBvcnQgU2VsZWN0SW5wdXQgZnJvbSAnLi9TZWxlY3RJbnB1dC5yZWFjdCc7XG5pbXBvcnQgVXNlclNlbGVjdENvbnRhaW5lciBmcm9tICcuL1VzZXJTZWxlY3RDb250YWluZXIucmVhY3QnO1xuXG5cbnZhciBTZXR0aW5ncyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCk7XG4gIH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKFNldHRpbmdzU3RvcmUuZ2V0U2V0dGluZ3MoKSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFNldHRpbmdzU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRTZXR0aW5nc1N0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR2YXIgZ3JvdXBJZCA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5ncm91cElkKS52YWx1ZS50cmltKCk7XG5cdFx0dmFyIGdyb3VwU2VjcmV0ID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmdyb3VwU2VjcmV0KS52YWx1ZS50cmltKCk7XG5cdFx0aWYgKCFncm91cFNlY3JldCB8fCAhZ3JvdXBJZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBjb250YWluZXIgPSB0aGlzLnJlZnMudXNlclNlbGVjdENvbnRhaW5lcjtcblx0XHR2YXIgc2VsZWN0ID0gY29udGFpbmVyLnJlZnMudXNlclNlbGVjdDtcblx0XHR2YXIgc2VsZWN0Tm9kZSA9IFJlYWN0LmZpbmRET01Ob2RlKHNlbGVjdCk7XG5cblx0XHRzYXZlU2V0dGluZ3Moe1xuXHRcdFx0Z3JvdXBJZDogZ3JvdXBJZCxcblx0XHRcdGdyb3VwU2VjcmV0OiBncm91cFNlY3JldCxcblx0XHRcdHVzZXJJZDogc2VsZWN0ID8gc2VsZWN0Tm9kZS52YWx1ZSA6IDAsXG5cdFx0XHR1c2VyTmFtZTogc2VsZWN0ID8gJChzZWxlY3ROb2RlKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS50ZXh0KCkgOiAnJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwic2V0dGluZ3NcIj5cblx0XHRcdFx0PGZvcm0gY2xhc3NOYW1lPVwiZm9ybS1ob3Jpem9udGFsXCIgb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cblx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cImdyb3VwLWlkXCI+R3JvdXAgSUQ8L2xhYmVsPlxuXHRcdFx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHQgICAgXHQ8VGV4dElucHV0IGlkPVwiZ3JvdXAtaWRcIiByZWY9XCJncm91cElkXCIgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLmdyb3VwSWR9IC8+XG5cdFx0XHRcdCAgICA8L2Rpdj5cblx0XHRcdFx0ICA8L2Rpdj5cblx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cImdyb3VwLXNlY3JldFwiPkdyb3VwIFNlY3JldDwvbGFiZWw+XG5cdFx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdCAgICBcdDxUZXh0SW5wdXQgaWQ9XCJncm91cC1zZWNyZXRcIiByZWY9XCJncm91cFNlY3JldFwiIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS5ncm91cFNlY3JldH0gLz5cblx0XHRcdFx0ICAgIDwvZGl2PlxuXHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHQgIDxVc2VyU2VsZWN0Q29udGFpbmVyIFxuXHRcdFx0XHQgIFx0cmVmPVwidXNlclNlbGVjdENvbnRhaW5lclwiXG5cdFx0XHRcdCAgICB1c2VySWQ9e3RoaXMuc3RhdGUudXNlcklkfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJidG4tdG9vbGJhclwiPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSBzYXZlLXNldHRpbmdzLWJ0blwiPlNhdmU8L2J1dHRvbj4gXG5cdFx0XHRcdFx0XHQ8TGluayB0bz1cInRyYWNrZXJcIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtIGJhY2stc2V0dGluZ3MtYnRuXCI+QmFjazwvTGluaz5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNldHRpbmdzO1xuIiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBnZXRNaWxlc3RvbmVUYXNrcywgc2V0TWlsZXN0b25lVGFzayB9IGZyb20gJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnO1xuaW1wb3J0IE1pbGVzdG9uZVN0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVTdG9yZSc7XG5pbXBvcnQgTWlsZXN0b25lVGFza1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVUYXNrU3RvcmUnO1xuaW1wb3J0IFNlbGVjdElucHV0IGZyb20gJy4vU2VsZWN0SW5wdXQucmVhY3QnO1xuaW1wb3J0IFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyIGZyb20gJy4vVGFza1R5cGVTZWxlY3RDb250YWluZXIucmVhY3QnO1xuXG5cbnZhciBUYXNrU2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldFRhc2tzU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0YXNrczogTWlsZXN0b25lVGFza1N0b3JlLmdldE1pbGVzdG9uZVRhc2tzKCksXG5cdFx0XHR0YXNrOiBNaWxlc3RvbmVUYXNrU3RvcmUuZ2V0TWlsZXN0b25lVGFzaygpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VGFza3NTdGF0ZSgpO1xuXHR9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFRhc2tzU3RhdGUoKSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdGdldE1pbGVzdG9uZVRhc2tzKE1pbGVzdG9uZVN0b3JlLmdldE1pbGVzdG9uZSgpKTtcbiAgXHRNaWxlc3RvbmVUYXNrU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRNaWxlc3RvbmVUYXNrU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblx0XHRzZXRNaWxlc3RvbmVUYXNrKHRhcmdldC52YWx1ZSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS50YXNrcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJtaWxlc3RvbmUtdGFza1wiPlRvZG88L2xhYmVsPlxuXHRcdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0XHRcdDxTZWxlY3RJbnB1dCBcblx0XHRcdFx0XHRcdFx0aWQ9XCJtaWxlc3RvbmUtdGFza1wiIFxuXHRcdFx0XHRcdFx0XHRyZWY9XCJtaWxlc3RvbmVUYXNrXCIgXG5cdFx0XHRcdFx0XHRcdHZhbHVlPXt0aGlzLnN0YXRlLnRhc2t9IFxuXHRcdFx0XHRcdFx0XHRvcHRpb25zPXt0aGlzLnN0YXRlLnRhc2tzfSBcblx0XHRcdFx0XHRcdFx0b25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSBcblx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjdXN0b20tdGFza1wiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHRcdCAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwidGFzay10eXBlXCI+VHlwZTwvbGFiZWw+XG5cdFx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0ICBcdDxUYXNrVHlwZVNlbGVjdENvbnRhaW5lciAvPlxuXHRcdFx0XHRcdCAgPC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuXHRcdFx0XHRcdCAgXHQ8dGV4dGFyZWEgaWQ9XCJ0YXNrLWRlc2NyaXB0aW9uXCIgcmVmPVwidGFza0Rlc2NyaXB0aW9uXCIgcGxhY2Vob2xkZXI9XCJUYXNrIGRlc2NyaXB0aW9uLi4uXCIgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgcm93cz1cIjNcIj48L3RleHRhcmVhPlxuXHRcdFx0XHRcdCAgPC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0KTtcblx0XHR9XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUYXNrU2VsZWN0Q29udGFpbmVyO1xuIiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBhcGlSZXF1ZXN0IH0gZnJvbSAnLi4vdXRpbHMvVXRpbHMnO1xuaW1wb3J0IFNlbGVjdElucHV0IGZyb20gJy4vU2VsZWN0SW5wdXQucmVhY3QnO1xuXG5cbnZhciBUYXNrVHlwZVNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0YXNrVHlwZXM6IFtdXG5cdFx0fVxuXHR9LFxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG5cblx0XHRhcGlSZXF1ZXN0KHtcblx0XHRcdHVybDogJy9nZXRUYXNrVHlwZXMucGhwJyxcblx0XHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdFx0Ly9yZXZpdmVyIGZ1bmN0aW9uIHRvIHJlbmFtZSBrZXlzXG5cdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcsIGZ1bmN0aW9uKHByb3AsIHZhbCkge1xuXHRcdFx0XHRcdHN3aXRjaCAocHJvcCkge1xuXHRcdFx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRjYXNlICduYW1lJzpcblx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgdGFza1R5cGVzOiBkYXRhIH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8U2VsZWN0SW5wdXQgaWQ9XCJ0YXNrLXR5cGVcIiByZWY9XCJ0YXNrVHlwZVwiIG9wdGlvbnM9e3RoaXMuc3RhdGUudGFza1R5cGVzfSAvPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUYXNrVHlwZVNlbGVjdENvbnRhaW5lcjtcbiIsIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSb3V0ZXIsIHsgTGluaywgUm91dGVIYW5kbGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyJztcblxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IERpc3BhdGNoZXIgfSBmcm9tICdmbHV4JztcblxuXG52YXIgVGVhbWxlYWRlclRpbWVBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcFwiPlxuXHQgIFx0XHQ8aGVhZGVyPlxuXHQgIFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyZXh0XCI+PC9kaXY+XG5cdCAgXHRcdFx0PExpbmsgdG89XCJzZXR0aW5nc1wiIGNsYXNzTmFtZT1cInNldHRpbmdzLWxpbmtcIiBhY3RpdmVDbGFzc05hbWU9XCJhY3RpdmVcIj5cblx0ICBcdFx0XHRcdDxpIGNsYXNzTmFtZT1cImZhIGZhLWNvZ1wiPjwvaT5cblx0ICBcdFx0XHQ8L0xpbms+XG5cdCAgXHRcdDwvaGVhZGVyPlxuXG4gICAgICAgIHsvKiB0aGlzIGlzIHRoZSBpbXBvcnRhbnQgcGFydCAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICA8Um91dGVIYW5kbGVyLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVGVhbWxlYWRlclRpbWVBcHA7XG4iLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cblxudmFyIFRleHRJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHQvLyBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHQvLyBcdHJldHVybiB7IHZhbHVlOiAnJyB9O1xuXHQvLyB9LFxuXG5cdC8vIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuXHQvLyBcdHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogbmV4dFByb3BzLnNhdmVkVmFsdWUgfSk7XG5cdC8vIH0sXG5cblx0Ly8gaGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHQvLyBcdHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlIH0pO1xuIC8vICB9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0Ly92YXIgdmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8aW5wdXQgXG5cdFx0XHRcdHsuLi50aGlzLnByb3BzfVxuXHRcdFx0XHR0eXBlPVwidGV4dFwiIFxuXHRcdFx0XHRjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBcblx0XHRcdFx0Ly92YWx1ZT17dmFsdWV9XG5cdFx0XHRcdC8vb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSBcblx0XHRcdC8+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRleHRJbnB1dDsiLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBDdXN0b21lclN0b3JlIGZyb20gJy4uL3N0b3Jlcy9DdXN0b21lclN0b3JlJztcbmltcG9ydCBQcm9qZWN0U3RvcmUgZnJvbSAnLi4vc3RvcmVzL1Byb2plY3RTdG9yZSc7XG5pbXBvcnQgTWlsZXN0b25lU3RvcmUgZnJvbSAnLi4vc3RvcmVzL01pbGVzdG9uZVN0b3JlJztcbmltcG9ydCBNaWxlc3RvbmVUYXNrU3RvcmUgZnJvbSAnLi4vc3RvcmVzL01pbGVzdG9uZVRhc2tTdG9yZSc7XG5cbmltcG9ydCBQcm9qZWN0U2VsZWN0Q29udGFpbmVyIGZyb20gJy4vUHJvamVjdFNlbGVjdENvbnRhaW5lci5yZWFjdCc7XG5pbXBvcnQgTWlsZXN0b25lU2VsZWN0Q29udGFpbmVyIGZyb20gJy4vTWlsZXN0b25lU2VsZWN0Q29udGFpbmVyLnJlYWN0JztcbmltcG9ydCBUYXNrU2VsZWN0Q29udGFpbmVyIGZyb20gJy4vVGFza1NlbGVjdENvbnRhaW5lci5yZWFjdCc7XG5cblxudmFyIFRyYWNrZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0VHJhY2tlclN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJvamVjdDogUHJvamVjdFN0b3JlLmdldFByb2plY3QoKSxcblx0XHRcdG1pbGVzdG9uZTogTWlsZXN0b25lU3RvcmUuZ2V0TWlsZXN0b25lKCksXG5cdFx0XHRtaWxlc3RvbmVUYXNrOiBNaWxlc3RvbmVUYXNrU3RvcmUuZ2V0TWlsZXN0b25lVGFzaygpLFxuXHRcdFx0Y29udGFjdE9yQ29tcGFueTogQ3VzdG9tZXJTdG9yZS5nZXRDb250YWN0T3JDb21wYW55KCksXG5cdFx0XHRjb250YWN0T3JDb21wYW55SWQ6IEN1c3RvbWVyU3RvcmUuZ2V0Q29udGFjdE9yQ29tcGFueUlkKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRUcmFja2VyU3RhdGUoKVxuXHR9LFxuXG5cdGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnNvbGUubG9nKHRoaXMuZ2V0VHJhY2tlclN0YXRlKCkpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwidHJhY2tlclwiPlxuXHRcdFx0XHQ8Zm9ybSBjbGFzc05hbWU9XCJmb3JtLWhvcml6b250YWxcIiBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuXG5cdFx0XHRcdFx0PFByb2plY3RTZWxlY3RDb250YWluZXIgLz5cblx0XHRcdFx0XHQ8TWlsZXN0b25lU2VsZWN0Q29udGFpbmVyIC8+XG5cdFx0XHRcdFx0PFRhc2tTZWxlY3RDb250YWluZXIgLz5cblxuXHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLXRvb2xiYXJcIj5cblx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tc20gc3RhcnQtdGltZXItYnRuXCI+XG5cdFx0XHRcdFx0XHRcdFN0YXJ0IHRpbWVyXG5cdFx0XHRcdFx0XHQ8L2J1dHRvbj4gXG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZm9ybT5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUcmFja2VyXG4iLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUm91dGVyLCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInO1xuXG5pbXBvcnQgU2V0dGluZ3NTdG9yZSBmcm9tICcuLi9zdG9yZXMvU2V0dGluZ3NTdG9yZSc7XG5pbXBvcnQgU2V0dGluZ3NVc2Vyc1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9TZXR0aW5nc1VzZXJzU3RvcmUnO1xuaW1wb3J0IHsgZ2V0VXNlcnMgfSBmcm9tICcuLi9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucyc7XG5cbmltcG9ydCBTZWxlY3RJbnB1dCBmcm9tICcuL1NlbGVjdElucHV0LnJlYWN0JztcblxuXG52YXIgVXNlclNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRVc2Vyc1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0J3VzZXJzJzogU2V0dGluZ3NVc2Vyc1N0b3JlLmdldFVzZXJzKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRVc2Vyc1N0YXRlKCk7XG4gIH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0VXNlcnNTdGF0ZSgpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0Z2V0VXNlcnMoKTtcbiAgXHRTZXR0aW5nc1VzZXJzU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRTZXR0aW5nc1VzZXJzU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUudXNlcnMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0XHRyZXR1cm4gKFxuXHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cInVzZXItc2VsZWN0XCI+U2VsZWN0IHVzZXI8L2xhYmVsPlxuXHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0ICAgIFx0PFNlbGVjdElucHV0IFxuXHRcdCAgICBcdFx0aWQ9XCJ1c2VyLXNlbGVjdFwiIFxuXHRcdCAgICBcdFx0cmVmPVwidXNlclNlbGVjdFwiIFxuXHRcdCAgICBcdFx0b3B0aW9ucz17dGhpcy5zdGF0ZS51c2Vyc30gXG5cdFx0ICAgIFx0XHRkZWZhdWx0VmFsdWU9e3RoaXMucHJvcHMudXNlcklkfVxuXHRcdCAgICBcdC8+XG5cdFx0ICAgIDwvZGl2PlxuXHRcdCAgPC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJTZWxlY3RDb250YWluZXI7XG4iLCJcbmltcG9ydCBrZXlNaXJyb3IgZnJvbSAna2V5bWlycm9yJztcblxuZXhwb3J0IGRlZmF1bHQga2V5TWlycm9yKHtcblx0U0FWRV9TRVRUSU5HUzogbnVsbCxcblx0UkVDRUlWRV9VU0VSUzogbnVsbFxufSk7XG4iLCJcbmltcG9ydCBrZXlNaXJyb3IgZnJvbSAna2V5bWlycm9yJztcblxuZXhwb3J0IGRlZmF1bHQga2V5TWlycm9yKHtcblx0UkVDRUlWRV9QUk9KRUNUUzogbnVsbCxcblx0UkVDRUlWRV9NSUxFU1RPTkVTOiBudWxsLFxuXHRSRUNFSVZFX01JTEVTVE9ORV9UQVNLUzogbnVsbCxcblx0U0VUX1BST0pFQ1Q6IG51bGwsXG5cdFNFVF9NSUxFU1RPTkU6IG51bGwsXG5cdFNFVF9NSUxFU1RPTkVfVEFTSzogbnVsbCxcblx0U0VUX0NPTlRBQ1RfT1JfQ09NUEFOWTogbnVsbFxufSk7XG4iLCIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBBcHBEaXNwYXRjaGVyXG4gKlxuICogQSBzaW5nbGV0b24gdGhhdCBvcGVyYXRlcyBhcyB0aGUgY2VudHJhbCBodWIgZm9yIGFwcGxpY2F0aW9uIHVwZGF0ZXMuXG4gKi9cblxuaW1wb3J0IHsgRGlzcGF0Y2hlciB9IGZyb20gJ2ZsdXgnO1xuZXhwb3J0IGRlZmF1bHQgbmV3IERpc3BhdGNoZXIoKTtcbiIsIlxuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBUcmFja2VyQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJztcblxuXG52YXIgX2NvbnRhY3RPckNvbXBhbnk7XG52YXIgX2NvbnRhY3RPckNvbXBhbnlJZDtcblxudmFyIEN1c3RvbWVyU3RvcmUgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0Q29udGFjdE9yQ29tcGFueSgpIHtcblx0XHRyZXR1cm4gX2NvbnRhY3RPckNvbXBhbnk7XG5cdH0sXG5cblx0Z2V0Q29udGFjdE9yQ29tcGFueUlkKCkge1xuXHRcdHJldHVybiBfY29udGFjdE9yQ29tcGFueUlkO1xuXHR9XG59KTtcblxuQ3VzdG9tZXJTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfQ09OVEFDVF9PUl9DT01QQU5ZOlxuXHRcdFx0X2NvbnRhY3RPckNvbXBhbnkgPSBhY3Rpb24ub3B0aW9uO1xuXHRcdFx0X2NvbnRhY3RPckNvbXBhbnlJZCA9IGFjdGlvbi5pZDtcblx0XHRcdEN1c3RvbWVyU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBDdXN0b21lclN0b3JlO1xuIiwiXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSB9IGZyb20gJy4uL3V0aWxzL1N0b3JlVXRpbHMnO1xuXG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFRyYWNrZXJDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnO1xuaW1wb3J0IHsgZ2V0TWlsZXN0b25lVGFza3MgfSBmcm9tICcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJztcbmltcG9ydCBQcm9qZWN0U3RvcmUgZnJvbSAnLi4vc3RvcmVzL1Byb2plY3RTdG9yZSc7XG5cblxudmFyIF9taWxlc3RvbmVzID0gW107XG52YXIgX3NlbGVjdGVkO1xuXG52YXIgTWlsZXN0b25lU3RvcmUgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0TWlsZXN0b25lcygpIHtcblx0XHRyZXR1cm4gX21pbGVzdG9uZXM7XG5cdH0sXG5cblx0Z2V0TWlsZXN0b25lKCkge1xuXHRcdHJldHVybiBfc2VsZWN0ZWQ7XG5cdH1cbn0pO1xuXG5NaWxlc3RvbmVTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfUFJPSkVDVDpcblx0XHRcdEFwcERpc3BhdGNoZXIud2FpdEZvcihbUHJvamVjdFN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcblx0XHRcdF9taWxlc3RvbmVzID0gW107XG5cdFx0XHRfc2VsZWN0ZWQgPSAwO1xuXHRcdFx0TWlsZXN0b25lU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVTOlxuXHRcdFx0X21pbGVzdG9uZXMgPSBhY3Rpb24uZGF0YTtcblx0XHRcdGlmIChfbWlsZXN0b25lcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KF9taWxlc3RvbmVzWzBdLnZhbHVlKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ21pbGVzdG9uZScsIF9zZWxlY3RlZCk7XG5cdFx0XHR9XG5cdFx0XHRNaWxlc3RvbmVTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cblx0XHRcdGdldE1pbGVzdG9uZVRhc2tzKF9zZWxlY3RlZCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FOlxuXHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoYWN0aW9uLmlkKTtcblx0XHRcdGNvbnNvbGUubG9nKCdtaWxlc3RvbmUnLCBfc2VsZWN0ZWQpO1xuXHRcdFx0TWlsZXN0b25lU3RvcmUuZW1pdENoYW5nZSgpO1xuXG5cdFx0XHRnZXRNaWxlc3RvbmVUYXNrcyhfc2VsZWN0ZWQpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBNaWxlc3RvbmVTdG9yZTtcbiIsIlxuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBUcmFja2VyQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJztcbmltcG9ydCBNaWxlc3RvbmVTdG9yZSBmcm9tICcuLi9zdG9yZXMvTWlsZXN0b25lU3RvcmUnO1xuXG5cbnZhciBfdGFza3MgPSBbXTtcbnZhciBfc2VsZWN0ZWQ7XG5cbnZhciBNaWxlc3RvbmVUYXNrU3RvcmUgID0gY3JlYXRlU3RvcmUoe1xuXG5cdGdldE1pbGVzdG9uZVRhc2tzKCkge1xuXHRcdHJldHVybiBfdGFza3M7XG5cdH0sXG5cblx0Z2V0TWlsZXN0b25lVGFzaygpIHtcblx0XHRyZXR1cm4gX3NlbGVjdGVkO1xuXHR9XG59KTtcblxuTWlsZXN0b25lVGFza1N0b3JlLmRpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGFjdGlvbiA9PiB7XG5cblx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9QUk9KRUNUOlxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FOlxuXHRcdFx0QXBwRGlzcGF0Y2hlci53YWl0Rm9yKFtNaWxlc3RvbmVTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG5cdFx0XHRfdGFza3MgPSBbXTtcblx0XHRcdF9zZWxlY3RlZCA9IDA7XG5cdFx0XHRNaWxlc3RvbmVUYXNrU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVfVEFTS1M6XG5cdFx0XHRfdGFza3MgPSBhY3Rpb24uZGF0YTtcblx0XHRcdGlmIChfdGFza3MubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRfc2VsZWN0ZWQgPSBwYXJzZUludChfdGFza3NbMF0udmFsdWUpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygndGFzaycsIF9zZWxlY3RlZCk7XG5cdFx0XHR9XG5cdFx0XHRNaWxlc3RvbmVUYXNrU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX01JTEVTVE9ORV9UQVNLOlxuXHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoYWN0aW9uLmlkKTtcblx0XHRcdGNvbnNvbGUubG9nKCd0YXNrJywgX3NlbGVjdGVkKTtcblx0XHRcdE1pbGVzdG9uZVRhc2tTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvL25vIG9wXG5cdH1cblxufSk7XG5cblxuZXhwb3J0IGRlZmF1bHQgTWlsZXN0b25lVGFza1N0b3JlO1xuIiwiXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSB9IGZyb20gJy4uL3V0aWxzL1N0b3JlVXRpbHMnO1xuXG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFRyYWNrZXJDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnO1xuaW1wb3J0IHsgZ2V0UHJvamVjdERldGFpbHMsIGdldE1pbGVzdG9uZXMgfSBmcm9tICcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJztcblxuXG52YXIgX3Byb2plY3RzID0gW107XG52YXIgX3NlbGVjdGVkO1xuXG52YXIgUHJvamVjdFN0b3JlICA9IGNyZWF0ZVN0b3JlKHtcblxuXHRnZXRQcm9qZWN0cygpIHtcblx0XHRyZXR1cm4gX3Byb2plY3RzO1xuXHR9LFxuXG5cdGdldFByb2plY3QoKSB7XG5cdFx0cmV0dXJuIF9zZWxlY3RlZDtcblx0fVxufSk7XG5cblByb2plY3RTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX1BST0pFQ1RTOlxuXHRcdFx0X3Byb2plY3RzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRQcm9qZWN0U3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX1BST0pFQ1Q6XG5cdFx0XHRfc2VsZWN0ZWQgPSBwYXJzZUludChhY3Rpb24uaWQpO1xuXHRcdFx0Y29uc29sZS5sb2coJ3Byb2plY3QnLCBfc2VsZWN0ZWQpO1xuXHRcdFx0UHJvamVjdFN0b3JlLmVtaXRDaGFuZ2UoKTtcblxuXHRcdFx0Z2V0UHJvamVjdERldGFpbHMoX3NlbGVjdGVkKTtcblx0XHRcdGdldE1pbGVzdG9uZXMoX3NlbGVjdGVkKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8vbm8gb3Bcblx0fVxuXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvamVjdFN0b3JlO1xuIiwiXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBTZXR0aW5nc0NvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvU2V0dGluZ3NDb25zdGFudHMnO1xuXG5cbmZ1bmN0aW9uIF9zZXRTZXR0aW5ncyhkYXRhKSB7XG5cdHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCksIGRhdGEpO1xuXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2V0dGluZ3MnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xufVxuXG52YXIgU2V0dGluZ3NTdG9yZSAgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0U2V0dGluZ3MoKSB7XG5cdFx0cmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpIHx8IHt9O1xuXHR9XG59KTtcblxuXG5TZXR0aW5nc1N0b3JlLmRpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGFjdGlvbiA9PiB7XG5cblx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0Y2FzZSBTZXR0aW5nc0NvbnN0YW50cy5TQVZFX1NFVFRJTkdTOlxuXHRcdFx0X3NldFNldHRpbmdzKGFjdGlvbi5kYXRhKTtcblx0XHRcdFNldHRpbmdzU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTZXR0aW5nc1N0b3JlO1xuIiwiXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSB9IGZyb20gJy4uL3V0aWxzL1N0b3JlVXRpbHMnO1xuXG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFNldHRpbmdzQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cyc7XG5pbXBvcnQgeyBnZXRVc2VycyB9IGZyb20gJy4uL2FjdGlvbnMvU2V0dGluZ3NBY3Rpb25zJztcblxuaW1wb3J0IFNldHRpbmdzU3RvcmUgZnJvbSAnLi9TZXR0aW5nc1N0b3JlJztcblxuXG52YXIgX3VzZXJzID0gW107XG5cbnZhciBTZXR0aW5nc1VzZXJzU3RvcmUgID0gY3JlYXRlU3RvcmUoe1xuXG5cdGdldFVzZXJzKCkge1xuXHRcdHJldHVybiBfdXNlcnM7XG5cdH1cbn0pO1xuXG5TZXR0aW5nc1VzZXJzU3RvcmUuZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoYWN0aW9uID0+IHtcblxuXHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRjYXNlIFNldHRpbmdzQ29uc3RhbnRzLlNBVkVfU0VUVElOR1M6XG5cdFx0XHRBcHBEaXNwYXRjaGVyLndhaXRGb3IoW1NldHRpbmdzU3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuXHRcdFx0Z2V0VXNlcnMoKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBTZXR0aW5nc0NvbnN0YW50cy5SRUNFSVZFX1VTRVJTOlxuXHRcdFx0X3VzZXJzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRTZXR0aW5nc1VzZXJzU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTZXR0aW5nc1VzZXJzU3RvcmU7XG4iLCJcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5pbXBvcnQgeyBlYWNoLCBpc0Z1bmN0aW9uIH0gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG5jb25zdCBDSEFOR0VfRVZFTlQgPSAnY2hhbmdlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN0b3JlKHNwZWMpIHtcbiAgY29uc3QgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoMCk7XG5cbiAgY29uc3Qgc3RvcmUgPSBhc3NpZ24oe1xuICAgIGVtaXRDaGFuZ2UoKSB7XG4gICAgICBlbWl0dGVyLmVtaXQoQ0hBTkdFX0VWRU5UKTtcbiAgICB9LFxuXG4gICAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICAgIGVtaXR0ZXIub24oQ0hBTkdFX0VWRU5ULCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgICBlbWl0dGVyLnJlbW92ZUxpc3RlbmVyKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICAgIH1cbiAgfSwgc3BlYyk7XG5cbiAgLy8gQXV0by1iaW5kIHN0b3JlIG1ldGhvZHMgZm9yIGNvbnZlbmllbmNlXG4gIGVhY2goc3RvcmUsICh2YWwsIGtleSkgPT4ge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgIHN0b3JlW2tleV0gPSBzdG9yZVtrZXldLmJpbmQoc3RvcmUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHN0b3JlO1xufSIsIlxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBTZXR0aW5nc1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9TZXR0aW5nc1N0b3JlJztcblx0XG5leHBvcnQgZnVuY3Rpb24gYXBpUmVxdWVzdChvcHRpb25zKSB7XG5cblx0dmFyIGRlZmF1bHRzID0ge1xuXHRcdHR5cGU6ICdQT1NUJyxcblx0XHRkYXRhVHlwZTogJ3RleHQnLFxuXHRcdGRhdGE6IHt9LFxuICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKG9wdGlvbnMudXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcbiAgICB9XG5cdH07XG5cblx0dmFyIGFwcFNldHRpbmdzID0gU2V0dGluZ3NTdG9yZS5nZXRTZXR0aW5ncygpO1xuXHRpZiAoYXBwU2V0dGluZ3MpIHtcblx0XHRkZWZhdWx0cy5kYXRhID0ge1xuXHRcdFx0YXBpX2dyb3VwOiBhcHBTZXR0aW5ncy5ncm91cElkLFxuXHRcdFx0YXBpX3NlY3JldDogYXBwU2V0dGluZ3MuZ3JvdXBTZWNyZXRcblx0XHR9O1xuXHR9XG5cblx0dmFyIHNldHRpbmdzID0gJC5leHRlbmQodHJ1ZSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXHRpZiAoc2V0dGluZ3MuZGF0YS5hcGlfZ3JvdXAgJiYgc2V0dGluZ3MuZGF0YS5hcGlfc2VjcmV0KSB7XG5cdFx0JC5hamF4KCdodHRwczovL3d3dy50ZWFtbGVhZGVyLmJlL2FwaScgKyBvcHRpb25zLnVybCwgc2V0dGluZ3MpO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBodG1sRW50aXRpZXMoc3RyaW5nKSB7XG5cdHJldHVybiBzdHJpbmdcblx0XHQucmVwbGFjZSgvJmFtcDsvZywgJyYnKVxuXHRcdC5yZXBsYWNlKC8mIzAzOTsvZywgXCInXCIpO1xufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiXG52YXIgZ3VpID0gbm9kZVJlcXVpcmUoJ253Lmd1aScpO1xudmFyIG1iID0gbmV3IGd1aS5NZW51KHt0eXBlOiAnbWVudWJhcid9KTtcbnRyeSB7XG4gIG1iLmNyZWF0ZU1hY0J1aWx0aW4oJ1RlYW1sZWFkZXIgVGltZScsIHtcbiAgICBoaWRlRWRpdDogZmFsc2UsXG4gIH0pO1xuICBndWkuV2luZG93LmdldCgpLm1lbnUgPSBtYjtcbn0gY2F0Y2goZXgpIHtcbiAgY29uc29sZS5sb2coZXgubWVzc2FnZSk7XG59XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG52YXIgUm91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG52YXIgRGVmYXVsdFJvdXRlID0gUm91dGVyLkRlZmF1bHRSb3V0ZTtcbnZhciBSb3V0ZSA9IFJvdXRlci5Sb3V0ZTtcblxudmFyIFRlYW1sZWFkZXJUaW1lQXBwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1RlYW1sZWFkZXJUaW1lQXBwLnJlYWN0Jyk7XG52YXIgVHJhY2tlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9UcmFja2VyLnJlYWN0Jyk7XG52YXIgU2V0dGluZ3MgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvU2V0dGluZ3MucmVhY3QnKTtcblxudmFyIHJvdXRlcyA9IChcbiAgPFJvdXRlIG5hbWU9XCJhcHBcIiBwYXRoPVwiL1wiIGhhbmRsZXI9e1RlYW1sZWFkZXJUaW1lQXBwfT5cbiAgICA8Um91dGUgbmFtZT1cInNldHRpbmdzXCIgaGFuZGxlcj17U2V0dGluZ3N9Lz5cbiAgICA8RGVmYXVsdFJvdXRlIG5hbWU9XCJ0cmFja2VyXCIgaGFuZGxlcj17VHJhY2tlcn0vPlxuICA8L1JvdXRlPlxuKTtcblxuUm91dGVyLnJ1bihyb3V0ZXMsIGZ1bmN0aW9uIChIYW5kbGVyKSB7XG4gIFJlYWN0LnJlbmRlcig8SGFuZGxlci8+LCBkb2N1bWVudC5ib2R5KTtcbn0pO1xuIl19
