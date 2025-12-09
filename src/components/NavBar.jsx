import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiClock, FiCalendar } from "react-icons/fi";

export default function NavBar() {
  const icons = {
    home: <FiHome size={24} />,
    today: <FiClock size={24} />,
    stats: <FiCalendar size={24} />,
  };

  // 글래스모피즘 효과와 애니메이션 추가
  const glassStyle =
    "backdrop-blur-lg bg-gradient-to-r from-blue-600/60 to-indigo-600/60 shadow-xl border-b border-white/30 animate-fade-in";
  return (
    <nav
      className={`w-full flex items-center px-10 py-3 rounded-b-xl ${glassStyle}`}
    >
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-200 text-white hover:bg-blue-700/60 hover:scale-105 ${
            isActive ? "bg-blue-800/80 font-bold shadow-lg scale-105" : ""
          }`
        }
      >
        {icons.home}
        <span className="font-semibold tracking-wide">홈</span>
      </NavLink>
      <NavLink
        to="/today"
        className={({ isActive }) =>
          `flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-200 text-white hover:bg-blue-700/60 hover:scale-105 ${
            isActive ? "bg-blue-800/80 font-bold shadow-lg scale-105" : ""
          }`
        }
      >
        {icons.today}
        <span className="font-semibold tracking-wide">오늘</span>
      </NavLink>
      <NavLink
        to="/stats"
        className={({ isActive }) =>
          `flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-200 text-white hover:bg-blue-700/60 hover:scale-105 ${
            isActive ? "bg-blue-800/80 font-bold shadow-lg scale-105" : ""
          }`
        }
      >
        {icons.stats}
        <span className="font-semibold tracking-wide">복용현황</span>
      </NavLink>

      <button
        className="ml-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold border border-gray-300 hover:bg-gray-200 transition-all"
        onClick={() => {
          if (window.confirm("로그아웃 하시겠습니까?")) {
            localStorage.removeItem("current_user");
            window.location.reload();
          }
        }}
      >
        로그아웃
      </button>
    </nav>
  );
}
