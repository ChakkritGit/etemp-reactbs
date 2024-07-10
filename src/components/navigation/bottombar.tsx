import { RiDashboardFill, RiDashboardLine, RiHome3Fill, RiHome3Line, RiListSettingsFill, RiListSettingsLine, RiUser6Fill, RiUser6Line } from "react-icons/ri"
import { ActiveNavBlur, NavigationBottom, NavigationItems } from "../../style/components/bottom.navigate"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { NavProfile } from "../../style/style"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { responseType } from "../../types/response.type"
import { usersType } from "../../types/user.type"
import { accessToken, cookieOptions, cookies } from "../../constants/constants"
import { storeDispatchType } from "../../stores/store"
import { setCookieEncode } from "../../stores/utilsStateSlice"
import axios, { AxiosError } from "axios"

interface BottombarProps {
  isScrollingDown: boolean
}

export default function Bottombar({ isScrollingDown }: BottombarProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const dispatch = useDispatch<storeDispatchType>()
  const navigate = useNavigate()
  const { tokenDecode, cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token, userPicture } = cookieDecode

  const reFetchdata = async () => {
    if (tokenDecode.userId !== undefined) {
      try {
        const response = await axios
          .get<responseType<usersType>>(`${import.meta.env.VITE_APP_API}/user/${tokenDecode.userId}`, { headers: { authorization: `Bearer ${token}` } })
        const { displayName, userId, userLevel, userPic, ward, wardId } = response.data.data
        const { hosId, hospital } = ward
        const { hosPic, hosName } = hospital
        const localDataObject = {
          userId: userId,
          hosId: hosId,
          displayName: displayName,
          userPicture: userPic,
          userLevel: userLevel,
          hosImg: hosPic,
          hosName: hosName,
          groupId: wardId,
          token: token
        }
        cookies.set('localDataObject', String(accessToken(localDataObject)), cookieOptions)
        dispatch(setCookieEncode(String(accessToken(localDataObject))))
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
    if (location.pathname !== '/login') {
      reFetchdata()
      window.scrollTo(0, 0)
    }
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
        cookieDecode.userLevel !== '3' ?
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
            <NavigationItems $primary={location.pathname === "/management" || location.pathname === '/management/flasher'} onClick={() => navigate('/management')}>
              {
                location.pathname === "/management" || location.pathname === "/management/logadjust" || location.pathname === '/management/flasher' ?
                  <RiListSettingsFill />
                  :
                  <RiListSettingsLine />
              }
              <span>{t('sideManage')}</span>
              <ActiveNavBlur $primary={location.pathname === "/management" || location.pathname === "/management/logadjust" || location.pathname === '/management/flasher'} />
            </NavigationItems>
          </>
          :
          <></>
      }
      <NavigationItems $primary={location.pathname === "/setting"} onClick={() => navigate('/setting')}>
        <NavProfile $primary src={userPicture !== 'null' ? `${import.meta.env.VITE_APP_IMG}${userPicture}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`} alt="profile" />
        <span>{t('tabAccount')}</span>
        <ActiveNavBlur $primary={location.pathname === "/setting"} />
      </NavigationItems>
    </NavigationBottom>
  )
}
