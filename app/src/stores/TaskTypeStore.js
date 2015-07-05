
import { createStore } from '../utils/StoreUtils';

import AppDispatcher from '../dispatcher/AppDispatcher';
import TrackerConstants from '../constants/TrackerConstants';
import MilestoneTaskStore from '../stores/MilestoneTaskStore';


var _tasks = [];
var _selected;

var TaskTypeStore  = createStore({

	getTaskTypes() {
		return _tasks;
	},

	getTaskType() {
		return _selected;
	}
});

TaskTypeStore.dispatchToken = AppDispatcher.register(action => {

	switch (action.type) {

		case TrackerConstants.RECEIVE_TASK_TYPES:
			_tasks = action.data;
			if (_tasks.length > 0) {
				_selected = parseInt(_tasks[0].value);
				console.log('task_type', _selected);
			}
			TaskTypeStore.emitChange();
			break;

		case TrackerConstants.SET_TASK_TYPE:
			_selected = parseInt(action.id);
			console.log('task', _selected);
			TaskTypeStore.emitChange();
			break;

		// case TrackerConstants.RECEIVE_MILESTONE_TASKS:
		// case TrackerConstants.SET_MILESTONE_TASK:
		// 	AppDispatcher.waitFor([MilestoneTaskStore.dispatchToken]);

		// 	var milestoneTasks = MilestoneTaskStore.getMilestoneTasks();
		// 	var milestoneTask = MilestoneTaskStore.getMilestoneTaskId();

		// 	console.log(milestoneTasks);
		// 	console.log(milestoneTask);

		// 	break;

		default:
			//no op
	}

});


export default TaskTypeStore;
