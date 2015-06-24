
import { apiRequest } from '../util';
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
		success: (string) => {
			//reviver function to rename keys
			var data = JSON.parse(string, function(prop, val) {
				switch (prop) {
					case 'id':
						this.value = val;
						return;
					case 'name':
						this.label = val;
						return;
					default:
						return val;
				}
			});
	  	AppDispatcher.dispatch({
	  		type: SettingsConstants.RECEIVE_USERS,
	  		data: data
	  	});
    }
	});
}
