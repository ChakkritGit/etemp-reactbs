import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap"
import {
  FormBtn, FormFlexBtn, FormSliderRange, LineHr, ModalHead, RangeInputText,
  SliderFlex, SliderLabelFlex, SliderRangeFlex
} from "../../style/style"
import { RiArrowDownLine, RiArrowLeftSLine, RiArrowRightLine, RiCloseLine, RiSpeakerLine, RiVolumeMuteLine, RiVolumeUpLine } from "react-icons/ri"
import { Slider } from "@mui/material"
import { AdjustRealTimeFlex, ModalMuteHead, OpenSettingBuzzer } from "../../style/components/home.styled"
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { AsyncThunk } from "@reduxjs/toolkit"
import { devicesType } from "../../types/device.type"
import { useDispatch, useSelector } from "react-redux"
import axios, { AxiosError } from "axios"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import { responseType } from "../../types/response.type"
import { client } from "../../services/mqtt"
import { configType } from "../../types/config.type"
import { ConfigBtn } from "../../style/components/manage.config"
import { MuteEtemp } from "../../style/components/sound.setting"
import { storeDispatchType } from "../../stores/store"
import { setRefetchdata, setShowAlert } from "../../stores/utilsStateSlice"
import Select, { SingleValue } from 'react-select'
import { useTheme } from "../../theme/ThemeProvider"

type modalAdjustType = {
  fetchData: AsyncThunk<devicesType[], string, {}>,
  devicesdata: devicesType,
  setShow: Dispatch<SetStateAction<boolean>>,
  show: boolean
}

type Option = {
  value: string,
  label: string,
}

type Ward = {
  probeId: string,
  probeName: string,
}

