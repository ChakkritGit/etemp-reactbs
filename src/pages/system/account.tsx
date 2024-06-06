import { ChangeEvent, FormEvent, useState } from "react"
import {
  AccountContainer, Checkboxbsoveride, FormBtn, FormFlexBtn, LineHr, ModalHead,
  PasswordChangeFlex, ProfileFlex, SecurityFlex, SecurityPasswordBtn
} from "../../style/style"
import { RiCloseLine, RiEditLine } from "react-icons/ri"
import axios, { AxiosError } from "axios"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { responseType } from "../../types/response.type"
import { usersType } from "../../types/user.type"

export default function Account() {
  const [userpicture, setUserpicture] = useState<string>('')
  const { tokenDecode, token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { t } = useTranslation()
  const [show, setshow] = useState(false)
  const [newpassword, setNewpassword] = useState('')
  const [showpassword, setShowpassword] = useState(false)

  const openmodal = () => {
    setshow(true)
  }

  const closemodal = () => {
    setshow(false)
  }

  const reFetchdata = async () => {
    const url: string = `${import.meta.env.VITE_APP_API}/user/${tokenDecode?.userId}`
    try {
      const response = await axios
        .get<responseType<usersType>>(url, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
      const { displayName, userId, userLevel, userPic, wardId, ward } = response.data.data
      const { hosId, hospital } = ward
      localStorage.setItem("userid", userId)
      localStorage.setItem("hosid", hosId)
      localStorage.setItem("displayname", displayName)
      localStorage.setItem("userpicture", String(userPic))
      localStorage.setItem("userlevel", userLevel)
      localStorage.setItem("hosimg", hospital.hosPic)
      localStorage.setItem("hosname", hospital.hosName)
      localStorage.setItem("groupid", wardId)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error('Unknown Error', error)
      }
    }
  }

  const handleChang = async (e: ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader()
    const url: string = `${import.meta.env.VITE_APP_API}/user/${tokenDecode?.userId}`
    const formData = new FormData()

    if (e.target && e.target.files && e.target.files.length > 0) {
      reader.readAsDataURL(e.target.files[0])

      reader.onload = (event) => {
        let img = event.target?.result
        setUserpicture(img as string)
      }

      formData.append('fileupload', e.target?.files[0] as File)

      try {
        const response = await axios
          .put<responseType<usersType>>(url, formData, {
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${token}`
            }
          })
        toast.success(response.data.message)
        reFetchdata()
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message)
        } else {
          toast.error('Unknown Error')
          console.error(error)
        }
      }
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (newpassword !== '') {
      try {
        const response = await axios.patch(`${import.meta.env.VITE_APP_API}/auth/reset/${tokenDecode.userId}`, {
          password: newpassword
        }, {
          headers: {
            Accept: "application/json",
            authorization: `Bearer ${token}`
          }
        })
        setshow(false)
        Swal.fire({
          title: t('alert_header_Success'),
          text: response.data.data,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        reFetchdata()
      } catch (error) {
        if (error instanceof AxiosError) {
          Swal.fire({
            title: t('alert_header_Error'),
            text: error.response?.data.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        } else {
          Swal.fire({
            title: t('alert_header_Error'),
            text: 'Uknown Error',
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      }
    } else {
      Swal.fire({
        title: t('alert_header_Warning'),
        text: t('complete_field'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  return (
    <AccountContainer>
      <h3>{t('profile')}</h3>
      <ProfileFlex $radius={50} $dimension={150}>
        <div>
          <img src={userpicture ? userpicture : `${import.meta.env.VITE_APP_IMG}${localStorage.getItem('userpicture')}`} alt="user-picture" />
          <label htmlFor={'user-file-upload'} >
            <RiEditLine />
            <input id="user-file-upload" type="file" onChange={handleChang} />
          </label>
        </div>
        <div>
          <h5>{localStorage.getItem('displayname')}</h5>
          <span>@username</span>
        </div>
      </ProfileFlex>
      <LineHr />
      <h3>{t('security')}</h3>
      <SecurityFlex>
        <span>{t('password')}</span>
        <SecurityPasswordBtn onClick={openmodal}>
          {t('change')}
        </SecurityPasswordBtn>
      </SecurityFlex>

      <Modal show={show} onHide={closemodal}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {t('password')}
            </strong>
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col lg={12}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    รหัสผ่านใหม่
                    <Form.Control
                      spellCheck={false}
                      autoComplete='off'
                      type={showpassword ? 'text' : 'password'}
                      value={newpassword}
                      onChange={(e) => setNewpassword(e.target.value)}
                    />
                  </Form.Label>
                </InputGroup>
                <PasswordChangeFlex $primary={newpassword.length}>
                  <div></div>
                  <span>
                    {
                      newpassword.length === 0 ?
                        'ต่ำมาก'
                        :
                        newpassword.length < 4 ?
                          'ต่ำ'
                          :
                          newpassword.length < 8 ?
                            'ปานกลาง'
                            :
                            newpassword.length < 12 ?
                              'ดี'
                              :
                              'ดีมาก'
                    }
                  </span>
                </PasswordChangeFlex>
                <Form.Group className="mb-3">
                  <Checkboxbsoveride>
                    <Form.Check
                      inline
                      label={'แสดงรหัสผ่าน'}
                      type="checkbox"
                      checked={showpassword}
                      onChange={() => setShowpassword(!showpassword)}
                    />
                  </Checkboxbsoveride>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('change')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>
    </AccountContainer>
  )
}
