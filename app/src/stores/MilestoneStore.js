
import assign from 'object-assign';
import { EventEmitter } from 'events';

import AppDispatcher from '../dispatcher/AppDispatcher';
import TrackerConstants from '../constants/TrackerConstants';
import { getMilestoneTasks } from '../actions/TrackerActions';
import ProjectStore from '../stores/ProjectStore';


var _milestones = [];
var _selected;

var MilestoneStore = assign({}, EventEmitter.prototype, {

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

	getMilestones: function() {
		return _milestones;
	},

	getMilestone: function() {
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
