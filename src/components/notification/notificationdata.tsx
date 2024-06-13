import axios, { AxiosError } from "axios"
import { Noticontainer, NotiflexOne, NotiflexTwo } from "../../style/style"
import { notificationType } from "../../types/notification.type"
import Loading from "../loading/loading"
import { RiFileCloseLine, RiLoader2Line } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { NotiHead, NotiHeadBtn } from "../../style/components/notification"

type notilist = {
  data: notificationType[],
  funcfetch: () => void
}

export default function Notificationdata(notilist: notilist) {
  const { t } = useTranslation()
  const { data, funcfetch } = notilist
  const [pageState, setPageState] = useState(1)

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
    <>
      <NotiHead>
        <NotiHeadBtn $primary={pageState === 1} onClick={() => setPageState(1)}>{t('notRead')}</NotiHeadBtn>
        <NotiHeadBtn $primary={pageState === 2} onClick={() => setPageState(2)}>{t('Readed')}</NotiHeadBtn>
        <NotiHeadBtn $primary={pageState === 3} onClick={() => setPageState(3)}>{t('notificationAll')}</NotiHeadBtn>
      </NotiHead>
      {
        pageState === 1 ?
          data.length > 0 ? (
            (() => {
              const filteredData = data.filter(items => items.notiStatus === false)
              return filteredData.length > 0 ? (
                filteredData.map((items, index) => (
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
              ) : (
                <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
              )
            })()
          ) : (
            <Loading loading={true} title={t('loading')} icn={<RiLoader2Line />} />
          ) :
          pageState === 2 ?
            data.length > 0 ? (
              (() => {
                const filteredData = data.filter(items => items.notiStatus === true)
                return filteredData.length > 0 ? (
                  filteredData.map((items, index) => (
                    <Noticontainer $primary={!items.notiStatus} $readed key={index}>
                      <NotiflexOne>
                        <strong>{items.notiDetail}</strong>
                        <span>{items.createAt.substring(11, 16)}</span>
                      </NotiflexOne>
                      <NotiflexTwo>
                        <span>{items.device.devDetail}</span>
                      </NotiflexTwo>
                    </Noticontainer>
                  ))
                ) : (
                  <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                )
              })()
            ) : (
              <Loading loading={true} title={t('loading')} icn={<RiLoader2Line />} />
            ) :
            data.length > 0 ? (
              (() => {
                return data.length > 0 ? (
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
                ) : (
                  <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                )
              })()
            ) : (
              <Loading loading={true} title={t('loading')} icn={<RiLoader2Line />} />
            )
      }

    </>
  )
}
