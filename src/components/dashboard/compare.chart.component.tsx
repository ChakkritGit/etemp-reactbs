import { devicesType } from "../../types/device.type"
import Chart from "react-apexcharts"

type compareChart = {
  chartData: devicesType[]
}

const CompareChartComponent = (compareProps: compareChart) => {
  const { chartData } = compareProps

  const timeLabels = () => {
    const arrayLabels = chartData.map((items) => items.log.length > 0 && items.log.map((items) => items.createAt)).flat()
    const uniqueArray = [...new Set(arrayLabels)]
    return uniqueArray
  }

  const seriesData = () => {
    interface seriesType {
      name: string,
      data: number[]
    }

    let array: seriesType[] = []
    chartData.map((items) => {
      if (items.log.length > 0) {
        array.push({
          name: items.devSerial,
          data: items.log?.map((items) => items.tempAvg)
        })
      }
    })
    return array
  }

  const tempLimit = () => {
    let array: number[] = []
    chartData.map((items) => {
      if (items.log.length > 0) {
        items.log.map((items) => array.push(items.tempAvg))
      }
    })
    return array
  }

  const series: ApexAxisChartSeries = seriesData()

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
      stacked: false,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        show: true,
        autoSelected: 'zoom',
        tools: {
          download: false,
          selection: false
        }
      },
      locales: [{
        "name": "en",
        "options": {
          "months": ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
          "shortMonths": ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
          "days": ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"],
          "shortDays": ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
          "toolbar": {
            "exportToSVG": "Download SVG",
            "exportToPNG": "Download PNG",
            // "menu": "Menu",
            "selection": "เลือก",
            "selectionZoom": "ซูมเลือก",
            "zoomIn": "ซูมเข้า",
            "zoomOut": "ซูมออก",
            "pan": "การแพน",
            "reset": "ยกเลิกการซูม"
          } //make it component
        }
      }],
      defaultLocale: "en"
    },
    tooltip: {
      theme: 'apexcharts-tooltip',
      x: {
        format: 'dd MMM yy HH:mm'
      },
      style: {
        fontSize: '14px'
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0
    },
    stroke: {
      lineCap: 'round',
      curve: "smooth",
      width: 1.5
    },
    xaxis: {
      type: "datetime",
      categories: timeLabels(),
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM yy',
          day: 'dd MMM',
          hour: 'HH:mm'
        }
      }
    },
    yaxis: {
      axisTicks: {
        show: true
      },
      axisBorder: {
        show: false,
      },
      min: Math.min(...(tempLimit())) - 2,
      max: Math.max(...(tempLimit())) + 2
    },
    noData: {
      text: undefined,
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: '14px',
        fontFamily: undefined
      }
    }
  }

  return (
    <Chart
      options={options}
      series={series}
      height={480}
      width={1080}
    />
  )
}

export default CompareChartComponent