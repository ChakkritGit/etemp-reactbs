import { RiArrowDropDownLine, RiLogoutBoxRLine } from "react-icons/ri"
import { LineHr, NavLogout, NavProfile, NavProfileContainer, NavProfileFlex } from "../../style/style"
import { Dropdown } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { NavbarProfileDropdown } from "../../style/components/navbar"
import { cookies } from "../../constants/constants"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"

export default function Navprofile() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)

  const logOut = (action: boolean) => {
    if (action === true) {
      cookies.remove('localDataObject')
      localStorage.removeItem('token')
      navigate("/login")
    }
  }
  return (
    <Dropdown>
      <Dropdown.Toggle variant="0" className="border-0 p-0">
        <NavProfileFlex>
          <NavProfileContainer className="profile-name-dark">
            <NavProfile src={cookieDecode.userPicture !== 'null' ? `${import.meta.env.VITE_APP_IMG}${cookieDecode.userPicture}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`} alt="profile" />
            <span >{cookieDecode.displayName}</span>
            <RiArrowDropDownLine />
          </NavProfileContainer>
        </NavProfileFlex>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <NavbarProfileDropdown>
          <NavProfileContainer onClick={() => navigate("/setting")}>
            <NavProfile src={cookieDecode.userPicture !== 'null' ? `${import.meta.env.VITE_APP_IMG}${cookieDecode.userPicture}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`} alt="profile" />
            <div style={{ display: 'flex', flexDirection: 'column', width: '100px', maxWidth: '100px' }}>
              <span style={{ display: 'block', width: '100px', maxWidth: '100px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{cookieDecode.displayName}</span>
              <strong style={{ width: '100px', maxWidth: '100px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{cookieDecode.userLevel === "1" ? t('levelSuper') : cookieDecode.userLevel === "2" ? t('levelService') : cookieDecode.userLevel === "3" ? t('levelAdmin') : t('levelUser')}</strong>
            </div>
          </NavProfileContainer>
          <LineHr />
          <NavLogout onClick={() => logOut(true)}>
            <RiLogoutBoxRLine />
            {t('tabLogout')}
          </NavLogout>
        </NavbarProfileDropdown>
      </Dropdown.Menu>
    </Dropdown>
  )
}
