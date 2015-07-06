
import { createStore } from '../utils/StoreUtils';

import AppDispatcher from '../dispatcher/AppDispatcher';
import TrackerConstants from '../constants/TrackerConstants';
import MilestoneTaskStore from '../stores/MilestoneTaskStore';


var _description;

var TaskStore  = createStore({

	getTaskDescription() {
		return _description;
	}
});

TaskStore.dispatchToken = AppDispatcher.register(action => {

	switch (action.type) {

		case TrackerConstants.SET_TASK_DESCRIPTION:
			_description = action.txt;
			//console.log(_description);
			TaskStore.emitChange();
			break;

		default:
			//no op
	}

});


export default TaskStore;
