"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard, Users } from "lucide-react";
import { cn } from "@emalify/lib/utils";

type ClientLayoutProps = {
  children: React.ReactNode;
};

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Leads",
    href: "/leads",
    icon: Users,
  },
];

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const pathname = usePathname();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const hamburger = document.getElementById("hamburger");

      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        hamburger &&
        !hamburger.contains(event.target as Node)
      ) {
        setSidebarExpanded(false);
      }
    };

    if (sidebarExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarExpanded]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Top Header Bar - Full Width */}
      <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu */}
          <button
            id="hamburger"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-red-500 p-2">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Emalify</span>
          </Link>
        </div>

        <p className="text-sm text-gray-600">Lead Management Dashboard</p>
      </header>

      {/* Main Container with Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Icon Sidebar - Always Visible */}
        <aside
          id="sidebar"
          className={cn(
            "relative flex flex-col border-r bg-white transition-all duration-300",
            sidebarExpanded ? "w-64" : "w-16",
          )}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
          {/* Sidebar Navigation */}
          <nav className="flex-1 space-y-1 p-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={!sidebarExpanded ? item.name : undefined}
                  className={cn(
                    "flex cursor-pointer items-center rounded-lg transition-all",
                    sidebarExpanded ? "px-3 py-2" : "justify-center p-3",
                    active
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      active ? "text-red-600" : "text-gray-500",
                    )}
                  />
                  <span
                    className={cn(
                      "ml-3 text-sm font-medium whitespace-nowrap transition-all duration-300",
                      !sidebarExpanded && "w-0 overflow-hidden opacity-0",
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
