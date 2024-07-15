import { useTranslation } from 'react-i18next'
import { ClosePromptToastButton, ReloadPromptButton, ReloadPromptContainer, ReloadPromptMessage, ReloadPromptMessageSpan, ReloadPromptToast, ReloadPromptToastButton } from '../../style/components/reloadprompt'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useState } from 'react'

export default function ReloadPrompt() {
  const { t } = useTranslation()
  const [prompt, setPrompt] = useState({
    status: false,
    message: ''
  })

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      close()
      console.log('SW Registered: ' + r)
      setPrompt({ status: false, message: 'SW Registered' })
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
      setPrompt({ status: true, message: 'SW registration error' })
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <ReloadPromptContainer>
      {(offlineReady || needRefresh)
        && <ReloadPromptToast>
          <ReloadPromptMessage>
            {offlineReady
              ? <span>{t('appOffline')}</span>
              : <span>{t('newContentReload')}</span>
            }
            <ReloadPromptMessageSpan $primary={prompt.status}>
              {prompt.message}
            </ReloadPromptMessageSpan>
          </ReloadPromptMessage>
          <ReloadPromptButton>
            {needRefresh &&
              <ReloadPromptToastButton onClick={() => updateServiceWorker(true)}>{t('reloadButton')}</ReloadPromptToastButton>
            }
            <ClosePromptToastButton onClick={() => close()}>{t('closeButton')}</ClosePromptToastButton>
          </ReloadPromptButton>
        </ReloadPromptToast>
      }
    </ReloadPromptContainer>
  )
}