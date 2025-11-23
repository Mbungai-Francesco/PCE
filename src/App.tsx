import { useState } from 'react'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './main'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className='bg-pink-300 w-full h-screen text-white'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
