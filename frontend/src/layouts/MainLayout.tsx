import React from "react";
import { Link, Outlet } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/bugs", label: "Bug List" },
  { to: "/report", label: "Report Bug" },
  { to: "/analytics", label: "Analytics" },
  { to: "/ai", label: "AI Playground" },
  { to: "/settings", label: "Settings" },
];

export default function MainLayout() {
  return (
    <div className="min-h-screen flex transition-all duration-300 
                    bg-white text-black 
                    dark:bg-[#0f1117] dark:text-white">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-[#161b22] shadow flex flex-col transition-all">
        <div className="p-4 font-bold text-xl">BugSage</div>

        <nav className="flex-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block px-4 py-2 hover:bg-gray-200 
               dark:hover:bg-gray-700 transition-all"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <ThemeSwitcher />
        </div>
      </aside>

      {/* PAGE CONTENT */}
      <main className="flex-1 p-8 bg-white dark:bg-[#0d1117] transition-all">
        <Outlet />
      </main>
    </div>
  );
}
