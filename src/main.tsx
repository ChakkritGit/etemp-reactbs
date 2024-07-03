import ReactDOM from 'react-dom/client'
import './index.css'
import 'react-circular-progressbar/dist/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import RoutesComponent from './routes/routes'
import isPropValid from "@emotion/is-prop-valid"
import i18n from './lang/i18n'
import ThemeProvider from 'react-bootstrap/ThemeProvider'
import GlobalColors from './theme/GlobalColor'
import GlobalStyles from './theme/GlobalStyles'
import { StyleSheetManager } from 'styled-components'
import { I18nextProvider } from 'react-i18next'
import { ThemeProviders } from './theme/ThemeProvider'
import { ColorProvider } from './theme/ColorsProvider'
import { store } from './stores/store'
import { Provider } from 'react-redux'

if (import.meta.env.VITE_APP_NODE_ENV === 'production') {
  console.log = () => { }
}

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
              <RoutesComponent />
            </ColorProvider>
          </ThemeProviders>
        </ThemeProvider>
      </StyleSheetManager>
    </I18nextProvider>
  </Provider>
)
