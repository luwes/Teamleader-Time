
import $ from 'jquery';
import assign from 'object-assign';

import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';
import SettingsConstants from '../constants/SettingsConstants';


function _setSettings(data) {
	var settings = $.extend({}, SettingsStore.getSettings(), data);
	localStorage.setItem('settings', JSON.stringify(settings));
}

var SettingsStore  = assign({}, EventEmitter.prototype, {

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

	getSettings: function() {
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
