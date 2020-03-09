import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import styles from './style.module.less';
export default class Sidebar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      
    }
  }

  componentDidMount() {
    // console.log('----componentDidMount-----');
  }


  render() {
    const {labels, locale} = this.props

    return (
      <div className="panel panel-default panel-box">
        <div className="panel-heading">
          <h3 className="panel-title">
            <FormattedMessage id="labels" />
          </h3>
        </div>
        <div className="panel-body">
          {
            labels && labels.map(label => <a key={label.id} className={`label label-success ${styles.labels}`} style={{backgroundColor: `#${label.color}`}} href={`/search?labels=${label.name}${locale === 'en' ? '&language=en' : ''}`}>{label.name}</a>)
          }
        </div>
      </div>
    )
  }
}




