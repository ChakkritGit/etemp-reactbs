import { DashBoardCardBody, DashBoardCardFlex, DashBoardCardHead, DashBoardCardSpan, DashBoardCardSpanTitle } from "../../style/style"
import { ReactNode } from "react"

type CardstatusNomal = {
  title: string,
  valuestext: number | string | undefined,
  svg: ReactNode,
  alertone?: boolean
}
type CardstatusSpecial = {
  title: string,
  valuesone?: number | string,
  valuestwo?: number | string,
  pipeone?: string,
  pipetwo?: string,
  svg: ReactNode,
  alertone?: boolean
  alerttwo?: boolean
}

export function CardstatusNomal(CardstatusNomal: CardstatusNomal) {
  return (
    <DashBoardCardFlex>
      <DashBoardCardHead>
        {CardstatusNomal.svg}
        <DashBoardCardSpanTitle>
          {CardstatusNomal.title}
        </DashBoardCardSpanTitle>
      </DashBoardCardHead>
      <DashBoardCardSpan $primary $alertone={CardstatusNomal.alertone}>
        {CardstatusNomal.valuestext}
      </DashBoardCardSpan>
    </DashBoardCardFlex>
  )
}

export function CardstatusSpecial(CardstatusSpecial: CardstatusSpecial) {
  return (
    <DashBoardCardFlex>
      <DashBoardCardHead>
        {CardstatusSpecial.svg}
        <DashBoardCardSpanTitle>
          {CardstatusSpecial.title}
        </DashBoardCardSpanTitle>
      </DashBoardCardHead>
      <DashBoardCardBody>
        <div>
          <DashBoardCardSpan $alertone={CardstatusSpecial.alertone}>
            {CardstatusSpecial.valuesone}
            <sub>{CardstatusSpecial.pipeone}</sub>
          </DashBoardCardSpan>
        </div>
        <div>
          <DashBoardCardSpan $alerttwo={CardstatusSpecial.alertone}>
            {CardstatusSpecial.valuestwo}
            <sub>{CardstatusSpecial.pipetwo}</sub>
          </DashBoardCardSpan>
        </div>
      </DashBoardCardBody>
    </DashBoardCardFlex>
  )
}
