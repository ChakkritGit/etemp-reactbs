import { CookieType } from "../types/cookie.type"
import Cookies, { CookieSetOptions } from "universal-cookie"
import CryptoJS from "crypto-js"

export const getDateNow = () => {
  let date = new Date()
  let year = date.getFullYear()
  let month = ("0" + (date.getMonth() + 1)).slice(-2)
  let day = ("0" + date.getDate()).slice(-2)
  return String(year + '-' + month + '-' + day)
}

export const resetActive = {
  probe: false,
  door: false,
  connect: false,
  plug: false,
  sd: false,
  adjust: false,
  repair: false,
  warranty: false
}

export const cookies = new Cookies()

export const accessToken = (localDataObject: CookieType) => CryptoJS.AES.encrypt(JSON.stringify(localDataObject), `${import.meta.env.VITE_APP_SECRETKEY}`)
export const decodeCookieObject = (cookieEncode: string) => CryptoJS.AES.decrypt(cookieEncode, `${import.meta.env.VITE_APP_SECRETKEY}`)

const expiresDate = () => {
  // ตั้งค่า cookies พร้อม expiration date ที่ไกลในอนาคต
  const expirationDate = new Date()
  return expirationDate.setFullYear(expirationDate.getFullYear() + 100) // 100 ปีนับจากวันนี้
}

export const cookieOptions: CookieSetOptions = {
  path: '/',
  expires: new Date(expiresDate()), // 100 ปีนับจากวันนี้
  maxAge: Number(import.meta.env.VITE_APP_MAXAGE * 365 * 24 * 60 * 60),
  domain: import.meta.env.VITE_APP_NODE_ENV === 'development' ? 'localhost' : import.meta.env.VITE_APP_DOMAIN, // ถ้าไม่ต้องการใช้ domain ให้คอมเมนต์หรือเอาบรรทัดนี้ออก
  secure: true, // ใช้ secure cookies เฉพาะเมื่อทำงานบน HTTPS
  httpOnly: false, // กำหนดเป็น true ถ้าต้องการให้ cookies สามารถเข้าถึงได้จากเซิร์ฟเวอร์เท่านั้น
  sameSite: true // ตัวเลือก 'strict', 'lax', หรือ 'none'
}
