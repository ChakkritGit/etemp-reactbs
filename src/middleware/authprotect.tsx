import { ReactElement } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { DeviceStateStore, UtilsStateStore } from '../types/redux.type'
import { CookieType } from '../types/cookie.type'
import CryptoJS from "crypto-js"
import { cookies } from '../constants/constants'

type authProps = {
  children: ReactElement
}

const verifyToken = (cookieEncode: string) => {
  try {
    const decodeCookieObject = CryptoJS.AES.decrypt(cookieEncode, `${import.meta.env.VITE_APP_SECRETKEY}`)
    const cookieObject: CookieType = JSON.parse(decodeCookieObject.toString(CryptoJS.enc.Utf8))
    if (cookieObject.token) {
      return { valid: true, cookieObject }
    } else {
      localStorage.removeItem('token')
      cookies.remove('localDataObject')
      return { valid: false, error: 'Token expired or invalid' }
    }
  } catch (error) {
    localStorage.removeItem('token')
    cookies.remove('localDataObject')
    return { valid: false, error }
  }
}

const ProtectedRoute = ({ children }: authProps) => {
  const { cookieEncode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  if (cookieEncode) {
    const { valid } = verifyToken(cookieEncode)
    return valid ? children : <Navigate to="/login" />
  } else {
    return <Navigate to="/login" />
  }
}

export function AuthRoute() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  )
}
