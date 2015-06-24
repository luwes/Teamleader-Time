
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TrackerConstants = require('../constants/TrackerConstants');
var TrackerActions = require('../actions/TrackerActions');

var _projects = [];
var _selected;

var ProjectStore  = assign({}, EventEmitter.prototype, {

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

	getProjects: function() {
		return _projects;
	},

	getProject: function() {
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
			console.log('project', _selected);
			ProjectStore.emitChange();

			TrackerActions.getProjectDetails(_selected);
			TrackerActions.getMilestones(_selected);
			break;

		default:
			//no op
	}

});

module.exports = ProjectStore;
