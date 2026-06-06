import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerifyOtp from "./pages/VerifyOtp";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={
          <ProtectedRoute>
            <VerifyOtp />
          </ProtectedRoute>
        } />
        <Route path="/feed" element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;