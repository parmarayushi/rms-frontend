import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./features/admin/AdminDashboard";
import ReportsBilling from "./features/admin/ReportsBilling";
import LoginPage from "./features/auth/LoginPage";
import ChefDashboard from "./features/chef/ChefDashboard";
import TableManagerDashboard from "./features/tableManager/TableManagerDashboard";
import TakeawayOrders from "./features/waiter/TakeawayOrders";
import WaiterDashboard from "./features/waiter/WaiterDashboard";
import HomeRedirect from "./HomeRedirect";

const App = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected home (any logged-in role) */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={["admin", "waiter", "chef", "tableManager"]}
              />
            }
          >
            <Route path="/" element={<HomeRedirect />} />
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<ReportsBilling />} />
          </Route>

          {/* Waiter + admin */}
          <Route
            element={<ProtectedRoute allowedRoles={["waiter", "admin"]} />}
          >
            <Route path="/waiter" element={<WaiterDashboard />} />
            <Route path="/waiter/takeaway" element={<TakeawayOrders />} />
          </Route>

          {/* Chef + admin */}
          <Route element={<ProtectedRoute allowedRoles={["chef", "admin"]} />}>
            <Route path="/chef" element={<ChefDashboard />} />
          </Route>

          {/* Table Manager + admin */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["tableManager", "admin"]} />
            }
          >
            <Route path="/table-manager" element={<TableManagerDashboard />} />
          </Route>
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
