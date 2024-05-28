import { Container, Modal } from "react-bootstrap"
import { DetailFlex, DetailWarranty, FormBtn, FormFlexBtn, ModalHead, WarrantyBody, WarrantyHead, WarrantyHeadBtn } from "../../style/style";
import { useRef, useState } from "react"
import { devicesType } from "../../types/device.type"
import Loading from "../../components/loading/loading"
import { useTranslation } from "react-i18next"
import { RiCloseLine, RiFileCloseLine, RiInformationLine, RiLoader3Line, RiPrinterLine } from "react-icons/ri"
import DataTable, { TableColumn } from "react-data-table-component"
import ReactToPrint from "react-to-print"
import Printwarranty from "./printwarranty"
import { useSelector } from "react-redux";
import { DeviceState, DeviceStateStore, UtilsStateStore } from "../../types/redux.type";

export default function Warranty() {
  const { t } = useTranslation()
  const [pagenumber, setpagenumber] = useState(1)
  const { searchQuery } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { devices, devicesLoading } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const devicesArray = devices.filter((items) => items.devSerial.includes(searchQuery) || items.devName.includes(searchQuery))
  const [show, setshow] = useState(false)
  const [deviceDetails, setDevicedetails] = useState<devicesType[]>([])
  const componentRef = useRef<HTMLDivElement | null>(null)

  const expiredArray = devicesArray.filter((items) => {
    const today = new Date()
    const targetDate = new Date(items.LocInstall)
    targetDate.setFullYear(targetDate.getFullYear() + 1)
    const timeDifference = targetDate.getTime() - today.getTime()
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
    return daysRemaining <= 0
  })

  const onwarrantyArray = devicesArray.filter((items) => {
    const today = new Date()
    const targetDate = new Date(items.dateInstall)
    targetDate.setFullYear(targetDate.getFullYear() + 1)
    const timeDifference = targetDate.getTime() - today.getTime()
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
    return daysRemaining >= 0
  })

  const openmodal = (devID: string) => {
    setDevicedetails(devices.filter((items) => items.devId === devID))
    setshow(true)
  }

  const closemodal = () => {
    setshow(false)
  }

  const columns: TableColumn<devicesType>[] = [
    {
      name: t('no'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true,
    },
    {
      name: t('tb_dev_sn'),
      selector: (items) => items.devSerial,
      sortable: false,
      center: true,
    },
    {
      name: t('install_date'),
      selector: (items) => items.dateInstall,
      sortable: false,
      center: true,
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
      center: true,
    },
    {
      name: t('hos_action'),
      cell: ((items) => {
        return <DetailFlex>
          <DetailWarranty
            onClick={() => openmodal(items.devId)}>
            <RiInformationLine />
          </DetailWarranty>
        </DetailFlex>
      }),
      sortable: false,
      center: true,
    },
  ]

  return (
    <Container fluid>
      <WarrantyHead>
        <WarrantyHeadBtn $primary={pagenumber === 1} onClick={() => setpagenumber(1)}>{t('expired')}</WarrantyHeadBtn>
        <WarrantyHeadBtn $primary={pagenumber === 2} onClick={() => setpagenumber(2)}>{t('aftersale')}</WarrantyHeadBtn>
        <WarrantyHeadBtn $primary={pagenumber === 3} onClick={() => setpagenumber(3)}>{t('allitem')}</WarrantyHeadBtn>
      </WarrantyHead>
      <WarrantyBody>
        {
          !devicesLoading ?
            pagenumber === 1 ?
              <>
                {
                  expiredArray.length > 0 ?
                    <DataTable
                      responsive={true}
                      columns={columns}
                      data={expiredArray}
                      pagination
                      paginationRowsPerPageOptions={[10]}
                      paginationPerPage={10}
                      dense
                    />
                    :
                    <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                }
              </>
              :
              pagenumber === 2 ?
                <>
                  {
                    onwarrantyArray.length > 0 ?
                      <DataTable
                        responsive={true}
                        columns={columns}
                        data={onwarrantyArray}
                        pagination
                        paginationRowsPerPageOptions={[10, 15, 30, 50, 100, 150]}
                        paginationPerPage={10}
                        dense
                      />
                      :
                      <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                  }
                </>
                :
                <>
                  {
                    devicesArray.length > 0 ?
                      <DataTable
                        responsive={true}
                        columns={columns}
                        data={devicesArray}
                        pagination
                        paginationRowsPerPageOptions={[10, 15, 30, 50, 100, 150]}
                        paginationPerPage={10}
                        dense
                      />
                      :
                      <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                  }
                </>
            :
            <Loading loading={true} title={t('loading')} icn={<RiLoader3Line />} />
        }
      </WarrantyBody>
      <Modal scrollable show={show} onHide={closemodal} size="lg">
        <Modal.Header>
          <ModalHead>
            <strong>
              Details
            </strong>
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Modal.Body>
          {
            deviceDetails.length > 0 ?
              <Printwarranty
                data={deviceDetails}
                componentRef={componentRef}
              />
              :
              <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
          }
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
