import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import Mask from '../Mask/Mask';
import '../iconfont.scss';
import './alert.scss';
/**
 * Alert.succ(str)-成功提示
 * 
 * @param(可选) {String} str - 提示文案
 * 
 * Alert.hide()-关闭弹窗
 */
class AlertData {
  @observable type = '';
  @observable text = '';
  @observable visible = false;
 
  @action succ = (str) => {
    this.visible = true;
    this.type = 'succ';
    this.text = str;
  };
  @action fail = (str) => {
    this.visible = true;
    this.type = 'fail';
    this.text = str;
  };
  @action warning = (str) => {
    this.visible = true;
    this.type = 'warning';
    this.text = str;
  };
  @action hide = () => {
    this.visible = false;
  }
}
const newAlertData = new AlertData();
@observer
class Alert extends Component {
  hide = () => {
    newAlertData.hide();
  }
  createMarkup = str => { 
    return {__html: str } 
  }

  render() {
    const {visible,text,type} = newAlertData;
    let iconHtml = null;
    switch (type) {
      case 'succ':
        iconHtml = <i className="icon iconfont icon-wancheng"></i>
        break;
      case 'fail':
        iconHtml = <i className="icon iconfont icon-guanbi"></i>
        break;
      case 'warning':
        iconHtml = <i className="icon iconfont icon-warning"></i>
        break;
      default:
        break;
    }
    if(visible) {
      return (
        <div className="alert-wrap">
          <div className="alert-main">
            <div className="alert-header">提示
              <span className="alert-close" onClick={this.hide}>×</span>
            </div>          
            <div className="alert-content">  
              { iconHtml }
              <div className="alert-text" dangerouslySetInnerHTML={this.createMarkup(text)}>
              </div>
            </div>       
          </div>
          <Mask />         
        </div>
      )
    }
    return null;
  }
}

Alert.fail = (str) => {
  newAlertData.fail(str);
}
Alert.succ = (str) => {
  newAlertData.succ(str)
}
Alert.warning = (str) => {
  newAlertData.warning(str)
}
Alert.hide = () => {
  newAlertData.hide();
}

export default Alert;
