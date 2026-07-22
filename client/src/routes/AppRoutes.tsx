// Central route map.
// Public: /login, /register.
// Protected: everything under ProtectedRoute, rendered inside DashboardLayout.

import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import DepartmentsPage from "../pages/DepartmentsPage";
import EmployeesPage from "../pages/EmployeesPage";
import LeavesPage from "../pages/LeavesPage";
import PayrollsPage from "../pages/PayrollsPage";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/leaves" element={<LeavesPage />} />

        {/* Payroll is admin-only — enforced at the route level too. */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/payrolls" element={<PayrollsPage />} />
        </Route>
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
