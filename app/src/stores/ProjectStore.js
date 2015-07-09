
import { createStore } from '../utils/StoreUtils';

import AppDispatcher from '../dispatcher/AppDispatcher';
import TrackerConstants from '../constants/TrackerConstants';
import { getProjectDetails, getMilestones } from '../actions/TrackerActions';


var _projects = [];
var _selected;

var ProjectStore  = createStore({

	getProjects() {
		return _projects;
	},

	getProjectId() {
		return _selected;
	}
});

ProjectStore.dispatchToken = AppDispatcher.register(action => {

	switch (action.type) {

		case TrackerConstants.RECEIVE_PROJECTS:
			_projects = action.data;
			ProjectStore.emitChange();
			break;

		case TrackerConstants.SET_PROJECT:
			_selected = parseInt(action.id);
			//console.log('project', _selected);
			ProjectStore.emitChange();

			getProjectDetails(_selected);
			getMilestones(_selected);
			break;

		default:
			//no op
	}

});

export default ProjectStore;
