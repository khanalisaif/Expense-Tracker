const CAT_MAP = {
  Food:     { emoji: "🍔", color: "#FF6B6B", bg: "rgba(255,107,107,0.15)" },
  Travel:   { emoji: "✈️",  color: "#4ECDC4", bg: "rgba(78,205,196,0.15)"  },
  Shopping: { emoji: "🛍️", color: "#FFE66D", bg: "rgba(255,230,109,0.15)" },
  Bills:    { emoji: "🧾", color: "#A29BFE", bg: "rgba(162,155,254,0.15)" },
  Health:   { emoji: "💊", color: "#55EFC4", bg: "rgba(85,239,196,0.15)"  },
  Other:    { emoji: "📦", color: "#FD79A8", bg: "rgba(253,121,168,0.15)" },
};

const getCat = (name) => CAT_MAP[name] || CAT_MAP.Other;

const formatINR = (n) => "₹" + Number(n).toLocaleString("en-IN");

const formatDateTime = (d) =>
  new Date(d).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });

const daysLeft = (expiresAt) => {
  const diff = new Date(expiresAt) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const ExpenseRow = ({ exp, onDelete, isDark }) => {
  const cat = getCat(exp.category);
  const days = daysLeft(exp.expiresAt);

  return (
    <div className={`group flex items-center gap-3 border rounded-2xl px-4 py-3.5 transition-all duration-200 theme-transition ${
      isDark
        ? "bg-[#13131a] border-[#1e1e2e] hover:border-[#2e2e3e] hover:translate-x-0.5"
        : "bg-white border-[#e2e4ea] hover:border-[#ccc] hover:shadow-md hover:translate-x-0.5"
    }`}>
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: cat.bg }}
      >
        {cat.emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate">{exp.name}</p>
        {exp.note && <p className={`text-xs truncate mt-0.5 ${isDark ? "text-[#444]" : "text-[#999]"}`}>{exp.note}</p>}
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: cat.bg, color: cat.color }}
          >
            {exp.category}
          </span>
          <span className={`text-xs ${isDark ? "text-[#555]" : "text-[#999]"}`}>{formatDateTime(exp.date)}</span>
          {/* Expiry badge */}
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: days <= 3 ? "rgba(255,107,107,0.15)" : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
              color: days <= 3 ? "#FF6B6B" : isDark ? "#444" : "#bbb",
            }}
          >
            🗑 {days}d left
          </span>
        </div>
      </div>

      {/* Amount */}
      <p className="font-extrabold text-base shrink-0" style={{ fontFamily: "'Syne',sans-serif" }}>
        {formatINR(exp.amount)}
      </p>

      {/* Delete */}
      <button
        onClick={() => onDelete(exp._id)}
        className={`ml-1 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 shrink-0 border-none cursor-pointer ${
          isDark
            ? "text-[#333] hover:text-[#FF6B6B] hover:bg-[rgba(255,107,107,0.1)]"
            : "text-[#ccc] hover:text-[#FF6B6B] hover:bg-[rgba(255,107,107,0.08)]"
        }`}
      >
        🗑
      </button>
    </div>
  );
};

export default ExpenseRow;
