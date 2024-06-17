import { RiDashboardFill, RiDashboardLine, RiHome3Fill, RiHome3Line, RiListSettingsFill, RiListSettingsLine, RiUser6Fill, RiUser6Line } from "react-icons/ri"
import { ActiveNavBlur, NavigationBottom, NavigationItems } from "../../style/components/bottom.navigate"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { NavProfile } from "../../style/style"
import { userlevel } from "../../authen/authentFunc"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { responseType } from "../../types/response.type"
import { usersType } from "../../types/user.type"
import axios, { AxiosError } from "axios"

interface BottombarProps {
  isScrollingDown: boolean
}

export default function Bottombar({ isScrollingDown }: BottombarProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { tokenDecode, token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)

  const reFetchdata = async () => {
    if (tokenDecode.userId !== undefined) {
      try {
        const response = await axios
          .get<responseType<usersType>>(`${import.meta.env.VITE_APP_API}/user/${tokenDecode.userId}`, { headers: { authorization: `Bearer ${token}` } })
        const { displayName, userId, userLevel, userPic, ward } = response.data.data
        localStorage.setItem("userid", userId)
        localStorage.setItem("hosid", ward.hosId)
        localStorage.setItem("displayname", displayName)
        localStorage.setItem("userpicture", userPic)
        localStorage.setItem("userlevel", userLevel)
        localStorage.setItem("hosimg", ward.hospital.hosPic)
        localStorage.setItem("hosname", ward.hospital.hosName)
        localStorage.setItem("groupid", ward.hosId)
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error.response?.data.message)
        } else {
          console.error('Unknown Error')
        }
      }
    }
  }

  useEffect(() => {
    reFetchdata()
    window.scrollTo(0, 0)
  }, [location])

  return (
    <NavigationBottom $primary={isScrollingDown}>
      <NavigationItems $primary={location.pathname === "/"} onClick={() => navigate('/')}>
        {
          location.pathname === "/" ?
            <RiHome3Fill />
            :
            <RiHome3Line />
        }
        <span>{t('sideShowAllBox')}</span>
        <ActiveNavBlur $primary={location.pathname === "/"} />
      </NavigationItems>
      <NavigationItems $primary={location.pathname === "/dashboard" || location.pathname === "/dashboard/fullchart" || location.pathname === "/dashboard/fulltable" || location.pathname === "/dashboard/fullchart/compare"} onClick={() => navigate('/dashboard')}>
        {
          location.pathname === "/dashboard" || location.pathname === "/dashboard/fullchart" || location.pathname === "/dashboard/fulltable" || location.pathname === "/dashboard/fullchart/compare" ?
            <RiDashboardFill />
            :
            <RiDashboardLine />
        }
        <span>{t('sideDashboard')}</span>
        <ActiveNavBlur $primary={location.pathname === "/dashboard" || location.pathname === "/dashboard/fullchart" || location.pathname === "/dashboard/fulltable" || location.pathname === "/dashboard/fullchart/compare"} />
      </NavigationItems>
      {
        userlevel() !== '4' ?
          <>
            <NavigationItems $primary={location.pathname === "/permission"} onClick={() => navigate('/permission')}>
              {
                location.pathname === "/permission" ?
                  <RiUser6Fill />
                  :
                  <RiUser6Line />
              }
              <span>{t('sidePermission')}</span>
              <ActiveNavBlur $primary={location.pathname === "/permission"} />
            </NavigationItems>
            <NavigationItems $primary={location.pathname === "/management"} onClick={() => navigate('/management')}>
              {
                location.pathname === "/management" || location.pathname === "/management/logadjust" ?
                  <RiListSettingsFill />
                  :
                  <RiListSettingsLine />
              }
              <span>{t('sideManage')}</span>
              <ActiveNavBlur $primary={location.pathname === "/management" || location.pathname === "/management/logadjust"} />
            </NavigationItems>
          </>
          :
          <></>
      }
      <NavigationItems $primary={location.pathname === "/setting"} onClick={() => navigate('/setting')}>
        <NavProfile $primary src={localStorage.getItem('userpicture') !== 'null' ? `${import.meta.env.VITE_APP_IMG}${localStorage.getItem("userpicture")}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`} alt="profile" />
        <span>{t('tabAccount')}</span>
        <ActiveNavBlur $primary={location.pathname === "/setting"} />
      </NavigationItems>
    </NavigationBottom>
  )
}
