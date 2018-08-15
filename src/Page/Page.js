import React, { Component } from 'react';
import './page.scss';

class Page extends Component {
  state = {
    currentIndex: 1,  //当前第几页
    arrowBg: -1       //标记上一页下一页按钮是否处于禁用状态
  }
  constructor(props) {
    super(props);
    const { total, pageSize } = this.props;
    this.num = Math.ceil(total / pageSize);
  }
  componentDidMount() {
    if(this.num > 10) {

    }
  }
  prev = () => {
    if(this.state.currentIndex > 1) { 
      this.setState({
        currentIndex: this.state.currentIndex - 1,      
      },() => {
        this.arrowGrey();
      })
    }
  }
  next = () => {
    if(this.state.currentIndex < this.num) {
      this.setState({
        currentIndex: this.state.currentIndex + 1,
      },() => {
        this.arrowGrey();
      })
    }

  }
  checkIndex = (index) => {
    this.setState({
      currentIndex: index,
    },() => {
      this.arrowGrey();
    })
    
  }
  arrowGrey = () => {
    if(this.state.currentIndex == this.num) {
      this.setState({
        arrowBg: 1
      })
    }else if(this.state.currentIndex == 1) {
      this.setState({
        arrowBg: -1
      })
    } else {
      this.setState({
        arrowBg: 0
      })
    }
  }
  changeClass = (index) => {
    return index === this.state.currentIndex ? 'active' : 'item-li';
  }
  render() {
    const arr = new Array(this.num).fill('');
    const len = arr.length;
    console.log(this.num)
    const { pageSize } = this.props;
    return(
      <div className="page-wrap">
        <div className="page-text">每页{pageSize}条</div>
        <ul className="page-ul">
          <li 
            onClick={this.prev} 
            className={this.state.arrowBg == -1 ? 'arrow-grey' : 'arrow-prev'}
            title='上一页'
            >《
          </li>
          {
            arr.map((item,index) => {
              if(len > 10) {
                if(index < 5 || index == this.num - 1) {
                  return (
                    <li 
                      key={index} 
                      className={this.changeClass(index+1)}
                      onClick={() => {this.checkIndex(index+1)}}
                      >{index+1}
                    </li>
                  )
                }
              } else {
                return (
                  <li 
                    key={index} 
                    className={this.changeClass(index+1)}
                    onClick={() => {this.checkIndex(index+1)}}
                    >{index+1}
                  </li>
                )
              }

            })
          }
          <li 
            onClick={this.next} 
            className={this.state.arrowBg == 1 ? 'arrow-grey' : 'arrow-next'}
            title='下一页'
            >》
          </li>
        </ul>
      </div>
    )
  }
}

export default Page;