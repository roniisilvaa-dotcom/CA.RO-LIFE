import { UserProfile } from "../types";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  profile: UserProfile;
  onSwitchProfileClick: () => void;
  coupleProgressText: string;
}

export default function Sidebar({
  activeView,
  setActiveView,
  profile,
  onSwitchProfileClick,
  coupleProgressText,
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Início", icon: "⌂" },
    { id: "activity", label: "Caminhada", icon: "↗" },
    { id: "workout", label: "Meus treinos", icon: "◫" },
    { id: "routine", label: "Minha rotina", icon: "◷" },
    { id: "evolution", label: "Evolução", icon: "⌁" },
    { id: "couple", label: "Nossa evolução", icon: "♥" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col border-r border-white/5 p-6 sticky top-0 h-screen bg-[#0a0c0b]/88 backdrop-blur-xl z-10 w-[280px] shrink-0 justify-between">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#c7ff4a] to-[#8ce600] flex items-center justify-center text-[#0b0d0c] font-black text-lg shadow-[0_4px_20px_rgba(199,255,74,0.15)] font-display">
              CL
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-[0.12em] text-white uppercase font-display leading-none">
                CA.RO LIFE
              </h1>
              <span className="text-[10px] text-[#9ca39d] tracking-[0.08em] font-medium block mt-1 uppercase">
                PERFORMANCE SYSTEM
              </span>
            </div>
          </div>

          {/* Active Profile Indicator */}
          <div
            onClick={onSwitchProfileClick}
            className="flex items-center gap-3 p-3.5 bg-gradient-to-b from-[#171b18] to-[#121513] border border-white/5 rounded-2xl cursor-pointer hover:border-[#c7ff4a]/30 transition-all mb-6 group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#252b26] flex items-center justify-center text-[#c7ff4a] font-extrabold text-base border border-[#c7ff4a]/10 group-hover:scale-105 transition-all">
              {profile.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-xs text-[#9ca39d] leading-none mb-1">
                {profile.type}
              </span>
              <b className="block text-sm text-white font-semibold truncate leading-none">
                {profile.name}
              </b>
            </div>
            <div className="text-[#9ca39d] text-xs font-mono group-hover:text-[#c7ff4a] transition-all">
              ⇄
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-4.5 px-4 py-3.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer group ${
                    isActive
                      ? "bg-[#181d19] text-white border-l-2 border-[#c7ff4a]"
                      : "text-[#9ca39d] hover:bg-[#181d19]/40 hover:text-white"
                  }`}
                >
                  <span
                    className={`text-lg font-bold w-5 text-center transition-all ${
                      isActive ? "text-[#c7ff4a]" : "text-[#9ca39d] group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Aside Couple Progress Tracker */}
        <div className="couple-card border border-white/5 rounded-2xl p-4 bg-gradient-to-tr from-[#c7ff4a]/5 to-white/[0.01] mt-auto">
          <strong className="block text-white text-xs font-semibold uppercase tracking-wider mb-2 font-display">
            Meta do casal
          </strong>
          <p className="text-[#9ca39d] text-[11.5px] leading-relaxed font-sans">
            {coupleProgressText}
          </p>
        </div>
      </aside>

      {/* Mobile Navigation Bar */}
      <aside className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-white/5 bg-[#0a0c0b]/90 backdrop-blur-md py-2 px-3 z-30 flex justify-around items-center">
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all min-w-[55px] cursor-pointer ${
                isActive ? "text-[#c7ff4a]" : "text-[#9ca39d]"
              }`}
            >
              <span className="text-xl leading-none mb-1 font-bold">{item.icon}</span>
              <span className="text-[9px] font-medium uppercase tracking-wide truncate max-w-[58px]">
                {item.label.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </aside>
    </>
  );
}
