import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import CarSelection from "./pages/CarSelection"
import CarDetailsPage from "./pages/CarDetails"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car-selection" element={<CarSelection />} />
        <Route path="/car-details/:carId" element={<CarDetailsPage />} />
      </Routes>
    </Router>
  )
}

export default App

