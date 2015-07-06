
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
			var options = where(json, { phase: 'active' });
			//console.log(options);
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
				var options = where(json, { closed: 0 });
				//console.log(options);
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
				var options = where(json, { done: 0 });
				//console.log(options);

				var appSettings = JSON.parse(localStorage.getItem('settings'));
				if (appSettings && appSettings.userName) {
					options = where(options, { owner_name: appSettings.userName });
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
		success: (options) => {
			//console.log(options)
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

export function setTaskDescription(txt) {
  AppDispatcher.dispatch({
    type: TrackerConstants.SET_TASK_DESCRIPTION,
    txt: txt
  });
}










