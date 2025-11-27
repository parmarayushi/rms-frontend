import { useState } from "react";

const ChefDashboard = () => {
  const [orders, setOrders] = useState([
    { id: "O-101", table: "T2", items: 3, status: "Pending" },
    { id: "O-102", table: "Takeaway", items: 2, status: "Ready" },
    { id: "O-103", table: "T5", items: 1, status: "Pending" },
    { id: "O-104", table: "T8", items: 4, status: "Ready" },
  ]);

  const [filter, setFilter] = useState("all"); // all, pending, ready

  const markAsReady = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Ready" } : o))
    );
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "pending") return o.status === "Pending";
    if (filter === "ready") return o.status === "Ready";
    return true;
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Chef KDS</h2>
        <p className="text-sm text-slate-500">
          View all pending orders and update preparation status.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === "all"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          All ({orders.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === "pending"
              ? "bg-amber-500 text-white"
              : "bg-amber-100 text-amber-700 hover:bg-amber-200"
          }`}
        >
          Pending ({orders.filter((o) => o.status === "Pending").length})
        </button>
        <button
          onClick={() => setFilter("ready")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === "ready"
              ? "bg-emerald-500 text-white"
              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          }`}
        >
          Ready ({orders.filter((o) => o.status === "Ready").length})
        </button>
      </div>

      {/* Orders grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full text-center py-8 text-slate-400">
            No orders found for this filter.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`rounded-2xl border shadow-sm p-4 flex flex-col gap-2 transition ${
                order.status === "Ready"
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase">
                  #{order.id}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 text-white">
                  {order.table}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700">
                  Items: <span className="font-semibold">{order.items}</span>
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    order.status === "Ready"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <button
                onClick={() => markAsReady(order.id)}
                disabled={order.status === "Ready"}
                className={`mt-2 inline-flex justify-center text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                  order.status === "Ready"
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-emerald-500 text-white hover:bg-emerald-600"
                }`}
              >
                {order.status === "Ready" ? "✓ Ready" : "Mark as Ready"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChefDashboard;
