import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl';

import Headroom from 'asset/js/headroom';

import 'asset/bootstrap/less/bootstrap.less';
import './header.less';

import BlogIcon from 'component/blogIcon'

import BackTop from 'component/backTop'

export default class Header extends Component {
  componentDidMount() {
    // console.log('----Header componentDidMount-----', this.props.locale);
    
    // 初始化导航显示隐藏
    new Headroom(this.nav).init();
  }

  render() {
    const {page = 'index', locale} = this.props;

    const updateQueryStringParameter = (uri, key, value) => {
      if(!value) {
        return uri;
      }
      let re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
      let separator = uri.indexOf('?') !== -1 ? '&' : '?';
      if (uri.match(re)) {
        return uri.replace(re, '$1' + key + '=' + value + '$2');
      }
      else {
        return uri + separator + key + '=' + value;
      }
    }

    const switchLanguage = (language) => {
      const newurl = updateQueryStringParameter(window.location.href, 'language', language);
      window.location.replace(newurl);
    }

    return <>
      <nav className="navbar navbar-default navbar-fixed-top" ref={el => this.nav = el}>
        <div className="container">
      
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#blog-nav" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand logo" href={locale === 'en' ? '/?language=en' : '/'}>
              <img src="https://zos.alipayobjects.com/rmsportal/VTcUYAaoKqXyHJbLAPyF.svg" alt="Brand"/>
            </a>
            <p className="navbar-text">
              <FormattedMessage id='title'/>
            </p>
          </div> 
          <div className="collapse navbar-collapse" id="blog-nav">
            <ul className="nav navbar-nav navbar-right">
              <li className={page === 'index' ? 'active' : ''}>
                <a href={`/${locale === 'en' ? '?language=en' : ''}`}>
                  <FormattedMessage id='pageIndex' />
                </a>
              </li>
              <li className={page === 'work' ? 'active' : ''}>
                <a href={`/work${locale === 'en' ? '?language=en' : ''}`}>
                  <FormattedMessage id='work' />
                </a>
              </li>
              <li className={page === 'travel' ? 'active' : ''}>
                <a href={`/travel${locale === 'en' ? '?language=en' : ''}`}>
                  <FormattedMessage id='travel' />
                </a>
              </li>
            
              <li className="dropdown">
                <a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                  <BlogIcon type={locale === 'en' ? 'iconyingguo' : 'iconzhongwen'} style={{fontSize: 16, verticalAlign: 'middle'}} />
                </a>
                <ul className="dropdown-menu">
                  <li><a onClick={() => switchLanguage('zh')}><BlogIcon type="iconzhongwen" /> 中文</a></li>
                  <li><a onClick={() => switchLanguage('en')}><BlogIcon type="iconyingguo" /> English</a></li>
                </ul>
              </li>
            </ul>
          
          </div>
        
        </div>
      </nav>
      <BackTop />
    </>
  }
}
