import React, {Component} from 'react';
import Model from './Model/Model';
import Alert from './Alert/Alert';
import Page from './Page/Page';
import Pagination from './Pagination/Pagination';
import Loading from './Loading/Loading';
import Mask from './Mask/Mask';


export default class App extends Component {
  componentDidMount() {
    // Model.show({
    //   width: '700',
    //   title: '删除职位hha',
    //   content: '确认删除职位确定删除职位？',
    //   btnList: [
    //     {
    //       text: '删吗？',
    //       callback: () => {
    //         alert('btn1')
    //       },
    //       class: 'btn-confirm'
    //     },
    //     {
    //       text: '取消了',
    //       callback: () => {
    //         alert('btn2')
    //       },
    //       class: 'btn-cancel'
    //     },
    //     // {
    //     //   text: '取消了',
    //     //   callback: () => {
    //     //     alert('btn3')
    //     //   },
    //     //   class: 'btn-warning'
    //     // },
    //   ]
    // });
    //Alert.fail('确认删除职位确定删除职位？');
  }
  handleChange = (idx) => {
		console.log('页码改变 => ', idx);
	}
  render() {
    return (
      <div>
        {/* <Page pageSize={20} total={487}/> */}
        <Pagination
					total={346}
					pageSize={20}
					defaultPage={1}
          onChange={this.handleChange}
				/>
        {/* <Loading /> */}
      
      </div>
    )
  }
}



