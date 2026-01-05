import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter } from 'react-router-dom'
import { NotFoundPage } from './pages/NotFoundPage.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FormIndex } from './pages/FormPages/FormIndex.tsx'
import HomePage from './pages/HomePage.tsx'

export const router = createBrowserRouter([
  {
    index: true,
    element: <HomePage />,
    errorElement: <NotFoundPage />
  },
  {
    path: 'form',
    element: <FormIndex />,
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