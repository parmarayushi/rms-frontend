import { useNavigate } from "react-router-dom";
import TableGrid from "./TableGrid";

const WaiterDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Waiter Dashboard
        </h2>
        <p className="text-sm text-slate-500">
          Manage dine-in tables and takeaway from a single place.
        </p>
      </div>

      {/* Table grid inline here */}
      <TableGrid />

      {/* Takeaway section as a shortcut card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            Takeaway Management
          </h3>
          <p className="text-xs text-slate-500">
            Create new takeaway orders, see list & status updates.
          </p>
        </div>
        <button
          onClick={() => navigate("/waiter/takeaway")}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition"
        >
          Open Takeaway Module →
        </button>
      </div>
    </div>
  );
};

export default WaiterDashboard;
