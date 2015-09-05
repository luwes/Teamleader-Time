webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _Panel = __webpack_require__(1);

	var _Panel2 = _interopRequireDefault(_Panel);

	var _StatusBar = __webpack_require__(3);

	var _StatusBar2 = _interopRequireDefault(_StatusBar);

	var _MenuBar = __webpack_require__(4);

	var _MenuBar2 = _interopRequireDefault(_MenuBar);

	var _Routes = __webpack_require__(5);

	var _Routes2 = _interopRequireDefault(_Routes);

	var fs = nodeRequire('fs');

	var App = function App() {
		_classCallCheck(this, App);

		this.devMode = fs.existsSync('.dev') && fs.readFileSync('.dev', { encoding: 'utf8' }) === '1';

		this.panel = new _Panel2['default'](this);
		this.statusBar = new _StatusBar2['default'](this.panel);
		this.menuBar = new _MenuBar2['default']();
		this.routes = new _Routes2['default']();
	};

	exports['default'] = window.App = new App();
	module.exports = exports['default'];

/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _jquery = __webpack_require__(2);

	var _jquery2 = _interopRequireDefault(_jquery);

	var gui = nodeRequire('nw.gui');
	var window = gui.Window.get();

	var isVisible = false;
	var height = 0;
	var width = 0;
	var req;

	function _toggle(e) {
		isVisible ? _hide() : _show(e.x, e.y);
	}

	function _hide() {
		isVisible = false;
		window.hide();
	}

	function _show(x, y) {
		isVisible = true;
		window.moveTo(x - (0, _jquery2['default'])('.app').width() / 2 - 6, y);
		_resizeLoop();
		window.show();
		window.focus();
	}

	function _fitWindowToContent() {
		var hei = (0, _jquery2['default'])('.app').height() + 40;
		var wid = (0, _jquery2['default'])('.app').width() + 40;

		if (width != wid || height != hei) {
			window.resizeTo(wid, hei);
			width = wid;
			height = hei;
		}
	}

	function _resizeLoop() {
		_fitWindowToContent();
		if (isVisible) {
			req = requestAnimationFrame(_resizeLoop);
		}
	}

	var Panel = (function () {
		function Panel(App) {
			_classCallCheck(this, Panel);

			if (App.devMode) {
				window.showDevTools();
			} else {
				window.on('blur', _hide);
			}
		}

		_createClass(Panel, [{
			key: 'toggle',
			value: function toggle(e) {
				_toggle(e);
			}
		}]);

		return Panel;
	})();

	exports['default'] = Panel;
	module.exports = exports['default'];

/***/ },

/***/ 3:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var gui = nodeRequire('nw.gui');

	var StatusBar = function StatusBar(panel) {
	    _classCallCheck(this, StatusBar);

	    this.tray = new gui.Tray({
	        title: '',
	        icon: 'images/icon@2x.png'
	    });
	    this.tray.on('click', panel.toggle);
	};

	exports['default'] = StatusBar;
	module.exports = exports['default'];

/***/ },

/***/ 4:
/***/ function(module, exports) {

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
				hideEdit: false
			});
			gui.Window.get().menu = mb;
		} catch (ex) {
			console.log(ex.message);
		}
	};

	exports['default'] = MenuBar;
	module.exports = exports['default'];

/***/ },

/***/ 5:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _react = __webpack_require__(29);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(190);

	var _reactRouterLibHashHistory = __webpack_require__(217);

	var _reactRouterLibHashHistory2 = _interopRequireDefault(_reactRouterLibHashHistory);

	var _componentsTeamleaderTimeAppReact = __webpack_require__(219);

	var _componentsTeamleaderTimeAppReact2 = _interopRequireDefault(_componentsTeamleaderTimeAppReact);

	var _componentsTrackerReact = __webpack_require__(6);

	var _componentsTrackerReact2 = _interopRequireDefault(_componentsTrackerReact);

	var _componentsLoginReact = __webpack_require__(220);

	var _componentsLoginReact2 = _interopRequireDefault(_componentsLoginReact);

	var _componentsSettingsReact = __webpack_require__(223);

	var _componentsSettingsReact2 = _interopRequireDefault(_componentsSettingsReact);

	var _storesSettingsStore = __webpack_require__(22);

	var _storesSettingsStore2 = _interopRequireDefault(_storesSettingsStore);

	var Routes = (function () {
		function Routes() {
			_classCallCheck(this, Routes);

			_react2['default'].render(_react2['default'].createElement(
				_reactRouter.Router,
				{ history: new _reactRouterLibHashHistory2['default']() },
				_react2['default'].createElement(
					_reactRouter.Route,
					{ component: _componentsTeamleaderTimeAppReact2['default'] },
					_react2['default'].createElement(_reactRouter.Route, { path: "/", component: _componentsTrackerReact2['default'], onEnter: this.requireAuth }),
					_react2['default'].createElement(_reactRouter.Route, { path: "/login", component: _componentsLoginReact2['default'] }),
					_react2['default'].createElement(_reactRouter.Route, { path: "/settings", component: _componentsSettingsReact2['default'], onEnter: this.requireAuth })
				)
			), document.body);
		}

		_createClass(Routes, [{
			key: 'requireAuth',
			value: function requireAuth(nextState, transition) {
				if (!_storesSettingsStore2['default'].isLoggedIn()) {
					transition.to('/login', null, { nextPathname: nextState.location.pathname });
				}
			}
		}]);

		return Routes;
	})();

	exports['default'] = Routes;
	module.exports = exports['default'];

/***/ },

