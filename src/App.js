import React, { Component } from "react";
import "./styles.css";

import CardBoard from "./components/CardBoard";

class App extends Component {
	render() {
		return (
			<div className="container">
				<CardBoard size={4} />
			</div>
		);
	}
}

export default App;
