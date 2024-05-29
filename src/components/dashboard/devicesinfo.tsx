import {
  RiCloseLine, RiDoorClosedLine, RiFolderSettingsLine,
  RiPlugLine, RiSdCardMiniLine, RiSettings3Line, RiShieldCheckLine,
  RiSignalWifi1Line, RiTempColdLine
} from "react-icons/ri"
import {
  CardDevBtn,
  DashboardDevicesDetails, DashboardDevicesInfo,
  DeviceDetailsBody, DeviceDetailsBodyInfo, DeviceDetailsBodyimg,
  DeviceDetailsHead, DevicesBodyStatus, ExpandPicture, FormBtn,
  FormFlexBtn, FormSliderRange, ModalHead,
  RangeInputText, SliderFlex, SliderLabelFlex, SliderRangeFlex, TooltipSpan
} from "../../style/style"
import { devicesType } from "../../types/device.type"
import { CardstatusNomal, CardstatusSpecial } from "./cardstatus"
import { FormEvent, useState } from "react"
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap"
import { Slider } from "@mui/material"
import axios from "axios"
import { useTranslation } from "react-i18next"
import Swal from "sweetalert2"
import { userlevel } from "../../authen/authentFunc"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"

type devicesinfo = {
  devicesData: devicesType,
  index: number
}

