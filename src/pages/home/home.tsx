import { Container, Modal } from "react-bootstrap"
import DevicesCard from "../../components/home/devicesCard"
import {
  RiCloseLine, RiDoorClosedLine, RiDoorOpenLine, RiErrorWarningLine,
  RiFileCloseLine, RiFilter3Line, RiFolderSettingsLine,
  RiLayoutGridLine, RiListSettingsLine, RiListUnordered, RiPlugLine,
  RiSdCardMiniLine, RiShieldCheckLine, RiSignalWifi1Line, RiTempColdLine
} from "react-icons/ri"
import Select from "react-select"
import {
  AboutBox, DatatableHome, DevHomeDetails, DevHomeHead, DevHomeHeadTile,
  DevHomeSecctionOne, DeviceCardFooterDoor, DeviceCardFooterDoorFlex,
  DeviceCardFooterInfo, DeviceInfoSpan, DeviceInfoSpanClose, DeviceInfoflex,
  DeviceListFlex, FilterHomeHOSWARD, HomeContainerFlex, ListBtn,
  SubWardColumnFlex
} from "../../style/style"
import DevicesInfoCard from "../../components/home/devicesInfoCard"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useEffect } from "react"
import { wardsType } from "../../types/ward.type"
import { hospitalsType } from "../../types/hospital.type"
import { devicesType } from "../../types/device.type"
import { motion } from "framer-motion"
import { itemsFilter } from "../../animation/animate"
import Loading from "../../components/loading/loading"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import { useDispatch, useSelector } from "react-redux"
import { DeviceState, DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { setCount, setDeviceId, setSearchQuery } from "../../stores/utilsStateSlice"
import { filtersDevices, setFilterDevice } from "../../stores/dataArraySlices"
import { storeDispatchType } from "../../stores/store"
import DataTable, { TableColumn } from "react-data-table-component"
import TableModal from "../../components/home/table.modal"
import PageLoading from "../../components/loading/page.loading"
import { probeType } from "../../types/probe.type"

export default function Home() {
  const dispatch = useDispatch<storeDispatchType>()
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const { searchQuery, count } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const devicesFilter = useSelector<DeviceStateStore, devicesType[]>((state) => state.arraySlice.device.devicesFilter)
  const hospitalsData = useSelector<DeviceStateStore, hospitalsType[]>((state) => state.arraySlice.hospital.hospitalsData)
  const wardData = useSelector<DeviceStateStore, wardsType[]>((state) => state.arraySlice.ward.wardData)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [filterdata, setFilterdata] = useState(false)
  const [wardName, setWardname] = useState<wardsType[]>([])
  const [active, setActive] = useState({
    probe: false,
    door: false,
    connect: false,
    plug: false,
    sd: false,
    adjust: false,
    repair: false,
    warranty: false
  })
  const [showticks, setShowticks] = useState(false)
  const [listAndgrid, setListandgrid] = useState(1)

  const showtk = () => {
    setShowticks(true)
  }
  const isshowtk = () => {
    setShowticks(false)
  }

  const Switchcase = (filtertext: string, cardactive: boolean) => {
    if (localStorage.getItem('cardticks') === null) {
      localStorage.setItem('cardticks', '')
      showtk()
    } else {
      setShowticks(false)
    }

    const resetActive = {
      probe: false,
      door: false,
      connect: false,
      plug: false,
      sd: false,
      adjust: false,
      repair: false,
      warranty: false
    }

    let tempFilter: devicesType[] = []
    dispatch(setSearchQuery(''))

    switch (filtertext) {
      case 'probe':
        tempFilter = devices.filter((items) =>
          items.log[0]?.tempAvg >= 120 || items.log[0]?.tempAvg <= -40 || items.log[0]?.tempAvg === 0
          || items.log[0]?.tempAvg <= items.probe[0]?.tempMin || items.log[0]?.tempAvg >= items.probe[0]?.tempMax
        ).filter((items) => items.devId === items.log[0]?.devId)
        break
      case 'door':
        tempFilter = devices.filter((items) =>
          items.log[0]?.door1 || items.log[0]?.door2 || items.log[0]?.door3
        ).filter((items) => items.devId === items.log[0]?.devId)
        break
      case 'connect':
        tempFilter = devices.filter((items) => !items.devStatus).filter((items) => items.devId === items.log[0]?.devId)
        break
      case 'plug':
        tempFilter = devices.filter((items) => items.log[0]?.ac === '1').filter((items) => items.devId === items.log[0]?.devId)
        break
      case 'sd':
        tempFilter = devices.filter((items) => items.log[0]?.sdCard).filter((items) => items.devId === items.log[0]?.devId)
        break
      case 'adjust':
      case 'repair':
      case 'warranty':
        // รออัปเดท
        break
      default:
        break
    }

    if (!filtertext) {
      setActive({ ...resetActive, [filtertext]: true })
    } else {
      setActive({ ...resetActive, [filtertext]: cardactive })
      dispatch(setFilterDevice(cardactive ? tempFilter : devices))
    }

    if (!!active.adjust && !!active.probe && !!active.door && !!active.connect && !!active.plug
      && !!active.sd && !!active.warranty && !!active.repair) {
      dispatch(setFilterDevice(devices))
    }
  }

  useEffect(() => {
    let updatedCount = { ...count }

    devicesFilter.forEach((items) => {
      if (items.devId === items.log[0]?.devId) {
        // เงื่อนไขการนับ probe
        if (
          items.log[0]?.tempAvg === 0 ||
          items.log[0]?.tempAvg >= 120 ||
          items.log[0]?.tempAvg <= -40 ||
          items.log[0]?.tempAvg <= items.probe[0]?.tempMin ||
          items.log[0]?.tempAvg >= items.probe[0]?.tempMax) {
          updatedCount.probe += 1
        }

        // เงื่อนไขการนับ door
        if (
          items.log[0]?.door1 ||
          items.log[0]?.door2 ||
          items.log[0]?.door3) {
          updatedCount.door += 1
        }

        // เงื่อนไขการนับ connect
        if (!items.devStatus) {
          updatedCount.connect += 1
        }

        // เงื่อนไขการนับ ac
        if (items.log[0]?.ac === '1') {
          updatedCount.ac += 1
        }

        // เงื่อนไขการนับ sd
        if (items.log[0]?.sdCard) {
          updatedCount.sd += 1
        }

        // เงื่อนไขการนับ repair
        if (items.createAt !== null) {
          updatedCount.repair += 1
        }

        // เงื่อนไขการนับ warranty
        const today = new Date()
        const targetDate = new Date(items.locInstall)
        targetDate.setFullYear(targetDate.getFullYear() + 1)
        const timeDifference = targetDate.getTime() - today.getTime()
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
        if (daysRemaining < 5) {
          updatedCount.warranty += 1
        }
      }
    })

    dispatch(setCount(updatedCount))
  }, [devices])


  useEffect(() => {
    dispatch(setFilterDevice(devices.filter((items) =>
    (items.devSerial?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      items.devName?.toLowerCase()?.includes(searchQuery.toLowerCase()))
    ).filter((items) => items.devId === items.log[0]?.devId)))
  }, [searchQuery, devices])

  const handleRowClicked = (row: devicesType) => {
    localStorage.setItem('devid', row.devId)
    dispatch(setDeviceId(row.devId))
    navigate('/dashboard')
    window.scrollTo(0, 0)
  }

  const getHospital = (hospitalID: string | undefined) => {
    const newArray: wardsType[] = wardData.filter((items) => items.hospital.hosId === hospitalID)
    setWardname(newArray)
  }

  const getWard = (wardID: string | undefined) => {
    dispatch(setFilterDevice(devices.filter((items) => items.wardId === wardID)))
  }

  const columns: TableColumn<devicesType>[] = [
    // {
    //   name: t('no'),
    //   cell: (_, index) => {
    //     return <div>{index + 1}</div>
    //   },
    //   sortable: false,
    //   center: true,
    //   width: '60px'
    // },
    {
      name: t('field_device_name'),
      selector: (items) => items.devDetail,
      sortable: false,
      center: true
    },
    {
      name: t('tb_dev_sn'),
      cell: (items) => <span title={items.devSerial}>...{items.devSerial.substring(17)}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('tb_install_location'),
      selector: (items) => items.locInstall ? items.locInstall : '- -',
      sortable: false,
      center: true
    },
    {
      name: t('temperature'),
      selector: (items) => items.log[0]?.tempAvg ? items.log[0].tempAvg.toFixed(2) + ' °C' : 'No data',
      sortable: false,
      center: true,
      width: '80px'
    },
    {
      name: t('humidity'),
      selector: (items) => items.log[0]?.humidityAvg ? items.log[0].humidityAvg.toFixed(2) + ' %' : 'No data',
      sortable: false,
      center: true,
      width: '85px'
    },
    {
      name: t('probe'),
      cell: ((items) => (
        <DeviceCardFooterInfo
          $size
          $primary={
            items.log[0]?.tempAvg >= 125 ||
            items.log[0]?.tempAvg === 0 ||
            items.log[0]?.tempAvg <= -40 ||
            items.log[0]?.tempAvg >= items.probe[0]?.tempMax ||
            items.log[0]?.tempAvg <= items.probe[0]?.tempMin
          }>
          {
            items.log[0]?.tempAvg >= 125 ||
              items.log[0]?.tempAvg === 0 ||
              items.log[0]?.tempAvg <= -40 ||
              items.log[0]?.tempAvg >= items.probe[0]?.tempMax ||
              items.log[0]?.tempAvg <= items.probe[0]?.tempMin ?
              <RiErrorWarningLine />
              :
              <RiTempColdLine />
          }
        </DeviceCardFooterInfo>
      )),
      sortable: false,
      center: true,
      width: '80px'
    },
    {
      name: t('doors'),
      cell: ((items) => (
        <DeviceCardFooterDoorFlex $primary>
          {
            items.probe[0]?.door === 1 ?
              <DeviceCardFooterDoor
                $primary={
                  items.log[0]?.door1
                }>
                {
                  items.log[0]?.door1 ?
                    <RiDoorOpenLine />
                    :
                    <RiDoorClosedLine />
                }
              </DeviceCardFooterDoor>
              :
              items.probe[0]?.door === 2 ?
                <>
                  <DeviceCardFooterDoor
                    $primary={
                      items.log[0]?.door1
                    }>
                    {
                      items.log[0]?.door1 ?
                        <RiDoorOpenLine />
                        :
                        <RiDoorClosedLine />
                    }
                  </DeviceCardFooterDoor>
                  <DeviceCardFooterDoor
                    $primary={
                      items.log[0]?.door2
                    }>
                    {
                      items.log[0]?.door2 ?
                        <RiDoorOpenLine />
                        :
                        <RiDoorClosedLine />
                    }
                  </DeviceCardFooterDoor>
                </>
                :
                <>
                  <DeviceCardFooterDoor
                    $primary={
                      items.log[0]?.door1
                    }>
                    {
                      items.log[0]?.door1 ?
                        <RiDoorOpenLine />
                        :
                        <RiDoorClosedLine />
                    }
                  </DeviceCardFooterDoor>
                  <DeviceCardFooterDoor
                    $primary={
                      items.log[0]?.door2
                    }>
                    {
                      items.log[0]?.door2 ?
                        <RiDoorOpenLine />
                        :
                        <RiDoorClosedLine />
                    }
                  </DeviceCardFooterDoor>
                  <DeviceCardFooterDoor
                    $primary={
                      items.log[0]?.door3
                    }>
                    {
                      items.log[0]?.door3 ?
                        <RiDoorOpenLine />
                        :
                        <RiDoorClosedLine />
                    }
                  </DeviceCardFooterDoor>
                </>
          }
        </DeviceCardFooterDoorFlex>
      )),
      sortable: false,
      center: true
    },
    {
      name: t('connect'),
      selector: (items) => ((Number(new Date()) - Number(new Date(items.log[0]?.sendTime))) / 1000) > 10 * 60 ? 'offline' : 'online',
      sortable: false,
      center: true,
      width: '90px'
    },
    {
      name: t('batter'),
      selector: (items) => items.log[0]?.battery + ' %',
      sortable: false,
      center: true,
      width: '83px'
    },
    {
      name: t('plug'),
      selector: (items) => items.log[0]?.ac === '0' ? 'active' : 'Inactive',
      sortable: false,
      center: true,
      width: '70px'
    },
    {
      name: t('warranty_home'),
      cell: ((items) => {
        const today = new Date()
        const targetDate = new Date(items.dateInstall)
        targetDate.setFullYear(targetDate.getFullYear() + 1)
        const timeDifference = targetDate.getTime() - today.getTime()
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
        return <span>{daysRemaining} วัน</span>
      }),
      sortable: false,
      center: true
    },
    {
      name: t('repair_home'),
      cell: ((_items) => {
        return <span>- -</span>
      }),
      sortable: false,
      center: true,
      width: '9px'
    },
    {
      name: t('hos_action'),
      cell: ((items) => {
        return (
          <TableModal
            key={items.devId}
            deviceData={items}
            fetchData={filtersDevices}
            setCount={setCount}
          />
        )
      }),
      sortable: false,
      center: true
    }
  ]

  const subDeviceColumns: TableColumn<probeType>[] = [
    {
      name: 'Channel',
      cell: (items, index) => <span key={index}>{items.probeCh}</span>,
      sortable: false,
      center: true
    },
    {
      name: 'ProbeType',
      cell: (items, index) => <span key={index}>{items.probeType}</span>,
      sortable: false,
      center: true
    },
    {
      name: 'ProbeName',
      cell: (items, index) => <span key={index}>{items.probeName}</span>,
      sortable: false,
      center: true
    },
    {
      name: 'Temperature',
      cell: (items, index) => <span key={index}>{devicesFilter[0]?.log.filter((value) => value.probe === items.probeCh).length !== 0 ? devicesFilter[0]?.log.filter((value) => value.probe === items.probeCh).map((items) => items.tempAvg + ' °C') : 'no data found'}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('doors'),
      cell: ((items) =>
      (
        <DeviceCardFooterDoorFlex $primary>
          {
            items.door === 1 ?
              <DeviceCardFooterDoor
                $primary={
                  devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door1
                }>
                {
                  devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door1 ?
                    <RiDoorOpenLine />
                    :
                    <RiDoorClosedLine />
                }
              </DeviceCardFooterDoor>
              :
              items.door === 2 ?
                <>
                  <DeviceCardFooterDoor
                    $primary={
                      devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door1
                    }>
                    {
                      devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door1 ?
                        <RiDoorOpenLine />
                        :
                        <RiDoorClosedLine />
                    }
                  </DeviceCardFooterDoor>
                  <DeviceCardFooterDoor
                    $primary={
                      devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door2
                    }>
                    {
                      devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door2 ?
                        <RiDoorOpenLine />
                        :
                        <RiDoorClosedLine />
                    }
                  </DeviceCardFooterDoor>
                </>
                :
                <>
                  <DeviceCardFooterDoor
                    $primary={
                      devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door1
                    }>
                    {
                      devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door1 ?
                        <RiDoorOpenLine />
                        :
                        <RiDoorClosedLine />
                    }
                  </DeviceCardFooterDoor>
                  <DeviceCardFooterDoor
                    $primary={
                      devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door2
                    }>
                    {
                      devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door2 ?
                        <RiDoorOpenLine />
                        :
                        <RiDoorClosedLine />
                    }
                  </DeviceCardFooterDoor>
                  <DeviceCardFooterDoor
                    $primary={
                      devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door3
                    }>
                    {
                      devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door3 ?
                        <RiDoorOpenLine />
                        :
                        <RiDoorClosedLine />
                    }
                  </DeviceCardFooterDoor>
                </>
          }
        </DeviceCardFooterDoorFlex>
      )),
      sortable: false,
      center: true
    },
  ]

  const ExpandedComponent = ({ data }: { data: devicesType }) => {
    const { probe } = data

    return (
      <>
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        <SubWardColumnFlex>
          <DataTable
            columns={subDeviceColumns}
            data={probe}
            responsive
            dense
          // noTableHead
          />
        </SubWardColumnFlex>
      </>
    )
  }

  return (
    <Container fluid>
      <Helmet>
        <meta name="description" content="page show all etemp box detect temperature realtime and nofi when temperture higher then limit This project is using the production build of React and supported redux, product copyright Thanes Development Co. Ltd." />
      </Helmet>
      <HomeContainerFlex>
        <DevHomeHeadTile>
          <h5>
            {t('allstatus')}
          </h5>
        </DevHomeHeadTile>
        <DevHomeSecctionOne>
          <DevicesCard
            title={t('probe')}
            count={count.probe}
            times={'Time'}
            svg={<RiTempColdLine />}
            cardname={'probe'}
            switchcase={Switchcase}
            active={active.probe}
          />
          <DevicesCard
            title={t('doors')}
            count={count.door}
            times={'Time'}
            svg={<RiDoorClosedLine />}
            cardname={'door'}
            switchcase={Switchcase}
            active={active.door}
          />
          <DevicesCard
            title={t('connect')}
            count={count.connect}
            times={'Time'}
            svg={<RiSignalWifi1Line />}
            cardname={'connect'}
            switchcase={Switchcase}
            active={active.connect}
          />
          <DevicesCard
            title={t('plug')}
            count={count.ac}
            times={'Time'}
            svg={<RiPlugLine />}
            cardname={'plug'}
            switchcase={Switchcase}
            active={active.plug}
          />
          <DevicesCard
            title={t('sdcard')}
            count={count.sd}
            times={'Time'}
            svg={<RiSdCardMiniLine />}
            cardname={'sd'}
            switchcase={Switchcase}
            active={active.sd}
          />
          <DevicesCard
            title={t('adjust')}
            count={0}
            times={'Time'}
            svg={<RiListSettingsLine />}
            cardname={'adjust'}
            switchcase={Switchcase}
            active={active.adjust}
          />
          <DevicesCard
            title={t('repair_home')}
            count={count.repair}
            times={'Time'}
            svg={<RiFolderSettingsLine />}
            cardname={'repair'}
            switchcase={Switchcase}
            active={active.repair}
          />
          <DevicesCard
            title={t('warranty_home')}
            count={count.warranty}
            times={'Time'}
            svg={<RiShieldCheckLine />}
            cardname={'warranty'}
            switchcase={Switchcase}
            active={active.warranty}
          />
        </DevHomeSecctionOne>
        <AboutBox>
          <h5>{t('allinfobox')}</h5>
          <DeviceInfoflex>
            {
              !filterdata &&
              <DeviceInfoSpan onClick={() => setFilterdata(true)}>
                {t('device_filter')}
                <RiFilter3Line />
              </DeviceInfoSpan>
            }
            <FilterHomeHOSWARD>
              {
                filterdata &&
                <DevHomeHead>
                  <motion.div
                    variants={itemsFilter}
                    initial="hidden"
                    animate="visible"
                  >
                    <Select options={hospitalsData.map((items) => {
                      return {
                        value: items.hosId,
                        label: items.hosName
                      }
                    })}
                      onChange={(e) => getHospital(e?.value)}
                      autoFocus={false}
                    />
                    <Select options={wardName.map((items) => {
                      return {
                        value: items.wardId,
                        label: items.wardName
                      }
                    })}
                      onChange={(e) => getWard(e?.value)}
                      autoFocus={false}
                    />
                  </motion.div>
                  <DeviceInfoSpanClose onClick={() => setFilterdata(false)}>
                    <RiCloseLine />
                  </DeviceInfoSpanClose>
                </DevHomeHead>
              }
            </FilterHomeHOSWARD>
            <DeviceListFlex>
              <ListBtn $primary={listAndgrid === 1} onClick={() => setListandgrid(1)}><RiListUnordered /></ListBtn>
              <ListBtn $primary={listAndgrid === 2} onClick={() => setListandgrid(2)}><RiLayoutGridLine /></ListBtn>
            </DeviceListFlex>
          </DeviceInfoflex>
        </AboutBox>
        {
          devices.length > 0 ?
            listAndgrid === 1 ?
              <DatatableHome>
                <DataTable
                  responsive={true}
                  columns={columns}
                  data={devicesFilter}
                  paginationRowsPerPageOptions={[10, 20, 40, 60, 80, 100]}
                  paginationPerPage={10}
                  onRowClicked={handleRowClicked}
                  expandableRowsComponent={ExpandedComponent}
                  pagination
                  dense
                  expandableRows
                  pointerOnHover
                />
              </DatatableHome>
              :
              <DevHomeDetails $primary={devicesFilter.length <= 5 && devicesFilter.length !== 0}>
                <div>
                  {
                    devicesFilter.length > 0 ?
                      devicesFilter.filter((items) => items.devId === items.log[0]?.devId).map((item, index) =>
                      (<DevicesInfoCard
                        devicesdata={item}
                        keyindex={index}
                        key={item.devId}
                        fetchData={filtersDevices}
                        setCount={setCount}
                      />))
                      :
                      <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                  }
                </div>
              </DevHomeDetails>
            :
            <PageLoading />
        }
      </HomeContainerFlex>

      <Modal show={showticks} onHide={isshowtk}>
        <Modal.Header closeButton>
          <strong>Info</strong>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%' }}>
              <div>
                <DevicesCard
                  title={'โพรบ'}
                  count={Math.floor(Math.random() * 9)}
                  times={'ครั้ง'}
                  svg={<RiTempColdLine />}
                  cardname={''}
                  active={true}
                />
              </div>
              <div style={{ textAlign: 'left', width: '250px' }}>
                <strong>พื้นหลังการ์ดเป็นสีฟ้า</strong>
                <br />
                <span>
                  เมื่อพื้นหลังเป็นสีฟ้าแสดงว่าคุณกำลังฟิลเตอร์
                  รายการอุปกรณ์จะแสดงตามการ์ดที่คุณฟิลเตอร์
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%' }}>
              <div style={{ textAlign: 'right', width: '250px' }}>
                <strong>คลิกที่การ์ดอีกครั้งเพื่อยกเลิก</strong>
                <br />
                <span>
                  เมื่อคลิกที่การ์ดอีกครั้งจะเป็นการยกเลิกการฟิลเตอร์รายการอุปกรณ์
                </span>
              </div>
              <div>
                <DevicesCard
                  title={'โพรบ'}
                  count={Math.floor(Math.random() * 9)}
                  times={'ครั้ง'}
                  svg={<RiTempColdLine />}
                  cardname={''}
                  active={false}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  )
}