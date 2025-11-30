import Home from "./pages/Home";
import Checker from "./pages/Checker";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checker" element={<Checker />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
