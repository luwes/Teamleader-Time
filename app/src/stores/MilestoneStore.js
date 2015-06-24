
import { createStore } from '../utils/StoreUtils';

import AppDispatcher from '../dispatcher/AppDispatcher';
import TrackerConstants from '../constants/TrackerConstants';
import { getMilestoneTasks } from '../actions/TrackerActions';
import ProjectStore from '../stores/ProjectStore';


var _milestones = [];
var _selected;

var MilestoneStore = createStore({

	getMilestones() {
		return _milestones;
	},

	getMilestone() {
		return _selected;
	}
});

MilestoneStore.dispatchToken = AppDispatcher.register(action => {

	switch (action.type) {

		case TrackerConstants.SET_PROJECT:
			AppDispatcher.waitFor([ProjectStore.dispatchToken]);
			_milestones = [];
			_selected = 0;
			MilestoneStore.emitChange();
			break;

		case TrackerConstants.RECEIVE_MILESTONES:
			_milestones = action.data;
			if (_milestones.length > 0) {
				_selected = parseInt(_milestones[0].value);
				console.log('milestone', _selected);
			}
			MilestoneStore.emitChange();

			getMilestoneTasks(_selected);
			break;

		case TrackerConstants.SET_MILESTONE:
			_selected = parseInt(action.id);
			console.log('milestone', _selected);
			MilestoneStore.emitChange();

			getMilestoneTasks(_selected);
			break;

		default:
			//no op
	}

});

export default MilestoneStore;
