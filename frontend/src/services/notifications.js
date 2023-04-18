import axios from "axios"
import { BASE_URL } from "./server"

export const getCreditLine = (subscriberId) => {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${BASE_URL}notifc/subscribers/${subscriberId}/notifications`
      })
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }