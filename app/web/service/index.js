import request from 'umi-request';
import Cookies from 'js-cookie'

export const getBlogList = async (params = {}) => {
  return request('/blog/list', {
    method: 'get',
    params
  })
}

export const postLike = async (content, id) => {
  return request(`/blog/like/${id}`, {
    method: 'post',
    headers: {
      // post请求需要设置x-csrf-token
      'x-csrf-token': Cookies.get('csrfToken')
    },
    data: {content}
  })
}

export const postComment = async (comments, id) => {
  return request(`/blog/comment/${id}`, {
    method: 'post',
    headers: {
      // post请求需要设置x-csrf-token
      'x-csrf-token': Cookies.get('csrfToken')
    },
    data: {comments}
  })
}

