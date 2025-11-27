import { useState } from "react";

/**
 *  Status legend:
 *  - available: green
 *  - occupied: red
 */
const initialTables = [
  { id: 1, name: "T1", status: "available" },
  { id: 2, name: "T2", status: "occupied" },
  { id: 3, name: "T3", status: "available" },
  { id: 4, name: "T4", status: "available" },
  { id: 5, name: "T5", status: "available" },
  { id: 6, name: "T6", status: "occupied" },
  { id: 7, name: "T7", status: "available" },
  { id: 8, name: "T8", status: "available" },
];

const statusConfig = {
  available: {
    label: "Available",
    bg: "bg-emerald-100",
    border: "border-emerald-400",
    text: "text-emerald-700",
    pillBg: "bg-emerald-500",
  },
  occupied: {
    label: "Occupied",
    bg: "bg-rose-100",
    border: "border-rose-400",
    text: "text-rose-700",
    pillBg: "bg-rose-500",
  },
};

const TableGrid = () => {
  const [tables, setTables] = useState(initialTables);
  // orders stored locally: { id, tableId, items: [{name, qty}], createdAt }
  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]);

  const [activeTable, setActiveTable] = useState(null); // table object when modal open
  const [tempItems, setTempItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQty, setItemQty] = useState(1);

  const cycleStatus = (current) => {
    if (current === "available") return "occupied";
    return "available";
  };

  const toggleStatus = (id) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: cycleStatus(t.status) } : t
      )
    );
  };

  // Open order modal for table
  const openTable = (table) => {
    setActiveTable(table);
    setTempItems([]);
    setItemName("");
    setItemQty(1);
  };

  const closeModal = () => {
    setActiveTable(null);
  };

  const addTempItem = () => {
    if (!itemName || itemQty <= 0) return;
    setTempItems((p) => [...p, { name: itemName, qty: Number(itemQty) }]);
    setItemName("");
    setItemQty(1);
  };

  const createOrder = () => {
    if (!activeTable || tempItems.length === 0) return;
    const newOrder = {
      id: `O-${Date.now()}`,
      tableId: activeTable.id,
      items: tempItems,
      createdAt: new Date().toISOString(),
    };
    setOrders((p) => [newOrder, ...p]);
    // mark table occupied
    setTables((prev) =>
      prev.map((t) =>
        t.id === activeTable.id ? { ...t, status: "occupied" } : t
      )
    );
    closeModal();
  };

  const calculateTotal = (items) => {
    // If item has price use it, otherwise default to 100 per item
    return items.reduce(
      (sum, it) => sum + (it.price || 100) * (it.qty || 1),
      0
    );
  };

  const createBillFromOrders = (orderList, tableId) => {
    if (!orderList || orderList.length === 0) return null;
    const combinedItems = [];
    orderList.forEach((o) => {
      o.items.forEach((it) => combinedItems.push(it));
    });
    const total = calculateTotal(combinedItems);
    const bill = {
      id: `B-${Date.now()}`,
      tableId,
      items: combinedItems,
      total,
      createdAt: new Date().toISOString(),
    };
    setBills((p) => [bill, ...p]);
    return bill;
  };

  const completeOrderForTable = (table) => {
    // If there are tempItems (not yet created), create an order then bill it
    if (activeTable && activeTable.id === table.id && tempItems.length > 0) {
      const newOrder = {
        id: `O-${Date.now()}`,
        tableId: activeTable.id,
        items: tempItems,
        createdAt: new Date().toISOString(),
      };
      // create bill from this new order
      const bill = createBillFromOrders([newOrder], table.id);
      // persist order list (optional) and mark table available
      setOrders((p) => [newOrder, ...p]);
      setTables((prev) =>
        prev.map((t) => (t.id === table.id ? { ...t, status: "available" } : t))
      );
      // clear temp and close
      setTempItems([]);
      closeModal();
      return bill;
    }

    // Otherwise combine all existing orders for the table into one bill
    const tableOrders = ordersForTable(table.id);
    if (tableOrders.length === 0) return null;
    const bill = createBillFromOrders(tableOrders, table.id);
    // remove those orders from orders list
    setOrders((p) => p.filter((o) => o.tableId !== table.id));
    // mark table available
    setTables((prev) =>
      prev.map((t) => (t.id === table.id ? { ...t, status: "available" } : t))
    );
    // if modal open for this table, close it
    if (activeTable && activeTable.id === table.id) closeModal();
    return bill;
  };

  const ordersForTable = (tableId) =>
    orders.filter((o) => o.tableId === tableId);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            Table Layout
          </h3>
          <p className="text-xs text-slate-500">
            Click a table to take an order for that table.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Available
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Occupied
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tables.map((table) => {
          const status = statusConfig[table.status];
          const count = ordersForTable(table.id).length;
          return (
            <div key={table.id} className="relative">
              <button
                onClick={() => openTable(table)}
                className={`w-full relative flex flex-col items-center justify-center rounded-2xl border-2 ${status.bg} ${status.border} ${status.text} py-5 shadow-sm hover:shadow-md transition`}
              >
                <span className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Table
                </span>
                <span className="text-2xl font-bold">{table.name}</span>
                <span
                  className={`mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-white ${status.pillBg}`}
                >
                  {status.label}
                </span>
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">
                    {count}
                  </span>
                )}
              </button>

              <button
                onClick={() => toggleStatus(table.id)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border text-xs flex items-center justify-center shadow-sm"
                title="Cycle status"
              >
                ↺
              </button>
            </div>
          );
        })}
      </div>

      {/* Orders list (recent) */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">
          Recent Orders
        </h4>
        {orders.length === 0 ? (
          <div className="text-xs text-slate-400">
            No orders yet. Click a table to start taking orders.
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-slate-50 rounded-lg border border-slate-100 p-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="text-slate-700 font-medium">
                    {o.id} — Table {`T${o.tableId}`}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="mt-2 text-slate-600">
                  {o.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <div>{it.name}</div>
                      <div className="text-xs text-slate-500">x{it.qty}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for taking order */}
      {activeTable && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Take Order — {activeTable.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Add items and create order for this table.
                </p>
              </div>
              <button onClick={closeModal} className="text-sm text-slate-500">
                Close
              </button>
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
                onClick={createOrder}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm"
              >
                Create Order
              </button>
              <button
                onClick={() => completeOrderForTable(activeTable)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm"
              >
                Complete Order & Bill
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
                    {b.id} — Table {`T${b.tableId}`}
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
    </div>
  );
};

export default TableGrid;
