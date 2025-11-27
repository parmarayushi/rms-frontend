import { useSelector } from "react-redux";
import AdminDashboard from "./features/admin/AdminDashboard";
import LoginPage from "./features/auth/LoginPage";
import ChefDashboard from "./features/chef/ChefDashboard";
import TableManagerDashboard from "./features/tableManager/TableManagerDashboard";
import WaiterDashboard from "./features/waiter/WaiterDashboard";

const HomeRedirect = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) return <LoginPage />;

  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "waiter") return <WaiterDashboard />;
  if (user.role === "chef") return <ChefDashboard />;
  if (user.role === "tableManager") return <TableManagerDashboard />;

  return <div>Unknown role: {user.role}</div>;
};

export default HomeRedirect;
