import { devicesType } from "./device.type"

type logtype = {
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
  sdCard: boolean,
  eventCounts: string,
  createAt: string,
  updateAt: string,
  // รออัปเดทที่แน่ชัด
  device: devicesType
}

export type { logtype }