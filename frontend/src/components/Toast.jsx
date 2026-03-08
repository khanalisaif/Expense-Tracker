const Toast = ({ message, isDark }) => (
  <div
    className={`fixed bottom-8 left-1/2 -translate-x-1/2 text-sm font-semibold px-6 py-3 rounded-2xl z-[200] whitespace-nowrap shadow-2xl border ${
      isDark
        ? "bg-[#1e1e2e] border-[#333] text-white"
        : "bg-white border-[#e2e4ea] text-[#1a1a2e] shadow-lg"
    }`}
    style={{ animation: "toastIn 0.3s ease both" }}
  >
    <style>{`@keyframes toastIn{from{opacity:0;transform:translate(-50%,20px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
    {message}
  </div>
);

export default Toast;
