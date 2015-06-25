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
				success: function success(options) {
						var data = rekey(options, { id: 'value', name: 'label' });
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

var _underscore = require('underscore');

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
		success: function success(json) {
			var options = (0, _utilsUtils.rekey)(json, { id: 'value', title: 'label' });
			options = (0, _underscore.where)(options, { phase: 'active' });

			if (options.length > 0) {
				options.unshift({ value: 0, label: 'Choose...' });
			}

			_dispatcherAppDispatcher2['default'].dispatch({
				type: _constantsTrackerConstants2['default'].RECEIVE_PROJECTS,
				data: options
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
			success: function success(data) {
				console.log(data);

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
			success: function success(json) {
				var options = (0, _utilsUtils.rekey)(json, { id: 'value', title: 'label' });
				options = (0, _underscore.where)(options, { closed: 0 });

				_dispatcherAppDispatcher2['default'].dispatch({
					type: _constantsTrackerConstants2['default'].RECEIVE_MILESTONES,
					data: options
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
			success: function success(json) {
				var options = (0, _utilsUtils.rekey)(json, { id: 'value', description: 'label' });
				options = (0, _underscore.where)(options, { done: 0 });

				var appSettings = JSON.parse(localStorage.getItem('settings'));
				if (appSettings && appSettings.userName) {
					options = (0, _underscore.where)(options, { owner_name: appSettings.userName });
				}

				if (options.length > 0) {
					options.push({ value: -1, label: 'New task...' });
				}

				_dispatcherAppDispatcher2['default'].dispatch({
					type: _constantsTrackerConstants2['default'].RECEIVE_MILESTONE_TASKS,
					data: options
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

},{"../constants/TrackerConstants":14,"../dispatcher/AppDispatcher":15,"../utils/Utils":23,"underscore":"underscore"}],3:[function(require,module,exports){
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
		if (this.state.tasks.length > 1 && this.state.task != -1) {
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
			success: function success(options) {
				var data = (0, _utilsUtils.rekey)(options, { id: 'value', name: 'label' });
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
exports.rekey = rekey;
exports.htmlEntities = htmlEntities;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _storesSettingsStore = require('../stores/SettingsStore');

var _storesSettingsStore2 = _interopRequireDefault(_storesSettingsStore);

function apiRequest(options) {

	var defaults = {
		type: 'POST',
		dataType: 'json',
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

function rekey(arr, lookup) {
	for (var i = 0; i < arr.length; i++) {
		var obj = arr[i];
		for (var fromKey in lookup) {
			var toKey = lookup[fromKey];
			var value = obj[fromKey];
			if (value) {
				obj[toKey] = value;
				delete obj[fromKey];
			}
		}
	}
	return arr;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL01pbGVzdG9uZVNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvUHJvamVjdFNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvU2VsZWN0SW5wdXQucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1NldHRpbmdzLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UYXNrU2VsZWN0Q29udGFpbmVyLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UYXNrVHlwZVNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVGVhbWxlYWRlclRpbWVBcHAucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1RleHRJbnB1dC5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVHJhY2tlci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVXNlclNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL0N1c3RvbWVyU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvTWlsZXN0b25lU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvTWlsZXN0b25lVGFza1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1Byb2plY3RTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3N0b3Jlcy9TZXR0aW5nc1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1NldHRpbmdzVXNlcnNTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3V0aWxzL1N0b3JlVXRpbHMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy91dGlscy9VdGlscy5qc3giLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O1FDTWdCLFlBQVksR0FBWixZQUFZO1FBT1osUUFBUSxHQUFSLFFBQVE7Ozs7MEJBWkcsZ0JBQWdCOzt1Q0FDakIsNkJBQTZCOzs7OzBDQUN6QixnQ0FBZ0M7Ozs7QUFHdkQsU0FBUyxZQUFZLENBQUMsSUFBSSxFQUFFO0FBQ2pDLHVDQUFjLFFBQVEsQ0FBQztBQUNyQixRQUFJLEVBQUUsd0NBQWtCLGFBQWE7QUFDckMsUUFB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QUFNLENBQ1gsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FDdEIsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFHLENBQUMsQ0FBQztDQUMxQjs7O0FDaEREO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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b24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuaW1wb3J0IHsgYXBpUmVxdWVzdCB9IGZyb20gJy4uL3V0aWxzL1V0aWxzJztcbmltcG9ydCBBcHBEaXNwYXRjaGVyIGZyb20gJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcic7XG5pbXBvcnQgU2V0dGluZ3NDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL1NldHRpbmdzQ29uc3RhbnRzJztcblxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVNldHRpbmdzKGRhdGEpIHtcbiAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgdHlwZTogU2V0dGluZ3NDb25zdGFudHMuU0FWRV9TRVRUSU5HUyxcbiAgICBkYXRhOiBkYXRhXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VXNlcnMoZGF0YSkge1xuXHRhcGlSZXF1ZXN0KHtcblx0XHR1cmw6ICcvZ2V0VXNlcnMucGhwJyxcblx0XHRzdWNjZXNzOiAob3B0aW9ucykgPT4ge1xuXHRcdFx0dmFyIGRhdGEgPSByZWtleShvcHRpb25zLCB7IGlkOiAndmFsdWUnLCBuYW1lOiAnbGFiZWwnIH0pO1xuXHQgIFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdCAgXHRcdHR5cGU6IFNldHRpbmdzQ29uc3RhbnRzLlJFQ0VJVkVfVVNFUlMsXG5cdCAgXHRcdGRhdGE6IGRhdGFcblx0ICBcdH0pO1xuICAgIH1cblx0fSk7XG59XG4iLCJcbmltcG9ydCB7IHdoZXJlIH0gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgeyBhcGlSZXF1ZXN0LCByZWtleSB9IGZyb20gJy4uL3V0aWxzL1V0aWxzJztcbmltcG9ydCBBcHBEaXNwYXRjaGVyIGZyb20gJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcic7XG5pbXBvcnQgVHJhY2tlckNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvVHJhY2tlckNvbnN0YW50cyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb2plY3RzKCkge1xuXHRhcGlSZXF1ZXN0KHtcblx0XHR1cmw6ICcvZ2V0UHJvamVjdHMucGhwJyxcblx0XHRkYXRhOiB7XG5cdFx0XHRhbW91bnQ6IDEwMCxcblx0XHRcdHBhZ2VubzogMFxuXHRcdH0sXG5cdFx0c3VjY2VzczogKGpzb24pID0+IHtcblx0XHRcdHZhciBvcHRpb25zID0gcmVrZXkoanNvbiwgeyBpZDogJ3ZhbHVlJywgdGl0bGU6ICdsYWJlbCcgfSk7XG5cdFx0XHRvcHRpb25zID0gd2hlcmUob3B0aW9ucywgeyBwaGFzZTogJ2FjdGl2ZScgfSk7XG5cblx0XHRcdGlmIChvcHRpb25zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0b3B0aW9ucy51bnNoaWZ0KHsgdmFsdWU6IDAsIGxhYmVsOiAnQ2hvb3NlLi4uJyB9KTtcblx0XHRcdH1cblxuXHQgICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdCAgICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9QUk9KRUNUUyxcblx0ICAgICAgZGF0YTogb3B0aW9uc1xuXHQgICAgfSk7XG4gICAgfVxuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFByb2plY3QoaWQpIHtcbiAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5TRVRfUFJPSkVDVCxcbiAgICBpZDogaWRcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9qZWN0RGV0YWlscyhwcm9qZWN0KSB7XG5cdGlmIChwcm9qZWN0ID4gMCkge1xuXHRcdGFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFByb2plY3QucGhwJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cHJvamVjdF9pZDogcHJvamVjdFxuXHRcdFx0fSxcblx0XHRcdHN1Y2Nlc3M6IChkYXRhKSA9PiB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGRhdGEpXG5cblx0XHQgICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5TRVRfQ09OVEFDVF9PUl9DT01QQU5ZLFxuXHRcdCAgICAgIG9wdGlvbjogZGF0YS5jb250YWN0X29yX2NvbXBhbnksXG5cdFx0ICAgICAgaWQ6IGRhdGEuY29udGFjdF9vcl9jb21wYW55X2lkXG5cdFx0ICAgIH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNaWxlc3RvbmVzKHByb2plY3QpIHtcblx0aWYgKHByb2plY3QgPiAwKSB7XG5cdFx0YXBpUmVxdWVzdCh7XG5cdFx0XHR1cmw6ICcvZ2V0TWlsZXN0b25lc0J5UHJvamVjdC5waHAnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwcm9qZWN0X2lkOiBwcm9qZWN0XG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogKGpzb24pID0+IHtcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSByZWtleShqc29uLCB7IGlkOiAndmFsdWUnLCB0aXRsZTogJ2xhYmVsJyB9KTtcblx0XHRcdFx0b3B0aW9ucyA9IHdoZXJlKG9wdGlvbnMsIHsgY2xvc2VkOiAwIH0pO1xuXG5cdFx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdCAgICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVTLFxuXHRcdCAgICAgIGRhdGE6IG9wdGlvbnNcblx0XHQgICAgfSk7XG4gICAgICB9XG5cdFx0fSk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldE1pbGVzdG9uZShpZCkge1xuICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlNFVF9NSUxFU1RPTkUsXG4gICAgaWQ6IGlkXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWlsZXN0b25lVGFza3MobWlsZXN0b25lKSB7XG5cblx0aWYgKG1pbGVzdG9uZSA+IDApIHtcblxuXHRcdGFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFRhc2tzQnlNaWxlc3RvbmUucGhwJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWlsZXN0b25lX2lkOiBtaWxlc3RvbmVcblx0XHRcdH0sXG5cdFx0XHRzdWNjZXNzOiAoanNvbikgPT4ge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IHJla2V5KGpzb24sIHsgaWQ6ICd2YWx1ZScsIGRlc2NyaXB0aW9uOiAnbGFiZWwnIH0pO1xuXHRcdFx0XHRvcHRpb25zID0gd2hlcmUob3B0aW9ucywgeyBkb25lOiAwIH0pO1xuXG5cdFx0XHRcdHZhciBhcHBTZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpO1xuXHRcdFx0XHRpZiAoYXBwU2V0dGluZ3MgJiYgYXBwU2V0dGluZ3MudXNlck5hbWUpIHtcblx0XHRcdFx0XHRvcHRpb25zID0gd2hlcmUob3B0aW9ucywgeyBvd25lcl9uYW1lOiBhcHBTZXR0aW5ncy51c2VyTmFtZSB9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChvcHRpb25zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRvcHRpb25zLnB1c2goeyB2YWx1ZTogLTEsIGxhYmVsOiAnTmV3IHRhc2suLi4nIH0pO1xuXHRcdFx0XHR9XG5cblx0XHQgICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX01JTEVTVE9ORV9UQVNLUyxcblx0XHQgICAgICBkYXRhOiBvcHRpb25zXG5cdFx0ICAgIH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRNaWxlc3RvbmVUYXNrKGlkKSB7XG4gIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuU0VUX01JTEVTVE9ORV9UQVNLLFxuICAgIGlkOiBpZFxuICB9KTtcbn1cblxuXG4iLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IGdldE1pbGVzdG9uZXMsIHNldE1pbGVzdG9uZSB9IGZyb20gJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnO1xuaW1wb3J0IFByb2plY3RTdG9yZSBmcm9tICcuLi9zdG9yZXMvUHJvamVjdFN0b3JlJztcbmltcG9ydCBNaWxlc3RvbmVTdG9yZSBmcm9tICcuLi9zdG9yZXMvTWlsZXN0b25lU3RvcmUnO1xuaW1wb3J0IFNlbGVjdElucHV0IGZyb20gJy4vU2VsZWN0SW5wdXQucmVhY3QnO1xuXG5cbnZhciBNaWxlc3RvbmVTZWxlY3RDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0TWlsZXN0b25lc1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bWlsZXN0b25lczogTWlsZXN0b25lU3RvcmUuZ2V0TWlsZXN0b25lcygpLFxuXHRcdFx0bWlsZXN0b25lOiBNaWxlc3RvbmVTdG9yZS5nZXRNaWxlc3RvbmUoKVxuXHRcdH1cblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmdldE1pbGVzdG9uZXNTdGF0ZSgpO1xuXHR9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldE1pbGVzdG9uZXNTdGF0ZSgpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0Z2V0TWlsZXN0b25lcyhQcm9qZWN0U3RvcmUuZ2V0UHJvamVjdCgpKTtcbiAgXHRNaWxlc3RvbmVTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdE1pbGVzdG9uZVN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cdFx0c2V0TWlsZXN0b25lKHRhcmdldC52YWx1ZSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS5taWxlc3RvbmVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cdFx0cmV0dXJuIChcblx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJtaWxlc3RvbmVcIj5NaWxlc3RvbmU8L2xhYmVsPlxuXHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0PFNlbGVjdElucHV0IFxuXHRcdFx0XHRcdFx0aWQ9XCJtaWxlc3RvbmVcIiBcblx0XHRcdFx0XHRcdHJlZj1cIm1pbGVzdG9uZVwiIFxuXHRcdFx0XHRcdFx0dmFsdWU9e3RoaXMuc3RhdGUubWlsZXN0b25lfVxuXHRcdFx0XHRcdFx0b3B0aW9ucz17dGhpcy5zdGF0ZS5taWxlc3RvbmVzfSBcblx0XHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHRcdFx0Lz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTWlsZXN0b25lU2VsZWN0Q29udGFpbmVyOyIsIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgZ2V0UHJvamVjdHMsIHNldFByb2plY3QgfSBmcm9tICcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJztcbmltcG9ydCBQcm9qZWN0U3RvcmUgZnJvbSAnLi4vc3RvcmVzL1Byb2plY3RTdG9yZSc7XG5pbXBvcnQgU2VsZWN0SW5wdXQgZnJvbSAnLi9TZWxlY3RJbnB1dC5yZWFjdCc7XG5cblxudmFyIFByb2plY3RTZWxlY3RDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0UHJvamVjdHNTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHByb2plY3RzOiBQcm9qZWN0U3RvcmUuZ2V0UHJvamVjdHMoKSxcblx0XHRcdHByb2plY3Q6IFByb2plY3RTdG9yZS5nZXRQcm9qZWN0KClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRQcm9qZWN0c1N0YXRlKCk7XG5cdH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0UHJvamVjdHNTdGF0ZSgpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0Z2V0UHJvamVjdHMoKTtcbiAgXHRQcm9qZWN0U3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRQcm9qZWN0U3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblx0XHRzZXRQcm9qZWN0KHRhcmdldC52YWx1ZSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cInByb2plY3RcIj5Qcm9qZWN0PC9sYWJlbD5cblx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdDxTZWxlY3RJbnB1dCBcblx0XHRcdFx0XHRcdGlkPVwicHJvamVjdFwiIFxuXHRcdFx0XHRcdFx0cmVmPVwicHJvamVjdFwiIFxuXHRcdFx0XHRcdFx0dmFsdWU9e3RoaXMuc3RhdGUucHJvamVjdH1cblx0XHRcdFx0XHRcdG9wdGlvbnM9e3RoaXMuc3RhdGUucHJvamVjdHN9IFxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSBcblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBQcm9qZWN0U2VsZWN0Q29udGFpbmVyO1xuIiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgaHRtbEVudGl0aWVzIH0gZnJvbSAnLi4vdXRpbHMvVXRpbHMnO1xuXG5cbnZhciBTZWxlY3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gIFx0dmFyIG9wdGlvbk5vZGVzID0gdGhpcy5wcm9wcy5vcHRpb25zLm1hcChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICBcdDxvcHRpb24ga2V5PXtvcHRpb24udmFsdWV9IHZhbHVlPXtvcHRpb24udmFsdWV9PntodG1sRW50aXRpZXMob3B0aW9uLmxhYmVsKX08L29wdGlvbj5cbiAgICAgICk7XG4gIFx0fSk7XG5cblx0XHRyZXR1cm4gKFxuXHQgIFx0PHNlbGVjdCBcblx0ICBcdFx0ey4uLnRoaXMucHJvcHN9IFxuXHQgIFx0XHRjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBcblx0XHRcdD5cblx0ICBcdFx0e29wdGlvbk5vZGVzfVxuXHQgIFx0PC9zZWxlY3Q+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNlbGVjdElucHV0OyIsIlxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUm91dGVyLCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInO1xuXG5pbXBvcnQgU2V0dGluZ3NTdG9yZSBmcm9tICcuLi9zdG9yZXMvU2V0dGluZ3NTdG9yZSc7XG5pbXBvcnQgU2V0dGluZ3NVc2Vyc1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9TZXR0aW5nc1VzZXJzU3RvcmUnO1xuaW1wb3J0IHsgc2F2ZVNldHRpbmdzIH0gZnJvbSAnLi4vYWN0aW9ucy9TZXR0aW5nc0FjdGlvbnMnO1xuaW1wb3J0IFRleHRJbnB1dCBmcm9tICcuL1RleHRJbnB1dC5yZWFjdCc7XG5pbXBvcnQgU2VsZWN0SW5wdXQgZnJvbSAnLi9TZWxlY3RJbnB1dC5yZWFjdCc7XG5pbXBvcnQgVXNlclNlbGVjdENvbnRhaW5lciBmcm9tICcuL1VzZXJTZWxlY3RDb250YWluZXIucmVhY3QnO1xuXG5cbnZhciBTZXR0aW5ncyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCk7XG4gIH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKFNldHRpbmdzU3RvcmUuZ2V0U2V0dGluZ3MoKSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFNldHRpbmdzU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRTZXR0aW5nc1N0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR2YXIgZ3JvdXBJZCA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5ncm91cElkKS52YWx1ZS50cmltKCk7XG5cdFx0dmFyIGdyb3VwU2VjcmV0ID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmdyb3VwU2VjcmV0KS52YWx1ZS50cmltKCk7XG5cdFx0aWYgKCFncm91cFNlY3JldCB8fCAhZ3JvdXBJZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBjb250YWluZXIgPSB0aGlzLnJlZnMudXNlclNlbGVjdENvbnRhaW5lcjtcblx0XHR2YXIgc2VsZWN0ID0gY29udGFpbmVyLnJlZnMudXNlclNlbGVjdDtcblx0XHR2YXIgc2VsZWN0Tm9kZSA9IFJlYWN0LmZpbmRET01Ob2RlKHNlbGVjdCk7XG5cblx0XHRzYXZlU2V0dGluZ3Moe1xuXHRcdFx0Z3JvdXBJZDogZ3JvdXBJZCxcblx0XHRcdGdyb3VwU2VjcmV0OiBncm91cFNlY3JldCxcblx0XHRcdHVzZXJJZDogc2VsZWN0ID8gc2VsZWN0Tm9kZS52YWx1ZSA6IDAsXG5cdFx0XHR1c2VyTmFtZTogc2VsZWN0ID8gJChzZWxlY3ROb2RlKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS50ZXh0KCkgOiAnJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwic2V0dGluZ3NcIj5cblx0XHRcdFx0PGZvcm0gY2xhc3NOYW1lPVwiZm9ybS1ob3Jpem9udGFsXCIgb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cblx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cImdyb3VwLWlkXCI+R3JvdXAgSUQ8L2xhYmVsPlxuXHRcdFx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHQgICAgXHQ8VGV4dElucHV0IGlkPVwiZ3JvdXAtaWRcIiByZWY9XCJncm91cElkXCIgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLmdyb3VwSWR9IC8+XG5cdFx0XHRcdCAgICA8L2Rpdj5cblx0XHRcdFx0ICA8L2Rpdj5cblx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cImdyb3VwLXNlY3JldFwiPkdyb3VwIFNlY3JldDwvbGFiZWw+XG5cdFx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdCAgICBcdDxUZXh0SW5wdXQgaWQ9XCJncm91cC1zZWNyZXRcIiByZWY9XCJncm91cFNlY3JldFwiIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS5ncm91cFNlY3JldH0gLz5cblx0XHRcdFx0ICAgIDwvZGl2PlxuXHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHQgIDxVc2VyU2VsZWN0Q29udGFpbmVyIFxuXHRcdFx0XHQgIFx0cmVmPVwidXNlclNlbGVjdENvbnRhaW5lclwiXG5cdFx0XHRcdCAgICB1c2VySWQ9e3RoaXMuc3RhdGUudXNlcklkfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJidG4tdG9vbGJhclwiPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSBzYXZlLXNldHRpbmdzLWJ0blwiPlNhdmU8L2J1dHRvbj4gXG5cdFx0XHRcdFx0XHQ8TGluayB0bz1cInRyYWNrZXJcIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtIGJhY2stc2V0dGluZ3MtYnRuXCI+QmFjazwvTGluaz5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNldHRpbmdzO1xuIiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBnZXRNaWxlc3RvbmVUYXNrcywgc2V0TWlsZXN0b25lVGFzayB9IGZyb20gJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnO1xuaW1wb3J0IE1pbGVzdG9uZVN0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVTdG9yZSc7XG5pbXBvcnQgTWlsZXN0b25lVGFza1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVUYXNrU3RvcmUnO1xuaW1wb3J0IFNlbGVjdElucHV0IGZyb20gJy4vU2VsZWN0SW5wdXQucmVhY3QnO1xuaW1wb3J0IFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyIGZyb20gJy4vVGFza1R5cGVTZWxlY3RDb250YWluZXIucmVhY3QnO1xuXG5cbnZhciBUYXNrU2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldFRhc2tzU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0YXNrczogTWlsZXN0b25lVGFza1N0b3JlLmdldE1pbGVzdG9uZVRhc2tzKCksXG5cdFx0XHR0YXNrOiBNaWxlc3RvbmVUYXNrU3RvcmUuZ2V0TWlsZXN0b25lVGFzaygpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VGFza3NTdGF0ZSgpO1xuXHR9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFRhc2tzU3RhdGUoKSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdGdldE1pbGVzdG9uZVRhc2tzKE1pbGVzdG9uZVN0b3JlLmdldE1pbGVzdG9uZSgpKTtcbiAgXHRNaWxlc3RvbmVUYXNrU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRNaWxlc3RvbmVUYXNrU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblx0XHRzZXRNaWxlc3RvbmVUYXNrKHRhcmdldC52YWx1ZSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS50YXNrcy5sZW5ndGggPiAxICYmIHRoaXMuc3RhdGUudGFzayAhPSAtMSkge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwibWlsZXN0b25lLXRhc2tcIj5Ub2RvPC9sYWJlbD5cblx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0XHQ8U2VsZWN0SW5wdXQgXG5cdFx0XHRcdFx0XHRcdGlkPVwibWlsZXN0b25lLXRhc2tcIiBcblx0XHRcdFx0XHRcdFx0cmVmPVwibWlsZXN0b25lVGFza1wiIFxuXHRcdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS50YXNrfSBcblx0XHRcdFx0XHRcdFx0b3B0aW9ucz17dGhpcy5zdGF0ZS50YXNrc30gXG5cdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY3VzdG9tLXRhc2tcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0XHQgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cInRhc2stdHlwZVwiPlR5cGU8L2xhYmVsPlxuXHRcdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdCAgXHQ8VGFza1R5cGVTZWxlY3RDb250YWluZXIgLz5cblx0XHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cblx0XHRcdFx0XHQgIFx0PHRleHRhcmVhIGlkPVwidGFzay1kZXNjcmlwdGlvblwiIHJlZj1cInRhc2tEZXNjcmlwdGlvblwiIHBsYWNlaG9sZGVyPVwiVGFzayBkZXNjcmlwdGlvbi4uLlwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHJvd3M9XCIzXCI+PC90ZXh0YXJlYT5cblx0XHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdCk7XG5cdFx0fVxuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVGFza1NlbGVjdENvbnRhaW5lcjtcbiIsIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgYXBpUmVxdWVzdCwgcmVrZXkgfSBmcm9tICcuLi91dGlscy9VdGlscyc7XG5pbXBvcnQgU2VsZWN0SW5wdXQgZnJvbSAnLi9TZWxlY3RJbnB1dC5yZWFjdCc7XG5cblxudmFyIFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRhc2tUeXBlczogW11cblx0XHR9XG5cdH0sXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcblxuXHRcdGFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFRhc2tUeXBlcy5waHAnLFxuXHRcdFx0c3VjY2VzczogKG9wdGlvbnMpID0+IHtcblx0XHRcdFx0dmFyIGRhdGEgPSByZWtleShvcHRpb25zLCB7IGlkOiAndmFsdWUnLCBuYW1lOiAnbGFiZWwnIH0pO1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgdGFza1R5cGVzOiBkYXRhIH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8U2VsZWN0SW5wdXQgaWQ9XCJ0YXNrLXR5cGVcIiByZWY9XCJ0YXNrVHlwZVwiIG9wdGlvbnM9e3RoaXMuc3RhdGUudGFza1R5cGVzfSAvPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUYXNrVHlwZVNlbGVjdENvbnRhaW5lcjtcbiIsIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSb3V0ZXIsIHsgTGluaywgUm91dGVIYW5kbGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyJztcblxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IERpc3BhdGNoZXIgfSBmcm9tICdmbHV4JztcblxuXG52YXIgVGVhbWxlYWRlclRpbWVBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcFwiPlxuXHQgIFx0XHQ8aGVhZGVyPlxuXHQgIFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyZXh0XCI+PC9kaXY+XG5cdCAgXHRcdFx0PExpbmsgdG89XCJzZXR0aW5nc1wiIGNsYXNzTmFtZT1cInNldHRpbmdzLWxpbmtcIiBhY3RpdmVDbGFzc05hbWU9XCJhY3RpdmVcIj5cblx0ICBcdFx0XHRcdDxpIGNsYXNzTmFtZT1cImZhIGZhLWNvZ1wiPjwvaT5cblx0ICBcdFx0XHQ8L0xpbms+XG5cdCAgXHRcdDwvaGVhZGVyPlxuXG4gICAgICAgIHsvKiB0aGlzIGlzIHRoZSBpbXBvcnRhbnQgcGFydCAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICA8Um91dGVIYW5kbGVyLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVGVhbWxlYWRlclRpbWVBcHA7XG4iLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cblxudmFyIFRleHRJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHQvLyBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHQvLyBcdHJldHVybiB7IHZhbHVlOiAnJyB9O1xuXHQvLyB9LFxuXG5cdC8vIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuXHQvLyBcdHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogbmV4dFByb3BzLnNhdmVkVmFsdWUgfSk7XG5cdC8vIH0sXG5cblx0Ly8gaGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHQvLyBcdHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlIH0pO1xuIC8vICB9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0Ly92YXIgdmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8aW5wdXQgXG5cdFx0XHRcdHsuLi50aGlzLnByb3BzfVxuXHRcdFx0XHR0eXBlPVwidGV4dFwiIFxuXHRcdFx0XHRjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBcblx0XHRcdFx0Ly92YWx1ZT17dmFsdWV9XG5cdFx0XHRcdC8vb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSBcblx0XHRcdC8+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRleHRJbnB1dDsiLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBDdXN0b21lclN0b3JlIGZyb20gJy4uL3N0b3Jlcy9DdXN0b21lclN0b3JlJztcbmltcG9ydCBQcm9qZWN0U3RvcmUgZnJvbSAnLi4vc3RvcmVzL1Byb2plY3RTdG9yZSc7XG5pbXBvcnQgTWlsZXN0b25lU3RvcmUgZnJvbSAnLi4vc3RvcmVzL01pbGVzdG9uZVN0b3JlJztcbmltcG9ydCBNaWxlc3RvbmVUYXNrU3RvcmUgZnJvbSAnLi4vc3RvcmVzL01pbGVzdG9uZVRhc2tTdG9yZSc7XG5cbmltcG9ydCBQcm9qZWN0U2VsZWN0Q29udGFpbmVyIGZyb20gJy4vUHJvamVjdFNlbGVjdENvbnRhaW5lci5yZWFjdCc7XG5pbXBvcnQgTWlsZXN0b25lU2VsZWN0Q29udGFpbmVyIGZyb20gJy4vTWlsZXN0b25lU2VsZWN0Q29udGFpbmVyLnJlYWN0JztcbmltcG9ydCBUYXNrU2VsZWN0Q29udGFpbmVyIGZyb20gJy4vVGFza1NlbGVjdENvbnRhaW5lci5yZWFjdCc7XG5cblxudmFyIFRyYWNrZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0VHJhY2tlclN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJvamVjdDogUHJvamVjdFN0b3JlLmdldFByb2plY3QoKSxcblx0XHRcdG1pbGVzdG9uZTogTWlsZXN0b25lU3RvcmUuZ2V0TWlsZXN0b25lKCksXG5cdFx0XHRtaWxlc3RvbmVUYXNrOiBNaWxlc3RvbmVUYXNrU3RvcmUuZ2V0TWlsZXN0b25lVGFzaygpLFxuXHRcdFx0Y29udGFjdE9yQ29tcGFueTogQ3VzdG9tZXJTdG9yZS5nZXRDb250YWN0T3JDb21wYW55KCksXG5cdFx0XHRjb250YWN0T3JDb21wYW55SWQ6IEN1c3RvbWVyU3RvcmUuZ2V0Q29udGFjdE9yQ29tcGFueUlkKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRUcmFja2VyU3RhdGUoKVxuXHR9LFxuXG5cdGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnNvbGUubG9nKHRoaXMuZ2V0VHJhY2tlclN0YXRlKCkpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwidHJhY2tlclwiPlxuXHRcdFx0XHQ8Zm9ybSBjbGFzc05hbWU9XCJmb3JtLWhvcml6b250YWxcIiBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuXG5cdFx0XHRcdFx0PFByb2plY3RTZWxlY3RDb250YWluZXIgLz5cblx0XHRcdFx0XHQ8TWlsZXN0b25lU2VsZWN0Q29udGFpbmVyIC8+XG5cdFx0XHRcdFx0PFRhc2tTZWxlY3RDb250YWluZXIgLz5cblxuXHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLXRvb2xiYXJcIj5cblx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tc20gc3RhcnQtdGltZXItYnRuXCI+XG5cdFx0XHRcdFx0XHRcdFN0YXJ0IHRpbWVyXG5cdFx0XHRcdFx0XHQ8L2J1dHRvbj4gXG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZm9ybT5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUcmFja2VyXG4iLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUm91dGVyLCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInO1xuXG5pbXBvcnQgU2V0dGluZ3NTdG9yZSBmcm9tICcuLi9zdG9yZXMvU2V0dGluZ3NTdG9yZSc7XG5pbXBvcnQgU2V0dGluZ3NVc2Vyc1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9TZXR0aW5nc1VzZXJzU3RvcmUnO1xuaW1wb3J0IHsgZ2V0VXNlcnMgfSBmcm9tICcuLi9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucyc7XG5cbmltcG9ydCBTZWxlY3RJbnB1dCBmcm9tICcuL1NlbGVjdElucHV0LnJlYWN0JztcblxuXG52YXIgVXNlclNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRVc2Vyc1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0J3VzZXJzJzogU2V0dGluZ3NVc2Vyc1N0b3JlLmdldFVzZXJzKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRVc2Vyc1N0YXRlKCk7XG4gIH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0VXNlcnNTdGF0ZSgpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0Z2V0VXNlcnMoKTtcbiAgXHRTZXR0aW5nc1VzZXJzU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRTZXR0aW5nc1VzZXJzU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUudXNlcnMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0XHRyZXR1cm4gKFxuXHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cInVzZXItc2VsZWN0XCI+U2VsZWN0IHVzZXI8L2xhYmVsPlxuXHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0ICAgIFx0PFNlbGVjdElucHV0IFxuXHRcdCAgICBcdFx0aWQ9XCJ1c2VyLXNlbGVjdFwiIFxuXHRcdCAgICBcdFx0cmVmPVwidXNlclNlbGVjdFwiIFxuXHRcdCAgICBcdFx0b3B0aW9ucz17dGhpcy5zdGF0ZS51c2Vyc30gXG5cdFx0ICAgIFx0XHRkZWZhdWx0VmFsdWU9e3RoaXMucHJvcHMudXNlcklkfVxuXHRcdCAgICBcdC8+XG5cdFx0ICAgIDwvZGl2PlxuXHRcdCAgPC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJTZWxlY3RDb250YWluZXI7XG4iLCJcbmltcG9ydCBrZXlNaXJyb3IgZnJvbSAna2V5bWlycm9yJztcblxuZXhwb3J0IGRlZmF1bHQga2V5TWlycm9yKHtcblx0U0FWRV9TRVRUSU5HUzogbnVsbCxcblx0UkVDRUlWRV9VU0VSUzogbnVsbFxufSk7XG4iLCJcbmltcG9ydCBrZXlNaXJyb3IgZnJvbSAna2V5bWlycm9yJztcblxuZXhwb3J0IGRlZmF1bHQga2V5TWlycm9yKHtcblx0UkVDRUlWRV9QUk9KRUNUUzogbnVsbCxcblx0UkVDRUlWRV9NSUxFU1RPTkVTOiBudWxsLFxuXHRSRUNFSVZFX01JTEVTVE9ORV9UQVNLUzogbnVsbCxcblx0U0VUX1BST0pFQ1Q6IG51bGwsXG5cdFNFVF9NSUxFU1RPTkU6IG51bGwsXG5cdFNFVF9NSUxFU1RPTkVfVEFTSzogbnVsbCxcblx0U0VUX0NPTlRBQ1RfT1JfQ09NUEFOWTogbnVsbFxufSk7XG4iLCIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBBcHBEaXNwYXRjaGVyXG4gKlxuICogQSBzaW5nbGV0b24gdGhhdCBvcGVyYXRlcyBhcyB0aGUgY2VudHJhbCBodWIgZm9yIGFwcGxpY2F0aW9uIHVwZGF0ZXMuXG4gKi9cblxuaW1wb3J0IHsgRGlzcGF0Y2hlciB9IGZyb20gJ2ZsdXgnO1xuZXhwb3J0IGRlZmF1bHQgbmV3IERpc3BhdGNoZXIoKTtcbiIsIlxuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBUcmFja2VyQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJztcblxuXG52YXIgX2NvbnRhY3RPckNvbXBhbnk7XG52YXIgX2NvbnRhY3RPckNvbXBhbnlJZDtcblxudmFyIEN1c3RvbWVyU3RvcmUgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0Q29udGFjdE9yQ29tcGFueSgpIHtcblx0XHRyZXR1cm4gX2NvbnRhY3RPckNvbXBhbnk7XG5cdH0sXG5cblx0Z2V0Q29udGFjdE9yQ29tcGFueUlkKCkge1xuXHRcdHJldHVybiBfY29udGFjdE9yQ29tcGFueUlkO1xuXHR9XG59KTtcblxuQ3VzdG9tZXJTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfQ09OVEFDVF9PUl9DT01QQU5ZOlxuXHRcdFx0X2NvbnRhY3RPckNvbXBhbnkgPSBhY3Rpb24ub3B0aW9uO1xuXHRcdFx0X2NvbnRhY3RPckNvbXBhbnlJZCA9IGFjdGlvbi5pZDtcblx0XHRcdEN1c3RvbWVyU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBDdXN0b21lclN0b3JlO1xuIiwiXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSB9IGZyb20gJy4uL3V0aWxzL1N0b3JlVXRpbHMnO1xuXG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFRyYWNrZXJDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnO1xuaW1wb3J0IHsgZ2V0TWlsZXN0b25lVGFza3MgfSBmcm9tICcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJztcbmltcG9ydCBQcm9qZWN0U3RvcmUgZnJvbSAnLi4vc3RvcmVzL1Byb2plY3RTdG9yZSc7XG5cblxudmFyIF9taWxlc3RvbmVzID0gW107XG52YXIgX3NlbGVjdGVkO1xuXG52YXIgTWlsZXN0b25lU3RvcmUgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0TWlsZXN0b25lcygpIHtcblx0XHRyZXR1cm4gX21pbGVzdG9uZXM7XG5cdH0sXG5cblx0Z2V0TWlsZXN0b25lKCkge1xuXHRcdHJldHVybiBfc2VsZWN0ZWQ7XG5cdH1cbn0pO1xuXG5NaWxlc3RvbmVTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfUFJPSkVDVDpcblx0XHRcdEFwcERpc3BhdGNoZXIud2FpdEZvcihbUHJvamVjdFN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcblx0XHRcdF9taWxlc3RvbmVzID0gW107XG5cdFx0XHRfc2VsZWN0ZWQgPSAwO1xuXHRcdFx0TWlsZXN0b25lU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVTOlxuXHRcdFx0X21pbGVzdG9uZXMgPSBhY3Rpb24uZGF0YTtcblx0XHRcdGlmIChfbWlsZXN0b25lcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KF9taWxlc3RvbmVzWzBdLnZhbHVlKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ21pbGVzdG9uZScsIF9zZWxlY3RlZCk7XG5cdFx0XHR9XG5cdFx0XHRNaWxlc3RvbmVTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cblx0XHRcdGdldE1pbGVzdG9uZVRhc2tzKF9zZWxlY3RlZCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FOlxuXHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoYWN0aW9uLmlkKTtcblx0XHRcdGNvbnNvbGUubG9nKCdtaWxlc3RvbmUnLCBfc2VsZWN0ZWQpO1xuXHRcdFx0TWlsZXN0b25lU3RvcmUuZW1pdENoYW5nZSgpO1xuXG5cdFx0XHRnZXRNaWxlc3RvbmVUYXNrcyhfc2VsZWN0ZWQpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBNaWxlc3RvbmVTdG9yZTtcbiIsIlxuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBUcmFja2VyQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJztcbmltcG9ydCBNaWxlc3RvbmVTdG9yZSBmcm9tICcuLi9zdG9yZXMvTWlsZXN0b25lU3RvcmUnO1xuXG5cbnZhciBfdGFza3MgPSBbXTtcbnZhciBfc2VsZWN0ZWQ7XG5cbnZhciBNaWxlc3RvbmVUYXNrU3RvcmUgID0gY3JlYXRlU3RvcmUoe1xuXG5cdGdldE1pbGVzdG9uZVRhc2tzKCkge1xuXHRcdHJldHVybiBfdGFza3M7XG5cdH0sXG5cblx0Z2V0TWlsZXN0b25lVGFzaygpIHtcblx0XHRyZXR1cm4gX3NlbGVjdGVkO1xuXHR9XG59KTtcblxuTWlsZXN0b25lVGFza1N0b3JlLmRpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGFjdGlvbiA9PiB7XG5cblx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9QUk9KRUNUOlxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FOlxuXHRcdFx0QXBwRGlzcGF0Y2hlci53YWl0Rm9yKFtNaWxlc3RvbmVTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG5cdFx0XHRfdGFza3MgPSBbXTtcblx0XHRcdF9zZWxlY3RlZCA9IDA7XG5cdFx0XHRNaWxlc3RvbmVUYXNrU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVfVEFTS1M6XG5cdFx0XHRfdGFza3MgPSBhY3Rpb24uZGF0YTtcblx0XHRcdGlmIChfdGFza3MubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRfc2VsZWN0ZWQgPSBwYXJzZUludChfdGFza3NbMF0udmFsdWUpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygndGFzaycsIF9zZWxlY3RlZCk7XG5cdFx0XHR9XG5cdFx0XHRNaWxlc3RvbmVUYXNrU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX01JTEVTVE9ORV9UQVNLOlxuXHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoYWN0aW9uLmlkKTtcblx0XHRcdGNvbnNvbGUubG9nKCd0YXNrJywgX3NlbGVjdGVkKTtcblx0XHRcdE1pbGVzdG9uZVRhc2tTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvL25vIG9wXG5cdH1cblxufSk7XG5cblxuZXhwb3J0IGRlZmF1bHQgTWlsZXN0b25lVGFza1N0b3JlO1xuIiwiXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSB9IGZyb20gJy4uL3V0aWxzL1N0b3JlVXRpbHMnO1xuXG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFRyYWNrZXJDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnO1xuaW1wb3J0IHsgZ2V0UHJvamVjdERldGFpbHMsIGdldE1pbGVzdG9uZXMgfSBmcm9tICcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJztcblxuXG52YXIgX3Byb2plY3RzID0gW107XG52YXIgX3NlbGVjdGVkO1xuXG52YXIgUHJvamVjdFN0b3JlICA9IGNyZWF0ZVN0b3JlKHtcblxuXHRnZXRQcm9qZWN0cygpIHtcblx0XHRyZXR1cm4gX3Byb2plY3RzO1xuXHR9LFxuXG5cdGdldFByb2plY3QoKSB7XG5cdFx0cmV0dXJuIF9zZWxlY3RlZDtcblx0fVxufSk7XG5cblByb2plY3RTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX1BST0pFQ1RTOlxuXHRcdFx0X3Byb2plY3RzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRQcm9qZWN0U3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX1BST0pFQ1Q6XG5cdFx0XHRfc2VsZWN0ZWQgPSBwYXJzZUludChhY3Rpb24uaWQpO1xuXHRcdFx0Y29uc29sZS5sb2coJ3Byb2plY3QnLCBfc2VsZWN0ZWQpO1xuXHRcdFx0UHJvamVjdFN0b3JlLmVtaXRDaGFuZ2UoKTtcblxuXHRcdFx0Z2V0UHJvamVjdERldGFpbHMoX3NlbGVjdGVkKTtcblx0XHRcdGdldE1pbGVzdG9uZXMoX3NlbGVjdGVkKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8vbm8gb3Bcblx0fVxuXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvamVjdFN0b3JlO1xuIiwiXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBTZXR0aW5nc0NvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvU2V0dGluZ3NDb25zdGFudHMnO1xuXG5cbmZ1bmN0aW9uIF9zZXRTZXR0aW5ncyhkYXRhKSB7XG5cdHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCksIGRhdGEpO1xuXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2V0dGluZ3MnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xufVxuXG52YXIgU2V0dGluZ3NTdG9yZSAgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0U2V0dGluZ3MoKSB7XG5cdFx0cmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpIHx8IHt9O1xuXHR9XG59KTtcblxuXG5TZXR0aW5nc1N0b3JlLmRpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGFjdGlvbiA9PiB7XG5cblx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0Y2FzZSBTZXR0aW5nc0NvbnN0YW50cy5TQVZFX1NFVFRJTkdTOlxuXHRcdFx0X3NldFNldHRpbmdzKGFjdGlvbi5kYXRhKTtcblx0XHRcdFNldHRpbmdzU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTZXR0aW5nc1N0b3JlO1xuIiwiXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSB9IGZyb20gJy4uL3V0aWxzL1N0b3JlVXRpbHMnO1xuXG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFNldHRpbmdzQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cyc7XG5pbXBvcnQgeyBnZXRVc2VycyB9IGZyb20gJy4uL2FjdGlvbnMvU2V0dGluZ3NBY3Rpb25zJztcblxuaW1wb3J0IFNldHRpbmdzU3RvcmUgZnJvbSAnLi9TZXR0aW5nc1N0b3JlJztcblxuXG52YXIgX3VzZXJzID0gW107XG5cbnZhciBTZXR0aW5nc1VzZXJzU3RvcmUgID0gY3JlYXRlU3RvcmUoe1xuXG5cdGdldFVzZXJzKCkge1xuXHRcdHJldHVybiBfdXNlcnM7XG5cdH1cbn0pO1xuXG5TZXR0aW5nc1VzZXJzU3RvcmUuZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoYWN0aW9uID0+IHtcblxuXHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRjYXNlIFNldHRpbmdzQ29uc3RhbnRzLlNBVkVfU0VUVElOR1M6XG5cdFx0XHRBcHBEaXNwYXRjaGVyLndhaXRGb3IoW1NldHRpbmdzU3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuXHRcdFx0Z2V0VXNlcnMoKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBTZXR0aW5nc0NvbnN0YW50cy5SRUNFSVZFX1VTRVJTOlxuXHRcdFx0X3VzZXJzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRTZXR0aW5nc1VzZXJzU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTZXR0aW5nc1VzZXJzU3RvcmU7XG4iLCJcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5pbXBvcnQgeyBlYWNoLCBpc0Z1bmN0aW9uIH0gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG5jb25zdCBDSEFOR0VfRVZFTlQgPSAnY2hhbmdlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN0b3JlKHNwZWMpIHtcbiAgY29uc3QgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoMCk7XG5cbiAgY29uc3Qgc3RvcmUgPSBhc3NpZ24oe1xuICAgIGVtaXRDaGFuZ2UoKSB7XG4gICAgICBlbWl0dGVyLmVtaXQoQ0hBTkdFX0VWRU5UKTtcbiAgICB9LFxuXG4gICAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICAgIGVtaXR0ZXIub24oQ0hBTkdFX0VWRU5ULCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgICBlbWl0dGVyLnJlbW92ZUxpc3RlbmVyKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICAgIH1cbiAgfSwgc3BlYyk7XG5cbiAgLy8gQXV0by1iaW5kIHN0b3JlIG1ldGhvZHMgZm9yIGNvbnZlbmllbmNlXG4gIGVhY2goc3RvcmUsICh2YWwsIGtleSkgPT4ge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgIHN0b3JlW2tleV0gPSBzdG9yZVtrZXldLmJpbmQoc3RvcmUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHN0b3JlO1xufSIsIlxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBTZXR0aW5nc1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9TZXR0aW5nc1N0b3JlJztcblx0XG5leHBvcnQgZnVuY3Rpb24gYXBpUmVxdWVzdChvcHRpb25zKSB7XG5cblx0dmFyIGRlZmF1bHRzID0ge1xuXHRcdHR5cGU6ICdQT1NUJyxcblx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdGRhdGE6IHt9LFxuICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKG9wdGlvbnMudXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcbiAgICB9XG5cdH07XG5cblx0dmFyIGFwcFNldHRpbmdzID0gU2V0dGluZ3NTdG9yZS5nZXRTZXR0aW5ncygpO1xuXHRpZiAoYXBwU2V0dGluZ3MpIHtcblx0XHRkZWZhdWx0cy5kYXRhID0ge1xuXHRcdFx0YXBpX2dyb3VwOiBhcHBTZXR0aW5ncy5ncm91cElkLFxuXHRcdFx0YXBpX3NlY3JldDogYXBwU2V0dGluZ3MuZ3JvdXBTZWNyZXRcblx0XHR9O1xuXHR9XG5cblx0dmFyIHNldHRpbmdzID0gJC5leHRlbmQodHJ1ZSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXHRpZiAoc2V0dGluZ3MuZGF0YS5hcGlfZ3JvdXAgJiYgc2V0dGluZ3MuZGF0YS5hcGlfc2VjcmV0KSB7XG5cdFx0JC5hamF4KCdodHRwczovL3d3dy50ZWFtbGVhZGVyLmJlL2FwaScgKyBvcHRpb25zLnVybCwgc2V0dGluZ3MpO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWtleShhcnIsIGxvb2t1cCkge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBvYmogPSBhcnJbaV07XG5cdFx0Zm9yICh2YXIgZnJvbUtleSBpbiBsb29rdXApIHtcblx0XHRcdHZhciB0b0tleSA9IGxvb2t1cFtmcm9tS2V5XTtcblx0XHRcdHZhciB2YWx1ZSA9IG9ialtmcm9tS2V5XTtcblx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHRvYmpbdG9LZXldID0gdmFsdWU7XG5cdFx0XHRcdGRlbGV0ZSBvYmpbZnJvbUtleV07XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBodG1sRW50aXRpZXMoc3RyaW5nKSB7XG5cdHJldHVybiBzdHJpbmdcblx0XHQucmVwbGFjZSgvJmFtcDsvZywgJyYnKVxuXHRcdC5yZXBsYWNlKC8mIzAzOTsvZywgXCInXCIpO1xufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiXG52YXIgZ3VpID0gbm9kZVJlcXVpcmUoJ253Lmd1aScpO1xudmFyIG1iID0gbmV3IGd1aS5NZW51KHt0eXBlOiAnbWVudWJhcid9KTtcbnRyeSB7XG4gIG1iLmNyZWF0ZU1hY0J1aWx0aW4oJ1RlYW1sZWFkZXIgVGltZScsIHtcbiAgICBoaWRlRWRpdDogZmFsc2UsXG4gIH0pO1xuICBndWkuV2luZG93LmdldCgpLm1lbnUgPSBtYjtcbn0gY2F0Y2goZXgpIHtcbiAgY29uc29sZS5sb2coZXgubWVzc2FnZSk7XG59XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG52YXIgUm91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG52YXIgRGVmYXVsdFJvdXRlID0gUm91dGVyLkRlZmF1bHRSb3V0ZTtcbnZhciBSb3V0ZSA9IFJvdXRlci5Sb3V0ZTtcblxudmFyIFRlYW1sZWFkZXJUaW1lQXBwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1RlYW1sZWFkZXJUaW1lQXBwLnJlYWN0Jyk7XG52YXIgVHJhY2tlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9UcmFja2VyLnJlYWN0Jyk7XG52YXIgU2V0dGluZ3MgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvU2V0dGluZ3MucmVhY3QnKTtcblxudmFyIHJvdXRlcyA9IChcbiAgPFJvdXRlIG5hbWU9XCJhcHBcIiBwYXRoPVwiL1wiIGhhbmRsZXI9e1RlYW1sZWFkZXJUaW1lQXBwfT5cbiAgICA8Um91dGUgbmFtZT1cInNldHRpbmdzXCIgaGFuZGxlcj17U2V0dGluZ3N9Lz5cbiAgICA8RGVmYXVsdFJvdXRlIG5hbWU9XCJ0cmFja2VyXCIgaGFuZGxlcj17VHJhY2tlcn0vPlxuICA8L1JvdXRlPlxuKTtcblxuUm91dGVyLnJ1bihyb3V0ZXMsIGZ1bmN0aW9uIChIYW5kbGVyKSB7XG4gIFJlYWN0LnJlbmRlcig8SGFuZGxlci8+LCBkb2N1bWVudC5ib2R5KTtcbn0pO1xuIl19
