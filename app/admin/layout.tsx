"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return children;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const menuItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/gestures", label: "Gestures" },
    { href: "/admin/gestures/new", label: "Add Gesture" },
    { href: "/admin/upload", label: "Bulk Upload" },
    { href: "/admin/analytics", label: "Analytics" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-slate-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-700 p-4">
          {isSidebarOpen && <h1 className="text-xl font-bold">Ananta CMS</h1>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded p-1 hover:bg-slate-700"
          >
            {isSidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
                title={!isSidebarOpen ? item.label : ""}
              >
                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="border-t border-slate-700 w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700 transition-all"
        >
          {isSidebarOpen ? "Logout" : "—"}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="border-b border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            {menuItems.find((item) => item.href === pathname)?.label ||
              "Admin"}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
