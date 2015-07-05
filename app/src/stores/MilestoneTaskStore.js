
import { createStore } from '../utils/StoreUtils';

import AppDispatcher from '../dispatcher/AppDispatcher';
import TrackerConstants from '../constants/TrackerConstants';
import ProjectStore from '../stores/ProjectStore';
import MilestoneStore from '../stores/MilestoneStore';


var _tasks = [];
var _selected;

var MilestoneTaskStore  = createStore({

	getMilestoneTasks() {
		return _tasks;
	},

	getMilestoneTaskId() {
		return _selected;
	}
});

MilestoneTaskStore.dispatchToken = AppDispatcher.register(action => {

	switch (action.type) {

		case TrackerConstants.SET_PROJECT:
		case TrackerConstants.SET_MILESTONE:
			AppDispatcher.waitFor([MilestoneStore.dispatchToken]);
			_tasks = [];
			_selected = 0;
			if (ProjectStore.getProjectId() == 0) {
				MilestoneTaskStore.emitChange();
			}
			break;

		case TrackerConstants.RECEIVE_MILESTONE_TASKS:
			_tasks = action.data;
			//console.log(_tasks)
			if (_tasks.length > 0) {
				_selected = parseInt(_tasks[0].value);
				console.log('task', _selected);
			}
			MilestoneTaskStore.emitChange();
			break;

		case TrackerConstants.SET_MILESTONE_TASK:
			_selected = parseInt(action.id);
			console.log('task', _selected);
			MilestoneTaskStore.emitChange();
			break;

		default:
			//no op
	}

});


export default MilestoneTaskStore;
