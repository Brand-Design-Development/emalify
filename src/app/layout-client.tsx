"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard, Users } from "lucide-react";
import { cn } from "@emalify/lib/utils";
import Image from "next/image";

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
    <div
      className="flex h-screen flex-col"
      style={{ backgroundColor: "#0e75bc" }}
    >
      {/* Top Header Bar - Full Width */}
      <header
        className="flex h-16 items-center px-4"
        style={{ backgroundColor: "#0e75bc" }}
      >
        <div className="flex items-center gap-3">
          {/* Hamburger Menu */}
          <button
            id="hamburger"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-blue-700"
          >
            <Menu className="h-5 w-5 text-white" />
          </button>

          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Emalify Logo"
              width={140}
              height={140}
            />
            <p className="text-lg font-semibold text-white">
              Lead Management System
            </p>
          </Link>
        </div>
      </header>

      {/* Main Container with Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Icon Sidebar - Always Visible */}
        <aside
          id="sidebar"
          className={cn(
            "relative flex flex-col transition-all duration-300",
            sidebarExpanded ? "w-64" : "w-16",
          )}
          style={{ backgroundColor: "#0e75bc" }}
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
                      ? "text-white"
                      : "text-blue-100 hover:bg-blue-800/40",
                  )}
                  style={
                    active
                      ? { backgroundColor: "rgba(255, 255, 255, 0.15)" }
                      : {}
                  }
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      active ? "text-white" : "text-blue-100",
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
        <main className="flex-1 overflow-auto bg-white">{children}</main>
      </div>
    </div>
  );
}
