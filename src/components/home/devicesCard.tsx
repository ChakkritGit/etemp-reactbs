import { ReactNode } from 'react'
import {
  CardSpan, DevCardContainer,
  DevCardFooter
} from '../../style/style'
import { useSelector } from 'react-redux'
import { DeviceStateStore, UtilsStateStore } from '../../types/redux.type'

type DevCard = {
  title: string,
  count: number,
  times: string,
  svg: ReactNode,
  switchcase?: (text: string, active: boolean) => void,
  cardname: string,
  active: boolean
}

export default function DevicesCard(DevCard: DevCard) {
  const { expand } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const acTive = () => {
    DevCard.switchcase?.(DevCard.cardname, !DevCard.active)
  }

  return (
    <DevCardContainer
      onClick={acTive}
      $primary={DevCard.active}
      $eventcount={DevCard.count > 0}
      $responsivecard={expand}>
      <CardSpan>{DevCard.title}</CardSpan>
      <span>{DevCard.count}</span>
      <DevCardFooter>
        <span>{DevCard.times}</span>
        <div>{DevCard.svg}</div>
      </DevCardFooter>
    </DevCardContainer>
  )
}
