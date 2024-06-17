import { Card } from "react-bootstrap"
import { cardType } from "../../types/component.type"
import { DelUserButton, UserDetails, UserMenu, UsercardFlex, Userimage } from "../../style/style"
import { RiDeleteBin2Line } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import Adduser from "../../pages/users/adduser"
import { swalWithBootstrapButtons } from "../dropdown/sweetalertLib"
import axios, { AxiosError } from "axios"
import Swal from "sweetalert2"
import { useDispatch, useSelector } from "react-redux"
import { storeDispatchType } from "../../stores/store"
import { fetchUserData } from "../../stores/userSlice"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { responseType } from "../../types/response.type"
import { usersType } from "../../types/user.type"

export default function CardUser(userProp: cardType) {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { displayName, keyindex, userId, userLevel, userName, userPic } = userProp

  const deleteUser = async (uID: string) => {
    const url: string = `${import.meta.env.VITE_APP_API}/user/${uID}`
    try {
      const response = await axios
        .delete<responseType<usersType>>(url, {
          headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      dispatch(fetchUserData(token))
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          title: t('alertHeaderError'),
          text: error.response?.data.message,
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        })
      } else {
        Swal.fire({
          title: t('alertHeaderError'),
          text: "Uknown Error",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    }
  }

  return (
      <Card key={keyindex} className="border-0" style={{ backgroundColor: 'unset', border: 'unset' }}>
        <UsercardFlex>
          <Userimage
            src={!userPic ? `${import.meta.env.VITE_APP_IMG}/img/default-pic.png` : `${import.meta.env.VITE_APP_IMG}${userPic}`}
            alt="user-picture" />
          <UserDetails>
            <span>{displayName}</span>
            <span>@{userName}</span>
            <span>{userLevel === "1" ? t('levelSuper') : userLevel === "2" ? t('levelService') : userLevel === "3" ? t('levelAdmin') : t('levelUser')}</span>
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
                  text: t('notReverseText'),
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: t('confirmButton'),
                  cancelButtonText: t('cancelButton'),
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
  )
}