/***/ 6:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _react = __webpack_require__(29);

	var _react2 = _interopRequireDefault(_react);

	var _utilsUtils = __webpack_require__(21);

	var _storesProjectStore = __webpack_require__(20);

	var _storesProjectStore2 = _interopRequireDefault(_storesProjectStore);

	var _storesMilestoneTaskStore = __webpack_require__(26);

	var _storesMilestoneTaskStore2 = _interopRequireDefault(_storesMilestoneTaskStore);

	var _storesTaskStore = __webpack_require__(28);

	var _storesTaskStore2 = _interopRequireDefault(_storesTaskStore);

	var _storesTimeStore = __webpack_require__(7);

	var _storesTimeStore2 = _interopRequireDefault(_storesTimeStore);

	var _ProjectSelectContainerReact = __webpack_require__(185);

	var _ProjectSelectContainerReact2 = _interopRequireDefault(_ProjectSelectContainerReact);

	var _MilestoneSelectContainerReact = __webpack_require__(187);

	var _MilestoneSelectContainerReact2 = _interopRequireDefault(_MilestoneSelectContainerReact);

	var _TaskSelectContainerReact = __webpack_require__(188);

	var _TaskSelectContainerReact2 = _interopRequireDefault(_TaskSelectContainerReact);

	var _actionsTrackerActions = __webpack_require__(12);

	var Tracker = _react2['default'].createClass({
		displayName: 'Tracker',

		getTrackerState: function getTrackerState() {
			return {
				isTiming: _storesTimeStore2['default'].isTiming(),
				seconds: _storesTimeStore2['default'].getSecondsElapsed()
			};
		},

		getInitialState: function getInitialState() {
			return this.getTrackerState();
		},

		_onChange: function _onChange() {
			if (this.isMounted()) {
				this.setState(this.getTrackerState());
			}
		},

		componentDidMount: function componentDidMount() {
			_storesTimeStore2['default'].addChangeListener(this._onChange);
		},

		componentWillUnmount: function componentWillUnmount() {
			_storesTimeStore2['default'].removeChangeListener(this._onChange);
		},

		handleStart: function handleStart(e) {
			e.preventDefault();

			var now = Math.floor(Date.now() / 1000); //in seconds
			(0, _actionsTrackerActions.startTimer)(now);
		},

		handleStop: function handleStop(e) {
			e.preventDefault();

			var now = Math.floor(Date.now() / 1000); //in seconds
			(0, _actionsTrackerActions.stopTimer)(now);
		},

		render: function render() {
			if (this.state.isTiming) {
				return _react2['default'].createElement(
					'div',
					{ className: "tracker" },
					_react2['default'].createElement(
						'form',
						{ className: "", onSubmit: this.handleStop },
						_react2['default'].createElement(
							'div',
							{ className: "tracker-meta" },
							_react2['default'].createElement(
								'div',
								{ className: "tracker-project" },
								_storesProjectStore2['default'].getProjectTitle() || 'Untitled project'
							),
							_react2['default'].createElement(
								'div',
								{ className: "tracker-task" },
								_storesMilestoneTaskStore2['default'].getMilestoneTaskDescription() || _storesTaskStore2['default'].getTaskDescription() || 'No task description'
							)
						),
						_react2['default'].createElement(
							'div',
							{ className: "form-group" },
							_react2['default'].createElement('input', {
								type: "text",
								className: "form-control tracker-time",
								disabled: true,
								value: (0, _utilsUtils.formatTime)(this.state.seconds)
							})
						),
						_react2['default'].createElement(
							'div',
							{ className: "btn-toolbar" },
							_react2['default'].createElement(
								'button',
								{ type: "submit", className: "btn btn-primary btn-sm stop-timer-btn" },
								'Stop timer'
							)
						)
					)
				);
			} else {
				return _react2['default'].createElement(
					'div',
					{ className: "tracker" },
					_react2['default'].createElement(
						'form',
						{ className: "form-horizontal", onSubmit: this.handleStart },
						_react2['default'].createElement(_ProjectSelectContainerReact2['default'], null),
						_react2['default'].createElement(_MilestoneSelectContainerReact2['default'], null),
						_react2['default'].createElement(_TaskSelectContainerReact2['default'], { ref: "taskSelectContainer" }),
						_react2['default'].createElement(
							'div',
							{ className: "btn-toolbar" },
							_react2['default'].createElement(
								'button',
								{ type: "submit", className: "btn btn-primary btn-sm start-timer-btn" },
								'Start timer'
							)
						)
					)
				);
			}
		}
	});

	exports['default'] = Tracker;
	module.exports = exports['default'];

/***/ },

/***/ 7:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utilsStoreUtils = __webpack_require__(8);

	var _actionsTrackerActions = __webpack_require__(12);

	var _dispatcherAppDispatcher = __webpack_require__(16);

	var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

	var _constantsTrackerConstants = __webpack_require__(14);

	var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

	var _isTiming = false;
	var _interval;
	var _start;
	var _elapsed = 0;

	function _tick() {
		var now = Math.floor(Date.now() / 1000); //in seconds
		_elapsed = now - _start;

		TimeStore.emitChange();
	}

	var TimeStore = (0, _utilsStoreUtils.createStore)({

		isTiming: function isTiming() {
			return _isTiming;
		},

		getSecondsElapsed: function getSecondsElapsed() {
			return _elapsed;
		}

	});

	TimeStore.dispatchToken = _dispatcherAppDispatcher2['default'].register(function (action) {

		switch (action.type) {

			case _constantsTrackerConstants2['default'].START_TIMER:
				_start = action.timestamp;
				_isTiming = true;

				clearInterval(_interval);
				_interval = setInterval(_tick, 1000);

				TimeStore.emitChange();
				break;

			case _constantsTrackerConstants2['default'].STOP_TIMER:
				var end = action.timestamp;

				(0, _actionsTrackerActions.saveTime)(_start, end);

				_elapsed = 0;
				_isTiming = false;
				clearInterval(_interval);

				TimeStore.emitChange();
				break;

			default:
			//no op
		}
	});

	exports['default'] = TimeStore;
	module.exports = exports['default'];

