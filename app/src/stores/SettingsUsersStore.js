
import assign from 'object-assign';
import { EventEmitter } from 'events';

import AppDispatcher from '../dispatcher/AppDispatcher';
import SettingsConstants from '../constants/SettingsConstants';
import { getUsers } from '../actions/SettingsActions';

import SettingsStore from './SettingsStore';


var _users = [];

var SettingsUsersStore  = assign({}, EventEmitter.prototype, {

  // Emit Change event
  emitChange: function() {
    this.emit('change');
  },

  // Add change listener
  addChangeListener: function(callback) {
    this.on('change', callback);
  },

  // Remove change listener
  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  },

	getUsers: function() {
		return _users;
	}
});

SettingsUsersStore.dispatchToken = AppDispatcher.register(action => {

	switch (action.type) {

		case SettingsConstants.SAVE_SETTINGS:
			AppDispatcher.waitFor([SettingsStore.dispatchToken]);
			getUsers();
			break;

		case SettingsConstants.RECEIVE_USERS:
			_users = action.data;
			SettingsUsersStore.emitChange();
			break;

		default:
			//no op
	}

});

export default SettingsUsersStore;
