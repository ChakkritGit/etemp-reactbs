import { RiArrowDropDownLine, RiLogoutBoxRLine } from "react-icons/ri"
import { LineHr, NavLogout, NavProfile, NavProfileContainer, NavProfileFlex } from "../../style/style"
import { Dropdown } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { NavbarProfileDropdown } from "../../style/components/navbar"

export default function Navprofile() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const logOut = (action: boolean) => {
    if (action === true) {
      localStorage.removeItem("hosimg")
      localStorage.removeItem("userpicture")
      localStorage.removeItem("hosname")
      localStorage.removeItem("userlevel")
      localStorage.removeItem("groupid")
      localStorage.removeItem("userid")
      localStorage.removeItem("displayname")
      localStorage.removeItem("hosid")
      localStorage.removeItem("token")
      navigate("/login")
    }
  }
  return (
    <Dropdown>
      <Dropdown.Toggle variant="0" className="border-0 p-0">
        <NavProfileFlex>
          <NavProfileContainer className="profile-name-dark">
            <NavProfile src={localStorage.getItem('userpicture') !== 'null' ? `${import.meta.env.VITE_APP_IMG}${localStorage.getItem("userpicture")}` : 'https://test.thanespgm.com/img/default-pic.png'} alt="profile" />
            <span >{localStorage.getItem("displayname")}</span>
            <RiArrowDropDownLine />
          </NavProfileContainer>
        </NavProfileFlex>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <NavbarProfileDropdown>
          <NavProfileContainer onClick={() => navigate("/setting")}>
            <NavProfile src={localStorage.getItem('userpicture') !== 'null' ? `${import.meta.env.VITE_APP_IMG}${localStorage.getItem("userpicture")}` : 'https://test.thanespgm.com/img/default-pic.png'} alt="profile" />
            <div style={{ display: 'flex', flexDirection: 'column', width: '100px', maxWidth: '100px' }}>
              <span style={{ display: 'block', width: '100px', maxWidth: '100px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{localStorage.getItem("displayname")}</span>
              <strong style={{ width: '100px', maxWidth: '100px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{localStorage.getItem("userlevel") === "1" ? t('user_lvtag_sup') : localStorage.getItem("userlevel") === "2" ? t('user_lvtag_ser') : localStorage.getItem("userlevel") === "3" ? t('user_lvtag_ad') : t('user_lvtag_us')}</strong>
            </div>
          </NavProfileContainer>
          <LineHr />
          <NavLogout onClick={() => logOut(true)}>
            <RiLogoutBoxRLine />
            {t('logout')}
          </NavLogout>
        </NavbarProfileDropdown>
      </Dropdown.Menu>
    </Dropdown>
  )
}
