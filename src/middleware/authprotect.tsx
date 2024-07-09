import { ReactElement } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DeviceStateStore, UtilsStateStore } from '../types/redux.type'
import { CookieType } from '../types/cookie.type'
import { cookieOptions, cookies, decodeCookieObject } from '../constants/constants'
import CryptoJS from "crypto-js"
import { setCookieEncode } from '../stores/utilsStateSlice'
import { storeDispatchType } from '../stores/store'

type authProps = {
  children: ReactElement
}

const verifyToken = (cookieEncode: string) => {
  const dispatch = useDispatch<storeDispatchType>()
  try {
    const cookieObject: CookieType = JSON.parse(decodeCookieObject(cookieEncode).toString(CryptoJS.enc.Utf8))
    if (cookieObject.token) {
      return { valid: true, cookieObject }
    } else {
      cookies.remove('localDataObject', cookieOptions)
      localStorage.removeItem('token')
      dispatch(setCookieEncode(''))
      return { valid: false, error: 'Token expired or invalid' }
    }
  } catch (error) {
    cookies.remove('localDataObject', cookieOptions)
    localStorage.removeItem('token')
    dispatch(setCookieEncode(''))
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
