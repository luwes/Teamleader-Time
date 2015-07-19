
var fs = nodeRequire('fs');

import Routes from './Routes';
import StatusBar from './StatusBar';
import MenuBar from './MenuBar';

class App {

	constructor() {

		this.devMode = fs.existsSync('.dev') && 
										fs.readFileSync('.dev', {encoding: 'utf8'}) === '1';

		this.statusBar = new StatusBar(this);
		this.menuBar = new MenuBar();
		this.routes = new Routes();
	}
}

export default (window.App = new App())