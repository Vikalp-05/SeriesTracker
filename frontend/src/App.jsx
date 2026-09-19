import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage.jsx'
import SeriesDetail from './pages/SeriesDetail.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/series/:id" element={<SeriesDetail />} />
      </Routes>
    </BrowserRouter>
  )
}