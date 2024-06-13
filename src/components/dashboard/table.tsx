import { RiFullscreenLine } from "react-icons/ri"
import { ChartCardHeah, ChartCardHeahBtn, TableContainer } from "../../style/style"
import { logtype } from "../../types/log.type"
import DataTable, { TableColumn } from "react-data-table-component"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { useSelector } from "react-redux"

type tableType = {
  data: logtype[],
  dev_sn: string,
  devStatus: boolean
}

export default function Table(tableType: tableType) {
  const { t } = useTranslation()
  const { searchQuery } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const [tableData, setTableData] = useState<logtype[]>([])
  const navigate = useNavigate()
  const { data, dev_sn } = tableType

  useEffect(() => {
    const filtered = data.filter((items) =>
      items.createAt && items.createAt.substring(11, 16).toLowerCase().includes(searchQuery.toLowerCase()))

    setTableData(filtered)
  }, [searchQuery])

  const columns: TableColumn<logtype>[] = [
    {
      name: t('deviceNoTb'),
      cell: (_, index) => {
        return <div>{tableData.length - index}</div>
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceSerialTb'),
      cell: () => <span title={dev_sn}>...{dev_sn.substring(17)}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('deviceTime'),
      cell: (item) => item.createAt.substring(11, 16),
      sortable: false,
      center: false
    },
    {
      name: t('probeTempSubTb'),
      cell: (item) => item.tempAvg.toFixed(2) + '°C',
      sortable: false,
      center: false
    },
    {
      name: t('probeHumiSubTb'),
      cell: (item) => item.humidityAvg.toFixed(2) + '%',
      sortable: false,
      center: false
    },
    {
      name: t('deviceConnectTb'),
      cell: (item) => item.internet === '0' ? t('deviceOnline') : t('deviceOffline'),
      sortable: false,
      center: true
    },
  ]

  const openFulltable = () => {
    localStorage.setItem('devSerial', data !== undefined ? data[0].devSerial : '')
    navigate('/dashboard/fulltable')
    window.scrollTo(0, 0)
  }

  return (
    <TableContainer>
      <ChartCardHeah>
        <span>{t('pageTable')}</span>
        <ChartCardHeahBtn onClick={openFulltable}>
          <RiFullscreenLine />
        </ChartCardHeahBtn>
      </ChartCardHeah>
      <DataTable
        responsive={true}
        columns={columns}
        data={tableData}
        pagination
        paginationRowsPerPageOptions={[12, 30, 50, 100]}
        paginationPerPage={12}
        dense
      />
    </TableContainer>
  )
}
