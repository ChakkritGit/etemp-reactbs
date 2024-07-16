import { Tab, Tabs } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import Managedev from './managedevices'
import Probesetting from './probesetting'
import Uploadfirmware from './uploadfirmware'
import { useSelector } from 'react-redux'
import { DeviceStateStore, UtilsStateStore } from '../../../types/redux.type'

export default function Adddevices() {
  const { t } = useTranslation()
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { userLevel } = cookieDecode

  return (
    <Tabs
      defaultActiveKey="hospital"
      className="mb-3"
    >
      <Tab eventKey="hospital" title={t('subTabDevice')}>
        <Managedev />
      </Tab>
      {
        userLevel !== '3' && <Tab eventKey="probe" title={t('sunTabProbe')}>
          <Probesetting />
        </Tab>
      }
      {
        cookieDecode.userLevel === '0' &&
        <Tab eventKey="firmware" title={t('sunTabFirmware')}>
          <Uploadfirmware />
        </Tab>
      }
    </Tabs>
  )
}
