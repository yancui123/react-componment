import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './pagination.scss';

const range = (start = 0, stop = null, step = 1) => {
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
	static propTypes = {
		defaultPage: PropTypes.number,  //默认第几页激活状态
		total: PropTypes.number,        //总数据条数
		pageSize: PropTypes.number,     //每页条数
	}
	static defaultProps = {
		defaultPage: 1,
		middlePage: 5,
	};
	state = {
		defaultPage: this.props.defaultPage,    //默认第几页激活状态
		pageCount: Math.ceil(this.props.total / this.props.pageSize)  //获取总页数
	};

	componentWillReceiveProps(nextProps) {
		const { onChange } = this.props;
		// 更新当前页码
		if(nextProps.defaultPage !== this.props.defaultPage) {
			this.setState({
				defaultPage: nextProps.defaultPage
			});
			onChange && onChange(nextProps.defaultPage);
		}
		// 更新总数
		if(nextProps.total !== this.props.total) {
			let pageCount = Math.ceil(nextProps.total / nextProps.pageSize);
			// 重新更新了总数，判断页码是否在总页码范围内，如果不在则重置当前页码为1
			if(this.state.defaultPage > pageCount) {
				this.setState({
					pageCount: pageCount,
					defaultPage: 1
				});
				onChange && onChange(1);
			} else {
				this.setState({
					pageCount: pageCount
				});
				onChange && onChange(this.props.defaultPage);
			}
		}
	}
	// 页码
	renderPages() {
		const { defaultPage, pageCount } = this.state;
    let prevClass = 'pagination-prevPage';
    let nextClass = 'pagination-nextPage';
    let ret = [];

		//展示上一页
    if(defaultPage === 1) {
      prevClass = 'pagination-disabled';
    }
    ret.push(
      <li 
        onClick={this.handlePrevPage} 
        className={prevClass} 
        key="pagination-prevPage"
        title="上一页"
        >«
      </li>
    );

    //展示页码
    ret = ret.concat(this.caclePages());

		//展示下一页
    if(defaultPage === pageCount) {
      nextClass = 'pagination-disabled';
    }
    ret.push(
      <li 
        onClick={this.handleNextPage} 
        className={nextClass} 
        key="pagination-nextPage"
        title="下一页"
        >»
      </li>
    );
		return ret;
	}
	// 页码点击跳转
	handlePageClick = (idx) => {
		if(idx === this.state.defaultPage) {
			return;
		}
		this.jumpPage(idx);
	}
	// 上一页
	handlePrevPage = () => {
		const { defaultPage } = this.state;
		if(defaultPage > 1) {
			this.jumpPage(defaultPage - 1);
		}
	}
	// 下一页
	handleNextPage = () => {
		const { defaultPage, pageCount } = this.state;
		if(defaultPage < pageCount) {
			this.jumpPage(defaultPage + 1);
		}
	}
	// 跳转到某一页
	handleGo = () => {
		const { defaultPage, pageCount } = this.state;
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
		if(inputPage === defaultPage) {
			return;
		}
		this.jumpPage(inputPage);
	}
	jumpPage(idx) {
		const { onChange } = this.props;
		onChange && onChange(idx);
		this.setState({
			defaultPage: idx
		});
	}
	// 计算页码，返回页码元素
	caclePages() {
		const { total, pageSize } = this.props;
    const { defaultPage, pageCount } = this.state;
    let middlePage = 5;
		let fixPage = 0;										// 根据middlePage修正页码
		let viewPageStart = 0;									// 中间页码开始
		let viewPageEnd = 0;									// 中间页码结束
		let ret = [];

		// 中间页码修正，middlePage为偶数，viewPageEnd需要减1
		fixPage = middlePage % 2 == 0 ? 1 : 0;

		if(defaultPage <= middlePage) {
			// 检测前边界值
			viewPageStart = 1;
			viewPageEnd = middlePage + Math.floor(middlePage / 2);
		} else if(defaultPage >= pageCount - Math.floor(middlePage / 2) - 1) {	// -1 是为了最后一页显示6条分页数据 32..33 是不合理的 应该是 32 33
			// 检测后边界值
			viewPageStart = pageCount - middlePage;
			viewPageEnd = pageCount;
		} else {
			// middlePage在中间
			viewPageStart = defaultPage - Math.floor(middlePage / 2);
			viewPageEnd = defaultPage + Math.floor(middlePage / 2) - fixPage;
		}

		// 检测是否显示第一页和第一页后面的省略号
		if(viewPageStart > 2) {
			ret.push(
        <li 
          key={'pagination-first'} 
          onClick={this.handlePageClick.bind(this, 1)}
          >1
        </li>
      );
			ret.push(
        <li 
          key={'pagination-firt-dot'} 
          className="pagination-dot"
          >...
        </li>
      );
		}
		
		range(viewPageStart, viewPageEnd + 1).map((index, key) => {
			let _className = '';
			if(index == defaultPage) {
				_className = 'pagination-current';
			}
			ret.push(
        <li 
          onClick={this.handlePageClick.bind(this, index)} 
          key={'pagination-' + key} 
          className={_className}
          >{index}
        </li>
      );
		});

		if(viewPageEnd != pageCount) {
			ret.push(
        <li 
          key={'pagination-last'} 
          className="pagination-dot"
          >...
        </li>
      );
			ret.push(
        <li 
          key={'pagination-last-dot'} 
          onClick={this.handlePageClick.bind(this, pageCount)}
          >{pageCount}
        </li>
      );
		}
		return ret;
	}
	render() {
		const { showGo, pageSize } = this.props;
		return (
			<div className="pagination-wrap">
        <div className="pagination-text">每页{pageSize}条</div>
				<div className="pagination-pages">
					<ul>
						{this.renderPages()}
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
