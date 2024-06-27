import Chart from "react-apexcharts"
import { logTypeChart } from "../../types/log.type"
type chartType = {
  chartData: logTypeChart,
  devicesData: { temp_min: number | undefined, temp_max: number | undefined },
  doorHeight: number | string | undefined,
  doorWidth: number | string | undefined,
  tempHeight: number | string | undefined,
  tempWidth: number | string | undefined
}

const Apexchart = (chart: chartType) => {
  const { chartData, devicesData } = chart
  const { temp_max, temp_min } = devicesData



  const timeLabels = () => {
    const newLabels = Array.from([...chartData.action, ...chartData.log])
    newLabels.sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime())
    return newLabels.map((items) => items.createAt)
  }

  const doorOpen = () => {
    let array: number[] = []
    const newDoors = Array.from([...chartData.action, ...chartData.log])
    newDoors.sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime())
    newDoors.map(items => {
      if ('notiStatus' in items && items.notiStatus === false) {
        array.push(1)
      } else {
        array.push(0)
      }
    })
    return array
  }

  const chartmin = (minmax: string) => {
    let array: number[] = []
    const newlimits = Array.from([...chartData.action, ...chartData.log])
    newlimits.sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime())
    if (newlimits !== undefined) {
      for (let i = 0; i < newlimits.length; i++) {
        if (minmax === 'min') {
          array.push(Number(temp_min))
        } else {
          array.push(Number(temp_max))
        }
      }
      return array
    } else {
      return [null]
    }
  }

  // const doorSeries: ApexAxisChartSeries = [
  //   {
  //     name: 'Doors',
  //     data: doorOpen()
  //   }
  // ]

  const series: ApexAxisChartSeries = [
    {
      name: 'Temperature',
      data: chartData.log.map((items) => items.tempAvg)
    },
    {
      name: 'Humidity',
      data: chartData.log.map((items) => items.humidityAvg)
    },
    {
      name: 'Min',
      data: chartmin('min')
    },
    {
      name: 'Max',
      data: chartmin('max')
    },
    {
      name: 'Door',
      data: doorOpen()
    }
  ]

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
      animations: {
        enabled: true,
        easing: 'easeinout',
        dynamicAnimation: {
          speed: 500
        }
      },
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
      curve: ["smooth", "smooth", "smooth", "smooth", "stepline"],
      width: [2.5, 2, .8, .8, 1.5]
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
      },
      stepSize: 10,
    },
    yaxis: [
      {
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: false,
          color: "rgba(255, 76, 60 , 1)"
        },
        min: Math.min(...(chartData.log.map((items) => items.tempAvg))) - 2,
        max: Math.max(...(chartData.log.map((items) => items.tempAvg))) + 2
      },
      {
        show: true,
        opposite: false,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: false,
          color: "rgba(52, 152, 219, 1)"
        },
        min: 0,
        max: 100
      },
      {
        show: false,
        min: Math.min(...(chartData.log.map((items) => items.tempAvg))) - 2,
        max: Math.max(...(chartData.log.map((items) => items.tempAvg))) + 2
      },
      {
        show: false,
        min: Math.min(...(chartData.log.map((items) => items.tempAvg))) - 2,
        max: Math.max(...(chartData.log.map((items) => items.tempAvg))) + 2
      },
      {
        show: false,
        min: 0,
        max: 1
      }
    ],
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
    },
    colors: ["rgba(255, 76, 60 , 1)", "rgba(52, 152, 219, .5)", "rgba(46, 204, 113, 1)", "rgba(46, 204, 113, 1)", "rgba(235, 152, 78, 1)"],
  }

  return (
    <Chart
      type="line"
      options={options}
      series={series}
      height={chart.tempHeight}
      width={chart.tempWidth}
    />
  )
}

export default Apexchart