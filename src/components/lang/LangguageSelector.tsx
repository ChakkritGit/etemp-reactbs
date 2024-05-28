import { useEffect } from "react"
import { useTranslation } from 'react-i18next'
import '../../style/LangSelector.css'
import { Dropdown } from "react-bootstrap"
import { LangFlag, LangFlagFlex, LangSwitch, LangSwitchContainer, LangText } from "../../style/style"
import { RiEarthLine } from "react-icons/ri"
import { toast } from 'react-hot-toast'
import Th from "../../assets/svg/th.svg"
import En from "../../assets/svg/us.svg"
// import Cn from "../../assets/svg/cn.svg"
// import Jp from "../../assets/svg/jp.svg"

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
        <Dropdown.Menu>
          <Dropdown.Item className={langs == 'th' ? "active-lang" : ""} onClick={() => changeLanguage('th')}>
            <LangFlagFlex>
              <LangFlag src={Th} alt="flag-icon" />
              ไทย
            </LangFlagFlex>
          </Dropdown.Item>
          <Dropdown.Item className={langs == 'en' ? "active-lang" : ""} onClick={() => changeLanguage('en')}>
            <LangFlagFlex>
              <LangFlag src={En} alt="flag-icon" />
              <div>English <small>(US)</small></div>
            </LangFlagFlex>
          </Dropdown.Item>
          {/* <Dropdown.Item className={langs == 'cn' ? "active-lang" : ""} onClick={() => changeLanguage('cn')}>
            <LangFlagFlex>
              <LangFlag src={Cn} alt="flag-icon" />
              汉语
              <small style={{ borderRadius: '.3rem', backgroundColor: 'var(--warning-light)', padding: '3px 5px', fontSize: '10px', color: 'black' }}>Beta</small>
            </LangFlagFlex>
          </Dropdown.Item>
          <Dropdown.Item className={langs == 'jp' ? "active-lang" : ""} onClick={() => changeLanguage('jp')}>
            <LangFlagFlex>
              <LangFlag src={Jp} alt="flag-icon" />
              日本語
              <small style={{ borderRadius: '.3rem', backgroundColor: 'var(--warning-light)', padding: '3px 5px', fontSize: '10px', color: 'black' }}>Beta</small>
            </LangFlagFlex>
          </Dropdown.Item> */}
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}
