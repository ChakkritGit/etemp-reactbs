import { RiCloseLine, RiNotification2Line } from "react-icons/ri"
import { useEffect, useState } from "react"
import { notificationType } from "../../types/notification.type"
// import Swal from "sweetalert2"
import { ModalHead, NotificationBadge, NotificationContainer, NotimodalOverride } from "../../style/style"
import { Modal } from "react-bootstrap"
import axios, { AxiosError } from "axios"
import CountUp from 'react-countup'
import Notificationdata from "../../components/notification/notificationdata"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { responseType } from "../../types/response.type"
// import toast from "react-hot-toast"

export default function Notification() {
  const { socketData, token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const [number, setNumber] = useState(0)
  const [show, setShow] = useState(false)
  const [notiData, setNotidata] = useState<notificationType[]>([])

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
        console.log(error.response?.data.message)
      } else {
        console.log('Unknown Error: ', error)
      }
    }
  }

  // const Toast = Swal.mixin({
  //   toast: true,
  //   position: "top-end",
  //   showConfirmButton: false,
  //   timer: 3000,
  // })

  useEffect(() => {
    let count = 0
    notiData.forEach(items => {
      if (items.noti_status === '0') {
        count += 1
      }
    })
    setNumber(count)
  }, [notiData])

  useEffect(() => {
    fetchData()

    // if (socketData !== '') {
    //   // Toast.fire({
    //   //   icon: "warning",
    //   //   title: socketData,
    //   // })
    //   toast.success(socketData)
    // }
  }, [socketData])

  return (
    <>
      <NotificationContainer $primary={number > 0} onClick={openModal}>
        <RiNotification2Line />
        <NotificationBadge $primary={number > 100}>
          <CountUp
            delay={3}
            end={number} />
        </NotificationBadge>
      </NotificationContainer>
      <Modal scrollable size="lg" show={show} onHide={closeModal}>
        <Modal.Header>
          <ModalHead>
            <strong>
              Notification
            </strong>
            <button onClick={closeModal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Modal.Body className="unset-pd">
          <NotimodalOverride>
            <Notificationdata
              data={notiData}
              funcfetch={fetchData}
            />
          </NotimodalOverride>
        </Modal.Body>
      </Modal>
    </>
  )
}
