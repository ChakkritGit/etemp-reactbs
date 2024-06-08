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
import { setDeviceId, setSerial, setSearchQuery } from "../../stores/utilsStateSlice"
import { filtersDevices, setFilterDevice } from "../../stores/dataArraySlices"
import { storeDispatchType } from "../../stores/store"
import DataTable, { TableColumn } from "react-data-table-component"
import TableModal from "../../components/home/table.modal"
import PageLoading from "../../components/loading/page.loading"
import { probeType } from "../../types/probe.type"
import { cardFilter } from "../../types/component.type"

export default function Home() {
  const dispatch = useDispatch<storeDispatchType>()
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const { searchQuery } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
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
  const [cardFilterData, setCardFilterData] = useState<cardFilter[]>([])

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
        tempFilter = devicesFilter.filter((items) =>
          items.noti.filter((items) => items.notiDetail.split('/')[1] === "OVER" || items.notiDetail.split('/')[1] === "LOWER"))
        break
      case 'door':
        tempFilter = devicesFilter.filter((items) => items.log.filter((items) => items.door1 === "1" || items.door2 === "1" || items.door3 === "1"))
        break
      case 'connect':
        tempFilter = devicesFilter.filter((items) => items.log.filter((items) => items.internet === "1"))
        break
      case 'plug':
        tempFilter = devicesFilter.filter((items) => items.log.filter((items) => items.ac === "1"))
        break
      case 'sd':
        tempFilter = devicesFilter.filter((items) => items.log.filter((items) => items.sdCard === "1"))
        break
      case 'adjust':
        break
      case 'repair':
        navigate("/repair")
        break
      case 'warranty':
        navigate("/warranty")
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
      && !!active.sd && !!active.adjust && !!active.repair && !!active.warranty) {
      dispatch(setFilterDevice(devices))
    }
  }

  useEffect(() => {
    const CardFilterData = [
      {
        id: 1,
        title: 'probe',
        count: devicesFilter.map((devItems) => devItems.noti).flat().filter((items) => items.notiDetail.split('/')[1] === "OVER" || items.notiDetail.split('/')[1] === "LOWER").length,
        times: t('times'),
        svg: <RiTempColdLine />,
        cardname: 'probe',
        switchcase: Switchcase,
        active: active.probe
      },
      {
        id: 2,
        title: 'doors',
        count: devicesFilter.map((devItems) => devItems.log).flat().filter((items) => items.door1 === "1" || items.door2 === "1" || items.door3 === "1").length,
        times: t('times'),
        svg: <RiDoorClosedLine />,
        cardname: 'door',
        switchcase: Switchcase,
        active: active.door
      },
      {
        id: 3,
        title: 'connect',
        count: devicesFilter.map((devItems) => devItems.log).flat().filter((items) => items.internet === "1").length,
        times: t('times'),
        svg: <RiSignalWifi1Line />,
        cardname: 'connect',
        switchcase: Switchcase,
        active: active.connect
      },
      {
        id: 4,
        title: 'plug',
        count: devicesFilter.map((devItems) => devItems.log).flat().filter((items) => items.ac === "1").length,
        times: t('times'),
        svg: <RiPlugLine />,
        cardname: 'plug',
        switchcase: Switchcase,
        active: active.plug
      },
      {
        id: 5,
        title: 'sdcard',
        count: devicesFilter.map((devItems) => devItems.log).flat().filter((items) => items.sdCard === "1").length,
        times: t('times'),
        svg: <RiSdCardMiniLine />,
        cardname: 'sd',
        switchcase: Switchcase,
        active: active.sd
      },
      {
        id: 6,
        title: 'adjust',
        count: 0,
        times: t('times'),
        svg: <RiListSettingsLine />,
        cardname: 'adjust',
        switchcase: Switchcase,
        active: active.adjust
      },
      {
        id: 7,
        title: 'repair_home',
        count: Number(devicesFilter.map((devItems) => devItems._count?.repair).flat().reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0)),
        times: t('times'),
        svg: <RiFolderSettingsLine />,
        cardname: 'repair',
        switchcase: Switchcase,
        active: active.repair
      },
      {
        id: 8,
        title: 'warranty_home',
        count: Number(devicesFilter.map((devItems) => devItems._count?.warranty).flat().reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0)),
        times: t('times'),
        svg: <RiShieldCheckLine />,
        cardname: 'warranty',
        switchcase: Switchcase,
        active: active.warranty
      }
    ]
    setCardFilterData(CardFilterData)
  }, [devicesFilter, t])

  useEffect(() => {
    dispatch(setFilterDevice(devices.filter((items) =>
    (items.devSerial?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      items.devName?.toLowerCase()?.includes(searchQuery.toLowerCase()))
    )))
  }, [searchQuery, devices])

  const handleRowClicked = (row: devicesType) => {
    localStorage.setItem('devid', row.devId)
    localStorage.setItem('devSerial', row.devSerial)
    dispatch(setDeviceId(row.devId))
    dispatch(setSerial(row.devSerial))
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
      selector: (items) => items.devDetail ? items.devDetail : 'Name is not assigned',
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
      selector: (items) => items.locInstall !== 'null' ? items.locInstall : '- -',
      sortable: false,
      center: true
    },
    {
      name: t('temperature'),
      cell: (items) => <span key={items.devSerial}>{items.log[0]?.tempAvg ?? 'No data'}</span>,
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
                $primary={items.log[0]?.door1 === "1"}
              >
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
                    $primary={items.log[0]?.door1 === "1"}
                  >
                    {
                      items.log[0]?.door1 ?
                        <RiDoorOpenLine />
                        :
                        <RiDoorClosedLine />
                    }
                  </DeviceCardFooterDoor>
                  <DeviceCardFooterDoor
                    $primary={items.log[0]?.door2 === "1"}
                  >
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
                    $primary={items.log[0]?.door1 === "1"}
                  >
                    {
                      items.log[0]?.door1 ?
                        <RiDoorOpenLine />
                        :
                        <RiDoorClosedLine />
                    }
                  </DeviceCardFooterDoor>
                  <DeviceCardFooterDoor
                    $primary={items.log[0]?.door2 === "1"}
                  >
                    {
                      items.log[0]?.door2 ?
                        <RiDoorOpenLine />
                        :
                        <RiDoorClosedLine />
                    }
                  </DeviceCardFooterDoor>
                  <DeviceCardFooterDoor
                    $primary={items.log[0]?.door3 === "1"}
                  >
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
      selector: (items) => items.log[0]?.battery !== undefined ? items.log[0]?.battery + '%' : '- -',
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
            key={items.devSerial}
            deviceData={items}
            fetchData={filtersDevices}
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
      cell: (items, index) => <span key={index}>{items.probeType ? items.probeType : 'Type is not assigned'}</span>,
      sortable: false,
      center: true
    },
    {
      name: 'ProbeName',
      cell: (items, index) => <span key={index}>{items.probeName ? items.probeName : 'Name is not assigned'}</span>,
      sortable: false,
      center: true
    },
    {
      name: 'Temperature',
      cell: (items, index) => <span key={index}>{devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.filter((logItems) => logItems.probe === items.probeCh)[0]?.tempAvg ? devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.filter((logItems) => logItems.probe === items.probeCh)[0]?.tempAvg + ' °C' : 'Data not found'}</span>,
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
                  devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door1 === "1"
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
                      devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door1 === "1"
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
                      devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door2 === "1"
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
                      devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door1 === "1"
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
                      devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door2 === "1"
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
                      devicesFilter[0]?.log.find((value) => value.probe === items.probeCh)?.door3 === "1"
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
          {
            cardFilterData.map((items) => (
              <DevicesCard
                key={items.id}
                title={items.title}
                count={items.count}
                times={items.times}
                svg={items.svg}
                cardname={items.cardname}
                switchcase={items.switchcase}
                active={items.active}
              />
            ))
          }
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
                      devicesFilter.map((item, index) =>
                      (<DevicesInfoCard
                        devicesdata={item}
                        keyindex={index}
                        key={item.devSerial}
                        fetchData={filtersDevices}
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