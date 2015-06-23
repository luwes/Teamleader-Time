
var React = require('react');

var TrackerActions = require('../actions/TrackerActions');
var ProjectStore = require('../stores/ProjectStore');
var SelectInput = require('./SelectInput.react');

var ProjectSelectContainer = React.createClass({

	getProjectsState: function() {
		return {
			projects: ProjectStore.getProjects(),
			project: ProjectStore.getProject()
		}
	},

	getInitialState: function() {
		return this.getProjectsState();
	},

  _onChange: function() {
    this.setState(this.getProjectsState());
  },

  componentDidMount: function() {
  	TrackerActions.getProjects();
  	ProjectStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
  	ProjectStore.removeChangeListener(this._onChange);
  },

	handleChange: function(event) {
		var target = event.currentTarget;
		TrackerActions.setProject(target.value);
	},

	render: function() {
		return (
		  <div className="form-group">
		    <label className="col-xs-3 control-label" htmlFor="project">Project</label>
		    <div className="col-xs-6">
					<SelectInput 
						id="project" 
						ref="project" 
						value={this.state.project}
						options={this.state.projects} 
						onChange={this.handleChange} 
					/>
				</div>
			</div>
		);
	}
});

module.exports = ProjectSelectContainer;
