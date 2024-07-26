import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useEffect } from "react"
import { ErrorPageStyled } from "../style/components/error.page"

export default function ErrorPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const langs = localStorage.getItem("lang")

  useEffect(() => {
    if (langs) {
      i18n.changeLanguage(langs)
    }
  }, [i18n])

  useEffect(() => {
    const changeFavicon = (href: string) => {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.type = 'image/png'
      link.rel = 'icon'
      link.href = href

      document.getElementsByTagName('head')[0].appendChild(link)
    }

    changeFavicon('logo.png')

    return () => {
      changeFavicon('logo.png')
    }
  }, [])

  return (
    <ErrorPageStyled>
      <h1>{t('titleError')}</h1>
      <p>{t('descriptionError')}</p>
      <p>
        <i onClick={() => navigate('/')}>{t('buttonErrorBack')}</i>
      </p>
    </ErrorPageStyled>
  )
}