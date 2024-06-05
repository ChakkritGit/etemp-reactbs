import { useTranslation } from "react-i18next";
import { ManageProbeAdd } from "../../../style/components/manage.probe";
import { addprobeProps } from "../../../types/prop.type";
import { RiAddLine, RiCloseLine, RiEditLine } from "react-icons/ri";
import { ChangeEvent, FormEvent, useState } from "react";
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { FormBtn, FormFlexBtn, FormSliderRange, ModalHead, RangeInputText, SliderFlex, SliderLabelFlex, SliderRangeFlex } from "../../../style/style";
import { Slider } from "@mui/material";
import { DeviceState, DeviceStateStore, UtilsStateStore } from "../../../types/redux.type";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";
import { responseType } from "../../../types/response.type";
import { probeType } from "../../../types/probe.type";
import { storeDispatchType } from "../../../stores/store";
import { fetchProbeData } from "../../../stores/probeSlice";
import { client } from "../../../services/mqtt";

export default function Addprobe(addprobe: addprobeProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { pagestate, probeData } = addprobe
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const { token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const [show, setShow] = useState(false)
  const [formdata, setFormdata] = useState({
    probeName: pagestate !== "add" ? probeData?.probeName : '',
    probeType: pagestate !== "add" ? probeData?.probeType : '',
    probeCh: pagestate !== "add" ? probeData?.probeCh : '',
    devId: pagestate !== "add" ? probeData?.devId : '',
    adjust_temp: pagestate !== "add" ? probeData?.adjustTemp : '',
    adjust_hum: pagestate !== "add" ? probeData?.adjustHum : '',
    delay_time: pagestate !== "add" ? probeData?.delayTime : '',
    door: pagestate !== "add" ? probeData?.door : '',
    location: pagestate !== "add" ? probeData?.location : '',
    tempvalue: [pagestate !== "add" ? Number(probeData?.tempMin) : 0, pagestate !== "add" ? Number(probeData?.tempMax) : 0],
    humvalue: [pagestate !== "add" ? Number(probeData?.humMin) : 0, pagestate !== "add" ? Number(probeData?.humMax) : 0]
  })

  const openmodal = () => {
    setShow(true)
  }

  const closemodal = () => {
    setShow(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/probe`
    const bodyData = {
      probeName: formdata.probeName,
      probeType: formdata.probeType,
      probeCh: formdata.probeCh,
      devId: formdata.devId,
      adjustTemp: formdata.adjust_temp,
      adjustHum: formdata.adjust_hum,
      delayTime: formdata.delay_time,
      door: Number(formdata.door),
      location: formdata.location,
      tempMin: formdata.tempvalue[0],
      tempMax: formdata.tempvalue[1],
      humMin: formdata.humvalue[0],
      humMax: formdata.humvalue[1],
    }
    if (formdata.devId !== '' && formdata.adjust_temp !== '' && formdata.adjust_hum !== '' && formdata.door !== '' && formdata.delay_time !== ''
      && formdata.probeName !== '' && formdata.probeType !== '' && formdata.probeCh !== '' && formdata.location !== '' && formdata.tempvalue !== null && formdata.humvalue !== null) {
      try {
        const response = await axios.post<responseType<probeType>>(url, bodyData, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        Swal.fire({
          title: t('alert_header_Success'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        setFormdata({ ...formdata, tempvalue: [0, 0] })
        closemodal()
        dispatch(fetchProbeData(token))
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
    const bodyData = {
      probeName: formdata.probeName,
      probeType: formdata.probeType,
      probeCh: formdata.probeCh,
      devId: formdata.devId,
      adjustTemp: formdata.adjust_temp,
      adjustHum: formdata.adjust_hum,
      delayTime: formdata.delay_time,
      door: Number(formdata.door),
      location: formdata.location,
      tempMin: formdata.tempvalue[0],
      tempMax: formdata.tempvalue[1],
      humMin: formdata.humvalue[0],
      humMax: formdata.humvalue[1],
    }
    if (formdata.devId !== '' && formdata.adjust_temp !== '' && formdata.adjust_hum !== '' && formdata.door !== '' && formdata.delay_time !== ''
      && formdata.probeName !== '' && formdata.probeType !== '' && formdata.probeCh !== '' && formdata.location !== '' && formdata.tempvalue !== null && formdata.humvalue !== null) {
      try {
        const response = await axios.put<responseType<probeType>>(`${import.meta.env.VITE_APP_API}/probe/${probeData?.probeId}`, bodyData, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        Swal.fire({
          title: t('alert_header_Success'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        closemodal()
        dispatch(fetchProbeData(token))
        client.publish(`${probeData?.device.devSerial}/adj`, 'on')
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

  const handleTempChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, tempvalue: newValue as number[] })
  }
  const handleHumChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, humvalue: newValue as number[] })
  }
  const handleAdjusttempChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, adjust_temp: newValue as number })
  }
  const handleAdjusthumChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, adjust_hum: newValue as number })
  }

  const delayTime = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormdata({ ...formdata, delay_time: e.target.value })
  }
  const doorSelected = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormdata({ ...formdata, door: e.target.value })
  }
  const deviceSelected = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormdata({ ...formdata, devId: e.target.value })
  }
  const channelSelected = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormdata({ ...formdata, probeCh: e.target.value })
  }

  const delayTimeArray = [
    { value: '5', name: '5 นาที' },
    { value: '15', name: '15 นาที' },
    { value: '30', name: '30 นาที' },
    { value: '60', name: '1 ชั่วโมง' },
    { value: '120', name: '2 ชั่วโมง' },
    { value: '240', name: '4 ชั่วโมง' },
  ]

  const doorArray = [
    { value: '1', name: '1 ประตู' },
    { value: '2', name: '2 ประตู' },
    { value: '3', name: '3 ประตู' },
  ]

  const channelArray = [
    { value: '1', name: '1' },
    { value: '2', name: '2' },
    { value: '3', name: '3 ' },
    { value: '4', name: '4 ' },
    { value: '5', name: '5 ' },
  ]

  return (
    <>
      {
        pagestate == 'add' ?
          <ManageProbeAdd onClick={openmodal}>
            {t('เพิ่มโพรบ')}
            <RiAddLine />
          </ManageProbeAdd>
          :
          <ManageProbeAdd onClick={openmodal} style={{ width: '30px', height: '30px' }} >
            <RiEditLine />
          </ManageProbeAdd>
      }
      <Modal size={"lg"} show={show} onHide={closemodal}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {
                pagestate === "add" ?
                  t('เพิ่มโพรบ')
                  :
                  t('แก้ไขโพรบ')
              }
            </strong>
            {/* <pre>{JSON.stringify(formdata, null, 2)}</pre> */}
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={pagestate === "add" ? handleSubmit : handleSubmitedit}>
          <Modal.Body>
            <Row>
              {
                pagestate === "add" ?
                  <Col lg={12}>
                    <InputGroup className="mb-3">
                      <Form.Label className="w-100">
                        {t('เลือกอุปกรณ์')}
                        <Form.Select onChange={deviceSelected} name="field_select_hos" value={formdata.devId || '0'}>
                          <option value={'0'} disabled={!probeData?.devId}>
                            เลือกอุปกรณ์
                          </option>
                          {devices.map((items, index) => {
                            const optionKey = `option_${index}`
                            return (
                              <option key={optionKey} value={items.devId}>
                                {items.devSerial}
                              </option>
                            )
                          })}
                        </Form.Select>
                      </Form.Label>
                    </InputGroup>
                  </Col>
                  :
                  <></>
              }
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('ชื่อโพรบ')}
                    <Form.Control
                      name='form_label_hosaddress'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={formdata.probeName}
                      onChange={(e) => setFormdata({ ...formdata, probeName: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('ประเภทโพรบ')}
                    <Form.Control
                      name='form_label_hosaddress'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={formdata.probeType}
                      onChange={(e) => setFormdata({ ...formdata, probeType: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={12}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('ตำแหน่งติดตั้งโพรบ')}
                    <Form.Control
                      name='form_label_hosaddress'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={formdata.location}
                      onChange={(e) => setFormdata({ ...formdata, location: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={4}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('device_delay_time')}
                    <Form.Select onChange={delayTime} name="field_select_hos" value={formdata.delay_time || '0'}>
                      <option value={'0'} disabled={!probeData?.delayTime}>
                        เลือกดีเลย์
                      </option>
                      {delayTimeArray.map((item, index) => {
                        const optionKey = `option_${index}`
                        return (
                          <option key={optionKey} value={item.value}>
                            {item.name}
                          </option>
                        )
                      })}
                    </Form.Select>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={4}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('device_door')}
                    <Form.Select onChange={doorSelected} name="field_select_hos" value={formdata.door || '0'}>
                      <option value={'0'} disabled={!probeData?.door}>
                        เลือกประตู
                      </option>
                      {doorArray.map((item, index) => {
                        const optionKey = `option_${index}`
                        return (
                          <option key={optionKey} value={item.value}>
                            {item.name}
                          </option>
                        )
                      })}
                    </Form.Select>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={4}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('ช่องโพรบ')}
                    <Form.Select onChange={channelSelected} name="field_select_hos" value={formdata.probeCh || '0'}>
                      <option value={'0'} disabled={!probeData?.probeCh}>
                        เลือกแชนแนล
                      </option>
                      {channelArray.map((item, index) => {
                        const optionKey = `option_${index}`
                        return (
                          <option key={optionKey} value={item.value}>
                            {item.name}
                          </option>
                        )
                      })}
                    </Form.Select>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={12}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    <SliderFlex>
                      <SliderLabelFlex>
                        <span>temp min</span>
                        <div>
                          <RangeInputText type="number"
                            min={-40}
                            max={formdata.tempvalue[1]}
                            step={.1}
                            value={formdata.tempvalue[0]}
                            onChange={(e) => setFormdata({ ...formdata, tempvalue: [Number(e.target.value), formdata.tempvalue[1]] })} />
                          <strong>°C</strong>
                        </div>
                      </SliderLabelFlex>
                      <SliderLabelFlex>
                        <span>temp max</span>
                        <div>
                          <RangeInputText type="number"
                            min={formdata.tempvalue[0]}
                            max={120}
                            step={.1}
                            value={formdata.tempvalue[1]}
                            onChange={(e) => setFormdata({ ...formdata, tempvalue: [formdata.tempvalue[0], Number(e.target.value)] })} />
                          <strong>°C</strong>
                        </div>
                      </SliderLabelFlex>
                    </SliderFlex>
                    <SliderRangeFlex $rangename={'temp'}>
                      <Slider
                        value={formdata.tempvalue}
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
                        <span>hum min</span>
                        <div>
                          <RangeInputText type="number"
                            min={0}
                            max={formdata.humvalue[1]}
                            step={.1}
                            value={formdata.humvalue[0]}
                            onChange={(e) => setFormdata({ ...formdata, humvalue: [Number(e.target.value), formdata.humvalue[1]] })} />
                          <strong>%</strong>
                        </div>
                      </SliderLabelFlex>
                      <SliderLabelFlex>
                        <span>hum max</span>
                        <div>
                          <RangeInputText type="number"
                            min={formdata.humvalue[0]}
                            max={100}
                            step={.1}
                            value={formdata.humvalue[1]}
                            onChange={(e) => setFormdata({ ...formdata, humvalue: [formdata.humvalue[0], Number(e.target.value)] })} />
                          <strong>%</strong>
                        </div>
                      </SliderLabelFlex>
                    </SliderFlex>
                    <SliderRangeFlex $rangename={'hum'}>
                      <Slider
                        value={formdata.humvalue}
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
                      <span>{t('device_adjust_temp')}</span>
                      <div>
                        <RangeInputText type="number"
                          min={-20}
                          max={20}
                          step={.1}
                          value={formdata.adjust_temp}
                          onChange={(e) => setFormdata({ ...formdata, adjust_temp: Number(e.target.value) })} />
                        <strong>°C</strong>
                      </div>
                    </SliderLabelFlex>
                    <FormSliderRange
                      $primary='temp'>
                      <Slider
                        color="error"
                        min={-20}
                        max={20}
                        step={.1}
                        value={Number(formdata.adjust_temp)}
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
                      <span>{t('device_adjust_hum')}</span>
                      <div>
                        <RangeInputText type="number"
                          min={-20}
                          max={20}
                          step={.1}
                          value={formdata.adjust_hum}
                          onChange={(e) => setFormdata({ ...formdata, adjust_hum: Number(e.target.value) })} />
                        <strong>%</strong>
                      </div>
                    </SliderLabelFlex>
                    <FormSliderRange
                      $primary='hum'>
                      <Slider
                        color="primary"
                        min={-20}
                        max={20}
                        step={.1}
                        value={Number(formdata.adjust_hum)}
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
    </>
  )
}
