import Checker from "./pages/Checker";
import Start from "./pages/start/Start";
import FacultyList from "./pages/faculty/FacultyList";
import FacultyDetail from "./pages/faculty/FacultyDetail";
import ManagerPage from "./pages/manager/ManagerPage";
import LabList from "./pages/lab/LabList";
import LabDetail from "./pages/lab/LabDetail";
import ExperienceTaskPage from "./pages/lab/ExperienceTask";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/checker" element={<Checker />} />
        <Route path="/faculty" element={<FacultyList />} />
        <Route path="/faculty/:id" element={<FacultyDetail />} />
        <Route path="/manager" element={<ManagerPage />} />
        <Route path="/labs" element={<LabList />} />
        <Route path="/labs/:id" element={<LabDetail />} />
        <Route path="/labs/:labId/tasks/:taskId" element={<ExperienceTaskPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
