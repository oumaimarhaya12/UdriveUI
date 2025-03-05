import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CarSelection from "./pages/CarSelection";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car-selection" element={<CarSelection />} />
      </Routes>
    </Router>
  );
}

export default App;
