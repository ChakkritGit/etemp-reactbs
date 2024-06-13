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

export default function Adduser(AdduserProp: adduserProp) {
  const { pagestate, userData } = AdduserProp
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { tokenDecode, token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const [show, setShow] = useState(false)
  const [form, setform] = useState({
    group_id: pagestate !== "add" ? String(userData?.userId) : '',
    user_name: pagestate !== "add" ? String(userData?.userName) : '',
    user_password: '',
    display_name: pagestate !== "add" ? String(userData?.displayName) : '',
    user_level: pagestate !== "add" ? String(userData?.userLevel) : '',
    user_status: pagestate !== "add" ? String(userData?.userStatus) : '',
    fileupload: null as File | null,
  })
  const [hosid, setHosid] = useState('')
  const [userPicture, setUserPicture] = useState<string>(`${import.meta.env.VITE_APP_IMG}${userData?.userPic}`)

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
    setform({ ...form, user_status: e.target.value })
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
      const { displayName, userId, userLevel, userPic, ward, wardId } = response.data.data
      localStorage.setItem("userid", userId)
      localStorage.setItem("hosid", ward.hosId)
      localStorage.setItem("displayname", displayName)
      localStorage.setItem("userpicture", userPic)
      localStorage.setItem("userlevel", userLevel)
      localStorage.setItem("groupid", wardId)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error("Uknown Error: ", error)
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
    formData.append('createBy', String(localStorage.getItem('displayname')))
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
          user_status: '',
          fileupload: null as File | null,
        })
        dispatch(fetchUserData(token))
        reFetchdata()
      } catch (error) {
        if (error instanceof AxiosError) {
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: 'Unknown Error',
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
    formData.append('userStatus', form.user_status)
    if (form.fileupload) {
      formData.append('fileupload', form.fileupload as File)
    }
    formData.append('createBy', String(localStorage.getItem('displayname')))
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
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: 'Unknown Error',
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
    { value: '1', name: t('levelSuper') },
    { value: '2', name: t('levelService') },
    { value: '3', name: t('levelAdmin') },
    { value: '4', name: t('levelUser') },
  ]

  const userstatus = [
    { value: true, name: t('userActive') },
    { value: false, name: t('userInactive') }
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
                    <ProfileFlex $radius={10} $dimension={250}>
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
                          {
                            userstatus.map((item, index) => {
                              const optionKey = `option_${index}`
                              if (!userData?.userStatus && index === 0) {
                                return (
                                  <React.Fragment key={optionKey}>
                                    <option key={`${optionKey}_select`} selected value={''}>
                                      {t('selectStatus')}
                                    </option>
                                    <option key={optionKey} value={item.value === false ? 1 : 0}>
                                      {item.name}
                                    </option>
                                  </React.Fragment>
                                )
                              } else if (item.value === userData?.userStatus) {
                                return (
                                  <option key={optionKey} selected value={item.value === false ? 1 : 0}>
                                    {item.name}
                                  </option>
                                )
                              } else {
                                return (
                                  <option key={optionKey} value={item.value === false ? 1 : 0}>
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
