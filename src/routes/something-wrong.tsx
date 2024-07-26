import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ErrorPageStyled } from "../style/components/error.page"

export default function SomethingWrong() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const langs = localStorage.getItem("lang")

  useEffect(() => {
    if (langs) {
      i18n.changeLanguage(langs)
    }
  }, [i18n])

  return (
    <ErrorPageStyled>
      <h1>{t('titleError')}</h1>
      <p>{t('descriptionErrorWrong')}</p>
      <p>
        <i onClick={() => navigate('/')}>{t('buttonErrorBack')}</i>
      </p>
    </ErrorPageStyled>
  )
}
