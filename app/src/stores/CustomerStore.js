
import { createStore } from '../utils/StoreUtils';

import AppDispatcher from '../dispatcher/AppDispatcher';
import TrackerConstants from '../constants/TrackerConstants';


var _contactOrCompany;
var _contactOrCompanyId;

var CustomerStore = createStore({

	getContactOrCompany() {
		return _contactOrCompany;
	},

	getContactOrCompanyId() {
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
