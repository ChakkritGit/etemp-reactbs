import { ChangeEvent, FormEvent, useState } from 'react'
import { FormBtn, FormFlexBtn, ManageHospitalsAdd, ModalHead } from '../../../style/style'
import { RiAddLine, RiCloseLine, RiEditLine } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { Col, Modal, Row, Form, InputGroup } from 'react-bootstrap'
import Swal from 'sweetalert2'
import axios, { AxiosError } from 'axios'
import { addHospitalProp } from '../../../types/prop.type'
import { localtoken } from '../../../authen/localdata'
import { useDispatch } from 'react-redux'
import { storeDispatchType } from '../../../stores/store'
import { useSelector } from 'react-redux'
import { DeviceStateStore, UtilsStateStore } from '../../../types/redux.type'
import { fetchHospitals } from '../../../stores/dataArraySlices'
import { responseType } from '../../../types/response.type'
import { hospitalsType } from '../../../types/hospital.type'

export default function Addhospitals(addhosprop: addHospitalProp) {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const { pagestate, hosdata } = addhosprop
  const dispatch = useDispatch<storeDispatchType>()
  const { token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const [formdata, setFormdata] = useState({
    name: pagestate !== "add" ? hosdata?.hosName as string : '',
    address: pagestate !== "add" ? hosdata?.hosAddress as string : '',
    telephone: pagestate !== "add" ? hosdata?.hosTelephone as string : '',
    picture: null as File | null,
  })

  const openmodal = () => {
    setShow(true)
  }

  const closemodal = () => {
    setShow(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/hospital`
    const formData = new FormData()
    formData.append('hosName', String(formdata.name))
    formData.append('hosAddress', String(formdata.address))
    formData.append('userTelePhone', String(formdata.telephone))
    if (formdata.picture) {
      formData.append('fileupload', formdata.picture as File)
    }
    if (formdata.name !== "" && formdata.address !== "" && formdata.telephone !== "") {
      try {
        const response = await axios.post<responseType<hospitalsType>>(url, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${localtoken}`
          }
        })
        setShow(false)
        Swal.fire({
          title: t('alert_header_Success'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        setFormdata({
          name: '',
          address: '',
          telephone: '',
          picture: null as File | null,
        })
        dispatch(fetchHospitals(token))
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
            text: 'Unknown Error',
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

  const handleSubmitedit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/hospital/${hosdata?.hosId}`
    const formData = new FormData()
    formData.append('hosName', String(formdata.name))
    formData.append('hosAddress', String(formdata.address))
    formData.append('hosTelephone', String(formdata.telephone))
    if (formdata.picture) {
      formData.append('fileupload', formdata.picture as File)
    }
    if (formdata.name !== "" && formdata.address !== "" && formdata.telephone !== "") {
      try {
        const response = await axios.put<responseType<hospitalsType>>(url, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${localtoken}`
          }
        })
        setShow(false)
        Swal.fire({
          title: t('alert_header_Success'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        dispatch(fetchHospitals(token))
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
            text: 'Unknown Error',
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

  const fileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target
    if (fileInput.files && fileInput.files.length > 0) {
      setFormdata({ ...formdata, picture: fileInput.files[0] as File })
    }
  }

  return (
    <>
      {
        pagestate == 'add' ?
          <ManageHospitalsAdd onClick={openmodal}>
            {t('add_hospitals_btn')}
            <RiAddLine />
          </ManageHospitalsAdd>
          :
          <ManageHospitalsAdd onClick={openmodal} style={{ width: '30px', height: '30px' }} >
            <RiEditLine />
          </ManageHospitalsAdd>
      }
      <Modal show={show} onHide={closemodal}>
        <Modal.Header>
          {/* {JSON.stringify(formdata)} */}
          <ModalHead>
            <strong>
              {
                pagestate === "add" ?
                  t('add_hospitals_btn')
                  :
                  t('modal_edit_hos')
              }
            </strong>
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={pagestate === "add" ? handleSubmit : handleSubmitedit}>
          <Modal.Body>
            <Row>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('form_label_hosname')}
                    <Form.Control
                      name='form_label_hosname'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={formdata.name}
                      onChange={(e) => setFormdata({ ...formdata, name: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('form_label_hosaddress')}
                    <Form.Control
                      name='form_label_hosaddress'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={formdata.address}
                      onChange={(e) => setFormdata({ ...formdata, address: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('form_label_hostel')}
                    <Form.Control
                      name='form_label_hostel'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={formdata.telephone}
                      onChange={(e) => setFormdata({ ...formdata, telephone: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('form_label_hospic')}
                    <Form.Control
                      name='form_label_hospic'
                      type='file'
                      onChange={fileSelect}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('form_btn_save')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