/***/ },

/***/ 8:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.createStore = createStore;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _objectAssign = __webpack_require__(9);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _underscore = __webpack_require__(10);

	var _events = __webpack_require__(11);

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

/***/ },

/***/ 11:
/***/ function(module, exports) {

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


/***/ },

/***/ 12:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports.saveTime = saveTime;
	exports.startTimer = startTimer;
	exports.stopTimer = stopTimer;
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

	var _underscore = __webpack_require__(10);

	var _utilsUtils = __webpack_require__(21);

	var _dispatcherAppDispatcher = __webpack_require__(16);

	var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

	var _constantsTrackerConstants = __webpack_require__(14);

	var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

	var _storesCustomerStore = __webpack_require__(25);

	var _storesCustomerStore2 = _interopRequireDefault(_storesCustomerStore);

	var _storesProjectStore = __webpack_require__(20);

	var _storesProjectStore2 = _interopRequireDefault(_storesProjectStore);

	var _storesMilestoneStore = __webpack_require__(13);

	var _storesMilestoneStore2 = _interopRequireDefault(_storesMilestoneStore);

	var _storesMilestoneTaskStore = __webpack_require__(26);

	var _storesMilestoneTaskStore2 = _interopRequireDefault(_storesMilestoneTaskStore);

	var _storesTaskTypeStore = __webpack_require__(27);

	var _storesTaskTypeStore2 = _interopRequireDefault(_storesTaskTypeStore);

	var _storesSettingsStore = __webpack_require__(22);

	var _storesSettingsStore2 = _interopRequireDefault(_storesSettingsStore);

	var _storesTaskStore = __webpack_require__(28);

	var _storesTaskStore2 = _interopRequireDefault(_storesTaskStore);

	var _storesTimeStore = __webpack_require__(7);

	var _storesTimeStore2 = _interopRequireDefault(_storesTimeStore);

	function saveTime(start, end) {

		var forType = _storesCustomerStore2['default'].getContactOrCompany();
		var forId = _storesCustomerStore2['default'].getContactOrCompanyId();
		if (_storesMilestoneStore2['default'].getMilestoneId()) {
			forType = 'project_milestone';
			forId = _storesMilestoneStore2['default'].getMilestoneId();
		}

		var relatedType = 'none';
		var relatedId;
		if (_storesMilestoneTaskStore2['default'].getMilestoneTaskId() > 0) {
			relatedType = 'task';
			relatedId = _storesMilestoneTaskStore2['default'].getMilestoneTaskId();
		}

		(0, _utilsUtils.apiRequest)({
			url: '/addTimetracking.php',
			data: {
				description: _storesMilestoneTaskStore2['default'].getMilestoneTaskDescription() || _storesTaskStore2['default'].getTaskDescription() || 'No task description',
				start_date: start,
				end_date: end,
				worker_id: _storesSettingsStore2['default'].getUserId(),
				task_type_id: _storesTaskTypeStore2['default'].getTaskTypeId(),

				'for': forType,
				for_id: forId,
				invoiceable: 1,
				related_object_type: relatedType,
				related_object_id: relatedId
			},
			success: function success(json) {
				console.log(json);
			}
		});
	}

	function startTimer(timestamp) {
		if (_storesProjectStore2['default'].getProjectId()) {
			_dispatcherAppDispatcher2['default'].dispatch({
				type: _constantsTrackerConstants2['default'].START_TIMER,
				timestamp: timestamp
			});
		}
	}

	function stopTimer(timestamp) {
		_dispatcherAppDispatcher2['default'].dispatch({
			type: _constantsTrackerConstants2['default'].STOP_TIMER,
			timestamp: timestamp
		});
	}

	function getProjects() {
		(0, _utilsUtils.apiRequest)({
			url: '/getProjects.php',
			data: {
				show_active_only: 1,
				amount: 100,
				pageno: 0
			},
			success: function success(json) {
				var data = (0, _underscore.where)(json, { phase: 'active' });
				//console.log(data);
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
					var data = (0, _underscore.where)(json, { closed: 0 });
					//console.log(data);
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
				success: function success(json) {
					var data = (0, _underscore.where)(json, { done: 0 });
					//console.log(data);

					//todo: filter in view
					var appSettings = JSON.parse(localStorage.getItem('settings'));
					if (appSettings && appSettings.userName) {
						data = (0, _underscore.where)(data, { owner_name: appSettings.userName });
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

	function getTaskTypes() {
		(0, _utilsUtils.apiRequest)({
			url: '/getTaskTypes.php',
			success: function success(data) {
				//console.log(data)
				_dispatcherAppDispatcher2['default'].dispatch({
					type: _constantsTrackerConstants2['default'].RECEIVE_TASK_TYPES,
					data: data
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

/***/ },

/***/ 13:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _underscore = __webpack_require__(10);

	var _utilsStoreUtils = __webpack_require__(8);

	var _dispatcherAppDispatcher = __webpack_require__(16);

	var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

	var _constantsTrackerConstants = __webpack_require__(14);

	var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

	var _actionsTrackerActions = __webpack_require__(12);

	var _storesProjectStore = __webpack_require__(20);

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
					_selected = parseInt(_selected || _milestones[0].id);
					//console.log('milestone', _selected);
				}
				MilestoneStore.emitChange();

				(0, _actionsTrackerActions.getMilestoneTasks)(_selected);
				break;

			case _constantsTrackerConstants2['default'].SET_MILESTONE:
				_selected = parseInt(action.id);
				//console.log('milestone', _selected);
				MilestoneStore.emitChange();

				(0, _actionsTrackerActions.getMilestoneTasks)(_selected);
				break;

			default:
			//no op
		}
	});

	exports['default'] = MilestoneStore;
	module.exports = exports['default'];

/***/ },

/***/ 14:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _keymirror = __webpack_require__(15);

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
		SET_TASK_DESCRIPTION: null,
		START_TIMER: null,
		STOP_TIMER: null
	});
	module.exports = exports['default'];

/***/ },

/***/ 16:
/***/ function(module, exports, __webpack_require__) {

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

	var _flux = __webpack_require__(17);

	exports['default'] = new _flux.Dispatcher();
	module.exports = exports['default'];

/***/ },

/***/ 20:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _underscore = __webpack_require__(10);

	var _utilsStoreUtils = __webpack_require__(8);

	var _dispatcherAppDispatcher = __webpack_require__(16);

	var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

	var _constantsTrackerConstants = __webpack_require__(14);

	var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

	var _actionsTrackerActions = __webpack_require__(12);

	var _projects = [];
	var _selected;

	var ProjectStore = (0, _utilsStoreUtils.createStore)({

		getProjects: function getProjects() {
			return _projects;
		},

		getProjectId: function getProjectId() {
			return _selected;
		},

		getProject: function getProject() {
			return (0, _underscore.findWhere)(_projects, { id: _selected });
		},

		getProjectTitle: function getProjectTitle() {
			var project = this.getProject();
			return project ? project.title : null;
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
				//console.log('project', _selected);
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

/***/ },

/***/ 21:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports.apiRequest = apiRequest;
	exports.rekey = rekey;
	exports.htmlEntities = htmlEntities;
	exports.formatTime = formatTime;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _jquery = __webpack_require__(2);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _storesSettingsStore = __webpack_require__(22);

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
		return string.replace(/&amp;/g, '&').replace(/&#039;/g, "'");
	}

	function formatTime(secs) {
		var h = parseInt(secs / 3600, 10);
		var m = parseInt(secs % 3600 / 60, 10);
		var s = parseInt(secs % 3600 % 60, 10);
		return (h === 0 ? '' : h < 10 ? '0' + h + ':' : h + ':') + (m < 10 ? '0' + m : '' + m) + ':' + (s < 10 ? '0' + s : '' + s);
	}

/***/ },

/***/ 22:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _jquery = __webpack_require__(2);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _utilsStoreUtils = __webpack_require__(8);

	var _dispatcherAppDispatcher = __webpack_require__(16);

	var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

	var _constantsSettingsConstants = __webpack_require__(23);

	var _constantsSettingsConstants2 = _interopRequireDefault(_constantsSettingsConstants);

	var _actionsSettingsActions = __webpack_require__(24);

	var _users = [];

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
		},

		isLoggedIn: function isLoggedIn() {
			return this.getUserId() > 0;
		},

		getUsers: function getUsers() {
			return _users;
		}
	});

	SettingsStore.dispatchToken = _dispatcherAppDispatcher2['default'].register(function (action) {

		switch (action.type) {

			case _constantsSettingsConstants2['default'].SAVE_SETTINGS:
				_setSettings(action.data);
				SettingsStore.emitChange();
				(0, _actionsSettingsActions.getUsers)();
				break;

			case _constantsSettingsConstants2['default'].RECEIVE_USERS:
				_users = action.data;
				SettingsStore.emitChange();
				break;

			default:
			//no op
		}
	});

	exports['default'] = SettingsStore;
	module.exports = exports['default'];

/***/ },

