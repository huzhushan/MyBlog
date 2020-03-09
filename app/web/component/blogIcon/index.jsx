import React, { Component } from 'react';
import styles from './style.module.less'

export default class BlogIcon extends Component {
  componentDidMount() {
    // console.log('----List componentDidMount-----', this.props);
  }

  render() {
    const {type, ...props} = this.props;

    return (
      <i className={styles['blog-icon']} {...props}>
        <svg width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <use xlinkHref={`#${type}`}></use>
        </svg>
      </i>
    )
  }
}
