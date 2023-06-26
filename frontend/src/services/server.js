import { getRealmHeader } from '../utils.js'
import { getServerUrl } from '../utils.js'
export const BASE_URL = getServerUrl()
export const API_URL = BASE_URL + '/notifc'
export const HEADERS = {
  'x-realm': getRealmHeader()
}
