import { RiArrowDropDownLine, RiLogoutBoxRLine } from "react-icons/ri"
import { LineHr, NavLogout, NavProfile, NavProfileContainer, NavProfileFlex } from "../../style/style"
import { Dropdown } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { NavbarProfileDropdown } from "../../style/components/navbar"
import { cookieOptions, cookies } from "../../constants/constants"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { storeDispatchType } from "../../stores/store"
import { setCookieEncode } from "../../stores/utilsStateSlice"
import { swalWithBootstrapButtons } from "../../components/dropdown/sweetalertLib"

export default function Navprofile() {
  const navigate = useNavigate()
  const dispatch = useDispatch<storeDispatchType>()
  const { t } = useTranslation()
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { userPicture, displayName, userLevel } = cookieDecode

  const logOut = () => {
    dispatch(setCookieEncode(''))
    cookies.remove('localDataObject', cookieOptions)
    cookies.remove('devSerial', cookieOptions)
    cookies.remove('devid', cookieOptions)
    cookies.remove('selectHos', cookieOptions)
    cookies.remove('selectWard', cookieOptions)
    cookies.update()
    navigate("/login")
  }

  return (
    <Dropdown>
      <Dropdown.Toggle variant="0" className="border-0 p-0">
        <NavProfileFlex>
          <NavProfileContainer className="profile-name-dark">
            <NavProfile src={userPicture !== undefined ? `${import.meta.env.VITE_APP_IMG}${userPicture}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`} alt="profile" />
            <span >{displayName}</span>
            <RiArrowDropDownLine />
          </NavProfileContainer>
        </NavProfileFlex>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <NavbarProfileDropdown>
          <NavProfileContainer onClick={() => navigate("/setting")}>
            <NavProfile src={userPicture !== undefined ? `${import.meta.env.VITE_APP_IMG}${userPicture}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`} alt="profile" />
            <div style={{ display: 'flex', flexDirection: 'column', width: '100px', maxWidth: '100px' }}>
              <span style={{ display: 'block', width: '100px', maxWidth: '100px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{displayName}</span>
              <strong style={{ width: '100px', maxWidth: '100px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{userLevel === "1" ? t('levelSuper') : userLevel === "2" ? t('levelService') : userLevel === "3" ? t('levelAdmin') : t('levelUser')}</strong>
            </div>
          </NavProfileContainer>
          <LineHr />
          <NavLogout onClick={() => swalWithBootstrapButtons
            .fire({
              title: t('logoutDialog'),
              text: t('logoutDialogText'),
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: t('confirmButton'),
              cancelButtonText: t('cancelButton'),
              reverseButtons: false,
            })
            .then((result) => {
              if (result.isConfirmed) {
                logOut()
              }
            })}>
            <RiLogoutBoxRLine />
            {t('tabLogout')}
          </NavLogout>
        </NavbarProfileDropdown>
      </Dropdown.Menu>
    </Dropdown>
  )
}
