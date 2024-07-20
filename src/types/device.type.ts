import { configType } from "./config.type"
import { logtype } from "./log.type"
import { notificationType } from "./notification.type"
import { probeType } from "./probe.type"

type devices = {
  devId: string,
  wardId: string,
  devSerial: string,
  devName: string,
  devDetail: string,
  devStatus: boolean,
  devSeq: number,
  devZone: string,
  locInstall: string,
  locPic: string,
  dateInstall: string,
  firmwareVersion: string,
  createBy: string,
  comment: string,
  backupStatus: string,
  moveStatus: string,
  alarm: boolean,
  duration: string,
  createAt: string,
  updateAt: string,
}

interface devicesType extends devices {
  log: logtype[],
  probe: probeType[],
  config: configType,
  noti: notificationType[],
  _count?: {
    warranty: number,
    repair: number,
    history: number,
    noti: number,
    log: number
  }
}

type managedevices = {
  pagestate: string,
  devdata: devicesType
}

type deviceLog = {
  logId: string,
  devId: string,
  tempValue: number,
  tempAvg: number,
  humidityValue: number,
  humidityAvg: number,
  sendTime: string,
  ac: string,
  door1: boolean,
  door2: boolean,
  door3: boolean,
  internet: boolean,
  probe: string,
  battery: number,
  ambient: number,
  sdCard: string,
  createAt: string,
  updateAt: string
}

export type { devices, devicesType, managedevices, deviceLog }