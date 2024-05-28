import { Form } from "react-bootstrap"
import { wardsType } from "../../types/ward.type"
import { dropDownWardProp } from "../../types/prop.type"
import { ChangeEvent, useEffect, useState } from "react"
import axios from "axios"
import { useTranslation } from "react-i18next"
import { responseType } from "../../types/response.type"

export default function WardDropdown(DwardProp: dropDownWardProp) {
  const { t } = useTranslation()
  const { Group_ID, Hosid, setState_ward } = DwardProp
  const [wardData, setWardData] = useState<wardsType[]>([])
  const [selectedval, setSelectedVal] = useState('')

  const setWardId = (e: ChangeEvent<HTMLSelectElement>) => {
    setState_ward(e.target.value)
    setSelectedVal(e.target.value)
  }

  useEffect(() => {
    if (Hosid !== "" || Group_ID !== "" && !Group_ID) {
      const url: string = `${import.meta.env.VITE_APP_API}/ward?hosId=${Hosid}`
      axios
        .get<responseType<wardsType[]>>(url, {
          headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then((responseData) => {
          setWardData(responseData.data.data)
          setState_ward(responseData.data.data[0]?.wardId)
        })
        .catch((error) => {
          console.error("something wrong when fetch data: " + error)
        })
    }
  }, [Hosid])

  return (
    <Form.Select onChange={setWardId} disabled={Hosid !== "" ? false : true} name="field_select_ward" value={selectedval} defaultValue={'default'}>
      <option key={Group_ID} disabled value={'default'}>{t('field_select_ward')}</option>
      {
        wardData.map((item, index) => {
          if (item.wardId === Group_ID) {
            return <option selected key={index} value={item.wardId}>{item.wardName}</option>
          } else {
            return <option key={index} value={item.wardId}>{item.wardName}</option>
          }
        })
      }
    </Form.Select>
  )
}
