import { RiCheckLine, RiFullscreenLine } from "react-icons/ri"
import {
  ButtonColorChang, ChooseColorsContainer, ColorListFlex,
  ColorPalette, FullscreenBtn, H3mt, LineHr, SwitchMode
} from "../../style/style"
import { useColorContext } from "../../theme/ColorsProvider"
import { useTranslation } from "react-i18next"
import ToggleButton from "../../theme/ToggleButton"

export default function Color() {
  const { t } = useTranslation()
  const { color, toggleColor } = useColorContext()

  return (
    <ChooseColorsContainer>
      <h3>
        {t('choosecolor')}
      </h3>
      <ColorPalette>
        <ColorListFlex>
          <ButtonColorChang $color="palette1" onClick={() => toggleColor({ ...color, colors: 1 })}>
            {
              color.colors === 1 && <RiCheckLine />
            }
          </ButtonColorChang>
          <span>{t('default')}</span>
        </ColorListFlex>
        <ColorListFlex>
          <ButtonColorChang $color="palette2" onClick={() => toggleColor({ ...color, colors: 2 })}>
            {
              color.colors === 2 && <RiCheckLine />
            }
          </ButtonColorChang>
          <span>{t('preset')} 1</span>
        </ColorListFlex>
        <ColorListFlex>
          <ButtonColorChang $color="palette3" onClick={() => toggleColor({ ...color, colors: 3 })}>
            {
              color.colors === 3 && <RiCheckLine />
            }
          </ButtonColorChang>
          <span>{t('preset')} 2</span>
        </ColorListFlex>
        <ColorListFlex>
          <ButtonColorChang $color="palette4" onClick={() => toggleColor({ ...color, colors: 4 })}>
            {
              color.colors === 4 && <RiCheckLine />
            }
          </ButtonColorChang>
          <span>{t('preset')} 3</span>
        </ColorListFlex>
        <ColorListFlex>
          <ButtonColorChang $color="palette5" onClick={() => toggleColor({ ...color, colors: 5 })}>
            {
              color.colors === 5 && <RiCheckLine />
            }
          </ButtonColorChang>
          <span>{t('preset')} 4</span>
        </ColorListFlex>
      </ColorPalette>
      <LineHr />
      <H3mt>{t('appearance')}</H3mt>
      <SwitchMode>
        <span>{t('darkmodesetting')}</span><ToggleButton />
      </SwitchMode>
      <LineHr />
      <H3mt>Full Screen</H3mt>
      <SwitchMode>
        <span>Full Screen Mode</span>
        <FullscreenBtn onClick={() => {
          const element = document.documentElement;
          if (!document.fullscreenElement) {
            if (element.requestFullscreen) {
              element.requestFullscreen()
            }
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen()
            }
          }
        }}>
          <RiFullscreenLine />
        </FullscreenBtn>
      </SwitchMode>
    </ChooseColorsContainer>
  )
}
