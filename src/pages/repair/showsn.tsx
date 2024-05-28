import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import { devicesType } from "../../types/device.type"
import axios from "axios"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { localtoken } from "../../authen/localdata"

type sntype = {
  setRepairdata: Dispatch<SetStateAction<{
    repair_info: string,
    repair_location: string,
    tel_number: string,
    ward: string,
    dev_id: string,
    warranty_status: string,
    repair_details: string,
    comment: string,
    repair_status: string,
  }>>
  repairData: {
    repair_info: string,
    repair_location: string,
    tel_number: string,
    ward: string,
    dev_id: string,
    warranty_status: string,
    repair_details: string,
    comment: string,
    repair_status: string,
  }
  dev_idkey: string
}

export default function Showsn(sntype: sntype) {
  const { t } = useTranslation()
  const [devData, setDevData] = useState<devicesType[]>([])
  const [selectedval, setSelectedVal] = useState('')

  const setDevId = (e: ChangeEvent<HTMLSelectElement>) => {
    sntype.setRepairdata({ ...sntype.repairData, dev_id: e.target.value })
    setSelectedVal(e.target.value)
  }

  useEffect(() => {
    const url: string = `${import.meta.env.VITE_APP_API}/device`
    axios
      .get(url, {
        headers: { authorization: `Bearer ${localtoken}` }
      })
      .then((responseData) => {
        setDevData(responseData.data.data)
      })
      .catch((error) => {
        console.error("something wrong when fetch data: " + error)
      })
  }, [])

  return (
    <Form.Select onChange={setDevId} name="field_select_ward" value={selectedval}>
      {
        devData.map((item, index) => {
          if (sntype.dev_idkey === '') {
            return <option key={'dev-1'} selected value={''}>{t('field_select_dev')}</option>
          } else if (item.devId === sntype.dev_idkey) {
            return <option selected defaultChecked key={index} value={item.devId}>{item.devSerial}</option>
          } else {
            return <option key={index} value={item.devId}>{item.devSerial}</option>
          }
        })
      }
    </Form.Select>
  )
}
