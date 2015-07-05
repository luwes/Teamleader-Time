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

function getUsers(data) {
		(0, _utilsUtils.apiRequest)({
				url: '/getUsers.php',
				success: function success(options) {
						var data = (0, _utilsUtils.rekey)(options, { id: 'value', name: 'label' });
						_dispatcherAppDispatcher2['default'].dispatch({
								type: _constantsSettingsConstants2['default'].RECEIVE_USERS,
								data: data
						});
				}
		});
}

},{"../constants/SettingsConstants":16,"../dispatcher/AppDispatcher":18,"../utils/Utils":27}],5:[function(require,module,exports){
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

function getTaskTypes() {
	(0, _utilsUtils.apiRequest)({
		url: '/getTaskTypes.php',
		success: function success(json) {
			var options = (0, _utilsUtils.rekey)(json, { id: 'value', name: 'label' });

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

},{"../constants/TrackerConstants":17,"../dispatcher/AppDispatcher":18,"../utils/Utils":27,"underscore":"underscore"}],6:[function(require,module,exports){
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
		this.setState(this.getMilestonesState());
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

},{"../actions/TrackerActions":5,"../stores/ProjectStore":22,"./SelectInput.react":8,"react":"react"}],8:[function(require,module,exports){
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

},{"../utils/Utils":27,"react":"react"}],9:[function(require,module,exports){
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
			task: _storesMilestoneTaskStore2['default'].getMilestoneTaskId()
		};
	},

	getInitialState: function getInitialState() {
		return this.getTasksState();
	},

	_onChange: function _onChange() {
		this.setState(this.getTasksState());
	},

	componentDidMount: function componentDidMount() {
		(0, _actionsTrackerActions.getMilestoneTasks)(_storesMilestoneStore2['default'].getMilestoneId());
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

},{"../actions/TrackerActions":5,"../stores/MilestoneStore":20,"../stores/MilestoneTaskStore":21,"./SelectInput.react":8,"./TaskTypeSelectContainer.react":11,"react":"react"}],11:[function(require,module,exports){
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
			taskType: _storesTaskTypeStore2['default'].getTaskType()
		};
	},

	getInitialState: function getInitialState() {
		return this.getTasksState();
	},

	_onChange: function _onChange() {
		this.setState(this.getTasksState());
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
			value: this.state.taskType,
			options: this.state.taskTypes,
			onChange: this.handleChange
		});
	}
});

