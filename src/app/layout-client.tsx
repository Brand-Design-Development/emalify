"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Users,
  PieChart,
  RefreshCw,
  LogOut,
  Loader2,
} from "lucide-react";
import { cn } from "@emalify/lib/utils";
import Image from "next/image";
import { api } from "@emalify/trpc/react";

type ClientLayoutProps = {
  children: React.ReactNode;
};

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: PieChart,
  },
  {
    name: "Leads",
    href: "/leads",
    icon: Users,
  },
];

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const utils = api.useUtils();
  const [isrefreshing, setIsrefreshing] = useState(false);

  const logoutMutation = api.auth.logout.useMutation({
    onSuccess: () => {
      setShowLogoutModal(false);
      router.push("/login");
      router.refresh();
    },
  });

  const handlerefresh = async () => {
    setIsrefreshing(true);
    await utils.invalidate();
    setTimeout(() => setIsrefreshing(false), 500);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logoutMutation.mutate();
  };

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

  // If on login page, just render children without the layout
  if (pathname === "/login") {
    return <>{children}</>;
  }

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
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu */}
            <button
              id="hamburger"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-blue-800/40"
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

          <div className="flex items-center gap-2">
            {/* refresh Button */}
            <button
              onClick={handlerefresh}
              disabled={isrefreshing}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors hover:bg-blue-800/40 disabled:cursor-not-allowed disabled:opacity-50"
              title="Refresh all data"
            >
              <RefreshCw
                className={cn("h-5 w-5", isrefreshing && "animate-spin")}
              />
              <span className="text-sm font-medium">Refresh</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors hover:bg-blue-800/40"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
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

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Confirm Logout
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={logoutMutation.isPending}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                disabled={logoutMutation.isPending}
                className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: "#0e75bc" }}
              >
                {logoutMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Logging out...
                  </span>
                ) : (
                  "Log out"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
