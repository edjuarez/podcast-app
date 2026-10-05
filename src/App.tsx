import { Outlet } from 'react-router-dom'
import { Header } from './components/Header'
import { LoadingProvider } from './components/LoadingProvider'

function App() {

  return (
    <LoadingProvider>
      <Header />
      <Outlet />
    </LoadingProvider>
  )
}

export default App