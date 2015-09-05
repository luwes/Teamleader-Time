
import $ from 'jquery';

var gui = nodeRequire('nw.gui');
var window = gui.Window.get();


var isVisible = false;
var height = 0;
var width = 0;
var req;

function _toggle(e) {
	isVisible ? _hide() : _show(e.x, e.y);
}

function _hide() {
	isVisible = false;
	window.hide();
}

function _show(x, y) {
	isVisible = true;
  window.moveTo(x - ($('.app').width() / 2) - 6, y);
  _resizeLoop();
  window.show();
  window.focus();
}

function _fitWindowToContent() {
	var hei = $('.app').height() + 40;
	var wid = $('.app').width() + 40;

	if (width != wid || height != hei) {
		window.resizeTo(wid, hei);
		width = wid;
		height = hei;
	}
}

function _resizeLoop() {
	_fitWindowToContent();
	if (isVisible) {
		req = requestAnimationFrame(_resizeLoop);
	}
}

export default class Panel {

	constructor(App) {

    if (App.devMode) {
    	window.showDevTools();
    } else {
   		window.on('blur', _hide);
   	}
	}

	toggle(e) {
		_toggle(e);
	}
}
