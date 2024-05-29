import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { HomeStatusErrCount, UtilsStateStore } from "../types/redux.type"
import { jwtToken } from "../types/component.type" 

const initialState: UtilsStateStore = {
  token: String(localStorage.getItem('token')),
  deviceId: String(localStorage.getItem('devid')),
  socketData: '',
  searchQuery: '',
  expand: localStorage.getItem('expandaside') === 'true',
  showAside: false,
  count: {
    probe: 0,
    door: 0,
    connect: 0,
    ac: 0,
    sd: 0,
    adjust: 0,
    repair: 0,
    warranty: 0
  },
  tokenDecode: {} as jwtToken
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
    setSocketData: (state, action: PayloadAction<string>) => {
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
    setCount: (state, action: PayloadAction<HomeStatusErrCount>) => {
      state.count = action.payload
    },
    setTokenDecode: (state, action: PayloadAction<jwtToken>) => {
      state.tokenDecode = action.payload
    },
  },
})

export const { setToken, setDeviceId, setSocketData, setSearchQuery, setExpand, setShowAside, setCount, setTokenDecode } = utilsSlice.actions

export default utilsSlice.reducer