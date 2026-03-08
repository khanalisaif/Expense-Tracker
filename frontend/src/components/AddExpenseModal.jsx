import { useState } from "react";

const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Health", "Other"];

const CAT_EMOJI = {
  Food: "🍔", Travel: "✈️", Shopping: "🛍️",
  Bills: "🧾", Health: "💊", Other: "📦",
};

// Format current datetime for datetime-local input
const getNow = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
};

const AddExpenseModal = ({ onClose, onAdd, loading, isDark }) => {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "Food",
    note: "",
    dateMode: "auto",       // "auto" = current datetime | "manual" = user picks
    manualDate: getNow(),   // default = now (shown when manual)
  });
  const [error, setError] = useState("");

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = () => {
    if (!form.name.trim()) { setError("Please enter an expense name"); return; }
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setError("Please enter a valid amount"); return;
    }
    const payload = {
      name: form.name.trim(),
      amount: Number(form.amount),
      category: form.category,
      note: form.note,
      date: form.dateMode === "manual" ? form.manualDate : undefined,
    };
    onAdd(payload);
  };

  const inputCls = `w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors border ${
    isDark
      ? "bg-[#0d0d14] border-[#2a2a3a] focus:border-[#FF6B6B] text-white placeholder:text-[#333]"
      : "bg-[#f5f6fa] border-[#ddd] focus:border-[#FF6B6B] text-[#1a1a2e] placeholder:text-[#bbb]"
  }`;

  const labelCls = `block text-[11px] font-bold uppercase tracking-widest mb-2 ${isDark ? "text-[#555]" : "text-[#999]"}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: isDark ? "rgba(0,0,0,0.78)" : "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`w-full max-w-md rounded-3xl p-7 border theme-transition ${
          isDark ? "bg-[#13131a] border-[#2a2a3a]" : "bg-white border-[#e2e4ea] shadow-2xl"
        }`}
        style={{ animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(50px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-extrabold" style={{ fontFamily: "'Syne',sans-serif" }}>
            Add Expense
          </h2>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer transition-colors ${
              isDark
                ? "bg-[#1e1e2e] text-[#888] hover:text-white"
                : "bg-[#f0f0f5] text-[#999] hover:text-[#333]"
            }`}
          >✕</button>
        </div>

        <div className="flex flex-col gap-4">

          {/* Name */}
          <div>
            <label className={labelCls}>Expense Name</label>
            <input
              className={inputCls}
              placeholder="e.g. Zomato, Movie tickets..."
              value={form.name}
              onChange={(e) => { set("name", e.target.value); setError(""); }}
            />
          </div>

          {/* Amount */}
          <div>
            <label className={labelCls}>Amount (₹)</label>
            <input
              className={inputCls}
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => { set("amount", e.target.value); setError(""); }}
            />
          </div>

          {/* Category */}
          <div>
            <label className={labelCls}>Category</label>
            <select
              className={`${inputCls} cursor-pointer`}
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CAT_EMOJI[c]} {c}</option>
              ))}
            </select>
          </div>

          {/* ── DATE MODE ── */}
          <div>
            <label className={labelCls}>Date & Time</label>

            {/* Toggle buttons */}
            <div className="flex gap-2 mb-3">
              {["auto", "manual"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => set("dateMode", mode)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 cursor-pointer"
                  style={{
                    background: form.dateMode === mode ? "rgba(255,107,107,0.15)" : isDark ? "#0d0d14" : "#f5f6fa",
                    borderColor: form.dateMode === mode ? "#FF6B6B" : isDark ? "#2a2a3a" : "#ddd",
                    color: form.dateMode === mode ? "#FF6B6B" : isDark ? "#666" : "#999",
                  }}
                >
                  {mode === "auto" ? "⚡ Current Date & Time" : "📅 Choose Manually"}
                </button>
              ))}
            </div>

            {/* Auto info pill */}
            {form.dateMode === "auto" && (
              <div className={`flex items-center gap-2 rounded-xl px-4 py-3 border ${
                isDark ? "bg-[#0d0d14] border-[#2a2a3a]" : "bg-[#f5f6fa] border-[#ddd]"
              }`}>
                <span className="text-green-400 text-xs">●</span>
                <span className={`text-sm ${isDark ? "text-[#666]" : "text-[#999]"}`}>
                  Will use <span className={`font-semibold ${isDark ? "text-white" : "text-[#1a1a2e]"}`}>current date & time</span> automatically
                </span>
              </div>
            )}

            {/* Manual datetime picker */}
            {form.dateMode === "manual" && (
              <input
                className={inputCls}
                type="datetime-local"
                value={form.manualDate}
                style={{ colorScheme: isDark ? "dark" : "light" }}
                onChange={(e) => set("manualDate", e.target.value)}
              />
            )}
          </div>

          {/* Note (optional) */}
          <div>
            <label className={labelCls}>Note (Optional)</label>
            <input
              className={inputCls}
              placeholder="Any extra details..."
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
            />
          </div>

          {/* Error */}
          {error && <p className="text-[#FF6B6B] text-xs font-semibold">{error}</p>}

          {/* Submit */}
          <button
            className="mt-1 w-full py-4 rounded-2xl font-bold text-base text-black cursor-pointer border-none transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #FF6B6B, #FFE66D)",
              fontFamily: "'Syne',sans-serif",
              boxShadow: "0 4px 20px rgba(255,107,107,0.3)",
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Expense →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;
