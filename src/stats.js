import React, { Component } from 'react';

/**
 * Tag cloud screen
 */

export default class StatsInterlude extends Component {

  render() {
    const {currentIndex, stats, statsModeToggle} = this.props;
    let { liked, disliked } = stats;
    let likedText = liked.map((item) => <li key={item}>{item}</li>).slice(0, 2);
    let dislikedText = disliked.map((item) => <li key={item}>{item}</li>).slice(0, 2);
    const remaining = 15 - currentIndex - 1;

    let statsMode = statsModeToggle;

    if ((statsMode === true) && (disliked.length < 1)) {
      statsMode = false;
    }

    if ((statsMode === false) && (liked.length < 1)) {
      statsMode = true;
    }

    return (
        <div className={"App-card stats-card " + this.props.animation}>
          { statsMode === true &&
            <div>
              <p>Good work. {remaining} more animals to go. So far, you've liked animals that have these traits:</p>
              <ul className="facts-text">
                {dislikedText}
              </ul>
              <p>What do you think this says about you?</p>
            </div>
          }
          { statsMode === false &&
            <div>
               <p>Great work. {remaining} more animals to go. So far, you've disliked animals that have these traits</p>
               <ul className="facts-text">
                {likedText}
               <p>Worth thinking about.</p>
               </ul>
            </div>
          }
          <button 
            onClick={this.props.handlerForNextAnimal}
            className="notBastardButton choiceButton wriggly"
          >
            Continue
          </button>
        </div>
      )
    }
}



