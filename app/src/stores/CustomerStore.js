
var $ = require('jquery');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TrackerConstants = require('../constants/TrackerConstants');
var TrackerActions = require('../actions/TrackerActions');

var _dispatchToken;
var _contactOrCompany;
var _contactOrCompanyId;

class CustomerStore extends EventEmitter {

	constructor() {
		super();

		_dispatchToken = AppDispatcher.register((action) => {

			switch (action.type) {

				case TrackerConstants.SET_CONTACT_OR_COMPANY:
					_contactOrCompany = action.option;
					_contactOrCompanyId = action.id;
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

	getContactOrCompany() {
		return _contactOrCompany;
	}

	getContactOrCompanyId() {
		return _contactOrCompanyId;
	}
	
}

module.exports = new CustomerStore();
