import axios, { AxiosError } from "axios"
import { Noticontainer, NotiflexOne, NotiflexTwo } from "../../style/style"
import { notificationType } from "../../types/notification.type"
import Loading from "../loading/loading"
import { RiFileCloseLine } from "react-icons/ri"
import { useTranslation } from "react-i18next"

type notilist = {
  data: notificationType[],
  funcfetch: () => void
}

export default function Notificationdata(notilist: notilist) {
  const { t } = useTranslation()
  const { data, funcfetch } = notilist

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

  return (
    data.length > 0 ?
      data.map((items, index) => (
        <Noticontainer $primary={!items.notiStatus} key={index} onClick={() => !items.notiStatus && setRead(items.notiId)}>
          <NotiflexOne>
            <strong>{items.notiDetail}</strong>
            <span>{items.createAt.substring(11, 16)}</span>
          </NotiflexOne>
          <NotiflexTwo>
            <span>{items.device.devDetail}</span>
          </NotiflexTwo>
        </Noticontainer>
      ))
      :
      <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
  )
}
