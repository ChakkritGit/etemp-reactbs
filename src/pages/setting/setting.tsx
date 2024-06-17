import { Container } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Hospitals from '../../pages/setting/hospitals/hospitals'
import Adddevices from "./devices/managedev"
import AdjustLog from "./adjustlog/adjust.log"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { items } from "../../animation/animate"

export default function Setting() {
  const { t } = useTranslation()
  const { id } = useParams()

  return (
    <Container fluid>
      <motion.div
        variants={items}
        initial="hidden"
        animate="visible"
      >
        <Tabs
          defaultActiveKey={id === "logadjust" ? id : "setting"}
          className="mb-2 mt-3"
        >
          <Tab eventKey="setting" title={t('tabManageDevice')}>
            <Adddevices />
          </Tab>
          <Tab eventKey="hospital" title={t('tabManageHospitals')}>
            <Hospitals />
          </Tab>
          <Tab eventKey="logadjust" title={t('tabAdjustHistory')}>
            <AdjustLog />
          </Tab>
        </Tabs>
      </motion.div>
    </Container>
  )
}
