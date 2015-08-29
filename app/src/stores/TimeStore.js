
import { createStore } from '../utils/StoreUtils';
import { saveTime } from '../actions/TrackerActions';

import AppDispatcher from '../dispatcher/AppDispatcher';
import TrackerConstants from '../constants/TrackerConstants';


var _isTiming = false;
var _interval;
var _start;
var _elapsed = 0;

function _tick() {
	var now = Math.floor(Date.now() / 1000); //in seconds
	_elapsed = now - _start;

	TimeStore.emitChange();
}

var TimeStore  = createStore({

	isTiming() {
		return _isTiming;
	},

	getSecondsElapsed() {
		return _elapsed;
	}

});

TimeStore.dispatchToken = AppDispatcher.register(action => {

	switch (action.type) {

		case TrackerConstants.START_TIMER:
			_start = action.timestamp;
			_isTiming = true;

			clearInterval(_interval);
			_interval = setInterval(_tick, 1000);

			TimeStore.emitChange();
			break;

		case TrackerConstants.STOP_TIMER:
			var end = action.timestamp;

			saveTime(_start, end);

			_elapsed = 0;
			_isTiming = false;
			clearInterval(_interval);

			TimeStore.emitChange();
			break;

		default:
			//no op
	}

});


export default TimeStore;
