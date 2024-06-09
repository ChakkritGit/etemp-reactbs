import {
  CardDevBtn,
  CardHomeFlex,
  DeviceCard, DeviceCardBody, DeviceCardFooter, DeviceCardFooterDoor,
  DeviceCardFooterDoorFlex, DeviceCardFooterI, DeviceCardFooterInfo, DeviceCardFooterTemp,
  DeviceCardFooterTempT, DeviceCardHead, DeviceCardHeadHandle, DeviceCardHeadImg,
  DeviceCardHeadStatus, DeviceStateNetwork, TooltipSpan
} from "../../style/style"
import {
  RiDashboardLine, RiDoorClosedLine, RiDoorOpenLine, RiErrorWarningLine,
  RiPlugLine, RiSdCardMiniLine, RiSettings3Line, RiTempColdLine
} from "react-icons/ri"
import { devicesType } from "../../types/device.type"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { setDeviceId, setSerial } from "../../stores/utilsStateSlice"
import { AsyncThunk } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { storeDispatchType } from "../../stores/store"
import ModalAdjust from "./modal.adjust"

type DevicesInfoCard = {
  devicesdata: devicesType,
  keyindex: number,
  fetchData: AsyncThunk<devicesType[], string, object>,
}

export default function DevicesInfoCard(DevicesInfoCard: DevicesInfoCard) {
  const { devicesdata, fetchData } = DevicesInfoCard
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  const openDashboard = (data: {
    devid: string,
    devsn: string
  }) => {
    if (devicesdata.log.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No data",
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      dispatch(setDeviceId(data.devid))
      dispatch(setSerial(data.devsn))
      localStorage.setItem('devid', data.devid)
      localStorage.setItem('devSerial', data.devsn)
      navigate('/dashboard')
      window.scrollTo(0, 0)
      // เมื่อสลับหน้าไปยังแดชบอร์ดให้สกลอไปบนสุด
    }
  }

  const openmodal = () => {
    setShow(true)
  }

  return (
    <>
      <DeviceCard>
        <DeviceCardHead>
          <CardHomeFlex>
            <DeviceCardHeadImg
              src={devicesdata.locPic ? `${import.meta.env.VITE_APP_IMG}${devicesdata.locPic}` : 'https://test.thanespgm.com/img/default-pic.png'}
              alt="device-picture"
              $primary={devicesdata.locPic ? true : false}
              loading="lazy" />
          </CardHomeFlex>
          <DeviceCardHeadStatus>
            <DeviceCardHeadHandle>
              <CardDevBtn onClick={() => openDashboard({
                devid: devicesdata.devId,
                devsn: devicesdata.devSerial
              })}>
                <RiDashboardLine />
                <TooltipSpan>
                  {t('dashboard')}
                </TooltipSpan>
              </CardDevBtn>
              <CardDevBtn onClick={openmodal}>
                <RiSettings3Line />
                <TooltipSpan>
                  {t('tab_adjust')}
                </TooltipSpan>
              </CardDevBtn>
            </DeviceCardHeadHandle>
            <DeviceStateNetwork $primary={devicesdata.log[0]?.internet === "1"}>
              {devicesdata.log[0]?.internet === "1" ? t('offline') : t('online')}
            </DeviceStateNetwork>
            {/* <DeviceStateNetwork $primary={devicesdata.dev_status !== '1'}>
              {devicesdata.dev_status === '1' ? t('online') : t('offline')}
            </DeviceStateNetwork> */}
          </DeviceCardHeadStatus>
        </DeviceCardHead>
        <DeviceCardBody>
          <h5>{devicesdata.devDetail}</h5>
          <span>{devicesdata.devSerial}</span>
          <span>{devicesdata.locInstall ? devicesdata.locInstall : '- -'}</span>
        </DeviceCardBody>
        <DeviceCardFooter>
          <DeviceCardFooterDoorFlex>
            {
              devicesdata.probe[0]?.door === 1 ?
                <DeviceCardFooterDoor
                  $primary={
                    devicesdata.log[0]?.door1 === "1"
                  }>
                  {
                    devicesdata.log[0]?.door1 ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
                :
                devicesdata.probe[0]?.door === 2 ?
                  <>
                    <DeviceCardFooterDoor
                      $primary={
                        devicesdata.log[0]?.door1 === "1"
                      }>
                      {
                        devicesdata.log[0]?.door1 ?
                          <RiDoorOpenLine />
                          :
                          <RiDoorClosedLine />
                      }
                    </DeviceCardFooterDoor>
                    <DeviceCardFooterDoor
                      $primary={
                        devicesdata.log[0]?.door2 === "1"
                      }>
                      {
                        devicesdata.log[0]?.door2 ?
                          <RiDoorOpenLine />
                          :
                          <RiDoorClosedLine />
                      }
                    </DeviceCardFooterDoor>
                  </>
                  :
                  <>
                    <DeviceCardFooterDoor
                      $primary={
                        devicesdata.log[0]?.door1 === "1"
                      }>
                      {
                        devicesdata.log[0]?.door1 ?
                          <RiDoorOpenLine />
                          :
                          <RiDoorClosedLine />
                      }
                    </DeviceCardFooterDoor>
                    <DeviceCardFooterDoor
                      $primary={
                        devicesdata.log[0]?.door2 === "1"
                      }>
                      {
                        devicesdata.log[0]?.door2 ?
                          <RiDoorOpenLine />
                          :
                          <RiDoorClosedLine />
                      }
                    </DeviceCardFooterDoor>
                    <DeviceCardFooterDoor
                      $primary={
                        devicesdata.log[0]?.door3 === "1"
                      }>
                      {
                        devicesdata.log[0]?.door3 ?
                          <RiDoorOpenLine />
                          :
                          <RiDoorClosedLine />
                      }
                    </DeviceCardFooterDoor>
                  </>
            }
            <TooltipSpan>
              {t('doors')}
            </TooltipSpan>
          </DeviceCardFooterDoorFlex>
          <DeviceCardFooterTemp>
            <DeviceCardFooterTempT>
              {devicesdata.log[0]?.tempAvg.toFixed(2) || '- -'}
              <sub>°C</sub>
              <TooltipSpan>
                {t('ChartTempText')}
              </TooltipSpan>
            </DeviceCardFooterTempT>
            <DeviceCardFooterTempT>
              {devicesdata.log[0]?.humidityAvg.toFixed(2) || '- -'}
              <sub>%</sub>
              <TooltipSpan>
                {t('ChartHumText')}
              </TooltipSpan>
            </DeviceCardFooterTempT>
            <DeviceCardFooterTempT>
              {devicesdata.log[0]?.createAt.substring(11, 16) || '- -'}
              <TooltipSpan>
                {t('time')}
              </TooltipSpan>
            </DeviceCardFooterTempT>
          </DeviceCardFooterTemp>
          <DeviceCardFooterI>
            <DeviceCardFooterInfo
              $primary={
                devicesdata.log[0]?.tempAvg >= 125 ||
                devicesdata.log[0]?.tempAvg === 0 ||
                devicesdata.log[0]?.tempAvg <= -40 ||
                devicesdata.log[0]?.tempAvg >= devicesdata.probe[0]?.tempMax ||
                devicesdata.log[0]?.tempAvg <= devicesdata.probe[0]?.tempMin
              }>
              {
                devicesdata.log[0]?.tempAvg >= 125 ||
                  devicesdata.log[0]?.tempAvg === 0 ||
                  devicesdata.log[0]?.tempAvg <= -40 ||
                  devicesdata.log[0]?.tempAvg >= devicesdata.probe[0]?.tempMax ||
                  devicesdata.log[0]?.tempAvg <= devicesdata.probe[0]?.tempMin ?
                  <RiErrorWarningLine />
                  :
                  <RiTempColdLine />
              }
              <TooltipSpan>
                {t('probe')}
              </TooltipSpan>
            </DeviceCardFooterInfo>
            <DeviceCardFooterInfo $primary={
              devicesdata.log[0]?.ac === '1'
            }>
              <RiPlugLine />
              <TooltipSpan>
                {t('plug')}
              </TooltipSpan>
            </DeviceCardFooterInfo>
            <DeviceCardFooterInfo $primary={
              devicesdata.log[0]?.sdCard === "1"
            }>
              <RiSdCardMiniLine />
              <TooltipSpan>
                {t('sdcard')}
              </TooltipSpan>
            </DeviceCardFooterInfo>
            <DeviceCardFooterInfo>
              {devicesdata.log[0]?.battery !== undefined && devicesdata.log[0]?.battery + '%' || '- -'}
              <TooltipSpan>
                {t('batter')}
              </TooltipSpan>
            </DeviceCardFooterInfo>
          </DeviceCardFooterI>
        </DeviceCardFooter>
      </DeviceCard>
      <ModalAdjust
        fetchData={fetchData}
        devicesdata={devicesdata}
        show={show}
        setShow={setShow}
      />
    </>
  )
}
