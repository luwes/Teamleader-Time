
import React from 'react';

import { getMilestones, setMilestone } from '../actions/TrackerActions';
import ProjectStore from '../stores/ProjectStore';
import MilestoneStore from '../stores/MilestoneStore';
import SelectInput from './SelectInput.react';


var MilestoneSelectContainer = React.createClass({

	getMilestonesState: function() {
		return {
			milestones: MilestoneStore.getMilestones(),
			milestone: MilestoneStore.getMilestone()
		}
	},

	getInitialState: function() {
		return this.getMilestonesState();
	},

  _onChange: function() {
    this.setState(this.getMilestonesState());
  },

  componentDidMount: function() {
  	getMilestones(ProjectStore.getProject());
  	MilestoneStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
  	MilestoneStore.removeChangeListener(this._onChange);
  },

	handleChange: function(event) {
		var target = event.currentTarget;
		setMilestone(target.value);
	},

	render: function() {
		if (this.state.milestones.length === 0) return null;
		return (
		  <div className="form-group">
		    <label className="col-xs-3 control-label" htmlFor="milestone">Milestone</label>
		    <div className="col-xs-6">
					<SelectInput 
						id="milestone" 
						ref="milestone" 
						value={this.state.milestone}
						options={this.state.milestones} 
						onChange={this.handleChange} 
					/>
				</div>
			</div>
		);
	}
});

export default MilestoneSelectContainer;