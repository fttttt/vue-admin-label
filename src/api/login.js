import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/labelservice/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/labelservice/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/labelservice/user/logout',
    method: 'post'
  })
}
