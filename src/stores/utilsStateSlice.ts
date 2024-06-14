import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { UtilsStateStore } from "../types/redux.type"
import { jwtToken } from "../types/component.type"

const initialState: UtilsStateStore = {
  token: String(localStorage.getItem('token')),
  deviceId: String(localStorage.getItem('devid')),
  Serial: String(localStorage.getItem('devSerial')),
  socketData: null,
  searchQuery: '',
  expand: localStorage.getItem('expandaside') === 'true',
  showAside: false,
  tokenDecode: {} as jwtToken,
  soundMode: localStorage.getItem('soundMode') === 'true'
}

const utilsSlice = createSlice({
  name: 'utils',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setDeviceId: (state, action: PayloadAction<string>) => {
      state.deviceId = action.payload
    },
    setSerial: (state, action: PayloadAction<string>) => {
      state.Serial = action.payload
    },
    setSocketData: (state, action: PayloadAction<unknown>) => {
      state.socketData = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setExpand: (state, action: PayloadAction<boolean>) => {
      state.expand = action.payload
    },
    setShowAside: (state, action: PayloadAction<boolean>) => {
      state.showAside = action.payload
    },
    setTokenDecode: (state, action: PayloadAction<jwtToken>) => {
      state.tokenDecode = action.payload
    },
    setSoundMode: (state, action: PayloadAction<boolean>) => {
      state.soundMode = action.payload
    },
  },
})

export const { setToken, setDeviceId, setSerial, setSocketData, setSearchQuery, setExpand, setShowAside, setTokenDecode, setSoundMode } = utilsSlice.actions

export default utilsSlice.reducer