import { devicesType } from "./device.type"

type warrantyType = {
  warrId: string,
  devName: string,
  expire: string,
  warrStatus: boolean,
  createAt: string,
  updateAt: string,
  device: devicesType[]
}

export type { warrantyType }