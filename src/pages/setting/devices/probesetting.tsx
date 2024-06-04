import { useTranslation } from "react-i18next";
import { Actiontableprobe, DelProbeButton, ManageProbeBody, ManageProbeContainer, ManageProbeHeader } from "../../../style/components/manage.probe";
import Addprobe from "./addprobe";
import DataTable, { TableColumn } from "react-data-table-component";
import { probeType } from "../../../types/probe.type";
import { useDispatch, useSelector } from "react-redux";
import { DeviceStateStore, ProbeState, UtilsStateStore } from "../../../types/redux.type";
import { swalWithBootstrapButtons } from "../../../components/dropdown/sweetalertLib";
import { RiDeleteBin2Line } from "react-icons/ri";
import axios, { AxiosError } from "axios";
import { storeDispatchType } from "../../../stores/store";
import { fetchProbeData } from "../../../stores/probeSlice";
import Swal from "sweetalert2";
import { responseType } from "../../../types/response.type";

export default function Probesetting() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { searchQuery, token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { probeData } = useSelector<DeviceStateStore, ProbeState>((state) => state.probe)

  const deleteProbe = async (probeId: string) => {
    try {
      const response = await axios.delete<responseType<probeType>>(`${import.meta.env.VITE_APP_API}/probe/${probeId}`, {
        headers: { authorization: `Bearer ${token}` }
      })
      dispatch(fetchProbeData(token))
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

  const columns: TableColumn<probeType>[] = [
    {
      name: 'ลำดับ',
      cell: (_, index) => <span>{index + 1}</span>,
      sortable: false,
      center: true
    },
    {
      name: 'ชื่อโพรบ',
      cell: (items) => <span>{items.probeName ? items.probeName : 'Name is not assigned'}</span>,
      sortable: false,
      center: true
    },
    {
      name: 'ประเภทโพรบ',
      cell: (items) => <span>{items.probeType ? items.probeType : 'Type is not assigned'}</span>,
      sortable: false,
      center: true
    },
    {
      name: 'ช่อง',
      cell: (items) => <span>{items.probeCh}</span>,
      sortable: false,
      center: true
    },
    {
      name: 'ตำแหน่ง',
      cell: (items) => <span>{items.location ? items.location : '- -'}</span>,
      sortable: false,
      center: true
    },
    {
      name: 'ไอดีอุปกรณ์',
      cell: (items) => <span>{items.device.devSerial}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('hos_action'),
      cell: (items, index) => (
        <Actiontableprobe key={index}>
          <Addprobe
            pagestate={'edit'}
            probeData={items}
            key={items.probeId}
          />
          <DelProbeButton onClick={() =>
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
                  deleteProbe(items.probeId)
                }
              })}>
            <RiDeleteBin2Line />
          </DelProbeButton>
        </Actiontableprobe>
      ),
      center: true,
      sortable: false,
    }
  ]

  // Filter Data
  const filteredItems = probeData.filter(item => item.probeName && item.probeName.toLowerCase().includes(searchQuery.toLowerCase()) || item.probeType.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <ManageProbeContainer>
      <ManageProbeHeader className="mb-3">
        <h3>{t('จัดการโพรบ')}</h3>
        <Addprobe
          pagestate={'add'}
        />
      </ManageProbeHeader>
      <ManageProbeBody>
        <DataTable
          columns={columns}
          data={filteredItems}
          paginationPerPage={10}
          pagination
          responsive
        />
      </ManageProbeBody>
    </ManageProbeContainer>
  )
}
