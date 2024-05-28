import { devicesType } from "./device.type"

type repairType = {
  repairId: string,
  devId: string,
  repairInfo: string,
  repairLocation: string,
  ward: string,
  repairDetails: string,
  telePhone: string,
  repairStatus: string,
  warrantyStatus: string,
  comment: string,
  baseStatus: string,
  createAt: string,
  updateAt: string,
  device: devicesType
}

export type { repairType }