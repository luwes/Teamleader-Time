
var $ = require('jquery');

var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SettingsConstants = require('../constants/SettingsConstants');

var _dispatchToken;

class SettingsStore extends EventEmitter {

	constructor() {
		super();
		_dispatchToken = AppDispatcher.register((action) => {

			switch (action.type) {

				case SettingsConstants.SAVE_SETTINGS:
					this.setSettings(action.data);
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

	setSettings(data) {
		var settings = $.extend({}, this.getSettings(), data);
		localStorage.setItem('settings', JSON.stringify(settings));
	}

	getSettings() {
		return JSON.parse(localStorage.getItem('settings')) || {};
	}
}

module.exports = new SettingsStore();
