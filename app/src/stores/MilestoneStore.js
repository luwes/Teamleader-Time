
var $ = require('jquery');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TrackerConstants = require('../constants/TrackerConstants');
var TrackerActions = require('../actions/TrackerActions');
var ProjectStore = require('../stores/ProjectStore');

var _dispatchToken;
var _milestones = [];
var _selected;

class MilestoneStore extends EventEmitter {

	constructor() {
		super();
		_dispatchToken = AppDispatcher.register((action) => {

			switch (action.type) {

				case TrackerConstants.SET_PROJECT:
					AppDispatcher.waitFor([ProjectStore.getDispatchToken()]);
					_milestones = [];
					_selected = 0;
					this.emitChange();
					break;

				case TrackerConstants.RECEIVE_MILESTONES:
					_milestones = action.data;
					if (_milestones.length > 0) {
						_selected = parseInt(_milestones[0].value);
						console.log('milestone', _selected);
					}
					this.emitChange();

					TrackerActions.getMilestoneTasks(_selected);
					break;

				case TrackerConstants.SET_MILESTONE:
					_selected = parseInt(action.id);
					console.log('milestone', _selected);
					this.emitChange();

					TrackerActions.getMilestoneTasks(_selected);
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

	getMilestones() {
		return _milestones;
	}

	getMilestone() {
		return _selected;
	}

}

module.exports = new MilestoneStore();
