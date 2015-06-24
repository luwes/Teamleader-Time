
import React from 'react';

import { getProjects, setProject } from '../actions/TrackerActions';
import ProjectStore from '../stores/ProjectStore';
import SelectInput from './SelectInput.react';


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

export default ProjectSelectContainer;
