import { ClosePromptToastButton, ReloadPromptContainer, ReloadPromptMessage, ReloadPromptToast, ReloadPromptToastButton } from '../../style/components/reloadprompt'
import { useRegisterSW } from 'virtual:pwa-register/react'

export default function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
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
              ? <span>App ready to work offline</span>
              : <span>New content available, click on reload button to update.</span>
            }
          </ReloadPromptMessage>
          {needRefresh &&
            <ReloadPromptToastButton onClick={() => updateServiceWorker(true)}>Reload</ReloadPromptToastButton>
          }
          <ClosePromptToastButton onClick={() => close()}>Close</ClosePromptToastButton>
        </ReloadPromptToast>
      }
    </ReloadPromptContainer>
  )
}