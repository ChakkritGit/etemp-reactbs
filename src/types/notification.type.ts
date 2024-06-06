type notificationType = {
  notiId: string,
  devSerial: string,
  notiDetail: string,
  notiStatus: string,
  createAt: string,
  updateAt: string,
  device: {
    devId: string,
    devName: string,
    devSerial: string
  }
}

export type { notificationType }