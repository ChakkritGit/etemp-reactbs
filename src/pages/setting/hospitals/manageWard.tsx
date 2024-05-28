import axios, { AxiosError } from "axios"
import { useTranslation } from "react-i18next"
import Swal from "sweetalert2"
import { Actiontablehos, DelUserButton, ManageHospitalsBody, ManageHospitalsContainer, ManageWardHeader, SubWardColumnFlex } from "../../../style/style"
import { swalWithBootstrapButtons } from "../../../components/dropdown/sweetalertLib"
import { RiDeleteBin2Line } from "react-icons/ri"
import DataTable, { TableColumn } from "react-data-table-component"
import { wardsType } from "../../../types/ward.type"
import Addward from "./addward"
import { useSelector } from "react-redux"
import { DataArrayStore, DeviceStateStore, UtilsStateStore } from "../../../types/redux.type"
import { useDispatch } from "react-redux"
import { storeDispatchType } from "../../../stores/store"
import { fetchWards } from "../../../stores/dataArraySlices"
import { responseType } from "../../../types/response.type"

export default function ManageWard() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { searchQuery, token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { ward } = useSelector<DeviceStateStore, DataArrayStore>((state) => state.arraySlice)
  const { wardData } = ward

  const deleteward = async (wID: string) => {
    const url: string = `${import.meta.env.VITE_APP_API}/group/${wID}`
    try {
      const response = await axios
        .delete<responseType<wardsType>>(url, {
          headers: { authorization: `Bearer ${token}` }
        })
      dispatch(fetchWards(token))
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

  const columns: TableColumn<wardsType>[] = [
    {
      name: t('ward_no'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true,
    },
    {
      name: t('hos_name'),
      cell: (item) => item.hospital.hosName,
      center: true,
      sortable: false,
    },
    {
      name: t('ward_name'),
      cell: (item) => item.wardName,
      center: true,
      sortable: false,
    },
    {
      name: t('hos_action'),
      cell: (item, index) => (
        <Actiontablehos key={index}>
          <Addward
            pagestate={'edit'}
            warddata={{
              group_id: item.wardId,
              group_name: item.wardName,
              hospital: item.hospital
            }}
            key={item.wardId}
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
                  deleteward(item.wardId)
                }
              })}>
            <RiDeleteBin2Line />
          </DelUserButton>
        </Actiontablehos>
      ),
      center: true,
      sortable: false,
    },
  ]

  const subWardColumns: TableColumn<wardsType>[] = [
    {
      name: 'name',
      cell: (items, index) => <span key={index}>{items.hospital.hosName}</span>,
      center: false
    }
  ]

  // Filter Data
  const filteredItems = wardData.filter(item => item.wardName && item.wardName.toLowerCase().includes(searchQuery.toLowerCase()))

  const ExpandedComponent = ({ data }: { data: wardsType }) => (
    // <pre>{JSON.stringify(data, null, 2)}</pre>
    <SubWardColumnFlex>
      <DataTable
        columns={subWardColumns}
        data={[data]}
        responsive
        noTableHead
      />
    </SubWardColumnFlex>
  )

  return (
    <ManageHospitalsContainer>
      <ManageWardHeader className="mb-3">
        <h3>{t('add_wards_btn')}</h3>
        <Addward
          pagestate={'add'}
        />
      </ManageWardHeader>
      <ManageHospitalsBody>
        {/* {
          JSON.stringify(hospitalsData)
        } */}
        <DataTable
          columns={columns}
          data={filteredItems}
          expandOnRowClicked
          expandableRows
          expandableRowsComponent={ExpandedComponent}
          responsive
          pagination
        />
      </ManageHospitalsBody>
    </ManageHospitalsContainer>
  )
}
