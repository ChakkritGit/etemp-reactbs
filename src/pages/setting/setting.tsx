import { Container } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Hospitals from '../../pages/setting/hospitals/hospitals'
import Adddevices from "./devices/managedev"

export default function Setting() {
  const { t } = useTranslation()

  return (
    <Container fluid>
      <Tabs
        defaultActiveKey="setting"
        className="mb-2 mt-3"
      >
        <Tab eventKey="setting" title={t('setting_tab_devices')}>
          <Adddevices />
        </Tab>
        <Tab eventKey="hospital" title={t('setting_tab_hospitals')}>
          <Hospitals />
        </Tab>
      </Tabs>
    </Container>
  )
}
