import { Container, Dropdown, Form } from "react-bootstrap"
import { Link } from "react-router-dom"
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import {
  DeviceCardFooterDoor, DoorTableContainer, FilterContainer, FilterSearchBtn,
  FulltableBody, FulltableBodyChartCon, FulltableContainer, FulltableExportHeadBtn, FulltableHead, FulltableHeadBtn,
  FulltableHeadLeft, LineHr
} from "../../style/style"
import {
  RiDashboardFill,
  RiDoorClosedLine, RiDoorOpenLine, RiFileCloseLine, RiFileExcel2Line,
  RiFolderSharedLine, RiLoader3Line, RiPrinterLine
} from "react-icons/ri"
import { useEffect, useState } from "react"
import { logtype } from "../../types/log.type"
import { devicesType } from "../../types/device.type"
import axios, { AxiosError } from "axios"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import DataTable, { TableColumn } from "react-data-table-component"
import Loading from "../../components/loading/loading"
import * as XLSX from 'xlsx'
import { RiArrowRightSLine } from "react-icons/ri"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { cookies, getDateNow } from "../../constants/constants"
import { responseType } from "../../types/response.type"
import { motion } from "framer-motion"
import { items } from "../../animation/animate"
import { setSearchQuery, setShowAlert } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"

export default function Fulltable() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const [pageNumber, setPagenumber] = useState(1)
  const [logData, setLogData] = useState<logtype[]>([])
  const [devData, setDevData] = useState<devicesType>()
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<logtype[]>([])
  const { searchQuery, deviceId, expand, cookieDecode, Serial } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const [filterDate, setFilterDate] = useState({
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  const fetchData = async () => {
    try {
      const responseData = await axios
        .get<responseType<devicesType>>(`${import.meta.env.VITE_APP_API}/device/${deviceId ? deviceId : cookies.get('devid')}`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setDevData(responseData.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          console.error('Something wrong' + error)
        }
      } else {
        console.error('Uknown error: ', error)
      }
    }
  }

  const Logday = async () => {
    setPagenumber(1)
    setLogData([])
    try {
      setLoading(true)
      const responseData = await axios
        .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=day&devSerial=${Serial ? Serial : cookies.get('devSerial')}&type=table`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setLogData(responseData.data.data.map((items) => items).reverse())
      setLoading(false)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          console.error('Something wrong' + error)
        }
      } else {
        console.error('Uknown error: ', error)
      }
    }
  }
  const Logweek = async () => {
    setPagenumber(2)
    setLogData([])
    try {
      setLoading(true)
      const responseData = await axios
        .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=week&devSerial=${Serial ? Serial : cookies.get('devSerial')}&type=table`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setLogData(responseData.data.data.map((items) => items).reverse())
      setLoading(false)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          console.error('Something wrong' + error)
        }
      } else {
        console.error('Uknown error: ', error)
      }
    }
  }

  const Logmonth = async () => {
    setPagenumber(3)
    setLogData([])
    try {
      const responseData = await axios
        .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=month&devSerial=${Serial ? Serial : cookies.get('devSerial')}&type=table`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setLogData(responseData.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          console.error('Something wrong' + error)
        }
      } else {
        console.error('Uknown error: ', error)
      }
    }
  }

  const Logcustom = async () => {
    const { endDate, startDate } = filterDate
    let startDateNew = new Date(filterDate.startDate)
    let endDateNew = new Date(filterDate.endDate)
    let timeDiff = Math.abs(endDateNew.getTime() - startDateNew.getTime())
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    if (startDate !== '' && endDate !== '') {
      if (diffDays <= 31) {
        try {
          const responseData = await axios
            .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=${filterDate.startDate},${filterDate.endDate}&devSerial=${Serial ? Serial : cookies.get('devSerial')}&type=table`, {
              headers: { authorization: `Bearer ${token}` }
            })
          setLogData(responseData.data.data.map((items) => items).reverse())
        } catch (error) { //up
          console.error('Something wrong' + error)
        }
      } else {
        Swal.fire({
          title: t('alertHeaderWarning'),
          text: t('customMessageLogData'),
          icon: "warning",
          timer: 3000,
          showConfirmButton: false,
        })
      }
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('complete_field'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [pageNumber, token])

  useEffect(() => {
    if (token) {
      Logday()
    }
  }, [token])

  useEffect(() => {
    const filtered = logData.filter((items) =>
      items.createAt && items.createAt.substring(11, 16).toLowerCase().includes(searchQuery.toLowerCase()))
    setTableData(filtered)
  }, [searchQuery, pageNumber, logData])

  const columns: TableColumn<logtype>[] = [
    {
      name: t('deviceNoTb'),
      cell: (item, index) => {
        return <div
          key={item.devSerial}>
          {tableData.length - index}
        </div>
      },
      sortable: false,
      center: true,
      width: '65px'
    },
    {
      name: t('deviceDate'),
      cell: (items) => new Date(items.createAt).toLocaleString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        timeZone: 'UTC'
      }),
      sortable: false,
      center: true,
      width: '90px'
    },
    {
      name: t('deviceTime'),
      cell: (items) => new Date(items.createAt).toLocaleString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      }),
      sortable: false,
      center: true,
      width: '70px'
    },
    {
      name: t('deviceTempTb'),
      selector: (items) => items.tempAvg + ' °C',
      sortable: false,
      center: true
    },
    {
      name: t('deviceHumiTb'),
      selector: (items) => items.humidityAvg + ' %',
      sortable: false,
      center: true
    },
    {
      name: t('deviceSdCard'),
      cell: (items) => items.sdCard === "1" ? <span>{t('stateProblem')}</span> : <span>{t('stateNormal')}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('deviceProbeTb'),
      cell: (items) => {
        if (items.tempAvg === 0 || items.tempAvg >= 120 || items.tempAvg <= -40) {
          return <span>{t('stateProblem')}</span>
        } else {
          return <span>{t('stateNormal')}</span>
        }
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceDoorTb'),
      cell: (items) => (
        <DoorTableContainer>
          {devData?.log[0]?.door1 ?
            <DeviceCardFooterDoor
              $primary={
                items.door1 === "1"
              }>
              {
                items.door1 === "1" ?
                  <RiDoorOpenLine />
                  :
                  <RiDoorClosedLine />
              }
            </DeviceCardFooterDoor>
            :
            devData?.log[0]?.door2 ?
              <>
                <DeviceCardFooterDoor
                  $primary={
                    items.door1 === "1"
                  }>
                  {
                    items.door1 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
                <DeviceCardFooterDoor
                  $primary={
                    items.door2 === "1"
                  }>
                  {
                    items.door2 === "1" ?
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
                    items.door1 === "1"
                  }>
                  {
                    items.door1 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
                <DeviceCardFooterDoor
                  $primary={
                    items.door2 === "1"
                  }>
                  {
                    items.door2 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
                <DeviceCardFooterDoor
                  $primary={
                    items.door3 === "1"
                  }>
                  {
                    items.door3 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
              </>}
        </DoorTableContainer>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('devicePlugTb'),
      cell: (items) => items.ac === '0' ? <span>{t('stateNormal')}</span> : <span>{t('stateProblem')}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('deviceBatteryTb'),
      cell: (items) => items.battery + '%',
      sortable: false,
      center: true
    }
  ]

  const convertArrayOfObjectsToExcel = (array: logtype[]) => {
    return new Promise<boolean>((resolve, reject) => {
      if (array.length > 0) {
        const newArray = array.map((items, index) => {
          return {
            No: index + 1,
            DeviceSN: items.device?.devSerial,
            DeviceName: items.device?.devDetail,
            // TemeratureMax: items.probe[0]?.tempMax,
            // TemeratureMin: items.probe[0]?.tempMin,
            Date: new Date(items.createAt).toLocaleString('th-TH', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              timeZone: 'UTC'
            }),
            Time: new Date(items.createAt).toLocaleString('th-TH', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZone: 'UTC'
            }),
            Temperature: items.tempAvg,
            Humidity: items.humidityAvg,
            Door1: items.door1 === "1" ? t('stateOn') : t('stateOff'),
            Door2: items.door2 === "1" ? t('stateOn') : t('stateOff'),
            Door3: items.door3 === "1" ? t('stateOn') : t('stateOff'),
            Connectivity: items.internet === '1' ? t('stateDisconnect') : t('stateConnect'),
            Plug: items.ac ? t('stateProblem') : t('stateNormal'),
            Battery: items.battery + '%'
          }
        })

        const ws = XLSX.utils.json_to_sheet(newArray)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, String(newArray[0].DeviceSN))

        try {
          XLSX.writeFile(wb, 'eTEMP-data-table' + '.xlsx')
          resolve(true)
        } catch (error) {
          reject(false)
        }
      } else {
        reject(false)
      }
    })
  }

  return (
    <Container fluid>
      <motion.div
        variants={items}
        initial="hidden"
        animate="visible"
      >
        <Breadcrumbs className="mt-3"
          separator={<RiArrowRightSLine fontSize={20} />}
        >
          <Link to={'/dashboard'}>
            <RiDashboardFill fontSize={20} />
          </Link>
          <Typography color="text.primary">{t('pageTable')}</Typography>
        </Breadcrumbs>
        <FulltableHead>
          <FulltableHeadLeft>
            <FulltableHeadBtn $primary={pageNumber === 1} onClick={Logday}>{t('chartDay')}</FulltableHeadBtn>
            <FulltableHeadBtn $primary={pageNumber === 2} onClick={Logweek}>{t('chartWeek')}</FulltableHeadBtn>
            <FulltableHeadBtn $primary={pageNumber === 3} onClick={Logmonth}>{t('month')}</FulltableHeadBtn>
            <FulltableHeadBtn $primary={pageNumber === 4} onClick={() => setPagenumber(4)}>{t('chartCustom')}</FulltableHeadBtn>
          </FulltableHeadLeft>
          <div>
            <Dropdown>
              <Dropdown.Toggle variant="0" className="border-0 p-0">
                <FulltableExportHeadBtn>
                  <RiFolderSharedLine />
                  {t('exportFile')}
                </FulltableExportHeadBtn>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => {
                  toast.promise(
                    convertArrayOfObjectsToExcel(tableData),
                    {
                      loading: 'Downloading',
                      success: <span>Downloaded</span>,
                      error: <span>Something wrong</span>,
                    }
                  )
                }}>
                  <RiFileExcel2Line />
                  <span>Excel</span>
                </Dropdown.Item>
                <LineHr $mg={.5} />
                <Dropdown.Item>
                  <RiPrinterLine />
                  <span>Print</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </FulltableHead>
        <FulltableBody $primary={pageNumber !== 4}>
          <FulltableBodyChartCon $primary={expand}>
            {pageNumber === 4 &&
              <FilterContainer>
                <Form.Control
                  type="date"
                  min={devData?.dateInstall.split('T')[0]}
                  max={filterDate.endDate !== '' ? filterDate.endDate : getDateNow()}
                  value={filterDate.startDate}
                  onChange={(e) => setFilterDate({ ...filterDate, startDate: e.target.value })} />
                <Form.Control
                  type="date"
                  min={filterDate.startDate}
                  max={getDateNow()}
                  value={filterDate.endDate}
                  onChange={(e) => setFilterDate({ ...filterDate, endDate: e.target.value })} />
                <FilterSearchBtn onClick={Logcustom}>{t('searchButton')}</FilterSearchBtn>
              </FilterContainer>
            }{
              loading ?
                <Loading loading={true} title={t('loading')} icn={<RiLoader3Line />} />
                :
                logData.length === 0 ?
                  <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                  :
                  <FulltableContainer>
                    <DataTable
                      responsive={true}
                      columns={columns}
                      data={tableData}
                      pagination
                      paginationRowsPerPageOptions={[10, 30, 50, 80, 100]}
                      paginationPerPage={10}
                      dense
                    />
                  </FulltableContainer>
            }
          </FulltableBodyChartCon>
        </FulltableBody>
      </motion.div>
    </Container>
  )
}
