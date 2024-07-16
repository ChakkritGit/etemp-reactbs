import { ReactElement, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DeviceStateStore, UtilsStateStore } from '../types/redux.type'
import { CookieType } from '../types/cookie.type'
import { cookieOptions, cookies, decodeCookieObject } from '../constants/constants'
import CryptoJS from "crypto-js"
import { setCookieEncode } from '../stores/utilsStateSlice'
import { storeDispatchType } from '../stores/store'
import { reset } from '../stores/resetAction'

type AuthProps = {
  children: ReactElement
}

const ProtectedRoute = ({ children }: AuthProps) => {
  const dispatch = useDispatch<storeDispatchType>()
  const { cookieEncode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  useEffect(() => {
    const verifyToken = async (cookieEncode: string) => {
      try {
        const cookieObject: CookieType = JSON.parse(decodeCookieObject(cookieEncode).toString(CryptoJS.enc.Utf8))
        if (cookieObject.token) {
          setIsValid(true)
        } else {
          cookies.remove('localDataObject', cookieOptions)
          cookies.remove('devSerial', cookieOptions)
          cookies.remove('devid', cookieOptions)
          cookies.remove('selectHos', cookieOptions)
          cookies.remove('selectWard', cookieOptions)
          cookies.update()
          dispatch(reset())
          dispatch(setCookieEncode(''))
          setIsValid(false)
        }
      } catch (error) {
        cookies.remove('localDataObject', cookieOptions)
        cookies.remove('devSerial', cookieOptions)
        cookies.remove('devid', cookieOptions)
        cookies.remove('selectHos', cookieOptions)
        cookies.remove('selectWard', cookieOptions)
        cookies.update()
        dispatch(reset())
        dispatch(setCookieEncode(''))
        setIsValid(false)
      }
    }

    if (cookieEncode !== '') {
      verifyToken(cookieEncode)
    } else {
      setIsValid(false)
    }
  }, [cookieEncode, dispatch])

  if (isValid === null) {
    return null // Or a loading spinner
  }

  return isValid ? children : <Navigate to="/login" />
}

export function AuthRoute() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  )
}
