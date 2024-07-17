import { RiCloseLine, RiDragMove2Fill } from 'react-icons/ri'
import { BeforeSeq, OpenModalButton } from '../../../style/components/manage.dev'
import { devicesType } from '../../../types/device.type'
import { ChangeEvent, FormEvent, useState } from 'react'
import { Col, Form, InputGroup, Modal, Row } from 'react-bootstrap'
import { FormBtn, FormFlexBtn, ModalHead } from '../../../style/style'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { DeviceState, DeviceStateStore, UtilsStateStore } from '../../../types/redux.type'
import Swal from 'sweetalert2'
import axios, { AxiosError } from 'axios'
import { setShowAlert } from '../../../stores/utilsStateSlice'
import { storeDispatchType } from '../../../stores/store'
import { fetchDevicesData } from '../../../stores/devicesSlices'

type moveSeqType = {
  devData: devicesType
}

export default function Moveseqdev({ devData }: moveSeqType) {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const { devId, devSeq, devSerial } = devData
  const [show, setShow] = useState(false)
  const [selectDev, setSelectDev] = useState({
    devSerial: '- -',
    devId: '',
    devSeq: 0
  })

  const openModal = () => {
    setShow(true)
  }

  const closeModal = () => {
    setShow(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (devId !== '' && devSeq !== 0 && selectDev.devId !== '' && selectDev.devSeq !== 0) {
      try {
        const response = await axios.patch(`${import.meta.env.VITE_APP_API}/device/${devId}/${selectDev.devId}`,
          {
            devSeq: devSeq,
            afterDevSeq: selectDev.devSeq
          },
          {
            headers: { authorization: `Bearer ${token}` }
          })
        dispatch(fetchDevicesData(token))
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

  const setWardId = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectData: devicesType = JSON.parse(e.target.value)
    const { devId, devSeq, devSerial } = selectData
    setSelectDev({ devSerial: devSerial, devId: devId, devSeq: devSeq })
  }


  return (
    <>
      <OpenModalButton onClick={openModal}>
        <RiDragMove2Fill />
      </OpenModalButton>

      <Modal
        size={"lg"}
        show={show}
        onHide={closeModal}>
        <Modal.Header>
          {/* <pre>
            {JSON.stringify(formdata, null, 2)}
          </pre> */}
          <ModalHead>
            <strong>
              move
            </strong>
            <button onClick={closeModal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100 text-center">
                    <b>{t('sourceSeq')}</b>
                    <BeforeSeq>
                      <div>
                        <span>{t('deviceSerialTb')}</span>
                        <span>{devSerial}</span>
                      </div>
                      <div>
                        <span>{devSeq}</span>
                        <span>{t('deviceSeq')}</span>
                      </div>
                    </BeforeSeq>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100 text-center">
                    <b>{t('destSeq')}</b>
                    <BeforeSeq>
                      <div>
                        <span>{t('deviceSerialTb')}</span>
                        <span>{selectDev.devSerial}</span>
                      </div>
                      <div>
                        <span>{selectDev.devSeq}</span>
                        <span>{t('deviceSeq')}</span>
                      </div>
                    </BeforeSeq>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={12}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('deviceSerialTb')}
                    <Form.Select onChange={setWardId} name="fieldSelectWard" value={JSON.stringify(selectDev)} >
                      <option value={JSON.stringify({
                        devSerial: '- -',
                        devId: '',
                        devSeq: 0
                      })}>{t('selectDeviceDrop')}</option>
                      {
                        devices.filter((f) => f.devId !== devId).map((item) => {
                          return <option key={item.devId} value={JSON.stringify({ devSerial: item.devSerial, devId: item.devId, devSeq: item.devSeq })}>{item.devSerial}</option>
                        })
                      }
                    </Form.Select>
                  </Form.Label>
                </InputGroup>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('submitButton')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
