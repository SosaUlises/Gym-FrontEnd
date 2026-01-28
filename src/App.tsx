import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ClientDashboard from "./pages/cliente/ClientDashboard"; 
import RequireAuth from "./routes/RequireAuth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <RequireAuth roles={["Administrador"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />

        {/* Cliente */}
        <Route
          path="/app"
          element={
            <RequireAuth roles={["Cliente"]}>
              <ClientDashboard />
            </RequireAuth>
          }
        />

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
