import { useState, useEffect, useCallback } from "react";
import { useTheme } from "./context/ThemeContext.jsx";
import { fetchExpenses, fetchSummary, addExpense, deleteExpense } from "./api/expenses.js";
import AddExpenseModal from "./components/AddExpenseModal.jsx";
import Toast from "./components/Toast.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ExpensesList from "./pages/ExpensesList.jsx";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab,  setActiveTab]  = useState("dashboard");
  const [expenses,   setExpenses]   = useState([]);
  const [summary,    setSummary]    = useState(null);
  const [filterCat,  setFilterCat]  = useState("All");
  const [showModal,  setShowModal]  = useState(false);
  const [toast,      setToast]      = useState(null);
  const [loadingExp, setLoadingExp] = useState(false);
  const [loadingSum, setLoadingSum] = useState(false);
  const [adding,     setAdding]     = useState(false);

  const isDark = theme === "dark";

  // ── Helpers ──────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // ── Fetch expenses ───────────────────────────────────
  const loadExpenses = useCallback(async () => {
    setLoadingExp(true);
    try {
      const res = await fetchExpenses(filterCat);
      setExpenses(res.data.data);
    } catch {
      showToast("❌ Could not load expenses");
    } finally {
      setLoadingExp(false);
    }
  }, [filterCat]);

  // ── Fetch summary ────────────────────────────────────
  const loadSummary = async () => {
    setLoadingSum(true);
    try {
      const res = await fetchSummary();
      setSummary(res.data.data);
    } catch {
      showToast("❌ Could not load summary");
    } finally {
      setLoadingSum(false);
    }
  };

  useEffect(() => { loadExpenses(); }, [loadExpenses]);
  useEffect(() => { loadSummary();  }, []);

  // ── Add expense ──────────────────────────────────────
  const handleAdd = async (payload) => {
    setAdding(true);
    try {
      await addExpense(payload);
      setShowModal(false);
      showToast("✅ Expense added!");
      await Promise.all([loadExpenses(), loadSummary()]);
    } catch (err) {
      showToast("❌ " + (err.response?.data?.message || "Something went wrong"));
    } finally {
      setAdding(false);
    }
  };

  // ── Delete expense ───────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      showToast("🗑️ Deleted!");
      await Promise.all([loadExpenses(), loadSummary()]);
    } catch {
      showToast("❌ Could not delete");
    }
  };

  return (
    <div
      className={`min-h-screen theme-transition ${isDark ? "bg-[#0a0a0f] text-white" : "bg-[#f5f6fa] text-[#1a1a2e]"}`}
      style={{ fontFamily: "'DM Sans',sans-serif" }}
    >

      {/* ── STICKY HEADER ── */}
      <div
        className={`sticky top-0 z-30 border-b theme-transition ${isDark ? "border-[#1a1a2a]" : "border-[#e2e4ea]"}`}
        style={{
          background: isDark ? "rgba(10,10,15,0.85)" : "rgba(245,246,250,0.85)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-0">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-[10px] font-bold text-[#FF6B6B] uppercase tracking-[3px] mb-1">💸 SpendSense</p>
              <h1
                className="text-2xl sm:text-3xl font-extrabold leading-none"
                style={{ fontFamily: "'Syne',sans-serif" }}
              >
                Expense Tracker
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border-none cursor-pointer transition-all duration-200 hover:scale-110 ${
                  isDark
                    ? "bg-[#1e1e2e] text-yellow-400 hover:bg-[#2a2a3a]"
                    : "bg-white text-[#555] hover:bg-[#e8e8f0] shadow-sm"
                }`}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? "☀️" : "🌙"}
              </button>
              {/* Add button */}
              <button
                className="text-black font-bold text-sm px-4 py-2.5 rounded-xl border-none cursor-pointer transition-all duration-150 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg,#FF6B6B,#FFE66D)",
                  boxShadow: "0 4px 16px rgba(255,107,107,0.35)",
                  fontFamily: "'Syne',sans-serif",
                }}
                onClick={() => setShowModal(true)}
              >
                + Add
              </button>
            </div>
          </div>

          {/* Tabs — mobile only */}
          <div className="flex gap-1 lg:hidden">
            {[["dashboard","📊 Dashboard"],["expenses","📋 Expenses"]].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-t-xl text-[13px] font-semibold transition-all duration-200 border-none cursor-pointer ${
                  activeTab === tab
                    ? isDark
                      ? "bg-[#13131a] text-white"
                      : "bg-white text-[#1a1a2e] shadow-sm"
                    : isDark
                      ? "bg-transparent text-[#444] hover:text-[#888]"
                      : "bg-transparent text-[#999] hover:text-[#555]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── AUTO-DELETE INFO BANNER ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3">
        <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 theme-transition border ${
          isDark ? "bg-[#13131a] border-[#1e1e2e]" : "bg-white border-[#e2e4ea] shadow-sm"
        }`}>
          <span className="text-[13px]">🗓️</span>
          <p className={`text-xs font-medium ${isDark ? "text-[#555]" : "text-[#888]"}`}>
            Expenses are <span className="text-[#A29BFE] font-semibold">automatically deleted after 30 days</span>
          </p>
        </div>
      </div>

      {/* ── PAGE CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 pb-24">
        {/* Desktop: side-by-side layout */}
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Dashboard */}
          <div className={`lg:col-span-2 ${activeTab === "dashboard" ? "block" : "hidden lg:block"}`}>
            <h2
              className={`hidden lg:flex items-center gap-2 text-lg font-extrabold mb-4 ${isDark ? "text-white" : "text-[#1a1a2e]"}`}
              style={{ fontFamily: "'Syne',sans-serif" }}
            >
              <span className="text-base">📊</span> Dashboard
            </h2>
            <Dashboard summary={summary} loading={loadingSum} isDark={isDark} />
          </div>
          {/* Expenses */}
          <div className={`lg:col-span-3 ${activeTab === "expenses" ? "block" : "hidden lg:block"}`}>
            <h2
              className={`hidden lg:flex items-center gap-2 text-lg font-extrabold mb-4 ${isDark ? "text-white" : "text-[#1a1a2e]"}`}
              style={{ fontFamily: "'Syne',sans-serif" }}
            >
              <span className="text-base">📋</span> Recent Expenses
            </h2>
            <ExpensesList
              expenses={expenses}
              loading={loadingExp}
              filterCat={filterCat}
              setFilterCat={setFilterCat}
              onDelete={handleDelete}
              isDark={isDark}
            />
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <AddExpenseModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
          loading={adding}
          isDark={isDark}
        />
      )}

      {/* ── TOAST ── */}
      {toast && <Toast message={toast} isDark={isDark} />}
    </div>
  );
}
