import { getRealmHeader } from "../utils.js"
export const BASE_URL = process.env.SERVER_BASE_URL
export const HEADERS = {
    "x-realm": getRealmHeader()
}
