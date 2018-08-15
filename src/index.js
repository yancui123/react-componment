import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Model from './Model/Model';
import Alert from './Alert/Alert';
import App from './App';

class Test extends Component {
  render () {
    return (
      <div>
        <App />
        <Model />
        <Alert />
      </div>
    )
  }
}
ReactDOM.render(
  <Test />,
  document.getElementById("root")
);

