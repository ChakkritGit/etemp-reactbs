import {
  RiContactsBook2Fill, RiContactsBook2Line, RiDashboardFill, RiDashboardLine,
  RiFileSettingsFill, RiFileSettingsLine, RiHome3Fill, RiHome3Line,
  RiListSettingsFill, RiListSettingsLine, RiSettings3Fill, RiSettings3Line, RiShieldCheckFill,
  RiShieldCheckLine, RiUser6Fill, RiUser6Line
} from "react-icons/ri"
import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  HospitalName, Li, LineHr,
  SettingSystem,
  Sidebar, SidebarLogo, SpanAside, TooltipSpan, Ul
} from '../../style/style'
import { useEffect } from "react"
import { userlevel } from "../../authen/authentFunc"
import axios, { AxiosError } from "axios"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { setCount, setShowAside } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"
import { responseType } from "../../types/response.type"
import { usersType } from "../../types/user.type"
import { AboutVersion } from "../../style/components/sidebar"

export default function sidebar() {
  const dispatch = useDispatch<storeDispatchType>()
  const { expand, token, tokenDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { t } = useTranslation()
  // const navigate = useNavigate()
  const location = useLocation()

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
        // if (userStatus) {
        //   localStorage.removeItem("hosimg")
        //   localStorage.removeItem("userpicture")
        //   localStorage.removeItem("hosname")
        //   localStorage.removeItem("userlevel")
        //   localStorage.removeItem("groupid")
        //   localStorage.removeItem("userid")
        //   localStorage.removeItem("displayname")
        //   localStorage.removeItem("hosid")
        //   localStorage.removeItem("token")
        //   return navigate("/login")
        // } else {
        //   localStorage.setItem("userid", userId)
        //   localStorage.setItem("hosid", ward.hosId)
        //   localStorage.setItem("displayname", displayName)
        //   localStorage.setItem("userpicture", userPic)
        //   localStorage.setItem("userlevel", userLevel)
        //   localStorage.setItem("hosimg", ward.hospital.hosPic)
        //   localStorage.setItem("hosname", ward.hospital.hosName)
        //   localStorage.setItem("groupid", ward.hosId)
        // }
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
  }, [tokenDecode, location])

  useEffect(() => {
    const changeFavicon = (href: string) => {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.type = 'image/jpg'
      link.rel = 'icon'
      link.href = href

      document.getElementsByTagName('head')[0].appendChild(link)
      document.title = localStorage.getItem("hosname") as string + " | " + `${location.pathname.split("/")[1] !== '' ? location.pathname.split("/")[1] : 'home'}`
    }

    changeFavicon(`${import.meta.env.VITE_APP_IMG}${localStorage.getItem("hosimg")}`)

    return () => {
      changeFavicon('/Thanes.png')
    }
  }, [location])

  const resetAsideandCardcount = () => {
    dispatch(setShowAside(false))
    location.pathname !== '/' && dispatch(setCount({
      probe: 0,
      door: 0,
      connect: 0,
      ac: 0,
      sd: 0,
      adjust: 0,
      repair: 0,
      warranty: 0
    }))
  }

  return (
    <>
      <Sidebar $primary={expand}>
        <Link to="/" onClick={resetAsideandCardcount} className="d-flex flex-column align-items-center mb-3 mb-md-0 link-dark text-decoration-none">
          <SidebarLogo
            $primary={expand}
            src={localStorage.getItem('hosimg') !== 'null' ?
              `${import.meta.env.VITE_APP_IMG}${localStorage.getItem("hosimg")}`
              :
              `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`} alt="hos-logo" />
          <HospitalName $primary={expand}>{localStorage.getItem('hosname')}</HospitalName>
        </Link>
        <LineHr />
        <Ul $primary={expand} $maxheight className="nav nav-pills">
          <Li $primary={expand}>
            <Link to="/" onClick={resetAsideandCardcount} className={location.pathname === "/" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"} aria-current="page">
              {
                location.pathname === "/" ?
                  <RiHome3Fill />
                  :
                  <RiHome3Line />
              }
              <SpanAside $primary={expand}>
                {t('show_all_etemp')}
              </SpanAside>
            </Link>
            <TooltipSpan $primary={expand}>
              {t('show_all_etemp')}
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
                {t('dashboard')}
              </SpanAside>
            </Link>
            <TooltipSpan $primary={expand}>
              {t('dashboard')}
            </TooltipSpan>
          </Li>
          {
            userlevel() !== '4' ?
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
                      {t('permission')}
                    </SpanAside>
                  </Link>
                  <TooltipSpan $primary={expand}>
                    {t('permission')}
                  </TooltipSpan>
                </Li>
                <Li $primary={expand}>
                  <Link to="/management" onClick={resetAsideandCardcount} className={location.pathname === "/management" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"}>
                    {
                      location.pathname === "/management" ?
                        <RiListSettingsFill />
                        :
                        <RiListSettingsLine />
                    }
                    <SpanAside $primary={expand}>
                      {t('setting')}
                    </SpanAside>
                  </Link>
                  <TooltipSpan $primary={expand}>
                    {t('setting')}
                  </TooltipSpan>
                </Li> </>
              :
              <></>
          }
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
                {t('warranty')}
              </SpanAside>
            </Link>
            <TooltipSpan $primary={expand}>
              {t('warranty')}
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
                {t('repair')}
              </SpanAside>
            </Link>
            <TooltipSpan $primary={expand}>
              {t('repair')}
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
                  {t('contact')}
                </SpanAside>
              </Link>
              <TooltipSpan $primary={expand}>
                {t('contact')}
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
                  {t('systemsetting')}
                </SpanAside>
              </Link>
              <TooltipSpan $primary={expand}>
                {t('systemsetting')}
              </TooltipSpan>
            </Li>
          </Ul>
        </SettingSystem>
        <AboutVersion $primary={expand}>{import.meta.env.VITE_APP_VERSION}</AboutVersion>
      </Sidebar>
    </>
  )
}
