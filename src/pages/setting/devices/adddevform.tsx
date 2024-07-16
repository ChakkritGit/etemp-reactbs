import { AddDevices, FormBtn, FormFlexBtn, ModalHead, ProfileFlex } from '../../../style/style'
import { RiAddLine, RiArrowLeftSLine, RiCloseLine, RiEditLine, RiListSettingsLine, RiMessage3Line } from 'react-icons/ri'
import { devicesType, managedevices } from '../../../types/device.type'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Col, Modal, Row, Form, InputGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import axios, { AxiosError } from 'axios'
import Swal from 'sweetalert2'
import HospitalDropdown from '../../../components/dropdown/hospitalDropdown'
import WardDropdown from '../../../components/dropdown/wardDropdown'
import { useDispatch } from 'react-redux'
import { storeDispatchType } from '../../../stores/store'
import { useSelector } from 'react-redux'
import { DeviceStateStore, UtilsStateStore } from '../../../types/redux.type'
import { fetchDevicesData } from '../../../stores/devicesSlices'
import { responseType } from '../../../types/response.type'
import { ManageConfigAdd, ModeNetworkFlex } from '../../../style/components/manage.config'
import { ModalMuteHead } from '../../../style/components/home.styled'
import { configType } from '../../../types/config.type'
import { client } from '../../../services/mqtt'
import { wardsType } from '../../../types/ward.type'
import { SendOTAtoBoard, UploadButton } from '../../../style/components/firmwareuoload'
import { firmwareType } from '../../../types/component.type'
import { setShowAlert } from '../../../stores/utilsStateSlice'
import { resizeImage } from '../../../constants/constants'

