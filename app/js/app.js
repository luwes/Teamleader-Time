(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../util":6,"./SelectInput.react":2,"./TextInput.react":5,"jquery":"jquery","react":"react"}],2:[function(require,module,exports){
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

},{"../util":6,"react":"react"}],3:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

var LocalStorageMixin = require('react-localstorage');

var Util = require('../util');
var TextInput = require('./TextInput.react');
var SelectInput = require('./SelectInput.react');

var Settings = React.createClass({
	displayName: 'settings',
	mixins: [LocalStorageMixin],

	getInitialState: function getInitialState() {
		return {
			groupId: '',
			groupSecret: '',
			userId: 0,
			userName: ''
		};
	},

	handleSettingsSubmit: function handleSettingsSubmit(settings) {
		this.setState({
			groupId: settings.groupId,
			groupSecret: settings.groupSecret,
			userId: settings.userId,
			userName: settings.userName
		});
	},

	render: function render() {
		return React.createElement(
			'div',
			{ className: 'settings' },
			React.createElement(SettingsForm, {
				onSettingsSubmit: this.handleSettingsSubmit,
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

		this.props.onSettingsSubmit({
			groupId: groupId,
			groupSecret: groupSecret,
			userId: select ? selectNode.value : 0,
			userName: select ? $(selectNode).find('option:selected').text() : ''
		});

		return;
	},

	render: function render() {
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
					React.createElement(TextInput, { id: 'group-id', ref: 'groupId', savedValue: this.props.groupId })
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
					React.createElement(TextInput, { id: 'group-secret', ref: 'groupSecret', savedValue: this.props.groupSecret })
				)
			),
			React.createElement(UserSelectInputContainer, {
				ref: 'userSelectInputContainer',
				groupId: this.props.groupId,
				groupSecret: this.props.groupSecret,
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
	displayName: 'settings-users',
	mixins: [LocalStorageMixin],

	getInitialState: function getInitialState() {
		return {
			users: []
		};
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		var _this = this;

		if (nextProps.groupId && nextProps.groupSecret) {

			Util.apiRequest({
				url: '/getUsers.php',
				data: {
					api_group: nextProps.groupId,
					api_secret: nextProps.groupSecret
				},
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
					_this.setState({ users: data });
				}
			});
		}
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

},{"../util":6,"./SelectInput.react":2,"./TextInput.react":5,"jquery":"jquery","react":"react","react-localstorage":"react-localstorage","react-router":"react-router"}],4:[function(require,module,exports){
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

},{"events":7,"flux":"flux","react":"react","react-router":"react-router"}],5:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

var TextInput = React.createClass({
	displayName: 'TextInput',

	getInitialState: function getInitialState() {
		return { value: '' };
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		this.setState({ value: nextProps.savedValue });
	},

	handleChange: function handleChange(event) {
		this.setState({ value: event.target.value });
	},

	render: function render() {
		var value = this.state.value;
		return React.createElement('input', _extends({}, this.props, {
			type: 'text',
			className: 'form-control',
			value: value,
			onChange: this.handleChange
		}));
	}
});

module.exports = TextInput;

},{"react":"react"}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $ = require('jquery');

var Util = (function () {
	function Util() {
		_classCallCheck(this, Util);
	}

	_createClass(Util, null, [{
		key: 'apiRequest',
		value: function apiRequest(options) {

			var appSettings = JSON.parse(localStorage.getItem('settings'));
			if (appSettings) {

				var defaults = {
					type: 'POST',
					dataType: 'text',
					data: {
						api_group: appSettings.groupId,
						api_secret: appSettings.groupSecret
					},
					error: function error(xhr, status, err) {
						console.error(options.url, status, err.toString());
					}
				};

				var settings = $.extend(true, defaults, options);
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

},{"jquery":"jquery"}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"./components/Home.react":1,"./components/Settings.react":3,"./components/TeamleaderTimeApp.react":4,"react":"react","react-router":"react-router"}]},{},[8])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL0hvbWUucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1NlbGVjdElucHV0LnJlYWN0LmpzIiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvY29tcG9uZW50cy9TZXR0aW5ncy5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL2NvbXBvbmVudHMvVGVhbWxlYWRlclRpbWVBcHAucmVhY3QuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9jb21wb25lbnRzL1RleHRJbnB1dC5yZWFjdC5qcyIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3V0aWwuanN4Iiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0NBLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FB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T0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FDdEIsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFHLENBQUMsQ0FBQztHQUMxQjs7O1FBNUJJLElBQUk7OztBQWdDVixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzs7O0FDbkN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDNVNBLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNoQyxJQUFJLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztBQUN6QyxJQUFJO0FBQ0YsSUFBRSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFO0FBQ3JDLFlBQVEsRUFBRSxLQUFLLEVBQ2hCLENBQUMsQ0FBQztBQUNILEtBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztDQUM1QixDQUFDLE9BQU0sRUFBRSxFQUFFO0FBQ1YsU0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDekI7O0FBRUQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNyQyxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO0FBQ3ZDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7O0FBRXpCLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7QUFDeEUsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDOUMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7O0FBRXRELElBQUksTUFBTSxHQUNSO0FBQUMsT0FBSztJQUFDLElBQUksRUFBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEFBQUM7RUFDcEQsb0JBQUMsS0FBSyxJQUFDLElBQUksRUFBQyxVQUFVLEVBQUMsT0FBTyxFQUFFLFFBQVEsQUFBQyxHQUFFO0VBQzNDLG9CQUFDLFlBQVksSUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBRSxJQUFJLEFBQUMsR0FBRTtDQUNwQyxBQUNULENBQUM7O0FBRUYsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxPQUFPLEVBQUU7QUFDcEMsT0FBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBQyxPQUFPLE9BQUUsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDekMsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xudmFyIFRleHRJbnB1dCA9IHJlcXVpcmUoJy4vVGV4dElucHV0LnJlYWN0Jyk7XG52YXIgU2VsZWN0SW5wdXQgPSByZXF1aXJlKCcuL1NlbGVjdElucHV0LnJlYWN0Jyk7XG5cbnZhciBIb21lID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGhhbmRsZUhvbWVTdWJtaXQ6IGZ1bmN0aW9uKGRhdGEpIHtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImhvbWVcIj5cblx0XHRcdFx0PEhvbWVGb3JtIFxuXHRcdFx0XHRcdG9uSG9tZVN1Ym1pdD17dGhpcy5oYW5kbGVIb21lU3VibWl0fSBcblx0XHRcdFx0Lz5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgSG9tZUZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJvamVjdDogMCxcblx0XHRcdG1pbGVzdG9uZTogMCxcblx0XHRcdG1pbGVzdG9uZVRhc2s6IDAsXG5cdFx0XHRjb250YWN0T3JDb21wYW55OiAnJyxcblx0XHRcdGNvbnRhY3RPckNvbXBhbnlJZDogMCxcblx0XHRcdHRhc2tUeXBlc0xvb2t1cDogW11cblx0XHR9XG5cdH0sXG5cblx0aGFuZGxlU3VibWl0OiBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdH0sXG5cblx0aGFuZGxlVGFza1R5cGVzTG9hZGVkOiBmdW5jdGlvbih0YXNrVHlwZXMpIHtcblxuXHR9LFxuXG5cdGhhbmRsZVByb2plY3RDaGFuZ2U6IGZ1bmN0aW9uKHByb2plY3QpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdHByb2plY3Q6IHBhcnNlSW50KHByb2plY3QpLFxuXHRcdFx0bWlsZXN0b25lOiAwLFxuXHRcdFx0bWlsZXN0b25lVGFzazogMFxuXHRcdH0pO1xuXG5cdFx0VXRpbC5hcGlSZXF1ZXN0KHtcblx0XHRcdHVybDogJy9nZXRQcm9qZWN0LnBocCcsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHByb2plY3RfaWQ6IHByb2plY3Rcblx0XHRcdH0sXG5cdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcpO1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRjb250YWN0T3JDb21wYW55OiBkYXRhLmNvbnRhY3Rfb3JfY29tcGFueSxcblx0XHRcdFx0XHRjb250YWN0T3JDb21wYW55SWQ6IGRhdGEuY29udGFjdF9vcl9jb21wYW55X2lkXG5cdFx0XHRcdH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXHR9LFxuXG5cdGhhbmRsZU1pbGVzdG9uZUNoYW5nZTogZnVuY3Rpb24obWlsZXN0b25lKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRtaWxlc3RvbmU6IHBhcnNlSW50KG1pbGVzdG9uZSlcblx0XHR9KTtcblx0fSxcblxuXHRoYW5kbGVNaWxlc3RvbmVUYXNrQ2hhbmdlOiBmdW5jdGlvbih0YXNrKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRtaWxlc3RvbmVUYXNrOiBwYXJzZUludCh0YXNrKVxuXHRcdH0pO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cblx0XHRjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8Zm9ybSBjbGFzc05hbWU9XCJmb3JtLWhvcml6b250YWxcIiBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuXG5cdFx0XHRcdDxQcm9qZWN0U2VsZWN0Q29udGFpbmVyIG9uUHJvamVjdENoYW5nZT17dGhpcy5oYW5kbGVQcm9qZWN0Q2hhbmdlfSAvPlxuXG5cdFx0XHRcdDxNaWxlc3RvbmVTZWxlY3RDb250YWluZXIgXG5cdFx0XHRcdFx0cHJvamVjdD17dGhpcy5zdGF0ZS5wcm9qZWN0fSBcblx0XHRcdFx0XHRvbk1pbGVzdG9uZUNoYW5nZT17dGhpcy5oYW5kbGVNaWxlc3RvbmVDaGFuZ2V9IFxuXHRcdFx0XHQvPlxuXG5cdFx0XHRcdDxUYXNrU2VsZWN0Q29udGFpbmVyIFxuXHRcdFx0XHRcdG1pbGVzdG9uZT17dGhpcy5zdGF0ZS5taWxlc3RvbmV9IFxuXHRcdFx0XHRcdG9uVGFza1R5cGVzTG9hZGVkPXt0aGlzLmhhbmRsZVRhc2tUeXBlc0xvYWRlZH0gXG5cdFx0XHRcdFx0b25NaWxlc3RvbmVUYXNrQ2hhbmdlPXt0aGlzLmhhbmRsZU1pbGVzdG9uZVRhc2tDaGFuZ2V9IFxuXHRcdFx0XHQvPlxuXG5cdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLXRvb2xiYXJcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIHN0YXJ0LXRpbWVyLWJ0blwiPlN0YXJ0IHRpbWVyPC9idXR0b24+IFxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZm9ybT5cblx0XHQpO1xuXHR9XG59KTtcblxudmFyIFByb2plY3RTZWxlY3RDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJvamVjdHM6IFtdXG5cdFx0fVxuXHR9LFxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG5cblx0XHRVdGlsLmFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFByb2plY3RzLnBocCcsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGFtb3VudDogMTAwLFxuXHRcdFx0XHRwYWdlbm86IDBcblx0XHRcdH0sXG5cdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHN0cmluZylcblx0XHRcdFx0Ly9yZXZpdmVyIGZ1bmN0aW9uIHRvIHJlbmFtZSBrZXlzXG5cdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcsIGZ1bmN0aW9uKHByb3AsIHZhbCkge1xuXHRcdFx0XHRcdHN3aXRjaCAocHJvcCkge1xuXHRcdFx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRjYXNlICd0aXRsZSc6XG5cdFx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChkYXRhLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRkYXRhLnVuc2hpZnQoeyB2YWx1ZTogMCwgbGFiZWw6ICdDaG9vc2UuLi4nIH0pO1xuXHRcdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0czogZGF0YSB9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgcHJvamVjdHM6IFtdIH0pO1xuXHRcdFx0XHR9XG4gICAgICB9XG5cdFx0fSk7XG5cdH0sXG5cdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblx0XHR0aGlzLnByb3BzLm9uUHJvamVjdENoYW5nZSh0YXJnZXQudmFsdWUpO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwicHJvamVjdFwiPlByb2plY3Q8L2xhYmVsPlxuXHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0PFNlbGVjdElucHV0IGlkPVwicHJvamVjdFwiIHJlZj1cInByb2plY3RcIiBvcHRpb25zPXt0aGlzLnN0YXRlLnByb2plY3RzfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IC8+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbnZhciBNaWxlc3RvbmVTZWxlY3RDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJvamVjdDogMFxuXHRcdH1cblx0fSxcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bWlsZXN0b25lczogW11cblx0XHR9XG5cdH0sXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuXHRcdGlmICh0aGlzLnByb3BzLnByb2plY3QgIT0gbmV4dFByb3BzLnByb2plY3QpIHtcblxuXHRcdFx0VXRpbC5hcGlSZXF1ZXN0KHtcblx0XHRcdFx0dXJsOiAnL2dldE1pbGVzdG9uZXNCeVByb2plY3QucGhwJyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdHByb2plY3RfaWQ6IG5leHRQcm9wcy5wcm9qZWN0XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdFx0XHQvL3Jldml2ZXIgZnVuY3Rpb24gdG8gcmVuYW1lIGtleXNcblx0XHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcCkge1xuXHRcdFx0XHRcdFx0XHRjYXNlICdpZCc6XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3RpdGxlJzpcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmxhYmVsID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IGRhdGEubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5jbG9zZWQgPT0gMSkge1xuXHRcdFx0XHRcdFx0XHRkYXRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoZGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgbWlsZXN0b25lczogZGF0YSB9KTtcblx0XHRcdFx0XHRcdHRoaXMucHJvcHMub25NaWxlc3RvbmVDaGFuZ2UoZGF0YVswXS52YWx1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyBtaWxlc3RvbmVzOiBbXSB9KTtcblx0XHRcdFx0XHR9XG5cdCAgICAgIH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdHRoaXMucHJvcHMub25NaWxlc3RvbmVDaGFuZ2UodGFyZ2V0LnZhbHVlKTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS5taWxlc3RvbmVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cdFx0cmV0dXJuIChcblx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJtaWxlc3RvbmVcIj5NaWxlc3RvbmU8L2xhYmVsPlxuXHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0PFNlbGVjdElucHV0IGlkPVwibWlsZXN0b25lXCIgcmVmPVwibWlsZXN0b25lXCIgb3B0aW9ucz17dGhpcy5zdGF0ZS5taWxlc3RvbmVzfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IC8+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbnZhciBUYXNrU2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG1pbGVzdG9uZTogMFxuXHRcdH1cblx0fSxcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGFza3M6IFtdLFxuXHRcdFx0bWlsZXN0b25lVGFzazogMFxuXHRcdH1cblx0fSxcblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMubWlsZXN0b25lICE9IG5leHRQcm9wcy5taWxlc3RvbmUpIHtcblx0XHRcdGlmIChuZXh0UHJvcHMubWlsZXN0b25lID4gMCkge1xuXG5cdFx0XHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHRcdFx0dXJsOiAnL2dldFRhc2tzQnlNaWxlc3RvbmUucGhwJyxcblx0XHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0XHRtaWxlc3RvbmVfaWQ6IG5leHRQcm9wcy5taWxlc3RvbmVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHN0cmluZylcblx0XHRcdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZywgZnVuY3Rpb24ocHJvcCwgdmFsKSB7XG5cdFx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcCkge1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAnZGVzY3JpcHRpb24nOlxuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSBkYXRhLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5kb25lID09IDEpIHtcblx0XHRcdFx0XHRcdFx0XHRkYXRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgYXBwU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXR0aW5ncycpKTtcblx0XHRcdFx0XHRcdGlmIChhcHBTZXR0aW5ncyAmJiBhcHBTZXR0aW5ncy51c2VyTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gZGF0YS5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5vd25lcl9uYW1lICE9IGFwcFNldHRpbmdzLnVzZXJOYW1lKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGRhdGEubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0XHRkYXRhLnB1c2goeyB2YWx1ZTogJ25ldycsIGxhYmVsOiAnTmV3IHRhc2suLi4nIH0pO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRcdFx0XHR0YXNrczogZGF0YSxcblx0XHRcdFx0XHRcdFx0XHRtaWxlc3RvbmVUYXNrOiBkYXRhWzBdLnZhbHVlXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnByb3BzLm9uTWlsZXN0b25lVGFza0NoYW5nZShkYXRhWzBdLnZhbHVlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdFx0XHRcdHRhc2tzOiBbXSxcblx0XHRcdFx0XHRcdFx0XHRtaWxlc3RvbmVUYXNrOiAwXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnByb3BzLm9uTWlsZXN0b25lVGFza0NoYW5nZSgwKTtcblx0XHRcdFx0XHRcdH1cblx0XHQgICAgICB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0dGFza3M6IFtdLFxuXHRcdFx0XHRcdG1pbGVzdG9uZVRhc2s6IDBcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMucHJvcHMub25NaWxlc3RvbmVUYXNrQ2hhbmdlKDApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdHRoaXMucHJvcHMub25NaWxlc3RvbmVUYXNrQ2hhbmdlKHRhcmdldC52YWx1ZSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUudGFza3MubGVuZ3RoID4gMSkge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwibWlsZXN0b25lLXRhc2tcIj5Ub2RvPC9sYWJlbD5cblx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0XHQ8U2VsZWN0SW5wdXQgaWQ9XCJtaWxlc3RvbmUtdGFza1wiIHJlZj1cIm1pbGVzdG9uZVRhc2tcIiB2YWx1ZT1cInt0aGlzLnN0YXRlLm1pbGVzdG9uZVRhc2t9XCIgb3B0aW9ucz17dGhpcy5zdGF0ZS50YXNrc30gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSAvPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY3VzdG9tLXRhc2tcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0XHQgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cInRhc2stdHlwZVwiPlR5cGU8L2xhYmVsPlxuXHRcdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdCAgXHQ8VGFza1R5cGVTZWxlY3RDb250YWluZXIgLz5cblx0XHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cblx0XHRcdFx0XHQgIFx0PHRleHRhcmVhIGlkPVwidGFzay1kZXNjcmlwdGlvblwiIHJlZj1cInRhc2tEZXNjcmlwdGlvblwiIHBsYWNlaG9sZGVyPVwiVGFzayBkZXNjcmlwdGlvbi4uLlwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHJvd3M9XCIzXCI+PC90ZXh0YXJlYT5cblx0XHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdCk7XG5cdFx0fVxuXHR9XG59KTtcblxudmFyIFRhc2tUeXBlU2VsZWN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRhc2tUeXBlczogW11cblx0XHR9XG5cdH0sXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcblxuXHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHR1cmw6ICcvZ2V0VGFza1R5cGVzLnBocCcsXG5cdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0Y2FzZSAnbmFtZSc6XG5cdFx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHRhc2tUeXBlczogZGF0YSB9KTtcbiAgICAgIH1cblx0XHR9KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PFNlbGVjdElucHV0IGlkPVwidGFzay10eXBlXCIgcmVmPVwidGFza1R5cGVcIiBvcHRpb25zPXt0aGlzLnN0YXRlLnRhc2tUeXBlc30gLz5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBIb21lXG4iLCJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIFNlbGVjdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cbiAgXHR2YXIgb3B0aW9uTm9kZXMgPSB0aGlzLnByb3BzLm9wdGlvbnMubWFwKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgcmV0dXJuIChcbiAgICAgIFx0PG9wdGlvbiBrZXk9e29wdGlvbi52YWx1ZX0gdmFsdWU9e29wdGlvbi52YWx1ZX0gPntVdGlsLmh0bWxFbnRpdGllcyhvcHRpb24ubGFiZWwpfTwvb3B0aW9uPlxuICAgICAgKTtcbiAgXHR9KTtcblxuXHRcdHJldHVybiAoXG5cdCAgXHQ8c2VsZWN0IFxuXHQgIFx0XHR7Li4udGhpcy5wcm9wc30gXG5cdCAgXHRcdGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIFxuXHRcdFx0PlxuXHQgIFx0XHR7b3B0aW9uTm9kZXN9XG5cdCAgXHQ8L3NlbGVjdD5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RJbnB1dDsiLCJcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgUm91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG52YXIgTGluayA9IFJvdXRlci5MaW5rO1xuXG52YXIgTG9jYWxTdG9yYWdlTWl4aW4gPSByZXF1aXJlKCdyZWFjdC1sb2NhbHN0b3JhZ2UnKTtcblxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG52YXIgVGV4dElucHV0ID0gcmVxdWlyZSgnLi9UZXh0SW5wdXQucmVhY3QnKTtcbnZhciBTZWxlY3RJbnB1dCA9IHJlcXVpcmUoJy4vU2VsZWN0SW5wdXQucmVhY3QnKTtcblxudmFyIFNldHRpbmdzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ3NldHRpbmdzJyxcblx0bWl4aW5zOiBbTG9jYWxTdG9yYWdlTWl4aW5dLFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGdyb3VwSWQ6ICcnLFxuXHRcdFx0Z3JvdXBTZWNyZXQ6ICcnLFxuXHRcdFx0dXNlcklkOiAwLFxuXHRcdFx0dXNlck5hbWU6ICcnXG5cdFx0fTtcbiAgfSxcblxuXHRoYW5kbGVTZXR0aW5nc1N1Ym1pdDogZnVuY3Rpb24oc2V0dGluZ3MpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGdyb3VwSWQ6IHNldHRpbmdzLmdyb3VwSWQsXG5cdFx0XHRncm91cFNlY3JldDogc2V0dGluZ3MuZ3JvdXBTZWNyZXQsXG5cdFx0XHR1c2VySWQ6IHNldHRpbmdzLnVzZXJJZCxcblx0XHRcdHVzZXJOYW1lOiBzZXR0aW5ncy51c2VyTmFtZVxuXHRcdH0pO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwic2V0dGluZ3NcIj5cblx0XHRcdFx0PFNldHRpbmdzRm9ybSBcblx0XHRcdFx0XHRvblNldHRpbmdzU3VibWl0PXt0aGlzLmhhbmRsZVNldHRpbmdzU3VibWl0fSBcblx0XHRcdFx0XHRncm91cElkPXt0aGlzLnN0YXRlLmdyb3VwSWR9XG5cdFx0XHRcdFx0Z3JvdXBTZWNyZXQ9e3RoaXMuc3RhdGUuZ3JvdXBTZWNyZXR9XG5cdFx0XHRcdFx0dXNlcklkPXt0aGlzLnN0YXRlLnVzZXJJZH1cblx0XHRcdFx0Lz5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgU2V0dGluZ3NGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHZhciBncm91cElkID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmdyb3VwSWQpLnZhbHVlLnRyaW0oKTtcblx0XHR2YXIgZ3JvdXBTZWNyZXQgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuZ3JvdXBTZWNyZXQpLnZhbHVlLnRyaW0oKTtcblx0XHRpZiAoIWdyb3VwU2VjcmV0IHx8ICFncm91cElkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGNvbnRhaW5lciA9IHRoaXMucmVmcy51c2VyU2VsZWN0SW5wdXRDb250YWluZXI7XG5cdFx0dmFyIHNlbGVjdCA9IGNvbnRhaW5lci5yZWZzLnVzZXJTZWxlY3Q7XG5cdFx0dmFyIHNlbGVjdE5vZGUgPSBSZWFjdC5maW5kRE9NTm9kZShzZWxlY3QpO1xuXG5cdFx0dGhpcy5wcm9wcy5vblNldHRpbmdzU3VibWl0KHtcblx0XHRcdGdyb3VwSWQ6IGdyb3VwSWQsXG5cdFx0XHRncm91cFNlY3JldDogZ3JvdXBTZWNyZXQsXG5cdFx0XHR1c2VySWQ6IHNlbGVjdCA/IHNlbGVjdE5vZGUudmFsdWUgOiAwLFxuXHRcdFx0dXNlck5hbWU6IHNlbGVjdCA/ICQoc2VsZWN0Tm9kZSkuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudGV4dCgpIDogJydcblx0XHR9KTtcblxuXHRcdHJldHVybjtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8Zm9ybSBjbGFzc05hbWU9XCJmb3JtLWhvcml6b250YWxcIiBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuXHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJncm91cC1pZFwiPkdyb3VwIElEPC9sYWJlbD5cblx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHQgICAgXHQ8VGV4dElucHV0IGlkPVwiZ3JvdXAtaWRcIiByZWY9XCJncm91cElkXCIgc2F2ZWRWYWx1ZT17dGhpcy5wcm9wcy5ncm91cElkfSAvPlxuXHRcdFx0ICAgIDwvZGl2PlxuXHRcdFx0ICA8L2Rpdj5cblx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwiZ3JvdXAtc2VjcmV0XCI+R3JvdXAgU2VjcmV0PC9sYWJlbD5cblx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHQgICAgXHQ8VGV4dElucHV0IGlkPVwiZ3JvdXAtc2VjcmV0XCIgcmVmPVwiZ3JvdXBTZWNyZXRcIiBzYXZlZFZhbHVlPXt0aGlzLnByb3BzLmdyb3VwU2VjcmV0fSAvPlxuXHRcdFx0ICAgIDwvZGl2PlxuXHRcdFx0ICA8L2Rpdj5cblx0XHRcdCAgPFVzZXJTZWxlY3RJbnB1dENvbnRhaW5lciBcblx0XHRcdCAgXHRyZWY9XCJ1c2VyU2VsZWN0SW5wdXRDb250YWluZXJcIlxuXHRcdFx0ICAgIGdyb3VwSWQ9e3RoaXMucHJvcHMuZ3JvdXBJZH0gXG5cdFx0XHQgICAgZ3JvdXBTZWNyZXQ9e3RoaXMucHJvcHMuZ3JvdXBTZWNyZXR9IFxuXHRcdFx0ICAgIHVzZXJJZD17dGhpcy5wcm9wcy51c2VySWR9XG5cdFx0XHRcdC8+XG5cdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLXRvb2xiYXJcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBkYXRhLWxvYWRpbmctdGV4dD1cIkxvYWRpbmcuLi5cIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIHNhdmUtc2V0dGluZ3MtYnRuXCI+U2F2ZTwvYnV0dG9uPiBcblx0XHRcdFx0XHQ8TGluayB0bz1cImhvbWVcIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtIGJhY2stc2V0dGluZ3MtYnRuXCI+QmFjazwvTGluaz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Zvcm0+XG5cdFx0KTtcblx0fVxufSk7XG5cbnZhciBVc2VyU2VsZWN0SW5wdXRDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnc2V0dGluZ3MtdXNlcnMnLFxuXHRtaXhpbnM6IFtMb2NhbFN0b3JhZ2VNaXhpbl0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dXNlcnM6IFtdXG5cdFx0fTtcbiAgfSxcblxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcblx0XHRcblx0XHRpZiAobmV4dFByb3BzLmdyb3VwSWQgJiYgbmV4dFByb3BzLmdyb3VwU2VjcmV0KSB7XG5cblx0XHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHRcdHVybDogJy9nZXRVc2Vycy5waHAnLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0YXBpX2dyb3VwOiBuZXh0UHJvcHMuZ3JvdXBJZCxcblx0XHRcdFx0XHRhcGlfc2VjcmV0OiBuZXh0UHJvcHMuZ3JvdXBTZWNyZXRcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcsIGZ1bmN0aW9uKHByb3AsIHZhbCkge1xuXHRcdFx0XHRcdFx0c3dpdGNoIChwcm9wKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbmFtZSc6XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgdXNlcnM6IGRhdGEgfSk7XG5cdCAgICAgIH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLnVzZXJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cdFx0cmV0dXJuIChcblx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJ1c2VyLXNlbGVjdFwiPlNlbGVjdCB1c2VyPC9sYWJlbD5cblx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdCAgICBcdDxTZWxlY3RJbnB1dCBcblx0XHQgICAgXHRcdGlkPVwidXNlci1zZWxlY3RcIiBcblx0XHQgICAgXHRcdHJlZj1cInVzZXJTZWxlY3RcIiBcblx0XHQgICAgXHRcdG9wdGlvbnM9e3RoaXMuc3RhdGUudXNlcnN9IFxuXHRcdCAgICBcdFx0ZGVmYXVsdFZhbHVlPXt0aGlzLnByb3BzLnVzZXJJZH1cblx0XHQgICAgXHQvPlxuXHRcdCAgICA8L2Rpdj5cblx0XHQgIDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldHRpbmdzXG4iLCJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUm91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG52YXIgTGluayA9IFJvdXRlci5MaW5rO1xudmFyIFJvdXRlSGFuZGxlciA9IFJvdXRlci5Sb3V0ZUhhbmRsZXI7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyO1xuXG5cbnZhciBUZWFtbGVhZGVyVGltZUFwcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXBwXCI+XG5cdCAgXHRcdDxoZWFkZXI+XG5cdCAgXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJoZWFkZXJleHRcIj48L2Rpdj5cblx0ICBcdFx0XHQ8TGluayB0bz1cInNldHRpbmdzXCIgY2xhc3NOYW1lPVwic2V0dGluZ3MtbGlua1wiIGFjdGl2ZUNsYXNzTmFtZT1cImFjdGl2ZVwiPlxuXHQgIFx0XHRcdFx0PGkgY2xhc3NOYW1lPVwiZmEgZmEtY29nXCI+PC9pPlxuXHQgIFx0XHRcdDwvTGluaz5cblx0ICBcdFx0PC9oZWFkZXI+XG5cbiAgICAgICAgey8qIHRoaXMgaXMgdGhlIGltcG9ydGFudCBwYXJ0ICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgIDxSb3V0ZUhhbmRsZXIvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1sZWFkZXJUaW1lQXBwO1xuIiwiXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgVGV4dElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHsgdmFsdWU6ICcnIH07XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiBuZXh0UHJvcHMuc2F2ZWRWYWx1ZSB9KTtcblx0fSxcblxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiBldmVudC50YXJnZXQudmFsdWUgfSk7XG4gIH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8aW5wdXQgXG5cdFx0XHRcdHsuLi50aGlzLnByb3BzfVxuXHRcdFx0XHR0eXBlPVwidGV4dFwiIFxuXHRcdFx0XHRjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBcblx0XHRcdFx0dmFsdWU9e3ZhbHVlfVxuXHRcdFx0XHRvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IFxuXHRcdFx0Lz5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0SW5wdXQ7IiwiXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG5jbGFzcyBVdGlsIHtcblx0XG5cdHN0YXRpYyBhcGlSZXF1ZXN0KG9wdGlvbnMpIHtcblxuXHRcdHZhciBhcHBTZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpO1xuXHRcdGlmIChhcHBTZXR0aW5ncykge1xuXG5cdFx0XHR2YXIgZGVmYXVsdHMgPSB7XG5cdFx0XHRcdHR5cGU6ICdQT1NUJyxcblx0XHRcdFx0ZGF0YVR5cGU6ICd0ZXh0Jyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdGFwaV9ncm91cDogYXBwU2V0dGluZ3MuZ3JvdXBJZCxcblx0XHRcdFx0XHRhcGlfc2VjcmV0OiBhcHBTZXR0aW5ncy5ncm91cFNlY3JldFxuXHRcdFx0XHR9LFxuXHQgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycikge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucy51cmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xuXHQgICAgICB9XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cdFx0XHQkLmFqYXgoJ2h0dHBzOi8vd3d3LnRlYW1sZWFkZXIuYmUvYXBpJyArIG9wdGlvbnMudXJsLCBzZXR0aW5ncyk7XG5cdFx0fVxuXHR9XG5cblx0c3RhdGljIGh0bWxFbnRpdGllcyhzdHJpbmcpIHtcblx0XHRyZXR1cm4gc3RyaW5nXG5cdFx0XHQucmVwbGFjZSgvJmFtcDsvZywgJyYnKVxuXHRcdFx0LnJlcGxhY2UoLyYjMDM5Oy9nLCBcIidcIik7XG5cdH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFV0aWw7IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiXG52YXIgZ3VpID0gbm9kZVJlcXVpcmUoJ253Lmd1aScpO1xudmFyIG1iID0gbmV3IGd1aS5NZW51KHt0eXBlOiAnbWVudWJhcid9KTtcbnRyeSB7XG4gIG1iLmNyZWF0ZU1hY0J1aWx0aW4oJ1RlYW1sZWFkZXIgVGltZScsIHtcbiAgICBoaWRlRWRpdDogZmFsc2UsXG4gIH0pO1xuICBndWkuV2luZG93LmdldCgpLm1lbnUgPSBtYjtcbn0gY2F0Y2goZXgpIHtcbiAgY29uc29sZS5sb2coZXgubWVzc2FnZSk7XG59XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUm91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG52YXIgRGVmYXVsdFJvdXRlID0gUm91dGVyLkRlZmF1bHRSb3V0ZTtcbnZhciBSb3V0ZSA9IFJvdXRlci5Sb3V0ZTtcblxudmFyIFRlYW1sZWFkZXJUaW1lQXBwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1RlYW1sZWFkZXJUaW1lQXBwLnJlYWN0Jyk7XG52YXIgSG9tZSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9Ib21lLnJlYWN0Jyk7XG52YXIgU2V0dGluZ3MgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvU2V0dGluZ3MucmVhY3QnKTtcblxudmFyIHJvdXRlcyA9IChcbiAgPFJvdXRlIG5hbWU9XCJhcHBcIiBwYXRoPVwiL1wiIGhhbmRsZXI9e1RlYW1sZWFkZXJUaW1lQXBwfT5cbiAgICA8Um91dGUgbmFtZT1cInNldHRpbmdzXCIgaGFuZGxlcj17U2V0dGluZ3N9Lz5cbiAgICA8RGVmYXVsdFJvdXRlIG5hbWU9XCJob21lXCIgaGFuZGxlcj17SG9tZX0vPlxuICA8L1JvdXRlPlxuKTtcblxuUm91dGVyLnJ1bihyb3V0ZXMsIGZ1bmN0aW9uIChIYW5kbGVyKSB7XG4gIFJlYWN0LnJlbmRlcig8SGFuZGxlci8+LCBkb2N1bWVudC5ib2R5KTtcbn0pOyJdfQ==
