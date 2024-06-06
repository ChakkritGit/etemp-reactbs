import { RiFullscreenLine } from 'react-icons/ri'
import { logtype } from '../../types/log.type'
import {
  ChartCardHeah, ChartCardHeahBtn, ChartContainer
} from '../../style/style'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Apexchart from './apexchart'

type chartData = {
  data: logtype[] | undefined,
  tempMin: number | undefined,
  tempMax: number | undefined
}

export default function Chart(chartData: chartData) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const openFullchart = () => {
    localStorage.setItem('devSerial', chartData.data !== undefined ? chartData.data[0].devSerial : '')
    navigate('/dashboard/fullchart')
    window.scrollTo(0, 0)
  }

  return (
    <ChartContainer>
      <ChartCardHeah>
        <span>{t('charttitle')}</span>
        <ChartCardHeahBtn onClick={openFullchart}>
          <RiFullscreenLine />
        </ChartCardHeahBtn>
      </ChartCardHeah>
      <Apexchart
        chartData={chartData.data as logtype[]}
        devicesData={{
          temp_min: chartData.tempMin,
          temp_max: chartData.tempMax
        }}
        doorHeight={80}
        doorWidth={undefined}
        tempHeight={460}
        tempWidth={undefined}
      />
    </ChartContainer>
  )
}
