import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/login";
import Home from "./pages/home";
import EngineerDashboard from "./pages/dashboard/engineer";
import ManagerDashboard from "./pages/dashboard/manager";
import PrivateRoute from "./components/privateRoute";
import Navbar from "./components/navbar";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard/manager"
        element={
          <PrivateRoute>
            <div>
              <Navbar />
              <ManagerDashboard />
            </div>
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/engineer"
        element={
          <PrivateRoute>
            <div>
              <Navbar />
              <EngineerDashboard />
            </div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
