import React, { Component } from 'react';
import Header from 'component/header/header.jsx';
import Sidebar from 'component/sidebar/index.jsx';
import List from 'component/list';
import styles from './style.module.less';
export default class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: this.props.list
    }
  }

  componentDidMount() {
    console.log('----componentDidMount-----');
  }

  setList (data) {
    this.setState({
      list: this.state.list.concat(data)
    })
  }

  render() {
    const {list} = this.state
    const {page, labels, locale} = this.props
    return <>
      <Header locale={locale} page={page}></Header>
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <List locale={locale} parent={this} list={list} type={page}></List>
          </div>
          <div className="col-md-3 hidden-xs hidden-sm" style={{paddingLeft: 0}}>
            <Sidebar locale={locale} labels={labels} />
          </div>
        </div>
      </div>
    </>;
  }
}