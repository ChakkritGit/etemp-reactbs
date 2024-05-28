import ReactDOM from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Root from './routes/root'
import { StyleSheetManager } from 'styled-components'
import isPropValid from "@emotion/is-prop-valid"
import { I18nextProvider } from 'react-i18next'
import i18n from './lang/i18n'
import ThemeProvider from 'react-bootstrap/ThemeProvider'
import GlobalStyles from './theme/GlobalStyles'
import { ThemeProviders } from './theme/ThemeProvider'
import { ColorProvider } from './theme/ColorsProvider'
import GlobalColors from './theme/GlobalColor'
import { store } from './stores/store'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <StyleSheetManager shouldForwardProp={isPropValid}>
        <ThemeProvider
          breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
          minBreakpoint="xxs">
          <ThemeProviders>
            <ColorProvider>
              <GlobalStyles />
              <GlobalColors />
              <Root />
            </ColorProvider>
          </ThemeProviders>
        </ThemeProvider>
      </StyleSheetManager>
    </I18nextProvider>
  </Provider>
)
