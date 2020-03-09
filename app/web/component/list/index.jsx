import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import moment from 'moment';
import BlogIcon from 'component/blogIcon'
import {getBlogList} from 'service'
import styles from './style.module.less';

export default class List extends Component {
  constructor (props) {
    super(props);

    this.state = {
      labels: '',
      loadingTxt: 'loading', 
      isLoading: false, // 是否正在加载
      isHasMore: true, // 是否还有数据
      pageNum: 1 // 当前页码
    }

    this.handleScroll = this.handleScroll.bind(this) ;
  }

  handleScroll () {
    const {isHasMore, isLoading} = this.state;

    if (!isHasMore) {
      return;
    }

    if (isLoading) {
      return;
    }

    // “加载更多”临界值判断
    if (!this.loadMoreDom || this.loadMoreDom.getBoundingClientRect().top - window.innerHeight > 30) {
      return;
    }
    
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.loadMoreData(), 200);
  }

  loadMoreData () {
    const {type, parent} = this.props;
    const {labels} = this.state
    
    this.setState({
      isLoading: true,
      pageNum: this.state.pageNum + 1
    }, async () => {

      const {status, data, message} = await getBlogList({
        type,
        labels,
        pageNum: this.state.pageNum
      })

      this.setState({
        isLoading: false
      })
      
      if (status === 200) {
        if (data.length > 0) {
          parent.setList(data);
          setTimeout(() => this.handleScroll(), 500);
        } else {
          this.setState({
            isHasMore: false,
            loadingTxt: 'emptyData'
          })
        }
      }
  
      
    })

  }

  componentDidMount() {
    let labels = window.location.search.match(/labels=([^&]*)/)
    this.setState({
      labels: labels ? labels[1] : ''
    }, () => {
      this.handleScroll();
      window.addEventListener('scroll', this.handleScroll, false)
    })
    
  }
  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, false)
  }


  

  render() {
    const {list, type, locale} = this.props
    const { loadingTxt} = this.state

    return list && list.length > 0
      ?
      <>
        {
          list.map(item => <div key={item.id} className="panel panel-default panel-box">
            <div className={`panel-body ${styles['panel-body']}`}>
              <h3 className="panel-title">
                {type === 'search' && <span className="label label-success" style={{marginRight: 10, backgroundColor: `#${item.label.color}`}}>{item.label.name}</span>}
                <span className="label label-danger">
                  <FormattedMessage id={item.type.value} defaultMessage={item.type.name}/>
                </span> 
                
                <a href={`/detail/${item.id}${locale === 'en' ? '?language=en' : ''}`} className={styles['box-list-title']}>{item.title}</a>
                
              </h3>
              <div className={`row ${styles['article-content']}`}>
                <div className="col-sm-3">
                  <a href={`/detail/${item.id}${locale === 'en' ? '?language=en' : ''}`} className={styles['article-thumb']}>
                    <img src={item.thumb} alt="" />
                  </a>
                </div>
                <p className="visible-xs"></p>
                <div className={`col-sm-9 ${styles['article-body']}`}>
                  <p className={styles['article-summary']}>{item.summary}...</p>
                  <div className={styles['article-info']}>
                    <BlogIcon type="iconshijian" /> {moment(item.dateTime).format('YYYY-MM-DD HH:mm')}	 <BlogIcon type="iconpinglun" style={{marginLeft: 10}} /> {item.comments}
                  </div>
                </div>
              </div>
            </div>
          </div>)
        }
        <p className="text-center text-muted" ref={el => this.loadMoreDom = el}>
          <FormattedMessage id={loadingTxt} defaultMessage="加载中..." />
        </p>
      </>
      :
      <div className="text-center text-muted">
        <FormattedMessage id="emptyData" defaultMessage="没有数据!" />
      </div>
  }
}