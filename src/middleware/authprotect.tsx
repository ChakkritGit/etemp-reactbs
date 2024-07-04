import { ReactElement } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useSelector } from 'react-redux'
import { DeviceStateStore, UtilsStateStore } from '../types/redux.type'
import { jwtToken } from '../types/component.type'

type authProps = {
  children: ReactElement
}

const verifyToken = (token: string) => {
  try {
    const decoded: jwtToken = jwtDecode(token)
    if (decoded && decoded.userId) {
      return { valid: true, decoded }
    } else {
      localStorage.clear()
      return { valid: false, error: 'Token expired or invalid' }
    }
  } catch (error) {
    localStorage.clear()
    return { valid: false, error }
  }
}

const ProtectedRoute = ({ children }: authProps) => {
  const { token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { valid } = verifyToken(token)

  if (token) {
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