/***/ 23:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _keymirror = __webpack_require__(15);

	var _keymirror2 = _interopRequireDefault(_keymirror);

	exports['default'] = (0, _keymirror2['default'])({
		SAVE_SETTINGS: null,
		RECEIVE_USERS: null
	});
	module.exports = exports['default'];

/***/ },

/***/ 24:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports.saveSettings = saveSettings;
	exports.getUsers = getUsers;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utilsUtils = __webpack_require__(21);

	var _dispatcherAppDispatcher = __webpack_require__(16);

	var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

	var _constantsSettingsConstants = __webpack_require__(23);

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

/***/ },

/***/ 25:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utilsStoreUtils = __webpack_require__(8);

	var _dispatcherAppDispatcher = __webpack_require__(16);

	var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

	var _constantsTrackerConstants = __webpack_require__(14);

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

/***/ },

/***/ 26:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _underscore = __webpack_require__(10);

	var _utilsStoreUtils = __webpack_require__(8);

	var _dispatcherAppDispatcher = __webpack_require__(16);

	var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

	var _constantsTrackerConstants = __webpack_require__(14);

	var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

	var _storesProjectStore = __webpack_require__(20);

	var _storesProjectStore2 = _interopRequireDefault(_storesProjectStore);

	var _storesMilestoneStore = __webpack_require__(13);

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
				if (_tasks.length > 0) {
					_selected = parseInt(_selected || _tasks[0].id);
					//console.log('task', _selected);
				}
				MilestoneTaskStore.emitChange();
				break;

			case _constantsTrackerConstants2['default'].SET_MILESTONE_TASK:
				_selected = parseInt(action.id);
				//console.log('task', _selected);
				MilestoneTaskStore.emitChange();
				break;

			default:
			//no op
		}
	});

	exports['default'] = MilestoneTaskStore;
	module.exports = exports['default'];

/***/ },

