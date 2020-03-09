import React, { Component } from 'react';
import Header from 'component/header/header.jsx';
import Sidebar from 'component/sidebar/index.jsx';
import moment from 'moment';
import {FormattedMessage} from 'react-intl';
import BlogIcon from 'component/blogIcon'
import {postLike, postComment} from 'service'
import styles from './style.module.less';

import Toast from 'component/toast'

import marked from 'marked'
import hljs from "highlight.js";
import 'highlight.js/styles/monokai-sublime.css';
import Tocify from './tocify'

 


export default class Home extends Component {
  constructor (props) {
    super(props)
    const {likes, userInfo, comments} = props.data
    this.state = {
      likes,
      comments,
      userInfo,
      content: ''
      
    }
    this.getOauthStatus = this.getOauthStatus.bind(this) ;
  }

  async getOauthStatus (event) {
    if (event.origin !== window.location.origin) {
      return;
    }
    
    if (typeof event.data !== 'object' || !('authorized' in event.data)) {
      return;
    }

    if (event.data.authorized) {

      if (this.state.content) {
        const res = await postLike(this.state.content, this.props.data.aid)
        this.onLike(res, this.state.content)
      }

      this.setState({
        userInfo: event.data.userInfo
      })
    } else {
      Toast.error('授权失败，请重试！')
    }
  }

  onLike (res, content) {
    if (typeof res === 'number') {
      const {likes} = this.state
      
      if (likes[content].includes(res)) {
        Toast.info('你已经表过态了')
      } else {
        this.setState({
          likes: {
            ...likes,
            [content]: [...this.state.likes[content], res]
          }
        })
      }
      
      
    } else {
      Toast.error('表态失败')
    }

    this.setState({
      content: ''
    })
  }

  componentDidMount() {
    // console.log('----detail componentDidMount-----');

    window.addEventListener('message', this.getOauthStatus, false)
  }

  

  


