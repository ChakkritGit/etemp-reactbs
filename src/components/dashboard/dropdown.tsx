import { ChangeEvent, useState } from "react"
import { Form } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { DeviceState, DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { setDeviceId, setSerial } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"
import { setDefaultLogs } from "../../stores/LogsSlice"
import { devicesType } from "../../types/device.type"
import { useTranslation } from "react-i18next"

export default function Dropdown() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const { deviceId, Serial } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const [val, setVal] = useState([deviceId, Serial])

  const selectchang = (e: ChangeEvent<HTMLSelectElement>) => {
    setVal([e.target.value])
    dispatch(setDefaultLogs({} as devicesType))
    localStorage.setItem('devid', e.target.value.substring(0, 40))
    localStorage.setItem('devSerial', e.target.value.substring(41, 80))
    dispatch(setDeviceId(e.target.value.substring(0, 40)))
    dispatch(setSerial(e.target.value.substring(41, 80)))
  }

  return (
    <Form.Select onChange={selectchang} value={val}>
      <option key={'opt_01'} value={''}>{t('selectDeviceDrop')}</option>
      {devices.length > 0 && devices.map((items) => {
        if (items.devSerial === Serial) {
          return (
            <option
              key={items.devId}
              value={[items.devId, items.devSerial]}
              selected
            >
              {items.devDetail}
            </option>
          )
        } else {
          return (
            <option
              key={items.devId}
              value={[items.devId, items.devSerial]}
            >
              {items.devDetail}
            </option>
          )
        }
      })}
    </Form.Select>
  )
}