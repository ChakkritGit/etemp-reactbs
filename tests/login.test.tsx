import RoutesComponent from '../src/routes/routes'
import i18n from '../src/lang/i18n'
import { describe, it, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { store } from '../src/stores/store'
import { clickButtonLogin, loginSubmit, renderFormLogin } from './login'

describe('Test Login', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <RoutesComponent />
        </I18nextProvider>
      </Provider>
    )
  })

  it('Render form login', renderFormLogin)
  it('Login form empty field', clickButtonLogin)
  it('Login submit', loginSubmit)
})