import { Outlet, Navigate } from "react-router-dom"
import { getUser } from "./authentFunc"
import Login from "../pages/login/login"
import { getLogin } from "./authentFunc"
import Notacess from "../components/permission/notacess"
import { DeviceStateStore, UtilsStateStore } from "../types/redux.type"
import { useSelector } from "react-redux"

export function AuthRoute() {
  return (
    getUser() ? <Outlet /> : <Navigate to="/login" />
  )
}

export function Islogout() {
  return (
    getLogin() ? <Navigate to="/" /> : <Login />
  )
}

export function Hidesetting() {
  const { tokenDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { userLevel } = tokenDecode
  return (
    userLevel === '4' ? <Notacess /> : <Outlet />
  )
}