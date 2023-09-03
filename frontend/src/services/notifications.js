import axios from 'axios'
import { API_URL, HEADERS } from './server'

export const getAllNotifications = (subscriberId, pageNum = 1, pageSize = 5) => {
  return new Promise((resolve, reject) => {
    axios({
      headers: HEADERS,
      method: 'get',
      url: `${API_URL}/subscribers/${subscriberId}/notifications?pageNum=${pageNum}&pageSize=${pageSize}`
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  })
}
export const getNotificationsUnreadCount = (subscriberId) => {
  return new Promise((resolve, reject) => {
    axios({
      headers: HEADERS,
      method: 'get',
      url: `${API_URL}/subscribers/${subscriberId}/notifications/countunread`
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  })
}

export const getArchivedNotifications = (subscriberId, pageNum = 1, pageSize = 5) => {
  return new Promise((resolve, reject) => {
    axios({
      headers: HEADERS,
      method: 'get',
      url: `${API_URL}/subscribers/${subscriberId}/notifications/archived?pageNum=${pageNum}&pageSize=${pageSize}`
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  })
}

export const markAllAsRead = (subscriberId) => {
  return new Promise((resolve, reject) => {
    axios({
      headers: HEADERS,
      method: 'patch',
      url: `${API_URL}/subscribers/${subscriberId}/notifications/markasread`
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  })
}

export const markAsRead = (subscriberId, notificationId) => {
  return new Promise((resolve, reject) => {
    axios({
      headers: HEADERS,
      method: 'patch',
      url: `${API_URL}/subscribers/${subscriberId}/notifications/${notificationId}/markasread`
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  })
}

export const markAsUnread = (subscriberId, notificationId) => {
  return new Promise((resolve, reject) => {
    axios({
      headers: HEADERS,
      method: 'patch',
      url: `${API_URL}/subscribers/${subscriberId}/notifications/${notificationId}/markasunread`
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  })
}

export const archiveNotification = (subscriberId, data) => {
  return new Promise((resolve, reject) => {
    axios({
      headers: HEADERS,
      method: 'put',
      url: `${API_URL}/subscribers/${subscriberId}/notifications/archive`,
      data
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  })
}

export const unArchiveNotification = (subscriberId, data) => {
  return new Promise((resolve, reject) => {
    axios({
      headers: HEADERS,
      method: 'put',
      url: `${API_URL}/subscribers/${subscriberId}/notifications/unarchive`,
      data
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  })
}

export const snoozeNotification = (subscriberId, data) => {
  return new Promise((resolve, reject) => {
    axios({
      headers: HEADERS,
      method: 'POST',
      url: `${API_URL}/subscribers/${subscriberId}/notifications/snooze`,
      data
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  })
}
