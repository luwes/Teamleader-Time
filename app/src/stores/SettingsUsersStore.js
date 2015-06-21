
var $ = require('jquery');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SettingsConstants = require('../constants/SettingsConstants');
var SettingsActions = require('../actions/SettingsActions');

var _dispatchToken;
var _users = [];

class SettingsUsersStore extends EventEmitter {

	constructor() {
		super();
		_dispatchToken = AppDispatcher.register((action) => {

			switch (action.type) {

				case SettingsConstants.RECEIVE_USERS:
					_users = action.data;
					this.emitChange();
					break;

				default:
					//no op
			}

		});
	}

  // Emit Change event
  emitChange() {
    this.emit('change');
  }

  // Add change listener
  addChangeListener(callback) {
    this.on('change', callback);
  }

  // Remove change listener
  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }

	getDispatchToken() {
		return _dispatchToken;
	}

	getUsers() {
		return _users;
	}
}

module.exports = new SettingsUsersStore();
