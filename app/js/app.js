(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var gui = nodeRequire('nw.gui');

var MenuBar = function MenuBar() {
	_classCallCheck(this, MenuBar);

	var mb = new gui.Menu({ type: 'menubar' });
	try {
		mb.createMacBuiltin('Teamleader Time', {
			hideEdit: false });
		gui.Window.get().menu = mb;
	} catch (ex) {
		console.log(ex.message);
	}
};

exports['default'] = MenuBar;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reactRouter2 = _interopRequireDefault(_reactRouter);

var _componentsTeamleaderTimeAppReact = require('./components/TeamleaderTimeApp.react');

var _componentsTeamleaderTimeAppReact2 = _interopRequireDefault(_componentsTeamleaderTimeAppReact);

var _componentsTrackerReact = require('./components/Tracker.react');

var _componentsTrackerReact2 = _interopRequireDefault(_componentsTrackerReact);

var _componentsSettingsReact = require('./components/Settings.react');

var _componentsSettingsReact2 = _interopRequireDefault(_componentsSettingsReact);

var Routes = function Routes() {
	_classCallCheck(this, Routes);

	var routes = _react2['default'].createElement(
		_reactRouter.Route,
		{ name: 'app', path: '/', handler: _componentsTeamleaderTimeAppReact2['default'] },
		_react2['default'].createElement(_reactRouter.Route, { name: 'settings', handler: _componentsSettingsReact2['default'] }),
		_react2['default'].createElement(_reactRouter.DefaultRoute, { name: 'tracker', handler: _componentsTrackerReact2['default'] })
	);

	_reactRouter2['default'].run(routes, function (Handler) {
		_react2['default'].render(_react2['default'].createElement(Handler, null), document.body);
	});
};

exports['default'] = Routes;
module.exports = exports['default'];

},{"./components/Settings.react":9,"./components/TeamleaderTimeApp.react":12,"./components/Tracker.react":14,"react":"react","react-router":"react-router"}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var gui = nodeRequire('nw.gui');
var window = gui.Window.get();

var isVisible = false;
var height = 0;
var width = 0;

function _toggle(e) {
	isVisible ? window.hide() : _show.apply(this, [e.x, e.y]);
	isVisible = !isVisible;
}

function _show(x, y) {
	window.moveTo(x - (0, _jquery2['default'])('.app').width() / 2 - 6, y);
	_fitWindowToContent();
	window.show();
	window.focus();
}

function _onWindowBlur() {
	window.hide();
	isVisible = false;
}

function _fitWindowToContent() {
	var hei = (0, _jquery2['default'])('.app').height() + 100;
	var wid = (0, _jquery2['default'])('.app').width() + 40;

	if (width != wid || height != hei) {
		window.resizeTo(wid, hei);
		width = wid;
		height = hei;
	}
}

var StatusBar = function StatusBar() {
	_classCallCheck(this, StatusBar);

	// if (!sessionStorage.initializedStatusBar) {
	//   sessionStorage.initializedStatusBar = true;

	var tray = new gui.Tray({
		title: '',
		icon: 'images/icon.png',
		alticon: 'images/icon.png',
		iconsAreTemplates: false
	});
	tray.on('click', _toggle);

	window.on('blur', _onWindowBlur);

	(function animloop() {
		requestAnimationFrame(animloop);
		_fitWindowToContent();
	})();
	//}
};

exports['default'] = StatusBar;
module.exports = exports['default'];

},{"jquery":"jquery"}],4:[function(require,module,exports){
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

function getUsers() {
	(0, _utilsUtils.apiRequest)({
		url: '/getUsers.php',
		success: function success(data) {
			_dispatcherAppDispatcher2['default'].dispatch({
				type: _constantsSettingsConstants2['default'].RECEIVE_USERS,
				data: data
			});
		}
	});
}

},{"../constants/SettingsConstants":16,"../dispatcher/AppDispatcher":18,"../utils/Utils":28}],5:[function(require,module,exports){
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
exports.getTaskTypes = getTaskTypes;
exports.setTaskType = setTaskType;
exports.setTaskDescription = setTaskDescription;

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
			var options = (0, _underscore.where)(json, { phase: 'active' });
			//console.log(options);
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
				//console.log(data)
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
				var options = (0, _underscore.where)(json, { closed: 0 });
				//console.log(options);
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
				var options = (0, _underscore.where)(json, { done: 0 });
				//console.log(options);

				var appSettings = JSON.parse(localStorage.getItem('settings'));
				if (appSettings && appSettings.userName) {
					options = (0, _underscore.where)(options, { owner_name: appSettings.userName });
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

function getTaskTypes() {
	(0, _utilsUtils.apiRequest)({
		url: '/getTaskTypes.php',
		success: function success(options) {
			//console.log(options)
			_dispatcherAppDispatcher2['default'].dispatch({
				type: _constantsTrackerConstants2['default'].RECEIVE_TASK_TYPES,
				data: options
			});
		}
	});
}

function setTaskType(id) {
	_dispatcherAppDispatcher2['default'].dispatch({
		type: _constantsTrackerConstants2['default'].SET_TASK_TYPE,
		id: id
	});
}

function setTaskDescription(txt) {
	_dispatcherAppDispatcher2['default'].dispatch({
		type: _constantsTrackerConstants2['default'].SET_TASK_DESCRIPTION,
		txt: txt
	});
}

},{"../constants/TrackerConstants":17,"../dispatcher/AppDispatcher":18,"../utils/Utils":28,"underscore":"underscore"}],6:[function(require,module,exports){
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
			milestone: _storesMilestoneStore2['default'].getMilestoneId()
		};
	},

	getInitialState: function getInitialState() {
		return this.getMilestonesState();
	},

	_onChange: function _onChange() {
		if (this.isMounted()) {
			this.setState(this.getMilestonesState());
		}
	},

	componentDidMount: function componentDidMount() {
		(0, _actionsTrackerActions.getMilestones)(_storesProjectStore2['default'].getProjectId());
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

},{"../actions/TrackerActions":5,"../stores/MilestoneStore":20,"../stores/ProjectStore":22,"./SelectInput.react":8,"react":"react"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _underscore = require('underscore');

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
			project: _storesProjectStore2['default'].getProjectId()
		};
	},

	getInitialState: function getInitialState() {
		return this.getProjectsState();
	},

	_onChange: function _onChange() {
		if (this.isMounted()) {
			this.setState(this.getProjectsState());
		}
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

		var projects = (0, _underscore.clone)(this.state.projects);
		if (projects.length > 0) {
			projects.unshift({ id: 0, title: 'Choose...' });
		}

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
					options: projects,
					onChange: this.handleChange
				})
			)
		);
	}
});

exports['default'] = ProjectSelectContainer;
module.exports = exports['default'];

},{"../actions/TrackerActions":5,"../stores/ProjectStore":22,"./SelectInput.react":8,"react":"react","underscore":"underscore"}],8:[function(require,module,exports){
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

	getDefaultProps: function getDefaultProps() {
		return {
			valueKey: 'id',
			labelKey: 'title'
		};
	},

	render: function render() {
		var _this = this;

		var optionNodes = this.props.options.map(function (option) {
			var value = option[_this.props.valueKey];
			var label = option[_this.props.labelKey];
			return _react2['default'].createElement(
				'option',
				{ key: value, value: value },
				(0, _utilsUtils.htmlEntities)(label)
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

},{"../utils/Utils":28,"react":"react"}],9:[function(require,module,exports){
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

},{"../actions/SettingsActions":4,"../stores/SettingsStore":23,"../stores/SettingsUsersStore":24,"./SelectInput.react":8,"./TextInput.react":13,"./UserSelectContainer.react":15,"jquery":"jquery","react":"react","react-router":"react-router"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _underscore = require('underscore');

var _actionsTrackerActions = require('../actions/TrackerActions');

var _storesMilestoneStore = require('../stores/MilestoneStore');

var _storesMilestoneStore2 = _interopRequireDefault(_storesMilestoneStore);

var _storesMilestoneTaskStore = require('../stores/MilestoneTaskStore');

var _storesMilestoneTaskStore2 = _interopRequireDefault(_storesMilestoneTaskStore);

var _storesTaskStore = require('../stores/TaskStore');

var _storesTaskStore2 = _interopRequireDefault(_storesTaskStore);

var _SelectInputReact = require('./SelectInput.react');

var _SelectInputReact2 = _interopRequireDefault(_SelectInputReact);

var _TaskTypeSelectContainerReact = require('./TaskTypeSelectContainer.react');

var _TaskTypeSelectContainerReact2 = _interopRequireDefault(_TaskTypeSelectContainerReact);

var TaskSelectContainer = _react2['default'].createClass({
	displayName: 'TaskSelectContainer',

	getTasksState: function getTasksState() {
		return {
			tasks: _storesMilestoneTaskStore2['default'].getMilestoneTasks(),
			task: _storesMilestoneTaskStore2['default'].getMilestoneTaskId(),
			description: _storesTaskStore2['default'].getTaskDescription()
		};
	},

	getInitialState: function getInitialState() {
		return this.getTasksState();
	},

	_onChange: function _onChange() {
		if (this.isMounted()) {
			this.setState(this.getTasksState());
		}
	},

	componentDidMount: function componentDidMount() {
		(0, _actionsTrackerActions.getMilestoneTasks)(_storesMilestoneStore2['default'].getMilestoneId());
		_storesMilestoneTaskStore2['default'].addChangeListener(this._onChange);
		_storesTaskStore2['default'].addChangeListener(this._onChange);
	},

	componentWillUnmount: function componentWillUnmount() {
		_storesMilestoneTaskStore2['default'].removeChangeListener(this._onChange);
		_storesTaskStore2['default'].removeChangeListener(this._onChange);
	},

	handleMilestoneTaskChange: function handleMilestoneTaskChange(event) {
		var target = event.currentTarget;
		(0, _actionsTrackerActions.setMilestoneTask)(target.value);
	},

	handleTaskDescriptionChange: function handleTaskDescriptionChange(event) {
		(0, _actionsTrackerActions.setTaskDescription)(event.target.value);
	},

	render: function render() {
		if (this.state.tasks.length > 0 && this.state.task != -1) {

			var tasks = (0, _underscore.clone)(this.state.tasks);
			tasks.push({ id: -1, description: 'New task...' });

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
						labelKey: 'description',
						value: this.state.task,
						options: tasks,
						onChange: this.handleMilestoneTaskChange
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
						_react2['default'].createElement('textarea', {
							id: 'task-description',
							placeholder: 'Task description...',
							className: 'form-control',
							rows: '3',
							value: this.state.description,
							onChange: this.handleTaskDescriptionChange
						})
					)
				)
			);
		}
	}
});

exports['default'] = TaskSelectContainer;
module.exports = exports['default'];

},{"../actions/TrackerActions":5,"../stores/MilestoneStore":20,"../stores/MilestoneTaskStore":21,"../stores/TaskStore":25,"./SelectInput.react":8,"./TaskTypeSelectContainer.react":11,"react":"react","underscore":"underscore"}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actionsTrackerActions = require('../actions/TrackerActions');

var _storesTaskTypeStore = require('../stores/TaskTypeStore');

var _storesTaskTypeStore2 = _interopRequireDefault(_storesTaskTypeStore);

var _SelectInputReact = require('./SelectInput.react');

var _SelectInputReact2 = _interopRequireDefault(_SelectInputReact);

var TaskTypeSelectContainer = _react2['default'].createClass({
	displayName: 'TaskTypeSelectContainer',

	getTasksState: function getTasksState() {
		return {
			taskTypes: _storesTaskTypeStore2['default'].getTaskTypes(),
			taskType: _storesTaskTypeStore2['default'].getTaskTypeId()
		};
	},

	getInitialState: function getInitialState() {
		return this.getTasksState();
	},

	_onChange: function _onChange() {
		if (this.isMounted()) {
			this.setState(this.getTasksState());
		}
	},

	componentDidMount: function componentDidMount() {
		(0, _actionsTrackerActions.getTaskTypes)();
		_storesTaskTypeStore2['default'].addChangeListener(this._onChange);
	},

	componentWillUnmount: function componentWillUnmount() {
		_storesTaskTypeStore2['default'].removeChangeListener(this._onChange);
	},

	handleChange: function handleChange(event) {
		var target = event.currentTarget;
		(0, _actionsTrackerActions.setTaskType)(target.value);
	},

	render: function render() {
		return _react2['default'].createElement(_SelectInputReact2['default'], {
			id: 'task-type',
			ref: 'taskType',
			labelKey: 'name',
			value: this.state.taskType,
			options: this.state.taskTypes,
			onChange: this.handleChange
		});
	}
});

exports['default'] = TaskTypeSelectContainer;
module.exports = exports['default'];

},{"../actions/TrackerActions":5,"../stores/TaskTypeStore":26,"./SelectInput.react":8,"react":"react"}],12:[function(require,module,exports){
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

var gui = nodeRequire('nw.gui');

var TeamleaderTimeApp = _react2['default'].createClass({
  displayName: 'TeamleaderTimeApp',

  render: function render() {

    function showDevTools() {
      gui.Window.get().showDevTools();
    }

    var devLink = _react2['default'].createElement(
      'a',
      { href: 'javascript:;', className: 'dev-link', onClick: showDevTools },
      _react2['default'].createElement('i', { className: 'fa fa-wrench' })
    );

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
        ),
        devLink
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

},{"events":29,"flux":"flux","react":"react","react-router":"react-router"}],13:[function(require,module,exports){
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

},{"react":"react"}],14:[function(require,module,exports){
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

var _storesTaskTypeStore = require('../stores/TaskTypeStore');

var _storesTaskTypeStore2 = _interopRequireDefault(_storesTaskTypeStore);

var _storesSettingsStore = require('../stores/SettingsStore');

var _storesSettingsStore2 = _interopRequireDefault(_storesSettingsStore);

var _storesTaskStore = require('../stores/TaskStore');

var _storesTaskStore2 = _interopRequireDefault(_storesTaskStore);

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
			project: _storesProjectStore2['default'].getProjectId(),
			milestone: _storesMilestoneStore2['default'].getMilestoneId(),
			milestoneTask: _storesMilestoneTaskStore2['default'].getMilestoneTaskId(),
			contactOrCompany: _storesCustomerStore2['default'].getContactOrCompany(),
			contactOrCompanyId: _storesCustomerStore2['default'].getContactOrCompanyId(),
			taskType: _storesTaskTypeStore2['default'].getTaskTypeId(),
			userId: _storesSettingsStore2['default'].getUserId(),
			description: _storesMilestoneTaskStore2['default'].getMilestoneTaskDescription() || _storesTaskStore2['default'].getTaskDescription()
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
				_react2['default'].createElement(_TaskSelectContainerReact2['default'], { ref: 'taskSelectContainer' }),
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

},{"../stores/CustomerStore":19,"../stores/MilestoneStore":20,"../stores/MilestoneTaskStore":21,"../stores/ProjectStore":22,"../stores/SettingsStore":23,"../stores/TaskStore":25,"../stores/TaskTypeStore":26,"./MilestoneSelectContainer.react":6,"./ProjectSelectContainer.react":7,"./TaskSelectContainer.react":10,"react":"react"}],15:[function(require,module,exports){
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
			users: _storesSettingsUsersStore2['default'].getUsers()
		};
	},

	getInitialState: function getInitialState() {
		return this.getUsersState();
	},

	_onChange: function _onChange() {
		if (this.isMounted()) {
			this.setState(this.getUsersState());
		}
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
					labelKey: 'name',
					options: this.state.users,
					defaultValue: this.props.userId
				})
			)
		);
	}
});

