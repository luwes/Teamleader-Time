
import { where } from 'underscore';
import { apiRequest, rekey } from '../utils/Utils';
import AppDispatcher from '../dispatcher/AppDispatcher';
import TrackerConstants from '../constants/TrackerConstants';


export function getProjects() {
	apiRequest({
		url: '/getProjects.php',
		data: {
			amount: 100,
			pageno: 0
		},
		success: (json) => {
			var options = rekey(json, { id: 'value', title: 'label' });
			options = where(options, { phase: 'active' });

			if (options.length > 0) {
				options.unshift({ value: 0, label: 'Choose...' });
			}

	    AppDispatcher.dispatch({
	      type: TrackerConstants.RECEIVE_PROJECTS,
	      data: options
	    });
    }
	});
}

export function setProject(id) {
  AppDispatcher.dispatch({
    type: TrackerConstants.SET_PROJECT,
    id: id
  });
}

export function getProjectDetails(project) {
	if (project > 0) {
		apiRequest({
			url: '/getProject.php',
			data: {
				project_id: project
			},
			success: (data) => {
				//console.log(data)

		    AppDispatcher.dispatch({
		      type: TrackerConstants.SET_CONTACT_OR_COMPANY,
		      option: data.contact_or_company,
		      id: data.contact_or_company_id
		    });
      }
		});
	}
}

export function getMilestones(project) {
	if (project > 0) {
		apiRequest({
			url: '/getMilestonesByProject.php',
			data: {
				project_id: project
			},
			success: (json) => {
				var options = rekey(json, { id: 'value', title: 'label' });
				options = where(options, { closed: 0 });

		    AppDispatcher.dispatch({
		      type: TrackerConstants.RECEIVE_MILESTONES,
		      data: options
		    });
      }
		});
	}
}

export function setMilestone(id) {
  AppDispatcher.dispatch({
    type: TrackerConstants.SET_MILESTONE,
    id: id
  });
}

export function getMilestoneTasks(milestone) {

	if (milestone > 0) {

		apiRequest({
			url: '/getTasksByMilestone.php',
			data: {
				milestone_id: milestone
			},
			success: (json) => {
				var options = rekey(json, { id: 'value', description: 'label' });
				options = where(options, { done: 0 });

				var appSettings = JSON.parse(localStorage.getItem('settings'));
				if (appSettings && appSettings.userName) {
					options = where(options, { owner_name: appSettings.userName });
				}

				if (options.length > 0) {
					options.push({ value: -1, label: 'New task...' });
				}

		    AppDispatcher.dispatch({
		      type: TrackerConstants.RECEIVE_MILESTONE_TASKS,
		      data: options
		    });
      }
		});
	}
}

export function setMilestoneTask(id) {
  AppDispatcher.dispatch({
    type: TrackerConstants.SET_MILESTONE_TASK,
    id: id
  });
}

export function getTaskTypes() {
	apiRequest({
		url: '/getTaskTypes.php',
		success: (json) => {
			var options = rekey(json, { id: 'value', name: 'label' });

	    AppDispatcher.dispatch({
	      type: TrackerConstants.RECEIVE_TASK_TYPES,
	      data: options
	    });
	  }
	});
}

export function setTaskType(id) {
  AppDispatcher.dispatch({
    type: TrackerConstants.SET_TASK_TYPE,
    id: id
  });
}












