import axios from 'axios'
import { API_URL, HEADERS } from './server'

export const getAllNotifications = (subscriberId) => {
  return new Promise((resolve, reject) => {
    axios({
      headers: HEADERS,
      method: 'get',
      url: `${API_URL}/subscribers/${subscriberId}/notifications`
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

export const getArchivedNotifications = (subscriberId) => {
  return new Promise((resolve, reject) => {
    axios({
      headers: HEADERS,
      method: 'get',
      url: `${API_URL}/subscribers/${subscriberId}/notifications/archived`
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
