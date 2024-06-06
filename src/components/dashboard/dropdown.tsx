import { ChangeEvent } from "react"
import { Form } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { DeviceState, DeviceStateStore } from "../../types/redux.type"
import { setDeviceId, setSerial } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"
import { setDefaultLogs } from "../../stores/LogsSlice"
import { devicesType } from "../../types/device.type"

export default function Dropdown() {
  const dispatch = useDispatch<storeDispatchType>()
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)

  const selectchang = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setDefaultLogs({} as devicesType))
    localStorage.setItem('devid', e.target.value.substring(0, 40))
    localStorage.setItem('devSerial', e.target.value.substring(41, 80))
    dispatch(setDeviceId(e.target.value.substring(0, 40)))
    dispatch(setSerial(e.target.value.substring(41, 80)))
  }

  return (
    <Form.Select onChange={selectchang}>
      <option key={'opt_01'} value={''}>Please Select Devices</option>
      {devices.length > 0 && devices.map((items) => {
        return (
          <option
            key={items.devId}
            value={[items.devId, items.devSerial]}
          >
            {items.devDetail}
          </option>
        )
      })}
    </Form.Select>
  )
}