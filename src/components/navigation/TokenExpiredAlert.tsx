import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cookies } from '../../constants/constants'
import { setCookieEncode, setShowAlert } from '../../stores/utilsStateSlice'
import { swalTokenInvalid } from '../dropdown/sweetalertLib'

const TokenExpiredAlert = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    swalTokenInvalid.fire({
      title: t('tokenExpired'),
      text: t('tokenExpiredText'),
      icon: "error",
      confirmButtonText: t('confirmButton'),
      backdrop: true,
      allowEscapeKey: false,
      allowOutsideClick: false
    })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(setCookieEncode(''))
          cookies.remove('localDataObject')
          cookies.remove('devSerial')
          cookies.remove('devid')
          cookies.remove('selectHos')
          cookies.remove('selectWard')
          dispatch(setShowAlert(false))
          navigate("/login")
        }
      })
  }, [dispatch, cookies, navigate, t])

  return null // This component does not render anything
}

export default TokenExpiredAlert
