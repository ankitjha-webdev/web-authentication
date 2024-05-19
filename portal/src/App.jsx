import { useState } from 'react'
import Register from './component/register'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Register />
    </>
  )
}

export default App
