import React, {Component} from 'react';
import './Dice.css';

class Dice extends Component {
  constructor(props) {
    super();
  }
  render() {
    return(
      <div className="Dice-container">
        <div className="Dice">
          <div className="Dice-side front">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="Dice-side back">
            <span></span>
            <span></span>
          </div>
          <div className="Dice-side left">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="Dice-side right">
            <span></span>
          </div>
          <div className="Dice-side top">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="Dice-side bottom">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }
}

export default Dice;