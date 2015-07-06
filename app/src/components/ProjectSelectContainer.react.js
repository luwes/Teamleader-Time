
import React from 'react';
import { clone } from 'underscore';

import { getProjects, setProject } from '../actions/TrackerActions';
import ProjectStore from '../stores/ProjectStore';
import SelectInput from './SelectInput.react';


var ProjectSelectContainer = React.createClass({

	getProjectsState: function() {		
		return {
			projects: ProjectStore.getProjects(),
			project: ProjectStore.getProjectId()
		}
	},

	getInitialState: function() {
		return this.getProjectsState();
	},

  _onChange: function() {
  	if (this.isMounted()) {
    	this.setState(this.getProjectsState());
    }
  },

  componentDidMount: function() {
  	getProjects();
  	ProjectStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
  	ProjectStore.removeChangeListener(this._onChange);
  },

	handleChange: function(event) {
		var target = event.currentTarget;
		setProject(target.value);
	},

	render: function() {

		var projects = clone(this.state.projects);
		if (projects.length > 0) {
			projects.unshift({ id: 0, title: 'Choose...' });
		}

		return (
		  <div className="form-group">
		    <label className="col-xs-3 control-label" htmlFor="project">Project</label>
		    <div className="col-xs-6">
					<SelectInput 
						id="project" 
						ref="project" 
						value={this.state.project}
						options={projects} 
						onChange={this.handleChange} 
					/>
				</div>
			</div>
		);
	}
});

export default ProjectSelectContainer;
