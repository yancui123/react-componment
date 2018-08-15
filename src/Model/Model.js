import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import Mask from '../Mask/Mask';
import './model.scss';
/**
 * Model.show({})-展现弹窗
 * @param(可选) {Number} width - 弹窗宽度（不填默认宽度为500，最小宽度为400）
 * @param(可选)) {string} title - 弹窗title（不填默认’提示‘）
 * @param(必填) {string || HTML标签} content - 弹窗内容
 * @param(必填) {string || HTML标签} content - 弹窗内容
 * @param(必填) {Array} btnList - 弹窗按钮数组
 *    text - 按钮文案
 *    callback - 按钮点击回调
 *    class - 已写按钮class(蓝色：’btn-confirm‘，取消灰：’btn-cancel‘，警告橘红：’btn-warning‘)
 * 
 * Model.hide()-关闭弹窗
 */
class ModelData {
  @observable width = 600;
  @observable title = '';
  @observable content = '';
  @observable visible = false;
  @observable btnList = [];
 
  @action show = (par) => {
    this.visible = true;
    this.title = par.title || '提示';
    this.width = par.width || '500px';
    this.content = par.content;
    if(par.btnList) {
      this.btnList = (<div className="model-btn-area">
        {
          par.btnList.map((item,index)=> 
            <button 
              key={index} 
              className={item.class} 
              onClick={()=>{
                this.visible = false;
                item.callback();
              }}>{item.text}
            </button>
          )
        }       
      </div>)
    }

  };
  @action hide = () => {
    this.visible = false;
  }
}
const newModelData = new ModelData();
@observer
class Model extends Component {
  hide = () => {
    newModelData.hide();
  }
  createMarkup = str => { 
    return {__html: str } 
  }
  render() {
    const {visible,width,title,content,btnList} = newModelData;
    console.log(btnList)
    if(visible && width !== '') {
      return (
        <div className="model-wrap">
          <div className="model-main" style={{width:`${width}px`}}>
            <div className="model-header">
              { title }
              <span className="model-close" onClick={this.hide}>×</span>
            </div>
            <div className="model-content" dangerouslySetInnerHTML={this.createMarkup(content)}>  
            </div>
            { btnList }         
          </div>
          <Mask />         
        </div>
      )
    }
    return null;
  }
}

Model.show = (par) => {
  newModelData.show(par);
}

Model.hide = () => {
  newModelData.hide();
}

export default Model;
