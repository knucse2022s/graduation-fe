<<<<<<< HEAD
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>Graduation FE</h1>
      <p>프로젝트를 시작하세요!</p>
    </div>
  );
=======
import Checker from "./pages/Checker";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checker" element={<Checker />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
>>>>>>> 39bfff3640be3cbf6bc1e2c8db587ba61b6c2bc4
}

export default App;