exports['default'] = UserSelectContainer;
module.exports = exports['default'];

},{"../actions/SettingsActions":4,"../stores/SettingsStore":23,"../stores/SettingsUsersStore":24,"./SelectInput.react":8,"react":"react","react-router":"react-router"}],16:[function(require,module,exports){
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

},{"keymirror":"keymirror"}],17:[function(require,module,exports){
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
	RECEIVE_TASK_TYPES: null,
	SET_PROJECT: null,
	SET_MILESTONE: null,
	SET_MILESTONE_TASK: null,
	SET_CONTACT_OR_COMPANY: null,
	SET_TASK_TYPE: null,
	SET_TASK_DESCRIPTION: null
});
module.exports = exports['default'];

},{"keymirror":"keymirror"}],18:[function(require,module,exports){
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

},{"flux":"flux"}],19:[function(require,module,exports){
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

},{"../constants/TrackerConstants":17,"../dispatcher/AppDispatcher":18,"../utils/StoreUtils":27}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _underscore = require('underscore');

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

	getMilestoneId: function getMilestoneId() {
		return _selected;
	},

	getMilestone: function getMilestone() {
		return (0, _underscore.findWhere)(_milestones, { id: _selected });
	}
});

MilestoneStore.dispatchToken = _dispatcherAppDispatcher2['default'].register(function (action) {

	switch (action.type) {

		case _constantsTrackerConstants2['default'].SET_PROJECT:
			_dispatcherAppDispatcher2['default'].waitFor([_storesProjectStore2['default'].dispatchToken]);
			_milestones = [];
			_selected = 0;
			if (_storesProjectStore2['default'].getProjectId() == 0) {
				MilestoneStore.emitChange();
			}
			break;

		case _constantsTrackerConstants2['default'].RECEIVE_MILESTONES:
			_milestones = action.data;
			//console.log(_milestones);
			if (_milestones.length > 0) {
				_selected = parseInt(_milestones[0].id);
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

},{"../actions/TrackerActions":5,"../constants/TrackerConstants":17,"../dispatcher/AppDispatcher":18,"../stores/ProjectStore":22,"../utils/StoreUtils":27,"underscore":"underscore"}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _underscore = require('underscore');

var _utilsStoreUtils = require('../utils/StoreUtils');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsTrackerConstants = require('../constants/TrackerConstants');

var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

var _storesProjectStore = require('../stores/ProjectStore');

var _storesProjectStore2 = _interopRequireDefault(_storesProjectStore);

var _storesMilestoneStore = require('../stores/MilestoneStore');

var _storesMilestoneStore2 = _interopRequireDefault(_storesMilestoneStore);

var _tasks = [];
var _selected;

var MilestoneTaskStore = (0, _utilsStoreUtils.createStore)({

	getMilestoneTasks: function getMilestoneTasks() {
		return _tasks;
	},

	getMilestoneTaskId: function getMilestoneTaskId() {
		return _selected;
	},

	getMilestoneTask: function getMilestoneTask() {
		return (0, _underscore.findWhere)(_tasks, { id: _selected });
	},

	getMilestoneTaskDescription: function getMilestoneTaskDescription() {
		var task = this.getMilestoneTask();
		return task ? task.description : null;
	}
});

MilestoneTaskStore.dispatchToken = _dispatcherAppDispatcher2['default'].register(function (action) {

	switch (action.type) {

		case _constantsTrackerConstants2['default'].SET_PROJECT:
		case _constantsTrackerConstants2['default'].SET_MILESTONE:
			_dispatcherAppDispatcher2['default'].waitFor([_storesMilestoneStore2['default'].dispatchToken]);
			_tasks = [];
			_selected = 0;
			if (_storesProjectStore2['default'].getProjectId() == 0) {
				MilestoneTaskStore.emitChange();
			}
			break;

		case _constantsTrackerConstants2['default'].RECEIVE_MILESTONE_TASKS:
			_tasks = action.data;
			//console.log(_tasks)
			if (_tasks.length > 0) {
				_selected = parseInt(_tasks[0].id);
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

},{"../constants/TrackerConstants":17,"../dispatcher/AppDispatcher":18,"../stores/MilestoneStore":20,"../stores/ProjectStore":22,"../utils/StoreUtils":27,"underscore":"underscore"}],22:[function(require,module,exports){
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

	getProjectId: function getProjectId() {
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

},{"../actions/TrackerActions":5,"../constants/TrackerConstants":17,"../dispatcher/AppDispatcher":18,"../utils/StoreUtils":27}],23:[function(require,module,exports){
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
	},

	getUserId: function getUserId() {
		return parseInt(this.getSettings().userId);
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

},{"../constants/SettingsConstants":16,"../dispatcher/AppDispatcher":18,"../utils/StoreUtils":27,"jquery":"jquery"}],24:[function(require,module,exports){
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

},{"../actions/SettingsActions":4,"../constants/SettingsConstants":16,"../dispatcher/AppDispatcher":18,"../utils/StoreUtils":27,"./SettingsStore":23}],25:[function(require,module,exports){
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

var _storesMilestoneTaskStore = require('../stores/MilestoneTaskStore');

var _storesMilestoneTaskStore2 = _interopRequireDefault(_storesMilestoneTaskStore);

var _description;

var TaskStore = (0, _utilsStoreUtils.createStore)({

	getTaskDescription: function getTaskDescription() {
		return _description;
	}
});

TaskStore.dispatchToken = _dispatcherAppDispatcher2['default'].register(function (action) {

	switch (action.type) {

		case _constantsTrackerConstants2['default'].SET_TASK_DESCRIPTION:
			_description = action.txt;
			//console.log(_description);
			TaskStore.emitChange();
			break;

		default:
		//no op
	}
});

exports['default'] = TaskStore;
module.exports = exports['default'];

},{"../constants/TrackerConstants":17,"../dispatcher/AppDispatcher":18,"../stores/MilestoneTaskStore":21,"../utils/StoreUtils":27}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _underscore = require('underscore');

var _utilsStoreUtils = require('../utils/StoreUtils');

var _dispatcherAppDispatcher = require('../dispatcher/AppDispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _constantsTrackerConstants = require('../constants/TrackerConstants');

var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

var _storesMilestoneTaskStore = require('../stores/MilestoneTaskStore');

var _storesMilestoneTaskStore2 = _interopRequireDefault(_storesMilestoneTaskStore);

var _taskTypes = [];
var _selected;

var TaskTypeStore = (0, _utilsStoreUtils.createStore)({

	getTaskTypes: function getTaskTypes() {
		return _taskTypes;
	},

	getTaskTypeId: function getTaskTypeId() {
		return _selected;
	},

	getTaskType: function getTaskType() {
		return (0, _underscore.findWhere)(_taskTypes, { id: _selected });
	}
});

TaskTypeStore.dispatchToken = _dispatcherAppDispatcher2['default'].register(function (action) {

	switch (action.type) {

		case _constantsTrackerConstants2['default'].RECEIVE_TASK_TYPES:
			_taskTypes = action.data;
			if (_taskTypes.length > 0) {
				_selected = parseInt(_taskTypes[0].id);
				console.log('task_type', _selected);
			}
			TaskTypeStore.emitChange();
			break;

		case _constantsTrackerConstants2['default'].SET_TASK_TYPE:
			_selected = parseInt(action.id);
			console.log('task_type', _selected);
			TaskTypeStore.emitChange();
			break;

		case _constantsTrackerConstants2['default'].RECEIVE_MILESTONE_TASKS:
		case _constantsTrackerConstants2['default'].SET_MILESTONE_TASK:
			_dispatcherAppDispatcher2['default'].waitFor([_storesMilestoneTaskStore2['default'].dispatchToken]);

			var milestoneTask = _storesMilestoneTaskStore2['default'].getMilestoneTask();
			if (milestoneTask) {
				var milestoneTaskTypeName = milestoneTask.task_type;
				var milestoneTaskType = (0, _underscore.findWhere)(_taskTypes, { name: milestoneTaskTypeName });
				if (milestoneTaskType) {
					var milestoneTaskTypeId = milestoneTaskType.id;
					_selected = milestoneTaskTypeId;
				}
			}

			break;

		default:
		//no op
	}
});

exports['default'] = TaskTypeStore;
module.exports = exports['default'];

},{"../constants/TrackerConstants":17,"../dispatcher/AppDispatcher":18,"../stores/MilestoneTaskStore":21,"../utils/StoreUtils":27,"underscore":"underscore"}],27:[function(require,module,exports){
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

},{"events":29,"object-assign":"object-assign","underscore":"underscore"}],28:[function(require,module,exports){
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

},{"../stores/SettingsStore":23,"jquery":"jquery"}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Routes = require('./Routes');

var _Routes2 = _interopRequireDefault(_Routes);

var _StatusBar = require('./StatusBar');

var _StatusBar2 = _interopRequireDefault(_StatusBar);

var _MenuBar = require('./MenuBar');

var _MenuBar2 = _interopRequireDefault(_MenuBar);

new _StatusBar2['default']();
new _MenuBar2['default']();
new _Routes2['default']();

},{"./MenuBar":1,"./Routes":2,"./StatusBar":3}]},{},[30])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9NZW51QmFyLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvUm91dGVzLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvU3RhdHVzQmFyLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvYWN0aW9ucy9TZXR0aW5nc0FjdGlvbnMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9NaWxlc3RvbmVTZWxlY3RDb250YWluZXIucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1Byb2plY3RTZWxlY3RDb250YWluZXIucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1NlbGVjdElucHV0LnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9TZXR0aW5ncy5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVGFza1NlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVGFza1R5cGVTZWxlY3RDb250YWluZXIucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1RlYW1sZWFkZXJUaW1lQXBwLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UZXh0SW5wdXQucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1RyYWNrZXIucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1VzZXJTZWxlY3RDb250YWluZXIucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb25zdGFudHMvU2V0dGluZ3NDb25zdGFudHMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb25zdGFudHMvVHJhY2tlckNvbnN0YW50cy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3N0b3Jlcy9DdXN0b21lclN0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL01pbGVzdG9uZVN0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL01pbGVzdG9uZVRhc2tTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3N0b3Jlcy9Qcm9qZWN0U3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvU2V0dGluZ3NTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3N0b3Jlcy9TZXR0aW5nc1VzZXJzU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvVGFza1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1Rhc2tUeXBlU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy91dGlscy9TdG9yZVV0aWxzLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvdXRpbHMvVXRpbHMuanN4Iiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0NBLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7SUFHWCxPQUFPLEdBRWhCLFNBRlMsT0FBTyxHQUViO3VCQUZNLE9BQU87O0FBSXpCLEtBQUksRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLEtBQUk7QUFDRixJQUFFLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLEVBQUU7QUFDckMsV0FBUSxFQUFFLEtBQUssRUFDaEIsQ0FBQyxDQUFDO0FBQ0gsS0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0VBQzVCLENBQUMsT0FBTSxFQUFFLEVBQUU7QUFDVixTQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUN6QjtDQUNGOztxQkFibUIsT0FBTzs7Ozs7Ozs7Ozs7Ozs7cUJDSFYsT0FBTzs7OzsyQkFDbUIsY0FBYzs7OztnREFFNUIsc0NBQXNDOzs7O3NDQUNoRCw0QkFBNEI7Ozs7dUNBQzNCLDZCQUE2Qjs7OztJQUc3QixNQUFNLEdBRWYsU0FGUyxNQUFNLEdBRVo7dUJBRk0sTUFBTTs7QUFJeEIsS0FBSSxNQUFNLEdBQ1I7ZUFaMEIsS0FBSztJQVl4QixJQUFJLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxHQUFHLEVBQUMsT0FBTywrQ0FBb0I7RUFDcEQsOENBYndCLEtBQUss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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O3NCQzVTbUIsVUFBVTs7Ozt5QkFDUCxhQUFhOzs7O3VCQUNmLFdBQVc7Ozs7QUFFL0IsNEJBQWUsQ0FBQztBQUNoQiwwQkFBYSxDQUFDO0FBQ2QseUJBQVksQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbnZhciBndWkgPSBub2RlUmVxdWlyZSgnbncuZ3VpJyk7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVudUJhciB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cblx0ICB2YXIgbWIgPSBuZXcgZ3VpLk1lbnUoeyB0eXBlOiAnbWVudWJhcicgfSk7XG5cdCAgdHJ5IHtcblx0ICAgIG1iLmNyZWF0ZU1hY0J1aWx0aW4oJ1RlYW1sZWFkZXIgVGltZScsIHtcblx0ICAgICAgaGlkZUVkaXQ6IGZhbHNlLFxuXHQgICAgfSk7XG5cdCAgICBndWkuV2luZG93LmdldCgpLm1lbnUgPSBtYjtcblx0ICB9IGNhdGNoKGV4KSB7XG5cdCAgICBjb25zb2xlLmxvZyhleC5tZXNzYWdlKTtcblx0ICB9XG5cdH1cbn1cbiIsIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSb3V0ZXIsIHsgRGVmYXVsdFJvdXRlLCBSb3V0ZSB9IGZyb20gJ3JlYWN0LXJvdXRlcic7XG5cbmltcG9ydCBUZWFtbGVhZGVyVGltZUFwcCBmcm9tICcuL2NvbXBvbmVudHMvVGVhbWxlYWRlclRpbWVBcHAucmVhY3QnO1xuaW1wb3J0IFRyYWNrZXIgZnJvbSAnLi9jb21wb25lbnRzL1RyYWNrZXIucmVhY3QnO1xuaW1wb3J0IFNldHRpbmdzIGZyb20gJy4vY29tcG9uZW50cy9TZXR0aW5ncy5yZWFjdCc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm91dGVzIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblxuXHQgIHZhciByb3V0ZXMgPSAoXG5cdCAgICA8Um91dGUgbmFtZT1cImFwcFwiIHBhdGg9XCIvXCIgaGFuZGxlcj17VGVhbWxlYWRlclRpbWVBcHB9PlxuXHQgICAgICA8Um91dGUgbmFtZT1cInNldHRpbmdzXCIgaGFuZGxlcj17U2V0dGluZ3N9Lz5cblx0ICAgICAgPERlZmF1bHRSb3V0ZSBuYW1lPVwidHJhY2tlclwiIGhhbmRsZXI9e1RyYWNrZXJ9Lz5cblx0ICAgIDwvUm91dGU+XG5cdCAgKTtcblxuXHQgIFJvdXRlci5ydW4ocm91dGVzLCBmdW5jdGlvbiAoSGFuZGxlcikge1xuXHQgICAgUmVhY3QucmVuZGVyKDxIYW5kbGVyLz4sIGRvY3VtZW50LmJvZHkpO1xuXHQgIH0pO1xuXHR9XG59IiwiXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuXG52YXIgZ3VpID0gbm9kZVJlcXVpcmUoJ253Lmd1aScpO1xudmFyIHdpbmRvdyA9IGd1aS5XaW5kb3cuZ2V0KCk7XG5cblxudmFyIGlzVmlzaWJsZSA9IGZhbHNlO1xudmFyIGhlaWdodCA9IDA7XG52YXIgd2lkdGggPSAwO1xuXG5mdW5jdGlvbiBfdG9nZ2xlKGUpIHtcblx0aXNWaXNpYmxlID8gd2luZG93LmhpZGUoKSA6IF9zaG93LmFwcGx5KHRoaXMsIFtlLngsIGUueV0pO1xuXHRpc1Zpc2libGUgPSAhaXNWaXNpYmxlO1xufVxuXG5mdW5jdGlvbiBfc2hvdyh4LCB5KSB7XG4gIHdpbmRvdy5tb3ZlVG8oeCAtICgkKCcuYXBwJykud2lkdGgoKSAvIDIpIC0gNiwgeSk7XG4gIF9maXRXaW5kb3dUb0NvbnRlbnQoKTtcbiAgd2luZG93LnNob3coKTtcbiAgd2luZG93LmZvY3VzKCk7XG59XG5cbmZ1bmN0aW9uIF9vbldpbmRvd0JsdXIoKSB7XG5cdHdpbmRvdy5oaWRlKCk7XG5cdGlzVmlzaWJsZSA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfZml0V2luZG93VG9Db250ZW50KCkge1xuXHR2YXIgaGVpID0gJCgnLmFwcCcpLmhlaWdodCgpICsgMTAwO1xuXHR2YXIgd2lkID0gJCgnLmFwcCcpLndpZHRoKCkgKyA0MDtcblxuXHRpZiAod2lkdGggIT0gd2lkIHx8IGhlaWdodCAhPSBoZWkpIHtcblx0XHR3aW5kb3cucmVzaXplVG8od2lkLCBoZWkpO1xuXHRcdHdpZHRoID0gd2lkO1xuXHRcdGhlaWdodCA9IGhlaTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0dXNCYXIge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXG5cdCAgLy8gaWYgKCFzZXNzaW9uU3RvcmFnZS5pbml0aWFsaXplZFN0YXR1c0Jhcikge1xuXHQgIC8vICAgc2Vzc2lvblN0b3JhZ2UuaW5pdGlhbGl6ZWRTdGF0dXNCYXIgPSB0cnVlO1xuXG5cdCAgICB2YXIgdHJheSA9IG5ldyBndWkuVHJheSh7XG5cdCAgICAgICAgdGl0bGU6ICcnLFxuXHQgICAgICAgIGljb246ICdpbWFnZXMvaWNvbi5wbmcnLFxuXHQgICAgICAgIGFsdGljb246ICdpbWFnZXMvaWNvbi5wbmcnLFxuXHQgICAgICAgIGljb25zQXJlVGVtcGxhdGVzOiBmYWxzZVxuXHQgICAgfSk7XG5cdCAgICB0cmF5Lm9uKCdjbGljaycsIF90b2dnbGUpO1xuXG5cdCAgICB3aW5kb3cub24oJ2JsdXInLCBfb25XaW5kb3dCbHVyKTtcblxuXHRcdFx0KGZ1bmN0aW9uIGFuaW1sb29wKCkge1xuXHRcdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWxvb3ApO1xuXHRcdFx0XHRfZml0V2luZG93VG9Db250ZW50KCk7XG5cdFx0XHR9KSgpO1xuXHQgIC8vfVxuXHR9XG59XG4iLCJcbmltcG9ydCB7IGFwaVJlcXVlc3QsIHJla2V5IH0gZnJvbSAnLi4vdXRpbHMvVXRpbHMnO1xuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBTZXR0aW5nc0NvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvU2V0dGluZ3NDb25zdGFudHMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlU2V0dGluZ3MoZGF0YSkge1xuICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICB0eXBlOiBTZXR0aW5nc0NvbnN0YW50cy5TQVZFX1NFVFRJTkdTLFxuICAgIGRhdGE6IGRhdGFcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVc2VycygpIHtcblx0YXBpUmVxdWVzdCh7XG5cdFx0dXJsOiAnL2dldFVzZXJzLnBocCcsXG5cdFx0c3VjY2VzczogKGRhdGEpID0+IHtcblx0ICBcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHQgIFx0XHR0eXBlOiBTZXR0aW5nc0NvbnN0YW50cy5SRUNFSVZFX1VTRVJTLFxuXHQgIFx0XHRkYXRhOiBkYXRhXG5cdCAgXHR9KTtcbiAgICB9XG5cdH0pO1xufVxuIiwiXG5pbXBvcnQgeyB3aGVyZSB9IGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IHsgYXBpUmVxdWVzdCwgcmVrZXkgfSBmcm9tICcuLi91dGlscy9VdGlscyc7XG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFRyYWNrZXJDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9qZWN0cygpIHtcblx0YXBpUmVxdWVzdCh7XG5cdFx0dXJsOiAnL2dldFByb2plY3RzLnBocCcsXG5cdFx0ZGF0YToge1xuXHRcdFx0YW1vdW50OiAxMDAsXG5cdFx0XHRwYWdlbm86IDBcblx0XHR9LFxuXHRcdHN1Y2Nlc3M6IChqc29uKSA9PiB7XG5cdFx0XHR2YXIgb3B0aW9ucyA9IHdoZXJlKGpzb24sIHsgcGhhc2U6ICdhY3RpdmUnIH0pO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhvcHRpb25zKTtcblx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHQgICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfUFJPSkVDVFMsXG5cdCAgICAgIGRhdGE6IG9wdGlvbnNcblx0ICAgIH0pO1xuICAgIH1cblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRQcm9qZWN0KGlkKSB7XG4gIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuU0VUX1BST0pFQ1QsXG4gICAgaWQ6IGlkXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvamVjdERldGFpbHMocHJvamVjdCkge1xuXHRpZiAocHJvamVjdCA+IDApIHtcblx0XHRhcGlSZXF1ZXN0KHtcblx0XHRcdHVybDogJy9nZXRQcm9qZWN0LnBocCcsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHByb2plY3RfaWQ6IHByb2plY3Rcblx0XHRcdH0sXG5cdFx0XHRzdWNjZXNzOiAoZGF0YSkgPT4ge1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKGRhdGEpXG5cdFx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdCAgICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuU0VUX0NPTlRBQ1RfT1JfQ09NUEFOWSxcblx0XHQgICAgICBvcHRpb246IGRhdGEuY29udGFjdF9vcl9jb21wYW55LFxuXHRcdCAgICAgIGlkOiBkYXRhLmNvbnRhY3Rfb3JfY29tcGFueV9pZFxuXHRcdCAgICB9KTtcbiAgICAgIH1cblx0XHR9KTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWlsZXN0b25lcyhwcm9qZWN0KSB7XG5cdGlmIChwcm9qZWN0ID4gMCkge1xuXHRcdGFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldE1pbGVzdG9uZXNCeVByb2plY3QucGhwJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cHJvamVjdF9pZDogcHJvamVjdFxuXHRcdFx0fSxcblx0XHRcdHN1Y2Nlc3M6IChqc29uKSA9PiB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gd2hlcmUoanNvbiwgeyBjbG9zZWQ6IDAgfSk7XG5cdFx0XHRcdC8vY29uc29sZS5sb2cob3B0aW9ucyk7XG5cdFx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdCAgICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVTLFxuXHRcdCAgICAgIGRhdGE6IG9wdGlvbnNcblx0XHQgICAgfSk7XG4gICAgICB9XG5cdFx0fSk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldE1pbGVzdG9uZShpZCkge1xuICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlNFVF9NSUxFU1RPTkUsXG4gICAgaWQ6IGlkXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWlsZXN0b25lVGFza3MobWlsZXN0b25lKSB7XG5cblx0aWYgKG1pbGVzdG9uZSA+IDApIHtcblxuXHRcdGFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFRhc2tzQnlNaWxlc3RvbmUucGhwJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWlsZXN0b25lX2lkOiBtaWxlc3RvbmVcblx0XHRcdH0sXG5cdFx0XHRzdWNjZXNzOiAoanNvbikgPT4ge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IHdoZXJlKGpzb24sIHsgZG9uZTogMCB9KTtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhvcHRpb25zKTtcblxuXHRcdFx0XHR2YXIgYXBwU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXR0aW5ncycpKTtcblx0XHRcdFx0aWYgKGFwcFNldHRpbmdzICYmIGFwcFNldHRpbmdzLnVzZXJOYW1lKSB7XG5cdFx0XHRcdFx0b3B0aW9ucyA9IHdoZXJlKG9wdGlvbnMsIHsgb3duZXJfbmFtZTogYXBwU2V0dGluZ3MudXNlck5hbWUgfSk7XG5cdFx0XHRcdH1cblxuXHRcdCAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHQgICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfTUlMRVNUT05FX1RBU0tTLFxuXHRcdCAgICAgIGRhdGE6IG9wdGlvbnNcblx0XHQgICAgfSk7XG4gICAgICB9XG5cdFx0fSk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldE1pbGVzdG9uZVRhc2soaWQpIHtcbiAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FX1RBU0ssXG4gICAgaWQ6IGlkXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFza1R5cGVzKCkge1xuXHRhcGlSZXF1ZXN0KHtcblx0XHR1cmw6ICcvZ2V0VGFza1R5cGVzLnBocCcsXG5cdFx0c3VjY2VzczogKG9wdGlvbnMpID0+IHtcblx0XHRcdC8vY29uc29sZS5sb2cob3B0aW9ucylcblx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHQgICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfVEFTS19UWVBFUyxcblx0ICAgICAgZGF0YTogb3B0aW9uc1xuXHQgICAgfSk7XG5cdCAgfVxuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFRhc2tUeXBlKGlkKSB7XG4gIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuU0VUX1RBU0tfVFlQRSxcbiAgICBpZDogaWRcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRUYXNrRGVzY3JpcHRpb24odHh0KSB7XG4gIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuU0VUX1RBU0tfREVTQ1JJUFRJT04sXG4gICAgdHh0OiB0eHRcbiAgfSk7XG59XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgZ2V0TWlsZXN0b25lcywgc2V0TWlsZXN0b25lIH0gZnJvbSAnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucyc7XG5pbXBvcnQgUHJvamVjdFN0b3JlIGZyb20gJy4uL3N0b3Jlcy9Qcm9qZWN0U3RvcmUnO1xuaW1wb3J0IE1pbGVzdG9uZVN0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVTdG9yZSc7XG5pbXBvcnQgU2VsZWN0SW5wdXQgZnJvbSAnLi9TZWxlY3RJbnB1dC5yZWFjdCc7XG5cblxudmFyIE1pbGVzdG9uZVNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRNaWxlc3RvbmVzU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRtaWxlc3RvbmVzOiBNaWxlc3RvbmVTdG9yZS5nZXRNaWxlc3RvbmVzKCksXG5cdFx0XHRtaWxlc3RvbmU6IE1pbGVzdG9uZVN0b3JlLmdldE1pbGVzdG9uZUlkKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRNaWxlc3RvbmVzU3RhdGUoKTtcblx0fSxcblxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICBcdGlmICh0aGlzLmlzTW91bnRlZCgpKSB7XG4gICAgXHR0aGlzLnNldFN0YXRlKHRoaXMuZ2V0TWlsZXN0b25lc1N0YXRlKCkpO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0Z2V0TWlsZXN0b25lcyhQcm9qZWN0U3RvcmUuZ2V0UHJvamVjdElkKCkpO1xuICBcdE1pbGVzdG9uZVN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0TWlsZXN0b25lU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblx0XHRzZXRNaWxlc3RvbmUodGFyZ2V0LnZhbHVlKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLm1pbGVzdG9uZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0XHRyZXR1cm4gKFxuXHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cIm1pbGVzdG9uZVwiPk1pbGVzdG9uZTwvbGFiZWw+XG5cdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0XHQ8U2VsZWN0SW5wdXQgXG5cdFx0XHRcdFx0XHRpZD1cIm1pbGVzdG9uZVwiIFxuXHRcdFx0XHRcdFx0cmVmPVwibWlsZXN0b25lXCIgXG5cdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS5taWxlc3RvbmV9XG5cdFx0XHRcdFx0XHRvcHRpb25zPXt0aGlzLnN0YXRlLm1pbGVzdG9uZXN9IFxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSBcblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBNaWxlc3RvbmVTZWxlY3RDb250YWluZXI7IiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY2xvbmUgfSBmcm9tICd1bmRlcnNjb3JlJztcblxuaW1wb3J0IHsgZ2V0UHJvamVjdHMsIHNldFByb2plY3QgfSBmcm9tICcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJztcbmltcG9ydCBQcm9qZWN0U3RvcmUgZnJvbSAnLi4vc3RvcmVzL1Byb2plY3RTdG9yZSc7XG5pbXBvcnQgU2VsZWN0SW5wdXQgZnJvbSAnLi9TZWxlY3RJbnB1dC5yZWFjdCc7XG5cblxudmFyIFByb2plY3RTZWxlY3RDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0UHJvamVjdHNTdGF0ZTogZnVuY3Rpb24oKSB7XHRcdFxuXHRcdHJldHVybiB7XG5cdFx0XHRwcm9qZWN0czogUHJvamVjdFN0b3JlLmdldFByb2plY3RzKCksXG5cdFx0XHRwcm9qZWN0OiBQcm9qZWN0U3RvcmUuZ2V0UHJvamVjdElkKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRQcm9qZWN0c1N0YXRlKCk7XG5cdH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgXHRpZiAodGhpcy5pc01vdW50ZWQoKSkge1xuICAgIFx0dGhpcy5zZXRTdGF0ZSh0aGlzLmdldFByb2plY3RzU3RhdGUoKSk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRnZXRQcm9qZWN0cygpO1xuICBcdFByb2plY3RTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFByb2plY3RTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdHNldFByb2plY3QodGFyZ2V0LnZhbHVlKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIHByb2plY3RzID0gY2xvbmUodGhpcy5zdGF0ZS5wcm9qZWN0cyk7XG5cdFx0aWYgKHByb2plY3RzLmxlbmd0aCA+IDApIHtcblx0XHRcdHByb2plY3RzLnVuc2hpZnQoeyBpZDogMCwgdGl0bGU6ICdDaG9vc2UuLi4nIH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiAoXG5cdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwicHJvamVjdFwiPlByb2plY3Q8L2xhYmVsPlxuXHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0PFNlbGVjdElucHV0IFxuXHRcdFx0XHRcdFx0aWQ9XCJwcm9qZWN0XCIgXG5cdFx0XHRcdFx0XHRyZWY9XCJwcm9qZWN0XCIgXG5cdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS5wcm9qZWN0fVxuXHRcdFx0XHRcdFx0b3B0aW9ucz17cHJvamVjdHN9IFxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSBcblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBQcm9qZWN0U2VsZWN0Q29udGFpbmVyO1xuIiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgaHRtbEVudGl0aWVzIH0gZnJvbSAnLi4vdXRpbHMvVXRpbHMnO1xuXG5cbnZhciBTZWxlY3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZUtleTogJ2lkJyxcblx0XHRcdGxhYmVsS2V5OiAndGl0bGUnXG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cbiAgXHR2YXIgb3B0aW9uTm9kZXMgPSB0aGlzLnByb3BzLm9wdGlvbnMubWFwKG9wdGlvbiA9PiB7XG4gIFx0XHR2YXIgdmFsdWUgPSBvcHRpb25bdGhpcy5wcm9wcy52YWx1ZUtleV07XG4gIFx0XHR2YXIgbGFiZWwgPSBvcHRpb25bdGhpcy5wcm9wcy5sYWJlbEtleV07XG4gICAgICByZXR1cm4gKFxuICAgICAgXHQ8b3B0aW9uIGtleT17dmFsdWV9IHZhbHVlPXt2YWx1ZX0+XG4gICAgICBcdFx0e2h0bWxFbnRpdGllcyhsYWJlbCl9XG4gICAgICBcdDwvb3B0aW9uPlxuICAgICAgKTtcbiAgXHR9KTtcblxuXHRcdHJldHVybiAoXG5cdCAgXHQ8c2VsZWN0IFxuXHQgIFx0XHR7Li4udGhpcy5wcm9wc30gXG5cdCAgXHRcdGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIFxuXHRcdFx0PlxuXHQgIFx0XHR7b3B0aW9uTm9kZXN9XG5cdCAgXHQ8L3NlbGVjdD5cblx0XHQpO1xuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0SW5wdXQ7IiwiXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSb3V0ZXIsIHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcic7XG5cbmltcG9ydCBTZXR0aW5nc1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9TZXR0aW5nc1N0b3JlJztcbmltcG9ydCBTZXR0aW5nc1VzZXJzU3RvcmUgZnJvbSAnLi4vc3RvcmVzL1NldHRpbmdzVXNlcnNTdG9yZSc7XG5pbXBvcnQgeyBzYXZlU2V0dGluZ3MgfSBmcm9tICcuLi9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucyc7XG5pbXBvcnQgVGV4dElucHV0IGZyb20gJy4vVGV4dElucHV0LnJlYWN0JztcbmltcG9ydCBTZWxlY3RJbnB1dCBmcm9tICcuL1NlbGVjdElucHV0LnJlYWN0JztcbmltcG9ydCBVc2VyU2VsZWN0Q29udGFpbmVyIGZyb20gJy4vVXNlclNlbGVjdENvbnRhaW5lci5yZWFjdCc7XG5cblxudmFyIFNldHRpbmdzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFNldHRpbmdzU3RvcmUuZ2V0U2V0dGluZ3MoKTtcbiAgfSxcblxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoU2V0dGluZ3NTdG9yZS5nZXRTZXR0aW5ncygpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0U2V0dGluZ3NTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFNldHRpbmdzU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHZhciBncm91cElkID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmdyb3VwSWQpLnZhbHVlLnRyaW0oKTtcblx0XHR2YXIgZ3JvdXBTZWNyZXQgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuZ3JvdXBTZWNyZXQpLnZhbHVlLnRyaW0oKTtcblx0XHRpZiAoIWdyb3VwU2VjcmV0IHx8ICFncm91cElkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGNvbnRhaW5lciA9IHRoaXMucmVmcy51c2VyU2VsZWN0Q29udGFpbmVyO1xuXHRcdHZhciBzZWxlY3QgPSBjb250YWluZXIucmVmcy51c2VyU2VsZWN0O1xuXHRcdHZhciBzZWxlY3ROb2RlID0gUmVhY3QuZmluZERPTU5vZGUoc2VsZWN0KTtcblxuXHRcdHNhdmVTZXR0aW5ncyh7XG5cdFx0XHRncm91cElkOiBncm91cElkLFxuXHRcdFx0Z3JvdXBTZWNyZXQ6IGdyb3VwU2VjcmV0LFxuXHRcdFx0dXNlcklkOiBzZWxlY3QgPyBzZWxlY3ROb2RlLnZhbHVlIDogMCxcblx0XHRcdHVzZXJOYW1lOiBzZWxlY3QgPyAkKHNlbGVjdE5vZGUpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnRleHQoKSA6ICcnXG5cdFx0fSk7XG5cblx0XHRyZXR1cm47XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJzZXR0aW5nc1wiPlxuXHRcdFx0XHQ8Zm9ybSBjbGFzc05hbWU9XCJmb3JtLWhvcml6b250YWxcIiBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuXHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwiZ3JvdXAtaWRcIj5Hcm91cCBJRDwvbGFiZWw+XG5cdFx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdCAgICBcdDxUZXh0SW5wdXQgaWQ9XCJncm91cC1pZFwiIHJlZj1cImdyb3VwSWRcIiBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUuZ3JvdXBJZH0gLz5cblx0XHRcdFx0ICAgIDwvZGl2PlxuXHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwiZ3JvdXAtc2VjcmV0XCI+R3JvdXAgU2VjcmV0PC9sYWJlbD5cblx0XHRcdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0ICAgIFx0PFRleHRJbnB1dCBpZD1cImdyb3VwLXNlY3JldFwiIHJlZj1cImdyb3VwU2VjcmV0XCIgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLmdyb3VwU2VjcmV0fSAvPlxuXHRcdFx0XHQgICAgPC9kaXY+XG5cdFx0XHRcdCAgPC9kaXY+XG5cdFx0XHRcdCAgPFVzZXJTZWxlY3RDb250YWluZXIgXG5cdFx0XHRcdCAgXHRyZWY9XCJ1c2VyU2VsZWN0Q29udGFpbmVyXCJcblx0XHRcdFx0ICAgIHVzZXJJZD17dGhpcy5zdGF0ZS51c2VySWR9XG5cdFx0XHRcdFx0Lz5cblx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi10b29sYmFyXCI+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIHNhdmUtc2V0dGluZ3MtYnRuXCI+U2F2ZTwvYnV0dG9uPiBcblx0XHRcdFx0XHRcdDxMaW5rIHRvPVwidHJhY2tlclwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4tc20gYmFjay1zZXR0aW5ncy1idG5cIj5CYWNrPC9MaW5rPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU2V0dGluZ3M7XG4iLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjbG9uZSB9IGZyb20gJ3VuZGVyc2NvcmUnO1xuXG5pbXBvcnQgeyBnZXRNaWxlc3RvbmVUYXNrcywgc2V0TWlsZXN0b25lVGFzaywgc2V0VGFza0Rlc2NyaXB0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucyc7XG5pbXBvcnQgTWlsZXN0b25lU3RvcmUgZnJvbSAnLi4vc3RvcmVzL01pbGVzdG9uZVN0b3JlJztcbmltcG9ydCBNaWxlc3RvbmVUYXNrU3RvcmUgZnJvbSAnLi4vc3RvcmVzL01pbGVzdG9uZVRhc2tTdG9yZSc7XG5pbXBvcnQgVGFza1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9UYXNrU3RvcmUnO1xuaW1wb3J0IFNlbGVjdElucHV0IGZyb20gJy4vU2VsZWN0SW5wdXQucmVhY3QnO1xuaW1wb3J0IFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyIGZyb20gJy4vVGFza1R5cGVTZWxlY3RDb250YWluZXIucmVhY3QnO1xuXG5cbnZhciBUYXNrU2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldFRhc2tzU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0YXNrczogTWlsZXN0b25lVGFza1N0b3JlLmdldE1pbGVzdG9uZVRhc2tzKCksXG5cdFx0XHR0YXNrOiBNaWxlc3RvbmVUYXNrU3RvcmUuZ2V0TWlsZXN0b25lVGFza0lkKCksXG5cdFx0XHRkZXNjcmlwdGlvbjogVGFza1N0b3JlLmdldFRhc2tEZXNjcmlwdGlvbigpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VGFza3NTdGF0ZSgpO1xuXHR9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gIFx0aWYgKHRoaXMuaXNNb3VudGVkKCkpIHtcbiAgICBcdHRoaXMuc2V0U3RhdGUodGhpcy5nZXRUYXNrc1N0YXRlKCkpO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0Z2V0TWlsZXN0b25lVGFza3MoTWlsZXN0b25lU3RvcmUuZ2V0TWlsZXN0b25lSWQoKSk7XG4gIFx0TWlsZXN0b25lVGFza1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgXHRUYXNrU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRNaWxlc3RvbmVUYXNrU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICBcdFRhc2tTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0aGFuZGxlTWlsZXN0b25lVGFza0NoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblx0XHRzZXRNaWxlc3RvbmVUYXNrKHRhcmdldC52YWx1ZSk7XG5cdH0sXG5cblx0aGFuZGxlVGFza0Rlc2NyaXB0aW9uQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHNldFRhc2tEZXNjcmlwdGlvbihldmVudC50YXJnZXQudmFsdWUpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUudGFza3MubGVuZ3RoID4gMCAmJiB0aGlzLnN0YXRlLnRhc2sgIT0gLTEpIHtcblxuXHRcdFx0dmFyIHRhc2tzID0gY2xvbmUodGhpcy5zdGF0ZS50YXNrcyk7XG5cdFx0XHR0YXNrcy5wdXNoKHsgaWQ6IC0xLCBkZXNjcmlwdGlvbjogJ05ldyB0YXNrLi4uJyB9KTtcblxuXHRcdFx0cmV0dXJuIChcblx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwibWlsZXN0b25lLXRhc2tcIj5Ub2RvPC9sYWJlbD5cblx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0XHQ8U2VsZWN0SW5wdXQgXG5cdFx0XHRcdFx0XHRcdGlkPVwibWlsZXN0b25lLXRhc2tcIiBcblx0XHRcdFx0XHRcdFx0cmVmPVwibWlsZXN0b25lVGFza1wiIFxuXHRcdFx0XHRcdFx0XHRsYWJlbEtleT1cImRlc2NyaXB0aW9uXCIgXG5cdFx0XHRcdFx0XHRcdHZhbHVlPXt0aGlzLnN0YXRlLnRhc2t9IFxuXHRcdFx0XHRcdFx0XHRvcHRpb25zPXt0YXNrc30gXG5cdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU1pbGVzdG9uZVRhc2tDaGFuZ2V9IFxuXHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImN1c3RvbS10YXNrXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHRcdFx0ICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJ0YXNrLXR5cGVcIj5UeXBlPC9sYWJlbD5cblx0XHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0XHQgIFx0PFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyIC8+XG5cdFx0XHRcdFx0ICA8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG5cdFx0XHRcdFx0ICBcdDx0ZXh0YXJlYSBcblx0XHRcdFx0XHQgIFx0XHRpZD1cInRhc2stZGVzY3JpcHRpb25cIiBcblx0XHRcdFx0XHQgIFx0XHRwbGFjZWhvbGRlcj1cIlRhc2sgZGVzY3JpcHRpb24uLi5cIiBcblx0XHRcdFx0XHQgIFx0XHRjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBcblx0XHRcdFx0XHQgIFx0XHRyb3dzPVwiM1wiIFxuXHRcdFx0XHRcdCAgXHRcdHZhbHVlPXt0aGlzLnN0YXRlLmRlc2NyaXB0aW9ufSBcblx0XHRcdFx0XHQgIFx0XHRvbkNoYW5nZT17dGhpcy5oYW5kbGVUYXNrRGVzY3JpcHRpb25DaGFuZ2V9IFxuXHRcdFx0XHRcdCAgXHQvPlxuXHRcdFx0XHRcdCAgPC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0KTtcblx0XHR9XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUYXNrU2VsZWN0Q29udGFpbmVyO1xuIiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBzZXRUYXNrVHlwZSwgZ2V0VGFza1R5cGVzIH0gZnJvbSAnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucyc7XG5pbXBvcnQgVGFza1R5cGVTdG9yZSBmcm9tICcuLi9zdG9yZXMvVGFza1R5cGVTdG9yZSc7XG5pbXBvcnQgU2VsZWN0SW5wdXQgZnJvbSAnLi9TZWxlY3RJbnB1dC5yZWFjdCc7XG5cblxudmFyIFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldFRhc2tzU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0YXNrVHlwZXM6IFRhc2tUeXBlU3RvcmUuZ2V0VGFza1R5cGVzKCksXG5cdFx0XHR0YXNrVHlwZTogVGFza1R5cGVTdG9yZS5nZXRUYXNrVHlwZUlkKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRUYXNrc1N0YXRlKCk7XG5cdH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgXHRpZiAodGhpcy5pc01vdW50ZWQoKSkge1xuICAgIFx0dGhpcy5zZXRTdGF0ZSh0aGlzLmdldFRhc2tzU3RhdGUoKSk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRnZXRUYXNrVHlwZXMoKTtcbiAgXHRUYXNrVHlwZVN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0VGFza1R5cGVTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdHNldFRhc2tUeXBlKHRhcmdldC52YWx1ZSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PFNlbGVjdElucHV0IFxuXHRcdFx0XHRpZD1cInRhc2stdHlwZVwiIFxuXHRcdFx0XHRyZWY9XCJ0YXNrVHlwZVwiIFxuXHRcdFx0XHRsYWJlbEtleT1cIm5hbWVcIiBcblx0XHRcdFx0dmFsdWU9e3RoaXMuc3RhdGUudGFza1R5cGV9IFxuXHRcdFx0XHRvcHRpb25zPXt0aGlzLnN0YXRlLnRhc2tUeXBlc30gXG5cdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHQvPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUYXNrVHlwZVNlbGVjdENvbnRhaW5lcjtcbiIsIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSb3V0ZXIsIHsgTGluaywgUm91dGVIYW5kbGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyJztcblxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IERpc3BhdGNoZXIgfSBmcm9tICdmbHV4JztcblxudmFyIGd1aSA9IG5vZGVSZXF1aXJlKCdudy5ndWknKTtcblxudmFyIFRlYW1sZWFkZXJUaW1lQXBwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcblxuICAgIGZ1bmN0aW9uIHNob3dEZXZUb29scygpIHtcbiAgICAgIGd1aS5XaW5kb3cuZ2V0KCkuc2hvd0RldlRvb2xzKCk7XG4gICAgfVxuXG4gICAgdmFyIGRldkxpbmsgPSBcbiAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzc05hbWU9XCJkZXYtbGlua1wiIG9uQ2xpY2s9e3Nob3dEZXZUb29sc30+XG4gICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXdyZW5jaFwiPjwvaT5cbiAgICAgIDwvYT47XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhcHBcIj5cblx0ICBcdFx0PGhlYWRlcj5cblx0ICBcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImhlYWRlcmV4dFwiPjwvZGl2PlxuXHQgIFx0XHRcdDxMaW5rIHRvPVwic2V0dGluZ3NcIiBjbGFzc05hbWU9XCJzZXR0aW5ncy1saW5rXCIgYWN0aXZlQ2xhc3NOYW1lPVwiYWN0aXZlXCI+XG5cdCAgXHRcdFx0XHQ8aSBjbGFzc05hbWU9XCJmYSBmYS1jb2dcIj48L2k+XG5cdCAgXHRcdFx0PC9MaW5rPlxuICAgICAgICAgIHtkZXZMaW5rfVxuXHQgIFx0XHQ8L2hlYWRlcj5cblxuICAgICAgICB7LyogdGhpcyBpcyB0aGUgaW1wb3J0YW50IHBhcnQgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgPFJvdXRlSGFuZGxlci8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRlYW1sZWFkZXJUaW1lQXBwO1xuIiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5cbnZhciBUZXh0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Ly8gZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0Ly8gXHRyZXR1cm4geyB2YWx1ZTogJycgfTtcblx0Ly8gfSxcblxuXHQvLyBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcblx0Ly8gXHR0aGlzLnNldFN0YXRlKHsgdmFsdWU6IG5leHRQcm9wcy5zYXZlZFZhbHVlIH0pO1xuXHQvLyB9LFxuXG5cdC8vIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0Ly8gXHR0aGlzLnNldFN0YXRlKHsgdmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZSB9KTtcbiAvLyAgfSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdC8vdmFyIHZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZTtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGlucHV0IFxuXHRcdFx0XHR7Li4udGhpcy5wcm9wc31cblx0XHRcdFx0dHlwZT1cInRleHRcIiBcblx0XHRcdFx0Y2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgXG5cdFx0XHRcdC8vdmFsdWU9e3ZhbHVlfVxuXHRcdFx0XHQvL29uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHQvPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUZXh0SW5wdXQ7IiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgQ3VzdG9tZXJTdG9yZSBmcm9tICcuLi9zdG9yZXMvQ3VzdG9tZXJTdG9yZSc7XG5pbXBvcnQgUHJvamVjdFN0b3JlIGZyb20gJy4uL3N0b3Jlcy9Qcm9qZWN0U3RvcmUnO1xuaW1wb3J0IE1pbGVzdG9uZVN0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVTdG9yZSc7XG5pbXBvcnQgTWlsZXN0b25lVGFza1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVUYXNrU3RvcmUnO1xuaW1wb3J0IFRhc2tUeXBlU3RvcmUgZnJvbSAnLi4vc3RvcmVzL1Rhc2tUeXBlU3RvcmUnO1xuaW1wb3J0IFNldHRpbmdzU3RvcmUgZnJvbSAnLi4vc3RvcmVzL1NldHRpbmdzU3RvcmUnO1xuaW1wb3J0IFRhc2tTdG9yZSBmcm9tICcuLi9zdG9yZXMvVGFza1N0b3JlJztcblxuaW1wb3J0IFByb2plY3RTZWxlY3RDb250YWluZXIgZnJvbSAnLi9Qcm9qZWN0U2VsZWN0Q29udGFpbmVyLnJlYWN0JztcbmltcG9ydCBNaWxlc3RvbmVTZWxlY3RDb250YWluZXIgZnJvbSAnLi9NaWxlc3RvbmVTZWxlY3RDb250YWluZXIucmVhY3QnO1xuaW1wb3J0IFRhc2tTZWxlY3RDb250YWluZXIgZnJvbSAnLi9UYXNrU2VsZWN0Q29udGFpbmVyLnJlYWN0JztcblxuXG52YXIgVHJhY2tlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRUcmFja2VyU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRwcm9qZWN0OiBQcm9qZWN0U3RvcmUuZ2V0UHJvamVjdElkKCksXG5cdFx0XHRtaWxlc3RvbmU6IE1pbGVzdG9uZVN0b3JlLmdldE1pbGVzdG9uZUlkKCksXG5cdFx0XHRtaWxlc3RvbmVUYXNrOiBNaWxlc3RvbmVUYXNrU3RvcmUuZ2V0TWlsZXN0b25lVGFza0lkKCksXG5cdFx0XHRjb250YWN0T3JDb21wYW55OiBDdXN0b21lclN0b3JlLmdldENvbnRhY3RPckNvbXBhbnkoKSxcblx0XHRcdGNvbnRhY3RPckNvbXBhbnlJZDogQ3VzdG9tZXJTdG9yZS5nZXRDb250YWN0T3JDb21wYW55SWQoKSxcblx0XHRcdHRhc2tUeXBlOiBUYXNrVHlwZVN0b3JlLmdldFRhc2tUeXBlSWQoKSxcblx0XHRcdHVzZXJJZDogU2V0dGluZ3NTdG9yZS5nZXRVc2VySWQoKSxcblx0XHRcdGRlc2NyaXB0aW9uOiBNaWxlc3RvbmVUYXNrU3RvcmUuZ2V0TWlsZXN0b25lVGFza0Rlc2NyaXB0aW9uKCkgfHwgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFRhc2tTdG9yZS5nZXRUYXNrRGVzY3JpcHRpb24oKVxuXHRcdH1cblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFRyYWNrZXJTdGF0ZSgpXG5cdH0sXG5cblx0aGFuZGxlU3VibWl0OiBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc29sZS5sb2codGhpcy5nZXRUcmFja2VyU3RhdGUoKSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ0cmFja2VyXCI+XG5cdFx0XHRcdDxmb3JtIGNsYXNzTmFtZT1cImZvcm0taG9yaXpvbnRhbFwiIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG5cblx0XHRcdFx0XHQ8UHJvamVjdFNlbGVjdENvbnRhaW5lciAvPlxuXHRcdFx0XHRcdDxNaWxlc3RvbmVTZWxlY3RDb250YWluZXIgLz5cblx0XHRcdFx0XHQ8VGFza1NlbGVjdENvbnRhaW5lciByZWY9XCJ0YXNrU2VsZWN0Q29udGFpbmVyXCIgLz5cblxuXHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLXRvb2xiYXJcIj5cblx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tc20gc3RhcnQtdGltZXItYnRuXCI+XG5cdFx0XHRcdFx0XHRcdFN0YXJ0IHRpbWVyXG5cdFx0XHRcdFx0XHQ8L2J1dHRvbj4gXG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZm9ybT5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUcmFja2VyXG4iLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUm91dGVyLCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInO1xuXG5pbXBvcnQgU2V0dGluZ3NTdG9yZSBmcm9tICcuLi9zdG9yZXMvU2V0dGluZ3NTdG9yZSc7XG5pbXBvcnQgU2V0dGluZ3NVc2Vyc1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9TZXR0aW5nc1VzZXJzU3RvcmUnO1xuaW1wb3J0IHsgZ2V0VXNlcnMgfSBmcm9tICcuLi9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucyc7XG5cbmltcG9ydCBTZWxlY3RJbnB1dCBmcm9tICcuL1NlbGVjdElucHV0LnJlYWN0JztcblxuXG52YXIgVXNlclNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRVc2Vyc1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dXNlcnM6IFNldHRpbmdzVXNlcnNTdG9yZS5nZXRVc2VycygpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VXNlcnNTdGF0ZSgpO1xuICB9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gIFx0aWYgKHRoaXMuaXNNb3VudGVkKCkpIHtcbiAgICBcdHRoaXMuc2V0U3RhdGUodGhpcy5nZXRVc2Vyc1N0YXRlKCkpO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0Z2V0VXNlcnMoKTtcbiAgXHRTZXR0aW5nc1VzZXJzU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRTZXR0aW5nc1VzZXJzU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUudXNlcnMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0XHRyZXR1cm4gKFxuXHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cInVzZXItc2VsZWN0XCI+U2VsZWN0IHVzZXI8L2xhYmVsPlxuXHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0ICAgIFx0PFNlbGVjdElucHV0IFxuXHRcdCAgICBcdFx0aWQ9XCJ1c2VyLXNlbGVjdFwiIFxuXHRcdCAgICBcdFx0cmVmPVwidXNlclNlbGVjdFwiIFxuXHRcdCAgICBcdFx0bGFiZWxLZXk9XCJuYW1lXCIgXG5cdFx0ICAgIFx0XHRvcHRpb25zPXt0aGlzLnN0YXRlLnVzZXJzfSBcblx0XHQgICAgXHRcdGRlZmF1bHRWYWx1ZT17dGhpcy5wcm9wcy51c2VySWR9XG5cdFx0ICAgIFx0Lz5cblx0XHQgICAgPC9kaXY+XG5cdFx0ICA8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVXNlclNlbGVjdENvbnRhaW5lcjtcbiIsIlxuaW1wb3J0IGtleU1pcnJvciBmcm9tICdrZXltaXJyb3InO1xuXG5leHBvcnQgZGVmYXVsdCBrZXlNaXJyb3Ioe1xuXHRTQVZFX1NFVFRJTkdTOiBudWxsLFxuXHRSRUNFSVZFX1VTRVJTOiBudWxsXG59KTtcbiIsIlxuaW1wb3J0IGtleU1pcnJvciBmcm9tICdrZXltaXJyb3InO1xuXG5leHBvcnQgZGVmYXVsdCBrZXlNaXJyb3Ioe1xuXHRSRUNFSVZFX1BST0pFQ1RTOiBudWxsLFxuXHRSRUNFSVZFX01JTEVTVE9ORVM6IG51bGwsXG5cdFJFQ0VJVkVfTUlMRVNUT05FX1RBU0tTOiBudWxsLFxuXHRSRUNFSVZFX1RBU0tfVFlQRVM6IG51bGwsXG5cdFNFVF9QUk9KRUNUOiBudWxsLFxuXHRTRVRfTUlMRVNUT05FOiBudWxsLFxuXHRTRVRfTUlMRVNUT05FX1RBU0s6IG51bGwsXG5cdFNFVF9DT05UQUNUX09SX0NPTVBBTlk6IG51bGwsXG5cdFNFVF9UQVNLX1RZUEU6IG51bGwsXG5cdFNFVF9UQVNLX0RFU0NSSVBUSU9OOiBudWxsXG59KTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEFwcERpc3BhdGNoZXJcbiAqXG4gKiBBIHNpbmdsZXRvbiB0aGF0IG9wZXJhdGVzIGFzIHRoZSBjZW50cmFsIGh1YiBmb3IgYXBwbGljYXRpb24gdXBkYXRlcy5cbiAqL1xuXG5pbXBvcnQgeyBEaXNwYXRjaGVyIH0gZnJvbSAnZmx1eCc7XG5leHBvcnQgZGVmYXVsdCBuZXcgRGlzcGF0Y2hlcigpO1xuIiwiXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSB9IGZyb20gJy4uL3V0aWxzL1N0b3JlVXRpbHMnO1xuXG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFRyYWNrZXJDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnO1xuXG5cbnZhciBfY29udGFjdE9yQ29tcGFueTtcbnZhciBfY29udGFjdE9yQ29tcGFueUlkO1xuXG52YXIgQ3VzdG9tZXJTdG9yZSA9IGNyZWF0ZVN0b3JlKHtcblxuXHRnZXRDb250YWN0T3JDb21wYW55KCkge1xuXHRcdHJldHVybiBfY29udGFjdE9yQ29tcGFueTtcblx0fSxcblxuXHRnZXRDb250YWN0T3JDb21wYW55SWQoKSB7XG5cdFx0cmV0dXJuIF9jb250YWN0T3JDb21wYW55SWQ7XG5cdH1cbn0pO1xuXG5DdXN0b21lclN0b3JlLmRpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGFjdGlvbiA9PiB7XG5cblx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9DT05UQUNUX09SX0NPTVBBTlk6XG5cdFx0XHRfY29udGFjdE9yQ29tcGFueSA9IGFjdGlvbi5vcHRpb247XG5cdFx0XHRfY29udGFjdE9yQ29tcGFueUlkID0gYWN0aW9uLmlkO1xuXHRcdFx0Q3VzdG9tZXJTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvL25vIG9wXG5cdH1cblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEN1c3RvbWVyU3RvcmU7XG4iLCJcbmltcG9ydCB7IGZpbmRXaGVyZSB9IGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBUcmFja2VyQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJztcbmltcG9ydCB7IGdldE1pbGVzdG9uZVRhc2tzIH0gZnJvbSAnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucyc7XG5pbXBvcnQgUHJvamVjdFN0b3JlIGZyb20gJy4uL3N0b3Jlcy9Qcm9qZWN0U3RvcmUnO1xuXG5cbnZhciBfbWlsZXN0b25lcyA9IFtdO1xudmFyIF9zZWxlY3RlZDtcblxudmFyIE1pbGVzdG9uZVN0b3JlID0gY3JlYXRlU3RvcmUoe1xuXG5cdGdldE1pbGVzdG9uZXMoKSB7XG5cdFx0cmV0dXJuIF9taWxlc3RvbmVzO1xuXHR9LFxuXG5cdGdldE1pbGVzdG9uZUlkKCkge1xuXHRcdHJldHVybiBfc2VsZWN0ZWQ7XG5cdH0sXG5cblx0Z2V0TWlsZXN0b25lKCkge1xuXHRcdHJldHVybiBmaW5kV2hlcmUoX21pbGVzdG9uZXMsIHsgaWQ6IF9zZWxlY3RlZCB9KTtcblx0fVxufSk7XG5cbk1pbGVzdG9uZVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGFjdGlvbiA9PiB7XG5cblx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9QUk9KRUNUOlxuXHRcdFx0QXBwRGlzcGF0Y2hlci53YWl0Rm9yKFtQcm9qZWN0U3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuXHRcdFx0X21pbGVzdG9uZXMgPSBbXTtcblx0XHRcdF9zZWxlY3RlZCA9IDA7XG5cdFx0XHRpZiAoUHJvamVjdFN0b3JlLmdldFByb2plY3RJZCgpID09IDApIHtcblx0XHRcdFx0TWlsZXN0b25lU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVTOlxuXHRcdFx0X21pbGVzdG9uZXMgPSBhY3Rpb24uZGF0YTtcblx0XHRcdC8vY29uc29sZS5sb2coX21pbGVzdG9uZXMpO1xuXHRcdFx0aWYgKF9taWxlc3RvbmVzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoX21pbGVzdG9uZXNbMF0uaWQpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnbWlsZXN0b25lJywgX3NlbGVjdGVkKTtcblx0XHRcdH1cblx0XHRcdE1pbGVzdG9uZVN0b3JlLmVtaXRDaGFuZ2UoKTtcblxuXHRcdFx0Z2V0TWlsZXN0b25lVGFza3MoX3NlbGVjdGVkKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9NSUxFU1RPTkU6XG5cdFx0XHRfc2VsZWN0ZWQgPSBwYXJzZUludChhY3Rpb24uaWQpO1xuXHRcdFx0Y29uc29sZS5sb2coJ21pbGVzdG9uZScsIF9zZWxlY3RlZCk7XG5cdFx0XHRNaWxlc3RvbmVTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cblx0XHRcdGdldE1pbGVzdG9uZVRhc2tzKF9zZWxlY3RlZCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvL25vIG9wXG5cdH1cblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IE1pbGVzdG9uZVN0b3JlO1xuIiwiXG5pbXBvcnQgeyBmaW5kV2hlcmUgfSBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCB7IGNyZWF0ZVN0b3JlIH0gZnJvbSAnLi4vdXRpbHMvU3RvcmVVdGlscyc7XG5cbmltcG9ydCBBcHBEaXNwYXRjaGVyIGZyb20gJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcic7XG5pbXBvcnQgVHJhY2tlckNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvVHJhY2tlckNvbnN0YW50cyc7XG5pbXBvcnQgUHJvamVjdFN0b3JlIGZyb20gJy4uL3N0b3Jlcy9Qcm9qZWN0U3RvcmUnO1xuaW1wb3J0IE1pbGVzdG9uZVN0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVTdG9yZSc7XG5cblxudmFyIF90YXNrcyA9IFtdO1xudmFyIF9zZWxlY3RlZDtcblxudmFyIE1pbGVzdG9uZVRhc2tTdG9yZSAgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0TWlsZXN0b25lVGFza3MoKSB7XG5cdFx0cmV0dXJuIF90YXNrcztcblx0fSxcblxuXHRnZXRNaWxlc3RvbmVUYXNrSWQoKSB7XG5cdFx0cmV0dXJuIF9zZWxlY3RlZDtcblx0fSxcblxuXHRnZXRNaWxlc3RvbmVUYXNrKCkge1xuXHRcdHJldHVybiBmaW5kV2hlcmUoX3Rhc2tzLCB7IGlkOiBfc2VsZWN0ZWQgfSk7XG5cdH0sXG5cblx0Z2V0TWlsZXN0b25lVGFza0Rlc2NyaXB0aW9uKCkge1xuXHRcdHZhciB0YXNrID0gdGhpcy5nZXRNaWxlc3RvbmVUYXNrKCk7XG5cdFx0cmV0dXJuIHRhc2sgPyB0YXNrLmRlc2NyaXB0aW9uIDogbnVsbDtcblx0fVxufSk7XG5cbk1pbGVzdG9uZVRhc2tTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfUFJPSkVDVDpcblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX01JTEVTVE9ORTpcblx0XHRcdEFwcERpc3BhdGNoZXIud2FpdEZvcihbTWlsZXN0b25lU3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuXHRcdFx0X3Rhc2tzID0gW107XG5cdFx0XHRfc2VsZWN0ZWQgPSAwO1xuXHRcdFx0aWYgKFByb2plY3RTdG9yZS5nZXRQcm9qZWN0SWQoKSA9PSAwKSB7XG5cdFx0XHRcdE1pbGVzdG9uZVRhc2tTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX01JTEVTVE9ORV9UQVNLUzpcblx0XHRcdF90YXNrcyA9IGFjdGlvbi5kYXRhO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhfdGFza3MpXG5cdFx0XHRpZiAoX3Rhc2tzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoX3Rhc2tzWzBdLmlkKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ3Rhc2snLCBfc2VsZWN0ZWQpO1xuXHRcdFx0fVxuXHRcdFx0TWlsZXN0b25lVGFza1N0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9NSUxFU1RPTkVfVEFTSzpcblx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KGFjdGlvbi5pZCk7XG5cdFx0XHRjb25zb2xlLmxvZygndGFzaycsIF9zZWxlY3RlZCk7XG5cdFx0XHRNaWxlc3RvbmVUYXNrU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5cbmV4cG9ydCBkZWZhdWx0IE1pbGVzdG9uZVRhc2tTdG9yZTtcbiIsIlxuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBUcmFja2VyQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJztcbmltcG9ydCB7IGdldFByb2plY3REZXRhaWxzLCBnZXRNaWxlc3RvbmVzIH0gZnJvbSAnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucyc7XG5cblxudmFyIF9wcm9qZWN0cyA9IFtdO1xudmFyIF9zZWxlY3RlZDtcblxudmFyIFByb2plY3RTdG9yZSAgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0UHJvamVjdHMoKSB7XG5cdFx0cmV0dXJuIF9wcm9qZWN0cztcblx0fSxcblxuXHRnZXRQcm9qZWN0SWQoKSB7XG5cdFx0cmV0dXJuIF9zZWxlY3RlZDtcblx0fVxufSk7XG5cblByb2plY3RTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX1BST0pFQ1RTOlxuXHRcdFx0X3Byb2plY3RzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRQcm9qZWN0U3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX1BST0pFQ1Q6XG5cdFx0XHRfc2VsZWN0ZWQgPSBwYXJzZUludChhY3Rpb24uaWQpO1xuXHRcdFx0Y29uc29sZS5sb2coJ3Byb2plY3QnLCBfc2VsZWN0ZWQpO1xuXHRcdFx0UHJvamVjdFN0b3JlLmVtaXRDaGFuZ2UoKTtcblxuXHRcdFx0Z2V0UHJvamVjdERldGFpbHMoX3NlbGVjdGVkKTtcblx0XHRcdGdldE1pbGVzdG9uZXMoX3NlbGVjdGVkKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8vbm8gb3Bcblx0fVxuXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvamVjdFN0b3JlO1xuIiwiXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBTZXR0aW5nc0NvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvU2V0dGluZ3NDb25zdGFudHMnO1xuXG5cbmZ1bmN0aW9uIF9zZXRTZXR0aW5ncyhkYXRhKSB7XG5cdHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCksIGRhdGEpO1xuXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2V0dGluZ3MnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xufVxuXG52YXIgU2V0dGluZ3NTdG9yZSAgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0U2V0dGluZ3MoKSB7XG5cdFx0cmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpIHx8IHt9O1xuXHR9LFxuXG5cdGdldFVzZXJJZCgpIHtcblx0XHRyZXR1cm4gcGFyc2VJbnQodGhpcy5nZXRTZXR0aW5ncygpLnVzZXJJZCk7XG5cdH1cbn0pO1xuXG5cblNldHRpbmdzU3RvcmUuZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoYWN0aW9uID0+IHtcblxuXHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRjYXNlIFNldHRpbmdzQ29uc3RhbnRzLlNBVkVfU0VUVElOR1M6XG5cdFx0XHRfc2V0U2V0dGluZ3MoYWN0aW9uLmRhdGEpO1xuXHRcdFx0U2V0dGluZ3NTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvL25vIG9wXG5cdH1cblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNldHRpbmdzU3RvcmU7XG4iLCJcbmltcG9ydCB7IGNyZWF0ZVN0b3JlIH0gZnJvbSAnLi4vdXRpbHMvU3RvcmVVdGlscyc7XG5cbmltcG9ydCBBcHBEaXNwYXRjaGVyIGZyb20gJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcic7XG5pbXBvcnQgU2V0dGluZ3NDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL1NldHRpbmdzQ29uc3RhbnRzJztcbmltcG9ydCB7IGdldFVzZXJzIH0gZnJvbSAnLi4vYWN0aW9ucy9TZXR0aW5nc0FjdGlvbnMnO1xuXG5pbXBvcnQgU2V0dGluZ3NTdG9yZSBmcm9tICcuL1NldHRpbmdzU3RvcmUnO1xuXG5cbnZhciBfdXNlcnMgPSBbXTtcblxudmFyIFNldHRpbmdzVXNlcnNTdG9yZSAgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0VXNlcnMoKSB7XG5cdFx0cmV0dXJuIF91c2Vycztcblx0fVxufSk7XG5cblNldHRpbmdzVXNlcnNTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgU2V0dGluZ3NDb25zdGFudHMuU0FWRV9TRVRUSU5HUzpcblx0XHRcdEFwcERpc3BhdGNoZXIud2FpdEZvcihbU2V0dGluZ3NTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG5cdFx0XHRnZXRVc2VycygpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFNldHRpbmdzQ29uc3RhbnRzLlJFQ0VJVkVfVVNFUlM6XG5cdFx0XHRfdXNlcnMgPSBhY3Rpb24uZGF0YTtcblx0XHRcdFNldHRpbmdzVXNlcnNTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvL25vIG9wXG5cdH1cblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNldHRpbmdzVXNlcnNTdG9yZTtcbiIsIlxuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBUcmFja2VyQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJztcbmltcG9ydCBNaWxlc3RvbmVUYXNrU3RvcmUgZnJvbSAnLi4vc3RvcmVzL01pbGVzdG9uZVRhc2tTdG9yZSc7XG5cblxudmFyIF9kZXNjcmlwdGlvbjtcblxudmFyIFRhc2tTdG9yZSAgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0VGFza0Rlc2NyaXB0aW9uKCkge1xuXHRcdHJldHVybiBfZGVzY3JpcHRpb247XG5cdH1cbn0pO1xuXG5UYXNrU3RvcmUuZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoYWN0aW9uID0+IHtcblxuXHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX1RBU0tfREVTQ1JJUFRJT046XG5cdFx0XHRfZGVzY3JpcHRpb24gPSBhY3Rpb24udHh0O1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhfZGVzY3JpcHRpb24pO1xuXHRcdFx0VGFza1N0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8vbm8gb3Bcblx0fVxuXG59KTtcblxuXG5leHBvcnQgZGVmYXVsdCBUYXNrU3RvcmU7XG4iLCJcbmltcG9ydCB7IGZpbmRXaGVyZSB9IGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBUcmFja2VyQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJztcbmltcG9ydCBNaWxlc3RvbmVUYXNrU3RvcmUgZnJvbSAnLi4vc3RvcmVzL01pbGVzdG9uZVRhc2tTdG9yZSc7XG5cblxudmFyIF90YXNrVHlwZXMgPSBbXTtcbnZhciBfc2VsZWN0ZWQ7XG5cbnZhciBUYXNrVHlwZVN0b3JlICA9IGNyZWF0ZVN0b3JlKHtcblxuXHRnZXRUYXNrVHlwZXMoKSB7XG5cdFx0cmV0dXJuIF90YXNrVHlwZXM7XG5cdH0sXG5cblx0Z2V0VGFza1R5cGVJZCgpIHtcblx0XHRyZXR1cm4gX3NlbGVjdGVkO1xuXHR9LFxuXG5cdGdldFRhc2tUeXBlKCkge1xuXHRcdHJldHVybiBmaW5kV2hlcmUoX3Rhc2tUeXBlcywgeyBpZDogX3NlbGVjdGVkIH0pO1xuXHR9XG59KTtcblxuVGFza1R5cGVTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX1RBU0tfVFlQRVM6XG5cdFx0XHRfdGFza1R5cGVzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRpZiAoX3Rhc2tUeXBlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KF90YXNrVHlwZXNbMF0uaWQpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygndGFza190eXBlJywgX3NlbGVjdGVkKTtcblx0XHRcdH1cblx0XHRcdFRhc2tUeXBlU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX1RBU0tfVFlQRTpcblx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KGFjdGlvbi5pZCk7XG5cdFx0XHRjb25zb2xlLmxvZygndGFza190eXBlJywgX3NlbGVjdGVkKTtcblx0XHRcdFRhc2tUeXBlU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVfVEFTS1M6XG5cdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9NSUxFU1RPTkVfVEFTSzpcblx0XHRcdEFwcERpc3BhdGNoZXIud2FpdEZvcihbTWlsZXN0b25lVGFza1N0b3JlLmRpc3BhdGNoVG9rZW5dKTtcblxuXHRcdFx0dmFyIG1pbGVzdG9uZVRhc2sgPSBNaWxlc3RvbmVUYXNrU3RvcmUuZ2V0TWlsZXN0b25lVGFzaygpO1xuXHRcdFx0aWYgKG1pbGVzdG9uZVRhc2spIHtcblx0XHRcdFx0dmFyIG1pbGVzdG9uZVRhc2tUeXBlTmFtZSA9IG1pbGVzdG9uZVRhc2sudGFza190eXBlO1xuXHRcdFx0XHR2YXIgbWlsZXN0b25lVGFza1R5cGUgPSBmaW5kV2hlcmUoX3Rhc2tUeXBlcywgeyBuYW1lOiBtaWxlc3RvbmVUYXNrVHlwZU5hbWUgfSk7XG5cdFx0XHRcdGlmIChtaWxlc3RvbmVUYXNrVHlwZSkge1xuXHRcdFx0XHRcdHZhciBtaWxlc3RvbmVUYXNrVHlwZUlkID0gbWlsZXN0b25lVGFza1R5cGUuaWQ7XG5cdFx0XHRcdFx0X3NlbGVjdGVkID0gbWlsZXN0b25lVGFza1R5cGVJZDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8vbm8gb3Bcblx0fVxuXG59KTtcblxuXG5leHBvcnQgZGVmYXVsdCBUYXNrVHlwZVN0b3JlO1xuIiwiXG5pbXBvcnQgYXNzaWduIGZyb20gJ29iamVjdC1hc3NpZ24nO1xuaW1wb3J0IHsgZWFjaCwgaXNGdW5jdGlvbiB9IGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuY29uc3QgQ0hBTkdFX0VWRU5UID0gJ2NoYW5nZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdG9yZShzcGVjKSB7XG4gIGNvbnN0IGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKDApO1xuXG4gIGNvbnN0IHN0b3JlID0gYXNzaWduKHtcbiAgICBlbWl0Q2hhbmdlKCkge1xuICAgICAgZW1pdHRlci5lbWl0KENIQU5HRV9FVkVOVCk7XG4gICAgfSxcblxuICAgIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgICBlbWl0dGVyLm9uKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICAgIH0sXG5cbiAgICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgICAgZW1pdHRlci5yZW1vdmVMaXN0ZW5lcihDSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0sIHNwZWMpO1xuXG4gIC8vIEF1dG8tYmluZCBzdG9yZSBtZXRob2RzIGZvciBjb252ZW5pZW5jZVxuICBlYWNoKHN0b3JlLCAodmFsLCBrZXkpID0+IHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICBzdG9yZVtrZXldID0gc3RvcmVba2V5XS5iaW5kKHN0b3JlKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBzdG9yZTtcbn0iLCJcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgU2V0dGluZ3NTdG9yZSBmcm9tICcuLi9zdG9yZXMvU2V0dGluZ3NTdG9yZSc7XG5cdFxuZXhwb3J0IGZ1bmN0aW9uIGFwaVJlcXVlc3Qob3B0aW9ucykge1xuXG5cdHZhciBkZWZhdWx0cyA9IHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRkYXRhOiB7fSxcbiAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihvcHRpb25zLnVybCwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSk7XG4gICAgfVxuXHR9O1xuXG5cdHZhciBhcHBTZXR0aW5ncyA9IFNldHRpbmdzU3RvcmUuZ2V0U2V0dGluZ3MoKTtcblx0aWYgKGFwcFNldHRpbmdzKSB7XG5cdFx0ZGVmYXVsdHMuZGF0YSA9IHtcblx0XHRcdGFwaV9ncm91cDogYXBwU2V0dGluZ3MuZ3JvdXBJZCxcblx0XHRcdGFwaV9zZWNyZXQ6IGFwcFNldHRpbmdzLmdyb3VwU2VjcmV0XG5cdFx0fTtcblx0fVxuXG5cdHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHRydWUsIGRlZmF1bHRzLCBvcHRpb25zKTtcblx0aWYgKHNldHRpbmdzLmRhdGEuYXBpX2dyb3VwICYmIHNldHRpbmdzLmRhdGEuYXBpX3NlY3JldCkge1xuXHRcdCQuYWpheCgnaHR0cHM6Ly93d3cudGVhbWxlYWRlci5iZS9hcGknICsgb3B0aW9ucy51cmwsIHNldHRpbmdzKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVrZXkoYXJyLCBsb29rdXApIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgb2JqID0gYXJyW2ldO1xuXHRcdGZvciAodmFyIGZyb21LZXkgaW4gbG9va3VwKSB7XG5cdFx0XHR2YXIgdG9LZXkgPSBsb29rdXBbZnJvbUtleV07XG5cdFx0XHR2YXIgdmFsdWUgPSBvYmpbZnJvbUtleV07XG5cdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0b2JqW3RvS2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRkZWxldGUgb2JqW2Zyb21LZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gYXJyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaHRtbEVudGl0aWVzKHN0cmluZykge1xuXHRyZXR1cm4gc3RyaW5nXG5cdFx0LnJlcGxhY2UoLyZhbXA7L2csICcmJylcblx0XHQucmVwbGFjZSgvJiMwMzk7L2csIFwiJ1wiKTtcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIlxuaW1wb3J0IFJvdXRlcyBmcm9tICcuL1JvdXRlcyc7XG5pbXBvcnQgU3RhdHVzQmFyIGZyb20gJy4vU3RhdHVzQmFyJztcbmltcG9ydCBNZW51QmFyIGZyb20gJy4vTWVudUJhcic7XG5cbm5ldyBTdGF0dXNCYXIoKTtcbm5ldyBNZW51QmFyKCk7XG5uZXcgUm91dGVzKCk7XG4iXX0=
