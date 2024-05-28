import { Outlet } from "react-router-dom"
import Sidebar from "../components/navigation/sidebar"
import { SideParent, SideChild, SideChildOutlet, SideChildSide, HamburgerExpand } from "../style/style"
import Navbar from "../components/navigation/navbar"
import { MouseEventHandler, useEffect } from "react"
import Offcanvas from 'react-bootstrap/Offcanvas'
import { Button } from "react-bootstrap"
import { RiMenuFoldLine } from "react-icons/ri"
import { jwtToken } from "../types/component.type" 
import { jwtDecode } from "jwt-decode"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../types/redux.type"
import { setCount, setShowAside, setTokenDecode } from "../stores/utilsStateSlice"
import { fetchHospitals, fetchWards, filtersDevices } from "../stores/dataArraySlices"
import { storeDispatchType } from "../stores/store"
import { fetchDevicesLog } from "../stores/LogsSlice"
import { fetchDevicesData } from "../stores/devicesSlices"
import { fetchUserData } from "../stores/userSlice"
import { fetchProbeData } from "../stores/probeSlice"

export default function Main() {
  const dispatch = useDispatch<storeDispatchType>()
  const { socketData, showAside, token, deviceId } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const handleClose = () => dispatch(setShowAside(false))
  const handleShow = () => dispatch(setShowAside(true))

  const decodeToken = async () => {
    if (token) {
      const decoded: jwtToken = await jwtDecode(token)
      dispatch(setTokenDecode(decoded))
    }
  }

  useEffect(() => {
    decodeToken()
    dispatch(setCount({
      probe: 0,
      door: 0,
      connect: 0,
      ac: 0,
      sd: 0,
      adjust: 0,
      repair: 0,
      warranty: 0
    }))
    dispatch(filtersDevices(token))
    dispatch(fetchHospitals(token))
    dispatch(fetchWards(token))
    dispatch(fetchDevicesData(token))
    dispatch(fetchUserData(token))
    dispatch(fetchProbeData(token))
  }, [socketData])

  useEffect(() => {
    dispatch(fetchDevicesLog(deviceId))
  }, [deviceId])

  const handleContextMenu: MouseEventHandler<HTMLDivElement> = (_e) => {
    // e.preventDefault()
  }

  return (
    <SideParent onContextMenu={handleContextMenu}>
      <SideChildSide $primary>
        <Sidebar />
      </SideChildSide>
      <Offcanvas show={showAside} onHide={handleClose} >
        <HamburgerExpand $primary={false}>
          <Button onClick={handleClose}>
            <RiMenuFoldLine />
          </Button>
        </HamburgerExpand>
        <Sidebar />
      </Offcanvas>
      <SideParent $primary>
        <SideChild>
          <Navbar handleShow={handleShow} />
        </SideChild>
        <SideChildOutlet>
          <Outlet />
        </SideChildOutlet>
      </SideParent>
    </SideParent>
  )
}
