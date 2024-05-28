import { RiAddLine, RiCloseLine, RiEditLine } from "react-icons/ri"
import { FormBtn, FormFlexBtn, ManageWardAdd, ModalHead } from "../../../style/style"
import { useTranslation } from "react-i18next"
import { FormEvent, useState } from "react"
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap"
import axios, { AxiosError } from "axios"
import Swal from "sweetalert2"
import HospitalDropdown from "../../../components/dropdown/hospitalDropdown"
import { addWardProp } from "../../../types/prop.type"
import { fetchHospitals } from "../../../stores/dataArraySlices"
import { useDispatch } from "react-redux"
import { storeDispatchType } from "../../../stores/store"
import { DeviceStateStore, UtilsStateStore } from "../../../types/redux.type"
import { useSelector } from "react-redux"
import { responseType } from "../../../types/response.type"
import { wardsType } from "../../../types/ward.type"

export default function Addward(addwardprop: addWardProp) {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const [show, setShow] = useState(false)
  const [hosid, setHosid] = useState('')
  const { token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { pagestate, warddata } = addwardprop
  const [formdata, setFormdata] = useState({
    ward_name: pagestate !== 'add' ? warddata?.group_name as string : '',
  })

  const openmodal = () => {
    setShow(true)
  }

  const closemodal = () => {
    setShow(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/ward`
    if (hosid !== '' && formdata.ward_name !== '') {
      try {
        const response = await axios.post<responseType<wardsType>>(url, {
          hosId: String(hosid),
          wardName: String(formdata.ward_name)
        }, {
          headers: {
            authorization: `Bearer ${token}`
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
          ward_name: ''
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
    const url: string = `${import.meta.env.VITE_APP_API}/ward/${warddata?.group_id}`

    if (formdata.ward_name !== '') {
      try {
        const response = await axios.put<responseType<wardsType>>(url, {
          wardName: String(formdata.ward_name)
        }, {
          headers: {
            authorization: `Bearer ${token}`
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

  return (
    <>
      {
        pagestate === 'add' ?
          <ManageWardAdd onClick={openmodal}>
            {t('add_ward_btn')}
            <RiAddLine />
          </ManageWardAdd>
          :
          <ManageWardAdd onClick={openmodal} style={{ width: '30px', height: '30px' }} >
            <RiEditLine />
          </ManageWardAdd>
      }
      <Modal show={show} onHide={closemodal}>
        <Modal.Header>
          {/* {JSON.stringify(formdata)} */}
          <ModalHead>
            <strong>
              {
                pagestate === "add" ?
                  t('add_ward_btn')
                  :
                  t('modal_edit_ward')
              }
            </strong>
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={pagestate === 'add' ? handleSubmit : handleSubmitedit}>
          <Modal.Body>
            <Row>
              {
                pagestate === 'add' ?
                  <Col lg={6}>
                    <InputGroup className="mb-3">
                      <Form.Label className="w-100">
                        {t('field_hospitals')}
                        <HospitalDropdown setHos_id={setHosid} />
                      </Form.Label>
                    </InputGroup>
                  </Col>
                  :
                  <></>
              }
              <Col lg={pagestate === 'edit' ? 12 : 6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('form_ward_name')}
                    <Form.Control
                      name="form_ward_name"
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={formdata.ward_name}
                      onChange={(e) => setFormdata({ ...formdata, ward_name: e.target.value })}
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
