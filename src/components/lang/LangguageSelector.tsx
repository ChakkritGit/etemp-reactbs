import { useEffect } from "react"
import { useTranslation } from 'react-i18next'
import { Dropdown } from "react-bootstrap"
import { LangFlag, LangFlagFlex, LangSwitch, LangSwitchContainer, LangText } from "../../style/style"
import { RiEarthLine } from "react-icons/ri"
import { toast } from 'react-hot-toast'
import Th from "../../assets/svg/th.svg"
import En from "../../assets/svg/us.svg"
import { LangContainer, LangSwitchButton } from "../../style/components/language"
import Cn from "../../assets/svg/cn.svg"
import Jp from "../../assets/svg/jp.svg"

export default function LangguageSelector() {
  const { i18n } = useTranslation()
  const langs = localStorage.getItem("lang")

  const changeLanguage = (language: string) => {
    if (language === "cn" || language === "jp") {
      toast('(Beta) การแปลภาษาอาจจะไม่ถูกต้อง', {
        icon: '!',
        style: {
          borderRadius: '.5rem',
          border: '1px solid #E9C019',
          padding: '10px',
          color: '#6A5600',
          backgroundColor: '#FFFAE7',
          textAlign: 'center',
        },
        iconTheme: {
          primary: '#6A5600',
          secondary: '#FFFAEE',
        },
        duration: 6000,
      })
    }
    i18n.changeLanguage(language)
    localStorage.setItem("lang", language)
  }

  useEffect(() => {
    if (langs) {
      i18n.changeLanguage(langs)
    }
  }, [i18n])

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle variant="0" className="border-0 p-0">
          <LangSwitchContainer>
            <LangSwitch>
              <RiEarthLine />
              <LangText>
                {langs == 'th' ? "TH" : langs == 'en' ? "EN" : langs == 'cn' ? "CN" : langs == 'jp' ? "JP" : "TH"}
              </LangText>
            </LangSwitch>
          </LangSwitchContainer>
        </Dropdown.Toggle>
        <Dropdown.Menu style={{width: '180px'}}>
          <LangContainer>
            <LangSwitchButton $lang={langs == 'th'} onClick={() => changeLanguage('th')}>
              <LangFlagFlex>
                <LangFlag src={Th} alt="flag-icon" />
                <span>ไทย</span>
              </LangFlagFlex>
            </LangSwitchButton >
            <LangSwitchButton $lang={langs == 'en'} onClick={() => changeLanguage('en')}>
              <LangFlagFlex>
                <LangFlag src={En} alt="flag-icon" />
                <span>English <small>(US)</small></span>
              </LangFlagFlex>
            </LangSwitchButton>
            <LangSwitchButton $lang={langs == 'cn'} onClick={() => changeLanguage('cn')}>
              <LangFlagFlex>
                <LangFlag src={Cn} alt="flag-icon" />
                <span>简体中文  <small style={{ borderRadius: '.3rem', backgroundColor: 'var(--warning-light)', padding: '3px 5px', fontSize: '10px', color: 'black' }}>Beta</small></span>
              </LangFlagFlex>
            </LangSwitchButton>
            <LangSwitchButton $lang={langs == 'jp'} onClick={() => changeLanguage('jp')}>
              <LangFlagFlex>
                <LangFlag src={Jp} alt="flag-icon" />
                <span>日本語 <small style={{ borderRadius: '.3rem', backgroundColor: 'var(--warning-light)', padding: '3px 5px', fontSize: '10px', color: 'black' }}>Beta</small></span>
              </LangFlagFlex>
            </LangSwitchButton>
          </LangContainer>
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}
