
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from './pages/Register';
import Contacts from "./pages/Contacts";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path = '/register' element = {<Register />}/>
        <Route path = '/contacts' element = {
          <ProtectedRoute>
          <Contacts />
          </ProtectedRoute>
          }/>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
