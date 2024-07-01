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
  DeviceListFlex, DeviceStateNetwork, FilterHomeHOSWARD, HomeContainerFlex, ListBtn,
  SubWardColumnFlex
} from "../../style/style"
import DevicesInfoCard from "../../components/home/devicesInfoCard"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useEffect } from "react"
import { wardsType } from "../../types/ward.type"
import { hospitalsType } from "../../types/hospital.type"
import { devicesType } from "../../types/device.type"
import { itemsFilter } from "../../animation/animate"
import Loading from "../../components/loading/loading"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import { useDispatch, useSelector } from "react-redux"
import { DeviceState, DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { setDeviceId, setSerial, setSearchQuery, setHosId, setWardId } from "../../stores/utilsStateSlice"
import { filtersDevices, setFilterDevice } from "../../stores/dataArraySlices"
import { storeDispatchType } from "../../stores/store"
import DataTable, { TableColumn } from "react-data-table-component"
import TableModal from "../../components/home/table.modal"
import PageLoading from "../../components/loading/page.loading"
import { probeType } from "../../types/probe.type"
import { cardFilter } from "../../types/component.type"
import { resetActive } from "../../constants/constants"
import { logtype } from "../../types/log.type"
import { motion } from "framer-motion"
import { items } from "../../animation/animate"
import { userlevel } from "../../authen/authentFunc"
import { TagCurrentHos } from "../../style/components/home.styled"

type Option = {
  value: string,
  label: string,
}

interface Hospital {
  hosId: string,
  hosName: string,
}

interface Ward {
  wardId: string,
  wardName: string,
}

export default function Home() {
  const dispatch = useDispatch<storeDispatchType>()
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const { searchQuery, hosId, wardId } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
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
  const [listAndgrid, setListandgrid] = useState(Number(localStorage.getItem('listGrid') ?? 1))
  const [cardFilterData, setCardFilterData] = useState<cardFilter[]>([])

  const showtk = () => {
    setShowticks(true)
  }
  const isshowtk = () => {
    setShowticks(false)
  }

  const showToolTip = () => {
    if (localStorage.getItem('cardticks') === null) {
      localStorage.setItem('cardticks', '')
      showtk()
    } else {
      setShowticks(false)
    }
  }

  const Switchcase = (filtertext: string, cardactive: boolean) => {
    showToolTip()

    let tempFilter: devicesType[] = []
    dispatch(setSearchQuery(''))

    switch (filtertext) {
      case 'probe':
        tempFilter = devices.filter((devItems) => devItems.noti.length > 0)
        break
      case 'door':
        tempFilter = devices.filter(device =>
          device.log.some(logItem =>
            logItem.door1 === "1" || logItem.door2 === "1" || logItem.door3 === "1"
          ) && device.log.some(logItem => logItem.devSerial === device.devSerial)
        )
        break
      case 'connect':
        tempFilter = devices.filter(device =>
          device.log.some(logItem => logItem.internet === "1")
        )
        break
      case 'plug':
        tempFilter = devices.filter(device =>
          device.log.some(logItem => logItem.ac === "1")
        )
        break
      case 'sd':
        tempFilter = devices.filter(device =>
          device.log.some(logItem => logItem.sdCard === "1")
        )
        break
      case 'adjust':
        navigate("/management/logadjust")
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
      dispatch(setFilterDevice(cardactive ? tempFilter : wardId !== 'WID-DEVELOPMENT'
        ? devices.filter((items) => items.wardId === wardId)
        : devices))
    }

    if (!!active.adjust && !!active.probe && !!active.door && !!active.connect && !!active.plug
      && !!active.sd && !!active.adjust && !!active.repair && !!active.warranty) {
      dispatch(setFilterDevice(devices))
    }
  }

  useEffect(() => {
    const getCount = <K extends keyof devicesType>(key: K, condition: (items: logtype) => boolean): number =>
      devicesFilter
        .flatMap(devItems => Array.isArray(devItems[key]) ? devItems[key] as (logtype)[] : [])
        .filter((items): items is logtype => 'devSerial' in items && typeof items === 'object' && condition(items))
        .length

    const getSum = (key: keyof NonNullable<devicesType['_count']>): number =>
      devicesFilter
        .map((devItems) => devItems._count?.[key] ?? 0) // Use 0 as the default value if undefined
        .reduce((acc, val) => acc + val, 0)

    const CardFilterData = [
      {
        id: 1,
        title: t('countProbe'),
        count: getCount('noti', () => true),
        times: t('countNormalUnit'),
        svg: <RiTempColdLine />,
        cardname: 'probe',
        switchcase: Switchcase,
        active: active.probe
      },
      {
        id: 2,
        title: t('countDoor'),
        count: getSum('noti'),
        // count: getCount('log', (items) => items.door1 === "1" || items.door2 === "1" || items.door3 === "1"),
        times: t('countNormalUnit'),
        svg: <RiDoorClosedLine />,
        cardname: 'door',
        switchcase: Switchcase,
        active: active.door
      },
      {
        id: 3,
        title: t('countConnect'),
        count: getCount('log', (items) => items.internet === "1"),
        times: t('countNormalUnit'),
        svg: <RiSignalWifi1Line />,
        cardname: 'connect',
        switchcase: Switchcase,
        active: active.connect
      },
      {
        id: 4,
        title: t('countPlug'),
        count: getCount('log', (items) => items.ac === "1"),
        times: t('countNormalUnit'),
        svg: <RiPlugLine />,
        cardname: 'plug',
        switchcase: Switchcase,
        active: active.plug
      },
      {
        id: 5,
        title: t('countSdCard'),
        count: getCount('log', (items) => items.sdCard === "1"),
        times: t('countNormalUnit'),
        svg: <RiSdCardMiniLine />,
        cardname: 'sd',
        switchcase: Switchcase,
        active: active.sd
      },
      {
        id: 6,
        title: t('countAdjust'),
        count: getSum('history'),
        times: t('countNormalUnit'),
        svg: <RiListSettingsLine />,
        cardname: 'adjust',
        switchcase: Switchcase,
        active: active.adjust
      },
      {
        id: 8,
        title: t('countWarranty'),
        count: getSum('warranty'),
        times: t('countDeviceUnit'),
        svg: <RiShieldCheckLine />,
        cardname: 'warranty',
        switchcase: Switchcase,
        active: active.warranty
      },
      {
        id: 7,
        title: t('countRepair'),
        count: getSum('repair'),
        times: t('countDeviceUnit'),
        svg: <RiFolderSettingsLine />,
        cardname: 'repair',
        switchcase: Switchcase,
        active: active.repair
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

  const updateLocalStorageAndDispatch = (key: string, id: string | undefined, action: Function) => {
    localStorage.setItem(key, String(id))
    dispatch(action(String(id)))
  }

  const getHospital = (hospitalID: string | undefined) => {
    updateLocalStorageAndDispatch('selectHos', hospitalID, setHosId)
    setWardname(wardData.filter((items) => items.hospital.hosId === hospitalID))
  }

  const getWard = (wardID: string | undefined) => {
    updateLocalStorageAndDispatch('selectWard', wardID, setWardId)
  }

  useEffect(() => {
    const filteredDevices = wardId !== 'WID-DEVELOPMENT'
      ? devices.filter((items) => items.wardId === wardId)
      : devices
    dispatch(setFilterDevice(filteredDevices))
  }, [wardId, devices])

  const columns: TableColumn<devicesType>[] = [
    {
      name: t('deviceNameTb'),
      selector: (items) => items.devDetail ? items.devDetail : 'Name is not assigned',
      sortable: false,
      center: true
    },
    {
      name: t('deviceSerialTb'),
      cell: (items) => <span title={items.devSerial}>...{items.devSerial.substring(17)}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('deviceLocationTb'),
      cell: (items) => <span title={items.locInstall !== 'null' ? items.locInstall : '- -'}>{items.locInstall !== 'null' ? items.locInstall : '- -'}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('deviceTempTb'),
      cell: (items) => <span key={items.devSerial}>{items.log[0]?.tempAvg ? items.log[0]?.tempAvg.toFixed(2) + '°C' : 'No data'}</span>,
      sortable: false,
      center: true,
      width: '85px'
    },
    {
      name: t('deviceHumiTb'),
      selector: (items) => items.log[0]?.humidityAvg ? items.log[0].humidityAvg.toFixed(2) + '%' : 'No data',
      sortable: false,
      center: true,
      width: '85px'
    },
    {
      name: t('deviceProbeTb'),
      cell: ((items) => {
        const temp = items.log.filter((logItems) => logItems.devSerial === items.devSerial)
        const probe = items.probe.filter((logItems) => logItems.devSerial === items.devSerial)
        return <DeviceCardFooterInfo
          $size
          $primary={temp[0]?.tempAvg >= probe[0]?.tempMax || temp[0]?.tempAvg <= probe[0]?.tempMin ? true : false}>
          {temp[0]?.tempAvg >= probe[0]?.tempMax || temp[0]?.tempAvg <= probe[0]?.tempMin ? true : false ?
            <RiErrorWarningLine />
            :
            <RiTempColdLine />
          }
        </DeviceCardFooterInfo>
      }),
      sortable: false,
      center: true,
      width: '80px'
    },
    {
      name: t('deviceDoorTb'),
      cell: ((items) => (<DeviceCardFooterDoorFlex key={items.devId} $primary>
        {
          items.probe[0]?.door === 1 ?
            <DeviceCardFooterDoor
              $primary={items.log[0]?.door1 === "1"}
            >
              {
                items.log[0]?.door1 === "1" ?
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
                    items.log[0]?.door1 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
                <DeviceCardFooterDoor
                  $primary={items.log[0]?.door2 === "1"}
                >
                  {
                    items.log[0]?.door2 === "1" ?
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
                    items.log[0]?.door1 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
                <DeviceCardFooterDoor
                  $primary={items.log[0]?.door2 === "1"}
                >
                  {
                    items.log[0]?.door2 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
                <DeviceCardFooterDoor
                  $primary={items.log[0]?.door3 === "1"}
                >
                  {
                    items.log[0]?.door3 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
              </>
        }
      </DeviceCardFooterDoorFlex>)),
      sortable: false,
      center: true
    },
    {
      name: t('deviceConnectTb'),
      cell: (items) => <DeviceStateNetwork $primary={items.log[0]?.internet === "1"}>
        {items.log[0]?.internet === "1" ? t('deviceOffline') : t('deviceOnline')}
      </DeviceStateNetwork>,
      sortable: false,
      center: true,
      width: '90px'
    },
    {
      name: t('deviceBatteryTb'),
      selector: (items) => items.log[0]?.battery !== undefined ? items.log[0]?.battery + '%' : '- -',
      sortable: false,
      center: true,
      width: '83px'
    },
    {
      name: t('devicePlugTb'),
      selector: (items) => items.log[0]?.ac === '1' ? t('stateProblem') : t('stateNormal'),
      sortable: false,
      center: true,
      width: '70px'
    },
    {
      name: t('deviceWarrantyTb'),
      cell: ((items) => {
        const today = new Date()
        const targetDate = new Date(items.dateInstall)
        targetDate.setFullYear(targetDate.getFullYear() + 1)
        const timeDifference = targetDate.getTime() - today.getTime()
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
        return <span>{daysRemaining} {t('stateDateDay')}</span>
      }),
      sortable: false,
      center: true
    },
    {
      name: t('deviceActionTb'),
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
      name: t('probeChannelSubTb'),
      cell: (items, index) => <span key={index}>{items.probeCh}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('probeNameSubTb'),
      cell: (items, index) => <span key={index}>{items.probeName ? items.probeName : 'Name is not assigned'}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('probeTypeSubTb'),
      cell: (items, index) => <span key={index}>{items.probeType ? items.probeType : 'Type is not assigned'}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('probeTempSubTb'),
      cell: (items, index) => <span key={index}>{devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.filter((logItems) => logItems.probe === items.probeCh)[0]?.tempAvg ? devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.filter((logItems) => logItems.probe === items.probeCh)[0]?.tempAvg.toFixed(2) + '°C' : 'Data not found'}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('probeHumiSubTb'),
      cell: (items, index) => <span key={index}>{devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.filter((logItems) => logItems.probe === items.probeCh)[0]?.humidityAvg ? devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.filter((logItems) => logItems.probe === items.probeCh)[0]?.humidityAvg.toFixed(2) + '%' : 'Data not found'}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('deviceProbeTb'),
      cell: ((items) => {
        const temp = devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.filter((logItems) => logItems.probe === items.probeCh)
        return <DeviceCardFooterInfo
          $size
          $primary={temp[0]?.tempAvg >= items.tempMax || temp[0]?.tempAvg <= items.tempMin ? true : false}>
          {temp[0]?.tempAvg >= items.tempMax || temp[0]?.tempAvg <= items.tempMin ?
            <RiErrorWarningLine />
            :
            <RiTempColdLine />
          }
        </DeviceCardFooterInfo>
      }),
      sortable: false,
      center: true,
      width: '80px'
    },
    {
      name: t('probeDoorSubTb'),
      cell: ((items) =>
      (<DeviceCardFooterDoorFlex $primary>
        {
          items.door === 1 ?
            <DeviceCardFooterDoor
              $primary={
                devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door1 === "1"
              }>
              {
                devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door1 === "1" ?
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
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door1 === "1"
                  }>
                  {
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door1 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
                <DeviceCardFooterDoor
                  $primary={
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door2 === "1"
                  }>
                  {
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door2 === "1" ?
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
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door1 === "1"
                  }>
                  {
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door1 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
                <DeviceCardFooterDoor
                  $primary={
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door2 === "1"
                  }>
                  {
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door2 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
                <DeviceCardFooterDoor
                  $primary={
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door3 === "1"
                  }>
                  {
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door3 === "1" ?
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

  const mapOptions = <T, K extends keyof T>(data: T[], valueKey: K, labelKey: K): Option[] =>
    data.map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))

  const mapDefaultValue = <T, K extends keyof T>(data: T[], id: string, valueKey: K, labelKey: K): Option | undefined =>
    data.filter(item => item[valueKey] === id).map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))[0]

  return (
    <Container fluid>
      <motion.div
        variants={items}
        initial="hidden"
        animate="visible"
      >
        <Helmet>
          <meta name="description" content="page show all etemp box detect temperature realtime and nofi when temperture higher then limit This project is using the production build of React and supported redux, product copyright Thanes Development Co. Ltd." />
        </Helmet>
        {
          devices.length > 0 ?
            <HomeContainerFlex>
              <DevHomeHeadTile>
                <h5>
                  {t('showAllBox')}
                </h5>
                <TagCurrentHos>
                  {
                    userlevel() === '1' && `${hospitalsData.filter((f) => f.hosId === hosId)[0]?.hosName} - ${wardData.filter((w) => w.wardId === wardId)[0]?.wardName}`
                  }
                </TagCurrentHos>
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
                <h5>{t('detailAllBox')}</h5>
                <DeviceInfoflex>
                  {
                    !filterdata &&
                    <DeviceInfoSpan onClick={() => setFilterdata(true)}>
                      {t('deviceFilter')}
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
                          <Select
                            options={mapOptions<Hospital, keyof Hospital>(hospitalsData, 'hosId', 'hosName')}
                            defaultValue={mapDefaultValue<Hospital, keyof Hospital>(hospitalsData, hosId, 'hosId', 'hosName')}
                            onChange={(e) => getHospital(e?.value)}
                            autoFocus={false}
                          />
                          <Select
                            options={mapOptions<Ward, keyof Ward>(wardName, 'wardId', 'wardName')}
                            defaultValue={mapDefaultValue<Ward, keyof Ward>(wardData, wardId, 'wardId', 'wardName')}
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
                    <ListBtn $primary={listAndgrid === 1} onClick={() => {
                      localStorage.setItem('listGrid', String(1))
                      setListandgrid(1)
                    }}>
                      <RiListUnordered />
                    </ListBtn>
                    <ListBtn $primary={listAndgrid === 2} onClick={() => {
                      localStorage.setItem('listGrid', String(2))
                      setListandgrid(2)
                    }}>
                      <RiLayoutGridLine />
                    </ListBtn>
                  </DeviceListFlex>
                </DeviceInfoflex>
              </AboutBox>
              {
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
              }
            </HomeContainerFlex>
            :
            <PageLoading />
        }

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
      </motion.div>
    </Container>
  )
}