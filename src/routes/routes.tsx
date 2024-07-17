import { HideFlashFW, Hidesetting, Islogout } from '../authen/authen'
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { socket } from '../services/websocket'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { storeDispatchType } from '../stores/store'
import { setCookieDecode, setSocketData } from '../stores/utilsStateSlice'
import { client } from '../services/mqtt'
import { socketResponseType } from '../types/component.type'
import { TabConnect } from '../style/style'
import { useTranslation } from 'react-i18next'
import { DeviceStateStore, UtilsStateStore } from '../types/redux.type'
import { AuthRoute } from '../middleware/authprotect'
import { CookieType } from '../types/cookie.type'
import toast, { useToasterStore } from 'react-hot-toast'
import ErrorPage from '../routes/error-page'
import Home from '../pages/home/home'
import Dashboard from '../pages/dashboard/dashboard'
import Main from "../../src/main/main"
import Setting from '../pages/setting/setting'
import Permission from '../pages/users/manageusers'
import Warranty from '../pages/warranty/warranty'
import Repair from '../pages/repair/repair'
import Contact from '../pages/contact/contact'
import Fullchart from '../pages/dashboard/fullchart'
import Fulltable from '../pages/dashboard/fulltable'
import System from '../pages/system/system'
import Comparechart from '../pages/dashboard/compare.chart'
import Log from '../pages/log/log'
import ESPToolComponent from '../pages/setting/devices/serial.port'
import CryptoJS from "crypto-js"
import { decodeCookieObject } from '../constants/constants'

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRoute />,
    children: [
      {
        path: "/",
        element: <Main />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            element: <Hidesetting />,
            children: [
              {
                path: "permission",
                element: <Permission />,
              },
              {
                path: "management",
                element: <Setting />,
              },
              {
                path: "management/:id",
                element: <Setting />,
              },
            ],
          },
          {
            path: "warranty",
            element: <Warranty />,
          },
          {
            path: "repair",
            element: <Repair />,
          },
          {
            path: "contact",
            element: <Contact />,
          },
          {
            path: "setting",
            element: <System />,
          },
          {
            path: "dashboard/fullchart",
            element: <Fullchart />,
          },
          {
            path: "dashboard/fulltable",
            element: <Fulltable />,
          },
          {
            path: "dashboard/fullchart/compare",
            element: <Comparechart />,
          },
          {
            path: "changeLog",
            element: <Log />,
          },
          {
            element: <HideFlashFW />,
            children: [
              {
                path: "management/flasher",
                element: <ESPToolComponent />,
              },
            ]
          }
        ],
      }
    ],
  },
  {
    path: "/login",
    element: <Islogout />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
])

export default function RoutesComponent() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const [status, setStatus] = useState(true)
  const { cookieEncode, cookieDecode, tokenDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const { userLevel, hosId } = tokenDecode
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
      if (!userLevel && !hosId) return
      if (userLevel === "0" || userLevel === "1") {
        dispatch(setSocketData(response))
      } else if (hosId === response.hospital) {
        dispatch(setSocketData(response))
      }
    })
  }, [userLevel, hosId])

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
      .filter((toasts) => toasts.visible) // Only consider visible toasts
      .filter((_, index) => index >= toastLimit) // Is toast index over limit?
      .forEach((toasts) => toast.dismiss(toasts.id)) // Dismiss – Use toast.remove(t.id) for no exit animation
  }, [toasts])

  useEffect(() => {
    if (!cookieEncode) return
    try {
      const CookieObject: CookieType = JSON.parse(decodeCookieObject(cookieEncode).toString(CryptoJS.enc.Utf8))
      dispatch(setCookieDecode(CookieObject))
    } catch (error) {
      console.error('Decoded error: ', error)
    }
  }, [cookieEncode])

  return (
    <>
      <RouterProvider router={router} />
      <TabConnect $primary={status} $show={token !== 'null'}>{status ? t('stateConnect') : t('stateDisconnect')}</TabConnect>
    </>
  )
}