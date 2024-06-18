import { jwtToken, socketResponseType } from "./component.type"
import { devicesType } from "./device.type"
import { hospitalsType } from "./hospital.type"
import { probeType } from "./probe.type"
import { usersType } from "./user.type"
import { wardsType } from "./ward.type"

interface payloadError {
  error: {
    message: string
  }
}

interface DataArrayStore extends ArrayStore {
  arrayLoading: boolean,
  arrayError: string
}

type DeviceState = {
  devices: devicesType[],
  devicesLoading: boolean,
  devicesError: string
}

type LogState = {
  devicesLogs: devicesType,
  logLoading: boolean,
  logError: string
}

type UtilsStateStore = {
  token: string,
  deviceId: string,
  Serial: string,
  socketData: socketResponseType | null,
  searchQuery: string,
  expand: boolean,
  showAside: boolean,
  tokenDecode: jwtToken,
  soundMode: boolean,
  popUpMode: boolean
}

type DeviceStateStore = {
  devices: DeviceState,
  logs: LogState,
  utilsState: UtilsStateStore,
  arraySlice: DataArrayStore,
  user: UserState,
  probe: ProbeState
}

type ArrayStore = {
  device: {
    devicesFilter: devicesType[]
  },
  hospital: {
    hospitalsData: hospitalsType[]
  },
  ward: {
    wardData: wardsType[]
  }
}

type UserState = {
  userDaata: usersType[],
  userLoading: boolean,
  userError: string,
}

type ProbeState = {
  probeData: probeType[],
  probeLoading: boolean,
  probeError: string,
}

export type {
  DeviceState, LogState, DataArrayStore,
  UtilsStateStore, DeviceStateStore, ArrayStore, payloadError, UserState,
  ProbeState
}