import { useNavigate } from "react-router-dom";

const tiles = [
  {
    label: "Table Manager",
    path: "/table-manager",
    description: "Manage queues and assign tables for dine-in guests.",
    color: "from-sky-500 to-cyan-500",
  },
  {
    label: "Waiter Module",
    path: "/waiter",
    description: "Handle table orders and takeaway requests.",
    color: "from-emerald-500 to-lime-500",
  },
  {
    label: "Chef Module",
    path: "/chef",
    description: "View and update order preparation status.",
    color: "from-rose-500 to-orange-500",
  },
  {
    label: "Reports / Billing",
    path: "/admin/reports",
    description: "View sales, bills and daily summary (placeholder).",
    color: "from-slate-700 to-slate-900",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800 mb-2">
        Admin Dashboard
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Access all modules and high-level controls from here.
      </p>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <button
            key={tile.label}
            onClick={() => navigate(tile.path)}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tile.color} text-white shadow-lg hover:shadow-xl transition transform hover:-translate-y-1`}
          >
            <div className="p-4 text-left">
              <div className="text-xs uppercase tracking-wide text-white/70 mb-1">
                Module
              </div>
              <div className="text-lg font-semibold mb-1">{tile.label}</div>
              <div className="text-xs text-white/80 mb-4">
                {tile.description}
              </div>
              <span className="inline-flex items-center text-xs font-medium bg-white/15 px-3 py-1 rounded-full">
                Open module →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
