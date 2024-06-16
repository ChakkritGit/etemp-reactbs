import { RiDashboardFill, RiDashboardLine, RiHome3Fill, RiHome3Line, RiListSettingsFill, RiListSettingsLine, RiUser6Fill, RiUser6Line } from "react-icons/ri";
import { ActiveNavBlur, NavigationBottom, NavigationItems } from "../../style/components/bottom.navigate";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavProfile } from "../../style/style";
import { userlevel } from "../../authen/authentFunc";

export default function Bottombar() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <NavigationBottom>
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
