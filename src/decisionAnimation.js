import React, { Component } from 'react';
import { BASTARD } from './constants';

export default class DecisionAnimation extends Component {

    render() {
        const { choice, status } = this.props;
        const text = choice === BASTARD ? "Bastard" : "Not bastard"
        const decisionStyle = choice === BASTARD ? "bastard" : "not-bastard"
        const className = "puff-out-center " + decisionStyle

        if (status === "departure") {
            return (
                <div className="decision">
                    <div className={className}>{text}</div>
                </div>
            )    
        }
        else {
            return <div></div>
        }

    }
}