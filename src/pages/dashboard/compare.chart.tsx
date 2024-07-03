import { Breadcrumbs, Typography } from "@mui/material"
import { Container, Dropdown, Form, Modal } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { RiArrowRightSLine, RiCloseLine, RiDashboardFill, RiFilePdf2Line, RiFolderSharedLine, RiImageLine, RiLoader3Line, RiPrinterLine } from "react-icons/ri"
import { Link } from "react-router-dom"
import CompareChartComponent from "../../components/dashboard/compare.chart.component"
import { DeviceState, DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { useSelector } from "react-redux"
import Loading from "../../components/loading/loading"
import { ExportandAuditFlex, FilterContainer, FilterSearchBtn, FullchartBodyChartCon, FullchartHead, FullchartHeadBtn, FullchartHeadExport, FullchartHeadLeft, GlobalButton, GlobalButtoncontainer, LineHr, ModalHead, TableInfoDevice } from "../../style/style"
import { useRef, useState } from "react"
import toast from "react-hot-toast"
import html2canvas from "html2canvas"
import { PDFViewer } from "@react-pdf/renderer"
import Fullchartpdf from "../../components/pdf/fullchartpdf"

const Comparechart = () => {
  const { t } = useTranslation()
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const { expand } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const [pageNumber, setPagenumber] = useState(1)
  const canvasChartRef = useRef<HTMLDivElement | null>(null)
  const tableInfoRef = useRef<HTMLDivElement | null>(null)
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const [convertImage, setConvertImage] = useState('')
  const [filterDate, setFilterDate] = useState({
    startDate: '',
    endDate: ''
  })

  const handleShow = () => {
    if (devices.length > 0) {
      exportChart()
      setShow(true)
    } else {
      toast.error("Data not found")
    }
  }

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

  return (
    <Container fluid>
      <Breadcrumbs className="mt-3"
        separator={<RiArrowRightSLine fontSize={20} />}
      >
        <Link to={'/dashboard'}>
          <RiDashboardFill fontSize={20} />
        </Link>
        <Link to={'/dashboard/fullchart'}>
          {t('pageChart')}
        </Link>
        <Typography className="compare-text">{t('chartCompare')}</Typography>
      </Breadcrumbs>
      <FullchartHead>
        <FullchartHeadLeft>
          <FullchartHeadBtn $primary={pageNumber === 1} onClick={() => setPagenumber(1)}>{t('chartDay')}</FullchartHeadBtn>
          {/* <FullchartHeadBtn $primary={pageNumber === 2} onClick={() => { }}>{t('chartWeek')}</FullchartHeadBtn>
          <FullchartHeadBtn $primary={pageNumber === 3} onClick={() => setPagenumber(3)}>{t('chartCustom')}</FullchartHeadBtn> */}
        </FullchartHeadLeft>
        <ExportandAuditFlex>
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
      {pageNumber === 3 &&
        <FilterContainer>
          <Form.Control
            type="datetime-local"
            value={filterDate.startDate}
            onChange={(e) => setFilterDate({ ...filterDate, startDate: e.target.value })} />
          <Form.Control
            type="datetime-local"
            value={filterDate.endDate}
            onChange={(e) => setFilterDate({ ...filterDate, endDate: e.target.value })} />
          <FilterSearchBtn onClick={() => { }}>{t('searchButton')}</FilterSearchBtn>
        </FilterContainer>}
      <FullchartBodyChartCon $primary={expand} ref={canvasChartRef}>
        <TableInfoDevice ref={tableInfoRef}>
          <h4>{localStorage.getItem('hosname')}</h4>
        </TableInfoDevice>
        {
          devices.length > 0 ?
            <CompareChartComponent
              chartData={devices} />
            :
            <Loading loading={true} title={t('loading')} icn={<RiLoader3Line />} />
        }
      </FullchartBodyChartCon>
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
            convertImage !== '' ?
              <PDFViewer style={{ width: '100%', height: '100vh' }}>
                <Fullchartpdf
                  title={'Chart-Report'}
                  chartIMG={convertImage}
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
    </Container>
  )
}

export default Comparechart