import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd"
import { CardDevBtn, DeviceCardFooterDoor, DeviceCardFooterDoorFlex, DeviceCardFooterInfo, DeviceCardHeadHandle } from "../../style/style"
import { RiDoorClosedLine, RiDoorOpenLine, RiDraggable, RiErrorWarningLine, RiSettings3Line, RiTempColdLine } from "react-icons/ri"
import { devicesType } from "../../types/user.type"
import { storeDispatchType } from "../../stores/store"
// import { setFilterDevice } from "../../stores/dataArraySlices"
import { Table, Tbody, Td, Th, Thead, Tr } from "../../style/table/tableStyle"
import { useTranslation } from "react-i18next"
import ReactPaginate from 'react-paginate'
import { useEffect, useState } from "react"

type devicesTableProps = {
  devicesData: devicesType[],
  handleRowClicked: (row: devicesType) => void,
  dispatch: storeDispatchType
}

const DevicesTable = (devicesTableProps: devicesTableProps) => {
  const { t } = useTranslation()
  const { devicesData, handleRowClicked } = devicesTableProps
  const [itemOffset, setItemOffset] = useState(0)
  const [tempData, setTempData] = useState<devicesType[]>([])

  // Simulate fetching items from another resources.
  // (This could be items from props or items loaded in a local state
  // from an API endpoint with useEffect and useState)    n
  const endOffset = itemOffset + 5
  const currentItems = devicesData.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(devicesData.length / 5)

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * 5) % devicesData.length
    setItemOffset(newOffset)
  }

  const handleDragEnd = (resultsParams: DropResult) => {
    if (!resultsParams.destination) return
    let tempDevice = [...tempData]
    let [slectedRow] = tempDevice.splice(resultsParams.source.index, 1)
    tempDevice.splice(resultsParams.destination.index, 0, slectedRow)
    // dispatch(setFilterDevice(tempDevice))
    setTempData(tempDevice)
    console.log(tempDevice)
  }

  useEffect(() => {
    setTempData(currentItems)
    console.log(itemOffset)
  }, [itemOffset, devicesData])

  return (
    <>
      <DragDropContext
        onDragEnd={(results) => handleDragEnd(results)}
      >
        <Table>
          <Thead>
            <Tr>
              <Th $width={50}>
                <div>
                  <span>Move</span>
                </div>
              </Th>
              <Th $width={50}>
                <div>
                  <span>{t('no')}</span>
                </div>
              </Th>
              <Th $width={100}>
                <div>
                  <span>{t('field_device_name')}</span>
                </div>
              </Th>
              <Th $width={90}>
                <div>
                  <span>{t('tb_dev_sn')}</span>
                </div>
              </Th>
              <Th $width={90}>
                <div>
                  <span>{t('tb_install_location')}</span>
                </div>
              </Th>
              <Th $width={80}>
                <div>
                  <span>{t('temperature')}</span>
                </div>
              </Th>
              <Th $width={85}>
                <div>
                  <span>{t('humidity')}</span>
                </div>
              </Th>
              <Th $width={65}>
                <div>
                  <span>{t('probe')}</span>
                </div>
              </Th>
              <Th $width={100}>
                <div>
                  <span>{t('doors')}</span>
                </div>
              </Th>
              <Th $width={75}>
                <div>
                  <span>{t('connect')}</span>
                </div>
              </Th>
              <Th $width={75}>
                <div>
                  <span>{t('batter')}</span>
                </div>
              </Th>
              <Th $width={65}>
                <div>
                  <span>{t('plug')}</span>
                </div>
              </Th>
              <Th $width={70}>
                <div>
                  <span>{t('warranty_home')}</span>
                </div>
              </Th>
              <Th $width={50}>
                <div>
                  <span>{t('repair_home')}</span>
                </div>
              </Th>
              <Th $width={80}>
                <div>
                  <span>{t('hos_action')}</span>
                </div>
              </Th>
            </Tr>
          </Thead>
          <Droppable droppableId="tbody">
            {(provided) => (
              <Tbody
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {
                  tempData.map((items, index) => {
                    const today = new Date()
                    const targetDate = new Date(items.installDate)
                    targetDate.setFullYear(targetDate.getFullYear() + 1)
                    const timeDifference = targetDate.getTime() - today.getTime()
                    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

                    return (<Draggable draggableId={items.devId} index={index} key={items.devId}>
                      {(provided) => (
                        <Tr
                          $cursor
                          $dense
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          onClick={() => handleRowClicked(items)}
                        >
                          <Td
                            $width={50}
                            {...provided.dragHandleProps}
                          >
                            <div>
                              <RiDraggable size={24} />
                            </div>
                          </Td>
                          <Td $width={50}>
                            <div>{index + 1}</div>
                          </Td>
                          <Td $width={100}>
                            <div>{items.devName}</div>
                          </Td>
                          <Td
                            $width={90}
                            title={items.devSerial}>
                            <div>...{items.devSerial.substring(17)}</div>
                          </Td>
                          <Td $width={90}>
                            <div>{items.installLocation ? items.installLocation : '- -'}</div>
                          </Td>
                          <Td $width={80}>
                            <div>{items.log[0]?.tempAvg ? items.log[0].tempAvg.toFixed(2) + ' °C' : 'No data'}</div>
                          </Td>
                          <Td $width={85}>
                            <div>{items.log[0]?.humidityAvg ? items.log[0].humidityAvg.toFixed(2) + ' %' : 'No data'}</div>
                          </Td>
                          <Td $width={65}>
                            <div>
                              <DeviceCardFooterInfo
                                $size
                                $primary={
                                  items.log[0]?.tempAvg >= 125 ||
                                  items.log[0]?.tempAvg === 0 ||
                                  items.log[0]?.tempAvg <= -40 ||
                                  items.log[0]?.tempAvg >= items.probe[0]?.tempMax ||
                                  items.log[0]?.tempAvg <= items.probe[0]?.tempMin
                                }>
                                {
                                  items.log[0]?.tempAvg >= 125 ||
                                    items.log[0]?.tempAvg === 0 ||
                                    items.log[0]?.tempAvg <= -40 ||
                                    items.log[0]?.tempAvg >= items.probe[0]?.tempMax ||
                                    items.log[0]?.tempAvg <= items.probe[0]?.tempMin ?
                                    <RiErrorWarningLine />
                                    :
                                    <RiTempColdLine />
                                }
                              </DeviceCardFooterInfo>
                            </div>
                          </Td>
                          <Td $width={100}>
                            <div>
                              <DeviceCardFooterDoorFlex $primary>
                                {
                                  items.door === '1' ?
                                    <DeviceCardFooterDoor
                                      $primary={
                                        items.log[0]?.door1
                                      }>
                                      {
                                        items.log[0]?.door1 ?
                                          <RiDoorOpenLine />
                                          :
                                          <RiDoorClosedLine />
                                      }
                                    </DeviceCardFooterDoor>
                                    :
                                    items.door === '2' ?
                                      <>
                                        <DeviceCardFooterDoor
                                          $primary={
                                            items.log[0]?.door1
                                          }>
                                          {
                                            items.log[0]?.door1 ?
                                              <RiDoorOpenLine />
                                              :
                                              <RiDoorClosedLine />
                                          }
                                        </DeviceCardFooterDoor>
                                        <DeviceCardFooterDoor
                                          $primary={
                                            items.log[0]?.door2
                                          }>
                                          {
                                            items.log[0]?.door2 ?
                                              <RiDoorOpenLine />
                                              :
                                              <RiDoorClosedLine />
                                          }
                                        </DeviceCardFooterDoor>
                                      </>
                                      :
                                      <>
                                        <DeviceCardFooterDoor
                                          $primary={
                                            items.log[0]?.door1
                                          }>
                                          {
                                            items.log[0]?.door1 ?
                                              <RiDoorOpenLine />
                                              :
                                              <RiDoorClosedLine />
                                          }
                                        </DeviceCardFooterDoor>
                                        <DeviceCardFooterDoor
                                          $primary={
                                            items.log[0]?.door2
                                          }>
                                          {
                                            items.log[0]?.door2 ?
                                              <RiDoorOpenLine />
                                              :
                                              <RiDoorClosedLine />
                                          }
                                        </DeviceCardFooterDoor>
                                        <DeviceCardFooterDoor
                                          $primary={
                                            items.log[0]?.door3
                                          }>
                                          {
                                            items.log[0]?.door3 ?
                                              <RiDoorOpenLine />
                                              :
                                              <RiDoorClosedLine />
                                          }
                                        </DeviceCardFooterDoor>
                                      </>
                                }
                              </DeviceCardFooterDoorFlex>
                            </div>
                          </Td>
                          <Td $width={75}>
                            <div>{((Number(new Date()) - Number(new Date(items.log[0]?.createAt))) / 1000) > 10 * 60 ? 'offline' : 'online'}</div>
                          </Td>
                          <Td $width={75}>
                            <div>{items.log[0]?.battery + ' %'}</div>
                          </Td>
                          <Td $width={65}>
                            <div>{items.log[0]?.ac === '0' ? 'active' : 'Inactive'}</div>
                          </Td>
                          <Td $width={70}>
                            <div>{daysRemaining} วัน</div>
                          </Td>
                          <Td $width={50}>
                            <div>- -</div>
                          </Td>
                          <Td $width={80}>
                            <div>
                              <DeviceCardHeadHandle>
                                <CardDevBtn >
                                  <RiSettings3Line />
                                </CardDevBtn>
                              </DeviceCardHeadHandle>
                            </div>
                          </Td>
                        </Tr>
                      )}
                    </Draggable>)
                  })
                }
                {provided.placeholder}
              </Tbody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      />
    </>
  )
}

export default DevicesTable