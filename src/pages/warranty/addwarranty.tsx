import { Col, Form, Modal, Row } from "react-bootstrap"
import { FormBtn, FormFlexBtn, ModalHead } from "../../style/style"
import { RiAddLine, RiCloseLine, RiEditLine } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import { FormEvent, useState } from "react"
import { AddWarrantyButton } from "../../style/components/warranty.styled"
import { warrantyType } from "../../types/warranty.type"
import { useSelector } from "react-redux"
import { DeviceState, DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import Swal from "sweetalert2"
import axios, { AxiosError } from "axios"
import TokenExpiredAlert from "../../components/navigation/TokenExpiredAlert"

interface AddWarrantyPropsType {
  pagestate: string,
  warData?: warrantyType,
  fetchData: () => void
}

interface WarrantyObjectType {
  devName: string | undefined;
  expire: string | undefined;
  invoice?: string | undefined;
}

interface WarrantyObjectEditType {
  expire: string | undefined;
  invoice?: string | undefined;
}

export default function Addwarranty(warProps: AddWarrantyPropsType) {
  const { pagestate, warData, fetchData } = warProps
  const { t } = useTranslation()
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const [show, setShowe] = useState(false)
  const [warrantyObject, setWarrantyObject] = useState({
    devName: warData?.device.devName,
    invoice: warData?.invoice,
    expire: warData?.expire.substring(0, 10)
  })

  const openModal = () => {
    setShowe(true)
  }

  const closeModal = () => {
    setShowe(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (warrantyObject.devName !== '' && warrantyObject.expire !== '' || warrantyObject.invoice !== '') {
      const body: WarrantyObjectType = {
        devName: warrantyObject.devName,
        expire: warrantyObject.expire,
      }
      if (warrantyObject.invoice !== '') body.invoice = warrantyObject.invoice
      try {
        const response = await axios.post(`${import.meta.env.VITE_APP_API}/warranty`, body, {
          headers: { authorization: `Bearer ${token}` }
        })
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            <TokenExpiredAlert />
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
      } finally {
        closeModal()
        fetchData()
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
    if (warrantyObject.expire !== '' || warrantyObject.invoice !== '') {
      const body: WarrantyObjectEditType = {
        expire: warrantyObject.expire
      }
      if (warrantyObject.invoice !== '') body.invoice = warrantyObject.invoice
      try {
        const response = await axios.put(`${import.meta.env.VITE_APP_API}/warranty/${warData?.warrId}`, body, {
          headers: { authorization: `Bearer ${token}` }
        })
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            <TokenExpiredAlert />
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
      } finally {
        closeModal()
        fetchData()
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
    <>
      {
        pagestate == 'add' ?
          <AddWarrantyButton onClick={openModal}>
            {t('addWarrantyButton')}
            <RiAddLine />
          </AddWarrantyButton>
          :
          <AddWarrantyButton $primary onClick={openModal} >
            <RiEditLine />
          </AddWarrantyButton>
      }
      <Modal size='lg' show={show} onHide={closeModal}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {
                pagestate === "add" ?
                  t('addWarrantyButton')
                  :
                  t('editWarranty')
              }
            </strong>
            <button onClick={closeModal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={pagestate === "add" ? handleSubmit : handleSubmitEdit}>
          <Modal.Body>
            <Row>
              {/* <pre>
                {JSON.stringify(warrantyObject, null, 2)}
              </pre> */}
              {
                pagestate === 'add' &&
                <Col lg={12}>
                  <Form.Label className="w-100">
                    {t('selectDeviceDrop')}
                    <Form.Select onChange={(e) => setWarrantyObject({ ...warrantyObject, devName: e.target.value })} value={warrantyObject.devName} className="mt-2">
                      <option value={''}>Select Device</option>
                      {
                        devices.map((items) => {
                          return <option key={items.devId} value={items.devName}>{items.devSerial}</option>
                        })
                      }
                    </Form.Select>
                  </Form.Label>
                </Col>
              }
              <Col lg={6}>
                <Form.Label className="w-100">
                  {t('invoice')}
                  <Form.Control
                    type="text"
                    value={warrantyObject.invoice}
                    onChange={(e) => setWarrantyObject({ ...warrantyObject, invoice: e.target.value })}
                    className="mt-2"
                  />
                </Form.Label>
              </Col>
              <Col lg={6}>
                <Form.Label className="w-100">
                  {t('endDate')}
                  <Form.Control
                    type="date"
                    value={warrantyObject.expire}
                    onChange={(e) => setWarrantyObject({ ...warrantyObject, expire: e.target.value })}
                    className="mt-2"
                  />
                </Form.Label>
              </Col>
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
