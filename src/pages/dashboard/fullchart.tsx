import { Container, Dropdown, Form, Modal } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import {
  AuditGraphBtn,
  CustomChart,
  ExportandAuditFlex,
  FilterContainer, FilterSearchBtn, FullchartBody,
  FullchartBodyChartCon, FullchartHead, FullchartHeadBtn,
  FullchartHeadExport, FullchartHeadLeft, GlobalButton,
  GlobalButtoncontainer, LineHr, ModalHead,
  TableInfoDevice
} from "../../style/style"
import { BsStars } from "react-icons/bs"
import {
  RiCloseLine, RiDashboardFill, RiFilePdf2Line,
  RiFolderSharedLine, RiImageLine, RiLoader3Line, RiPrinterLine
} from "react-icons/ri"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { logtype } from "../../types/log.type"
import { devicesType } from "../../types/device.type"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import { PDFViewer } from '@react-pdf/renderer'
import Fullchartpdf from "../../components/pdf/fullchartpdf"
import Images_one from '../../assets/images/Thanes.png'
import html2canvas from 'html2canvas'
import Loading from "../../components/loading/loading"
import { swalOptimizeChartButtons } from "../../components/dropdown/sweetalertLib"
import { RiArrowRightSLine } from "react-icons/ri"
import toast from "react-hot-toast"
import Apexchart from "../../components/dashboard/apexchart"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { getDateNow } from "../../constants/constants"

