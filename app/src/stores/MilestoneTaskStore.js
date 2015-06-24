
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TrackerConstants = require('../constants/TrackerConstants');
var MilestoneStore = require('../stores/MilestoneStore');

var _tasks = [];
var _selected;

var MilestoneTaskStore  = assign({}, EventEmitter.prototype, {

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

	getMilestoneTasks: function() {
		return _tasks;
	},

	getMilestoneTask: function() {
		return _selected;
	}
});

MilestoneTaskStore.dispatchToken = AppDispatcher.register((action) => {

	switch (action.type) {

		case TrackerConstants.SET_PROJECT:
		case TrackerConstants.SET_MILESTONE:
			AppDispatcher.waitFor([MilestoneStore.dispatchToken]);
			_tasks = [];
			_selected = 0;
			MilestoneTaskStore.emitChange();
			break;

		case TrackerConstants.RECEIVE_MILESTONE_TASKS:
			_tasks = action.data;
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


module.exports = MilestoneTaskStore;
