
import { apiRequest } from '../utils/Utils';
import AppDispatcher from '../dispatcher/AppDispatcher';
import SettingsConstants from '../constants/SettingsConstants';


export function saveSettings(data) {
  AppDispatcher.dispatch({
    type: SettingsConstants.SAVE_SETTINGS,
    data: data
  });
}

export function getUsers(data) {
	apiRequest({
		url: '/getUsers.php',
		success: (options) => {
			var data = rekey(options, { id: 'value', name: 'label' });
	  	AppDispatcher.dispatch({
	  		type: SettingsConstants.RECEIVE_USERS,
	  		data: data
	  	});
    }
	});
}
