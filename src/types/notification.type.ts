type notificationType = {
  noti_id: string,
  dev_id: string,
  noti_detail: string,
  noti_status: string,
  createAt: string,
  updateAt: string,
  device: {
    dev_id: string,
    dev_name: string,
    dev_sn: string
  }
}

export type { notificationType }