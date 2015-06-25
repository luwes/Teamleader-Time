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
					options.push({ value: 'new', label: 'New task...' });
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL01pbGVzdG9uZVNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvUHJvamVjdFNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvU2VsZWN0SW5wdXQucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1NldHRpbmdzLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UYXNrU2VsZWN0Q29udGFpbmVyLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UYXNrVHlwZVNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVGVhbWxlYWRlclRpbWVBcHAucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1RleHRJbnB1dC5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVHJhY2tlci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVXNlclNlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL0N1c3RvbWVyU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvTWlsZXN0b25lU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvTWlsZXN0b25lVGFza1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1Byb2plY3RTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3N0b3Jlcy9TZXR0aW5nc1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1NldHRpbmdzVXNlcnNTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3V0aWxzL1N0b3JlVXRpbHMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy91dGlscy9VdGlscy5qc3giLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O1FDTWdCLFlBQVksR0FBWixZQUFZO1FBT1osUUFBUSxHQUFSLFFBQVE7Ozs7MEJBWkcsZ0JBQWdCOzt1Q0FDakIsNkJBQTZCOzs7OzBDQUN6QixnQ0FBZ0M7Ozs7QUFHdkQsU0FBUyxZQUFZLENBQUMsSUFBSSxFQUFFO0FBQ2pDLHVDQUFjLFFBQVEsQ0FBQztBQUNyQixRQUFJLEVBQUUsd0NBQWtCLGFBQWE7QUFDckMsUUFB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Q0FBQyxTQUFTLEVBQUUsSUFBRyxDQUFDLENBQUM7Q0FDMUI7OztBQ2hERDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7cUJDalNrQixPQUFPOzs7O0FBWHpCLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNoQyxJQUFJLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztBQUN6QyxJQUFJO0FBQ0YsSUFBRSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFO0FBQ3JDLFlBQVEsRUFBRSxLQUFLLEVBQ2hCLENBQUMsQ0FBQztBQUNILEtBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztDQUM1QixDQUFDLE9BQU0sRUFBRSxFQUFFO0FBQ1YsU0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDekI7O0FBR0QsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3JDLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDdkMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQzs7QUFFekIsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQztBQUN4RSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNwRCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7QUFFdEQsSUFBSSxNQUFNLEdBQ1I7QUFBQyxPQUFLO0lBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsQUFBQztFQUNwRCxpQ0FBQyxLQUFLLElBQUMsSUFBSSxFQUFDLFVBQVUsRUFBQyxPQUFPLEVBQUUsUUFBUSxBQUFDLEdBQUU7RUFDM0MsaUNBQUMsWUFBWSxJQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsT0FBTyxFQUFFLE9BQU8sQUFBQyxHQUFFO0NBQzFDLEFBQ1QsQ0FBQzs7QUFFRixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLE9BQU8sRUFBRTtBQUNwQyxxQkFBTSxNQUFNLENBQUMsaUNBQUMsT0FBTyxPQUFFLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ3pDLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbmltcG9ydCB7IGFwaVJlcXVlc3QgfSBmcm9tICcuLi91dGlscy9VdGlscyc7XG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFNldHRpbmdzQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVTZXR0aW5ncyhkYXRhKSB7XG4gIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgIHR5cGU6IFNldHRpbmdzQ29uc3RhbnRzLlNBVkVfU0VUVElOR1MsXG4gICAgZGF0YTogZGF0YVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVzZXJzKGRhdGEpIHtcblx0YXBpUmVxdWVzdCh7XG5cdFx0dXJsOiAnL2dldFVzZXJzLnBocCcsXG5cdFx0c3VjY2VzczogKG9wdGlvbnMpID0+IHtcblx0XHRcdHZhciBkYXRhID0gcmVrZXkob3B0aW9ucywgeyBpZDogJ3ZhbHVlJywgbmFtZTogJ2xhYmVsJyB9KTtcblx0ICBcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHQgIFx0XHR0eXBlOiBTZXR0aW5nc0NvbnN0YW50cy5SRUNFSVZFX1VTRVJTLFxuXHQgIFx0XHRkYXRhOiBkYXRhXG5cdCAgXHR9KTtcbiAgICB9XG5cdH0pO1xufVxuIiwiXG5pbXBvcnQgeyB3aGVyZSB9IGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IHsgYXBpUmVxdWVzdCwgcmVrZXkgfSBmcm9tICcuLi91dGlscy9VdGlscyc7XG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFRyYWNrZXJDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9qZWN0cygpIHtcblx0YXBpUmVxdWVzdCh7XG5cdFx0dXJsOiAnL2dldFByb2plY3RzLnBocCcsXG5cdFx0ZGF0YToge1xuXHRcdFx0YW1vdW50OiAxMDAsXG5cdFx0XHRwYWdlbm86IDBcblx0XHR9LFxuXHRcdHN1Y2Nlc3M6IChqc29uKSA9PiB7XG5cdFx0XHR2YXIgb3B0aW9ucyA9IHJla2V5KGpzb24sIHsgaWQ6ICd2YWx1ZScsIHRpdGxlOiAnbGFiZWwnIH0pO1xuXHRcdFx0b3B0aW9ucyA9IHdoZXJlKG9wdGlvbnMsIHsgcGhhc2U6ICdhY3RpdmUnIH0pO1xuXG5cdFx0XHRpZiAob3B0aW9ucy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdG9wdGlvbnMudW5zaGlmdCh7IHZhbHVlOiAwLCBsYWJlbDogJ0Nob29zZS4uLicgfSk7XG5cdFx0XHR9XG5cblx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHQgICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfUFJPSkVDVFMsXG5cdCAgICAgIGRhdGE6IG9wdGlvbnNcblx0ICAgIH0pO1xuICAgIH1cblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRQcm9qZWN0KGlkKSB7XG4gIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuU0VUX1BST0pFQ1QsXG4gICAgaWQ6IGlkXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvamVjdERldGFpbHMocHJvamVjdCkge1xuXHRpZiAocHJvamVjdCA+IDApIHtcblx0XHRhcGlSZXF1ZXN0KHtcblx0XHRcdHVybDogJy9nZXRQcm9qZWN0LnBocCcsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHByb2plY3RfaWQ6IHByb2plY3Rcblx0XHRcdH0sXG5cdFx0XHRzdWNjZXNzOiAoZGF0YSkgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhkYXRhKVxuXG5cdFx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdCAgICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuU0VUX0NPTlRBQ1RfT1JfQ09NUEFOWSxcblx0XHQgICAgICBvcHRpb246IGRhdGEuY29udGFjdF9vcl9jb21wYW55LFxuXHRcdCAgICAgIGlkOiBkYXRhLmNvbnRhY3Rfb3JfY29tcGFueV9pZFxuXHRcdCAgICB9KTtcbiAgICAgIH1cblx0XHR9KTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWlsZXN0b25lcyhwcm9qZWN0KSB7XG5cdGlmIChwcm9qZWN0ID4gMCkge1xuXHRcdGFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldE1pbGVzdG9uZXNCeVByb2plY3QucGhwJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cHJvamVjdF9pZDogcHJvamVjdFxuXHRcdFx0fSxcblx0XHRcdHN1Y2Nlc3M6IChqc29uKSA9PiB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gcmVrZXkoanNvbiwgeyBpZDogJ3ZhbHVlJywgdGl0bGU6ICdsYWJlbCcgfSk7XG5cdFx0XHRcdG9wdGlvbnMgPSB3aGVyZShvcHRpb25zLCB7IGNsb3NlZDogMCB9KTtcblxuXHRcdCAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHQgICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfTUlMRVNUT05FUyxcblx0XHQgICAgICBkYXRhOiBvcHRpb25zXG5cdFx0ICAgIH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRNaWxlc3RvbmUoaWQpIHtcbiAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FLFxuICAgIGlkOiBpZFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1pbGVzdG9uZVRhc2tzKG1pbGVzdG9uZSkge1xuXG5cdGlmIChtaWxlc3RvbmUgPiAwKSB7XG5cblx0XHRhcGlSZXF1ZXN0KHtcblx0XHRcdHVybDogJy9nZXRUYXNrc0J5TWlsZXN0b25lLnBocCcsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG1pbGVzdG9uZV9pZDogbWlsZXN0b25lXG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogKGpzb24pID0+IHtcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSByZWtleShqc29uLCB7IGlkOiAndmFsdWUnLCBkZXNjcmlwdGlvbjogJ2xhYmVsJyB9KTtcblx0XHRcdFx0b3B0aW9ucyA9IHdoZXJlKG9wdGlvbnMsIHsgZG9uZTogMCB9KTtcblxuXHRcdFx0XHR2YXIgYXBwU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXR0aW5ncycpKTtcblx0XHRcdFx0aWYgKGFwcFNldHRpbmdzICYmIGFwcFNldHRpbmdzLnVzZXJOYW1lKSB7XG5cdFx0XHRcdFx0b3B0aW9ucyA9IHdoZXJlKG9wdGlvbnMsIHsgb3duZXJfbmFtZTogYXBwU2V0dGluZ3MudXNlck5hbWUgfSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAob3B0aW9ucy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy5wdXNoKHsgdmFsdWU6ICduZXcnLCBsYWJlbDogJ05ldyB0YXNrLi4uJyB9KTtcblx0XHRcdFx0fVxuXG5cdFx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdCAgICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVfVEFTS1MsXG5cdFx0ICAgICAgZGF0YTogb3B0aW9uc1xuXHRcdCAgICB9KTtcbiAgICAgIH1cblx0XHR9KTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0TWlsZXN0b25lVGFzayhpZCkge1xuICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlNFVF9NSUxFU1RPTkVfVEFTSyxcbiAgICBpZDogaWRcbiAgfSk7XG59XG5cblxuIiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBnZXRNaWxlc3RvbmVzLCBzZXRNaWxlc3RvbmUgfSBmcm9tICcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJztcbmltcG9ydCBQcm9qZWN0U3RvcmUgZnJvbSAnLi4vc3RvcmVzL1Byb2plY3RTdG9yZSc7XG5pbXBvcnQgTWlsZXN0b25lU3RvcmUgZnJvbSAnLi4vc3RvcmVzL01pbGVzdG9uZVN0b3JlJztcbmltcG9ydCBTZWxlY3RJbnB1dCBmcm9tICcuL1NlbGVjdElucHV0LnJlYWN0JztcblxuXG52YXIgTWlsZXN0b25lU2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldE1pbGVzdG9uZXNTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG1pbGVzdG9uZXM6IE1pbGVzdG9uZVN0b3JlLmdldE1pbGVzdG9uZXMoKSxcblx0XHRcdG1pbGVzdG9uZTogTWlsZXN0b25lU3RvcmUuZ2V0TWlsZXN0b25lKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRNaWxlc3RvbmVzU3RhdGUoKTtcblx0fSxcblxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRNaWxlc3RvbmVzU3RhdGUoKSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdGdldE1pbGVzdG9uZXMoUHJvamVjdFN0b3JlLmdldFByb2plY3QoKSk7XG4gIFx0TWlsZXN0b25lU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRNaWxlc3RvbmVTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdHNldE1pbGVzdG9uZSh0YXJnZXQudmFsdWUpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUubWlsZXN0b25lcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXHRcdHJldHVybiAoXG5cdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwibWlsZXN0b25lXCI+TWlsZXN0b25lPC9sYWJlbD5cblx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdDxTZWxlY3RJbnB1dCBcblx0XHRcdFx0XHRcdGlkPVwibWlsZXN0b25lXCIgXG5cdFx0XHRcdFx0XHRyZWY9XCJtaWxlc3RvbmVcIiBcblx0XHRcdFx0XHRcdHZhbHVlPXt0aGlzLnN0YXRlLm1pbGVzdG9uZX1cblx0XHRcdFx0XHRcdG9wdGlvbnM9e3RoaXMuc3RhdGUubWlsZXN0b25lc30gXG5cdFx0XHRcdFx0XHRvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IFxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IE1pbGVzdG9uZVNlbGVjdENvbnRhaW5lcjsiLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IGdldFByb2plY3RzLCBzZXRQcm9qZWN0IH0gZnJvbSAnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucyc7XG5pbXBvcnQgUHJvamVjdFN0b3JlIGZyb20gJy4uL3N0b3Jlcy9Qcm9qZWN0U3RvcmUnO1xuaW1wb3J0IFNlbGVjdElucHV0IGZyb20gJy4vU2VsZWN0SW5wdXQucmVhY3QnO1xuXG5cbnZhciBQcm9qZWN0U2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldFByb2plY3RzU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRwcm9qZWN0czogUHJvamVjdFN0b3JlLmdldFByb2plY3RzKCksXG5cdFx0XHRwcm9qZWN0OiBQcm9qZWN0U3RvcmUuZ2V0UHJvamVjdCgpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UHJvamVjdHNTdGF0ZSgpO1xuXHR9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFByb2plY3RzU3RhdGUoKSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdGdldFByb2plY3RzKCk7XG4gIFx0UHJvamVjdFN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0UHJvamVjdFN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cdFx0c2V0UHJvamVjdCh0YXJnZXQudmFsdWUpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJwcm9qZWN0XCI+UHJvamVjdDwvbGFiZWw+XG5cdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0XHQ8U2VsZWN0SW5wdXQgXG5cdFx0XHRcdFx0XHRpZD1cInByb2plY3RcIiBcblx0XHRcdFx0XHRcdHJlZj1cInByb2plY3RcIiBcblx0XHRcdFx0XHRcdHZhbHVlPXt0aGlzLnN0YXRlLnByb2plY3R9XG5cdFx0XHRcdFx0XHRvcHRpb25zPXt0aGlzLnN0YXRlLnByb2plY3RzfSBcblx0XHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHRcdFx0Lz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvamVjdFNlbGVjdENvbnRhaW5lcjtcbiIsIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGh0bWxFbnRpdGllcyB9IGZyb20gJy4uL3V0aWxzL1V0aWxzJztcblxuXG52YXIgU2VsZWN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblxuICBcdHZhciBvcHRpb25Ob2RlcyA9IHRoaXMucHJvcHMub3B0aW9ucy5tYXAoZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgXHQ8b3B0aW9uIGtleT17b3B0aW9uLnZhbHVlfSB2YWx1ZT17b3B0aW9uLnZhbHVlfT57aHRtbEVudGl0aWVzKG9wdGlvbi5sYWJlbCl9PC9vcHRpb24+XG4gICAgICApO1xuICBcdH0pO1xuXG5cdFx0cmV0dXJuIChcblx0ICBcdDxzZWxlY3QgXG5cdCAgXHRcdHsuLi50aGlzLnByb3BzfSBcblx0ICBcdFx0Y2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgXG5cdFx0XHQ+XG5cdCAgXHRcdHtvcHRpb25Ob2Rlc31cblx0ICBcdDwvc2VsZWN0PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTZWxlY3RJbnB1dDsiLCJcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJvdXRlciwgeyBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJztcblxuaW1wb3J0IFNldHRpbmdzU3RvcmUgZnJvbSAnLi4vc3RvcmVzL1NldHRpbmdzU3RvcmUnO1xuaW1wb3J0IFNldHRpbmdzVXNlcnNTdG9yZSBmcm9tICcuLi9zdG9yZXMvU2V0dGluZ3NVc2Vyc1N0b3JlJztcbmltcG9ydCB7IHNhdmVTZXR0aW5ncyB9IGZyb20gJy4uL2FjdGlvbnMvU2V0dGluZ3NBY3Rpb25zJztcbmltcG9ydCBUZXh0SW5wdXQgZnJvbSAnLi9UZXh0SW5wdXQucmVhY3QnO1xuaW1wb3J0IFNlbGVjdElucHV0IGZyb20gJy4vU2VsZWN0SW5wdXQucmVhY3QnO1xuaW1wb3J0IFVzZXJTZWxlY3RDb250YWluZXIgZnJvbSAnLi9Vc2VyU2VsZWN0Q29udGFpbmVyLnJlYWN0JztcblxuXG52YXIgU2V0dGluZ3MgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gU2V0dGluZ3NTdG9yZS5nZXRTZXR0aW5ncygpO1xuICB9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZShTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRTZXR0aW5nc1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0U2V0dGluZ3NTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0aGFuZGxlU3VibWl0OiBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIGdyb3VwSWQgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuZ3JvdXBJZCkudmFsdWUudHJpbSgpO1xuXHRcdHZhciBncm91cFNlY3JldCA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5ncm91cFNlY3JldCkudmFsdWUudHJpbSgpO1xuXHRcdGlmICghZ3JvdXBTZWNyZXQgfHwgIWdyb3VwSWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgY29udGFpbmVyID0gdGhpcy5yZWZzLnVzZXJTZWxlY3RDb250YWluZXI7XG5cdFx0dmFyIHNlbGVjdCA9IGNvbnRhaW5lci5yZWZzLnVzZXJTZWxlY3Q7XG5cdFx0dmFyIHNlbGVjdE5vZGUgPSBSZWFjdC5maW5kRE9NTm9kZShzZWxlY3QpO1xuXG5cdFx0c2F2ZVNldHRpbmdzKHtcblx0XHRcdGdyb3VwSWQ6IGdyb3VwSWQsXG5cdFx0XHRncm91cFNlY3JldDogZ3JvdXBTZWNyZXQsXG5cdFx0XHR1c2VySWQ6IHNlbGVjdCA/IHNlbGVjdE5vZGUudmFsdWUgOiAwLFxuXHRcdFx0dXNlck5hbWU6IHNlbGVjdCA/ICQoc2VsZWN0Tm9kZSkuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudGV4dCgpIDogJydcblx0XHR9KTtcblxuXHRcdHJldHVybjtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInNldHRpbmdzXCI+XG5cdFx0XHRcdDxmb3JtIGNsYXNzTmFtZT1cImZvcm0taG9yaXpvbnRhbFwiIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG5cdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJncm91cC1pZFwiPkdyb3VwIElEPC9sYWJlbD5cblx0XHRcdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0ICAgIFx0PFRleHRJbnB1dCBpZD1cImdyb3VwLWlkXCIgcmVmPVwiZ3JvdXBJZFwiIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS5ncm91cElkfSAvPlxuXHRcdFx0XHQgICAgPC9kaXY+XG5cdFx0XHRcdCAgPC9kaXY+XG5cdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJncm91cC1zZWNyZXRcIj5Hcm91cCBTZWNyZXQ8L2xhYmVsPlxuXHRcdFx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHQgICAgXHQ8VGV4dElucHV0IGlkPVwiZ3JvdXAtc2VjcmV0XCIgcmVmPVwiZ3JvdXBTZWNyZXRcIiBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUuZ3JvdXBTZWNyZXR9IC8+XG5cdFx0XHRcdCAgICA8L2Rpdj5cblx0XHRcdFx0ICA8L2Rpdj5cblx0XHRcdFx0ICA8VXNlclNlbGVjdENvbnRhaW5lciBcblx0XHRcdFx0ICBcdHJlZj1cInVzZXJTZWxlY3RDb250YWluZXJcIlxuXHRcdFx0XHQgICAgdXNlcklkPXt0aGlzLnN0YXRlLnVzZXJJZH1cblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLXRvb2xiYXJcIj5cblx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tc20gc2F2ZS1zZXR0aW5ncy1idG5cIj5TYXZlPC9idXR0b24+IFxuXHRcdFx0XHRcdFx0PExpbmsgdG89XCJ0cmFja2VyXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbSBiYWNrLXNldHRpbmdzLWJ0blwiPkJhY2s8L0xpbms+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZm9ybT5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTZXR0aW5ncztcbiIsIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgZ2V0TWlsZXN0b25lVGFza3MsIHNldE1pbGVzdG9uZVRhc2sgfSBmcm9tICcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJztcbmltcG9ydCBNaWxlc3RvbmVTdG9yZSBmcm9tICcuLi9zdG9yZXMvTWlsZXN0b25lU3RvcmUnO1xuaW1wb3J0IE1pbGVzdG9uZVRhc2tTdG9yZSBmcm9tICcuLi9zdG9yZXMvTWlsZXN0b25lVGFza1N0b3JlJztcbmltcG9ydCBTZWxlY3RJbnB1dCBmcm9tICcuL1NlbGVjdElucHV0LnJlYWN0JztcbmltcG9ydCBUYXNrVHlwZVNlbGVjdENvbnRhaW5lciBmcm9tICcuL1Rhc2tUeXBlU2VsZWN0Q29udGFpbmVyLnJlYWN0JztcblxuXG52YXIgVGFza1NlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRUYXNrc1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGFza3M6IE1pbGVzdG9uZVRhc2tTdG9yZS5nZXRNaWxlc3RvbmVUYXNrcygpLFxuXHRcdFx0dGFzazogTWlsZXN0b25lVGFza1N0b3JlLmdldE1pbGVzdG9uZVRhc2soKVxuXHRcdH1cblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFRhc2tzU3RhdGUoKTtcblx0fSxcblxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRUYXNrc1N0YXRlKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRnZXRNaWxlc3RvbmVUYXNrcyhNaWxlc3RvbmVTdG9yZS5nZXRNaWxlc3RvbmUoKSk7XG4gIFx0TWlsZXN0b25lVGFza1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0TWlsZXN0b25lVGFza1N0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cdFx0c2V0TWlsZXN0b25lVGFzayh0YXJnZXQudmFsdWUpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUudGFza3MubGVuZ3RoID4gMSkge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwibWlsZXN0b25lLXRhc2tcIj5Ub2RvPC9sYWJlbD5cblx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0XHQ8U2VsZWN0SW5wdXQgXG5cdFx0XHRcdFx0XHRcdGlkPVwibWlsZXN0b25lLXRhc2tcIiBcblx0XHRcdFx0XHRcdFx0cmVmPVwibWlsZXN0b25lVGFza1wiIFxuXHRcdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS50YXNrfSBcblx0XHRcdFx0XHRcdFx0b3B0aW9ucz17dGhpcy5zdGF0ZS50YXNrc30gXG5cdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY3VzdG9tLXRhc2tcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0XHQgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cInRhc2stdHlwZVwiPlR5cGU8L2xhYmVsPlxuXHRcdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdCAgXHQ8VGFza1R5cGVTZWxlY3RDb250YWluZXIgLz5cblx0XHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cblx0XHRcdFx0XHQgIFx0PHRleHRhcmVhIGlkPVwidGFzay1kZXNjcmlwdGlvblwiIHJlZj1cInRhc2tEZXNjcmlwdGlvblwiIHBsYWNlaG9sZGVyPVwiVGFzayBkZXNjcmlwdGlvbi4uLlwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHJvd3M9XCIzXCI+PC90ZXh0YXJlYT5cblx0XHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdCk7XG5cdFx0fVxuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVGFza1NlbGVjdENvbnRhaW5lcjtcbiIsIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgYXBpUmVxdWVzdCwgcmVrZXkgfSBmcm9tICcuLi91dGlscy9VdGlscyc7XG5pbXBvcnQgU2VsZWN0SW5wdXQgZnJvbSAnLi9TZWxlY3RJbnB1dC5yZWFjdCc7XG5cblxudmFyIFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRhc2tUeXBlczogW11cblx0XHR9XG5cdH0sXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcblxuXHRcdGFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFRhc2tUeXBlcy5waHAnLFxuXHRcdFx0c3VjY2VzczogKG9wdGlvbnMpID0+IHtcblx0XHRcdFx0dmFyIGRhdGEgPSByZWtleShvcHRpb25zLCB7IGlkOiAndmFsdWUnLCBuYW1lOiAnbGFiZWwnIH0pO1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgdGFza1R5cGVzOiBkYXRhIH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8U2VsZWN0SW5wdXQgaWQ9XCJ0YXNrLXR5cGVcIiByZWY9XCJ0YXNrVHlwZVwiIG9wdGlvbnM9e3RoaXMuc3RhdGUudGFza1R5cGVzfSAvPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUYXNrVHlwZVNlbGVjdENvbnRhaW5lcjtcbiIsIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSb3V0ZXIsIHsgTGluaywgUm91dGVIYW5kbGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyJztcblxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IERpc3BhdGNoZXIgfSBmcm9tICdmbHV4JztcblxuXG52YXIgVGVhbWxlYWRlclRpbWVBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcFwiPlxuXHQgIFx0XHQ8aGVhZGVyPlxuXHQgIFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyZXh0XCI+PC9kaXY+XG5cdCAgXHRcdFx0PExpbmsgdG89XCJzZXR0aW5nc1wiIGNsYXNzTmFtZT1cInNldHRpbmdzLWxpbmtcIiBhY3RpdmVDbGFzc05hbWU9XCJhY3RpdmVcIj5cblx0ICBcdFx0XHRcdDxpIGNsYXNzTmFtZT1cImZhIGZhLWNvZ1wiPjwvaT5cblx0ICBcdFx0XHQ8L0xpbms+XG5cdCAgXHRcdDwvaGVhZGVyPlxuXG4gICAgICAgIHsvKiB0aGlzIGlzIHRoZSBpbXBvcnRhbnQgcGFydCAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICA8Um91dGVIYW5kbGVyLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVGVhbWxlYWRlclRpbWVBcHA7XG4iLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cblxudmFyIFRleHRJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHQvLyBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHQvLyBcdHJldHVybiB7IHZhbHVlOiAnJyB9O1xuXHQvLyB9LFxuXG5cdC8vIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuXHQvLyBcdHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogbmV4dFByb3BzLnNhdmVkVmFsdWUgfSk7XG5cdC8vIH0sXG5cblx0Ly8gaGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHQvLyBcdHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlIH0pO1xuIC8vICB9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0Ly92YXIgdmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8aW5wdXQgXG5cdFx0XHRcdHsuLi50aGlzLnByb3BzfVxuXHRcdFx0XHR0eXBlPVwidGV4dFwiIFxuXHRcdFx0XHRjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBcblx0XHRcdFx0Ly92YWx1ZT17dmFsdWV9XG5cdFx0XHRcdC8vb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSBcblx0XHRcdC8+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRleHRJbnB1dDsiLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBDdXN0b21lclN0b3JlIGZyb20gJy4uL3N0b3Jlcy9DdXN0b21lclN0b3JlJztcbmltcG9ydCBQcm9qZWN0U3RvcmUgZnJvbSAnLi4vc3RvcmVzL1Byb2plY3RTdG9yZSc7XG5pbXBvcnQgTWlsZXN0b25lU3RvcmUgZnJvbSAnLi4vc3RvcmVzL01pbGVzdG9uZVN0b3JlJztcbmltcG9ydCBNaWxlc3RvbmVUYXNrU3RvcmUgZnJvbSAnLi4vc3RvcmVzL01pbGVzdG9uZVRhc2tTdG9yZSc7XG5cbmltcG9ydCBQcm9qZWN0U2VsZWN0Q29udGFpbmVyIGZyb20gJy4vUHJvamVjdFNlbGVjdENvbnRhaW5lci5yZWFjdCc7XG5pbXBvcnQgTWlsZXN0b25lU2VsZWN0Q29udGFpbmVyIGZyb20gJy4vTWlsZXN0b25lU2VsZWN0Q29udGFpbmVyLnJlYWN0JztcbmltcG9ydCBUYXNrU2VsZWN0Q29udGFpbmVyIGZyb20gJy4vVGFza1NlbGVjdENvbnRhaW5lci5yZWFjdCc7XG5cblxudmFyIFRyYWNrZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0VHJhY2tlclN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJvamVjdDogUHJvamVjdFN0b3JlLmdldFByb2plY3QoKSxcblx0XHRcdG1pbGVzdG9uZTogTWlsZXN0b25lU3RvcmUuZ2V0TWlsZXN0b25lKCksXG5cdFx0XHRtaWxlc3RvbmVUYXNrOiBNaWxlc3RvbmVUYXNrU3RvcmUuZ2V0TWlsZXN0b25lVGFzaygpLFxuXHRcdFx0Y29udGFjdE9yQ29tcGFueTogQ3VzdG9tZXJTdG9yZS5nZXRDb250YWN0T3JDb21wYW55KCksXG5cdFx0XHRjb250YWN0T3JDb21wYW55SWQ6IEN1c3RvbWVyU3RvcmUuZ2V0Q29udGFjdE9yQ29tcGFueUlkKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRUcmFja2VyU3RhdGUoKVxuXHR9LFxuXG5cdGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnNvbGUubG9nKHRoaXMuZ2V0VHJhY2tlclN0YXRlKCkpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwidHJhY2tlclwiPlxuXHRcdFx0XHQ8Zm9ybSBjbGFzc05hbWU9XCJmb3JtLWhvcml6b250YWxcIiBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuXG5cdFx0XHRcdFx0PFByb2plY3RTZWxlY3RDb250YWluZXIgLz5cblx0XHRcdFx0XHQ8TWlsZXN0b25lU2VsZWN0Q29udGFpbmVyIC8+XG5cdFx0XHRcdFx0PFRhc2tTZWxlY3RDb250YWluZXIgLz5cblxuXHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLXRvb2xiYXJcIj5cblx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tc20gc3RhcnQtdGltZXItYnRuXCI+XG5cdFx0XHRcdFx0XHRcdFN0YXJ0IHRpbWVyXG5cdFx0XHRcdFx0XHQ8L2J1dHRvbj4gXG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZm9ybT5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUcmFja2VyXG4iLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUm91dGVyLCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInO1xuXG5pbXBvcnQgU2V0dGluZ3NTdG9yZSBmcm9tICcuLi9zdG9yZXMvU2V0dGluZ3NTdG9yZSc7XG5pbXBvcnQgU2V0dGluZ3NVc2Vyc1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9TZXR0aW5nc1VzZXJzU3RvcmUnO1xuaW1wb3J0IHsgZ2V0VXNlcnMgfSBmcm9tICcuLi9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucyc7XG5cbmltcG9ydCBTZWxlY3RJbnB1dCBmcm9tICcuL1NlbGVjdElucHV0LnJlYWN0JztcblxuXG52YXIgVXNlclNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRVc2Vyc1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0J3VzZXJzJzogU2V0dGluZ3NVc2Vyc1N0b3JlLmdldFVzZXJzKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRVc2Vyc1N0YXRlKCk7XG4gIH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0VXNlcnNTdGF0ZSgpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0Z2V0VXNlcnMoKTtcbiAgXHRTZXR0aW5nc1VzZXJzU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRTZXR0aW5nc1VzZXJzU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUudXNlcnMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0XHRyZXR1cm4gKFxuXHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cInVzZXItc2VsZWN0XCI+U2VsZWN0IHVzZXI8L2xhYmVsPlxuXHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0ICAgIFx0PFNlbGVjdElucHV0IFxuXHRcdCAgICBcdFx0aWQ9XCJ1c2VyLXNlbGVjdFwiIFxuXHRcdCAgICBcdFx0cmVmPVwidXNlclNlbGVjdFwiIFxuXHRcdCAgICBcdFx0b3B0aW9ucz17dGhpcy5zdGF0ZS51c2Vyc30gXG5cdFx0ICAgIFx0XHRkZWZhdWx0VmFsdWU9e3RoaXMucHJvcHMudXNlcklkfVxuXHRcdCAgICBcdC8+XG5cdFx0ICAgIDwvZGl2PlxuXHRcdCAgPC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJTZWxlY3RDb250YWluZXI7XG4iLCJcbmltcG9ydCBrZXlNaXJyb3IgZnJvbSAna2V5bWlycm9yJztcblxuZXhwb3J0IGRlZmF1bHQga2V5TWlycm9yKHtcblx0U0FWRV9TRVRUSU5HUzogbnVsbCxcblx0UkVDRUlWRV9VU0VSUzogbnVsbFxufSk7XG4iLCJcbmltcG9ydCBrZXlNaXJyb3IgZnJvbSAna2V5bWlycm9yJztcblxuZXhwb3J0IGRlZmF1bHQga2V5TWlycm9yKHtcblx0UkVDRUlWRV9QUk9KRUNUUzogbnVsbCxcblx0UkVDRUlWRV9NSUxFU1RPTkVTOiBudWxsLFxuXHRSRUNFSVZFX01JTEVTVE9ORV9UQVNLUzogbnVsbCxcblx0U0VUX1BST0pFQ1Q6IG51bGwsXG5cdFNFVF9NSUxFU1RPTkU6IG51bGwsXG5cdFNFVF9NSUxFU1RPTkVfVEFTSzogbnVsbCxcblx0U0VUX0NPTlRBQ1RfT1JfQ09NUEFOWTogbnVsbFxufSk7XG4iLCIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBBcHBEaXNwYXRjaGVyXG4gKlxuICogQSBzaW5nbGV0b24gdGhhdCBvcGVyYXRlcyBhcyB0aGUgY2VudHJhbCBodWIgZm9yIGFwcGxpY2F0aW9uIHVwZGF0ZXMuXG4gKi9cblxuaW1wb3J0IHsgRGlzcGF0Y2hlciB9IGZyb20gJ2ZsdXgnO1xuZXhwb3J0IGRlZmF1bHQgbmV3IERpc3BhdGNoZXIoKTtcbiIsIlxuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBUcmFja2VyQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJztcblxuXG52YXIgX2NvbnRhY3RPckNvbXBhbnk7XG52YXIgX2NvbnRhY3RPckNvbXBhbnlJZDtcblxudmFyIEN1c3RvbWVyU3RvcmUgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0Q29udGFjdE9yQ29tcGFueSgpIHtcblx0XHRyZXR1cm4gX2NvbnRhY3RPckNvbXBhbnk7XG5cdH0sXG5cblx0Z2V0Q29udGFjdE9yQ29tcGFueUlkKCkge1xuXHRcdHJldHVybiBfY29udGFjdE9yQ29tcGFueUlkO1xuXHR9XG59KTtcblxuQ3VzdG9tZXJTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfQ09OVEFDVF9PUl9DT01QQU5ZOlxuXHRcdFx0X2NvbnRhY3RPckNvbXBhbnkgPSBhY3Rpb24ub3B0aW9uO1xuXHRcdFx0X2NvbnRhY3RPckNvbXBhbnlJZCA9IGFjdGlvbi5pZDtcblx0XHRcdEN1c3RvbWVyU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBDdXN0b21lclN0b3JlO1xuIiwiXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSB9IGZyb20gJy4uL3V0aWxzL1N0b3JlVXRpbHMnO1xuXG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFRyYWNrZXJDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnO1xuaW1wb3J0IHsgZ2V0TWlsZXN0b25lVGFza3MgfSBmcm9tICcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJztcbmltcG9ydCBQcm9qZWN0U3RvcmUgZnJvbSAnLi4vc3RvcmVzL1Byb2plY3RTdG9yZSc7XG5cblxudmFyIF9taWxlc3RvbmVzID0gW107XG52YXIgX3NlbGVjdGVkO1xuXG52YXIgTWlsZXN0b25lU3RvcmUgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0TWlsZXN0b25lcygpIHtcblx0XHRyZXR1cm4gX21pbGVzdG9uZXM7XG5cdH0sXG5cblx0Z2V0TWlsZXN0b25lKCkge1xuXHRcdHJldHVybiBfc2VsZWN0ZWQ7XG5cdH1cbn0pO1xuXG5NaWxlc3RvbmVTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfUFJPSkVDVDpcblx0XHRcdEFwcERpc3BhdGNoZXIud2FpdEZvcihbUHJvamVjdFN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcblx0XHRcdF9taWxlc3RvbmVzID0gW107XG5cdFx0XHRfc2VsZWN0ZWQgPSAwO1xuXHRcdFx0TWlsZXN0b25lU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVTOlxuXHRcdFx0X21pbGVzdG9uZXMgPSBhY3Rpb24uZGF0YTtcblx0XHRcdGlmIChfbWlsZXN0b25lcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KF9taWxlc3RvbmVzWzBdLnZhbHVlKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ21pbGVzdG9uZScsIF9zZWxlY3RlZCk7XG5cdFx0XHR9XG5cdFx0XHRNaWxlc3RvbmVTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cblx0XHRcdGdldE1pbGVzdG9uZVRhc2tzKF9zZWxlY3RlZCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FOlxuXHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoYWN0aW9uLmlkKTtcblx0XHRcdGNvbnNvbGUubG9nKCdtaWxlc3RvbmUnLCBfc2VsZWN0ZWQpO1xuXHRcdFx0TWlsZXN0b25lU3RvcmUuZW1pdENoYW5nZSgpO1xuXG5cdFx0XHRnZXRNaWxlc3RvbmVUYXNrcyhfc2VsZWN0ZWQpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBNaWxlc3RvbmVTdG9yZTtcbiIsIlxuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBUcmFja2VyQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJztcbmltcG9ydCBNaWxlc3RvbmVTdG9yZSBmcm9tICcuLi9zdG9yZXMvTWlsZXN0b25lU3RvcmUnO1xuXG5cbnZhciBfdGFza3MgPSBbXTtcbnZhciBfc2VsZWN0ZWQ7XG5cbnZhciBNaWxlc3RvbmVUYXNrU3RvcmUgID0gY3JlYXRlU3RvcmUoe1xuXG5cdGdldE1pbGVzdG9uZVRhc2tzKCkge1xuXHRcdHJldHVybiBfdGFza3M7XG5cdH0sXG5cblx0Z2V0TWlsZXN0b25lVGFzaygpIHtcblx0XHRyZXR1cm4gX3NlbGVjdGVkO1xuXHR9XG59KTtcblxuTWlsZXN0b25lVGFza1N0b3JlLmRpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGFjdGlvbiA9PiB7XG5cblx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9QUk9KRUNUOlxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FOlxuXHRcdFx0QXBwRGlzcGF0Y2hlci53YWl0Rm9yKFtNaWxlc3RvbmVTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG5cdFx0XHRfdGFza3MgPSBbXTtcblx0XHRcdF9zZWxlY3RlZCA9IDA7XG5cdFx0XHRNaWxlc3RvbmVUYXNrU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVfVEFTS1M6XG5cdFx0XHRfdGFza3MgPSBhY3Rpb24uZGF0YTtcblx0XHRcdGlmIChfdGFza3MubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRfc2VsZWN0ZWQgPSBwYXJzZUludChfdGFza3NbMF0udmFsdWUpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygndGFzaycsIF9zZWxlY3RlZCk7XG5cdFx0XHR9XG5cdFx0XHRNaWxlc3RvbmVUYXNrU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX01JTEVTVE9ORV9UQVNLOlxuXHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoYWN0aW9uLmlkKTtcblx0XHRcdGNvbnNvbGUubG9nKCd0YXNrJywgX3NlbGVjdGVkKTtcblx0XHRcdE1pbGVzdG9uZVRhc2tTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvL25vIG9wXG5cdH1cblxufSk7XG5cblxuZXhwb3J0IGRlZmF1bHQgTWlsZXN0b25lVGFza1N0b3JlO1xuIiwiXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSB9IGZyb20gJy4uL3V0aWxzL1N0b3JlVXRpbHMnO1xuXG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFRyYWNrZXJDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnO1xuaW1wb3J0IHsgZ2V0UHJvamVjdERldGFpbHMsIGdldE1pbGVzdG9uZXMgfSBmcm9tICcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJztcblxuXG52YXIgX3Byb2plY3RzID0gW107XG52YXIgX3NlbGVjdGVkO1xuXG52YXIgUHJvamVjdFN0b3JlICA9IGNyZWF0ZVN0b3JlKHtcblxuXHRnZXRQcm9qZWN0cygpIHtcblx0XHRyZXR1cm4gX3Byb2plY3RzO1xuXHR9LFxuXG5cdGdldFByb2plY3QoKSB7XG5cdFx0cmV0dXJuIF9zZWxlY3RlZDtcblx0fVxufSk7XG5cblByb2plY3RTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX1BST0pFQ1RTOlxuXHRcdFx0X3Byb2plY3RzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRQcm9qZWN0U3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX1BST0pFQ1Q6XG5cdFx0XHRfc2VsZWN0ZWQgPSBwYXJzZUludChhY3Rpb24uaWQpO1xuXHRcdFx0Y29uc29sZS5sb2coJ3Byb2plY3QnLCBfc2VsZWN0ZWQpO1xuXHRcdFx0UHJvamVjdFN0b3JlLmVtaXRDaGFuZ2UoKTtcblxuXHRcdFx0Z2V0UHJvamVjdERldGFpbHMoX3NlbGVjdGVkKTtcblx0XHRcdGdldE1pbGVzdG9uZXMoX3NlbGVjdGVkKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8vbm8gb3Bcblx0fVxuXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvamVjdFN0b3JlO1xuIiwiXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBTZXR0aW5nc0NvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvU2V0dGluZ3NDb25zdGFudHMnO1xuXG5cbmZ1bmN0aW9uIF9zZXRTZXR0aW5ncyhkYXRhKSB7XG5cdHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCksIGRhdGEpO1xuXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2V0dGluZ3MnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xufVxuXG52YXIgU2V0dGluZ3NTdG9yZSAgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0U2V0dGluZ3MoKSB7XG5cdFx0cmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpIHx8IHt9O1xuXHR9XG59KTtcblxuXG5TZXR0aW5nc1N0b3JlLmRpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGFjdGlvbiA9PiB7XG5cblx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0Y2FzZSBTZXR0aW5nc0NvbnN0YW50cy5TQVZFX1NFVFRJTkdTOlxuXHRcdFx0X3NldFNldHRpbmdzKGFjdGlvbi5kYXRhKTtcblx0XHRcdFNldHRpbmdzU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTZXR0aW5nc1N0b3JlO1xuIiwiXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSB9IGZyb20gJy4uL3V0aWxzL1N0b3JlVXRpbHMnO1xuXG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFNldHRpbmdzQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cyc7XG5pbXBvcnQgeyBnZXRVc2VycyB9IGZyb20gJy4uL2FjdGlvbnMvU2V0dGluZ3NBY3Rpb25zJztcblxuaW1wb3J0IFNldHRpbmdzU3RvcmUgZnJvbSAnLi9TZXR0aW5nc1N0b3JlJztcblxuXG52YXIgX3VzZXJzID0gW107XG5cbnZhciBTZXR0aW5nc1VzZXJzU3RvcmUgID0gY3JlYXRlU3RvcmUoe1xuXG5cdGdldFVzZXJzKCkge1xuXHRcdHJldHVybiBfdXNlcnM7XG5cdH1cbn0pO1xuXG5TZXR0aW5nc1VzZXJzU3RvcmUuZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoYWN0aW9uID0+IHtcblxuXHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRjYXNlIFNldHRpbmdzQ29uc3RhbnRzLlNBVkVfU0VUVElOR1M6XG5cdFx0XHRBcHBEaXNwYXRjaGVyLndhaXRGb3IoW1NldHRpbmdzU3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuXHRcdFx0Z2V0VXNlcnMoKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBTZXR0aW5nc0NvbnN0YW50cy5SRUNFSVZFX1VTRVJTOlxuXHRcdFx0X3VzZXJzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRTZXR0aW5nc1VzZXJzU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTZXR0aW5nc1VzZXJzU3RvcmU7XG4iLCJcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5pbXBvcnQgeyBlYWNoLCBpc0Z1bmN0aW9uIH0gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG5jb25zdCBDSEFOR0VfRVZFTlQgPSAnY2hhbmdlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN0b3JlKHNwZWMpIHtcbiAgY29uc3QgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoMCk7XG5cbiAgY29uc3Qgc3RvcmUgPSBhc3NpZ24oe1xuICAgIGVtaXRDaGFuZ2UoKSB7XG4gICAgICBlbWl0dGVyLmVtaXQoQ0hBTkdFX0VWRU5UKTtcbiAgICB9LFxuXG4gICAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICAgIGVtaXR0ZXIub24oQ0hBTkdFX0VWRU5ULCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgICBlbWl0dGVyLnJlbW92ZUxpc3RlbmVyKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICAgIH1cbiAgfSwgc3BlYyk7XG5cbiAgLy8gQXV0by1iaW5kIHN0b3JlIG1ldGhvZHMgZm9yIGNvbnZlbmllbmNlXG4gIGVhY2goc3RvcmUsICh2YWwsIGtleSkgPT4ge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgIHN0b3JlW2tleV0gPSBzdG9yZVtrZXldLmJpbmQoc3RvcmUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHN0b3JlO1xufSIsIlxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBTZXR0aW5nc1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9TZXR0aW5nc1N0b3JlJztcblx0XG5leHBvcnQgZnVuY3Rpb24gYXBpUmVxdWVzdChvcHRpb25zKSB7XG5cblx0dmFyIGRlZmF1bHRzID0ge1xuXHRcdHR5cGU6ICdQT1NUJyxcblx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdGRhdGE6IHt9LFxuICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKG9wdGlvbnMudXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcbiAgICB9XG5cdH07XG5cblx0dmFyIGFwcFNldHRpbmdzID0gU2V0dGluZ3NTdG9yZS5nZXRTZXR0aW5ncygpO1xuXHRpZiAoYXBwU2V0dGluZ3MpIHtcblx0XHRkZWZhdWx0cy5kYXRhID0ge1xuXHRcdFx0YXBpX2dyb3VwOiBhcHBTZXR0aW5ncy5ncm91cElkLFxuXHRcdFx0YXBpX3NlY3JldDogYXBwU2V0dGluZ3MuZ3JvdXBTZWNyZXRcblx0XHR9O1xuXHR9XG5cblx0dmFyIHNldHRpbmdzID0gJC5leHRlbmQodHJ1ZSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXHRpZiAoc2V0dGluZ3MuZGF0YS5hcGlfZ3JvdXAgJiYgc2V0dGluZ3MuZGF0YS5hcGlfc2VjcmV0KSB7XG5cdFx0JC5hamF4KCdodHRwczovL3d3dy50ZWFtbGVhZGVyLmJlL2FwaScgKyBvcHRpb25zLnVybCwgc2V0dGluZ3MpO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWtleShhcnIsIGxvb2t1cCkge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBvYmogPSBhcnJbaV07XG5cdFx0Zm9yICh2YXIgZnJvbUtleSBpbiBsb29rdXApIHtcblx0XHRcdHZhciB0b0tleSA9IGxvb2t1cFtmcm9tS2V5XTtcblx0XHRcdHZhciB2YWx1ZSA9IG9ialtmcm9tS2V5XTtcblx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHRvYmpbdG9LZXldID0gdmFsdWU7XG5cdFx0XHRcdGRlbGV0ZSBvYmpbZnJvbUtleV07XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBodG1sRW50aXRpZXMoc3RyaW5nKSB7XG5cdHJldHVybiBzdHJpbmdcblx0XHQucmVwbGFjZSgvJmFtcDsvZywgJyYnKVxuXHRcdC5yZXBsYWNlKC8mIzAzOTsvZywgXCInXCIpO1xufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiXG52YXIgZ3VpID0gbm9kZVJlcXVpcmUoJ253Lmd1aScpO1xudmFyIG1iID0gbmV3IGd1aS5NZW51KHt0eXBlOiAnbWVudWJhcid9KTtcbnRyeSB7XG4gIG1iLmNyZWF0ZU1hY0J1aWx0aW4oJ1RlYW1sZWFkZXIgVGltZScsIHtcbiAgICBoaWRlRWRpdDogZmFsc2UsXG4gIH0pO1xuICBndWkuV2luZG93LmdldCgpLm1lbnUgPSBtYjtcbn0gY2F0Y2goZXgpIHtcbiAgY29uc29sZS5sb2coZXgubWVzc2FnZSk7XG59XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG52YXIgUm91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG52YXIgRGVmYXVsdFJvdXRlID0gUm91dGVyLkRlZmF1bHRSb3V0ZTtcbnZhciBSb3V0ZSA9IFJvdXRlci5Sb3V0ZTtcblxudmFyIFRlYW1sZWFkZXJUaW1lQXBwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1RlYW1sZWFkZXJUaW1lQXBwLnJlYWN0Jyk7XG52YXIgVHJhY2tlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9UcmFja2VyLnJlYWN0Jyk7XG52YXIgU2V0dGluZ3MgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvU2V0dGluZ3MucmVhY3QnKTtcblxudmFyIHJvdXRlcyA9IChcbiAgPFJvdXRlIG5hbWU9XCJhcHBcIiBwYXRoPVwiL1wiIGhhbmRsZXI9e1RlYW1sZWFkZXJUaW1lQXBwfT5cbiAgICA8Um91dGUgbmFtZT1cInNldHRpbmdzXCIgaGFuZGxlcj17U2V0dGluZ3N9Lz5cbiAgICA8RGVmYXVsdFJvdXRlIG5hbWU9XCJ0cmFja2VyXCIgaGFuZGxlcj17VHJhY2tlcn0vPlxuICA8L1JvdXRlPlxuKTtcblxuUm91dGVyLnJ1bihyb3V0ZXMsIGZ1bmN0aW9uIChIYW5kbGVyKSB7XG4gIFJlYWN0LnJlbmRlcig8SGFuZGxlci8+LCBkb2N1bWVudC5ib2R5KTtcbn0pO1xuIl19
