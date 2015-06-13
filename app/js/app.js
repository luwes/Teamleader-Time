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

						if (data.length > 0) {

							data.push({ value: 'new', label: 'New task...' });
							_this4.setState({
								tasks: data,
								milestoneTask: data[0].value
							});
							_this4.props.onMilestoneTaskChange(data[0].value);
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
	//mixins: [LocalStorageMixin],

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

		this.props.onSettingsSubmit({
			groupId: groupId,
			groupSecret: groupSecret,
			userId: select ? React.findDOMNode(select).value : 0
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
					console.log(string);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9ob21lLmpzeCIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3NlbGVjdC1pbnB1dC5qc3giLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy9zZXR0aW5ncy5qc3giLCIvVXNlcnMvd2VzbGV5bHV5dGVuL1NpdGVzL3Byb2plY3RzL3RlYW1sZWFkZXItdGltZS9zd2F0Y2gvYXBwL3NyYy90ZXh0LWlucHV0LmpzeCIsIi9Vc2Vycy93ZXNsZXlsdXl0ZW4vU2l0ZXMvcHJvamVjdHMvdGVhbWxlYWRlci10aW1lL3N3YXRjaC9hcHAvc3JjL3V0aWwuanN4IiwiL1VzZXJzL3dlc2xleWx1eXRlbi9TaXRlcy9wcm9qZWN0cy90ZWFtbGVhZGVyLXRpbWUvc3dhdGNoL2FwcC9zcmMvYXBwLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQ0EsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdCLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN4QyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFNUMsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRTVCLGlCQUFnQixFQUFFLDBCQUFTLElB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LENBQUMsS0FBSyxDQUFDO0FBQ3pCLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7O0FBR3ZDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMxQixRQUFNLEVBQUUsa0JBQVk7QUFDbEIsV0FDRTs7UUFBSyxTQUFTLEVBQUMsS0FBSztNQUNyQjs7O1FBQ0MsNkJBQUssU0FBUyxFQUFDLFdBQVcsR0FBTztRQUNqQztBQUFDLGNBQUk7WUFBQyxFQUFFLEVBQUMsVUFBVSxFQUFDLFNBQVMsRUFBQyxlQUFlLEVBQUMsZUFBZSxFQUFDLFFBQVE7VUFDckUsMkJBQUcsU0FBUyxFQUFDLFdBQVcsR0FBSztTQUN2QjtPQUNDO01BR047O1VBQUssU0FBUyxFQUFDLFdBQVc7UUFDeEIsb0JBQUMsWUFBWSxPQUFFO09BQ1g7S0FDRixDQUNOO0dBQ0g7Q0FDRixDQUFDLENBQUM7O0FBRUgsSUFBSSxNQUFNLEdBQ1I7QUFBQyxPQUFLO0lBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRSxHQUFHLEFBQUM7RUFDdkMsb0JBQUMsS0FBSyxJQUFDLElBQUksRUFBQyxVQUFVLEVBQUMsT0FBTyxFQUFFLFFBQVEsQUFBQyxHQUFFO0VBQzFDLG9CQUFDLFlBQVksSUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBRSxJQUFJLEFBQUMsR0FBRTtDQUNwQyxBQUNULENBQUM7O0FBRUYsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxPQUFPLEVBQUU7QUFDcEMsT0FBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBQyxPQUFPLE9BQUUsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDekMsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgVGV4dElucHV0ID0gcmVxdWlyZSgnLi90ZXh0LWlucHV0Jyk7XG52YXIgU2VsZWN0SW5wdXQgPSByZXF1aXJlKCcuL3NlbGVjdC1pbnB1dCcpO1xuXG52YXIgSG9tZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRoYW5kbGVIb21lU3VibWl0OiBmdW5jdGlvbihkYXRhKSB7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJob21lXCI+XG5cdFx0XHRcdDxIb21lRm9ybSBcblx0XHRcdFx0XHRvbkhvbWVTdWJtaXQ9e3RoaXMuaGFuZGxlSG9tZVN1Ym1pdH0gXG5cdFx0XHRcdC8+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxudmFyIEhvbWVGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHByb2plY3Q6IDAsXG5cdFx0XHRtaWxlc3RvbmU6IDAsXG5cdFx0XHRtaWxlc3RvbmVUYXNrOiAwLFxuXHRcdFx0Y29udGFjdE9yQ29tcGFueTogJycsXG5cdFx0XHRjb250YWN0T3JDb21wYW55SWQ6IDBcblx0XHR9XG5cdH0sXG5cblx0aGFuZGxlU3VibWl0OiBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdH0sXG5cblx0aGFuZGxlUHJvamVjdENoYW5nZTogZnVuY3Rpb24ocHJvamVjdCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0cHJvamVjdDogcGFyc2VJbnQocHJvamVjdCksXG5cdFx0XHRtaWxlc3RvbmU6IDAsXG5cdFx0XHRtaWxlc3RvbmVUYXNrOiAwXG5cdFx0fSk7XG5cblx0XHRVdGlsLmFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFByb2plY3QucGhwJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cHJvamVjdF9pZDogcHJvamVjdFxuXHRcdFx0fSxcblx0XHRcdHN1Y2Nlc3M6IChzdHJpbmcpID0+IHtcblx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZyk7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdGNvbnRhY3RPckNvbXBhbnk6IGRhdGEuY29udGFjdF9vcl9jb21wYW55LFxuXHRcdFx0XHRcdGNvbnRhY3RPckNvbXBhbnlJZDogZGF0YS5jb250YWN0X29yX2NvbXBhbnlfaWRcblx0XHRcdFx0fSk7XG4gICAgICB9XG5cdFx0fSk7XG5cdH0sXG5cblx0aGFuZGxlTWlsZXN0b25lQ2hhbmdlOiBmdW5jdGlvbihtaWxlc3RvbmUpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdG1pbGVzdG9uZTogcGFyc2VJbnQobWlsZXN0b25lKVxuXHRcdH0pO1xuXHR9LFxuXG5cdGhhbmRsZU1pbGVzdG9uZVRhc2tDaGFuZ2U6IGZ1bmN0aW9uKHRhc2spIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdG1pbGVzdG9uZVRhc2s6IHBhcnNlSW50KHRhc2spXG5cdFx0fSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblxuXHRcdGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxmb3JtIGNsYXNzTmFtZT1cImZvcm0taG9yaXpvbnRhbFwiIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG5cblx0XHRcdFx0PFByb2plY3RTZWxlY3RJbnB1dENvbnRhaW5lciBvblByb2plY3RDaGFuZ2U9e3RoaXMuaGFuZGxlUHJvamVjdENoYW5nZX0gLz5cblxuXHRcdFx0XHQ8TWlsZXN0b25lU2VsZWN0SW5wdXRDb250YWluZXIgcHJvamVjdD17dGhpcy5zdGF0ZS5wcm9qZWN0fSBvbk1pbGVzdG9uZUNoYW5nZT17dGhpcy5oYW5kbGVNaWxlc3RvbmVDaGFuZ2V9IC8+XG5cblx0XHRcdFx0PE1pbGVzdG9uZVRhc2tzU2VsZWN0SW5wdXRDb250YWluZXIgbWlsZXN0b25lPXt0aGlzLnN0YXRlLm1pbGVzdG9uZX0gb25NaWxlc3RvbmVUYXNrQ2hhbmdlPXt0aGlzLmhhbmRsZU1pbGVzdG9uZVRhc2tDaGFuZ2V9IC8+XG5cblx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJidG4tdG9vbGJhclwiPlxuXHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tc20gc3RhcnQtdGltZXItYnRuXCI+U3RhcnQgdGltZXI8L2J1dHRvbj4gXG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9mb3JtPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgUHJvamVjdFNlbGVjdElucHV0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHByb2plY3RzOiBbXVxuXHRcdH1cblx0fSxcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0VXRpbC5hcGlSZXF1ZXN0KHtcblx0XHRcdHVybDogJy9nZXRQcm9qZWN0cy5waHAnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRhbW91bnQ6IDEwMCxcblx0XHRcdFx0cGFnZW5vOiAwXG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHQvL3Jldml2ZXIgZnVuY3Rpb24gdG8gcmVuYW1lIGtleXNcblx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZywgZnVuY3Rpb24ocHJvcCwgdmFsKSB7XG5cdFx0XHRcdFx0c3dpdGNoIChwcm9wKSB7XG5cdFx0XHRcdFx0XHRjYXNlICdpZCc6XG5cdFx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGNhc2UgJ3RpdGxlJzpcblx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYgKGRhdGEubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGRhdGEudW5zaGlmdCh7IHZhbHVlOiAwLCBsYWJlbDogJ0Nob29zZS4uLicgfSk7XG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHByb2plY3RzOiBkYXRhIH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0czogW10gfSk7XG5cdFx0XHRcdH1cbiAgICAgIH1cblx0XHR9KTtcblx0fSxcblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdHRoaXMucHJvcHMub25Qcm9qZWN0Q2hhbmdlKHRhcmdldC52YWx1ZSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJwcm9qZWN0XCI+UHJvamVjdDwvbGFiZWw+XG5cdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0XHQ8U2VsZWN0SW5wdXQgaWQ9XCJwcm9qZWN0XCIgcmVmPVwicHJvamVjdFwiIG9wdGlvbnM9e3RoaXMuc3RhdGUucHJvamVjdHN9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gLz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxudmFyIE1pbGVzdG9uZVNlbGVjdElucHV0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHByb2plY3Q6IDBcblx0XHR9XG5cdH0sXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG1pbGVzdG9uZXM6IFtdXG5cdFx0fVxuXHR9LFxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5wcm9qZWN0ICE9IG5leHRQcm9wcy5wcm9qZWN0KSB7XG5cblx0XHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHRcdHVybDogJy9nZXRNaWxlc3RvbmVzQnlQcm9qZWN0LnBocCcsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRwcm9qZWN0X2lkOiBuZXh0UHJvcHMucHJvamVjdFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdFx0Ly9yZXZpdmVyIGZ1bmN0aW9uIHRvIHJlbmFtZSBrZXlzXG5cdFx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZywgZnVuY3Rpb24ocHJvcCwgdmFsKSB7XG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRjYXNlICd0aXRsZSc6XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSBkYXRhLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0uY2xvc2VkID09IDEpIHtcblx0XHRcdFx0XHRcdFx0ZGF0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGRhdGEubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IG1pbGVzdG9uZXM6IGRhdGEgfSk7XG5cdFx0XHRcdFx0XHR0aGlzLnByb3BzLm9uTWlsZXN0b25lQ2hhbmdlKGRhdGFbMF0udmFsdWUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgbWlsZXN0b25lczogW10gfSk7XG5cdFx0XHRcdFx0fVxuXHQgICAgICB9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblx0XHR0aGlzLnByb3BzLm9uTWlsZXN0b25lQ2hhbmdlKHRhcmdldC52YWx1ZSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUubWlsZXN0b25lcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXHRcdHJldHVybiAoXG5cdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwibWlsZXN0b25lXCI+TWlsZXN0b25lPC9sYWJlbD5cblx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdFx0XHRcdDxTZWxlY3RJbnB1dCBpZD1cIm1pbGVzdG9uZVwiIHJlZj1cIm1pbGVzdG9uZVwiIG9wdGlvbnM9e3RoaXMuc3RhdGUubWlsZXN0b25lc30gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSAvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgTWlsZXN0b25lVGFza3NTZWxlY3RJbnB1dENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRtaWxlc3RvbmU6IDBcblx0XHR9XG5cdH0sXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRhc2tzOiBbXSxcblx0XHRcdG1pbGVzdG9uZVRhc2s6IDBcblx0XHR9XG5cdH0sXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuXHRcdGlmICh0aGlzLnByb3BzLm1pbGVzdG9uZSAhPSBuZXh0UHJvcHMubWlsZXN0b25lKSB7XG5cdFx0XHRpZiAobmV4dFByb3BzLm1pbGVzdG9uZSA+IDApIHtcblxuXHRcdFx0XHRVdGlsLmFwaVJlcXVlc3Qoe1xuXHRcdFx0XHRcdHVybDogJy9nZXRUYXNrc0J5TWlsZXN0b25lLnBocCcsXG5cdFx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdFx0bWlsZXN0b25lX2lkOiBuZXh0UHJvcHMubWlsZXN0b25lXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhzdHJpbmcpXG5cdFx0XHRcdFx0XHQvL3Jldml2ZXIgZnVuY3Rpb24gdG8gcmVuYW1lIGtleXNcblx0XHRcdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcsIGZ1bmN0aW9uKHByb3AsIHZhbCkge1xuXHRcdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3ApIHtcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdpZCc6XG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2Rlc2NyaXB0aW9uJzpcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMubGFiZWwgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gZGF0YS5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0uZG9uZSA9PSAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGRhdGEubGVuZ3RoID4gMCkge1xuXG5cdFx0XHRcdFx0XHRcdGRhdGEucHVzaCh7IHZhbHVlOiAnbmV3JywgbGFiZWw6ICdOZXcgdGFzay4uLicgfSk7XG5cdFx0XHRcdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdFx0XHRcdHRhc2tzOiBkYXRhLFxuXHRcdFx0XHRcdFx0XHRcdG1pbGVzdG9uZVRhc2s6IGRhdGFbMF0udmFsdWVcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdHRoaXMucHJvcHMub25NaWxlc3RvbmVUYXNrQ2hhbmdlKGRhdGFbMF0udmFsdWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdCAgICAgIH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHR0YXNrczogW10sXG5cdFx0XHRcdFx0bWlsZXN0b25lVGFzazogMFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5wcm9wcy5vbk1pbGVzdG9uZVRhc2tDaGFuZ2UoMCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cdFx0dGhpcy5wcm9wcy5vbk1pbGVzdG9uZVRhc2tDaGFuZ2UodGFyZ2V0LnZhbHVlKTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS50YXNrcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJtaWxlc3RvbmUtdGFza1wiPlRvZG88L2xhYmVsPlxuXHRcdFx0ICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cblx0XHRcdFx0XHRcdDxTZWxlY3RJbnB1dCBpZD1cIm1pbGVzdG9uZS10YXNrXCIgcmVmPVwibWlsZXN0b25lVGFza1wiIHZhbHVlPVwie3RoaXMuc3RhdGUubWlsZXN0b25lVGFza31cIiBvcHRpb25zPXt0aGlzLnN0YXRlLnRhc2tzfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IC8+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjdXN0b20tdGFza1wiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHRcdCAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwidGFzay10eXBlXCI+VHlwZTwvbGFiZWw+XG5cdFx0XHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHRcdFx0ICBcdDxUYXNrU2VsZWN0SW5wdXRDb250YWluZXIgLz5cblx0XHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cblx0XHRcdFx0XHQgIFx0PHRleHRhcmVhIGlkPVwidGFzay1kZXNjcmlwdGlvblwiIHJlZj1cInRhc2tEZXNjcmlwdGlvblwiIHBsYWNlaG9sZGVyPVwiVGFzayBkZXNjcmlwdGlvbi4uLlwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHJvd3M9XCIzXCI+PC90ZXh0YXJlYT5cblx0XHRcdFx0XHQgIDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdCk7XG5cdFx0fVxuXHR9XG59KTtcblxudmFyIFRhc2tTZWxlY3RJbnB1dENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0YXNrVHlwZXM6IFtdXG5cdFx0fVxuXHR9LFxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG5cblx0XHRVdGlsLmFwaVJlcXVlc3Qoe1xuXHRcdFx0dXJsOiAnL2dldFRhc2tUeXBlcy5waHAnLFxuXHRcdFx0c3VjY2VzczogKHN0cmluZykgPT4ge1xuXHRcdFx0XHQvL3Jldml2ZXIgZnVuY3Rpb24gdG8gcmVuYW1lIGtleXNcblx0XHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cmluZywgZnVuY3Rpb24ocHJvcCwgdmFsKSB7XG5cdFx0XHRcdFx0c3dpdGNoIChwcm9wKSB7XG5cdFx0XHRcdFx0XHRjYXNlICdpZCc6XG5cdFx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdGNhc2UgJ25hbWUnOlxuXHRcdFx0XHRcdFx0XHR0aGlzLmxhYmVsID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyB0YXNrVHlwZXM6IGRhdGEgfSk7XG4gICAgICB9XG5cdFx0fSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxTZWxlY3RJbnB1dCBpZD1cInRhc2stdHlwZVwiIHJlZj1cInRhc2tUeXBlXCIgb3B0aW9ucz17dGhpcy5zdGF0ZS50YXNrVHlwZXN9IC8+XG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSG9tZVxuIiwiXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxudmFyIFNlbGVjdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cbiAgXHR2YXIgb3B0aW9uTm9kZXMgPSB0aGlzLnByb3BzLm9wdGlvbnMubWFwKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgcmV0dXJuIChcbiAgICAgIFx0PG9wdGlvbiBrZXk9e29wdGlvbi52YWx1ZX0gdmFsdWU9e29wdGlvbi52YWx1ZX0gPntVdGlsLmh0bWxFbnRpdGllcyhvcHRpb24ubGFiZWwpfTwvb3B0aW9uPlxuICAgICAgKTtcbiAgXHR9KTtcblxuXHRcdHJldHVybiAoXG5cdCAgXHQ8c2VsZWN0IFxuXHQgIFx0XHR7Li4udGhpcy5wcm9wc30gXG5cdCAgXHRcdGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIFxuXHRcdFx0PlxuXHQgIFx0XHR7b3B0aW9uTm9kZXN9XG5cdCAgXHQ8L3NlbGVjdD5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RJbnB1dDsiLCJcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgUm91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG52YXIgTGluayA9IFJvdXRlci5MaW5rO1xudmFyIFJvdXRlID0gUm91dGVyLlJvdXRlO1xuXG52YXIgTG9jYWxTdG9yYWdlTWl4aW4gPSByZXF1aXJlKCdyZWFjdC1sb2NhbHN0b3JhZ2UnKTtcblxudmFyIFV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBUZXh0SW5wdXQgPSByZXF1aXJlKCcuL3RleHQtaW5wdXQnKTtcbnZhciBTZWxlY3RJbnB1dCA9IHJlcXVpcmUoJy4vc2VsZWN0LWlucHV0Jyk7XG5cbnZhciBTZXR0aW5ncyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdzZXR0aW5ncycsXG5cdC8vbWl4aW5zOiBbTG9jYWxTdG9yYWdlTWl4aW5dLFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGdyb3VwSWQ6ICcnLFxuXHRcdFx0Z3JvdXBTZWNyZXQ6ICcnLFxuXHRcdFx0dXNlcklkOiAwLFxuXHRcdFx0dXNlck5hbWU6ICcnXG5cdFx0fTtcbiAgfSxcblxuXHRoYW5kbGVTZXR0aW5nc1N1Ym1pdDogZnVuY3Rpb24oc2V0dGluZ3MpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGdyb3VwSWQ6IHNldHRpbmdzLmdyb3VwSWQsXG5cdFx0XHRncm91cFNlY3JldDogc2V0dGluZ3MuZ3JvdXBTZWNyZXQsXG5cdFx0XHR1c2VySWQ6IHNldHRpbmdzLnVzZXJJZCxcblx0XHRcdHVzZXJOYW1lOiBzZXR0aW5ncy51c2VyTmFtZVxuXHRcdH0pO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwic2V0dGluZ3NcIj5cblx0XHRcdFx0PFNldHRpbmdzRm9ybSBcblx0XHRcdFx0XHRvblNldHRpbmdzU3VibWl0PXt0aGlzLmhhbmRsZVNldHRpbmdzU3VibWl0fSBcblx0XHRcdFx0XHRncm91cElkPXt0aGlzLnN0YXRlLmdyb3VwSWR9XG5cdFx0XHRcdFx0Z3JvdXBTZWNyZXQ9e3RoaXMuc3RhdGUuZ3JvdXBTZWNyZXR9XG5cdFx0XHRcdFx0dXNlcklkPXt0aGlzLnN0YXRlLnVzZXJJZH1cblx0XHRcdFx0Lz5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgU2V0dGluZ3NGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHZhciBncm91cElkID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmdyb3VwSWQpLnZhbHVlLnRyaW0oKTtcblx0XHR2YXIgZ3JvdXBTZWNyZXQgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuZ3JvdXBTZWNyZXQpLnZhbHVlLnRyaW0oKTtcblx0XHRpZiAoIWdyb3VwU2VjcmV0IHx8ICFncm91cElkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGNvbnRhaW5lciA9IHRoaXMucmVmcy51c2VyU2VsZWN0SW5wdXRDb250YWluZXI7XG5cdFx0dmFyIHNlbGVjdCA9IGNvbnRhaW5lci5yZWZzLnVzZXJTZWxlY3Q7XG5cblx0XHR0aGlzLnByb3BzLm9uU2V0dGluZ3NTdWJtaXQoe1xuXHRcdFx0Z3JvdXBJZDogZ3JvdXBJZCxcblx0XHRcdGdyb3VwU2VjcmV0OiBncm91cFNlY3JldCxcblx0XHRcdHVzZXJJZDogc2VsZWN0ID8gUmVhY3QuZmluZERPTU5vZGUoc2VsZWN0KS52YWx1ZSA6IDBcblx0XHR9KTtcblxuXHRcdHJldHVybjtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8Zm9ybSBjbGFzc05hbWU9XCJmb3JtLWhvcml6b250YWxcIiBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuXHRcdFx0ICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJncm91cC1pZFwiPkdyb3VwIElEPC9sYWJlbD5cblx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHQgICAgXHQ8VGV4dElucHV0IGlkPVwiZ3JvdXAtaWRcIiByZWY9XCJncm91cElkXCIgc2F2ZWRWYWx1ZT17dGhpcy5wcm9wcy5ncm91cElkfSAvPlxuXHRcdFx0ICAgIDwvZGl2PlxuXHRcdFx0ICA8L2Rpdj5cblx0XHRcdCAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHQgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC14cy0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPVwiZ3JvdXAtc2VjcmV0XCI+R3JvdXAgU2VjcmV0PC9sYWJlbD5cblx0XHRcdCAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG5cdFx0XHQgICAgXHQ8VGV4dElucHV0IGlkPVwiZ3JvdXAtc2VjcmV0XCIgcmVmPVwiZ3JvdXBTZWNyZXRcIiBzYXZlZFZhbHVlPXt0aGlzLnByb3BzLmdyb3VwU2VjcmV0fSAvPlxuXHRcdFx0ICAgIDwvZGl2PlxuXHRcdFx0ICA8L2Rpdj5cblx0XHRcdCAgPFVzZXJTZWxlY3RJbnB1dENvbnRhaW5lciBcblx0XHRcdCAgXHRyZWY9XCJ1c2VyU2VsZWN0SW5wdXRDb250YWluZXJcIlxuXHRcdFx0ICAgIGdyb3VwSWQ9e3RoaXMucHJvcHMuZ3JvdXBJZH0gXG5cdFx0XHQgICAgZ3JvdXBTZWNyZXQ9e3RoaXMucHJvcHMuZ3JvdXBTZWNyZXR9IFxuXHRcdFx0ICAgIHVzZXJJZD17dGhpcy5wcm9wcy51c2VySWR9XG5cdFx0XHRcdC8+XG5cdFx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLXRvb2xiYXJcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBkYXRhLWxvYWRpbmctdGV4dD1cIkxvYWRpbmcuLi5cIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIHNhdmUtc2V0dGluZ3MtYnRuXCI+U2F2ZTwvYnV0dG9uPiBcblx0XHRcdFx0XHQ8TGluayB0bz1cImhvbWVcIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtIGJhY2stc2V0dGluZ3MtYnRuXCI+QmFjazwvTGluaz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Zvcm0+XG5cdFx0KTtcblx0fVxufSk7XG5cbnZhciBVc2VyU2VsZWN0SW5wdXRDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnc2V0dGluZ3MtdXNlcnMnLFxuXHRtaXhpbnM6IFtMb2NhbFN0b3JhZ2VNaXhpbl0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dXNlcnM6IFtdXG5cdFx0fTtcbiAgfSxcblxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcblx0XHRpZiAobmV4dFByb3BzLmdyb3VwSWQgJiYgbmV4dFByb3BzLmdyb3VwU2VjcmV0KSB7XG5cblx0XHRcdFV0aWwuYXBpUmVxdWVzdCh7XG5cdFx0XHRcdHVybDogJy9nZXRVc2Vycy5waHAnLFxuXHRcdFx0XHRzdWNjZXNzOiAoc3RyaW5nKSA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coc3RyaW5nKVxuXHRcdFx0XHRcdC8vcmV2aXZlciBmdW5jdGlvbiB0byByZW5hbWUga2V5c1xuXHRcdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHJpbmcsIGZ1bmN0aW9uKHByb3AsIHZhbCkge1xuXHRcdFx0XHRcdFx0c3dpdGNoIChwcm9wKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbmFtZSc6XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5sYWJlbCA9IHZhbDtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgdXNlcnM6IGRhdGEgfSk7XG5cdCAgICAgIH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLnVzZXJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cdFx0cmV0dXJuIChcblx0XHQgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXHRcdCAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXhzLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9XCJ1c2VyLXNlbGVjdFwiPlNlbGVjdCB1c2VyPC9sYWJlbD5cblx0XHQgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuXHRcdCAgICBcdDxTZWxlY3RJbnB1dCBcblx0XHQgICAgXHRcdGlkPVwidXNlci1zZWxlY3RcIiBcblx0XHQgICAgXHRcdHJlZj1cInVzZXJTZWxlY3RcIiBcblx0XHQgICAgXHRcdG9wdGlvbnM9e3RoaXMuc3RhdGUudXNlcnN9IFxuXHRcdCAgICBcdFx0ZGVmYXVsdFZhbHVlPXt0aGlzLnByb3BzLnVzZXJJZH1cblx0XHQgICAgXHQvPlxuXHRcdCAgICA8L2Rpdj5cblx0XHQgIDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldHRpbmdzXG4iLCJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBUZXh0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4geyB2YWx1ZTogJycgfTtcblx0fSxcblxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcblx0XHR0aGlzLnNldFN0YXRlKHsgdmFsdWU6IG5leHRQcm9wcy5zYXZlZFZhbHVlIH0pO1xuXHR9LFxuXG5cdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR0aGlzLnNldFN0YXRlKHsgdmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZSB9KTtcbiAgfSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB2YWx1ZSA9IHRoaXMuc3RhdGUudmFsdWU7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxpbnB1dCBcblx0XHRcdFx0ey4uLnRoaXMucHJvcHN9XG5cdFx0XHRcdHR5cGU9XCJ0ZXh0XCIgXG5cdFx0XHRcdGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIFxuXHRcdFx0XHR2YWx1ZT17dmFsdWV9XG5cdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gXG5cdFx0XHQvPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRJbnB1dDsiLCJcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbmNsYXNzIFV0aWwge1xuXHRcblx0c3RhdGljIGFwaVJlcXVlc3Qob3B0aW9ucykge1xuXG5cdFx0dmFyIGFwcFNldHRpbmdzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZ3MnKSk7XG5cdFx0aWYgKGFwcFNldHRpbmdzKSB7XG5cblx0XHRcdHZhciBkZWZhdWx0cyA9IHtcblx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHRkYXRhVHlwZTogJ3RleHQnLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0YXBpX2dyb3VwOiBhcHBTZXR0aW5ncy5ncm91cElkLFxuXHRcdFx0XHRcdGFwaV9zZWNyZXQ6IGFwcFNldHRpbmdzLmdyb3VwU2VjcmV0LFxuXHRcdFx0XHR9LFxuXHQgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycikge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucy51cmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xuXHQgICAgICB9XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCBvcHRpb25zLCBkZWZhdWx0cyk7XG5cdFx0XHQkLmFqYXgoJ2h0dHBzOi8vd3d3LnRlYW1sZWFkZXIuYmUvYXBpJyArIG9wdGlvbnMudXJsLCBzZXR0aW5ncyk7XG5cdFx0fVxuXHR9XG5cblx0c3RhdGljIGh0bWxFbnRpdGllcyhzdHJpbmcpIHtcblx0XHRyZXR1cm4gc3RyaW5nXG5cdFx0XHQucmVwbGFjZSgvJmFtcDsvZywgJyYnKVxuXHRcdFx0LnJlcGxhY2UoLyYjMDM5Oy9nLCBcIidcIik7XG5cdH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFV0aWw7IiwiXG52YXIgZ3VpID0gbm9kZVJlcXVpcmUoJ253Lmd1aScpO1xudmFyIG1iID0gbmV3IGd1aS5NZW51KHt0eXBlOiAnbWVudWJhcid9KTtcbnRyeSB7XG4gIG1iLmNyZWF0ZU1hY0J1aWx0aW4oJ1RlYW1sZWFkZXIgVGltZScsIHtcbiAgICBoaWRlRWRpdDogZmFsc2UsXG4gIH0pO1xuICBndWkuV2luZG93LmdldCgpLm1lbnUgPSBtYjtcbn0gY2F0Y2goZXgpIHtcbiAgY29uc29sZS5sb2coZXgubWVzc2FnZSk7XG59XG5cbi8vdmFyIGpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy9jb25zb2xlLmxvZyhqUXVlcnkpO1xuLy92YXIgYm9vdHN0cmFwID0gcmVxdWlyZSgnYm9vdHN0cmFwJyk7XG4vL2NvbnNvbGUubG9nKGJvb3RzdHJhcCk7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUm91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG5cbnZhciBIb21lID0gcmVxdWlyZSgnLi9ob21lJyk7XG52YXIgU2V0dGluZ3MgPSByZXF1aXJlKCcuL3NldHRpbmdzJyk7XG5cbnZhciBEZWZhdWx0Um91dGUgPSBSb3V0ZXIuRGVmYXVsdFJvdXRlO1xudmFyIExpbmsgPSBSb3V0ZXIuTGluaztcbnZhciBSb3V0ZSA9IFJvdXRlci5Sb3V0ZTtcbnZhciBSb3V0ZUhhbmRsZXIgPSBSb3V0ZXIuUm91dGVIYW5kbGVyO1xuXG5cbnZhciBBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcFwiPlxuXHQgIFx0XHQ8aGVhZGVyPlxuXHQgIFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyZXh0XCI+PC9kaXY+XG5cdCAgXHRcdFx0PExpbmsgdG89XCJzZXR0aW5nc1wiIGNsYXNzTmFtZT1cInNldHRpbmdzLWxpbmtcIiBhY3RpdmVDbGFzc05hbWU9XCJhY3RpdmVcIj5cblx0ICBcdFx0XHRcdDxpIGNsYXNzTmFtZT1cImZhIGZhLWNvZ1wiPjwvaT5cblx0ICBcdFx0XHQ8L0xpbms+XG5cdCAgXHRcdDwvaGVhZGVyPlxuXG4gICAgICAgIHsvKiB0aGlzIGlzIHRoZSBpbXBvcnRhbnQgcGFydCAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICA8Um91dGVIYW5kbGVyLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxudmFyIHJvdXRlcyA9IChcbiAgPFJvdXRlIG5hbWU9XCJhcHBcIiBwYXRoPVwiL1wiIGhhbmRsZXI9e0FwcH0+XG4gIFx0PFJvdXRlIG5hbWU9XCJzZXR0aW5nc1wiIGhhbmRsZXI9e1NldHRpbmdzfS8+XG4gICAgPERlZmF1bHRSb3V0ZSBuYW1lPVwiaG9tZVwiIGhhbmRsZXI9e0hvbWV9Lz5cbiAgPC9Sb3V0ZT5cbik7XG5cblJvdXRlci5ydW4ocm91dGVzLCBmdW5jdGlvbiAoSGFuZGxlcikge1xuICBSZWFjdC5yZW5kZXIoPEhhbmRsZXIvPiwgZG9jdW1lbnQuYm9keSk7XG59KTtcbiJdfQ==
