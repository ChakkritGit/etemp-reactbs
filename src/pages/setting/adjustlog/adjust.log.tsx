import { useEffect, useState } from "react"
import { historyType } from "../../../types/hostory.type"
import axios, { AxiosError } from "axios"
import { DeviceStateStore, UtilsStateStore } from "../../../types/redux.type"
import { useDispatch, useSelector } from "react-redux"
import { responseType } from "../../../types/response.type"
import DataTable, { TableColumn } from "react-data-table-component"
import { ManageHistoryBody } from "../../../style/style"
import { useTranslation } from "react-i18next"
import { setShowAlert } from "../../../stores/utilsStateSlice"
import { storeDispatchType } from "../../../stores/store"

export default function AdjustLog() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { cookieDecode, searchQuery } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const [history, setHistory] = useState<historyType[]>([])

  const fetchHistory = async () => {
    try {
      const response = await axios.get<responseType<historyType[]>>(`${import.meta.env.VITE_APP_API}/history`, {
        headers: { authorization: `Bearer ${token}` }
      })
      setHistory(response.data.data)
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

  useEffect(() => {
    if (!token) return
    fetchHistory()
  }, [token])

  const columns: TableColumn<historyType>[] = [{
    name: t('noNumber'),
    selector: (_, index) => Number(index) + 1,
    sortable: false,
    center: true
  },
  {
    name: t('hisDetail'),
    selector: (items) => items.detail,
    sortable: false,
    center: true
  },
  {
    name: t('deviceSerialTb'),
    selector: (items) => items.devSerial,
    sortable: false,
    center: true
  },
  {
    name: t('hisUsername'),
    selector: (items) => items.user.displayName,
    sortable: false,
    center: true
  },
  {
    name: t('deviceTime'),
    selector: (items) => items.createAt,
    sortable: false,
    center: true
  }
  ]

  // Filter Data
  const filteredItems = history.filter(item => item.devSerial && item.devSerial.toLowerCase().includes(searchQuery.toLowerCase()) || item.user.displayName.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <ManageHistoryBody>
      <h3 className="my-3">{t('tabAdjustHistory')}</h3>
      <DataTable
        columns={columns}
        data={filteredItems}
        paginationRowsPerPageOptions={[10, 30, 50, 80, 100, 150, 200, 300, 500]}
        paginationPerPage={10}
        pagination
        responsive
      />
    </ManageHistoryBody>
  )
}
