import React, { Component } from 'react';
import { BASTARD, NOT_BASTARD } from './constants';

/**
 * Controls for bastard / not bastard UI
 */

export default class Controls extends Component {

    render() {
		let { backgroundColor, choice } = this.props;
		var bastardLabel = "Bastard";
		var notBastardLabel = "Not bastard";
		var fontSize = ["24px", "16px"];

		switch(choice) {
			case BASTARD:
				bastardLabel = "Definitely still a bastard";
				notBastardLabel = "Changed my mind. Not bastard.";
				fontSize = ["18px", "14px"];
				break;
			case NOT_BASTARD:
				bastardLabel = "Changed my mind. What a bastard.";
				notBastardLabel = "Still not a bastard, though";
				fontSize = ["18px", "14px"];
				break;
			default:
				// Don't change a thing
		}

		return (
				<p className="controls">
					<button className="choiceButton bastardButton wriggly" onClick={()=> this.props.handler(true)}
						style={{backgroundColor: backgroundColor, fontSize: fontSize[0]}}
					>
						{bastardLabel}
					</button>
					<button className="choiceButton notBastardButton wriggly" onClick={()=> this.props.handler(false)}
						style={{backgroundColor: backgroundColor, fontSize: fontSize[1]}}
					>
						{notBastardLabel}
					</button>	
				</p>
			)
	    }
}