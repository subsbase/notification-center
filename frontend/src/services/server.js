import { getRealmHeader } from '../utils.js'
export const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL
export const HEADERS = {
  'x-realm': getRealmHeader()
}
