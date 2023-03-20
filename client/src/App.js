import Home from './pages/Home'
import { ChatContextProvider } from './context/chatContext'
import { useEffect, useState } from 'react'
import Loading from './components/Loader'

const App = () => {
  const [loading , setLoading] = useState(true)

  useEffect(() => {
    setInterval(() => {
        setLoading(false)
    }, 2000)
}, [])
  return (
    <ChatContextProvider>
      <div>
       {loading ? <Loading />: <Home />}
      </div>
    </ChatContextProvider >
  )
}


export default App