import React, { Component } from 'react';
import Mask from '../Mask/Mask';
import './loading.scss';

class Loading extends Component {

  render() {
    return (
      <div className="componment-loading-wrap">
        <div className="componment-loading-main">
          <div className="componment-loading-container componment-loading-container1">
            <div className="componment-loading-circle1"></div>
            <div className="componment-loading-circle2"></div>
            <div className="componment-loading-circle3"></div>
            <div className="componment-loading-circle4"></div>
          </div>
          <div className="componment-loading-container componment-loading-container2">
            <div className="componment-loading-circle1"></div>
            <div className="componment-loading-circle2"></div>
            <div className="componment-loading-circle3"></div>
            <div className="componment-loading-circle4"></div>
          </div>
          <div className="componment-loading-container componment-loading-container3">
            <div className="componment-loading-circle1"></div>
            <div className="componment-loading-circle2"></div>
            <div className="componment-loading-circle3"></div>
            <div className="componment-loading-circle4"></div>
          </div>
        </div>
        <Mask />
      </div>
    )
  }
}

export default Loading;