/***/ 27:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _underscore = __webpack_require__(10);

	var _utilsStoreUtils = __webpack_require__(8);

	var _dispatcherAppDispatcher = __webpack_require__(16);

	var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

	var _constantsTrackerConstants = __webpack_require__(14);

	var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

	var _storesMilestoneTaskStore = __webpack_require__(26);

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
					//console.log('task_type', _selected);
				}
				TaskTypeStore.emitChange();
				break;

			case _constantsTrackerConstants2['default'].SET_TASK_TYPE:
				_selected = parseInt(action.id);
				//console.log('task_type', _selected);
				TaskTypeStore.emitChange();
				break;

			case _constantsTrackerConstants2['default'].RECEIVE_MILESTONE_TASKS:
			case _constantsTrackerConstants2['default'].SET_MILESTONE_TASK:
				_dispatcherAppDispatcher2['default'].waitFor([_storesMilestoneTaskStore2['default'].dispatchToken]);

				//find task type id based on selected milestone task
				var milestoneTask = _storesMilestoneTaskStore2['default'].getMilestoneTask();
				if (milestoneTask) {
					var milestoneTaskTypeName = milestoneTask.task_type;
					var milestoneTaskType = (0, _underscore.findWhere)(_taskTypes, { name: milestoneTaskTypeName });
					if (milestoneTaskType) {
						var milestoneTaskTypeId = milestoneTaskType.id;
						_selected = milestoneTaskTypeId;
						//console.log('task_type', _selected);
					}
				}

				break;

			default:
			//no op
		}
	});

	exports['default'] = TaskTypeStore;
	module.exports = exports['default'];

/***/ },

/***/ 28:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utilsStoreUtils = __webpack_require__(8);

	var _dispatcherAppDispatcher = __webpack_require__(16);

	var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

	var _constantsTrackerConstants = __webpack_require__(14);

	var _constantsTrackerConstants2 = _interopRequireDefault(_constantsTrackerConstants);

	var _storesMilestoneTaskStore = __webpack_require__(26);

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

/***/ },

/***/ 185:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _react = __webpack_require__(29);

	var _react2 = _interopRequireDefault(_react);

	var _underscore = __webpack_require__(10);

	var _actionsTrackerActions = __webpack_require__(12);

	var _storesProjectStore = __webpack_require__(20);

	var _storesProjectStore2 = _interopRequireDefault(_storesProjectStore);

	var _SelectInputReact = __webpack_require__(186);

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
				{ className: "form-group" },
				_react2['default'].createElement(
					'label',
					{ className: "col-xs-3 control-label", htmlFor: "project" },
					'Project'
				),
				_react2['default'].createElement(
					'div',
					{ className: "col-xs-6" },
					_react2['default'].createElement(_SelectInputReact2['default'], {
						id: "project",
						ref: "project",
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

/***/ },

/***/ 186:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _react = __webpack_require__(29);

	var _react2 = _interopRequireDefault(_react);

	var _utilsUtils = __webpack_require__(21);

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
					className: "form-control"
				}),
				optionNodes
			);
		}
	});

	exports['default'] = SelectInput;
	module.exports = exports['default'];

/***/ },

/***/ 187:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _react = __webpack_require__(29);

	var _react2 = _interopRequireDefault(_react);

	var _actionsTrackerActions = __webpack_require__(12);

	var _storesProjectStore = __webpack_require__(20);

	var _storesProjectStore2 = _interopRequireDefault(_storesProjectStore);

	var _storesMilestoneStore = __webpack_require__(13);

	var _storesMilestoneStore2 = _interopRequireDefault(_storesMilestoneStore);

	var _SelectInputReact = __webpack_require__(186);

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
				{ className: "form-group" },
				_react2['default'].createElement(
					'label',
					{ className: "col-xs-3 control-label", htmlFor: "milestone" },
					'Milestone'
				),
				_react2['default'].createElement(
					'div',
					{ className: "col-xs-6" },
					_react2['default'].createElement(_SelectInputReact2['default'], {
						id: "milestone",
						ref: "milestone",
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

/***/ },

/***/ 188:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _react = __webpack_require__(29);

	var _react2 = _interopRequireDefault(_react);

	var _underscore = __webpack_require__(10);

	var _actionsTrackerActions = __webpack_require__(12);

	var _storesMilestoneStore = __webpack_require__(13);

	var _storesMilestoneStore2 = _interopRequireDefault(_storesMilestoneStore);

	var _storesMilestoneTaskStore = __webpack_require__(26);

	var _storesMilestoneTaskStore2 = _interopRequireDefault(_storesMilestoneTaskStore);

	var _storesTaskStore = __webpack_require__(28);

	var _storesTaskStore2 = _interopRequireDefault(_storesTaskStore);

	var _SelectInputReact = __webpack_require__(186);

	var _SelectInputReact2 = _interopRequireDefault(_SelectInputReact);

	var _TaskTypeSelectContainerReact = __webpack_require__(189);

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
					{ className: "form-group" },
					_react2['default'].createElement(
						'label',
						{ className: "col-xs-3 control-label", htmlFor: "milestone-task" },
						'Todo'
					),
					_react2['default'].createElement(
						'div',
						{ className: "col-xs-6" },
						_react2['default'].createElement(_SelectInputReact2['default'], {
							id: "milestone-task",
							ref: "milestoneTask",
							labelKey: "description",
							value: this.state.task,
							options: tasks,
							onChange: this.handleMilestoneTaskChange
						})
					)
				);
			} else {
				return _react2['default'].createElement(
					'div',
					{ className: "custom-task" },
					_react2['default'].createElement(
						'div',
						{ className: "form-group" },
						_react2['default'].createElement(
							'label',
							{ className: "col-xs-3 control-label", htmlFor: "task-type" },
							'Type'
						),
						_react2['default'].createElement(
							'div',
							{ className: "col-xs-6" },
							_react2['default'].createElement(_TaskTypeSelectContainerReact2['default'], null)
						)
					),
					_react2['default'].createElement(
						'div',
						{ className: "form-group" },
						_react2['default'].createElement(
							'div',
							{ className: "col-xs-12" },
							_react2['default'].createElement('textarea', {
								id: "task-description",
								placeholder: "Task description...",
								className: "form-control",
								rows: "3",
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

/***/ },

/***/ 189:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _react = __webpack_require__(29);

	var _react2 = _interopRequireDefault(_react);

	var _actionsTrackerActions = __webpack_require__(12);

	var _storesTaskTypeStore = __webpack_require__(27);

	var _storesTaskTypeStore2 = _interopRequireDefault(_storesTaskTypeStore);

	var _SelectInputReact = __webpack_require__(186);

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
				id: "task-type",
				ref: "taskType",
				labelKey: "name",
				value: this.state.taskType,
				options: this.state.taskTypes,
				onChange: this.handleChange
			});
		}
	});

	exports['default'] = TaskTypeSelectContainer;
	module.exports = exports['default'];

