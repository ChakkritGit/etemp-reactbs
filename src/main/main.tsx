import { Outlet } from "react-router-dom"
import Sidebar from "../components/navigation/sidebar"
import { SideParent, SideChild, SideChildOutlet, SideChildSide, HamburgerExpand } from "../style/style"
import Navbar from "../components/navigation/navbar"
import { MouseEventHandler, useEffect, useState } from "react"
import Offcanvas from 'react-bootstrap/Offcanvas'
import { Button } from "react-bootstrap"
import { RiMenuFoldLine } from "react-icons/ri"
import { jwtToken } from "../types/component.type"
import { jwtDecode } from "jwt-decode"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../types/redux.type"
import { setShowAside, setTokenDecode } from "../stores/utilsStateSlice"
import { fetchHospitals, fetchWards, filtersDevices } from "../stores/dataArraySlices"
import { storeDispatchType } from "../stores/store"
import { fetchDevicesLog } from "../stores/LogsSlice"
import { fetchDevicesData } from "../stores/devicesSlices"
import { fetchUserData } from "../stores/userSlice"
import { fetchProbeData } from "../stores/probeSlice"
import { Toaster } from "react-hot-toast"
import Bottombar from "../components/navigation/bottombar"
import { BottomNavigateWrapper } from "../style/components/bottom.navigate"

export default function Main() {
  const dispatch = useDispatch<storeDispatchType>()
  const { socketData, showAside, token, deviceId } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const handleClose = () => dispatch(setShowAside(false))
  const handleShow = () => dispatch(setShowAside(true))
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)


  const decodeToken = async () => {
    if (token) {
      const decoded: jwtToken = await jwtDecode(token)
      dispatch(setTokenDecode(decoded))
    }
  }

  useEffect(() => {
    decodeToken()
    dispatch(filtersDevices(token))
    dispatch(fetchHospitals(token))
    dispatch(fetchWards(token))
    dispatch(fetchUserData(token))
    dispatch(fetchProbeData(token))
  }, [])

  useEffect(() => {
    dispatch(fetchDevicesData(token))
  }, [socketData])

  useEffect(() => {
    if (deviceId !== "null") {
      dispatch(fetchDevicesLog(deviceId))
    }
  }, [deviceId])

  const handleContextMenu: MouseEventHandler<HTMLDivElement> = (_e) => {
    // e.preventDefault()
  }


  const handleScroll = () => {
    const currentScrollY = window.scrollY

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      // ถ้า scroll ลงและมากกว่า 50px ซ่อน navigation
      setIsScrollingDown(true)
    } else {
      // ถ้า scroll ขึ้น แสดง navigation
      setIsScrollingDown(false)
    }
    setLastScrollY(currentScrollY)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  return (
    <SideParent onContextMenu={handleContextMenu}>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
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
        <BottomNavigateWrapper $primary={isScrollingDown}>
          <Bottombar isScrollingDown={isScrollingDown} />
        </BottomNavigateWrapper>
      </SideParent>
    </SideParent>
  )
}
