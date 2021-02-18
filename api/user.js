// import request from '../utils/request'
import { request } from '@/plugins/request'

export const login = data => request({
  method: 'POST',
  url: '/api/users/login',
  data: data
})

export const register = data => request({
  method: 'POST',
  url: '/api/users',
  data: data
})

// 关注用户
export const follow = username => request({
  method: 'POST',
  url: `/api/profiles/${username}/follow`
})

// 取消关注用户
export const unfollow = username => request({
  method: 'DELETE',
  url: `/api/profiles/${username}/follow`
})

// 获取用户资料
export const getProfile = username => request({
  method: 'GET',
  url: `/api/profiles/${username}`
})

// 获取当前用户
export const getCurrUser = () => request({
  method: 'GET',
  url: '/api/user'
})

// 更新用户信息
export const updateUser = data => request({
  method: 'PUT',
  url: '/api/user',
  data
})