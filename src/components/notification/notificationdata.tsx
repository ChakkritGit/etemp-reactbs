import axios, { AxiosError } from "axios"
import { Noticontainer, NotiflexOne, NotiflexTwo } from "../../style/style"
import { notificationType } from "../../types/notification.type"
import Loading from "../loading/loading"
import { RiFileCloseLine } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { devicesType } from "../../types/device.type"
import { responseType } from "../../types/response.type"

type notilist = {
  data: notificationType[],
  funcfetch: () => void
}

export default function Notificationdata(notilist: notilist) {
  const { t } = useTranslation()
  const { data, funcfetch } = notilist
  const [devData, setDevData] = useState<devicesType[]>([])

  const fetchData = async () => {
    try {
      const response = await axios.get<responseType<devicesType[]>>(`${import.meta.env.VITE_APP_API}/device`, { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } })
      setDevData(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error("Uknown Error: ", error)
      }
    }
  }

  const setRead = async (notiID: string) => {
    try {
      await axios
        .patch(`${import.meta.env.VITE_APP_API}/notification/${notiID}`,
          {
            notiStatus: true
          }, {
          headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      funcfetch()
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error('Unknown Error: ', error)
      }
    }
  }

  useEffect(() => {
    if (data) {
      fetchData()
    }
  }, [data])

  return (
    data.length > 0 ?
      data.map((items, index) => (
        <Noticontainer $primary={!items.notiStatus} key={index} onClick={() => !items.notiStatus && setRead(items.notiId)}>
          <NotiflexOne>
            <strong>{items.notiDetail}</strong>
            <span>{items.createAt.substring(11, 16)}</span>
          </NotiflexOne>
          <NotiflexTwo>
            <span>{devData.filter((devItem) => devItem.devId === items.device.devId)[0]?.devDetail}</span>
          </NotiflexTwo>
        </Noticontainer>
      ))
      :
      <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
  )
}
