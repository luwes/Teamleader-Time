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

},{"../constants/SettingsConstants":7,"../dispatcher/AppDispatcher":8,"../util":11}],2:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var React = require('react');

var Util = require('../util');
var TextInput = require('./TextInput.react');
var SelectInput = require('./SelectInput.react');

var Home = React.createClass({
	displayName: 'Home',

	handleHomeSubmit: function handleHomeSubmit(data) {},

	render: function render() {
		return React.createElement(
			'div',
			{ className: 'home' },
			React.createElement(HomeForm, {
				onHomeSubmit: this.handleHomeSubmit
			})
		);
	}
});

var HomeForm = React.createClass({
	displayName: 'HomeForm',

	getInitialState: function getInitialState() {
		return {
			project: 0,
			milestone: 0,
			milestoneTask: 0,
			contactOrCompany: '',
			contactOrCompanyId: 0,
			taskTypesLookup: []
		};
	},

	handleSubmit: function handleSubmit(e) {
		e.preventDefault();
	},

	handleTaskTypesLoaded: function handleTaskTypesLoaded(taskTypes) {},

	handleProjectChange: function handleProjectChange(project) {
		var _this = this;

		this.setState({
			project: parseInt(project),
			milestone: 0,
			milestoneTask: 0
		});

		Util.apiRequest({
			url: '/getProject.php',
			data: {
				project_id: project
			},
			success: function success(string) {
				var data = JSON.parse(string);
				_this.setState({
					contactOrCompany: data.contact_or_company,
					contactOrCompanyId: data.contact_or_company_id
				});
			}
		});
	},

	handleMilestoneChange: function handleMilestoneChange(milestone) {
		this.setState({
			milestone: parseInt(milestone)
		});
	},

	handleMilestoneTaskChange: function handleMilestoneTaskChange(task) {
		this.setState({
			milestoneTask: parseInt(task)
		});
	},

	render: function render() {

		console.log(this.state);

		return React.createElement(
			'form',
			{ className: 'form-horizontal', onSubmit: this.handleSubmit },
			React.createElement(ProjectSelectContainer, { onProjectChange: this.handleProjectChange }),
			React.createElement(MilestoneSelectContainer, {
				project: this.state.project,
				onMilestoneChange: this.handleMilestoneChange
			}),
			React.createElement(TaskSelectContainer, {
				milestone: this.state.milestone,
				onTaskTypesLoaded: this.handleTaskTypesLoaded,
				onMilestoneTaskChange: this.handleMilestoneTaskChange
			}),
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

	getInitialState: function getInitialState() {
		return {
			projects: []
		};
	},
	componentDidMount: function componentDidMount() {
		var _this2 = this;

		Util.apiRequest({
			url: '/getProjects.php',
			data: {
				amount: 100,
				pageno: 0
			},
			success: function success(string) {
				console.log(string);
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
					_this2.setState({ projects: data });
				} else {
					_this2.setState({ projects: [] });
				}
			}
		});
	},
	handleChange: function handleChange(event) {
		var target = event.currentTarget;
		this.props.onProjectChange(target.value);
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

	getDefaultProps: function getDefaultProps() {
		return {
			project: 0
		};
	},
	getInitialState: function getInitialState() {
		return {
			milestones: []
		};
	},
	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		var _this3 = this;

		if (this.props.project != nextProps.project) {

			Util.apiRequest({
				url: '/getMilestonesByProject.php',
				data: {
					project_id: nextProps.project
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

					if (data.length > 0) {
						_this3.setState({ milestones: data });
						_this3.props.onMilestoneChange(data[0].value);
					} else {
						_this3.setState({ milestones: [] });
					}
				}
			});
		}
	},
	handleChange: function handleChange(event) {
		var target = event.currentTarget;
		this.props.onMilestoneChange(target.value);
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
				React.createElement(SelectInput, { id: 'milestone', ref: 'milestone', options: this.state.milestones, onChange: this.handleChange })
			)
		);
	}
});

var TaskSelectContainer = React.createClass({
	displayName: 'TaskSelectContainer',

	getDefaultProps: function getDefaultProps() {
		return {
			milestone: 0
		};
	},
	getInitialState: function getInitialState() {
		return {
			tasks: [],
			milestoneTask: 0
		};
	},
	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		var _this4 = this;

		if (this.props.milestone != nextProps.milestone) {
			if (nextProps.milestone > 0) {

				Util.apiRequest({
					url: '/getTasksByMilestone.php',
					data: {
						milestone_id: nextProps.milestone
					},
					success: function success(string) {
						console.log(string);
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
							_this4.setState({
								tasks: data,
								milestoneTask: data[0].value
							});
							_this4.props.onMilestoneTaskChange(data[0].value);
						} else {
							_this4.setState({
								tasks: [],
								milestoneTask: 0
							});
							_this4.props.onMilestoneTaskChange(0);
						}
					}
				});
			} else {
				this.setState({
					tasks: [],
					milestoneTask: 0
				});
				this.props.onMilestoneTaskChange(0);
			}
		}
	},
	handleChange: function handleChange(event) {
		var target = event.currentTarget;
		this.props.onMilestoneTaskChange(target.value);
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
					React.createElement(SelectInput, { id: 'milestone-task', ref: 'milestoneTask', value: '{this.state.milestoneTask}', options: this.state.tasks, onChange: this.handleChange })
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
		var _this5 = this;

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
				_this5.setState({ taskTypes: data });
			}
		});
	},
	render: function render() {
		return React.createElement(SelectInput, { id: 'task-type', ref: 'taskType', options: this.state.taskTypes });
	}
});