/***/ },

/***/ 217:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _warning = __webpack_require__(192);

	var _warning2 = _interopRequireDefault(_warning);

	var _DOMHistory2 = __webpack_require__(218);

	var _DOMHistory3 = _interopRequireDefault(_DOMHistory2);

	var _NavigationTypes = __webpack_require__(205);

	var _NavigationTypes2 = _interopRequireDefault(_NavigationTypes);

	var _DOMUtils = __webpack_require__(209);

	var _URLUtils = __webpack_require__(197);

	var DefaultQueryKey = '_qk';

	function ensureSlash() {
	  var path = (0, _DOMUtils.getHashPath)();

	  if ((0, _URLUtils.isAbsolutePath)(path)) return true;

	  (0, _DOMUtils.replaceHashPath)('/' + path);

	  return false;
	}

	function addQueryStringValueToPath(path, key, value) {
	  return path + (path.indexOf('?') === -1 ? '?' : '&') + ('' + key + '=' + value);
	}

	function getQueryStringValueFromPath(path, key) {
	  var match = path.match(new RegExp('\\?.*?\\b' + key + '=(.+?)\\b'));
	  return match && match[1];
	}

	function saveState(path, queryKey, state) {
	  window.sessionStorage.setItem(state.key, JSON.stringify(state));
	  return addQueryStringValueToPath(path, queryKey, state.key);
	}

	function readState(path, queryKey) {
	  var sessionKey = getQueryStringValueFromPath(path, queryKey);
	  var json = sessionKey && window.sessionStorage.getItem(sessionKey);

	  if (json) {
	    try {
	      return JSON.parse(json);
	    } catch (error) {}
	  }

	  return null;
	}

	function updateCurrentState(queryKey, extraState) {
	  var path = (0, _DOMUtils.getHashPath)();
	  var state = readState(path, queryKey);

	  if (state) saveState(path, queryKey, _extends(state, extraState));
	}

	/**
	 * A history implementation for DOM environments that uses window.location.hash
	 * to store the current path. This is essentially a hack for older browsers that
	 * do not support the HTML5 history API (IE <= 9).
	 *
	 * Support for persistence of state across page refreshes is provided using a
	 * combination of a URL query string parameter and DOM storage. However, this
	 * support is not enabled by default. In order to use it, create your own
	 * HashHistory.
	 *
	 *   import HashHistory from 'react-router/lib/HashHistory';
	 *   var StatefulHashHistory = new HashHistory({ queryKey: '_key' });
	 *   React.render(<Router history={StatefulHashHistory} .../>, ...);
	 */

	var HashHistory = (function (_DOMHistory) {
	  function HashHistory() {
	    var options = arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, HashHistory);

	    _DOMHistory.call(this, options);
	    this.handleHashChange = this.handleHashChange.bind(this);
	    this.queryKey = options.queryKey;

	    if (typeof this.queryKey !== 'string') this.queryKey = this.queryKey ? DefaultQueryKey : null;
	  }

	  _inherits(HashHistory, _DOMHistory);

	  HashHistory.prototype._updateLocation = function _updateLocation(navigationType) {
	    var path = (0, _DOMUtils.getHashPath)();
	    var state = this.queryKey ? readState(path, this.queryKey) : null;
	    this.location = this.createLocation(path, state, navigationType);
	  };

	  HashHistory.prototype.setup = function setup() {
	    if (this.location == null) {
	      ensureSlash();
	      this._updateLocation();
	    }
	  };

	  HashHistory.prototype.handleHashChange = function handleHashChange() {
	    if (!ensureSlash()) return;

	    if (this._ignoreNextHashChange) {
	      this._ignoreNextHashChange = false;
	    } else {
	      this._updateLocation(_NavigationTypes2['default'].POP);
	      this._notifyChange();
	    }
	  };

	  HashHistory.prototype.addChangeListener = function addChangeListener(listener) {
	    _DOMHistory.prototype.addChangeListener.call(this, listener);

	    if (this.changeListeners.length === 1) {
	      if (window.addEventListener) {
	        window.addEventListener('hashchange', this.handleHashChange, false);
	      } else {
	        window.attachEvent('onhashchange', this.handleHashChange);
	      }
	    }
	  };

	  HashHistory.prototype.removeChangeListener = function removeChangeListener(listener) {
	    _DOMHistory.prototype.removeChangeListener.call(this, listener);

	    if (this.changeListeners.length === 0) {
	      if (window.removeEventListener) {
	        window.removeEventListener('hashchange', this.handleHashChange, false);
	      } else {
	        window.detachEvent('onhashchange', this.handleHashChange);
	      }
	    }
	  };

	  HashHistory.prototype.pushState = function pushState(state, path) {
	    (0, _warning2['default'])(this.queryKey || state == null, 'HashHistory needs a queryKey in order to persist state');

	    if (this.queryKey) updateCurrentState(this.queryKey, this.getScrollPosition());

	    state = this._createState(state);

	    if (this.queryKey) path = saveState(path, this.queryKey, state);

	    this._ignoreNextHashChange = true;
	    window.location.hash = path;

	    this.location = this.createLocation(path, state, _NavigationTypes2['default'].PUSH);

	    this._notifyChange();
	  };

	  HashHistory.prototype.replaceState = function replaceState(state, path) {
	    state = this._createState(state);

	    if (this.queryKey) path = saveState(path, this.queryKey, state);

	    this._ignoreNextHashChange = true;
	    (0, _DOMUtils.replaceHashPath)(path);

	    this.location = this.createLocation(path, state, _NavigationTypes2['default'].REPLACE);

	    this._notifyChange();
	  };

	  HashHistory.prototype.makeHref = function makeHref(path) {
	    return '#' + path;
	  };

	  return HashHistory;
	})(_DOMHistory3['default']);

	var history = new HashHistory();
	exports.history = history;
	exports['default'] = HashHistory;

	// Ignore invalid JSON in session storage.

