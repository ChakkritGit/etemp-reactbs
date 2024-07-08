import { Tab, Tabs } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { userlevel } from '../../../authen/authentFunc'
import Managedev from './managedevices'
import Probesetting from './probesetting'
import Uploadfirmware from './uploadfirmware'

export default function Adddevices() {
  const { t } = useTranslation()

  return (
    <Tabs
      defaultActiveKey="hospital"
      className="mb-3"
    >
      <Tab eventKey="hospital" title={t('subTabDevice')}>
        <Managedev />
      </Tab>
      <Tab eventKey="probe" title={t('sunTabProbe')}>
        <Probesetting />
      </Tab>
      {
        userlevel() === '0' &&
        <Tab eventKey="firmware" title={t('sunTabFirmware')}>
          <Uploadfirmware />
        </Tab>
      }
    </Tabs>
  )
}
