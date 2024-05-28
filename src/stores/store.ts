import { configureStore } from '@reduxjs/toolkit'
import deviceSlice from "./devicesSlices"
import logSlice from "./LogsSlice"
import utilsSlice from './utilsStateSlice'
import dataArraySlices from './dataArraySlices'
import userSlice from './userSlice'
import probeSlice from './probeSlice'

export const store = configureStore({
  reducer: {
    devices: deviceSlice,
    logs: logSlice,
    utilsState: utilsSlice,
    arraySlice: dataArraySlices,
    user: userSlice,
    probe: probeSlice,
  },
  devTools: import.meta.env.VITE_APP_NODE_ENV !== 'production'
})

export type RootState = ReturnType<typeof store.getState>
export type storeDispatchType = typeof store.dispatch
