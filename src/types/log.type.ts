import { devicesType } from "./device.type"

type logtype = {
  logId: string,
  devSerial: string,
  tempValue: number,
  tempAvg: number,
  humidityValue: number,
  humidityAvg: number,
  sendTime: string,
  ac: string,
  door1: string,
  door2: string,
  door3: string,
  internet: string,
  probe: string,
  battery: number,
  ambient: number,
  sdCard: string,
  eventCounts: string,
  createAt: string,
  updateAt: string,
  device: devicesType
}

export type { logtype }