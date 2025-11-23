import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter } from 'react-router-dom'
import { FormPage } from './pages/FormPages/FormPage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'

export const router = createBrowserRouter([
  {
    index: true,
    element: <FormPage />,
    errorElement: <NotFoundPage />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)