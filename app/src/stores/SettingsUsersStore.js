
import { createStore } from '../utils/StoreUtils';

import AppDispatcher from '../dispatcher/AppDispatcher';
import SettingsConstants from '../constants/SettingsConstants';
import { getUsers } from '../actions/SettingsActions';

import SettingsStore from './SettingsStore';


var _users = [];

var SettingsUsersStore  = createStore({

	getUsers() {
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
