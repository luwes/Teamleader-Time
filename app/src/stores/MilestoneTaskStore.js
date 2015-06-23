
var $ = require('jquery');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TrackerConstants = require('../constants/TrackerConstants');
var MilestoneStore = require('../stores/MilestoneStore');

var _dispatchToken;
var _tasks = [];
var _selected;

class MilestoneTaskStore extends EventEmitter {

	constructor() {
		super();
		_dispatchToken = AppDispatcher.register((action) => {

			switch (action.type) {

				case TrackerConstants.SET_PROJECT:
				case TrackerConstants.SET_MILESTONE:
					AppDispatcher.waitFor([MilestoneStore.getDispatchToken()]);
					_tasks = [];
					_selected = 0;
					this.emitChange();
					break;

				case TrackerConstants.RECEIVE_MILESTONE_TASKS:
					_tasks = action.data;
					if (_tasks.length > 0) {
						_selected = parseInt(_tasks[0].value);
						console.log('task', _selected);
					}
					this.emitChange();
					break;

				case TrackerConstants.SET_MILESTONE_TASK:
					_selected = parseInt(action.id);
					console.log('task', _selected);
					this.emitChange();
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

	getMilestoneTasks() {
		return _tasks;
	}

	getMilestoneTask() {
		return _selected;
	}
}

module.exports = new MilestoneTaskStore();