exports['default'] = TaskTypeSelectContainer;
module.exports = exports['default'];

},{"../actions/TrackerActions":5,"../stores/TaskTypeStore":25,"./SelectInput.react":8,"react":"react"}],12:[function(require,module,exports){
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

},{"events":28,"flux":"flux","react":"react","react-router":"react-router"}],13:[function(require,module,exports){
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
			taskType: _storesTaskTypeStore2['default'].getTaskType()
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

},{"../stores/CustomerStore":19,"../stores/MilestoneStore":20,"../stores/MilestoneTaskStore":21,"../stores/ProjectStore":22,"../stores/TaskTypeStore":25,"./MilestoneSelectContainer.react":6,"./ProjectSelectContainer.react":7,"./TaskSelectContainer.react":10,"react":"react"}],15:[function(require,module,exports){
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
	SET_TASK_TYPE: null
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

},{"../constants/TrackerConstants":17,"../dispatcher/AppDispatcher":18,"../utils/StoreUtils":26}],20:[function(require,module,exports){
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

	getMilestoneId: function getMilestoneId() {
		return _selected;
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
			console.log(_milestones);
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

},{"../actions/TrackerActions":5,"../constants/TrackerConstants":17,"../dispatcher/AppDispatcher":18,"../stores/ProjectStore":22,"../utils/StoreUtils":26}],21:[function(require,module,exports){
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

},{"../constants/TrackerConstants":17,"../dispatcher/AppDispatcher":18,"../stores/MilestoneStore":20,"../stores/ProjectStore":22,"../utils/StoreUtils":26}],22:[function(require,module,exports){
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

},{"../actions/TrackerActions":5,"../constants/TrackerConstants":17,"../dispatcher/AppDispatcher":18,"../utils/StoreUtils":26}],23:[function(require,module,exports){
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

},{"../constants/SettingsConstants":16,"../dispatcher/AppDispatcher":18,"../utils/StoreUtils":26,"jquery":"jquery"}],24:[function(require,module,exports){
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

},{"../actions/SettingsActions":4,"../constants/SettingsConstants":16,"../dispatcher/AppDispatcher":18,"../utils/StoreUtils":26,"./SettingsStore":23}],25:[function(require,module,exports){
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

var _tasks = [];
var _selected;

var TaskTypeStore = (0, _utilsStoreUtils.createStore)({

	getTaskTypes: function getTaskTypes() {
		return _tasks;
	},

	getTaskType: function getTaskType() {
		return _selected;
	}
});

TaskTypeStore.dispatchToken = _dispatcherAppDispatcher2['default'].register(function (action) {

	switch (action.type) {

		case _constantsTrackerConstants2['default'].RECEIVE_TASK_TYPES:
			_tasks = action.data;
			if (_tasks.length > 0) {
				_selected = parseInt(_tasks[0].value);
				console.log('task_type', _selected);
			}
			TaskTypeStore.emitChange();
			break;

		case _constantsTrackerConstants2['default'].SET_TASK_TYPE:
			_selected = parseInt(action.id);
			console.log('task', _selected);
			TaskTypeStore.emitChange();
			break;

		// case TrackerConstants.RECEIVE_MILESTONE_TASKS:
		// case TrackerConstants.SET_MILESTONE_TASK:
		// 	AppDispatcher.waitFor([MilestoneTaskStore.dispatchToken]);

		// 	var milestoneTasks = MilestoneTaskStore.getMilestoneTasks();
		// 	var milestoneTask = MilestoneTaskStore.getMilestoneTaskId();

		// 	console.log(milestoneTasks);
		// 	console.log(milestoneTask);

		// 	break;

		default:
		//no op
	}
});

exports['default'] = TaskTypeStore;
module.exports = exports['default'];

},{"../constants/TrackerConstants":17,"../dispatcher/AppDispatcher":18,"../stores/MilestoneTaskStore":21,"../utils/StoreUtils":26}],26:[function(require,module,exports){
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

},{"events":28,"object-assign":"object-assign","underscore":"underscore"}],27:[function(require,module,exports){
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

},{"../stores/SettingsStore":23,"jquery":"jquery"}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{"./MenuBar":1,"./Routes":2,"./StatusBar":3}]},{},[29])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9NZW51QmFyLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvUm91dGVzLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvU3RhdHVzQmFyLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvYWN0aW9ucy9TZXR0aW5nc0FjdGlvbnMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9NaWxlc3RvbmVTZWxlY3RDb250YWluZXIucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1Byb2plY3RTZWxlY3RDb250YWluZXIucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1NlbGVjdElucHV0LnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9TZXR0aW5ncy5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVGFza1NlbGVjdENvbnRhaW5lci5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVGFza1R5cGVTZWxlY3RDb250YWluZXIucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1RlYW1sZWFkZXJUaW1lQXBwLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UZXh0SW5wdXQucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1RyYWNrZXIucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1VzZXJTZWxlY3RDb250YWluZXIucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb25zdGFudHMvU2V0dGluZ3NDb25zdGFudHMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb25zdGFudHMvVHJhY2tlckNvbnN0YW50cy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3N0b3Jlcy9DdXN0b21lclN0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL01pbGVzdG9uZVN0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL01pbGVzdG9uZVRhc2tTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3N0b3Jlcy9Qcm9qZWN0U3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvU2V0dGluZ3NTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3N0b3Jlcy9TZXR0aW5nc1VzZXJzU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvVGFza1R5cGVTdG9yZS5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3V0aWxzL1N0b3JlVXRpbHMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy91dGlscy9VdGlscy5qc3giLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQ0EsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztJQUdYLE9BQU8sR0FFaEIsU0FGUyxPQUFPLEdBRWI7dUJBRk0sT0FBTzs7QUFJekIsS0FBSSxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7QUFDM0MsS0FBSTtBQUNGLElBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRTtBQUNyQyxXQUFRLEVBQUUsS0FBSyxFQUNoQixDQUFDLENBQUM7QUFDSCxLQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7RUFDNUIsQ0FBQyxPQUFNLEVBQUUsRUFBRTtBQUNWLFNBQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQ3pCO0NBQ0Y7O3FCQWJtQixPQUFPOzs7Ozs7Ozs7Ozs7OztxQkNIVixPQUFPOzs7OzJCQUNtQixjQUFjOzs7O2dEQUU1QixzQ0FBc0M7Ozs7c0NBQ2hELDRCQUE0Qjs7Ozt1Q0FDM0IsNkJBQTZCOzs7O0lBRzdCLE1BQU0sR0FFZixTQUZTLE1BQU0sR0FFWjt1QkFGTSxNQUFNOztBQUl4QixLQUFJLE1BQU0sR0FDUjtlQVowQixLQUFLO0lBWXhCLElBQUksRUFBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLEdBQUcsRUFBQyxPQUFPLCtDQUFvQjtFQUNwRCw4Q0Fid0IsS0FBSyxJQWF0QixJQUFJLEVBQUMsVUFBVSxFQUFDLE9BQU8sc0NBQVcsR0FBRTtFQUMzQyw4Q0FkVSxZQUFZLElBY1IsSUFBSSxFQUFDLFNBQVMsRUFBQyxPQUFP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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7c0JDNVNtQixVQUFVOzs7O3lCQUNQLGFBQWE7Ozs7dUJBQ2YsV0FBVzs7OztBQUUvQiw0QkFBZSxDQUFDO0FBQ2hCLDBCQUFhLENBQUM7QUFDZCx5QkFBWSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxudmFyIGd1aSA9IG5vZGVSZXF1aXJlKCdudy5ndWknKTtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZW51QmFyIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblxuXHQgIHZhciBtYiA9IG5ldyBndWkuTWVudSh7IHR5cGU6ICdtZW51YmFyJyB9KTtcblx0ICB0cnkge1xuXHQgICAgbWIuY3JlYXRlTWFjQnVpbHRpbignVGVhbWxlYWRlciBUaW1lJywge1xuXHQgICAgICBoaWRlRWRpdDogZmFsc2UsXG5cdCAgICB9KTtcblx0ICAgIGd1aS5XaW5kb3cuZ2V0KCkubWVudSA9IG1iO1xuXHQgIH0gY2F0Y2goZXgpIHtcblx0ICAgIGNvbnNvbGUubG9nKGV4Lm1lc3NhZ2UpO1xuXHQgIH1cblx0fVxufVxuIiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJvdXRlciwgeyBEZWZhdWx0Um91dGUsIFJvdXRlIH0gZnJvbSAncmVhY3Qtcm91dGVyJztcblxuaW1wb3J0IFRlYW1sZWFkZXJUaW1lQXBwIGZyb20gJy4vY29tcG9uZW50cy9UZWFtbGVhZGVyVGltZUFwcC5yZWFjdCc7XG5pbXBvcnQgVHJhY2tlciBmcm9tICcuL2NvbXBvbmVudHMvVHJhY2tlci5yZWFjdCc7XG5pbXBvcnQgU2V0dGluZ3MgZnJvbSAnLi9jb21wb25lbnRzL1NldHRpbmdzLnJlYWN0JztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb3V0ZXMge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXG5cdCAgdmFyIHJvdXRlcyA9IChcblx0ICAgIDxSb3V0ZSBuYW1lPVwiYXBwXCIgcGF0aD1cIi9cIiBoYW5kbGVyPXtUZWFtbGVhZGVyVGltZUFwcH0+XG5cdCAgICAgIDxSb3V0ZSBuYW1lPVwic2V0dGluZ3NcIiBoYW5kbGVyPXtTZXR0aW5nc30vPlxuXHQgICAgICA8RGVmYXVsdFJvdXRlIG5hbWU9XCJ0cmFja2VyXCIgaGFuZGxlcj17VHJhY2tlcn0vPlxuXHQgICAgPC9Sb3V0ZT5cblx0ICApO1xuXG5cdCAgUm91dGVyLnJ1bihyb3V0ZXMsIGZ1bmN0aW9uIChIYW5kbGVyKSB7XG5cdCAgICBSZWFjdC5yZW5kZXIoPEhhbmRsZXIvPiwgZG9jdW1lbnQuYm9keSk7XG5cdCAgfSk7XG5cdH1cbn0iLCJcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5cbnZhciBndWkgPSBub2RlUmVxdWlyZSgnbncuZ3VpJyk7XG52YXIgd2luZG93ID0gZ3VpLldpbmRvdy5nZXQoKTtcblxuXG52YXIgaXNWaXNpYmxlID0gZmFsc2U7XG52YXIgaGVpZ2h0ID0gMDtcbnZhciB3aWR0aCA9IDA7XG5cbmZ1bmN0aW9uIF90b2dnbGUoZSkge1xuXHRpc1Zpc2libGUgPyB3aW5kb3cuaGlkZSgpIDogX3Nob3cuYXBwbHkodGhpcywgW2UueCwgZS55XSk7XG5cdGlzVmlzaWJsZSA9ICFpc1Zpc2libGU7XG59XG5cbmZ1bmN0aW9uIF9zaG93KHgsIHkpIHtcbiAgd2luZG93Lm1vdmVUbyh4IC0gKCQoJy5hcHAnKS53aWR0aCgpIC8gMikgLSA2LCB5KTtcbiAgX2ZpdFdpbmRvd1RvQ29udGVudCgpO1xuICB3aW5kb3cuc2hvdygpO1xuICB3aW5kb3cuZm9jdXMoKTtcbn1cblxuZnVuY3Rpb24gX29uV2luZG93Qmx1cigpIHtcblx0d2luZG93LmhpZGUoKTtcblx0aXNWaXNpYmxlID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF9maXRXaW5kb3dUb0NvbnRlbnQoKSB7XG5cdHZhciBoZWkgPSAkKCcuYXBwJykuaGVpZ2h0KCkgKyAxMDA7XG5cdHZhciB3aWQgPSAkKCcuYXBwJykud2lkdGgoKSArIDQwO1xuXG5cdGlmICh3aWR0aCAhPSB3aWQgfHwgaGVpZ2h0ICE9IGhlaSkge1xuXHRcdHdpbmRvdy5yZXNpemVUbyh3aWQsIGhlaSk7XG5cdFx0d2lkdGggPSB3aWQ7XG5cdFx0aGVpZ2h0ID0gaGVpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXR1c0JhciB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cblx0ICAvLyBpZiAoIXNlc3Npb25TdG9yYWdlLmluaXRpYWxpemVkU3RhdHVzQmFyKSB7XG5cdCAgLy8gICBzZXNzaW9uU3RvcmFnZS5pbml0aWFsaXplZFN0YXR1c0JhciA9IHRydWU7XG5cblx0ICAgIHZhciB0cmF5ID0gbmV3IGd1aS5UcmF5KHtcblx0ICAgICAgICB0aXRsZTogJycsXG5cdCAgICAgICAgaWNvbjogJ2ltYWdlcy9pY29uLnBuZycsXG5cdCAgICAgICAgYWx0aWNvbjogJ2ltYWdlcy9pY29uLnBuZycsXG5cdCAgICAgICAgaWNvbnNBcmVUZW1wbGF0ZXM6IGZhbHNlXG5cdCAgICB9KTtcblx0ICAgIHRyYXkub24oJ2NsaWNrJywgX3RvZ2dsZSk7XG5cblx0ICAgIHdpbmRvdy5vbignYmx1cicsIF9vbldpbmRvd0JsdXIpO1xuXG5cdFx0XHQoZnVuY3Rpb24gYW5pbWxvb3AoKSB7XG5cdFx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltbG9vcCk7XG5cdFx0XHRcdF9maXRXaW5kb3dUb0NvbnRlbnQoKTtcblx0XHRcdH0pKCk7XG5cdCAgLy99XG5cdH1cbn1cbiIsIlxuaW1wb3J0IHsgYXBpUmVxdWVzdCwgcmVrZXkgfSBmcm9tICcuLi91dGlscy9VdGlscyc7XG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFNldHRpbmdzQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVTZXR0aW5ncyhkYXRhKSB7XG4gIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgIHR5cGU6IFNldHRpbmdzQ29uc3RhbnRzLlNBVkVfU0VUVElOR1MsXG4gICAgZGF0YTogZGF0YVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVzZXJzKGRhdGEpIHtcblx0YXBpUmVxdWVzdCh7XG5cdFx0dXJsOiAnL2dldFVzZXJzLnBocCcsXG5cdFx0c3VjY2VzczogKG9wdGlvbnMpID0+IHtcblx0XHRcdHZhciBkYXRhID0gcmVrZXkob3B0aW9ucywgeyBpZDogJ3ZhbHVlJywgbmFtZTogJ2xhYmVsJyB9KTtcblx0ICBcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHQgIFx0XHR0eXBlOiBTZXR0aW5nc0NvbnN0YW50cy5SRUNFSVZFX1VTRVJTLFxuXHQgIFx0XHRkYXRhOiBkYXRhXG5cdCAgXHR9KTtcbiAgICB9XG5cdH0pO1xufVxuIiwiXG5pbXBvcnQgeyB3aGVyZSB9IGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IHsgYXBpUmVxdWVzdCwgcmVrZXkgfSBmcm9tICcuLi91dGlscy9VdGlscyc7XG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFRyYWNrZXJDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL1RyYWNrZXJDb25zdGFudHMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9qZWN0cygpIHtcblx0YXBpUmVxdWVzdCh7XG5cdFx0dXJsOiAnL2dldFByb2plY3RzLnBocCcsXG5cdFx0ZGF0YToge1xuXHRcdFx0YW1vdW50OiAxMDAsXG5cdFx0XHRwYWdlbm86IDBcblx0XHR9LFxuXHRcdHN1Y2Nlc3M6IChqc29uKSA9PiB7XG5cdFx0XHR2YXIgb3B0aW9ucyA9IHJla2V5KGpzb24sIHsgaWQ6ICd2YWx1ZScsIHRpdGxlOiAnbGFiZWwnIH0pO1xuXHRcdFx0b3B0aW9ucyA9IHdoZXJlKG9wdGlvbnMsIHsgcGhhc2U6ICdhY3RpdmUnIH0pO1xuXG5cdFx0XHRpZiAob3B0aW9ucy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdG9wdGlvbnMudW5zaGlmdCh7IHZhbHVlOiAwLCBsYWJlbDogJ0Nob29zZS4uLicgfSk7XG5cdFx0XHR9XG5cblx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHQgICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfUFJPSkVDVFMsXG5cdCAgICAgIGRhdGE6IG9wdGlvbnNcblx0ICAgIH0pO1xuICAgIH1cblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRQcm9qZWN0KGlkKSB7XG4gIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuU0VUX1BST0pFQ1QsXG4gICAgaWQ6IGlkXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvamVjdERldGFpbHMocHJvamVjdCkge1xuXHRpZiAocHJvamVjdCA+IDApIHtcblx0XHRhcGlSZXF1ZXN0KHtcblx0XHRcdHVybDogJy9nZXRQcm9qZWN0LnBocCcsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHByb2plY3RfaWQ6IHByb2plY3Rcblx0XHRcdH0sXG5cdFx0XHRzdWNjZXNzOiAoZGF0YSkgPT4ge1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKGRhdGEpXG5cblx0XHQgICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5TRVRfQ09OVEFDVF9PUl9DT01QQU5ZLFxuXHRcdCAgICAgIG9wdGlvbjogZGF0YS5jb250YWN0X29yX2NvbXBhbnksXG5cdFx0ICAgICAgaWQ6IGRhdGEuY29udGFjdF9vcl9jb21wYW55X2lkXG5cdFx0ICAgIH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNaWxlc3RvbmVzKHByb2plY3QpIHtcblx0aWYgKHByb2plY3QgPiAwKSB7XG5cdFx0YXBpUmVxdWVzdCh7XG5cdFx0XHR1cmw6ICcvZ2V0TWlsZXN0b25lc0J5UHJvamVjdC5waHAnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwcm9qZWN0X2lkOiBwcm9qZWN0XG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogKGpzb24pID0+IHtcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSByZWtleShqc29uLCB7IGlkOiAndmFsdWUnLCB0aXRsZTogJ2xhYmVsJyB9KTtcblx0XHRcdFx0b3B0aW9ucyA9IHdoZXJlKG9wdGlvbnMsIHsgY2xvc2VkOiAwIH0pO1xuXG5cdFx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdCAgICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuUkVDRUlWRV9NSUxFU1RPTkVTLFxuXHRcdCAgICAgIGRhdGE6IG9wdGlvbnNcblx0XHQgICAgfSk7XG4gICAgICB9XG5cdFx0fSk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldE1pbGVzdG9uZShpZCkge1xuICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlNFVF9NSUxFU1RPTkUsXG4gICAgaWQ6IGlkXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWlsZXN0b25lVGFza3MobWlsZXN0b25lKSB7XG5cblx0aWYgKG1pbGVzdG9uZSA+IDApIHtcblxuXHRcdGFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFRhc2tzQnlNaWxlc3RvbmUucGhwJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWlsZXN0b25lX2lkOiBtaWxlc3RvbmVcblx0XHRcdH0sXG5cdFx0XHRzdWNjZXNzOiAoanNvbikgPT4ge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IHJla2V5KGpzb24sIHsgaWQ6ICd2YWx1ZScsIGRlc2NyaXB0aW9uOiAnbGFiZWwnIH0pO1xuXHRcdFx0XHRvcHRpb25zID0gd2hlcmUob3B0aW9ucywgeyBkb25lOiAwIH0pO1xuXG5cdFx0XHRcdHZhciBhcHBTZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpO1xuXHRcdFx0XHRpZiAoYXBwU2V0dGluZ3MgJiYgYXBwU2V0dGluZ3MudXNlck5hbWUpIHtcblx0XHRcdFx0XHRvcHRpb25zID0gd2hlcmUob3B0aW9ucywgeyBvd25lcl9uYW1lOiBhcHBTZXR0aW5ncy51c2VyTmFtZSB9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChvcHRpb25zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRvcHRpb25zLnB1c2goeyB2YWx1ZTogLTEsIGxhYmVsOiAnTmV3IHRhc2suLi4nIH0pO1xuXHRcdFx0XHR9XG5cblx0XHQgICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0ICAgICAgdHlwZTogVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX01JTEVTVE9ORV9UQVNLUyxcblx0XHQgICAgICBkYXRhOiBvcHRpb25zXG5cdFx0ICAgIH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRNaWxlc3RvbmVUYXNrKGlkKSB7XG4gIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuU0VUX01JTEVTVE9ORV9UQVNLLFxuICAgIGlkOiBpZFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhc2tUeXBlcygpIHtcblx0YXBpUmVxdWVzdCh7XG5cdFx0dXJsOiAnL2dldFRhc2tUeXBlcy5waHAnLFxuXHRcdHN1Y2Nlc3M6IChqc29uKSA9PiB7XG5cdFx0XHR2YXIgb3B0aW9ucyA9IHJla2V5KGpzb24sIHsgaWQ6ICd2YWx1ZScsIG5hbWU6ICdsYWJlbCcgfSk7XG5cblx0ICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHQgICAgICB0eXBlOiBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfVEFTS19UWVBFUyxcblx0ICAgICAgZGF0YTogb3B0aW9uc1xuXHQgICAgfSk7XG5cdCAgfVxuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFRhc2tUeXBlKGlkKSB7XG4gIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgIHR5cGU6IFRyYWNrZXJDb25zdGFudHMuU0VUX1RBU0tfVFlQRSxcbiAgICBpZDogaWRcbiAgfSk7XG59XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IGdldE1pbGVzdG9uZXMsIHNldE1pbGVzdG9uZSB9IGZyb20gJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnO1xuaW1wb3J0IFByb2plY3RTdG9yZSBmcm9tICcuLi9zdG9yZXMvUHJvamVjdFN0b3JlJztcbmltcG9ydCBNaWxlc3RvbmVTdG9yZSBmcm9tICcuLi9zdG9yZXMvTWlsZXN0b25lU3RvcmUnO1xuaW1wb3J0IFNlbGVjdElucHV0IGZyb20gJy4vU2VsZWN0SW5wdXQucmVhY3QnO1xuXG5cbnZhciBNaWxlc3RvbmVTZWxlY3RDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0TWlsZXN0b25lc1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bWlsZXN0b25lczogTWlsZXN0b25lU3RvcmUuZ2V0TWlsZXN0b25lcygpLFxuXHRcdFx0bWlsZXN0b25lOiBNaWxlc3RvbmVTdG9yZS5nZXRNaWxlc3RvbmVJZCgpXG5cdFx0fVxuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0TWlsZXN0b25lc1N0YXRlKCk7XG5cdH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0TWlsZXN0b25lc1N0YXRlKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRnZXRNaWxlc3RvbmVzKFByb2plY3RTdG9yZS5nZXRQcm9qZWN0SWQoKSk7XG4gIFx0TWlsZXN0b25lU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRNaWxlc3RvbmVTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdHNldE1pbGVzdG9uZSh0YXJnZXQudmFsdWUpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUubWlsZXN0b25lcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXHRcdHJldHVybiAoXG5cdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwibWlsZXN0b25lXCI+TWlsZXN0b25lPC9sYWJlbD5cblx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdDxTZWxlY3RJbnB1dCBcblx0XHRcdFx0XHRcdGlkPVwibWlsZXN0b25lXCIgXG5cdFx0XHRcdFx0XHRyZWY9XCJtaWxlc3RvbmVcIiBcblx0XHRcdFx0XHRcdHZhbHVlPXt0aGlzLnN0YXRlLm1pbGVzdG9uZX1cblx0XHRcdFx0XHRcdG9wdGlvbnM9e3RoaXMuc3RhdGUubWlsZXN0b25lc30gXG5cdFx0XHRcdFx0XHRvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IFxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IE1pbGVzdG9uZVNlbGVjdENvbnRhaW5lcjsiLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IGdldFByb2plY3RzLCBzZXRQcm9qZWN0IH0gZnJvbSAnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucyc7XG5pbXBvcnQgUHJvamVjdFN0b3JlIGZyb20gJy4uL3N0b3Jlcy9Qcm9qZWN0U3RvcmUnO1xuaW1wb3J0IFNlbGVjdElucHV0IGZyb20gJy4vU2VsZWN0SW5wdXQucmVhY3QnO1xuXG5cbnZhciBQcm9qZWN0U2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldFByb2plY3RzU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRwcm9qZWN0czogUHJvamVjdFN0b3JlLmdldFByb2plY3RzKCksXG5cdFx0XHRwcm9qZWN0OiBQcm9qZWN0U3RvcmUuZ2V0UHJvamVjdElkKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRQcm9qZWN0c1N0YXRlKCk7XG5cdH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0UHJvamVjdHNTdGF0ZSgpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0Z2V0UHJvamVjdHMoKTtcbiAgXHRQcm9qZWN0U3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRQcm9qZWN0U3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblx0XHRzZXRQcm9qZWN0KHRhcmdldC52YWx1ZSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cInByb2plY3RcIj5Qcm9qZWN0PC9sYWJlbD5cblx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdDxTZWxlY3RJbnB1dCBcblx0XHRcdFx0XHRcdGlkPVwicHJvamVjdFwiIFxuXHRcdFx0XHRcdFx0cmVmPVwicHJvamVjdFwiIFxuXHRcdFx0XHRcdFx0dmFsdWU9e3RoaXMuc3RhdGUucHJvamVjdH1cblx0XHRcdFx0XHRcdG9wdGlvbnM9e3RoaXMuc3RhdGUucHJvamVjdHN9IFxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSBcblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBQcm9qZWN0U2VsZWN0Q29udGFpbmVyO1xuIiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgaHRtbEVudGl0aWVzIH0gZnJvbSAnLi4vdXRpbHMvVXRpbHMnO1xuXG5cbnZhciBTZWxlY3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gIFx0dmFyIG9wdGlvbk5vZGVzID0gdGhpcy5wcm9wcy5vcHRpb25zLm1hcChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICBcdDxvcHRpb24ga2V5PXtvcHRpb24udmFsdWV9IHZhbHVlPXtvcHRpb24udmFsdWV9PntodG1sRW50aXRpZXMob3B0aW9uLmxhYmVsKX08L29wdGlvbj5cbiAgICAgICk7XG4gIFx0fSk7XG5cblx0XHRyZXR1cm4gKFxuXHQgIFx0PHNlbGVjdCBcblx0ICBcdFx0ey4uLnRoaXMucHJvcHN9IFxuXHQgIFx0XHRjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBcblx0XHRcdD5cblx0ICBcdFx0e29wdGlvbk5vZGVzfVxuXHQgIFx0PC9zZWxlY3Q+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNlbGVjdElucHV0OyIsIlxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUm91dGVyLCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInO1xuXG5pbXBvcnQgU2V0dGluZ3NTdG9yZSBmcm9tICcuLi9zdG9yZXMvU2V0dGluZ3NTdG9yZSc7XG5pbXBvcnQgU2V0dGluZ3NVc2Vyc1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9TZXR0aW5nc1VzZXJzU3RvcmUnO1xuaW1wb3J0IHsgc2F2ZVNldHRpbmdzIH0gZnJvbSAnLi4vYWN0aW9ucy9TZXR0aW5nc0FjdGlvbnMnO1xuaW1wb3J0IFRleHRJbnB1dCBmcm9tICcuL1RleHRJbnB1dC5yZWFjdCc7XG5pbXBvcnQgU2VsZWN0SW5wdXQgZnJvbSAnLi9TZWxlY3RJbnB1dC5yZWFjdCc7XG5pbXBvcnQgVXNlclNlbGVjdENvbnRhaW5lciBmcm9tICcuL1VzZXJTZWxlY3RDb250YWluZXIucmVhY3QnO1xuXG5cbnZhciBTZXR0aW5ncyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCk7XG4gIH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKFNldHRpbmdzU3RvcmUuZ2V0U2V0dGluZ3MoKSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFNldHRpbmdzU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRTZXR0aW5nc1N0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR2YXIgZ3JvdXBJZCA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5ncm91cElkKS52YWx1ZS50cmltKCk7XG5cdFx0dmFyIGdyb3VwU2VjcmV0ID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmdyb3VwU2VjcmV0KS52YWx1ZS50cmltKCk7XG5cdFx0aWYgKCFncm91cFNlY3JldCB8fCAhZ3JvdXBJZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBjb250YWluZXIgPSB0aGlzLnJlZnMudXNlclNlbGVjdENvbnRhaW5lcjtcblx0XHR2YXIgc2VsZWN0ID0gY29udGFpbmVyLnJlZnMudXNlclNlbGVjdDtcblx0XHR2YXIgc2VsZWN0Tm9kZSA9IFJlYWN0LmZpbmRET01Ob2RlKHNlbGVjdCk7XG5cblx0XHRzYXZlU2V0dGluZ3Moe1xuXHRcdFx0Z3JvdXBJZDogZ3JvdXBJZCxcblx0XHRcdGdyb3VwU2VjcmV0OiBncm91cFNlY3JldCxcblx0XHRcdHVzZXJJZDogc2VsZWN0ID8gc2VsZWN0Tm9kZS52YWx1ZSA6IDAsXG5cdFx0XHR1c2VyTmFtZTogc2VsZWN0ID8gJChzZWxlY3ROb2RlKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS50ZXh0KCkgOiAnJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwic2V0dGluZ3NcIj5cblx0XHRcdFx0PGZvcm0gY2xhc3NOYW1lPVwiZm9ybS1ob3Jpem9udGFsXCIgb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cblx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cImdyb3VwLWlkXCI+R3JvdXAgSUQ8L2xhYmVsPlxuXHRcdFx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHQgICAgXHQ8VGV4dElucHV0IGlkPVwiZ3JvdXAtaWRcIiByZWY9XCJncm91cElkXCIgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLmdyb3VwSWR9IC8+XG5cdFx0XHRcdCAgICA8L2Rpdj5cblx0XHRcdFx0ICA8L2Rpdj5cblx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cImdyb3VwLXNlY3JldFwiPkdyb3VwIFNlY3JldDwvbGFiZWw+XG5cdFx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdCAgICBcdDxUZXh0SW5wdXQgaWQ9XCJncm91cC1zZWNyZXRcIiByZWY9XCJncm91cFNlY3JldFwiIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS5ncm91cFNlY3JldH0gLz5cblx0XHRcdFx0ICAgIDwvZGl2PlxuXHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHQgIDxVc2VyU2VsZWN0Q29udGFpbmVyIFxuXHRcdFx0XHQgIFx0cmVmPVwidXNlclNlbGVjdENvbnRhaW5lclwiXG5cdFx0XHRcdCAgICB1c2VySWQ9e3RoaXMuc3RhdGUudXNlcklkfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJidG4tdG9vbGJhclwiPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSBzYXZlLXNldHRpbmdzLWJ0blwiPlNhdmU8L2J1dHRvbj4gXG5cdFx0XHRcdFx0XHQ8TGluayB0bz1cInRyYWNrZXJcIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtIGJhY2stc2V0dGluZ3MtYnRuXCI+QmFjazwvTGluaz5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNldHRpbmdzO1xuIiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBnZXRNaWxlc3RvbmVUYXNrcywgc2V0TWlsZXN0b25lVGFzayB9IGZyb20gJy4uL2FjdGlvbnMvVHJhY2tlckFjdGlvbnMnO1xuaW1wb3J0IE1pbGVzdG9uZVN0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVTdG9yZSc7XG5pbXBvcnQgTWlsZXN0b25lVGFza1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVUYXNrU3RvcmUnO1xuaW1wb3J0IFNlbGVjdElucHV0IGZyb20gJy4vU2VsZWN0SW5wdXQucmVhY3QnO1xuaW1wb3J0IFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyIGZyb20gJy4vVGFza1R5cGVTZWxlY3RDb250YWluZXIucmVhY3QnO1xuXG5cbnZhciBUYXNrU2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldFRhc2tzU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0YXNrczogTWlsZXN0b25lVGFza1N0b3JlLmdldE1pbGVzdG9uZVRhc2tzKCksXG5cdFx0XHR0YXNrOiBNaWxlc3RvbmVUYXNrU3RvcmUuZ2V0TWlsZXN0b25lVGFza0lkKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRUYXNrc1N0YXRlKCk7XG5cdH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0VGFza3NTdGF0ZSgpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0Z2V0TWlsZXN0b25lVGFza3MoTWlsZXN0b25lU3RvcmUuZ2V0TWlsZXN0b25lSWQoKSk7XG4gIFx0TWlsZXN0b25lVGFza1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0TWlsZXN0b25lVGFza1N0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cdFx0c2V0TWlsZXN0b25lVGFzayh0YXJnZXQudmFsdWUpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUudGFza3MubGVuZ3RoID4gMSAmJiB0aGlzLnN0YXRlLnRhc2sgIT0gLTEpIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cIm1pbGVzdG9uZS10YXNrXCI+VG9kbzwvbGFiZWw+XG5cdFx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdFx0PFNlbGVjdElucHV0IFxuXHRcdFx0XHRcdFx0XHRpZD1cIm1pbGVzdG9uZS10YXNrXCIgXG5cdFx0XHRcdFx0XHRcdHJlZj1cIm1pbGVzdG9uZVRhc2tcIiBcblx0XHRcdFx0XHRcdFx0dmFsdWU9e3RoaXMuc3RhdGUudGFza30gXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnM9e3RoaXMuc3RhdGUudGFza3N9IFxuXHRcdFx0XHRcdFx0XHRvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IFxuXHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImN1c3RvbS10YXNrXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHRcdFx0ICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJ0YXNrLXR5cGVcIj5UeXBlPC9sYWJlbD5cblx0XHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0XHQgIFx0PFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyIC8+XG5cdFx0XHRcdFx0ICA8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG5cdFx0XHRcdFx0ICBcdDx0ZXh0YXJlYSBpZD1cInRhc2stZGVzY3JpcHRpb25cIiByZWY9XCJ0YXNrRGVzY3JpcHRpb25cIiBwbGFjZWhvbGRlcj1cIlRhc2sgZGVzY3JpcHRpb24uLi5cIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiByb3dzPVwiM1wiPjwvdGV4dGFyZWE+XG5cdFx0XHRcdFx0ICA8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQpO1xuXHRcdH1cblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRhc2tTZWxlY3RDb250YWluZXI7XG4iLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IHNldFRhc2tUeXBlLCBnZXRUYXNrVHlwZXMgfSBmcm9tICcuLi9hY3Rpb25zL1RyYWNrZXJBY3Rpb25zJztcbmltcG9ydCBUYXNrVHlwZVN0b3JlIGZyb20gJy4uL3N0b3Jlcy9UYXNrVHlwZVN0b3JlJztcbmltcG9ydCBTZWxlY3RJbnB1dCBmcm9tICcuL1NlbGVjdElucHV0LnJlYWN0JztcblxuXG52YXIgVGFza1R5cGVTZWxlY3RDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0VGFza3NTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRhc2tUeXBlczogVGFza1R5cGVTdG9yZS5nZXRUYXNrVHlwZXMoKSxcblx0XHRcdHRhc2tUeXBlOiBUYXNrVHlwZVN0b3JlLmdldFRhc2tUeXBlKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRUYXNrc1N0YXRlKCk7XG5cdH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0VGFza3NTdGF0ZSgpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0Z2V0VGFza1R5cGVzKCk7XG4gIFx0VGFza1R5cGVTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFRhc2tUeXBlU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG5cdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblx0XHRzZXRUYXNrVHlwZSh0YXJnZXQudmFsdWUpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxTZWxlY3RJbnB1dCBcblx0XHRcdFx0aWQ9XCJ0YXNrLXR5cGVcIiBcblx0XHRcdFx0cmVmPVwidGFza1R5cGVcIiBcblx0XHRcdFx0dmFsdWU9e3RoaXMuc3RhdGUudGFza1R5cGV9IFxuXHRcdFx0XHRvcHRpb25zPXt0aGlzLnN0YXRlLnRhc2tUeXBlc30gXG5cdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHQvPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUYXNrVHlwZVNlbGVjdENvbnRhaW5lcjtcbiIsIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSb3V0ZXIsIHsgTGluaywgUm91dGVIYW5kbGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyJztcblxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IERpc3BhdGNoZXIgfSBmcm9tICdmbHV4JztcblxudmFyIGd1aSA9IG5vZGVSZXF1aXJlKCdudy5ndWknKTtcblxudmFyIFRlYW1sZWFkZXJUaW1lQXBwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcblxuICAgIGZ1bmN0aW9uIHNob3dEZXZUb29scygpIHtcbiAgICAgIGd1aS5XaW5kb3cuZ2V0KCkuc2hvd0RldlRvb2xzKCk7XG4gICAgfVxuXG4gICAgdmFyIGRldkxpbmsgPSBcbiAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzc05hbWU9XCJkZXYtbGlua1wiIG9uQ2xpY2s9e3Nob3dEZXZUb29sc30+XG4gICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXdyZW5jaFwiPjwvaT5cbiAgICAgIDwvYT47XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhcHBcIj5cblx0ICBcdFx0PGhlYWRlcj5cblx0ICBcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImhlYWRlcmV4dFwiPjwvZGl2PlxuXHQgIFx0XHRcdDxMaW5rIHRvPVwic2V0dGluZ3NcIiBjbGFzc05hbWU9XCJzZXR0aW5ncy1saW5rXCIgYWN0aXZlQ2xhc3NOYW1lPVwiYWN0aXZlXCI+XG5cdCAgXHRcdFx0XHQ8aSBjbGFzc05hbWU9XCJmYSBmYS1jb2dcIj48L2k+XG5cdCAgXHRcdFx0PC9MaW5rPlxuICAgICAgICAgIHtkZXZMaW5rfVxuXHQgIFx0XHQ8L2hlYWRlcj5cblxuICAgICAgICB7LyogdGhpcyBpcyB0aGUgaW1wb3J0YW50IHBhcnQgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgPFJvdXRlSGFuZGxlci8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRlYW1sZWFkZXJUaW1lQXBwO1xuIiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5cbnZhciBUZXh0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Ly8gZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0Ly8gXHRyZXR1cm4geyB2YWx1ZTogJycgfTtcblx0Ly8gfSxcblxuXHQvLyBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcblx0Ly8gXHR0aGlzLnNldFN0YXRlKHsgdmFsdWU6IG5leHRQcm9wcy5zYXZlZFZhbHVlIH0pO1xuXHQvLyB9LFxuXG5cdC8vIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0Ly8gXHR0aGlzLnNldFN0YXRlKHsgdmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZSB9KTtcbiAvLyAgfSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdC8vdmFyIHZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZTtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGlucHV0IFxuXHRcdFx0XHR7Li4udGhpcy5wcm9wc31cblx0XHRcdFx0dHlwZT1cInRleHRcIiBcblx0XHRcdFx0Y2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgXG5cdFx0XHRcdC8vdmFsdWU9e3ZhbHVlfVxuXHRcdFx0XHQvL29uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHQvPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUZXh0SW5wdXQ7IiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgQ3VzdG9tZXJTdG9yZSBmcm9tICcuLi9zdG9yZXMvQ3VzdG9tZXJTdG9yZSc7XG5pbXBvcnQgUHJvamVjdFN0b3JlIGZyb20gJy4uL3N0b3Jlcy9Qcm9qZWN0U3RvcmUnO1xuaW1wb3J0IE1pbGVzdG9uZVN0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVTdG9yZSc7XG5pbXBvcnQgTWlsZXN0b25lVGFza1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVUYXNrU3RvcmUnO1xuaW1wb3J0IFRhc2tUeXBlU3RvcmUgZnJvbSAnLi4vc3RvcmVzL1Rhc2tUeXBlU3RvcmUnO1xuXG5pbXBvcnQgUHJvamVjdFNlbGVjdENvbnRhaW5lciBmcm9tICcuL1Byb2plY3RTZWxlY3RDb250YWluZXIucmVhY3QnO1xuaW1wb3J0IE1pbGVzdG9uZVNlbGVjdENvbnRhaW5lciBmcm9tICcuL01pbGVzdG9uZVNlbGVjdENvbnRhaW5lci5yZWFjdCc7XG5pbXBvcnQgVGFza1NlbGVjdENvbnRhaW5lciBmcm9tICcuL1Rhc2tTZWxlY3RDb250YWluZXIucmVhY3QnO1xuXG5cbnZhciBUcmFja2VyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldFRyYWNrZXJTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHByb2plY3Q6IFByb2plY3RTdG9yZS5nZXRQcm9qZWN0SWQoKSxcblx0XHRcdG1pbGVzdG9uZTogTWlsZXN0b25lU3RvcmUuZ2V0TWlsZXN0b25lSWQoKSxcblx0XHRcdG1pbGVzdG9uZVRhc2s6IE1pbGVzdG9uZVRhc2tTdG9yZS5nZXRNaWxlc3RvbmVUYXNrSWQoKSxcblx0XHRcdGNvbnRhY3RPckNvbXBhbnk6IEN1c3RvbWVyU3RvcmUuZ2V0Q29udGFjdE9yQ29tcGFueSgpLFxuXHRcdFx0Y29udGFjdE9yQ29tcGFueUlkOiBDdXN0b21lclN0b3JlLmdldENvbnRhY3RPckNvbXBhbnlJZCgpLFxuXHRcdFx0dGFza1R5cGU6IFRhc2tUeXBlU3RvcmUuZ2V0VGFza1R5cGUoKVxuXHRcdH1cblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFRyYWNrZXJTdGF0ZSgpXG5cdH0sXG5cblx0aGFuZGxlU3VibWl0OiBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc29sZS5sb2codGhpcy5nZXRUcmFja2VyU3RhdGUoKSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ0cmFja2VyXCI+XG5cdFx0XHRcdDxmb3JtIGNsYXNzTmFtZT1cImZvcm0taG9yaXpvbnRhbFwiIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG5cblx0XHRcdFx0XHQ8UHJvamVjdFNlbGVjdENvbnRhaW5lciAvPlxuXHRcdFx0XHRcdDxNaWxlc3RvbmVTZWxlY3RDb250YWluZXIgLz5cblx0XHRcdFx0XHQ8VGFza1NlbGVjdENvbnRhaW5lciAvPlxuXG5cdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJidG4tdG9vbGJhclwiPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSBzdGFydC10aW1lci1idG5cIj5cblx0XHRcdFx0XHRcdFx0U3RhcnQgdGltZXJcblx0XHRcdFx0XHRcdDwvYnV0dG9uPiBcblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRyYWNrZXJcbiIsIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSb3V0ZXIsIHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcic7XG5cbmltcG9ydCBTZXR0aW5nc1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9TZXR0aW5nc1N0b3JlJztcbmltcG9ydCBTZXR0aW5nc1VzZXJzU3RvcmUgZnJvbSAnLi4vc3RvcmVzL1NldHRpbmdzVXNlcnNTdG9yZSc7XG5pbXBvcnQgeyBnZXRVc2VycyB9IGZyb20gJy4uL2FjdGlvbnMvU2V0dGluZ3NBY3Rpb25zJztcblxuaW1wb3J0IFNlbGVjdElucHV0IGZyb20gJy4vU2VsZWN0SW5wdXQucmVhY3QnO1xuXG5cbnZhciBVc2VyU2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldFVzZXJzU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHQndXNlcnMnOiBTZXR0aW5nc1VzZXJzU3RvcmUuZ2V0VXNlcnMoKVxuXHRcdH1cblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFVzZXJzU3RhdGUoKTtcbiAgfSxcblxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRVc2Vyc1N0YXRlKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRnZXRVc2VycygpO1xuICBcdFNldHRpbmdzVXNlcnNTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICBcdFNldHRpbmdzVXNlcnNTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS51c2Vycy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXHRcdHJldHVybiAoXG5cdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwidXNlci1zZWxlY3RcIj5TZWxlY3QgdXNlcjwvbGFiZWw+XG5cdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHQgICAgXHQ8U2VsZWN0SW5wdXQgXG5cdFx0ICAgIFx0XHRpZD1cInVzZXItc2VsZWN0XCIgXG5cdFx0ICAgIFx0XHRyZWY9XCJ1c2VyU2VsZWN0XCIgXG5cdFx0ICAgIFx0XHRvcHRpb25zPXt0aGlzLnN0YXRlLnVzZXJzfSBcblx0XHQgICAgXHRcdGRlZmF1bHRWYWx1ZT17dGhpcy5wcm9wcy51c2VySWR9XG5cdFx0ICAgIFx0Lz5cblx0XHQgICAgPC9kaXY+XG5cdFx0ICA8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVXNlclNlbGVjdENvbnRhaW5lcjtcbiIsIlxuaW1wb3J0IGtleU1pcnJvciBmcm9tICdrZXltaXJyb3InO1xuXG5leHBvcnQgZGVmYXVsdCBrZXlNaXJyb3Ioe1xuXHRTQVZFX1NFVFRJTkdTOiBudWxsLFxuXHRSRUNFSVZFX1VTRVJTOiBudWxsXG59KTtcbiIsIlxuaW1wb3J0IGtleU1pcnJvciBmcm9tICdrZXltaXJyb3InO1xuXG5leHBvcnQgZGVmYXVsdCBrZXlNaXJyb3Ioe1xuXHRSRUNFSVZFX1BST0pFQ1RTOiBudWxsLFxuXHRSRUNFSVZFX01JTEVTVE9ORVM6IG51bGwsXG5cdFJFQ0VJVkVfTUlMRVNUT05FX1RBU0tTOiBudWxsLFxuXHRSRUNFSVZFX1RBU0tfVFlQRVM6IG51bGwsXG5cdFNFVF9QUk9KRUNUOiBudWxsLFxuXHRTRVRfTUlMRVNUT05FOiBudWxsLFxuXHRTRVRfTUlMRVNUT05FX1RBU0s6IG51bGwsXG5cdFNFVF9DT05UQUNUX09SX0NPTVBBTlk6IG51bGwsXG5cdFNFVF9UQVNLX1RZUEU6IG51bGxcbn0pO1xuIiwiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQXBwRGlzcGF0Y2hlclxuICpcbiAqIEEgc2luZ2xldG9uIHRoYXQgb3BlcmF0ZXMgYXMgdGhlIGNlbnRyYWwgaHViIGZvciBhcHBsaWNhdGlvbiB1cGRhdGVzLlxuICovXG5cbmltcG9ydCB7IERpc3BhdGNoZXIgfSBmcm9tICdmbHV4JztcbmV4cG9ydCBkZWZhdWx0IG5ldyBEaXNwYXRjaGVyKCk7XG4iLCJcbmltcG9ydCB7IGNyZWF0ZVN0b3JlIH0gZnJvbSAnLi4vdXRpbHMvU3RvcmVVdGlscyc7XG5cbmltcG9ydCBBcHBEaXNwYXRjaGVyIGZyb20gJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcic7XG5pbXBvcnQgVHJhY2tlckNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvVHJhY2tlckNvbnN0YW50cyc7XG5cblxudmFyIF9jb250YWN0T3JDb21wYW55O1xudmFyIF9jb250YWN0T3JDb21wYW55SWQ7XG5cbnZhciBDdXN0b21lclN0b3JlID0gY3JlYXRlU3RvcmUoe1xuXG5cdGdldENvbnRhY3RPckNvbXBhbnkoKSB7XG5cdFx0cmV0dXJuIF9jb250YWN0T3JDb21wYW55O1xuXHR9LFxuXG5cdGdldENvbnRhY3RPckNvbXBhbnlJZCgpIHtcblx0XHRyZXR1cm4gX2NvbnRhY3RPckNvbXBhbnlJZDtcblx0fVxufSk7XG5cbkN1c3RvbWVyU3RvcmUuZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoYWN0aW9uID0+IHtcblxuXHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX0NPTlRBQ1RfT1JfQ09NUEFOWTpcblx0XHRcdF9jb250YWN0T3JDb21wYW55ID0gYWN0aW9uLm9wdGlvbjtcblx0XHRcdF9jb250YWN0T3JDb21wYW55SWQgPSBhY3Rpb24uaWQ7XG5cdFx0XHRDdXN0b21lclN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8vbm8gb3Bcblx0fVxuXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQ3VzdG9tZXJTdG9yZTtcbiIsIlxuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBUcmFja2VyQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJztcbmltcG9ydCB7IGdldE1pbGVzdG9uZVRhc2tzIH0gZnJvbSAnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucyc7XG5pbXBvcnQgUHJvamVjdFN0b3JlIGZyb20gJy4uL3N0b3Jlcy9Qcm9qZWN0U3RvcmUnO1xuXG5cbnZhciBfbWlsZXN0b25lcyA9IFtdO1xudmFyIF9zZWxlY3RlZDtcblxudmFyIE1pbGVzdG9uZVN0b3JlID0gY3JlYXRlU3RvcmUoe1xuXG5cdGdldE1pbGVzdG9uZXMoKSB7XG5cdFx0cmV0dXJuIF9taWxlc3RvbmVzO1xuXHR9LFxuXG5cdGdldE1pbGVzdG9uZUlkKCkge1xuXHRcdHJldHVybiBfc2VsZWN0ZWQ7XG5cdH1cbn0pO1xuXG5NaWxlc3RvbmVTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfUFJPSkVDVDpcblx0XHRcdEFwcERpc3BhdGNoZXIud2FpdEZvcihbUHJvamVjdFN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcblx0XHRcdF9taWxlc3RvbmVzID0gW107XG5cdFx0XHRfc2VsZWN0ZWQgPSAwO1xuXHRcdFx0aWYgKFByb2plY3RTdG9yZS5nZXRQcm9qZWN0SWQoKSA9PSAwKSB7XG5cdFx0XHRcdE1pbGVzdG9uZVN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfTUlMRVNUT05FUzpcblx0XHRcdF9taWxlc3RvbmVzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRjb25zb2xlLmxvZyhfbWlsZXN0b25lcyk7XG5cdFx0XHRpZiAoX21pbGVzdG9uZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRfc2VsZWN0ZWQgPSBwYXJzZUludChfbWlsZXN0b25lc1swXS52YWx1ZSk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdtaWxlc3RvbmUnLCBfc2VsZWN0ZWQpO1xuXHRcdFx0fVxuXHRcdFx0TWlsZXN0b25lU3RvcmUuZW1pdENoYW5nZSgpO1xuXG5cdFx0XHRnZXRNaWxlc3RvbmVUYXNrcyhfc2VsZWN0ZWQpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX01JTEVTVE9ORTpcblx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KGFjdGlvbi5pZCk7XG5cdFx0XHRjb25zb2xlLmxvZygnbWlsZXN0b25lJywgX3NlbGVjdGVkKTtcblx0XHRcdE1pbGVzdG9uZVN0b3JlLmVtaXRDaGFuZ2UoKTtcblxuXHRcdFx0Z2V0TWlsZXN0b25lVGFza3MoX3NlbGVjdGVkKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8vbm8gb3Bcblx0fVxuXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTWlsZXN0b25lU3RvcmU7XG4iLCJcbmltcG9ydCB7IGNyZWF0ZVN0b3JlIH0gZnJvbSAnLi4vdXRpbHMvU3RvcmVVdGlscyc7XG5cbmltcG9ydCBBcHBEaXNwYXRjaGVyIGZyb20gJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcic7XG5pbXBvcnQgVHJhY2tlckNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvVHJhY2tlckNvbnN0YW50cyc7XG5pbXBvcnQgUHJvamVjdFN0b3JlIGZyb20gJy4uL3N0b3Jlcy9Qcm9qZWN0U3RvcmUnO1xuaW1wb3J0IE1pbGVzdG9uZVN0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVTdG9yZSc7XG5cblxudmFyIF90YXNrcyA9IFtdO1xudmFyIF9zZWxlY3RlZDtcblxudmFyIE1pbGVzdG9uZVRhc2tTdG9yZSAgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0TWlsZXN0b25lVGFza3MoKSB7XG5cdFx0cmV0dXJuIF90YXNrcztcblx0fSxcblxuXHRnZXRNaWxlc3RvbmVUYXNrSWQoKSB7XG5cdFx0cmV0dXJuIF9zZWxlY3RlZDtcblx0fVxufSk7XG5cbk1pbGVzdG9uZVRhc2tTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfUFJPSkVDVDpcblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX01JTEVTVE9ORTpcblx0XHRcdEFwcERpc3BhdGNoZXIud2FpdEZvcihbTWlsZXN0b25lU3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuXHRcdFx0X3Rhc2tzID0gW107XG5cdFx0XHRfc2VsZWN0ZWQgPSAwO1xuXHRcdFx0aWYgKFByb2plY3RTdG9yZS5nZXRQcm9qZWN0SWQoKSA9PSAwKSB7XG5cdFx0XHRcdE1pbGVzdG9uZVRhc2tTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX01JTEVTVE9ORV9UQVNLUzpcblx0XHRcdF90YXNrcyA9IGFjdGlvbi5kYXRhO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhfdGFza3MpXG5cdFx0XHRpZiAoX3Rhc2tzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0X3NlbGVjdGVkID0gcGFyc2VJbnQoX3Rhc2tzWzBdLnZhbHVlKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ3Rhc2snLCBfc2VsZWN0ZWQpO1xuXHRcdFx0fVxuXHRcdFx0TWlsZXN0b25lVGFza1N0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBUcmFja2VyQ29uc3RhbnRzLlNFVF9NSUxFU1RPTkVfVEFTSzpcblx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KGFjdGlvbi5pZCk7XG5cdFx0XHRjb25zb2xlLmxvZygndGFzaycsIF9zZWxlY3RlZCk7XG5cdFx0XHRNaWxlc3RvbmVUYXNrU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5cbmV4cG9ydCBkZWZhdWx0IE1pbGVzdG9uZVRhc2tTdG9yZTtcbiIsIlxuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBUcmFja2VyQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9UcmFja2VyQ29uc3RhbnRzJztcbmltcG9ydCB7IGdldFByb2plY3REZXRhaWxzLCBnZXRNaWxlc3RvbmVzIH0gZnJvbSAnLi4vYWN0aW9ucy9UcmFja2VyQWN0aW9ucyc7XG5cblxudmFyIF9wcm9qZWN0cyA9IFtdO1xudmFyIF9zZWxlY3RlZDtcblxudmFyIFByb2plY3RTdG9yZSAgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0UHJvamVjdHMoKSB7XG5cdFx0cmV0dXJuIF9wcm9qZWN0cztcblx0fSxcblxuXHRnZXRQcm9qZWN0SWQoKSB7XG5cdFx0cmV0dXJuIF9zZWxlY3RlZDtcblx0fVxufSk7XG5cblByb2plY3RTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX1BST0pFQ1RTOlxuXHRcdFx0X3Byb2plY3RzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRQcm9qZWN0U3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX1BST0pFQ1Q6XG5cdFx0XHRfc2VsZWN0ZWQgPSBwYXJzZUludChhY3Rpb24uaWQpO1xuXHRcdFx0Y29uc29sZS5sb2coJ3Byb2plY3QnLCBfc2VsZWN0ZWQpO1xuXHRcdFx0UHJvamVjdFN0b3JlLmVtaXRDaGFuZ2UoKTtcblxuXHRcdFx0Z2V0UHJvamVjdERldGFpbHMoX3NlbGVjdGVkKTtcblx0XHRcdGdldE1pbGVzdG9uZXMoX3NlbGVjdGVkKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8vbm8gb3Bcblx0fVxuXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvamVjdFN0b3JlO1xuIiwiXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICcuLi91dGlscy9TdG9yZVV0aWxzJztcblxuaW1wb3J0IEFwcERpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJztcbmltcG9ydCBTZXR0aW5nc0NvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvU2V0dGluZ3NDb25zdGFudHMnO1xuXG5cbmZ1bmN0aW9uIF9zZXRTZXR0aW5ncyhkYXRhKSB7XG5cdHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCksIGRhdGEpO1xuXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2V0dGluZ3MnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xufVxuXG52YXIgU2V0dGluZ3NTdG9yZSAgPSBjcmVhdGVTdG9yZSh7XG5cblx0Z2V0U2V0dGluZ3MoKSB7XG5cdFx0cmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpIHx8IHt9O1xuXHR9XG59KTtcblxuXG5TZXR0aW5nc1N0b3JlLmRpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGFjdGlvbiA9PiB7XG5cblx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0Y2FzZSBTZXR0aW5nc0NvbnN0YW50cy5TQVZFX1NFVFRJTkdTOlxuXHRcdFx0X3NldFNldHRpbmdzKGFjdGlvbi5kYXRhKTtcblx0XHRcdFNldHRpbmdzU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTZXR0aW5nc1N0b3JlO1xuIiwiXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSB9IGZyb20gJy4uL3V0aWxzL1N0b3JlVXRpbHMnO1xuXG5pbXBvcnQgQXBwRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInO1xuaW1wb3J0IFNldHRpbmdzQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cyc7XG5pbXBvcnQgeyBnZXRVc2VycyB9IGZyb20gJy4uL2FjdGlvbnMvU2V0dGluZ3NBY3Rpb25zJztcblxuaW1wb3J0IFNldHRpbmdzU3RvcmUgZnJvbSAnLi9TZXR0aW5nc1N0b3JlJztcblxuXG52YXIgX3VzZXJzID0gW107XG5cbnZhciBTZXR0aW5nc1VzZXJzU3RvcmUgID0gY3JlYXRlU3RvcmUoe1xuXG5cdGdldFVzZXJzKCkge1xuXHRcdHJldHVybiBfdXNlcnM7XG5cdH1cbn0pO1xuXG5TZXR0aW5nc1VzZXJzU3RvcmUuZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoYWN0aW9uID0+IHtcblxuXHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRjYXNlIFNldHRpbmdzQ29uc3RhbnRzLlNBVkVfU0VUVElOR1M6XG5cdFx0XHRBcHBEaXNwYXRjaGVyLndhaXRGb3IoW1NldHRpbmdzU3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuXHRcdFx0Z2V0VXNlcnMoKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBTZXR0aW5nc0NvbnN0YW50cy5SRUNFSVZFX1VTRVJTOlxuXHRcdFx0X3VzZXJzID0gYWN0aW9uLmRhdGE7XG5cdFx0XHRTZXR0aW5nc1VzZXJzU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly9ubyBvcFxuXHR9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTZXR0aW5nc1VzZXJzU3RvcmU7XG4iLCJcbmltcG9ydCB7IGNyZWF0ZVN0b3JlIH0gZnJvbSAnLi4vdXRpbHMvU3RvcmVVdGlscyc7XG5cbmltcG9ydCBBcHBEaXNwYXRjaGVyIGZyb20gJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcic7XG5pbXBvcnQgVHJhY2tlckNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvVHJhY2tlckNvbnN0YW50cyc7XG5pbXBvcnQgTWlsZXN0b25lVGFza1N0b3JlIGZyb20gJy4uL3N0b3Jlcy9NaWxlc3RvbmVUYXNrU3RvcmUnO1xuXG5cbnZhciBfdGFza3MgPSBbXTtcbnZhciBfc2VsZWN0ZWQ7XG5cbnZhciBUYXNrVHlwZVN0b3JlICA9IGNyZWF0ZVN0b3JlKHtcblxuXHRnZXRUYXNrVHlwZXMoKSB7XG5cdFx0cmV0dXJuIF90YXNrcztcblx0fSxcblxuXHRnZXRUYXNrVHlwZSgpIHtcblx0XHRyZXR1cm4gX3NlbGVjdGVkO1xuXHR9XG59KTtcblxuVGFza1R5cGVTdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihhY3Rpb24gPT4ge1xuXG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuXHRcdGNhc2UgVHJhY2tlckNvbnN0YW50cy5SRUNFSVZFX1RBU0tfVFlQRVM6XG5cdFx0XHRfdGFza3MgPSBhY3Rpb24uZGF0YTtcblx0XHRcdGlmIChfdGFza3MubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRfc2VsZWN0ZWQgPSBwYXJzZUludChfdGFza3NbMF0udmFsdWUpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygndGFza190eXBlJywgX3NlbGVjdGVkKTtcblx0XHRcdH1cblx0XHRcdFRhc2tUeXBlU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFRyYWNrZXJDb25zdGFudHMuU0VUX1RBU0tfVFlQRTpcblx0XHRcdF9zZWxlY3RlZCA9IHBhcnNlSW50KGFjdGlvbi5pZCk7XG5cdFx0XHRjb25zb2xlLmxvZygndGFzaycsIF9zZWxlY3RlZCk7XG5cdFx0XHRUYXNrVHlwZVN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Ly8gY2FzZSBUcmFja2VyQ29uc3RhbnRzLlJFQ0VJVkVfTUlMRVNUT05FX1RBU0tTOlxuXHRcdC8vIGNhc2UgVHJhY2tlckNvbnN0YW50cy5TRVRfTUlMRVNUT05FX1RBU0s6XG5cdFx0Ly8gXHRBcHBEaXNwYXRjaGVyLndhaXRGb3IoW01pbGVzdG9uZVRhc2tTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG5cblx0XHQvLyBcdHZhciBtaWxlc3RvbmVUYXNrcyA9IE1pbGVzdG9uZVRhc2tTdG9yZS5nZXRNaWxlc3RvbmVUYXNrcygpO1xuXHRcdC8vIFx0dmFyIG1pbGVzdG9uZVRhc2sgPSBNaWxlc3RvbmVUYXNrU3RvcmUuZ2V0TWlsZXN0b25lVGFza0lkKCk7XG5cblx0XHQvLyBcdGNvbnNvbGUubG9nKG1pbGVzdG9uZVRhc2tzKTtcblx0XHQvLyBcdGNvbnNvbGUubG9nKG1pbGVzdG9uZVRhc2spO1xuXG5cdFx0Ly8gXHRicmVhaztcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvL25vIG9wXG5cdH1cblxufSk7XG5cblxuZXhwb3J0IGRlZmF1bHQgVGFza1R5cGVTdG9yZTtcbiIsIlxuaW1wb3J0IGFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJztcbmltcG9ydCB7IGVhY2gsIGlzRnVuY3Rpb24gfSBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbmNvbnN0IENIQU5HRV9FVkVOVCA9ICdjaGFuZ2UnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3RvcmUoc3BlYykge1xuICBjb25zdCBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBlbWl0dGVyLnNldE1heExpc3RlbmVycygwKTtcblxuICBjb25zdCBzdG9yZSA9IGFzc2lnbih7XG4gICAgZW1pdENoYW5nZSgpIHtcbiAgICAgIGVtaXR0ZXIuZW1pdChDSEFOR0VfRVZFTlQpO1xuICAgIH0sXG5cbiAgICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgICAgZW1pdHRlci5vbihDSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICAgIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIoQ0hBTkdFX0VWRU5ULCBjYWxsYmFjayk7XG4gICAgfVxuICB9LCBzcGVjKTtcblxuICAvLyBBdXRvLWJpbmQgc3RvcmUgbWV0aG9kcyBmb3IgY29udmVuaWVuY2VcbiAgZWFjaChzdG9yZSwgKHZhbCwga2V5KSA9PiB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgc3RvcmVba2V5XSA9IHN0b3JlW2tleV0uYmluZChzdG9yZSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gc3RvcmU7XG59IiwiXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFNldHRpbmdzU3RvcmUgZnJvbSAnLi4vc3RvcmVzL1NldHRpbmdzU3RvcmUnO1xuXHRcbmV4cG9ydCBmdW5jdGlvbiBhcGlSZXF1ZXN0KG9wdGlvbnMpIHtcblxuXHR2YXIgZGVmYXVsdHMgPSB7XG5cdFx0dHlwZTogJ1BPU1QnLFxuXHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0ZGF0YToge30sXG4gICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucy51cmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xuICAgIH1cblx0fTtcblxuXHR2YXIgYXBwU2V0dGluZ3MgPSBTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCk7XG5cdGlmIChhcHBTZXR0aW5ncykge1xuXHRcdGRlZmF1bHRzLmRhdGEgPSB7XG5cdFx0XHRhcGlfZ3JvdXA6IGFwcFNldHRpbmdzLmdyb3VwSWQsXG5cdFx0XHRhcGlfc2VjcmV0OiBhcHBTZXR0aW5ncy5ncm91cFNlY3JldFxuXHRcdH07XG5cdH1cblxuXHR2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cdGlmIChzZXR0aW5ncy5kYXRhLmFwaV9ncm91cCAmJiBzZXR0aW5ncy5kYXRhLmFwaV9zZWNyZXQpIHtcblx0XHQkLmFqYXgoJ2h0dHBzOi8vd3d3LnRlYW1sZWFkZXIuYmUvYXBpJyArIG9wdGlvbnMudXJsLCBzZXR0aW5ncyk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJla2V5KGFyciwgbG9va3VwKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIG9iaiA9IGFycltpXTtcblx0XHRmb3IgKHZhciBmcm9tS2V5IGluIGxvb2t1cCkge1xuXHRcdFx0dmFyIHRvS2V5ID0gbG9va3VwW2Zyb21LZXldO1xuXHRcdFx0dmFyIHZhbHVlID0gb2JqW2Zyb21LZXldO1xuXHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdG9ialt0b0tleV0gPSB2YWx1ZTtcblx0XHRcdFx0ZGVsZXRlIG9ialtmcm9tS2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGFycjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGh0bWxFbnRpdGllcyhzdHJpbmcpIHtcblx0cmV0dXJuIHN0cmluZ1xuXHRcdC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpXG5cdFx0LnJlcGxhY2UoLyYjMDM5Oy9nLCBcIidcIik7XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJcbmltcG9ydCBSb3V0ZXMgZnJvbSAnLi9Sb3V0ZXMnO1xuaW1wb3J0IFN0YXR1c0JhciBmcm9tICcuL1N0YXR1c0Jhcic7XG5pbXBvcnQgTWVudUJhciBmcm9tICcuL01lbnVCYXInO1xuXG5uZXcgU3RhdHVzQmFyKCk7XG5uZXcgTWVudUJhcigpO1xubmV3IFJvdXRlcygpO1xuIl19
