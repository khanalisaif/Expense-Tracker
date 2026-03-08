import ExpenseRow from "../components/ExpenseRow.jsx";

const FILTERS = ["All", "Food", "Travel", "Shopping", "Bills", "Health", "Other"];
const CAT_EMOJI = { Food:"🍔",Travel:"✈️",Shopping:"🛍️",Bills:"🧾",Health:"💊",Other:"📦" };
const CAT_COLOR = { Food:"#FF6B6B",Travel:"#4ECDC4",Shopping:"#FFE66D",Bills:"#A29BFE",Health:"#55EFC4",Other:"#FD79A8" };
const CAT_BG    = { Food:"rgba(255,107,107,0.15)",Travel:"rgba(78,205,196,0.15)",Shopping:"rgba(255,230,109,0.15)",Bills:"rgba(162,155,254,0.15)",Health:"rgba(85,239,196,0.15)",Other:"rgba(253,121,168,0.15)" };

const ExpensesList = ({ expenses, loading, filterCat, setFilterCat, onDelete, onEdit, isDark }) => {
  return (
    <div className="flex flex-col gap-4">

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((cat) => {
          const active = filterCat === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className="shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap"
              style={{
                borderColor: active ? (CAT_COLOR[cat] || "#FF6B6B") : isDark ? "#222" : "#ddd",
                background:  active ? (CAT_BG[cat]    || "rgba(255,107,107,0.1)") : isDark ? "#13131a" : "#fff",
                color:       active ? (CAT_COLOR[cat] || "#FF6B6B") : isDark ? "#666" : "#999",
              }}
            >
              {cat !== "All" ? `${CAT_EMOJI[cat]} ` : ""}
              {cat}
            </button>
          );
        })}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="flex flex-col gap-2.5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`rounded-2xl h-20 animate-pulse border ${
                isDark ? "bg-[#13131a] border-[#1e1e2e]" : "bg-white border-[#e2e4ea]"
              }`}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && expenses.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🪹</p>
          <p className={`text-base font-bold ${isDark ? "text-[#444]" : "text-[#aaa]"}`}>No expenses here</p>
          <p className={`text-sm mt-1 ${isDark ? "text-[#333]" : "text-[#ccc]"}`}>Tap + Add to log one</p>
        </div>
      )}

      {/* Expense list */}
      {!loading && expenses.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {expenses.map((exp) => (
            <ExpenseRow key={exp._id} exp={exp} onDelete={onDelete} onEdit={onEdit} isDark={isDark} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpensesList;
