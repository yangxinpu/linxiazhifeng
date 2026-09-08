import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StoreProvider } from '@/stores'
import App from './App.tsx'
import './styles/global.scss'

async function bootstrap() {
  if (import.meta.env.DEV) {
    const { worker } = await import('@mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <StoreProvider>
        <App />
      </StoreProvider>
    </StrictMode>,
  )
}

bootstrap()
