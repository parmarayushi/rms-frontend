import { useState } from "react";

const ReportsBilling = () => {
  // Mock data: In a real app, this would come from Redux or API
  const [allBills, setAllBills] = useState([
    {
      id: "B-1701040000000",
      type: "dine-in",
      source: "Table T2",
      items: [
        { name: "Biryani", qty: 2 },
        { name: "Raita", qty: 1 },
      ],
      total: 450,
      createdAt: "2025-11-27 10:30:00",
    },
    {
      id: "B-1701040060000",
      type: "takeaway",
      source: "John Doe",
      items: [
        { name: "Dosa", qty: 3 },
        { name: "Sambar", qty: 2 },
      ],
      total: 300,
      createdAt: "2025-11-27 10:35:00",
    },
    {
      id: "B-1701040120000",
      type: "dine-in",
      source: "Table T5",
      items: [
        { name: "Idli", qty: 4 },
        { name: "Chutney", qty: 1 },
      ],
      total: 250,
      createdAt: "2025-11-27 10:40:00",
    },
    {
      id: "B-1701040180000",
      type: "takeaway",
      source: "Sarah Smith",
      items: [
        { name: "Naan", qty: 2 },
        { name: "Butter Chicken", qty: 2 },
      ],
      total: 600,
      createdAt: "2025-11-27 10:45:00",
    },
  ]);

  const [filter, setFilter] = useState("all"); // all, dine-in, takeaway
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBills = allBills.filter((bill) => {
    const matchesFilter = filter === "all" || bill.type === filter;
    const matchesSearch =
      bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = filteredBills.reduce((sum, bill) => sum + bill.total, 0);
  const dineInTotal = allBills
    .filter((b) => b.type === "dine-in")
    .reduce((sum, b) => sum + b.total, 0);
  const takeawayTotal = allBills
    .filter((b) => b.type === "takeaway")
    .reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Reports & Billing
        </h2>
        <p className="text-sm text-slate-500">
          View all bills, revenue summary, and order details.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
            Total Revenue
          </div>
          <div className="text-2xl font-bold text-slate-800">
            ₹{allBills.reduce((sum, b) => sum + b.total, 0)}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {allBills.length} bills
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
            Dine-in Revenue
          </div>
          <div className="text-2xl font-bold text-rose-600">₹{dineInTotal}</div>
          <div className="text-xs text-slate-400 mt-2">
            {allBills.filter((b) => b.type === "dine-in").length} orders
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
            Takeaway Revenue
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            ₹{takeawayTotal}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {allBills.filter((b) => b.type === "takeaway").length} orders
          </div>
        </div>
      </div>

      {/* Filter and search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All ({allBills.length})
            </button>
            <button
              onClick={() => setFilter("dine-in")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === "dine-in"
                  ? "bg-rose-500 text-white"
                  : "bg-rose-100 text-rose-700 hover:bg-rose-200"
              }`}
            >
              Dine-in ({allBills.filter((b) => b.type === "dine-in").length})
            </button>
            <button
              onClick={() => setFilter("takeaway")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === "takeaway"
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              }`}
            >
              Takeaway ({allBills.filter((b) => b.type === "takeaway").length})
            </button>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID or name..."
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Bills table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-200">
              <th className="px-3 py-3 text-left">Bill ID</th>
              <th className="px-3 py-3 text-left">Type</th>
              <th className="px-3 py-3 text-left">Source</th>
              <th className="px-3 py-3 text-left">Items</th>
              <th className="px-3 py-3 text-right">Amount</th>
              <th className="px-3 py-3 text-left">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-4 text-center text-slate-400"
                >
                  No bills found.
                </td>
              </tr>
            ) : (
              filteredBills.map((bill) => (
                <tr
                  key={bill.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-3 py-3 text-slate-700 font-medium">
                    {bill.id}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bill.type === "dine-in"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {bill.type === "dine-in" ? "Dine-in" : "Takeaway"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-700">{bill.source}</td>
                  <td className="px-3 py-3 text-slate-600">
                    <div className="text-xs">
                      {bill.items.map((item, idx) => (
                        <div key={idx}>
                          {item.name} (x{item.qty})
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-slate-800">
                    ₹{bill.total}
                  </td>
                  <td className="px-3 py-3 text-slate-500 text-xs">
                    {bill.createdAt}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Summary footer */}
        {filteredBills.length > 0 && (
          <div className="border-t border-slate-200 mt-4 pt-4 flex items-center justify-end">
            <div className="text-sm">
              <span className="text-slate-600">Total for filtered bills: </span>
              <span className="text-lg font-bold text-slate-800">
                ₹{totalRevenue}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsBilling;
