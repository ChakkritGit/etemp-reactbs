import { Container } from "react-bootstrap"
import { DashboardFlex, DashboardHeadFilter, Dashboardanalys } from "../../style/style"
import Dropdown from "../../components/dashboard/dropdown"
import Chart from "../../components/dashboard/chart"
import Devicesinfo from "../../components/dashboard/devicesinfo"
import Table from "../../components/dashboard/table"
import { DeviceStateStore, LogState, UtilsStateStore } from "../../types/redux.type"
import { useSelector } from "react-redux"
import PageLoading from "../../components/loading/page.loading"
import { motion } from "framer-motion"
import { items } from "../../animation/animate"

export default function Dashboard() {
  const { devicesLogs } = useSelector<DeviceStateStore, LogState>((state) => state.logs)
  const { expand } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)

  return (
    <Container fluid>
      <motion.div
        variants={items}
        initial="hidden"
        animate="visible"
      >
        <DashboardFlex>
          <DashboardHeadFilter $primary={expand}>
            <Dropdown />
          </DashboardHeadFilter>
          {
            devicesLogs.log?.length > 0 ?
              <>
                <Devicesinfo
                  devicesData={devicesLogs}
                  index={0}
                />
                <Dashboardanalys>
                  <Chart
                    data={devicesLogs.log.slice(0, 80)}
                    tempMin={devicesLogs.probe[0]?.tempMin}
                    tempMax={devicesLogs.probe[0]?.tempMax}
                  />
                  <Table
                    data={devicesLogs.log.slice(0, 80)}
                    dev_sn={devicesLogs.devSerial}
                    devStatus={devicesLogs.devStatus}
                  />
                </Dashboardanalys>
              </>
              :
              <PageLoading />
          }
        </DashboardFlex>
      </motion.div>
    </Container>
  )
}
