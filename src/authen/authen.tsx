import { Outlet, Navigate } from "react-router-dom"
import Login from "../pages/login/login"
import Notacess from "../components/permission/notacess"
import { DeviceStateStore, UtilsStateStore } from "../types/redux.type"
import { useSelector } from "react-redux"
import { logOut } from "./authFunc"

export function Islogout() {
  return (
    logOut() ? <Navigate to="/" /> : <Login />
  )
}

export function Hidesetting() {
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { userLevel } = cookieDecode
  return (
    userLevel === '3' ? <Notacess /> : <Outlet />
  )
}

export function HideFlashFW() {
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { userLevel } = cookieDecode
  return (
    userLevel !== '0' ? <Notacess /> : <Outlet />
  )
}