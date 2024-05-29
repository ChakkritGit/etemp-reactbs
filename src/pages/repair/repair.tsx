import { Container, Modal } from "react-bootstrap"
import {
  Actiontabledev, DelUserButton, FormBtn, FormFlexBtn,
  ManageRepairBody, ModalHead, RepairContainer,
  RepairHeader, RepairPrintBtn
} from "../../style/style"
import Addrepair from "./addrepair"
import { useEffect, useRef, useState } from "react"
import axios, { AxiosError } from "axios"
import { repairType } from "../../types/repair.type"
import { devicesType } from "../../types/device.type"
import DataTable, { TableColumn } from "react-data-table-component"
import { useTranslation } from "react-i18next"
import { swalWithBootstrapButtons } from "../../components/dropdown/sweetalertLib"
import { RiCloseLine, RiDeleteBin2Line, RiPrinterLine } from "react-icons/ri"
import Swal from "sweetalert2"
import ReactToPrint from "react-to-print"
import PrintComponent from "./printComponent"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { responseType } from "../../types/response.type"


export default function Repair() {
  const { t } = useTranslation()
  const { searchQuery, token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const [repairData, setRepairdata] = useState<repairType[]>([])
  const [repairDataPrint, setRepairdataprint] = useState<repairType[]>([])
  const [deviceData, setDevicedata] = useState<devicesType[]>([])
  const [show, setshow] = useState(false)
  const componentRef = useRef<HTMLDivElement | null>(null)

  const closemodal = () => {
    setshow(false)
  }

  const fetchData = async () => {
    try {
      const response = await axios
        .get<responseType<repairType[]>>(`${import.meta.env.VITE_APP_API}/repair`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setRepairdata(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error('Unknown Error', error)
      }
    }

    try {
      const response = await axios
        .get(`${import.meta.env.VITE_APP_API}/device`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setDevicedata(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error('Unknown Error', error)
      }
    }
  }

  const deleteRepair = async (reID: string) => {
    try {
      const response = await axios
        .delete<responseType<repairType>>(`${import.meta.env.VITE_APP_API}/repair/${reID}`, {
          headers: { authorization: `Bearer ${token}` }
        })
      Swal.fire({
        title: t('alert_header_Success'),
        text: response.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
      fetchData()
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          title: t('alert_header_Error'),
          text: error.response?.data.message,
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        })
      } else {
        Swal.fire({
          title: t('alert_header_Error'),
          text: 'Unknown Error',
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const printrepair = async (reID: string) => {
    const newArr = await repairData.filter((items) => items.repairId === reID)
    setRepairdataprint(newArr)
    setshow(true)
  }

  const columns: TableColumn<repairType>[] = [
    {
      name: t('ward_no'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true,
    },
    {
      name: t('tb_dev_sn'),
      cell: ((items) => {
        return deviceData.filter((item) => item.devId === items.devId).map((items) => items.devSerial)
      })
    },
    {
      name: t('field_displayname'),
      selector: (item) => item.repairInfo,
      sortable: false,
      center: true
    },
    {
      name: t('details'),
      selector: (item) => item.repairDetails,
      sortable: false,
      center: true
    },
    {
      name: t('address'),
      selector: (item) => item.repairLocation,
      sortable: false,
      center: true
    },
    {
      name: t('telnumber'),
      selector: (item) => item.telePhone,
      sortable: false,
      center: true
    },
    {
      name: t('warranty'),
      cell: ((item) => {
        if (item.warrantyStatus === '1') {
          return <span>{t('aftersale')}</span>
        } else if (item.warrantyStatus === '2') {
          return <span>{t('expired')}</span>
        } else if (item.warrantyStatus === '3') {
          return <span>{t('ma')}</span>
        } else {
          return <span>{t('etc')}</span>
        }
        return <></>
      }),
      sortable: false,
      center: true
    },
    {
      name: t('hos_action'),
      cell: ((item, index) => (
        <Actiontabledev key={index}>
          <Addrepair
            pagestate='edit'
            fetchdata={fetchData}
            devdata={item}
          />
          <DelUserButton onClick={() =>
            swalWithBootstrapButtons
              .fire({
                title: t('deleteuserTitle'),
                text: t('deleteuserText'),
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: t('deletebtn'),
                cancelButtonText: t('cancelbtn'),
                reverseButtons: false,
              })
              .then((result) => {
                if (result.isConfirmed) {
                  deleteRepair(item.repairId)
                }
              })}>
            <RiDeleteBin2Line />
          </DelUserButton>
        </Actiontabledev>
      )),
      sortable: false,
      center: true,
    },
    {
      name: t('print'),
      cell: ((items) => {
        return <RepairPrintBtn key={items.repairId} onClick={() => printrepair(items.repairId)}>
          <RiPrinterLine />
        </RepairPrintBtn>
      }),
      sortable: false,
      center: true,
    }
  ]

  const filteredItems = repairData.filter(item => item.repairInfo && item.repairInfo.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Container fluid>
      <RepairContainer>
        <RepairHeader className="mb-3 mt-3">
          <h3>{t('repairtitle')}</h3>
          <Addrepair
            pagestate='add'
            fetchdata={fetchData}
            devdata={{} as repairType}
          />
        </RepairHeader>
      </RepairContainer>
      <ManageRepairBody>
        {/* {JSON.stringify(repairData)} */}
        <DataTable
          className="hiTDLB-st"
          responsive={true}
          columns={columns}
          data={filteredItems}
          pagination
        />
      </ManageRepairBody>

      <Modal show={show} size="lg" scrollable onHide={closemodal}>
        <Modal.Header>
          <ModalHead>
            <strong>
              Print
            </strong>
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Modal.Body>
          <PrintComponent
            data={repairDataPrint}
            componentRef={componentRef}
          />
        </Modal.Body>
        <Modal.Footer>
          <FormFlexBtn>
            <ReactToPrint
              trigger={() =>
                <FormBtn type="submit">
                  <RiPrinterLine />
                  Print
                </FormBtn>}
              content={() => componentRef.current}
              pageStyle={`@page { size: portrait; margin: 5mm; padding: 0mm; }`}
            />
          </FormFlexBtn>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
