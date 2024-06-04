import mqtt from 'mqtt' // import namespace "mqtt"
import type { IClientOptions } from 'mqtt'
import { v4 as uuidv4 } from 'uuid'

const options: IClientOptions = {
  protocol: 'wss',
  host: `${import.meta.env.VITE_APP_MQTT}`,
  port: 9001,
  username: `${import.meta.env.VITE_APP_MQTT_USERNAME}`,
  password: `${import.meta.env.VITE_APP_MQTT_PASSWORD}`,
  clientId: uuidv4()
}

export const client = mqtt.connect(options)