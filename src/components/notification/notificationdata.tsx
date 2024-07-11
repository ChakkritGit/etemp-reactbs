import axios, { AxiosError } from "axios"
import { Noticontainer, NotiflexOne, NotiflexTwo } from "../../style/style"
import { notificationType } from "../../types/notification.type"
import Loading from "../loading/loading"
import { RiFileCloseLine, RiLoader2Line } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { NotiHead, NotiHeadBtn } from "../../style/components/notification"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"

type notilist = {
  data: notificationType[],
  funcfetch: () => void
}

interface listNotiProps {
  notiData: notificationType,
  index: number
}

export default function Notificationdata(notilist: notilist) {
  const { t } = useTranslation()
  const { data, funcfetch } = notilist
  const [pageState, setPageState] = useState(1)
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode

  const setRead = async (notiID: string) => {
    try {
      await axios
        .patch(`${import.meta.env.VITE_APP_API}/notification/${notiID}`,
          {
            notiStatus: true
          }, {
          headers: { authorization: `Bearer ${token}` }
        })
      funcfetch()
    } catch (error) { //up
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error('Unknown Error: ', error)
      }
    }
  }

  const subTextNotiDetails = (text: string) => {
    console.log(text)
    // if (text.split('/')[0] === 'PROBE1') {
    //   if (text.split('/')[2] === 'ON') {
    //     if (text.split('/')[1] === 'DOOR1') {
    //       return 'โพรบ 1 ประตู 1 ถูกเปิด'
    //     } else if (text.split('/')[1] === 'DOOR2') {
    //       return 'โพรบ 1  ประตู 2 ถูกเปิด'
    //     } else {
    //       return 'โพรบ 1  ประตู 3 ถูกเปิด'
    //     }
    //   } else {
    //     if (text.split('/')[1] === 'DOOR1') {
    //       return 'โพรบ 1 ประตู 1 ถูกปิด'
    //     } else if (text.split('/')[1] === 'DOOR2') {
    //       return 'โพรบ 1  ประตู 2 ถูกปิด'
    //     } else {
    //       return 'โพรบ 1  ประตู 3 ถูกปิด'
    //     }
    //   }
    // } else if (text.split('/')[0] === 'PROBE2') {
    //   if (text.split('/')[2] === 'ON') {
    //     if (text.split('/')[1] === 'DOOR1') {
    //       return 'โพรบ 2 ประตู 1 ถูกเปิด'
    //     } else if (text.split('/')[1] === 'DOOR2') {
    //       return 'โพรบ 2 ประตู 2 ถูกเปิด'
    //     } else {
    //       return 'โพรบ 2 ประตู 3 ถูกเปิด'
    //     }
    //   } else {
    //     if (text.split('/')[1] === 'DOOR1') {
    //       return 'โพรบ 2 ประตู 1 ถูกปิด'
    //     } else if (text.split('/')[1] === 'DOOR2') {
    //       return 'โพรบ 2 ประตู 2 ถูกปิด'
    //     } else {
    //       return 'โพรบ 2 ประตู 3 ถูกปิด'
    //     }
    //   }
    // } else if (text.split('/')[0] === 'PROBE3') {
    //   if (text.split('/')[2] === 'ON') {
    //     if (text.split('/')[1] === 'DOOR1') {
    //       return 'โพรบ 3 ประตู 1 ถูกเปิด'
    //     } else if (text.split('/')[1] === 'DOOR2') {
    //       return 'โพรบ 3 ประตู 2 ถูกเปิด'
    //     } else {
    //       return 'โพรบ 3 ประตู 3 ถูกเปิด'
    //     }
    //   } else {
    //     if (text.split('/')[1] === 'DOOR1') {
    //       return 'โพรบ 3 ประตู 1 ถูกปิด'
    //     } else if (text.split('/')[1] === 'DOOR2') {
    //       return 'โพรบ 3 ประตู 2 ถูกปิด'
    //     } else {
    //       return 'โพรบ 3 ประตู 3 ถูกปิด'
    //     }
    //   }
    // } else if (false) {

    // }

    const probe = text.split('/')
    const probeNumber = probe[0].replace('PROBE', '')
    const doorNumber = probe[1].replace('DOOR', '')
    const status = probe[2] === 'ON' ? 'เปิด' : 'ปิด'
    return `โพรบ ${probeNumber} ประตู ${doorNumber} ${status}`
  }

  const ListNotiTSX = ({ notiData, index }: listNotiProps) => {
    const { notiId, notiStatus, notiDetail, createAt, device } = notiData
    return <Noticontainer $primary={!notiStatus} $readed key={index} onClick={() => !notiStatus && setRead(notiId)}>
      <NotiflexOne $primary={!notiStatus}>
        <div>
          <div></div>
          <strong>{subTextNotiDetails(notiDetail)}</strong>
        </div>
        <span>{createAt.substring(11, 16)}</span>
      </NotiflexOne>
      <NotiflexTwo>
        <span>{device.devDetail}</span>
      </NotiflexTwo>
    </Noticontainer>
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
          data.length > 0 ?
            (() => {
              const filteredData = data.filter(items => items.notiStatus === false)
              return filteredData.length > 0 ? (
                filteredData.map((items, index) => (
                  <ListNotiTSX
                    key={index}
                    index={index}
                    notiData={items}
                  />
                ))
              ) :
                <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
            })()
            :
            <Loading loading={true} title={t('loading')} icn={<RiLoader2Line />} />
          :
          pageState === 2 ?
            data.length > 0 ?
              (() => {
                const filteredData = data.filter(items => items.notiStatus === true)
                return filteredData.length > 0 ? (
                  filteredData.map((items, index) => (
                    <ListNotiTSX
                      key={index}
                      index={index}
                      notiData={items}
                    />
                  ))
                ) :
                  <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
              })()
              :
              <Loading loading={true} title={t('loading')} icn={<RiLoader2Line />} />
            :
            data.length > 0 ?
              (() => {
                return data.length > 0 ? (
                  data.map((items, index) => (
                    <ListNotiTSX
                      key={index}
                      index={index}
                      notiData={items}
                    />
                  ))
                ) :
                  <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
              })()
              :
              <Loading loading={true} title={t('loading')} icn={<RiLoader2Line />} />
      }
    </>
  )
}