export default function Devicesinfo(devicesinfo: devicesinfo) {
  const { devicesData } = devicesinfo
  const { expand } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const [showPic, setShowpic] = useState(false)
  const { probe } = devicesData
  const [formdata, setFormdata] = useState({
    adjust_temp: probe[0]?.adjustTemp,
    adjust_hum: probe[0]?.adjustHum
  })
  const [tempvalue, setTempvalue] = useState<number[]>([probe[0]?.tempMin, probe[0]?.tempMax])
  const [humvalue, setHumvalue] = useState<number[]>([probe[0]?.humMin, probe[0]?.humMax])

  const handleTempChange = (_event: Event, newValue: number | number[]) => {
    setTempvalue(newValue as number[])
  }
  const handleHumChange = (_event: Event, newValue: number | number[]) => {
    setHumvalue(newValue as number[])
  }

  const handleAdjusttempChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, adjust_temp: newValue as number })
  }

  const handleAdjusthumChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, adjust_hum: newValue as number })
  }

  const openmodal = () => {
    setShow(true)
  }

  const closemodal = () => {
    setShow(false)
  }

  const openPicmodal = () => {
    setShowpic(true)
  }

  const closePicmodal = () => {
    setShowpic(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/device/${devicesData?.devId}`
    await axios.put(url, {
      temp_min: tempvalue[0],
      temp_max: tempvalue[1],
      hum_min: humvalue[0],
      hum_max: humvalue[1],
      adjust_temp: formdata.adjust_temp,
      adjust_hum: formdata.adjust_hum,
    }, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((response) => {
        if (response.data.status === 200) {
          //
          setShow(false)
          Swal.fire({
            title: t('alert_header_Success'),
            text: response.data.msg,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            //func
          })
        } else {
          Swal.fire({
            title: t('alert_header_Error'),
            text: response.data.msg,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      })
  }

  return (
    <DashboardDevicesInfo>
      <DashboardDevicesDetails $primary={expand}>
        <DeviceDetailsHead>
          <div>
            <strong>
              {devicesData?.devSerial}
            </strong>
            <span>
              {devicesData?.devDetail}
            </span>
          </div>
          <CardDevBtn onClick={openmodal}>
            <RiSettings3Line />
            <TooltipSpan>
              {t('tab_adjust')}
            </TooltipSpan>
          </CardDevBtn>
        </DeviceDetailsHead>
        <DeviceDetailsBody>
          <DeviceDetailsBodyimg
            onClick={openPicmodal}
            src={devicesData?.locPic ? `${import.meta.env.VITE_APP_IMG}${devicesData?.locPic}` : 'https://test.thanespgm.com/img/default-pic.png'}
            alt="device_pic"
            loading="lazy" />
          <DeviceDetailsBodyInfo>
            <div>
              <span>{devicesData?.locInstall ? devicesData?.locInstall : '- -'}</span>
              <span>{t('temperature')}</span>
              <span>{t('min')}: {probe[0]?.tempMin.toFixed(2)}°C {t('max')}: {probe[0]?.tempMax.toFixed(2)}°C</span>
              <span>{t('humidity')}</span>
              <span>{t('min')}: {probe[0]?.humMin.toFixed(2)}% {t('max')}: {probe[0]?.humMax.toFixed(2)}%</span>
              <span>{devicesData?.config?.ip ? devicesData?.config?.ip : '- -'}</span>
            </div>
          </DeviceDetailsBodyInfo>
        </DeviceDetailsBody>
      </DashboardDevicesDetails>
      <DevicesBodyStatus>
        <CardstatusSpecial
          title={t('probe')}
          svg={<RiTempColdLine />}
          valuesone={'T: ' + devicesData?.log[0]?.tempAvg.toFixed(2)}
          valuestwo={'H: ' + devicesData?.log[0]?.humidityAvg.toFixed(2)}
          pipeone={'°C'}
          pipetwo={'%'}
          alertone={Number(devicesData?.log[0]?.tempAvg.toFixed(2)) === 0 || Number(devicesData?.log[0]?.tempAvg.toFixed(2)) >= probe[0]?.tempMax || Number(devicesData?.log[0]?.tempAvg.toFixed(2)) <= probe[0]?.tempMin}
          alerttwo={Number(devicesData?.log[0]?.humidityAvg.toFixed(2)) === 0 || Number(devicesData?.log[0]?.humidityAvg.toFixed(2)) >= probe[0]?.humMax || Number(Number(devicesData?.log[0]?.humidityAvg.toFixed(2))) <= probe[0]?.humMin}
        />
        <CardstatusNomal
          title={t('connect')}
          valuestext={((Number(new Date()) - Number(new Date(devicesData?.log[0]?.createAt))) / 1000) > 10 * 60 ? t('disconnect') : t('connected')}
          svg={<RiSignalWifi1Line />}
          alertone={((Number(new Date()) - Number(new Date(devicesData?.log[0]?.createAt))) / 1000) > 10 * 60}
        />
        {/* <CardstatusNomal
          title={t('connect')}
          valuestext={devicesData?.dev_status !== '0' ? t('connected') : t('disconnect')}
          svg={<RiSignalWifi1Line />}
          alertone={devicesData?.dev_status === '0'}
        /> */}
        <CardstatusNomal
          title={t('doors')}
          valuestext={
            !devicesData?.log[0]?.door1 ||
              !devicesData?.log[0]?.door2 ||
              !devicesData?.log[0]?.door3 ? t('open') : t('close')}
          svg={<RiDoorClosedLine />}
          alertone={
            !devicesData?.log[0]?.door1 ||
            !devicesData?.log[0]?.door2 ||
            !devicesData?.log[0]?.door3
          }
        />
        <CardstatusNomal
          title={t('plug')}
          valuestext={
            devicesData?.log[0]?.ac !== '1' ? t('on') : t('off')
          }
          svg={<RiPlugLine />}
          alertone={devicesData?.log[0]?.ac === '1'}
        />
        <CardstatusNomal
          title={t('batter')}
          valuestext={
            devicesData?.log[0]?.battery + '%'
          }
          svg={<RiTempColdLine />}
          alertone={devicesData?.log[0]?.battery === 0}
        />
        <CardstatusSpecial
          title={t('tempofday')}
          svg={<RiTempColdLine />}
          valuesone={'↑ ' + Number(Math.max(...(devicesData !== undefined ? devicesData?.log.map((items) => items.tempAvg) : [0]))).toFixed(2)}
          valuestwo={'↓ ' + Number(Math.min(...(devicesData !== undefined ? devicesData?.log.map((items) => items.tempAvg) : [0]))).toFixed(2)}
          pipeone={'°C'}
          pipetwo={'°C'}
        />
        <CardstatusNomal
          title={t('sdcard')}
          valuestext={
            devicesData?.log[0]?.sdCard ? t('on') : t('off')
          }
          svg={<RiSdCardMiniLine />}
          alertone={!devicesData?.log[0]?.sdCard}
        />
        <CardstatusSpecial
          title={t('probeanddoor')}
          svg={<RiTempColdLine />}
          valuesone={Number(devicesData?.probe.length)}
          valuestwo={Number(devicesData?.probe[0]?.door)}
          pipetwo={''}
        />
        <CardstatusSpecial
          title={t('warranty_home')}
          svg={<RiShieldCheckLine />}
          valuesone={
            Math.ceil((new Date(devicesData !== undefined ? devicesData?.dateInstall : '2024-01-01').setFullYear(new Date(devicesData !== undefined ? devicesData?.dateInstall : '2024-01-01').getFullYear() + 1) - new Date().getTime()) / (1000 * 60 * 60 * 24))
          }
          valuestwo={t('day')}
          alertone={Math.ceil((new Date(devicesData !== undefined ? devicesData?.dateInstall : '2024-01-01').setFullYear(new Date(devicesData !== undefined ? devicesData?.dateInstall : '2024-01-01').getFullYear() + 1) - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 0}
        />
        <CardstatusNomal
          title={t('repair_home')}
          valuestext={
            '- -'
          }
          svg={<RiFolderSettingsLine />}
        />
      </DevicesBodyStatus>

      <Modal size="lg" show={show} onHide={closemodal}>
        <Modal.Header>
          {/* <pre style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(formdata)}
          </pre> */}
          <ModalHead>
            <strong>
              {devicesData?.devSerial}
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
                    <SliderFlex>
                      <SliderLabelFlex>
                        <span>{t('tempmin')}</span>
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
                        <span>{t('tempmax')}</span>
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
              <Col lg={12}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    <SliderFlex>
                      <SliderLabelFlex>
                        <span>{t('hummin')}</span>
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
                        <span>{t('hummax')}</span>
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
                      <span>{t('adjusttemp')}</span>
                      <div>
                        <RangeInputText type="number"
                          min={-20}
                          max={20}
                          step={.1}
                          disabled={userlevel() === '4'}
                          value={formdata.adjust_temp}
                          onChange={(e) => setFormdata({ ...formdata, adjust_temp: Number(e.target.value) })} />
                        <strong>°C</strong>
                      </div>
                    </SliderLabelFlex>
                    <FormSliderRange
                      $primary="temp"
                      $disabled={userlevel() === '4'}
                    >
                      <Slider
                        color="error"
                        min={-20}
                        max={20}
                        step={.1}
                        disabled={userlevel() === '4'}
                        value={formdata.adjust_temp}
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
                      <span>{t('adjusthum')}</span>
                      <div>
                        <RangeInputText type="number"
                          min={-20}
                          max={20}
                          step={.1}
                          disabled={userlevel() === '4'}
                          value={formdata.adjust_hum}
                          onChange={(e) => setFormdata({ ...formdata, adjust_hum: Number(e.target.value) })} />
                        <strong>%</strong>
                      </div>
                    </SliderLabelFlex>
                    <FormSliderRange
                      $primary="hum"
                      $disabled={userlevel() === '4'}
                    >
                      <Slider
                        color="primary"
                        min={-20}
                        max={20}
                        step={.1}
                        disabled={userlevel() === '4'}
                        value={formdata.adjust_hum}
                        onChange={handleAdjusthumChange}
                        valueLabelDisplay="off" />
                    </FormSliderRange>
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

      <Modal size="xl" show={showPic} onHide={closePicmodal}>
        <Modal.Header>
          {/* <pre style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(formdata)}
          </pre> */}
          <ModalHead>
            <strong>
              {devicesData?.devSerial}
            </strong>
            <button onClick={closePicmodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <ExpandPicture>
              <img
                src={devicesData?.locPic ? `${import.meta.env.VITE_APP_IMG}${devicesData?.locPic}` : 'https://test.thanespgm.com/img/default-pic.png'}
                alt="device_pic" />
            </ExpandPicture>
          </Modal.Body>
        </Form>
      </Modal>
    </DashboardDevicesInfo>
  )
}