module.exports = Home;

},{"../util":11,"./SelectInput.react":3,"./TextInput.react":6,"jquery":"jquery","react":"react"}],3:[function(require,module,exports){
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

},{"../util":11,"react":"react"}],4:[function(require,module,exports){
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
					{ to: 'home', className: 'btn btn-default btn-sm back-settings-btn' },
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

},{"../actions/SettingsActions":1,"../stores/SettingsStore":9,"../stores/SettingsUsersStore":10,"../util":11,"./SelectInput.react":3,"./TextInput.react":6,"jquery":"jquery","react":"react","react-router":"react-router"}],5:[function(require,module,exports){
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

},{"events":12,"flux":"flux","react":"react","react-router":"react-router"}],6:[function(require,module,exports){
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

var keyMirror = require('keymirror');

module.exports = keyMirror({
	SAVE_SETTINGS: null,
	RECEIVE_USERS: null
});

},{"keymirror":"keymirror"}],8:[function(require,module,exports){
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

},{"flux":"flux"}],9:[function(require,module,exports){
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
			console.log(JSON.parse(localStorage.getItem('settings')));
			return JSON.parse(localStorage.getItem('settings')) || {};
		}
	}]);

	return SettingsStore;
})(EventEmitter);

module.exports = new SettingsStore();

},{"../constants/SettingsConstants":7,"../dispatcher/AppDispatcher":8,"events":12,"jquery":"jquery"}],10:[function(require,module,exports){
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

var _dispatchToken;
var _users = [];

var SettingsUsersStore = (function (_EventEmitter) {
	function SettingsUsersStore() {
		var _this = this;

		_classCallCheck(this, SettingsUsersStore);

		_get(Object.getPrototypeOf(SettingsUsersStore.prototype), 'constructor', this).call(this);
		_dispatchToken = AppDispatcher.register(function (action) {

			switch (action.type) {

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

},{"../actions/SettingsActions":1,"../constants/SettingsConstants":7,"../dispatcher/AppDispatcher":8,"events":12,"jquery":"jquery"}],11:[function(require,module,exports){
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
			$.ajax('https://www.teamleader.be/api' + options.url, settings);
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

},{"./stores/SettingsStore":9,"jquery":"jquery"}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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
var Home = require('./components/Home.react');
var Settings = require('./components/Settings.react');

var routes = React.createElement(
  Route,
  { name: 'app', path: '/', handler: TeamleaderTimeApp },
  React.createElement(Route, { name: 'settings', handler: Settings }),
  React.createElement(DefaultRoute, { name: 'home', handler: Home })
);

Router.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.body);
});

},{"./components/Home.react":2,"./components/Settings.react":4,"./components/TeamleaderTimeApp.react":5,"react":"react","react-router":"react-router"}]},{},[13])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvSG9tZS5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvU2VsZWN0SW5wdXQucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1NldHRpbmdzLnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9UZWFtbGVhZGVyVGltZUFwcC5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVGV4dElucHV0LnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29uc3RhbnRzL1NldHRpbmdzQ29uc3RhbnRzLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvc3RvcmVzL1NldHRpbmdzU3RvcmUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zdG9yZXMvU2V0dGluZ3NVc2Vyc1N0b3JlLmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvdXRpbC5qc3giLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQ0EsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUU5QixJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUMzRCxJQUFJLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDOztBQUVsRSxNQUFNLENBQUMsT0FBTyxHQUFHOztBQUVmLGFBQVksRUFBRSxzQkFBUyxJQUFJLEVBQUU7QUFDM0IsZUFBYSxDQUFDLFFBQVEsQ0FBQztBQUNyQixPQUFJLEVBQUUsaUJBQWlCLENBQUMsYUFBYTtBQUNyQyxPQUFJLEVBQUUsSUFBSTtHQUNYLENBQUMsQ0FBQztFQUNKOztBQUVELFNBQVEsRUFBRSxrQkFBUyxJQUFJLEVBQUU7QUFDekIsTUFBSSxDQUFDLFVBQVUsQ0FBQztBQUNmLE1BQUcsRUFBRSxlQUFlO0FBQ3BCLFVBQU8sRUFBRSxpQkFBQyxNQUFNLEVBQUs7O0FBRXBCLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVMsSUFBSSxFQUFFLEdBQUcsRUFBRTtBQUNqRCxhQUFR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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1U0EsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2hDLElBQUksRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0FBQ3pDLElBQUk7QUFDRixJQUFFLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLEVBQUU7QUFDckMsWUFBUSxFQUFFLEtBQUssRUFDaEIsQ0FBQyxDQUFDO0FBQ0gsS0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0NBQzVCLENBQUMsT0FBTSxFQUFFLEVBQUU7QUFDVixTQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUN6Qjs7QUFFRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3JDLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDdkMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQzs7QUFFekIsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQztBQUN4RSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUM5QyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7QUFFdEQsSUFBSSxNQUFNLEdBQ1I7QUFBQyxPQUFLO0lBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsQUFBQztFQUNwRCxvQkFBQyxLQUFLLElBQUMsSUFBSSxFQUFDLFVBQVUsRUFBQyxPQUFPLEVBQUUsUUFBUSxBQUFDLEdBQUU7RUFDM0Msb0JBQUMsWUFBWSxJQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFFLElBQUksQUFBQyxHQUFFO0NBQ3BDLEFBQ1QsQ0FBQzs7QUFFRixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLE9BQU8sRUFBRTtBQUNwQyxPQUFLLENBQUMsTUFBTSxDQUFDLG9CQUFDLE9BQU8sT0FBRSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUN6QyxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBTZXR0aW5nc0NvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBzYXZlU2V0dGluZ3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFNldHRpbmdzQ29uc3RhbnRzLlNBVkVfU0VUVElOR1MsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0sXG5cbiAgZ2V0VXNlcnM6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRVdGlsLmFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFVzZXJzLnBocCcsXG5cdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0Y2FzZSAnbmFtZSc6XG5cdFx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHQgIFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0ICBcdFx0dHlwZTogU2V0dGluZ3NDb25zdGFudHMuUkVDRUlWRV9VU0VSUyxcblx0XHQgIFx0XHRkYXRhOiBkYXRhXG5cdFx0ICBcdH0pO1xuXHQgICAgfVxuXHRcdH0pO1xuICB9XG5cbn07XG4iLCJcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcbnZhciBUZXh0SW5wdXQgPSByZXF1aXJlKCcuL1RleHRJbnB1dC5yZWFjdCcpO1xudmFyIFNlbGVjdElucHV0ID0gcmVxdWlyZSgnLi9TZWxlY3RJbnB1dC5yZWFjdCcpO1xuXG52YXIgSG9tZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRoYW5kbGVIb21lU3VibWl0OiBmdW5jdGlvbihkYXRhKSB7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJob21lXCI+XG5cdFx0XHRcdDxIb21lRm9ybSBcblx0XHRcdFx0XHRvbkhvbWVTdWJtaXQ9e3RoaXMuaGFuZGxlSG9tZVN1Ym1pdH0gXG5cdFx0XHRcdC8+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxudmFyIEhvbWVGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHByb2plY3Q6IDAsXG5cdFx0XHRtaWxlc3RvbmU6IDAsXG5cdFx0XHRtaWxlc3RvbmVUYXNrOiAwLFxuXHRcdFx0Y29udGFjdE9yQ29tcGFueTogJycsXG5cdFx0XHRjb250YWN0T3JDb21wYW55SWQ6IDAsXG5cdFx0XHR0YXNrVHlwZXNMb29rdXA6IFtdXG5cdFx0fVxuXHR9LFxuXG5cdGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHR9LFxuXG5cdGhhbmRsZVRhc2tUeXBlc0xvYWRlZDogZnVuY3Rpb24odGFza1R5cGVzKSB7XG5cblx0fSxcblxuXHRoYW5kbGVQcm9qZWN0Q2hhbmdlOiBmdW5jdGlvbihwcm9qZWN0KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRwcm9qZWN0OiBwYXJzZUludChwcm9qZWN0KSxcblx0XHRcdG1pbGVzdG9uZTogMCxcblx0XHRcdG1pbGVzdG9uZVRhc2s6IDBcblx0XHR9KTtcblxuXHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHR1cmw6ICcvZ2V0UHJvamVjdC5waHAnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwcm9qZWN0X2lkOiBwcm9qZWN0XG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nKTtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0Y29udGFjdE9yQ29tcGFueTogZGF0YS5jb250YWN0X29yX2NvbXBhbnksXG5cdFx0XHRcdFx0Y29udGFjdE9yQ29tcGFueUlkOiBkYXRhLmNvbnRhY3Rfb3JfY29tcGFueV9pZFxuXHRcdFx0XHR9KTtcbiAgICAgIH1cblx0XHR9KTtcblx0fSxcblxuXHRoYW5kbGVNaWxlc3RvbmVDaGFuZ2U6IGZ1bmN0aW9uKG1pbGVzdG9uZSkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0bWlsZXN0b25lOiBwYXJzZUludChtaWxlc3RvbmUpXG5cdFx0fSk7XG5cdH0sXG5cblx0aGFuZGxlTWlsZXN0b25lVGFza0NoYW5nZTogZnVuY3Rpb24odGFzaykge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0bWlsZXN0b25lVGFzazogcGFyc2VJbnQodGFzaylcblx0XHR9KTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG5cdFx0Y29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PGZvcm0gY2xhc3NOYW1lPVwiZm9ybS1ob3Jpem9udGFsXCIgb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cblxuXHRcdFx0XHQ8UHJvamVjdFNlbGVjdENvbnRhaW5lciBvblByb2plY3RDaGFuZ2U9e3RoaXMuaGFuZGxlUHJvamVjdENoYW5nZX0gLz5cblxuXHRcdFx0XHQ8TWlsZXN0b25lU2VsZWN0Q29udGFpbmVyIFxuXHRcdFx0XHRcdHByb2plY3Q9e3RoaXMuc3RhdGUucHJvamVjdH0gXG5cdFx0XHRcdFx0b25NaWxlc3RvbmVDaGFuZ2U9e3RoaXMuaGFuZGxlTWlsZXN0b25lQ2hhbmdlfSBcblx0XHRcdFx0Lz5cblxuXHRcdFx0XHQ8VGFza1NlbGVjdENvbnRhaW5lciBcblx0XHRcdFx0XHRtaWxlc3RvbmU9e3RoaXMuc3RhdGUubWlsZXN0b25lfSBcblx0XHRcdFx0XHRvblRhc2tUeXBlc0xvYWRlZD17dGhpcy5oYW5kbGVUYXNrVHlwZXNMb2FkZWR9IFxuXHRcdFx0XHRcdG9uTWlsZXN0b25lVGFza0NoYW5nZT17dGhpcy5oYW5kbGVNaWxlc3RvbmVUYXNrQ2hhbmdlfSBcblx0XHRcdFx0Lz5cblxuXHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi10b29sYmFyXCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSBzdGFydC10aW1lci1idG5cIj5TdGFydCB0aW1lcjwvYnV0dG9uPiBcblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Zvcm0+XG5cdFx0KTtcblx0fVxufSk7XG5cbnZhciBQcm9qZWN0U2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHByb2plY3RzOiBbXVxuXHRcdH1cblx0fSxcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0VXRpbC5hcGlSZXF1ZXN0KHtcblx0XHRcdHVybDogJy9nZXRQcm9qZWN0cy5waHAnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRhbW91bnQ6IDEwMCxcblx0XHRcdFx0cGFnZW5vOiAwXG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhzdHJpbmcpXG5cdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0Y2FzZSAndGl0bGUnOlxuXHRcdFx0XHRcdFx0XHR0aGlzLmxhYmVsID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoZGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0ZGF0YS51bnNoaWZ0KHsgdmFsdWU6IDAsIGxhYmVsOiAnQ2hvb3NlLi4uJyB9KTtcblx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgcHJvamVjdHM6IGRhdGEgfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHByb2plY3RzOiBbXSB9KTtcblx0XHRcdFx0fVxuICAgICAgfVxuXHRcdH0pO1xuXHR9LFxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cdFx0dGhpcy5wcm9wcy5vblByb2plY3RDaGFuZ2UodGFyZ2V0LnZhbHVlKTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cInByb2plY3RcIj5Qcm9qZWN0PC9sYWJlbD5cblx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdDxTZWxlY3RJbnB1dCBpZD1cInByb2plY3RcIiByZWY9XCJwcm9qZWN0XCIgb3B0aW9ucz17dGhpcy5zdGF0ZS5wcm9qZWN0c30gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSAvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgTWlsZXN0b25lU2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHByb2plY3Q6IDBcblx0XHR9XG5cdH0sXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG1pbGVzdG9uZXM6IFtdXG5cdFx0fVxuXHR9LFxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5wcm9qZWN0ICE9IG5leHRQcm9wcy5wcm9qZWN0KSB7XG5cblx0XHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHRcdHVybDogJy9nZXRNaWxlc3RvbmVzQnlQcm9qZWN0LnBocCcsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRwcm9qZWN0X2lkOiBuZXh0UHJvcHMucHJvamVjdFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdFx0Ly9yZXZpdmVyIGZ1bmN0aW9uIHRvIHJlbmFtZSBrZXlzXG5cdFx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZywgZnVuY3Rpb24ocHJvcCwgdmFsKSB7XG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRjYXNlICd0aXRsZSc6XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSBkYXRhLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0uY2xvc2VkID09IDEpIHtcblx0XHRcdFx0XHRcdFx0ZGF0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGRhdGEubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IG1pbGVzdG9uZXM6IGRhdGEgfSk7XG5cdFx0XHRcdFx0XHR0aGlzLnByb3BzLm9uTWlsZXN0b25lQ2hhbmdlKGRhdGFbMF0udmFsdWUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgbWlsZXN0b25lczogW10gfSk7XG5cdFx0XHRcdFx0fVxuXHQgICAgICB9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblx0XHR0aGlzLnByb3BzLm9uTWlsZXN0b25lQ2hhbmdlKHRhcmdldC52YWx1ZSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUubWlsZXN0b25lcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXHRcdHJldHVybiAoXG5cdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwibWlsZXN0b25lXCI+TWlsZXN0b25lPC9sYWJlbD5cblx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdDxTZWxlY3RJbnB1dCBpZD1cIm1pbGVzdG9uZVwiIHJlZj1cIm1pbGVzdG9uZVwiIG9wdGlvbnM9e3RoaXMuc3RhdGUubWlsZXN0b25lc30gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSAvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgVGFza1NlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRtaWxlc3RvbmU6IDBcblx0XHR9XG5cdH0sXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRhc2tzOiBbXSxcblx0XHRcdG1pbGVzdG9uZVRhc2s6IDBcblx0XHR9XG5cdH0sXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuXHRcdGlmICh0aGlzLnByb3BzLm1pbGVzdG9uZSAhPSBuZXh0UHJvcHMubWlsZXN0b25lKSB7XG5cdFx0XHRpZiAobmV4dFByb3BzLm1pbGVzdG9uZSA+IDApIHtcblxuXHRcdFx0XHRVdGlsLmFwaVJlcXVlc3Qoe1xuXHRcdFx0XHRcdHVybDogJy9nZXRUYXNrc0J5TWlsZXN0b25lLnBocCcsXG5cdFx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdFx0bWlsZXN0b25lX2lkOiBuZXh0UHJvcHMubWlsZXN0b25lXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhzdHJpbmcpXG5cdFx0XHRcdFx0XHQvL3Jldml2ZXIgZnVuY3Rpb24gdG8gcmVuYW1lIGtleXNcblx0XHRcdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcsIGZ1bmN0aW9uKHByb3AsIHZhbCkge1xuXHRcdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdpZCc6XG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2Rlc2NyaXB0aW9uJzpcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gZGF0YS5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0uZG9uZSA9PSAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dmFyIGFwcFNldHRpbmdzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZ3MnKSk7XG5cdFx0XHRcdFx0XHRpZiAoYXBwU2V0dGluZ3MgJiYgYXBwU2V0dGluZ3MudXNlck5hbWUpIHtcblx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IGRhdGEubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0ub3duZXJfbmFtZSAhPSBhcHBTZXR0aW5ncy51c2VyTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChkYXRhLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0ZGF0YS5wdXNoKHsgdmFsdWU6ICduZXcnLCBsYWJlbDogJ05ldyB0YXNrLi4uJyB9KTtcblx0XHRcdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0XHRcdFx0dGFza3M6IGRhdGEsXG5cdFx0XHRcdFx0XHRcdFx0bWlsZXN0b25lVGFzazogZGF0YVswXS52YWx1ZVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0dGhpcy5wcm9wcy5vbk1pbGVzdG9uZVRhc2tDaGFuZ2UoZGF0YVswXS52YWx1ZSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRcdFx0XHR0YXNrczogW10sXG5cdFx0XHRcdFx0XHRcdFx0bWlsZXN0b25lVGFzazogMFxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0dGhpcy5wcm9wcy5vbk1pbGVzdG9uZVRhc2tDaGFuZ2UoMCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0ICAgICAgfVxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdHRhc2tzOiBbXSxcblx0XHRcdFx0XHRtaWxlc3RvbmVUYXNrOiAwXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLnByb3BzLm9uTWlsZXN0b25lVGFza0NoYW5nZSgwKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblx0XHR0aGlzLnByb3BzLm9uTWlsZXN0b25lVGFza0NoYW5nZSh0YXJnZXQudmFsdWUpO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLnRhc2tzLmxlbmd0aCA+IDEpIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cIm1pbGVzdG9uZS10YXNrXCI+VG9kbzwvbGFiZWw+XG5cdFx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdFx0PFNlbGVjdElucHV0IGlkPVwibWlsZXN0b25lLXRhc2tcIiByZWY9XCJtaWxlc3RvbmVUYXNrXCIgdmFsdWU9XCJ7dGhpcy5zdGF0ZS5taWxlc3RvbmVUYXNrfVwiIG9wdGlvbnM9e3RoaXMuc3RhdGUudGFza3N9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gLz5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImN1c3RvbS10YXNrXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHRcdFx0ICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJ0YXNrLXR5cGVcIj5UeXBlPC9sYWJlbD5cblx0XHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0XHQgIFx0PFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyIC8+XG5cdFx0XHRcdFx0ICA8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG5cdFx0XHRcdFx0ICBcdDx0ZXh0YXJlYSBpZD1cInRhc2stZGVzY3JpcHRpb25cIiByZWY9XCJ0YXNrRGVzY3JpcHRpb25cIiBwbGFjZWhvbGRlcj1cIlRhc2sgZGVzY3JpcHRpb24uLi5cIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiByb3dzPVwiM1wiPjwvdGV4dGFyZWE+XG5cdFx0XHRcdFx0ICA8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQpO1xuXHRcdH1cblx0fVxufSk7XG5cbnZhciBUYXNrVHlwZVNlbGVjdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0YXNrVHlwZXM6IFtdXG5cdFx0fVxuXHR9LFxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG5cblx0XHRVdGlsLmFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFRhc2tUeXBlcy5waHAnLFxuXHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHQvL3Jldml2ZXIgZnVuY3Rpb24gdG8gcmVuYW1lIGtleXNcblx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZywgZnVuY3Rpb24ocHJvcCwgdmFsKSB7XG5cdFx0XHRcdFx0c3dpdGNoIChwcm9wKSB7XG5cdFx0XHRcdFx0XHRjYXNlICdpZCc6XG5cdFx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGNhc2UgJ25hbWUnOlxuXHRcdFx0XHRcdFx0XHR0aGlzLmxhYmVsID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyB0YXNrVHlwZXM6IGRhdGEgfSk7XG4gICAgICB9XG5cdFx0fSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxTZWxlY3RJbnB1dCBpZD1cInRhc2stdHlwZVwiIHJlZj1cInRhc2tUeXBlXCIgb3B0aW9ucz17dGhpcy5zdGF0ZS50YXNrVHlwZXN9IC8+XG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSG9tZVxuIiwiXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbnZhciBTZWxlY3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gIFx0dmFyIG9wdGlvbk5vZGVzID0gdGhpcy5wcm9wcy5vcHRpb25zLm1hcChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICBcdDxvcHRpb24ga2V5PXtvcHRpb24udmFsdWV9IHZhbHVlPXtvcHRpb24udmFsdWV9ID57VXRpbC5odG1sRW50aXRpZXMob3B0aW9uLmxhYmVsKX08L29wdGlvbj5cbiAgICAgICk7XG4gIFx0fSk7XG5cblx0XHRyZXR1cm4gKFxuXHQgIFx0PHNlbGVjdCBcblx0ICBcdFx0ey4uLnRoaXMucHJvcHN9IFxuXHQgIFx0XHRjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBcblx0XHRcdD5cblx0ICBcdFx0e29wdGlvbk5vZGVzfVxuXHQgIFx0PC9zZWxlY3Q+XG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0SW5wdXQ7IiwiXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIFJvdXRlciA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlcicpO1xudmFyIExpbmsgPSBSb3V0ZXIuTGluaztcblxudmFyIFNldHRpbmdzU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvU2V0dGluZ3NTdG9yZScpO1xudmFyIFNldHRpbmdzVXNlcnNTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9TZXR0aW5nc1VzZXJzU3RvcmUnKTtcbnZhciBTZXR0aW5nc0FjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucycpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcbnZhciBUZXh0SW5wdXQgPSByZXF1aXJlKCcuL1RleHRJbnB1dC5yZWFjdCcpO1xudmFyIFNlbGVjdElucHV0ID0gcmVxdWlyZSgnLi9TZWxlY3RJbnB1dC5yZWFjdCcpO1xuXG52YXIgU2V0dGluZ3MgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gU2V0dGluZ3NTdG9yZS5nZXRTZXR0aW5ncygpO1xuICB9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZShTZXR0aW5nc1N0b3JlLmdldFNldHRpbmdzKCkpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgXHRTZXR0aW5nc1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0U2V0dGluZ3NTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJzZXR0aW5nc1wiPlxuXHRcdFx0XHQ8U2V0dGluZ3NGb3JtIFxuXHRcdFx0XHRcdGdyb3VwSWQ9e3RoaXMuc3RhdGUuZ3JvdXBJZH1cblx0XHRcdFx0XHRncm91cFNlY3JldD17dGhpcy5zdGF0ZS5ncm91cFNlY3JldH1cblx0XHRcdFx0XHR1c2VySWQ9e3RoaXMuc3RhdGUudXNlcklkfVxuXHRcdFx0XHQvPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbnZhciBTZXR0aW5nc0Zvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0aGFuZGxlU3VibWl0OiBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIGdyb3VwSWQgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuZ3JvdXBJZCkudmFsdWUudHJpbSgpO1xuXHRcdHZhciBncm91cFNlY3JldCA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5ncm91cFNlY3JldCkudmFsdWUudHJpbSgpO1xuXHRcdGlmICghZ3JvdXBTZWNyZXQgfHwgIWdyb3VwSWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgY29udGFpbmVyID0gdGhpcy5yZWZzLnVzZXJTZWxlY3RJbnB1dENvbnRhaW5lcjtcblx0XHR2YXIgc2VsZWN0ID0gY29udGFpbmVyLnJlZnMudXNlclNlbGVjdDtcblx0XHR2YXIgc2VsZWN0Tm9kZSA9IFJlYWN0LmZpbmRET01Ob2RlKHNlbGVjdCk7XG5cblx0XHRTZXR0aW5nc0FjdGlvbnMuc2F2ZVNldHRpbmdzKHtcblx0XHRcdGdyb3VwSWQ6IGdyb3VwSWQsXG5cdFx0XHRncm91cFNlY3JldDogZ3JvdXBTZWNyZXQsXG5cdFx0XHR1c2VySWQ6IHNlbGVjdCA/IHNlbGVjdE5vZGUudmFsdWUgOiAwLFxuXHRcdFx0dXNlck5hbWU6IHNlbGVjdCA/ICQoc2VsZWN0Tm9kZSkuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudGV4dCgpIDogJydcblx0XHR9KTtcblxuXHRcdHJldHVybjtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly9jb25zb2xlLmxvZyh0aGlzLnByb3BzLmdyb3VwSWQpXG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PGZvcm0gY2xhc3NOYW1lPVwiZm9ybS1ob3Jpem9udGFsXCIgb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cblx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwiZ3JvdXAtaWRcIj5Hcm91cCBJRDwvbGFiZWw+XG5cdFx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0ICAgIFx0PFRleHRJbnB1dCBpZD1cImdyb3VwLWlkXCIgcmVmPVwiZ3JvdXBJZFwiIGRlZmF1bHRWYWx1ZT17dGhpcy5wcm9wcy5ncm91cElkfSAvPlxuXHRcdFx0ICAgIDwvZGl2PlxuXHRcdFx0ICA8L2Rpdj5cblx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwiZ3JvdXAtc2VjcmV0XCI+R3JvdXAgU2VjcmV0PC9sYWJlbD5cblx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHQgICAgXHQ8VGV4dElucHV0IGlkPVwiZ3JvdXAtc2VjcmV0XCIgcmVmPVwiZ3JvdXBTZWNyZXRcIiBkZWZhdWx0VmFsdWU9e3RoaXMucHJvcHMuZ3JvdXBTZWNyZXR9IC8+XG5cdFx0XHQgICAgPC9kaXY+XG5cdFx0XHQgIDwvZGl2PlxuXHRcdFx0ICA8VXNlclNlbGVjdElucHV0Q29udGFpbmVyIFxuXHRcdFx0ICBcdHJlZj1cInVzZXJTZWxlY3RJbnB1dENvbnRhaW5lclwiXG5cdFx0XHQgICAgdXNlcklkPXt0aGlzLnByb3BzLnVzZXJJZH1cblx0XHRcdFx0Lz5cblx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJidG4tdG9vbGJhclwiPlxuXHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGRhdGEtbG9hZGluZy10ZXh0PVwiTG9hZGluZy4uLlwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tc20gc2F2ZS1zZXR0aW5ncy1idG5cIj5TYXZlPC9idXR0b24+IFxuXHRcdFx0XHRcdDxMaW5rIHRvPVwiaG9tZVwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4tc20gYmFjay1zZXR0aW5ncy1idG5cIj5CYWNrPC9MaW5rPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZm9ybT5cblx0XHQpO1xuXHR9XG59KTtcblxudmFyIFVzZXJTZWxlY3RJbnB1dENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRVc2Vyc1N0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0J3VzZXJzJzogU2V0dGluZ3NVc2Vyc1N0b3JlLmdldFVzZXJzKClcblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRVc2Vyc1N0YXRlKCk7XG4gIH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0VXNlcnNTdGF0ZSgpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0U2V0dGluZ3NBY3Rpb25zLmdldFVzZXJzKCk7XG4gIFx0U2V0dGluZ3NVc2Vyc1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gIFx0U2V0dGluZ3NVc2Vyc1N0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLnVzZXJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cdFx0cmV0dXJuIChcblx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJ1c2VyLXNlbGVjdFwiPlNlbGVjdCB1c2VyPC9sYWJlbD5cblx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdCAgICBcdDxTZWxlY3RJbnB1dCBcblx0XHQgICAgXHRcdGlkPVwidXNlci1zZWxlY3RcIiBcblx0XHQgICAgXHRcdHJlZj1cInVzZXJTZWxlY3RcIiBcblx0XHQgICAgXHRcdG9wdGlvbnM9e3RoaXMuc3RhdGUudXNlcnN9IFxuXHRcdCAgICBcdFx0ZGVmYXVsdFZhbHVlPXt0aGlzLnByb3BzLnVzZXJJZH1cblx0XHQgICAgXHQvPlxuXHRcdCAgICA8L2Rpdj5cblx0XHQgIDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldHRpbmdzXG4iLCJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUm91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG52YXIgTGluayA9IFJvdXRlci5MaW5rO1xudmFyIFJvdXRlSGFuZGxlciA9IFJvdXRlci5Sb3V0ZUhhbmRsZXI7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyO1xuXG5cbnZhciBUZWFtbGVhZGVyVGltZUFwcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXBwXCI+XG5cdCAgXHRcdDxoZWFkZXI+XG5cdCAgXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJoZWFkZXJleHRcIj48L2Rpdj5cblx0ICBcdFx0XHQ8TGluayB0bz1cInNldHRpbmdzXCIgY2xhc3NOYW1lPVwic2V0dGluZ3MtbGlua1wiIGFjdGl2ZUNsYXNzTmFtZT1cImFjdGl2ZVwiPlxuXHQgIFx0XHRcdFx0PGkgY2xhc3NOYW1lPVwiZmEgZmEtY29nXCI+PC9pPlxuXHQgIFx0XHRcdDwvTGluaz5cblx0ICBcdFx0PC9oZWFkZXI+XG5cbiAgICAgICAgey8qIHRoaXMgaXMgdGhlIGltcG9ydGFudCBwYXJ0ICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgIDxSb3V0ZUhhbmRsZXIvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1sZWFkZXJUaW1lQXBwO1xuIiwiXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgVGV4dElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdC8vIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdC8vIFx0cmV0dXJuIHsgdmFsdWU6ICcnIH07XG5cdC8vIH0sXG5cblx0Ly8gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG5cdC8vIFx0dGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiBuZXh0UHJvcHMuc2F2ZWRWYWx1ZSB9KTtcblx0Ly8gfSxcblxuXHQvLyBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdC8vIFx0dGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiBldmVudC50YXJnZXQudmFsdWUgfSk7XG4gLy8gIH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHQvL3ZhciB2YWx1ZSA9IHRoaXMuc3RhdGUudmFsdWU7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxpbnB1dCBcblx0XHRcdFx0ey4uLnRoaXMucHJvcHN9XG5cdFx0XHRcdHR5cGU9XCJ0ZXh0XCIgXG5cdFx0XHRcdGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIFxuXHRcdFx0XHQvL3ZhbHVlPXt2YWx1ZX1cblx0XHRcdFx0Ly9vbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IFxuXHRcdFx0Lz5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0SW5wdXQ7IiwiXG52YXIga2V5TWlycm9yID0gcmVxdWlyZSgna2V5bWlycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yKHtcblx0U0FWRV9TRVRUSU5HUzogbnVsbCxcblx0UkVDRUlWRV9VU0VSUzogbnVsbFxufSk7XG4iLCIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBBcHBEaXNwYXRjaGVyXG4gKlxuICogQSBzaW5nbGV0b24gdGhhdCBvcGVyYXRlcyBhcyB0aGUgY2VudHJhbCBodWIgZm9yIGFwcGxpY2F0aW9uIHVwZGF0ZXMuXG4gKi9cblxudmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4JykuRGlzcGF0Y2hlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGlzcGF0Y2hlcigpO1xuIiwiXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBTZXR0aW5nc0NvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9TZXR0aW5nc0NvbnN0YW50cycpO1xuXG52YXIgX2Rpc3BhdGNoVG9rZW47XG5cbmNsYXNzIFNldHRpbmdzU3RvcmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0X2Rpc3BhdGNoVG9rZW4gPSBBcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKChhY3Rpb24pID0+IHtcblxuXHRcdFx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG5cdFx0XHRcdGNhc2UgU2V0dGluZ3NDb25zdGFudHMuU0FWRV9TRVRUSU5HUzpcblx0XHRcdFx0XHR0aGlzLnNldFNldHRpbmdzKGFjdGlvbi5kYXRhKTtcblx0XHRcdFx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdC8vbm8gb3Bcblx0XHRcdH1cblxuXHRcdH0pO1xuXHR9XG5cbiAgLy8gRW1pdCBDaGFuZ2UgZXZlbnRcbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICB9XG5cbiAgLy8gQWRkIGNoYW5nZSBsaXN0ZW5lclxuICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMub24oJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSBjaGFuZ2UgbGlzdGVuZXJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG4gIH1cblxuXHRnZXREaXNwYXRjaFRva2VuKCkge1xuXHRcdHJldHVybiBfZGlzcGF0Y2hUb2tlbjtcblx0fVxuXG5cdHNldFNldHRpbmdzKGRhdGEpIHtcblx0XHR2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5nZXRTZXR0aW5ncygpLCBkYXRhKTtcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2V0dGluZ3MnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xuXHR9XG5cblx0Z2V0U2V0dGluZ3MoKSB7XG5cdFx0Y29uc29sZS5sb2coSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZ3MnKSkpXG5cdFx0cmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpIHx8IHt9O1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFNldHRpbmdzU3RvcmUoKTtcbiIsIlxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgU2V0dGluZ3NDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvU2V0dGluZ3NDb25zdGFudHMnKTtcbnZhciBTZXR0aW5nc0FjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL1NldHRpbmdzQWN0aW9ucycpO1xuXG52YXIgX2Rpc3BhdGNoVG9rZW47XG52YXIgX3VzZXJzID0gW107XG5cbmNsYXNzIFNldHRpbmdzVXNlcnNTdG9yZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHRfZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoKGFjdGlvbikgPT4ge1xuXG5cdFx0XHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cblx0XHRcdFx0Y2FzZSBTZXR0aW5nc0NvbnN0YW50cy5SRUNFSVZFX1VTRVJTOlxuXHRcdFx0XHRcdF91c2VycyA9IGFjdGlvbi5kYXRhO1xuXHRcdFx0XHRcdHRoaXMuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Ly9ubyBvcFxuXHRcdFx0fVxuXG5cdFx0fSk7XG5cdH1cblxuICAvLyBFbWl0IENoYW5nZSBldmVudFxuICBlbWl0Q2hhbmdlKCkge1xuICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gIH1cblxuICAvLyBBZGQgY2hhbmdlIGxpc3RlbmVyXG4gIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbignY2hhbmdlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgLy8gUmVtb3ZlIGNoYW5nZSBsaXN0ZW5lclxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NoYW5nZScsIGNhbGxiYWNrKTtcbiAgfVxuXG5cdGdldERpc3BhdGNoVG9rZW4oKSB7XG5cdFx0cmV0dXJuIF9kaXNwYXRjaFRva2VuO1xuXHR9XG5cblx0Z2V0VXNlcnMoKSB7XG5cdFx0cmV0dXJuIF91c2Vycztcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBTZXR0aW5nc1VzZXJzU3RvcmUoKTtcbiIsIlxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxudmFyIFNldHRpbmdzU3RvcmUgPSByZXF1aXJlKCcuL3N0b3Jlcy9TZXR0aW5nc1N0b3JlJyk7XG5cbmNsYXNzIFV0aWwge1xuXHRcblx0c3RhdGljIGFwaVJlcXVlc3Qob3B0aW9ucykge1xuXG5cdFx0dmFyIGRlZmF1bHRzID0ge1xuXHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0ZGF0YVR5cGU6ICd0ZXh0Jyxcblx0XHRcdGRhdGE6IHt9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnIpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihvcHRpb25zLnVybCwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSk7XG4gICAgICB9XG5cdFx0fTtcblxuXHRcdHZhciBhcHBTZXR0aW5ncyA9IFNldHRpbmdzU3RvcmUuZ2V0U2V0dGluZ3MoKTtcblx0XHRpZiAoYXBwU2V0dGluZ3MpIHtcblx0XHRcdGRlZmF1bHRzLmRhdGEgPSB7XG5cdFx0XHRcdGFwaV9ncm91cDogYXBwU2V0dGluZ3MuZ3JvdXBJZCxcblx0XHRcdFx0YXBpX3NlY3JldDogYXBwU2V0dGluZ3MuZ3JvdXBTZWNyZXRcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0dmFyIHNldHRpbmdzID0gJC5leHRlbmQodHJ1ZSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXHRcdCQuYWpheCgnaHR0cHM6Ly93d3cudGVhbWxlYWRlci5iZS9hcGknICsgb3B0aW9ucy51cmwsIHNldHRpbmdzKTtcblx0fVxuXG5cdHN0YXRpYyBodG1sRW50aXRpZXMoc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHN0cmluZ1xuXHRcdFx0LnJlcGxhY2UoLyZhbXA7L2csICcmJylcblx0XHRcdC5yZXBsYWNlKC8mIzAzOTsvZywgXCInXCIpO1xuXHR9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVdGlsOyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIlxudmFyIGd1aSA9IG5vZGVSZXF1aXJlKCdudy5ndWknKTtcbnZhciBtYiA9IG5ldyBndWkuTWVudSh7dHlwZTogJ21lbnViYXInfSk7XG50cnkge1xuICBtYi5jcmVhdGVNYWNCdWlsdGluKCdUZWFtbGVhZGVyIFRpbWUnLCB7XG4gICAgaGlkZUVkaXQ6IGZhbHNlLFxuICB9KTtcbiAgZ3VpLldpbmRvdy5nZXQoKS5tZW51ID0gbWI7XG59IGNhdGNoKGV4KSB7XG4gIGNvbnNvbGUubG9nKGV4Lm1lc3NhZ2UpO1xufVxuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFJvdXRlciA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlcicpO1xudmFyIERlZmF1bHRSb3V0ZSA9IFJvdXRlci5EZWZhdWx0Um91dGU7XG52YXIgUm91dGUgPSBSb3V0ZXIuUm91dGU7XG5cbnZhciBUZWFtbGVhZGVyVGltZUFwcCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9UZWFtbGVhZGVyVGltZUFwcC5yZWFjdCcpO1xudmFyIEhvbWUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvSG9tZS5yZWFjdCcpO1xudmFyIFNldHRpbmdzID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1NldHRpbmdzLnJlYWN0Jyk7XG5cbnZhciByb3V0ZXMgPSAoXG4gIDxSb3V0ZSBuYW1lPVwiYXBwXCIgcGF0aD1cIi9cIiBoYW5kbGVyPXtUZWFtbGVhZGVyVGltZUFwcH0+XG4gICAgPFJvdXRlIG5hbWU9XCJzZXR0aW5nc1wiIGhhbmRsZXI9e1NldHRpbmdzfS8+XG4gICAgPERlZmF1bHRSb3V0ZSBuYW1lPVwiaG9tZVwiIGhhbmRsZXI9e0hvbWV9Lz5cbiAgPC9Sb3V0ZT5cbik7XG5cblJvdXRlci5ydW4ocm91dGVzLCBmdW5jdGlvbiAoSGFuZGxlcikge1xuICBSZWFjdC5yZW5kZXIoPEhhbmRsZXIvPiwgZG9jdW1lbnQuYm9keSk7XG59KTsiXX0=
