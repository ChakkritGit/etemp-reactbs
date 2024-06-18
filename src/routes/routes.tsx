import ErrorPage from '../routes/error-page'
import Home from '../pages/home/home'
import Dashboard from '../pages/dashboard/dashboard'
import { Hidesetting, Islogout } from '../authen/authen'
import Main from "../../src/main/main"
import Setting from '../pages/setting/setting'
import Permission from '../pages/users/manageusers'
import Warranty from '../pages/warranty/warranty'
import Repair from '../pages/repair/repair'
import Contact from '../pages/contact/contact'
import { AuthRoute } from '../../src/authen/authen'
import {
  Routes,
  Route,
  BrowserRouter
} from "react-router-dom"
import { socket } from '../services/websocket'
import Fullchart from '../pages/dashboard/fullchart'
import Fulltable from '../pages/dashboard/fulltable'
import toast, { useToasterStore } from 'react-hot-toast'
import System from '../pages/system/system'
import Comparechart from '../pages/dashboard/compare.chart'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { storeDispatchType } from '../stores/store'
import { setSocketData } from '../stores/utilsStateSlice'
import { client } from '../services/mqtt'
import Log from '../pages/log/log'
import { socketResponseType } from '../types/component.type'
import { TabConnect } from '../style/style'
import { useTranslation } from 'react-i18next'
import { DeviceStateStore, UtilsStateStore } from '../types/redux.type'

export default function RoutesComponent() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const [status, setStatus] = useState(true)
  const { token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { toasts } = useToasterStore()
  const toastLimit = 5

  useEffect(() => {
    socket.on("connect", () => {
      setStatus(true)
    })

    socket.on("disconnect", (reason) => {
      setStatus(false)
      console.error("Disconnected from Socket server:", reason)
    })

    socket.on("error", (error) => {
      console.error("Socket error:", error)
    })

    socket.on("receive_message", (response: socketResponseType) => {
      dispatch(setSocketData(response))
    })
  }, [])

  useEffect(() => {
    try {
      client.on('connect', () => { })
      client.on('disconnect', () => { })
    } catch (error) {
      console.error("MQTT Error: ", error)
    }
  }, [])

  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= toastLimit) // Is toast index over limit?
      .forEach((t) => toast.dismiss(t.id)) // Dismiss – Use toast.remove(t.id) for no exit animation
  }, [toasts])

  return (
    <BrowserRouter>
      {/* <button onClick={() => socket.emit("send_message", {device: 'test', message: 'test', time: '14/06/2024'})}>send</button> */}
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path='/' element={<Main />}>
            <Route path='/' element={<Home />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route element={<Hidesetting />}>
              <Route path='permission' element={<Permission />} />
              <Route path='management' element={<Setting />} />
              <Route path='management/:id' element={<Setting />} />
            </Route>
            <Route path='warranty' element={<Warranty />} />
            <Route path='repair' element={<Repair />} />
            <Route path='contact' element={<Contact />} />
            <Route path='setting' element={<System />} />
            <Route path='dashboard/fullchart' element={<Fullchart />} />
            <Route path='dashboard/fulltable' element={<Fulltable />} />
            <Route path='dashboard/fullchart/compare' element={<Comparechart />} />
            <Route path='changeLog' element={<Log />} />
          </Route>
        </Route>
        <Route path='/login' element={<Islogout />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
      {
        token !== 'null' && <TabConnect $primary={status}>{status ? t('stateConnect') : t('stateDisconnect')}</TabConnect>
      }
    </BrowserRouter>
  )
}