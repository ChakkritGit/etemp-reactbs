import { Container } from "react-bootstrap"
import {
  H3mt, LineHeightSystem, ListMenu, SettingLeftContainer,
  SettingRightContainer, SettingSystemContainer
} from "../../style/style"
import { useTranslation } from "react-i18next"
import { RiLogoutBoxRLine, RiPaletteLine, RiTranslate2, RiUser6Line } from "react-icons/ri"
import { useState } from "react"
import Color from "./display"
import { useNavigate } from "react-router-dom"
import Account from "./account"
import LangguageSelector from "../../components/lang/LangguageSelector"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"

export default function System() {
  const { t } = useTranslation()
  const { expand } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const [pagenumber, setPagenumber] = useState(1)
  const navigate = useNavigate()

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
      return navigate("/login")
    }
  }

  return (
    <Container fluid>
      <H3mt>{t('sideSetting')}</H3mt>
      <SettingSystemContainer>
        <SettingLeftContainer $primary={expand}>
          <div>
            <ListMenu $primary={pagenumber === 1} onClick={() => setPagenumber(1)}>
              <RiUser6Line />
              <span>{t('tabAccount')}</span>
            </ListMenu>
            <ListMenu $primary={pagenumber === 2} onClick={() => setPagenumber(2)}>
              <RiPaletteLine />
              <span>
                {t('tabDisplay')}
              </span>
            </ListMenu>
            <ListMenu $primary={pagenumber === 3} onClick={() => setPagenumber(3)}>
              <RiTranslate2 />
              <span>
                {t('tabLanguage')}
              </span>
            </ListMenu>
          </div>
          <ListMenu $logout onClick={() => logOut(true)}>
            <RiLogoutBoxRLine />
            <span>{t('tabLogout')}</span>
          </ListMenu>
        </SettingLeftContainer>
        <LineHeightSystem />
        <SettingRightContainer>
          {
            pagenumber === 1 ?
              <div>
                <Account />
              </div>
              :
              pagenumber === 2 ?
                <div>
                  <Color />
                </div>
                :
                <div>
                  <h3>{t('tabLanguage')}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <span>{t('changeLanguage')}</span>
                    <LangguageSelector />
                  </div>
                </div>
          }
        </SettingRightContainer>
      </SettingSystemContainer>
    </Container>
  )
}
