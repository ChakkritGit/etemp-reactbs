import { Tab, Tabs } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import Managedev from './managedevices'
import Probesetting from './probesetting'

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
    </Tabs>
  )
}
