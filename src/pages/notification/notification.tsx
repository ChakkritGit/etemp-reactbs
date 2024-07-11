import { RiAlarmWarningFill, RiCloseLine, RiNotification2Line } from "react-icons/ri"
import { useEffect, useRef, useState } from "react"
import { notificationType } from "../../types/notification.type"
import { ModalHead, NotificationBadge, NotificationContainer } from "../../style/style"
import { Modal } from "react-bootstrap"
import { CountUp } from "countup.js"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { responseType } from "../../types/response.type"
import axios, { AxiosError } from "axios"
import Notificationdata from "../../components/notification/notificationdata"
import notificationSound from "../../assets/sounds/notification.mp3"
import { storeDispatchType } from "../../stores/store"
import { setShowAlert, setSocketData } from "../../stores/utilsStateSlice"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"

export default function Notification() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { socketData, soundMode, popUpMode, cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const [number, setNumber] = useState(0)
  const [show, setShow] = useState(false)
  const [notiData, setNotidata] = useState<notificationType[]>([])
  const countupRef = useRef(null)
  const notiSound = new Audio(notificationSound)

  const openModal = () => {
    setShow(true)
  }

  const closeModal = () => {
    setShow(false)
  }

  const fetchData = async () => {
    try {
      const responseData = await axios
        .get<responseType<notificationType[]>>(`${import.meta.env.VITE_APP_API}/notification`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setNotidata(responseData.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          console.error('Something wrong' + error)
        }
      } else {
        console.error('Uknown error: ', error)
      }
    }
  }

  useEffect(() => {
    setNumber(notiData.filter(items => !items.notiStatus).length)
  }, [notiData])

  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [cookieDecode])

  useEffect(() => {
    if (socketData && !soundMode && !popUpMode) {
      notiSound.play()
    } else {
      dispatch(setSocketData(null))
    }

    if (socketData && !popUpMode) {
      toast((_t) => (
        `${socketData.device} \n ${socketData.message} \n ${new Date(socketData.time).toLocaleString('th-TH', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'UTC'
        })}`
      ),
        {
          icon: <RiAlarmWarningFill size={24} fill='var(--danger-color)' />,
          duration: 10000,
        }
      )
    }
  }, [socketData])

  useEffect(() => {
    if (countupRef.current) {
      const numAnim = new CountUp(countupRef.current, number)
      numAnim.start()
    }
  }, [number])

  return (
    <>
      <NotificationContainer $primary={number > 0} onClick={openModal}>
        <RiNotification2Line />
        {
          number > 0 ?
            <NotificationBadge $primary={number > 100}>
              <span ref={countupRef}></span>
            </NotificationBadge>
            :
            <></>
        }
      </NotificationContainer>
      <Modal scrollable size="lg" show={show} onHide={closeModal}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {t('titleNotification')}
            </strong>
            <button onClick={closeModal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Modal.Body style={{ padding: 'unset' }}>
          <Notificationdata
            data={notiData}
            funcfetch={fetchData}
          />
        </Modal.Body>
      </Modal>
    </>
  )
}
