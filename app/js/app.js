(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var React = require('react');

var Util = require('./util');
var TextInput = require('./text-input');
var SelectInput = require('./select-input');

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
			contactOrCompanyId: 0
		};
	},

	handleSubmit: function handleSubmit(e) {
		e.preventDefault();
	},

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
			React.createElement(ProjectSelectInputContainer, { onProjectChange: this.handleProjectChange }),
			React.createElement(MilestoneSelectInputContainer, { project: this.state.project, onMilestoneChange: this.handleMilestoneChange }),
			React.createElement(MilestoneTasksSelectInputContainer, { milestone: this.state.milestone, onMilestoneTaskChange: this.handleMilestoneTaskChange }),
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

var ProjectSelectInputContainer = React.createClass({
	displayName: 'ProjectSelectInputContainer',

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

var MilestoneSelectInputContainer = React.createClass({
	displayName: 'MilestoneSelectInputContainer',

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

var MilestoneTasksSelectInputContainer = React.createClass({
	displayName: 'MilestoneTasksSelectInputContainer',

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
						React.createElement(TaskSelectInputContainer, null)
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

var TaskSelectInputContainer = React.createClass({
	displayName: 'TaskSelectInputContainer',

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

},{"./select-input":2,"./text-input":4,"./util":5,"jquery":"jquery","react":"react"}],2:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var Util = require('./util');

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

},{"./util":5,"react":"react"}],3:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var React = require('react');

var Router = require('react-router');
var Link = Router.Link;
var Route = Router.Route;

var LocalStorageMixin = require('react-localstorage');

var Util = require('./util');
var TextInput = require('./text-input');
var SelectInput = require('./select-input');

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

},{"./select-input":2,"./text-input":4,"./util":5,"jquery":"jquery","react":"react","react-localstorage":"react-localstorage","react-router":"react-router"}],4:[function(require,module,exports){
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

},{"react":"react"}],5:[function(require,module,exports){
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
						api_secret: appSettings.groupSecret },
					error: function error(xhr, status, err) {
						console.error(options.url, status, err.toString());
					}
				};

				var settings = $.extend(true, options, defaults);
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

},{"jquery":"jquery"}],6:[function(require,module,exports){
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

//var jQuery = require('jquery');
//console.log(jQuery);
//var bootstrap = require('bootstrap');
//console.log(bootstrap);

var React = require('react');
var Router = require('react-router');

var Home = require('./home');
var Settings = require('./settings');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
  displayName: 'App',

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

var routes = React.createElement(
  Route,
  { name: 'app', path: '/', handler: App },
  React.createElement(Route, { name: 'settings', handler: Settings }),
  React.createElement(DefaultRoute, { name: 'home', handler: Home })
);

Router.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.body);
});
/* this is the important part */

},{"./home":1,"./settings":3,"react":"react","react-router":"react-router"}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9ob21lLmpzeCIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3NlbGVjdC1pbnB1dC5qc3giLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zZXR0aW5ncy5qc3giLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy90ZXh0LWlucHV0LmpzeCIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3V0aWwuanN4IiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvYXBwLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQ0EsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdCLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN4QyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFNUMsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRTVCLGlCQUFnQixFQUFFLDBCQUFTLElBQUksRUFBRSxFQUNoQzs7QUFFRCxPQUFNLEVBQUUsa0JBQVc7QUFDbEIsU0FDQzs7S0FBSyxTQUFTLEVBQUMsTUFBTTtHQUNwQixvQkFBQyxRQUFRO0FBQ1IsZ0JBQVksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEFBQUM7S0FDbkM7R0FDRyxDQUNMO0VBQ0Y7Q0FDRCxDQUFDLENBQUM7O0FBRUgsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRWhDLGdCQUFlLEVBQUUsMkJBQVc7QUFDM0IsU0FBTztBQUNOLFVBQU8sRUFBRSxDQUFDO0FBQ1YsWUFBUyxFQUFFLENBQUM7QUFDWixnQkFBYSxFQUFFLENBQUM7QUFDaEIsbUJBQWdCLEVBQUUsRUFBRTtBQUNwQixxQkFBa0IsRUFBRSxDQUFDO0dBQ3JCLENBQUE7RUFDRDs7QUFFRCxhQUFZLEVBQUUsc0JBQVMsQ0FBQyxFQUFFO0FBQ3pCLEdBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztFQUVuQjs7QUFFRCxvQkFBbUIsRUFBRSw2QkFBUyxPQUFPLEVBQUU7OztBQUN0QyxNQUFJLENBQUMsUUFBUSxDQUFDO0FBQ2IsVUFBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7QUFDMUIsWUFBUyxFQUFFLENBQUM7QUFDWixnQkFBYSxFQUFFLENBQUM7R0FDaEIsQ0FBQyxDQUFDOztBQUVILE1BQUksQ0FBQyxVQUFVLENBQUM7QUFDZixNQUFHLEVBQUUsaUJBQWlCO0FBQ3RCLE9BQUksRUFBRTtBQUNMLGNBQVUsRUFBRSxPQUFPO0lBQ25CO0FBQ0QsVUFBTyxFQUFFLGlCQUFDLE1BQU0sRUFBSztBQUNwQixRQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlCLFVBQUssUUFBUSxDQUFDO0FBQ2IscUJBQWdCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjtBQUN6Qyx1QkFBa0IsRUFBRSxJQUFJLENBQUMscUJBQXFCO0tBQzlDLENBQUMsQ0FBQztJQUNBO0dBQ0osQ0FBQyxDQUFDO0VBQ0g7O0FBRUQsc0JBQXFCLEVBQUUsK0JBQVMsU0FBUyxFQUFFO0FBQzFDLE1BQUksQ0FBQyxRQUFRLENBQUM7QUFDYixZQUFTLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQztHQUM5QixDQUFDLENBQUM7RUFDSDs7QUFFRCwwQkFBeUIsRUFBRSxtQ0FBUyxJQUFJLEVBQUU7QUFDekMsTUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNiLGdCQUFhLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQztHQUM3QixDQUFDLENBQUM7RUFDSDs7QUFFRCxPQUFNLEVBQUUsa0JBQVc7O0FBRWxCLFNBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV4QixTQUNDOztLQUFNLFNBQVMsRUFBQyxpQkFBaUIsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQUFBQztHQUU3RCxvQkFBQywyQkFBMkIsSUFBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixBQUFDLEdBQUc7R0FFMUUsb0JBQUMsNkJBQTZCLElBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxBQUFDLEVBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixBQUFDLEdBQUc7R0FFN0csb0JBQUMsa0NBQWtDLElBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxBQUFDLEVBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLHlCQUF5QixBQUFDLEdBQUc7R0FFN0g7O01BQUssU0FBUyxFQUFDLGFBQWE7SUFDNUI7O09BQVEsSUFBSSxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsd0NBQXdDOztLQUFxQjtJQUN4RjtHQUNBLENBQ047RUFDRjtDQUNELENBQUMsQ0FBQzs7QUFFSCxJQUFJLDJCQUEyQixHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUVuRCxnQkFBZSxFQUFFLDJCQUFXO0FBQzNCLFNBQU87QUFDTixXQUFRLEVBQUUsRUFBRTtHQUNaLENBQUE7RUFDRDtBQUNELGtCQUFpQixFQUFFLDZCQUFXOzs7QUFFN0IsTUFBSSxDQUFDLFVBQVUsQ0FBQztBQUNmLE1BQUcsRUFBRSxrQkFBa0I7QUFDdkIsT0FBSSxFQUFFO0FBQ0wsVUFBTSxFQUFFLEdBQUc7QUFDWCxVQUFNLEVBQUUsQ0FBQztJQUNUO0FBQ0QsVUFBTyxFQUFFLGlCQUFDLE1BQU0sRUFBSztBQUNwQixXQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBOztBQUVuQixRQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDakQsYUFBUSxJQUFJO0FBQ1gsV0FBSyxJQUFJO0FBQ1IsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsY0FBTztBQUFBLEFBQ1IsV0FBSyxPQUFPO0FBQ1gsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsY0FBTztBQUFBLEFBQ1I7QUFDQyxjQUFPLEdBQUcsQ0FBQztBQUFBLE1BQ1o7S0FDRCxDQUFDLENBQUM7O0FBRUgsUUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNwQixTQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUMvQyxZQUFLLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQ2xDLE1BQU07QUFDTixZQUFLLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ2hDO0lBQ0U7R0FDSixDQUFDLENBQUM7RUFDSDtBQUNELGFBQVksRUFBRSxzQkFBUyxLQUFLLEVBQUU7QUFDN0IsTUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztBQUNqQyxNQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDekM7QUFDRCxPQUFNLEVBQUUsa0JBQVc7QUFDbEIsU0FDRTs7S0FBSyxTQUFTLEVBQUMsWUFBWTtHQUN6Qjs7TUFBTyxTQUFTLEVBQUMsd0JBQXdCLEVBQUMsT0FBTyxFQUFDLFNBQVM7O0lBQWdCO0dBQzNFOztNQUFLLFNBQVMsRUFBQyxVQUFVO0lBQzFCLG9CQUFDLFdBQVcsSUFBQyxFQUFFLEVBQUMsU0FBUyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxBQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLEFBQUMsR0FBRztJQUNoRztHQUNELENBQ0w7RUFDRjtDQUNELENBQUMsQ0FBQzs7QUFFSCxJQUFJLDZCQUE2QixHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUVyRCxnQkFBZSxFQUFFLDJCQUFXO0FBQzNCLFNBQU87QUFDTixVQUFPLEVBQUUsQ0FBQztHQUNWLENBQUE7RUFDRDtBQUNELGdCQUFlLEVBQUUsMkJBQVc7QUFDM0IsU0FBTztBQUNOLGFBQVUsRUFBRSxFQUFFO0dBQ2QsQ0FBQTtFQUNEO0FBQ0QsMEJBQXlCLEVBQUUsbUNBQVMsU0FBUyxFQUFFOzs7QUFDOUMsTUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUMsT0FBTyxFQUFFOztBQUU1QyxPQUFJLENBQUMsVUFBVSxDQUFDO0FBQ2YsT0FBRyxFQUFFLDZCQUE2QjtBQUNsQyxRQUFJLEVBQUU7QUFDTCxlQUFVLEVBQUUsU0FBUyxDQUFDLE9BQU87S0FDN0I7QUFDRCxXQUFPLEVBQUUsaUJBQUMsTUFBTSxFQUFLOztBQUVwQixTQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDakQsY0FBUSxJQUFJO0FBQ1gsWUFBSyxJQUFJO0FBQ1IsWUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsZUFBTztBQUFBLEFBQ1IsWUFBSyxPQUFPO0FBQ1gsWUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsZUFBTztBQUFBLEFBQ1I7QUFDQyxlQUFPLEdBQUcsQ0FBQztBQUFBLE9BQ1o7TUFDRCxDQUFDLENBQUM7O0FBRUgsVUFBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3hDLFVBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7QUFDeEIsV0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7T0FDbEI7TUFDRDs7QUFFRCxTQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3BCLGFBQUssUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDcEMsYUFBSyxLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQzVDLE1BQU07QUFDTixhQUFLLFFBQVEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQ2xDO0tBQ0U7SUFDSixDQUFDLENBQUM7R0FDSDtFQUNEO0FBQ0QsYUFBWSxFQUFFLHNCQUFTLEtBQUssRUFBRTtBQUM3QixNQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO0FBQ2pDLE1BQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzNDO0FBQ0QsT0FBTSxFQUFFLGtCQUFXO0FBQ2xCLE1BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQztBQUNwRCxTQUNFOztLQUFLLFNBQVMsRUFBQyxZQUFZO0dBQ3pCOztNQUFPLFNBQVMsRUFBQyx3QkFBd0IsRUFBQyxPQUFPLEVBQUMsV0FBVzs7SUFBa0I7R0FDL0U7O01BQUssU0FBUyxFQUFDLFVBQVU7SUFDMUIsb0JBQUMsV0FBVyxJQUFDLEVBQUUsRUFBQyxXQUFXLEVBQUMsR0FBRyxFQUFDLFdBQVcsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEFBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQUFBQyxHQUFHO0lBQ3RHO0dBQ0QsQ0FDTDtFQUNGO0NBQ0QsQ0FBQyxDQUFDOztBQUVILElBQUksa0NBQWtDLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRTFELGdCQUFlLEVBQUUsMkJBQVc7QUFDM0IsU0FBTztBQUNOLFlBQVMsRUFBRSxDQUFDO0dBQ1osQ0FBQTtFQUNEO0FBQ0QsZ0JBQWUsRUFBRSwyQkFBVztBQUMzQixTQUFPO0FBQ04sUUFBSyxFQUFFLEVBQUU7QUFDVCxnQkFBYSxFQUFFLENBQUM7R0FDaEIsQ0FBQTtFQUNEO0FBQ0QsMEJBQXlCLEVBQUUsbUNBQVMsU0FBUyxFQUFFOzs7QUFDOUMsTUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsU0FBUyxFQUFFO0FBQ2hELE9BQUksU0FBUyxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUU7O0FBRTVCLFFBQUksQ0FBQyxVQUFVLENBQUM7QUFDZixRQUFHLEVBQUUsMEJBQTBCO0FBQy9CLFNBQUksRUFBRTtBQUNMLGtCQUFZLEVBQUUsU0FBUyxDQUFDLFNBQVM7TUFDakM7QUFDRCxZQUFPLEVBQUUsaUJBQUMsTUFBTSxFQUFLOztBQUVwQixVQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDakQsZUFBUSxJQUFJO0FBQ1gsYUFBSyxJQUFJO0FBQ1IsYUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsZ0JBQU87QUFBQSxBQUNSLGFBQUssYUFBYTtBQUNqQixhQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNqQixnQkFBTztBQUFBLEFBQ1I7QUFDQyxnQkFBTyxHQUFHLENBQUM7QUFBQSxRQUNaO09BQ0QsQ0FBQyxDQUFDOztBQUVILFdBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4QyxXQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xCO09BQ0Q7O0FBRUQsVUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDL0QsVUFBSSxXQUFXLElBQUksV0FBVyxDQUFDLFFBQVEsRUFBRTtBQUN4QyxZQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDeEMsWUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLFdBQVcsQ0FBQyxRQUFRLEVBQUU7QUFDL0MsYUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDbEI7UUFDRDtPQUNEOztBQUVELFVBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDcEIsV0FBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7QUFDbEQsY0FBSyxRQUFRLENBQUM7QUFDYixhQUFLLEVBQUUsSUFBSTtBQUNYLHFCQUFhLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUs7UUFDNUIsQ0FBQyxDQUFDO0FBQ0gsY0FBSyxLQUFLLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ2hELE1BQU07QUFDTixjQUFLLFFBQVEsQ0FBQztBQUNiLGFBQUssRUFBRSxFQUFFO0FBQ1QscUJBQWEsRUFBRSxDQUFDO1FBQ2hCLENBQUMsQ0FBQztBQUNILGNBQUssS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ3BDO01BQ0U7S0FDSixDQUFDLENBQUM7SUFDSCxNQUFNO0FBQ04sUUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNiLFVBQUssRUFBRSxFQUFFO0FBQ1Qsa0JBQWEsRUFBRSxDQUFDO0tBQ2hCLENBQUMsQ0FBQztBQUNILFFBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEM7R0FDRDtFQUNEO0FBQ0QsYUFBWSxFQUFFLHNCQUFTLEtBQUssRUFBRTtBQUM3QixNQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO0FBQ2pDLE1BQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQy9DO0FBQ0QsT0FBTSxFQUFFLGtCQUFXO0FBQ2xCLE1BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNoQyxVQUNFOztNQUFLLFNBQVMsRUFBQyxZQUFZO0lBQ3pCOztPQUFPLFNBQVMsRUFBQyx3QkFBd0IsRUFBQyxPQUFPLEVBQUMsZ0JBQWdCOztLQUFhO0lBQy9FOztPQUFLLFNBQVMsRUFBQyxVQUFVO0tBQzFCLG9CQUFDLFdBQVcsSUFBQyxFQUFFLEVBQUMsZ0JBQWdCLEVBQUMsR0FBRyxFQUFDLGVBQWUsRUFBQyxLQUFLLEVBQUMsNEJBQTRCLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxBQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLEFBQUMsR0FBRztLQUM3STtJQUNELENBQ0w7R0FDRixNQUFNO0FBQ04sVUFDQzs7TUFBSyxTQUFTLEVBQUMsYUFBYTtJQUMzQjs7T0FBSyxTQUFTLEVBQUMsWUFBWTtLQUN6Qjs7UUFBTyxTQUFTLEVBQUMsd0JBQXdCLEVBQUMsT0FBTyxFQUFDLFdBQVc7O01BQWE7S0FDMUU7O1FBQUssU0FBUyxFQUFDLFVBQVU7TUFDeEIsb0JBQUMsd0JBQXdCLE9BQUc7TUFDdkI7S0FDRjtJQUNOOztPQUFLLFNBQVMsRUFBQyxZQUFZO0tBQ3pCOztRQUFLLFNBQVMsRUFBQyxXQUFXO01BQ3pCLGtDQUFVLEVBQUUsRUFBQyxrQkFBa0IsRUFBQyxHQUFHLEVBQUMsaUJBQWlCLEVBQUMsV0FBVyxFQUFDLHFCQUFxQixFQUFDLFNBQVMsRUFBQyxjQUFjLEVBQUMsSUFBSSxFQUFDLEdBQUcsR0FBWTtNQUNoSTtLQUNGO0lBQ0QsQ0FDTDtHQUNGO0VBQ0Q7Q0FDRCxDQUFDLENBQUM7O0FBRUgsSUFBSSx3QkFBd0IsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFFaEQsZ0JBQWUsRUFBRSwyQkFBVztBQUMzQixTQUFPO0FBQ04sWUFBUyxFQUFFLEVBQUU7R0FDYixDQUFBO0VBQ0Q7QUFDRCxrQkFBaUIsRUFBRSw2QkFBVzs7O0FBRTdCLE1BQUksQ0FBQyxVQUFVLENBQUM7QUFDZixNQUFHLEVBQUUsbUJBQW1CO0FBQ3hCLFVBQU8sRUFBRSxpQkFBQyxNQUFNLEVBQUs7O0FBRXBCLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVMsSUFBSSxFQUFFLEdBQUcsRUFBRTtBQUNqRCxhQUFRLElBQUk7QUFDWCxXQUFLLElBQUk7QUFDUixXQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNqQixjQUFPO0FBQUEsQUFDUixXQUFLLE1BQU07QUFDVixXQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNqQixjQUFPO0FBQUEsQUFDUjtBQUNDLGNBQU8sR0FBRyxDQUFDO0FBQUEsTUFDWjtLQUNELENBQUMsQ0FBQztBQUNILFdBQUssUUFBUSxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEM7R0FDSixDQUFDLENBQUM7RUFDSDtBQUNELE9BQU0sRUFBRSxrQkFBVztBQUNsQixTQUNDLG9CQUFDLFdBQVcsSUFBQyxFQUFFLEVBQUMsV0FBVyxFQUFDLEdBQUcsRUFBQyxVQUFVLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxBQUFDLEdBQUcsQ0FDM0U7RUFDRjtDQUNELENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTs7Ozs7OztBQzlXckIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRW5DLE9BQU0sRUFBRSxrQkFBVzs7QUFFakIsTUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVMsTUFBTSxFQUFFO0FBQ3ZELFVBQ0M7O01BQVEsR0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEFBQUMsRUFBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQUFBQztJQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUFVLENBQzFGO0dBQ0osQ0FBQyxDQUFDOztBQUVKLFNBQ0U7O2dCQUNLLElBQUksQ0FBQyxLQUFLO0FBQ2QsYUFBUyxFQUFDLGNBQWM7O0dBRXZCLFdBQVc7R0FDSixDQUNUO0VBQ0Y7Q0FDRCxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUM7Ozs7O0FDeEI3QixJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDckMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN2QixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDOztBQUV6QixJQUFJLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOztBQUV0RCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0IsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3hDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUU1QyxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO0FBQ2hDLFlBQVcsRUFBRSxVQUFVO0FBQ3ZCLE9BQU0sRUFBRSxDQUFDLGlCQUFpQixDQUFDOztBQUUzQixnQkFBZSxFQUFFLDJCQUFXO0FBQzNCLFNBQU87QUFDTixVQUFPLEVBQUUsRUFBRTtBQUNYLGNBQVcsRUFBRSxFQUFFO0FBQ2YsU0FBTSxFQUFFLENBQUM7QUFDVCxXQUFRLEVBQUUsRUFBRTtHQUNaLENBQUM7RUFDRDs7QUFFRixxQkFBb0IsRUFBRSw4QkFBUyxRQUFRLEVBQUU7QUFDeEMsTUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNiLFVBQU8sRUFBRSxRQUFRLENBQUMsT0FBTztBQUN6QixjQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVc7QUFDakMsU0FBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNO0FBQ3ZCLFdBQVEsRUFBRSxRQUFRLENBQUMsUUFBUTtHQUMzQixDQUFDLENBQUM7RUFDSDs7QUFFRCxPQUFNLEVBQUUsa0JBQVc7QUFDbEIsU0FDQzs7S0FBSyxTQUFTLEVBQUMsVUFBVTtHQUN4QixvQkFBQyxZQUFZO0FBQ1osb0JBQWdCLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixBQUFDO0FBQzVDLFdBQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQUFBQztBQUM1QixlQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEFBQUM7QUFDcEMsVUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxBQUFDO0tBQ3pCO0dBQ0csQ0FDTDtFQUNGO0NBQ0QsQ0FBQyxDQUFDOztBQUVILElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUVwQyxhQUFZLEVBQUUsc0JBQVMsQ0FBQyxFQUFFO0FBQ3pCLEdBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFbkIsTUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoRSxNQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3hFLE1BQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDN0IsVUFBTztHQUNQOztBQUVELE1BQUksU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUM7QUFDbkQsTUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDdkMsTUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFM0MsTUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztBQUMzQixVQUFPLEVBQUUsT0FBTztBQUNoQixjQUFXLEVBQUUsV0FBVztBQUN4QixTQUFNLEVBQUUsTUFBTSxHQUFHLFVBQVUsQ0FBQyxLQUFLLEdBQUcsQ0FBQztBQUNyQyxXQUFRLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0dBQ3BFLENBQUMsQ0FBQzs7QUFFSCxTQUFPO0VBQ1A7O0FBRUQsT0FBTSxFQUFFLGtCQUFXO0FBQ2xCLFNBQ0M7O0tBQU0sU0FBUyxFQUFDLGlCQUFpQixFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWSxBQUFDO0dBQzVEOztNQUFLLFNBQVMsRUFBQyxZQUFZO0lBQ3pCOztPQUFPLFNBQVMsRUFBQyx3QkFBd0IsRUFBQyxPQUFPLEVBQUMsVUFBVTs7S0FBaUI7SUFDN0U7O09BQUssU0FBUyxFQUFDLFVBQVU7S0FDeEIsb0JBQUMsU0FBUyxJQUFDLEVBQUUsRUFBQyxVQUFVLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEFBQUMsR0FBRztLQUNwRTtJQUNGO0dBQ047O01BQUssU0FBUyxFQUFDLFlBQVk7SUFDekI7O09BQU8sU0FBUyxFQUFDLHdCQUF3QixFQUFDLE9BQU8sRUFBQyxjQUFjOztLQUFxQjtJQUNyRjs7T0FBSyxTQUFTLEVBQUMsVUFBVTtLQUN4QixvQkFBQyxTQUFTLElBQUMsRUFBRSxFQUFDLGNBQWMsRUFBQyxHQUFHLEVBQUMsYUFBYSxFQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQUFBQyxHQUFHO0tBQ2hGO0lBQ0Y7R0FDTixvQkFBQyx3QkFBd0I7QUFDeEIsT0FBRyxFQUFDLDBCQUEwQjtBQUM3QixXQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEFBQUM7QUFDNUIsZUFBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxBQUFDO0FBQ3BDLFVBQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQUFBQztLQUMzQjtHQUNEOztNQUFLLFNBQVMsRUFBQyxhQUFhO0lBQzVCOztPQUFRLElBQUksRUFBQyxRQUFRLEVBQUMscUJBQWtCLFlBQVksRUFBQyxTQUFTLEVBQUMsMENBQTBDOztLQUFjO0lBQ3ZIO0FBQUMsU0FBSTtPQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLDBDQUEwQzs7S0FBWTtJQUMzRTtHQUNBLENBQ047RUFDRjtDQUNELENBQUMsQ0FBQzs7QUFFSCxJQUFJLHdCQUF3QixHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7QUFDaEQsWUFBVyxFQUFFLGdCQUFnQjtBQUM3QixPQUFNLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQzs7QUFFM0IsZ0JBQWUsRUFBRSwyQkFBVztBQUMzQixTQUFPO0FBQ04sUUFBSyxFQUFFLEVBQUU7R0FDVCxDQUFDO0VBQ0Q7O0FBRUYsMEJBQXlCLEVBQUUsbUNBQVMsU0FBUyxFQUFFOzs7QUFDOUMsTUFBSSxTQUFTLENBQUMsT0FBTyxJQUFJLFNBQVMsQ0FBQyxXQUFXLEVBQUU7O0FBRS9DLE9BQUksQ0FBQyxVQUFVLENBQUM7QUFDZixPQUFHLEVBQUUsZUFBZTtBQUNwQixXQUFPLEVBQUUsaUJBQUMsTUFBTSxFQUFLOztBQUVwQixTQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDakQsY0FBUSxJQUFJO0FBQ1gsWUFBSyxJQUFJO0FBQ1IsWUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsZUFBTztBQUFBLEFBQ1IsWUFBSyxNQUFNO0FBQ1YsWUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsZUFBTztBQUFBLEFBQ1I7QUFDQyxlQUFPLEdBQUcsQ0FBQztBQUFBLE9BQ1o7TUFDRCxDQUFDLENBQUM7QUFDSCxXQUFLLFFBQVEsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQzVCO0lBQ0osQ0FBQyxDQUFDO0dBQ0g7RUFDRDs7QUFFRCxPQUFNLEVBQUUsa0JBQVc7QUFDbEIsTUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQy9DLFNBQ0U7O0tBQUssU0FBUyxFQUFDLFlBQVk7R0FDekI7O01BQU8sU0FBUyxFQUFDLHdCQUF3QixFQUFDLE9BQU8sRUFBQyxhQUFhOztJQUFvQjtHQUNuRjs7TUFBSyxTQUFTLEVBQUMsVUFBVTtJQUN4QixvQkFBQyxXQUFXO0FBQ1gsT0FBRSxFQUFDLGFBQWE7QUFDaEIsUUFBRyxFQUFDLFlBQVk7QUFDaEIsWUFBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxBQUFDO0FBQzFCLGlCQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEFBQUM7TUFDL0I7SUFDRztHQUNGLENBQ047RUFDRjtDQUNELENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQTs7Ozs7OztBQzdKekIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFFakMsZ0JBQWUsRUFBRSwyQkFBVztBQUMzQixTQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDO0VBQ3JCOztBQUVELDBCQUF5QixFQUFFLG1DQUFTLFNBQVMsRUFBRTtBQUM5QyxNQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0VBQy9DOztBQUVELGFBQVksRUFBRSxzQkFBUyxLQUFLLEVBQUU7QUFDN0IsTUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7RUFDNUM7O0FBRUYsT0FBTSxFQUFFLGtCQUFXO0FBQ2xCLE1BQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQzdCLFNBQ0MsMENBQ0ssSUFBSSxDQUFDLEtBQUs7QUFDZCxPQUFJLEVBQUMsTUFBTTtBQUNYLFlBQVMsRUFBQyxjQUFjO0FBQ3hCLFFBQUssRUFBRSxLQUFLLEFBQUM7QUFDYixXQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQUFBQztLQUMzQixDQUNEO0VBQ0Y7Q0FDRCxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7Ozs7Ozs7OztBQzlCM0IsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztJQUVwQixJQUFJO1VBQUosSUFBSTt3QkFBSixJQUFJOzs7Y0FBSixJQUFJOztTQUVRLG9CQUFDLE9BQU8sRUFBRTs7QUFFMUIsT0FBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDL0QsT0FBSSxXQUFXLEVBQUU7O0FBRWhCLFFBQUksUUFBUSxHQUFHO0FBQ2QsU0FBSSxFQUFFLE1BQU07QUFDWixhQUFRLEVBQUUsTUFBTTtBQUNoQixTQUFJLEVBQUU7QUFDTCxlQUFTLEVBQUUsV0FBVyxDQUFDLE9BQU87QUFDOUIsZ0JBQVUsRUFBRSxXQUFXLENBQUMsV0FBVyxFQUNuQztBQUNFLFVBQUssRUFBRSxlQUFTLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO0FBQ3BDLGFBQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7TUFDaEQ7S0FDSixDQUFDOztBQUVGLFFBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNqRCxLQUFDLENBQUMsSUFBSSxDQUFDLCtCQUErQixHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDaEU7R0FDRDs7O1NBRWtCLHNCQUFDLE1BQU0sRUFBRTtBQUMzQixVQUFPLE1BQU0sQ0FDWCxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUN0QixPQUFPLENBQUMsU0FBUyxFQUFFLElBQUcsQ0FBQyxDQUFDO0dBQzFCOzs7UUE1QkksSUFBSTs7O0FBZ0NWLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOzs7OztBQ2xDdEIsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2hDLElBQUksRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0FBQ3pDLElBQUk7QUFDRixJQUFFLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLEVBQUU7QUFDckMsWUFBUSxFQUFFLEtBQUssRUFDaEIsQ0FBQyxDQUFDO0FBQ0gsS0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0NBQzVCLENBQUMsT0FBTSxFQUFFLEVBQUU7QUFDVixTQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUN6Qjs7Ozs7OztBQU9ELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRXJDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRXJDLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDdkMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN2QixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ3pCLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7O0FBR3ZDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMxQixRQUFNLEVBQUUsa0JBQVk7QUFDbEIsV0FDRTs7UUFBSyxTQUFTLEVBQUMsS0FBSztNQUNyQjs7O1FBQ0MsNkJBQUssU0FBUyxFQUFDLFdBQVcsR0FBTztRQUNqQztBQUFDLGNBQUk7WUFBQyxFQUFFLEVBQUMsVUFBVSxFQUFDLFNBQVMsRUFBQyxlQUFlLEVBQUMsZUFBZSxFQUFDLFFBQVE7VUFDckUsMkJBQUcsU0FBUyxFQUFDLFdBQVcsR0FBSztTQUN2QjtPQUNDO01BR047O1VBQUssU0FBUyxFQUFDLFdBQVc7UUFDeEIsb0JBQUMsWUFBWSxPQUFFO09BQ1g7S0FDRixDQUNOO0dBQ0g7Q0FDRixDQUFDLENBQUM7O0FBRUgsSUFBSSxNQUFNLEdBQ1I7QUFBQyxPQUFLO0lBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRSxHQUFHLEFBQUM7RUFDdkMsb0JBQUMsS0FBSyxJQUFDLElBQUksRUFBQyxVQUFVLEVBQUMsT0FBTyxFQUFFLFFBQVEsQUFBQyxHQUFFO0VBQzFDLG9CQUFDLFlBQVksSUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBRSxJQUFJLEFBQUMsR0FBRTtDQUNwQyxBQUNULENBQUM7O0FBRUYsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxPQUFPLEVBQUU7QUFDcEMsT0FBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBQyxPQUFPLE9BQUUsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDekMsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgVGV4dElucHV0ID0gcmVxdWlyZSgnLi90ZXh0LWlucHV0Jyk7XG52YXIgU2VsZWN0SW5wdXQgPSByZXF1aXJlKCcuL3NlbGVjdC1pbnB1dCcpO1xuXG52YXIgSG9tZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRoYW5kbGVIb21lU3VibWl0OiBmdW5jdGlvbihkYXRhKSB7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJob21lXCI+XG5cdFx0XHRcdDxIb21lRm9ybSBcblx0XHRcdFx0XHRvbkhvbWVTdWJtaXQ9e3RoaXMuaGFuZGxlSG9tZVN1Ym1pdH0gXG5cdFx0XHRcdC8+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxudmFyIEhvbWVGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHByb2plY3Q6IDAsXG5cdFx0XHRtaWxlc3RvbmU6IDAsXG5cdFx0XHRtaWxlc3RvbmVUYXNrOiAwLFxuXHRcdFx0Y29udGFjdE9yQ29tcGFueTogJycsXG5cdFx0XHRjb250YWN0T3JDb21wYW55SWQ6IDBcblx0XHR9XG5cdH0sXG5cblx0aGFuZGxlU3VibWl0OiBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdH0sXG5cblx0aGFuZGxlUHJvamVjdENoYW5nZTogZnVuY3Rpb24ocHJvamVjdCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0cHJvamVjdDogcGFyc2VJbnQocHJvamVjdCksXG5cdFx0XHRtaWxlc3RvbmU6IDAsXG5cdFx0XHRtaWxlc3RvbmVUYXNrOiAwXG5cdFx0fSk7XG5cblx0XHRVdGlsLmFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFByb2plY3QucGhwJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cHJvamVjdF9pZDogcHJvamVjdFxuXHRcdFx0fSxcblx0XHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZyk7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdGNvbnRhY3RPckNvbXBhbnk6IGRhdGEuY29udGFjdF9vcl9jb21wYW55LFxuXHRcdFx0XHRcdGNvbnRhY3RPckNvbXBhbnlJZDogZGF0YS5jb250YWN0X29yX2NvbXBhbnlfaWRcblx0XHRcdFx0fSk7XG4gICAgICB9XG5cdFx0fSk7XG5cdH0sXG5cblx0aGFuZGxlTWlsZXN0b25lQ2hhbmdlOiBmdW5jdGlvbihtaWxlc3RvbmUpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdG1pbGVzdG9uZTogcGFyc2VJbnQobWlsZXN0b25lKVxuXHRcdH0pO1xuXHR9LFxuXG5cdGhhbmRsZU1pbGVzdG9uZVRhc2tDaGFuZ2U6IGZ1bmN0aW9uKHRhc2spIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdG1pbGVzdG9uZVRhc2s6IHBhcnNlSW50KHRhc2spXG5cdFx0fSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblxuXHRcdGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxmb3JtIGNsYXNzTmFtZT1cImZvcm0taG9yaXpvbnRhbFwiIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG5cblx0XHRcdFx0PFByb2plY3RTZWxlY3RJbnB1dENvbnRhaW5lciBvblByb2plY3RDaGFuZ2U9e3RoaXMuaGFuZGxlUHJvamVjdENoYW5nZX0gLz5cblxuXHRcdFx0XHQ8TWlsZXN0b25lU2VsZWN0SW5wdXRDb250YWluZXIgcHJvamVjdD17dGhpcy5zdGF0ZS5wcm9qZWN0fSBvbk1pbGVzdG9uZUNoYW5nZT17dGhpcy5oYW5kbGVNaWxlc3RvbmVDaGFuZ2V9IC8+XG5cblx0XHRcdFx0PE1pbGVzdG9uZVRhc2tzU2VsZWN0SW5wdXRDb250YWluZXIgbWlsZXN0b25lPXt0aGlzLnN0YXRlLm1pbGVzdG9uZX0gb25NaWxlc3RvbmVUYXNrQ2hhbmdlPXt0aGlzLmhhbmRsZU1pbGVzdG9uZVRhc2tDaGFuZ2V9IC8+XG5cblx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJidG4tdG9vbGJhclwiPlxuXHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tc20gc3RhcnQtdGltZXItYnRuXCI+U3RhcnQgdGltZXI8L2J1dHRvbj4gXG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9mb3JtPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgUHJvamVjdFNlbGVjdElucHV0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHByb2plY3RzOiBbXVxuXHRcdH1cblx0fSxcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0VXRpbC5hcGlSZXF1ZXN0KHtcblx0XHRcdHVybDogJy9nZXRQcm9qZWN0cy5waHAnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRhbW91bnQ6IDEwMCxcblx0XHRcdFx0cGFnZW5vOiAwXG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhzdHJpbmcpXG5cdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0Y2FzZSAndGl0bGUnOlxuXHRcdFx0XHRcdFx0XHR0aGlzLmxhYmVsID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoZGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0ZGF0YS51bnNoaWZ0KHsgdmFsdWU6IDAsIGxhYmVsOiAnQ2hvb3NlLi4uJyB9KTtcblx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgcHJvamVjdHM6IGRhdGEgfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHByb2plY3RzOiBbXSB9KTtcblx0XHRcdFx0fVxuICAgICAgfVxuXHRcdH0pO1xuXHR9LFxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cdFx0dGhpcy5wcm9wcy5vblByb2plY3RDaGFuZ2UodGFyZ2V0LnZhbHVlKTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cInByb2plY3RcIj5Qcm9qZWN0PC9sYWJlbD5cblx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdDxTZWxlY3RJbnB1dCBpZD1cInByb2plY3RcIiByZWY9XCJwcm9qZWN0XCIgb3B0aW9ucz17dGhpcy5zdGF0ZS5wcm9qZWN0c30gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSAvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgTWlsZXN0b25lU2VsZWN0SW5wdXRDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJvamVjdDogMFxuXHRcdH1cblx0fSxcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bWlsZXN0b25lczogW11cblx0XHR9XG5cdH0sXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuXHRcdGlmICh0aGlzLnByb3BzLnByb2plY3QgIT0gbmV4dFByb3BzLnByb2plY3QpIHtcblxuXHRcdFx0VXRpbC5hcGlSZXF1ZXN0KHtcblx0XHRcdFx0dXJsOiAnL2dldE1pbGVzdG9uZXNCeVByb2plY3QucGhwJyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdHByb2plY3RfaWQ6IG5leHRQcm9wcy5wcm9qZWN0XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdFx0XHQvL3Jldml2ZXIgZnVuY3Rpb24gdG8gcmVuYW1lIGtleXNcblx0XHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcCkge1xuXHRcdFx0XHRcdFx0XHRjYXNlICdpZCc6XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3RpdGxlJzpcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmxhYmVsID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IGRhdGEubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5jbG9zZWQgPT0gMSkge1xuXHRcdFx0XHRcdFx0XHRkYXRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoZGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgbWlsZXN0b25lczogZGF0YSB9KTtcblx0XHRcdFx0XHRcdHRoaXMucHJvcHMub25NaWxlc3RvbmVDaGFuZ2UoZGF0YVswXS52YWx1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyBtaWxlc3RvbmVzOiBbXSB9KTtcblx0XHRcdFx0XHR9XG5cdCAgICAgIH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdHRoaXMucHJvcHMub25NaWxlc3RvbmVDaGFuZ2UodGFyZ2V0LnZhbHVlKTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS5taWxlc3RvbmVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cdFx0cmV0dXJuIChcblx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJtaWxlc3RvbmVcIj5NaWxlc3RvbmU8L2xhYmVsPlxuXHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0PFNlbGVjdElucHV0IGlkPVwibWlsZXN0b25lXCIgcmVmPVwibWlsZXN0b25lXCIgb3B0aW9ucz17dGhpcy5zdGF0ZS5taWxlc3RvbmVzfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IC8+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbnZhciBNaWxlc3RvbmVUYXNrc1NlbGVjdElucHV0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG1pbGVzdG9uZTogMFxuXHRcdH1cblx0fSxcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGFza3M6IFtdLFxuXHRcdFx0bWlsZXN0b25lVGFzazogMFxuXHRcdH1cblx0fSxcblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMubWlsZXN0b25lICE9IG5leHRQcm9wcy5taWxlc3RvbmUpIHtcblx0XHRcdGlmIChuZXh0UHJvcHMubWlsZXN0b25lID4gMCkge1xuXG5cdFx0XHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHRcdFx0dXJsOiAnL2dldFRhc2tzQnlNaWxlc3RvbmUucGhwJyxcblx0XHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0XHRtaWxlc3RvbmVfaWQ6IG5leHRQcm9wcy5taWxlc3RvbmVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZywgZnVuY3Rpb24ocHJvcCwgdmFsKSB7XG5cdFx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcCkge1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAnZGVzY3JpcHRpb24nOlxuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSBkYXRhLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5kb25lID09IDEpIHtcblx0XHRcdFx0XHRcdFx0XHRkYXRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgYXBwU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXR0aW5ncycpKTtcblx0XHRcdFx0XHRcdGlmIChhcHBTZXR0aW5ncyAmJiBhcHBTZXR0aW5ncy51c2VyTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gZGF0YS5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5vd25lcl9uYW1lICE9IGFwcFNldHRpbmdzLnVzZXJOYW1lKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGRhdGEubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0XHRkYXRhLnB1c2goeyB2YWx1ZTogJ25ldycsIGxhYmVsOiAnTmV3IHRhc2suLi4nIH0pO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRcdFx0XHR0YXNrczogZGF0YSxcblx0XHRcdFx0XHRcdFx0XHRtaWxlc3RvbmVUYXNrOiBkYXRhWzBdLnZhbHVlXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnByb3BzLm9uTWlsZXN0b25lVGFza0NoYW5nZShkYXRhWzBdLnZhbHVlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdFx0XHRcdHRhc2tzOiBbXSxcblx0XHRcdFx0XHRcdFx0XHRtaWxlc3RvbmVUYXNrOiAwXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnByb3BzLm9uTWlsZXN0b25lVGFza0NoYW5nZSgwKTtcblx0XHRcdFx0XHRcdH1cblx0XHQgICAgICB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0dGFza3M6IFtdLFxuXHRcdFx0XHRcdG1pbGVzdG9uZVRhc2s6IDBcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMucHJvcHMub25NaWxlc3RvbmVUYXNrQ2hhbmdlKDApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdHRoaXMucHJvcHMub25NaWxlc3RvbmVUYXNrQ2hhbmdlKHRhcmdldC52YWx1ZSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUudGFza3MubGVuZ3RoID4gMSkge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwibWlsZXN0b25lLXRhc2tcIj5Ub2RvPC9sYWJlbD5cblx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0XHQ8U2VsZWN0SW5wdXQgaWQ9XCJtaWxlc3RvbmUtdGFza1wiIHJlZj1cIm1pbGVzdG9uZVRhc2tcIiB2YWx1ZT1cInt0aGlzLnN0YXRlLm1pbGVzdG9uZVRhc2t9XCIgb3B0aW9ucz17dGhpcy5zdGF0ZS50YXNrc30gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSAvPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY3VzdG9tLXRhc2tcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0XHQgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cInRhc2stdHlwZVwiPlR5cGU8L2xhYmVsPlxuXHRcdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdCAgXHQ8VGFza1NlbGVjdElucHV0Q29udGFpbmVyIC8+XG5cdFx0XHRcdFx0ICA8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG5cdFx0XHRcdFx0ICBcdDx0ZXh0YXJlYSBpZD1cInRhc2stZGVzY3JpcHRpb25cIiByZWY9XCJ0YXNrRGVzY3JpcHRpb25cIiBwbGFjZWhvbGRlcj1cIlRhc2sgZGVzY3JpcHRpb24uLi5cIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiByb3dzPVwiM1wiPjwvdGV4dGFyZWE+XG5cdFx0XHRcdFx0ICA8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQpO1xuXHRcdH1cblx0fVxufSk7XG5cbnZhciBUYXNrU2VsZWN0SW5wdXRDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGFza1R5cGVzOiBbXVxuXHRcdH1cblx0fSxcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0VXRpbC5hcGlSZXF1ZXN0KHtcblx0XHRcdHVybDogJy9nZXRUYXNrVHlwZXMucGhwJyxcblx0XHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdFx0Ly9yZXZpdmVyIGZ1bmN0aW9uIHRvIHJlbmFtZSBrZXlzXG5cdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcsIGZ1bmN0aW9uKHByb3AsIHZhbCkge1xuXHRcdFx0XHRcdHN3aXRjaCAocHJvcCkge1xuXHRcdFx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRjYXNlICduYW1lJzpcblx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgdGFza1R5cGVzOiBkYXRhIH0pO1xuICAgICAgfVxuXHRcdH0pO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8U2VsZWN0SW5wdXQgaWQ9XCJ0YXNrLXR5cGVcIiByZWY9XCJ0YXNrVHlwZVwiIG9wdGlvbnM9e3RoaXMuc3RhdGUudGFza1R5cGVzfSAvPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWVcbiIsIlxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBVdGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbnZhciBTZWxlY3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gIFx0dmFyIG9wdGlvbk5vZGVzID0gdGhpcy5wcm9wcy5vcHRpb25zLm1hcChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICBcdDxvcHRpb24ga2V5PXtvcHRpb24udmFsdWV9IHZhbHVlPXtvcHRpb24udmFsdWV9ID57VXRpbC5odG1sRW50aXRpZXMob3B0aW9uLmxhYmVsKX08L29wdGlvbj5cbiAgICAgICk7XG4gIFx0fSk7XG5cblx0XHRyZXR1cm4gKFxuXHQgIFx0PHNlbGVjdCBcblx0ICBcdFx0ey4uLnRoaXMucHJvcHN9IFxuXHQgIFx0XHRjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBcblx0XHRcdD5cblx0ICBcdFx0e29wdGlvbk5vZGVzfVxuXHQgIFx0PC9zZWxlY3Q+XG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0SW5wdXQ7IiwiXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIFJvdXRlciA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlcicpO1xudmFyIExpbmsgPSBSb3V0ZXIuTGluaztcbnZhciBSb3V0ZSA9IFJvdXRlci5Sb3V0ZTtcblxudmFyIExvY2FsU3RvcmFnZU1peGluID0gcmVxdWlyZSgncmVhY3QtbG9jYWxzdG9yYWdlJyk7XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgVGV4dElucHV0ID0gcmVxdWlyZSgnLi90ZXh0LWlucHV0Jyk7XG52YXIgU2VsZWN0SW5wdXQgPSByZXF1aXJlKCcuL3NlbGVjdC1pbnB1dCcpO1xuXG52YXIgU2V0dGluZ3MgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnc2V0dGluZ3MnLFxuXHRtaXhpbnM6IFtMb2NhbFN0b3JhZ2VNaXhpbl0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Z3JvdXBJZDogJycsXG5cdFx0XHRncm91cFNlY3JldDogJycsXG5cdFx0XHR1c2VySWQ6IDAsXG5cdFx0XHR1c2VyTmFtZTogJydcblx0XHR9O1xuICB9LFxuXG5cdGhhbmRsZVNldHRpbmdzU3VibWl0OiBmdW5jdGlvbihzZXR0aW5ncykge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0Z3JvdXBJZDogc2V0dGluZ3MuZ3JvdXBJZCxcblx0XHRcdGdyb3VwU2VjcmV0OiBzZXR0aW5ncy5ncm91cFNlY3JldCxcblx0XHRcdHVzZXJJZDogc2V0dGluZ3MudXNlcklkLFxuXHRcdFx0dXNlck5hbWU6IHNldHRpbmdzLnVzZXJOYW1lXG5cdFx0fSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJzZXR0aW5nc1wiPlxuXHRcdFx0XHQ8U2V0dGluZ3NGb3JtIFxuXHRcdFx0XHRcdG9uU2V0dGluZ3NTdWJtaXQ9e3RoaXMuaGFuZGxlU2V0dGluZ3NTdWJtaXR9IFxuXHRcdFx0XHRcdGdyb3VwSWQ9e3RoaXMuc3RhdGUuZ3JvdXBJZH1cblx0XHRcdFx0XHRncm91cFNlY3JldD17dGhpcy5zdGF0ZS5ncm91cFNlY3JldH1cblx0XHRcdFx0XHR1c2VySWQ9e3RoaXMuc3RhdGUudXNlcklkfVxuXHRcdFx0XHQvPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbnZhciBTZXR0aW5nc0Zvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0aGFuZGxlU3VibWl0OiBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIGdyb3VwSWQgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuZ3JvdXBJZCkudmFsdWUudHJpbSgpO1xuXHRcdHZhciBncm91cFNlY3JldCA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5ncm91cFNlY3JldCkudmFsdWUudHJpbSgpO1xuXHRcdGlmICghZ3JvdXBTZWNyZXQgfHwgIWdyb3VwSWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgY29udGFpbmVyID0gdGhpcy5yZWZzLnVzZXJTZWxlY3RJbnB1dENvbnRhaW5lcjtcblx0XHR2YXIgc2VsZWN0ID0gY29udGFpbmVyLnJlZnMudXNlclNlbGVjdDtcblx0XHR2YXIgc2VsZWN0Tm9kZSA9IFJlYWN0LmZpbmRET01Ob2RlKHNlbGVjdCk7XG5cblx0XHR0aGlzLnByb3BzLm9uU2V0dGluZ3NTdWJtaXQoe1xuXHRcdFx0Z3JvdXBJZDogZ3JvdXBJZCxcblx0XHRcdGdyb3VwU2VjcmV0OiBncm91cFNlY3JldCxcblx0XHRcdHVzZXJJZDogc2VsZWN0ID8gc2VsZWN0Tm9kZS52YWx1ZSA6IDAsXG5cdFx0XHR1c2VyTmFtZTogc2VsZWN0ID8gJChzZWxlY3ROb2RlKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS50ZXh0KCkgOiAnJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxmb3JtIGNsYXNzTmFtZT1cImZvcm0taG9yaXpvbnRhbFwiIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG5cdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0ICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wteHMtMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj1cImdyb3VwLWlkXCI+R3JvdXAgSUQ8L2xhYmVsPlxuXHRcdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdCAgICBcdDxUZXh0SW5wdXQgaWQ9XCJncm91cC1pZFwiIHJlZj1cImdyb3VwSWRcIiBzYXZlZFZhbHVlPXt0aGlzLnByb3BzLmdyb3VwSWR9IC8+XG5cdFx0XHQgICAgPC9kaXY+XG5cdFx0XHQgIDwvZGl2PlxuXHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJncm91cC1zZWNyZXRcIj5Hcm91cCBTZWNyZXQ8L2xhYmVsPlxuXHRcdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdCAgICBcdDxUZXh0SW5wdXQgaWQ9XCJncm91cC1zZWNyZXRcIiByZWY9XCJncm91cFNlY3JldFwiIHNhdmVkVmFsdWU9e3RoaXMucHJvcHMuZ3JvdXBTZWNyZXR9IC8+XG5cdFx0XHQgICAgPC9kaXY+XG5cdFx0XHQgIDwvZGl2PlxuXHRcdFx0ICA8VXNlclNlbGVjdElucHV0Q29udGFpbmVyIFxuXHRcdFx0ICBcdHJlZj1cInVzZXJTZWxlY3RJbnB1dENvbnRhaW5lclwiXG5cdFx0XHQgICAgZ3JvdXBJZD17dGhpcy5wcm9wcy5ncm91cElkfSBcblx0XHRcdCAgICBncm91cFNlY3JldD17dGhpcy5wcm9wcy5ncm91cFNlY3JldH0gXG5cdFx0XHQgICAgdXNlcklkPXt0aGlzLnByb3BzLnVzZXJJZH1cblx0XHRcdFx0Lz5cblx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJidG4tdG9vbGJhclwiPlxuXHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGRhdGEtbG9hZGluZy10ZXh0PVwiTG9hZGluZy4uLlwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tc20gc2F2ZS1zZXR0aW5ncy1idG5cIj5TYXZlPC9idXR0b24+IFxuXHRcdFx0XHRcdDxMaW5rIHRvPVwiaG9tZVwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4tc20gYmFjay1zZXR0aW5ncy1idG5cIj5CYWNrPC9MaW5rPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZm9ybT5cblx0XHQpO1xuXHR9XG59KTtcblxudmFyIFVzZXJTZWxlY3RJbnB1dENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdzZXR0aW5ncy11c2VycycsXG5cdG1peGluczogW0xvY2FsU3RvcmFnZU1peGluXSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR1c2VyczogW11cblx0XHR9O1xuICB9LFxuXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuXHRcdGlmIChuZXh0UHJvcHMuZ3JvdXBJZCAmJiBuZXh0UHJvcHMuZ3JvdXBTZWNyZXQpIHtcblxuXHRcdFx0VXRpbC5hcGlSZXF1ZXN0KHtcblx0XHRcdFx0dXJsOiAnL2dldFVzZXJzLnBocCcsXG5cdFx0XHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdFx0XHQvL3Jldml2ZXIgZnVuY3Rpb24gdG8gcmVuYW1lIGtleXNcblx0XHRcdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RyaW5nLCBmdW5jdGlvbihwcm9wLCB2YWwpIHtcblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcCkge1xuXHRcdFx0XHRcdFx0XHRjYXNlICdpZCc6XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ25hbWUnOlxuXHRcdFx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHVzZXJzOiBkYXRhIH0pO1xuXHQgICAgICB9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS51c2Vycy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXHRcdHJldHVybiAoXG5cdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwidXNlci1zZWxlY3RcIj5TZWxlY3QgdXNlcjwvbGFiZWw+XG5cdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHQgICAgXHQ8U2VsZWN0SW5wdXQgXG5cdFx0ICAgIFx0XHRpZD1cInVzZXItc2VsZWN0XCIgXG5cdFx0ICAgIFx0XHRyZWY9XCJ1c2VyU2VsZWN0XCIgXG5cdFx0ICAgIFx0XHRvcHRpb25zPXt0aGlzLnN0YXRlLnVzZXJzfSBcblx0XHQgICAgXHRcdGRlZmF1bHRWYWx1ZT17dGhpcy5wcm9wcy51c2VySWR9XG5cdFx0ICAgIFx0Lz5cblx0XHQgICAgPC9kaXY+XG5cdFx0ICA8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5nc1xuIiwiXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgVGV4dElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHsgdmFsdWU6ICcnIH07XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiBuZXh0UHJvcHMuc2F2ZWRWYWx1ZSB9KTtcblx0fSxcblxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiBldmVudC50YXJnZXQudmFsdWUgfSk7XG4gIH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8aW5wdXQgXG5cdFx0XHRcdHsuLi50aGlzLnByb3BzfVxuXHRcdFx0XHR0eXBlPVwidGV4dFwiIFxuXHRcdFx0XHRjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBcblx0XHRcdFx0dmFsdWU9e3ZhbHVlfVxuXHRcdFx0XHRvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IFxuXHRcdFx0Lz5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0SW5wdXQ7IiwiXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG5jbGFzcyBVdGlsIHtcblx0XG5cdHN0YXRpYyBhcGlSZXF1ZXN0KG9wdGlvbnMpIHtcblxuXHRcdHZhciBhcHBTZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpO1xuXHRcdGlmIChhcHBTZXR0aW5ncykge1xuXG5cdFx0XHR2YXIgZGVmYXVsdHMgPSB7XG5cdFx0XHRcdHR5cGU6ICdQT1NUJyxcblx0XHRcdFx0ZGF0YVR5cGU6ICd0ZXh0Jyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdGFwaV9ncm91cDogYXBwU2V0dGluZ3MuZ3JvdXBJZCxcblx0XHRcdFx0XHRhcGlfc2VjcmV0OiBhcHBTZXR0aW5ncy5ncm91cFNlY3JldCxcblx0XHRcdFx0fSxcblx0ICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnIpIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKG9wdGlvbnMudXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcblx0ICAgICAgfVxuXHRcdFx0fTtcblxuXHRcdFx0dmFyIHNldHRpbmdzID0gJC5leHRlbmQodHJ1ZSwgb3B0aW9ucywgZGVmYXVsdHMpO1xuXHRcdFx0JC5hamF4KCdodHRwczovL3d3dy50ZWFtbGVhZGVyLmJlL2FwaScgKyBvcHRpb25zLnVybCwgc2V0dGluZ3MpO1xuXHRcdH1cblx0fVxuXG5cdHN0YXRpYyBodG1sRW50aXRpZXMoc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHN0cmluZ1xuXHRcdFx0LnJlcGxhY2UoLyZhbXA7L2csICcmJylcblx0XHRcdC5yZXBsYWNlKC8mIzAzOTsvZywgXCInXCIpO1xuXHR9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVdGlsOyIsIlxudmFyIGd1aSA9IG5vZGVSZXF1aXJlKCdudy5ndWknKTtcbnZhciBtYiA9IG5ldyBndWkuTWVudSh7dHlwZTogJ21lbnViYXInfSk7XG50cnkge1xuICBtYi5jcmVhdGVNYWNCdWlsdGluKCdUZWFtbGVhZGVyIFRpbWUnLCB7XG4gICAgaGlkZUVkaXQ6IGZhbHNlLFxuICB9KTtcbiAgZ3VpLldpbmRvdy5nZXQoKS5tZW51ID0gbWI7XG59IGNhdGNoKGV4KSB7XG4gIGNvbnNvbGUubG9nKGV4Lm1lc3NhZ2UpO1xufVxuXG4vL3ZhciBqUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vY29uc29sZS5sb2coalF1ZXJ5KTtcbi8vdmFyIGJvb3RzdHJhcCA9IHJlcXVpcmUoJ2Jvb3RzdHJhcCcpO1xuLy9jb25zb2xlLmxvZyhib290c3RyYXApO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFJvdXRlciA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlcicpO1xuXG52YXIgSG9tZSA9IHJlcXVpcmUoJy4vaG9tZScpO1xudmFyIFNldHRpbmdzID0gcmVxdWlyZSgnLi9zZXR0aW5ncycpO1xuXG52YXIgRGVmYXVsdFJvdXRlID0gUm91dGVyLkRlZmF1bHRSb3V0ZTtcbnZhciBMaW5rID0gUm91dGVyLkxpbms7XG52YXIgUm91dGUgPSBSb3V0ZXIuUm91dGU7XG52YXIgUm91dGVIYW5kbGVyID0gUm91dGVyLlJvdXRlSGFuZGxlcjtcblxuXG52YXIgQXBwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhcHBcIj5cblx0ICBcdFx0PGhlYWRlcj5cblx0ICBcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImhlYWRlcmV4dFwiPjwvZGl2PlxuXHQgIFx0XHRcdDxMaW5rIHRvPVwic2V0dGluZ3NcIiBjbGFzc05hbWU9XCJzZXR0aW5ncy1saW5rXCIgYWN0aXZlQ2xhc3NOYW1lPVwiYWN0aXZlXCI+XG5cdCAgXHRcdFx0XHQ8aSBjbGFzc05hbWU9XCJmYSBmYS1jb2dcIj48L2k+XG5cdCAgXHRcdFx0PC9MaW5rPlxuXHQgIFx0XHQ8L2hlYWRlcj5cblxuICAgICAgICB7LyogdGhpcyBpcyB0aGUgaW1wb3J0YW50IHBhcnQgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgPFJvdXRlSGFuZGxlci8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciByb3V0ZXMgPSAoXG4gIDxSb3V0ZSBuYW1lPVwiYXBwXCIgcGF0aD1cIi9cIiBoYW5kbGVyPXtBcHB9PlxuICBcdDxSb3V0ZSBuYW1lPVwic2V0dGluZ3NcIiBoYW5kbGVyPXtTZXR0aW5nc30vPlxuICAgIDxEZWZhdWx0Um91dGUgbmFtZT1cImhvbWVcIiBoYW5kbGVyPXtIb21lfS8+XG4gIDwvUm91dGU+XG4pO1xuXG5Sb3V0ZXIucnVuKHJvdXRlcywgZnVuY3Rpb24gKEhhbmRsZXIpIHtcbiAgUmVhY3QucmVuZGVyKDxIYW5kbGVyLz4sIGRvY3VtZW50LmJvZHkpO1xufSk7XG4iXX0=
