import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter } from 'react-router-dom'
import { FormPage } from './pages/FormPages/FormPage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const router = createBrowserRouter([
  {
    index: true,
    element: <FormPage />,
    errorElement: <NotFoundPage />
  }
])

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)