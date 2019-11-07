import React from 'react';

import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";

import Chat from './Chat';
import Home from './Home';

function App() {
	return (
		<Router>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/chat/:id" component={Chat} />
			</Switch>
		</Router>
	);
}

export default App;
