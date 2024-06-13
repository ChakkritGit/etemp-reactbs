import { Form } from "react-bootstrap"
import { wardsType } from "../../types/ward.type"
import { dropDownWardProp } from "../../types/prop.type"
import { ChangeEvent, useEffect, useState } from "react"
import axios, { AxiosError } from "axios"
import { useTranslation } from "react-i18next"
import { responseType } from "../../types/response.type"
import { hospitalsType } from "../../types/hospital.type"

export default function WardDropdown(DwardProp: dropDownWardProp) {
  const { t } = useTranslation()
  const { Group_ID, Hosid, setState_ward } = DwardProp
  const [wardData, setWardData] = useState<wardsType[]>([])
  const [selectedval, setSelectedVal] = useState(Group_ID)

  const setWardId = (e: ChangeEvent<HTMLSelectElement>) => {
    setState_ward(e.target.value)
    setSelectedVal(e.target.value)
  }

  const fetchHospital = async () => {
    if (Hosid !== "" || Group_ID !== "" && !Group_ID) {
      const url: string = `${import.meta.env.VITE_APP_API}/hospital/${Hosid}`
      try {
        const response = await axios.get<responseType<hospitalsType>>(url, {
          headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setWardData(response.data.data.ward)
        setState_ward(response.data.data.ward[0]?.wardId)
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error.response?.data.message)
        } else {
          console.error('Unknown Error', error)
        }
      }
    }
  }

  useEffect(() => {
    fetchHospital()
  }, [Hosid])

  return (
    <Form.Select onChange={setWardId} name="fieldSelectWard" value={selectedval} disabled={Hosid !== "" ? false : true} >
      <option key={Group_ID} value={'default'}>{t('selectWard')}</option>
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
