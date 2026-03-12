import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Tours from './pages/Tours'
import TourDetail from './pages/TourDetail'
import Level from './pages/Level'
import AdventurePass from './pages/AdventurePass'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/tour-detail" element={<TourDetail />} />
        <Route path="/level" element={<Level />} />
        <Route path="/adventure-pass" element={<AdventurePass />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
