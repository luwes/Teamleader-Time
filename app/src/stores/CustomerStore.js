
import assign from 'object-assign';
import { EventEmitter } from 'events';

import AppDispatcher from '../dispatcher/AppDispatcher';
import TrackerConstants from '../constants/TrackerConstants';


var _contactOrCompany;
var _contactOrCompanyId;

var CustomerStore = assign({}, EventEmitter.prototype, {

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

	getContactOrCompany: function() {
		return _contactOrCompany;
	},

	getContactOrCompanyId: function() {
		return _contactOrCompanyId;
	}
});

CustomerStore.dispatchToken = AppDispatcher.register(action => {

	switch (action.type) {

		case TrackerConstants.SET_CONTACT_OR_COMPANY:
			_contactOrCompany = action.option;
			_contactOrCompanyId = action.id;
			CustomerStore.emitChange();
			break;

		default:
			//no op
	}

});

export default CustomerStore;
