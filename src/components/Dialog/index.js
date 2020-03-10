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
      close,
      param
    } = this.props;
    return (
      <>
        <div className="dialog-wrap">
          <div className="dialog-box">
            <img src={`../../imgs/${type === 'alert' ? 'cheers' : 'broken-heart'}.png`} alt="" />
            <h3>{head}</h3>
            <p>{text}</p>
            <div className="dialog-btn-area">
              {
                type === 'alert'
                  ? <button type="button" onClick={(e) => close(e, true)}>OK</button>
                  : (
                    <>
                      <button type="button" onClick={(e) => confirm(e, param)}>YES</button>
                      <button type="button" onClick={(e) => close(e, false)}>NO</button>
                    </>
                  )
              }
            </div>
          </div>
        </div>
      </>
    );
  }
}