/***/ },

/***/ 218:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _History2 = __webpack_require__(206);

	var _History3 = _interopRequireDefault(_History2);

	var _DOMUtils = __webpack_require__(209);

	/**
	 * A history interface that assumes a DOM environment.
	 */

	var DOMHistory = (function (_History) {
	  function DOMHistory() {
	    var options = arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, DOMHistory);

	    _History.call(this, options);
	    this.getScrollPosition = options.getScrollPosition || _DOMUtils.getWindowScrollPosition;
	  }

	  _inherits(DOMHistory, _History);

	  DOMHistory.prototype.go = function go(n) {
	    if (n === 0) return;

	    window.history.go(n);
	  };

	  return DOMHistory;
	})(_History3['default']);

	exports['default'] = DOMHistory;
	module.exports = exports['default'];

/***/ },

/***/ 219:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _jquery = __webpack_require__(2);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _react = __webpack_require__(29);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(190);

	var _events = __webpack_require__(11);

	var _flux = __webpack_require__(17);

	var gui = nodeRequire('nw.gui');

	var TeamleaderTimeApp = _react2['default'].createClass({
	  displayName: 'TeamleaderTimeApp',

	  mixins: [_reactRouter.Navigation],

	  getInitialState: function getInitialState() {
	    this.menu = new gui.Menu();
	    this.menu.append(new gui.MenuItem({ label: 'Preferences...', click: this.preferences }));
	    this.menu.append(new gui.MenuItem({ type: 'separator' }));
	    this.menu.append(new gui.MenuItem({ label: 'Quit Teamleader', click: this.quit }));

	    return null;
	  },

	  home: function home(e) {
	    e.preventDefault();
	    this.transitionTo('/');
	  },

	  preferences: function preferences() {
	    this.transitionTo('/settings');
	  },

	  quit: function quit() {
	    gui.App.quit();
	  },

	  openTimesheets: function openTimesheets(e) {
	    e.preventDefault();
	    gui.Shell.openExternal(e.currentTarget.href);
	  },

	  toggleBack: function toggleBack(e) {
	    var el = e.currentTarget;
	    if ((0, _jquery2['default'])(el).hasClass('active')) {
	      e.preventDefault();
	      this.transitionTo('/');
	    }
	  },

	  toggleMenu: function toggleMenu(e) {
	    e.preventDefault();
	    var el = e.currentTarget;
	    var rect = el.getBoundingClientRect();
	    this.menu.popup(parseInt(rect.left + rect.width), parseInt(rect.top + rect.height));
	  },

	  render: function render() {
	    return _react2['default'].createElement(
	      'div',
	      { className: "app" },
	      _react2['default'].createElement(
	        'header',
	        null,
	        _react2['default'].createElement(
	          'div',
	          { className: "row" },
	          _react2['default'].createElement(
	            'div',
	            { className: "col-xs-7" },
	            _react2['default'].createElement(
	              'a',
	              { className: "logo", onClick: this.home, href: "#" },
	              _react2['default'].createElement('img', { src: "images/teamleader-logo.svg", alt: "" })
	            )
	          ),
	          _react2['default'].createElement(
	            'div',
	            { className: "col-xs-5 text-right" },
	            _react2['default'].createElement(
	              'a',
	              { className: "btn btn-sm btn-success timesheets-link", href: "https://www.teamleader.be/timesheets.php", onClick: this.openTimesheets },
	              'My timesheets'
	            ),
	            _react2['default'].createElement(
	              'a',
	              { className: "settings-link", onClick: this.toggleMenu, href: "#" },
	              _react2['default'].createElement('i', { className: "fa fa-cog" })
	            )
	          )
	        )
	      ),
	      _react2['default'].createElement(
	        'div',
	        { className: "container" },
	        this.props.children
	      )
	    );
	  }
	});

	exports['default'] = TeamleaderTimeApp;
	module.exports = exports['default'];
	/* this is the important part */

/***/ },

