import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";

import PrivateRoute from "./components/privateRoute";

import Home from "./pages/home";
import ManagerDashboard from "./pages/dashboard/manager";
import Navigation from "./components/navigation";
import EngineerDashboard from "./pages/dashboard/engineer";

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
              <Navigation />
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
              <Navigation />
              <EngineerDashboard />
            </div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
