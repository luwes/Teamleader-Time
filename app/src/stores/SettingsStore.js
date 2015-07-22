
import $ from 'jquery';
import { createStore } from '../utils/StoreUtils';

import AppDispatcher from '../dispatcher/AppDispatcher';
import SettingsConstants from '../constants/SettingsConstants';

import { getUsers } from '../actions/SettingsActions';


var _users = [];

function _setSettings(data) {
	var settings = $.extend({}, SettingsStore.getSettings(), data);
	localStorage.setItem('settings', JSON.stringify(settings));
}

var SettingsStore  = createStore({

	getSettings() {
		return JSON.parse(localStorage.getItem('settings')) || {};
	},

	getUserId() {
		return parseInt(this.getSettings().userId);
	},

	isLoggedIn() {
		return this.getUserId() > 0
	},

	getUsers() {
		return _users;
	}
});


SettingsStore.dispatchToken = AppDispatcher.register(action => {

	switch (action.type) {

		case SettingsConstants.SAVE_SETTINGS:
			_setSettings(action.data);
			SettingsStore.emitChange();
			getUsers();
			break;

		case SettingsConstants.RECEIVE_USERS:
			_users = action.data;
			SettingsStore.emitChange();
			break;

		default:
			//no op
	}

});

export default SettingsStore;
