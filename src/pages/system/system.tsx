import { Container } from "react-bootstrap"
import {
  H3mt, LineHeightSystem, ListMenu, ListMenuButton, SettingLeftContainer,
  SettingRightContainer, SettingSystemContainer
} from "../../style/style"
import { useTranslation } from "react-i18next"
import { RiApps2AddLine, RiLogoutBoxRLine, RiPaletteLine, RiTranslate2, RiUser6Line } from "react-icons/ri"
import { useEffect, useRef, useState } from "react"
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
  let deferredPrompt: any
  const installRef = useRef<HTMLButtonElement>(null)

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

  const installApp = () => {
    // Show the prompt
    deferredPrompt.prompt()
    if (installRef.current) {
      installRef.current.disabled = true
    }
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === "accepted") {
        if (installRef.current) {
          installRef.current.hidden = true
        }
      } else {
        console.error("PWA setup rejected")
      }
      if (installRef.current) {
        installRef.current.disabled = false
      }
      deferredPrompt = null
    })
  }

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", e => {
      // Prevent Chrome 76 and earlier from automatically showing a prompt
      e.preventDefault()
      // Stash the event so it can be triggered later.
      deferredPrompt = e
      // Show the install button
      if (installRef.current) {
        installRef.current.hidden = false
        installRef.current.addEventListener("click", installApp)
      }
    })
  }, [installRef])

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
            <ListMenuButton ref={installRef}>
              <RiApps2AddLine />
              <span>
                {t('installApp')}
              </span>
            </ListMenuButton>
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
