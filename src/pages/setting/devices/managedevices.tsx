import axios, { AxiosError } from "axios"
import { useEffect } from "react"
import DataTable, { TableColumn } from "react-data-table-component"
import { useTranslation } from "react-i18next"
import { devicesType } from "../../../types/device.type"
import {
  Actiontabledev, DelUserButton, ManageDevSpanUnsetUserSelect, ManageDeviceBody,
  ManageDevicesContainer, ManageHospitalsHeader
} from "../../../style/style"
import { RiCloseCircleLine } from "react-icons/ri"
import { swalWithBootstrapButtons } from "../../../components/dropdown/sweetalertLib"
import Adddevform from "./adddevform"
import Swal from "sweetalert2"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { DeviceState, DeviceStateStore, UtilsStateStore } from "../../../types/redux.type"
import { useDispatch } from "react-redux"
import { storeDispatchType } from "../../../stores/store"
import { fetchDevicesData } from "../../../stores/devicesSlices"
import PageLoading from "../../../components/loading/page.loading"
import { responseType } from "../../../types/response.type"

export default function Managedev() {
  const { t, i18n } = useTranslation()
  const langs = localStorage.getItem("lang")
  const dispatch = useDispatch<storeDispatchType>()
  const { searchQuery, token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)

  useEffect(() => {
    if (langs) {
      i18n.changeLanguage(langs)
    }
  }, [i18n])

  const deactiveDevices = async (dID: string) => {
    const url: string = `${import.meta.env.VITE_APP_API}/device/${dID}`
    try {
      const response = await axios
        .put<responseType<devicesType>>(url, {
          devStatus: '0'
        }, {
          headers: { authorization: `Bearer ${token}` }
        })
      dispatch(fetchDevicesData(token))
      Swal.fire({
        title: t('alert_header_Success'),
        text: response.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
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

  const columns: TableColumn<devicesType>[] = [
    {
      name: t('ward_no'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true,
      width: '80px'
    },
    {
      name: t('tb_dev_id'),
      cell: (item) => (
        <ManageDevSpanUnsetUserSelect
          key={item.devId}
          onClick={() => {
            navigator.clipboard.writeText(item.devId)
            toast.success(t('copied'))
          }}>
          {item.devId}
        </ManageDevSpanUnsetUserSelect>
      ),
      sortable: false,
      center: true,
      width: '340px'
    },
    {
      name: t('tb_dev_sn'),
      cell: (item) => item.devSerial,
      sortable: false,
      center: true,
    },
    {
      name: t('ตำแหน่งติดตั้ง'),
      cell: (item) => item.locInstall || item.locInstall !== null ? item.locInstall : '- -',
      sortable: false,
      center: true,
    },
    {
      name: t('tb_dev_status'),
      cell: (item) => {
        if (!item.devStatus) {
          return <span>ยังไม่ติดตั้ง</span>
        } else {
          return <span>ติดตั้งแล้ว</span>
        }
      },
      sortable: false,
      center: true,
    },
    {
      name: t('hos_action'),
      cell: ((item, index) => (
        <Actiontabledev key={index}>
          <Adddevform
            pagestate={'edit'}
            devdata={item}
            key={item.devId}
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
                  deactiveDevices(item.devId)
                }
              })}>
            <RiCloseCircleLine />
          </DelUserButton>
        </Actiontabledev>
      )),
      sortable: false,
      center: true,
    },
  ]

  // Filter Data
  const filteredItems = devices.filter(item => item.devSerial && item.devSerial.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <>
      {
        devices.length > 0 ?
          <ManageDevicesContainer>
            <ManageHospitalsHeader className="mb-3 mt-3">
              <h3>{t('setting_tab_devices')}</h3>
              <Adddevform
                pagestate={'add'}
                devdata={{} as devicesType}
              />
            </ManageHospitalsHeader>
            <ManageDeviceBody>
              <DataTable
                responsive={true}
                columns={columns}
                data={filteredItems}
                paginationPerPage={10}
                pagination
              />
            </ManageDeviceBody>
          </ManageDevicesContainer>
          :
          <PageLoading />
      }
    </>
  )
}
