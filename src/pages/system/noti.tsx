import { useTranslation } from "react-i18next"
import { NotificationSoundButton, NotificationSoundFlex } from "../../style/components/notification"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { storeDispatchType } from "../../stores/store"
import { setSoundMode } from "../../stores/utilsStateSlice"

export default function Noti() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { soundMode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)

  const switchOption = () => {
    dispatch(setSoundMode(!soundMode))
    localStorage.setItem('soundMode', String(!soundMode))
  }

  return (
    <div>
      <h3>{t('titleNotification')}</h3>
      <NotificationSoundFlex>
        <span>{t('notificationSound')}</span>
        <NotificationSoundButton onClick={switchOption} $primary={soundMode}>
          <div className="icon">
            {soundMode ? t('stateOff') : t('stateOn')}
          </div>
        </NotificationSoundButton>
      </NotificationSoundFlex>
    </div>
  )
}