  render() {
    const {page, data, labels, locale} = this.props
    const {likes, userInfo, comments} = this.state

    const go_to_authorize = () => {
      // github授权登录
      const redirect_uri = encodeURIComponent(`${window.location.origin}/oauth/redirect?referrer=${window.location.href}`)
      // window.location.href = `https://github.com/login/oauth/authorize?client_id=387e04396dd9febb2d4a&redirect_uri=${redirect_uri}`
      window.open(`https://github.com/login/oauth/authorize?client_id=387e04396dd9febb2d4a&redirect_uri=${redirect_uri}`)
    }

    const handleLike = async (content) => {
      this.setState({
        content
      })
      
      const res = await postLike(content, data.aid)
      if (res.code === 401) {
        go_to_authorize()
      } else {
        this.onLike(res, content)
      }

      
     
    }

    const handleLogin = () => {
      if (!!userInfo) {
        return
      }
      go_to_authorize()
    }


    const handleComment = async () => {
      const val = this.input.value;
      if (val.trim() === '') {
        Toast.info('请输入评论')
      } else {
        Toast.loading()
        const res = await postComment(val, data.aid)
        if (res.code === 401) {
          go_to_authorize()
        } else if (!!res.id) {
          Toast.success('评论成功')
          this.input.value = ''
          this.setState({
            comments: [res, ...comments]
          })
        }
      }
    }




    const tocify = new Tocify()
    const renderer = new marked.Renderer();
    renderer.heading = (text, level, raw) => {
      const anchor = tocify.add(text, level);
      return `<a id="${anchor}" href="#${anchor}" class="${styles['anchor-fix']}"><h${level}>${text}</h${level}></a>\n`;
    };

    marked.setOptions({
      renderer: renderer, 
      gfm: true,
      pedantic: false,
      sanitize: false,
      tables: true,
      breaks: false,
      smartLists: true,
      smartypants: false,
      highlight: (code) => hljs.highlightAuto(code).value
    });

    return <>
      <Header locale={locale} page={page}></Header>
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            {
              !!data.id 
              ?
              <>
                <div className="panel panel-default panel-box">
                <div className="panel-heading text-center">
                  <div className="panel-title" style={{border: 'none'}}>
                    <h1 className={styles['panel-title']}>{data.title}</h1>
                    <div className={styles['article-info']}>
                      <BlogIcon type="iconshijian" /> {moment(data.createTime).format('YYYY-MM-DD HH:mm')} <BlogIcon type="iconpinglun" style={{marginLeft: 10}} /> {data.comments.length} <BlogIcon type="icondianzan-kongxin" style={{marginLeft: 10}} /> {likes && likes.good.length}
                    </div>
                    <div className={`text-center ${styles.labels}`}>
                      {
                        data.labels && data.labels.map(label => <a key={label.id} className="label label-success" style={{backgroundColor: `#${label.color}`}} href={`/search?labels=${label.name}`}>{label.name}</a>)
                      }
                      
                    </div>
                  </div>
                  
                </div>
                <div className={`panel-body ${styles['panel-body']}`}>
                  <div dangerouslySetInnerHTML={{__html: marked(data.content)}}></div>
                  <ul className={styles['reaction-btns']}>
                    <li>
                      <BlogIcon type="icondianzan" onClick={() => handleLike('good')}/> 
                      <div>{likes && likes.good.length}</div>
                    </li>
                    <li>
                      <BlogIcon type="icondianzan2" onClick={() => handleLike('bad')}/> 
                      <div>{likes && likes.bad.length}</div>
                    </li>
                    <li>
                      <BlogIcon type="iconfenxiang" /> 
                      <div><FormattedMessage id="share" /></div>
                    </li>
                    <li>
                      <BlogIcon type="iconrewardsolid" /> 
                      <div><FormattedMessage id="tip" /></div>
                    </li>
                  </ul>
                </div>
              </div>
                <div className="panel panel-default panel-box">
                <div className="panel-heading">
                  <h3 className="panel-title" style={{padding: '16px 0'}}>
                    <FormattedMessage id="commentTitle" />
                  </h3>
                </div>
                <div className="panel-body">
                  <ul className="media-list">
                    <li className={`media ${!!userInfo ? '' : styles['comment-box']}`} onClick={handleLogin}>
                      <div className="media-left">
                        <img className={`media-object img-circle ${styles.avatar}`} src={!!userInfo ? userInfo.avatar : require('asset/images/avatar.png')} alt={!!userInfo ? userInfo.name : 'avatar'} />
                      </div>
                      <div className="media-body">
                        <textarea className="form-control" rows="3" placeholder="请输入评论" style={{resize: 'none'}} ref={el => this.input = el}></textarea>
                        <div className="text-right" style={{marginTop: 10}}>
                          <a onClick={go_to_authorize} className="btn btn-link"><FormattedMessage id="re-login" /></a>
                          <button type="button" className="btn btn-danger" onClick={handleComment}><FormattedMessage id="commit" /></button>
                        </div>
                      </div>
                    </li>
                    {
                      comments.map(comment => (
                        <li className="media" key={comment.id}>
                          <div className="media-left">
                            <img className={`media-object img-circle ${styles.avatar}`} src={comment.avatar} alt="头像" />
                          </div>
                          <div className="media-body">
                            <h5 className="media-heading text-success">{comment.user} <small>{moment(comment.dateTime).format('YYYY-MM-DD HH:mm')}</small></h5>
                            <div>
                              {comment.content}
                            </div>
                          </div>
                        </li>
                      ))
                    }
                    
                  </ul>
                </div>
              </div>
              </>
              :
              <div className="panel panel-default panel-box">
                <div className="panel-body alert alert-danger">
                  获取文章出错，请刷新重试!
                </div>
              </div>
            }      
          </div>
          <div className="col-md-3 hidden-xs hidden-sm" style={{paddingLeft: 0}}>
            <Sidebar locale={locale} labels={labels} />
            <div className="panel panel-default panel-box">
              <div className="panel-heading">
                <h3 className="panel-title">
                  <FormattedMessage id="contents" />
                </h3>
              </div>
              <div className={`panel-body ${styles['tocify-list']}`}>
                {tocify && tocify.render()}
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
    </>;
  }
}