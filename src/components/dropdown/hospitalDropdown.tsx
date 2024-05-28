import { ChangeEvent, useState } from "react"
import { Form } from "react-bootstrap"
import { hospitalsType } from "../../types/hospital.type"
import { dropDownHospitalProp } from "../../types/prop.type"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { DeviceStateStore } from "../../types/redux.type"

export default function HospitalDropdown(hosprop: dropDownHospitalProp) {
  const { t } = useTranslation()
  const { setHos_id, Hosid } = hosprop
  const hospitalsData = useSelector<DeviceStateStore, hospitalsType[]>((state) => state.arraySlice.hospital.hospitalsData)
  const [selectedval, setSelectedVal] = useState(Hosid)

  const setHosId = (e: ChangeEvent<HTMLSelectElement>) => {
    setHos_id(e.target.value)
    setSelectedVal(e.target.value)
  }

  return (
    <Form.Select onChange={setHosId} name="field_select_hospital" value={selectedval}>
      <option key={Hosid} value={'defualt'} disabled>{t('field_select_hospital')}</option>
      {
        hospitalsData.map((item, index) => {
          if (item.hosId === Hosid) {
            return <option selected key={index} value={item.hosId}>{item.hosName}</option>
          } else {
            return <option key={index} value={item.hosId}>{item.hosName}</option>
          }
        })
      }
    </Form.Select>
  )
}
