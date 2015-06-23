
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TrackerConstants = require('../constants/TrackerConstants');
var TrackerActions = require('../actions/TrackerActions');

var _dispatchToken;
var _projects = [];
var _selected;

class ProjectStore extends EventEmitter {

	constructor() {
		super();
		_dispatchToken = AppDispatcher.register((action) => {

			switch (action.type) {

				case TrackerConstants.RECEIVE_PROJECTS:
					_projects = action.data;
					this.emitChange();
					break;

				case TrackerConstants.SET_PROJECT:
					_selected = parseInt(action.id);
					console.log('project', _selected);
					this.emitChange();

    			TrackerActions.getProjectDetails(_selected);
					TrackerActions.getMilestones(_selected);
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

	getProjects() {
		return _projects;
	}

	getProject() {
		return _selected;
	}
}

module.exports = new ProjectStore();