export default function Adddevform(managedevices: managedevices) {
  const { devdata, pagestate } = managedevices
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [formdata, setFormdata] = useState({
    devZone: pagestate !== "add" ? devdata.devZone : '',
    devLocation: pagestate !== "add" ? devdata.locInstall : '',
    groupId: pagestate !== "add" ? devdata.wardId : '',
    devId: pagestate !== "add" ? devdata.devId : '',
    devName: pagestate !== "add" ? devdata.devDetail : '',
    devSn: pagestate !== "add" ? devdata.devSerial : '',
    locationPic: null as File | null,
    macAddWiFi: pagestate !== "add" ? devdata.config.macAddWiFi : ''
  })
  const [Mode, setMode] = useState(1)
  const [hosid, setHosid] = useState('')
  const dispatch = useDispatch<storeDispatchType>()
  const { cookieDecode, tokenDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token, userLevel } = cookieDecode
  const [devicePicture, setDevicePicture] = useState<string>(devdata.locPic ? `${import.meta.env.VITE_APP_IMG}${devdata.locPic}` : '')
  const { config } = devdata
  const [netConfig, setNetConfig] = useState({
    devSerial: config?.devSerial ? config.devSerial : '',
    SSID: config?.ssid ? config.ssid : '',
    Password: config?.ssidPass ? config.ssidPass : '',
    MacAddress: config?.macAddWiFi ? config.macAddWiFi : '',
    IP: config?.ip ? config.ip : '',
    Subnet: config?.subNet ? config.subNet : '',
    Gateway: config?.getway ? config.getway : '',
    DNS: config?.dns ? config.dns : ''
  })
  const [firmwareName, setFirmwareName] = useState<string>('')
  const [firmwareList, setFirmwareList] = useState<firmwareType[]>([])

  const fetchWard = async () => {
    try {
      const response = await axios.get<responseType<wardsType>>(`${import.meta.env.VITE_APP_API}/ward/${devdata.wardId}`, { headers: { authorization: `Bearer ${token}` } })
      setHosid(response.data.data.hospital.hosId)
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

  const openmodal = () => {
    setShow(true)
  }

  const closemodal = () => {
    setShow(false)
  }

  const openmodalConfig = () => {
    setShow(false)
    setShowConfig(true)
  }

  const closemodalConfig = () => {
    setShowConfig(false)
    setShow(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/device`
    if (formdata.devSn !== "") {
      try {
        const response = await axios.post<responseType<devicesType>>(url, {
          devSerial: formdata.devSn,
          createBy: tokenDecode.userId,
          config: {
            macAddWiFi: formdata.macAddWiFi
          }
        }, { headers: { authorization: `Bearer ${token}` } })
        setShow(false)
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        setFormdata({
          devZone: '',
          devLocation: '',
          groupId: '',
          devId: '',
          devName: '',
          devSn: '',
          locationPic: null as File | null,
          macAddWiFi: ''
        })
        dispatch(fetchDevicesData(token))
        client.publish(`${devdata.devSerial}/adj`, 'on')
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
    const url: string = `${import.meta.env.VITE_APP_API}/device/${devdata?.devId}`
    const formData = new FormData()
    formData.append('devZone', formdata.devZone as string)
    formData.append('locInstall', formdata.devLocation as string)
    formData.append('wardId', formdata.groupId as string)
    formData.append('devDetail', formdata.devName as string)
    formData.append('devSerial', formdata.devSn as string)
    if (formdata.locationPic) {
      formData.append('fileupload', formdata.locationPic as File)
    }
    if (formdata.devId !== '') {
      try {
        const response = await axios.put<responseType<devicesType>>(url, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`
          }
        })
        setShow(false)
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        dispatch(fetchDevicesData(token))
        client.publish(`${devdata.devSerial}/adj`, 'on')
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

  const handleSubmitDHCP = async (e: FormEvent) => {
    e.preventDefault()
    const { MacAddress, Password, SSID } = netConfig
    if (SSID !== '') {
      try {
        const bodyData = {
          ssid: SSID,
          ssidPass: Password,
          macAddWiFi: MacAddress,
        }
        const response = await axios.put<responseType<configType>>(`${import.meta.env.VITE_APP_API}/config/${netConfig.devSerial}`,
          bodyData, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        dispatch(fetchDevicesData(token))
        client.publish(`${devdata.devSerial}/adj`, 'on')
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

  const handleSubmitManual = async (e: FormEvent) => {
    e.preventDefault()
    const { DNS, Gateway, IP, Subnet } = netConfig
    if (IP !== '' && Subnet !== '' && Gateway !== '' && DNS !== '') {
      try {
        const bodyData = {
          ip: IP,
          subNet: Subnet,
          getway: Gateway,
          dns: DNS
        }
        const response = await axios.put<responseType<configType>>(`${import.meta.env.VITE_APP_API}/config/${netConfig.devSerial}`,
          bodyData, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        dispatch(fetchDevicesData(token))
        client.publish(`${devdata.devSerial}/adj`, 'on')
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

  const setValuestate = (value: string) => {
    setFormdata({ ...formdata, groupId: value })
  }

  const fileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader()
    const fileInput = e.target
    if (fileInput.files && fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0]

      // Resize the image before setting the state
      resizeImage(selectedFile)
        .then((resizedFile) => {
          reader.readAsDataURL(resizedFile)
          reader.onload = (event) => {
            let img = event.target?.result
            setDevicePicture(img as string)
          }
          setFormdata({ ...formdata, locationPic: resizedFile })
        })
        .catch((error) => {
          console.error('Error resizing image:', error)
        })
    }
  }

  const fetchFirmware = async () => {
    try {
      const response = await axios.get<responseType<firmwareType[]>>(`${import.meta.env.VITE_APP_API}/firmwares`, {
        headers: { authorization: `Bearer ${token}` }
      })
      setFirmwareList(response.data.data)
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

  useEffect(() => {
    if (!token) return
    fetchFirmware()
    if (devdata.wardId) {
      fetchWard()
    }
  }, [token]) // ย้ายไป component หลัก

  return (
    <div>
      {
        pagestate === "add" ?
          <AddDevices onClick={openmodal}>
            {t('addDeviceButton')}
            <RiAddLine />
          </AddDevices>
          :
          <AddDevices onClick={openmodal} $primary>
            <RiEditLine />
          </AddDevices>
      }
      <Modal
        size={pagestate === "edit" ? "lg" : undefined}
        show={show}
        onHide={closemodal}>
        <Modal.Header>
          {/* <pre>
            {JSON.stringify(formdata, null, 2)}
          </pre> */}
          <ModalHead>
            <strong>
              {
                pagestate === "add" ?
                  t('addDeviceButton')
                  :
                  t('editDeviceButton')
              }
            </strong>
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={pagestate === "add" ? handleSubmit : handleSubmitEdit}>
          <Modal.Body>
            <Row>
              {
                pagestate !== "add" ?
                  <>
                    {
                      userLevel !== '2' && userLevel !== '3' && <Col lg={6}>
                        <InputGroup className="mb-3">
                          <Form.Label className="w-100">
                            {t('Hospitals')}
                            <HospitalDropdown
                              setHos_id={setHosid}
                              Hosid={hosid}
                              key={hosid}
                            />
                          </Form.Label>
                        </InputGroup>
                      </Col>
                    }
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className="w-100">
                          {t('Ward')}
                          <WardDropdown
                            setState_ward={setValuestate}
                            Hosid={hosid}
                            groupId={String(devdata?.wardId)}
                            key={devdata?.wardId}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                  </>
                  :
                  <></>
              }
              <Col lg={pagestate === "edit" ? 6 : 12}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('deviceSerialTb')}
                    <Form.Control
                      name='form_label_hosname'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      disabled={pagestate === 'edit'}
                      value={formdata.devSn}
                      onChange={(e) => setFormdata({ ...formdata, devSn: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              {
                pagestate === "add" &&
                <Col lg={pagestate === "add" ? 12 : 6}>
                  <InputGroup className="mb-3">
                    <Form.Label className="w-100">
                      {t('deviceMacAddress')}
                      <Form.Control
                        name='form_label_hosname'
                        spellCheck={false}
                        autoComplete='off'
                        type='text'
                        value={formdata.macAddWiFi}
                        onChange={(e) => setFormdata({ ...formdata, macAddWiFi: e.target.value })}
                      />
                    </Form.Label>
                  </InputGroup>
                </Col>
              }
              {
                pagestate === "edit" ?
                  <>
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className="w-100">
                          {t('deviceNameTb')}
                          <Form.Control
                            name='form_label_hosname'
                            spellCheck={false}
                            autoComplete='off'
                            type='text'
                            value={formdata.devName}
                            onChange={(e) => setFormdata({ ...formdata, devName: e.target.value })}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className="w-100">
                          {t('deviceZone')}
                          <Form.Control
                            name='form_label_hosname'
                            spellCheck={false}
                            autoComplete='off'
                            type='text'
                            value={formdata.devZone}
                            onChange={(e) => setFormdata({ ...formdata, devZone: e.target.value })}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className="w-100">
                          {t('deviceLocationTb')}
                          <Form.Control
                            name='form_label_hosname'
                            spellCheck={false}
                            autoComplete='off'
                            type='text'
                            value={formdata.devLocation}
                            onChange={(e) => setFormdata({ ...formdata, devLocation: e.target.value })}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className="w-auto">
                          {t('devicePicture')}
                          <ProfileFlex $radius={10} $dimension={250}>
                            <div>
                              <img src={devicePicture ? devicePicture : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`} alt="down-picture" />
                              <label htmlFor={'user-file-upload'} >
                                <RiEditLine />
                                <input id="user-file-upload" type="file" onChange={fileSelected} />
                              </label>
                            </div>
                          </ProfileFlex>
                        </Form.Label>
                      </InputGroup>
                    </Col>
                    {
                      userLevel !== '2' && userLevel !== '3' && <Col lg={6}>
                        <Row>
                          <InputGroup className="mb-3">
                            <Form.Label className="w-100">
                              {t('deviceNetwork')}
                              <ManageConfigAdd type='button' onClick={openmodalConfig} className="mt-3">
                                {t('deviceNetwork')}
                                <RiListSettingsLine />
                              </ManageConfigAdd>
                            </Form.Label>
                          </InputGroup>
                        </Row>
                        {
                          userLevel === '0' && <Row>
                            <InputGroup className="mb-3">
                              <Form.Label className="w-100">
                                {t('sendOTA')}
                                <SendOTAtoBoard>
                                  <Form.Select onChange={(e) => setFirmwareName(e.target.value)} value={firmwareName}>
                                    <option key={'select-option'} value="">{t('selectOTA')}</option>
                                    {firmwareList.map((items, index) => (
                                      <option key={index} value={items.fileName}>{items.fileName}</option>
                                    ))}
                                  </Form.Select>
                                  <UploadButton type='button' disabled={firmwareName === ''} onClick={() => {
                                    client.publish(`${devdata.devSerial}/firmware`, firmwareName)
                                  }}>
                                    <RiMessage3Line size={24} />
                                    {t('updateButton')}
                                  </UploadButton>
                                </SendOTAtoBoard>
                              </Form.Label>
                            </InputGroup>
                            <Row>
                              <progress max={100}></progress>
                            </Row>
                          </Row>
                        }
                      </Col>
                    }
                  </>
                  :
                  <></>
              }
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

      <Modal size={"lg"} show={showConfig} onHide={closemodalConfig}>
        <Modal.Header>
          <ModalHead>
            <ModalMuteHead>
              <button onClick={closemodalConfig}>
                <RiArrowLeftSLine />
              </button>
              <strong>
                {t('deviceNetwork')}
              </strong>
            </ModalMuteHead>
            {/* <pre>{JSON.stringify(netConfig, null, 2)}</pre> */}
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={Mode === 1 ? handleSubmitDHCP : handleSubmitManual}>
          <Modal.Body>
            <Row>
              <Col lg={12} className='mb-3'>
                <ModeNetworkFlex>
                  <Form.Check
                    type='radio'
                    label='DHCP'
                    checked={Mode === 1}
                    onChange={() => setMode(1)}
                  />
                  <Form.Check
                    type='radio'
                    label='Manual'
                    checked={Mode === 2}
                    onChange={() => setMode(2)}
                  />
                </ModeNetworkFlex>
              </Col>
              {
                Mode === 1 ?
                  <Row key={Mode}>
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className='w-100'>
                          SSID
                          <Form.Control
                            type='text'
                            id='SSID'
                            value={netConfig.SSID}
                            onChange={(e) => setNetConfig({ ...netConfig, SSID: e.target.value })}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className='w-100'>
                          Password
                          <Form.Control
                            type='Password'
                            id='Password'
                            value={netConfig.Password}
                            onChange={(e) => setNetConfig({ ...netConfig, Password: e.target.value })}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                    <Col lg={12}>
                      <InputGroup className="mb-3">
                        <Form.Label className='w-100'>
                          MacAddress
                          <Form.Control
                            type='text'
                            id='MacAddress'
                            value={netConfig.MacAddress}
                            placeholder='ไม่บังคับ'
                            onChange={(e) => setNetConfig({ ...netConfig, MacAddress: e.target.value })}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                  </Row>
                  :
                  <Row key={Mode}>
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className='w-100'>
                          IP
                          <Form.Control
                            type='text'
                            id='IP'
                            value={netConfig.IP}
                            onChange={(e) => setNetConfig({ ...netConfig, IP: e.target.value })}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className='w-100'>
                          Subnet
                          <Form.Control
                            type='text'
                            id='Subnet'
                            value={netConfig.Subnet}
                            onChange={(e) => setNetConfig({ ...netConfig, Subnet: e.target.value })}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className='w-100'>
                          Gateway
                          <Form.Control
                            type='text'
                            id='Gateway'
                            value={netConfig.Gateway}
                            onChange={(e) => setNetConfig({ ...netConfig, Gateway: e.target.value })}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className='w-100'>
                          DNS
                          <Form.Control
                            type='text'
                            id='DNS'
                            value={netConfig.DNS}
                            onChange={(e) => setNetConfig({ ...netConfig, DNS: e.target.value })}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                  </Row>
              }
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
    </div >
  )
}
