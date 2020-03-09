import React, { Component } from 'react';
export default class Oauth extends Component {
  constructor (props) {
    super(props)
    
  }

  componentDidMount() {
    const targetWindow = window.opener

    targetWindow.postMessage(this.props.data, 'http://127.0.0.1:7001')
    window.close()
  }

  

  render() {
    const {authorized} = this.props.data; 
    return <h1>
      {authorized ? '授权成功' : '授权失败'}
    </h1>;
  }
}