export default function Fullchart() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [pageNumber, setPagenumber] = useState(1)
  const { deviceId, expand, token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const [filterDate, setFilterDate] = useState({
    startDate: '',
    endDate: ''
  })
  const [logData, setLogData] = useState<logtype[]>([])
  const [devData, setDevData] = useState<devicesType>()
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => {
    if (logData.length > 0) {
      exportChart()
      setShow(true)
    } else {
      toast.error("Data not found")
    }
  }
  const [convertImage, setConvertImage] = useState('')
  const canvasChartRef = useRef<HTMLDivElement | null>(null)
  const tableInfoRef = useRef<HTMLDivElement | null>(null)

  const fetchData = async () => {
    try {
      const responseData = await axios
        .get(`${import.meta.env.VITE_APP_API}/device/${deviceId ? deviceId : localStorage.getItem('devid')}`, {
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
      const responseData = await axios
        .get(`${import.meta.env.VITE_APP_API}/log?filter=day&devId=${deviceId ? deviceId : localStorage.getItem('devid')}`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setLogData(responseData.data.data)
    } catch (error) {
      console.error('Something wrong' + error)
    }
  }

  const Logweek = async () => {
    setPagenumber(2)
    setLogData([])
    try {
      const responseData = await axios
        .get(`${import.meta.env.VITE_APP_API}/log?filter=week&devId=${deviceId ? deviceId : localStorage.getItem('devid')}`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setLogData(responseData.data.data)
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
            .get(`${import.meta.env.VITE_APP_API}/log?filter=${filterDate.startDate},${filterDate.endDate}&devId=${deviceId ? deviceId : localStorage.getItem('devid')}`, {
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
    fetchData()
  }, [pageNumber])

  useEffect(() => {
    Logday()
  }, [])

  const exportChart = async () => {
    if (canvasChartRef.current) {
      const canvas = canvasChartRef.current
      await html2canvas(canvas).then((canvasImage) => {
        setConvertImage(canvasImage.toDataURL('image/png', 1.0))
      })
    }
  }

  const handleDownload = async (type: string) => {
    if (canvasChartRef.current && tableInfoRef.current) {
      tableInfoRef.current.style.display = 'flex'
      const canvas = canvasChartRef.current
      const promise = html2canvas(canvas).then((canvasImage) => {
        const dataURL = canvasImage.toDataURL(type === 'png' ? 'image/png' : 'image/jpg', 1.0)

        let pagename = ""
        if (pageNumber === 1) {
          pagename = 'Day_Chart'
        } else if (pageNumber === 2) {
          pagename = 'Week_Chart'
        } else {
          pagename = 'Custom_Chart'
        }

        const link = document.createElement('a')
        link.href = dataURL
        link.download = pagename + `${type === 'png' ? '.png' : '.jpg'}`

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
      tableInfoRef.current.style.display = 'none'

      toast.promise(
        promise,
        {
          loading: 'Downloading',
          success: <span>Downloaded</span>,
          error: <span>Something wrong</span>,
        }
      )
    } else {
      toast.error("Data not found")
    }
  }

  // const handleShowEdit = () => {
  //   const newArray: logtype[] = logData.map(items => {
  //     if (items.tempAvg >= items.device.temp_max) {
  //       return {
  //         ...items,
  //         temp_avg: Math.floor(Math.random() * (items.device.temp_max - (items.device.temp_max + 5) + 1) + (items.device.temp_max - 5))
  //       }
  //     }
  //     if (items.tempAvg <= items.device.temp_min) {
  //       return {
  //         ...items,
  //         temp_avg: Math.floor(Math.random() * (items.device.temp_min - (items.device.temp_min - 5) + 1) + (items.device.temp_min + 5))
  //       }
  //     }
  //     return items
  //   })
  //   setLogData(newArray)
  // }

  return (
    <Container>
      <Breadcrumbs className="mt-3"
        separator={<RiArrowRightSLine fontSize={20} />}
      >
        <Link to={'/dashboard'}>
          <RiDashboardFill fontSize={20} />
        </Link>
        <Typography color="text.primary">{t('charttitle')}</Typography>
      </Breadcrumbs>
      <FullchartHead>
        <FullchartHeadLeft>
          <FullchartHeadBtn $primary={pageNumber === 1} onClick={Logday}>{t('tab_day')}</FullchartHeadBtn>
          <FullchartHeadBtn $primary={pageNumber === 2} onClick={Logweek}>{t('tab_week')}</FullchartHeadBtn>
          <FullchartHeadBtn $primary={pageNumber === 3} onClick={() => setPagenumber(3)}>{t('tab_custom')}</FullchartHeadBtn>
          <span>|</span>
          <FullchartHeadBtn onClick={() => navigate('compare')}>{t('compare_chart')}</FullchartHeadBtn>
        </FullchartHeadLeft>
        <ExportandAuditFlex>
          <AuditGraphBtn disabled onClick={() => {
            if (logData.length > 0) {
              swalOptimizeChartButtons
                .fire({
                  title: 'คำเตือน',
                  html: `
                เมื่อใช้ฟังก์ชันนี้กราฟจะแสดงผลต่างจากค่าจริงและปรับกราฟให้สมดุล </br> โปรดจำไว้ว่าการดำเนินการดังกล่าวจะไม่มีผลต่อข้อมูลในระบบ</br>เป็นเพียงการปรับแต่งกราฟแค่ชั่วคราว
                `,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: 'ดำเนินการต่อ',
                  cancelButtonText: 'ปิดหน้าต่าง',
                  reverseButtons: false,
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    // handleShowEdit()
                  }
                })
            } else {
              toast.error("Data not found")
            }
          }}>
            <BsStars />
            {t('optimizegraph')}
          </AuditGraphBtn>
          <Dropdown>
            <Dropdown.Toggle variant="0" className="border-0 p-0">
              <FullchartHeadExport>
                <RiFolderSharedLine />
                {t('export')}
              </FullchartHeadExport>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleDownload('png')}>
                <RiImageLine />
                <span>PNG</span>
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleDownload('jpg')}>
                <RiImageLine />
                <span>JPG</span>
              </Dropdown.Item>
              <Dropdown.Item onClick={handleShow}>
                <RiFilePdf2Line />
                <span>PDF</span>
              </Dropdown.Item>
              <LineHr $mg={.5} />
              <Dropdown.Item>
                <RiPrinterLine />
                <span>Print</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ExportandAuditFlex>
      </FullchartHead>
      <FullchartBody $primary={pageNumber !== 3}>
        <CustomChart>
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
              <FilterSearchBtn onClick={Logcustom}>{t('btn_search')}</FilterSearchBtn>
            </FilterContainer>}
          {
            logData.length > 0 ?
              <FullchartBodyChartCon $primary={expand} ref={canvasChartRef}>
                <TableInfoDevice ref={tableInfoRef}>
                  <h4>{localStorage.getItem('hosname')}</h4>
                  <span>{devData?.devName ? devData?.devName : '--'} | {devData?.devSerial}</span>
                  <span>{devData?.locInstall ? devData?.locInstall : '- -'}</span>
                </TableInfoDevice>
                <Apexchart
                  chartData={logData}
                  devicesData={{
                    temp_min: devData?.probe[0]?.tempMin,
                    temp_max: devData?.probe[0]?.tempMax
                  }}
                  doorHeight={80}
                  doorWidth={1080}
                  tempHeight={480}
                  tempWidth={1080}
                />
              </FullchartBodyChartCon>
              :
              <Loading loading={true} title={t('loading')} icn={<RiLoader3Line />} />
          }
        </CustomChart>
        <Modal size={'xl'} show={show} onHide={handleClose} scrollable>
          <Modal.Header>
            <ModalHead>
              <Modal.Title>PDF</Modal.Title>
              <button onClick={handleClose}>
                <RiCloseLine />
              </button>
            </ModalHead>
          </Modal.Header>
          <Modal.Body>
            {
              convertImage !== '' && devData !== undefined ?
                <PDFViewer style={{ width: '100%', height: '100vh' }}>
                  <Fullchartpdf
                    title={'Chart-Report'}
                    image={Images_one}
                    chartIMG={convertImage}
                    dev_sn={devData.devSerial}
                    dev_name={devData.devName}
                    hospital={'devData.ward.group_name'}
                    ward={'devData?.ward.group_name'}
                    datetime={String(new Date).substring(0, 25)}
                  />
                </PDFViewer>
                :
                null
            }
          </Modal.Body>
          <Modal.Footer>
            <GlobalButtoncontainer>
              <GlobalButton $color onClick={handleClose}>
                {t('form_btn_close')}
              </GlobalButton>
            </GlobalButtoncontainer>
          </Modal.Footer>
        </Modal>
      </FullchartBody>
    </Container>
  )
}
