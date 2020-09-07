import React, {Component} from 'react';

class ProgressRing extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    // Size of the enclosing square
    const sqSize = this.props.sqSize;
    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const radius = (this.props.sqSize - this.props.strokeWidth) / 2;
    // Enclose cicle in a circumscribing square
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    // Arc length at 100% coverage is the circle circumference
    const dashArray = radius * Math.PI * 2;
    // Scale 100% coverage overlay with the actual percent
    const dashOffset = dashArray - dashArray * this.props.percentage / 100;

    return (
      <figure className="ProgressRing">
        <svg
            width={this.props.sqSize}
            height={this.props.sqSize}
            viewBox={viewBox}>
            <circle
              className="ProgressRing-backgroundCircle"
              cx={this.props.sqSize / 2}
              cy={this.props.sqSize / 2}
              r={radius}
              strokeWidth={`${this.props.strokeWidth}px`} 
              style={{
                stroke: "red",
                fill: "none"
              }}
              />
            <circle
              className="ProgressRing-progressCircle"
              cx={this.props.sqSize / 2}
              cy={this.props.sqSize / 2}
              r={radius}
              strokeWidth={`${this.props.strokeWidth}px`}
              // Start progress marker at 12 O'Clock
              transform={`rotate(-90 ${this.props.sqSize / 2} ${this.props.sqSize / 2})`}
              style={{
                fill: "none",
                strokeDasharray: dashArray,
                strokeDashoffset: dashOffset,
                stroke: "blue",
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }} />
            <text
              className="ProgressRing-text"
              x="50%"
              y="50%"
              dy=".3em"
              textAnchor="middle">
              {`${this.props.percentage}%`}
            </text>
        </svg>
      </figure>
    );
  }
}

export default ProgressRing;