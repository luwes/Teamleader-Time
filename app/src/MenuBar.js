
var gui = nodeRequire('nw.gui');


export default class MenuBar {

	constructor() {

	  var mb = new gui.Menu({ type: 'menubar' });
	  try {
	    mb.createMacBuiltin('Teamleader Time', {
	      hideEdit: false,
	    });
	    gui.Window.get().menu = mb;
	  } catch(ex) {
	    console.log(ex.message);
	  }
	}
}
