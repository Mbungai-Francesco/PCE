import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './main'

function App() {
  return (
    <div className='bg-pink-300 w-full h-screen text-white'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
