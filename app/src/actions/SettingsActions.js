
var Util = require('../util');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SettingsConstants = require('../constants/SettingsConstants');

module.exports = {

  saveSettings: function(data) {
    AppDispatcher.dispatch({
      type: SettingsConstants.SAVE_SETTINGS,
      data: data
    });
  },

  getUsers: function(data) {
		Util.apiRequest({
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

};