/***/ 220:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _jquery = __webpack_require__(2);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _react = __webpack_require__(29);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(190);

	var _storesSettingsStore = __webpack_require__(22);

	var _storesSettingsStore2 = _interopRequireDefault(_storesSettingsStore);

	var _actionsSettingsActions = __webpack_require__(24);

	var _TextInputReact = __webpack_require__(221);

	var _TextInputReact2 = _interopRequireDefault(_TextInputReact);

	var _SelectInputReact = __webpack_require__(186);

	var _SelectInputReact2 = _interopRequireDefault(_SelectInputReact);

	var _UserSelectContainerReact = __webpack_require__(222);

	var _UserSelectContainerReact2 = _interopRequireDefault(_UserSelectContainerReact);

	var Login = _react2['default'].createClass({
		displayName: 'Login',

		mixins: [_reactRouter.Navigation],

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

			if (_storesSettingsStore2['default'].isLoggedIn()) {
				var location = this.props.location;

				if (location.state && location.state.nextPathname) {
					this.replaceWith(location.state.nextPathname);
				} else {
					this.replaceWith('/');
				}
			}

			return;
		},

		render: function render() {

			var buttonText = _storesSettingsStore2['default'].getUsers().length > 0 ? 'Login' : 'Connect';

			return _react2['default'].createElement(
				'div',
				{ className: "login" },
				_react2['default'].createElement(
					'div',
					{ className: "alert alert-info" },
					'If you already have a Teamleader account and you are an admin, you can find your API key under ',
					_react2['default'].createElement(
						'strong',
						null,
						'Settings > API & Webhooks'
					),
					'. API access is available for every Teamleader account.'
				),
				_react2['default'].createElement(
					'form',
					{ className: "form-horizontal", onSubmit: this.handleSubmit },
					_react2['default'].createElement(
						'div',
						{ className: "form-group" },
						_react2['default'].createElement(
							'label',
							{ className: "col-xs-3 control-label", htmlFor: "group-id" },
							'Group ID'
						),
						_react2['default'].createElement(
							'div',
							{ className: "col-xs-6" },
							_react2['default'].createElement(_TextInputReact2['default'], { id: "group-id", ref: "groupId", defaultValue: this.state.groupId })
						)
					),
					_react2['default'].createElement(
						'div',
						{ className: "form-group" },
						_react2['default'].createElement(
							'label',
							{ className: "col-xs-3 control-label", htmlFor: "group-secret" },
							'Group Secret'
						),
						_react2['default'].createElement(
							'div',
							{ className: "col-xs-6" },
							_react2['default'].createElement(_TextInputReact2['default'], { id: "group-secret", ref: "groupSecret", defaultValue: this.state.groupSecret })
						)
					),
					_react2['default'].createElement(_UserSelectContainerReact2['default'], {
						ref: "userSelectContainer",
						userId: this.state.userId
					}),
					_react2['default'].createElement(
						'div',
						{ className: "form-group" },
						_react2['default'].createElement(
							'div',
							{ className: "col-xs-offset-3 col-xs-6" },
							_react2['default'].createElement(
								'div',
								{ className: "btn-toolbar" },
								_react2['default'].createElement(
									'button',
									{ type: "submit", className: "btn btn-primary btn-sm" },
									buttonText
								)
							)
						)
					)
				)
			);
		}
	});

	exports['default'] = Login;
	module.exports = exports['default'];

/***/ },

/***/ 221:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _react = __webpack_require__(29);

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

/***/ },

/***/ 222:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _underscore = __webpack_require__(10);

	var _react = __webpack_require__(29);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(190);

	var _reactRouter2 = _interopRequireDefault(_reactRouter);

	var _storesSettingsStore = __webpack_require__(22);

	var _storesSettingsStore2 = _interopRequireDefault(_storesSettingsStore);

	var _actionsSettingsActions = __webpack_require__(24);

	var _SelectInputReact = __webpack_require__(186);

	var _SelectInputReact2 = _interopRequireDefault(_SelectInputReact);

	var UserSelectContainer = _react2['default'].createClass({
		displayName: 'UserSelectContainer',

		getUsersState: function getUsersState() {
			return {
				users: _storesSettingsStore2['default'].getUsers()
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
			_storesSettingsStore2['default'].addChangeListener(this._onChange);
		},

		componentWillUnmount: function componentWillUnmount() {
			_storesSettingsStore2['default'].removeChangeListener(this._onChange);
		},

		render: function render() {
			if (this.state.users.length === 0) return null;

			var users = (0, _underscore.clone)(this.state.users);
			if (users.length > 0) {
				users.unshift({ id: 0, name: 'Choose...' });
			}

			return _react2['default'].createElement(
				'div',
				{ className: "form-group" },
				_react2['default'].createElement(
					'label',
					{ className: "col-xs-3 control-label", htmlFor: "user-select" },
					'Select user'
				),
				_react2['default'].createElement(
					'div',
					{ className: "col-xs-6" },
					_react2['default'].createElement(_SelectInputReact2['default'], {
						id: "user-select",
						ref: "userSelect",
						labelKey: "name",
						options: users,
						defaultValue: this.props.userId
					})
				)
			);
		}
	});

	exports['default'] = UserSelectContainer;
	module.exports = exports['default'];

/***/ },

/***/ 223:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _jquery = __webpack_require__(2);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _react = __webpack_require__(29);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(190);

	var _storesSettingsStore = __webpack_require__(22);

	var _storesSettingsStore2 = _interopRequireDefault(_storesSettingsStore);

	var _actionsSettingsActions = __webpack_require__(24);

	var Settings = _react2['default'].createClass({
	  displayName: 'Settings',

	  mixins: [_reactRouter.Navigation],

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

	  handleLogout: function handleLogout(e) {
	    e.preventDefault();

	    (0, _actionsSettingsActions.saveSettings)({
	      userId: null,
	      userName: null
	    });

	    this.replaceWith('/login');
	  },

	  render: function render() {
	    return _react2['default'].createElement(
	      'div',
	      { className: "settings" },
	      _react2['default'].createElement(
	        'p',
	        null,
	        'Logged in as ',
	        this.state.userName
	      ),
	      _react2['default'].createElement(
	        'div',
	        { className: "btn-toolbar" },
	        _react2['default'].createElement(
	          'button',
	          { className: "btn btn-primary btn-sm", onClick: this.handleLogout },
	          'Logout'
	        )
	      )
	    );
	  }
	});

	exports['default'] = Settings;
	module.exports = exports['default'];

/***/ }

});