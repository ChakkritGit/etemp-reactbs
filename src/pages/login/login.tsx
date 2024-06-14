import './login.css'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import LangguageSelector from '../../components/lang/LangguageSelector'
import { useTranslation } from 'react-i18next'
import { FormEvent, useState } from 'react'
import Swal from "sweetalert2"
import axios, { AxiosError } from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import { RiLoader3Line } from "react-icons/ri"
import { useEffect } from 'react'
import { setToken } from '../../stores/utilsStateSlice'
import { useDispatch } from 'react-redux'
import { storeDispatchType } from '../../stores/store'
import { responseType } from '../../types/response.type'
import { LoginResponse } from '../../types/response.type'

export default function Login() {
  const dispatch = useDispatch<storeDispatchType>()
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [loginform, setLoginform] = useState({
    username: '',
    password: ''
  })
  const [isloading, setIsloading] = useState(false)

  useEffect(() => {
    const changeFavicon = (href: string) => {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.type = 'image/jpg'
      link.rel = 'icon'
      link.href = href

      document.getElementsByTagName('head')[0].appendChild(link)
      document.title = `${location.pathname.split("/")[1] !== '' ? location.pathname.split("/")[1] : 'home'}`
    }

    changeFavicon('logo.png')

    return () => {
      changeFavicon('logo.png')
    }
  }, [location])

  const submitForm = async (e: FormEvent) => {
    e.preventDefault()
    if (loginform.username !== '' && loginform.password !== '') {
      setIsloading(true)
      const url: string = `${import.meta.env.VITE_APP_API}/auth/login`
      const data = {
        username: loginform.username,
        password: loginform.password,
      }
      try {
        const response = await axios.post<responseType<LoginResponse>>(url, data)
        const { displayName, hosId, hosName, hosPic, token, userId, userLevel, userPic, wardId } = response.data.data
        localStorage.setItem("userid", userId)
        localStorage.setItem("hosid", hosId)
        localStorage.setItem("displayname", displayName)
        localStorage.setItem("userpicture", userPic)
        localStorage.setItem("userlevel", userLevel)
        localStorage.setItem("hosimg", String(hosPic))
        localStorage.setItem("hosname", hosName)
        localStorage.setItem("groupid", wardId)
        localStorage.setItem("token", token)
        dispatch(setToken(token))
        navigate(`/`)
      } catch (error) {
        if (error instanceof AxiosError) {
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
          setIsloading(false)
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: 'Unknown Error',
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
          setIsloading(false)
        }
      }
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }

  }
  return (
    <Container className='p-3'>
      <Col>
        <div className='mb-3' style={{ display: 'flex', justifyContent: 'right', width: '100%' }}>
          <LangguageSelector />
        </div>
        <Row className='d-flex flex-column align-items-center mt-5 p-2'>
          <Card className='login-card p-4 border-0'>
            <Form onSubmit={submitForm}>
              <h3
                className="mb-3 text-center"
              >{t('loginHeader')}</h3>
              <InputGroup className="mb-3">
                <FloatingLabel
                  controlId="floatingInputUsername"
                  label={t('loginUsername')}
                  className="mb-2"
                >
                  <Form.Control
                    placeholder="Username"
                    aria-label="Username"
                    aria-describedby="user-input"
                    className='login-form-input'
                    autoComplete='off'
                    type='text'
                    value={loginform.username}
                    onChange={(e) => setLoginform({ ...loginform, username: e.target.value })}
                  />
                </FloatingLabel>
              </InputGroup>
              <InputGroup className="mb-3">
                <FloatingLabel
                  controlId="floatingInputPassword"
                  label={t('loginPassword')}
                  className="mb-2"
                >
                  <Form.Control
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="user-input"
                    autoComplete='off'
                    type='password'
                    value={loginform.password}
                    onChange={(e) => setLoginform({ ...loginform, password: e.target.value })}
                  />
                </FloatingLabel>
              </InputGroup>
              <Button
                className="login-button-submit border-0"
                type="submit"
                variant="primary"
                disabled={isloading}
              >{isloading ? <div className='login-button-load-flex'>
                <RiLoader3Line />
                {t('loginButtonLoading')}</div> : t('loginButton')}
              </Button>
            </Form>
          </Card>
        </Row>
      </Col>
    </Container >
  )
}
