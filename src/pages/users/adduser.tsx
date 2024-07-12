import { Modal, Form, Row, Col, InputGroup } from "react-bootstrap"
import { AddUserButton, FormBtn, FormFlexBtn, ModalHead, ProfileFlex } from "../../style/style"
import { RiCloseLine, RiEditLine, RiUserAddLine } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import React, { ChangeEvent, FormEvent, useState } from "react"
import { adduserProp } from "../../types/prop.type"
import HospitalDropdown from "../../components/dropdown/hospitalDropdown"
import WardDropdown from "../../components/dropdown/wardDropdown"
import axios, { AxiosError } from "axios"
import Swal from "sweetalert2"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { fetchUserData } from "../../stores/userSlice"
import { storeDispatchType } from "../../stores/store"
import { responseType } from "../../types/response.type"
import { usersType } from "../../types/user.type"
import { accessToken, cookieOptions, cookies } from "../../constants/constants"
import { setCookieEncode, setShowAlert } from "../../stores/utilsStateSlice"

export default function Adduser(AdduserProp: adduserProp) {
  const { pagestate, userData } = AdduserProp
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { tokenDecode, cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token, displayName } = cookieDecode
  const [show, setShow] = useState(false)
  const [form, setform] = useState({
    group_id: pagestate !== "add" ? String(userData?.userId) : '',
    user_name: pagestate !== "add" ? String(userData?.userName) : '',
    user_password: '',
    display_name: pagestate !== "add" ? String(userData?.displayName) : '',
    user_level: pagestate !== "add" ? String(userData?.userLevel) : '',
    user_status: pagestate !== "add" ? userData?.userStatus === true ? 1 : 0 : 0,
    fileupload: null as File | null,
  })
  const [hosid, setHosid] = useState('')
  const [userPicture, setUserPicture] = useState<string>(userData?.userPic ? `${import.meta.env.VITE_APP_IMG}${userData?.userPic}` : '')

  const openmodal = () => {
    setShow(true)
  }

  const closemodal = () => {
    setShow(false)
    setHosid('')
  }

  const fileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader()
    const fileInput = e.target
    if (e.target && fileInput.files && e.target.files && e.target.files.length > 0) {
      reader.readAsDataURL(e.target.files[0])
      reader.onload = (event) => {
        let img = event.target?.result
        setUserPicture(img as string)
      }
      setform({ ...form, fileupload: fileInput.files[0] as File })
    }
  }

  const setValuestate = (value: string) => {
    setform({ ...form, group_id: value })
  }

  const setLevel = (e: ChangeEvent<HTMLSelectElement>) => {
    setform({ ...form, user_level: e.target.value })
  }

  const setStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    setform({ ...form, user_status: Number(e.target.value) })
  }

  const reFetchdata = async () => {
    if (tokenDecode.userId) {
      try {
        const response = await axios
          .get<responseType<usersType>>(`${import.meta.env.VITE_APP_API}/user/${tokenDecode.userId}`, { headers: { authorization: `Bearer ${token}` } })
        const { displayName, userId, userLevel, userPic, ward, wardId } = response.data.data
        const { hosId, hospital } = ward
        const { hosPic, hosName } = hospital
        const localDataObject = {
          userId: userId,
          hosId: hosId,
          displayName: displayName,
          userPicture: userPic,
          userLevel: userLevel,
          hosImg: hosPic,
          hosName: hosName,
          groupId: wardId,
          token: token
        }
        cookies.set('localDataObject', String(accessToken(localDataObject)), cookieOptions)
        dispatch(setCookieEncode(String(accessToken(localDataObject))))
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setShowAlert(true))
          } else {
            console.error('Something wrong' + error)
          }
        } else {
          console.error('Uknown error: ', error)
        }
      }
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/auth/register`
    const formData = new FormData()
    formData.append('wardId', form.group_id)
    formData.append('userName', form.user_name)
    formData.append('userPassword', form.user_password)
    formData.append('displayName', form.display_name)
    formData.append('userLevel', form.user_level)
    if (form.fileupload) {
      formData.append('fileupload', form.fileupload as File)
    }
    formData.append('createBy', displayName)
    if (form.group_id !== '' && form.user_name !== '' && form.user_password !== '' && form.display_name !== '' && form.user_level !== '') {
      try {
        const response = await axios.post(url, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          }
        })
        setShow(false)
        setHosid('')
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.msg,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        setform({
          group_id: '',
          user_name: '',
          user_password: '',
          display_name: '',
          user_level: '',
          user_status: 0,
          fileupload: null as File | null,
        })
        dispatch(fetchUserData(token))
        reFetchdata()
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setShowAlert(true))
          } else {
            Swal.fire({
              title: t('alertHeaderError'),
              text: error.response?.data.message,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            })
          }
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: 'Uknown Error',
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
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

  const handleSubmitEdit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/user/${userData?.userId}`
    const formData = new FormData()
    formData.append('userName', form.user_name)
    formData.append('displayName', form.display_name)
    formData.append('userLevel', form.user_level)
    formData.append('userStatus', String(form.user_status))
    if (form.fileupload) {
      formData.append('fileupload', form.fileupload as File)
    }
    formData.append('createBy', displayName)
    if (form.group_id !== '' && form.user_name !== '' && form.display_name !== '' && form.user_level !== '') {
      try {
        const response = await axios.put<responseType<usersType>>(url, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`
          }
        })
        setShow(false)
        setHosid('')
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        dispatch(fetchUserData(token))
        reFetchdata()
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setShowAlert(true))
          } else {
            Swal.fire({
              title: t('alertHeaderError'),
              text: error.response?.data.message,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            })
          }
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: 'Uknown Error',
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      }
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('complete_field'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  const userlevel = [
    { value: '0', name: t('levelSuper') },
    { value: '1', name: t('levelService') },
    { value: '2', name: t('levelAdmin') },
    { value: '3', name: t('levelUser') },
  ]

  const userstatus = [
    { value: 1, name: t('userActive') },
    { value: 0, name: t('userInactive') }
  ]

  return (
    <>
      {pagestate === "add" ?
        <AddUserButton onClick={openmodal} style={{ width: 'max-content', height: '45px' }}>
          {t('addUserButton')}
          <RiUserAddLine />
        </AddUserButton>
        : <AddUserButton onClick={openmodal} >
          <RiEditLine />
        </AddUserButton>}
      <Modal size="lg" show={show} onHide={closemodal}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {
                pagestate === "add" ?
                  t('addUserButton')
                  :
                  t('editUserButton')
              }
            </strong>
            {/* <pre>{JSON.stringify(form, null, 2)}</pre> */}
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={pagestate === "add" ? handleSubmit : handleSubmitEdit}>
          <Modal.Body>
            <Row>
              {
                pagestate === "add" ?
                  <Col lg={6}>
                    <InputGroup className="mb-3">
                      <Form.Label className="w-100">
                        {t('userHospitals')}
                        <HospitalDropdown
                          setHos_id={setHosid}
                        />
                      </Form.Label>
                    </InputGroup>
                  </Col>
                  :
                  <></>
              }
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('userWard')}
                    <WardDropdown
                      setState_ward={setValuestate}
                      Hosid={pagestate === "add" ? hosid : String(userData?.hosId)}
                      Group_ID={String(userData?.wardId)}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('userNameForm')}
                    <Form.Control
                      name="fieldUsername"
                      autoComplete='off'
                      type='text'
                      value={form.user_name}
                      onChange={(e) => setform({ ...form, user_name: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              {
                pagestate === "add" ?
                  <Col lg={6}>
                    <InputGroup className="mb-3">
                      <Form.Label className="w-100">
                        {t('userpassword')}
                        <Form.Control
                          name="fieldUserpassword"
                          autoComplete='off'
                          type='password'
                          value={form.user_password}
                          onChange={(e) => setform({ ...form, user_password: e.target.value })}
                        />
                      </Form.Label>
                    </InputGroup>
                  </Col>
                  :
                  <></>
              }
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('userDisplayName')}
                    <Form.Control
                      name="fieldDisplayname"
                      autoComplete='off'
                      type='text'
                      value={form.display_name}
                      onChange={(e) => setform({ ...form, display_name: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('userRole')}
                    <Form.Select onChange={setLevel} name="fieldUserLevel" value={form.user_level}>
                      {
                        userlevel.map((item, index) => {
                          const optionKey = `option_${index}`
                          if (!userData?.userId && index === 0) {
                            return (
                              <React.Fragment key={optionKey}>
                                <option key={`${optionKey}_select`} selected value={''}>
                                  {t('selectRole')}
                                </option>
                                <option key={optionKey} value={item.value}>
                                  {item.name}
                                </option>
                              </React.Fragment>
                            )
                          } else if (item.value === userData?.userLevel) {
                            return (
                              <option key={optionKey} selected value={item.value}>
                                {item.name}
                              </option>
                            )
                          } else {
                            return (
                              <option key={optionKey} value={item.value}>
                                {item.name}
                              </option>
                            )
                          }
                        })
                      }
                    </Form.Select>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('userPicture')}
                    <ProfileFlex $radius={10} $dimension={250} $imageFit>
                      <div>
                        <img src={userPicture ? userPicture : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`} alt="down-picture" />
                        <label htmlFor={'user-file-upload'} >
                          <RiEditLine />
                          <input id="user-file-upload" type="file" onChange={fileSelect} />
                        </label>
                      </div>
                    </ProfileFlex>
                  </Form.Label>
                </InputGroup>
              </Col>
              {
                pagestate !== "add" ?
                  <Col lg={6}>
                    <InputGroup className="mb-3">
                      <Form.Label className="w-100">
                        {t('userStatus')}
                        <Form.Select onChange={setStatus} name="field_status" value={form.user_status}>
                          <option key={'01'} value={''}>
                            {t('selectStatus')}
                          </option>
                          {
                            userstatus.map((item, index) => {
                              if (item.value === form.user_status) {
                                return (
                                  <option key={index} value={item.value}>
                                    {item.name}
                                  </option>
                                )
                              } else {
                                return (
                                  <option key={index} value={item.value}>
                                    {item.name}
                                  </option>
                                )
                              }
                            })
                          }
                        </Form.Select>
                      </Form.Label>
                    </InputGroup>
                  </Col>
                  :
                  <></>
              }
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('saveButton')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
