import React, { Component } from 'react';
import { BASTARD } from './constants';

/**
 * Animal facts box
 */

export default class Facts extends Component {

    prepareText(text) {
        if (!text) {
            return;
        }
        const clean = text
            .toString()
            .replace("...", "... ");
        return clean;
    }

    render() {
        const { choice, facts, showOn } = this.props;
        if (choice == null) {
            return (
            <p></p>
                )
            }
        const text = (choice === BASTARD) ? facts.good : facts.bad;
        const cleanText = this.prepareText(text);
        const choiceText = (choice === BASTARD) ? "bastard" : "not a bastard"

        const sideClass = (choice === showOn) ? "facts" : "facts hidden";

        return (
            <div className={sideClass}>
                <p className="areYouSure">You chose <strong>{choiceText}</strong>.<br/>Are you sure?</p>
                <p className="facts-text">{cleanText}</p>
            </div>
        )  
    }   
}