import { Container, Dropdown, Form } from "react-bootstrap"
import { Link } from "react-router-dom"
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import {
  DeviceCardFooterDoor, DoorTableContainer, FilterContainer, FilterSearchBtn,
  FulltableBody, FulltableBodyChartCon, FulltableContainer, FulltableHead, FulltableHeadBtn,
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
import axios from "axios"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import DataTable, { TableColumn } from "react-data-table-component"
import Loading from "../../components/loading/loading"
import * as XLSX from 'xlsx'
import { RiArrowRightSLine } from "react-icons/ri"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { getDateNow } from "../../constants/constants"
import { responseType } from "../../types/response.type"

export default function Fulltable() {
  const { t } = useTranslation()
  const [pageNumber, setPagenumber] = useState(1)
  const [logData, setLogData] = useState<logtype[]>([])
  const [devData, setDevData] = useState<devicesType>()
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<logtype[]>([])
  const { searchQuery, deviceId, expand, token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const [filterDate, setFilterDate] = useState({
    startDate: '',
    endDate: ''
  })

  const fetchData = async () => {
    try {
      const responseData = await axios
        .get<responseType<devicesType>>(`${import.meta.env.VITE_APP_API}/device/${deviceId ? deviceId : localStorage.getItem('devid')}`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setDevData(responseData.data.data)
    } catch (error) {
      console.error('Something wrong' + error)
    }
  }

  const Logday = async () => {
    setPagenumber(1)
    setLogData([])
    try {
      setLoading(true)
      const responseData = await axios
        .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=${'day'}&dev_id=${deviceId ? deviceId : localStorage.getItem('devid')}`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setLogData(responseData.data.data)
      setLoading(false)
    } catch (error) {
      console.error('Something wrong' + error)
    }
  }
  const Logweek = async () => {
    setPagenumber(2)
    setLogData([])
    try {
      setLoading(true)
      const responseData = await axios
        .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=${'week'}&dev_id=${deviceId ? deviceId : localStorage.getItem('devid')}`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setLogData(responseData.data.data)
      setLoading(false)
    } catch (error) {
      console.error('Something wrong' + error)
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
            .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=${filterDate.startDate},${filterDate.endDate}&dev_id=${deviceId ? deviceId : localStorage.getItem('devid')}`, {
              headers: { authorization: `Bearer ${token}` }
            })
          setLogData(responseData.data.data)
        } catch (error) {
          console.error('Something wrong' + error)
        }
      } else {
        Swal.fire({
          title: t('alert_header_Warning'),
          text: 'ช่วงเวลาที่เลือกห่างกันมากกว่า 30 วัน',
          icon: "warning",
          timer: 3000,
          showConfirmButton: false,
        })
      }
    } else {
      Swal.fire({
        title: t('alert_header_Warning'),
        text: t('complete_field'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  useEffect(() => {
    Logday()
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = logData.filter((items) =>
      items.createAt && items.createAt.substring(11, 16).toLowerCase().includes(searchQuery.toLowerCase()))
    setTableData(filtered)
  }, [searchQuery, pageNumber, logData])

  const columns: TableColumn<logtype>[] = [
    {
      name: t('no'),
      cell: (item, index) => {
        return <div
          key={item.devId}>
          {tableData.length - index}
        </div>
      },
      sortable: false,
      center: true,
      width: '65px'
    },
    {
      name: t('วันที่'),
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
      name: t('time'),
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
      name: t('temperature'),
      selector: (items) => items.tempAvg + ' °C',
      sortable: false,
      center: true
    },
    {
      name: t('Humidity'),
      selector: (items) => items.humidityAvg + ' %',
      sortable: false,
      center: true
    },
    {
      name: t('sdcard'),
      cell: (items) => !items.sdCard ? <span>{t('off')}</span> : <span>{t('on')}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('probe'),
      cell: (items) => {
        if (items.tempAvg === 0 || items.tempAvg >= 120 || items.tempAvg <= -40) {
          return <span>{t('unavailable')}</span>
        } else {
          return <span>{t('available')}</span>
        }
      },
      sortable: false,
      center: true
    },
    {
      name: t('doors'),
      cell: (items) => (
        <DoorTableContainer>
          {devData?.log[0]?.door1 ?
            <DeviceCardFooterDoor
              $primary={
                items.door1 === "1"
              }>
              {
                items.door1 ?
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
                    items.door1 ?
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
                    items.door2 ?
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
                    items.door1 ?
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
                    items.door2 ?
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
                    items.door3 ?
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
    // {
    //   name: 'connect',
    //   cell: devData.dev
    // }
    {
      name: t('plug'),
      cell: (items) => items.ac === '0' ? <span>{t('on')}</span> : <span>{t('off')}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('batter'),
      cell: (items) => items.battery + '%',
      sortable: false,
      center: true
    }
  ]

  const convertArrayOfObjectsToExcel = (array: logtype[]) => {
    return new Promise<boolean>((resolve, reject) => {
      if (array.length > 0) {
        console.log(array)
        const newArray = array.map((items, index) => {
          return {
            No: index + 1,
            DeviceSN: items.device?.devSerial,
            DeviceName: items.device?.devDetail,
            TemeratureMax: items.devId,
            TemeratureMin: items.devId,
            Temperature: items.tempAvg,
            Humidity: items.humidityAvg,
            Door1: items.door1 ? t('open') : t('close'),
            Door2: items.door1 ? t('open') : t('close'),
            Door3: items.door1 ? t('open') : t('close'),
            Connectivity: items.internet ? t('disconnect') : t('connected'),
            Plug: items.ac ? t('off') : t('on'),
            Battery: items.battery + '%',
            Time: new Date(items.createAt).toLocaleString('th-TH', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZone: 'UTC'
            })
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
    <Container>
      <Breadcrumbs className="mt-3"
        separator={<RiArrowRightSLine fontSize={20} />}
      >
        <Link to={'/dashboard'}>
          <RiDashboardFill fontSize={20} />
        </Link>
        <Typography color="text.primary">{t('tabletitle')}</Typography>
      </Breadcrumbs>
      <FulltableHead>
        <FulltableHeadLeft>
          <FulltableHeadBtn $primary={pageNumber === 1} onClick={Logday}>{t('tab_day')}</FulltableHeadBtn>
          <FulltableHeadBtn $primary={pageNumber === 2} onClick={Logweek}>{t('tab_week')}</FulltableHeadBtn>
          <FulltableHeadBtn $primary={pageNumber === 3} onClick={() => setPagenumber(3)}>{t('tab_custom')}</FulltableHeadBtn>
        </FulltableHeadLeft>
        <Dropdown>
          <Dropdown.Toggle variant="0" className="border-0 p-0">
            <FulltableHeadBtn>
              <RiFolderSharedLine />
              {t('export')}
            </FulltableHeadBtn>
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
      </FulltableHead>
      <FulltableBody $primary={pageNumber !== 3}>
        <FulltableBodyChartCon $primary={expand}>
          {pageNumber === 3 &&
            <FilterContainer>
              <Form.Control
                type="datetime-local"
                min={devData?.dateInstall.substring(0, 16)}
                max={filterDate.endDate !== '' ? filterDate.endDate : getDateNow()}
                value={filterDate.startDate}
                onChange={(e) => setFilterDate({ ...filterDate, startDate: e.target.value })} />
              <Form.Control
                type="datetime-local"
                min={filterDate.startDate}
                max={getDateNow()}
                value={filterDate.endDate}
                onChange={(e) => setFilterDate({ ...filterDate, endDate: e.target.value })} />
              <FilterSearchBtn onClick={Logcustom}>Search</FilterSearchBtn>
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
    </Container>
  )
}
