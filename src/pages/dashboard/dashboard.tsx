import { Container } from "react-bootstrap"
import { DashboardFlex, DashboardHeadFilter, Dashboardanalys } from "../../style/style"
import Dropdown from "../../components/dashboard/dropdown"
import Chart from "../../components/dashboard/chart"
import Devicesinfo from "../../components/dashboard/devicesinfo"
import Table from "../../components/dashboard/table"
import { DeviceState, DeviceStateStore, LogState, UtilsStateStore } from "../../types/redux.type"
import { useDispatch, useSelector } from "react-redux"
import PageLoading from "../../components/loading/page.loading"
import { motion } from "framer-motion"
import { items } from "../../animation/animate"
import { useEffect } from "react"
import { storeDispatchType } from "../../stores/store"
import { setDeviceId, setSearchQuery, setSerial } from "../../stores/utilsStateSlice"
import { fetchDevicesLog } from "../../stores/LogsSlice"
import { cookies } from "../../constants/constants"

export default function Dashboard() {
  const dispatch = useDispatch<storeDispatchType>()
  const { devicesLogs } = useSelector<DeviceStateStore, LogState>((state) => state.logs)
  const { expand, cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const { token } = cookieDecode

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  useEffect(() => {
    if (!token) return
    if (cookies.get('devid')) return
    dispatch(fetchDevicesLog({ deviceId: devices[0]?.devId, token }))
    dispatch(setDeviceId(devices[0]?.devId))
    dispatch(setSerial(devices[0]?.devSerial))
  }, [devices, token])

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
