import { useState } from "react";

const initialQueue = [
  { id: 1, name: "Sharma Family", size: 4, status: "waiting" },
  { id: 2, name: "Office Group", size: 6, status: "waiting" },
  { id: 3, name: "Couple", size: 2, status: "waiting" },
];

const TableManagerDashboard = () => {
  const [queue, setQueue] = useState(initialQueue);
  const [name, setName] = useState("");
  const [size, setSize] = useState("");

  const addToQueue = (e) => {
    e.preventDefault();
    if (!name || !size) return;
    const newEntry = {
      id: Date.now(),
      name,
      size: Number(size),
      status: "waiting",
    };
    setQueue((prev) => [...prev, newEntry]);
    setName("");
    setSize("");
  };

  const markCalled = (id) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "called" } : q))
    );
  };

  const markSeated = (id) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
  };

  const nextWaiting = queue.find((q) => q.status === "waiting");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Table Manager – Queue
        </h2>
        <p className="text-sm text-slate-500">
          Manage waiting customers, call names on display and assign tables.
        </p>
      </div>

      {/* Add to queue form */}
      <form
        onSubmit={addToQueue}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Party name
          </label>
          <input
            type="text"
            value={name}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Verma Family"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Size
          </label>
          <input
            type="number"
            value={size}
            className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            onChange={(e) => setSize(e.target.value)}
            placeholder="4"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition"
          >
            Add to Queue
          </button>
        </div>
      </form>

      {/* Queue list */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-800">
            Waiting Queue
          </h3>
          {nextWaiting ? (
            <div className="text-xs px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
              Next: <span className="font-semibold">{nextWaiting.name}</span> (
              {nextWaiting.size})
            </div>
          ) : (
            <div className="text-xs px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-500">
              No waiting parties
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-200">
                <th className="px-3 py-2 text-left">#</th>
                <th className="px-3 py-2 text-left">Party</th>
                <th className="px-3 py-2 text-left">Size</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {queue.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-slate-400"
                  >
                    Queue is empty.
                  </td>
                </tr>
              )}
              {queue.map((entry, idx) => (
                <tr
                  key={entry.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-3 py-2 text-slate-500">{idx + 1}</td>
                  <td className="px-3 py-2 text-slate-800">{entry.name}</td>
                  <td className="px-3 py-2 text-slate-700">{entry.size}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        entry.status === "waiting"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-sky-50 text-sky-700 border border-sky-200"
                      }`}
                    >
                      {entry.status === "waiting" ? "Waiting" : "Called"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex gap-2">
                      {entry.status === "waiting" && (
                        <button
                          onClick={() => markCalled(entry.id)}
                          className="text-xs px-2.5 py-1 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition"
                        >
                          Call
                        </button>
                      )}
                      <button
                        onClick={() => markSeated(entry.id)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
                      >
                        Mark Seated
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableManagerDashboard;
