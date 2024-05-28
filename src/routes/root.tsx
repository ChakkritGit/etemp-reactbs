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
import { Toaster } from 'react-hot-toast'
import System from '../pages/system/system'
import Comparechart from '../pages/dashboard/compare.chart'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { storeDispatchType } from '../stores/store'
import { setSocketData } from '../stores/utilsStateSlice'

export default function Root() {
  const dispatch = useDispatch<storeDispatchType>()

  useEffect(() => {
    try {
      socket.on("connect", () => {
        console.log("Connected to Socket.io server")
        dispatch(setSocketData("Connected to Socket.io server"))
      })

      socket.on("send_cmd", (response: any) => {
        console.log("Response from Socket.io:", response)
        dispatch(setSocketData(response))
      })

      socket.on("disconnect", (reason) => {
        console.error("Disconnected from Socket.io server:", reason)
        dispatch(setSocketData(reason))
      })

      socket.on("error", (error) => {
        console.error("Socket.io error:", error)
        dispatch(setSocketData(error))
      })
    } catch (error) {
      console.error("Failed to connect to Socket.io server:", error)
      dispatch(setSocketData(error as string))
    }
  }, [])


  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path='/' element={<Main />}>
            <Route path='/' element={<Home />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route element={<Hidesetting />}>
              <Route path='permission' element={<Permission />} />
              <Route path='management' element={<Setting />} />
            </Route>
            <Route path='warranty' element={<Warranty />} />
            <Route path='repair' element={<Repair />} />
            <Route path='contact' element={<Contact />} />
            <Route path='setting' element={<System />} />
            <Route path='dashboard/fullchart' element={<Fullchart />} />
            <Route path='dashboard/fulltable' element={<Fulltable />} />
            <Route path='dashboard/fullchart/compare' element={<Comparechart />} />
          </Route>
        </Route>
        <Route path='/login' element={<Islogout />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}