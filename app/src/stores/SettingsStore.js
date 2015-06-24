
import $ from 'jquery';
import { createStore } from '../utils/StoreUtils';

import AppDispatcher from '../dispatcher/AppDispatcher';
import SettingsConstants from '../constants/SettingsConstants';


function _setSettings(data) {
	var settings = $.extend({}, SettingsStore.getSettings(), data);
	localStorage.setItem('settings', JSON.stringify(settings));
}

var SettingsStore  = createStore({

	getSettings() {
		return JSON.parse(localStorage.getItem('settings')) || {};
	}
});


SettingsStore.dispatchToken = AppDispatcher.register(action => {

	switch (action.type) {

		case SettingsConstants.SAVE_SETTINGS:
			_setSettings(action.data);
			SettingsStore.emitChange();
			break;

		default:
			//no op
	}

});

export default SettingsStore;
