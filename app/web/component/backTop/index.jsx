import React, { Component } from 'react';
import styles from './style.module.less'
import BlogIcon from 'component/blogIcon'

export default class BackTop extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false
    }
    this.onScroll = this.onScroll.bind(this)
  }

  onScroll () {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if(scrollTop > 300){
      this.setState({
        show : true
      })
    }else{
      this.setState({
        show : false
      })
    }
  }

  componentDidMount() {
    this.onScroll()
    window.addEventListener('scroll', this.onScroll, false)
  }

  render() {
    const {show} = this.state;
    const backToTop = () => {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    }

    return (
      <div className={`container ${styles.back}`}>
        <div className="col-md-9">
          {
            show &&
            <BlogIcon style={{position: 'absolute', right: -32}} type="iconfanhuidingbu" onClick={backToTop}/> 
          }
        </div>
      </div>
    );
  }
}
