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
  const [val, setVal] = useState(`${deviceId}-${Serial}`)

  const selectchang = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    const newDeviceId = selectedValue.substring(0, 40)
    const newSerial = selectedValue.substring(41)
    setVal(selectedValue)
    dispatch(setDefaultLogs({} as devicesType))
    localStorage.setItem('devid', newDeviceId)
    localStorage.setItem('devSerial', newSerial)
    dispatch(setDeviceId(newDeviceId))
    dispatch(setSerial(newSerial))
  }

  return (
    <Form.Select onChange={selectchang} value={val}>
      <option key={'opt_01'} value={''}>{t('selectDeviceDrop')}</option>
      {devices.length > 0 && devices.map((items) => {
        const optionValue = `${items.devId}-${items.devSerial}`
        return (
          <option key={items.devId} value={optionValue}>
            {items.devDetail}
          </option>
        )
      })}
    </Form.Select>
  )
}
