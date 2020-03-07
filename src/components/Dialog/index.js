import React, { Component } from 'react';
import '../../css/common.css';

export default class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShown: true
    };
  }

  render() {
    const {
      type,
      head,
      text,
      confirm,
      reject
    } = this.props;
    return (
      <>
        <div className="dialog-wrap">
          <div className="dialog-box">
            <img src={`../../imgs/${type === 'alert' ? 'cheers' : 'broken-heart'}.png`} alt="" />
            <h3>{head}</h3>
            <p>{text}</p>
            <div className="dialog-btn-area">
              <button type="button" onClick={(e) => confirm(e, true)}>OK</button>
              {
                type === 'alert'
                  ? ''
                  : <button type="button" onClick={(e) => reject(e, false)}>NO</button>
              }
            </div>
          </div>
        </div>
      </>
    );
  }
}
