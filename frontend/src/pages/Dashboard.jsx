const CATEGORIES = [
  { name: "Food",     emoji: "🍔", color: "#FF6B6B", bg: "rgba(255,107,107,0.15)" },
  { name: "Travel",   emoji: "✈️",  color: "#4ECDC4", bg: "rgba(78,205,196,0.15)"  },
  { name: "Shopping", emoji: "🛍️", color: "#FFE66D", bg: "rgba(255,230,109,0.15)" },
  { name: "Bills",    emoji: "🧾", color: "#A29BFE", bg: "rgba(162,155,254,0.15)" },
  { name: "Health",   emoji: "💊", color: "#55EFC4", bg: "rgba(85,239,196,0.15)"  },
  { name: "Other",    emoji: "📦", color: "#FD79A8", bg: "rgba(253,121,168,0.15)" },
];

const getCat = (name) => CATEGORIES.find((c) => c.name === name) || CATEGORIES[5];
const formatINR = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

const Dashboard = ({ summary, loading, isDark }) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`rounded-2xl h-24 animate-pulse border ${
              isDark ? "bg-[#13131a] border-[#1e1e2e]" : "bg-white border-[#e2e4ea]"
            }`}
          />
        ))}
      </div>
    );
  }

  const { total = 0, count = 0, avg = 0, topCategory = "—", categoryBreakdown = {} } = summary || {};
  const maxVal = Math.max(...Object.values(categoryBreakdown), 1);

  return (
    <div className="flex flex-col gap-4">

      {/* Hero card */}
      <div
        className="rounded-2xl p-7 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)" }}
      >
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 right-8 w-20 h-20 rounded-full bg-white/[0.07]" />
        <p className="text-[11px] font-bold text-black/50 uppercase tracking-[2px] mb-1">Total Spent</p>
        <p className="text-4xl sm:text-5xl font-extrabold text-black leading-none mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>
          {formatINR(total)}
        </p>
        <p className="text-sm text-black/50 font-medium">
          {count} transactions · Top: {topCategory}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? "bg-[#13131a] border-[#1e1e2e]" : "bg-white border-[#e2e4ea] shadow-sm"
        }`}>
          <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${isDark ? "text-[#555]" : "text-[#999]"}`}>Avg / Transaction</p>
          <p className="text-xl sm:text-2xl font-extrabold" style={{ fontFamily: "'Syne',sans-serif" }}>{formatINR(avg)}</p>
        </div>
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? "bg-[#13131a] border-[#1e1e2e]" : "bg-white border-[#e2e4ea] shadow-sm"
        }`}>
          <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${isDark ? "text-[#555]" : "text-[#999]"}`}>Top Category</p>
          <p className="text-xl sm:text-2xl font-extrabold" style={{ fontFamily: "'Syne',sans-serif" }}>
            {getCat(topCategory).emoji} {topCategory}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className={`rounded-2xl p-5 border theme-transition ${
        isDark ? "bg-[#13131a] border-[#1e1e2e]" : "bg-white border-[#e2e4ea] shadow-sm"
      }`}>
        <p className={`text-[11px] font-bold uppercase tracking-widest mb-5 ${isDark ? "text-[#555]" : "text-[#999]"}`}>Category Breakdown</p>
        <div className="flex flex-col gap-4">
          {CATEGORIES.map((cat) => {
            const val = categoryBreakdown[cat.name] || 0;
            const pct = (val / maxVal) * 100;
            return (
              <div key={cat.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.emoji}</span>
                    <span className="text-sm font-semibold">{cat.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: cat.color }}>{formatINR(val)}</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-[#1e1e2e]" : "bg-[#eef0f5]"}`}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg,${cat.color}66,${cat.color})` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
