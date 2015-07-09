
import { findWhere } from 'underscore';
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
	},

	getMilestoneTask() {
		return findWhere(_tasks, { id: _selected });
	},

	getMilestoneTaskDescription() {
		var task = this.getMilestoneTask();
		return task ? task.description : null;
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
			if (_tasks.length > 0) {
				_selected = parseInt(_tasks[0].id);
				//console.log('task', _selected);
			}
			MilestoneTaskStore.emitChange();
			break;

		case TrackerConstants.SET_MILESTONE_TASK:
			_selected = parseInt(action.id);
			//console.log('task', _selected);
			MilestoneTaskStore.emitChange();
			break;

		default:
			//no op
	}

});


export default MilestoneTaskStore;