const ModalAdjust = (modalProps: modalAdjustType) => {
  const { fetchData, devicesdata, show, setShow } = modalProps
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { tokenDecode, cookieDecode, reFetchData } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const [tempvalue, setTempvalue] = useState<number[]>([Number(devicesdata.probe[0]?.tempMin), Number(devicesdata.probe[0]?.tempMax)])
  const [humvalue, setHumvalue] = useState<number[]>([Number(devicesdata.probe[0]?.humMin), Number(devicesdata.probe[0]?.humMax)])
  const [showSetting, setShowSetting] = useState(false)
  const [formData, setFormData] = useState({
    adjust_temp: devicesdata.probe[0]?.adjustTemp,
    adjust_hum: devicesdata.probe[0]?.adjustHum
  })
  const [muteMode, setMuteMode] = useState({
    choichOne: devicesdata.config.notiTime === "0" ? 'immediately' : 'after',
    choichtwo: devicesdata.config.backToNormal === "0" ? 'donotsend' : 'send',
    choichthree: devicesdata.config.repeat === "0" ? "onetime" : 'every',
    choichfour: devicesdata.config.mobileNoti === "1" ? 'on' : 'off'
  })
  const [sendTime, setSendTime] = useState({
    after: devicesdata.config.notiTime > "0" ? Number(devicesdata.config.notiTime) : 1,
    every: devicesdata.config.repeat !== "0" ? Number(devicesdata.config.repeat) : 1
  })
  const [mqttData, setMqttData] = useState({ temp: 0, humi: 0 })
  const [selectProbeI, setSelectProbeI] = useState(devicesdata.probe[0]?.probeId)
  const [muteEtemp, setMuteEtemp] = useState(false)
  const { choichOne, choichfour, choichthree, choichtwo } = muteMode
  const { userLevel } = tokenDecode
  const { theme } = useTheme()

  const handleTempChange = (_event: Event, newValue: number | number[]) => {
    setTempvalue(newValue as number[])
  }
  const handleHumChange = (_event: Event, newValue: number | number[]) => {
    setHumvalue(newValue as number[])
  }

  const handleAdjusttempChange = (_event: Event, newValue: number | number[]) => {
    setFormData({ ...formData, adjust_temp: newValue as number })
  }

  const handleAdjusthumChange = (_event: Event, newValue: number | number[]) => {
    setFormData({ ...formData, adjust_hum: newValue as number })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const url: string = `${import.meta.env.VITE_APP_API}/probe/${selectProbeI}`
      const bodyData = {
        tempMin: tempvalue[0],
        tempMax: tempvalue[1],
        humMin: humvalue[0],
        humMax: humvalue[1],
        adjustTemp: formData.adjust_temp,
        adjustHum: formData.adjust_hum,
      }
      const response = await axios.put<responseType<devicesType>>(url, bodyData, { headers: { authorization: `Bearer ${token}` } })
      // setShow(false)
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
      fetchData(token)
      client.publish(`${devicesdata.devSerial}/adj`, 'on')
      dispatch(setRefetchdata(!reFetchData))
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
  }

  const handleSubmitNoti = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/config/${devicesdata.devSerial}`
    const bodyData = {
      notiTime: muteMode.choichOne === "immediately" ? "0" : sendTime.after.toString(),
      backToNormal: muteMode.choichtwo === "send" ? "1" : "0",
      repeat: muteMode.choichthree === "onetime" ? "0" : sendTime.every.toString(),
      mobileNoti: muteMode.choichfour === "on" ? "1" : "0"
    }
    try {
      const response = await axios.put<responseType<configType>>(url, bodyData, { headers: { authorization: `Bearer ${token}` } })
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
      fetchData(token)
      client.publish(`${devicesdata.devSerial}/adj`, 'on')
      dispatch(setRefetchdata(!reFetchData))
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
  }

  const closemodal = () => {
    client.publish(`${devicesdata.devSerial}/temp`, 'off')
    setShow(false)
  }

  const openSetting = () => {
    setShow(false)
    setShowSetting(true)
  }

  const closeSetting = () => {
    setShowSetting(false)
    setShow(true)
  }

  useEffect(() => {
    if (show) {
      client.subscribe(`${devicesdata.devSerial}/temp/real`, (err) => {
        if (err) {
          console.error("MQTT Suubscribe Error", err)
        }
      })

      client.publish(`${devicesdata.devSerial}/temp`, 'on')

      client.on('message', (_topic, message) => {
        setMqttData(JSON.parse(message.toString()))
      })

      client.on("error", (err) => {
        console.error("MQTT Error: ", err)
        client.end()
      })

      client.on("reconnect", () => {
        console.error("MQTT Reconnecting...")
      })
    }
  }, [show])

  const selectProbe = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setSelectProbeI(selectedValue)
    const newProbeData = devicesdata.probe.filter((items) => items.probeId === selectedValue)
    setFormData({ ...formData, adjust_temp: newProbeData[0]?.adjustTemp, adjust_hum: newProbeData[0]?.adjustHum })
    setHumvalue([newProbeData[0]?.humMin, newProbeData[0]?.humMax])
    setTempvalue([newProbeData[0]?.tempMin, newProbeData[0]?.tempMax])
  }

  const switchMute = () => {
    setMuteEtemp(!muteEtemp)
  }

  useEffect(() => {
    if (muteEtemp) {
      client.publish(`${devicesdata.devSerial}/mute/short`, 'on')
    }
  }, [muteEtemp])

  const mapOptions = <T, K extends keyof T>(data: T[], valueKey: K, labelKey: K): Option[] =>
    data.map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string ?? t('nameNotRegister')
    }))

  const mapDefaultValue = <T, K extends keyof T>(data: T[], id: string, valueKey: K, labelKey: K): Option | undefined =>
    data.filter(item => item[valueKey] === id).map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string ?? t('nameNotRegister')
    }))[0]

  return (
    <>
      <Modal size="lg" show={show} onHide={closemodal}>
        <Modal.Header>
          {/* <pre style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(formData)}
          </pre> */}
          <ModalHead>
            <strong>
              {devicesdata.devSerial}
            </strong>
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Form.Label>
                <span><b>{t('selectProbe')}</b></span>
                <LineHr />
                <Select
                  options={mapOptions<Ward, keyof Ward>(devicesdata.probe, 'probeId', 'probeName')}
                  defaultValue={mapDefaultValue<Ward, keyof Ward>(devicesdata.probe, selectProbeI, 'probeId', 'probeName')}
                  onChange={selectProbe}
                  autoFocus={false}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white)",
                      borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                      boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                      borderRadius: "var(--border-radius-big)"
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: 'var(--main-color)',
                      primary: 'var(--main-color)',
                    },
                  })}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </Form.Label>
            </Row>
            <Row className="mt-3">
              <Form.Label className="w-100 form-label">
                <span><b>{t('adjustMents')}</b></span>
                <LineHr />
              </Form.Label>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    <SliderFlex>
                      <SliderLabelFlex>
                        <span>{t('tempMin')}</span>
                        <div>
                          <RangeInputText type="number"
                            min={-40}
                            max={tempvalue[1]}
                            step={.1}
                            value={tempvalue[0]}
                            onChange={(e) => setTempvalue([Number(e.target.value), tempvalue[1]])} />
                          <strong>°C</strong>
                        </div>
                      </SliderLabelFlex>
                      <SliderLabelFlex>
                        <span>{t('tempMax')}</span>
                        <div>
                          <RangeInputText type="number"
                            min={tempvalue[0]}
                            max={120}
                            step={.1}
                            value={tempvalue[1]}
                            onChange={(e) => setTempvalue([tempvalue[0], Number(e.target.value)])} />
                          <strong>°C</strong>
                        </div>
                      </SliderLabelFlex>
                    </SliderFlex>
                    <SliderRangeFlex $rangename={'temp'}>
                      <Slider
                        value={tempvalue}
                        onChange={handleTempChange}
                        valueLabelDisplay="off"
                        disableSwap
                        min={-40}
                        max={120}
                        step={.1}
                      />
                    </SliderRangeFlex>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    <SliderFlex>
                      <SliderLabelFlex>
                        <span>{t('humiMin')}</span>
                        <div>
                          <RangeInputText type="number"
                            min={0}
                            max={humvalue[1]}
                            step={.1}
                            value={humvalue[0]}
                            onChange={(e) => setHumvalue([Number(e.target.value), humvalue[1]])} />
                          <strong>%</strong>
                        </div>
                      </SliderLabelFlex>
                      <SliderLabelFlex>
                        <span>{t('humiMax')}</span>
                        <div>
                          <RangeInputText type="number"
                            min={humvalue[0]}
                            max={100}
                            step={.1}
                            value={humvalue[1]}
                            onChange={(e) => setHumvalue([humvalue[0], Number(e.target.value)])} />
                          <strong>%</strong>
                        </div>
                      </SliderLabelFlex>
                    </SliderFlex>
                    <SliderRangeFlex $rangename={'hum'}>
                      <Slider
                        value={humvalue}
                        onChange={handleHumChange}
                        valueLabelDisplay="off"
                        disableSwap
                        min={0}
                        max={100}
                        step={.1}
                      />
                    </SliderRangeFlex>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    <SliderLabelFlex>
                      <span>{t('adjustTemp')}</span>
                      <div>
                        <RangeInputText type="number"
                          min={-20}
                          max={20}
                          step={.1}
                          disabled={userLevel === '3'}
                          value={formData.adjust_temp}
                          onChange={(e) => setFormData({ ...formData, adjust_temp: Number(e.target.value) })} />
                        <strong>°C</strong>
                      </div>
                    </SliderLabelFlex>
                    <FormSliderRange
                      $primary="temp"
                      $disabled={userLevel === '3'}
                    >
                      <Slider
                        color="error"
                        min={-20}
                        max={20}
                        step={.01}
                        disabled={userLevel === '3'}
                        value={formData.adjust_temp}
                        onChange={handleAdjusttempChange}
                        valueLabelDisplay="off" />
                    </FormSliderRange>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    <SliderLabelFlex>
                      <span>{t('adjustHumi')}</span>
                      <div>
                        <RangeInputText type="number"
                          min={-20}
                          max={20}
                          step={.01}
                          disabled={userLevel === '3'}
                          value={formData.adjust_hum}
                          onChange={(e) => setFormData({ ...formData, adjust_hum: Number(e.target.value) })} />
                        <strong>%</strong>
                      </div>
                    </SliderLabelFlex>
                    <FormSliderRange
                      $primary="hum"
                      $disabled={userLevel === '3'}
                    >
                      <Slider
                        color="primary"
                        min={-20}
                        max={20}
                        step={.1}
                        disabled={userLevel === '3'}
                        value={formData.adjust_hum}
                        onChange={handleAdjusthumChange}
                        valueLabelDisplay="off" />
                    </FormSliderRange>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={12}>
                <AdjustRealTimeFlex $primary={Number((mqttData.temp + formData.adjust_temp).toFixed(2)) >= tempvalue[1] || Number((mqttData.temp + formData.adjust_temp).toFixed(2)) <= tempvalue[0]}>
                  <div>
                    <span>{t('currentTemp')}</span>
                    <div>
                      <span>
                        <span>{mqttData.temp.toFixed(2)}</span> °C
                      </span>
                    </div>
                  </div>
                  <RiArrowRightLine size={32} fill="grey" />
                  <RiArrowDownLine size={32} fill="grey" />
                  <div>
                    <span>{t('adjustAfterTemp')}</span>
                    <div>
                      <span>
                        <span>{(mqttData.temp + formData.adjust_temp - devicesdata.probe[0]?.adjustTemp).toFixed(2)}</span> °C
                      </span>
                    </div>
                  </div>
                </AdjustRealTimeFlex>
              </Col>
              <Col lg={12}>
                <Form.Label className="w-100">
                  <span><b>{t('muteSetting')}</b></span>
                  <LineHr />
                </Form.Label>
              </Col>
              <Col lg={6}>
                <Form.Label className="w-100">
                  <span>iTEMP</span>
                  <OpenSettingBuzzer type="button" className="mt-3" onClick={openSetting}>
                    <RiSpeakerLine size={24} />
                    <span>{t('notificationSettings')}</span>
                  </OpenSettingBuzzer>
                </Form.Label>
              </Col>
              <Col lg={6}>
                <Form.Label className="w-100">
                  <span>eTEMP</span>
                  {
                    devicesdata.devSerial.substring(0, 3) === "eTP" &&
                    <MuteEtemp type="button" className="mt-3" onClick={switchMute} $primary={muteEtemp}>
                      <div className="icon">
                        {muteEtemp ? <RiVolumeMuteLine /> : <RiVolumeUpLine />}
                      </div>
                    </MuteEtemp>
                  }
                </Form.Label>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('adjustButtonSubmit')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal size="lg" show={showSetting} onHide={closeSetting}>
        <Modal.Header>
          <ModalHead>
            <ModalMuteHead>
              <button onClick={closeSetting}>
                <RiArrowLeftSLine />
              </button>
              <span>
                {t('notificationSettings')}
              </span>
            </ModalMuteHead>
            {/* <pre>{JSON.stringify(muteMode, null, 2)}</pre> */}
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmitNoti}>
          <Modal.Body>
            <Row>
              <Col lg={6}>
                <Row>
                  <Row>
                    <span>{t('choiceOne')}</span>
                  </Row>
                  <Row>
                    <Col className="mt-2">
                      <Form.Check
                        type='radio'
                        id='MessageImmediately'
                        label={t('messageimmediately')}
                        checked={choichOne === 'immediately'}
                        onChange={() => setMuteMode({ ...muteMode, choichOne: 'immediately' })}
                      />
                      <Form.Check
                        type='radio'
                        id='MessageAfter'
                        label={t('messageAfter')}
                        checked={choichOne === 'after'}
                        onChange={() => setMuteMode({ ...muteMode, choichOne: 'after' })}
                      />
                    </Col>
                    {choichOne === 'after' && <InputGroup className="mb-3 mt-2">
                      <ConfigBtn type="button" onClick={() => sendTime.after >= 2 && setSendTime({ ...sendTime, after: sendTime.after - 1 })}>-</ConfigBtn>
                      <Form.Control
                        type="number"
                        step={1}
                        min={0}
                        max={10}
                        value={sendTime.after}
                        onChange={(e) => setSendTime({ ...sendTime, after: Number(e.target.value) })}
                      />
                      <ConfigBtn type="button" onClick={() => sendTime.after <= 9 && setSendTime({ ...sendTime, after: sendTime.after + 1 })}>+</ConfigBtn>
                    </InputGroup>}
                  </Row>
                </Row>
                <Row className="mt-3">
                  <Row>
                    <span>{t('choiceTwo')}</span>
                  </Row>
                  <Row>
                    <Col className="mt-2">
                      <Form.Check
                        type='radio'
                        id='MessageSend'
                        label={t('messageSend')}
                        checked={choichtwo === 'send'}
                        onChange={() => setMuteMode({ ...muteMode, choichtwo: 'send' })}
                      />
                      <Form.Check
                        type='radio'
                        id='MessageDoNotSend'
                        label={t('messageDonotSend')}
                        checked={choichtwo === 'donotsend'}
                        onChange={() => setMuteMode({ ...muteMode, choichtwo: 'donotsend' })}
                      />
                    </Col>
                  </Row>
                </Row>
              </Col>
              <Col lg={6}>
                <Row className="mt-lg-0 mt-3">
                  <Row>
                    <span>{t('choiceThree')}</span>
                  </Row>
                  <Row>
                    <Col className="mt-2">
                      <Form.Check
                        type='radio'
                        id='MessageOneTime'
                        label={t('messageOneTime')}
                        checked={choichthree === 'onetime'}
                        onChange={() => setMuteMode({ ...muteMode, choichthree: 'onetime' })}
                      />
                      <Form.Check
                        type='radio'
                        id='MessageEvery'
                        label={t('messageEvery')}
                        checked={choichthree === 'every'}
                        onChange={() => setMuteMode({ ...muteMode, choichthree: 'every' })}
                      />
                      {choichthree === 'every' && <InputGroup className="mb-3 mt-2">
                        <ConfigBtn type="button" onClick={() => sendTime.every >= 2 && setSendTime({ ...sendTime, every: sendTime.every - 1 })}>-</ConfigBtn>
                        <Form.Control
                          type="number"
                          step={1}
                          min={0}
                          max={10}
                          value={sendTime.every}
                          onChange={(e) => setSendTime({ ...sendTime, every: Number(e.target.value) })}
                        />
                        <ConfigBtn type="button" onClick={() => sendTime.every <= 9 && setSendTime({ ...sendTime, every: sendTime.every + 1 })}>+</ConfigBtn>
                      </InputGroup>}
                    </Col>
                  </Row>
                </Row>
                <Row className="mt-3">
                  <Row>
                    <span>{t('choiceFour')}</span>
                  </Row>
                  <Row>
                    <Col className="mt-2">
                      <Form.Check
                        type='radio'
                        id='MessageOn'
                        label={t('messageOn')}
                        checked={choichfour === 'on'}
                        onChange={() => setMuteMode({ ...muteMode, choichfour: 'on' })}
                      />
                      <Form.Check
                        type='radio'
                        id='MessageOff'
                        label={t('messageOff')}
                        checked={choichfour === 'off'}
                        onChange={() => setMuteMode({ ...muteMode, choichfour: 'off' })}
                      />
                    </Col>
                  </Row>
                </Row>
              </Col>
            </Row>

          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('notificationButtonSubmit')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default ModalAdjust