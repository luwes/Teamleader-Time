
import { findWhere } from 'underscore';
import { createStore } from '../utils/StoreUtils';

import AppDispatcher from '../dispatcher/AppDispatcher';
import TrackerConstants from '../constants/TrackerConstants';
import MilestoneTaskStore from '../stores/MilestoneTaskStore';


var _taskTypes = [];
var _selected;

var TaskTypeStore  = createStore({

	getTaskTypes() {
		return _taskTypes;
	},

	getTaskTypeId() {
		return _selected;
	},

	getTaskType() {
		return findWhere(_taskTypes, { id: _selected });
	}
});

TaskTypeStore.dispatchToken = AppDispatcher.register(action => {

	switch (action.type) {

		case TrackerConstants.RECEIVE_TASK_TYPES:
			_taskTypes = action.data;
			if (_taskTypes.length > 0) {
				_selected = parseInt(_taskTypes[0].id);
				console.log('task_type', _selected);
			}
			TaskTypeStore.emitChange();
			break;

		case TrackerConstants.SET_TASK_TYPE:
			_selected = parseInt(action.id);
			console.log('task_type', _selected);
			TaskTypeStore.emitChange();
			break;

		case TrackerConstants.RECEIVE_MILESTONE_TASKS:
		case TrackerConstants.SET_MILESTONE_TASK:
			AppDispatcher.waitFor([MilestoneTaskStore.dispatchToken]);

			var milestoneTask = MilestoneTaskStore.getMilestoneTask();
			if (milestoneTask) {
				var milestoneTaskTypeName = milestoneTask.task_type;
				var milestoneTaskType = findWhere(_taskTypes, { name: milestoneTaskTypeName });
				if (milestoneTaskType) {
					var milestoneTaskTypeId = milestoneTaskType.id;
					_selected = milestoneTaskTypeId;
				}
			}


			break;

		default:
			//no op
	}

});


export default TaskTypeStore;
