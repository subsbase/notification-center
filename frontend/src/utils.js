export const getSubscriberId = () => {
  let url = new URL(window.location)
  let params = new URLSearchParams(url.search)
  return params.get('subscriberId')
}

export const getThemeId = () => {
  let url = new URL(window.location)
  let params = new URLSearchParams(url.search)
  return '#' + params.get('themeID')
}

export const getRealmHeader = () => {
  let url = new URL(window.location)
  let params = new URLSearchParams(url.search)
  return params.get('realmHeader')
}

export const getNotificationsPageURL = () => {
  let url = new URL(window.location)
  let params = new URLSearchParams(url.search)
  return params.get('allNotifications')
}

export const getServerUrl = () => {
  let url = new URL(window.location)
  let params = new URLSearchParams(url.search)
  return params.get('serverUrl')
}
