import React, { Component } from 'react';

/**
 * Tag cloud screen
 */

export default class StatsInterlude extends Component {

  render() {
    var {stats, statsModeToggle} = this.props;
    let { liked, disliked } = stats;
    const likedText = liked.map((item) => <li>{item}</li>)
    const dislikedText = disliked.map((item) => <li>{item}</li>)

    return (
        <div className={"App-card stats-card " + this.props.animation}>
          { statsModeToggle === true &&
            <div>
            <p><span class="youDisliked">You liked animals who were</span></p>
            <ul class="facts-text">
            {dislikedText}
            </ul>
            </div>
          }
          { statsModeToggle === false &&
            <div>
               <p><span class="youDisliked">You disliked animals who were</span></p>
               <ul class="facts-text">
               {likedText}
               </ul>
            </div>
          }
          <button 
            onClick={this.props.handlerForNextAnimal}
            className="notBastardButton choiceButton wriggly"
          >
            Proceed
          </button>

        </div>
      )
    }
}



