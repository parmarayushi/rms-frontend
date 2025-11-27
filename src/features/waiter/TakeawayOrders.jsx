import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

const TakeawayOrders = () => {
  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, completed

  // Modal state for taking new takeaway order
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [tempItems, setTempItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQty, setItemQty] = useState(1);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/takeaway");
      setOrders(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addTempItem = () => {
    if (!itemName || itemQty <= 0) return;
    setTempItems((p) => [...p, { name: itemName, qty: Number(itemQty) }]);
    setItemName("");
    setItemQty(1);
  };

  const calculateTotal = (items) => {
    return items.reduce(
      (sum, it) => sum + (it.price || 100) * (it.qty || 1),
      0
    );
  };

  const createTakeawayOrder = () => {
    if (!customerName || tempItems.length === 0) return;
    const newOrder = {
      id: `TO-${Date.now()}`,
      customerName,
      items: tempItems,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    setOrders((p) => [newOrder, ...p]);
    setCustomerName("");
    setTempItems([]);
    setItemName("");
    setItemQty(1);
    setShowModal(false);
  };

  const completeTakeawayOrder = (order) => {
    const total = calculateTotal(order.items);
    const bill = {
      id: `B-${Date.now()}`,
      orderId: order.id,
      customerName: order.customerName,
      items: order.items,
      total,
      createdAt: new Date().toISOString(),
    };
    setBills((p) => [bill, ...p]);
    // Update order status to Completed instead of removing it
    setOrders((p) =>
      p.map((o) => (o.id === order.id ? { ...o, status: "Completed" } : o))
    );
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (filter === "pending") return o.status === "Pending";
    if (filter === "completed") return o.status === "Completed";
    return true;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            Takeaway Orders
          </h3>
          <p className="text-xs text-slate-500">
            Create and track takeaway orders from the waiter section.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition"
        >
          + New Takeaway
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
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
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === "completed"
              ? "bg-emerald-500 text-white"
              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          }`}
        >
          Completed ({orders.filter((o) => o.status === "Completed").length})
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-200">
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Items</th>
              <th className="px-3 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-slate-400"
                >
                  Loading orders...
                </td>
              </tr>
            )}
            {!loading && filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-slate-400"
                >
                  No {filter !== "all" ? filter : ""} orders found.
                </td>
              </tr>
            )}
            {!loading &&
              filteredOrders.map((o, index) => (
                <tr
                  key={o.id || index}
                  className={`border-b border-slate-100 transition ${
                    o.status === "Completed"
                      ? "bg-emerald-50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-3 py-2 text-slate-600 font-semibold">
                    {o.id}
                  </td>
                  <td className="px-3 py-2 text-slate-800">{o.customerName}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        o.status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {o.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-600 text-xs">
                    {o.items?.map((it) => it.name).join(", ") || "—"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => completeTakeawayOrder(o)}
                      disabled={o.status === "Completed"}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                        o.status === "Completed"
                          ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                          : "bg-amber-500 text-white hover:bg-amber-600"
                      }`}
                    >
                      {o.status === "Completed"
                        ? "✓ Completed"
                        : "Complete & Bill"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Bills section */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">
          Completed Bills
        </h4>
        {bills.length === 0 ? (
          <div className="text-xs text-slate-400">
            No bills yet. Complete orders to generate bills.
          </div>
        ) : (
          <div className="space-y-2">
            {bills.map((b) => (
              <div
                key={b.id}
                className="bg-emerald-50 rounded-lg border border-emerald-200 p-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="text-slate-700 font-medium">
                    {b.id} — {b.customerName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(b.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="mt-2 text-slate-600">
                  {b.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <div>{it.name}</div>
                      <div className="text-xs text-slate-500">x{it.qty}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-end border-t border-emerald-200 pt-2">
                  <div className="text-sm font-semibold text-emerald-700">
                    Total: ₹{b.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for taking takeaway order */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Create Takeaway Order</h3>
                <p className="text-xs text-slate-500">
                  Add customer name and items for takeaway.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-sm text-slate-500"
              >
                Close
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Customer Name
              </label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="e.g., John Doe"
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Item name
                </label>
                <input
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Qty
                </label>
                <input
                  type="number"
                  value={itemQty}
                  min={1}
                  onChange={(e) => setItemQty(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={addTempItem}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-sm"
              >
                Add Item
              </button>
              <button
                onClick={createTakeawayOrder}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm"
              >
                Create Order
              </button>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">
                Items in order
              </h4>
              {tempItems.length === 0 ? (
                <div className="text-xs text-slate-400">
                  No items added yet.
                </div>
              ) : (
                <div className="space-y-1 text-sm text-slate-600">
                  {tempItems.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-slate-50 rounded px-3 py-2"
                    >
                      <div>{it.name}</div>
                      <div className="text-xs text-slate-500">x{it.qty}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeawayOrders;
