const Service = require('egg').Service;
// 匹配第一张图片的正则
const regExp  = /<[img|IMG].*?src=[\'|\"](.*?(?:[\s\S]))[\'|\"].*?[\/]?>/;

const client_id = '387e04396dd9febb2d4a';
const client_secret = 'ad46a742196e8edff9afc422a34175629e2b6bc9'
const creator = 'huzhushan'

class BlogService extends Service {
  async getBlogList({milestone = '*', labels, page = 1} = {}) {
    const {ctx} = this;
    
    const {data, status, res: {statusMessage: message}} = await ctx.curl('https://api.github.com/repos/huzhushan/blog/issues', { 
      data: {
        client_id,
        client_secret,
        creator,
        state: 'all',
        milestone,
        labels,
        page,
        per_page: 10
        // sort: 'updated'
      },  
      dataType: 'json'
    });

    return {
      status,
      message,
      data: Array.isArray(data) ? data.map(item => {
        let thumb = item.body.match(regExp);
        let str = thumb ? item.body.replace(thumb[0], '') : item.body;
  
        return {
          id: ctx.helper.AesEncode(item.number + '', 'huzhushan123'),
          title: item.title,
          type: {
            name: item.milestone.title,
            value: item.milestone.description
          },
          comments: item.comments,
          dateTime: item.created_at,
          thumb: thumb ? thumb[1] : null,
          summary: str.substr(0, 150),
          label: item.labels.map(({id, name, color}) => ({id, name, color})).find(label => label.name === labels)
        }
      }): data
    };
  }

  async getBlogDetail(number) {
    const {ctx} = this;
    
    // 获取文章详情
    const {data, status, res: {statusMessage: message}} = await ctx.curl(`https://api.github.com/repos/huzhushan/blog/issues/${number}`, { 
      data: {
        client_id,
        client_secret
      },  
      dataType: 'json'
    });

 


    // 获取交互(点赞等)详情
    const {data: reactions} = await ctx.curl(`https://api.github.com/repos/huzhushan/blog/issues/${number}/reactions`, { 
      headers: {
        'Accept': 'application/vnd.github.squirrel-girl-preview+json'
      },  
      data: {
        client_id,
        client_secret
      },  
      dataType: 'json'
    });

  
    

    // 获取评论
    const {data: comments} = await ctx.curl(`https://api.github.com/repos/huzhushan/blog/issues/${number}/comments`, { 
       
      data: {
        client_id,
        client_secret
      },  
      dataType: 'json'
    });

    
    return {
      status,
      message,
      data: status === 200 ? {
        id: data.id,
        title: data.title,
        comments: Array.isArray(comments) ? comments.sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).map(comment => ({
          id: comment.id,
          content: comment.body,
          dateTime: comment.updated_at,
          user: comment.user.login,
          avatar: comment.user.avatar_url
        })) : [],
        createTime: data.created_at,
        modifyTime: data.updated_at,
        content: data.body,
        labels: data.labels.map(label => ({
          id: label.id,
          name: label.name,
          color: label.color
        })),
        type: {
          name: data.milestone.title,
          value: data.milestone.description
        },
        likes: Array.isArray(reactions) ? reactions.reduce((obj, reaction) => {
          if (reaction.content === '+1') {
            obj.good.push(reaction.user.id)
          } else if (reaction.content === '-1') {
            obj.bad.push(reaction.user.id)
          }
          return obj;
        }, {good: [], bad: []}) : 0
      } : null
    }

  }

  async getLabels() {
    const {ctx} = this;
    const {data, status, res: {statusMessage: message}} = await ctx.curl('https://api.github.com/repos/huzhushan/blog/labels', { 
      data: {
        client_id,
        client_secret
      },  
      dataType: 'json'
    });

    return {
      status,
      message,
      data: status === 200 ? data.map(({id, name, color}) => ({
        id, name, color
      })) : null
    }
  }

  async getAccessToken (code) {
    const {ctx} = this;

    const {data} = await ctx.curl(`https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`, {
      // data: {
      //   client_id,
      //   client_secret,
      //   code
      // }, 
      method: 'POST',
      dataType: 'json'
    })

    return data.access_token
  }

  async getUserInfo (accessToken) {
    const {ctx} = this;
    const {data: user, status} = await ctx.curl(`https://api.github.com/user?access_token=${accessToken}`, {
      dataType: 'json'
    })

    return status === 200 ? {
      id: user.id,
      name: user.login,
      avatar: user.avatar_url
    } : null
  }

  async postReactions (number, content, accessToken) {
    const {ctx} = this;
    const {data, status} = await ctx.curl(`https://api.github.com/repos/huzhushan/blog/issues/${number}/reactions?access_token=${accessToken}`, { 
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.squirrel-girl-preview+json'
      },  
      data: {
        content 
      },  
      dataType: 'json',  
      contentType: 'json' // contentType一定要设为json，要不然会报错：Problems parsing JSON
    });

    if (status !== 201 && status !== 200) {
      return {
        status,
        message: 'Error'
      }
    }

    return !!data.content ? data.user.id : false;
  }

  async postComments (number, comments, accessToken) {
    const {ctx} = this;
    const {data: comment, status} = await ctx.curl(`https://api.github.com/repos/huzhushan/blog/issues/${number}/comments?access_token=${accessToken}`, { 
      method: 'POST',
      data: {
        body: comments 
      },  
      dataType: 'json',  
      contentType: 'json' // contentType一定要设为json，要不然会报错：Problems parsing JSON
    });

    if (status !== 201 && status !== 200) {
      return {
        status,
        message: 'Error'
      }
    }

    return {
      id: comment.id,
      content: comment.body,
      dateTime: comment.updated_at,
      user: comment.user.login,
      avatar: comment.user.avatar_url
    }

  }
}
module.exports = BlogService;