import {
  RiContactsBook2Fill, RiContactsBook2Line, RiDashboardFill, RiDashboardLine,
  RiFileSettingsFill, RiFileSettingsLine, RiHome3Fill, RiHome3Line,
  RiListSettingsFill, RiListSettingsLine, RiSettings3Fill, RiSettings3Line, RiShieldCheckFill,
  RiShieldCheckLine, RiUser6Fill, RiUser6Line
} from "react-icons/ri"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  HospitalName, Li, LineHr,
  MainMenuSide,
  SettingSystem,
  Sidebar, SidebarLogo, SpanAside, TooltipSpan, Ul
} from '../../style/style'
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { setCookieEncode, setShowAside } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"
import { AboutVersion } from "../../style/components/sidebar"
import { responseType } from "../../types/response.type"
import axios, { AxiosError } from "axios"
import { usersType } from "../../types/user.type"
import { accessToken, cookieOptions, cookies } from "../../constants/constants"

export default function sidebar() {
  const dispatch = useDispatch<storeDispatchType>()
  const { expand, tokenDecode, cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

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

  useEffect(() => {
    const changeFavicon = (href: string) => {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.type = 'image/png'
      link.rel = 'icon'
      link.href = href

      document.getElementsByTagName('head')[0].appendChild(link)
      document.title = cookieDecode.hosName + " | " + `${location.pathname.split("/")[1] !== '' ? location.pathname.split("/")[1] : 'home'}`
    }

    changeFavicon(`${import.meta.env.VITE_APP_IMG}${cookieDecode.hosImg}`)

    return () => {
      changeFavicon('logo.png')
    }
  }, [location, cookieDecode])

  const resetAsideandCardcount = () => {
    dispatch(setShowAside(false))
  }

  return (
    <Sidebar $primary={expand}>
      <Link to="/" onClick={resetAsideandCardcount} className="d-flex flex-column align-items-center mb-3 mb-md-0 link-dark text-decoration-none">
        <SidebarLogo
          $primary={expand}
          src={cookieDecode.hosImg !== 'null' ?
            `${import.meta.env.VITE_APP_IMG}${cookieDecode.hosImg}`
            :
            `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`} alt="hos-logo" />
        <HospitalName $primary={expand}>{cookieDecode.hosName}</HospitalName>
      </Link>
      <LineHr $primary />
      <Ul $primary={expand} $maxheight className="nav nav-pills">
        <MainMenuSide>
          <Li $primary={expand}>
            <Link to="/" onClick={resetAsideandCardcount} className={location.pathname === "/" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"} aria-current="page">
              {
                location.pathname === "/" ?
                  <RiHome3Fill />
                  :
                  <RiHome3Line />
              }
              <SpanAside $primary={expand}>
                {t('sideShowAllBox')}
              </SpanAside>
            </Link>
            <TooltipSpan $primary={expand}>
              {t('sideShowAllBox')}
            </TooltipSpan>
          </Li>
          <Li $primary={expand}>
            <Link to="/dashboard" onClick={resetAsideandCardcount} className={location.pathname === "/dashboard" || location.pathname === "/dashboard/fullchart" || location.pathname === "/dashboard/fulltable" || location.pathname === "/dashboard/fullchart/compare" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"}>
              {
                location.pathname === "/dashboard" || location.pathname === "/dashboard/fullchart" || location.pathname === "/dashboard/fulltable" || location.pathname === "/dashboard/fullchart/compare" ?
                  <RiDashboardFill />
                  :
                  <RiDashboardLine />
              }
              <SpanAside $primary={expand}>
                {t('sideDashboard')}
              </SpanAside>
            </Link>
            <TooltipSpan $primary={expand}>
              {t('sideDashboard')}
            </TooltipSpan>
          </Li>
          {
            cookieDecode.userLevel !== '3' ?
              <>
                <Li $primary={expand}>
                  <Link to="/permission" onClick={resetAsideandCardcount} className={location.pathname === "/permission" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"}>
                    {
                      location.pathname === "/permission" ?
                        <RiUser6Fill />
                        :
                        <RiUser6Line />
                    }
                    <SpanAside $primary={expand}>
                      {t('sidePermission')}
                    </SpanAside>
                  </Link>
                  <TooltipSpan $primary={expand}>
                    {t('sidePermission')}
                  </TooltipSpan>
                </Li>
                <Li $primary={expand}>
                  <Link to="/management" onClick={resetAsideandCardcount} className={location.pathname === "/management" || location.pathname === "/management/logadjust" || location.pathname === "/management/flasher" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"}>
                    {
                      location.pathname === "/management" || location.pathname === "/management/logadjust" || location.pathname === '/management/flasher' ?
                        <RiListSettingsFill />
                        :
                        <RiListSettingsLine />
                    }
                    <SpanAside $primary={expand}>
                      {t('sideManage')}
                    </SpanAside>
                  </Link>
                  <TooltipSpan $primary={expand}>
                    {t('sideManage')}
                  </TooltipSpan>
                </Li> </>
              :
              <></>
          }
        </MainMenuSide>
        <LineHr />
        <Li $primary={expand}>
          <Link to="/warranty" onClick={resetAsideandCardcount} className={location.pathname === "/warranty" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"}>
            {
              location.pathname === "/warranty" ?
                <RiShieldCheckFill />
                :
                <RiShieldCheckLine />
            }
            <SpanAside $primary={expand}>
              {t('sideWarranty')}
            </SpanAside>
          </Link>
          <TooltipSpan $primary={expand}>
            {t('sideWarranty')}
          </TooltipSpan>
        </Li>
        <Li $primary={expand}>
          <Link to="/repair" onClick={resetAsideandCardcount} className={location.pathname === "/repair" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"}>
            {
              location.pathname === "/repair" ?
                <RiFileSettingsFill />
                :
                <RiFileSettingsLine />
            }
            <SpanAside $primary={expand}>
              {t('sideRepair')}
            </SpanAside>
          </Link>
          <TooltipSpan $primary={expand}>
            {t('sideRepair')}
          </TooltipSpan>
        </Li>
      </Ul>
      <LineHr />
      <SettingSystem >
        <Ul className="nav nav-pills">
          <Li $primary={expand}>
            <Link to="/contact" onClick={resetAsideandCardcount} className={location.pathname === "/contact" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"}>
              {
                location.pathname === "/contact" ?
                  <RiContactsBook2Fill />
                  :
                  <RiContactsBook2Line />
              }
              <SpanAside $primary={expand}>
                {t('sideContact')}
              </SpanAside>
            </Link>
            <TooltipSpan $primary={expand}>
              {t('sideContact')}
            </TooltipSpan>
          </Li>
          <Li $primary={expand}>
            <Link to="/setting" onClick={resetAsideandCardcount} className={location.pathname === "/setting" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"}>
              {
                location.pathname === "/setting" ?
                  <RiSettings3Fill />
                  :
                  <RiSettings3Line />
              }
              <SpanAside $primary={expand}>
                {t('sideSetting')}
              </SpanAside>
            </Link>
            <TooltipSpan $primary={expand}>
              {t('sideSetting')}
            </TooltipSpan>
          </Li>
        </Ul>
      </SettingSystem>
      <AboutVersion $primary={expand} onClick={() => { navigate('/changeLog'); resetAsideandCardcount() }}>{import.meta.env.VITE_APP_VERSION}</AboutVersion>
    </Sidebar>
  )
}
