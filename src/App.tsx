import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './main'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <div className='bg-pink-300 w-full min-h-screen text-white'>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  )
}

export default App
