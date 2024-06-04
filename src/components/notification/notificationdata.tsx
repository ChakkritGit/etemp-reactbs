import axios from "axios"
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
  const setRead = async (notiID: string) => {
    await axios
      .patch(`${import.meta.env.VITE_APP_API}/notification/${notiID}`,
        {
          noti_status: '1'
        }, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
      }
      )
      .then(() => {
        notilist.funcfetch()
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    notilist.data.length > 0 ?
      notilist.data.map((items, index) => (
        <Noticontainer $primary={items.notiStatus === '0'} key={index} onClick={() => setRead(items.devId)}>
          <NotiflexOne>
            <strong>{items.notiDetail}</strong>
            <span>{items.createAt.substring(11, 16)}</span>
          </NotiflexOne>
          <NotiflexTwo>
            <span>{items.device.devName}</span>
          </NotiflexTwo>
        </Noticontainer>
      ))
      :
      <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
  )
}
