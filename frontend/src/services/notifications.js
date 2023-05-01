import axios from "axios"
import { BASE_URL } from "./server"

export const getAllNotifications = (subscriberId) => {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${BASE_URL}notifc/subscribers/${subscriberId}/notifications`
      })
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
}

export const markAllAsRead = (subscriberId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "patch",
      url: `${BASE_URL}notifc/subscribers/${subscriberId}/notifications/markasread`
    })
      .then(res => resolve(res.data))
      .catch(err => reject(err))
  })
}

export const markAsRead = (subscriberId, notificationId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "patch",
      url: `${BASE_URL}notifc/subscribers/${subscriberId}/notification/${notificationId}/markasread`
    })
      .then(res => resolve(res.data))
      .catch(err => reject(err))
  })
}

export const archiveNotification = (subscriberId, data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "put",
      url: `${BASE_URL}notifc/subscribers/${subscriberId}/notifications/archive`,
      data
    })
      .then(res => resolve(res.data))
      .catch(err => reject(err))
  })
}