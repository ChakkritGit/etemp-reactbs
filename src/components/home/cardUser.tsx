import { Card } from "react-bootstrap"
import { cardType } from "../../types/component.type"
import { DelUserButton, UserDetails, UserMenu, UsercardFlex, Userimage } from "../../style/style"
import { RiDeleteBin2Line } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import Adduser from "../../pages/users/adduser"
import { swalWithBootstrapButtons } from "../dropdown/sweetalertLib"
import axios from "axios"
import Swal from "sweetalert2"
import { motion } from "framer-motion"
import { items } from "../../animation/animate"
import { useDispatch, useSelector } from "react-redux"
import { storeDispatchType } from "../../stores/store"
import { fetchUserData } from "../../stores/userSlice"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"

export default function CardUser(userProp: cardType) {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { displayName, keyindex, userId, userLevel, userName, userPic } = userProp

  const deleteUser = (uID: string) => {
    const url: string = `${import.meta.env.VITE_APP_API}/user/${uID}`
    axios
      .delete(url, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then((responseData) => {
        if (responseData.data.status === 200) {
          dispatch(fetchUserData(token))
          Swal.fire({
            title: t('alert_header_Success'),
            text: responseData.data.msg,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          })
        } else {
          Swal.fire({
            title: t('alert_header_Error'),
            text: responseData.data.msg,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      })
      .catch((error) => {
        console.error("something wrong to delete user" + error)
      })
  }

  return (
    <motion.div
      variants={items}
      initial="hidden"
      animate="visible"
    >
      <Card key={keyindex} className="border-0" style={{ backgroundColor: 'unset', border: 'unset' }}>
        <UsercardFlex>
          <Userimage
            src={!userPic ? 'https://test.thanespgm.com/img/default-pic.png' : `${import.meta.env.VITE_APP_IMG}${userPic}`}
            alt="user-picture" />
          <UserDetails>
            <span>{displayName}</span>
            <span>@{userName}</span>
            <span>{userLevel === "1" ? t('user_lvtag_sup') : userLevel === "2" ? t('user_lvtag_ser') : userLevel === "3" ? t('user_lvtag_ad') : t('user_lvtag_us')}</span>
          </UserDetails>
          <UserMenu>
            <Adduser
              pagestate={'edit'}
              userData={userProp}
            />
            <DelUserButton onClick={() =>
              swalWithBootstrapButtons
                .fire({
                  title: t('deleteuserTitle'),
                  text: t('deleteuserText'),
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: t('deletebtn'),
                  cancelButtonText: t('cancelbtn'),
                  reverseButtons: false,
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    deleteUser(userId)
                  }
                })}>
              <RiDeleteBin2Line />
            </DelUserButton>
          </UserMenu>
        </UsercardFlex>
      </Card>
    </motion.div>
  )
}
