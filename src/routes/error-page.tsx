import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useEffect } from "react"

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
      link.type = 'image/jpg'
      link.rel = 'icon'
      link.href = href

      document.getElementsByTagName('head')[0].appendChild(link)
    }

    changeFavicon('/src/assets/images/Thanes.jpg')

    return () => {
      changeFavicon('/Thanes.jpg')
    }
  }, [])

  return (
    <div className="error-page">
      <h1>{t('titleerror')}</h1>
      <p>{t('descerror')}</p>
      <p>
        <i onClick={() => navigate('/')}>{t('btnerror')}</i>
      </p>
    </div>
  )
}