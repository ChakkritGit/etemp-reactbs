import { Container, Dropdown, Form, Modal } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import {
  AuditGraphBtn,
  CustomChart,
  ExportandAuditFlex,
  FilterContainer, FilterSearchBtn, FullcharComparetHeadBtn, FullchartBody,
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
import axios, { AxiosError } from "axios"
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
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { cookies, getDateNow } from "../../constants/constants"
import { responseType } from "../../types/response.type"
import { wardsType } from "../../types/ward.type"
import { motion } from "framer-motion"
import { items } from "../../animation/animate"
import { setShowAlert } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"

export default function Fullchart() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const navigate = useNavigate()
  const [pageNumber, setPagenumber] = useState(1)
  const { Serial, deviceId, expand, cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token, hosName, hosImg } = cookieDecode
  const [filterDate, setFilterDate] = useState({
    startDate: '',
    endDate: ''
  })
  const [logData, setLogData] = useState<logtype[]>([])
  const [devData, setDevData] = useState<devicesType>()
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => {
    if (logData) {
      exportChart()
      setShow(true)
    } else {
      toast.error("Data not found")
    }
  }
  const [convertImage, setConvertImage] = useState('')
  const canvasChartRef = useRef<HTMLDivElement | null>(null)
  const tableInfoRef = useRef<HTMLDivElement | null>(null)
  const [validationData, setValidationData] = useState<wardsType>()

  const fetchWard = async () => {
    try {
      const response = await axios.get<responseType<wardsType>>(`${import.meta.env.VITE_APP_API}/ward/${devData?.wardId}`, { headers: { authorization: `Bearer ${token}` } })
      setValidationData(response.data.data)
    } catch (error) { //up
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error('Uknown Error', error)
      }
    }
  }

  useEffect(() => {
    if (devData) {
      fetchWard()
    }
  }, [devData])

  const fetchData = async () => {
    try {
      const responseData = await axios
        .get(`${import.meta.env.VITE_APP_API}/device/${deviceId ? deviceId : cookies.get('devid')}`, {
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
      const responseData = await axios
        .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=day&devSerial=${Serial ? Serial : cookies.get('devSerial')}`, {
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

  const Logweek = async () => {
    setPagenumber(2)
    setLogData([])
    try {
      const responseData = await axios
        .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=week&devSerial=${Serial ? Serial : cookies.get('devSerial')}`, {
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

  const Logmonth = async () => {
    setPagenumber(3)
    setLogData([])
    try {
      const responseData = await axios
        .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=month&devSerial=${Serial ? Serial : cookies.get('devSerial')}`, {
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
            .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=${filterDate.startDate},${filterDate.endDate}&devSerial=${Serial ? Serial : cookies.get('devSerial')}`, {
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
      } else {
        Swal.fire({
          title: t('alertHeaderWarning'),
          text: t('CustomMessageLogData'),
          icon: "warning",
          timer: 3000,
          showConfirmButton: false,
        })
      }
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
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
          <Typography color="text.primary">{t('pageChart')}</Typography>
        </Breadcrumbs>
        <FullchartHead>
          <FullchartHeadLeft>
            <FullchartHeadBtn $primary={pageNumber === 1} onClick={Logday}>{t('chartDay')}</FullchartHeadBtn>
            <FullchartHeadBtn $primary={pageNumber === 2} onClick={Logweek}>{t('chartWeek')}</FullchartHeadBtn>
            <FullchartHeadBtn $primary={pageNumber === 3} onClick={Logmonth}>{t('month')}</FullchartHeadBtn>
            <FullchartHeadBtn $primary={pageNumber === 4} onClick={() => setPagenumber(4)}>{t('chartCustom')}</FullchartHeadBtn>
            <span>|</span>
            <FullcharComparetHeadBtn onClick={() => navigate('compare')}>{t('chartCompare')}</FullcharComparetHeadBtn>
          </FullchartHeadLeft>
          <ExportandAuditFlex>
            <AuditGraphBtn disabled onClick={() => {
              if (logData) {
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
                  {t('exportFile')}
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
        <FullchartBody $primary={pageNumber !== 4}>
          <CustomChart>
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
              </FilterContainer>}
            {
              logData ?
                <FullchartBodyChartCon $primary={expand} ref={canvasChartRef}>
                  <TableInfoDevice ref={tableInfoRef}>
                    <h4>{hosName}</h4>
                    <span>{devData?.devDetail ? devData?.devDetail : '--'} | {devData?.devSerial}</span>
                    <span>{devData?.locInstall ? devData?.locInstall : '- -'}</span>
                  </TableInfoDevice>
                  <Apexchart
                    chartData={logData}
                    devicesData={{
                      tempMin: devData?.probe[0]?.tempMin,
                      tempMax: devData?.probe[0].tempMax
                    }}
                    tempHeight={680}
                    tempWidth={1480}
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
                convertImage !== '' && devData ?
                  <PDFViewer style={{ width: '100%', height: '100vh' }}>
                    <Fullchartpdf
                      title={'Chart-Report'}
                      image={Images_one}
                      chartIMG={convertImage}
                      dev_sn={devData.devSerial}
                      dev_name={devData.devDetail}
                      hospital={validationData?.hospital.hosName}
                      ward={validationData?.wardName}
                      datetime={String(new Date).substring(0, 25)}
                      hosImg={hosImg}
                    />
                  </PDFViewer>
                  :
                  null
              }
            </Modal.Body>
            <Modal.Footer>
              <GlobalButtoncontainer>
                <GlobalButton $color onClick={handleClose}>
                  {t('closeButton')}
                </GlobalButton>
              </GlobalButtoncontainer>
            </Modal.Footer>
          </Modal>
        </FullchartBody>
      </motion.div>
    </Container>
  )
}
