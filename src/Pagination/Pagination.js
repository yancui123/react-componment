/**
 * 用法
 * <Pagination
 *  total={846}       //数据总条数{num}
 *  pageSize={20}     //每页展示条数{num}
 *  defaultNum={1}    //默认选中第几页{num}
 *  onChange={this.handleChange}    //页码变化触发的回调函数{function}
 *  showGo            //是否展示跳转指定页数功能{boolean}
 * />
 */
import React, { Component } from 'react';
import './pagination.scss';

//获取数组指定范围间的新数组
const getRange = (start = 0, stop = null, step = 1) => {
  let [_start, _stop] = [0, start];
  if(stop !== null) {
    [_start, _stop] = [start, stop];
  }
  const length = Math.max(Math.ceil((_stop - _start) / step), 0);
  const range = Array(length);
  for(let idx = 0; idx < length; idx++, _start += step) {
    range[idx] = _start;
  }
  return range;
}

class Pagination extends Component {
	state = {
		defaultNum: this.props.defaultNum,    //默认第几页激活状态
		pageCount: Math.ceil(this.props.total / this.props.pageSize)  //获取总页数
	};

	componentWillReceiveProps(nextProps) {
		const { onChange } = this.props;
		// 更新当前页码
		if(nextProps.defaultNum !== this.props.defaultNum) {
			this.setState({
				defaultNum: nextProps.defaultNum
			});
			onChange && onChange(nextProps.defaultNum);
		}
		// 更新总数
		if(nextProps.total !== this.props.total) {
      // let pageCount = Math.ceil(nextProps.total / nextProps.pageSize);
      const { pageCount } = this.state;
			// 重新更新了总数，判断页码是否在总页码范围内，如果不在则重置当前页码为1
			if(this.state.defaultNum > pageCount) {
				this.setState({
					pageCount: pageCount,
					defaultNum: 1
				});
				onChange && onChange(1);
			} else {
				this.setState({
					pageCount: pageCount
				});
				onChange && onChange(this.props.defaultNum);
			}
		}
	}
	// 页码
	renderPageNum() {
		const { defaultNum, pageCount } = this.state;
    let prevClass = 'pagination-prevPage';
    let nextClass = 'pagination-nextPage';
    let arr = [];

		//展示上一页
    if(defaultNum === 1) {
      prevClass = 'pagination-disabled';
    }
    arr.push(
      <li 
        onClick={this.handlePrevPage} 
        className={prevClass} 
        key="pagination-prevPage"
        title="上一页"
        >«
      </li>
    );

    //展示页码
    arr = arr.concat(this.handlePageNum());

		//展示下一页
    if(defaultNum === pageCount) {
      nextClass = 'pagination-disabled';
    }
    arr.push(
      <li 
        onClick={this.handleNextPage} 
        className={nextClass} 
        key="pagination-nextPage"
        title="下一页"
        >»
      </li>
    );
		return arr;
	}
	// 页码点击跳转
	handlePageClick = (num) => {
		if(num === this.state.defaultNum) {
			return;
		}
		this.jumpPage(num);
	}
	// 上一页
	handlePrevPage = () => {
		const { defaultNum } = this.state;
		if(defaultNum > 1) {
			this.jumpPage(defaultNum - 1);
		}
	}
	// 下一页
	handleNextPage = () => {
		const { defaultNum, pageCount } = this.state;
		if(defaultNum < pageCount) {
			this.jumpPage(defaultNum + 1);
		}
	}
	// 跳转到某一页
	handleGo = () => {
		const { defaultNum, pageCount } = this.state;
		let inputPage = this.refs.msPaginationGoInput && this.refs.msPaginationGoInput.value;
		// 输入页码必须为数字
		if(!/^(\d)+$/.test(inputPage)) {
			return;
		}
		inputPage = parseInt(inputPage);
		if(inputPage < 1 && pageCount > 1) {
			return;
		}
		if(inputPage > pageCount) {
			return;
		}
		if(inputPage === defaultNum) {
			return;
		}
		this.jumpPage(inputPage);
	}
	jumpPage(num) {
		const { onChange } = this.props;
		onChange && onChange(num);
		this.setState({
			defaultNum: num
		});
	}
	// 计算页码，返回页码元素
	handlePageNum() {
    const { defaultNum, pageCount } = this.state;
    let middlePage = 5;
		let adjustPage = 0;										// 根据middlePage修正页码
		let pageStart = 0;									// 中间页码开始
		let pageEnd = 0;									// 中间页码结束
		let arr = [];

		// 中间页码修正，middlePage为偶数，pageEnd需要减1
		adjustPage = middlePage % 2 == 0 ? 1 : 0;

		if(defaultNum <= middlePage) {
			// 检测前边界值
			pageStart = 1;
			pageEnd = middlePage + Math.floor(middlePage / 2);
		} else if(defaultNum >= pageCount - Math.floor(middlePage / 2) - 1) {	// -1 是为了最后一页显示6条分页数据 32..33 是不合理的 应该是 32 33
			// 检测后边界值
			pageStart = pageCount - middlePage;
			pageEnd = pageCount;
		} else {
			// middlePage在中间
			pageStart = defaultNum - Math.floor(middlePage / 2);
			pageEnd = defaultNum + Math.floor(middlePage / 2) - adjustPage;
		}

		// 检测是否显示第一页和第一页后面的省略号
		if(pageStart > 2) {
			arr.push(
        <li 
          key={'pagination-first'} 
          onClick={this.handlePageClick.bind(this, 1)}
          >1
        </li>
      );
			arr.push(
        <li 
          key={'pagination-firt-dot'} 
          className="pagination-dot"
          >...
        </li>
      );
		}
		
		getRange(pageStart, pageEnd + 1).map((index, key) => {
			let _className = '';
			if(index == defaultNum) {
				_className = 'pagination-current';
			}
			arr.push(
        <li 
          onClick={this.handlePageClick.bind(this, index)} 
          key={'pagination-' + key} 
          className={_className}
          >{index}
        </li>
      );
		});

		if(pageEnd != pageCount) {
			arr.push(
        <li 
          key={'pagination-last'} 
          className="pagination-dot"
          >...
        </li>
      );
			arr.push(
        <li 
          key={'pagination-last-dot'} 
          onClick={this.handlePageClick.bind(this, pageCount)}
          >{pageCount}
        </li>
      );
		}
		return arr;
	}
	render() {
		const { showGo, pageSize } = this.props;
		return (
			<div className="pagination-wrap">
        <div className="pagination-text">每页{pageSize}条</div>
				<div className="pagination-pages">
					<ul>
						{this.renderPageNum()}
					</ul>
				</div>
				{
					showGo
						? (
							<div className="pagination-go-wrap">
								<div className="pagination-go">
									跳转到&nbsp;<input ref="msPaginationGoInput" />&nbsp;页
								</div>
								<div className="paginatioin-btn">
									<button onClick={this.handleGo}>确定</button>
								</div>
							</div>
						)
						: null
				}
			</div>
		);
	}
}

export default Pagination;
