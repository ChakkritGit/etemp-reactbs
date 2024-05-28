import { useTranslation } from "react-i18next"
import ManageHospitals from "./manageHospitals"
// import ManageWard from "./manageWard"
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

export default function Hospitals() {
  const { t } = useTranslation()

  return (
    <Tabs
      defaultActiveKey="hospital"
      className="mb-3"
    >
      <Tab eventKey="hospital" title={t('tab_hospital')}>
        <ManageHospitals />
      </Tab>
      {/* <Tab eventKey="ward" title={t('tab_ward')}>
        <ManageWard />
      </Tab> */}
    </Tabs>
  )
}
